import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export function APIKeySettings() {
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [keys, setKeys] = useState({
    openai: "",
    gemini: "",
    anthropic: "",
    huggingface: "",
  });

  const toggleShowKey = (provider: string) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const handleSaveKey = async (provider: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to save API keys"
        });
        return;
      }

      const { error } = await supabase
        .from('ai_settings')
        .upsert({
          user_id: session.user.id,
          provider: provider,
          api_key: keys[provider as keyof typeof keys],
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "API Key Saved",
        description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} API key has been updated successfully.`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving API key",
        description: error.message
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">API Keys</h2>
        <p className="text-muted-foreground">
          Configure your AI provider API keys
        </p>
      </div>

      <div className="grid gap-6">
        {Object.entries({
          openai: {
            name: "OpenAI",
            description: "Required for GPT-4 and other OpenAI models",
            placeholder: "sk-..."
          },
          gemini: {
            name: "Google Gemini",
            description: "Required for Google Gemini AI models",
            placeholder: "AIza..."
          },
          anthropic: {
            name: "Anthropic",
            description: "Required for Claude and other Anthropic models",
            placeholder: "sk-ant-..."
          },
          huggingface: {
            name: "Hugging Face",
            description: "Required for accessing Hugging Face models",
            placeholder: "hf_..."
          }
        }).map(([provider, config]) => (
          <Card key={provider} className="p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">{config.name}</Label>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type={showKeys[provider] ? "text" : "password"}
                    value={keys[provider as keyof typeof keys]}
                    onChange={(e) => setKeys(prev => ({
                      ...prev,
                      [provider]: e.target.value
                    }))}
                    placeholder={config.placeholder}
                    className="font-mono"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleShowKey(provider)}
                >
                  {showKeys[provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button 
                  onClick={() => handleSaveKey(provider)}
                  disabled={!keys[provider as keyof typeof keys]}
                >
                  Save
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}