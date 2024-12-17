import { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@/types/theme';
import { baseTheme } from '@/styles/theme/base';
import { supabase } from '@/integrations/supabase/client';

interface ThemeContextType {
  theme: Theme;
  updateTheme: (updates: Partial<Theme>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(baseTheme);

  useEffect(() => {
    loadUserTheme();
  }, []);

  const loadUserTheme = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('user_visual_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      if (data?.theme_preference) {
        setTheme(prev => ({
          ...prev,
          ...JSON.parse(data.theme_preference)
        }));
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const updateTheme = async (updates: Partial<Theme>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase
        .from('user_visual_preferences')
        .upsert({
          user_id: session.user.id,
          theme_preference: JSON.stringify(newTheme)
        });
    } catch (error) {
      console.error('Error saving theme:', error);
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