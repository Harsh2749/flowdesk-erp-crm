import { Request, Response } from 'express';
import { followupService } from '../services/followup.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { parsePagination } from '../utils/pagination';
import { UnauthorizedError } from '../errors/AppError';

export const followupController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const result = await followupService.create(req.body, req.user.id);
    return sendSuccess(res, 201, 'Follow-up added successfully', result);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const result = await followupService.update(req.params.id, req.body);
    return sendSuccess(res, 200, 'Follow-up updated successfully', result);
  }),

  listByCustomer: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await followupService.listByCustomer(req.params.customerId, page, limit);
    return sendSuccess(res, 200, 'Follow-up history fetched successfully', result.data, result.meta);
  }),
};
