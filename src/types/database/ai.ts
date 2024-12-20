import { Json } from '@/integrations/supabase/types';

export interface AITask {
  id: string;
  task_id: string;
  type: string;
  prompt: string;
  provider: string;
  status: string;
  result?: string;
  priority: number;
  metadata: Json;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
}

export interface AIModelConfig {
  id: string;
  model_name: string;
  model_type: string;
  is_active: boolean;
  local_model_path?: string;
  training_status: string;
  metadata: Json;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AISetting {
  id: string;
  user_id?: string;
  key: string;
  value: Json;
  created_at?: string;
  updated_at?: string;
}

export type AIProvider = 'gemini' | 'chatgpt' | 'huggingface' | 'anthropic' | 'mistral' | 'cohere';