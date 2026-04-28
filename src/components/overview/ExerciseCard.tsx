import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'
import type { Exercise } from '@/types'
import { cn } from '@/lib/utils'

interface ExerciseCardProps {
  exercise: Exercise
  blockAccent: string
  onRestStart: (seconds: number) => void
}

function MetricPill({ label, value, tooltip }: { label: string; value: string; tooltip: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-center gap-0.5 cursor-help group px-1">
          <span className="text-[9px] font-mono uppercase tracking-widest text-iron-500 group-hover:text-iron-400">{label}</span>
          <span className="font-mono text-sm font-bold text-iron-200 group-hover:text-iron-50 transition-colors leading-none">{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-iron-800 border-iron-700 text-iron-200 text-xs p-2 max-w-48">
        {tooltip}
      </PopoverContent>
    </Popover>
  )
}

export function ExerciseCard({ exercise: ex, blockAccent, onRestStart }: ExerciseCardProps) {
  const [open, setOpen] = useState(false)
  const [scienceOpen, setScienceOpen] = useState(false)

  const tempoTooltip = ex.tempo === 'CTRL'
    ? 'Controlled — focus on tension throughout'
    : `Eccentric ${ex.tempo.split('-')[0]}s · Pause ${ex.tempo.split('-')[1]}s · Concentric ${ex.tempo.split('-')[2]}s`

  const rpeTooltip: Record<string, string> = {
    '8–9': '1–2 reps in reserve',
    '9': '1 rep left — heavy grinder',
    '10': 'True failure',
    '10+': 'Failure + extended technique',
  }

  return (
    <div
      className="rounded-xl overflow-hidden bg-iron-800/70 border border-iron-700/40 transition-all duration-200"
      style={{ borderLeft: `3px solid ${blockAccent}` }}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <div
            aria-label={ex.name}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setOpen(prev => !prev)
              }
            }}
            className="w-full cursor-pointer text-left px-4 pt-3.5 pb-3.5 hover:bg-iron-700/25 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-iron-500">{ex.id.toUpperCase()}</span>
                  {ex.lastSetTechnique && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400">{ex.lastSetTechnique}</span>
                  )}
                </div>
                <p className="text-lg font-bold text-iron-50 leading-snug tracking-tight">{ex.name}</p>
                <p className="text-[11px] font-mono text-iron-500 mt-0.5 uppercase tracking-wide">{ex.equipment}</p>
              </div>
              <ChevronDown className={cn('size-4 text-iron-500 mt-1 shrink-0 transition-transform duration-200', open && 'rotate-180')} />
            </div>

            {/* Metric pills row */}
            <div className="flex items-center gap-3 mt-3.5 pt-3 border-t border-iron-700/40">
              <MetricPill label="Sets" value={ex.sets} tooltip="Sets × rep range" />
              <div className="w-px h-7 bg-iron-700/60" />
              <MetricPill label="Tempo" value={ex.tempo} tooltip={tempoTooltip} />
              <div className="w-px h-7 bg-iron-700/60" />
              <MetricPill label="RPE" value={ex.rpe} tooltip={rpeTooltip[ex.rpe] ?? ex.rpe} />
              <div className="w-px h-7 bg-iron-700/60" />
              <MetricPill label="Rest" value={ex.rest} tooltip="Rest period before next exercise" />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 pt-1 space-y-3 border-t border-iron-700/40">
            {/* Cue */}
            <p className="text-sm text-iron-300 leading-relaxed pl-3 py-1 border-l-2"
              style={{ borderColor: blockAccent }}>
              {ex.cue}
            </p>

            {/* Science */}
            <Collapsible open={scienceOpen} onOpenChange={setScienceOpen}>
              <CollapsibleTrigger className="text-xs font-mono text-iron-500 hover:text-iron-300 transition-colors flex items-center gap-1">
                <ChevronDown className={cn('size-3 transition-transform duration-200', scienceOpen && 'rotate-180')} />
                WHY THIS WORKS
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="text-xs text-iron-500 mt-1.5 leading-relaxed">{ex.science}</p>
              </CollapsibleContent>
            </Collapsible>

            {/* Rest action */}
            {ex.restSec > 0 && (
              <Button size="sm" variant="outline"
                onClick={() => onRestStart(ex.restSec)}
                aria-label="Start rest"
                className="h-7 text-xs border-iron-600 bg-iron-700 hover:bg-iron-600 text-iron-200">
                Start rest · {ex.rest}
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
