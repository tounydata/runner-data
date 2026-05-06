export type ActivityType =
  | 'Run'
  | 'TrailRun'
  | 'VirtualRun'
  | 'Walk'
  | 'Hike'
  | 'Ride'
  | 'VirtualRide'
  | string

export interface StravaActivity {
  id: number
  name: string
  type: ActivityType
  sport_type: string
  start_date: string
  start_date_local: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  average_speed: number
  max_speed: number
  average_heartrate?: number
  max_heartrate?: number
  average_cadence?: number
  suffer_score?: number
  achievement_count: number
  kudos_count: number
  map?: {
    id: string
    summary_polyline: string
    resource_state: number
  }
  splits_metric?: Split[]
  laps?: Lap[]
  calories?: number
  description?: string
  gear_id?: string | null
  workout_type?: number | null
  perceived_exertion?: number | null
  average_watts?: number
  weighted_average_watts?: number
  kilojoules?: number
  device_name?: string
}

export interface Split {
  distance: number
  elapsed_time: number
  elevation_difference: number
  moving_time: number
  split: number
  average_speed: number
  average_grade_adjusted_speed?: number
  average_heartrate?: number
  pace_zone?: number
}

export interface Lap {
  id: number
  name: string
  elapsed_time: number
  moving_time: number
  start_date: string
  distance: number
  average_speed: number
  max_speed: number
  average_heartrate?: number
  max_heartrate?: number
  total_elevation_gain: number
  lap_index: number
  split: number
}

export interface ActivitiesHistory {
  id: string
  user_id: string
  data: StravaActivity[]
  zone_data: ZoneData | null
  imported_at: string
}

export interface ZoneData {
  [activityId: string]: ActivityZones
}

export interface ActivityZones {
  heart_rate?: HeartRateZone[]
  power?: PowerZone[]
}

export interface HeartRateZone {
  min: number
  max: number
  time: number
}

export interface PowerZone {
  min: number
  max: number
  time: number
}

export interface ActivityStats {
  totalKm: number
  totalElevation: number
  totalTime: number
  avgPace: string
  runCount: number
}
