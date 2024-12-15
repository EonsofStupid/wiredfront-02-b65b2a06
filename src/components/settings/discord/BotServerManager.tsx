import { useState } from "react";
import { RefreshCw, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Server {
  id: string;
  name: string;
  memberCount: number;
}

interface BotServerManagerProps {
  servers: Server[];
  onRefreshServers: () => void;
}

export const BotServerManager = ({
  servers = [],
  onRefreshServers,
}: BotServerManagerProps) => {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Connected Servers</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefreshServers}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Update the list of connected servers</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="divide-y">
          {servers.map((server) => (
            <div
              key={server.id}
              className="py-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{server.name}</p>
                <p className="text-sm text-gray-500">
                  {server.memberCount} members
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedServer(server)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configure {server.name}</DialogTitle>
                  </DialogHeader>
                  {/* Server-specific settings will go here */}
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};