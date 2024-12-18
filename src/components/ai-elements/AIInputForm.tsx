import { Bot, Code, FileText, Loader, WifiOff, Send } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import type { AIMode } from "@/types/ai";
import type { Command } from "@/utils/ai/commandHandler";
import { useTypingStatus } from "@/hooks/use-typing-status";
import { useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AIInputFormProps {
  input: string;
  mode: AIMode;
  isProcessing: boolean;
  isOffline: boolean;
  suggestions?: Command[];
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AIInputForm = ({
  input,
  mode,
  isProcessing,
  isOffline,
  suggestions = [],
  onInputChange,
  onSubmit,
}: AIInputFormProps) => {
  const user = useUser();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateTypingStatus } = useTypingStatus(
    'ai-chat',
    user?.id || ''
  );

  const getModeIcon = (currentMode: AIMode) => {
    switch (currentMode) {
      case "chat":
        return <Bot className="w-4 h-4" />;
      case "code":
        return <Code className="w-4 h-4" />;
      case "file":
        return <FileText className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const handleInputChange = (value: string) => {
    onInputChange(value);
    if (user?.id) {
      updateTypingStatus(value.length > 0);
    }
    
    // Adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isProcessing) {
        onSubmit(e);
      }
    }
  };

  // Reset textarea height when input is cleared
  useEffect(() => {
    if (!input && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [input]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          className={cn(
            "min-h-[60px] max-h-[200px] p-4 pr-12 resize-none bg-background/95 backdrop-blur-sm border border-border rounded-lg",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            "scrollbar-thin scrollbar-thumb-border scrollbar-track-background"
          )}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isOffline
              ? "Working in offline mode. Limited functionality available..."
              : mode === "chat"
              ? "Type a message (Enter to send, Shift + Enter for new line)..."
              : mode === "code"
              ? "Describe the code changes you need..."
              : "Describe what you want to do with your files..."
          }
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 bottom-2"
          disabled={isProcessing || (isOffline && mode !== "chat") || !input.trim()}
        >
          {isProcessing ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {suggestions.length > 0 && input && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-background/95 backdrop-blur-sm rounded-md border border-border p-2 space-y-1 z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="text-sm text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded hover:bg-accent"
              onClick={() => {
                handleInputChange(suggestion.trigger[0]);
              }}
            >
              {suggestion.description}
            </div>
          ))}
        </div>
      )}
    </form>
  );
};