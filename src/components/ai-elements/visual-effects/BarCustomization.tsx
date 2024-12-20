import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface BarCustomizationProps {
  barType: 'top' | 'bottom' | 'side';
  color: string;
  opacity: number;
  onColorChange: (barType: 'top' | 'bottom' | 'side', color: string) => void;
  onOpacityChange: (barType: 'top' | 'bottom' | 'side', opacity: number) => void;
}

export const BarCustomization = ({
  barType,
  color,
  opacity,
  onColorChange,
  onOpacityChange
}: BarCustomizationProps) => {
  const label = `${barType.charAt(0).toUpperCase() + barType.slice(1)} Bar`;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-4">
        <Input
          type="color"
          value={color}
          onChange={(e) => onColorChange(barType, e.target.value)}
        />
        <Slider
          value={[opacity * 100]}
          min={0}
          max={100}
          step={1}
          onValueChange={([value]) => onOpacityChange(barType, value)}
        />
      </div>
    </div>
  );
};