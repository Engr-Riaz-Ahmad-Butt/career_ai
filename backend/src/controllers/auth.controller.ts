import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const authService = new AuthService();

// ── Validators ─────────────────────────────────────────────────────────────

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  referralCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const googleSchema = z.object({ googleToken: z.string() });
const refreshSchema = z.object({ refreshToken: z.string() });
const forgotSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({ token: z.string(), newPassword: z.string().min(8) });
const verifySchema = z.object({ token: z.string() });
const resendSchema = z.object({ email: z.string().email() });

// ── Handlers ───────────────────────────────────────────────────────────────

/** POST /auth/register */
export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const result = await authService.register(data);
  res.status(201).json({ success: true, message: 'Account created. Please verify your email.', data: result });
};

/** POST /auth/login */
export const login = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const result = await authService.login(data);
  res.json({ success: true, message: 'Login successful', data: result });
};

/** POST /auth/google */
export const googleAuth = async (req: Request, res: Response) => {
  const { googleToken } = googleSchema.parse(req.body);
  const result = await authService.googleAuth(googleToken);
  res.json({ success: true, message: 'Google authentication successful', data: result });
};

/** POST /auth/refresh */
export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = refreshSchema.parse(req.body);
  const result = await authService.refreshTokens(refreshToken);
  res.json({ success: true, message: 'Token refreshed', data: result });
};

/** POST /auth/logout */
export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = refreshSchema.parse(req.body);
  await authService.logout(refreshToken);
  res.json({ success: true, message: 'Logged out successfully' });
};

/** POST /auth/forgot-password */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = forgotSchema.parse(req.body);
  await authService.forgotPassword(email);
  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
};

/** POST /auth/reset-password */
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = resetSchema.parse(req.body);
  await authService.resetPassword(token, newPassword);
  res.json({ success: true, message: 'Password reset successfully' });
};

/** POST /auth/verify-email */
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = verifySchema.parse(req.body);
  const result = await authService.verifyEmail(token);
  res.json({ success: true, message: result.message });
};

/** POST /auth/resend-verification */
export const resendVerification = async (req: Request, res: Response) => {
  const { email } = resendSchema.parse(req.body);
  await authService.resendVerification(email);
  res.json({ success: true, message: 'Verification email sent if account exists.' });
};
