import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';

/**
 * Factory producing middleware that restricts a route to the given roles.
 * Must run after `authenticate` so req.user is populated.
 *
 * Usage: router.post('/', authenticate, authorize(Role.ADMIN, Role.SALES), controller.create)
 */
export const authorize =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Role '${req.user.role}' is not permitted to perform this action`
      );
    }

    next();
  };
