import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AIOptionsProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export const AIOptions = ({ enabled = true, onToggle }: AIOptionsProps) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="ai-enabled">AI Assistant</Label>
        <Switch
          id="ai-enabled"
          checked={enabled}
          onCheckedChange={onToggle}
        />
      </div>
    </div>
  );
};