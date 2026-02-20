import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/lib/languages';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: 'en',
      setLanguage: (language: Language) => set({ currentLanguage: language }),
    }),
    {
      name: 'language-storage',
    }
  )
);
