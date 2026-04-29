import prisma from '@/config/database';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import axios from 'axios';
import { hashPassword, comparePassword } from '@/utils/password';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    getRefreshTokenExpiry,
} from '@/utils/jwt';
import { createHttpError } from '@/utils/errorHandler';
import { emailService } from '@/services/email.service';
import { env } from '@/config/env';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

// ── Helpers ───────────────────────────────────────────────────────────────

const USER_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    avatar: true,
    plan: true,
    credits: true,
    emailVerified: true,
    onboardingComplete: true,
    currentRole: true,
    targetRole: true,
    industry: true,
    bio: true,
    createdAt: true,
};

function generateReferralCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// ── Request Interfaces ────────────────────────────────────────────────────

interface RegisterData {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly referralCode?: string;
}

interface LoginData {
    readonly email: string;
    readonly password: string;
}

interface LoginCandidate {
    readonly deletedAt: Date | null;
    readonly password: string | null;
    readonly isActive: boolean;
}

// ── Helper Functions ──────────────────────────────────────────────────────

/** Check if email is already registered */
async function checkEmailExists(email: string): Promise<void> {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw createHttpError(409, 'Email already registered');
}

/** Resolve referrer ID from referral code */
async function resolveReferrer(referralCode?: string): Promise<string | undefined> {
    if (!referralCode) return undefined;
    const referrer = await prisma.user.findUnique({ where: { referralCode } });
    return referrer?.id;
}

/** Create credit transactions for signup and referral */
async function recordSignupTransaction(userId: string, referredById?: string): Promise<void> {
    // Signup bonus for new user
    await prisma.creditTransaction.create({
        data: {
            userId,
            amount: 10,
            type: 'SIGNUP_BONUS',
            description: 'Welcome bonus credits',
            balanceAfter: 10,
        },
    });

    // Referral bonus for referrer
    if (!referredById) return;
    const referrer = await prisma.user.update({
        where: { id: referredById },
        data: { credits: { increment: 5 }, lifetimeCreditsEarned: { increment: 5 } },
        select: { credits: true }
    });
    await prisma.creditTransaction.create({
        data: {
            userId: referredById,
            amount: 5,
            type: 'REFERRAL',
            description: `Referral bonus — new sign-up`,
            balanceAfter: referrer.credits,
        },
    });
}

/** Validate user is active and has local auth */
async function validateUserActive(user: LoginCandidate | null): Promise<void> {
    if (!user || user.deletedAt) throw createHttpError(401, 'Invalid email or password');
    if (!user.password) throw createHttpError(401, 'Please login with Google');
    if (!user.isActive) throw createHttpError(403, 'Account suspended');
}

// ─────────────────────────────────────────────────────────────────────────

export class AuthService {

    // ── Register ─────────────────────────────────────────────────────────

    async register(data: RegisterData) {
        await checkEmailExists(data.email);
        const referredById = await resolveReferrer(data.referralCode);
        const hashedPassword = await hashPassword(data.password);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                provider: 'email',
                plan: 'FREE',
                credits: 10,
                referralCode: generateReferralCode(),
                referredById,
                emailVerificationToken,
                emailVerificationExpires,
            },
            select: USER_SELECT,
        });

        await recordSignupTransaction(user.id, referredById);
        await emailService.sendVerificationEmail(user.email!, user.firstName || 'User', emailVerificationToken);
        void emailService.sendWelcomeEmail(user.email!, user.firstName || 'User');
        const tokens = await this.generateTokens(user);
        return { user, ...tokens };
    }

    // ── Login ─────────────────────────────────────────────────────────────

    async login(data: LoginData) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        await validateUserActive(user);
        const isValid = await comparePassword(data.password, user!.password!);
        if (!isValid) throw createHttpError(401, 'Invalid email or password');

        await prisma.user.update({ where: { id: user!.id }, data: { lastLoginAt: new Date() } });
        const profile = await prisma.user.findUnique({ where: { id: user!.id }, select: USER_SELECT });
        const tokens = await this.generateTokens(user!);
        return { user: profile, ...tokens };
    }

    // ── Google OAuth ──────────────────────────────────────────────────────

    async googleAuth(googleToken: string) {
        const ticket = await googleClient.verifyIdToken({ idToken: googleToken, audience: env.GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        if (!payload?.email) throw createHttpError(400, 'Invalid Google token');

        let user = await prisma.user.findFirst({
            where: { OR: [{ googleId: payload.sub }, { email: payload.email }] },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: payload.email,
                    googleId: payload.sub,
                    firstName: payload.given_name,
                    lastName: payload.family_name,
                    avatar: payload.picture,
                    provider: 'google',
                    emailVerified: true,
                    plan: 'FREE',
                    credits: 10,
                    referralCode: generateReferralCode(),
                },
            });
            await recordSignupTransaction(user.id);
        } else if (!user.googleId) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId: payload.sub, provider: 'google', emailVerified: true, avatar: payload.picture },
            });
        }

        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        const profile = await prisma.user.findUnique({ where: { id: user.id }, select: USER_SELECT });
        const tokens = await this.generateTokens(user);
        return { user: profile, ...tokens };
    }

    // ── GitHub OAuth ──────────────────────────────────────────────────────

    async loginWithGitHub(code: string) {
        // Step 1: Exchange code for access token
        const tokenRes = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: env.GITHUB_CLIENT_ID,
                client_secret: env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: env.GITHUB_CALLBACK_URL,
            },
            { headers: { Accept: 'application/json' } }
        );

        const accessToken: string = tokenRes.data.access_token;
        if (!accessToken) {
            throw createHttpError(401, 'GitHub authentication failed — no token returned');
        }

        // Step 2: Get GitHub user profile
        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const ghUser = userRes.data;

        // Step 3: Get primary email (may not be public on profile)
        const emailRes = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const primaryEmail: string =
            emailRes.data.find((e: any) => e.primary && e.verified)?.email
            ?? ghUser.email
            ?? `${ghUser.login}@github.noemail`;

        // Step 4: Upsert user in DB — link GitHub ID if user already exists
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { githubId: String(ghUser.id) },
                    { email: primaryEmail },
                ],
            },
        });

        if (!user) {
            // New user — create account
            const nameParts = (ghUser.name ?? ghUser.login ?? '').split(' ');
            user = await prisma.user.create({
                data: {
                    email: primaryEmail,
                    firstName: nameParts[0] || ghUser.login,
                    lastName: nameParts.slice(1).join(' ') || '',
                    avatar: ghUser.avatar_url,
                    githubId: String(ghUser.id),
                    githubToken: accessToken,
                    githubUsername: ghUser.login,
                    provider: 'github',
                    emailVerified: true, // GitHub emails are verified
                    plan: 'FREE',
                    credits: 10,
                    referralCode: generateReferralCode(),
                },
            });
            await recordSignupTransaction(user.id);
        } else {
            // Existing user — update GitHub token (tokens can rotate)
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    githubId: String(ghUser.id),
                    githubToken: accessToken,
                    githubUsername: ghUser.login,
                    provider: user.provider === 'email' ? 'github' : user.provider, // Prefer OAuth provider if linked
                    avatar: user.avatar ?? ghUser.avatar_url,
                    emailVerified: true
                },
            });
        }

        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        const profile = await prisma.user.findUnique({ where: { id: user.id }, select: USER_SELECT });
        const tokens = await this.generateTokens(user);
        return { user: profile, ...tokens };
    }

    // ── Logout ────────────────────────────────────────────────────────────

    async logout(refreshToken: string): Promise<void> {
        const token = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (token) await prisma.refreshToken.update({ where: { token: refreshToken }, data: { revoked: true } });
    }

    // ── Refresh Token ─────────────────────────────────────────────────────

    async refreshTokens(refreshToken: string) {
        let decoded: { userId: string };
        try {
            decoded = verifyRefreshToken(refreshToken) as { userId: string };
        } catch {
            throw createHttpError(401, 'Invalid or expired refresh token');
        }

        const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
            throw createHttpError(401, 'Refresh token revoked or expired');
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user || !user.isActive) throw createHttpError(401, 'User not found');

        await prisma.refreshToken.update({ where: { token: refreshToken }, data: { revoked: true } });
        const tokens = await this.generateTokens(user);
        const profile = await prisma.user.findUnique({ where: { id: user.id }, select: USER_SELECT });
        return { ...tokens, user: profile };
    }

    // ── Forgot Password ───────────────────────────────────────────────────

    async forgotPassword(email: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.deletedAt) return; // Silent
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.user.update({ where: { id: user.id }, data: { passwordResetToken: resetToken, passwordResetExpires: resetExpires } });
        await emailService.sendPasswordResetEmail(user.email!, user.firstName || 'User', resetToken);
    }

    // ── Reset Password ────────────────────────────────────────────────────

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await prisma.user.findFirst({
            where: { passwordResetToken: token, passwordResetExpires: { gt: new Date() } },
        });
        if (!user) throw createHttpError(400, 'Invalid or expired reset token');
        const hashedPassword = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, passwordResetToken: null, passwordResetExpires: null },
        });
        await prisma.refreshToken.updateMany({ where: { userId: user.id }, data: { revoked: true } });
    }

    // ── Email Verification ────────────────────────────────────────────────

    async verifyEmail(token: string): Promise<{ message: string }> {
        const user = await prisma.user.findFirst({
            where: { emailVerificationToken: token, emailVerificationExpires: { gt: new Date() } },
        });
        if (!user) throw createHttpError(400, 'Invalid or expired verification token');
        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true, emailVerificationToken: null, emailVerificationExpires: null },
        });
        return { message: 'Email verified successfully' };
    }

    // ── Resend Verification ───────────────────────────────────────────────

    async resendVerification(email: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.deletedAt) return; // Silent
        if (user.emailVerified) throw createHttpError(400, 'Email already verified');
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await prisma.user.update({ where: { id: user.id }, data: { emailVerificationToken: token, emailVerificationExpires: expires } });
        await emailService.sendVerificationEmail(user.email!, user.firstName || 'User', token);
    }

    // ── Internal Helpers ──────────────────────────────────────────────────

    private async generateTokens(user: { id: string; email: string; plan: string }) {
        const payload = { userId: user.id, email: user.email, plan: user.plan };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        await prisma.refreshToken.create({ data: { userId: user.id, token: refreshToken, expiresAt: getRefreshTokenExpiry() } });
        return { accessToken, refreshToken };
    }
}


