export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          address_line: string
          created_at: string
          district: string | null
          est_hours: number
          homeowner_id: string
          hourly_rate: number
          id: string
          job_type: string
          landmarks: string | null
          payment_method: string | null
          platform_fee: number
          postal_code: string | null
          problem_desc: string | null
          provider_id: string
          ref_code: string
          scheduled_date: string | null
          scheduled_time: string | null
          service_name: string
          status: string
          sub_service_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          address_line: string
          created_at?: string
          district?: string | null
          est_hours?: number
          homeowner_id: string
          hourly_rate?: number
          id?: string
          job_type?: string
          landmarks?: string | null
          payment_method?: string | null
          platform_fee?: number
          postal_code?: string | null
          problem_desc?: string | null
          provider_id: string
          ref_code?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          service_name: string
          status?: string
          sub_service_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          address_line?: string
          created_at?: string
          district?: string | null
          est_hours?: number
          homeowner_id?: string
          hourly_rate?: number
          id?: string
          job_type?: string
          landmarks?: string | null
          payment_method?: string | null
          platform_fee?: number
          postal_code?: string | null
          problem_desc?: string | null
          provider_id?: string
          ref_code?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          service_name?: string
          status?: string
          sub_service_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_homeowner_id_fkey"
            columns: ["homeowner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_sub_service_id_fkey"
            columns: ["sub_service_id"]
            isOneToOne: false
            referencedRelation: "sub_services"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          created_at: string
          date: string
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          color: string
          created_at: string
          description: string
          frequency: Json
          id: string
          name: string
          position: number
          reminder_time: string | null
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string
          frequency?: Json
          id?: string
          name: string
          position?: number
          reminder_time?: string | null
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          frequency?: Json
          id?: string
          name?: string
          position?: number
          reminder_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author_id: string
          body: string
          category: string
          created_at: string
          excerpt: string
          id: string
          image_url: string | null
          publish_at: string | null
          status: string
          tag: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body?: string
          category?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          publish_at?: string | null
          status?: string
          tag?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          category?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          publish_at?: string | null
          status?: string
          tag?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          booking_id: string | null
          created_at: string
          id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          booking_id?: string | null
          created_at?: string
          id?: string
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          booking_id?: string | null
          created_at?: string
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          role: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          available: boolean
          bio: string | null
          category_id: string | null
          city: string | null
          created_at: string
          distance_km: number | null
          headline: string
          hourly_rate: number
          id: string
          jobs_done: number
          rating: number
          top_rated: boolean
          verified: boolean
          years_experience: number
        }
        Insert: {
          available?: boolean
          bio?: string | null
          category_id?: string | null
          city?: string | null
          created_at?: string
          distance_km?: number | null
          headline?: string
          hourly_rate?: number
          id: string
          jobs_done?: number
          rating?: number
          top_rated?: boolean
          verified?: boolean
          years_experience?: number
        }
        Update: {
          available?: boolean
          bio?: string | null
          category_id?: string | null
          city?: string | null
          created_at?: string
          distance_km?: number | null
          headline?: string
          hourly_rate?: number
          id?: string
          jobs_done?: number
          rating?: number
          top_rated?: boolean
          verified?: boolean
          years_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "providers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "providers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          pros_count: number
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          pros_count?: number
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          pros_count?: number
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      sub_services: {
        Row: {
          base_price: number
          category_id: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          base_price?: number
          category_id: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          base_price?: number
          category_id?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "sub_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
