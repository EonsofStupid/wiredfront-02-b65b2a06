import { motion } from "framer-motion";
import { Sparkles, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ThemedSection } from "@/components/themed/ThemedSection";
import { GalaxyBackground } from "@/components/background/GalaxyBackground";
import { AnimatedCubes } from "@/components/background/AnimatedCubes";
import { DataStream } from "@/components/ai-elements/DataStream";
import { useAIStore } from "@/stores";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  const toggleAI = useAIStore((state) => state.toggleAIAssistant);

  const handleLaunch = () => {
    navigate("/");
    // Slight delay to ensure navigation completes before toggling AI
    setTimeout(() => {
      toggleAI();
    }, 100);
  };

  return (
    <ThemedSection 
      themeName="hero"
      className="hero-container"
    >
      <GalaxyBackground />
      <AnimatedCubes />
      <DataStream />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-content"
      >
        <div className="hero-card">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="hero-title">
              wiredFRONT
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-neon-blue animate-pulse" />
              <span className="hero-subtitle">AI-Powered Workspace</span>
            </div>
            <p className="hero-description">
              Transform your workflow with AI-driven file management, automation, and seamless integrations.
            </p>
          </motion.div>
        </div>

        <div className="hero-actions">
          <Button 
            onClick={handleLaunch}
            className="hero-button hero-button-primary"
          >
            <Zap className="w-5 h-5 mr-2" />
            Launch App
          </Button>
          <HoverCard>
            <HoverCardTrigger>
              <Button 
                variant="outline"
                className="hero-button hero-button-secondary"
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
    </ThemedSection>
  );
};