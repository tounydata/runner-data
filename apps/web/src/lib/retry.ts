interface RetryOptions {
  maxAttempts?: number
  initialDelayMs?: number
  maxDelayMs?: number
  shouldRetry?: (error: unknown) => boolean
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 3, initialDelayMs = 500, maxDelayMs = 8000, shouldRetry } = options

  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const isLast = attempt === maxAttempts
      if (isLast) break
      if (shouldRetry && !shouldRetry(error)) break

      const delay = Math.min(initialDelayMs * Math.pow(2, attempt - 1), maxDelayMs)
      await sleep(delay)
    }
  }
  throw lastError
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof TypeError &&
    (error.message.includes('fetch') || error.message.includes('network'))
  )
}
