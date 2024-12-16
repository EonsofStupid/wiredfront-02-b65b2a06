import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Home, Settings as SettingsIcon, User, FileText, Image } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Dashboard from '@/pages/Dashboard';
import SettingsPage from '@/pages/Settings';
import Profile from '@/pages/Profile';
import { FileManager } from '@/components/file/FileManager';

export interface Route {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
  component: React.ComponentType;
  isEnabled: boolean;
  requiresAuth: boolean;
  showInSidebar: boolean;
  showInNavigation: boolean;
}

interface RoutesState {
  routes: Route[];
  addRoute: (route: Omit<Route, 'id'>) => void;
  removeRoute: (id: string) => void;
  updateRoute: (id: string, updates: Partial<Route>) => void;
  toggleRoute: (id: string) => void;
}

export const useRoutesStore = create<RoutesState>()(
  persist(
    (set) => ({
      routes: [
        {
          id: 'dashboard',
          path: '/dashboard',
          label: 'Dashboard',
          icon: Home,
          component: Dashboard,
          isEnabled: true,
          requiresAuth: true,
          showInSidebar: true,
          showInNavigation: true,
        },
        {
          id: 'settings',
          path: '/settings',
          label: 'Settings',
          icon: SettingsIcon,
          component: SettingsPage,
          isEnabled: true,
          requiresAuth: true,
          showInSidebar: true,
          showInNavigation: true,
        },
        {
          id: 'profile',
          path: '/profile',
          label: 'Profile',
          icon: User,
          component: Profile,
          isEnabled: true,
          requiresAuth: true,
          showInSidebar: true,
          showInNavigation: true,
        },
        {
          id: 'files',
          path: '/files',
          label: 'Files',
          icon: FileText,
          component: FileManager,
          isEnabled: true,
          requiresAuth: true,
          showInSidebar: true,
          showInNavigation: true,
        }
      ],
      addRoute: (route) =>
        set((state) => ({
          routes: [...state.routes, {
            id: crypto.randomUUID(),
            ...route,
          }],
        })),
      removeRoute: (id) =>
        set((state) => ({
          routes: state.routes.filter((route) => route.id !== id),
        })),
      updateRoute: (id, updates) =>
        set((state) => ({
          routes: state.routes.map((route) =>
            route.id === id ? { ...route, ...updates } : route
          ),
        })),
      toggleRoute: (id) =>
        set((state) => ({
          routes: state.routes.map((route) =>
            route.id === id ? { ...route, isEnabled: !route.isEnabled } : route
          ),
        })),
    }),
    {
      name: 'routes-storage',
    }
  )
);