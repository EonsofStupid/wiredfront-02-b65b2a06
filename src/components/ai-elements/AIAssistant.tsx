import { useEffect } from 'react';
import { useMessageQueue } from '@/stores/messageQueue';
import { useToast } from '@/components/ui/use-toast';
import { AICore } from '../ai-core/AICore';
import { useAIStore } from '@/stores/ai';
import { supabase } from '@/integrations/supabase/client';

export const AIAssistant = () => {
  const { initializeWorker, messages, error } = useMessageQueue();
  const { toast } = useToast();
  const isVisible = useAIStore((state) => state.isVisible);

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

  // Error handling
  useEffect(() => {
    if (error) {
      toast({
        title: "Message Processing Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (!isVisible) return null;

  // AICore is now the central component that handles all AI functionality
  return <AICore />;
};