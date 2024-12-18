import { useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTypingStatus = (chatId: string, userId: string) => {
  const { toast } = useToast();

  // Debounced function to update typing status
  const updateTypingStatus = useCallback(
    debounce(async (isTyping: boolean) => {
      try {
        const { error } = await supabase
          .from('typing_status')
          .upsert({
            chat_id: chatId,
            user_id: userId,
            is_typing: isTyping,
            last_updated: new Date().toISOString()
          });

        if (error) throw error;
      } catch (error: any) {
        console.error('Error updating typing status:', error);
        toast({
          variant: "destructive",
          title: "Error updating typing status",
          description: error.message
        });
      }
    }, 500),
    [chatId, userId]
  );

  // Subscribe to typing status changes
  useEffect(() => {
    const channel = supabase
      .channel('typing-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          console.log('Typing status changed:', payload);
          // Handle typing status change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  return { updateTypingStatus };
};