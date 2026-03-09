/**
 * Common database query patterns
 */

import prisma from '../config/database';

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
