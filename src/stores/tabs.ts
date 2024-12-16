import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Route } from './routes';

interface Tab extends Route {
  id: string;
  timestamp: number;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (route: Route) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  clearTabs: () => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      tabs: [],
      activeTabId: null,
      addTab: (route) => set((state) => {
        // Don't add duplicate tabs
        if (state.tabs.some(tab => tab.path === route.path)) {
          return state;
        }
        const newTab = { 
          ...route, 
          id: crypto.randomUUID(), 
          timestamp: Date.now() 
        };
        return {
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id
        };
      }),
      removeTab: (id) => set((state) => ({
        tabs: state.tabs.filter(tab => tab.id !== id),
        activeTabId: state.activeTabId === id 
          ? state.tabs[state.tabs.length - 2]?.id ?? null 
          : state.activeTabId
      })),
      setActiveTab: (id) => set({ activeTabId: id }),
      clearTabs: () => set({ tabs: [], activeTabId: null })
    }),
    {
      name: 'tab-storage'
    }
  )
);