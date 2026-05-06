import { create } from 'zustand'
import type { AnalysisResponse } from '@runner-os/shared'
import { invokeFunction } from '@/lib/api-client'
import { logger } from '@/lib/logger'

interface AnalysisState {
  result: AnalysisResponse | null
  loading: boolean
  error: string | null
  analyse: (activityId: number) => Promise<void>
  clear: () => void
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  result: null,
  loading: false,
  error: null,

  analyse: async (activityId) => {
    set({ loading: true, error: null, result: null })
    try {
      const result = await invokeFunction<{ activityId: number }, AnalysisResponse>('ai-analysis', {
        body: { activityId },
        retries: 1,
      })
      set({ result, loading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur d'analyse"
      logger.error('Analysis failed', { activityId, message })
      set({ error: message, loading: false })
    }
  },

  clear: () => {
    set({ result: null, error: null })
  },
}))
