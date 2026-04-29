import { Request, Response } from 'express';
import { env } from '@/config/env';
import { JWT } from '@/constants/jwt';
import { AuthService } from '@/services/auth.service';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '@/utils/validation';
import { successResponse, errorResponse } from '@/utils/apiResponse';
import { asyncHandler } from '@/middleware/error';
import { ValidationError } from '@/utils/errorHandler';

const authService = new AuthService();

// ── Cookie Config ──────────────────────────────────────────────────────────

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: JWT.REFRESH_COOKIE_MAX_AGE_MS,
  path: '/',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Set refresh token as HttpOnly cookie */
function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
}

/** Clear refresh token cookie */
function clearRefreshCookie(res: Response): void {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

function sendAuthResponse(
  res: Response,
  statusCode: number,
  refreshToken: string,
  accessToken: string,
  user: unknown,
  message: string
): void {
  setRefreshCookie(res, refreshToken);
  res.status(statusCode).json(
    successResponse({ accessToken, user }, message)
  );
}

/**  Handlers ───────────────────────────────────────────────────────────────*/

/** POST /auth/register */
export const register = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') throw new ValidationError('Invalid request body');

  const result = await authService.register(req.body);
  sendAuthResponse(res, 201, result.refreshToken, result.accessToken, result.user, 'Account created. Please verify your email.');
});

/** POST /auth/login */
export const login = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') throw new ValidationError('Invalid request body');

  const result = await authService.login(req.body);
  sendAuthResponse(res, 200, result.refreshToken, result.accessToken, result.user, 'Login successful');
});

/** POST /auth/google */
export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body?.googleToken) throw new ValidationError('Google token is required');

  const result = await authService.googleAuth(req.body.googleToken);
  sendAuthResponse(res, 200, result.refreshToken, result.accessToken, result.user, 'Google authentication successful');
});

/** GET /auth/github — initiates GitHub OAuth flow */
export const githubLogin = asyncHandler(async (req: Request, res: Response) => {
  const crypto = await import('crypto');
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID || '',
    redirect_uri: env.GITHUB_CALLBACK_URL,
    scope: 'repo user:email',
    state: crypto.randomBytes(16).toString('hex'), // CSRF protection
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

/** GET /auth/github/callback — handle GitHub redirect */
export const githubCallback = asyncHandler(async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error || !code) {
    res.redirect(`${env.FRONTEND_URL}/auth/login?error=github_denied`);
    return;
  }

  try {
    const result = await authService.loginWithGitHub(code as string);
    setRefreshCookie(res, result.refreshToken);
    res.redirect(`${env.FRONTEND_URL}/auth/github/success?token=${result.accessToken}`);
  } catch (err) {
    res.redirect(`${env.FRONTEND_URL}/auth/login?error=github_failed`);
  }
});

/** POST /auth/refresh — reads refreshToken from HttpOnly cookie */
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json(errorResponse('No refresh token provided', 'UNAUTHORIZED'));
  }

  const result = await authService.refreshTokens(refreshToken);
  sendAuthResponse(res, 200, result.refreshToken, result.accessToken, result.user, 'Token refreshed');
});

/** POST /auth/logout — clears HttpOnly cookie */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    try {
      await authService.logout(refreshToken);
    } catch {
      // Already expired or revoked — that's fine
    }
  }

  clearRefreshCookie(res);
  res.json(successResponse({}, 'Logged out successfully'));
});

/** POST /auth/forgot-password */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body?.email) throw new ValidationError('Email is required');

  await authService.forgotPassword(req.body.email);
  res.json(successResponse({}, 'If that email exists, a reset link has been sent.'));
});

/** POST /auth/reset-password */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body?.token || !req.body?.newPassword) throw new ValidationError('Token and password are required');

  await authService.resetPassword(req.body.token, req.body.newPassword);
  res.json(successResponse({}, 'Password reset successfully'));
});

/** POST /auth/verify-email */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body?.token) throw new ValidationError('Verification token is required');

  const result = await authService.verifyEmail(req.body.token);
  res.json(successResponse({}, result.message));
});

/** POST /auth/resend-verification */
export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body?.email) throw new ValidationError('Email is required');

  await authService.resendVerification(req.body.email);
  res.json(successResponse({}, 'Verification email sent if account exists.'));
});
