import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  upgradeModalOpen: boolean;
  setUpgradeModalOpen: (open: boolean) => void;
  
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  
  loadingStates: Record<string, boolean>;
  setLoading: (key: string, loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  upgradeModalOpen: false,
  setUpgradeModalOpen: (open: boolean) => set({ upgradeModalOpen: open }),

  darkMode: false,
  setDarkMode: (dark: boolean) => set({ darkMode: dark }),

  loadingStates: {},
  setLoading: (key: string, loading: boolean) =>
    set((state) => ({
      loadingStates: { ...state.loadingStates, [key]: loading },
    })),
}));
