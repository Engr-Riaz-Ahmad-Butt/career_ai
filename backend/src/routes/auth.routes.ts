import { Router } from 'express';
import {
  signup,
  login,
  googleAuth,
  refreshAccessToken,
  logout,
  getCurrentUser,
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
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, asyncHandler(getCurrentUser));

export default router;
