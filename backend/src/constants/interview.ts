import { env } from '@/config/env';

export const INTERVIEW = {
  DEFAULT_QUESTION_COUNT: env.INTERVIEW_DEFAULT_QUESTION_COUNT,
} as const;
