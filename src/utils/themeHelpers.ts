import { supabase } from "@/integrations/supabase/client";

export const getComponentTheme = async (componentType: string, themeName: string) => {
  try {
    const { data, error } = await supabase
      .from('component_themes')
      .select('*')
      .eq('component_type', componentType)
      .eq('theme_name', themeName)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching component theme:', error);
    return null;
  }
};