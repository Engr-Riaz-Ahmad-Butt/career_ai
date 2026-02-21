import api from '../api-client';

export const templatesApi = {
    getResumeTemplates: () => api.get('/templates/resume').then((res) => res.data),
    getResumeTemplateById: (id: string) => api.get(`/templates/resume/${id}`).then((res) => res.data),
    getDocumentStyles: () => api.get('/templates/documents').then((res) => res.data),
};
