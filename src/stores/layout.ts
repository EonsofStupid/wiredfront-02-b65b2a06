import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { LayoutStore } from '@/types/store/layout';

const persistConfig = {
  name: 'layout-storage',
  storage: {
    getItem: (name: string) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: any) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  },
  partialize: (state: LayoutStore) => ({
    sidebarOpen: state.sidebarOpen,
    rightSidebarOpen: state.rightSidebarOpen,
    topBarVisible: state.topBarVisible,
    bottomBarVisible: state.bottomBarVisible,
    sidebarWidth: state.sidebarWidth,
    rightSidebarWidth: state.rightSidebarWidth,
  }),
};

export const useLayoutStore = create<LayoutStore>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        rightSidebarOpen: false,
        topBarVisible: true,
        bottomBarVisible: true,
        sidebarWidth: 240,
        rightSidebarWidth: 240,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setRightSidebarOpen: (open) => set({ rightSidebarOpen: open }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        toggleRightSidebar: () => set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
        setTopBarVisible: (visible) => set({ topBarVisible: visible }),
        setBottomBarVisible: (visible) => set({ bottomBarVisible: visible }),
        setSidebarWidth: (width) => set({ sidebarWidth: width }),
        setRightSidebarWidth: (width) => set({ rightSidebarWidth: width }),
      }),
      persistConfig
    ),
    { name: 'Layout Store' }
  )
);