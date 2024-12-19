import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Position {
  x: number;
  y: number;
}

interface InterfaceState {
  isExpanded: boolean;
  position: Position;
  isDragging: boolean;
  isProcessing: boolean;
  setExpanded: (expanded: boolean) => void;
  setPosition: (position: Position) => void;
  setDragging: (dragging: boolean) => void;
  setProcessing: (processing: boolean) => void;
  savePreferences: () => Promise<void>;
}

export const useInterfaceStore = create<InterfaceState>((set, get) => ({
  isExpanded: false,
  position: { x: 20, y: 20 },
  isDragging: false,
  isProcessing: false,

  setExpanded: (expanded) => set({ isExpanded: expanded }),
  setPosition: (position) => set({ position }),
  setDragging: (dragging) => set({ isDragging: dragging }),
  setProcessing: (processing) => set({ isProcessing: processing }),

  savePreferences: async () => {
    const { position, isExpanded } = get();
    try {
      const { error } = await supabase
        .from('ai_unified_config')
        .upsert({
          config_type: 'interface',
          config_data: { position, isExpanded },
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save interface preferences:', error);
    }
  },
}));