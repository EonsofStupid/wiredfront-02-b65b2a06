import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores";
import { Card } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <Card className="w-full max-w-md p-6 glass-card">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold gradient-text mb-2">wiredFRONT</h1>
          <p className="text-gray-400">Sign in to continue</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#7E69AB',
                  brandAccent: '#5E498B',
                  inputBackground: 'rgba(255, 255, 255, 0.05)',
                  inputText: 'white',
                  inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '0.5rem',
                  buttonBorderRadius: '0.5rem',
                  inputBorderRadius: '0.5rem',
                },
              },
            },
            className: {
              container: 'glass-card',
              button: 'cyber-button',
              input: 'glass-input',
            },
          }}
          theme="dark"
          providers={[]}
        />
      </Card>
    </div>
  );
}