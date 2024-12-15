import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Index from "@/pages/Index";
import { FileManager } from "@/components/file/FileManager";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLayoutStore } from "@/stores";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const initializeLayoutPreferences = useLayoutStore(state => state.initializeLayoutPreferences);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        initializeLayoutPreferences();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        initializeLayoutPreferences();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeLayoutPreferences]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1F2C]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
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
                <AppLayout />
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
      <Toaster />
    </Router>
  );
}

export default App;