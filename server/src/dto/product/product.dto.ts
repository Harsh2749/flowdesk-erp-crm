import { Product } from '@prisma/client';

export interface ProductResponseDto {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock: number;
  minStock: number;
  warehouseLocation: string | null;
  isActive: boolean;
  isLowStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toProductResponse = (product: Product): ProductResponseDto => ({
  id: product.id,
  name: product.name,
  sku: product.sku,
  category: product.category,
  unitPrice: Number(product.unitPrice),
  currentStock: product.currentStock,
  minStock: product.minStock,
  warehouseLocation: product.warehouseLocation,
  isActive: product.isActive,
  isLowStock: product.currentStock <= product.minStock,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});
