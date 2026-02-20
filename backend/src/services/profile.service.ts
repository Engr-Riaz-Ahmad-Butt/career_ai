import prisma from '../config/database';
import { ApiError } from '../middleware/error';

// Legacy service — kept for any older routes still referencing it.
// New code should use UserService in user.service.ts instead.
export class ProfileService {
    async getUserProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                plan: true,
                credits: true,
                phone: true,
                timezone: true,
                emailVerified: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });

        if (!user) throw new ApiError(404, 'User not found');
        return user;
    }

    async updateProfile(userId: string, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        timezone?: string;
        avatar?: string;
    }) {
        return prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                plan: true,
                credits: true,
                phone: true,
                timezone: true,
                emailVerified: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });
    }
}

export const profileService = new ProfileService();
