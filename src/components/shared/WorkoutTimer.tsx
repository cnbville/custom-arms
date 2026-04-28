import { formatClock } from '@/lib/format'
import { cn } from '@/lib/utils'

interface WorkoutTimerProps {
  elapsed: number
  running?: boolean
  className?: string
}

export function WorkoutTimer({ elapsed, running = false, className }: WorkoutTimerProps) {
  return (
    <div
      role="status"
      aria-label={`Workout time: ${formatClock(elapsed)}`}
      className={cn('flex items-center gap-2 font-mono text-sm text-iron-300', className)}
    >
      {running && (
        <span className="size-1.5 rounded-full bg-accent-biceps animate-pulse" aria-hidden />
      )}
      <span>{formatClock(elapsed)}</span>
    </div>
  )
}
