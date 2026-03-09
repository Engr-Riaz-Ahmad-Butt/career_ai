/**
 * lib/query-config.ts
 *
 * Centralized React Query staleTime and gcTime constants.
 * Import from here — never hardcode query config in individual hooks.
 *
 * staleTime: how long data is considered fresh (no refetch on focus/mount)
 * gcTime:    how long inactive query data stays in cache before garbage collected
 */

export const STALE_TIMES = {
    /** User profile — changes infrequently */
    USER_PROFILE: 10 * 60 * 1000,       // 10 minutes
    /** Credit balance — can change after any AI action */
    USER_CREDITS: 1 * 60 * 1000,        // 1 minute
    /** Resume list — user navigates here often */
    RESUME_LIST: 5 * 60 * 1000,         // 5 minutes
    /** Single resume — user might be editing */
    RESUME_DETAIL: 2 * 60 * 1000,       // 2 minutes
    /** Dashboard stats */
    DASHBOARD_STATS: 5 * 60 * 1000,     // 5 minutes
    /** Templates — basically static */
    TEMPLATES: 60 * 60 * 1000,          // 60 minutes
    /** Billing plans — basically static */
    BILLING_PLANS: 60 * 60 * 1000,      // 60 minutes
    /** Documents list */
    DOCUMENT_LIST: 5 * 60 * 1000,       // 5 minutes
    /** Version history */
    VERSION_HISTORY: 5 * 60 * 1000,     // 5 minutes
} as const;

export const GC_TIMES = {
    USER_PROFILE: 30 * 60 * 1000,       // 30 minutes
    USER_CREDITS: 10 * 60 * 1000,       // 10 minutes
    RESUME_LIST: 30 * 60 * 1000,        // 30 minutes
    RESUME_DETAIL: 20 * 60 * 1000,      // 20 minutes
    DASHBOARD_STATS: 30 * 60 * 1000,    // 30 minutes
    TEMPLATES: 120 * 60 * 1000,         // 120 minutes
    BILLING_PLANS: 120 * 60 * 1000,     // 120 minutes
    DOCUMENT_LIST: 30 * 60 * 1000,      // 30 minutes
    VERSION_HISTORY: 15 * 60 * 1000,    // 15 minutes
} as const;
