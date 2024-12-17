import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Log {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  metadata?: Record<string, any>;
}

export function LogViewer() {
  const [logs, setLogs] = useState<Log[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('discord_bot_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Transform the data to match our Log interface
      const transformedLogs: Log[] = data.map(log => ({
        timestamp: new Date(log.created_at).toISOString(),
        level: log.level,
        message: log.message,
        metadata: log.metadata as Record<string, any>
      }));

      setLogs(transformedLogs);
    } catch (error) {
      console.error('Error loading logs:', error);
      toast({
        variant: "destructive",
        title: "Error loading logs",
        description: "Failed to load application logs."
      });
    }
  };

  const handleExportLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('discord_bot_logs')
        .delete()
        .eq('user_id', session.user.id);

      if (error) throw error;

      setLogs([]);
      toast({
        title: "Logs cleared",
        description: "All logs have been cleared successfully."
      });
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast({
        variant: "destructive",
        title: "Error clearing logs",
        description: "Failed to clear logs."
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Application Logs</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportLogs}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearLogs}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[500px] rounded-md border">
        <div className="p-4 space-y-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-card/50 border space-y-2"
            >
              <div className="flex items-center justify-between">
                <Badge variant={
                  log.level === 'error' ? 'destructive' :
                  log.level === 'warning' ? 'outline' : 'default'
                }>
                  {log.level}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm">{log.message}</p>
              {log.metadata && (
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}