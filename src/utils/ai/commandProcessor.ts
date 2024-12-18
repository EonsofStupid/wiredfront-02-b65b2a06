import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { AICommand, CommandResult } from "@/types/ai";

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

const handleNavigationCommand = async (
  input: string,
  navigate: NavigateFunction
): Promise<CommandResult> => {
  const routes = {
    "dashboard": "/dashboard",
    "settings": "/settings",
    "files": "/files",
    "profile": "/profile",
    "home": "/"
  };

  for (const [key, path] of Object.entries(routes)) {
    if (input.includes(key)) {
      navigate(path);
      return {
        success: true,
        message: `Navigating to ${key}`,
      };
    }
  }

  return {
    success: false,
    message: "I couldn't determine where to navigate to. Please specify a valid page.",
  };
};

const handleTaskCreation = async (
  input: string,
  userId?: string
): Promise<CommandResult> => {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to create tasks.",
    };
  }

  try {
    const { error } = await supabase
      .from('ai_tasks')
      .insert({
        task_id: crypto.randomUUID(),
        type: 'automation',
        prompt: input,
        provider: 'gemini',
        status: 'pending',
        user_id: userId
      });

    if (error) throw error;

    return {
      success: true,
      message: "Task created successfully. I'll start working on it right away.",
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return {
      success: false,
      message: "Failed to create the task. Please try again.",
    };
  }
};

const handleFileOperation = async (
  input: string,
  userId?: string
): Promise<CommandResult> => {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to perform file operations.",
    };
  }

  // Implementation for file operations will go here
  return {
    success: true,
    message: "File operation command received. This feature is coming soon.",
  };
};

const handleSettingsCommand = async (
  input: string,
  context: CommandContext
): Promise<CommandResult> => {
  if (input.includes("ai") || input.includes("assistant")) {
    context.navigate("/settings");
    setTimeout(() => {
      const aiTab = document.querySelector('[value="ai"]');
      if (aiTab instanceof HTMLElement) {
        aiTab.click();
      }
    }, 100);
    return {
      success: true,
      message: "Opening AI settings...",
    };
  }

  return {
    success: false,
    message: "Please specify which settings you'd like to configure.",
  };
};