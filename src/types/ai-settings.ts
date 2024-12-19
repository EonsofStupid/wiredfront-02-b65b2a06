import { Json } from '@/integrations/supabase/types';

export interface AISettingsMetadata {
  elevenLabsApiKey?: string;
  features?: {
    moderation?: boolean;
    onboarding?: boolean;
    codeAssistance?: boolean;
  };
  training?: {
    faqData?: any[];
    customPrompts?: any[];
    serverSpecificTerms?: Record<string, any>;
  };
  personality?: {
    tone?: string;
    formality?: number;
    verbosity?: number;
  };
  [key: string]: any;
}

export function isAISettingsMetadata(data: Json): data is AISettingsMetadata {
  if (!data || typeof data !== 'object') return false;
  return true; // Add more specific validation if needed
}