import { env } from '@/config/env';

const DURATION_UNIT_TO_MS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
} as const;

function durationToMilliseconds(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const amount = Number(match[1]);
  const unit = match[2] as keyof typeof DURATION_UNIT_TO_MS;
  return amount * DURATION_UNIT_TO_MS[unit];
}

export const JWT = {
  ACCESS_SECRET: env.JWT_SECRET,
  REFRESH_SECRET: env.JWT_REFRESH_SECRET,
  ACCESS_EXPIRES_IN: env.JWT_EXPIRES_IN,
  REFRESH_EXPIRES_IN: env.JWT_REFRESH_EXPIRES_IN,
  REFRESH_EXPIRES_IN_MS: durationToMilliseconds(env.JWT_REFRESH_EXPIRES_IN),
  REFRESH_COOKIE_MAX_AGE_MS: env.AUTH_REFRESH_COOKIE_MAX_AGE_MS,
} as const;
