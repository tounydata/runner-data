import { createClient } from '@supabase/supabase-js'
import { env } from '@/config/env'
import type { Database } from '@/lib/database.types'

export const supabase = createClient<Database>(env.supabase.url, env.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type SupabaseClient = typeof supabase
