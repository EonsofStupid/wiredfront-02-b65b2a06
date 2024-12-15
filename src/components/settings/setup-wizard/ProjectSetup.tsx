import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FrontendConfigSection } from "./config/FrontendConfig";
import { BackendConfigSection } from "./config/BackendConfig";
import { DeploymentConfigSection } from "./config/DeploymentConfig";
import type { ProjectConfig, IFrontendConfig, IBackendConfig, IDeploymentConfig } from "@/types/wizard";

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

  const handleFrontendConfigChange = (key: keyof IFrontendConfig, value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      frontend: {
        ...prev.frontend,
        [key]: value,
      },
    }));
  };

  const handleBackendConfigChange = (key: keyof IBackendConfig, value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      backend: {
        ...prev.backend,
        [key]: value,
      },
    }));
  };

  const handleDeploymentConfigChange = (key: keyof IDeploymentConfig, value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      deployment: {
        ...prev.deployment,
        [key]: value,
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
          environment_config: JSON.parse(JSON.stringify(config)),
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

      <div className="space-y-6">
        <FrontendConfigSection 
          config={config.frontend}
          onConfigChange={handleFrontendConfigChange}
        />
        
        <BackendConfigSection
          config={config.backend}
          onConfigChange={handleBackendConfigChange}
        />
        
        <DeploymentConfigSection
          config={config.deployment}
          onConfigChange={handleDeploymentConfigChange}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveConfig}>Save Configuration</Button>
      </div>
    </div>
  );
};