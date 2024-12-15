import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Command {
  id: string;
  name: string;
  description: string;
  type: string;
  response: string;
}

interface BotCommandBuilderProps {
  commands: Command[];
  onSaveCommand: (command: Command) => void;
  onDeleteCommand: (commandId: string) => void;
}

export const BotCommandBuilder = ({
  commands = [],
  onSaveCommand,
  onDeleteCommand,
}: BotCommandBuilderProps) => {
  const [newCommand, setNewCommand] = useState<Partial<Command>>({
    type: "text",
  });

  const handleSave = () => {
    if (newCommand.name && newCommand.description && newCommand.response) {
      onSaveCommand({
        id: crypto.randomUUID(),
        name: newCommand.name,
        description: newCommand.description,
        type: newCommand.type || "text",
        response: newCommand.response,
      });
      setNewCommand({ type: "text" });
    }
  };

  return (
    <Card className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Custom Commands</h3>
        
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Command Name</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      placeholder="!help"
                      value={newCommand.name || ""}
                      onChange={(e) =>
                        setNewCommand({ ...newCommand, name: e.target.value })
                      }
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The command users will type to trigger this response</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Displays help information"
                value={newCommand.description || ""}
                onChange={(e) =>
                  setNewCommand({ ...newCommand, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Response Type</Label>
              <Select
                value={newCommand.type || "text"}
                onValueChange={(value) =>
                  setNewCommand({ ...newCommand, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select response type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Response</SelectItem>
                  <SelectItem value="embed">Embed Message</SelectItem>
                  <SelectItem value="ai">AI Generated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Response</Label>
              <Input
                placeholder="Enter command response"
                value={newCommand.response || ""}
                onChange={(e) =>
                  setNewCommand({ ...newCommand, response: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={
              !newCommand.name ||
              !newCommand.description ||
              !newCommand.response
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Command
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Existing Commands</h4>
        <div className="divide-y">
          {commands.map((command) => (
            <div
              key={command.id}
              className="py-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{command.name}</p>
                <p className="text-sm text-gray-500">{command.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteCommand(command.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};