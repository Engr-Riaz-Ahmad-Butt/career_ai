import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  step: number;
  resumeId: string | null;
  jobDescription: string | null;
  atsScore: number | null;
  generatedDocumentId: string | null;
  generatedDocumentType: 'COVER_LETTER' | 'LINKEDIN_BIO' | null;

  // Actions
  setStep: (step: number) => void;
  setResumeId: (id: string | null) => void;
  setJobDescription: (jd: string | null) => void;
  setAtsScore: (score: number | null) => void;
  setGeneratedDocument: (id: string | null, type: 'COVER_LETTER' | 'LINKEDIN_BIO' | null) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 1,
      resumeId: null,
      jobDescription: null,
      atsScore: null,
      generatedDocumentId: null,
      generatedDocumentType: null,

      setStep: (step) => set({ step }),
      setResumeId: (resumeId) => set({ resumeId }),
      setJobDescription: (jobDescription) => set({ jobDescription }),
      setAtsScore: (atsScore) => set({ atsScore }),
      setGeneratedDocument: (id, type) => set({ generatedDocumentId: id, generatedDocumentType: type }),
      reset: () => set({
        step: 1,
        resumeId: null,
        jobDescription: null,
        atsScore: null,
        generatedDocumentId: null,
        generatedDocumentType: null,
      }),
    }),
    {
      name: 'career-ai-onboarding',
    }
  )
);
