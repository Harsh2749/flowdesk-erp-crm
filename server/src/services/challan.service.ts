import { ChallanStatus, MovementType, Prisma, Product } from '@prisma/client';
import { prisma } from '../config/prisma';
import {
  challanRepository,
  ChallanListFilters,
  ChallanWithItems,
} from '../repositories/challan.repository';
import { customerRepository } from '../repositories/customer.repository';
import { inventoryRepository } from '../repositories/inventory.repository';
import { generateChallanNumber } from '../helpers/challanNumber.helper';
import { ChallanResponseDto, toChallanResponse } from '../dto/challan/challan.dto';
import { CreateChallanInput, UpdateChallanInput } from '../validators/challan.validator';
import { BadRequestError, ConflictError, NotFoundError } from '../errors/AppError';
import { PaginatedResult, buildPaginationMeta, toSkipTake } from '../interfaces/pagination.interface';

type Tx = Prisma.TransactionClient;

/**
 * Fetches every referenced product inside the transaction and returns them
 * keyed by id, throwing if any product id doesn't exist. Used both to build
 * snapshots and to validate stock availability.
 */
async function loadProductsOrThrow(
  tx: Tx,
  items: { productId: string; quantity: number }[]
) {
  const productIds = [...new Set(items.map((i) => i.productId))];
  const products: Product[] = await tx.product.findMany({ where: { id: { in: productIds } } });

  const byId = new Map<string, Product>(products.map((p): [string, Product] => [p.id, p]));
  for (const id of productIds) {
    if (!byId.has(id)) throw new NotFoundError(`Product ${id} not found`);
  }
  return byId;
}

/**
 * Reduces stock for every item, throwing BadRequestError (which rolls back
 * the transaction) the moment any product would go negative. Re-reads each
 * product's current stock from inside the transaction so concurrent
 * confirmations can't race each other into negative stock.
 */
async function reduceStockForItems(
  tx: Tx,
  items: { productId: string; quantity: number }[],
  challanNumber: string,
  createdById: string
) {
  for (const item of items) {
    const fresh = await tx.product.findUniqueOrThrow({ where: { id: item.productId } });
    if (fresh.currentStock < item.quantity) {
      throw new BadRequestError(
        `Insufficient stock for '${fresh.name}'. Available: ${fresh.currentStock}, requested: ${item.quantity}`
      );
    }

    await inventoryRepository.decrementStock(item.productId, item.quantity, tx);
    await inventoryRepository.createMovement(
      {
        productId: item.productId,
        quantity: item.quantity,
        movementType: MovementType.OUT,
        reason: `Sales Challan ${challanNumber}`,
        createdById,
      },
      tx
    );
  }
}

/** Restores stock for every item of a challan being cancelled after confirmation. */
async function restockItems(
  tx: Tx,
  items: { productId: string; quantity: number }[],
  challanNumber: string,
  createdById: string
) {
  for (const item of items) {
    await inventoryRepository.incrementStock(item.productId, item.quantity, tx);
    await inventoryRepository.createMovement(
      {
        productId: item.productId,
        quantity: item.quantity,
        movementType: MovementType.IN,
        reason: `Cancellation of Sales Challan ${challanNumber}`,
        createdById,
      },
      tx
    );
  }
}

export const challanService = {
  async create(input: CreateChallanInput, createdById: string): Promise<ChallanResponseDto> {
    const customer = await customerRepository.findById(input.customerId);
    if (!customer) throw new NotFoundError('Customer not found');

    const desiredStatus = input.status ?? ChallanStatus.DRAFT;

    const challan = await prisma.$transaction(async (tx) => {
      const productsById = await loadProductsOrThrow(tx, input.items);
      const challanNumber = await generateChallanNumber(tx);
      const totalQuantity = input.items.reduce((sum, i) => sum + i.quantity, 0);

      const created = await challanRepository.create(
        {
          challanNumber,
          customerId: input.customerId,
          totalQuantity,
          status: desiredStatus,
          createdById,
          items: {
            create: input.items.map((item) => {
              const product = productsById.get(item.productId)!;
              return {
                productId: item.productId,
                productNameSnapshot: product.name,
                productSkuSnapshot: product.sku,
                unitPriceSnapshot: product.unitPrice,
                quantity: item.quantity,
              };
            }),
          },
        },
        tx
      );

      if (desiredStatus === ChallanStatus.CONFIRMED) {
        await reduceStockForItems(tx, input.items, challanNumber, createdById);
      }

      return created;
    });

    return toChallanResponse(challan);
  },

  async update(id: string, input: UpdateChallanInput): Promise<ChallanResponseDto> {
    const existing = await challanRepository.findById(id);
    if (!existing) throw new NotFoundError('Challan not found');

    if (existing.status !== ChallanStatus.DRAFT) {
      throw new BadRequestError('Only draft challans can be edited');
    }

    const challan = await prisma.$transaction(async (tx) => {
      let totalQuantity = existing.totalQuantity;

      if (input.items) {
        const productsById = await loadProductsOrThrow(tx, input.items);
        await challanRepository.deleteItems(id, tx);
        await challanRepository.createItems(
          input.items.map((item) => {
            const product = productsById.get(item.productId)!;
            return {
              challanId: id,
              productId: item.productId,
              productNameSnapshot: product.name,
              productSkuSnapshot: product.sku,
              unitPriceSnapshot: product.unitPrice,
              quantity: item.quantity,
            };
          }),
          tx
        );
        totalQuantity = input.items.reduce((sum, i) => sum + i.quantity, 0);
      }

      return challanRepository.update(
        id,
        {
          customerId: input.customerId ?? existing.customerId,
          totalQuantity,
        },
        tx
      );
    });

    return toChallanResponse(challan);
  },

  async changeStatus(
    id: string,
    newStatus: ChallanStatus,
    userId: string
  ): Promise<ChallanResponseDto> {
    const existing = await challanRepository.findById(id);
    if (!existing) throw new NotFoundError('Challan not found');

    assertValidTransition(existing.status, newStatus);

    const challan = await prisma.$transaction(async (tx) => {
      if (existing.status === ChallanStatus.DRAFT && newStatus === ChallanStatus.CONFIRMED) {
        await reduceStockForItems(tx, existing.items, existing.challanNumber, userId);
      }

      if (existing.status === ChallanStatus.CONFIRMED && newStatus === ChallanStatus.CANCELLED) {
        await restockItems(tx, existing.items, existing.challanNumber, userId);
      }

      return challanRepository.update(id, { status: newStatus }, tx);
    });

    return toChallanResponse(challan);
  },

  async getById(id: string): Promise<ChallanResponseDto> {
    const challan = await challanRepository.findById(id);
    if (!challan) throw new NotFoundError('Challan not found');
    return toChallanResponse(challan);
  },

  async list(
    filters: ChallanListFilters,
    page: number,
    limit: number
  ): Promise<PaginatedResult<ChallanResponseDto>> {
    const where = challanRepository.buildWhere(filters);
    const { skip, take } = toSkipTake(page, limit);

    const [challans, total] = await Promise.all([
      challanRepository.findMany(where, skip, take),
      challanRepository.count(where),
    ]);

    return {
      data: challans.map(toChallanResponse),
      meta: buildPaginationMeta(page, limit, total),
    };
  },
};

function assertValidTransition(from: ChallanStatus, to: ChallanStatus): void {
  const allowed: Record<ChallanStatus, ChallanStatus[]> = {
    [ChallanStatus.DRAFT]: [ChallanStatus.CONFIRMED, ChallanStatus.CANCELLED],
    [ChallanStatus.CONFIRMED]: [ChallanStatus.CANCELLED],
    [ChallanStatus.CANCELLED]: [],
  };

  if (from === to) {
    throw new ConflictError(`Challan is already ${to}`);
  }

  if (!allowed[from].includes(to)) {
    throw new BadRequestError(`Cannot change challan status from ${from} to ${to}`);
  }
}

// Re-exported for readability at call sites (routes/controller import ChallanWithItems type).
export type { ChallanWithItems };
