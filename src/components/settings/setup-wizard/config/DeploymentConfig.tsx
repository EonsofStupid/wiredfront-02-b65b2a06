import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { IDeploymentConfig } from "@/types/wizard";

interface DeploymentConfigSectionProps {
  config: IDeploymentConfig;
  onConfigChange: (key: keyof IDeploymentConfig, value: boolean) => void;
}

export const DeploymentConfigSection = ({ config, onConfigChange }: DeploymentConfigSectionProps) => {
  return (
    <Card className="p-6 space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Deployment Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Docker Support</Label>
              <p className="text-sm text-muted-foreground">
                Generate Docker configuration
              </p>
            </div>
            <Switch
              checked={config.docker}
              onCheckedChange={(checked) => onConfigChange("docker", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Local Supabase</Label>
              <p className="text-sm text-muted-foreground">
                Configure local Supabase instance
              </p>
            </div>
            <Switch
              checked={config.localSupabase}
              onCheckedChange={(checked) => onConfigChange("localSupabase", checked)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};