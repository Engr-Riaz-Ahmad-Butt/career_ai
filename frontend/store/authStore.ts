'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';

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
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

      register: async (email, password, name) => {
        const [firstName, ...rest] = name.split(' ');
        const lastName = rest.join(' ') || '.';
        const response = await authApi.signup({ firstName, lastName, email, password });
        const { user, accessToken, refreshToken } = response.data;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        set({ user, isAuthenticated: true });
      },

      login: async (email, password) => {
        const response = await authApi.login({ email, password });
        const { user, accessToken, refreshToken } = response.data;

        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        set({ user, isAuthenticated: true });
      },

      logout: async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            await authApi.logout(refreshToken);
          }
        } catch (error) {
          console.error('Logout API call failed:', error);
        } finally {
          // Always clear local state even if API fails
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({ user: null, isAuthenticated: false });
        }
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
