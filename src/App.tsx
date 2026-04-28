import { useCallback } from 'react'
import { OverviewView } from '@/components/overview/OverviewView'
import { SessionView } from '@/components/session/SessionView'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useRestTimer } from '@/hooks/useRestTimer'
import type { SessionState } from '@/types'
import { DEFAULT_SESSION_STATE } from '@/types'

type View = 'overview' | 'session'

export default function App() {
  const [view, setView] = useLocalStorage<View>('add-view', 'overview')
  const [sessionState, setSessionState] = useLocalStorage<SessionState>(
    'add-session', DEFAULT_SESSION_STATE
  )
  const restTimer = useRestTimer()

  const startSession = useCallback(() => {
    setSessionState({ ...DEFAULT_SESSION_STATE, started: true, startedAt: Date.now() })
    setView('session')
  }, [setSessionState, setView])

  const endSession = useCallback(() => {
    setSessionState(DEFAULT_SESSION_STATE)
    setView('overview')
  }, [setSessionState, setView])

  if (view === 'session' && sessionState.started) {
    return (
      <SessionView
        sessionState={sessionState}
        onSessionUpdate={setSessionState}
        onEndSession={endSession}
      />
    )
  }

  return (
    <OverviewView
      onStartSession={startSession}
      onRestStart={restTimer.start}
    />
  )
}
