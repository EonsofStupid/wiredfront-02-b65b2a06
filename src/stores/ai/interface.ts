import { create } from 'zustand';
import type { Position } from '@/types/ai/state';

interface InterfaceState {
  position: Position;
  isDragging: boolean;
  isProcessing: boolean;
}

export const useInterfaceStore = create<InterfaceState & {
  setPosition: (position: Position) => void;
  setDragging: (dragging: boolean) => void;
  setProcessing: (processing: boolean) => void;
}>((set) => ({
  position: { x: 20, y: 20 },
  isDragging: false,
  isProcessing: false,
  
  setPosition: (position) => set({ position }),
  setDragging: (dragging) => set({ isDragging: dragging }),
  setProcessing: (processing) => set({ isProcessing: processing }),
}));