import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { SettingsStore, SettingsAction } from '@/types/store/settings';
import type { DevToolsConfig } from '@/types/store/middleware';

const persistConfig = {
  name: 'settings-storage',
  storage: {
    getItem: (name: string) => {
      const str = localStorage.getItem(name);
      return str;
    },
    setItem: (name: string, value: string) => {
      localStorage.setItem(name, value);
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  },
};

const devtoolsConfig: DevToolsConfig = {
  name: 'Settings Store',
  enabled: process.env.NODE_ENV === 'development',
};

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(
      (set) => ({
        preferences: {
          defaultView: 'dashboard',
          refreshInterval: 30000,
          notifications: true,
          timezone: 'UTC',
        },
        dashboardLayout: {
          panels: [],
        },
        notifications: {
          email: true,
          push: true,
          frequency: 'daily',
          types: ['alerts', 'updates'],
        },
        updatePreferences: (updates) => 
          set(
            (state) => ({
              preferences: { ...state.preferences, ...updates },
            }),
            false,
            { type: 'UPDATE_PREFERENCES', payload: updates }
          ),
        saveDashboardLayout: (layout) => 
          set(
            { dashboardLayout: layout },
            false,
            { type: 'SAVE_LAYOUT', payload: layout }
          ),
        updateNotifications: (settings) => 
          set(
            (state) => ({
              notifications: { ...state.notifications, ...settings },
            }),
            false,
            { type: 'UPDATE_NOTIFICATIONS', payload: settings }
          ),
      }),
      persistConfig
    ),
    devtoolsConfig
  )
);