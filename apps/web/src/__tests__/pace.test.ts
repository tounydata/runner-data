import { describe, it, expect } from 'vitest'
import { speedToPace, secondsToHms, hmsToSeconds, metresToKm, gapFactor } from '@runner-os/shared'

describe('speedToPace', () => {
  it('converts 3 m/s to 5:33 /km', () => {
    expect(speedToPace(3)).toBe('5:33')
  })
  it('handles 0 m/s', () => {
    expect(speedToPace(0)).toBe('—')
  })
  it('handles negative speed', () => {
    expect(speedToPace(-1)).toBe('—')
  })
})

describe('secondsToHms', () => {
  it('formats 3661 seconds as 1:01:01', () => {
    expect(secondsToHms(3661)).toBe('1:01:01')
  })
  it('formats 310 seconds as 5:10', () => {
    expect(secondsToHms(310)).toBe('5:10')
  })
})

describe('hmsToSeconds', () => {
  it('converts 1:30:00 to 5400', () => {
    expect(hmsToSeconds('1:30:00')).toBe(5400)
  })
  it('converts 5:30 to 330', () => {
    expect(hmsToSeconds('5:30')).toBe(330)
  })
  it('roundtrips with secondsToHms', () => {
    const original = 7265
    expect(hmsToSeconds(secondsToHms(original))).toBe(original)
  })
})

describe('metresToKm', () => {
  it('converts 10500 to "10.5"', () => {
    expect(metresToKm(10500)).toBe('10.5')
  })
})

describe('gapFactor', () => {
  it('returns ~1 on flat terrain', () => {
    expect(gapFactor(0)).toBeCloseTo(1, 1)
  })
  it('returns > 1 on uphill', () => {
    expect(gapFactor(0.1)).toBeGreaterThan(1)
  })
  it('returns < 1 on gentle downhill', () => {
    expect(gapFactor(-0.05)).toBeLessThan(1)
  })
  it('clamps extreme grades', () => {
    const steep = gapFactor(1.0)
    const capped = gapFactor(0.45)
    expect(steep).toBe(capped)
  })
})
