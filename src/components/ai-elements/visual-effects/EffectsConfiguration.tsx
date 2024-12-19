import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BarCustomization } from "./BarCustomization";
import { EffectToggle } from "./EffectToggle";
import { VisualPreferences, ThemeEffects } from "./types";
import { useTheme } from "@/contexts/ThemeContext";

interface EffectsConfigurationProps {
  visualPreferences: VisualPreferences;
  onOverallIntensityChange: (intensity: number) => void;
  onBarColorChange: (barType: 'top' | 'bottom' | 'side', color: string) => void;
  onBarOpacityChange: (barType: 'top' | 'bottom' | 'side', opacity: number) => void;
}

export const EffectsConfiguration = ({
  visualPreferences,
  onOverallIntensityChange,
  onBarColorChange,
  onBarOpacityChange
}: EffectsConfigurationProps) => {
  const { theme, updateTheme } = useTheme();

  const handleEffectToggle = (effect: keyof ThemeEffects, enabled: boolean) => {
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

  const handleIntensityChange = (effect: keyof ThemeEffects, intensity: number) => {
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
          onValueChange={([value]) => onOverallIntensityChange(value)}
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
            onColorChange={onBarColorChange}
            onOpacityChange={onBarOpacityChange}
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