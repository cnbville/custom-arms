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
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded"
          style={{ color: block.accent, backgroundColor: block.accent + '18', border: `1px solid ${block.accent}33` }}>
          {block.id}
        </span>
        <h2 className="text-sm font-bold text-iron-100 uppercase tracking-wide">{block.name}</h2>
        <span className="text-xs text-iron-600 hidden sm:block">{block.detail}</span>
      </div>
      <div className="space-y-2">
        {exercises.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} blockAccent={block.accent} onRestStart={onRestStart} />
        ))}
      </div>
    </section>
  )
}
