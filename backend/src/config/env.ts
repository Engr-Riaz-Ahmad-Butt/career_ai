import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const durationRegex = /^\d+[smhd]$/;

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
        JWT_EXPIRES_IN: z.string().regex(durationRegex, 'JWT_EXPIRES_IN must use format like 15m, 1h, 7d').default('15m'),
        JWT_REFRESH_EXPIRES_IN: z.string().regex(durationRegex, 'JWT_REFRESH_EXPIRES_IN must use format like 15m, 1h, 7d').default('7d'),

        // Credit costs
        CREDIT_COST_RESUME_ENHANCE: z.coerce.number().positive().default(1),
        CREDIT_COST_RESUME_TAILOR: z.coerce.number().positive().default(2),
        CREDIT_COST_ATS_SCORE: z.coerce.number().positive().default(1),
        CREDIT_COST_RESUME_IMPROVE: z.coerce.number().positive().default(1),
        CREDIT_COST_COVER_LETTER_GENERATE: z.coerce.number().positive().default(2),
        CREDIT_COST_SOP_GENERATE: z.coerce.number().positive().default(3),
        CREDIT_COST_BIO_GENERATE: z.coerce.number().positive().default(1),
        CREDIT_COST_MOTIVATION_LETTER_GENERATE: z.coerce.number().positive().default(2),
        CREDIT_COST_RESIGNATION_LETTER_GENERATE: z.coerce.number().positive().default(1),
        CREDIT_COST_RECOMMENDATION_GENERATE: z.coerce.number().positive().default(2),
        CREDIT_COST_SCHOLARSHIP_GENERATE: z.coerce.number().positive().default(3),
        CREDIT_COST_NETWORKING_GENERATE: z.coerce.number().positive().default(1),
        CREDIT_COST_ACCEPTANCE_GENERATE: z.coerce.number().positive().default(1),
        CREDIT_COST_INTERVIEW_GENERATE: z.coerce.number().positive().default(2),
        CREDIT_COST_COMMUNICATION_ANALYZE: z.coerce.number().positive().default(1),
        CREDIT_COST_KEYWORD_EXTRACT: z.coerce.number().positive().default(0.5),
        CREDIT_COST_GRAMMAR_FIX: z.coerce.number().positive().default(0.5),
        CREDIT_COST_FILE_UPLOAD_PARSE: z.coerce.number().positive().default(1),
        CREDIT_COST_PORTFOLIO_GENERATE: z.coerce.number().positive().default(5),
        CREDIT_COST_PORTFOLIO_DEPLOY: z.coerce.number().positive().default(2),
        CREDIT_COST_CREATE_RESUME: z.coerce.number().positive().default(1),
        CREDIT_COST_UPLOAD_RESUME: z.coerce.number().positive().default(2),
        CREDIT_COST_TAILOR_RESUME: z.coerce.number().positive().default(3),
        CREDIT_COST_ENHANCE_RESUME_SECTION: z.coerce.number().positive().default(2),
        CREDIT_COST_GENERATE_STUDY_PLAN: z.coerce.number().positive().default(2),
        CREDIT_COST_GENERATE_FINANCIAL_LETTER: z.coerce.number().positive().default(2),
        CREDIT_COST_INTERVIEW_FEEDBACK: z.coerce.number().positive().default(1),
        CREDIT_PLAN_MULTIPLIER_FREE: z.coerce.number().positive().default(1),
        CREDIT_PLAN_MULTIPLIER_PRO: z.coerce.number().positive().default(0.8),
        CREDIT_PLAN_MULTIPLIER_TEAM: z.coerce.number().positive().default(0.6),
        CREDIT_PLAN_MULTIPLIER_ENTERPRISE: z.coerce.number().positive().default(0.4),

        // Pagination
        PAGINATION_DEFAULT_PAGE: z.coerce.number().int().positive().default(1),
        PAGINATION_DEFAULT_LIMIT: z.coerce.number().int().positive().default(10),
        PAGINATION_DEFAULT_LIMIT_FALLBACK: z.coerce.number().int().positive().default(20),
        PAGINATION_MAX_LIMIT: z.coerce.number().int().positive().default(100),
        PAGINATION_SERVICE_MAX_LIMIT: z.coerce.number().int().positive().default(50),
        PAGINATION_DEFAULT_SORT_ORDER: z.enum(['asc', 'desc']).default('desc'),

        // Cache TTL (seconds)
        CACHE_NAMESPACE: z.string().min(1).default('career_ai'),
        CACHE_TTL_RESUME_ENHANCE_SECONDS: z.coerce.number().int().positive().default(86400),
        CACHE_TTL_ATS_SCORE_SECONDS: z.coerce.number().int().positive().default(86400),
        CACHE_TTL_KEYWORD_EXTRACTION_SECONDS: z.coerce.number().int().positive().default(604800),

        // File upload
        UPLOAD_AVATAR_DIR: z.string().min(1).default('uploads/avatars/'),
        UPLOAD_RESUME_DIR: z.string().min(1).default('uploads/resumes/'),
        UPLOAD_AVATAR_URL_PREFIX: z.string().min(1).default('/uploads/avatars/'),
        UPLOAD_AVATAR_MAX_MB: z.coerce.number().positive().default(2),
        UPLOAD_RESUME_MAX_MB: z.coerce.number().positive().default(5),
        UPLOAD_AVATAR_ALLOWED_MIME_TYPES: z
            .string()
            .min(1)
            .default('image/jpeg,image/png,image/webp,image/gif'),
        UPLOAD_RESUME_ALLOWED_MIME_TYPES: z
            .string()
            .min(1)
            .default('application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document'),

    // Google OAuth (optional — only needed if Google auth is used)
    GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
    GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),

    // GitHub OAuth
    GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required'),
    GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),
    GITHUB_CALLBACK_URL: z.string().url().default('http://localhost:5000/auth/github/callback'),

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
    API_URL: z.string().url().default('http://localhost:5000'),
    ALLOWED_ORIGINS: z.string().optional(),
    CORS_ALLOW_NO_ORIGIN: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),

    // Response performance targets (milliseconds)
    PERF_NON_AI_RESPONSE_TARGET_MS: z.coerce.number().int().positive().default(200),
    PERF_AI_FIRST_BYTE_TARGET_MS: z.coerce.number().int().positive().default(500),
    PERF_UPLOAD_QUEUE_TARGET_MS: z.coerce.number().int().positive().default(300),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

    // Stripe (optional in dev, required in prod)
    STRIPE_SECRET_KEY: process.env.NODE_ENV === 'production'
        ? z.string().min(1, 'STRIPE_SECRET_KEY is required in production')
        : z.string().optional(),
    STRIPE_WEBHOOK_SECRET: process.env.NODE_ENV === 'production'
        ? z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required in production')
        : z.string().optional(),
    STRIPE_API_VERSION: z.string().default('2023-10-16'),
    STRIPE_PRICE_PRO_MONTHLY: z.string().default(''),
    STRIPE_PRICE_PRO_ANNUAL: z.string().default(''),
    STRIPE_PRICE_TEAM_MONTHLY: z.string().default(''),
    STRIPE_PRICE_ENTERPRISE: z.string().default(''),
    BILLING_CREDIT_PRICE_PER_UNIT_CENTS: z.coerce.number().int().positive().default(10),
    BILLING_CREDIT_PURCHASE_MULTIPLE: z.coerce.number().int().positive().default(50),

    // Auth cookie
    AUTH_REFRESH_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(7 * 24 * 60 * 60 * 1000),

    // AI
    GEMINI_API_KEY: process.env.NODE_ENV === 'production'
        ? z.string().min(1, 'GEMINI_API_KEY is required in production')
        : z.string().min(1, 'GEMINI_API_KEY is required for AI features').optional(),
    USE_ENHANCED_PROMPTS: z.enum(['true', 'false']).default('true').transform((value) => value === 'true'),
    INTERVIEW_DEFAULT_QUESTION_COUNT: z.coerce.number().int().positive().default(10),

    // Optional AI fallback providers
    ANTHROPIC_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),

    // Redis (optional)
    REDIS_URL: z.string().optional(),
    REDIS_RECONNECT_MAX_RETRIES: z.coerce.number().int().positive().default(10),
    REDIS_RECONNECT_BASE_DELAY_MS: z.coerce.number().int().positive().default(50),
    REDIS_RECONNECT_MAX_DELAY_MS: z.coerce.number().int().positive().default(500),

    // Background workers
    ENABLE_EMBEDDED_WORKER: z.enum(['true', 'false']).default('true'),

    // Vercel OAuth (for portfolio deployment)
    VERCEL_CLIENT_ID: z.string().optional(),
    VERCEL_CLIENT_SECRET: z.string().optional(),
    VERCEL_CALLBACK_URL: z.string().url().optional().default('http://localhost:5000/api/v1/auth/vercel/callback'),
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
