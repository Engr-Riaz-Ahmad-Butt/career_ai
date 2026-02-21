import api from '../api-client';

export const billingApi = {
    getPlans: () => api.get('/billing/plans').then((res) => res.data),
    getSubscription: () => api.get('/billing/subscription').then((res) => res.data),
    getInvoices: () => api.get('/billing/invoices').then((res) => res.data),

    createCheckout: (planId: string) => api.post('/billing/checkout', { planId }).then((res) => res.data),
    createPortal: () => api.post('/billing/portal').then((res) => res.data),

    cancelSubscription: () => api.post('/billing/cancel').then((res) => res.data),
    reactivateSubscription: () => api.post('/billing/reactivate').then((res) => res.data),

    purchaseCredits: (amount: number) => api.post('/billing/credits/purchase', { amount }).then((res) => res.data),
};
