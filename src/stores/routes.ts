import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Home, Settings, User, Bot, FileText } from 'lucide-react';

export interface Route {
  id: string;
  path: string;
  label: string;
  icon: any;
  isEnabled: boolean;
  requiresAuth: boolean;
  component?: React.ComponentType;
}

interface RoutesState {
  routes: Route[];
  addRoute: (route: Omit<Route, 'id'>) => void;
  updateRoute: (id: string, updates: Partial<Route>) => void;
  deleteRoute: (id: string) => void;
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
          routes: [...state.routes, { ...route, id: crypto.randomUUID() }],
        })),
      updateRoute: (id, updates) =>
        set((state) => ({
          routes: state.routes.map((route) =>
            route.id === id ? { ...route, ...updates } : route
          ),
        })),
      deleteRoute: (id) =>
        set((state) => ({
          routes: state.routes.filter((route) => route.id !== id),
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