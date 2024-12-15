import type { Json } from "@/integrations/supabase/types";

export interface LogEntry {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  created_at: string;
  metadata: Record<string, any> | null;
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