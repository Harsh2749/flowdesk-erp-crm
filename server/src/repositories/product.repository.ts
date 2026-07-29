/*
import { Prisma, Product } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface ProductListFilters {
  search?: string;
  category?: string;
  lowStockOnly?: boolean;
}

export const productRepository = {
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  },

  findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  },

  findBySku(sku: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { sku } });
  },

  update(id: string, data: Prisma.ProductUncheckedUpdateInput): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  },

  delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  },

  buildWhere(filters: ProductListFilters): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (filters.category) where.category = filters.category;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return where;
  },

  async findMany(
    where: Prisma.ProductWhereInput,
    skip: number,
    take: number,
    lowStockOnly?: boolean
  ): Promise<Product[]> {
    if (lowStockOnly) {
      // Prisma can't compare two columns directly in `where`, so low-stock
      // filtering is applied in-memory after a raw fetch of the candidate set.
      const all: Product[] = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
      return all.filter((p: Product) => p.currentStock <= p.minStock).slice(skip, skip + take);
    }

    return prisma.product.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } });
  },

  async count(where: Prisma.ProductWhereInput, lowStockOnly?: boolean): Promise<number> {
    if (lowStockOnly) {
      const all: Product[] = await prisma.product.findMany({ where });
      return all.filter((p: Product) => p.currentStock <= p.minStock).length;
    }
    return prisma.product.count({ where });
  },

  countLowStock(): Promise<number> {
    return prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint as count FROM products WHERE "currentStock" <= "minStock"
    `.then((rows) => Number(rows[0]?.count ?? 0));
  },
};
*/
import { Prisma, Product } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface ProductListFilters {
  search?: string;
  category?: string;
  lowStockOnly?: boolean;
  isActive?: boolean;
}

export const productRepository = {
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  },

  findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  },

  findBySku(sku: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { sku } });
  },

  update(id: string, data: Prisma.ProductUncheckedUpdateInput): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  },

  delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  },

  setActive(id: string, isActive: boolean): Promise<Product> {
    return prisma.product.update({ where: { id }, data: { isActive } });
  },

  /**
   * A product can't be hard-deleted once it has real transaction history —
   * doing so would silently erase the stock audit trail (InventoryMovement)
   * and/or line items from historical sales challans (ChallanItem), even
   * though ChallanItem snapshots its own name/SKU/price. Checked before
   * every delete() call in the service layer.
   */
  async hasTransactionHistory(id: string): Promise<boolean> {
    const [movementCount, challanItemCount] = await Promise.all([
      prisma.inventoryMovement.count({ where: { productId: id } }),
      prisma.challanItem.count({ where: { productId: id } }),
    ]);
    return movementCount > 0 || challanItemCount > 0;
  },

  buildWhere(filters: ProductListFilters): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (filters.category) where.category = filters.category;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return where;
  },

  async findMany(
    where: Prisma.ProductWhereInput,
    skip: number,
    take: number,
    lowStockOnly?: boolean
  ): Promise<Product[]> {
    if (lowStockOnly) {
      // Prisma can't compare two columns directly in `where`, so low-stock
      // filtering is applied in-memory after a raw fetch of the candidate set.
      const all: Product[] = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
      return all.filter((p: Product) => p.currentStock <= p.minStock).slice(skip, skip + take);
    }

    return prisma.product.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } });
  },

  async count(where: Prisma.ProductWhereInput, lowStockOnly?: boolean): Promise<number> {
    if (lowStockOnly) {
      const all: Product[] = await prisma.product.findMany({ where });
      return all.filter((p: Product) => p.currentStock <= p.minStock).length;
    }
    return prisma.product.count({ where });
  },

  countLowStock(): Promise<number> {
    return prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint as count FROM products WHERE "currentStock" <= "minStock"
    `.then((rows) => Number(rows[0]?.count ?? 0));
  },
};