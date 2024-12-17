import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import type { Theme } from "@/types/theme";

export const AIVisualEffects = () => {
  const { theme, updateTheme } = useTheme();
  const { toast } = useToast();
  const [visualPreferences, setVisualPreferences] = useState({
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
        setVisualPreferences(data.visual_effects);
      }
    } catch (error) {
      console.error('Error loading visual preferences:', error);
    }
  };

  const saveVisualPreferences = async (updates: any) => {
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
    const newPreferences = {
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
    const newPreferences = {
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
    const newPreferences = {
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

      {/* Overall Effects Intensity */}
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

      {/* Bar Customization */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold">Bar Customization</h4>
        
        {/* Top Bar */}
        <div className="space-y-2">
          <Label>Top Bar</Label>
          <div className="flex gap-4">
            <Input
              type="color"
              value={visualPreferences.effects.bars.top.color}
              onChange={(e) => handleBarColorChange('top', e.target.value)}
            />
            <Slider
              value={[visualPreferences.effects.bars.top.opacity * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => handleBarOpacityChange('top', value)}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="space-y-2">
          <Label>Bottom Bar</Label>
          <div className="flex gap-4">
            <Input
              type="color"
              value={visualPreferences.effects.bars.bottom.color}
              onChange={(e) => handleBarColorChange('bottom', e.target.value)}
            />
            <Slider
              value={[visualPreferences.effects.bars.bottom.opacity * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => handleBarOpacityChange('bottom', value)}
            />
          </div>
        </div>

        {/* Side Bars */}
        <div className="space-y-2">
          <Label>Side Bars</Label>
          <div className="flex gap-4">
            <Input
              type="color"
              value={visualPreferences.effects.bars.side.color}
              onChange={(e) => handleBarColorChange('side', e.target.value)}
            />
            <Slider
              value={[visualPreferences.effects.bars.side.opacity * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => handleBarOpacityChange('side', value)}
            />
          </div>
        </div>
      </div>

      {/* Neon Effect */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Neon Effect</Label>
          <Switch
            checked={theme.effects.neon.enabled}
            onCheckedChange={(checked) => handleEffectToggle('neon', checked)}
          />
        </div>
        {theme.effects.neon.enabled && (
          <div className="space-y-2">
            <Label>Intensity</Label>
            <Slider
              value={[theme.effects.neon.intensity * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => handleIntensityChange('neon', value)}
            />
            <Input
              type="color"
              value={theme.effects.neon.color}
              onChange={(e) => handleColorChange('neon', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Gradient Effect */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Gradient Effect</Label>
          <Switch
            checked={theme.effects.gradient.enabled}
            onCheckedChange={(checked) => handleEffectToggle('gradient', checked)}
          />
        </div>
        {theme.effects.gradient.enabled && (
          <div className="space-y-2">
            <Label>Angle</Label>
            <Slider
              value={[theme.effects.gradient.angle]}
              min={0}
              max={360}
              step={1}
              onValueChange={([value]) => 
                updateTheme({
                  effects: {
                    ...theme.effects,
                    gradient: {
                      ...theme.effects.gradient,
                      angle: value
                    }
                  }
                })
              }
            />
          </div>
        )}
      </div>
    </Card>
  );
};
