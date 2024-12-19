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
  currentPersonality: AIPersonality | null;
  traits: AIPersonalityTrait[];
  isLoading: boolean;
  error: string | null;
}

export interface InterfaceState {
  isExpanded: boolean;
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
  personality?: PersonalitySettings;
  memoryTypes?: MemoryType[];
  position?: Position;
  isExpanded?: boolean;
  apiKey?: string;
  provider?: AIProvider;
}