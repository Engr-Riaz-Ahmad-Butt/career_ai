import prisma from '../config/database';
import { ApiError } from '../middleware/error';

export class ProfileService {
    async getUserProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                plan: true,
                credits: true,
                phone: true,
                location: true,
                timezone: true,
                emailVerified: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return user;
    }

    async updateProfile(userId: string, data: {
        name?: string;
        phone?: string;
        location?: string;
        timezone?: string;
        avatar?: string
    }) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                plan: true,
                credits: true,
                phone: true,
                location: true,
                timezone: true,
                emailVerified: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });

        return user;
    }
}

export const profileService = new ProfileService();
