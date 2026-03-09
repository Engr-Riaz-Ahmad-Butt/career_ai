import { Router } from 'express';
import {
    getCurrentUser,
    updateProfile,
} from '@/controllers/profile.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { updateProfileSchema } from '@/utils/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', getCurrentUser);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', validate(updateProfileSchema), updateProfile);

export default router;

