import { useState } from "react";
import { Bot, MessageSquare, Power, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const DiscordBotSettings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { data: botConfig, error } = await supabase
        .from('discord_bot_config')
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      if (!botConfig?.client_id) {
        throw new Error('Discord client ID not configured');
      }

      // Redirect to Discord OAuth flow
      window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${botConfig.client_id}&permissions=2147483648&scope=bot`;
    } catch (error) {
      console.error('Error connecting bot:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect Discord bot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-neon-blue" />
          <h2 className="text-lg font-semibold">Discord Bot</h2>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
          aria-label="Toggle bot"
        />
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm">Bot Status: {isEnabled ? 'Online' : 'Offline'}</span>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Bot Token</label>
            <div className="flex gap-2">
              <Input type="password" value="••••••••••••••••" disabled />
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Server Count</label>
            <Input value="0" disabled />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">Total Messages: 0</span>
          </div>
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="gap-2"
          >
            <Power className="h-4 w-4" />
            {isConnecting ? 'Connecting...' : 'Connect Bot'}
          </Button>
        </div>
      </Card>
    </div>
  );
};