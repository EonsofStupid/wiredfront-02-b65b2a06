import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  icon: any;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="relative">
      <div className="absolute top-5 left-6 w-[calc(100%-3rem)] h-0.5 bg-muted" />
      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center space-y-2"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </div>
              <div className="text-sm font-medium">{step.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};