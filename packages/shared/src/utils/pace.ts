/** Convert m/s speed to min/km pace string e.g. "5:23" */
export function speedToPace(speedMs: number): string {
  if (speedMs <= 0) return '—'
  const secondsPerKm = 1000 / speedMs
  const minutes = Math.floor(secondsPerKm / 60)
  const seconds = Math.round(secondsPerKm % 60)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/** Convert seconds duration to HH:MM:SS string */
export function secondsToHms(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Parse "MM:SS" or "H:MM:SS" pace/time string to total seconds */
export function hmsToSeconds(hms: string): number {
  const parts = hms.split(':').map(Number)
  if (parts.length === 2) {
    const [m = 0, s = 0] = parts
    return m * 60 + s
  }
  const [h = 0, m = 0, s = 0] = parts
  return h * 3600 + m * 60 + s
}

/** Convert metres to km with 1 decimal */
export function metresToKm(metres: number): string {
  return (metres / 1000).toFixed(1)
}

/**
 * Grade-Adjusted Pace factor (Minetti model).
 * grade: rise/run ratio (e.g. 0.1 = 10% incline)
 */
export function gapFactor(grade: number): number {
  const g = Math.max(-0.45, Math.min(0.45, grade))
  return (
    (155.4 * Math.pow(g, 5) -
      30.4 * Math.pow(g, 4) -
      43.3 * Math.pow(g, 3) +
      46.3 * Math.pow(g, 2) +
      19.5 * g +
      3.6) /
    3.6
  )
}
