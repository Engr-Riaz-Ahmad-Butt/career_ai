import { Request, Response } from 'express';
import { profileService } from '../services/profile.service';
import { updateProfileSchema } from '../utils/validation';
import { ApiError } from '../middleware/error';

/**
 * @route   GET /api/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getCurrentUser = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(401, 'Not authenticated');
    }

    const user = await profileService.getUserProfile(req.user.userId);

    res.json({
        success: true,
        data: { user },
    });
};

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new ApiError(401, 'Not authenticated');
    }

    const validatedData = updateProfileSchema.parse(req.body);
    const user = await profileService.updateProfile(req.user.userId, validatedData);

    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user },
    });
};
