import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface AISetupProps {
  onNext: () => void;
  onBack: () => void;
}

export const AISetup = ({ onNext, onBack }: AISetupProps) => {
  const [config, setConfig] = useState({
    provider: "gemini",
    model: "gemini-pro",
    temperature: 0.7,
    maxTokens: 1000,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI Configuration</h3>
        <p className="text-muted-foreground">
          Set up your AI providers and model preferences
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>AI Provider</Label>
            <Select
              value={config.provider}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, provider: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="chatgpt">OpenAI GPT-4</SelectItem>
                <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                <SelectItem value="huggingface">Hugging Face</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Select
              value={config.model}
              onValueChange={(value) =>
                setConfig((prev) => ({ ...prev, model: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4 Mini</SelectItem>
                <SelectItem value="claude-3">Claude 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Temperature ({config.temperature})</Label>
            <Slider
              value={[config.temperature]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([value]) =>
                setConfig((prev) => ({ ...prev, temperature: value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Max Tokens ({config.maxTokens})</Label>
            <Slider
              value={[config.maxTokens]}
              min={100}
              max={2000}
              step={100}
              onValueChange={([value]) =>
                setConfig((prev) => ({ ...prev, maxTokens: value }))
              }
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Save and Continue</Button>
      </div>
    </div>
  );
};