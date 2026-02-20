import prisma from '../config/database';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { hashPassword, comparePassword } from '../utils/password';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    getRefreshTokenExpiry,
} from '../utils/jwt';
import { ApiError } from '../middleware/error';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Email transporter ─────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
});

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
    createdAt: true,
};

function generateReferralCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
}

async function sendEmail(to: string, subject: string, html: string) {
    try {
        await transporter.sendMail({
            from: `"CareerAI" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error('Email send error:', err);
        // Don't throw — log only to avoid breaking auth flow
    }
}

// ─────────────────────────────────────────────────────────────────────────

export class AuthService {

    // ── Register ─────────────────────────────────────────────────────────

    async register(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        referralCode?: string;
    }) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) throw new ApiError(409, 'Email already registered');

        const hashedPassword = await hashPassword(data.password);

        // Resolve referrer
        let referredById: string | undefined;
        if (data.referralCode) {
            const referrer = await prisma.user.findUnique({ where: { referralCode: data.referralCode } });
            if (referrer) referredById = referrer.id;
        }

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        const referralCode = generateReferralCode();

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                provider: 'email',
                plan: 'FREE',
                credits: 10,
                referralCode,
                referredById,
                emailVerificationToken,
                emailVerificationExpires,
            },
            select: USER_SELECT,
        });

        // Give referrer bonus credits
        if (referredById) {
            await prisma.user.update({
                where: { id: referredById },
                data: { credits: { increment: 5 }, lifetimeCreditsEarned: { increment: 5 } },
            });
            await prisma.creditTransaction.create({
                data: {
                    userId: referredById,
                    amount: 5,
                    type: 'REFERRAL',
                    description: 'Referral bonus — new user signed up',
                    balanceAfter: 0, // approximate
                },
            });
        }

        // Record signup bonus transaction
        await prisma.creditTransaction.create({
            data: {
                userId: user.id,
                amount: 10,
                type: 'SIGNUP_BONUS',
                description: 'Welcome bonus credits',
                balanceAfter: 10,
            },
        });

        // Send verification email
        const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${emailVerificationToken}`;
        await sendEmail(
            user.email,
            'Verify your CareerAI email',
            `<p>Hi ${user.firstName},</p>
       <p>Click the link below to verify your email address:</p>
       <p><a href="${verifyUrl}">${verifyUrl}</a></p>
       <p>This link expires in 24 hours.</p>`
        );

        const tokens = await this.generateTokens(user);
        return { user, ...tokens };
    }

    // ── Login ─────────────────────────────────────────────────────────────

    async login(data: { email: string; password: string }) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });

        if (!user || user.deletedAt) throw new ApiError(401, 'Invalid email or password');
        if (!user.password) throw new ApiError(401, 'Please login with Google');
        if (!user.isActive) throw new ApiError(403, 'Account suspended');

        const isValid = await comparePassword(data.password, user.password);
        if (!isValid) throw new ApiError(401, 'Invalid email or password');

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        const profile = await prisma.user.findUnique({ where: { id: user.id }, select: USER_SELECT });
        const tokens = await this.generateTokens(user);
        return { user: profile, ...tokens };
    }

    // ── Google OAuth ──────────────────────────────────────────────────────

    async googleAuth(googleToken: string) {
        const ticket = await googleClient.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload?.email) throw new ApiError(400, 'Invalid Google token');

        const { email, given_name, family_name, picture, sub: googleId } = payload;

        let user = await prisma.user.findFirst({
            where: { OR: [{ googleId }, { email }] },
        });

        if (user) {
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId, provider: 'google', emailVerified: true, avatar: picture },
                });
            }
            await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        } else {
            user = await prisma.user.create({
                data: {
                    email,
                    googleId,
                    firstName: given_name,
                    lastName: family_name,
                    avatar: picture,
                    provider: 'google',
                    emailVerified: true,
                    plan: 'FREE',
                    credits: 10,
                    referralCode: generateReferralCode(),
                },
            });
            await prisma.creditTransaction.create({
                data: { userId: user.id, amount: 10, type: 'SIGNUP_BONUS', description: 'Welcome bonus', balanceAfter: 10 },
            });
        }

        const profile = await prisma.user.findUnique({ where: { id: user.id }, select: USER_SELECT });
        const tokens = await this.generateTokens(user);
        return { user: profile, ...tokens };
    }

    // ── Logout ────────────────────────────────────────────────────────────

    async logout(refreshToken: string) {
        const token = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (token) {
            await prisma.refreshToken.update({ where: { token: refreshToken }, data: { revoked: true } });
        }
    }

    // ── Refresh Token ─────────────────────────────────────────────────────

    async refreshTokens(refreshToken: string) {
        let decoded: { userId: string };
        try {
            decoded = verifyRefreshToken(refreshToken) as { userId: string };
        } catch {
            throw new ApiError(401, 'Invalid or expired refresh token');
        }

        const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
            throw new ApiError(401, 'Refresh token revoked or expired');
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user || !user.isActive) throw new ApiError(401, 'User not found');

        // Rotate: revoke old token, issue new pair
        await prisma.refreshToken.update({ where: { token: refreshToken }, data: { revoked: true } });

        const tokens = await this.generateTokens(user);
        return tokens;
    }

    // ── Forgot Password ───────────────────────────────────────────────────

    async forgotPassword(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        // Don't reveal if email exists
        if (!user || user.deletedAt) return;

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: { passwordResetToken: resetToken, passwordResetExpires: resetExpires },
        });

        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
        await sendEmail(
            user.email,
            'Reset your CareerAI password',
            `<p>Hi ${user.firstName},</p>
       <p>Click to reset your password (link expires in 10 minutes):</p>
       <p><a href="${resetUrl}">${resetUrl}</a></p>
       <p>If you didn't request this, ignore this email.</p>`
        );
    }

    // ── Reset Password ────────────────────────────────────────────────────

    async resetPassword(token: string, newPassword: string) {
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { gt: new Date() },
            },
        });

        if (!user) throw new ApiError(400, 'Invalid or expired reset token');

        const hashedPassword = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });

        // Revoke all refresh tokens
        await prisma.refreshToken.updateMany({ where: { userId: user.id }, data: { revoked: true } });
    }

    // ── Email Verification ────────────────────────────────────────────────

    async verifyEmail(token: string) {
        const user = await prisma.user.findFirst({
            where: {
                emailVerificationToken: token,
                emailVerificationExpires: { gt: new Date() },
            },
        });

        if (!user) throw new ApiError(400, 'Invalid or expired verification token');

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null,
            },
        });

        return { message: 'Email verified successfully' };
    }

    // ── Resend Verification ───────────────────────────────────────────────

    async resendVerification(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.deletedAt) return; // Silent

        if (user.emailVerified) throw new ApiError(400, 'Email already verified');

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerificationToken: token, emailVerificationExpires: expires },
        });

        const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;
        await sendEmail(
            user.email,
            'Verify your CareerAI email',
            `<p>Hi ${user.firstName},</p>
       <p>Click to verify your email:</p>
       <p><a href="${verifyUrl}">${verifyUrl}</a></p>`
        );
    }

    // ── Internal Helpers ──────────────────────────────────────────────────

    async generateTokens(user: { id: string; email: string; plan: string }) {
        const payload = { userId: user.id, email: user.email, plan: user.plan };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: getRefreshTokenExpiry(),
            },
        });

        return { accessToken, refreshToken };
    }
}
