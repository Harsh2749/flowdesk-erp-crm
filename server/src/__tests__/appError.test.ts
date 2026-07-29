import {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/AppError';

describe('AppError hierarchy', () => {
  it('defaults AppError to statusCode 500 and isOperational true', () => {
    const err = new AppError('boom');
    expect(err.statusCode).toBe(500);
    expect(err.isOperational).toBe(true);
    expect(err.message).toBe('boom');
  });

  it('maps each subclass to the correct HTTP status code', () => {
    expect(new BadRequestError().statusCode).toBe(400);
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new ForbiddenError().statusCode).toBe(403);
    expect(new NotFoundError().statusCode).toBe(404);
    expect(new ConflictError().statusCode).toBe(409);
  });

  it('carries optional details through to the response', () => {
    const err = new BadRequestError('bad input', { field: 'email' });
    expect(err.details).toEqual({ field: 'email' });
  });

  it('is an instanceof Error and its own subclass', () => {
    const err = new NotFoundError('missing');
    expect(err instanceof Error).toBe(true);
    expect(err instanceof AppError).toBe(true);
    expect(err instanceof NotFoundError).toBe(true);
  });
});
