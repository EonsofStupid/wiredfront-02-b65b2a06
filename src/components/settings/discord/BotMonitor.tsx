import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Server, MessageSquare, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LogEntry {
  timestamp: string;
  type: 'info' | 'error' | 'warning';
  message: string;
}

interface BotStats {
  messagesProcessed: number;
  quotesStored: number;
  activeServers: number;
  uptime: string;
}

export const BotMonitor = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<BotStats>({
    messagesProcessed: 0,
    quotesStored: 0,
    activeServers: 0,
    uptime: '0:00:00'
  });
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch bot status
      const { data: botConfig } = await supabase
        .from('discord_bot_config')
        .select('*')
        .single();

      if (botConfig) {
        setIsOnline(botConfig.is_active);
        setStats(prev => ({
          ...prev,
          activeServers: botConfig.server_count || 0,
          messagesProcessed: botConfig.total_messages || 0
        }));
      }

      // Fetch quotes count
      const { count: quotesCount } = await supabase
        .from('discord_quotes')
        .select('*', { count: 'exact' });

      setStats(prev => ({
        ...prev,
        quotesStored: quotesCount || 0
      }));

      // Fetch recent logs
      const { data: recentLogs } = await supabase
        .from('discord_bot_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (recentLogs) {
        setLogs(recentLogs.map(log => ({
          timestamp: log.created_at,
          type: log.level as 'info' | 'error' | 'warning',
          message: log.message
        })));
      }
    };

    fetchInitialData();

    // Subscribe to bot status changes
    const botStatusSubscription = supabase
      .channel('bot-status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'discord_bot_config'
      }, (payload) => {
        setIsOnline(payload.new.is_active);
        setStats(prev => ({
          ...prev,
          activeServers: payload.new.server_count,
          messagesProcessed: payload.new.total_messages
        }));

        // Add connection status to logs
        setLogs(prev => [{
          timestamp: new Date().toISOString(),
          type: payload.new.is_active ? 'info' : 'warning',
          message: payload.new.is_active ? 'Bot connected successfully' : 'Bot disconnected'
        }, ...prev]);
      })
      .subscribe();

    // Subscribe to new logs
    const logsSubscription = supabase
      .channel('bot-logs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'discord_bot_logs'
      }, (payload) => {
        setLogs(prev => [{
          timestamp: payload.new.created_at,
          type: payload.new.level as 'info' | 'error' | 'warning',
          message: payload.new.message
        }, ...prev.slice(0, 49)]); // Keep last 50 logs
      })
      .subscribe();

    return () => {
      botStatusSubscription.unsubscribe();
      logsSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between bg-dark-lighter/30 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span>Status</span>
          </div>
          <Badge 
            variant={isOnline ? "default" : "destructive"}
            className={isOnline ? "bg-neon-success/20 text-neon-success border border-neon-success/50" : ""}
          >
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </Card>
        
        <Card className="p-4 flex items-center justify-between bg-dark-lighter/30 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>Servers</span>
          </div>
          <span className="font-bold">{stats.activeServers}</span>
        </Card>
        
        <Card className="p-4 flex items-center justify-between bg-dark-lighter/30 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </div>
          <span className="font-bold">{stats.messagesProcessed}</span>
        </Card>
        
        <Card className="p-4 flex items-center justify-between bg-dark-lighter/30 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Quotes</span>
          </div>
          <span className="font-bold">{stats.quotesStored}</span>
        </Card>
      </div>

      <Card className="p-4 bg-dark-lighter/30 backdrop-blur-md border border-white/10">
        <h3 className="text-lg font-semibold mb-2">Live Logs</h3>
        <ScrollArea className="h-[200px] rounded-md border p-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`mb-2 text-sm ${
                log.type === 'error' ? 'text-red-500' :
                log.type === 'warning' ? 'text-yellow-500' :
                'text-gray-400'
              }`}
            >
              <span className="opacity-50">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.message}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500 text-sm">No logs available</div>
          )}
        </ScrollArea>
      </Card>
    </div>
  );
};