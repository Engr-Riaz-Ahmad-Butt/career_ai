import { Request, Response } from 'express';
import { FILE_UPLOAD } from '@/constants/fileUpload';
import { UserService } from '@/services/user.service';
import { asyncHandler } from '@/middleware/error';

const userService = new UserService();

/** GET /users/me */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getProfile(req.user!.userId);
    res.json({ success: true, data: { user } });
});

/** PUT /users/me */
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user!.userId, req.body);
    res.json({ success: true, message: 'Profile updated', data: { user } });
});

/** DELETE /users/me */
export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
    await userService.deleteAccount(req.user!.userId);
    res.json({ success: true, message: 'Account deleted successfully' });
});

/** PUT /users/me/password */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.user!.userId, currentPassword, newPassword);
    res.json({ success: true, message: 'Password changed successfully' });
});

/** POST /users/me/avatar */
export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // In production: upload req.file to S3 and get URL
    const avatarUrl = `${FILE_UPLOAD.AVATAR.URL_PREFIX}${req.file.filename}`;
    const user = await userService.updateAvatar(req.user!.userId, avatarUrl);
    res.json({ success: true, message: 'Avatar updated', data: { user } });
});

/** GET /users/me/credits */
export const getCredits = asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.getCreditBalance(req.user!.userId);
    res.json({ success: true, data });
});

/** GET /users/me/usage */
export const getUsage = asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.getUsageStats(req.user!.userId);
    res.json({ success: true, data });
});

/** GET /users/me/referrals */
export const getReferrals = asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.getReferrals(req.user!.userId);
    res.json({ success: true, data });
});

