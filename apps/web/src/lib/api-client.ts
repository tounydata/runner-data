import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { withRetry, isNetworkError } from '@/lib/retry'

interface InvokeOptions<T> {
  body?: T
  retries?: number
}

/**
 * Type-safe wrapper around supabase.functions.invoke.
 * All Edge Function calls should go through this.
 */
export async function invokeFunction<TBody, TResponse>(
  name: string,
  options: InvokeOptions<TBody> = {}
): Promise<TResponse> {
  const { body, retries = 2 } = options

  return withRetry(
    async () => {
      const { data, error } = await supabase.functions.invoke<TResponse>(name, {
        body: body ?? undefined,
      })
      if (error) {
        logger.error(`Edge Function error: ${name}`, { message: error.message })
        throw new Error(error.message)
      }
      if (data === null) {
        throw new Error(`Edge Function ${name} returned null`)
      }
      return data
    },
    {
      maxAttempts: retries + 1,
      shouldRetry: isNetworkError,
    }
  )
}
