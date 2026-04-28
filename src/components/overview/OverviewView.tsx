import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { BlockGroup } from './BlockGroup'
import { QuickImportPanel } from './QuickImportPanel'
import { ReferenceSheet } from '@/components/shared/ReferenceSheet'
import type { QuickImportAnalysis } from '@/lib/quickImport'
import { WORKOUT_OPTIONS } from '@/data/workouts'
import type { FocusFilter, Exercise, WorkoutDefinition, WorkoutId } from '@/types'
import { cn } from '@/lib/utils'

function filterExercises(exs: Exercise[], filter: FocusFilter): Exercise[] {
  switch (filter) {
    case 'full':      return exs
    case 'finishers': return exs.filter(e => e.isFinisher)
    case 'arms':      return exs.filter(e => e.group === 'biceps' || e.group === 'triceps')
    default:          return exs
      .filter(e => e.group === filter)
  }
}

interface FilterButtonProps {
  id: string
  label: string
  active: boolean
  onSelect: (id: string) => void
  className?: string
}

function FilterButton({ id, label, active, onSelect, className }: FilterButtonProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        'rounded-md font-mono transition-colors',
        active
          ? 'bg-iron-100 text-iron-900 font-bold'
          : 'text-iron-500 hover:text-iron-200 hover:bg-iron-800',
        className
      )}
    >
      {label}
    </button>
  )
}

interface OverviewViewProps {
  workout: WorkoutDefinition
  workouts: Record<WorkoutId, WorkoutDefinition>
  selectedWorkoutId: WorkoutId
  onWorkoutSelect: (id: WorkoutId) => void
  onStartSession: () => void
  onRestStart: (seconds: number) => void
  importedCounts: Record<WorkoutId, number>
  onApplyImport: (analysis: QuickImportAnalysis) => void
  onClearImported: (workoutId: WorkoutId) => void
}

export function OverviewView({
  workout,
  workouts,
  selectedWorkoutId,
  onWorkoutSelect,
  onStartSession,
  onRestStart,
  importedCounts,
  onApplyImport,
  onClearImported,
}: OverviewViewProps) {
  const [filter, setFilter] = useState<FocusFilter>('full')

  useEffect(() => {
    setFilter('full')
  }, [workout.id])

  const filtered = filterExercises(workout.exercises, filter)
  const activeFilterLabel = workout.filters.find(entry => entry.id === filter)?.label ?? 'Full Session'
  const finisherCount = workout.exercises.filter(ex => ex.isFinisher).length
  const summaryCount = workout.exercises.filter(ex => workout.summaryGroups.includes(ex.group)).length

  return (
    <div className="min-h-screen lg:min-h-full lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="hidden lg:flex lg:flex-col lg:justify-between lg:border-r lg:border-iron-800/80 lg:bg-iron-950/55 lg:px-6 lg:py-8">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-iron-500">Desktop Console</p>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-iron-50 uppercase leading-none">{workout.name}</h1>
              <p className="text-[11px] font-mono text-iron-500 mt-2 uppercase tracking-[0.3em]">{workout.subtitle}</p>
            </div>
            <p className="text-sm leading-relaxed text-iron-400">{workout.overviewDescription}</p>
          </div>

          <section className="space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Workout</p>
            <div className="grid grid-cols-2 gap-2">
              {WORKOUT_OPTIONS.map(option => (
                <FilterButton
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  active={selectedWorkoutId === option.id}
                  onSelect={(id) => onWorkoutSelect(id as WorkoutId)}
                  className="w-full px-3 py-2 text-center text-sm"
                />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-y border-iron-800/80 py-5">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Exercises</p>
              <p className="text-2xl font-black text-iron-100">{workout.exercises.length}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Blocks</p>
              <p className="text-2xl font-black text-iron-100">{workout.blocks.length}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">{workout.summaryLabel}</p>
              <p className="text-2xl font-black text-iron-100">{summaryCount}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Finishers</p>
              <p className="text-2xl font-black text-iron-100">{finisherCount}</p>
            </div>
          </div>

          <section className="space-y-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Focus</p>
            <div className="flex flex-col gap-2">
              {workout.filters.map(entry => (
                <FilterButton
                  key={entry.id}
                  id={entry.id}
                  label={entry.label}
                  active={filter === entry.id}
                  onSelect={(id) => setFilter(id as FocusFilter)}
                  className="w-full px-3 py-2 text-left text-sm"
                />
              ))}
            </div>
          </section>
        </div>

        <section className="space-y-3 border-t border-iron-800/80 pt-5">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Session Map</p>
            <div className="space-y-2">
              {workout.blocks.map(block => (
                <div key={block.id} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md border text-[11px] font-mono font-black"
                  style={{ color: block.accent, borderColor: `${block.accent}45`, backgroundColor: `${block.accent}12` }}
                >
                  {block.id}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-iron-100">{block.name}</p>
                  <p className="text-xs text-iron-500">{block.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>

      <main className="min-w-0">
        <div className="mx-auto max-w-5xl px-4 pb-16 lg:px-8 lg:py-8 lg:pb-10">
          <div className="pt-10 pb-7 lg:hidden">
            <div className="flex flex-wrap gap-2 pb-5">
              {WORKOUT_OPTIONS.map(option => (
                <FilterButton
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  active={selectedWorkoutId === option.id}
                  onSelect={(id) => onWorkoutSelect(id as WorkoutId)}
                  className="px-3 py-1.5 text-sm"
                />
              ))}
            </div>
            <h1 className="text-5xl font-black tracking-tight text-iron-50 uppercase leading-none">{workout.name}</h1>
            <p className="text-[11px] font-mono text-iron-500 mt-2 uppercase tracking-[0.3em]">{workout.subtitle}</p>
          </div>

          <div className="sticky top-0 z-10 -mx-4 mb-6 border-b border-iron-700/50 bg-iron-900/95 px-4 py-3 backdrop-blur-sm lg:static lg:mx-0 lg:mb-8 lg:border-b lg:border-iron-800/80 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <div className="flex items-center justify-between gap-3 lg:items-end lg:py-6">
              <div className="flex items-center gap-1 flex-wrap lg:hidden">
                {workout.filters.map(entry => (
                  <FilterButton
                    key={entry.id}
                    id={entry.id}
                    label={entry.label}
                    active={filter === entry.id}
                    onSelect={(id) => setFilter(id as FocusFilter)}
                    className="px-2.5 py-1 text-xs"
                  />
                ))}
              </div>

              <div className="hidden lg:block">
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">Workspace</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-iron-50">{activeFilterLabel}</h2>
                <p className="mt-1 text-sm text-iron-500">{workout.workspaceDescription}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <ReferenceSheet workout={workout} />
                <Button
                  size="sm"
                  onClick={onStartSession}
                  className="h-8 px-4 text-xs bg-iron-100 text-iron-900 hover:bg-white font-bold uppercase tracking-wide lg:h-10 lg:px-5"
                >
                  Start {workout.startLabel}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:space-y-10">
            <QuickImportPanel
              workouts={workouts}
              currentWorkoutId={selectedWorkoutId}
              importedCounts={importedCounts}
              onApplyImport={onApplyImport}
              onClearImported={onClearImported}
            />

            {workout.blocks.map(block => (
              <BlockGroup
                key={block.id}
                block={block}
                exercises={filtered.filter(e => e.block === block.id)}
                onRestStart={onRestStart}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
