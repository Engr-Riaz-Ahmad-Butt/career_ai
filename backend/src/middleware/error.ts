import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import {
  AppError,
  ConflictError,
  ForbiddenError,
  InsufficientCreditsError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@/utils/errorHandler';

function fromZod(error: ZodError): ValidationError {
  return new ValidationError('Validation error', {
    fields: error.errors.map((item) => ({
      field: item.path.join('.'),
      message: item.message,
    })),
  });
}

function fromPrisma(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002': {
      const field = (error.meta?.target as string[] | undefined)?.[0] ?? 'field';
      return new ConflictError(`${field} already exists`, { code: error.code, meta: error.meta });
    }
    case 'P2025':
      return new NotFoundError('Record not found', { code: error.code, meta: error.meta });
    case 'P2003':
      return new ValidationError('Invalid reference', { code: error.code, meta: error.meta });
    default:
      return new InternalError('Database error', { code: error.code, meta: error.meta });
  }
}

function fromMessage(error: Error): AppError {
  const message = error.message || 'Unexpected error';
  const lowered = message.toLowerCase();

  if (lowered.includes('unauthorized') || lowered.includes('invalid token') || lowered.includes('token expired')) {
    return new UnauthorizedError(message);
  }

  if (lowered.includes('forbidden')) {
    return new ForbiddenError(message);
  }

  if (lowered.includes('insufficient credits')) {
    return new InsufficientCreditsError(message);
  }

  if (lowered.includes('already exists') || lowered.includes('already registered') || lowered.includes('conflict')) {
    return new ConflictError(message);
  }

  if (lowered.includes('not found')) {
    return new NotFoundError(message);
  }

  if (
    lowered.includes('required') ||
    lowered.includes('invalid') ||
    lowered.includes('missing') ||
    lowered.includes('no data')
  ) {
    return new ValidationError(message);
  }

  return new InternalError('Internal server error');
}

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return fromZod(error);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return fromPrisma(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError('Invalid database query');
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return new ValidationError('Invalid JSON payload');
  }

  if (error instanceof Error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return new UnauthorizedError('Invalid or expired token');
    }
    return fromMessage(error);
  }

  return new InternalError('Internal server error');
}

function logServerError(req: Request, error: unknown, appError: AppError): void {
  const requestId = resRequestId(req);

  console.error('Unhandled request error', {
    requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode: appError.statusCode,
    code: appError.code,
    message: appError.message,
    details: appError.details,
    error,
  });
}

function resRequestId(req: Request): string | undefined {
  const localRequestId = req.res?.locals?.requestId;
  return typeof localRequestId === 'string' ? localRequestId : undefined;
}

function buildClientErrorResponse(appError: AppError, requestId?: string) {
  return {
    success: false,
    message: appError.message,
    error: {
      code: appError.code,
      ...(appError.details !== undefined ? { details: appError.details } : {}),
    },
    ...(requestId ? { requestId } : {}),
  };
}

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const appError = normalizeError(error);
  const requestId = resRequestId(req);

  // Always log full error details server-side.
  logServerError(req, error, appError);

  // Never expose stack traces or raw internals to clients.
  res.status(appError.statusCode).json(buildClientErrorResponse(appError, requestId));
};

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
