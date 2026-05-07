import { z } from 'zod'

export const analysisRequestSchema = z.object({
  activityId: z.number().int().positive(),
  profileOverride: z
    .object({
      fc_max: z.number().int().positive().optional(),
      lactate_threshold: z.number().int().positive().optional(),
      vo2max: z.number().positive().optional(),
      weight: z.number().positive().optional(),
    })
    .optional(),
})

export const raceStrategyRequestSchema = z.object({
  raceId: z.string().uuid(),
  gpxData: z.string().optional(),
})

export const analysisInsightSchema = z.object({
  type: z.enum(['positive', 'warning', 'neutral']),
  title: z.string(),
  body: z.string(),
  reference: z.string().optional(),
})

export const analysisResponseSchema = z.object({
  summary: z.string(),
  insights: z.array(analysisInsightSchema),
  recommendations: z.array(z.string()),
  physiological_notes: z.string().nullable(),
  gap_adjusted_pace: z
    .object({
      flat_equivalent_pace: z.string(),
      grade_adjusted_paces: z.array(
        z.object({
          grade_percent: z.number(),
          adjustment_factor: z.number(),
          adjusted_pace: z.string(),
        })
      ),
    })
    .nullable(),
})

export type AnalysisRequestInput = z.input<typeof analysisRequestSchema>
export type AnalysisResponseOutput = z.output<typeof analysisResponseSchema>
