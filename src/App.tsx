import React from "react";
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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLayoutStore, useRoutesStore } from "@/stores";
import { useToast } from "@/components/ui/use-toast";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const initializeLayoutPreferences = useLayoutStore(state => state.initializeLayoutPreferences);
  const { toast } = useToast();
  const routes = useRoutesStore(state => state.routes);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        initializeLayoutPreferences().catch(error => {
          console.error('Failed to initialize layout preferences:', error);
          toast({
            title: "Error",
            description: "Failed to load your preferences. Using defaults.",
            variant: "destructive",
          });
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        initializeLayoutPreferences().catch(error => {
          console.error('Failed to initialize layout preferences:', error);
          toast({
            title: "Error",
            description: "Failed to load your preferences. Using defaults.",
            variant: "destructive",
          });
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeLayoutPreferences, toast]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-darker">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neon-blue"></div>
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
          {/* Dynamic routes from state */}
          {routes
            .filter(route => route.isEnabled)
            .map(route => (
              <Route
                key={route.id}
                path={route.path}
                element={<route.component />}
              />
            ))}
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;