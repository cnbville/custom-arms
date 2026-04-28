import { render, screen } from '@testing-library/react'
import { WorkoutTimer } from './WorkoutTimer'

describe('WorkoutTimer', () => {
  it('renders elapsed time formatted', () => {
    render(<WorkoutTimer elapsed={125} />)
    expect(screen.getByText('2:05')).toBeInTheDocument()
  })
  it('shows running indicator when running', () => {
    render(<WorkoutTimer elapsed={0} running />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
