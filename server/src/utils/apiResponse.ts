import { Response } from 'express';

interface SuccessBody<T> {
  success: true;
  message: string;
  data?: T;
  meta?: unknown;
}

/**
 * Sends a consistently-shaped success response.
 * `{ success, message, data?, meta? }` across every endpoint in the API.
 */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: unknown
): Response => {
  const body: SuccessBody<T> = { success: true, message };
  if (data !== undefined) body.data = data;
  if (meta !== undefined) body.meta = meta;
  return res.status(statusCode).json(body);
};
