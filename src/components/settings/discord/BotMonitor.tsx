import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface LogEntry {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  created_at: string;
  metadata: Record<string, any> | null;
}

export const BotMonitor = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState({
    isActive: false,
    lastPing: null as string | null,
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

        setLogs(data || []);
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
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching bot status:', error);
          return;
        }

        if (data) {
          setStatus({
            isActive: data.is_active,
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
            isActive: payload.new.is_active,
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

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

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

      <div className="space-y-2">
        <h4 className="font-medium">Recent Logs</h4>
        <ScrollArea className="h-[300px] rounded-md border bg-card">
          <div className="p-4 space-y-4">
            {logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2 p-2 rounded-lg bg-background/40 backdrop-blur-sm">
                  {getLogIcon(log.level)}
                  <div className="space-y-1 flex-1">
                    <p className="text-sm">{log.message}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                      {log.metadata && (
                        <Badge variant="outline" className="text-xs">
                          {log.metadata.source || 'system'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No logs available
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};