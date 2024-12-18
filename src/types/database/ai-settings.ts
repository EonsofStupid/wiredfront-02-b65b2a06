import { Json } from './json';

export interface AISettings {
  Row: {
    id: string;
    user_id: string | null;
    key: string;
    value: Json;
    provider: string | null;
    api_key: string | null;
    visual_effects: Json | null;
    metadata: Json | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    user_id?: string | null;
    key: string;
    value?: Json;
    provider?: string | null;
    api_key?: string | null;
    visual_effects?: Json | null;
    metadata?: Json | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string | null;
    key?: string;
    value?: Json;
    provider?: string | null;
    api_key?: string | null;
    visual_effects?: Json | null;
    metadata?: Json | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}