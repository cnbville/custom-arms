import { useCallback, useEffect } from 'react'
import { OverviewView } from '@/components/overview/OverviewView'
import { SessionView } from '@/components/session/SessionView'
import { DEFAULT_WORKOUT_ID, WORKOUTS } from '@/data/workouts'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { applyQuickImportAnalysis, createEmptyImportedExerciseMap, mergeImportedWorkouts, type QuickImportAnalysis } from '@/lib/quickImport'
import { useRestTimer } from '@/hooks/useRestTimer'
import type { Exercise, SessionState, WorkoutId } from '@/types'
import { DEFAULT_SESSION_STATE } from '@/types'

type View = 'overview' | 'session'

export default function App() {
  const [view, setView] = useLocalStorage<View>('workout-view', 'overview')
  const [selectedWorkoutId, setSelectedWorkoutId] = useLocalStorage<WorkoutId>('workout-selected', DEFAULT_WORKOUT_ID)
  const [sessionState, setSessionState] = useLocalStorage<SessionState>(
    'workout-session', DEFAULT_SESSION_STATE
  )
  const [importedExercises, setImportedExercises] = useLocalStorage<Record<WorkoutId, Exercise[]>>(
    'workout-imported-exercises',
    createEmptyImportedExerciseMap()
  )
  const restTimer = useRestTimer()
  const workouts = mergeImportedWorkouts(WORKOUTS, importedExercises)
  const activeWorkout = workouts[selectedWorkoutId] ?? workouts[DEFAULT_WORKOUT_ID]
  const importedCounts: Record<WorkoutId, number> = {
    arms: importedExercises.arms?.length ?? 0,
    shoulders: importedExercises.shoulders?.length ?? 0,
  }

  useEffect(() => {
    document.title = `${activeWorkout.name} | Custom Workouts`
  }, [activeWorkout.name])

  const startSession = useCallback(() => {
    setSessionState({ ...DEFAULT_SESSION_STATE, started: true, startedAt: Date.now() })
    setView('session')
  }, [setSessionState, setView])

  const endSession = useCallback(() => {
    setSessionState(DEFAULT_SESSION_STATE)
    setView('overview')
  }, [setSessionState, setView])

  const applyImport = useCallback((analysis: QuickImportAnalysis) => {
    setImportedExercises(prev => applyQuickImportAnalysis(prev, analysis))
  }, [setImportedExercises])

  const clearImportedWorkout = useCallback((workoutId: WorkoutId) => {
    setImportedExercises(prev => ({
      ...prev,
      [workoutId]: [],
    }))
  }, [setImportedExercises])

  const content = view === 'session' && sessionState.started
    ? (
        <SessionView
          workout={activeWorkout}
          sessionState={sessionState}
          onSessionUpdate={setSessionState}
          onEndSession={endSession}
        />
      )
    : (
        <OverviewView
          workout={activeWorkout}
          workouts={workouts}
          selectedWorkoutId={activeWorkout.id}
          onWorkoutSelect={setSelectedWorkoutId}
          onStartSession={startSession}
          onRestStart={restTimer.start}
          importedCounts={importedCounts}
          onApplyImport={applyImport}
          onClearImported={clearImportedWorkout}
        />
      )

  return (
    <div className="min-h-screen" style={{ background: activeWorkout.shellBackground }}>
      <div className="mx-auto min-h-screen lg:flex lg:max-w-[1600px] lg:px-6 lg:py-6">
        <div className="min-h-screen lg:h-[calc(100vh-3rem)] lg:flex-1 lg:overflow-hidden lg:rounded-[30px] lg:border lg:border-iron-700/70 lg:bg-iron-900/92 lg:shadow-[0_30px_90px_rgba(0,0,0,0.45)] lg:backdrop-blur-xl">
          {content}
        </div>
      </div>
    </div>
  )
}
