export interface VisualPreferences {
  effects: {
    intensity: number;
    bars: {
      top: BarPreference;
      bottom: BarPreference;
      side: BarPreference;
    };
  };
}

export interface BarPreference {
  color: string;
  opacity: number;
}