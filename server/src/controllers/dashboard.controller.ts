import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const dashboardController = {
  summary: asyncHandler(async (_req: Request, res: Response) => {
    const result = await dashboardService.getSummary();
    return sendSuccess(res, 200, 'Dashboard summary fetched successfully', result);
  }),
};
