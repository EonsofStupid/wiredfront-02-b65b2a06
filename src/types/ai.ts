import { LucideIcon } from "lucide-react";

export type AIMode = "chat" | "code" | "file";
export type AIProvider = "gemini" | "chatgpt" | "huggingface" | "anthropic" | "mistral" | "cohere";

export interface AIProviderConfig {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  apiKeyRequired: boolean;
  models: string[];
  icon: LucideIcon;
}

export interface AISettingsData {
  id?: string;
  user_id: string;
  provider: AIProvider;
  api_key: string | null;
  model_name: string | null;
  max_tokens: number | null;
  temperature: number | null;
  is_active: boolean;
  metadata?: {
    fallbackEnabled?: boolean;
    offlineMode?: boolean;
    routingStrategy?: string;
    [key: string]: any;
  };
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AICommand {
  type: 'navigation' | 'task' | 'file' | 'settings';
  action: string;
  params?: Record<string, any>;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}