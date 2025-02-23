import type { Json } from "@/integrations/supabase/types";

export interface LogEntry {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  created_at: string;
  metadata: Json | null;
  user_id: string;
}

export interface BotStatus {
  isActive: boolean;
  lastPing: string | null;
  messageCount: number;
}

export interface AIConfigMetadata {
  fallbackEnabled: boolean;
  offlineMode: boolean;
  routingStrategy: string;
  customFunctions?: Array<{
    name: string;
    description: string;
    isEnabled: boolean;
  }>;
}

export interface BotFunction {
  id: string;
  name: string;
  description: string;
  category: 'moderation' | 'fun' | 'utility' | 'custom';
  isEnabled: boolean;
  isPremium: boolean;
  configuration: Record<string, any>;
  code?: string;
}