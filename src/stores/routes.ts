import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Home, Settings, User, Bot, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Route {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
  isEnabled: boolean;
  requiresAuth: boolean;
}

interface RoutesState {
  routes: Route[];
  addRoute: (route: Partial<Route>) => void;
  removeRoute: (path: string) => void;
  updateRoute: (id: string, updates: Partial<Route>) => void;
  toggleRoute: (id: string) => void;
}

export const useRoutesStore = create<RoutesState>()(
  persist(
    (set) => ({
      routes: [
        {
          id: 'home',
          path: '/',
          label: 'Home',
          icon: Home,
          isEnabled: true,
          requiresAuth: false,
        },
        {
          id: 'dashboard',
          path: '/dashboard',
          label: 'Dashboard',
          icon: FileText,
          isEnabled: true,
          requiresAuth: true,
        },
        {
          id: 'settings',
          path: '/settings',
          label: 'Settings',
          icon: Settings,
          isEnabled: true,
          requiresAuth: true,
        },
        {
          id: 'profile',
          path: '/profile',
          label: 'Profile',
          icon: User,
          isEnabled: true,
          requiresAuth: true,
        },
        {
          id: 'discord-bot',
          path: '/discord-bot',
          label: 'Discord Bot',
          icon: Bot,
          isEnabled: true,
          requiresAuth: true,
        }
      ],
      addRoute: (route) =>
        set((state) => ({
          routes: [...state.routes, { 
            ...route, 
            id: crypto.randomUUID(),
            isEnabled: true,
            requiresAuth: true,
            icon: FileText // Default icon
          }],
        })),
      removeRoute: (path) =>
        set((state) => ({
          routes: state.routes.filter((route) => route.path !== path),
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