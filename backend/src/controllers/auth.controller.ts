import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import {
  signupSchema,
  loginSchema,
  googleAuthSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/validation';
import { ApiError } from '../middleware/error';

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user with email and password
 * @access  Public
 */
export const signup = async (req: Request, res: Response) => {
  const validatedData = signupSchema.parse(req.body);
  const result = await authService.signup(validatedData);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: result,
  });
};

/**
 * @route   POST /api/auth/login
 * @desc    Login with email and password
 * @access  Public
 */
export const login = async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const result = await authService.login(validatedData);

  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
};

/**
 * @route   POST /api/auth/google
 * @desc    Login/Signup with Google OAuth
 * @access  Public
 */
export const googleAuth = async (req: Request, res: Response) => {
  const validatedData = googleAuthSchema.parse(req.body);
  const result = await authService.googleAuth(validatedData);

  res.json({
    success: true,
    message: 'Google authentication successful',
    data: result,
  });
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
export const refreshAccessToken = async (req: Request, res: Response) => {
  const validatedData = refreshTokenSchema.parse(req.body);
  const result = await authService.refreshToken(validatedData.refreshToken);

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  });
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
export const logout = async (req: Request, res: Response) => {
  const validatedData = refreshTokenSchema.parse(req.body);
  await authService.logout(validatedData.refreshToken);

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
export const forgotPassword = async (req: Request, res: Response) => {
  const validatedData = forgotPasswordSchema.parse(req.body);
  await authService.forgotPassword(validatedData.email);

  res.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
  });
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
export const resetPassword = async (req: Request, res: Response) => {
  const validatedData = resetPasswordSchema.parse(req.body);
  await authService.resetPassword(validatedData.token, validatedData.password);

  res.json({
    success: true,
    message: 'Password has been reset successfully',
  });
};
