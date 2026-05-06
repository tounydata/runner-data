import { useEffect } from 'react'
import { useStravaStore } from './useStravaStore'
import { ActivityCard } from './ActivityCard'
import { speedToPace, metresToKm } from '@runner-os/shared'

export function ActivitiesPage() {
  const { activities, loading, error, loadActivities, connectStrava } = useStravaStore()

  useEffect(() => {
    void loadActivities()
  }, [loadActivities])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }}>🏃</div>
        <div style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: '.5rem' }}>
          Aucune activité
        </div>
        <div style={{ color: 'var(--text2)', marginBottom: '1.5rem' }}>
          Connecte ton compte Strava pour importer tes activités.
        </div>
        <button
          onClick={connectStrava}
          style={{
            background: '#fc4c02',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontFamily: 'var(--body)',
            fontWeight: 700,
            fontSize: '.88rem',
            cursor: 'pointer',
          }}
        >
          Connecter Strava
        </button>
      </div>
    )
  }

  const runActivities = activities.filter((a) => ['Run', 'TrailRun', 'VirtualRun'].includes(a.type))

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '.56rem',
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: '.1em',
          }}
        >
          Activités running ({runActivities.length})
        </div>
        {error && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--red)' }}>
            {error}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))',
          gap: 10,
        }}
      >
        {runActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            pace={speedToPace(activity.average_speed)}
            km={metresToKm(activity.distance)}
          />
        ))}
      </div>
    </div>
  )
}
