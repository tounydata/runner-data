import { describe, it, expect } from 'vitest'
import { raceInsertSchema } from '@runner-os/shared'

describe('raceInsertSchema', () => {
  it('accepts a valid race', () => {
    const result = raceInsertSchema.safeParse({
      user_id: '00000000-0000-0000-0000-000000000001',
      name: 'Trail du Muguet',
      date: '2026-06-15',
      distance: 42,
      elevation: 2000,
      type: 'Trail',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = raceInsertSchema.safeParse({
      user_id: '00000000-0000-0000-0000-000000000001',
      name: '',
      date: '2026-06-15',
      distance: 42,
      elevation: 2000,
      type: 'Trail',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid date format', () => {
    const result = raceInsertSchema.safeParse({
      user_id: '00000000-0000-0000-0000-000000000001',
      name: 'Some Race',
      date: '15/06/2026',
      type: 'Trail',
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative distance', () => {
    const result = raceInsertSchema.safeParse({
      user_id: '00000000-0000-0000-0000-000000000001',
      name: 'Some Race',
      date: '2026-06-15',
      distance: -5,
      type: 'Trail',
    })
    expect(result.success).toBe(false)
  })
})
