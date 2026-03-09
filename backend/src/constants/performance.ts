import { env } from '@/config/env';

export const PERFORMANCE = {
  TARGETS_MS: {
    NON_AI_RESPONSE: env.PERF_NON_AI_RESPONSE_TARGET_MS,
    AI_FIRST_BYTE: env.PERF_AI_FIRST_BYTE_TARGET_MS,
    UPLOAD_QUEUE: env.PERF_UPLOAD_QUEUE_TARGET_MS,
  },
  RESPONSE_TIME_HEADER: 'X-Response-Time-Ms',
  FIRST_BYTE_HEADER: 'X-First-Byte-Ms',
} as const;
