import React, { useEffect, useState, StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { MobileAwareLayout } from "@/components/layout/MobileAppLayout";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Index from "@/pages/Index";
import { FileManager } from "@/components/file/FileManager";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useLayoutStore } from "@/stores";
import { LivePreview } from "@/components/preview/LivePreview";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AIAssistant } from "@/components/ai-elements/AIAssistant";
import { useAIStore } from "@/stores/ai";

// Initialize store outside of component to avoid recreation
const initializeStore = () => {
  useLayoutStore.getState().initializeLayoutPreferences();
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const toggleAIAssistant = useAIStore((state) => state.toggleAIAssistant);
  const isAIVisible = useAIStore((state) => state.isVisible);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        initializeStore();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        initializeStore();
      }
    });

    // Ensure AI Assistant is visible by default
    if (!isAIVisible) {
      toggleAIAssistant();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [toggleAIAssistant, isAIVisible]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1F2C]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <StrictMode>
      <ThemeProvider>
        <SettingsProvider>
          <Router>
            <Routes>
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <SidebarProvider>
                      <MobileAwareLayout />
                    </SidebarProvider>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              >
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="files" element={<FileManager />} />
              </Route>
            </Routes>
            <LivePreview />
            <AIAssistant />
            <Toaster />
          </Router>
        </SettingsProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

export default App;