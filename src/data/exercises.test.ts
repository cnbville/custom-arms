import { exercises } from './exercises'

describe('exercises data', () => {
  it('has 15 exercises', () => {
    expect(exercises).toHaveLength(15)
  })
  it('every exercise has required fields', () => {
    exercises.forEach(ex => {
      expect(ex.id).toBeTruthy()
      expect(ex.block).toBeTruthy()
      expect(ex.group).toBeTruthy()
      expect(ex.name).toBeTruthy()
      expect(ex.cue).toBeTruthy()
      expect(ex.science).toBeTruthy()
      expect(typeof ex.restSec).toBe('number')
    })
  })
  it('ids are unique', () => {
    const ids = exercises.map(e => e.id)
    expect(new Set(ids).size).toBe(exercises.length)
  })
  it('block field matches id prefix (uppercased)', () => {
    exercises.forEach(ex => {
      expect(ex.block.toLowerCase()).toBe(ex.id[0])
    })
  })
})
