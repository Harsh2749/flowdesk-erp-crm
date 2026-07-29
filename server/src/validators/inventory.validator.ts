import { z } from 'zod';

export const stockMovementSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.coerce.number().int().positive('quantity must be greater than 0'),
    reason: z.string().min(1).max(300),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const listMovementsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    productId: z.string().uuid().optional(),
  }),
  params: z.object({}).optional(),
});

export type StockMovementInput = z.infer<typeof stockMovementSchema>['body'];
