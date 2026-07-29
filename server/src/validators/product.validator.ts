/*
import { z } from 'zod';

const idParam = z.object({ id: z.string().uuid('Invalid product id') });

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    sku: z.string().min(1).max(50),
    category: z.string().min(1).max(100),
    unitPrice: z.coerce.number().positive('unitPrice must be greater than 0'),
    currentStock: z.coerce.number().int().min(0).optional(),
    minStock: z.coerce.number().int().min(0).optional(),
    warehouseLocation: z.string().max(150).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: idParam,
});

export const productIdSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: idParam,
});

export const listProductsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    lowStockOnly: z.coerce.boolean().optional(),
  }),
  params: z.object({}).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
*/

import { z } from 'zod';

const idParam = z.object({ id: z.string().uuid('Invalid product id') });

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    sku: z.string().min(1).max(50),
    category: z.string().min(1).max(100),
    unitPrice: z.coerce.number().positive('unitPrice must be greater than 0'),
    currentStock: z.coerce.number().int().min(0).optional(),
    minStock: z.coerce.number().int().min(0).optional(),
    warehouseLocation: z.string().max(150).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: idParam,
});

export const productIdSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: idParam,
});

export const updateProductStatusSchema = z.object({
  body: z.object({ isActive: z.boolean() }),
  query: z.object({}).optional(),
  params: idParam,
});

export const listProductsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    lowStockOnly: z.coerce.boolean().optional(),
    isActive: z.coerce.boolean().optional(),
  }),
  params: z.object({}).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];