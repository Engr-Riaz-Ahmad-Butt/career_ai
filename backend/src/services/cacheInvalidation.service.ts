/**
 * backend/src/services/cache-invalidation.service.ts
 *
 * Centralized cache invalidation rules
 * Automatically clear caches when data is modified
 *
 * Usage:
 *   await invalidateResume(resumeId);
 *   await invalidateAllForUser(userId);
 */

import { getCacheService, CacheService } from './cache.service';

const cache = getCacheService();

/**
 * Resume-related cache keys to invalidate on updates
 */
export async function invalidateResume(resumeId: string): Promise<number> {
  return cache.invalidatePattern(`resume:${resumeId}:*`);
}

/**
 * Invalid all caches for a user
 */
export async function invalidateAllForUser(userId: string): Promise<number> {
  return cache.invalidatePattern(`user:${userId}:*`);
}

/**
 * Invalidate ATS score cache specifically
 */
export async function invalidateATSScore(resumeId: string): Promise<number> {
  return cache.invalidatePattern(`resume:${resumeId}:ats:*`);
}

/**
 * Invalidate resume enhancement cache
 */
export async function invalidateEnhancementCache(resumeId: string): Promise<number> {
  return cache.invalidatePattern(`resume:${resumeId}:enhance:*`);
}

/**
 * Invalidate keyword extraction cache
 */
export async function invalidateKeywordCache(): Promise<number> {
  return cache.invalidatePattern(`keyword:*`);
}

/**
 * Invalidate document cache
 */
export async function invalidateDocument(documentId: string): Promise<number> {
  return cache.invalidatePattern(`document:${documentId}:*`);
}

/**
 * Invalidate all caches after user plan upgrade
 * Plan changes affect credit costs
 */
export async function invalidateAfterPlanUpgrade(userId: string): Promise<number> {
  return invalidateAllForUser(userId);
}

/**
 * Batch invalidation — cleared multiple related caches
 */
export async function invalidateBatch(patterns: string[]): Promise<number> {
  let cleared = 0;
  for (const pattern of patterns) {
    cleared += await cache.invalidatePattern(pattern);
  }
  return cleared;
}

export const cacheInvalidations = {
  // Resume updates
  afterResumeUpdate: (resumeId: string) => invalidateResume(resumeId),
  afterResumeDelete: (resumeId: string) => invalidateResume(resumeId),
  
  // AI operations
  afterEnhance: (resumeId: string) => invalidateEnhancementCache(resumeId),
  afterATS: (resumeId: string) => invalidateATSScore(resumeId),
  
  // Document updates
  afterDocumentUpdate: (documentId: string) => invalidateDocument(documentId),
  afterDocumentDelete: (documentId: string) => invalidateDocument(documentId),
  
  // User changes
  afterPlanUpgrade: (userId: string) => invalidateAfterPlanUpgrade(userId),
  
  // Batch operations
  afterBatch: (patterns: string[]) => invalidateBatch(patterns),
};
