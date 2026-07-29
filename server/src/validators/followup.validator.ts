import { z } from 'zod';

export const createFollowupSchema = z.object({
  body: z.object({
    customerId: z.string().uuid(),
    note: z.string().min(1).max(2000),
    followUpDate: z.coerce.date(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateFollowupSchema = z.object({
  body: z.object({
    note: z.string().min(1).max(2000).optional(),
    followUpDate: z.coerce.date().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
});

export const followupIdSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().uuid() }),
});

export const listFollowupsByCustomerSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
  params: z.object({ customerId: z.string().uuid() }),
});

export type CreateFollowupInput = z.infer<typeof createFollowupSchema>['body'];
export type UpdateFollowupInput = z.infer<typeof updateFollowupSchema>['body'];
