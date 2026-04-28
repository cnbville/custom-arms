import type { Exercise, Block, SessionState, MuscleGroup, FocusFilter } from './workout'

// Type-level tests — if these compile, types are correct
const ex: Exercise = {
  id: 'a1',
  block: 'A',
  group: 'biceps',
  name: 'Test',
  equipment: 'BARBELL',
  cue: 'Do the thing',
  sets: '3×6–8',
  tempo: '3-0-2',
  rest: '90s',
  restSec: 90,
  rpe: '8–9',
  science: 'Study etc',
  dbId: 'Barbell_Curl',
  tags: [],
}

const block: Block = {
  id: 'A',
  name: 'Heavy Compound',
  accent: '#ff5f6d',
  summary: 'Summary text',
  detail: 'Detail text',
}

const state: SessionState = {
  started: false,
  startedAt: null,
  currentIndex: 0,
  completedIds: [],
  setProgress: {},
}

// Runtime assertion so vitest runs this file
describe('types', () => {
  it('Exercise type has required fields', () => {
    expect(ex.id).toBe('a1')
    expect(ex.group).toBe('biceps')
  })
  it('Block type has required fields', () => {
    expect(block.accent).toBe('#ff5f6d')
  })
  it('SessionState type has setProgress', () => {
    expect(state.setProgress).toEqual({})
  })
})
