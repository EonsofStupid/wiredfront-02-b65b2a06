export interface DiscordBotConfig {
  Row: {
    id: string
    client_id: string
    bot_token: string | null
    is_active: boolean
    server_count: number
    total_messages: number
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    client_id: string
    bot_token?: string | null
    is_active?: boolean
    server_count?: number
    total_messages?: number
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    client_id?: string
    bot_token?: string | null
    is_active?: boolean
    server_count?: number
    total_messages?: number
    created_at?: string | null
    updated_at?: string | null
  }
}