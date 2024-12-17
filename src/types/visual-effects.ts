export interface NeonEffect {
  enabled: boolean;
  intensity: number;
  color: string;
}

export interface TwilightEffect {
  enabled: boolean;
  intensity: number;
  color: string;
}

export interface ThemeSettings {
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textGlow: boolean;
  animationSpeed: string;
}

export interface PreviewSettings {
  enabled: boolean;
  sampleText: string;
}

export interface VisualEffects {
  effects: {
    neon: NeonEffect;
    twilight: TwilightEffect;
  };
  theme: ThemeSettings;
  preview: PreviewSettings;
}