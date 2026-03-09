import { z } from 'zod';

import api from '@/lib/apiClient';
import { createResumeSchema, ResumeParams } from '@/lib/validation';

type CreateResumeInput = z.infer<typeof createResumeSchema>;

export const resumeApi = {
    getResumes: (params?: ResumeParams) => api.get('/resumes', { params }).then((res) => res.data),
    getResumeById: (id: string) => api.get(`/resumes/${id}`).then((res) => res.data),
    createResume: (data: CreateResumeInput) => api.post('/resumes', data).then((res) => res.data),
    updateResume: (id: string, data: Partial<CreateResumeInput>) => api.put(`/resumes/${id}`, data).then((res) => res.data),
    deleteResume: (id: string) => api.delete(`/resumes/${id}`).then((res) => res.data),
    duplicateResume: (id: string) => api.post(`/resumes/${id}/duplicate`).then((res) => res.data),
    uploadResume: (file: File) => {
        const formData = new FormData();
        formData.append('resume', file);
        return api.post('/resumes/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => res.data);
    },
};
