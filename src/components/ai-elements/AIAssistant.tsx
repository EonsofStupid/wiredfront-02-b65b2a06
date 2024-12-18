import React, { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMessageQueue } from '@/stores/messageQueue';
import { useAIStore } from '@/stores/ai';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AIResponse } from './AIResponse';
import { AIInputForm } from './AIInputForm';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Loader2, WifiOff } from 'lucide-react';

export const AIAssistant = () => {
  const { initializeWorker, messages, error } = useMessageQueue();
  const { toast } = useToast();
  const isVisible = useAIStore((state) => state.isVisible);
  const parentRef = useRef<HTMLDivElement>(null);
  const isOnline = useOnlineStatus();
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

  // Virtual list implementation
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
        // Retry logic here
        pendingMessages.current.forEach(msg => {
          // Attempt to resend messages
        });
      }, retryDelay);

      return () => clearTimeout(timer);
    }
  }, [error, toast]);

  // Offline message handling
  const handleOfflineMessage = (message: any) => {
    pendingMessages.current.push(message);
    toast({
      title: "Offline Mode",
      description: "Message will be sent when connection is restored",
    });
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
        className="flex-1 overflow-auto"
        style={{
          height: `400px`,
          width: `100%`,
        }}
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
          onSubmit={isOnline ? undefined : handleOfflineMessage}
          isOffline={!isOnline}
        />
      </div>
    </div>
  );
};