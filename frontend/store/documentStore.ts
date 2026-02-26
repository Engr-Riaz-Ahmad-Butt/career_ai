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
    photoUrl?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements?: string[];
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field?: string;
    year?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
  styling: {
    spacing: {
      fontSize: number;
      lineHeight: number;
      sideMargin: number;
      topBottomMargin: number;
      entrySpacing: number;
    };
    colors: {
      primary: string;
      accent: string;
      applyToName: boolean;
      applyToTitle: boolean;
      applyToIcons: boolean;
      applyToBubbles: boolean;
    };
    typography: {
      fontFamily: string;
      category: 'Serif' | 'Sans' | 'Mono';
    };
    headingStyle: {
      style: string;
      capitalization: 'capitalize' | 'uppercase';
      size: 'S' | 'M' | 'L' | 'XL';
      icons: 'none' | 'outline' | 'filled';
    };
    personalDetails: {
      align: 'left' | 'center' | 'right';
      arrangement: 'horizontal' | 'vertical';
      iconStyle: string;
    };
    entryLayout: {
      style: string;
    };
  };
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
  updateSkills: (skills: { technical: string[]; soft: string[] }) => void;
  addEducation: (education: ResumeData['education'][0]) => void;
  removeEducation: (id: string) => void;
  updateTemplate: (template: ResumeTemplate) => void;
  updateStyling: (styling: any) => void;
  setFullResume: (resume: Partial<ResumeData>) => void;
  createResumeWithData: (name: string, template: ResumeTemplate, data: Partial<ResumeData>) => void;
  getResumeById: (id: string) => ResumeData | undefined;
  updateResumeName: (id: string, name: string) => void;
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
      skills: { technical: [], soft: [] },
      projects: [],
      certifications: [],
      languages: [],
      interests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      styling: {
        spacing: {
          fontSize: 10,
          lineHeight: 1.2,
          sideMargin: 15,
          topBottomMargin: 15,
          entrySpacing: 5,
        },
        colors: {
          primary: '#000000',
          accent: '#4f46e5',
          applyToName: true,
          applyToTitle: true,
          applyToIcons: true,
          applyToBubbles: true,
        },
        typography: {
          fontFamily: 'Inter',
          category: 'Sans',
        },
        headingStyle: {
          style: 'line-under',
          capitalization: 'uppercase',
          size: 'L',
          icons: 'filled',
        },
        personalDetails: {
          align: 'left',
          arrangement: 'horizontal',
          iconStyle: 'classic',
        },
        entryLayout: {
          style: 'default',
        },
      },
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

  updateResumeName: (id: string, name: string) => {
    set((state) => ({
      resumes: state.resumes.map((r) => r.id === id ? { ...r, name } : r),
      currentResume: state.currentResume?.id === id
        ? { ...state.currentResume, name }
        : state.currentResume,
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

  addEducation: (education: ResumeData['education'][0]) => {
    set((state) => {
      if (!state.currentResume) return state;
      const updated = {
        ...state.currentResume,
        education: [...state.currentResume.education, education],
        updatedAt: new Date(),
      };
      return {
        currentResume: updated,
        resumes: state.resumes.map((r) => (r.id === updated.id ? updated : r)),
      };
    });
  },

  removeEducation: (id: string) => {
    set((state) => {
      if (!state.currentResume) return state;
      const updated = {
        ...state.currentResume,
        education: state.currentResume.education.filter((e) => e.id !== id),
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

  updateSkills: (skills: { technical: string[]; soft: string[] }) => {
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

  updateStyling: (styling: any) => {
    set((state) => {
      if (!state.currentResume) return state;
      const updated = {
        ...state.currentResume,
        styling: { ...state.currentResume.styling, ...styling },
        updatedAt: new Date(),
      };
      return {
        currentResume: updated,
        resumes: state.resumes.map((r) => (r.id === updated.id ? updated : r)),
      };
    });
  },

  setFullResume: (data: Partial<ResumeData>) => {
    set((state) => {
      if (!state.currentResume) return state;
      const updated = {
        ...state.currentResume,
        ...data,
        updatedAt: new Date(),
      };
      return {
        currentResume: updated,
        resumes: state.resumes.map((r) => (r.id === updated.id ? updated : r)),
      };
    });
  },

  createResumeWithData: (name: string, template: ResumeTemplate, data: Partial<ResumeData>) => {
    const baseResume: ResumeData = {
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
      skills: { technical: [], soft: [] },
      projects: [],
      certifications: [],
      languages: [],
      interests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      styling: {
        spacing: {
          fontSize: 10,
          lineHeight: 1.2,
          sideMargin: 15,
          topBottomMargin: 15,
          entrySpacing: 5,
        },
        colors: {
          primary: '#000000',
          accent: '#4f46e5',
          applyToName: true,
          applyToTitle: true,
          applyToIcons: true,
          applyToBubbles: true,
        },
        typography: {
          fontFamily: 'Inter',
          category: 'Sans',
        },
        headingStyle: {
          style: 'line-under',
          capitalization: 'uppercase',
          size: 'L',
          icons: 'filled',
        },
        personalDetails: {
          align: 'left',
          arrangement: 'horizontal',
          iconStyle: 'classic',
        },
        entryLayout: {
          style: 'default',
        },
      },
      atsScore: 0,
    };

    const newResume: ResumeData = {
      ...baseResume,
      ...data,
      id: baseResume.id, // keep generated id
      name,
      template,
    };

    set((state) => ({
      resumes: [...state.resumes, newResume],
      currentResume: newResume,
    }));
  },

  getResumeById: (id: string) => {
    return get().resumes.find((r) => r.id === id);
  },
}));
