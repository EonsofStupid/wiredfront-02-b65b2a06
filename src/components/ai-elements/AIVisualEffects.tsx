import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { BarCustomization } from "./visual-effects/BarCustomization";
import { EffectToggle } from "./visual-effects/EffectToggle";
import type { VisualPreferences } from "./visual-effects/types";
import type { Theme } from "@/types/theme";

export const AIVisualEffects = () => {
  const { theme, updateTheme } = useTheme();
  const { toast } = useToast();
  const [visualPreferences, setVisualPreferences] = useState<VisualPreferences>({
    effects: {
      intensity: 0.7,
      bars: {
        top: { color: "#1A1A1A", opacity: 0.9 },
        bottom: { color: "#1A1A1A", opacity: 0.9 },
        side: { color: "#1A1A1A", opacity: 0.9 }
      }
    }
  });

  useEffect(() => {
    loadVisualPreferences();
  }, []);

  const loadVisualPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('user_visual_preferences')
        .select('visual_effects')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      if (data?.visual_effects) {
        setVisualPreferences(data.visual_effects as VisualPreferences);
      }
    } catch (error) {
      console.error('Error loading visual preferences:', error);
    }
  };

  const saveVisualPreferences = async (updates: VisualPreferences) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('user_visual_preferences')
        .upsert({
          user_id: session.user.id,
          visual_effects: updates
        });

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your visual preferences have been updated."
      });
    } catch (error) {
      console.error('Error saving visual preferences:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save preferences."
      });
    }
  };

  const handleEffectToggle = (effect: keyof Theme['effects'], enabled: boolean) => {
    updateTheme({
      effects: {
        ...theme.effects,
        [effect]: {
          ...theme.effects[effect],
          enabled
        }
      }
    });
  };

  const handleIntensityChange = (effect: keyof Theme['effects'], intensity: number) => {
    updateTheme({
      effects: {
        ...theme.effects,
        [effect]: {
          ...theme.effects[effect],
          intensity: intensity / 100
        }
      }
    });
  };

  const handleBarColorChange = (barType: 'top' | 'bottom' | 'side', color: string) => {
    const newPreferences: VisualPreferences = {
      ...visualPreferences,
      effects: {
        ...visualPreferences.effects,
        bars: {
          ...visualPreferences.effects.bars,
          [barType]: {
            ...visualPreferences.effects.bars[barType],
            color
          }
        }
      }
    };
    setVisualPreferences(newPreferences);
    saveVisualPreferences(newPreferences);
  };

  const handleBarOpacityChange = (barType: 'top' | 'bottom' | 'side', opacity: number) => {
    const newPreferences: VisualPreferences = {
      ...visualPreferences,
      effects: {
        ...visualPreferences.effects,
        bars: {
          ...visualPreferences.effects.bars,
          [barType]: {
            ...visualPreferences.effects.bars[barType],
            opacity: opacity / 100
          }
        }
      }
    };
    setVisualPreferences(newPreferences);
    saveVisualPreferences(newPreferences);
  };

  const handleOverallIntensityChange = (intensity: number) => {
    const newPreferences: VisualPreferences = {
      ...visualPreferences,
      effects: {
        ...visualPreferences.effects,
        intensity: intensity / 100
      }
    };
    setVisualPreferences(newPreferences);
    saveVisualPreferences(newPreferences);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Visual Effects</h3>
        <p className="text-sm text-muted-foreground">
          Customize how your AI assistant looks and feels
        </p>
      </div>

      <div className="space-y-4">
        <Label>Overall Effects Intensity</Label>
        <Slider
          value={[visualPreferences.effects.intensity * 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={([value]) => handleOverallIntensityChange(value)}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-semibold">Bar Customization</h4>
        {(['top', 'bottom', 'side'] as const).map((barType) => (
          <BarCustomization
            key={barType}
            barType={barType}
            color={visualPreferences.effects.bars[barType].color}
            opacity={visualPreferences.effects.bars[barType].opacity}
            onColorChange={handleBarColorChange}
            onOpacityChange={handleBarOpacityChange}
          />
        ))}
      </div>

      <EffectToggle
        label="Neon Effect"
        effect="neon"
        enabled={theme.effects.neon.enabled}
        intensity={theme.effects.neon.intensity}
        color={theme.effects.neon.color}
        onToggle={handleEffectToggle}
        onIntensityChange={handleIntensityChange}
      />

      <EffectToggle
        label="Gradient Effect"
        effect="gradient"
        enabled={theme.effects.gradient.enabled}
        intensity={theme.effects.gradient.intensity}
        onToggle={handleEffectToggle}
        onIntensityChange={handleIntensityChange}
      />
    </Card>
  );
};