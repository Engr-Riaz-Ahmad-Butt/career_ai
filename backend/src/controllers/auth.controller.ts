import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../utils/validation';

const authService = new AuthService();

// ── Cookie Config ──────────────────────────────────────────────────────────

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/',
};

/** Helper: set refresh token as HttpOnly cookie */
function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
}

// ── Handlers ───────────────────────────────────────────────────────────────

/** POST /auth/register */
export const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  const { accessToken, refreshToken, user } = result;

  setRefreshCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Account created. Please verify your email.',
    data: { accessToken, user },
  });
};

/** POST /auth/login */
export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  const { accessToken, refreshToken, user } = result;

  setRefreshCookie(res, refreshToken);

  res.json({
    success: true,
    message: 'Login successful',
    data: { accessToken, user },
  });
};

/** POST /auth/google */
export const googleAuth = async (req: Request, res: Response) => {
  const { googleToken } = req.body;
  const result = await authService.googleAuth(googleToken);
  const { accessToken, refreshToken, user } = result;

  setRefreshCookie(res, refreshToken);

  res.json({
    success: true,
    message: 'Google authentication successful',
    data: { accessToken, user },
  });
};

/** POST /auth/refresh  — reads refreshToken from HttpOnly cookie */
export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'No refresh token provided',
    });
  }

  const result = await authService.refreshTokens(refreshToken);
  const { accessToken, refreshToken: newRefreshToken, user } = result;

  // Rotate: issue new cookie with rotated refresh token
  setRefreshCookie(res, newRefreshToken);

  res.json({
    success: true,
    message: 'Token refreshed',
    data: { accessToken, user },
  });
};

/** POST /auth/logout — clears HttpOnly cookie */
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    // Best-effort revoke in DB (don't throw if it fails)
    try {
      await authService.logout(refreshToken);
    } catch {
      // already expired or revoked — that's fine
    }
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully' });
};

/** POST /auth/forgot-password */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
};

/** POST /auth/reset-password */
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  res.json({ success: true, message: 'Password reset successfully' });
};

/** POST /auth/verify-email */
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;
  const result = await authService.verifyEmail(token);
  res.json({ success: true, message: result.message });
};

/** POST /auth/resend-verification */
export const resendVerification = async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.resendVerification(email);
  res.json({ success: true, message: 'Verification email sent if account exists.' });
};
