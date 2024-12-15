import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectConfig {
  frontend: {
    typescript: boolean;
    tailwind: boolean;
    shadcn: boolean;
  };
  backend: {
    supabase: boolean;
    redis: boolean;
  };
  deployment: {
    docker: boolean;
    localSupabase: boolean;
  };
}

export const ProjectSetup = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<ProjectConfig>({
    frontend: {
      typescript: true,
      tailwind: true,
      shadcn: true,
    },
    backend: {
      supabase: true,
      redis: false,
    },
    deployment: {
      docker: false,
      localSupabase: false,
    },
  });

  const handleToggle = (section: keyof ProjectConfig, key: string) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key as keyof typeof prev[typeof section]],
      },
    }));
  };

  const handleSaveConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save project configuration",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('setup_wizard_config')
        .upsert({
          user_id: session.user.id,
          environment_config: config,
          setup_status: 'in_progress',
        });

      if (error) throw error;

      toast({
        title: "Configuration saved",
        description: "Your project setup preferences have been saved",
      });
    } catch (error: any) {
      toast({
        title: "Error saving configuration",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Project Setup</h2>
        <p className="text-muted-foreground">
          Configure your project's technical stack and deployment options
        </p>
      </div>

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
                checked={config.frontend.typescript}
                onCheckedChange={() => handleToggle("frontend", "typescript")}
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
                checked={config.frontend.tailwind}
                onCheckedChange={() => handleToggle("frontend", "tailwind")}
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
                checked={config.frontend.shadcn}
                onCheckedChange={() => handleToggle("frontend", "shadcn")}
              />
            </div>
          </div>
        </div>

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
                checked={config.backend.supabase}
                onCheckedChange={() => handleToggle("backend", "supabase")}
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
                checked={config.backend.redis}
                onCheckedChange={() => handleToggle("backend", "redis")}
              />
            </div>
          </div>
        </div>

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
                checked={config.deployment.docker}
                onCheckedChange={() => handleToggle("deployment", "docker")}
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
                checked={config.deployment.localSupabase}
                onCheckedChange={() => handleToggle("deployment", "localSupabase")}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveConfig}>Save Configuration</Button>
      </div>
    </div>
  );
};