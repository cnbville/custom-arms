import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestTimer } from './RestTimer'

describe('RestTimer', () => {
  it('renders nothing when inactive', () => {
    const { container } = render(<RestTimer active={false} remaining={0} total={90} onCancel={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows remaining time when active', () => {
    render(<RestTimer active remaining={47} total={90} onCancel={vi.fn()} />)
    expect(screen.getByText('0:47')).toBeInTheDocument()
  })

  it('shows progress bar', () => {
    render(<RestTimer active remaining={45} total={90} onCancel={vi.fn()} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('calls onCancel when dismissed', async () => {
    const onCancel = vi.fn()
    render(<RestTimer active remaining={30} total={90} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
