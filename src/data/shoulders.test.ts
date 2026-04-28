import { shoulderBlocks, shoulderExercises, shoulderVolumeData, shoulderWorkout } from './shoulders'

describe('shoulder workout data', () => {
  it('keeps the workout metadata intact', () => {
    expect(shoulderWorkout.name).toBe('Shoulder Annihilation')
    expect(shoulderWorkout.totalSets).toBe(29)
  })

  it('has 7 blocks A-G', () => {
    expect(shoulderBlocks).toHaveLength(7)
    expect(shoulderBlocks.map(block => block.id)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G'])
  })

  it('has 9 shoulder exercises with unique ids', () => {
    expect(shoulderExercises).toHaveLength(9)
    expect(new Set(shoulderExercises.map(exercise => exercise.id)).size).toBe(shoulderExercises.length)
  })

  it('matches the arm-day field shape', () => {
    shoulderExercises.forEach(exercise => {
      expect(exercise.block.toLowerCase()).toBe(exercise.id[0])
      expect(exercise.name).toBeTruthy()
      expect(exercise.cue).toBeTruthy()
      expect(exercise.rest).toBeTruthy()
      expect(typeof exercise.restSec).toBe('number')
      expect(exercise.dbId).toBeTruthy()
      expect(Array.isArray(exercise.tags)).toBe(true)
    })
  })

  it('includes four volume targets', () => {
    expect(shoulderVolumeData).toHaveLength(4)
  })
})
