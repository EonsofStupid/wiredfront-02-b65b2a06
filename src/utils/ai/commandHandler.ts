import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import type { AIProvider } from '@/types/ai';

export type CommandType = 'navigation' | 'settings' | 'task' | 'help';

export interface Command {
  type: CommandType;
  trigger: string[];
  description: string;
  requiresConfirmation?: boolean;
}

export const availableCommands: Command[] = [
  {
    type: 'navigation',
    trigger: ['go to', 'navigate to', 'open', 'show'],
    description: 'Navigate to different pages',
  },
  {
    type: 'settings',
    trigger: ['settings', 'preferences', 'configure'],
    description: 'Open and manage settings',
    requiresConfirmation: true,
  },
  {
    type: 'help',
    trigger: ['help', 'commands', 'what can you do'],
    description: 'Show available commands',
  },
];

export const routes = {
  settings: '/settings',
  dashboard: '/dashboard',
  profile: '/profile',
  files: '/files',
};

export const handleCommand = (input: string, navigate: ReturnType<typeof useNavigate>) => {
  const normalizedInput = input.toLowerCase().trim();

  // Check for navigation commands
  if (normalizedInput.includes('settings') || normalizedInput.includes('preferences')) {
    navigate('/settings');
    toast({
      title: "Navigation",
      description: "Opening settings page",
    });
    return true;
  }

  if (normalizedInput.includes('dashboard')) {
    navigate('/dashboard');
    toast({
      title: "Navigation",
      description: "Opening dashboard",
    });
    return true;
  }

  // Help command
  if (normalizedInput.includes('help') || normalizedInput.includes('commands')) {
    const commandList = availableCommands
      .map(cmd => `${cmd.trigger[0]}: ${cmd.description}`)
      .join('\n');
    toast({
      title: "Available Commands",
      description: commandList,
      duration: 5000,
    });
    return true;
  }

  return false;
};

export const getSuggestions = (input: string): Command[] => {
  const normalizedInput = input.toLowerCase().trim();
  return availableCommands.filter(command =>
    command.trigger.some(trigger => trigger.includes(normalizedInput))
  );
};