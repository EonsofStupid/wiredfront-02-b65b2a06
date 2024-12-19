import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BotStatus } from "@/types/discord";

export const useBotStatus = () => {
  const [status, setStatus] = useState<BotStatus>({
    isActive: false,
    lastPing: null,
    messageCount: 0
  });

  useEffect(() => {
    const fetchBotStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('discord_bot_config')
          .select('is_active, updated_at, total_messages')
          .eq('user_id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setStatus({
            isActive: data.is_active || false,
            lastPing: data.updated_at,
            messageCount: data.total_messages || 0
          });
        }
      } catch (error) {
        console.error('Error fetching bot status:', error);
      }
    };

    // Initial fetch
    fetchBotStatus();

    // Set up real-time subscription
    const statusSubscription = supabase
      .channel('bot-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'discord_bot_config'
        },
        (payload) => {
          console.log('Bot status updated:', payload);
          setStatus({
            isActive: payload.new.is_active || false,
            lastPing: payload.new.updated_at,
            messageCount: payload.new.total_messages || 0
          });
        }
      )
      .subscribe();

    return () => {
      statusSubscription.unsubscribe();
    };
  }, []);

  return status;
};