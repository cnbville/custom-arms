import { useState, useRef, useCallback, useEffect } from 'react'

interface RestTimer {
  remaining: number
  active: boolean
  start: (seconds: number) => void
  cancel: () => void
  add: (seconds: number) => void
}

export function useRestTimer(onComplete?: () => void): RestTimer {
  const [remaining, setRemaining] = useState(0)
  const [active, setActive] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback((seconds: number) => {
    clear()
    setRemaining(seconds)
    setActive(true)
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clear()
          setActive(false)
          onCompleteRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clear])

  const cancel = useCallback(() => {
    clear()
    setActive(false)
    setRemaining(0)
  }, [clear])

  const add = useCallback((seconds: number) => {
    setRemaining(prev => prev + seconds)
  }, [])

  return { remaining, active, start, cancel, add }
}
