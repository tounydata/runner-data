import { useState } from 'react'
import { useRaceStore } from './useRaceStore'
import type { RaceType } from '@runner-os/shared'

interface RaceFormProps {
  onSaved: () => void
}

export function RaceForm({ onSaved }: RaceFormProps) {
  const { addRace, loading } = useRaceStore()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [distance, setDistance] = useState('')
  const [elevation, setElevation] = useState('')
  const [type, setType] = useState<RaceType>('Trail')
  const [goalTime, setGoalTime] = useState('')

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    await addRace({
      name,
      date,
      distance: distance ? Number(distance) : null,
      elevation: elevation ? Number(elevation) : null,
      type,
      goal_time: goalTime || null,
      gpx_data: null,
      strava_activity_id: null,
      athlete_profile: null,
    })
    onSaved()
  }

  return (
    <div
      style={{
        background: 'var(--bg3)',
        border: '1px solid var(--border2)',
        borderRadius: 'var(--r)',
        padding: '1.25rem',
        marginBottom: '1.25rem',
      }}
    >
      <form
        onSubmit={(e) => {
          void handleSubmit(e)
        }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
      >
        <Field label="Nom" required>
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
            placeholder="Trail du Muguet"
            required
          />
        </Field>
        <Field label="Date" required>
          <input
            style={inputStyle}
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
            }}
            required
          />
        </Field>
        <Field label="Distance (km)">
          <input
            style={inputStyle}
            type="number"
            value={distance}
            onChange={(e) => {
              setDistance(e.target.value)
            }}
            placeholder="42"
            min="0"
            step="0.1"
          />
        </Field>
        <Field label="D+ (m)">
          <input
            style={inputStyle}
            type="number"
            value={elevation}
            onChange={(e) => {
              setElevation(e.target.value)
            }}
            placeholder="1200"
            min="0"
          />
        </Field>
        <Field label="Type">
          <select
            style={inputStyle}
            value={type}
            onChange={(e) => {
              setType(e.target.value)
            }}
          >
            <option value="Trail">Trail</option>
            <option value="Route">Route</option>
            <option value="Ultra">Ultra</option>
            <option value="Cross">Cross</option>
          </select>
        </Field>
        <Field label="Objectif">
          <input
            style={inputStyle}
            value={goalTime}
            onChange={(e) => {
              setGoalTime(e.target.value)
            }}
            placeholder="4:30:00"
          />
        </Field>

        <div style={{ gridColumn: '1/-1' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--cyan)',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontFamily: 'var(--body)',
              fontWeight: 700,
              fontSize: '.85rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '…' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  children,
  required,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: 'var(--mono)',
          fontSize: '.58rem',
          color: 'var(--text3)',
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          marginBottom: 5,
        }}
      >
        {label}
        {required === true && ' *'}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg4)',
  border: '1px solid var(--border2)',
  borderRadius: 8,
  padding: '10px 14px',
  color: 'var(--text)',
  fontFamily: 'var(--body)',
  fontSize: '.88rem',
  outline: 'none',
}
