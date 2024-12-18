import React, { useEffect, useState } from 'react';
import { useMessageQueue } from '@/stores/messageQueue';
import { useAIStore } from '@/stores/ai';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, MessageSquare, Settings, Cpu, Mic, MicOff } from "lucide-react";
import { AIOptionsTab } from './AIOptionsTab';
import { AIChatTab } from './AIChatTab';
import { AICore } from '@/components/ai-core/AICore';
import { ChatInput } from './chat/ChatInput';
import { AudioControls } from './audio/AudioControls';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Convert QueuedMessages to Messages
  const messages: Message[] = queuedMessages.map(qm => ({
    id: qm.id,
    content: qm.content,
    role: 'assistant',
    timestamp: qm.timestamp
  }));

  useEffect(() => {
    initializeWorker();

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
          filter: `chat_id=eq.${supabase.auth.session()?.user.id}`
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
        className={`fixed bottom-20 right-4 w-96 h-[600px] bg-background/95 backdrop-blur-lg rounded-lg border border-border shadow-lg flex flex-col z-50 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary/20 ${
          isDragging ? 'cursor-grabbing neon-glow' : 'cursor-grab'
        }`}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <div className="border-b border-border bg-gradient-to-r from-background/50 to-background/80">
            <TabsList className="w-full">
              <TabsTrigger value="chat" className="flex-1 gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex-1 gap-2">
                <Volume2 className="w-4 h-4" />
                Audio
              </TabsTrigger>
              <TabsTrigger value="options" className="flex-1 gap-2">
                <Settings className="w-4 h-4" />
                Options
              </TabsTrigger>
              <TabsTrigger value="core" className="flex-1 gap-2">
                <Cpu className="w-4 h-4" />
                Core
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
            <AIChatTab
              messages={messages}
              input={input}
              isProcessing={isProcessing}
              isOnline={isOnline}
              typingUsers={typingUsers}
              onInputChange={setInput}
              onSubmit={(e) => {
                e.preventDefault();
                // Handle chat submission
              }}
            />
          </TabsContent>

          <TabsContent value="audio" className="mt-0 p-4 space-y-4">
            <div className="glass-card p-4 space-y-4 rounded-lg border border-border/50">
              <h3 className="text-lg font-semibold">Voice Controls</h3>
              <AudioControls
                onTranscript={(text) => setInput(text)}
                currentMessage={input}
              />
              <ChatInput
                input={input}
                isProcessing={isProcessing}
                onInputChange={setInput}
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle audio submission
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="options" className="mt-0">
            <AIOptionsTab />
          </TabsContent>

          <TabsContent value="core" className="mt-0 flex-1">
            <AICore />
          </TabsContent>
        </Tabs>
      </motion.div>
    </DndContext>
  );
};