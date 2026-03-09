import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT } from '@/constants/jwt';

export interface TokenPayload {
  userId: string;
  email: string;
  plan: string;
}

/**
 * Generate Access Token (short-lived)
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT.ACCESS_SECRET as jwt.Secret, {
    expiresIn: JWT.ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Generate Refresh Token (long-lived)
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT.REFRESH_SECRET as jwt.Secret, {
    expiresIn: JWT.REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT.ACCESS_SECRET as jwt.Secret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT.REFRESH_SECRET as jwt.Secret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Generate random token (for email verification, password reset)
 */
export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Calculate token expiration date
 */
export const getRefreshTokenExpiry = (): Date => {
  return new Date(Date.now() + JWT.REFRESH_EXPIRES_IN_MS);
};
