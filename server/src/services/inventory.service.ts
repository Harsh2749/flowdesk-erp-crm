import { MovementType } from '@prisma/client';
import { prisma } from '../config/prisma';
import { inventoryRepository } from '../repositories/inventory.repository';
import { productRepository } from '../repositories/product.repository';
import { InventoryMovementResponseDto, toMovementResponse } from '../dto/inventory/inventory.dto';
import { StockMovementInput } from '../validators/inventory.validator';
import { BadRequestError, NotFoundError } from '../errors/AppError';
import { PaginatedResult, buildPaginationMeta, toSkipTake } from '../interfaces/pagination.interface';

export const inventoryService = {
  async stockIn(
    input: StockMovementInput,
    createdById: string
  ): Promise<InventoryMovementResponseDto> {
    const product = await productRepository.findById(input.productId);
    if (!product) throw new NotFoundError('Product not found');

    const movement = await prisma.$transaction(async (tx) => {
      await inventoryRepository.incrementStock(input.productId, input.quantity, tx);
      return inventoryRepository.createMovement(
        {
          productId: input.productId,
          quantity: input.quantity,
          movementType: MovementType.IN,
          reason: input.reason,
          createdById,
        },
        tx
      );
    });

    return toMovementResponse(movement);
  },

  async stockOut(
    input: StockMovementInput,
    createdById: string
  ): Promise<InventoryMovementResponseDto> {
    const product = await productRepository.findById(input.productId);
    if (!product) throw new NotFoundError('Product not found');

    if (product.currentStock < input.quantity) {
      throw new BadRequestError(
        `Insufficient stock for '${product.name}'. Available: ${product.currentStock}, requested: ${input.quantity}`
      );
    }

    const movement = await prisma.$transaction(async (tx) => {
      // Re-check stock inside the transaction to prevent a race between two
      // concurrent stock-out requests from pushing the count negative.
      const fresh = await tx.product.findUniqueOrThrow({ where: { id: input.productId } });
      if (fresh.currentStock < input.quantity) {
        throw new BadRequestError(
          `Insufficient stock for '${fresh.name}'. Available: ${fresh.currentStock}, requested: ${input.quantity}`
        );
      }

      await inventoryRepository.decrementStock(input.productId, input.quantity, tx);
      return inventoryRepository.createMovement(
        {
          productId: input.productId,
          quantity: input.quantity,
          movementType: MovementType.OUT,
          reason: input.reason,
          createdById,
        },
        tx
      );
    });

    return toMovementResponse(movement);
  },

  async listMovements(
    productId: string | undefined,
    page: number,
    limit: number
  ): Promise<PaginatedResult<InventoryMovementResponseDto>> {
    const where = inventoryRepository.buildWhere(productId);
    const { skip, take } = toSkipTake(page, limit);

    const [movements, total] = await Promise.all([
      inventoryRepository.findMany(where, skip, take),
      inventoryRepository.count(where),
    ]);

    return {
      data: movements.map(toMovementResponse),
      meta: buildPaginationMeta(page, limit, total),
    };
  },

  async lowStockCount(): Promise<number> {
    return productRepository.countLowStock();
  },
};
