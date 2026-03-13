import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

/**
 * Rate limiter that keys by authenticated user ID instead of IP.
 * Use this for AI endpoints and expensive operations to limit per-user abuse
 * regardless of how many IPs the user might be behind (proxies, VPNs, etc.).
 *
 * Falls back to IP if req.user is not set (should never happen on protected routes,
 * but prevents the limiter from treating all anonymous requests as one user).
 */
function userKeyGenerator(req: Request): string {
    return req.user?.userId ?? req.ip ?? 'anonymous';
}

/** AI operations: 30 requests per 10 minutes per user */
export const aiRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 30,
    keyGenerator: userKeyGenerator,
    message: {
        success: false,
        message: 'Too many AI requests. Please wait a few minutes before trying again.',
        code: 'AI_RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/** Expensive AI operations (resume tailoring, SOP, etc.): 10 requests per 10 minutes per user */
export const heavyAiRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10,
    keyGenerator: userKeyGenerator,
    message: {
        success: false,
        message: 'Too many requests for this operation. Please wait before trying again.',
        code: 'HEAVY_AI_RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/** File uploads: 20 uploads per hour per user */
export const uploadRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    keyGenerator: userKeyGenerator,
    message: {
        success: false,
        message: 'Too many file uploads. Please try again later.',
        code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
