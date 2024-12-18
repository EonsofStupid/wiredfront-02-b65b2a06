import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { AICommand, CommandResult } from "@/types/ai";
import { checkDevEnvironment, setupDevEnvironment } from "./devEnvironment";

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

const handleDevEnvironment = async (
  input: string,
  userId?: string
): Promise<CommandResult> => {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to manage development environments.",
    };
  }

  try {
    // First, check if we need to evaluate or setup the environment
    const isCheckOnly = input.includes("check");
    
    // Get current environment status
    const envStatus = await checkDevEnvironment(userId);
    
    if (isCheckOnly) {
      return {
        success: true,
        message: generateEnvironmentStatusMessage(envStatus),
      };
    }

    // If environment is incomplete or setup is explicitly requested, proceed with setup
    if (!envStatus.isComplete) {
      const setupResult = await setupDevEnvironment(userId, envStatus);
      return {
        success: true,
        message: `I've started setting up your development environment:\n${setupResult.message}`,
      };
    }

    return {
      success: true,
      message: "Your development environment is already set up and ready to go!",
    };
  } catch (error) {
    console.error('Error managing dev environment:', error);
    return {
      success: false,
      message: "Failed to manage the development environment. Please try again.",
    };
  }
};

const generateEnvironmentStatusMessage = (status: any) => {
  const messages = [];
  messages.push("Here's your current development environment status:");
  
  if (status.typescript) messages.push("✅ TypeScript is configured");
  else messages.push("❌ TypeScript needs to be configured");
  
  if (status.vite) messages.push("✅ Vite is set up");
  else messages.push("❌ Vite needs to be installed");
  
  if (status.tailwind) messages.push("✅ Tailwind CSS is installed");
  else messages.push("❌ Tailwind CSS needs to be configured");
  
  if (status.shadcn) messages.push("✅ shadcn/ui is available");
  else messages.push("❌ shadcn/ui needs to be installed");
  
  if (status.livePreview) messages.push("✅ Live preview is working");
  else messages.push("❌ Live preview needs to be configured");
  
  return messages.join("\n");
};
