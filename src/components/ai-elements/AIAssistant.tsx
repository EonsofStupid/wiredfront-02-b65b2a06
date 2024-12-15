import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { generateAIResponse } from "@/utils/ai/aiProviders";
import { handleCommand, getSuggestions } from "@/utils/ai/commandHandler";
import { AIHeader } from "./AIHeader";
import { AIModeSelector } from "./AIModeSelector";
import { AIProviderSelector } from "./AIProviderSelector";
import { AIInputForm } from "./AIInputForm";
import { AIResponse } from "./AIResponse";
import { AICommandSuggestions } from "./AICommandSuggestions";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import type { AIMode, AIProvider } from "@/types/ai";
import type { Command } from "@/utils/ai/commandHandler";

export const AIAssistant = () => {
  const navigate = useNavigate();
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
  const [suggestions, setSuggestions] = useState<Command[]>([]);
  const constraintsRef = useRef(null);
  const { toast } = useToast();

  const handleTranscript = (transcript: string) => {
    setInput(transcript);
    handleSubmit(new Event('submit') as any, transcript);
  };

  const { isListening, toggleVoiceInput } = useSpeechRecognition(handleTranscript);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchAvailableProviders();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const newSuggestions = getSuggestions(input);
    setSuggestions(newSuggestions);
  }, [input]);

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

  const handleSubmit = async (e: React.FormEvent, voiceInput?: string) => {
    e.preventDefault();
    const currentInput = voiceInput || input;
    if (!currentInput.trim()) return;

    // First, check if it's a command
    const isCommand = handleCommand(currentInput, navigate);
    if (isCommand) {
      setInput("");
      return;
    }

    setIsProcessing(true);
    try {
      if (isOffline) {
        const offlineResponse = "I'm currently in offline mode. I'll use my local knowledge to assist you.";
        setResponse(offlineResponse);
        return;
      }

      const result = await generateAIResponse(provider, currentInput);
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
      setInput("");
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
            isListening={isListening}
            onVoiceToggle={toggleVoiceInput}
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
                suggestions={suggestions}
              />
              <AIResponse response={response} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};