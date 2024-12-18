import { create } from 'zustand';
import type { AIProvider, AIMode } from '@/types/ai';

interface AIState {
  isEnabled: boolean;
  isVisible: boolean;
  currentProvider: AIProvider;
  mode: AIMode;
  isProcessing: boolean;
  lastResponse: string | null;
  setEnabled: (enabled: boolean) => void;
  setProvider: (provider: AIProvider) => void;
  setMode: (mode: AIMode) => void;
  setProcessing: (processing: boolean) => void;
  setLastResponse: (response: string | null) => void;
  toggleAIAssistant: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  isEnabled: true,
  isVisible: true,
  currentProvider: 'gemini',
  mode: 'chat',
  isProcessing: false,
  lastResponse: null,
  setEnabled: (enabled) => set({ isEnabled: enabled }),
  setProvider: (provider) => set({ currentProvider: provider }),
  setMode: (mode) => set({ mode: mode }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setLastResponse: (response) => set({ lastResponse: response }),
  toggleAIAssistant: () => set((state) => ({ isVisible: !state.isVisible })),
}));