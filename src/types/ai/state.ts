import type { LucideIcon } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

export interface Position {
  x: number;
  y: number;
}

export interface PersonalitySettings {
  friendliness: number;
  assertiveness: number;
  technicalDetail: number;
}

export interface MemoryType {
  id: string;
  label: string;
  icon: LucideIcon;
  enabled: boolean;
}

export interface AIConfigData {
  [key: string]: Json | undefined;
  personality?: PersonalitySettings;
  memoryTypes?: MemoryType[];
  apiKey?: string;
  position?: Position;
}

export interface PersonalityState {
  currentPersonality: AIPersonality | null;
  traits: AIPersonalityTrait[];
  isLoading: boolean;
  error: string | null;
}

export interface ProviderState {
  currentProvider: AIProvider;
  apiKey: string | null;
  isConfigured: boolean;
  error: string | null;
}

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

export type AIProvider = 'gemini' | 'chatgpt' | 'huggingface' | 'anthropic' | 'mistral' | 'cohere';