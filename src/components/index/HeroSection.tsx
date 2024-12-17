import { motion } from "framer-motion";
import { Sparkles, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ThemedSection } from "@/components/themed/ThemedSection";

export const HeroSection = () => {
  return (
    <ThemedSection 
      themeName="hero"
      className="hero-container"
    >
      <div className="animated-bg" />
      <div className="hero-overlay" />
      <div className="floating-elements">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-element"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

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
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-neon-blue animate-pulse" />
              <span className="hero-subtitle">AI-Powered Workspace</span>
            </div>
            <p className="hero-description">
              Transform your workflow with AI-driven file management, automation, and seamless integrations.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button 
              className="neon-glow bg-dark-lighter hover:bg-dark-lighter/80 text-neon-blue border border-neon-blue/50 
                       text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto
                       transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Launch App
            </Button>
          </Link>
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
    </ThemedSection>
  );
};