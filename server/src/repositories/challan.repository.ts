import { Challan, ChallanItem, ChallanStatus, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../config/prisma';

type TxClient = Prisma.TransactionClient | PrismaClient;
export type ChallanWithItems = Challan & { items: ChallanItem[] };

export interface ChallanListFilters {
  status?: ChallanStatus;
  customerId?: string;
}

const withItemsInclude = { items: true } as const;

export const challanRepository = {
  create(
    data: Prisma.ChallanUncheckedCreateInput & {
      items: { create: Prisma.ChallanItemUncheckedCreateWithoutChallanInput[] };
    },
    tx: TxClient = prisma
  ): Promise<ChallanWithItems> {
    return tx.challan.create({ data, include: withItemsInclude });
  },

  findById(id: string, tx: TxClient = prisma): Promise<ChallanWithItems | null> {
    return tx.challan.findUnique({ where: { id }, include: withItemsInclude });
  },

  update(
    id: string,
    data: Prisma.ChallanUncheckedUpdateInput,
    tx: TxClient = prisma
  ): Promise<ChallanWithItems> {
    return tx.challan.update({ where: { id }, data, include: withItemsInclude });
  },

  deleteItems(challanId: string, tx: TxClient = prisma) {
    return tx.challanItem.deleteMany({ where: { challanId } });
  },

  createItems(
    items: Prisma.ChallanItemUncheckedCreateInput[],
    tx: TxClient = prisma
  ) {
    return tx.challanItem.createMany({ data: items });
  },

  buildWhere(filters: ChallanListFilters): Prisma.ChallanWhereInput {
    const where: Prisma.ChallanWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.customerId) where.customerId = filters.customerId;
    return where;
  },

  findMany(
    where: Prisma.ChallanWhereInput,
    skip: number,
    take: number
  ): Promise<ChallanWithItems[]> {
    return prisma.challan.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: withItemsInclude,
    });
  },

  count(where: Prisma.ChallanWhereInput): Promise<number> {
    return prisma.challan.count({ where });
  },
};
