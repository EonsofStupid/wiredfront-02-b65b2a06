import type { AITask, AIModelConfig, AISetting } from './ai';

export interface Database {
  public: {
    Tables: {
      ai_tasks: {
        Row: AITask;
        Insert: Partial<AITask>;
        Update: Partial<AITask>;
      };
      ai_model_configs: {
        Row: AIModelConfig;
        Insert: Partial<AIModelConfig>;
        Update: Partial<AIModelConfig>;
      };
      ai_settings: {
        Row: AISetting;
        Insert: Partial<AISetting>;
        Update: Partial<AISetting>;
      };
      ai_memory: {
        Row: {
          context_key: string
          context_value: Json
          created_at: string | null
          expires_at: string | null
          id: string
          personality_id: string
        }
        Insert: {
          context_key: string
          context_value?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          personality_id: string
        }
        Update: {
          context_key?: string
          context_value?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          personality_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_memory_personality_id_fkey"
            columns: ["personality_id"]
            isOneToOne: false
            referencedRelation: "ai_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_personalities: {
        Row: {
          changed_by: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_personality_history: {
        Row: {
          changed_at: string | null
          changed_by: string
          changes: Json
          id: string
          personality_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by: string
          changes?: Json
          id?: string
          personality_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string
          changes?: Json
          id?: string
          personality_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_personality_history_personality_id_fkey"
            columns: ["personality_id"]
            isOneToOne: false
            referencedRelation: "ai_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_personality_traits: {
        Row: {
          created_at: string | null
          id: string
          personality_id: string
          trait_key: string
          trait_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          personality_id: string
          trait_key: string
          trait_value?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          personality_id?: string
          trait_key?: string
          trait_value?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_personality_traits_personality_id_fkey"
            columns: ["personality_id"]
            isOneToOne: false
            referencedRelation: "ai_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_settings: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          user_id: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          user_id?: string | null
          value?: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          user_id?: string | null
          value?: Json
        }
        Relationships: []
      }
      ai_work_items: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          output: string | null
          priority: number | null
          status: Database["public"]["Enums"]["chat_status"] | null
          task: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          output?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["chat_status"] | null
          task: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          output?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["chat_status"] | null
          task?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      component_themes: {
        Row: {
          component_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          styles: Json
          theme_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          component_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          styles?: Json
          theme_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          component_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          styles?: Json
          theme_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      custom_sections: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          position: number | null
          section_name: string
          theme_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          position?: number | null
          section_name: string
          theme_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          position?: number | null
          section_name?: string
          theme_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_sections_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "component_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      discord_achievements: {
        Row: {
          achievement_type: string
          description: string | null
          earned_at: string | null
          id: string
          server_id: string
          title: string
          user_id: string | null
        }
        Insert: {
          achievement_type: string
          description?: string | null
          earned_at?: string | null
          id?: string
          server_id: string
          title: string
          user_id?: string | null
        }
        Update: {
          achievement_type?: string
          description?: string | null
          earned_at?: string | null
          id?: string
          server_id?: string
          title?: string
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
      discord_bot_logs: {
        Row: {
          created_at: string | null
          id: string
          level: Database["public"]["Enums"]["log_level"]
          message: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level?: Database["public"]["Enums"]["log_level"]
          message: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: Database["public"]["Enums"]["log_level"]
          message?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      discord_quotes: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          id: string
          quote_type: Database["public"]["Enums"]["quote_type"]
          server_id: string
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          id?: string
          quote_type: Database["public"]["Enums"]["quote_type"]
          server_id: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          id?: string
          quote_type?: Database["public"]["Enums"]["quote_type"]
          server_id?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      discord_server_config: {
        Row: {
          created_at: string | null
          enabled_features: string[] | null
          id: string
          moderation_rules: Json | null
          prefix: string | null
          server_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          enabled_features?: string[] | null
          id?: string
          moderation_rules?: Json | null
          prefix?: string | null
          server_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          enabled_features?: string[] | null
          id?: string
          moderation_rules?: Json | null
          prefix?: string | null
          server_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      file_operations: {
        Row: {
          content: string | null
          created_at: string | null
          file_path: string
          id: string
          metadata: Json | null
          operation_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_path: string
          id?: string
          metadata?: Json | null
          operation_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_path?: string
          id?: string
          metadata?: Json | null
          operation_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      github_integration: {
        Row: {
          auth_token: string | null
          auto_sync: boolean | null
          branch_name: string | null
          created_at: string | null
          id: string
          repository_url: string | null
          sync_frequency: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auth_token?: string | null
          auto_sync?: boolean | null
          branch_name?: string | null
          created_at?: string | null
          id?: string
          repository_url?: string | null
          sync_frequency?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auth_token?: string | null
          auto_sync?: boolean | null
          branch_name?: string | null
          created_at?: string | null
          id?: string
          repository_url?: string | null
          sync_frequency?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      layout_preferences: {
        Row: {
          bottom_bar_visible: boolean | null
          created_at: string | null
          id: string
          right_sidebar_open: boolean | null
          right_sidebar_width: number | null
          sidebar_open: boolean | null
          sidebar_width: number | null
          top_bar_visible: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bottom_bar_visible?: boolean | null
          created_at?: string | null
          id?: string
          right_sidebar_open?: boolean | null
          right_sidebar_width?: number | null
          sidebar_open?: boolean | null
          sidebar_width?: number | null
          top_bar_visible?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bottom_bar_visible?: boolean | null
          created_at?: string | null
          id?: string
          right_sidebar_open?: boolean | null
          right_sidebar_width?: number | null
          sidebar_open?: boolean | null
          sidebar_width?: number | null
          top_bar_visible?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_mobile_optimized: boolean | null
          last_seen: string | null
          theme_preference: string | null
          updated_at: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_mobile_optimized?: boolean | null
          last_seen?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_mobile_optimized?: boolean | null
          last_seen?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      setup_wizard_config: {
        Row: {
          ai_config: Json | null
          bot_config: Json | null
          created_at: string | null
          current_step: number | null
          environment_config: Json | null
          id: string
          setup_status: Database["public"]["Enums"]["setup_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_config?: Json | null
          bot_config?: Json | null
          created_at?: string | null
          current_step?: number | null
          environment_config?: Json | null
          id?: string
          setup_status?: Database["public"]["Enums"]["setup_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_config?: Json | null
          bot_config?: Json | null
          created_at?: string | null
          current_step?: number | null
          environment_config?: Json | null
          id?: string
          setup_status?: Database["public"]["Enums"]["setup_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      testing_environments: {
        Row: {
          created_at: string | null
          docker_config: Json | null
          environment_name: string
          framework: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          docker_config?: Json | null
          environment_name: string
          framework: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          docker_config?: Json | null
          environment_name?: string
          framework?: string
          id?: string
          is_active?: boolean | null
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
          visual_effects: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          prefer_high_performance?: boolean | null
          reduced_motion?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
          visual_effects?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          prefer_high_performance?: boolean | null
          reduced_motion?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
          visual_effects?: Json | null
        }
        Relationships: []
      }
    };
  };
}
