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
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          description: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          description: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          description?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          balance: number | null
          created_at: string | null
          currency: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          total_games_played: number | null
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          total_games_played?: number | null
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          total_games_played?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bingo_cards: {
        Row: {
          assigned_agent: string | null
          card_data: Json
          card_number: string
          created_at: string
          game_date: string
          group_id: string | null
          id: string
          is_winner: boolean
          matched_numbers: number
          status: Database["public"]["Enums"]["card_status"]
          updated_at: string
          user_id: string
          user_name: string
          user_phone: string
        }
        Insert: {
          assigned_agent?: string | null
          card_data: Json
          card_number: string
          created_at?: string
          game_date?: string
          group_id?: string | null
          id?: string
          is_winner?: boolean
          matched_numbers?: number
          status?: Database["public"]["Enums"]["card_status"]
          updated_at?: string
          user_id: string
          user_name: string
          user_phone: string
        }
        Update: {
          assigned_agent?: string | null
          card_data?: Json
          card_number?: string
          created_at?: string
          game_date?: string
          group_id?: string | null
          id?: string
          is_winner?: boolean
          matched_numbers?: number
          status?: Database["public"]["Enums"]["card_status"]
          updated_at?: string
          user_id?: string
          user_name?: string
          user_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "bingo_cards_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "cartela_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      card_verifications: {
        Row: {
          card_number: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          verification_result: Json
          verified_at: string
        }
        Insert: {
          card_number: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          verification_result: Json
          verified_at?: string
        }
        Update: {
          card_number?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          verification_result?: Json
          verified_at?: string
        }
        Relationships: []
      }
      cartela_groups: {
        Row: {
          assigned_agent: string | null
          created_at: string
          group_name: string
          id: string
          sold_cartelas: number | null
          total_cartelas: number | null
          updated_at: string
          won_cartelas: number | null
        }
        Insert: {
          assigned_agent?: string | null
          created_at?: string
          group_name: string
          id?: string
          sold_cartelas?: number | null
          total_cartelas?: number | null
          updated_at?: string
          won_cartelas?: number | null
        }
        Update: {
          assigned_agent?: string | null
          created_at?: string
          group_name?: string
          id?: string
          sold_cartelas?: number | null
          total_cartelas?: number | null
          updated_at?: string
          won_cartelas?: number | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          from_user: string | null
          id: string
          notes: string | null
          purpose: string | null
          receipt_status: boolean | null
          to_user: string | null
          transaction_type: Database["public"]["Enums"]["credit_transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          from_user?: string | null
          id?: string
          notes?: string | null
          purpose?: string | null
          receipt_status?: boolean | null
          to_user?: string | null
          transaction_type: Database["public"]["Enums"]["credit_transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          from_user?: string | null
          id?: string
          notes?: string | null
          purpose?: string | null
          receipt_status?: boolean | null
          to_user?: string | null
          transaction_type?: Database["public"]["Enums"]["credit_transaction_type"]
          updated_at?: string
        }
        Relationships: []
      }
      game_results: {
        Row: {
          called_numbers: number[]
          created_at: string
          created_by: string | null
          draw_number: number
          game_date: string
          id: string
          published_at: string | null
          status: Database["public"]["Enums"]["game_result_status"] | null
          total_prize_pool: number | null
          winning_cards: string[] | null
        }
        Insert: {
          called_numbers: number[]
          created_at?: string
          created_by?: string | null
          draw_number: number
          game_date: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["game_result_status"] | null
          total_prize_pool?: number | null
          winning_cards?: string[] | null
        }
        Update: {
          called_numbers?: number[]
          created_at?: string
          created_by?: string | null
          draw_number?: number
          game_date?: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["game_result_status"] | null
          total_prize_pool?: number | null
          winning_cards?: string[] | null
        }
        Relationships: []
      }
      transaction_logs: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          metadata: Json | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_logs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_number: string | null
          amount: number
          completed_at: string | null
          confirmation_code: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          phone_number: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          transaction_id: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number?: string | null
          amount: number
          completed_at?: string | null
          confirmation_code?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          phone_number?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          transaction_id: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string | null
          amount?: number
          completed_at?: string | null
          confirmation_code?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          phone_number?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          transaction_id?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_accounts: {
        Row: {
          assigned_super_agent: string | null
          balance: number | null
          created_at: string
          id: string
          is_active: boolean | null
          total_cartelas_handled: number | null
          total_transactions: number | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          assigned_super_agent?: string | null
          balance?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          total_cartelas_handled?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          assigned_super_agent?: string | null
          balance?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          total_cartelas_handled?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["admin_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: {
          p_user_id: string
          p_role: Database["public"]["Enums"]["admin_role"]
          p_assigned_by: string
        }
        Returns: boolean
      }
      generate_card_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_transaction_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_admin_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["admin_role"]
        }
        Returns: boolean
      }
      is_admin_user: {
        Args: { _user_id: string }
        Returns: boolean
      }
      update_user_balance: {
        Args: {
          p_user_id: string
          p_amount: number
          p_transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "cashier"
      card_status: "active" | "expired" | "winner" | "checked"
      cartela_status: "active" | "used" | "void" | "sold"
      credit_transaction_type:
        | "sent_to_agent"
        | "sent_to_shop"
        | "received"
        | "recharge"
      game_result_status: "pending" | "published" | "completed"
      payment_method:
        | "telebirr"
        | "cbe"
        | "awash"
        | "dashen"
        | "bank_of_abyssinia"
      transaction_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      transaction_type: "deposit" | "withdrawal" | "bet" | "win" | "refund"
      user_type:
        | "super_admin"
        | "admin"
        | "super_agent"
        | "shop"
        | "agent"
        | "cashier"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "admin", "cashier"],
      card_status: ["active", "expired", "winner", "checked"],
      cartela_status: ["active", "used", "void", "sold"],
      credit_transaction_type: [
        "sent_to_agent",
        "sent_to_shop",
        "received",
        "recharge",
      ],
      game_result_status: ["pending", "published", "completed"],
      payment_method: [
        "telebirr",
        "cbe",
        "awash",
        "dashen",
        "bank_of_abyssinia",
      ],
      transaction_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      transaction_type: ["deposit", "withdrawal", "bet", "win", "refund"],
      user_type: [
        "super_admin",
        "admin",
        "super_agent",
        "shop",
        "agent",
        "cashier",
      ],
    },
  },
} as const
