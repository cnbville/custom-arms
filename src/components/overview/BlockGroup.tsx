import type { Block, Exercise } from '@/types'
import { ExerciseCard } from './ExerciseCard'

interface BlockGroupProps {
  block: Block
  exercises: Exercise[]
  onRestStart: (seconds: number) => void
}

export function BlockGroup({ block, exercises, onRestStart }: BlockGroupProps) {
  if (exercises.length === 0) return null

  return (
    <section id={`block-${block.id}`}>
      <div className="flex items-center gap-3 mb-4">
        <span
          className="font-mono text-sm font-black w-7 h-7 rounded-md flex items-center justify-center shrink-0"
          style={{ color: block.accent, backgroundColor: block.accent + '20', border: `1px solid ${block.accent}40` }}>
          {block.id}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3">
            <h2 className="text-base font-black text-iron-100 uppercase tracking-widest">{block.name}</h2>
            <span className="text-xs text-iron-600 hidden sm:block truncate">{block.detail}</span>
          </div>
        </div>
        <div className="h-px flex-1 max-w-12" style={{ backgroundColor: block.accent + '30' }} />
      </div>
      <div className="space-y-2.5">
        {exercises.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} blockAccent={block.accent} onRestStart={onRestStart} />
        ))}
      </div>
    </section>
  )
}
