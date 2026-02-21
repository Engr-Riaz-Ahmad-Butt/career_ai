import api from '../api-client';

export const interviewApi = {
    getSessions: () => api.get('/interview').then((res) => res.data),
    getSessionById: (id: string) => api.get(`/interview/${id}`).then((res) => res.data),
    generateSession: (data: any) => api.post('/interview/generate', data).then((res) => res.data),
    submitFeedback: (id: string, feedback: any) => api.post(`/interview/${id}/feedback`, feedback).then((res) => res.data),
    deleteSession: (id: string) => api.delete(`/interview/${id}`).then((res) => res.data),
};
