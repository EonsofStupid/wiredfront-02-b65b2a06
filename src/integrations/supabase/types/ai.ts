export interface AISettings {
  Row: {
    api_key: string | null
    created_at: string | null
    id: string
    is_active: boolean
    max_tokens: number | null
    model_name: string | null
    provider: "chatgpt" | "gemini" | "huggingface" | "anthropic" | "mistral" | "cohere"
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
    provider?: "chatgpt" | "gemini" | "huggingface" | "anthropic" | "mistral" | "cohere"
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
    provider?: "chatgpt" | "gemini" | "huggingface" | "anthropic" | "mistral" | "cohere"
    temperature?: number | null
    updated_at?: string | null
    user_id?: string
  }
}

export interface AITasks {
  Row: {
    completed_at: string | null
    created_at: string | null
    error_message: string | null
    id: string
    metadata: Json | null
    priority: number | null
    prompt: string
    provider: "chatgpt" | "gemini" | "huggingface" | "anthropic" | "mistral" | "cohere"
    result: string | null
    retry_count: number | null
    scheduled_for: string | null
    status: string
    task_id: string
    type: "code" | "analysis" | "automation" | "data"
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
    provider: "chatgpt" | "gemini" | "huggingface" | "anthropic" | "mistral" | "cohere"
    result?: string | null
    retry_count?: number | null
    scheduled_for?: string | null
    status: string
    task_id: string
    type: "code" | "analysis" | "automation" | "data"
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
    provider?: "chatgpt" | "gemini" | "huggingface" | "anthropic" | "mistral" | "cohere"
    result?: string | null
    retry_count?: number | null
    scheduled_for?: string | null
    status?: string
    task_id?: string
    type?: "code" | "analysis" | "automation" | "data"
    updated_at?: string | null
    user_id?: string | null
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]