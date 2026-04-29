'use client';

import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  credits: number;
  plan: 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';
  avatar?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  emailVerified?: boolean;
  onboardingComplete?: boolean;
  currentRole?: string;
  targetRole?: string;
  bio?: string;
  referralCode?: string;
}

interface AuthState {
  // Token stored in memory only — NEVER in localStorage
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  // True during the initial silent refresh on app load
  isLoading: boolean;

  // Setters (used by AuthProvider and auth actions)
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;

  // Updates user credits without a full re-fetch
  updateCredits: (amount: number) => void;

  // Clears all auth state (called on logout)
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as true; AuthProvider sets it false after silent refresh attempt

  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  setIsLoading: (loading) =>
    set({ isLoading: loading }),

  updateCredits: (amount) =>
    set((state) => {
      if (!state.user) return state;
      return {
        user: { ...state.user, credits: state.user.credits + amount },
      };
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
