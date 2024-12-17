import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ThemeState {
  componentThemes: Record<string, any>;
  isLoading: boolean;
  error: string | null;
  loadTheme: (componentType: string, themeName: string) => Promise<void>;
  saveTheme: (componentType: string, themeName: string, styles: any) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  componentThemes: {},
  isLoading: false,
  error: null,

  loadTheme: async (componentType: string, themeName: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('component_themes')
        .select('*')
        .eq('component_type', componentType)
        .eq('theme_name', themeName)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      set(state => ({
        componentThemes: {
          ...state.componentThemes,
          [componentType]: data.styles
        }
      }));
    } catch (error: any) {
      set({ error: error.message });
      toast({
        variant: "destructive",
        title: "Error loading theme",
        description: error.message
      });
    } finally {
      set({ isLoading: false });
    }
  },

  saveTheme: async (componentType: string, themeName: string, styles: any) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('component_themes')
        .upsert({
          component_type: componentType,
          theme_name: themeName,
          styles,
          is_active: true
        });

      if (error) throw error;

      set(state => ({
        componentThemes: {
          ...state.componentThemes,
          [componentType]: styles
        }
      }));

      toast({
        title: "Theme saved",
        description: `Successfully saved theme for ${componentType}`
      });
    } catch (error: any) {
      set({ error: error.message });
      toast({
        variant: "destructive",
        title: "Error saving theme",
        description: error.message
      });
    } finally {
      set({ isLoading: false });
    }
  }
}));