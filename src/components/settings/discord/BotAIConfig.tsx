import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { AIProvider } from "@/types/ai";

interface AIConfigMetadata {
  fallbackEnabled: boolean;
  offlineMode: boolean;
  routingStrategy: string;
  customFunctions?: {
    name: string;
    description: string;
    isEnabled: boolean;
  }[];
}

export const BotAIConfig = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<{
    primaryProvider: AIProvider;
    fallbackEnabled: boolean;
    offlineMode: boolean;
    routingStrategy: string;
    customFunctions: Array<{
      name: string;
      description: string;
      isEnabled: boolean;
    }>;
  }>({
    primaryProvider: "gemini",
    fallbackEnabled: false,
    offlineMode: false,
    routingStrategy: "cost-effective",
    customFunctions: [
      {
        name: "welcomeMessage",
        description: "Send a welcome message to new members",
        isEnabled: true
      },
      {
        name: "moderationFilter",
        description: "Filter inappropriate content",
        isEnabled: true
      },
      {
        name: "customCommands",
        description: "Enable user-defined commands",
        isEnabled: false
      }
    ]
  });

  useEffect(() => {
    const fetchAIConfig = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            variant: "destructive",
            title: "Authentication required",
            description: "Please sign in to manage bot settings"
          });
          return;
        }

        const { data, error } = await supabase
          .from('ai_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') {
            toast({
              variant: "destructive",
              title: "Error fetching AI configuration",
              description: error.message
            });
          }
          return;
        }

        if (data) {
          const metadata = (data.metadata || {}) as unknown as AIConfigMetadata;
          setConfig(prev => ({
            ...prev,
            primaryProvider: data.provider as AIProvider,
            fallbackEnabled: metadata.fallbackEnabled || false,
            offlineMode: metadata.offlineMode || false,
            routingStrategy: metadata.routingStrategy || "cost-effective",
            customFunctions: metadata.customFunctions || prev.customFunctions
          }));
        }
      } catch (error) {
        console.error('Error fetching AI config:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load AI configuration"
        });
      }
    };

    fetchAIConfig();
  }, [toast]);

  const handleSaveConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('ai_settings')
        .upsert({
          user_id: session.user.id,
          provider: config.primaryProvider,
          metadata: {
            fallbackEnabled: config.fallbackEnabled,
            offlineMode: config.offlineMode,
            routingStrategy: config.routingStrategy,
            customFunctions: config.customFunctions
          }
        });

      if (error) throw error;

      toast({
        title: "Configuration saved",
        description: "AI settings have been updated successfully."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving configuration",
        description: error.message
      });
    }
  };

  const toggleFunction = (functionName: string) => {
    setConfig(prev => ({
      ...prev,
      customFunctions: prev.customFunctions.map(fn => 
        fn.name === functionName ? { ...fn, isEnabled: !fn.isEnabled } : fn
      )
    }));
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">AI Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Configure AI providers and behavior for your Discord bot
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Primary AI Provider</Label>
          <Select
            value={config.primaryProvider}
            onValueChange={(value: AIProvider) => setConfig(prev => ({ ...prev, primaryProvider: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Google Gemini</SelectItem>
              <SelectItem value="chatgpt">OpenAI GPT-4</SelectItem>
              <SelectItem value="huggingface">Hugging Face (Local)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Fallback Providers</Label>
              <p className="text-sm text-muted-foreground">
                Automatically switch to alternative providers if primary fails
              </p>
            </div>
            <Switch
              checked={config.fallbackEnabled}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, fallbackEnabled: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Offline Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use local models when internet is unavailable
              </p>
            </div>
            <Switch
              checked={config.offlineMode}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, offlineMode: checked }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Routing Strategy</Label>
          <Select
            value={config.routingStrategy}
            onValueChange={(value) => setConfig(prev => ({ ...prev, routingStrategy: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cost-effective">Cost Effective</SelectItem>
              <SelectItem value="performance">High Performance</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Bot Functions</h4>
          {config.customFunctions.map((fn) => (
            <div key={fn.name} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{fn.name}</Label>
                <p className="text-sm text-muted-foreground">{fn.description}</p>
              </div>
              <Switch
                checked={fn.isEnabled}
                onCheckedChange={() => toggleFunction(fn.name)}
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSaveConfig} className="w-full">
          Save AI Configuration
        </Button>
      </div>
    </Card>
  );
};