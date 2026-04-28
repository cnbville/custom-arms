import { useState, useRef, useCallback } from 'react'

interface WorkoutTimer {
  elapsed: number
  running: boolean
  start: () => void
  stop: () => void
  reset: () => void
}

export function useWorkoutTimer(): WorkoutTimer {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (intervalRef.current) return
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setElapsed(e => e + 1)
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setElapsed(0)
    setRunning(false)
  }, [])

  return { elapsed, running, start, stop, reset }
}
