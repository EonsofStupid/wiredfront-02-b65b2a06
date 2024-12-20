import type { LucideIcon } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';
import type { AIProvider } from '@/types/ai';
import type { AIPersonality, AIPersonalityTrait } from './personality';

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