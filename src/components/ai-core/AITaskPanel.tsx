import { motion } from "framer-motion";
import { X, Search, FileText, Settings, Terminal, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { handleCommand, getSuggestions } from "@/utils/ai/commandHandler";
import { supabase } from "@/integrations/supabase/client";

interface AITaskPanelProps {
  onClose: () => void;
  typingUsers?: string[];
  onTypingChange?: (isTyping: boolean) => void;
}

export const AITaskPanel = ({ onClose, typingUsers = [], onTypingChange }: AITaskPanelProps) => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (value: string) => {
    setInput(value);
    onTypingChange?.(value.length > 0);
    
    const newSuggestions = getSuggestions(value);
    setSuggestions(newSuggestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (handleCommand(input, navigate)) {
      setInput("");
      return;
    }

    setIsProcessing(true);
    try {
      const { error: dbError } = await supabase
        .from('ai_tasks')
        .insert({
          task_id: crypto.randomUUID(),
          type: 'chat',
          prompt: input,
          provider: 'assistant',
          status: 'pending'
        });

      if (dbError) throw dbError;

      toast({
        title: "Processing request",
        description: "Generating response...",
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Response ready",
        description: "Check the preview panel to see the changes",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setInput("");
      onTypingChange?.(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 pr-20"
            placeholder="What would you like me to help you with?"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <Button 
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Terminal className="w-4 h-4" />
              </motion.div>
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background/95 backdrop-blur-sm rounded-md border border-border">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  setInput(suggestion.trigger[0]);
                  handleCommand(suggestion.trigger[0], navigate);
                }}
              >
                {suggestion.description}
              </div>
            ))}
          </div>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <TaskCard
          icon={FileText}
          title="File Management"
          description="Organize, edit, and manage your files"
        />
        <TaskCard
          icon={Terminal}
          title="Code Generation"
          description="Generate and preview code changes"
        />
        <TaskCard
          icon={Settings}
          title="Preview Settings"
          description="Configure preview behavior"
        />
      </div>
    </div>
  );
};

interface TaskCardProps {
  icon: any;
  title: string;
  description: string;
}

const TaskCard = ({ icon: Icon, title, description }: TaskCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-card p-4 cursor-pointer"
    >
      <Icon className="h-6 w-6 mb-2 text-neon-blue" />
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </motion.div>
  );
};