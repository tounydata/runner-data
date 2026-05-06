export interface StravaTokens {
  user_id: string
  access_token: string
  refresh_token: string
  expires_at: number
  updated_at: string
}

export interface StravaOAuthPayload {
  code: string
  scope: string
}

export interface StravaOAuthResponse {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete: StravaAthlete
}

export interface StravaAthlete {
  id: number
  firstname: string
  lastname: string
  profile_medium: string
  profile: string
  city: string | null
  country: string | null
  sex: 'M' | 'F' | null
  weight: number | null
}

export interface StravaRefreshPayload {
  userId: string
}

export interface StravaRefreshResponse {
  access_token: string
  expires_at: number
}
