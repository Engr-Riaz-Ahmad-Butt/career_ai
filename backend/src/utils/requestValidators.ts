/**
 * Request validation utilities to eliminate duplicate checks in controllers
 */

import { UnauthorizedError, ValidationError } from '@/utils/errorHandler';
import { PAGINATION } from '@/constants/pagination';

/**
 * Validate user authentication (userId exists)
 * Throws UnauthorizedError if missing
 * 
 * @example
 * requireAuth(req.user?.userId);
 */
export function requireAuth(userId?: string): asserts userId is string {
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }
}

/**
 * Validate required ID parameter
 * Throws ValidationError if missing
 * 
 * @example
 * requireId(req.params.id, 'Resume ID');
 */
export function requireId(
  id?: string,
  name: string = 'ID'
): asserts id is string {
  if (!id) {
    throw new ValidationError(`${name} is required`);
  }
}

/**
 * Validate required body fields
 * Throws ValidationError if any field is missing
 * 
 * @example
 * requireBodyFields(req.body, ['email', 'password']);
 */
export function requireBodyFields(
  body: Record<string, any>,
  fields: string[]
): void {
  const missing: string[] = [];

  for (const field of fields) {
    const value = body[field];
    if (value === undefined || value === null || value === '') {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`,
      { missingFields: missing }
    );
  }
}

/**
 * Extract and validate pagination parameters from query
 * 
 * @example
 * const { page, limit, skip } = extractPaginationParams(req.query);
 */
export function extractPaginationParams(query: Record<string, any>): {
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
} {
  const page = Math.max(PAGINATION.DEFAULT_PAGE, parseInt(query.page as string) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(PAGINATION.DEFAULT_PAGE, parseInt(query.limit as string) || PAGINATION.DEFAULT_LIMIT_FALLBACK)
  );
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy as string | undefined;
  const order = (query.order === 'asc' || query.order === 'desc')
    ? query.order
    : PAGINATION.DEFAULT_SORT_ORDER;

  return {
    page,
    limit,
    skip,
    ...(sortBy && { sortBy, order }),
  };
}
