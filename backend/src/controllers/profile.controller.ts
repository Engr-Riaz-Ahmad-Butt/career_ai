import { Request, Response } from 'express';
import { profileService } from '../services/profile.service';
import { asyncHandler } from '../middleware/error';

/**
 * @route   GET /api/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await profileService.getUserProfile(req.user!.userId);
    res.json({
        success: true,
        data: { user },
    });
});

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await profileService.updateProfile(req.user!.userId, req.body);
    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user },
    });
});

