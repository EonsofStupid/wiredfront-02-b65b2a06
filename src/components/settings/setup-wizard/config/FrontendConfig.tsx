import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { IFrontendConfig } from "@/types/wizard";

interface FrontendConfigSectionProps {
  config: IFrontendConfig;
  onConfigChange: (key: keyof IFrontendConfig, value: boolean) => void;
}

export const FrontendConfigSection = ({ config, onConfigChange }: FrontendConfigSectionProps) => {
  return (
    <Card className="p-6 space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Frontend Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>TypeScript</Label>
              <p className="text-sm text-muted-foreground">
                Use TypeScript for type safety
              </p>
            </div>
            <Switch
              checked={config.typescript}
              onCheckedChange={(checked) => onConfigChange("typescript", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tailwind CSS</Label>
              <p className="text-sm text-muted-foreground">
                Include Tailwind for styling
              </p>
            </div>
            <Switch
              checked={config.tailwind}
              onCheckedChange={(checked) => onConfigChange("tailwind", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>shadcn/ui</Label>
              <p className="text-sm text-muted-foreground">
                Add shadcn/ui components
              </p>
            </div>
            <Switch
              checked={config.shadcn}
              onCheckedChange={(checked) => onConfigChange("shadcn", checked)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};