export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

export interface ThemeEffects {
  neon: {
    enabled: boolean;
    intensity: number;
    color: string;
  };
  glassmorphism: {
    enabled: boolean;
    opacity: number;
    blur: number;
  };
  gradient: {
    enabled: boolean;
    intensity: number; // Added this property
    colors: string[];
    angle: number;
  };
}

export interface ThemeAnimation {
  speed: 'slow' | 'normal' | 'fast';
  enabled: boolean;
  type: 'fade' | 'slide' | 'scale';
}

export interface Theme {
  colors: ThemeColors;
  effects: ThemeEffects;
  animation: ThemeAnimation;
  spacing: {
    unit: number;
    scale: number[];
  };
  typography: {
    fontFamily: string;
    scale: number[];
  };
}