/**
 * frontend/lib/api/invalidations.ts
 *
 * Cache invalidation rules for every mutation.
 * After create/update/delete, call the appropriate invalidate function
 * to clear affected queries from React Query cache.
 *
 * CRITICAL: Every mutation must invalidate the correct caches
 * or stale data will persist and confuse users.
 */

import { queryKeys } from '@/lib/query-keys';

/**
 * Resume mutations
 */
export const resumeInvalidations = {
  afterCreate: () => [
    queryKeys.resumes.all(),
    queryKeys.dashboard.stats(),
  ],

  afterUpdate: (resumeId: string) => [
    queryKeys.resumes.byId(resumeId),
    queryKeys.resumes.all(),
    queryKeys.dashboard.stats(),
  ],

  afterDelete: (resumeId: string) => [
    queryKeys.resumes.all(),
    queryKeys.resumes.versions(resumeId), // No point keeping versions
    queryKeys.dashboard.stats(),
  ],

  afterDuplicate: () => [
    queryKeys.resumes.all(),
  ],

  afterEnhance: (resumeId: string) => [
    queryKeys.resumes.byId(resumeId),
    queryKeys.user.credits(), // Credits deducted
  ],

  afterTailor: () => [
    queryKeys.resumes.tailorHistory(),
    queryKeys.user.credits(),
  ],

  afterGetATSScore: (resumeId: string) => [
    queryKeys.resumes.byId(resumeId), // ATS score updated
    queryKeys.user.credits(),
  ],

  afterVersionRestore: (resumeId: string) => [
    queryKeys.resumes.byId(resumeId),
    queryKeys.resumes.versions(resumeId),
  ],

  afterGeneratePDF: (resumeId: string) => [
    queryKeys.resumes.byId(resumeId), // PDF URL stored
  ],
};

/**
 * Document mutations
 */
export const documentInvalidations = {
  afterCreate: () => [
    queryKeys.documents.all(),
    queryKeys.dashboard.stats(),
  ],

  afterUpdate: (documentId: string) => [
    queryKeys.documents.byId(documentId),
    queryKeys.documents.all(),
  ],

  afterDelete: () => [
    queryKeys.documents.all(),
  ],

  afterGenerate: () => [
    queryKeys.documents.all(),
    queryKeys.user.credits(), // Credits deducted
  ],
};

/**
 * User mutations
 */
export const userInvalidations = {
  afterUpdateProfile: () => [
    queryKeys.user.me(),
  ],

  afterCreditDeduction: () => [
    queryKeys.user.credits(),
  ],

  afterPlanUpgrade: () => [
    queryKeys.user.me(),
    queryKeys.user.credits(),
  ],

  afterCreditAddition: () => [
    queryKeys.user.credits(),
  ],
};

/**
 * Billing mutations
 */
export const billingInvalidations = {
  afterCheckoutCreated: () => [
    queryKeys.user.me(),
  ],

  afterSubscriptionActivated: () => [
    queryKeys.user.me(),
    queryKeys.billing.plans(),
  ],

  afterSubscriptionCanceled: () => [
    queryKeys.user.me(),
  ],

  afterInvoiceCreated: () => [
    queryKeys.billing.plans(),
  ],
};

/**
 * Interview mutations
 */
export const interviewInvalidations = {
  afterSessionCreated: () => [
    // Interview sessions don't list typically, but invalidate if you track them
  ],

  afterSessionCompleted: () => [
    // Could track interview completion stats
  ],
};

/**
 * Dashboard mutations
 */
export const dashboardInvalidations = {
  // Usually just statistics after major changes
  afterResumeChange: () => [
    queryKeys.dashboard.stats(),
  ],

  afterDocumentChange: () => [
    queryKeys.dashboard.stats(),
  ],
};

/**
 * COMPOSITE: Full app invalidation (use sparingly!)
 * For use when the mutation affects multiple areas unpredictably
 */
export const globalInvalidations = {
  afterAuth: () => [
    queryKeys.user.me(),
    queryKeys.user.credits(),
    queryKeys.resumes.all(),
    queryKeys.documents.all(),
    queryKeys.dashboard.stats(),
  ],

  afterLogout: () => [
    // Don't invalidate — just clear local auth state
  ],
};

/**
 * Helper to batch multiple invalidations
 * @example
 * queryClient.invalidateQueries({
 *   queryKey: mergeInvalidations(
 *     resumeInvalidations.afterEnhance('123'),
 *     userInvalidations.afterCreditDeduction()
 *   )
 * })
 */
export function mergeInvalidations(...invalidations: any[][]): any[] {
  return Array.from(
    new Set(invalidations.flat().map(JSON.stringify))
  ).map(JSON.parse);
}
