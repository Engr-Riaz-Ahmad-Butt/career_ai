import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// ── Environment Schema ────────────────────────────────────────────────────
// Validates ALL required environment variables at startup.
// If any are missing or malformed, the server will fail fast with a clear message.

const envSchema = z.object({
    // Server
    PORT: z.coerce.number().default(5000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    // JWT
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
    JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
    JWT_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    // Google OAuth (optional — only needed if Google auth is used)
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // Email / SMTP (optional — gracefully skipped if not set)
    SMTP_HOST: z.string().default('smtp.gmail.com'),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_SECURE: z.coerce.string().default('false'),
    EMAIL_USER: z.string().optional(),
    EMAIL_PASS: z.string().optional(),
    EMAIL_FROM: z.string().optional(),

    // Frontend / CORS
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),
    ALLOWED_ORIGINS: z.string().optional(),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

    // Stripe (optional)
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // AI
    GEMINI_API_KEY: z.string().optional(),
    USE_ENHANCED_PROMPTS: z.string().default('true'),

    // Optional AI fallback providers
    ANTHROPIC_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),

    // Redis (optional)
    REDIS_URL: z.string().optional(),
});

// ── Parse & Export ────────────────────────────────────────────────────────

function validateEnv() {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error('❌ Invalid environment variables:');
        for (const issue of result.error.issues) {
            console.error(`   ${issue.path.join('.')}: ${issue.message}`);
        }
        process.exit(1);
    }

    return result.data;
}

export const env = validateEnv();

// Type export for use across the app
export type Env = z.infer<typeof envSchema>;
