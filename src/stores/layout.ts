import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
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
  toggleSidebar: () => Promise<void>;
  toggleRightSidebar: () => Promise<void>;
  toggleTopBar: () => Promise<void>;
  toggleBottomBar: () => Promise<void>;
  setSidebarWidth: (width: number) => Promise<void>;
  setRightSidebarWidth: (width: number) => Promise<void>;
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

// Utility function to handle Supabase updates
const updatePreference = async (field: string, value: any) => {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("User authentication failed");

  const { error } = await supabase
    .from("layout_preferences")
    .update({ [field]: value })
    .eq("user_id", user.id);

  if (error) throw error;
};

export const useLayoutStore = create<LayoutState>((set, get) => ({
  // Default State
  sidebarOpen: DEFAULT_PREFERENCES.sidebar_open,
  rightSidebarOpen: DEFAULT_PREFERENCES.right_sidebar_open,
  topBarVisible: DEFAULT_PREFERENCES.top_bar_visible,
  bottomBarVisible: DEFAULT_PREFERENCES.bottom_bar_visible,
  sidebarWidth: DEFAULT_PREFERENCES.sidebar_width,
  rightSidebarWidth: DEFAULT_PREFERENCES.right_sidebar_width,
  isLoading: true,
  error: null,

  // Toggle Sidebar
  toggleSidebar: async () => {
    const newValue = !get().sidebarOpen;
    set({ sidebarOpen: newValue });
    try {
      await updatePreference("sidebar_open", newValue);
    } catch (error) {
      console.error("Error updating sidebar state:", error);
      set({ error: "Failed to update sidebar preference" });
    }
  },

  // Toggle Right Sidebar
  toggleRightSidebar: async () => {
    const newValue = !get().rightSidebarOpen;
    set({ rightSidebarOpen: newValue });
    try {
      await updatePreference("right_sidebar_open", newValue);
    } catch (error) {
      console.error("Error updating right sidebar state:", error);
      set({ error: "Failed to update right sidebar preference" });
    }
  },

  // Toggle Top Bar
  toggleTopBar: async () => {
    const newValue = !get().topBarVisible;
    set({ topBarVisible: newValue });
    try {
      await updatePreference("top_bar_visible", newValue);
    } catch (error) {
      console.error("Error updating top bar visibility:", error);
      set({ error: "Failed to update top bar preference" });
    }
  },

  // Toggle Bottom Bar
  toggleBottomBar: async () => {
    const newValue = !get().bottomBarVisible;
    set({ bottomBarVisible: newValue });
    try {
      await updatePreference("bottom_bar_visible", newValue);
    } catch (error) {
      console.error("Error updating bottom bar visibility:", error);
      set({ error: "Failed to update bottom bar preference" });
    }
  },

  // Set Sidebar Width
  setSidebarWidth: async (width: number) => {
    set({ sidebarWidth: width });
    try {
      await updatePreference("sidebar_width", width);
    } catch (error) {
      console.error("Error updating sidebar width:", error);
      set({ error: "Failed to update sidebar width" });
    }
  },

  // Set Right Sidebar Width
  setRightSidebarWidth: async (width: number) => {
    set({ rightSidebarWidth: width });
    try {
      await updatePreference("right_sidebar_width", width);
    } catch (error) {
      console.error("Error updating right sidebar width:", error);
      set({ error: "Failed to update right sidebar width" });
    }
  },

  // Initialize Layout Preferences
  initializeLayoutPreferences: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("User authentication failed");

      const { data: existingPrefs, error } = await supabase
        .from("layout_preferences")
        .select("*")
        .eq("user_id", user.id);

      if (!existingPrefs?.length) {
        const { data: newPrefs, error: insertError } = await supabase
          .from("layout_preferences")
          .insert([{ user_id: user.id, ...DEFAULT_PREFERENCES }])
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
      console.error("Error initializing layout preferences:", error);
      set({ error: "Failed to load layout preferences" });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load layout preferences. Using defaults.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
