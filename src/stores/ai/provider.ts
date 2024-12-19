import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { ProviderState, AIConfigData } from '@/types/ai/state';
import type { AIProvider } from '@/types/ai';

export const useProviderStore = create<ProviderState & {
  setProvider: (provider: AIProvider) => void;
  setApiKey: (key: string) => Promise<void>;
  checkConfiguration: () => Promise<void>;
}>((set) => ({
  currentProvider: 'gemini',
  apiKey: null,
  isConfigured: false,
  error: null,

  setProvider: (provider) => set({ currentProvider: provider }),

  setApiKey: async (key) => {
    try {
      const configData: AIConfigData = {
        apiKey: key
      };

      const { error } = await supabase
        .from('ai_unified_config')
        .upsert({
          config_type: 'provider',
          config_data: configData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      set({ apiKey: key, error: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  checkConfiguration: async () => {
    try {
      const { data, error } = await supabase
        .from('ai_unified_config')
        .select('config_data')
        .eq('config_type', 'provider')
        .single();

      if (error) throw error;
      
      const configData = data?.config_data as AIConfigData;
      const isConfigured = Boolean(configData?.apiKey);
      set({ 
        isConfigured,
        apiKey: configData?.apiKey || null 
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));