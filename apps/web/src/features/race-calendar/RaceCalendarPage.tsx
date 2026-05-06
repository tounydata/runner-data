import { useEffect, useState } from 'react'
import { useRaceStore } from './useRaceStore'
import { RaceForm } from './RaceForm'
import type { Race } from '@runner-os/shared'

export function RaceCalendarPage() {
  const { races, loading, loadRaces, deleteRace } = useRaceStore()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    void loadRaces()
  }, [loadRaces])

  const upcoming = races.filter((r) => new Date(r.date) >= new Date())
  const past = races.filter((r) => new Date(r.date) < new Date())

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', letterSpacing: '.03em' }}>
          Calendrier courses
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: 'var(--cyan)', color: '#000', border: 'none',
            borderRadius: 8, padding: '8px 16px', fontFamily: 'var(--body)',
            fontWeight: 700, fontSize: '.82rem', cursor: 'pointer',
          }}
        >
          + Ajouter
        </button>
      </div>

      {showForm && <RaceForm onSaved={() => setShowForm(false)} />}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.56rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem' }}>
                À venir
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcoming.map((race) => <RaceItem key={race.id} race={race} onDelete={deleteRace} />)}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.56rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem' }}>
                Passées
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: .6 }}>
                {past.map((race) => <RaceItem key={race.id} race={race} onDelete={deleteRace} />)}
              </div>
            </section>
          )}

          {races.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)', fontFamily: 'var(--mono)', fontSize: '.75rem' }}>
              Aucune course planifiée
            </div>
          )}
        </>
      )}
    </div>
  )
}

function RaceItem({ race, onDelete }: { race: Race; onDelete: (id: string) => Promise<void> }) {
  const date = new Date(race.date)
  const daysLeft = Math.ceil((date.getTime() - Date.now()) / 86400000)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9 }}>
      <div style={{ textAlign: 'center', minWidth: 60 }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', letterSpacing: '.02em', lineHeight: 1 }}>
          {date.getDate()}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '.54rem', color: 'var(--text3)', textTransform: 'uppercase' }}>
          {date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '.88rem', marginBottom: 3 }}>{race.name}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--text2)' }}>
          {[
            race.distance && `${race.distance} km`,
            race.elevation && `+${race.elevation} m`,
            race.type,
          ].filter(Boolean).join(' · ')}
        </div>
        {daysLeft > 0 && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: '.56rem', color: 'var(--cyan)', marginTop: 3 }}>
            J-{daysLeft}
          </div>
        )}
      </div>

      <button
        onClick={() => void onDelete(race.id)}
        style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1rem', padding: '4px 8px' }}
        aria-label="Supprimer"
      >
        ×
      </button>
    </div>
  )
}
