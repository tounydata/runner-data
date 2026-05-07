export type RaceType = 'Trail' | 'Route' | 'Ultra' | 'Cross' | string

export interface Race {
  id: string
  user_id: string
  name: string
  date: string
  distance: number | null
  elevation: number | null
  type: RaceType
  goal_time: string | null
  gpx_data: string | null
  strava_activity_id: number | null
  athlete_profile: RaceAthleteProfile | null
  created_at: string
}

export interface RaceAthleteProfile {
  weight?: number
  fc_max?: number
  lactate_threshold?: number
  vo2max?: number
}

export type RaceInsert = Omit<Race, 'id' | 'created_at'>
export type RaceUpdate = Partial<Omit<Race, 'id' | 'user_id' | 'created_at'>>

export interface RacePrediction {
  finishTime: string
  avgPace: string
  confidence: 'low' | 'medium' | 'high'
  notes: string
}
