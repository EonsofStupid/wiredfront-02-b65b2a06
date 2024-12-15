import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Server {
  id: string;
  name: string;
  memberCount: number;
  isActive: boolean;
}

interface BotServerManagerProps {
  servers: Server[];
  onRefreshServers: () => void;
}

export const BotServerManager = ({
  servers,
  onRefreshServers,
}: BotServerManagerProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Connected Servers</h3>
        <Button variant="outline" size="sm" onClick={onRefreshServers}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-2">
        {servers.map((server) => (
          <div
            key={server.id}
            className="flex items-center justify-between p-3 border rounded"
          >
            <div>
              <h4 className="font-medium">{server.name}</h4>
              <p className="text-sm text-gray-500">
                {server.memberCount} members
              </p>
            </div>
            <div
              className={`h-2 w-2 rounded-full ${
                server.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};