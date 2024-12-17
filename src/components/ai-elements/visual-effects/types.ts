import type { Json } from '@/integrations/supabase/types';

export interface BarPreference {
  color: string;
  opacity: number;
}

export interface VisualEffects {
  intensity: number;
  bars: {
    top: BarPreference;
    bottom: BarPreference;
    side: BarPreference;
  };
}

export interface VisualPreferences {
  effects: VisualEffects;
}

export interface ThemeEffects {
  neon: {
    enabled: boolean;
    intensity: number;
    color: string;
  };
  gradient: {
    enabled: boolean;
    intensity: number; // Added missing intensity property
    colors: string[];
    angle: number;
  };
}

// Helper function to convert VisualPreferences to Json type for Supabase
export const toJson = (prefs: VisualPreferences): Json => {
  // First convert to unknown, then to Json to ensure type safety
  return JSON.parse(JSON.stringify(prefs)) as Json;
};

// Type guard to validate the shape of data from Supabase
export function isValidVisualPreferences(data: unknown): data is VisualPreferences {
  if (!data || typeof data !== 'object') return false;
  
  const effects = (data as any).effects;
  if (!effects || typeof effects !== 'object') return false;
  
  const { intensity, bars } = effects;
  if (typeof intensity !== 'number' || !bars || typeof bars !== 'object') return false;
  
  const barTypes = ['top', 'bottom', 'side'];
  return barTypes.every(type => {
    const bar = (bars as any)[type];
    return bar && 
           typeof bar.color === 'string' && 
           typeof bar.opacity === 'number';
  });
}