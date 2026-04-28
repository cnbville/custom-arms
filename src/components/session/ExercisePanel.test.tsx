import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExercisePanel } from './ExercisePanel'
import { exercises } from '@/data/exercises'
import { blocks } from '@/data/blocks'

const ex = exercises[0]
const block = blocks[0]

describe('ExercisePanel', () => {
  it('renders exercise name', () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    expect(screen.getByText('EZ Bar Curls — Heavy')).toBeInTheDocument()
  })

  it('renders block context', () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    expect(screen.getByText(/heavy compound/i)).toBeInTheDocument()
  })

  it('renders metrics row with sets, tempo, rpe', () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    expect(screen.getByText('3×6–8')).toBeInTheDocument()
    expect(screen.getByText('3-0-2')).toBeInTheDocument()
  })

  it('renders cue text', () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    expect(screen.getByText(/Outer camber grip/)).toBeInTheDocument()
  })

  it('WHY THIS WORKS is collapsed by default', () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    expect(screen.queryByText(/Schoenfeld/)).not.toBeInTheDocument()
  })

  it('expands WHY THIS WORKS on click', async () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /why this works/i }))
    expect(screen.getByText(/Schoenfeld/)).toBeInTheDocument()
  })
})
