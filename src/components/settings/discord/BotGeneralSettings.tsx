import { useState } from "react";
import { Bot, Power, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BotGeneralSettingsProps {
  botConfig: any;
  isConnecting: boolean;
  onConnect: () => void;
  onUpdateConfig: (updates: any) => void;
}

export const BotGeneralSettings = ({
  botConfig,
  isConnecting,
  onConnect,
  onUpdateConfig,
}: BotGeneralSettingsProps) => {
  const [isEditingToken, setIsEditingToken] = useState(false);
  const { toast } = useToast();

  const handleTokenSave = (newToken: string) => {
    if (!newToken) {
      toast({
        title: "Token Required",
        description: "Please enter a valid Discord bot token",
        variant: "destructive",
      });
      return;
    }

    onUpdateConfig({ bot_token: newToken });
    setIsEditingToken(false);
    toast({
      title: "Bot token updated",
      description: "Your Discord bot token has been saved securely.",
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${botConfig?.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm">
            Bot Status: {botConfig?.is_active ? "Online" : "Offline"}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your bot's online status will update when connected</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium mb-1 block">Bot Token</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-2">
                  {isEditingToken ? (
                    <Input
                      type="password"
                      placeholder="Enter your bot token"
                      defaultValue={botConfig?.bot_token}
                      onBlur={(e) => handleTokenSave(e.target.value)}
                      autoFocus
                      className="font-mono"
                    />
                  ) : (
                    <Input
                      type="password"
                      value={botConfig?.bot_token ? "••••••••••••••••" : ""}
                      placeholder="Click to add bot token"
                      className="cursor-pointer font-mono"
                      onClick={() => setIsEditingToken(true)}
                    />
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditingToken(true)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your Discord bot token from the Developer Portal</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium mb-1 block">Bot Name</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  placeholder="Enter bot name"
                  value={botConfig?.name || ""}
                  onChange={(e) => onUpdateConfig({ name: e.target.value })}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>The display name of your bot in Discord servers</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <span className="text-sm">
            Connected Servers: {botConfig?.server_count || 0}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onConnect}
                disabled={isConnecting || !botConfig?.bot_token}
                className="gap-2"
              >
                <Power className="h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect Bot"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connect your bot to Discord using the provided token</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};