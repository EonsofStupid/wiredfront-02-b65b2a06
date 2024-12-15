import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BotAISettingsProps {
  aiConfig: any;
  onUpdateAIConfig: (updates: any) => void;
}

export const BotAISettings = ({
  aiConfig,
  onUpdateAIConfig,
}: BotAISettingsProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium mb-1 block">AI Provider</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Select
                  value={aiConfig?.provider || "gemini"}
                  onValueChange={(value) => onUpdateAIConfig({ provider: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                    <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose which AI model powers your bot's responses</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium mb-1 block">Response Style</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Select
                  value={aiConfig?.style || "helpful"}
                  onValueChange={(value) => onUpdateAIConfig({ style: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select response style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helpful">Helpful</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                <p>Define how your bot should communicate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium mb-1 block">
            Max Response Length
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  type="number"
                  value={aiConfig?.maxLength || 2000}
                  onChange={(e) =>
                    onUpdateAIConfig({ maxLength: parseInt(e.target.value) })
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Maximum number of characters in bot responses</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};