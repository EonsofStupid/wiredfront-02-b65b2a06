import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ThemeEffects } from "./types";

interface EffectToggleProps {
  label: string;
  effect: keyof ThemeEffects;
  enabled: boolean;
  intensity: number;
  color?: string;
  onToggle: (effect: keyof ThemeEffects, enabled: boolean) => void;
  onIntensityChange: (effect: keyof ThemeEffects, intensity: number) => void;
  onColorChange?: (effect: keyof ThemeEffects, color: string) => void;
}

export const EffectToggle = ({
  label,
  effect,
  enabled,
  intensity,
  color,
  onToggle,
  onIntensityChange,
  onColorChange
}: EffectToggleProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Switch
          checked={enabled}
          onCheckedChange={(checked) => onToggle(effect, checked)}
        />
      </div>
      {enabled && (
        <div className="space-y-2">
          <Label>Intensity</Label>
          <Slider
            value={[intensity * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={([value]) => onIntensityChange(effect, value)}
          />
          {color && onColorChange && (
            <Input
              type="color"
              value={color}
              onChange={(e) => onColorChange(effect, e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
};