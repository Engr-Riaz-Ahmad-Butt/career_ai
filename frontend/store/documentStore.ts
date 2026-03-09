import { create } from 'zustand';
import { ResumeData, ResumeTemplate, ResumeExperience, ResumeEducation, ResumeSkills, ResumeStyling } from '@/types/resume';

interface DocumentState {
  currentResume: ResumeData | null;
  isDirty: boolean;
  lastSaved: Date | null;

  // Actions
  setResume: (resume: ResumeData | null) => void;
  updateContact: (contact: Partial<ResumeData['personalInfo']>) => void;
  updateSummary: (summary: string) => void;
  updateSkills: (skills: Partial<ResumeSkills>) => void;
  updateExperience: (experience: ResumeExperience[]) => void;
  updateEducation: (education: ResumeEducation[]) => void;
  updateTemplate: (template: string) => void;
  updateStyling: (styling: Partial<ResumeStyling>) => void;
  updateTitle: (title: string) => void;
  setFullResume: (data: Partial<ResumeData>) => void;
  markSaved: () => void;
  clear: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  currentResume: null,
  isDirty: false,
  lastSaved: null,

  setResume: (resume) => set({
    currentResume: resume,
    isDirty: false,
    lastSaved: resume ? new Date(resume.updatedAt) : null
  }),

  updateContact: (contact) => set((state) => {
    if (!state.currentResume) return state;
    return {
      isDirty: true,
      currentResume: {
        ...state.currentResume,
        personalInfo: { ...state.currentResume.personalInfo, ...contact },
        updatedAt: new Date(),
      }
    };
  }),

  updateSummary: (summary) => set((state) => {
    if (!state.currentResume) return state;
    return {
      isDirty: true,
      currentResume: {
        ...state.currentResume,
        summary,
        updatedAt: new Date(),
      }
    };
  }),

  updateSkills: (skills) => set((state) => {
    if (!state.currentResume) return state;
    return {
      isDirty: true,
      currentResume: {
        ...state.currentResume,
        skills: { ...state.currentResume.skills, ...skills },
        updatedAt: new Date(),
      }
    };
  }),

  updateExperience: (experience) => set((state) => {
    if (!state.currentResume) return state;
    return {
      isDirty: true,
      currentResume: {
        ...state.currentResume,
        experience,
        updatedAt: new Date(),
      }
    };
  }),

  updateEducation: (education) => set((state) => {
    if (!state.currentResume) return state;
    return {
      isDirty: true,
      currentResume: {
        ...state.currentResume,
        education,
        updatedAt: new Date(),
      }
    };
  }),

  updateTemplate: (template) => set((state) => {
    if (!state.currentResume) return state;
    return {
      isDirty: true,
      currentResume: {
        ...state.currentResume,
        template,
        updatedAt: new Date(),
      }
    };
  }),

  updateStyling: (styling) => set((state) => {
    if (!state.currentResume) return state;
    return {
      isDirty: true,
      currentResume: {
        ...state.currentResume,
        styling: { ...state.currentResume.styling, ...styling },
        updatedAt: new Date(),
      }
    };
  }),

  updateTitle: (title) => set((state) => {
    if (!state.currentResume) return state;
    return {
      isDirty: true,
      currentResume: {
        ...state.currentResume,
        title,
        updatedAt: new Date(),
      }
    };
  }),

  setFullResume: (data) => set((state) => {
    if (!state.currentResume) return state;
    return {
      isDirty: true,
      currentResume: {
        ...state.currentResume,
        ...data,
        updatedAt: new Date(),
      }
    };
  }),

  markSaved: () => set({ isDirty: false, lastSaved: new Date() }),

  clear: () => set({ currentResume: null, isDirty: false, lastSaved: null }),
}));

