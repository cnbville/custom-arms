import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => localStorage.clear())

describe('App', () => {
  it('renders overview by default', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /^start$/i })).toBeInTheDocument()
  })

  it('switches to session view on Start Session', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /^start$/i }))
    expect(screen.getByText('EZ Bar Curls — Heavy')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('returns to overview on End', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /^start$/i }))
    await userEvent.click(screen.getByRole('button', { name: /end/i }))
    expect(screen.getByRole('button', { name: /^start$/i })).toBeInTheDocument()
  })
})
