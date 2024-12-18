import React, { useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMessageQueue } from '@/stores/messageQueue';
import { useAIStore } from '@/stores/ai';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AIResponse } from './AIResponse';
import { AIInputForm } from './AIInputForm';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Loader2, WifiOff } from 'lucide-react';
import type { AIMode } from '@/types/ai';

export const AIAssistant = () => {
  const { initializeWorker, messages, error } = useMessageQueue();
  const { toast } = useToast();
  const isVisible = useAIStore((state) => state.isVisible);
  const parentRef = useRef<HTMLDivElement>(null);
  const isOnline = useOnlineStatus();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AIMode>('chat');
  const [isProcessing, setIsProcessing] = useState(false);
  const pendingMessages = useRef<any[]>([]);

  // Initialize message worker
  useEffect(() => {
    initializeWorker();
  }, [initializeWorker]);

  // Handle real-time presence and typing status
  useEffect(() => {
    const setupPresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase.channel('ai-assistant')
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          console.log('Presence state:', state);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('Join:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('Leave:', key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
            });
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupPresence();
  }, []);

  // Virtual list implementation with reverse scroll
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  // Error handling with retry mechanism
  useEffect(() => {
    if (error) {
      const retryDelay = Math.min(1000 * Math.pow(2, pendingMessages.current.length), 30000);
      
      toast({
        title: "Connection Error",
        description: `Retrying in ${retryDelay / 1000} seconds...`,
        variant: "destructive",
      });

      const timer = setTimeout(() => {
        pendingMessages.current.forEach(msg => {
          // Attempt to resend messages
          handleSubmit(msg);
        });
      }, retryDelay);

      return () => clearTimeout(timer);
    }
  }, [error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      if (!isOnline) {
        pendingMessages.current.push(input);
        toast({
          title: "Offline Mode",
          description: "Message will be sent when connection is restored",
        });
        return;
      }

      const { error: dbError } = await supabase
        .from('ai_tasks')
        .insert({
          task_id: crypto.randomUUID(),
          type: mode,
          prompt: input,
          provider: 'assistant',
          status: 'pending'
        });

      if (dbError) throw dbError;

      setInput('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-background/95 backdrop-blur-lg rounded-lg border border-border shadow-lg flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        {!isOnline && (
          <div className="flex items-center gap-2 text-yellow-500">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">Offline Mode</span>
          </div>
        )}
      </div>

      {/* Virtualized Message List */}
      <div 
        ref={parentRef}
        className="flex-1 overflow-auto flex flex-col-reverse"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="p-4"
            >
              <AIResponse response={messages[virtualRow.index].content} />
            </div>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-border">
        <AIInputForm 
          input={input}
          mode={mode}
          isProcessing={isProcessing}
          isOffline={!isOnline}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};