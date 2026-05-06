const ALLOWED_ORIGINS = new Set([
  'https://runner-os.com',
  'https://www.runner-os.com',
  'http://localhost:5173',
  ...(Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').filter(Boolean),
])

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : ''
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(req.headers.get('origin')),
    })
  }
  return null
}
