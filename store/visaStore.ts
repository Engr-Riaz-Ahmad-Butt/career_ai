import { create } from 'zustand';
import { VisaSponsorship, ScholarshipInfo, FinancialProof } from '@/lib/visa-scholarship-data';

interface VisaState {
  selectedMode: 'job-visa' | 'scholarship' | null;
  selectedCountry: string;
  savedProofs: FinancialProof[];
  sopDocuments: Record<string, string>;
  
  setMode: (mode: 'job-visa' | 'scholarship') => void;
  setCountry: (country: string) => void;
  saveFinancialProof: (proof: FinancialProof) => void;
  saveSOP: (visaType: string, document: string) => void;
  getSOP: (visaType: string) => string | undefined;
}

export const useVisaStore = create<VisaState>((set, get) => ({
  selectedMode: null,
  selectedCountry: '',
  savedProofs: [],
  sopDocuments: {},

  setMode: (mode) =>
    set({ selectedMode: mode }),

  setCountry: (country) =>
    set({ selectedCountry: country }),

  saveFinancialProof: (proof) =>
    set((state) => ({
      savedProofs: [...state.savedProofs, proof],
    })),

  saveSOP: (visaType, document) =>
    set((state) => ({
      sopDocuments: {
        ...state.sopDocuments,
        [visaType]: document,
      },
    })),

  getSOP: (visaType) => get().sopDocuments[visaType],
}));
