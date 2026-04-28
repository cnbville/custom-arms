import { renderHook, act } from '@testing-library/react'
import { useWorkoutTimer } from './useWorkoutTimer'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useWorkoutTimer', () => {
  it('starts at 0 elapsed', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    expect(result.current.elapsed).toBe(0)
    expect(result.current.running).toBe(false)
  })

  it('increments elapsed each second when running', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.elapsed).toBe(3)
    expect(result.current.running).toBe(true)
  })

  it('stops incrementing after stop()', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(2000))
    act(() => result.current.stop())
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.elapsed).toBe(2)
    expect(result.current.running).toBe(false)
  })

  it('resets to 0', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5000))
    act(() => result.current.reset())
    expect(result.current.elapsed).toBe(0)
    expect(result.current.running).toBe(false)
  })
})
