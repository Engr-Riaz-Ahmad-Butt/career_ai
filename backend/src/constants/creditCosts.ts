/**
 * backend/src/constants/creditCosts.ts
 *
 * Credit cost for each AI action.
 * Used in middleware to check if user has sufficient credits.
 * These are the baseline costs — plans may offer multipliers.
 *
 * Example: PRO plan gets 0.8x multiplier on all costs
 */

import { env } from '@/config/env';

export const CREDIT_COSTS = {
  // Resume actions
  RESUME_ENHANCE: env.CREDIT_COST_RESUME_ENHANCE,
  RESUME_TAILOR: env.CREDIT_COST_RESUME_TAILOR,
  ATS_SCORE: env.CREDIT_COST_ATS_SCORE,
  RESUME_IMPROVE: env.CREDIT_COST_RESUME_IMPROVE,

  // Document generation
  COVER_LETTER_GENERATE: env.CREDIT_COST_COVER_LETTER_GENERATE,
  SOP_GENERATE: env.CREDIT_COST_SOP_GENERATE,
  BIO_GENERATE: env.CREDIT_COST_BIO_GENERATE,
  MOTIVATION_LETTER_GENERATE: env.CREDIT_COST_MOTIVATION_LETTER_GENERATE,
  RESIGNATION_LETTER_GENERATE: env.CREDIT_COST_RESIGNATION_LETTER_GENERATE,
  RECOMMENDATION_GENERATE: env.CREDIT_COST_RECOMMENDATION_GENERATE,
  SCHOLARSHIP_GENERATE: env.CREDIT_COST_SCHOLARSHIP_GENERATE,
  NETWORKING_GENERATE: env.CREDIT_COST_NETWORKING_GENERATE,
  ACCEPTANCE_GENERATE: env.CREDIT_COST_ACCEPTANCE_GENERATE,

  // Interview & communication
  INTERVIEW_GENERATE: env.CREDIT_COST_INTERVIEW_GENERATE,
  COMMUNICATION_ANALYZE: env.CREDIT_COST_COMMUNICATION_ANALYZE,

  // Utilities
  KEYWORD_EXTRACT: env.CREDIT_COST_KEYWORD_EXTRACT,
  GRAMMAR_FIX: env.CREDIT_COST_GRAMMAR_FIX,
  FILE_UPLOAD_PARSE: env.CREDIT_COST_FILE_UPLOAD_PARSE,
  PORTFOLIO_GENERATE: env.CREDIT_COST_PORTFOLIO_GENERATE,

  // Portfolio
  PORTFOLIO_DEPLOY: env.CREDIT_COST_PORTFOLIO_DEPLOY,
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
  FREE: env.CREDIT_PLAN_MULTIPLIER_FREE,
  PRO: env.CREDIT_PLAN_MULTIPLIER_PRO,
  TEAM: env.CREDIT_PLAN_MULTIPLIER_TEAM,
  ENTERPRISE: env.CREDIT_PLAN_MULTIPLIER_ENTERPRISE,
} as const;
