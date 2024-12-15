export type SetupStatus = 'not_started' | 'in_progress' | 'completed';

export interface WizardConfig {
  current_step: number;
  setup_status: SetupStatus;
  environment_config: {
    typescript?: boolean;
    tailwind?: boolean;
    shadcn?: boolean;
    supabase?: boolean;
  };
  ai_config: {
    provider?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
  bot_config: {
    name?: string;
    description?: string;
    enableLogging?: boolean;
    enableAutoComplete?: boolean;
    personality?: string;
  };
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeMode;
  language: string;
  defaultView: string;
  refreshInterval: number;
  notifications: boolean;
  timezone: string;
}

export interface SettingsContextValue {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}
