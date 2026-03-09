/**
 * backend/src/utils/apiResponse.ts
 *
 * Standard response format helpers for consistent API responses.
 * Use these in every controller to ensure consistent response shape.
 *
 * Success: { success: true, data: T, message?: string }
 * Error:   { success: false, data: null, message, error: { code, details } }
 */

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  data: null;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JobStatusResponse {
  success: true;
  data: {
    jobId: string;
    status: 'processing' | 'complete' | 'failed';
    result: Record<string, any> | null;
    error: string | null;
    createdAt: string;
    completedAt: string | null;
  };
}

/**
 * SUCCESS RESPONSE
 * @example
 * res.json(successResponse(user, 'User created successfully'))
 */
export function successResponse<T>(
  data: T,
  message?: string
): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

/**
 * PAGINATED SUCCESS RESPONSE
 * @example
 * res.json(paginatedResponse(resumes, { total: 100, page: 1, limit: 20 }))
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: { total: number; page: number; limit: number }
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  };
}

/**
 * ERROR RESPONSE
 * Use for validation errors, permission errors, etc.
 * @example
 * res.status(400).json(errorResponse(
 *   'Invalid email',
 *   'VALIDATION_ERROR',
 *   { field: 'email', value }
 * ))
 */
export function errorResponse(
  message: string,
  code: string,
  details?: unknown
): ErrorResponse {
  const error: { code: string; details?: unknown } = { code };
  if (details !== undefined) {
    error.details = details;
  }

  return {
    success: false,
    data: null,
    message,
    error,
  };
}

/**
 * JOB STATUS RESPONSE
 * For polling long-running operations (PDF generation, file parsing)
 * @example
 * res.json(jobStatusResponse({
 *   jobId: 'job_123',
 *   status: 'processing',
 *   result: null,
 *   error: null,
 *   createdAt,
 *   completedAt: null,
 * }))
 */
export function jobStatusResponse(data: {
  jobId: string;
  status: 'processing' | 'complete' | 'failed';
  result: Record<string, any> | null;
  error: string | null;
  createdAt: string;
  completedAt: string | null;
}): JobStatusResponse {
  return {
    success: true,
    data,
  };
}
