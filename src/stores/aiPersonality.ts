import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { AIPersonality, AIPersonalityTrait, AIMemory } from '@/types/ai/personality';

interface AIPersonalityState {
  currentPersonality: AIPersonality | null;
  traits: AIPersonalityTrait[];
  memories: AIMemory[];
  isLoading: boolean;
  error: string | null;
  setCurrentPersonality: (personality: AIPersonality | null) => void;
  fetchPersonality: (id: string) => Promise<void>;
  updatePersonality: (id: string, updates: Partial<AIPersonality>) => Promise<void>;
  fetchTraits: (personalityId: string) => Promise<void>;
  updateTrait: (traitId: string, value: any) => Promise<void>;
}

export const useAIPersonalityStore = create<AIPersonalityState>((set, get) => ({
  currentPersonality: null,
  traits: [],
  memories: [],
  isLoading: false,
  error: null,

  setCurrentPersonality: (personality) => set({ currentPersonality: personality }),

  fetchPersonality: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('ai_personalities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentPersonality: data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePersonality: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('ai_personalities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set({ currentPersonality: data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTraits: async (personalityId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('ai_personality_traits')
        .select('*')
        .eq('personality_id', personalityId);

      if (error) throw error;
      set({ traits: data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTrait: async (traitId, value) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('ai_personality_traits')
        .update({ trait_value: value })
        .eq('id', traitId)
        .select()
        .single();

      if (error) throw error;
      
      const traits = get().traits.map(trait => 
        trait.id === traitId ? data : trait
      );
      set({ traits });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));