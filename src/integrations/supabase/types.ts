import type { AISettings, AITasks } from './types/ai';
import type { DiscordBotConfig } from './types/discord';

export type Database = {
  public: {
    Tables: {
      ai_settings: AISettings
      ai_tasks: AITasks
      discord_bot_config: DiscordBotConfig
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ai_provider: "chatgpt" | "gemini" | "huggingface" | "anthropic" | "mistral" | "cohere"
      task_type: "code" | "analysis" | "automation" | "data"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type { AISettings, AITasks, DiscordBotConfig };