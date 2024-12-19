import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { AIProvider } from '@/types/ai';

interface ProviderState {
  currentProvider: AIProvider;
  apiKey: string | null;
  isConfigured: boolean;
  error: string | null;
  setProvider: (provider: AIProvider) => void;
  setApiKey: (key: string) => Promise<void>;
  checkConfiguration: () => Promise<void>;
}

export const useProviderStore = create<ProviderState>((set) => ({
  currentProvider: 'gemini',
  apiKey: null,
  isConfigured: false,
  error: null,

  setProvider: (provider) => set({ currentProvider: provider }),

  setApiKey: async (key) => {
    try {
      const { error } = await supabase
        .from('ai_unified_config')
        .upsert({
          config_type: 'provider',
          config_data: { apiKey: key },
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
      
      const isConfigured = Boolean(data?.config_data?.apiKey);
      set({ 
        isConfigured,
        apiKey: data?.config_data?.apiKey || null 
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));