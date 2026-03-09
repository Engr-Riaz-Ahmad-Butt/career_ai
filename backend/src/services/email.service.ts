import nodemailer from 'nodemailer';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

export class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    private getTransporter() {
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                host: env.SMTP_HOST,
                port: +(env.SMTP_PORT || 587),
                secure: env.SMTP_SECURE === 'true',
                auth: {
                    user: env.SMTP_USER,
                    pass: env.SMTP_PASS,
                },
            });
        }
        return this.transporter;
    }

    async sendEmail(to: string, subject: string, html: string) {
        if (env.NODE_ENV === 'test') return;

        try {
            await this.getTransporter().sendMail({
                from: env.EMAIL_FROM || env.SMTP_USER,
                to,
                subject,
                html,
            });
        } catch (error) {
            logger.error('Email delivery failed', { error, subject, recipientCount: 1 });
            // In production, we might want to queue this or use a more reliable provider
        }
    }

    async sendVerificationEmail(email: string, token: string) {
        const url = `${env.FRONTEND_URL}/verify-email?token=${token}`;
        await this.sendEmail(
            email,
            'Verify your CareerForge AI account',
            `<p>Click <a href="${url}">here</a> to verify your email.</p>`
        );
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const url = `${env.FRONTEND_URL}/reset-password?token=${token}`;
        await this.sendEmail(
            email,
            'Reset your CareerForge AI password',
            `<p>Click <a href="${url}">here</a> to reset your password.</p>`
        );
    }

    async sendWelcomeEmail(email: string, name: string) {
        await this.sendEmail(
            email,
            'Welcome to CareerForge AI',
            `<p>Hi ${name}, welcome to CareerForge AI! We're excited to help you land your dream job.</p>`
        );
    }

    async sendBroadcastEmail(recipients: string[], subject: string, body: string) {
        // In a real app, use a proper bulk email service (SendGrid, Mailchimp, etc.)
        // For now, we'll send them individually (inefficient but works for small scale)
        for (const email of recipients) {
            await this.sendEmail(email, subject, body);
        }
    }

    async sendPaymentSuccessEmail(email: string, amount: number) {
        await this.sendEmail(
            email,
            'Payment Successful',
            `<p>Thank you! Your payment of $${amount} was successful. Your credits have been updated.</p>`
        );
    }
}

export const emailService = new EmailService();
