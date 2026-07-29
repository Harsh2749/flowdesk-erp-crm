import { Request, Response } from 'express';
import { customerService } from '../services/customer.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { parsePagination } from '../utils/pagination';
import { UnauthorizedError } from '../errors/AppError';

export const customerController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const result = await customerService.create(req.body, req.user.id);
    return sendSuccess(res, 201, 'Customer created successfully', result);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const result = await customerService.update(req.params.id, req.body);
    return sendSuccess(res, 200, 'Customer updated successfully', result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const result = await customerService.getById(req.params.id);
    return sendSuccess(res, 200, 'Customer fetched successfully', result);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await customerService.delete(req.params.id);
    return sendSuccess(res, 200, 'Customer deleted successfully');
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const { search, status, customerType } = req.query as Record<string, string | undefined>;

    const result = await customerService.list(
      { search, status: status as never, customerType: customerType as never },
      page,
      limit
    );

    return sendSuccess(res, 200, 'Customers fetched successfully', result.data, result.meta);
  }),
};
