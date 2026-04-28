export type MuscleGroup = 'biceps' | 'triceps' | 'delts' | 'forearms'
export type FocusFilter = 'full' | 'arms' | 'delts' | 'forearms' | 'finishers'
export type SupersetGroup = 'a' | 'b' | 'c' | 'd'
export type Technique = 'DROPSET' | 'REST-PAUSE' | 'MYO-REP' | 'TRIPLE-DROP' | 'MECH-DROP'

export interface Exercise {
  id: string
  block: string
  group: MuscleGroup
  name: string
  equipment: string
  cue: string
  sets: string
  tempo: string
  rest: string
  restSec: number
  rpe: string
  science: string
  dbId: string
  tags: string[]
  supersetGroup?: SupersetGroup
  lastSetTechnique?: string
  isFinisher?: boolean
}

export interface Block {
  id: string
  name: string
  accent: string
  summary: string
  detail: string
}

export interface SessionState {
  started: boolean
  startedAt: number | null
  currentIndex: number
  completedIds: string[]
  setProgress: Record<string, number>
}

export const DEFAULT_SESSION_STATE: SessionState = {
  started: false,
  startedAt: null,
  currentIndex: 0,
  completedIds: [],
  setProgress: {},
}
