/**
 * Hand-maintained until `supabase gen types` is wired into CI.
 * Run: supabase gen types typescript --project-id wanzrkdgqmcctwvnbmuv > src/lib/database.types.ts
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          age: number | null
          sex: string | null
          birthdate: string | null
          weight: number | null
          height: number | null
          vo2max: number | null
          fc_max: number | null
          lactate_threshold: number | null
          lactate_pace: string | null
          mass_fat: number | null
          mass_muscle: number | null
          pain_zones: string[] | null
          goals: string | null
          prs: Record<string, string> | null
          nutrition_products: unknown[] | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      activities_history: {
        Row: {
          id: string
          user_id: string
          data: unknown
          zone_data: unknown | null
          imported_at: string
        }
        Insert: Omit<Database['public']['Tables']['activities_history']['Row'], 'id' | 'imported_at'>
        Update: Partial<Database['public']['Tables']['activities_history']['Insert']>
      }
      race_calendar: {
        Row: {
          id: string
          user_id: string
          name: string
          date: string
          distance: number | null
          elevation: number | null
          type: string
          goal_time: string | null
          gpx_data: string | null
          strava_activity_id: number | null
          athlete_profile: unknown | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['race_calendar']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['race_calendar']['Insert']>
      }
    }
  }
}
