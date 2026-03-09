import { Request, Response, NextFunction } from 'express';

/**
 * Standard error class with HTTP status code
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error types for consistency
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class InsufficientCreditsError extends AppError {
  constructor(needed: number, available: number, action: string) {
    super(
      `Insufficient credits for ${action}. Need ${needed}, have ${available}`,
      402,
      'INSUFFICIENT_CREDITS',
      { needed, available, action }
    );
    this.name = 'InsufficientCreditsError';
  }
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * Replaces repeated try-catch blocks in controllers
 * 
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await userService.getAll();
 *   res.json(successResponse(users));
 * }));
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler middleware
 * Place at the end of middleware chain
 * 
 * @example
 * app.use(errorHandler);
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', err);

  if (err instanceof AppError) {
    const errorResponse: any = {
      success: false,
      data: null,
      message: err.message,
      error: {
        code: err.code,
      },
    };

    if (err.details) {
      errorResponse.error.details = err.details;
    }

    return res.status(err.statusCode).json(errorResponse);
  }

  // Default to 500 server error
  res.status(500).json({
    success: false,
    data: null,
    message: err.message || 'Internal server error',
    error: {
      code: 'INTERNAL_ERROR',
    },
  });
};

/**
 * Helper to assert conditions and throw errors
 * 
 * @example
 * assert(user, new NotFoundError('User'));
 * assert(user.isActive, new ForbiddenError('Account inactive'));
 */
export function assert(condition: any, error: Error): asserts condition {
  if (!condition) {
    throw error;
  }
}
