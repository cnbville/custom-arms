import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'
import type { Exercise, Block } from '@/types'
import { cn } from '@/lib/utils'

interface ExercisePanelProps {
  exercise: Exercise
  block: Block
  setsCompleted: number
  onRestStart: (seconds: number) => void
}

function MetricBadge({ label, value, tooltip }: { label: string; value: string; tooltip: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-start gap-1 bg-iron-800 border border-iron-700/60 rounded-xl px-3.5 py-3 hover:bg-iron-700/80 hover:border-iron-600 transition-all cursor-help text-left w-full">
          <span className="text-[10px] font-mono uppercase tracking-widest text-iron-500">{label}</span>
          <span className="font-mono text-xl font-black text-iron-50 leading-none">{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-iron-800 border-iron-700 text-iron-200 text-xs p-2 max-w-48">
        {tooltip}
      </PopoverContent>
    </Popover>
  )
}

function parseSetsCount(sets: string): number {
  const match = sets.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

export function ExercisePanel({ exercise: ex, block, setsCompleted, onRestStart }: ExercisePanelProps) {
  const [scienceOpen, setScienceOpen] = useState(false)
  const totalSets = parseSetsCount(ex.sets)

  const tempoTooltip = ex.tempo === 'CTRL'
    ? 'Controlled — focus on tension throughout'
    : (() => {
        const [e, p, c] = ex.tempo.split('-')
        return `Eccentric ${e}s · Pause ${p}s · Concentric ${c}s`
      })()

  const rpeMap: Record<string, string> = {
    '8–9': '1–2 reps in reserve',
    '9': '1 rep left — heavy grinder',
    '10': 'True failure',
    '10+': 'Failure + extended technique',
  }

  return (
    <div className="space-y-5 lg:space-y-6 lg:rounded-[28px] lg:border lg:border-iron-800/80 lg:bg-iron-950/45 lg:p-8 lg:shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
      {/* Block context + set dots */}
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-widest font-bold"
          style={{ color: block.accent }}>
          {block.name}
        </span>
        {totalSets > 0 && (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSets }, (_, i) => (
              <div key={i} className={cn(
                'w-3 h-3 rounded-full border-2 transition-all',
                i < setsCompleted ? 'border-transparent scale-110' : 'bg-transparent border-iron-600'
              )} style={i < setsCompleted ? { backgroundColor: block.accent } : {}} />
            ))}
            <span className="text-xs text-iron-500 font-mono ml-1">{setsCompleted}/{totalSets}</span>
          </div>
        )}
      </div>

      {/* Exercise name */}
      <div>
        <h1 className="text-4xl font-black text-iron-100 leading-none tracking-tight lg:text-5xl">{ex.name}</h1>
        <p className="text-xs font-mono text-iron-500 mt-1.5 uppercase tracking-wider">{ex.equipment}</p>
      </div>

      {/* Metric badges — 2×2 grid */}
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <MetricBadge label="Sets & Reps" value={ex.sets} tooltip="Total sets × rep range" />
        <MetricBadge label="Tempo" value={ex.tempo} tooltip={tempoTooltip} />
        <MetricBadge label="RPE Target" value={ex.rpe} tooltip={rpeMap[ex.rpe] ?? ex.rpe} />
        <MetricBadge label="Rest After" value={ex.rest} tooltip="Rest before next exercise" />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {ex.restSec > 0 ? (
          <button
            onClick={() => onRestStart(ex.restSec)}
            className="rounded-full border border-iron-700 bg-iron-900 px-3.5 py-1.5 text-xs font-mono uppercase tracking-[0.22em] text-iron-200 transition-colors hover:border-iron-500 hover:text-iron-50"
          >
            Start {ex.rest} Rest
          </button>
        ) : (
          <span className="rounded-full border border-iron-800 bg-iron-900/80 px-3.5 py-1.5 text-xs font-mono uppercase tracking-[0.22em] text-iron-500">
            Direct hand-off
          </span>
        )}

        {ex.lastSetTechnique && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Last set</span>
            <span className="text-xs font-mono font-bold text-amber-300">{ex.lastSetTechnique}</span>
          </div>
        )}

        {ex.isFinisher && (
          <span className="rounded-full border border-iron-700 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.22em] text-iron-400">
            Finisher
          </span>
        )}
      </div>

      {/* Execution cue */}
      <div className="border-l-2 pl-4 py-1" style={{ borderColor: block.accent }}>
        <p className="text-sm text-iron-200 leading-relaxed">{ex.cue}</p>
      </div>

      {/* WHY THIS WORKS */}
      <Collapsible open={scienceOpen} onOpenChange={setScienceOpen}>
        <CollapsibleTrigger asChild>
          <button aria-label="Why this works"
            className={cn(
              'flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest transition-colors',
              scienceOpen ? 'text-iron-300' : 'text-iron-500 hover:text-iron-400'
            )}>
            <ChevronDown className={cn('size-3 transition-transform', scienceOpen && 'rotate-180')} />
            Why This Works
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-xs text-iron-400 mt-2 leading-relaxed border-l-2 border-iron-700 pl-3">
            {ex.science}
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
