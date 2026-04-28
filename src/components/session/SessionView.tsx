import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ExercisePanel } from './ExercisePanel'
import { RestTimer } from './RestTimer'
import { WorkoutTimer } from '@/components/shared/WorkoutTimer'
import { QuickRestGrid } from '@/components/shared/QuickRestGrid'
import { ReferenceSheet } from '@/components/shared/ReferenceSheet'
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer'
import { useRestTimer } from '@/hooks/useRestTimer'
import { exercises } from '@/data/exercises'
import { blocks } from '@/data/blocks'
import type { SessionState } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SessionViewProps {
  sessionState: SessionState
  onSessionUpdate: (state: SessionState) => void
  onEndSession: () => void
}

export function SessionView({ sessionState, onSessionUpdate, onEndSession }: SessionViewProps) {
  const { elapsed, running, start: startTimer } = useWorkoutTimer()
  const restTimer = useRestTimer()

  useEffect(() => { startTimer() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const current = exercises[sessionState.currentIndex]
  const block = blocks.find(b => b.id === current.block)!
  const setsCompleted = sessionState.setProgress[current.id] ?? 0
  const isFirst = sessionState.currentIndex === 0
  const isLast = sessionState.currentIndex === exercises.length - 1

  const goNext = () => {
    if (isLast) return
    onSessionUpdate({ ...sessionState, currentIndex: sessionState.currentIndex + 1 })
  }

  const goPrev = () => {
    if (isFirst) return
    onSessionUpdate({ ...sessionState, currentIndex: sessionState.currentIndex - 1 })
  }

  const handleRestStart = (seconds: number) => restTimer.start(seconds)

  const totalSets = exercises.reduce((acc, ex) => {
    const match = ex.sets.match(/^(\d+)/)
    return acc + (match ? parseInt(match[1], 10) : 0)
  }, 0)

  const completedSets = Object.values(sessionState.setProgress).reduce((a, b) => a + b, 0)
  const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0

  return (
    <div className="min-h-screen bg-iron-900 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-iron-800">
        <WorkoutTimer elapsed={elapsed} running={running} />
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-iron-500">{progressPct}%</span>
          <Button variant="ghost" size="sm" onClick={onEndSession}
            className="text-xs text-iron-500 hover:text-iron-300 h-7 px-2">
            end
          </Button>
          <ReferenceSheet />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-iron-800">
        <div className="h-full bg-iron-300 transition-all duration-300"
          style={{ width: `${progressPct}%` }} />
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <ExercisePanel
          exercise={current}
          block={block}
          setsCompleted={setsCompleted}
          onRestStart={handleRestStart}
        />

        {/* Rest timer */}
        <RestTimer
          active={restTimer.active}
          remaining={restTimer.remaining}
          total={current.restSec}
          onCancel={restTimer.cancel}
          label="Rest"
        />

        {/* Quick rest grid */}
        <div>
          <p className="text-xs font-mono text-iron-500 uppercase tracking-widest mb-2">Quick Rest</p>
          <QuickRestGrid
            onStart={handleRestStart}
            onCancel={restTimer.cancel}
            remaining={restTimer.remaining}
            active={restTimer.active}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-iron-800 px-4 pt-3 pb-4 space-y-3">
        {/* +1 Set — primary action */}
        <button
          onClick={() => {
            const updated = { ...sessionState.setProgress, [current.id]: setsCompleted + 1 }
            onSessionUpdate({ ...sessionState, setProgress: updated })
          }}
          className="w-full py-3 rounded-xl font-mono font-bold text-sm uppercase tracking-widest transition-all active:scale-95"
          style={{ backgroundColor: block.accent + '22', border: `1px solid ${block.accent}55`, color: block.accent }}>
          + Log Set
        </button>

        {/* Prev / Next */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={goPrev} disabled={isFirst}
            aria-label="Prev exercise"
            className="flex items-center gap-1 border-iron-700 bg-iron-800 hover:bg-iron-700 text-iron-300 disabled:opacity-30 h-10 px-4 flex-1">
            <ChevronLeft className="size-4" />
            Prev
          </Button>
          <Button variant="outline" size="sm" onClick={goNext} disabled={isLast}
            aria-label="Next exercise"
            className="flex items-center justify-center gap-1 border-iron-700 bg-iron-800 hover:bg-iron-700 text-iron-300 disabled:opacity-30 h-10 px-4 flex-1">
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
