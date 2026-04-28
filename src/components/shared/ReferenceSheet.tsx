import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { TEMPO_GUIDE, RPE_DATA, TECHNIQUE_GLOSSARY } from '@/data/constants'
import { cn } from '@/lib/utils'
import type { WorkoutDefinition } from '@/types'

interface ReferenceGuideContentProps {
  workout: WorkoutDefinition
  compact?: boolean
}

export function ReferenceGuideContent({ workout, compact = false }: ReferenceGuideContentProps) {
  return (
    <div className={cn('space-y-6', compact && 'space-y-5')}>
      <section>
        <h3 className="text-xs font-mono uppercase tracking-widest text-iron-400 mb-2">Tempo</h3>
        <p className="text-sm text-iron-300 mb-1">{TEMPO_GUIDE.format}</p>
        <p className="text-sm font-mono text-iron-100">{TEMPO_GUIDE.example}</p>
        <div className="mt-2 space-y-1">
          {TEMPO_GUIDE.fields.map(f => (
            <div key={f.position} className="flex gap-2 text-sm">
              <span className="font-mono text-iron-400 w-4">{f.position}</span>
              <span className="text-iron-300">{f.label} — {f.description}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-iron-400 mt-1">CTRL = {TEMPO_GUIDE.special.CTRL}</p>
      </section>

      <section>
        <h3 className="text-xs font-mono uppercase tracking-widest text-iron-400 mb-2">RPE Scale</h3>
        <div className="space-y-1.5">
          {RPE_DATA.map(r => (
            <div key={r.label} className="flex items-center gap-2 text-sm">
              <span className="font-mono text-xs w-16" style={{ color: r.color }}>{r.label}</span>
              <span className="text-iron-300">{r.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-mono uppercase tracking-widest text-iron-400 mb-2">Techniques</h3>
        <div className="space-y-1.5">
          {TECHNIQUE_GLOSSARY.map(([name, desc]) => (
            <div key={name} className="text-sm">
              <span className="font-mono text-iron-100">{name}</span>
              <span className="text-iron-400"> — </span>
              <span className="text-iron-300">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-mono uppercase tracking-widest text-iron-400 mb-2">Volume Targets</h3>
        <div className="space-y-2">
          {workout.volumeTargets.map(item => (
            <div key={item.label} className="flex items-start justify-between gap-4 border-b border-iron-800/80 pb-2 last:border-b-0 last:pb-0">
              <div>
                <p className="text-sm font-mono" style={{ color: item.color }}>{item.label}</p>
                <p className="text-xs text-iron-500">{item.landmark}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-iron-200">{item.setsPerSession} / session</p>
                <p className="text-xs text-iron-500">{item.weeklyRaw} weekly raw</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

interface ReferenceSheetProps {
  workout: WorkoutDefinition
}

export function ReferenceSheet({ workout }: ReferenceSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Reference guide"
          className="size-8 rounded-md text-iron-400 hover:text-iron-100 hover:bg-iron-800 font-mono text-sm"
        >
          ?
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-iron-900 border-t border-iron-700 text-iron-100 max-h-[80vh] overflow-y-auto"
      >
        <SheetHeader className="mb-4">
          <SheetTitle className="text-iron-100 font-sans text-base">{workout.referenceTitle}</SheetTitle>
        </SheetHeader>

        <ReferenceGuideContent workout={workout} />
      </SheetContent>
    </Sheet>
  )
}
