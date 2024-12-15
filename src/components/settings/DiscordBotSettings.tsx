import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BotGeneralSettings } from "./discord/BotGeneralSettings";
import { BotAISettings } from "./discord/BotAISettings";
import { BotServerManager } from "./discord/BotServerManager";
import { BotCommandBuilder } from "./discord/BotCommandBuilder";

export const DiscordBotSettings = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [botConfig, setBotConfig] = useState<any>(null);
  const [aiConfig, setAIConfig] = useState<any>({
    provider: "gemini",
    style: "helpful",
    maxLength: 2000,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadBotConfig();
  }, []);

  const loadBotConfig = async () => {
    try {
      const { data: config, error } = await supabase
        .from("discord_bot_config")
        .select("*")
        .single();

      if (error) throw error;
      setBotConfig(config);
    } catch (error) {
      console.error("Error loading bot config:", error);
      toast({
        title: "Error",
        description: "Failed to load bot configuration",
        variant: "destructive",
      });
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await supabase.functions.invoke("discord-bot", {
        body: { action: "start", config: botConfig },
      });

      if (!response.data?.success) throw new Error("Failed to start bot");

      toast({
        title: "Bot Connected",
        description: "Discord bot is now online and ready to use",
      });

      await loadBotConfig();
    } catch (error) {
      console.error("Error connecting bot:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect Discord bot. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleUpdateConfig = async (updates: any) => {
    try {
      const { error } = await supabase
        .from("discord_bot_config")
        .upsert({ ...botConfig, ...updates })
        .select()
        .single();

      if (error) throw error;

      await loadBotConfig();
      toast({
        title: "Settings Updated",
        description: "Bot configuration has been saved",
      });
    } catch (error) {
      console.error("Error updating config:", error);
      toast({
        title: "Update Error",
        description: "Failed to update bot configuration",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-neon-blue" />
        <h2 className="text-lg font-semibold">Discord Bot</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <BotGeneralSettings
            botConfig={botConfig}
            isConnecting={isConnecting}
            onConnect={handleConnect}
            onUpdateConfig={handleUpdateConfig}
          />
        </TabsContent>

        <TabsContent value="ai">
          <BotAISettings
            aiConfig={aiConfig}
            onUpdateAIConfig={(updates) => setAIConfig({ ...aiConfig, ...updates })}
          />
        </TabsContent>

        <TabsContent value="servers">
          <BotServerManager
            servers={botConfig?.servers || []}
            onRefreshServers={loadBotConfig}
          />
        </TabsContent>

        <TabsContent value="commands">
          <BotCommandBuilder
            commands={botConfig?.commands || []}
            onSaveCommand={async (command) => {
              const commands = [...(botConfig?.commands || []), command];
              await handleUpdateConfig({ commands });
            }}
            onDeleteCommand={async (commandId) => {
              const commands = botConfig?.commands?.filter(
                (c: any) => c.id !== commandId
              );
              await handleUpdateConfig({ commands });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};