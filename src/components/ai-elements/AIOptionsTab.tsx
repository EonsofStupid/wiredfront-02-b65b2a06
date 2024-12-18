import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAIStore } from "@/stores/ai";
import { Bot, Brain, Sparkles, Network, Cpu, Workflow } from "lucide-react";
import { AI_PROVIDERS } from "@/config/aiProviders";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const AIOptionsTab = () => {
  const { toast } = useToast();
  const isEnabled = useAIStore((state) => state.isEnabled);
  const setEnabled = useAIStore((state) => state.setEnabled);
  const currentProvider = useAIStore((state) => state.currentProvider);
  const setProvider = useAIStore((state) => state.setProvider);

  const handleProviderToggle = async (providerId: string) => {
    try {
      const { data: settings } = await supabase
        .from('ai_settings')
        .select('api_key')
        .eq('provider', providerId)
        .single();

      if (!settings?.api_key) {
        toast({
          title: `${AI_PROVIDERS[providerId].name} API Key Required`,
          description: "Please add your API key in settings",
          action: (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/settings'}
            >
              Add Key
            </Button>
          ),
        });
        return;
      }

      setProvider(providerId);
      toast({
        title: "Provider Updated",
        description: `Switched to ${AI_PROVIDERS[providerId].name}`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update provider"
      });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Card className="p-4 space-y-4 bg-background/95 backdrop-blur-lg border border-border">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>AI Assistant</Label>
            <p className="text-sm text-muted-foreground">
              Enable or disable AI assistance
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(AI_PROVIDERS).map(([id, config]) => {
            const IconComponent = config.icon;
            return (
              <div 
                key={id}
                className="glass-card p-4 space-y-2 hover:bg-accent/5 transition-colors cursor-pointer"
                onClick={() => handleProviderToggle(id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <span className="font-medium">{config.name}</span>
                  </div>
                  <Switch 
                    checked={currentProvider === id}
                    onCheckedChange={() => handleProviderToggle(id)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {config.apiKeyRequired ? "API key required" : config.description}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};