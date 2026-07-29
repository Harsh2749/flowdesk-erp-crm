import { InventoryMovement, MovementType, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma';

type TxClient = Prisma.TransactionClient | PrismaClient;

export const inventoryRepository = {
  createMovement(
    data: Prisma.InventoryMovementUncheckedCreateInput,
    tx: TxClient = prisma
  ): Promise<InventoryMovement> {
    return tx.inventoryMovement.create({ data });
  },

  incrementStock(productId: string, quantity: number, tx: TxClient = prisma) {
    return tx.product.update({
      where: { id: productId },
      data: { currentStock: { increment: quantity } },
    });
  },

  decrementStock(productId: string, quantity: number, tx: TxClient = prisma) {
    return tx.product.update({
      where: { id: productId },
      data: { currentStock: { decrement: quantity } },
    });
  },

  findMany(
    where: Prisma.InventoryMovementWhereInput,
    skip: number,
    take: number
  ): Promise<InventoryMovement[]> {
    return prisma.inventoryMovement.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  },

  count(where: Prisma.InventoryMovementWhereInput): Promise<number> {
    return prisma.inventoryMovement.count({ where });
  },

  buildWhere(productId?: string): Prisma.InventoryMovementWhereInput {
    return productId ? { productId } : {};
  },
};

export type { MovementType };
