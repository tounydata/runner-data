import { z } from 'zod'

export const raceInsertSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  distance: z.number().positive().nullable(),
  elevation: z.number().nonnegative().int().nullable(),
  type: z.enum(['Trail', 'Route', 'Ultra', 'Cross']).or(z.string()),
  goal_time: z.string().nullable().optional(),
  gpx_data: z.string().nullable().optional(),
  strava_activity_id: z.number().int().nullable().optional(),
  athlete_profile: z
    .object({
      weight: z.number().optional(),
      fc_max: z.number().int().optional(),
      lactate_threshold: z.number().int().optional(),
      vo2max: z.number().optional(),
    })
    .nullable()
    .optional(),
})

export const raceUpdateSchema = raceInsertSchema.omit({ user_id: true }).partial()

export type RaceInsertInput = z.input<typeof raceInsertSchema>
export type RaceUpdateInput = z.input<typeof raceUpdateSchema>
