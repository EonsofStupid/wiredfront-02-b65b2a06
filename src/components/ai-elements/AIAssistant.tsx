import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateAIResponse } from "@/utils/ai/aiProviders";
import { AIHeader } from "./AIHeader";
import { AIModeSelector } from "./AIModeSelector";
import { AIProviderSelector } from "./AIProviderSelector";
import { AIInputForm } from "./AIInputForm";
import { AIResponse } from "./AIResponse";
import type { AIMode, AIProvider } from "@/types/ai";

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState<AIMode>("chat");
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [availableProviders, setAvailableProviders] = useState<AIProvider[]>([]);
  const constraintsRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Fetch available providers on mount
    fetchAvailableProviders();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchAvailableProviders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('ai_settings')
        .select('provider')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .not('api_key', 'is', null);

      if (error) throw error;

      const providers = data.map(item => item.provider);
      setAvailableProviders(providers);

      // Set default provider if current one is not available
      if (providers.length > 0 && !providers.includes(provider)) {
        setProvider(providers[0]);
      }
    } catch (error) {
      console.error('Error fetching available providers:', error);
    }
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = (_e: any, info: any) => {
    setIsDragging(false);
    setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      if (isOffline) {
        // Use local model or cached responses when offline
        const offlineResponse = "I'm currently in offline mode. I'll use my local knowledge to assist you.";
        setResponse(offlineResponse);
        return;
      }

      const result = await generateAIResponse(provider, input);
      setResponse(result);
      toast({
        title: "AI Response Generated",
        description: "Response generated successfully",
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process your request. " + (isOffline ? "Working in offline mode." : ""),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={{
            x: position.x,
            y: position.y,
            scale: isDragging ? 1.02 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className={`fixed bottom-8 right-8 w-[450px] pointer-events-auto
            glass-card neon-border shadow-xl overflow-hidden rounded-lg
            transition-all duration-300 ${isMinimized ? 'h-auto' : 'h-[600px]'}
            ${isDragging ? 'ai-assistant--dragging' : ''}
            ${isOffline ? 'opacity-90' : ''}`}
        >
          <div className="ai-assistant__handle" />
          <AIHeader
            isMinimized={isMinimized}
            onMinimize={() => setIsMinimized(!isMinimized)}
            onClose={() => setIsOpen(false)}
            isOffline={isOffline}
          />

          {!isMinimized && (
            <div className="custom-scrollbar p-4 space-y-4 h-[calc(100%-3rem)] overflow-y-auto">
              <AIModeSelector mode={mode} onModeChange={setMode} />
              <AIProviderSelector
                provider={provider}
                onProviderChange={setProvider}
                availableProviders={availableProviders}
              />
              <AIInputForm
                input={input}
                mode={mode}
                isProcessing={isProcessing}
                onInputChange={setInput}
                onSubmit={handleSubmit}
                isOffline={isOffline}
              />
              <AIResponse response={response} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};