import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { AICommand, CommandResult } from "@/types/ai";
import { checkDevEnvironment, setupDevEnvironment } from "./devEnvironment";
import { v4 as uuidv4 } from 'uuid';

export type CommandContext = {
  navigate: NavigateFunction;
  userId?: string;
};

const handleNavigationCommand = (input: string, navigate: NavigateFunction): CommandResult => {
  const path = input.toLowerCase().replace(/go to|navigate to/g, '').trim();
  const routes = {
    'home': '/',
    'dashboard': '/dashboard',
    'settings': '/settings',
    'profile': '/profile',
  };

  const targetPath = routes[path as keyof typeof routes];
  if (targetPath) {
    navigate(targetPath);
    return {
      success: true,
      message: `Navigating to ${path}...`,
    };
  }

  return {
    success: false,
    message: "I couldn't find that page. Try 'go to dashboard' or 'go to settings'.",
  };
};

const handleTaskCreation = async (input: string, userId?: string): Promise<CommandResult> => {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to create tasks.",
    };
  }

  const taskDescription = input.replace(/create task|new task/gi, '').trim();
  
  const { data, error } = await supabase
    .from('ai_tasks')
    .insert({
      task_id: uuidv4(),
      prompt: taskDescription,
      type: 'automation',
      provider: 'gemini',
      status: 'pending',
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: "Failed to create the task. Please try again.",
    };
  }

  return {
    success: true,
    message: `Task created: ${taskDescription}`,
    data: data,
  };
};

const handleFileOperation = async (input: string, userId?: string): Promise<CommandResult> => {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to perform file operations.",
    };
  }

  const isCreate = input.includes('create file');
  const operation = isCreate ? 'create' : 'edit';
  const filePath = input.replace(/(create|edit) file/gi, '').trim();

  const { data, error } = await supabase
    .from('file_operations')
    .insert({
      file_path: filePath,
      operation_type: operation,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: "Failed to process file operation. Please try again.",
    };
  }

  return {
    success: true,
    message: `File operation started: ${operation} ${filePath}`,
    data: data,
  };
};

const handleSettingsCommand = async (
  input: string,
  context: CommandContext
): Promise<CommandResult> => {
  if (!context.userId) {
    return {
      success: false,
      message: "You need to be logged in to manage settings.",
    };
  }

  if (input.includes('settings')) {
    context.navigate('/settings');
    return {
      success: true,
      message: "Opening settings page...",
    };
  }

  return {
    success: false,
    message: "I'm not sure what settings you want to manage. Try being more specific.",
  };
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