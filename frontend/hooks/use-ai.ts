import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api-client';

export const aiApi = {
    generateResume: (data: any) => api.post('/ai/generate-resume', data).then((res) => res.data),
    tailorResume: (data: any) => api.post('/ai/tailor-resume', data).then((res) => res.data),
    improveResume: (data: any) => api.post('/ai/improve-resume', data).then((res) => res.data),
    analyzeATS: (data: any) => api.post('/ai/analyze-ats', data).then((res) => res.data),
    generateCoverLetter: (data: any) => api.post('/ai/generate-cover-letter', data).then((res) => res.data),
    generateSOP: (data: any) => api.post('/ai/generate-sop', data).then((res) => res.data),
    generateLinkedInBio: (data: any) => api.post('/ai/generate-linkedin-bio', data).then((res) => res.data),
    generateInterviewPrep: (data: any) => api.post('/ai/interview-prep', data).then((res) => res.data),
    getCredits: () => api.get('/ai/credits').then((res) => res.data),
};

export const useAI = () => {
    return {
        generateResume: useMutation({ mutationFn: aiApi.generateResume }),
        tailorResume: useMutation({ mutationFn: aiApi.tailorResume }),
        improveResume: useMutation({ mutationFn: aiApi.improveResume }),
        analyzeATS: useMutation({ mutationFn: aiApi.analyzeATS }),
        generateCoverLetter: useMutation({ mutationFn: aiApi.generateCoverLetter }),
        generateSOP: useMutation({ mutationFn: aiApi.generateSOP }),
        generateLinkedInBio: useMutation({ mutationFn: aiApi.generateLinkedInBio }),
        generateInterviewPrep: useMutation({ mutationFn: aiApi.generateInterviewPrep }),
    };
};
