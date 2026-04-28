import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OverviewView } from './OverviewView'
import { WORKOUTS } from '@/data/workouts'

const defaultProps = {
  workouts: WORKOUTS,
  importedCounts: { arms: 0, shoulders: 0 },
  onApplyImport: vi.fn(),
  onClearImported: vi.fn(),
}

describe('OverviewView', () => {
  it('renders START button', () => {
    render(
      <OverviewView
        {...defaultProps}
        workout={WORKOUTS.arms}
        selectedWorkoutId="arms"
        onWorkoutSelect={vi.fn()}
        onStartSession={vi.fn()}
        onRestStart={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /^start arms$/i })).toBeInTheDocument()
  })

  it('renders the selected workout blocks', () => {
    render(
      <OverviewView
        {...defaultProps}
        workout={WORKOUTS.arms}
        selectedWorkoutId="arms"
        onWorkoutSelect={vi.fn()}
        onStartSession={vi.fn()}
        onRestStart={vi.fn()}
      />
    )
    expect(screen.getByRole('heading', { name: 'Heavy Compound' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Arm Finishers' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Forearm Finish' })).toBeInTheDocument()
  })

  it('calls onStartSession when START clicked', async () => {
    const onStartSession = vi.fn()
    render(
      <OverviewView
        {...defaultProps}
        workout={WORKOUTS.arms}
        selectedWorkoutId="arms"
        onWorkoutSelect={vi.fn()}
        onStartSession={onStartSession}
        onRestStart={vi.fn()}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /^start arms$/i }))
    expect(onStartSession).toHaveBeenCalledTimes(1)
  })

  it('notifies when the workout selector changes', async () => {
    const onWorkoutSelect = vi.fn()
    render(
      <OverviewView
        {...defaultProps}
        workout={WORKOUTS.arms}
        selectedWorkoutId="arms"
        onWorkoutSelect={onWorkoutSelect}
        onStartSession={vi.fn()}
        onRestStart={vi.fn()}
      />
    )
    await userEvent.click(screen.getAllByRole('button', { name: /^shoulders$/i })[0])
    expect(onWorkoutSelect).toHaveBeenCalledWith('shoulders')
  })

  it('filters down to side-delt work', async () => {
    render(
      <OverviewView
        {...defaultProps}
        workout={WORKOUTS.shoulders}
        selectedWorkoutId="shoulders"
        onWorkoutSelect={vi.fn()}
        onStartSession={vi.fn()}
        onRestStart={vi.fn()}
      />
    )
    await userEvent.click(screen.getAllByRole('button', { name: /side delts/i })[0])
    expect(screen.getByText('Cable Lateral Raises')).toBeInTheDocument()
    expect(screen.queryByText('Seated Dumbbell Press')).not.toBeInTheDocument()
  })
})
