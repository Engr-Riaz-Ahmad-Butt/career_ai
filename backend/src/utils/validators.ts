/**
 * Common validation utilities to reduce duplication
 */

import { ValidationError } from '@/utils/errorHandler';
import { PAGINATION } from '@/constants/pagination';

/**
 * Validate required fields exist and are not empty
 * 
 * @example
 * validateRequired(req.body, ['email', 'password']);
 */
export function validateRequired(
  data: Record<string, any>,
  fields: string[]
): void {
  const missing: string[] = [];

  for (const field of fields) {
    const value = data[field];
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
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * At least 8 chars, 1 uppercase, 1 lowercase, 1 number
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page?: any, limit?: any): {
  page: number;
  limit: number;
} {
  const parsedPage = parseInt(page) || PAGINATION.DEFAULT_PAGE;
  const parsedLimit = parseInt(limit) || PAGINATION.DEFAULT_LIMIT_FALLBACK;

  if (parsedPage < PAGINATION.DEFAULT_PAGE) {
    throw new ValidationError('Page must be greater than 0');
  }

  if (parsedLimit < PAGINATION.DEFAULT_PAGE || parsedLimit > PAGINATION.MAX_LIMIT) {
    throw new ValidationError('Limit must be between 1 and 100');
  }

  return {
    page: parsedPage,
    limit: parsedLimit,
  };
}

/**
 * Sanitize string input (trim and remove excess whitespace)
 */
export function sanitizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Validate and sanitize multiple string fields
 */
export function sanitizeFields<T extends Record<string, any>>(
  data: T,
  fields: (keyof T)[]
): T {
  const result = { ...data };

  for (const field of fields) {
    if (typeof result[field] === 'string') {
      result[field] = sanitizeString(result[field] as string) as T[keyof T];
    }
  }

  return result;
}

/**
 * Validate enum value
 */
export function validateEnum<T extends string>(
  value: string,
  allowedValues: readonly T[],
  fieldName: string
): T {
  if (!allowedValues.includes(value as T)) {
    throw new ValidationError(
      `Invalid ${fieldName}. Must be one of: ${allowedValues.join(', ')}`,
      { field: fieldName, value, allowedValues }
    );
  }
  return value as T;
}

/**
 * Validate array is not empty
 */
export function validateNonEmptyArray(
  arr: any[],
  fieldName: string
): void {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new ValidationError(`${fieldName} must be a non-empty array`);
  }
}
