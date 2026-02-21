import api from '../api-client';

export const dashboardApi = {
    getDashboard: () => api.get('/dashboard').then((res) => res.data),
    getRecentDocuments: () => api.get('/dashboard/recent').then((res) => res.data),
    getStats: () => api.get('/dashboard/stats').then((res) => res.data),
    getActivity: () => api.get('/dashboard/activity').then((res) => res.data),
};
