import { z } from 'zod'

export const stravaOAuthPayloadSchema = z.object({
  code: z.string().min(1),
  scope: z.string(),
})

export const stravaAthleteSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  profile_medium: z.string().url(),
  profile: z.string().url(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  sex: z.enum(['M', 'F']).nullable(),
  weight: z.number().nullable(),
})

export const stravaActivitySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  sport_type: z.string(),
  start_date: z.string().datetime(),
  start_date_local: z.string().datetime(),
  distance: z.number().nonnegative(),
  moving_time: z.number().nonnegative(),
  elapsed_time: z.number().nonnegative(),
  total_elevation_gain: z.number().nonnegative(),
  average_speed: z.number().nonnegative(),
  max_speed: z.number().nonnegative(),
  average_heartrate: z.number().optional(),
  max_heartrate: z.number().optional(),
  average_cadence: z.number().optional(),
  suffer_score: z.number().nullable().optional(),
  achievement_count: z.number(),
  kudos_count: z.number(),
})

export const stravaActivitiesArraySchema = z.array(stravaActivitySchema)

export type StravaOAuthPayloadInput = z.input<typeof stravaOAuthPayloadSchema>
export type StravaActivityInput = z.input<typeof stravaActivitySchema>
