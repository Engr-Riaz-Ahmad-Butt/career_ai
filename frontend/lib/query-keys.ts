/**
 * lib/query-keys.ts
 *
 * Centralized React Query key factory.
 * All hooks must use these keys — never define raw string arrays in hooks.
 *
 * This ensures consistent cache invalidation across the entire app.
 * When a mutation invalidates ['resumes'], ALL resume list queries are invalidated
 * regardless of which component triggered it.
 */

export const queryKeys = {
    // ── User ───────────────────────────────────────────────────────────────

    user: {
        all: () => ['user'] as const,
        me: () => ['user', 'me'] as const,
        credits: () => ['user', 'credits'] as const,
        creditHistory: (page?: number) =>
            ['user', 'credits', 'history', page ?? 1] as const,
    },

    // ── Resumes ────────────────────────────────────────────────────────────

    resumes: {
        all: () => ['resumes'] as const,
        byId: (id: string) => ['resumes', id] as const,
        versions: (id: string) => ['resumes', id, 'versions'] as const,
        tailorHistory: () => ['resumes', 'tailor', 'history'] as const,
    },

    // ── Documents ──────────────────────────────────────────────────────────

    documents: {
        all: () => ['documents'] as const,
        byType: (type: string) => ['documents', { type }] as const,
        byId: (id: string) => ['documents', id] as const,
    },

    // ── Dashboard ──────────────────────────────────────────────────────────

    dashboard: {
        stats: () => ['dashboard', 'stats'] as const,
        activity: () => ['dashboard', 'activity'] as const,
    },

    // ── Billing ────────────────────────────────────────────────────────────

    billing: {
        plans: () => ['billing', 'plans'] as const,
        subscription: () => ['billing', 'subscription'] as const,
    },

    // ── Interview ──────────────────────────────────────────────────────────

    interview: {
        history: () => ['interview', 'history'] as const,
        byId: (id: string) => ['interview', id] as const,
    },

    // ── Jobs (polling) ─────────────────────────────────────────────────────

    jobs: {
        byId: (jobId: string) => ['jobs', jobId] as const,
    },
} as const;

/**
 * Cache invalidation helpers — use these in useMutation's onSuccess.
 *
 * Example:
 *   onSuccess: () => {
 *     queryClient.invalidateQueries({ queryKey: invalidationKeys.afterResumeCreate() })
 *   }
 */
export const invalidationKeys = {
    // After creating a new resume
    afterResumeCreate: () => queryKeys.resumes.all(),

    // After updating resume content (title, sections, etc.)
    afterResumeUpdate: (id: string) => queryKeys.resumes.byId(id),
    afterResumeListRefresh: () => queryKeys.resumes.all(),

    // After deleting a resume
    afterResumeDelete: () => queryKeys.resumes.all(),

    // After AI enhance on a resume
    afterAiEnhance: (id: string) => queryKeys.resumes.byId(id),

    // After any AI action that costs credits
    afterCreditDeduction: () => queryKeys.user.credits(),

    // After upgrading plan
    afterPlanUpgrade: () => queryKeys.user.all(),
} as const;
