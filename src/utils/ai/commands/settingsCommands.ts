import { NavigateFunction } from "react-router-dom";
import type { CommandResult } from "@/types/ai";
import type { CommandContext } from "../commandProcessor";

export const handleSettingsCommand = async (
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