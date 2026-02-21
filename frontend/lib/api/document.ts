import api from '../api-client';

export const documentApi = {
    // CRUD
    getDocuments: (params?: any) => api.get('/documents', { params }).then((res) => res.data),
    getDocumentById: (id: string) => api.get(`/documents/${id}`).then((res) => res.data),
    updateDocument: (id: string, data: any) => api.put(`/documents/${id}`, data).then((res) => res.data),
    deleteDocument: (id: string) => api.delete(`/documents/${id}`).then((res) => res.data),
    duplicateDocument: (id: string) => api.post(`/documents/${id}/duplicate`).then((res) => res.data),
    generatePdf: (id: string) => api.post(`/documents/${id}/pdf`).then((res) => res.data),

    // AI Generation
    generateCoverLetter: (data: any) => api.post('/documents/cover-letter/generate', data).then((res) => res.data),
    regenerateCoverLetter: (id: string, feedback?: string) =>
        api.post(`/documents/cover-letter/${id}/regenerate`, { feedback }).then((res) => res.data),

    generateSOP: (data: any) => api.post('/documents/sop/generate', data).then((res) => res.data),
    generateMotivationLetter: (data: any) => api.post('/documents/motivation-letter/generate', data).then((res) => res.data),
    generateStudyPlan: (data: any) => api.post('/documents/study-plan/generate', data).then((res) => res.data),
    generateFinancialLetter: (data: any) => api.post('/documents/financial-letter/generate', data).then((res) => res.data),
    generateBio: (data: any) => api.post('/documents/bio/generate', data).then((res) => res.data),
};
