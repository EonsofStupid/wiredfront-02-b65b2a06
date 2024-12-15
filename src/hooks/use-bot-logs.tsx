import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { LogEntry } from "@/types/discord";

export const useBotLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchInitialLogs = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('discord_bot_logs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setLogs(data as LogEntry[]);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    // Initial fetch
    fetchInitialLogs();

    // Set up real-time subscription
    const logsSubscription = supabase
      .channel('bot-logs-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'discord_bot_logs'
        },
        (payload) => {
          console.log('New log received:', payload);
          setLogs(prev => [(payload.new as LogEntry), ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      logsSubscription.unsubscribe();
    };
  }, []);

  return logs;
};