import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AIFeatureSettings() {
  const { toast } = useToast();
  const [features, setFeatures] = useState({
    codeAssistance: true,
    onboarding: true,
    moderation: true
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('ai_settings')
        .update({
          metadata: {
            features: features
          }
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Features updated",
        description: "AI assistant features have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving features",
        description: "Failed to update AI features.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">AI Features</h3>
        <p className="text-sm text-muted-foreground">
          Enable or disable specific AI assistant capabilities
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Code Assistance</Label>
            <p className="text-sm text-muted-foreground">
              Help with coding tasks and debugging
            </p>
          </div>
          <Switch
            checked={features.codeAssistance}
            onCheckedChange={(checked) =>
              setFeatures(prev => ({ ...prev, codeAssistance: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Onboarding</Label>
            <p className="text-sm text-muted-foreground">
              Automated user onboarding assistance
            </p>
          </div>
          <Switch
            checked={features.onboarding}
            onCheckedChange={(checked) =>
              setFeatures(prev => ({ ...prev, onboarding: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Content Moderation</Label>
            <p className="text-sm text-muted-foreground">
              AI-powered content moderation
            </p>
          </div>
          <Switch
            checked={features.moderation}
            onCheckedChange={(checked) =>
              setFeatures(prev => ({ ...prev, moderation: checked }))
            }
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Feature Settings
        </Button>
      </div>
    </Card>
  );
}