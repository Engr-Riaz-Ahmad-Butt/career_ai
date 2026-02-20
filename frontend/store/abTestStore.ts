import { create } from 'zustand';
import { ABTestVariant, ABTestResult, generateABTestPrediction } from '@/lib/ab-testing-data';

interface ABTestState {
  tests: ABTestResult[];
  createTest: (
    variantA: ABTestVariant,
    variantB: ABTestVariant,
    jobDescription: string
  ) => ABTestResult;
  getTests: () => ABTestResult[];
  getTestById: (id: string) => ABTestResult | undefined;
  deleteTest: (id: string) => void;
}

export const useABTestStore = create<ABTestState>((set, get) => ({
  tests: [],

  createTest: (variantA, variantB, jobDescription) => {
    const test = generateABTestPrediction(variantA, variantB, jobDescription);
    set((state) => ({
      tests: [test, ...state.tests],
    }));
    return test;
  },

  getTests: () => get().tests,

  getTestById: (id) => get().tests.find((t) => t.id === id),

  deleteTest: (id) =>
    set((state) => ({
      tests: state.tests.filter((t) => t.id !== id),
    })),
}));
