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

export interface AIConfigData {
  personality?: PersonalitySettings;
  memoryTypes?: MemoryType[];
  apiKey?: string;
  position?: Position;
  [key: string]: Json | undefined;
}