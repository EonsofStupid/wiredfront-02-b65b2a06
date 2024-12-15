import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Activity, CheckCircle, Clock } from "lucide-react";
import { BotLogViewer } from "./BotLogViewer";
import type { LogEntry, BotStatus } from "@/types/discord";

export const BotMonitor = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<BotStatus>({
    isActive: false,
    lastPing: null,
    messageCount: 0
  });

  useEffect(() => {
    const fetchInitialLogs = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            variant: "destructive",
            title: "Authentication required",
            description: "Please sign in to view bot logs"
          });
          return;
        }

        const { data, error } = await supabase
          .from('discord_bot_logs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching logs:', error);
          toast({
            variant: "destructive",
            title: "Error fetching logs",
            description: error.message
          });
          return;
        }

        setLogs(data as LogEntry[] || []);
      } catch (error) {
        console.error('Error in fetchInitialLogs:', error);
      }
    };

    const fetchBotStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('discord_bot_config')
          .select('is_active, updated_at, total_messages')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching bot status:', error);
          return;
        }

        if (data) {
          setStatus({
            isActive: data.is_active || false,
            lastPing: data.updated_at,
            messageCount: data.total_messages || 0
          });
        }
      } catch (error) {
        console.error('Error in fetchBotStatus:', error);
      }
    };

    // Set up real-time subscription for logs
    const logsSubscription = supabase
      .channel('bot-logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'discord_bot_logs'
        },
        (payload) => {
          console.log('New log received:', payload);
          setLogs(prev => [payload.new as LogEntry, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    // Set up real-time subscription for bot status
    const statusSubscription = supabase
      .channel('bot-status')
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

    fetchInitialLogs();
    fetchBotStatus();

    // Cleanup subscriptions
    return () => {
      logsSubscription.unsubscribe();
      statusSubscription.unsubscribe();
    };
  }, [toast]);

  return (
    <Card className="p-6 space-y-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Bot Monitor</h3>
          <p className="text-sm text-muted-foreground">Real-time bot status and logs</p>
        </div>
        <Badge 
          variant={status.isActive ? "default" : "destructive"}
          className={status.isActive ? "bg-green-500/20 text-green-500 backdrop-blur-sm border border-green-500/50" : ""}
        >
          {status.isActive ? (
            <CheckCircle className="h-4 w-4 mr-1" />
          ) : (
            <Clock className="h-4 w-4 mr-1" />
          )}
          {status.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <p className="text-2xl font-bold">
            {status.isActive ? "Online" : "Offline"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Last Update</p>
          <p className="text-2xl font-bold">
            {status.lastPing ? new Date(status.lastPing).toLocaleTimeString() : "N/A"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Messages Processed</p>
          <p className="text-2xl font-bold">{status.messageCount}</p>
        </div>
      </div>

      <BotLogViewer logs={logs} />
    </Card>
  );
};