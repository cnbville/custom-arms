import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OverviewView } from './OverviewView'

describe('OverviewView', () => {
  it('renders START button', () => {
    render(<OverviewView onStartSession={vi.fn()} onRestStart={vi.fn()} />)
    expect(screen.getByRole('button', { name: /^start$/i })).toBeInTheDocument()
  })

  it('renders all 7 block headers', () => {
    render(<OverviewView onStartSession={vi.fn()} onRestStart={vi.fn()} />)
    expect(screen.getByText('Heavy Compound')).toBeInTheDocument()
    expect(screen.getByText('Arm Finishers')).toBeInTheDocument()
    expect(screen.getByText('Forearm Finish')).toBeInTheDocument()
  })

  it('calls onStartSession when START clicked', async () => {
    const onStartSession = vi.fn()
    render(<OverviewView onStartSession={onStartSession} onRestStart={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /^start$/i }))
    expect(onStartSession).toHaveBeenCalledTimes(1)
  })

  it('focus filter "Arms" hides delt and forearm exercises', async () => {
    render(<OverviewView onStartSession={vi.fn()} onRestStart={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /arms only/i }))
    expect(screen.queryByText('Cable Lateral Raises')).not.toBeInTheDocument()
  })
})
