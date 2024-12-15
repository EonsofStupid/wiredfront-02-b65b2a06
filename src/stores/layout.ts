import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
      const { error } = await supabase
        .from('layout_preferences')
        .update({ sidebar_open: newValue })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
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
      const { error } = await supabase
        .from('layout_preferences')
        .update({ right_sidebar_open: newValue })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
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
      const { error } = await supabase
        .from('layout_preferences')
        .update({ top_bar_visible: newValue })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
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
      const { error } = await supabase
        .from('layout_preferences')
        .update({ bottom_bar_visible: newValue })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating bottom bar visibility:', error);
      set({ error: 'Failed to update bottom bar preference' });
    }
  },

  setSidebarWidth: async (width: number) => {
    set({ sidebarWidth: width });
    try {
      const { error } = await supabase
        .from('layout_preferences')
        .update({ sidebar_width: width })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating sidebar width:', error);
      set({ error: 'Failed to update sidebar width' });
    }
  },

  setRightSidebarWidth: async (width: number) => {
    set({ rightSidebarWidth: width });
    try {
      const { error } = await supabase
        .from('layout_preferences')
        .update({ right_sidebar_width: width })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating right sidebar width:', error);
      set({ error: 'Failed to update right sidebar width' });
    }
  },

  initializeLayoutPreferences: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No user found');

      // First, try to get existing preferences
      const { data: existingPrefs, error: fetchError } = await supabase
        .from('layout_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw fetchError;
      }

      if (!existingPrefs) {
        // Create default preferences if none exist
        const { data: newPrefs, error: insertError } = await supabase
          .from('layout_preferences')
          .insert([
            {
              user_id: user.id,
              sidebar_open: true,
              right_sidebar_open: false,
              top_bar_visible: true,
              bottom_bar_visible: true,
              sidebar_width: 20,
              right_sidebar_width: 20
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;
        
        set({
          sidebarOpen: newPrefs.sidebar_open,
          rightSidebarOpen: newPrefs.right_sidebar_open,
          topBarVisible: newPrefs.top_bar_visible,
          bottomBarVisible: newPrefs.bottom_bar_visible,
          sidebarWidth: newPrefs.sidebar_width,
          rightSidebarWidth: newPrefs.right_sidebar_width,
        });
      } else {
        // Use existing preferences
        set({
          sidebarOpen: existingPrefs.sidebar_open,
          rightSidebarOpen: existingPrefs.right_sidebar_open,
          topBarVisible: existingPrefs.top_bar_visible,
          bottomBarVisible: existingPrefs.bottom_bar_visible,
          sidebarWidth: existingPrefs.sidebar_width,
          rightSidebarWidth: existingPrefs.right_sidebar_width,
        });
      }
    } catch (error) {
      console.error('Error initializing layout preferences:', error);
      set({ error: 'Failed to load layout preferences' });
    } finally {
      set({ isLoading: false });
    }
  },
}));