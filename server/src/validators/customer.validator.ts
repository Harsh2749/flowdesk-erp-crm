import { z } from 'zod';
import { CustomerStatus, CustomerType } from '@prisma/client';

const idParam = z.object({ id: z.string().uuid('Invalid customer id') });

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    phone: z.string().min(7).max(20),
    email: z.string().email().optional(),
    businessName: z.string().min(2).max(200),
    gstNumber: z.string().max(20).optional(),
    customerType: z.nativeEnum(CustomerType),
    address: z.string().max(500).optional(),
    status: z.nativeEnum(CustomerStatus).optional(),
    followUpDate: z.coerce.date().optional(),
    notes: z.string().max(2000).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateCustomerSchema = z.object({
  body: createCustomerSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: idParam,
});

export const customerIdSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: idParam,
});

export const listCustomersSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    status: z.nativeEnum(CustomerStatus).optional(),
    customerType: z.nativeEnum(CustomerType).optional(),
  }),
  params: z.object({}).optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>['body'];
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>['body'];
