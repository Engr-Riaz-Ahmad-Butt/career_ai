import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/services/auth.service';
import prisma from '../src/config/database';

// Mock prisma
jest.mock('../src/config/database', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// Mock password utils
jest.mock('../src/utils/password', () => ({
    hashPassword: jest.fn<any>().mockResolvedValue('hashed_password'),
    comparePassword: jest.fn<any>().mockResolvedValue(true),
}));

// Mock JWT utils
jest.mock('../src/utils/jwt', () => ({
    generateAccessToken: jest.fn<any>().mockReturnValue('access_token'),
    generateRefreshToken: jest.fn<any>().mockReturnValue('refresh_token'),
    getRefreshTokenExpiry: jest.fn<any>().mockReturnValue(new Date()),
}));

import { hashPassword, comparePassword } from '../src/utils/password';

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        authService = new AuthService();
    });

    const testUser = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
    };

    describe('register', () => {
        it('should create a new user', async () => {
            // Setup mock
            prismaMock.user.findUnique.mockResolvedValue(null);
            prismaMock.user.create.mockResolvedValue({
                id: 'user-id',
                email: testUser.email,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                plan: 'FREE',
                credits: 10,
                createdAt: new Date(),
            } as any);

            prismaMock.creditTransaction.create.mockResolvedValue({} as any);
            prismaMock.refreshToken.create.mockResolvedValue({} as any);

            const result = await authService.register(testUser);

            expect(result).toHaveProperty('user');
            expect(result.user.email).toBe(testUser.email);
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
        });

        it('should throw error if user already exists', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 'existing' } as any);

            await expect(authService.register(testUser)).rejects.toHaveProperty('statusCode', 409);
        });
    });

    describe('login', () => {
        it('should login with valid credentials', async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: testUser.email,
                password: 'hashed_password',
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                isActive: true,
                plan: 'FREE',
                credits: 10,
            } as any);

            (comparePassword as any).mockResolvedValue(true);
            prismaMock.refreshToken.create.mockResolvedValue({} as any);
            prismaMock.user.update.mockResolvedValue({} as any);

            const result = await authService.login({ email: testUser.email, password: testUser.password });

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(result.user?.email).toBe(testUser.email);
        });

        it('should throw error with invalid credentials', async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: testUser.email,
                password: 'hashed_password',
                isActive: true,
            } as any);

            (comparePassword as any).mockResolvedValue(false);

            await expect(authService.login({ email: testUser.email, password: 'WrongPassword' }))
                .rejects.toHaveProperty('statusCode', 401);
        });

        it('should throw error if user not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(authService.login({ email: testUser.email, password: testUser.password }))
                .rejects.toHaveProperty('statusCode', 401);
        });
    });
});
