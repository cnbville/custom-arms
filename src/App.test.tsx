import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => localStorage.clear())

describe('App', () => {
  it('renders overview by default', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /^start arms$/i })).toBeInTheDocument()
  })

  it('switches to arm session by default', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /^start arms$/i }))
    expect(screen.getByRole('heading', { name: 'EZ Bar Curls — Heavy' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('can switch workouts and start shoulders', async () => {
    render(<App />)
    await userEvent.click(screen.getAllByRole('button', { name: /^shoulders$/i })[0])
    await userEvent.click(screen.getByRole('button', { name: /^start shoulders$/i }))
    expect(screen.getByRole('heading', { name: 'Seated Dumbbell Press' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('returns to overview on End', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /^start arms$/i }))
    await userEvent.click(screen.getByRole('button', { name: /end/i }))
    expect(screen.getByRole('button', { name: /^start arms$/i })).toBeInTheDocument()
  })
})
