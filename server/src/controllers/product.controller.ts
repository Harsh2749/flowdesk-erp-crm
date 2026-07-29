import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { parsePagination } from '../utils/pagination';

export const productController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.create(req.body);
    return sendSuccess(res, 201, 'Product created successfully', result);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.update(req.params.id, req.body);
    return sendSuccess(res, 200, 'Product updated successfully', result);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.getById(req.params.id);
    return sendSuccess(res, 200, 'Product fetched successfully', result);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await productService.delete(req.params.id);
    return sendSuccess(res, 200, 'Product deleted successfully');
  }),

  setActive: asyncHandler(async (req: Request, res: Response) => {
    const result = await productService.setActive(req.params.id, req.body.isActive);
    const action = req.body.isActive ? 'activated' : 'deactivated';
    return sendSuccess(res, 200, `Product ${action} successfully`, result);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);
    const { search, category, lowStockOnly, isActive } = req.query as Record<
      string,
      string | undefined
    >;

    const result = await productService.list(
      {
        search,
        category,
        lowStockOnly: lowStockOnly === 'true',
        isActive: isActive === undefined ? undefined : isActive === 'true',
      },
      page,
      limit
    );

    return sendSuccess(res, 200, 'Products fetched successfully', result.data, result.meta);
  }),
};