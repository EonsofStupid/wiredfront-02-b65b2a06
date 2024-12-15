import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Download } from "lucide-react";
import type { LogEntry } from "@/types/discord";

interface BotLogViewerProps {
  logs: LogEntry[];
}

export const BotLogViewer = ({ logs }: BotLogViewerProps) => {
  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-[#34e8eb]" />;
    }
  };

  const handleExportLogs = () => {
    const logData = logs.map(log => ({
      timestamp: new Date(log.created_at).toISOString(),
      level: log.level,
      message: log.message,
      metadata: log.metadata
    }));

    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discord-bot-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Recent Logs</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportLogs}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>
      <ScrollArea className="h-[300px] rounded-md border bg-card">
        <div className="p-4 space-y-4">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-start space-x-2 p-2 rounded-lg bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-colors"
              >
                {getLogIcon(log.level)}
                <div className="space-y-1 flex-1">
                  <p className="text-sm">{log.message}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                    {log.metadata && typeof log.metadata === 'object' && 'source' in log.metadata && (
                      <Badge variant="outline" className="text-xs">
                        {String(log.metadata.source || 'system')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              No logs available
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};