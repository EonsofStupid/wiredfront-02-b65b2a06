import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAIStore } from "@/stores/ai";
import { Bot, Code, FileText } from "lucide-react";

export const AIOptionsTab = () => {
  const isEnabled = useAIStore((state) => state.isEnabled);
  const setEnabled = useAIStore((state) => state.setEnabled);
  const currentProvider = useAIStore((state) => state.currentProvider);
  const setProvider = useAIStore((state) => state.setProvider);

  return (
    <div className="space-y-4 p-4">
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>AI Assistant</Label>
            <p className="text-sm text-muted-foreground">
              Enable or disable AI assistance
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center p-3 rounded-lg border border-border hover:bg-accent cursor-pointer">
            <Bot className="h-6 w-6 mb-2 text-primary" />
            <span className="text-sm">Chat</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg border border-border hover:bg-accent cursor-pointer">
            <Code className="h-6 w-6 mb-2 text-primary" />
            <span className="text-sm">Code</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg border border-border hover:bg-accent cursor-pointer">
            <FileText className="h-6 w-6 mb-2 text-primary" />
            <span className="text-sm">Files</span>
          </div>
        </div>
      </Card>
    </div>
  );
};