import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface VisualEffects {
  effects: {
    neon: {
      enabled: boolean;
      intensity: number;
      color: string;
    };
    twilight: {
      enabled: boolean;
      intensity: number;
      color: string;
    };
  };
  theme: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textGlow: boolean;
    animationSpeed: string;
  };
  preview: {
    enabled: boolean;
    sampleText: string;
  };
}

export const AIVisualEffects = () => {
  const { toast } = useToast();
  const [effects, setEffects] = useState<VisualEffects>({
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
  });

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
        setEffects(data.visual_effects);
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

  const getPreviewStyle = () => {
    const style: any = {
      fontFamily: effects.theme.fontFamily === 'default' ? 'inherit' : effects.theme.fontFamily,
      color: effects.theme.primaryColor,
      transition: 'all 0.3s ease',
    };

    if (effects.effects.neon.enabled) {
      style.textShadow = `0 0 ${effects.effects.neon.intensity * 10}px ${effects.effects.neon.color}`;
    }

    if (effects.effects.twilight.enabled) {
      style.background = `linear-gradient(45deg, ${effects.theme.primaryColor}, ${effects.theme.secondaryColor})`;
      style.WebkitBackgroundClip = 'text';
      style.WebkitTextFillColor = 'transparent';
      style.filter = `brightness(${1 + effects.effects.twilight.intensity})`;
    }

    return style;
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Visual Effects</h3>
        <p className="text-sm text-muted-foreground">
          Customize how your AI assistant looks and feels
        </p>
      </div>

      {/* Preview Section */}
      <div className="relative p-8 rounded-lg bg-gradient-to-br from-dark to-dark-lighter">
        <motion.div
          className="text-2xl font-bold text-center"
          style={getPreviewStyle()}
          animate={{
            scale: [1, 1.02, 1],
            transition: { duration: 2, repeat: Infinity }
          }}
        >
          {effects.preview.sampleText}
        </motion.div>
      </div>

      {/* Neon Effect Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Neon Effect</Label>
          <Switch
            checked={effects.effects.neon.enabled}
            onCheckedChange={(checked) =>
              setEffects(prev => ({
                ...prev,
                effects: {
                  ...prev.effects,
                  neon: { ...prev.effects.neon, enabled: checked }
                }
              }))
            }
          />
        </div>
        {effects.effects.neon.enabled && (
          <div className="space-y-2">
            <Label>Neon Intensity</Label>
            <Slider
              value={[effects.effects.neon.intensity * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) =>
                setEffects(prev => ({
                  ...prev,
                  effects: {
                    ...prev.effects,
                    neon: { ...prev.effects.neon, intensity: value / 100 }
                  }
                }))
              }
            />
            <Input
              type="color"
              value={effects.effects.neon.color}
              onChange={(e) =>
                setEffects(prev => ({
                  ...prev,
                  effects: {
                    ...prev.effects,
                    neon: { ...prev.effects.neon, color: e.target.value }
                  }
                }))
              }
            />
          </div>
        )}
      </div>

      {/* Twilight Effect Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Twilight Effect</Label>
          <Switch
            checked={effects.effects.twilight.enabled}
            onCheckedChange={(checked) =>
              setEffects(prev => ({
                ...prev,
                effects: {
                  ...prev.effects,
                  twilight: { ...prev.effects.twilight, enabled: checked }
                }
              }))
            }
          />
        </div>
        {effects.effects.twilight.enabled && (
          <div className="space-y-2">
            <Label>Twilight Intensity</Label>
            <Slider
              value={[effects.effects.twilight.intensity * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) =>
                setEffects(prev => ({
                  ...prev,
                  effects: {
                    ...prev.effects,
                    twilight: { ...prev.effects.twilight, intensity: value / 100 }
                  }
                }))
              }
            />
          </div>
        )}
      </div>

      {/* Theme Controls */}
      <div className="space-y-4">
        <h4 className="font-medium">Theme Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Primary Color</Label>
            <Input
              type="color"
              value={effects.theme.primaryColor}
              onChange={(e) =>
                setEffects(prev => ({
                  ...prev,
                  theme: { ...prev.theme, primaryColor: e.target.value }
                }))
              }
            />
          </div>
          <div>
            <Label>Secondary Color</Label>
            <Input
              type="color"
              value={effects.theme.secondaryColor}
              onChange={(e) =>
                setEffects(prev => ({
                  ...prev,
                  theme: { ...prev.theme, secondaryColor: e.target.value }
                }))
              }
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