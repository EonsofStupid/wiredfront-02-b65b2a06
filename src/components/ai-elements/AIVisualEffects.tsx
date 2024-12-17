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
import type { Theme } from "@/types/theme";

export const AIVisualEffects = () => {
  const { theme, updateTheme } = useTheme();
  const { toast } = useToast();
  
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

  const handleColorChange = (effect: keyof Theme['effects'], color: string) => {
    updateTheme({
      effects: {
        ...theme.effects,
        [effect]: {
          ...theme.effects[effect],
          color
        }
      }
    });
  };

  const getPreviewStyle = () => {
    const style: any = {
      transition: 'all 0.3s ease',
    };

    if (theme.effects.neon.enabled) {
      style.textShadow = `0 0 ${theme.effects.neon.intensity * 10}px ${theme.effects.neon.color}`;
    }

    if (theme.effects.gradient.enabled) {
      style.background = `linear-gradient(${theme.effects.gradient.angle}deg, ${theme.effects.gradient.colors.join(', ')})`;
      style.WebkitBackgroundClip = 'text';
      style.WebkitTextFillColor = 'transparent';
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
          AI Assistant Preview
        </motion.div>
      </div>

      {/* Effect Controls */}
      <div className="space-y-6">
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
      </div>
    </Card>
  );
};