import { Bot, Code, FileText, Loader, WifiOff, Mic } from "lucide-react";
import { useEffect, useState } from "react";
import type { AIMode } from "@/types/ai";
import type { Command } from "@/utils/ai/commandHandler";
import { useTypingStatus } from "@/hooks/use-typing-status";
import { useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          className="min-h-[100px] p-4 resize-none bg-background/95 backdrop-blur-sm border border-border rounded-lg"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={
            isOffline
              ? "Working in offline mode. Limited functionality available..."
              : mode === "chat"
              ? "Ask me anything or try commands like 'go to settings'..."
              : mode === "code"
              ? "Describe the code changes you need..."
              : "Describe what you want to do with your files..."
          }
        />
        {suggestions.length > 0 && input && (
          <div className="absolute bottom-full left-0 w-full mb-2 bg-background/95 backdrop-blur-sm rounded-md border border-border p-2 space-y-1">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded hover:bg-accent">
                {suggestion.trigger[0]}: {suggestion.description}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="flex-1 bg-primary hover:bg-primary/90"
          disabled={isProcessing || (isOffline && mode !== "chat")}
        >
          {isProcessing ? (
            <Loader className="w-4 h-4 animate-spin mr-2 inline" />
          ) : isOffline ? (
            <>
              <WifiOff className="w-4 h-4 mr-2" />
              <span>Offline Mode</span>
            </>
          ) : (
            <>
              {getModeIcon(mode)}
              <span className="ml-2">
                {mode === "chat"
                  ? "Ask AI"
                  : mode === "code"
                  ? "Generate Code"
                  : "Process Files"}
              </span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};