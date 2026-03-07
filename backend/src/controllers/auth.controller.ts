import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../utils/validation';

const authService = new AuthService();

// ── Handlers ───────────────────────────────────────────────────────────────

/** POST /auth/register */
export const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Account created. Please verify your email.',
    data: result
  });
};

/** POST /auth/login */
export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.json({ success: true, message: 'Login successful', data: result });
};

/** POST /auth/google */
export const googleAuth = async (req: Request, res: Response) => {
  const { googleToken } = req.body;
  const result = await authService.googleAuth(googleToken);
  res.json({ success: true, message: 'Google authentication successful', data: result });
};

/** POST /auth/refresh */
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshTokens(refreshToken);
  res.json({ success: true, message: 'Token refreshed', data: result });
};

/** POST /auth/logout */
export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
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

