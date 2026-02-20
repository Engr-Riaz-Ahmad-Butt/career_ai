import { create } from 'zustand';
import { ResumeTemplate } from '@/lib/resume-templates';

export interface ResumeData {
  id: string;
  name: string;
  template: ResumeTemplate;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  atsScore?: number;
}

interface DocumentState {
  resumes: ResumeData[];
  currentResume: ResumeData | null;
  
  createResume: (name: string, template: ResumeTemplate) => void;
  updateResume: (resume: ResumeData) => void;
  setCurrentResume: (resume: ResumeData | null) => void;
  deleteResume: (id: string) => void;
  addExperience: (experience: ResumeData['experience'][0]) => void;
  removeExperience: (id: string) => void;
  updateContact: (contact: ResumeData['contact']) => void;
  updateSummary: (summary: string) => void;
  updateSkills: (skills: string[]) => void;
  updateTemplate: (template: ResumeTemplate) => void;
  getResumeById: (id: string) => ResumeData | undefined;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  resumes: [],
  currentResume: null,

  createResume: (name: string, template: ResumeTemplate) => {
    const newResume: ResumeData = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      template,
      contact: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      atsScore: 0,
    };
    set((state) => ({
      resumes: [...state.resumes, newResume],
      currentResume: newResume,
    }));
  },

  updateResume: (resume: ResumeData) => {
    set((state) => ({
      resumes: state.resumes.map((r) => (r.id === resume.id ? resume : r)),
      currentResume: state.currentResume?.id === resume.id ? resume : state.currentResume,
    }));
  },

  setCurrentResume: (resume: ResumeData | null) => {
    set({ currentResume: resume });
  },

  deleteResume: (id: string) => {
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== id),
      currentResume: state.currentResume?.id === id ? null : state.currentResume,
    }));
  },

  addExperience: (experience: ResumeData['experience'][0]) => {
    set((state) => {
      if (!state.currentResume) return state;
      const updated = {
        ...state.currentResume,
        experience: [...state.currentResume.experience, experience],
        updatedAt: new Date(),
      };
      return {
        currentResume: updated,
        resumes: state.resumes.map((r) => (r.id === updated.id ? updated : r)),
      };
    });
  },

  removeExperience: (id: string) => {
    set((state) => {
      if (!state.currentResume) return state;
      const updated = {
        ...state.currentResume,
        experience: state.currentResume.experience.filter((e) => e.id !== id),
        updatedAt: new Date(),
      };
      return {
        currentResume: updated,
        resumes: state.resumes.map((r) => (r.id === updated.id ? updated : r)),
      };
    });
  },

  updateContact: (contact: ResumeData['contact']) => {
    set((state) => {
      if (!state.currentResume) return state;
      const updated = {
        ...state.currentResume,
        contact,
        updatedAt: new Date(),
      };
      return {
        currentResume: updated,
        resumes: state.resumes.map((r) => (r.id === updated.id ? updated : r)),
      };
    });
  },

  updateSummary: (summary: string) => {
    set((state) => {
      if (!state.currentResume) return state;
      const updated = {
        ...state.currentResume,
        summary,
        updatedAt: new Date(),
      };
      return {
        currentResume: updated,
        resumes: state.resumes.map((r) => (r.id === updated.id ? updated : r)),
      };
    });
  },

  updateSkills: (skills: string[]) => {
    set((state) => {
      if (!state.currentResume) return state;
      const updated = {
        ...state.currentResume,
        skills,
        updatedAt: new Date(),
      };
      return {
        currentResume: updated,
        resumes: state.resumes.map((r) => (r.id === updated.id ? updated : r)),
      };
    });
  },

  updateTemplate: (template: ResumeTemplate) => {
    set((state) => {
      if (!state.currentResume) return state;
      const updated = {
        ...state.currentResume,
        template,
        updatedAt: new Date(),
      };
      return {
        currentResume: updated,
        resumes: state.resumes.map((r) => (r.id === updated.id ? updated : r)),
      };
    });
  },

  getResumeById: (id: string) => {
    return get().resumes.find((r) => r.id === id);
  },
}));
