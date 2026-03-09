import apiClient from '@/lib/api/client';

// ── Types ──────────────────────────────────────────────────────────────────

export interface DashboardStats {
    totalResumes: number;
    totalDocuments: number;
    creditsUsed: number;
    creditsRemaining: number;
    applicationsSent?: number;
    interviewsScheduled?: number;
}

export interface ActivityItem {
    id: string;
    type: 'resume_created' | 'document_generated' | 'ats_scored' | 'enhanced';
    description: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

// ── API Module ──────────────────────────────────────────────────────────────

export const analyticsApi = {
    /** GET /dashboard */
    getDashboardStats: (): Promise<DashboardStats> =>
        apiClient.get('/dashboard').then((r) => r.data.data),

    /** GET /dashboard/activity */
    getActivityFeed: (limit = 20): Promise<ActivityItem[]> =>
        apiClient.get('/dashboard/activity', { params: { limit } }).then((r) => r.data.data),
};
