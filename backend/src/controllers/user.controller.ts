import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { z } from 'zod';
import path from 'path';

const userService = new UserService();

const updateProfileSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().optional(),
    currentRole: z.string().optional(),
    targetRole: z.string().optional(),
    industry: z.string().optional(),
    country: z.string().length(2).optional(), // ISO 3166 alpha-2
    preferences: z.object({
        defaultTemplate: z.string().optional(),
        language: z.string().optional(),
        notifications: z.boolean().optional(),
    }).optional(),
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
});

/** GET /users/me */
export const getMe = async (req: Request, res: Response) => {
    const user = await userService.getProfile(req.user!.userId);
    res.json({ success: true, data: { user } });
};

/** PUT /users/me */
export const updateMe = async (req: Request, res: Response) => {
    const data = updateProfileSchema.parse(req.body);
    const user = await userService.updateProfile(req.user!.userId, data);
    res.json({ success: true, message: 'Profile updated', data: { user } });
};

/** DELETE /users/me */
export const deleteMe = async (req: Request, res: Response) => {
    await userService.deleteAccount(req.user!.userId);
    res.json({ success: true, message: 'Account deleted successfully' });
};

/** PUT /users/me/password */
export const changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    await userService.changePassword(req.user!.userId, currentPassword, newPassword);
    res.json({ success: true, message: 'Password changed successfully' });
};

/** POST /users/me/avatar */
export const uploadAvatar = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // In production: upload req.file to S3 and get URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await userService.updateAvatar(req.user!.userId, avatarUrl);
    res.json({ success: true, message: 'Avatar updated', data: { user } });
};

/** GET /users/me/credits */
export const getCredits = async (req: Request, res: Response) => {
    const data = await userService.getCreditBalance(req.user!.userId);
    res.json({ success: true, data });
};

/** GET /users/me/usage */
export const getUsage = async (req: Request, res: Response) => {
    const data = await userService.getUsageStats(req.user!.userId);
    res.json({ success: true, data });
};

/** GET /users/me/referrals */
export const getReferrals = async (req: Request, res: Response) => {
    const data = await userService.getReferrals(req.user!.userId);
    res.json({ success: true, data });
};
