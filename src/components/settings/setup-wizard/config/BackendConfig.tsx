import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { BackendConfig } from "@/types/wizard";

interface BackendConfigProps {
  config: BackendConfig;
  onConfigChange: (key: keyof BackendConfig, value: boolean) => void;
}

export const BackendConfig = ({ config, onConfigChange }: BackendConfigProps) => {
  return (
    <Card className="p-6 space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Backend Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Supabase</Label>
              <p className="text-sm text-muted-foreground">
                Use Supabase for backend services
              </p>
            </div>
            <Switch
              checked={config.supabase}
              onCheckedChange={(checked) => onConfigChange("supabase", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Redis Cache</Label>
              <p className="text-sm text-muted-foreground">
                Add Redis for caching
              </p>
            </div>
            <Switch
              checked={config.redis}
              onCheckedChange={(checked) => onConfigChange("redis", checked)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};