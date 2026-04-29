import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

// Email templates
import VerificationEmail from '@/emails/VerificationEmail';
import PasswordResetEmail from '@/emails/PasswordResetEmail';
import PaymentSuccessEmail from '@/emails/PaymentSuccessEmail';
import LowCreditsEmail from '@/emails/LowCreditsEmail';
import PortfolioDeployedEmail from '@/emails/PortfolioDeployedEmail';
import WelcomeEmail from '@/emails/WelcomeEmail';

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

    async sendVerificationEmail(email: string, name: string, token: string) {
        const url = `${env.FRONTEND_URL}/verify-email?token=${token}`;
        const html = await render(VerificationEmail({ name: name || 'User', verificationLink: url }));
        await this.sendEmail(email, 'Verify your CareerForge AI account', html);
    }

    async sendPasswordResetEmail(email: string, name: string, token: string) {
        const url = `${env.FRONTEND_URL}/reset-password?token=${token}`;
        const html = await render(PasswordResetEmail({ name: name || 'User', resetLink: url }));
        await this.sendEmail(email, 'Reset your CareerForge AI password', html);
    }

    async sendWelcomeEmail(email: string, name: string) {
        const html = await render(WelcomeEmail({
            name: name || 'User',
            dashboardLink: `${env.FRONTEND_URL}/dashboard`,
        }));
        await this.sendEmail(email, `Welcome to CareerForge AI, ${name || 'there'}!`, html);
    }

    async sendPaymentSuccessEmail(email: string, name: string, amount: number, creditsAdded: number, newBalance: number, receiptUrl: string) {
        const html = await render(PaymentSuccessEmail({ 
            name: name || 'User', 
            amount, 
            creditsAdded, 
            newBalance, 
            receiptUrl 
        }));
        await this.sendEmail(email, 'Payment Successful', html);
    }

    async sendLowCreditsEmail(email: string, name: string, creditsRemaining: number) {
        const html = await render(LowCreditsEmail({
            name: name || 'User',
            creditsRemaining,
            topUpLink: `${env.FRONTEND_URL}/settings?tab=billing`
        }));
        await this.sendEmail(email, 'Low Credits Alert', html);
    }

    async sendPortfolioDeployedEmail(email: string, name: string, portfolioUrl: string) {
        const html = await render(PortfolioDeployedEmail({
            name: name || 'User',
            portfolioUrl
        }));
        await this.sendEmail(email, 'Portfolio Deployed!', html);
    }

    async sendBroadcastEmail(recipients: string[], subject: string, body: string) {
        for (const email of recipients) {
            await this.sendEmail(email, subject, body);
        }
    }
}

export const emailService = new EmailService();
