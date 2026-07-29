import { Request, Response } from 'express';
import { challanService } from '../services/challan.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { parsePagination } from '../utils/pagination';
import { UnauthorizedError } from '../errors/AppError';

export const challanController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const result = await challanService.create(req.body, req.user.id);
    return sendSuccess(res, 201, 'Challan created successfully', result);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const result = await challanService.update(req.params.id, req.body);
    return sendSuccess(res, 200, 'Challan updated successfully', result);
  }),

  changeStatus: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const result = await challanService.changeStatus(req.params.id, req.body.status, req.user.id);
    return sendSuccess(res, 200, 'Challan status updated successfully', result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const result = await challanService.getById(req.params.id);
    return sendSuccess(res, 200, 'Challan fetched successfully', result);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const { status, customerId } = req.query as Record<string, string | undefined>;
    const result = await challanService.list({ status: status as never, customerId }, page, limit);
    return sendSuccess(res, 200, 'Challans fetched successfully', result.data, result.meta);
  }),
};
