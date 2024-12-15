import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { WizardConfig, WizardConfigResponse, SetupStatus } from "@/types/wizard";

export const useSetupWizard = () => {
  const [config, setConfig] = useState<WizardConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const transformResponse = (data: WizardConfigResponse): WizardConfig => {
    return {
      current_step: data.current_step,
      setup_status: data.setup_status,
      environment_config: typeof data.environment_config === 'object' ? data.environment_config as any : {},
      ai_config: typeof data.ai_config === 'object' ? data.ai_config as any : {},
      bot_config: typeof data.bot_config === 'object' ? data.bot_config as any : {},
    };
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('setup_wizard_config')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setConfig(transformResponse(data as WizardConfigResponse));
      } else {
        // Initialize with default values if no config exists
        const defaultConfig: WizardConfig = {
          current_step: 0,
          setup_status: 'not_started',
          environment_config: {},
          ai_config: {},
          bot_config: {}
        };
        await saveConfig(defaultConfig);
        setConfig(defaultConfig);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching setup configuration",
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig: Partial<WizardConfig>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('setup_wizard_config')
        .upsert({
          user_id: session.user.id,
          ...config,
          ...newConfig,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setConfig(prev => prev ? { ...prev, ...newConfig } : newConfig as WizardConfig);
      
      toast({
        title: "Configuration saved",
        description: "Your setup preferences have been updated."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving configuration",
        description: error.message
      });
    }
  };

  const updateStep = async (step: number) => {
    await saveConfig({
      current_step: step,
      setup_status: 'in_progress'
    });
  };

  const completeSetup = async () => {
    await saveConfig({
      setup_status: 'completed'
    });
  };

  return {
    config,
    isLoading,
    saveConfig,
    updateStep,
    completeSetup
  };
};