import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatClock } from '@/lib/format'

interface RestTimerProps {
  active: boolean
  remaining: number
  total: number
  onCancel: () => void
  label?: string
}

export function RestTimer({ active, remaining, total, onCancel, label }: RestTimerProps) {
  if (!active) return null

  const pct = total > 0 ? Math.round(((total - remaining) / total) * 100) : 0

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div>
          {label && <p className="text-xs text-iron-400 font-mono mb-0.5">{label}</p>}
          <p className="font-mono text-2xl font-medium text-iron-100">{formatClock(remaining)}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} aria-label="Cancel rest"
          className="text-iron-500 hover:text-iron-300 h-7 text-xs px-2">
          cancel
        </Button>
      </div>
      <Progress value={pct} className="h-1.5 bg-iron-700 [&>div]:bg-accent-biceps" />
    </div>
  )
}
