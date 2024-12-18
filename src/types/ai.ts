import { LucideIcon } from "lucide-react";

export type AIMode = "chat" | "code" | "file";
export type AIProvider = "gemini" | "chatgpt" | "huggingface" | "anthropic" | "mistral" | "cohere";

export interface AIProviderConfig {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  apiKeyRequired: boolean;
  models: string[];
  icon: LucideIcon;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface AIInputFormProps {
  input: string;
  mode: AIMode;
  isProcessing: boolean;
  isOffline: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface AIResponseProps {
  response: string;
  className?: string;
}