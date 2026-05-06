import { handleCors, corsHeaders } from '../_shared/cors.ts'
import { requireAuth, getServiceClient } from '../_shared/auth.ts'
import { errorResponse, json, ValidationError } from '../_shared/error.ts'
import { stravaOAuthPayloadSchema } from 'https://esm.sh/@runner-os/shared@*'

/**
 * Exchange a Strava OAuth code for tokens and store them server-side.
 * Tokens are NEVER returned to the client.
 */
Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin')
  const cors = corsHeaders(origin)

  const preflight = handleCors(req)
  if (preflight) return preflight

  try {
    const userId = await requireAuth(req)
    const body = await req.json() as unknown
    const parsed = stravaOAuthPayloadSchema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '))
    }

    const { code } = parsed.data

    const clientId = Deno.env.get('STRAVA_CLIENT_ID')
    const clientSecret = Deno.env.get('STRAVA_CLIENT_SECRET')
    if (!clientId || !clientSecret) throw new Error('Strava credentials not configured')

    const tokenRes = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      throw new Error(`Strava token exchange failed: ${err}`)
    }

    const tokenData = await tokenRes.json() as {
      access_token: string
      refresh_token: string
      expires_at: number
      athlete: { firstname: string; lastname: string; profile_medium: string }
    }

    const supabase = getServiceClient()
    const { error: upsertError } = await supabase.from('strava_tokens').upsert({
      user_id: userId,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_at,
      updated_at: new Date().toISOString(),
    })

    if (upsertError) throw upsertError

    // Pull initial activities after OAuth
    await fetchAndStoreActivities(userId, tokenData.access_token, supabase)

    return json(
      {
        connected: true,
        athlete: {
          name: `${tokenData.athlete.firstname} ${tokenData.athlete.lastname}`,
          avatar: tokenData.athlete.profile_medium,
        },
      },
      200,
      cors
    )
  } catch (err) {
    return errorResponse(err, cors)
  }
})

async function fetchAndStoreActivities(
  userId: string,
  accessToken: string,
  supabase: ReturnType<typeof getServiceClient>
): Promise<void> {
  const activitiesRes = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=100',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!activitiesRes.ok) return

  const activities = await activitiesRes.json() as unknown[]
  await supabase.from('activities_history').upsert({
    user_id: userId,
    data: activities,
    imported_at: new Date().toISOString(),
  })
}
