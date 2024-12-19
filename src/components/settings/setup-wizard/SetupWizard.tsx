import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Bot, Cpu } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EnvironmentConfig } from "./EnvironmentConfig";
import { AISetup } from "./AISetup";
import { BotCustomization } from "./BotCustomization";
import { StepIndicator } from "./StepIndicator";
import { useSetupWizard } from "@/hooks/use-setup-wizard";

const steps = [
  {
    id: "environment",
    title: "Environment Setup",
    icon: Settings,
    description: "Configure your development environment",
  },
  {
    id: "ai",
    title: "AI Configuration",
    icon: Cpu,
    description: "Set up AI providers and models",
  },
  {
    id: "bot",
    title: "Bot Customization",
    icon: Bot,
    description: "Customize your AI assistant",
  },
];

export const SetupWizard = () => {
  const { config, isLoading, updateStep, completeSetup } = useSetupWizard();
  const { toast } = useToast();

  const handleNext = async () => {
    if (!config) return;
    
    if (config.current_step < steps.length - 1) {
      await updateStep(config.current_step + 1);
      toast({
        title: `Step ${config.current_step + 2}: ${steps[config.current_step + 1].title}`,
        description: "Configuration saved successfully",
      });
    } else {
      await completeSetup();
      toast({
        title: "Setup Complete",
        description: "Your development environment has been configured successfully.",
      });
    }
  };

  const handleBack = async () => {
    if (!config) return;
    
    if (config.current_step > 0) {
      await updateStep(config.current_step - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Setup Wizard</h2>
          <p className="text-muted-foreground">
            Configure your development environment and AI assistant
          </p>
        </div>

        <StepIndicator steps={steps} currentStep={config?.current_step || 0} />

        <motion.div
          key={config?.current_step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mt-8"
        >
          {config?.current_step === 0 && <EnvironmentConfig onNext={handleNext} />}
          {config?.current_step === 1 && <AISetup onNext={handleNext} onBack={handleBack} />}
          {config?.current_step === 2 && <BotCustomization onBack={handleBack} />}
        </motion.div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={!config || config.current_step === 0}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!config || config.current_step === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
};