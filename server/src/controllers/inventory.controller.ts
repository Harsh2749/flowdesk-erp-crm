import { Request, Response } from 'express';
import { inventoryService } from '../services/inventory.service';
import { productService } from '../services/product.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { parsePagination } from '../utils/pagination';
import { UnauthorizedError } from '../errors/AppError';

export const inventoryController = {
  stockIn: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const result = await inventoryService.stockIn(req.body, req.user.id);
    return sendSuccess(res, 201, 'Stock in recorded successfully', result);
  }),

  stockOut: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const result = await inventoryService.stockOut(req.body, req.user.id);
    return sendSuccess(res, 201, 'Stock out recorded successfully', result);
  }),

  listMovements: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const { productId } = req.query as Record<string, string | undefined>;
    const result = await inventoryService.listMovements(productId, page, limit);
    return sendSuccess(res, 200, 'Stock movements fetched successfully', result.data, result.meta);
  }),

  lowStock: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const result = await productService.list({ lowStockOnly: true }, page, limit);
    return sendSuccess(res, 200, 'Low stock products fetched successfully', result.data, result.meta);
  }),
};
