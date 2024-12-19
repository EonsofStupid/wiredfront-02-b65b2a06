import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface EnvironmentConfigProps {
  onNext: () => void;
}

export const EnvironmentConfig = ({ onNext }: EnvironmentConfigProps) => {
  const [config, setConfig] = useState({
    typescript: true,
    tailwind: true,
    shadcn: true,
    supabase: true,
  });

  const handleToggle = (key: keyof typeof config) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Environment Configuration</h3>
        <p className="text-muted-foreground">
          Configure your development environment settings
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>TypeScript</Label>
            <p className="text-sm text-muted-foreground">
              Enable TypeScript support
            </p>
          </div>
          <Switch
            checked={config.typescript}
            onCheckedChange={() => handleToggle("typescript")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Tailwind CSS</Label>
            <p className="text-sm text-muted-foreground">
              Use Tailwind for styling
            </p>
          </div>
          <Switch
            checked={config.tailwind}
            onCheckedChange={() => handleToggle("tailwind")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>shadcn/ui</Label>
            <p className="text-sm text-muted-foreground">
              Include shadcn/ui components
            </p>
          </div>
          <Switch
            checked={config.shadcn}
            onCheckedChange={() => handleToggle("shadcn")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Supabase</Label>
            <p className="text-sm text-muted-foreground">
              Enable Supabase backend
            </p>
          </div>
          <Switch
            checked={config.supabase}
            onCheckedChange={() => handleToggle("supabase")}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext}>Save and Continue</Button>
      </div>
    </div>
  );
};