import { NavigateFunction } from "react-router-dom";

export interface Command {
  trigger: string[];
  description: string;
  execute: (navigate: NavigateFunction) => void;
}

const commands: Command[] = [
  {
    trigger: ["settings", "open settings", "go to settings"],
    description: "Navigate to settings page",
    execute: (navigate) => navigate("/settings"),
  },
  {
    trigger: ["project setup", "setup project", "configure project"],
    description: "Open project setup configuration",
    execute: (navigate) => {
      navigate("/settings");
      // Add a small delay to ensure the page has loaded before trying to click the tab
      setTimeout(() => {
        const projectTab = document.querySelector('[value="project"]');
        if (projectTab instanceof HTMLElement) {
          projectTab.click();
        }
      }, 100);
    },
  },
  {
    trigger: ["ai settings", "configure ai", "ai configuration"],
    description: "Open AI settings",
    execute: (navigate) => {
      navigate("/settings");
      setTimeout(() => {
        const aiTab = document.querySelector('[value="ai"]');
        if (aiTab instanceof HTMLElement) {
          aiTab.click();
        }
      }, 100);
    },
  },
  {
    trigger: ["general settings", "configure general", "general configuration"],
    description: "Open general settings",
    execute: (navigate) => {
      navigate("/settings");
      setTimeout(() => {
        const generalTab = document.querySelector('[value="general"]');
        if (generalTab instanceof HTMLElement) {
          generalTab.click();
        }
      }, 100);
    },
  },
  {
    trigger: ["api keys", "configure api", "api configuration"],
    description: "Open API keys settings",
    execute: (navigate) => {
      navigate("/settings");
      setTimeout(() => {
        const apiKeysTab = document.querySelector('[value="api-keys"]');
        if (apiKeysTab instanceof HTMLElement) {
          apiKeysTab.click();
        }
      }, 100);
    },
  },
  {
    trigger: ["ai models", "manage ai models", "ai model management"],
    description: "Open AI model management",
    execute: (navigate) => {
      navigate("/settings");
      setTimeout(() => {
        const aiModelsTab = document.querySelector('[value="ai-models"]');
        if (aiModelsTab instanceof HTMLElement) {
          aiModelsTab.click();
        }
      }, 100);
    },
  },
  {
    trigger: ["discord bot", "configure discord", "discord settings"],
    description: "Open Discord bot settings",
    execute: (navigate) => {
      navigate("/settings");
      setTimeout(() => {
        const discordTab = document.querySelector('[value="discord"]');
        if (discordTab instanceof HTMLElement) {
          discordTab.click();
        }
      }, 100);
    },
  },
  {
    trigger: ["notifications", "configure notifications", "notification settings"],
    description: "Open notification settings",
    execute: (navigate) => {
      navigate("/settings");
      setTimeout(() => {
        const notificationsTab = document.querySelector('[value="notifications"]');
        if (notificationsTab instanceof HTMLElement) {
          notificationsTab.click();
        }
      }, 100);
    },
  },
  {
    trigger: ["accessibility", "configure accessibility", "accessibility settings"],
    description: "Open accessibility settings",
    execute: (navigate) => {
      navigate("/settings");
      setTimeout(() => {
        const accessibilityTab = document.querySelector('[value="accessibility"]');
        if (accessibilityTab instanceof HTMLElement) {
          accessibilityTab.click();
        }
      }, 100);
    },
  },
];

export const handleCommand = (input: string, navigate: NavigateFunction): boolean => {
  const normalizedInput = input.toLowerCase().trim();
  
  for (const command of commands) {
    if (command.trigger.some(trigger => normalizedInput.includes(trigger.toLowerCase()))) {
      command.execute(navigate);
      return true;
    }
  }
  
  return false;
};

export const getSuggestions = (input: string): Command[] => {
  if (!input) return [];
  
  const normalizedInput = input.toLowerCase().trim();
  return commands.filter(command =>
    command.trigger.some(trigger =>
      trigger.toLowerCase().includes(normalizedInput)
    )
  );
};
