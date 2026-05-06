import { AuthError } from './auth.ts'

interface ErrorResponse {
  error: string
  code?: string
}

export function errorResponse(err: unknown, headers: Record<string, string> = {}): Response {
  if (err instanceof AuthError) {
    return json({ error: err.message, code: 'UNAUTHORIZED' }, 401, headers)
  }
  if (err instanceof ValidationError) {
    return json({ error: err.message, code: 'VALIDATION_ERROR' }, 400, headers)
  }
  console.error('[edge-function-error]', err)
  return json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, 500, headers)
}

export function json<T>(data: T, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
