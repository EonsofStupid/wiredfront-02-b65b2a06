import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { VisualEffects } from "@/types/visual-effects";

interface EffectControlsProps {
  effects: VisualEffects;
  onEffectsChange: (effects: VisualEffects) => void;
}

export const EffectControls = ({ effects, onEffectsChange }: EffectControlsProps) => {
  const updateNeonEffect = (changes: Partial<typeof effects.effects.neon>) => {
    onEffectsChange({
      ...effects,
      effects: {
        ...effects.effects,
        neon: { ...effects.effects.neon, ...changes }
      }
    });
  };

  const updateTwilightEffect = (changes: Partial<typeof effects.effects.twilight>) => {
    onEffectsChange({
      ...effects,
      effects: {
        ...effects.effects,
        twilight: { ...effects.effects.twilight, ...changes }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Neon Effect</Label>
          <Switch
            checked={effects.effects.neon.enabled}
            onCheckedChange={(checked) => updateNeonEffect({ enabled: checked })}
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
              onValueChange={([value]) => updateNeonEffect({ intensity: value / 100 })}
            />
            <Input
              type="color"
              value={effects.effects.neon.color}
              onChange={(e) => updateNeonEffect({ color: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Twilight Effect</Label>
          <Switch
            checked={effects.effects.twilight.enabled}
            onCheckedChange={(checked) => updateTwilightEffect({ enabled: checked })}
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
              onValueChange={([value]) => updateTwilightEffect({ intensity: value / 100 })}
            />
          </div>
        )}
      </div>
    </div>
  );
};