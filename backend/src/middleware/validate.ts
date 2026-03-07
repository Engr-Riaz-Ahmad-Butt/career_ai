import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validation middleware factory.
 * 
 * @param schema - Zod schema to validate against
 * @param location - Which part of the request to validate ('body', 'query', or 'params'). Default is 'body'.
 */
export const validate = (schema: ZodSchema, location: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (location === 'query') {
            req.query = schema.parse(req.query);
        } else if (location === 'params') {
            req.params = schema.parse(req.params);
        } else {
            req.body = schema.parse(req.body);
        }
        next();
    };
};

/**
 * Validate query parameters against a Zod schema.
 * @deprecated Use validate(schema, 'query') instead
 */
export const validateQuery = (schema: ZodSchema) => validate(schema, 'query');

/**
 * Validate route parameters against a Zod schema.
 * @deprecated Use validate(schema, 'params') instead
 */
export const validateParams = (schema: ZodSchema) => validate(schema, 'params');

