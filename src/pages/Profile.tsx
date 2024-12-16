import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { PageErrorBoundary } from "@/components/shared/PageErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ProfileSkeleton = () => (
  <Card className="glass-card p-6 space-y-4">
    <Skeleton className="h-8 w-48" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-10 w-24" />
    </div>
  </Card>
);

const ProfileContent = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Error",
          description: "Failed to check authentication status",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) return null;

  return (
    <Card className="glass-card p-6 space-y-4">
      <h1 className="text-2xl font-bold gradient-text">Profile</h1>
      <div className="space-y-2">
        <p className="text-gray-300">Email: {user.email}</p>
        <Button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/login");
          }}
          className="cyber-button"
        >
          Sign Out
        </Button>
      </div>
    </Card>
  );
};

export default function Profile() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "container mx-auto",
      isMobile ? "p-0" : "p-6"
    )}>
      <ErrorBoundary FallbackComponent={PageErrorBoundary}>
        <ProfileContent />
      </ErrorBoundary>
    </div>
  );
}