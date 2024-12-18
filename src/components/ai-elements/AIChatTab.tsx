import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIInputForm } from './AIInputForm';
import { AIResponse } from './AIResponse';
import { useAIStore } from '@/stores/ai';
import type { Message } from '@/types/ai';

interface AIChatTabProps {
  messages: Message[];
  input: string;
  isProcessing: boolean;
  isOnline: boolean;
  typingUsers: string[];
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AIChatTab = ({
  messages,
  input,
  isProcessing,
  isOnline,
  typingUsers,
  onInputChange,
  onSubmit
}: AIChatTabProps) => {
  const mode = useAIStore((state) => state.mode);

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <AIResponse key={index} message={message} />
          ))}
          {typingUsers.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {typingUsers.length === 1
                ? "AI is typing..."
                : `${typingUsers.length} AIs are typing...`}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <AIInputForm
          input={input}
          mode={mode}
          isProcessing={isProcessing}
          isOffline={!isOnline}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};