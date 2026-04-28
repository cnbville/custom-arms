import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BlockGroup } from './BlockGroup'
import { ReferenceSheet } from '@/components/shared/ReferenceSheet'
import { exercises } from '@/data/exercises'
import { blocks } from '@/data/blocks'
import type { FocusFilter, Exercise } from '@/types'
import { cn } from '@/lib/utils'

const FILTERS: Array<{ id: FocusFilter; label: string }> = [
  { id: 'full',      label: 'Full Session' },
  { id: 'arms',      label: 'Arms Only' },
  { id: 'delts',     label: 'Delts' },
  { id: 'forearms',  label: 'Forearms' },
  { id: 'finishers', label: 'Finishers' },
]

function filterExercises(exs: Exercise[], filter: FocusFilter): Exercise[] {
  switch (filter) {
    case 'full':      return exs
    case 'arms':      return exs.filter(e => e.group === 'biceps' || e.group === 'triceps')
    case 'delts':     return exs.filter(e => e.group === 'delts')
    case 'forearms':  return exs.filter(e => e.group === 'forearms')
    case 'finishers': return exs.filter(e => e.isFinisher)
    default:          return exs
  }
}

interface OverviewViewProps {
  onStartSession: () => void
  onRestStart: (seconds: number) => void
}

export function OverviewView({ onStartSession, onRestStart }: OverviewViewProps) {
  const [filter, setFilter] = useState<FocusFilter>('full')
  const filtered = filterExercises(exercises, filter)

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      {/* App header */}
      <div className="pt-8 pb-6">
        <h1 className="text-3xl font-black tracking-tight text-iron-100 uppercase">Arm Day</h1>
        <p className="text-xs font-mono text-iron-500 mt-1 uppercase tracking-widest">Destroyer Protocol</p>
      </div>

      {/* Sticky controls */}
      <div className="sticky top-0 z-10 bg-iron-900/95 backdrop-blur-sm border-b border-iron-700/50 py-3 mb-6 -mx-4 px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 flex-wrap">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-md font-mono transition-colors',
                  filter === f.id
                    ? 'bg-iron-100 text-iron-900 font-bold'
                    : 'text-iron-500 hover:text-iron-200 hover:bg-iron-800'
                )}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ReferenceSheet />
            <Button size="sm" onClick={onStartSession}
              className="h-8 px-4 text-xs bg-iron-100 text-iron-900 hover:bg-white font-bold uppercase tracking-wide">
              Start
            </Button>
          </div>
        </div>
      </div>

      {/* Block groups */}
      <div className="space-y-8">
        {blocks.map(block => (
          <BlockGroup key={block.id} block={block}
            exercises={filtered.filter(e => e.block === block.id)}
            onRestStart={onRestStart} />
        ))}
      </div>
    </div>
  )
}
