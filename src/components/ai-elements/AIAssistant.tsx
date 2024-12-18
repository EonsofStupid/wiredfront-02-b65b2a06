import React, { useEffect, useState } from 'react';
import { useMessageQueue } from '@/stores/messageQueue';
import { useAIStore } from '@/stores/ai';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIOptionsTab } from './AIOptionsTab';
import { AIChatTab } from './AIChatTab';
import type { Message } from '@/types/ai';
import type { TypingStatus, RealtimePayload } from '@/types/realtime';

export const AIAssistant = () => {
  const { initializeWorker, messages: queuedMessages, error } = useMessageQueue();
  const { toast } = useToast();
  const isVisible = useAIStore((state) => state.isVisible);
  const isOnline = useOnlineStatus();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const pendingMessages = React.useRef<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Convert QueuedMessages to Messages
  const messages: Message[] = queuedMessages.map(qm => ({
    id: qm.id,
    content: qm.content,
    role: 'assistant',
    timestamp: qm.timestamp
  }));

  // Initialize message worker and real-time subscriptions
  useEffect(() => {
    initializeWorker();

    // Set up real-time presence channel
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
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await channel.track({
              user_id: user.id,
              online_at: new Date().toISOString(),
            });
          }
        }
      });

    // Listen for typing status changes
    const typingChannel = supabase
      .channel('typing-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status'
        },
        (payload: RealtimePayload<TypingStatus>) => {
          if (payload.new) {
            setTypingUsers(current => {
              const userId = payload.new.user_id;
              if (payload.new.is_typing && !current.includes(userId)) {
                return [...current, userId];
              } else if (!payload.new.is_typing) {
                return current.filter(id => id !== userId);
              }
              return current;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(typingChannel);
    };
  }, [initializeWorker]);

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
          type: 'chat',
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
    <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-background/95 backdrop-blur-lg rounded-lg border border-border shadow-lg flex flex-col z-50">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <div className="border-b border-border">
          <TabsList className="w-full">
            <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
            <TabsTrigger value="options" className="flex-1">AI Options</TabsTrigger>
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
            onSubmit={handleSubmit}
          />
        </TabsContent>

        <TabsContent value="options" className="mt-0">
          <AIOptionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};