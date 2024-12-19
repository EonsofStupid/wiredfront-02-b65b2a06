import { Theme } from '@/types/theme';

export const baseTheme: Theme = {
  colors: {
    primary: '#00FFFF',
    secondary: '#FF007F',
    accent: '#9D00FF',
    background: '#1A1A1A',
    text: '#FFFFFF',
    muted: '#666666'
  },
  effects: {
    neon: {
      enabled: true,
      intensity: 0.7,
      color: '#00FFFF'
    },
    glassmorphism: {
      enabled: true,
      opacity: 0.1,
      blur: 8
    },
    gradient: {
      enabled: true,
      intensity: 0.7, // Added this property
      colors: ['#00FFFF', '#FF007F', '#9D00FF'],
      angle: 45
    }
  },
  animation: {
    speed: 'normal',
    enabled: true,
    type: 'fade'
  },
  spacing: {
    unit: 4,
    scale: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24]
  },
  typography: {
    fontFamily: 'system-ui, sans-serif',
    scale: [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72]
  }
};