import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

interface LayoutState {
  sidebarOpen: boolean;
  rightSidebarOpen: boolean;
  topBarVisible: boolean;
  bottomBarVisible: boolean;
  sidebarWidth: number;
  rightSidebarWidth: number;
  isLoading: boolean;
  error: string | null;
  toggleSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleTopBar: () => void;
  toggleBottomBar: () => void;
  setSidebarWidth: (width: number) => void;
  setRightSidebarWidth: (width: number) => void;
  initializeLayoutPreferences: () => Promise<void>;
}

const DEFAULT_PREFERENCES = {
  sidebar_open: true,
  right_sidebar_open: false,
  top_bar_visible: true,
  bottom_bar_visible: true,
  sidebar_width: 20,
  right_sidebar_width: 20,
};

export const useLayoutStore = create<LayoutState>((set, get) => ({
  sidebarOpen: true,
  rightSidebarOpen: false,
  topBarVisible: true,
  bottomBarVisible: true,
  sidebarWidth: 20,
  rightSidebarWidth: 20,
  isLoading: true,
  error: null,

  toggleSidebar: async () => {
    const newValue = !get().sidebarOpen;
    set({ sidebarOpen: newValue });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('layout_preferences')
        .update({ sidebar_open: newValue })
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating sidebar state:', error);
      set({ error: 'Failed to update sidebar preference' });
    }
  },

  toggleRightSidebar: async () => {
    const newValue = !get().rightSidebarOpen;
    set({ rightSidebarOpen: newValue });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('layout_preferences')
        .update({ right_sidebar_open: newValue })
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating right sidebar state:', error);
      set({ error: 'Failed to update right sidebar preference' });
    }
  },

  toggleTopBar: async () => {
    const newValue = !get().topBarVisible;
    set({ topBarVisible: newValue });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('layout_preferences')
        .update({ top_bar_visible: newValue })
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating top bar visibility:', error);
      set({ error: 'Failed to update top bar preference' });
    }
  },

  toggleBottomBar: async () => {
    const newValue = !get().bottomBarVisible;
    set({ bottomBarVisible: newValue });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('layout_preferences')
        .update({ bottom_bar_visible: newValue })
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating bottom bar visibility:', error);
      set({ error: 'Failed to update bottom bar preference' });
    }
  },

  setSidebarWidth: async (width: number) => {
    set({ sidebarWidth: width });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('layout_preferences')
        .update({ sidebar_width: width })
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating sidebar width:', error);
      set({ error: 'Failed to update sidebar width' });
    }
  },

  setRightSidebarWidth: async (width: number) => {
    set({ rightSidebarWidth: width });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('layout_preferences')
        .update({ right_sidebar_width: width })
        .eq('user_id', user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating right sidebar width:', error);
      set({ error: 'Failed to update right sidebar width' });
    }
  },

  initializeLayoutPreferences: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // First, try to get existing preferences
      const { data: existingPrefs, error } = await supabase
        .from('layout_preferences')
        .select('*')
        .eq('user_id', user.id);

      // If no preferences exist or there's a PGRST116 error (no rows), create default preferences
      if (!existingPrefs?.length || (error && error.code === 'PGRST116')) {
        const { data: newPrefs, error: insertError } = await supabase
          .from('layout_preferences')
          .insert([{ user_id: user.id, ...DEFAULT_PREFERENCES }])
          .select()
          .single();

        if (insertError) throw insertError;
        
        if (newPrefs) {
          set({
            sidebarOpen: newPrefs.sidebar_open,
            rightSidebarOpen: newPrefs.right_sidebar_open,
            topBarVisible: newPrefs.top_bar_visible,
            bottomBarVisible: newPrefs.bottom_bar_visible,
            sidebarWidth: newPrefs.sidebar_width,
            rightSidebarWidth: newPrefs.right_sidebar_width,
          });
        }
      } else if (existingPrefs[0]) {
        // Use existing preferences
        const prefs = existingPrefs[0];
        set({
          sidebarOpen: prefs.sidebar_open,
          rightSidebarOpen: prefs.right_sidebar_open,
          topBarVisible: prefs.top_bar_visible,
          bottomBarVisible: prefs.bottom_bar_visible,
          sidebarWidth: prefs.sidebar_width,
          rightSidebarWidth: prefs.right_sidebar_width,
        });
      }
    } catch (error: any) {
      console.error('Error initializing layout preferences:', error);
      set({ error: 'Failed to load layout preferences' });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load layout preferences. Using defaults."
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));