import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface BotCustomizationProps {
  onBack: () => void;
}

export const BotCustomization = ({ onBack }: BotCustomizationProps) => {
  const [config, setConfig] = useState({
    name: "AI Assistant",
    description: "A helpful AI assistant for development",
    enableLogging: true,
    enableAutoComplete: true,
    personality: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key: keyof typeof config) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Bot Customization</h3>
        <p className="text-muted-foreground">
          Customize your AI assistant's behavior and personality
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bot Name</Label>
            <Input
              id="name"
              name="name"
              value={config.name}
              onChange={handleInputChange}
              placeholder="Enter bot name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={config.description}
              onChange={handleInputChange}
              placeholder="Enter bot description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personality">Personality</Label>
            <Textarea
              id="personality"
              name="personality"
              value={config.personality}
              onChange={handleInputChange}
              placeholder="Define the bot's personality and tone..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Logging</Label>
              <p className="text-sm text-muted-foreground">
                Log bot activities and interactions
              </p>
            </div>
            <Switch
              checked={config.enableLogging}
              onCheckedChange={() => handleToggle("enableLogging")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Complete</Label>
              <p className="text-sm text-muted-foreground">
                Enable code and command auto-completion
              </p>
            </div>
            <Switch
              checked={config.enableAutoComplete}
              onCheckedChange={() => handleToggle("enableAutoComplete")}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button>Complete Setup</Button>
      </div>
    </div>
  );
};