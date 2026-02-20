import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  avatar?: string;
  phone?: string;
  location?: string;
  timezone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateCredits: (amount: number) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      updateCredits: (amount: number) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: { ...state.user, credits: state.user.credits + amount },
          };
        });
      },

      clearAuth: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      },
    }),
    {
      name: 'careerforge-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

