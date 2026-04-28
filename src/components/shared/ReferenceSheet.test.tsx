import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReferenceSheet } from './ReferenceSheet'
import { WORKOUTS } from '@/data/workouts'

describe('ReferenceSheet', () => {
  it('renders trigger button', () => {
    render(<ReferenceSheet workout={WORKOUTS.arms} />)
    expect(screen.getByRole('button', { name: /reference/i })).toBeInTheDocument()
  })

  it('opens sheet on click and shows tempo guide', async () => {
    render(<ReferenceSheet workout={WORKOUTS.arms} />)
    await userEvent.click(screen.getByRole('button', { name: /reference/i }))
    expect(screen.getAllByText(/Eccentric/i).length).toBeGreaterThan(0)
  })

  it('shows RPE entries', async () => {
    render(<ReferenceSheet workout={WORKOUTS.arms} />)
    await userEvent.click(screen.getByRole('button', { name: /reference/i }))
    expect(screen.getByText('True failure')).toBeInTheDocument()
  })

  it('shows technique glossary', async () => {
    render(<ReferenceSheet workout={WORKOUTS.arms} />)
    await userEvent.click(screen.getByRole('button', { name: /reference/i }))
    expect(screen.getByText('Dropset')).toBeInTheDocument()
  })

  it('renders the selected workout reference title', async () => {
    render(<ReferenceSheet workout={WORKOUTS.shoulders} />)
    await userEvent.click(screen.getByRole('button', { name: /reference/i }))
    expect(screen.getByText('Shoulder Reference')).toBeInTheDocument()
  })
})
