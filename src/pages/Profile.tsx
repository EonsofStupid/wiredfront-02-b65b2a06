import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setIsLoading(false);
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={cn(
      "container mx-auto",
      isMobile ? "p-0" : "p-6"
    )}>
      <Card className="glass-card p-6 space-y-4">
        <h1 className="text-2xl font-bold gradient-text">Profile</h1>
        <div className="space-y-2">
          <p className="text-gray-300">Email: {user.email}</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
            className="cyber-button px-4 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </Card>
    </div>
  );
}