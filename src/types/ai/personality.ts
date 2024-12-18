import { Json } from '@/integrations/supabase/types';

export interface AIPersonality {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  changed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIPersonalityTrait {
  id: string;
  personality_id: string;
  trait_key: string;
  trait_value: Json;
  created_at: string;
  updated_at: string;
}

export interface AIPersonalityHistory {
  id: string;
  personality_id: string;
  changes: Json;
  changed_by: string;
  changed_at: string;
}

export interface AIMemory {
  id: string;
  personality_id: string;
  context_key: string;
  context_value: Json;
  expires_at: string | null;
  created_at: string;
}

export interface AISetting {
  id: string;
  user_id: string | null;
  key: string;
  value: Json;
  created_at: string;
  updated_at: string;
}