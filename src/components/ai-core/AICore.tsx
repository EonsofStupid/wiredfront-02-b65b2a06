import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CyberNebula } from "./CyberNebula";
import { AITaskPanel } from "./AITaskPanel";
import { AIPersonalityConfig } from "./AIPersonalityConfig";
import { useAIStore } from "@/stores/ai";
import { AIPermissions } from "./AIPermissions";
import { supabase } from "@/integrations/supabase/client";

export const AICore = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visualEffects, setVisualEffects] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('http://localhost:8081');

  useEffect(() => {
    fetchVisualEffects();
  }, []);

  const fetchVisualEffects = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('ai_settings')
        .select('visual_effects')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      if (data?.visual_effects) {
        setVisualEffects(data.visual_effects);
      }
    } catch (error) {
      console.error('Error fetching visual effects:', error);
    }
  };

  const getEffectStyles = () => {
    if (!visualEffects) return {};

    const styles: any = {
      transition: 'all 0.3s ease',
    };

    if (visualEffects.effects?.neon?.enabled) {
      styles.textShadow = `0 0 ${visualEffects.effects.neon.intensity * 10}px ${visualEffects.effects.neon.color}`;
    }

    if (visualEffects.effects?.twilight?.enabled) {
      styles.background = `linear-gradient(45deg, ${visualEffects.theme.primaryColor}, ${visualEffects.theme.secondaryColor})`;
      styles.WebkitBackgroundClip = 'text';
      styles.WebkitTextFillColor = 'transparent';
      styles.filter = `brightness(${1 + visualEffects.effects.twilight.intensity})`;
    }

    return styles;
  };

  const handleNebulaClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <AnimatePresence>
        {!isExpanded && (
          <CyberNebula onExpand={handleNebulaClick} />
        )}

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-dark/80 backdrop-blur-sm"
          >
            <div className="container mx-auto h-full p-6 flex flex-col md:flex-row gap-4" style={getEffectStyles()}>
              <div className="w-full md:w-1/2 flex flex-col">
                <AITaskPanel onClose={() => setIsExpanded(false)} />
                <AIPersonalityConfig />
                <AIPermissions />
              </div>
              
              <div className="w-full md:w-1/2 bg-dark rounded-lg overflow-hidden shadow-xl">
                <div className="w-full h-8 bg-gray-800 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <input 
                    type="text" 
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    className="ml-4 bg-transparent text-sm text-gray-300 focus:outline-none"
                  />
                </div>
                <iframe
                  src={previewUrl}
                  className="w-full h-[calc(100%-2rem)] border-0"
                  title="Live Preview"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};