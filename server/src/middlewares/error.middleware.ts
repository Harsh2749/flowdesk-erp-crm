import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';
import { env } from '../config/env';

interface ErrorResponseBody {
  success: false;
  message: string;
  errors?: unknown;
  stack?: string;
}

/**
 * Express requires a 4-arg signature for error-handling middleware to be
 * recognized as such - do not shorten this signature.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = err.flatten().fieldErrors;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = mapPrismaError(err);
  } else if (err instanceof Error) {
    message = env.isDevelopment ? err.message : message;
  }

  logger.error(
    `${req.method} ${req.originalUrl} -> ${statusCode} :: ${
      err instanceof Error ? err.stack ?? err.message : String(err)
    }`
  );

  const body: ErrorResponseBody = {
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(env.isDevelopment && err instanceof Error ? { stack: err.stack } : {}),
  };

  res.status(statusCode).json(body);
};

function mapPrismaError(err: Prisma.PrismaClientKnownRequestError): string {
  switch (err.code) {
    case 'P2002':
      return `Duplicate value for field(s): ${(err.meta?.target as string[])?.join(', ') ?? 'unknown'}`;
    case 'P2025':
      return 'Record not found';
    case 'P2003':
      return 'Invalid reference to a related record';
    default:
      return 'Database request error';
  }
}

/**
 * Catches requests to routes that don't match any registered handler.
 * Registered last, right before errorMiddleware, in app.ts.
 */
export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
