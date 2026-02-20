import api from '../api-client';

export const resumeApi = {
    getResumes: (params?: any) => api.get('/resumes', { params }).then((res) => res.data),
    getResumeById: (id: string) => api.get(`/resumes/${id}`).then((res) => res.data),
    createResume: (data: any) => api.post('/resumes', data).then((res) => res.data),
    updateResume: (id: string, data: any) => api.put(`/resumes/${id}`, data).then((res) => res.data),
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
