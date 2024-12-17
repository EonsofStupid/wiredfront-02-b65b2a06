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
        <div className="machinery-card depth-layer-2 p-4 md:p-8 mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 machinery-text-gradient">
              wiredFRONT
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-neon-blue animate-pulse" />
              <span className="text-xl md:text-2xl font-semibold text-neon-pink">
                AI-Powered Workspace
              </span>
            </div>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-neon-blue">
              Transform your workflow with AI-driven file management
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button 
              className="machinery-button machinery-primary text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto"
            >
              <Zap className="text-neon-blue mr-2" />
              Launch App
            </Button>
          </Link>
          <HoverCard>
            <HoverCardTrigger>
              <Button 
                variant="outline"
                className="machinery-button machinery-secondary text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto"
              >
                <Bot className="text-neon-pink mr-2" />
                Try AI Demo
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="machinery-card">
              Experience the power of AI-driven workflow automation
            </HoverCardContent>
          </HoverCard>
        </div>
      </motion.div>
    </section>
  );
};