import type { UIStore, UIAction } from './ui';
import type { AuthStore, AuthAction } from './auth';
import type { DataStore, DataAction } from './data';
import type { SettingsStore, SettingsAction } from './settings';
import type { User, NotificationSettings } from './common';
import type { DashboardMetric, DashboardLayout } from '../dashboard';
import type { StoreMiddleware } from './middleware';
import type { StoreSelectors, SelectorHook } from './selectors';

export interface RootStore {
  ui: UIStore;
  auth: AuthStore;
  data: DataStore;
  settings: SettingsStore;
}

export interface StoreConfig {
  middleware?: StoreMiddleware;
  selectors?: StoreSelectors;
}

export type { 
  UIStore, 
  UIAction,
  AuthStore, 
  AuthAction,
  DataStore, 
  DataAction,
  SettingsStore, 
  SettingsAction,
  User,
  NotificationSettings,
  StoreMiddleware,
  StoreSelectors,
  SelectorHook
};