import React, { useEffect, useState } from 'react';
import { useMessageQueue } from '@/stores/messageQueue';
import { useAIStore } from '@/stores/ai';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { AICore } from '@/components/ai-core/AICore';
import { AIChat } from './chat/AIChat';
import { AIAudioControls } from './audio/AIAudioControls';
import { AIOptions } from './options/AIOptions';
import type { Message } from '@/types/ai';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { TypingStatus } from '@/types/realtime';

export const AIAssistant = () => {
  const { initializeWorker, messages: queuedMessages, error } = useMessageQueue();
  const { toast } = useToast();
  const isVisible = useAIStore((state) => state.isVisible);
  const isOnline = useOnlineStatus();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    initializeWorker();

    const setupRealtimeChannels = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Set up realtime presence channel
        const presenceChannel = supabase.channel('ai-assistant-presence');
        
        // Set up typing status channel
        const typingChannel = supabase.channel('typing-status')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'typing_status',
              filter: `chat_id=eq.${session.user.id}`
            },
            (payload: RealtimePostgresChangesPayload<TypingStatus>) => {
              if (payload.new && 'user_id' in payload.new) {
                const { user_id, is_typing } = payload.new;
                setTypingUsers(current => {
                  if (is_typing && !current.includes(user_id)) {
                    return [...current, user_id];
                  } else if (!is_typing) {
                    return current.filter(id => id !== user_id);
                  }
                  return current;
                });
              }
            }
          )
          .subscribe();

        // Set up Discord logs channel
        const logsChannel = supabase.channel('discord-logs')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'discord_bot_logs'
            },
            (payload) => {
              console.log('New Discord log:', payload);
              toast({
                title: "New Discord Log",
                description: payload.new.message,
              });
            }
          )
          .subscribe();

        // Subscribe to presence channel
        presenceChannel
          .on('presence', { event: 'sync' }, () => {
            const state = presenceChannel.presenceState();
            console.log('Presence state:', state);
          })
          .subscribe();

        return () => {
          supabase.removeChannel(presenceChannel);
          supabase.removeChannel(typingChannel);
          supabase.removeChannel(logsChannel);
        };
      } catch (error) {
        console.error('Error setting up realtime channels:', error);
      }
    };

    setupRealtimeChannels();
  }, [initializeWorker, toast]);

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { delta } = event;
    setPosition(current => ({
      x: current.x + delta.x,
      y: current.y + delta.y,
    }));
  };

  if (!isVisible) return null;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: position.x,
          y: position.y,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-20 right-4 w-96 h-[600px] bg-background/95 backdrop-blur-lg rounded-lg border border-border shadow-lg flex flex-col z-50 overflow-hidden"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        <AICore />
      </motion.div>
    </DndContext>
  );
};