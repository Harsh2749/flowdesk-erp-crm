import { Customer, CustomerStatus, CustomerType, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface CustomerListFilters {
  search?: string;
  status?: CustomerStatus;
  customerType?: CustomerType;
}

export const customerRepository = {
  create(data: Prisma.CustomerUncheckedCreateInput): Promise<Customer> {
    return prisma.customer.create({ data });
  },

  findById(id: string): Promise<Customer | null> {
    return prisma.customer.findUnique({ where: { id } });
  },

  update(id: string, data: Prisma.CustomerUncheckedUpdateInput): Promise<Customer> {
    return prisma.customer.update({ where: { id }, data });
  },

  delete(id: string): Promise<Customer> {
    return prisma.customer.delete({ where: { id } });
  },

  buildWhere(filters: CustomerListFilters): Prisma.CustomerWhereInput {
    const where: Prisma.CustomerWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.customerType) where.customerType = filters.customerType;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { businessName: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { gstNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return where;
  },

  findMany(
    where: Prisma.CustomerWhereInput,
    skip: number,
    take: number
  ): Promise<Customer[]> {
    return prisma.customer.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  },

  count(where: Prisma.CustomerWhereInput): Promise<number> {
    return prisma.customer.count({ where });
  },
};
