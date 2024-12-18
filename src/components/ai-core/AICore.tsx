import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, memo } from "react";
import { CyberNebula } from "./CyberNebula";
import { AITaskPanel } from "./AITaskPanel";
import { AIPersonalityConfig } from "./AIPersonalityConfig";
import { useAIStore } from "@/stores/ai";
import { AIPermissions } from "./AIPermissions";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MemoizedPreview = memo(({ url }: { url: string }) => (
  <iframe
    src={url}
    className="w-full h-[calc(100%-2rem)] border-0"
    title="Live Preview"
  />
));

export const AICore = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visualEffects, setVisualEffects] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement threshold before drag starts
      },
    })
  );

  const fetchVisualEffects = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('ai_settings')
        .select('visual_effects')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      if (data?.visual_effects) {
        setVisualEffects(data.visual_effects);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching visual effects",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchVisualEffects();
  }, [fetchVisualEffects]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      // Handle position updates if needed
    }
  };

  const getEffectStyles = useCallback(() => {
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
  }, [visualEffects]);

  const handlePreviewClick = () => {
    window.open('/preview', '_blank');
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <AnimatePresence mode="wait">
        {!isExpanded && (
          <CyberNebula onExpand={() => setIsExpanded(true)} />
        )}

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 bg-dark/80 backdrop-blur-sm"
          >
            <div className="container mx-auto h-full p-6 flex flex-col md:flex-row gap-4" style={getEffectStyles()}>
              <div className="w-full flex flex-col">
                <AITaskPanel onClose={() => setIsExpanded(false)} />
                <AIPersonalityConfig />
                <AIPermissions />
                <Button 
                  onClick={handlePreviewClick}
                  className="mt-4 bg-purple-500 hover:bg-purple-600"
                >
                  Open Preview Panel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DndContext>
  );
};
