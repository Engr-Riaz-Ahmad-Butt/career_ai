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
    hashPassword: jest.fn().mockResolvedValue('hashed_password'),
    comparePassword: jest.fn().mockResolvedValue(true),
}));

// Mock JWT utils
jest.mock('../src/utils/jwt', () => ({
    generateAccessToken: jest.fn().mockReturnValue('access_token'),
    generateRefreshToken: jest.fn().mockReturnValue('refresh_token'),
    getRefreshTokenExpiry: jest.fn().mockReturnValue(new Date()),
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
        name: 'Test User'
    };

    describe('signup', () => {
        it('should create a new user', async () => {
            // Setup mock
            prismaMock.user.findUnique.mockResolvedValue(null);
            prismaMock.user.create.mockResolvedValue({
                id: 'user-id',
                email: testUser.email,
                name: testUser.name,
                plan: 'FREE',
                credits: 10,
                createdAt: new Date(),
                // Add other required fields if any, or cast as any if types are annoying
            } as any);

            // We need to mock create for refreshToken too as generateTokens calls it
            prismaMock.refreshToken.create.mockResolvedValue({} as any);

            const result = await authService.signup(testUser);

            expect(result).toHaveProperty('user');
            expect(result.user.email).toBe(testUser.email);
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
        });

        it('should throw error if user already exists', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 'existing' } as any);

            await expect(authService.signup(testUser)).rejects.toHaveProperty('statusCode', 409);
        });
    });

    describe('login', () => {
        it('should login with valid credentials', async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: testUser.email,
                password: 'hashed_password',
                isActive: true,
                plan: 'FREE',
                credits: 10,
            } as any);

            (comparePassword as jest.Mock).mockResolvedValue(true);
            prismaMock.refreshToken.create.mockResolvedValue({} as any);
            prismaMock.user.update.mockResolvedValue({} as any);

            const result = await authService.login({ email: testUser.email, password: testUser.password });

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(result.user.email).toBe(testUser.email);
        });

        it('should throw error with invalid credentials', async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 'user-id',
                email: testUser.email,
                password: 'hashed_password',
                isActive: true,
            } as any);

            (comparePassword as jest.Mock).mockResolvedValue(false);

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
