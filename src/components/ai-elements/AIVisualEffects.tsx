import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EffectPreview } from "./visual-effects/EffectPreview";
import { EffectControls } from "./visual-effects/EffectControls";
import { VisualEffects } from "@/types/visual-effects";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const defaultEffects: VisualEffects = {
  effects: {
    neon: {
      enabled: true,
      intensity: 0.7,
      color: "#00FFFF"
    },
    twilight: {
      enabled: false,
      intensity: 0.5,
      color: "#FF007F"
    }
  },
  theme: {
    fontFamily: "default",
    primaryColor: "#00FFFF",
    secondaryColor: "#FF007F",
    backgroundColor: "#1A1A1A",
    textGlow: true,
    animationSpeed: "normal"
  },
  preview: {
    enabled: true,
    sampleText: "AI Assistant Preview"
  }
};

export const AIVisualEffects = () => {
  const { toast } = useToast();
  const [effects, setEffects] = useState<VisualEffects>(defaultEffects);

  useEffect(() => {
    fetchEffects();
  }, []);

  const fetchEffects = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('ai_settings')
        .select('visual_effects')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      if (data?.visual_effects) {
        setEffects(data.visual_effects as VisualEffects);
      }
    } catch (error) {
      console.error('Error fetching visual effects:', error);
    }
  };

  const saveEffects = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('ai_settings')
        .update({ visual_effects: effects })
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Visual effects saved",
        description: "Your AI assistant's appearance has been updated."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving effects",
        description: error.message
      });
    }
  };

  const updateTheme = (changes: Partial<typeof effects.theme>) => {
    setEffects(prev => ({
      ...prev,
      theme: { ...prev.theme, ...changes }
    }));
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Visual Effects</h3>
        <p className="text-sm text-muted-foreground">
          Customize how your AI assistant looks and feels
        </p>
      </div>

      <EffectPreview effects={effects} />
      <EffectControls effects={effects} onEffectsChange={setEffects} />

      <div className="space-y-4">
        <h4 className="font-medium">Theme Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Primary Color</Label>
            <Input
              type="color"
              value={effects.theme.primaryColor}
              onChange={(e) => updateTheme({ primaryColor: e.target.value })}
            />
          </div>
          <div>
            <Label>Secondary Color</Label>
            <Input
              type="color"
              value={effects.theme.secondaryColor}
              onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Button onClick={saveEffects} className="w-full">
        Save Visual Effects
      </Button>
    </Card>
  );
};