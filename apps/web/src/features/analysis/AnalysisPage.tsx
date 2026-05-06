import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAnalysisStore } from './useAnalysisStore'
import { renderSafeMarkdown } from '@/lib/sanitize'
import { useState } from 'react'

export function AnalysisPage() {
  const [searchParams] = useSearchParams()
  const activityId = searchParams.get('activityId')
  const { result, loading, error, analyse, clear } = useAnalysisStore()
  const [safeHtml, setSafeHtml] = useState('')

  useEffect(() => {
    if (activityId) {
      void analyse(Number(activityId))
    }
    return () => clear()
  }, [activityId, analyse, clear])

  useEffect(() => {
    if (result?.summary) {
      void renderSafeMarkdown(result.summary).then(setSafeHtml)
    }
  }, [result])

  if (!activityId) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text2)', fontFamily: 'var(--mono)', fontSize: '.75rem' }}>
        Sélectionne une activité pour lancer l'analyse.
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', gap: 12 }}>
        <div className="spinner" />
        <div style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'var(--text2)' }}>
          Analyse en cours…
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--red)', fontFamily: 'var(--mono)', fontSize: '.75rem' }}>
        {error}
      </div>
    )
  }

  if (!result) return null

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div
        style={{
          background: 'linear-gradient(135deg,rgba(0,212,255,.06),rgba(167,139,250,.06))',
          border: '1px solid rgba(0,212,255,.2)',
          borderRadius: 'var(--r)', padding: '1.25rem', marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '.75rem' }}>
          <span style={{ fontSize: '1.2rem' }}>✦</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--cyan)' }}>
            Analyse IA
          </span>
        </div>
        {/* Safe: safeHtml has been sanitised through DOMPurify */}
        <div
          style={{ fontSize: '.82rem', lineHeight: 1.7, color: 'var(--text2)' }}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>

      {result.insights.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '.56rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem' }}>
            Insights
          </div>
          {result.insights.map((insight, i) => (
            <div
              key={i}
              style={{
                borderLeft: `3px solid ${insight.type === 'positive' ? 'var(--green)' : insight.type === 'warning' ? 'var(--orange)' : 'var(--text3)'}`,
                borderRadius: '0 8px 8px 0', background: 'var(--bg3)',
                padding: '9px 12px', marginBottom: 7,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '.8rem', marginBottom: 3 }}>{insight.title}</div>
              <div style={{ fontSize: '.74rem', color: 'var(--text2)', lineHeight: 1.5 }}>{insight.body}</div>
              {insight.reference && (
                <div style={{ fontFamily: 'var(--mono)', fontSize: '.56rem', color: 'var(--text3)', marginTop: 3, fontStyle: 'italic' }}>
                  {insight.reference}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {result.recommendations.length > 0 && (
        <div
          style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: '1.25rem',
          }}
        >
          <div style={{ fontFamily: 'var(--mono)', fontSize: '.56rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem' }}>
            Recommandations
          </div>
          <ul style={{ paddingLeft: '1.2rem' }}>
            {result.recommendations.map((rec, i) => (
              <li key={i} style={{ fontSize: '.82rem', color: 'var(--text2)', marginBottom: 6, lineHeight: 1.5 }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
