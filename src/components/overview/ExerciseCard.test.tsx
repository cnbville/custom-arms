import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExerciseCard } from './ExerciseCard'
import { exercises } from '@/data/exercises'

const ex = exercises[0] // a1: EZ Bar Curls — Heavy

describe('ExerciseCard', () => {
  it('renders exercise name and equipment', () => {
    render(<ExerciseCard exercise={ex} blockAccent="#ff5f6d" onRestStart={vi.fn()} />)
    expect(screen.getByText('EZ Bar Curls — Heavy')).toBeInTheDocument()
    expect(screen.getByText('EZ CURL BAR')).toBeInTheDocument()
  })

  it('renders metrics row', () => {
    render(<ExerciseCard exercise={ex} blockAccent="#ff5f6d" onRestStart={vi.fn()} />)
    expect(screen.getByText('3×6–8')).toBeInTheDocument()
    expect(screen.getByText('3-0-2')).toBeInTheDocument()
    expect(screen.getByText('8–9')).toBeInTheDocument()
  })

  it('is collapsed by default — cue not visible', () => {
    render(<ExerciseCard exercise={ex} blockAccent="#ff5f6d" onRestStart={vi.fn()} />)
    expect(screen.queryByText(/Outer camber grip/)).not.toBeInTheDocument()
  })

  it('expands on click to show cue', async () => {
    render(<ExerciseCard exercise={ex} blockAccent="#ff5f6d" onRestStart={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /EZ Bar Curls/i }))
    expect(screen.getByText(/Outer camber grip/)).toBeInTheDocument()
  })

  it('calls onRestStart with exercise restSec', async () => {
    const onRestStart = vi.fn()
    const ex2 = exercises.find(e => e.restSec > 0)!
    render(<ExerciseCard exercise={ex2} blockAccent="#ff5f6d" onRestStart={onRestStart} />)
    await userEvent.click(screen.getByRole('button', { name: new RegExp(ex2.name, 'i') }))
    await userEvent.click(screen.getByRole('button', { name: /start rest/i }))
    expect(onRestStart).toHaveBeenCalledWith(ex2.restSec)
  })
})
