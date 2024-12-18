import { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@/types/theme';
import { baseTheme } from '@/styles/theme/base';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ThemeContextType {
  theme: Theme;
  updateTheme: (updates: Partial<Theme>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(baseTheme);
  const { toast } = useToast();

  useEffect(() => {
    loadUserTheme();
  }, []);

  const loadUserTheme = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // First check if preferences exist
      const { data, error } = await supabase
        .from('user_visual_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows case

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If no preferences exist, create default ones
      if (!data) {
        const { error: insertError } = await supabase
          .from('user_visual_preferences')
          .insert([
            {
              user_id: session.user.id,
              theme_preference: JSON.stringify(baseTheme),
              visual_effects: {
                effects: {
                  intensity: 0.7,
                  bars: {
                    top: { color: "#1A1A1A", opacity: 0.9 },
                    bottom: { color: "#1A1A1A", opacity: 0.9 },
                    side: { color: "#1A1A1A", opacity: 0.9 }
                  }
                }
              }
            }
          ]);

        if (insertError) throw insertError;
        setTheme(baseTheme);
      } else if (data?.theme_preference) {
        // If preferences exist, use them
        setTheme(prev => ({
          ...prev,
          ...JSON.parse(data.theme_preference)
        }));
      }
    } catch (error: any) {
      console.error('Error loading theme:', error);
      toast({
        variant: "destructive",
        title: "Error loading theme",
        description: error.message || "Failed to load theme preferences"
      });
    }
  };

  const updateTheme = async (updates: Partial<Theme>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('user_visual_preferences')
        .upsert({
          user_id: session.user.id,
          theme_preference: JSON.stringify(newTheme)
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error saving theme:', error);
      toast({
        variant: "destructive",
        title: "Error saving theme",
        description: error.message || "Failed to save theme preferences"
      });
    }
  };

  const resetTheme = () => {
    setTheme(baseTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}