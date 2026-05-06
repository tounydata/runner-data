import type { ReactNode } from 'react'
import { NavBar } from './NavBar'
import { TabBar } from './TabBar'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <NavBar />
      <main
        style={{
          padding: '5.5rem 2rem 6rem',
          maxWidth: '1440px',
          margin: '0 auto',
        }}
      >
        {children}
      </main>
      <TabBar />
    </>
  )
}
