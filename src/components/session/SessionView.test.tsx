import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SessionView } from './SessionView'
import { DEFAULT_SESSION_STATE } from '@/types'

const baseState = { ...DEFAULT_SESSION_STATE, started: true, startedAt: Date.now() }

describe('SessionView', () => {
  it('renders first exercise on load', () => {
    render(<SessionView sessionState={baseState} onSessionUpdate={vi.fn()} onEndSession={vi.fn()} />)
    expect(screen.getByText('EZ Bar Curls — Heavy')).toBeInTheDocument()
  })

  it('renders NEXT and PREV navigation', () => {
    render(<SessionView sessionState={baseState} onSessionUpdate={vi.fn()} onEndSession={vi.fn()} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument()
  })

  it('advances to next exercise on NEXT click', async () => {
    const onUpdate = vi.fn()
    render(<SessionView sessionState={baseState} onSessionUpdate={onUpdate} onEndSession={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ currentIndex: 1 }))
  })

  it('prev is disabled on first exercise', () => {
    render(<SessionView sessionState={baseState} onSessionUpdate={vi.fn()} onEndSession={vi.fn()} />)
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled()
  })

  it('renders quick rest grid', () => {
    render(<SessionView sessionState={baseState} onSessionUpdate={vi.fn()} onEndSession={vi.fn()} />)
    expect(screen.getByRole('button', { name: '90s' })).toBeInTheDocument()
  })
})
