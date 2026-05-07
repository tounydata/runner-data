import { env } from '@/config/env'

export type FeatureFlag = keyof typeof env.flags

/**
 * Check if a feature flag is enabled.
 * Flags are controlled via VITE_FF_* env vars (see .env.example).
 */
export function isEnabled(flag: FeatureFlag): boolean {
  return env.flags[flag]
}
