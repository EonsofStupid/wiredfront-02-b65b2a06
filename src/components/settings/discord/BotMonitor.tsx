import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { BotLogViewer } from "./BotLogViewer";
import { StatusMetrics } from "./StatusMetrics";
import { useBotStatus } from "@/hooks/use-bot-status";
import { useBotLogs } from "@/hooks/use-bot-logs";

export const BotMonitor = () => {
  const status = useBotStatus();
  const logs = useBotLogs();

  return (
    <Card className="p-6 space-y-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Bot Monitor</h3>
          <p className="text-sm text-muted-foreground">Real-time bot status and logs</p>
        </div>
        <Badge 
          variant={status.isActive ? "default" : "destructive"}
          className={status.isActive ? "bg-[#34e8eb]/20 text-[#34e8eb] backdrop-blur-sm border border-[#34e8eb]/50" : ""}
        >
          {status.isActive ? (
            <CheckCircle className="h-4 w-4 mr-1" />
          ) : (
            <Clock className="h-4 w-4 mr-1" />
          )}
          {status.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <StatusMetrics status={status} />
      <BotLogViewer logs={logs} />
    </Card>
  );
};