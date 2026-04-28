import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

beforeEach(() => localStorage.clear())

describe('useLocalStorage', () => {
  it('returns initial value when key is absent', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 42))
    expect(result.current[0]).toBe(42)
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))
    act(() => result.current[1](99))
    expect(localStorage.getItem('test-key')).toBe('99')
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('hello'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('hello')
  })

  it('supports functional updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))
    act(() => result.current[1](prev => prev + 1))
    expect(result.current[0]).toBe(1)
  })
})
