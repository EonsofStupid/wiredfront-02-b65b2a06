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
          bot_token: string | null
          client_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string | null
          server_count: number | null
          total_messages: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bot_token?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          server_count?: number | null
          total_messages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bot_token?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          server_count?: number | null
          total_messages?: number | null
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
      ai_provider:
        | "chatgpt"
        | "gemini"
        | "huggingface"
        | "anthropic"
        | "mistral"
        | "cohere"
      task_type: "code" | "analysis" | "automation" | "data"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
