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
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: `Step ${currentStep + 2}: ${steps[currentStep + 1].title}`,
        description: "Configuration saved successfully",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Setup Wizard</h2>
          <p className="text-muted-foreground">
            Configure your development environment and AI assistant
          </p>
        </div>

        <StepIndicator steps={steps} currentStep={currentStep} />

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mt-8"
        >
          {currentStep === 0 && <EnvironmentConfig onNext={handleNext} />}
          {currentStep === 1 && <AISetup onNext={handleNext} onBack={handleBack} />}
          {currentStep === 2 && <BotCustomization onBack={handleBack} />}
        </motion.div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
};