import { Router } from 'express';
import {
    getCurrentUser,
    updateProfile,
} from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', asyncHandler(getCurrentUser));

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', asyncHandler(updateProfile));

export default router;
