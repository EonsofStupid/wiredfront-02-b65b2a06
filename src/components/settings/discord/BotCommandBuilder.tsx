import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface Command {
  id: string;
  name: string;
  description: string;
  usage: string;
}

interface BotCommandBuilderProps {
  commands: Command[];
  onSaveCommand: (command: Omit<Command, "id">) => void;
  onDeleteCommand: (id: string) => void;
}

export const BotCommandBuilder = ({
  commands,
  onSaveCommand,
  onDeleteCommand,
}: BotCommandBuilderProps) => {
  const [newCommand, setNewCommand] = useState({
    name: "",
    description: "",
    usage: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCommand(newCommand);
    setNewCommand({ name: "", description: "", usage: "" });
  };

  return (
    <Card className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Command Name</Label>
          <Input
            value={newCommand.name}
            onChange={(e) =>
              setNewCommand({ ...newCommand, name: e.target.value })
            }
            placeholder="e.g., !quote"
          />
        </div>
        
        <div>
          <Label>Description</Label>
          <Input
            value={newCommand.description}
            onChange={(e) =>
              setNewCommand({ ...newCommand, description: e.target.value })
            }
            placeholder="What does this command do?"
          />
        </div>
        
        <div>
          <Label>Usage Example</Label>
          <Input
            value={newCommand.usage}
            onChange={(e) =>
              setNewCommand({ ...newCommand, usage: e.target.value })
            }
            placeholder="e.g., !quote add 'text' #funny"
          />
        </div>

        <Button type="submit">Add Command</Button>
      </form>

      <div className="space-y-2">
        {commands.map((command) => (
          <div
            key={command.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div>
              <h4 className="font-medium">{command.name}</h4>
              <p className="text-sm text-gray-500">{command.description}</p>
              <p className="text-xs text-gray-400">Usage: {command.usage}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteCommand(command.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};