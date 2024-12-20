import { NavigateFunction } from "react-router-dom";
import type { CommandResult } from "@/types/ai";
import { handleNavigationCommand } from "./commands/navigationCommands";
import { handleTaskCreation } from "./commands/taskCommands";
import { handleFileOperation } from "./commands/fileCommands";
import { handleSettingsCommand } from "./commands/settingsCommands";
import { handleDevEnvironment } from "./devEnvironment";

export type CommandContext = {
  navigate: NavigateFunction;
  userId?: string;
};

export const processAICommand = async (
  input: string,
  context: CommandContext
): Promise<CommandResult> => {
  // Normalize input
  const normalizedInput = input.toLowerCase().trim();
  
  // Check for development environment commands
  if (normalizedInput.includes("check environment") || 
      normalizedInput.includes("setup environment") ||
      normalizedInput.includes("dev environment")) {
    return handleDevEnvironment(normalizedInput, context.userId);
  }

  // Check for navigation commands
  if (normalizedInput.includes("go to") || normalizedInput.includes("navigate to")) {
    return handleNavigationCommand(normalizedInput, context.navigate);
  }

  // Check for task creation
  if (normalizedInput.includes("create task") || normalizedInput.includes("new task")) {
    return handleTaskCreation(normalizedInput, context.userId);
  }

  // Check for file operations
  if (normalizedInput.includes("create file") || normalizedInput.includes("edit file")) {
    return handleFileOperation(normalizedInput, context.userId);
  }

  // Check for AI settings
  if (normalizedInput.includes("settings") || normalizedInput.includes("configure")) {
    return handleSettingsCommand(normalizedInput, context);
  }

  return {
    success: false,
    message: "I'm not sure how to handle that command. Try being more specific or ask for help.",
  };
};