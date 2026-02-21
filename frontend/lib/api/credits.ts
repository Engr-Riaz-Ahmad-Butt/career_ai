import api from '../api-client';

export const creditsApi = {
    getBalance: () => api.get('/credits/balance').then((res) => res.data),
    getHistory: (params?: { page?: number, limit?: number, type?: string }) =>
        api.get('/credits/history', { params }).then((res) => res.data),
    getCosts: () => api.get('/credits/costs').then((res) => res.data),
    applyReferral: (referralCode: string) =>
        api.post('/credits/referral/apply', { referralCode }).then((res) => res.data),
};
