import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../config/jwt';
import { UnauthorizedError } from '../errors/AppError';

/**
 * Reads the Bearer token from the Authorization header, verifies it, and
 * attaches the decoded { id, email, role } to req.user. Every protected
 * route is expected to run this before any role.middleware check.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization header');
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }
};
