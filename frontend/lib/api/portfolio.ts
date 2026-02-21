import api from '../api-client';

export const portfolioApi = {
    getPortfolios: () => api.get('/portfolio').then((res) => res.data),
    getPortfolioById: (id: string) => api.get(`/portfolio/${id}`).then((res) => res.data),
    generatePortfolio: (data: any) => api.post('/portfolio/generate', data).then((res) => res.data),
    updatePortfolio: (id: string, data: any) => api.put(`/portfolio/${id}`, data).then((res) => res.data),
    deployPortfolio: (id: string) => api.post(`/portfolio/${id}/deploy`).then((res) => res.data),
    deletePortfolio: (id: string) => api.delete(`/portfolio/${id}`).then((res) => res.data),
};
