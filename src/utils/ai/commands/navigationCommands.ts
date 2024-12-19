import { NavigateFunction } from "react-router-dom";
import type { CommandResult } from "@/types/ai";

export const handleNavigationCommand = (
  input: string,
  navigate: NavigateFunction
): CommandResult => {
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