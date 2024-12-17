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