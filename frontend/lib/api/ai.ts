import api from '../api-client';

export const aiApi = {
    enhanceResume: (resumeId: string, section?: string) =>
        api.post(`/ai/resume/${resumeId}/enhance`, { section }).then((res) => res.data),

    tailorResume: (resumeId: string, jobDescription: string) =>
        api.post(`/ai/resume/${resumeId}/tailor`, { jobDescription }).then((res) => res.data),

    scoreAts: (resumeId: string, jobDescription: string) =>
        api.post(`/ai/resume/${resumeId}/ats-score`, { jobDescription }).then((res) => res.data),

    getSuggestions: (resumeId: string) =>
        api.post(`/ai/resume/${resumeId}/suggestions`).then((res) => res.data),

    extractKeywords: (text: string) =>
        api.post('/ai/keywords/extract', { text }).then((res) => res.data),

    fixGrammar: (text: string) =>
        api.post('/ai/grammar/fix', { text }).then((res) => res.data),

    improveText: (text: string, tone?: string) =>
        api.post('/ai/text/improve', { text, tone }).then((res) => res.data),

    analyzeCommunication: (text: string, context?: string) =>
        api.post('/ai/communication/analyze', { text, context }).then((res) => res.data),
};
