import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6">
      <Card className="glass-card p-6 space-y-4">
        <h1 className="text-2xl font-bold gradient-text">Profile</h1>
        <div className="space-y-2">
          <p className="text-gray-300">Email: {user.email}</p>
          <button
            onClick={handleSignOut}
            className="cyber-button px-4 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </Card>
    </div>
  );
}