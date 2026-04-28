import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReferenceSheet } from './ReferenceSheet'

describe('ReferenceSheet', () => {
  it('renders trigger button', () => {
    render(<ReferenceSheet />)
    expect(screen.getByRole('button', { name: /reference/i })).toBeInTheDocument()
  })

  it('opens sheet on click and shows tempo guide', async () => {
    render(<ReferenceSheet />)
    await userEvent.click(screen.getByRole('button', { name: /reference/i }))
    expect(screen.getAllByText(/Eccentric/i).length).toBeGreaterThan(0)
  })

  it('shows RPE entries', async () => {
    render(<ReferenceSheet />)
    await userEvent.click(screen.getByRole('button', { name: /reference/i }))
    expect(screen.getByText('True failure')).toBeInTheDocument()
  })

  it('shows technique glossary', async () => {
    render(<ReferenceSheet />)
    await userEvent.click(screen.getByRole('button', { name: /reference/i }))
    expect(screen.getByText('Dropset')).toBeInTheDocument()
  })
})
