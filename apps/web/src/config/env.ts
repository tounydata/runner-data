function required(key: string): string {
  const value = import.meta.env[key]
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value as string
}

function optional(key: string, fallback = ''): string {
  return (import.meta.env[key] as string | undefined) ?? fallback
}

export const env = {
  supabase: {
    url: required('VITE_SUPABASE_URL'),
    anonKey: required('VITE_SUPABASE_ANON_KEY'),
  },
  strava: {
    clientId: required('VITE_STRAVA_CLIENT_ID'),
  },
  app: {
    version: optional('VITE_APP_VERSION', '0.0.0'),
  },
  flags: {
    newProfile: optional('VITE_FF_NEW_PROFILE') === 'true',
    newRaceCalendar: optional('VITE_FF_NEW_RACE_CALENDAR') === 'true',
    newActivities: optional('VITE_FF_NEW_ACTIVITIES') === 'true',
    newAnalysis: optional('VITE_FF_NEW_ANALYSIS') === 'true',
  },
} as const
