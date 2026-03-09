import apiClient from '@/lib/api/client';

// ── Types ──────────────────────────────────────────────────────────────────

export interface UserProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    phone?: string;
    location?: string;
    timezone?: string;
    plan: 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';
    credits: number;
    emailVerified?: boolean;
    onboardingComplete?: boolean;
    currentRole?: string;
    targetRole?: string;
    createdAt: string;
}

export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
    timezone?: string;
    currentRole?: string;
    targetRole?: string;
    industry?: string;
    country?: string;
    preferences?: Record<string, unknown>;
}

export interface CreditTransaction {
    id: string;
    amount: number;
    type: 'SIGNUP_BONUS' | 'PURCHASE' | 'AI_ACTION' | 'REFERRAL' | 'ADMIN_GRANT';
    description: string;
    balanceAfter: number;
    createdAt: string;
}

// ── API Module ──────────────────────────────────────────────────────────────

export const userApi = {
    /** GET /users/me */
    getProfile: (): Promise<UserProfile> =>
        apiClient.get('/users/me').then((r) => r.data.data.user),

    /** PUT /users/me */
    updateProfile: (data: UpdateProfileRequest): Promise<UserProfile> =>
        apiClient.put('/users/me', data).then((r) => r.data.data.user),

    /** PUT /users/me/password */
    changePassword: (data: { currentPassword: string; newPassword: string }): Promise<void> =>
        apiClient.put('/users/me/password', data).then(() => undefined),

    /** GET /credits/balance */
    getCreditsBalance: (): Promise<{ balance: number }> =>
        apiClient.get('/credits/balance').then((r) => r.data.data),

    /** GET /credits/history */
    getCreditHistory: (
        page = 1,
        limit = 20
    ): Promise<{ data: CreditTransaction[]; total: number; page: number; limit: number; totalPages: number }> =>
        apiClient
            .get('/credits/history', { params: { page, limit } })
            .then((r) => r.data.data),

    /** POST /users/me/avatar — multipart upload */
    uploadAvatar: (file: File): Promise<UserProfile> => {
        const form = new FormData();
        form.append('file', file);
        return apiClient
            .post('/users/me/avatar', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((r) => r.data.data.user);
    },
};
