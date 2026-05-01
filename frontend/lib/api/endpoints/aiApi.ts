import api from '@/lib/api/client';

export const aiApi = {
    enhanceResume: (resumeId: string, data: { section: string; targetRole?: string; industry?: string }) =>
        api.post(`/ai/resume/${resumeId}/enhance`, data).then((res) => res.data),

    tailorResume: (data: { baseResumeId: string; jobDescription: string; companyName?: string; jobTitle?: string }) =>
        api.post('/ai/resume/tailor', data).then((res) => res.data),

    // Used in AtsScanStep.tsx
    getAtsScore: (data: { resumeId: string; jobDescription: string }) =>
        api.post(`/ai/resume/${data.resumeId}/ats-score`, { jobDescription: data.jobDescription }).then((res) => res.data),

    // Alias for compatibility
    scoreAts: (data: { resumeId: string; jobDescription: string }) =>
        api.post(`/ai/resume/${data.resumeId}/ats-score`, { jobDescription: data.jobDescription }).then((res) => res.data),

    getSuggestions: (resumeId: string, data: { section: string; targetRole?: string }) =>
        api.post(`/ai/resume/${resumeId}/suggestions`, data).then((res) => res.data),

    // Used in DocumentGenerateStep.tsx
    generateCoverLetter: (data: { resumeId: string; jobDescription: string; type: string }) =>
        api.post('/ai/cover-letter/generate', data).then((res) => res.data),

    // Used in DocumentGenerateStep.tsx
    generateBio: (data: { resumeId: string; bioType: string }) =>
        api.post('/ai/bio/generate', data).then((res) => res.data),

    extractKeywords: (text: string) =>
        api.post('/ai/keywords/extract', { text }).then((res) => res.data),

    fixGrammar: (text: string) =>
        api.post('/ai/grammar/fix', { text }).then((res) => res.data),

    improveText: (text: string, tone?: string) =>
        api.post('/ai/text/improve', { text, tone }).then((res) => res.data),

    analyzeCommunication: (text: string, context?: string) =>
        api.post('/ai/communication/analyze', { text, context }).then((res) => res.data),
};
