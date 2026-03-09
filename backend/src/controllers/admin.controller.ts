import { Request, Response } from 'express';
import { adminService } from '@/services/admin.service';
import { emailService } from '@/services/email.service';
import { asyncHandler } from '@/middleware/error';

import { Plan } from '@prisma/client';

// ── Helpers ─────────────────────────────────────────────────────────────────

interface ListUsersOptions {
    readonly page: number;
    readonly limit: number;
    readonly plan?: string;
    readonly search?: string;
    readonly sortBy?: string;
    readonly order: 'asc' | 'desc';
}

/** Extract and validate list users query parameters */
function extractListUsersOptions(query: Record<string, unknown>): ListUsersOptions {
    const page = typeof query.page === 'string' ? parseInt(query.page, 10) : 1;
    const limit = Math.min(typeof query.limit === 'string' ? parseInt(query.limit, 10) : 20, 100);
    const order = (query.order === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
    return {
        page: Math.max(page, 1),
        limit: Math.max(limit, 1),
        plan: typeof query.plan === 'string' ? query.plan : undefined,
        search: typeof query.search === 'string' ? query.search : undefined,
        sortBy: typeof query.sortBy === 'string' ? query.sortBy : undefined,
        order,
    };
}

/** Parse date range from query parameters */
function parseDateRange(from?: unknown, to?: unknown): { from: Date; to: Date } {
    const parseDate = (val: unknown, defaultDelta: number): Date => {
        if (typeof val === 'string') {
            const parsed = new Date(val);
            return isNaN(parsed.getTime()) ? new Date(Date.now() - defaultDelta) : parsed;
        }
        return new Date(Date.now() - defaultDelta);
    };
    return {
        from: parseDate(from, 30 * 24 * 60 * 60 * 1000), // 30 days
        to: parseDate(to, 0),
    };
}

/** Ensure ID is provided */
function requireId(id?: string): void {
    if (!id) throw new Error('User ID is required');
}
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const options = extractListUsersOptions(req.query);
    const result = await adminService.getUsers(options);
    res.json({ success: true, data: result });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    requireId(req.params.id);
    const user = await adminService.getUserById(req.params.id);
    res.json({ success: true, data: { user } });
});

export const updateUserPlan = asyncHandler(async (req: Request, res: Response) => {
    requireId(req.params.id);
    if (!req.body?.plan) throw new Error('Plan is required');

    const user = await adminService.updateUserPlan(req.params.id, req.body.plan.toUpperCase() as Plan);
    res.json({ success: true, data: { user } });
});

export const adjustUserCredits = asyncHandler(async (req: Request, res: Response) => {
    requireId(req.params.id);
    if (!req.body?.amount || typeof req.body.amount !== 'number') throw new Error('Valid amount is required');
    if (!req.body?.reason) throw new Error('Reason is required');

    const newBalance = await adminService.adjustUserCredits(req.params.id, req.body.amount, req.body.reason);
    res.json({ success: true, data: { newBalance } });
});

export const getStats = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = parseDateRange(req.query.from, req.query.to);
    const stats = await adminService.getSystemStats(from, to);
    res.json({ success: true, data: stats });
});

export const getAiCosts = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = parseDateRange(req.query.from, req.query.to);
    const costs = await adminService.getAiCosts(from, to);
    res.json({ success: true, data: costs });
});

export const getRevenue = asyncHandler(async (req: Request, res: Response) => {
    const { from, to } = parseDateRange(req.query.from, req.query.to);
    const revenue = await adminService.getRevenue(from, to);
    res.json({ success: true, data: revenue });
});

export const broadcast = asyncHandler(async (req: Request, res: Response) => {
    if (!req.body?.subject || !req.body?.body || !req.body?.segment) {
        throw new Error('Subject, body, and segment are required');
    }

    const recipients = await adminService.getBroadcastRecipients(req.body.segment);
    emailService.sendBroadcastEmail(recipients, req.body.subject, req.body.body);

    res.json({
        success: true,
        message: `Broadcast queued for ${recipients.length} users`,
        data: { recipientCount: recipients.length }
    });
});
