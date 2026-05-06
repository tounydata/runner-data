import type { StravaActivity } from './activity.js'
import type { Profile } from './profile.js'

export interface AnalysisRequest {
  activity: StravaActivity
  profile: Partial<Profile>
  context?: string
}

export interface AnalysisResponse {
  summary: string
  insights: AnalysisInsight[]
  recommendations: string[]
  physiological_notes: string | null
  gap_adjusted_pace: GapData | null
}

export interface AnalysisInsight {
  type: 'positive' | 'warning' | 'neutral'
  title: string
  body: string
  reference?: string
}

export interface GapData {
  flat_equivalent_pace: string
  grade_adjusted_paces: GradePacePoint[]
}

export interface GradePacePoint {
  grade_percent: number
  adjustment_factor: number
  adjusted_pace: string
}

export interface RaceStrategyRequest {
  race_distance_km: number
  race_elevation_m: number
  gpx_data?: string
  profile: Partial<Profile>
  goal_time?: string
}

export interface RaceStrategyResponse {
  sections: RaceSection[]
  nutrition_plan: NutritionEntry[]
  time_projections: TimeProjection[]
  key_warnings: string[]
}

export interface RaceSection {
  km_start: number
  km_end: number
  name: string
  terrain: 'climb' | 'descent' | 'flat'
  target_pace: string
  effort_level: 'easy' | 'moderate' | 'hard'
  tips: string[]
}

export interface NutritionEntry {
  km: number
  time_estimate: string
  product: string
  carbs_g: number
  notes: string
}

export interface TimeProjection {
  checkpoint: string
  km: number
  predicted_time: string
  cumulative_time: string
}
