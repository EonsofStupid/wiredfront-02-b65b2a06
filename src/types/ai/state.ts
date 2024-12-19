import type { Json } from '@/integrations/supabase/types';
import type { AIProvider } from '../ai';
import type { LucideIcon } from 'lucide-react';

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

export interface PersonalityState {
  currentPersonality: {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
  } | null;
  traits: Array<{
    id: string;
    personality_id: string;
    trait_key: string;
    trait_value: Json;
  }>;
  isLoading: boolean;
  error: string | null;
}

export interface InterfaceState {
  position: Position;
  isDragging: boolean;
  isProcessing: boolean;
}

export interface ProviderState {
  currentProvider: AIProvider;
  apiKey: string | null;
  isConfigured: boolean;
  error: string | null;
}

export interface AIConfigData {
  [key: string]: Json | undefined;
}