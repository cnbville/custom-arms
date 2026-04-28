import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SessionView } from './SessionView'
import { WORKOUTS } from '@/data/workouts'
import { DEFAULT_SESSION_STATE } from '@/types'

const baseState = { ...DEFAULT_SESSION_STATE, started: true, startedAt: Date.now() }

describe('SessionView', () => {
  it('renders first exercise on load', () => {
    render(
      <SessionView
        workout={WORKOUTS.arms}
        sessionState={baseState}
        onSessionUpdate={vi.fn()}
        onEndSession={vi.fn()}
      />
    )
    expect(screen.getByRole('heading', { name: 'EZ Bar Curls — Heavy' })).toBeInTheDocument()
  })

  it('renders NEXT and PREV navigation', () => {
    render(
      <SessionView
        workout={WORKOUTS.arms}
        sessionState={baseState}
        onSessionUpdate={vi.fn()}
        onEndSession={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument()
  })

  it('advances to next exercise on NEXT click', async () => {
    const onUpdate = vi.fn()
    render(
      <SessionView
        workout={WORKOUTS.arms}
        sessionState={baseState}
        onSessionUpdate={onUpdate}
        onEndSession={vi.fn()}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ currentIndex: 1 }))
  })

  it('prev is disabled on first exercise', () => {
    render(
      <SessionView
        workout={WORKOUTS.arms}
        sessionState={baseState}
        onSessionUpdate={vi.fn()}
        onEndSession={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled()
  })

  it('renders quick rest grid', () => {
    render(
      <SessionView
        workout={WORKOUTS.arms}
        sessionState={baseState}
        onSessionUpdate={vi.fn()}
        onEndSession={vi.fn()}
      />
    )
    expect(screen.getAllByRole('button', { name: '90s' }).length).toBeGreaterThan(0)
  })

  it('locks the desktop session layout to the viewport so controls stay visible', () => {
    const { container } = render(
      <SessionView
        workout={WORKOUTS.arms}
        sessionState={baseState}
        onSessionUpdate={vi.fn()}
        onEndSession={vi.fn()}
      />
    )

    expect(container.firstElementChild).toHaveClass('lg:h-full', 'lg:overflow-hidden')
    expect(container.querySelector('main')).toHaveClass('lg:min-h-0')
  })

  it('clamps an out-of-range saved exercise index to the new last exercise', () => {
    render(
      <SessionView
        workout={WORKOUTS.shoulders}
        sessionState={{ ...baseState, currentIndex: 99 }}
        onSessionUpdate={vi.fn()}
        onEndSession={vi.fn()}
      />
    )

    expect(screen.getByRole('heading', { name: 'Cable Shrugs Behind Back' })).toBeInTheDocument()
  })
})
