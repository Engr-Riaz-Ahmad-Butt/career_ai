import { useMutation } from '@tanstack/react-query';
import api from '@/lib/apiClient';
import {
    generateResumeSchema,
    tailorResumeSchema,
    improveResumeSchema,
    analyzeATSSchema,
    generateInterviewPrepSchema,
    generateCoverLetterSchema,
} from '@/lib/validation';
import { z } from 'zod';

type GenerateResumeInput = z.infer<typeof generateResumeSchema>;
type TailorResumeInput = z.infer<typeof tailorResumeSchema>;
type ImproveResumeInput = z.infer<typeof improveResumeSchema>;
type AnalyzeATSInput = z.infer<typeof analyzeATSSchema>;
type GenerateInterviewPrepInput = z.infer<typeof generateInterviewPrepSchema>;
type CoverLetterInput = z.infer<typeof generateCoverLetterSchema>;
type LinkedInBioInput = {
    bioType: string;
    resumeId?: string;
    name?: string;
    currentRole?: string;
    company?: string;
    yearsOfExperience?: number;
    keySkills?: string[];
    tone?: string;
    wordLimit?: number;
    includeCallToAction?: boolean;
};

export const aiApi = {
    generateResume: (data: GenerateResumeInput) => api.post('/ai/generate-resume', data).then((res) => res.data),
    tailorResume: (data: TailorResumeInput) => api.post('/ai/tailor-resume', data).then((res) => res.data),
    improveResume: (data: ImproveResumeInput) => api.post('/ai/improve-resume', data).then((res) => res.data),
    analyzeATS: (data: AnalyzeATSInput) => api.post('/ai/analyze-ats', data).then((res) => res.data),
    generateCoverLetter: (data: CoverLetterInput) => api.post('/ai/cover-letter/generate', data).then((res) => res.data),
    generateSOP: (data: CoverLetterInput) => api.post('/ai/sop/generate', data).then((res) => res.data),
    generateLinkedInBio: (data: LinkedInBioInput) => api.post('/ai/bio/generate', data).then((res) => res.data),
    generateInterviewPrep: (data: GenerateInterviewPrepInput) => api.post('/ai/interview/generate', data).then((res) => res.data),
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
