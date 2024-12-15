import { BotStatus } from "@/types/discord";

interface StatusMetricsProps {
  status: BotStatus;
}

export const StatusMetrics = ({ status }: StatusMetricsProps) => {
  return (
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
  );
};