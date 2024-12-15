import { useState, useEffect } from "react";
import { Bot, MessageSquare, Power, RefreshCw, Settings, Server, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const DiscordBotSettings = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [botConfig, setBotConfig] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const { toast } = useToast();

  useEffect(() => {
    loadBotConfig();
  }, []);

  const loadBotConfig = async () => {
    try {
      const { data: config, error } = await supabase
        .from('discord_bot_config')
        .select('*')
        .single();

      if (error) throw error;
      setBotConfig(config);
      setIsEnabled(config?.is_active || false);
    } catch (error) {
      console.error('Error loading bot config:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { data: config, error } = await supabase
        .from('discord_bot_config')
        .select('*')
        .single();

      if (error) throw error;

      if (!config?.client_id || !config?.bot_token) {
        throw new Error('Bot credentials not configured');
      }

      // Start the Discord bot
      const response = await fetch('/api/discord-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          botToken: config.bot_token,
          clientId: config.client_id,
        }),
      });

      if (!response.ok) throw new Error('Failed to start bot');

      // Update bot status
      await supabase
        .from('discord_bot_config')
        .update({ is_active: true })
        .eq('id', config.id);

      setIsEnabled(true);
      toast({
        title: "Bot Connected",
        description: "Discord bot is now online and ready to use",
      });
    } catch (error) {
      console.error('Error connecting bot:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect Discord bot. Please check your configuration.",
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

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Activity className="h-4 w-4 mr-2" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="servers">
            <Server className="h-4 w-4 mr-2" />
            Servers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
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
                <Input value={botConfig?.server_count || '0'} disabled />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Total Messages: {botConfig?.total_messages || '0'}</span>
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
        </TabsContent>

        <TabsContent value="ai">
          <Card className="p-4 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">AI Provider</label>
                <select
                  className="w-full p-2 rounded-md border"
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI GPT-4</option>
                  <option value="anthropic">Anthropic Claude</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Response Style</label>
                <select className="w-full p-2 rounded-md border">
                  <option value="helpful">Helpful</option>
                  <option value="concise">Concise</option>
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Max Response Length</label>
                <Input type="number" defaultValue={2000} />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="servers">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Connected Servers</h3>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              <div className="divide-y">
                {(botConfig?.servers || []).map((server: any) => (
                  <div key={server.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{server.name}</p>
                      <p className="text-sm text-gray-500">{server.memberCount} members</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};