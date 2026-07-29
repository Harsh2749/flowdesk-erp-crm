import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Factory that produces an Express middleware validating req.body / req.query
 * / req.params against the given Zod schema. On success, the parsed
 * (and type-coerced) data replaces the corresponding request property so
 * downstream controllers can trust its shape.
 *
 * Usage: router.post('/', validate(createCustomerSchema), controller.create)
 */
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  };
