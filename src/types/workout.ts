export type MuscleGroup =
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'front'
  | 'side'
  | 'rear'
  | 'traps'

export type FocusFilter =
  | 'full'
  | 'arms'
  | 'forearms'
  | 'front'
  | 'side'
  | 'rear'
  | 'traps'
  | 'finishers'

export type WorkoutId = 'arms' | 'shoulders'
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

export interface WorkoutFilterOption {
  id: FocusFilter
  label: string
}

export interface WorkoutVolumeTarget {
  label: string
  color: string
  setsPerSession: number
  weeklyRaw: number
  effectiveRange: string
  landmark: string
}

export interface WorkoutDefinition {
  id: WorkoutId
  name: string
  startLabel: string
  subtitle: string
  overviewDescription: string
  workspaceDescription: string
  referenceTitle: string
  summaryLabel: string
  summaryGroups: MuscleGroup[]
  shellBackground: string
  filters: WorkoutFilterOption[]
  volumeTargets: WorkoutVolumeTarget[]
  blocks: Block[]
  exercises: Exercise[]
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
