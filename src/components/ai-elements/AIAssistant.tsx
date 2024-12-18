import React, { useEffect, useState } from 'react';
import { useMessageQueue } from '@/stores/messageQueue';
import { useAIStore } from '@/stores/ai';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, MessageSquare, Settings, Cpu } from "lucide-react";
import { AIOptionsTab } from './AIOptionsTab';
import { AIChatTab } from './AIChatTab';
import { AICore } from '@/components/ai-core/AICore';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
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

  const { speak, isLoading: isSpeaking } = useTextToSpeech();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-background/95 backdrop-blur-lg rounded-lg border border-border shadow-lg flex flex-col z-50 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary/20">
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
            onSubmit={handleSubmit}
          />
        </TabsContent>

        <TabsContent value="audio" className="mt-0 p-4 space-y-4">
          <div className="glass-card p-4 space-y-4 rounded-lg border border-border/50">
            <h3 className="text-lg font-semibold">Text to Speech</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isSpeaking ? 'Speaking...' : 'Ready to speak'}
              </span>
              <button
                onClick={() => speak(messages[messages.length - 1]?.content || '')}
                disabled={isSpeaking || !messages.length}
                className="px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {isSpeaking ? 'Speaking...' : 'Speak Last Message'}
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="options" className="mt-0">
          <AIOptionsTab />
        </TabsContent>

        <TabsContent value="core" className="mt-0 flex-1">
          <AICore />
        </TabsContent>
      </Tabs>
    </div>
  );
};
