import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validation middleware factory.
 *
 * Usage in routes:
 * ```
 * import { validate } from '../middleware/validate';
 * import { loginSchema } from '../utils/validation';
 *
 * router.post('/login', validate(loginSchema), login);
 * ```
 *
 * The middleware validates `req.body` against the provided Zod schema.
 * If validation fails, the error bubbles up to the global error handler
 * which already knows how to format ZodErrors (400 with field-level details).
 */
export const validate = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        schema.parse(req.body);
        next();
    };
};

/**
 * Validate query parameters against a Zod schema.
 */
export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        req.query = schema.parse(req.query);
        next();
    };
};

/**
 * Validate route parameters against a Zod schema.
 */
export const validateParams = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        schema.parse(req.params);
        next();
    };
};
