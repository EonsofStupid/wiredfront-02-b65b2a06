import { useState, useRef } from "react";
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
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState<AIMode>("chat");
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const constraintsRef = useRef(null);
  const { toast } = useToast();

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_e: any, info: any) => {
    setIsDragging(false);
    setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
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
        description: "Failed to process your request",
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
            ${isDragging ? 'ai-assistant--dragging' : ''}`}
        >
          <div className="ai-assistant__handle" />
          <AIHeader
            isMinimized={isMinimized}
            onMinimize={() => setIsMinimized(!isMinimized)}
            onClose={() => setIsOpen(false)}
          />

          {!isMinimized && (
            <div className="custom-scrollbar p-4 space-y-4 h-[calc(100%-3rem)] overflow-y-auto">
              <AIModeSelector mode={mode} onModeChange={setMode} />
              <AIProviderSelector
                provider={provider}
                onProviderChange={setProvider}
              />
              <AIInputForm
                input={input}
                mode={mode}
                isProcessing={isProcessing}
                onInputChange={setInput}
                onSubmit={handleSubmit}
              />
              <AIResponse response={response} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};