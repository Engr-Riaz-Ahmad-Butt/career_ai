/**
 * Canonical application error hierarchy.
 *
 * All operational errors in services/controllers should use one of these
 * classes so the global middleware can return consistent responses.
 */

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    code: string,
    details?: unknown,
    isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(401, message, 'UNAUTHORIZED_ERROR', details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details?: unknown) {
    super(403, message, 'FORBIDDEN_ERROR', details);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: unknown) {
    super(404, message, 'NOT_FOUND_ERROR', details);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', details?: unknown) {
    super(409, message, 'CONFLICT_ERROR', details);
    this.name = 'ConflictError';
  }
}

export class InsufficientCreditsError extends AppError {
  constructor(message = 'Insufficient credits', details?: unknown) {
    super(402, message, 'INSUFFICIENT_CREDITS_ERROR', details);
    this.name = 'InsufficientCreditsError';
  }
}

export class InternalError extends AppError {
  constructor(message = 'Internal server error', details?: unknown) {
    super(500, message, 'INTERNAL_ERROR', details, false);
    this.name = 'InternalError';
  }
}

/**
 * Backward-compatible alias while the codebase migrates away from ApiError.
 */
export class ApiError extends AppError {
  constructor(statusCode: number, message: string, details?: unknown) {
    const mapped = createHttpError(statusCode, message, details);
    super(mapped.statusCode, mapped.message, mapped.code, mapped.details, mapped.isOperational);
    this.name = 'ApiError';
  }
}

export function createHttpError(
  statusCode: number,
  message: string,
  details?: unknown
): AppError {
  switch (statusCode) {
    case 400:
      return new ValidationError(message, details);
    case 401:
      return new UnauthorizedError(message, details);
    case 402:
      return new InsufficientCreditsError(message, details);
    case 403:
      return new ForbiddenError(message, details);
    case 404:
      return new NotFoundError(message, details);
    case 409:
      return new ConflictError(message, details);
    default:
      return new InternalError(message || 'Internal server error', {
        statusCode,
        ...(details ? { details } : {}),
      });
  }
}

export function assert(condition: unknown, error: Error): asserts condition {
  if (!condition) throw error;
}
