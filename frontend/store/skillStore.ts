import { create } from 'zustand';
import { Skill, userSkills } from '@/lib/skill-gap-data';

interface SkillState {
  skills: Skill[];
  jobDescription: string;

  // Actions
  setSkills: (skills: Skill[]) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  setJobDescription: (description: string) => void;
  updateProficiency: (skillId: string, proficiency: Skill['proficiency']) => void;
}

export const useSkillStore = create<SkillState>((set) => ({
  skills: userSkills,
  jobDescription: '',

  setSkills: (skills) => set({ skills }),

  addSkill: (skill) => {
    set((state) => ({
      skills: [...state.skills, skill],
    }));
  },

  updateSkill: (id, updates) => {
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === id ? { ...skill, ...updates } : skill
      ),
    }));
  },

  removeSkill: (id) => {
    set((state) => ({
      skills: state.skills.filter((skill) => skill.id !== id),
    }));
  },

  setJobDescription: (description) => set({ jobDescription: description }),

  updateProficiency: (skillId, proficiency) => {
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === skillId ? { ...skill, proficiency } : skill
      ),
    }));
  },
}));
