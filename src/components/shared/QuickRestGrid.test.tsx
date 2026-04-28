import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuickRestGrid } from './QuickRestGrid'

describe('QuickRestGrid', () => {
  it('renders all 4 preset buttons', () => {
    render(<QuickRestGrid onStart={vi.fn()} />)
    expect(screen.getByRole('button', { name: '30s' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '45s' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '60s' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '90s' })).toBeInTheDocument()
  })

  it('calls onStart with correct seconds', async () => {
    const onStart = vi.fn()
    render(<QuickRestGrid onStart={onStart} />)
    await userEvent.click(screen.getByRole('button', { name: '90s' }))
    expect(onStart).toHaveBeenCalledWith(90)
  })

  it('shows remaining time when timer is active', () => {
    render(<QuickRestGrid onStart={vi.fn()} remaining={47} active />)
    expect(screen.getByText('0:47')).toBeInTheDocument()
  })
})
