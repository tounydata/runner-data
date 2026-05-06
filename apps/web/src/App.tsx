import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { AuthScreen } from '@/features/auth/AuthScreen'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ActivitiesPage } from '@/features/activities/ActivitiesPage'
import { RaceCalendarPage } from '@/features/race-calendar/RaceCalendarPage'
import { AnalysisPage } from '@/features/analysis/AnalysisPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { AppShell } from '@/components/AppShell'

export function App() {
  const { session, initialised, init } = useAuthStore()

  useEffect(() => {
    void init()
  }, [init])

  if (!initialised) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!session) {
    return <AuthScreen />
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/calendar" element={<RaceCalendarPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
