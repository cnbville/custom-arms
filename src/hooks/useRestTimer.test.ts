import { renderHook, act } from '@testing-library/react'
import { useRestTimer } from './useRestTimer'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useRestTimer', () => {
  it('starts inactive with 0 remaining', () => {
    const { result } = renderHook(() => useRestTimer())
    expect(result.current.active).toBe(false)
    expect(result.current.remaining).toBe(0)
  })

  it('counts down from given seconds', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => result.current.start(10))
    expect(result.current.active).toBe(true)
    expect(result.current.remaining).toBe(10)
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.remaining).toBe(7)
  })

  it('calls onComplete when reaching 0', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useRestTimer(onComplete))
    act(() => result.current.start(2))
    act(() => vi.advanceTimersByTime(2000))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(result.current.active).toBe(false)
  })

  it('cancel() stops countdown without calling onComplete', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useRestTimer(onComplete))
    act(() => result.current.start(10))
    act(() => result.current.cancel())
    act(() => vi.advanceTimersByTime(10000))
    expect(onComplete).not.toHaveBeenCalled()
    expect(result.current.active).toBe(false)
  })

  it('add() extends remaining time', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => result.current.start(30))
    act(() => result.current.add(15))
    expect(result.current.remaining).toBe(45)
  })
})
