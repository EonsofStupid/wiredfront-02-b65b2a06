import { motion } from "framer-motion";
import { Sparkles, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-4xl"
      >
        <div className="neon-border p-4 md:p-8 glass-card mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold gradient-text mb-6">
              wiredFRONT
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-neon-blue animate-pulse" />
              <span className="text-lg md:text-2xl text-neon-pink">AI-Powered Workspace</span>
            </div>
            <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Transform your workflow with AI-driven file management, automation, and seamless integrations.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            onClick={handleLogin}
            className="neon-glow bg-dark-lighter hover:bg-dark-lighter/80 text-neon-blue border border-neon-blue/50 
                     text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto
                     transition-all duration-300 hover:scale-105"
          >
            <Zap className="w-5 h-5 mr-2" />
            Launch App
          </Button>
          <HoverCard>
            <HoverCardTrigger>
              <Button 
                variant="outline"
                className="neon-glow bg-dark hover:bg-dark-lighter text-neon-pink border border-neon-pink/50
                         text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto
                         transition-all duration-300 hover:scale-105"
              >
                <Bot className="w-5 h-5 mr-2" />
                Try AI Demo
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="glass-card">
              Experience the power of AI-driven workflow automation
            </HoverCardContent>
          </HoverCard>
        </div>
      </motion.div>
    </section>
  );
};