import { Request, Response } from 'express';
import { profileService } from '@/services/profile.service';
import { asyncHandler } from '@/middleware/error';
import { UnauthorizedError, ValidationError } from '@/utils/errorHandler';

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Ensure user is authenticated */
function requireAuth(userId?: string): void {
  if (!userId) throw new UnauthorizedError();
}

// ── Handlers ────────────────────────────────────────────────────────────────

/**
 * @route   GET /api/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  requireAuth(req.user?.userId);

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
  requireAuth(req.user?.userId);
  if (!req.body || typeof req.body !== 'object') throw new ValidationError('Invalid request body');

  const { fullName, ...rest } = req.body;
  const updateData: any = { ...rest };

  if (fullName) {
    const [firstName, ...lastParts] = fullName.trim().split(/\s+/);
    updateData.firstName = firstName;
    updateData.lastName = lastParts.join(' ');
  }

  const user = await profileService.updateProfile(req.user!.userId, updateData);
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

