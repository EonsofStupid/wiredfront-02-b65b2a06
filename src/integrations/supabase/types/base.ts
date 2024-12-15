export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_settings: {
        Row: {
          api_key: string | null
          created_at: string | null
          id: string
          is_active: boolean
          max_tokens: number | null
          model_name: string | null
          provider: Database["public"]["Enums"]["ai_provider"]
          temperature: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          max_tokens?: number | null
          model_name?: string | null
          provider?: Database["public"]["Enums"]["ai_provider"]
          temperature?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          max_tokens?: number | null
          model_name?: string | null
          provider?: Database["public"]["Enums"]["ai_provider"]
          temperature?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          priority: number | null
          prompt: string
          provider: Database["public"]["Enums"]["ai_provider"]
          result: string | null
          retry_count: number | null
          scheduled_for: string | null
          status: string
          task_id: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          priority?: number | null
          prompt: string
          provider: Database["public"]["Enums"]["ai_provider"]
          result?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          status: string
          task_id: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          priority?: number | null
          prompt?: string
          provider?: Database["public"]["Enums"]["ai_provider"]
          result?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          status?: string
          task_id?: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      discord_bot_config: {
        Row: {
          id: string
          client_id: string
          bot_token: string | null
          is_active: boolean | null
          server_count: number | null
          total_messages: number | null
          created_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          client_id: string
          bot_token?: string | null
          is_active?: boolean | null
          server_count?: number | null
          total_messages?: number | null
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          bot_token?: string | null
          is_active?: boolean | null
          server_count?: number | null
          total_messages?: number | null
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_visual_preferences: {
        Row: {
          created_at: string | null
          id: string
          prefer_high_performance: boolean | null
          reduced_motion: boolean | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          prefer_high_performance?: boolean | null
          reduced_motion?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          prefer_high_performance?: boolean | null
          reduced_motion?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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