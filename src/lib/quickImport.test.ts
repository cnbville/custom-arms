import { WORKOUTS } from '@/data/workouts'
import {
  analyzeQuickImportPayload,
  applyQuickImportAnalysis,
  createEmptyImportedExerciseMap,
  mergeImportedWorkouts,
  parseQuickImportPayload,
} from './quickImport'

describe('quickImport', () => {
  it('classifies new, existing, duplicate, and ignored exercises clearly', () => {
    const payload = parseQuickImportPayload(JSON.stringify({
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
              rest_seconds: 45,
              muscle_group: 'biceps',
              equipment: 'dumbbell',
            },
            {
              exercise: 'Spider Curls',
              sets: 3,
              reps: '10-12',
              muscle_group: 'biceps',
            },
            {
              exercise: 'Cable Laterals',
              sets: 3,
              reps: '12-15',
              muscle_group: 'side',
            },
          ],
        },
      ],
    }))

    const analysis = analyzeQuickImportPayload(payload, WORKOUTS)

    expect(analysis.totals).toEqual({
      new: 1,
      existing: 1,
      duplicate: 1,
      ignored: 1,
    })

    expect(
      analysis.sections[0].items.find((item) => item.exerciseName === 'Spider Curls')?.exercise
    ).toMatchObject({
      id: 'qi-arms-spider-curls',
      block: 'QI',
      name: 'Spider Curls',
      group: 'biceps',
      equipment: 'DUMBBELL',
    })
  })

  it('stores imported exercises once and merges them into a quick import block', () => {
    const payload = parseQuickImportPayload(JSON.stringify({
      version: 1,
      workouts: [
        {
          name: 'Shoulder Annihilation',
          focus: 'shoulders',
          exercises: [
            {
              exercise: 'Machine Lateral Raise',
              sets: 3,
              reps: '12-15',
              muscle_group: 'side',
              equipment: 'machine',
            },
          ],
        },
      ],
    }))

    const analysis = analyzeQuickImportPayload(payload, WORKOUTS)
    const firstPass = applyQuickImportAnalysis(createEmptyImportedExerciseMap(), analysis)
    const secondPass = applyQuickImportAnalysis(firstPass, analysis)
    const merged = mergeImportedWorkouts(WORKOUTS, secondPass)

    expect(firstPass.shoulders).toHaveLength(1)
    expect(secondPass.shoulders).toHaveLength(1)
    expect(merged.shoulders.blocks[merged.shoulders.blocks.length - 1]).toMatchObject({ id: 'QI', name: 'Quick Import' })
    expect(merged.shoulders.exercises[merged.shoulders.exercises.length - 1]).toMatchObject({ name: 'Machine Lateral Raise' })
  })
})
