import { motion } from "framer-motion";
import { Sparkles, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ThemedSection } from "@/components/themed/ThemedSection";
import { GalaxyBackground } from "@/components/background/GalaxyBackground";
import { AnimatedCubes } from "@/components/background/AnimatedCubes";
import { DataStream } from "@/components/ai-elements/DataStream";

export const HeroSection = () => {
  return (
    <ThemedSection 
      themeName="hero"
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
    >
      <GalaxyBackground />
      <AnimatedCubes />
      <DataStream />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <div className="glass-card neon-border p-8 rounded-xl">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-neon-blue via-neon-pink to-neon-violet bg-clip-text text-transparent animate-gradient-x">
              wiredFRONT
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-neon-blue animate-pulse" />
              <span className="text-lg md:text-2xl text-neon-pink">AI-Powered Workspace</span>
            </div>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Transform your workflow with AI-driven file management, automation, and seamless integrations.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button 
                  className="w-full md:w-auto px-6 py-3 bg-dark-lighter hover:bg-dark-lighter/80 text-neon-blue border border-neon-blue/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Launch App
                </Button>
              </Link>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button 
                    variant="outline"
                    className="w-full md:w-auto px-6 py-3 bg-dark hover:bg-dark/80 text-neon-pink border border-neon-pink/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
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
        </div>
      </motion.div>
    </ThemedSection>
  );
};