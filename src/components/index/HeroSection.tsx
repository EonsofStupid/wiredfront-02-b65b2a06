import { motion } from "framer-motion";
import { Sparkles, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-4xl"
      >
        <div className="neon-border glass-card cyber-card p-4 md:p-8 mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold gradient-text mb-6">
              wiredFRONT
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-[#00dcf5] animate-pulse" />
              <span className="text-lg md:text-2xl text-[#c202af]">AI-Powered Workspace</span>
            </div>
            <p className="text-lg md:text-2xl text-[#32ed83] max-w-2xl mx-auto">
              Transform your workflow with AI-driven file management, automation, and seamless integrations.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button 
              className="neon-glow bg-[#141326] hover:bg-[#1d242e] text-[#00dcf5] border border-[#00dcf5]/50 
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
                className="neon-glow bg-[#141326] hover:bg-[#1d242e] text-[#c202af] border border-[#c202af]/50
                         text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto
                         transition-all duration-300 hover:scale-105"
              >
                <Bot className="w-5 h-5 mr-2" />
                Try AI Demo
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="glass-card cyber-card">
              Experience the power of AI-driven workflow automation
            </HoverCardContent>
          </HoverCard>
        </div>
      </motion.div>
    </section>
  );
};