import { handleCors, corsHeaders } from '../_shared/cors.ts'
import { requireAuth, getServiceClient } from '../_shared/auth.ts'
import { errorResponse, json } from '../_shared/error.ts'

/**
 * Refresh Strava access token using the stored refresh token.
 * Returns only { connected: true } — tokens stay server-side.
 */
Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin')
  const cors = corsHeaders(origin)

  const preflight = handleCors(req)
  if (preflight) return preflight

  try {
    const userId = await requireAuth(req)
    const supabase = getServiceClient()

    const { data: tokenRow, error: fetchError } = await supabase
      .from('strava_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', userId)
      .single()

    if (fetchError || !tokenRow) {
      return json({ connected: false }, 200, cors)
    }

    const now = Math.floor(Date.now() / 1000)
    // Token still valid (add 5min buffer)
    if (tokenRow.expires_at > now + 300) {
      await fetchAndStoreActivities(userId, tokenRow.access_token as string, supabase)
      return json({ connected: true }, 200, cors)
    }

    // Refresh the token
    const clientId = Deno.env.get('STRAVA_CLIENT_ID')
    const clientSecret = Deno.env.get('STRAVA_CLIENT_SECRET')

    const refreshRes = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: tokenRow.refresh_token,
        grant_type: 'refresh_token',
      }),
    })

    if (!refreshRes.ok) {
      return json({ connected: false }, 200, cors)
    }

    const refreshed = await refreshRes.json() as {
      access_token: string
      refresh_token: string
      expires_at: number
    }

    await supabase.from('strava_tokens').update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token,
      expires_at: refreshed.expires_at,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId)

    await fetchAndStoreActivities(userId, refreshed.access_token, supabase)

    return json({ connected: true }, 200, cors)
  } catch (err) {
    return errorResponse(err, cors)
  }
})

async function fetchAndStoreActivities(
  userId: string,
  accessToken: string,
  supabase: ReturnType<typeof getServiceClient>
): Promise<void> {
  const res = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=100',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!res.ok) return

  const activities = await res.json() as unknown[]
  await supabase.from('activities_history').upsert({
    user_id: userId,
    data: activities,
    imported_at: new Date().toISOString(),
  })
}
