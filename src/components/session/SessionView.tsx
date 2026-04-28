import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ExercisePanel } from './ExercisePanel'
import { RestTimer } from './RestTimer'
import { WorkoutTimer } from '@/components/shared/WorkoutTimer'
import { QuickRestGrid } from '@/components/shared/QuickRestGrid'
import { ReferenceGuideContent, ReferenceSheet } from '@/components/shared/ReferenceSheet'
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer'
import { useRestTimer } from '@/hooks/useRestTimer'
import type { SessionState, WorkoutDefinition } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SessionViewProps {
  workout: WorkoutDefinition
  sessionState: SessionState
  onSessionUpdate: (state: SessionState) => void
  onEndSession: () => void
}

export function SessionView({ workout, sessionState, onSessionUpdate, onEndSession }: SessionViewProps) {
  const { elapsed, running, start: startTimer } = useWorkoutTimer()
  const restTimer = useRestTimer()
  const workoutExercises = workout.exercises
  const workoutBlocks = workout.blocks

  useEffect(() => { startTimer() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const lastExerciseIndex = Math.max(workoutExercises.length - 1, 0)
  const currentIndex = Math.min(sessionState.currentIndex, lastExerciseIndex)
  const current = workoutExercises[currentIndex]
  const block = workoutBlocks.find(b => b.id === current.block)!
  const setsCompleted = sessionState.setProgress[current.id] ?? 0
  const isFirst = currentIndex === 0
  const isLast = currentIndex === lastExerciseIndex

  const goNext = () => {
    if (isLast) return
    onSessionUpdate({ ...sessionState, currentIndex: currentIndex + 1 })
  }

  const goPrev = () => {
    if (isFirst) return
    onSessionUpdate({ ...sessionState, currentIndex: currentIndex - 1 })
  }

  const handleRestStart = (seconds: number) => restTimer.start(seconds)

  const totalSets = workoutExercises.reduce((acc, ex) => {
    const match = ex.sets.match(/^(\d+)/)
    return acc + (match ? parseInt(match[1], 10) : 0)
  }, 0)

  const completedSets = Object.values(sessionState.setProgress).reduce((a, b) => a + b, 0)
  const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
  const completedExerciseIds = Object.entries(sessionState.setProgress)
    .filter(([, count]) => count > 0)
    .map(([id]) => id)
  const previousExercises = workoutExercises.slice(Math.max(0, currentIndex - 2), currentIndex)
  const upcomingExercises = workoutExercises.slice(currentIndex + 1, currentIndex + 5)

  return (
    <div className="min-h-screen bg-iron-900 lg:h-full lg:overflow-hidden lg:grid lg:grid-cols-[17rem_minmax(0,1fr)_21rem]">
      <aside className="hidden lg:flex lg:min-h-0 lg:flex-col lg:border-r lg:border-iron-800/80 lg:bg-iron-950/55">
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:min-h-0">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-iron-500">Live Session</p>
              <div>
                <h2 className="text-3xl font-black tracking-tight text-iron-50">{workout.name}</h2>
                <p className="mt-1 text-sm text-iron-500">Exercise {currentIndex + 1} of {workoutExercises.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-iron-800/80 py-5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Progress</p>
                <p className="text-2xl font-black text-iron-100">{progressPct}%</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Logged</p>
                <p className="text-2xl font-black text-iron-100">{completedSets}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Done</p>
                <p className="text-2xl font-black text-iron-100">{completedExerciseIds.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Rest</p>
                <p className="text-2xl font-black text-iron-100">{current.rest}</p>
              </div>
            </div>

            <section className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Current Block</p>
              <div className="rounded-[22px] border border-iron-800/80 bg-iron-900/70 p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-mono font-black"
                    style={{ color: block.accent, borderColor: `${block.accent}45`, backgroundColor: `${block.accent}15` }}
                  >
                    {block.id}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-iron-100">{block.name}</p>
                    <p className="text-xs text-iron-500">{block.detail}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-iron-400">{block.summary}</p>
              </div>
            </section>

            <section className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Queue</p>
              <div className="space-y-2.5">
                {previousExercises.map(ex => (
                  <div key={ex.id} className="rounded-xl border border-iron-800/70 bg-iron-900/55 px-3 py-2.5 opacity-65">
                    <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Completed</p>
                    <p className="mt-1 text-sm text-iron-200">{ex.name}</p>
                  </div>
                ))}

                <div className="rounded-xl border border-iron-700/80 bg-iron-900 px-3 py-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.28em]" style={{ color: block.accent }}>Current</p>
                  <p className="mt-1 text-sm font-semibold text-iron-50">{current.name}</p>
                </div>

                {upcomingExercises.map(ex => (
                  <div key={ex.id} className="rounded-xl border border-iron-800/70 bg-iron-900/55 px-3 py-2.5">
                    <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Up Next</p>
                    <p className="mt-1 text-sm text-iron-200">{ex.name}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex flex-col lg:min-h-0">
        <div className="shrink-0 flex items-center justify-between border-b border-iron-800 px-4 py-3 lg:px-8 lg:py-6">
          <div className="space-y-1">
            <div className="hidden lg:block">
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Workout Workspace</p>
              <p className="text-sm text-iron-400">{block.name}</p>
            </div>
            <WorkoutTimer elapsed={elapsed} running={running} />
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-xs font-mono text-iron-500">{progressPct}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEndSession}
              className="h-7 px-2 text-xs text-iron-500 hover:text-iron-300"
            >
              end
            </Button>
            <div className="lg:hidden">
              <ReferenceSheet workout={workout} />
            </div>
          </div>
        </div>

        <div className="shrink-0 h-0.5 bg-iron-800">
          <div
            className="h-full bg-iron-300 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex-1 overflow-y-auto lg:min-h-0">
          <div className="px-4 py-6 lg:mx-auto lg:max-w-3xl lg:px-8 lg:py-10">
            <ExercisePanel
              exercise={current}
              block={block}
              setsCompleted={setsCompleted}
              onRestStart={handleRestStart}
            />

            <div className="mt-6 space-y-6 lg:hidden">
              <RestTimer
                active={restTimer.active}
                remaining={restTimer.remaining}
                total={current.restSec}
                onCancel={restTimer.cancel}
                label="Rest"
              />

              <div>
                <p className="mb-2 text-xs font-mono uppercase tracking-widest text-iron-500">Quick Rest</p>
                <QuickRestGrid
                  onStart={handleRestStart}
                  onCancel={restTimer.cancel}
                  remaining={restTimer.remaining}
                  active={restTimer.active}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-iron-800 px-4 pt-3 pb-4 space-y-3 lg:px-8 lg:pt-6 lg:pb-8">
          <button
            onClick={() => {
              const updated = { ...sessionState.setProgress, [current.id]: setsCompleted + 1 }
              onSessionUpdate({ ...sessionState, setProgress: updated })
            }}
            className="w-full rounded-xl py-4 font-mono text-base font-black uppercase tracking-widest shadow-lg transition-all active:scale-[0.97]"
            style={{ backgroundColor: block.accent, color: '#0d0d0f' }}
          >
            + Log Set
          </button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrev}
              disabled={isFirst}
              aria-label="Prev exercise"
              className="flex h-10 flex-1 items-center gap-1 border-iron-700 bg-iron-800 px-4 text-iron-300 hover:bg-iron-700 disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goNext}
              disabled={isLast}
              aria-label="Next exercise"
              className="flex h-10 flex-1 items-center justify-center gap-1 border-iron-700 bg-iron-800 px-4 text-iron-300 hover:bg-iron-700 disabled:opacity-30"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </main>

      <aside className="hidden lg:flex lg:min-h-0 lg:flex-col lg:border-l lg:border-iron-800/80 lg:bg-iron-950/45">
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:min-h-0">
          <div className="space-y-6">
            <section className="border-b border-iron-800/80 pb-6">
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Recovery</p>
              <div className="mt-3">
                {restTimer.active ? (
                  <RestTimer
                    active={restTimer.active}
                    remaining={restTimer.remaining}
                    total={current.restSec}
                    onCancel={restTimer.cancel}
                    label="Rest"
                  />
                ) : (
                  <div className="rounded-[22px] border border-iron-800/80 bg-iron-900/65 px-4 py-4">
                    <p className="text-sm text-iron-100">No active rest timer.</p>
                    <p className="mt-1 text-sm text-iron-500">
                      Start the prescribed rest from the workspace or launch a quick timer below.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="border-b border-iron-800/80 pb-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Quick Rest</p>
                  <p className="mt-1 text-sm text-iron-400">Manual timers without leaving the session flow.</p>
                </div>
                {current.restSec > 0 && (
                  <button
                    onClick={() => handleRestStart(current.restSec)}
                    className="rounded-full border border-iron-700 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-iron-200 hover:border-iron-500 hover:text-iron-50"
                  >
                    Prescribed
                  </button>
                )}
              </div>

              <QuickRestGrid
                className="mt-4"
                onStart={handleRestStart}
                onCancel={restTimer.cancel}
                remaining={restTimer.remaining}
                active={restTimer.active}
              />
            </section>

            <section>
              <div className="mb-4">
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Reference</p>
                <p className="mt-1 text-sm text-iron-400">Technique notes and target ranges stay visible while you train.</p>
              </div>
              <div className={cn('rounded-[24px] border border-iron-800/80 bg-iron-900/65 p-4')}>
                <ReferenceGuideContent workout={workout} compact />
              </div>
            </section>
          </div>
        </div>
      </aside>
    </div>
  )
}
