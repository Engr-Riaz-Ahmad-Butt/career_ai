/**
 * backend/src/constants/creditCosts.ts
 *
 * Credit cost for each AI action.
 * Used in middleware to check if user has sufficient credits.
 * These are the baseline costs — plans may offer multipliers.
 *
 * Example: PRO plan gets 0.8x multiplier on all costs
 */

export const CREDIT_COSTS = {
  // Resume actions
  RESUME_ENHANCE: 1,
  RESUME_TAILOR: 2,
  ATS_SCORE: 1,
  RESUME_IMPROVE: 1,

  // Document generation
  COVER_LETTER_GENERATE: 2,
  SOP_GENERATE: 3,
  BIO_GENERATE: 1,
  MOTIVATION_LETTER_GENERATE: 2,
  RESIGNATION_LETTER_GENERATE: 1,
  RECOMMENDATION_GENERATE: 2,
  SCHOLARSHIP_GENERATE: 3,
  NETWORKING_GENERATE: 1,
  ACCEPTANCE_GENERATE: 1,

  // Interview & communication
  INTERVIEW_GENERATE: 2,
  COMMUNICATION_ANALYZE: 1,

  // Utilities
  KEYWORD_EXTRACT: 0.5,
  GRAMMAR_FIX: 0.5,
  FILE_UPLOAD_PARSE: 1,
  PORTFOLIO_GENERATE: 5,

  // Portfolio
  PORTFOLIO_DEPLOY: 2,
} as const;

export type CreditActionType = keyof typeof CREDIT_COSTS;

/**
 * Get the credit cost for an action.
 * Optionally apply a plan-based multiplier.
 *
 * @example
 * getCreditCost('RESUME_TAILOR', 'PRO') // 1.6 (2 * 0.8)
 * getCreditCost('COVER_LETTER_GENERATE', 'FREE') // 2
 */
export function getCreditCost(
  action: CreditActionType,
  planMultiplier: number = 1
): number {
  return Math.ceil(CREDIT_COSTS[action] * planMultiplier);
}

/**
 * Plan-based cost multipliers.
 * FREE plan pays full price, PRO gets discount, etc.
 */
export const PLAN_MULTIPLIERS = {
  FREE: 1,
  PRO: 0.8,
  TEAM: 0.6,
  ENTERPRISE: 0.4,
} as const;
