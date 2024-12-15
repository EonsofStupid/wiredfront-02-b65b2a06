import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Bot, Settings, Quote, Trophy, Shield } from "lucide-react";
import { BotGeneralSettings } from "./discord/BotGeneralSettings";
import { BotAIConfig } from "./discord/BotAIConfig";
import { BotMonitor } from "./discord/BotMonitor";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const DiscordBotSettings = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [botConfig, setBotConfig] = useState({
    name: "",
    client_id: "",
    bot_token: "",
    is_active: false
  });
  const [aiConfig, setAIConfig] = useState({
    provider: "gemini",
    style: "helpful",
    maxLength: 2000
  });

  useEffect(() => {
    const fetchBotConfig = async () => {
      const { data, error } = await supabase
        .from('discord_bot_config')
        .select('*')
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching bot configuration",
          description: error.message
        });
      } else if (data) {
        setBotConfig(data);
      }
    };

    fetchBotConfig();
  }, [toast]);

  const handleUpdateConfig = async (updates: Partial<typeof botConfig>) => {
    const { error } = await supabase
      .from('discord_bot_config')
      .upsert({ ...botConfig, ...updates });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating bot configuration",
        description: error.message
      });
    } else {
      setBotConfig(prev => ({ ...prev, ...updates }));
      toast({
        title: "Configuration updated",
        description: "Bot settings have been saved successfully."
      });
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Call the Discord bot edge function to start the bot
      const { error: functionError } = await supabase.functions.invoke('discord-bot', {
        body: { 
          action: 'start',
          config: botConfig
        }
      });

      if (functionError) throw functionError;

      await handleUpdateConfig({ is_active: true });
      toast({
        title: "Bot Connected",
        description: "Discord bot has been successfully connected."
      });
    } catch (error: any) {
      console.error('Bot connection error:', error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || "Failed to connect the Discord bot."
      });
      // Reset active status if connection fails
      await handleUpdateConfig({ is_active: false });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleUpdateAIConfig = (updates: Partial<typeof aiConfig>) => {
    setAIConfig(prev => ({ ...prev, ...updates }));
    toast({
      title: "AI Settings Updated",
      description: "AI configuration has been saved successfully."
    });
  };

  return (
    <div className="space-y-6">
      <BotMonitor />
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Bot className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Settings className="h-4 w-4 mr-2" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="quotes">
            <Quote className="h-4 w-4 mr-2" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="moderation">
            <Shield className="h-4 w-4 mr-2" />
            Moderation
          </TabsTrigger>
        </TabsList>

        <Card className="p-6">
          <TabsContent value="general">
            <BotGeneralSettings
              botConfig={botConfig}
              isConnecting={isConnecting}
              onConnect={handleConnect}
              onUpdateConfig={handleUpdateConfig}
            />
          </TabsContent>
          
          <TabsContent value="ai">
            <BotAIConfig />
          </TabsContent>
          
          <TabsContent value="quotes">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quote Management</h3>
              <p className="text-gray-500">
                Configure quote categories, tags, and moderation settings.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Achievement System</h3>
              <p className="text-gray-500">
                Manage badges, achievements, and user progression.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="moderation">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Moderation Tools</h3>
              <p className="text-gray-500">
                Configure auto-moderation rules and AI-powered content filtering.
              </p>
            </div>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};
