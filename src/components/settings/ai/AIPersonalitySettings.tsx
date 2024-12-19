import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AIPersonalitySettings() {
  const { toast } = useToast();
  const [personality, setPersonality] = useState({
    tone: "friendly",
    verbosity: 0.7,
    formality: 0.5
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('ai_settings')
        .update({
          metadata: {
            personality: personality
          }
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Personality settings saved",
        description: "Your AI assistant's personality has been updated."
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to save personality settings.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">AI Personality</h3>
        <p className="text-sm text-muted-foreground">
          Customize how your AI assistant communicates and behaves
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Verbosity ({personality.verbosity})</Label>
          <Slider
            value={[personality.verbosity]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) =>
              setPersonality(prev => ({ ...prev, verbosity: value }))
            }
          />
          <p className="text-sm text-muted-foreground">
            Controls how detailed the AI's responses are
          </p>
        </div>

        <div className="space-y-2">
          <Label>Formality ({personality.formality})</Label>
          <Slider
            value={[personality.formality]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={([value]) =>
              setPersonality(prev => ({ ...prev, formality: value }))
            }
          />
          <p className="text-sm text-muted-foreground">
            Adjusts the formal vs casual tone of responses
          </p>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Personality Settings
        </Button>
      </div>
    </Card>
  );
}