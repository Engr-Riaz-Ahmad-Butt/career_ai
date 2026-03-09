/**
 * Common database query patterns
 */

import prisma from '../config/database';
import { NotFoundError } from './errorHandler';

/**
 * Transaction wrapper with automatic rollback on error
 * 
 * @example
 * const result = await withTransaction(async (tx) => {
 *   const user = await tx.user.create({ data: userData });
 *   await tx.profile.create({ data: { userId: user.id, ...profileData } });
 *   return user;
 * });
 */
export async function withTransaction<T>(
  fn: (tx: typeof prisma) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    return await fn(tx as typeof prisma);
  });
}

/**
 * Find a resource by ID with optional ownership check
 * Throws NotFoundError if not found or ownership check fails
 * 
 * @example
 * // Find any user
 * const user = await findResourceByIdOrThrow(prisma.user, userId);
 * 
 * // Find resume owned by specific user
 * const resume = await findResourceByIdOrThrow(
 *   prisma.resume, 
 *   resumeId, 
 *   { userId },
 *   'Resume not found'
 * );
 */
export async function findResourceByIdOrThrow<T>(
  model: any,
  id: string | number,
  whereExtra?: Record<string, any>,
   select?: Record<string, any>,
  errorMessage?: string
): Promise<T> {
  const where = whereExtra ? { id, ...whereExtra } : { id };
  
   const query: any = { where };
   if (select) {
     query.select = select;
   }
 
   const resource = await model.findFirst(query);
  
  if (!resource) {
    throw new NotFoundError(errorMessage || 'Resource not found');
  }
  
  return resource as T;
}

/**
 * Paginate a query with automatic skip/limit calculation
 * Returns data, total count, and pagination metadata
 * 
 * @example
 * const result = await paginateQuery(
 *   prisma.resume,
 *   { userId },
 *   page,
 *   limit,
 *   { select: { id: true, title: true } },
 *   { updatedAt: 'desc' }
 * );
 */
export async function paginateQuery<T>(
  model: any,
  where: Record<string, any>,
  page: number = 1,
  limit: number = 20,
  selectOrInclude?: { select?: any; include?: any },
  orderBy?: Record<string, any>
): Promise<{
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const skip = (page - 1) * limit;
  
  const query = {
    where,
    skip,
    take: limit,
    ...(selectOrInclude || {}),
    ...(orderBy ? { orderBy } : {}),
  };

  const [data, total] = await Promise.all([
    model.findMany(query),
    model.count({ where }),
  ]);

  return {
    data: data as T[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Soft delete helper (set deletedAt timestamp)
 * 
 * @example
 * await softDelete('user', userId);
 */
export async function softDelete(
  model: keyof typeof prisma,
  id: string | number
): Promise<void> {
  const repository = prisma[model] as any;
  await repository.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

/**
 * Check if record exists
 * 
 * @example
 * const exists = await recordExists('user', { email: 'test@example.com' });
 */
export async function recordExists(
  model: keyof typeof prisma,
  where: Record<string, any>
): Promise<boolean> {
  const repository = prisma[model] as any;
  const count = await repository.count({ where });
  return count > 0;
}

/**
 * Get paginated results with total count
 * 
 * @example
 * const { data, total } = await getPaginated('resume', {
 *   where: { userId: '123' },
 *   skip: 0,
 *   take: 20,
 *   orderBy: { createdAt: 'desc' }
 * });
 */
export async function getPaginated<T>(
  model: keyof typeof prisma,
  params: {
    where?: Record<string, any>;
    skip?: number;
    take?: number;
    orderBy?: Record<string, any>;
    include?: Record<string, any>;
  }
): Promise<{ data: T[]; total: number }> {
  const repository = prisma[model] as any;

  const [data, total] = await Promise.all([
    repository.findMany(params),
    repository.count({ where: params.where }),
  ]);

  return { data, total };
}
