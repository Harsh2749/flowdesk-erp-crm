import { Followup, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export const followupRepository = {
  create(data: Prisma.FollowupUncheckedCreateInput): Promise<Followup> {
    return prisma.followup.create({ data });
  },

  findById(id: string): Promise<Followup | null> {
    return prisma.followup.findUnique({ where: { id } });
  },

  update(id: string, data: Prisma.FollowupUncheckedUpdateInput): Promise<Followup> {
    return prisma.followup.update({ where: { id }, data });
  },

  findByCustomer(customerId: string, skip: number, take: number): Promise<Followup[]> {
    return prisma.followup.findMany({
      where: { customerId },
      skip,
      take,
      orderBy: { followUpDate: 'desc' },
    });
  },

  countByCustomer(customerId: string): Promise<number> {
    return prisma.followup.count({ where: { customerId } });
  },

  customerExists(customerId: string): Promise<number> {
    return prisma.customer.count({ where: { id: customerId } });
  },
};
