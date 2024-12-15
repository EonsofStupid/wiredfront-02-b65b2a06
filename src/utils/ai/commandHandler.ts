import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import type { AIProvider } from '@/types/ai';

export type CommandType = 'navigation' | 'settings' | 'task' | 'help';

export interface Command {
  type: CommandType;
  trigger: string[];
  description: string;
  requiresConfirmation?: boolean;
  action?: (navigate: ReturnType<typeof useNavigate>) => void;
}

export const availableCommands: Command[] = [
  {
    type: 'navigation',
    trigger: ['go to settings', 'open settings', 'show settings'],
    description: 'Navigate to settings page',
    action: (navigate) => navigate('/settings'),
  },
  {
    type: 'navigation',
    trigger: ['go to dashboard', 'open dashboard', 'show dashboard'],
    description: 'Navigate to dashboard',
    action: (navigate) => navigate('/dashboard'),
  },
  {
    type: 'navigation',
    trigger: ['go home', 'home page', 'return home'],
    description: 'Navigate to home page',
    action: (navigate) => navigate('/'),
  },
  {
    type: 'help',
    trigger: ['help', 'commands', 'what can you do'],
    description: 'Show available commands',
    action: () => {
      const commandList = availableCommands
        .map(cmd => `${cmd.trigger[0]}: ${cmd.description}`)
        .join('\n');
      toast({
        title: "Available Commands",
        description: commandList,
        duration: 5000,
      });
    },
  },
];

export const handleCommand = (input: string, navigate: ReturnType<typeof useNavigate>) => {
  const normalizedInput = input.toLowerCase().trim();

  for (const command of availableCommands) {
    if (command.trigger.some(trigger => normalizedInput.includes(trigger))) {
      if (command.action) {
        command.action(navigate);
      }
      toast({
        title: "Command Executed",
        description: `Executing: ${command.description}`,
      });
      return true;
    }
  }

  return false;
};

export const getSuggestions = (input: string): Command[] => {
  if (!input.trim()) return [];
  
  const normalizedInput = input.toLowerCase().trim();
  return availableCommands.filter(command =>
    command.trigger.some(trigger => trigger.includes(normalizedInput))
  );
};