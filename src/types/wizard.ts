import { Json } from "@/integrations/supabase/types";

export type SetupStatus = 'not_started' | 'in_progress' | 'completed';

export interface EnvironmentConfig {
  typescript?: boolean;
  tailwind?: boolean;
  shadcn?: boolean;
  supabase?: boolean;
}

export interface AIConfig {
  provider?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface BotConfig {
  name?: string;
  description?: string;
  enableLogging?: boolean;
  enableAutoComplete?: boolean;
  personality?: string;
}

export interface WizardConfig {
  current_step: number;
  setup_status: SetupStatus;
  environment_config: EnvironmentConfig;
  ai_config: AIConfig;
  bot_config: BotConfig;
}

export interface WizardConfigResponse {
  id: string;
  user_id: string;
  current_step: number;
  setup_status: SetupStatus;
  environment_config: Json;
  ai_config: Json;
  bot_config: Json;
  created_at: string;
  updated_at: string;
}