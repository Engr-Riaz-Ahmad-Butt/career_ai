import { AuthService } from '../services/auth.service';
import prisma from '../config/database';
import { createUser } from './factories/user.factory';

const authService = new AuthService();

describe('AuthService', () => {
    // ── register ─────────────────────────────────────────────────────────

    describe('register', () => {
        it('creates a new user and returns tokens', async () => {
            const email = `test-${Date.now()}@example.com`;
            const result = await authService.register({
                firstName: 'John',
                lastName: 'Doe',
                email,
                password: 'Password123!',
            });

            expect(result.user).toBeDefined();
            expect(result.user?.email).toBe(email);
            expect(result.accessToken).toBeTruthy();
            expect(result.refreshToken).toBeTruthy();
        });

        it('assigns 10 signup bonus credits', async () => {
            const email = `credits-${Date.now()}@example.com`;
            const result = await authService.register({
                firstName: 'Jane',
                lastName: 'Doe',
                email,
                password: 'Password123!',
            });

            const user = await prisma.user.findUnique({ where: { id: result.user!.id } });
            expect(user?.credits).toBe(10);

            const transaction = await prisma.creditTransaction.findFirst({
                where: { userId: result.user!.id, type: 'SIGNUP_BONUS' },
            });
            expect(transaction).toBeDefined();
            expect(transaction?.amount).toBe(10);
        });

        it('throws 409 if email already registered', async () => {
            const existingUser = await createUser();

            await expect(
                authService.register({
                    firstName: 'Dup',
                    lastName: 'User',
                    email: existingUser.email,
                    password: 'Password123!',
                })
            ).rejects.toMatchObject({ statusCode: 409 });
        });

        it('awards referral bonus to referrer when valid referral code used', async () => {
            const referrer = await createUser({ credits: 10 });

            const result = await authService.register({
                firstName: 'Referred',
                lastName: 'User',
                email: `referred-${Date.now()}@example.com`,
                password: 'Password123!',
                referralCode: referrer.referralCode,
            });

            const updatedReferrer = await prisma.user.findUnique({ where: { id: referrer.id } });
            expect(updatedReferrer?.credits).toBe(15); // 10 original + 5 bonus

            const referralTx = await prisma.creditTransaction.findFirst({
                where: { userId: referrer.id, type: 'REFERRAL' },
            });
            expect(referralTx).toBeDefined();
            expect(result.user?.id).toBeDefined();
        });

        it('stores a hashed password (not plaintext)', async () => {
            const email = `hash-${Date.now()}@example.com`;
            const password = 'Password123!';
            const result = await authService.register({
                firstName: 'Hash',
                lastName: 'Test',
                email,
                password,
            });

            const dbUser = await prisma.user.findUnique({ where: { id: result.user!.id } });
            expect(dbUser?.password).not.toBe(password);
            expect(dbUser?.password).toMatch(/^\$2[aby]\$/); // bcrypt hash prefix
        });
    });

    // ── login ─────────────────────────────────────────────────────────────

    describe('login', () => {
        it('returns tokens for valid credentials', async () => {
            const user = await createUser();

            const result = await authService.login({
                email: user.email,
                password: 'Password123!',
            });

            expect(result.accessToken).toBeTruthy();
            expect(result.refreshToken).toBeTruthy();
            expect(result.user?.email).toBe(user.email);
        });

        it('throws 401 for wrong password', async () => {
            const user = await createUser();

            await expect(
                authService.login({ email: user.email, password: 'WrongPass999!' })
            ).rejects.toMatchObject({ statusCode: 401 });
        });

        it('throws 401 for non-existent email', async () => {
            await expect(
                authService.login({ email: 'nobody@example.com', password: 'Password123!' })
            ).rejects.toMatchObject({ statusCode: 401 });
        });

        it('updates lastLoginAt on successful login', async () => {
            const user = await createUser();
            const before = new Date();

            await authService.login({ email: user.email, password: 'Password123!' });

            const updated = await prisma.user.findUnique({ where: { id: user.id } });
            expect(updated?.lastLoginAt?.getTime()).toBeGreaterThanOrEqual(before.getTime());
        });

        it('throws 403 for inactive account', async () => {
            const user = await createUser({ isActive: false });

            await expect(
                authService.login({ email: user.email, password: 'Password123!' })
            ).rejects.toMatchObject({ statusCode: 403 });
        });
    });

    // ── refreshTokens ─────────────────────────────────────────────────────

    describe('refreshTokens', () => {
        it('returns new token pair for valid refresh token', async () => {
            const user = await createUser();
            const loginResult = await authService.login({ email: user.email, password: 'Password123!' });

            const refreshResult = await authService.refreshTokens(loginResult.refreshToken);

            expect(refreshResult.accessToken).toBeTruthy();
            expect(refreshResult.refreshToken).toBeTruthy();
            expect(refreshResult.accessToken).not.toBe(loginResult.accessToken);
        });

        it('revokes old refresh token after rotation', async () => {
            const user = await createUser();
            const loginResult = await authService.login({ email: user.email, password: 'Password123!' });

            await authService.refreshTokens(loginResult.refreshToken);

            const oldToken = await prisma.refreshToken.findUnique({
                where: { token: loginResult.refreshToken },
            });
            expect(oldToken?.revoked).toBe(true);
        });

        it('throws 401 for revoked refresh token', async () => {
            const user = await createUser();
            const loginResult = await authService.login({ email: user.email, password: 'Password123!' });

            // Revoke the token
            await authService.logout(loginResult.refreshToken);

            await expect(
                authService.refreshTokens(loginResult.refreshToken)
            ).rejects.toMatchObject({ statusCode: 401 });
        });

        it('throws 401 for invalid token string', async () => {
            await expect(
                authService.refreshTokens('not-a-real-token')
            ).rejects.toMatchObject({ statusCode: 401 });
        });
    });

    // ── logout ────────────────────────────────────────────────────────────

    describe('logout', () => {
        it('revokes the refresh token in the database', async () => {
            const user = await createUser();
            const { refreshToken } = await authService.login({ email: user.email, password: 'Password123!' });

            await authService.logout(refreshToken);

            const token = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
            expect(token?.revoked).toBe(true);
        });
    });

    // ── forgotPassword ────────────────────────────────────────────────────

    describe('forgotPassword', () => {
        it('sets a password reset token on the user', async () => {
            const user = await createUser();

            await authService.forgotPassword(user.email);

            const updated = await prisma.user.findUnique({ where: { id: user.id } });
            expect(updated?.passwordResetToken).toBeTruthy();
            expect(updated?.passwordResetExpires).toBeDefined();
        });

        it('silently does nothing for non-existent email', async () => {
            await expect(
                authService.forgotPassword('nobody@ghost.com')
            ).resolves.toBeUndefined();
        });
    });

    // ── resetPassword ─────────────────────────────────────────────────────

    describe('resetPassword', () => {
        it('updates password and invalidates old refresh tokens', async () => {
            const user = await createUser();
            const { refreshToken } = await authService.login({ email: user.email, password: 'Password123!' });

            await authService.forgotPassword(user.email);
            const updated = await prisma.user.findUnique({ where: { id: user.id } });
            const resetToken = updated!.passwordResetToken!;

            await authService.resetPassword(resetToken, 'NewPassword456!');

            // Old refresh tokens should be revoked
            const oldToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
            expect(oldToken?.revoked).toBe(true);
        });

        it('throws 400 for invalid reset token', async () => {
            await expect(
                authService.resetPassword('fake-token', 'NewPassword456!')
            ).rejects.toMatchObject({ statusCode: 400 });
        });
    });

    // ── verifyEmail ────────────────────────────────────────────────────────

    describe('verifyEmail', () => {
        it('marks email as verified', async () => {
            const user = await createUser({ emailVerified: false });
            const token = 'valid-token-abc';
            const expires = new Date(Date.now() + 3600000);
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerificationToken: token, emailVerificationExpires: expires },
            });

            const result = await authService.verifyEmail(token);
            expect(result.message).toContain('verified');

            const verified = await prisma.user.findUnique({ where: { id: user.id } });
            expect(verified?.emailVerified).toBe(true);
        });

        it('throws 400 for invalid token', async () => {
            await expect(
                authService.verifyEmail('bad-token')
            ).rejects.toMatchObject({ statusCode: 400 });
        });
    });
});
