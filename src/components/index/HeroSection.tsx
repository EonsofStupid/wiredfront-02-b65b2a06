import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1,
    }
  },
};

export const HeroSection = () => {
  const { toast } = useToast();

  const handleLaunchClick = () => {
    toast({
      title: "Launching Workspace",
      description: "Preparing your personalized environment...",
      className: "bg-dark-lighter border-neon-blue",
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-dark-darker via-dark to-dark-lighter opacity-50"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-10 max-w-4xl"
      >
        <motion.div
          className="neon-border p-6 md:p-8 glass-card mb-8 relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5,
            delay: 0.3,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
        >
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ 
              duration: 5,
              ease: "linear",
              repeat: Infinity,
            }}
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
              backgroundSize: "200% 100%",
            }}
          />

          <motion.h1 
            className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6"
            style={{
              background: "linear-gradient(to right, #00FFFF, #FF007F, #9D00FF)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              backgroundSize: "200% auto",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            wiredFRONT
          </motion.h1>

          <motion.div 
            className="flex items-center justify-center gap-2 mb-4"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <Sparkles className="w-6 h-6 text-neon-blue animate-pulse" />
            <span className="text-lg md:text-2xl text-neon-pink">AI-Powered Workspace</span>
          </motion.div>

          <motion.p 
            className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Transform your workflow with AI-driven file management, automation, and seamless integrations.
          </motion.p>
        </motion.div>

        <motion.div 
          className="flex flex-col md:flex-row gap-4 justify-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <Link to="/workspace" onClick={handleLaunchClick}>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                className="neon-glow bg-dark-lighter hover:bg-dark-lighter/80 text-neon-blue border border-neon-blue/50 
                         text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto
                         transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Launch App
              </Button>
            </motion.div>
          </Link>

          <HoverCard>
            <HoverCardTrigger>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="outline"
                  className="neon-glow bg-dark hover:bg-dark-lighter text-neon-pink border border-neon-pink/50
                           text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full md:w-auto
                           transition-all duration-300"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  Try AI Demo
                </Button>
              </motion.div>
            </HoverCardTrigger>
            <HoverCardContent className="glass-card border border-neon-blue/20">
              <p className="text-sm text-gray-300">
                Experience the power of AI-driven workflow automation
              </p>
            </HoverCardContent>
          </HoverCard>
        </motion.div>
      </motion.div>
    </section>
  );
};