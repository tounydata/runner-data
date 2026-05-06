import { useEffect, useState } from 'react'
import { useProfileStore } from './useProfileStore'

export function ProfilePage() {
  const { profile, loading, updateProfile, loadProfile } = useProfileStore()
  const [fcMax, setFcMax] = useState('')
  const [lactateThreshold, setLactateThreshold] = useState('')
  const [weight, setWeight] = useState('')
  const [vo2max, setVo2max] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (profile) {
      setFcMax(profile.fc_max?.toString() ?? '')
      setLactateThreshold(profile.lactate_threshold?.toString() ?? '')
      setWeight(profile.weight?.toString() ?? '')
      setVo2max(profile.vo2max?.toString() ?? '')
    }
  }, [profile])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await updateProfile({
      fc_max: fcMax ? Number(fcMax) : null,
      lactate_threshold: lactateThreshold ? Number(lactateThreshold) : null,
      weight: weight ? Number(weight) : null,
      vo2max: vo2max ? Number(vo2max) : null,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', letterSpacing: '.03em', marginBottom: '1.25rem' }}>
        Profil athlète
      </div>

      <form onSubmit={(e) => void handleSave(e)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: '1.25rem' }}>
          <Field label="FC max (bpm)">
            <input style={inputStyle} type="number" value={fcMax} onChange={(e) => setFcMax(e.target.value)} placeholder="185" min="100" max="220" />
          </Field>
          <Field label="Seuil lactique (bpm)">
            <input style={inputStyle} type="number" value={lactateThreshold} onChange={(e) => setLactateThreshold(e.target.value)} placeholder="165" min="100" max="210" />
          </Field>
          <Field label="Poids (kg)">
            <input style={inputStyle} type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" min="30" max="200" step="0.1" />
          </Field>
          <Field label="VO2max (ml/kg/min)">
            <input style={inputStyle} type="number" value={vo2max} onChange={(e) => setVo2max(e.target.value)} placeholder="55" min="20" max="90" step="0.1" />
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--cyan)', color: '#000', border: 'none',
            borderRadius: 8, padding: '10px 24px', fontFamily: 'var(--body)',
            fontWeight: 700, fontSize: '.85rem', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? .6 : 1,
          }}
        >
          {saved ? '✓ Enregistré' : loading ? '…' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)',
  borderRadius: 8, padding: '10px 14px', color: 'var(--text)',
  fontFamily: 'var(--body)', fontSize: '.88rem', outline: 'none',
}
