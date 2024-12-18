import { Json } from './json';

export interface AITrainingData {
  Row: {
    id: string;
    user_id: string | null;
    category: string;
    content: string;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    user_id?: string | null;
    category: string;
    content: string;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string | null;
    category?: string;
    content?: string;
    created_at?: string | null;
    updated_at?: string | null;
  };
}