import { useNavigate } from 'react-router-dom'
import type { StravaActivity } from '@runner-os/shared'
import { secondsToHms } from '@runner-os/shared'

interface ActivityCardProps {
  activity: StravaActivity
  pace: string
  km: string
}

export function ActivityCard({ activity, pace, km }: ActivityCardProps) {
  const navigate = useNavigate()
  const date = new Date(activity.start_date_local).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div
      style={{
        background: 'var(--bg3)', border: '1px solid var(--border)',
        borderRadius: 9, padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 6,
        transition: 'border-color .2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border2)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontWeight: 600, fontSize: '.82rem', lineHeight: 1.3, flex: 1 }}>
          {activity.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--mono)', fontSize: '.56rem', padding: '2px 6px',
            borderRadius: 7, background: 'var(--bg4)', color: 'var(--text2)',
            whiteSpace: 'nowrap', marginLeft: 8,
          }}
        >
          {activity.type}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Stat value={km} label="km" />
        <Stat value={pace} label="/km" />
        <Stat value={secondsToHms(activity.moving_time)} label="durée" />
        {activity.total_elevation_gain > 0 && (
          <Stat value={`+${Math.round(activity.total_elevation_gain)}`} label="D+" />
        )}
      </div>

      {activity.average_heartrate && (
        <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--red)' }}>
          ♥ {Math.round(activity.average_heartrate)} bpm moy
        </div>
      )}

      <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'var(--text3)' }}>
        {date}
      </div>

      <button
        onClick={() => navigate(`/analysis?activityId=${activity.id}`)}
        style={{
          width: '100%', marginTop: 4, background: 'var(--bg4)',
          border: '1px solid var(--border2)', color: 'var(--text2)',
          borderRadius: 7, padding: 7, cursor: 'pointer',
          fontFamily: 'var(--mono)', fontSize: '.58rem', textAlign: 'center',
        }}
      >
        Analyser avec IA →
      </button>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '.78rem', fontWeight: 500 }}>{value}</div>
      <div style={{ fontSize: '.58rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
    </div>
  )
}
