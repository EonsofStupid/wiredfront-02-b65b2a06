import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { PageErrorBoundary } from "@/components/shared/PageErrorBoundary";

const Profile = () => {
  const isMobile = useIsMobile();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="h-full w-full overflow-auto custom-scrollbar">
      <div className={cn(
        "container mx-auto",
        isMobile ? "p-0" : "p-6"
      )}>
        <ErrorBoundary FallbackComponent={PageErrorBoundary}>
          <Card className="glass-card p-6 space-y-4">
            <h1 className="text-2xl font-bold gradient-text">Profile</h1>
            {user && (
              <div className="space-y-2">
                <p className="text-gray-300">Email: {user.email}</p>
              </div>
            )}
          </Card>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Profile;