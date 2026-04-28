import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WORKOUTS } from '@/data/workouts'
import { QuickImportPanel } from './QuickImportPanel'

describe('QuickImportPanel', () => {
  it('reviews the pasted JSON and exposes the add action only for new exercises', async () => {
    const onApplyImport = vi.fn()

    render(
      <QuickImportPanel
        workouts={WORKOUTS}
        currentWorkoutId="arms"
        importedCounts={{ arms: 0, shoulders: 0 }}
        onApplyImport={onApplyImport}
        onClearImported={vi.fn()}
      />
    )

    fireEvent.change(screen.getByLabelText(/workout json/i), {
      target: {
        value: JSON.stringify({
          version: 1,
          workouts: [
            {
              name: 'Arm Day Destroyer',
              focus: 'arms',
              exercises: [
                {
                  exercise: 'EZ Bar Curls - Heavy',
                  sets: 3,
                  reps: '6-8',
                  muscle_group: 'biceps',
                },
                {
                  exercise: 'Spider Curls',
                  sets: 3,
                  reps: '10-12',
                  muscle_group: 'biceps',
                },
              ],
            },
          ],
        }),
      },
    })

    await userEvent.click(screen.getByRole('button', { name: /review import/i }))

    expect(screen.getByText('Spider Curls')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add 1 new exercise/i })).toBeEnabled()

    await userEvent.click(screen.getByRole('button', { name: /add 1 new exercise/i }))

    expect(onApplyImport).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/added 1 to arm day/i)).toBeInTheDocument()
  })
})
