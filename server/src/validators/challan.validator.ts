import { z } from 'zod';
import { ChallanStatus } from '@prisma/client';

const idParam = z.object({ id: z.string().uuid('Invalid challan id') });

const challanItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().positive('quantity must be greater than 0'),
});

export const createChallanSchema = z.object({
  body: z.object({
    customerId: z.string().uuid(),
    items: z.array(challanItemSchema).min(1, 'At least one product is required'),
    status: z.enum([ChallanStatus.DRAFT, ChallanStatus.CONFIRMED]).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateChallanSchema = z.object({
  body: z.object({
    customerId: z.string().uuid().optional(),
    items: z.array(challanItemSchema).min(1).optional(),
  }),
  query: z.object({}).optional(),
  params: idParam,
});

export const changeChallanStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ChallanStatus),
  }),
  query: z.object({}).optional(),
  params: idParam,
});

export const challanIdSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: idParam,
});

export const listChallansSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    status: z.nativeEnum(ChallanStatus).optional(),
    customerId: z.string().uuid().optional(),
  }),
  params: z.object({}).optional(),
});

export type CreateChallanInput = z.infer<typeof createChallanSchema>['body'];
export type UpdateChallanInput = z.infer<typeof updateChallanSchema>['body'];
