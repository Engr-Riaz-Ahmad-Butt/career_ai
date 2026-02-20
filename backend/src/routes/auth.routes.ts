import { Router } from 'express';
import {
  signup,
  login,
  googleAuth,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user with email/password
 * @access  Public
 */
router.post('/signup', asyncHandler(signup));

/**
 * @route   POST /api/auth/login
 * @desc    Login with email/password
 * @access  Public
 */
router.post('/login', asyncHandler(login));

/**
 * @route   POST /api/auth/google
 * @desc    Login/Signup with Google OAuth
 * @access  Public
 */
router.post('/google', asyncHandler(googleAuth));

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', asyncHandler(refreshAccessToken));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (invalidate refresh token)
 * @access  Public
 */
router.post('/logout', asyncHandler(logout));

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', asyncHandler(forgotPassword));

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password', asyncHandler(resetPassword));

export default router;
