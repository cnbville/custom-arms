import { Button } from '@/components/ui/button'
import { QUICK_REST_OPTIONS } from '@/data/constants'
import { formatClock } from '@/lib/format'
import { cn } from '@/lib/utils'

interface QuickRestGridProps {
  onStart: (seconds: number) => void
  onCancel?: () => void
  remaining?: number
  active?: boolean
  className?: string
}

export function QuickRestGrid({ onStart, onCancel, remaining = 0, active = false, className }: QuickRestGridProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {active && remaining > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono text-iron-100">{formatClock(remaining)}</span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-iron-400 hover:text-iron-300 transition-colors"
            >
              cancel
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-4 gap-1.5">
        {QUICK_REST_OPTIONS.map(sec => (
          <Button
            key={sec}
            variant="outline"
            size="sm"
            onClick={() => onStart(sec)}
            className="font-mono text-xs h-8 border-iron-700 bg-iron-800 hover:bg-iron-700 text-iron-300 hover:text-iron-100"
          >
            {sec}s
          </Button>
        ))}
      </div>
    </div>
  )
}
