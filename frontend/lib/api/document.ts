import { z } from 'zod';

import api from '@/lib/apiClient';
import {
    DocumentParams,
    generateBioSchema,
    generateCoverLetterSchema,
    generateFinancialLetterSchema,
    generateMotivationLetterSchema,
    generateSOPSchema,
    generateStudyPlanSchema,
} from '@/lib/validation';

type GenerateCoverLetterInput = z.infer<typeof generateCoverLetterSchema>;
type GenerateSOPInput = z.infer<typeof generateSOPSchema>;
type GenerateMotivationLetterInput = z.infer<typeof generateMotivationLetterSchema>;
type GenerateStudyPlanInput = z.infer<typeof generateStudyPlanSchema>;
type GenerateFinancialLetterInput = z.infer<typeof generateFinancialLetterSchema>;
type GenerateBioInput = z.infer<typeof generateBioSchema>;

export const documentApi = {
    // CRUD
    getDocuments: (params?: DocumentParams) => api.get('/documents', { params }).then((res) => res.data),
    getDocumentById: (id: string) => api.get(`/documents/${id}`).then((res) => res.data),
    updateDocument: (id: string, data: Record<string, unknown>) => api.put(`/documents/${id}`, data).then((res) => res.data),
    deleteDocument: (id: string) => api.delete(`/documents/${id}`).then((res) => res.data),
    duplicateDocument: (id: string) => api.post(`/documents/${id}/duplicate`).then((res) => res.data),
    generatePdf: (id: string) => api.post(`/documents/${id}/pdf`).then((res) => res.data),

    // AI Generation
    generateCoverLetter: (data: GenerateCoverLetterInput) => api.post('/documents/cover-letter/generate', data).then((res) => res.data),
    regenerateCoverLetter: (id: string, feedback?: string) =>
        api.post(`/documents/cover-letter/${id}/regenerate`, { feedback }).then((res) => res.data),

    generateSOP: (data: GenerateSOPInput) => api.post('/documents/sop/generate', data).then((res) => res.data),
    generateMotivationLetter: (data: GenerateMotivationLetterInput) => api.post('/documents/motivation-letter/generate', data).then((res) => res.data),
    generateStudyPlan: (data: GenerateStudyPlanInput) => api.post('/documents/study-plan/generate', data).then((res) => res.data),
    generateFinancialLetter: (data: GenerateFinancialLetterInput) => api.post('/documents/financial-letter/generate', data).then((res) => res.data),
    generateBio: (data: GenerateBioInput) => api.post('/documents/bio/generate', data).then((res) => res.data),
};
