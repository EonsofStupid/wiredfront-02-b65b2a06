import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { InterfaceState, Position } from '@/types/ai/state';
import type { Json } from '@/integrations/supabase/types';

export const useInterfaceStore = create<InterfaceState & {
  setPosition: (position: Position) => void;
  setDragging: (dragging: boolean) => void;
  setProcessing: (processing: boolean) => void;
  savePreferences: () => Promise<void>;
}>((set, get) => ({
  position: { x: 20, y: 20 },
  isDragging: false,
  isProcessing: false,

  setPosition: (position) => {
    set({ position });
    get().savePreferences();
  },
  
  setDragging: (dragging) => set({ isDragging: dragging }),
  setProcessing: (processing) => set({ isProcessing: processing }),

  savePreferences: async () => {
    try {
      const { position } = get();
      const configData = {
        position: {
          x: position.x,
          y: position.y
        }
      };

      const { error } = await supabase
        .from('ai_unified_config')
        .upsert({
          config_type: 'interface',
          config_data: configData as Json,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to save interface preferences:', error);
    }
  },
}));