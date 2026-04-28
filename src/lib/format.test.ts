import { formatClock } from './format'

describe('formatClock', () => {
  it('formats seconds under 1 hour as M:SS', () => {
    expect(formatClock(0)).toBe('0:00')
    expect(formatClock(65)).toBe('1:05')
    expect(formatClock(3599)).toBe('59:59')
  })
  it('formats seconds >= 1 hour as H:MM:SS', () => {
    expect(formatClock(3600)).toBe('1:00:00')
    expect(formatClock(3661)).toBe('1:01:01')
  })
})
