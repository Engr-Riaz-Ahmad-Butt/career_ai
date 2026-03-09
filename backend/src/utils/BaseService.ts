/**
 * Base service class with common patterns
 * Extend this for consistent service structure
 */

import { NotFoundError, ValidationError } from './errorHandler';

export abstract class BaseService<T = any> {
  protected abstract entityName: string;

  /**
   * Assert entity exists or throw NotFoundError
   */
  protected assertExists(entity: T | null | undefined, id?: string | number): asserts entity is T {
    if (!entity) {
      const identifier = id ? ` with id ${id}` : '';
      throw new NotFoundError(`${this.entityName}${identifier}`);
    }
  }

  /**
   * Validate required fields
   */
  protected validateRequired(
    data: Record<string, any>,
    fields: string[]
  ): void {
    const missing = fields.filter(
      (field) =>
        data[field] === undefined || data[field] === null || data[field] === ''
    );

    if (missing.length > 0) {
      throw new ValidationError(
        `Missing required ${this.entityName} fields: ${missing.join(', ')}`,
        { missingFields: missing }
      );
    }
  }

  /**
   * Get pagination params with defaults
   */
  protected getPaginationParams(
    page?: number | string,
    limit?: number | string
  ): { skip: number; take: number; page: number } {
    const pageNum = Math.max(1, parseInt(String(page || 1)));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit || 20))));

    return {
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      page: pageNum,
    };
  }
}
