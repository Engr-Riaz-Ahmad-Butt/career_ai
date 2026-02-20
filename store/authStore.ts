import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  plan: 'free' | 'pro-monthly' | 'pro-annual' | 'team';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateCredits: (amount: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      credits: 10,
      plan: 'free',
    };
    set({ user, isAuthenticated: true, isLoading: false });
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      credits: 10,
      plan: 'free',
    };
    set({ user, isAuthenticated: true, isLoading: false });
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  },

  updateCredits: (amount: number) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, credits: state.user.credits + amount };
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },
}));
