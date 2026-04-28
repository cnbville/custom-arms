import type { Block, Exercise, MuscleGroup, WorkoutDefinition, WorkoutId } from '@/types'

export interface QuickImportExercise {
  exercise: string
  sets: number
  reps: string
  rest_seconds?: number
  tempo?: string
  rpe?: string
  notes?: string
  muscle_group?: string
  equipment?: string
  technique?: string
  superset_group?: string
}

export interface QuickImportWorkout {
  name: string
  focus?: string
  notes?: string
  exercises: QuickImportExercise[]
}

export interface QuickImportPayload {
  version: number
  workouts: QuickImportWorkout[]
}

export interface QuickImportAnalysisItem {
  exerciseName: string
  status: 'new' | 'existing' | 'duplicate' | 'ignored'
  reason?: string
  exercise?: Exercise
}

export interface QuickImportAnalysisSection {
  sourceWorkoutName: string
  targetWorkoutId: WorkoutId | null
  targetWorkoutName: string
  counts: {
    new: number
    existing: number
    duplicate: number
    ignored: number
  }
  items: QuickImportAnalysisItem[]
}

export interface QuickImportAnalysis {
  sections: QuickImportAnalysisSection[]
  totals: {
    new: number
    existing: number
    duplicate: number
    ignored: number
  }
}

export type ImportedExerciseMap = Record<WorkoutId, Exercise[]>

export const IMPORT_BLOCKS: Record<WorkoutId, Block> = {
  arms: {
    id: 'QI',
    name: 'Quick Import',
    accent: '#7bb7ff',
    summary: 'Brand-new exercises added from the quick import flow.',
    detail: 'Local additions only',
  },
  shoulders: {
    id: 'QI',
    name: 'Quick Import',
    accent: '#74e1c0',
    summary: 'Brand-new exercises added from the quick import flow.',
    detail: 'Local additions only',
  },
}

export function createEmptyImportedExerciseMap(): ImportedExerciseMap {
  return {
    arms: [],
    shoulders: [],
  }
}

function normalizeLabel(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function toSlug(value: string): string {
  return normalizeLabel(value).replace(/\s+/g, '-')
}

function toTargetWorkoutId(workout: QuickImportWorkout): WorkoutId | null {
  const focus = normalizeLabel(workout.focus ?? '')
  const name = normalizeLabel(workout.name)

  if (focus === 'arms' || name.includes('arm')) return 'arms'
  if (focus === 'shoulders' || focus === 'shoulder' || name.includes('shoulder')) return 'shoulders'

  return null
}

function toMuscleGroup(value: string | undefined, workoutId: WorkoutId): MuscleGroup | null {
  const normalized = normalizeLabel(value ?? '')

  if (workoutId === 'arms') {
    if (normalized === 'biceps') return 'biceps'
    if (normalized === 'triceps') return 'triceps'
    if (normalized === 'forearms' || normalized === 'forearm') return 'forearms'
  }

  if (workoutId === 'shoulders') {
    if (normalized === 'front' || normalized === 'front delt' || normalized === 'front delts') return 'front'
    if (normalized === 'side' || normalized === 'side delt' || normalized === 'side delts') return 'side'
    if (normalized === 'rear' || normalized === 'rear delt' || normalized === 'rear delts') return 'rear'
    if (normalized === 'traps' || normalized === 'trap') return 'traps'
  }

  return null
}

function formatRest(seconds: number): string {
  if (seconds <= 0) return '0s'
  if (seconds % 60 === 0) return `${seconds / 60} min`
  return `${seconds}s`
}

function formatEquipment(value: string | undefined): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed.toUpperCase() : 'IMPORTED'
}

function toLastSetTechnique(value: string | undefined): string | undefined {
  const normalized = normalizeLabel(value ?? '')

  if (normalized === 'drop set' || normalized === 'dropset') return 'DROPSET'
  if (normalized === 'rest pause') return 'REST-PAUSE'
  if (normalized === 'myo rep') return 'MYO-REP'
  if (normalized === 'triple drop') return 'TRIPLE-DROP'
  if (normalized === 'mechanical drop' || normalized === 'mech drop') return 'MECH-DROP'

  return undefined
}

function toSupersetGroup(value: string | undefined): Exercise['supersetGroup'] {
  const normalized = normalizeLabel(value ?? '')
  if (normalized === 'a' || normalized === 'b' || normalized === 'c' || normalized === 'd') {
    return normalized
  }
  return undefined
}

function toImportedExercise(
  workoutId: WorkoutId,
  group: MuscleGroup,
  item: QuickImportExercise
): Exercise {
  const exerciseName = item.exercise.trim()
  const technique = normalizeLabel(item.technique ?? '')
  const supersetGroup = technique === 'superset' ? toSupersetGroup(item.superset_group) : undefined

  return {
    id: `qi-${workoutId}-${toSlug(exerciseName)}`,
    block: IMPORT_BLOCKS[workoutId].id,
    group,
    name: exerciseName,
    equipment: formatEquipment(item.equipment),
    cue: item.notes?.trim() || 'Imported from Quick Import. Add a working cue when you refine this movement.',
    sets: `${item.sets}x${item.reps}`,
    tempo: item.tempo?.trim() || 'CTRL',
    rest: formatRest(item.rest_seconds ?? 60),
    restSec: item.rest_seconds ?? 60,
    rpe: item.rpe?.trim() || '8',
    science: 'Imported from Quick Import.',
    dbId: '',
    tags: ['IMPORTED'],
    supersetGroup,
    lastSetTechnique: technique === 'superset' ? undefined : toLastSetTechnique(item.technique),
    isFinisher: technique === 'myo rep' || technique === 'rest pause',
  }
}

function ensurePayloadShape(payload: unknown): QuickImportPayload {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Quick import expects a JSON object.')
  }

  if (!Array.isArray((payload as QuickImportPayload).workouts)) {
    throw new Error('Quick import expects a workouts array.')
  }

  if ((payload as QuickImportPayload).workouts.length === 0) {
    throw new Error('Quick import expects at least one workout.')
  }

  for (const workout of (payload as QuickImportPayload).workouts) {
    if (!Array.isArray(workout.exercises)) {
      throw new Error('Each imported workout needs an exercises array.')
    }
  }

  return payload as QuickImportPayload
}

export function parseQuickImportPayload(raw: string): QuickImportPayload {
  const trimmed = raw.trim()

  if (!trimmed) {
    throw new Error('Paste workout JSON to review the import.')
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new Error('Quick import could not parse that JSON.')
  }

  return ensurePayloadShape(parsed)
}

export function analyzeQuickImportPayload(
  payload: QuickImportPayload,
  workouts: Record<WorkoutId, WorkoutDefinition>
): QuickImportAnalysis {
  const sections: QuickImportAnalysisSection[] = payload.workouts.map((workout) => {
    const targetWorkoutId = toTargetWorkoutId(workout)

    if (!targetWorkoutId) {
      const items = workout.exercises.map((item) => ({
        exerciseName: item.exercise?.trim() || 'Untitled exercise',
        status: 'ignored' as const,
        reason: 'No matching target workout found for this import.',
      }))

      return {
        sourceWorkoutName: workout.name || 'Untitled workout',
        targetWorkoutId: null,
        targetWorkoutName: 'Unsupported',
        counts: {
          new: 0,
          existing: 0,
          duplicate: 0,
          ignored: items.length,
        },
        items,
      }
    }

    const existingNames = new Set(
      workouts[targetWorkoutId].exercises.map((exercise) => normalizeLabel(exercise.name))
    )
    const seenInFile = new Set<string>()

    const items = workout.exercises.map((item) => {
      const exerciseName = item.exercise?.trim() || 'Untitled exercise'
      const normalizedName = normalizeLabel(exerciseName)

      if (!normalizedName) {
        return {
          exerciseName,
          status: 'ignored' as const,
          reason: 'Missing exercise name.',
        }
      }

      if (seenInFile.has(normalizedName)) {
        return {
          exerciseName,
          status: 'duplicate' as const,
          reason: 'Repeated inside the pasted file.',
        }
      }

      seenInFile.add(normalizedName)

      const muscleGroup = toMuscleGroup(item.muscle_group, targetWorkoutId)

      if (!muscleGroup) {
        return {
          exerciseName,
          status: 'ignored' as const,
          reason: 'Unsupported muscle group for this workout.',
        }
      }

      if (existingNames.has(normalizedName)) {
        return {
          exerciseName,
          status: 'existing' as const,
          reason: 'Already exists in this workout.',
        }
      }

      return {
        exerciseName,
        status: 'new' as const,
        reason: 'Ready to add.',
        exercise: toImportedExercise(targetWorkoutId, muscleGroup, item),
      }
    })

    return {
      sourceWorkoutName: workout.name || workouts[targetWorkoutId].name,
      targetWorkoutId,
      targetWorkoutName: workouts[targetWorkoutId].name,
      counts: {
        new: items.filter((item) => item.status === 'new').length,
        existing: items.filter((item) => item.status === 'existing').length,
        duplicate: items.filter((item) => item.status === 'duplicate').length,
        ignored: items.filter((item) => item.status === 'ignored').length,
      },
      items,
    }
  })

  return {
    sections,
    totals: {
      new: sections.reduce((sum, section) => sum + section.counts.new, 0),
      existing: sections.reduce((sum, section) => sum + section.counts.existing, 0),
      duplicate: sections.reduce((sum, section) => sum + section.counts.duplicate, 0),
      ignored: sections.reduce((sum, section) => sum + section.counts.ignored, 0),
    },
  }
}

export function applyQuickImportAnalysis(
  importedExercises: ImportedExerciseMap,
  analysis: QuickImportAnalysis
): ImportedExerciseMap {
  const next = createEmptyImportedExerciseMap()

  for (const workoutId of Object.keys(next) as WorkoutId[]) {
    next[workoutId] = [...(importedExercises[workoutId] ?? [])]
  }

  for (const section of analysis.sections) {
    if (!section.targetWorkoutId) continue

    const targetWorkoutId = section.targetWorkoutId
    const existingNames = new Set(
      next[targetWorkoutId].map((exercise) => normalizeLabel(exercise.name))
    )

    for (const item of section.items) {
      if (item.status !== 'new' || !item.exercise) continue

      const normalizedName = normalizeLabel(item.exercise.name)
      if (existingNames.has(normalizedName)) continue

      existingNames.add(normalizedName)
      next[targetWorkoutId].push(item.exercise)
    }
  }

  return next
}

export function mergeImportedWorkouts(
  baseWorkouts: Record<WorkoutId, WorkoutDefinition>,
  importedExercises: ImportedExerciseMap
): Record<WorkoutId, WorkoutDefinition> {
  const merged = {} as Record<WorkoutId, WorkoutDefinition>

  for (const workoutId of Object.keys(baseWorkouts) as WorkoutId[]) {
    const extras = importedExercises[workoutId] ?? []
    const baseWorkout = baseWorkouts[workoutId]

    merged[workoutId] = extras.length === 0
      ? baseWorkout
      : {
          ...baseWorkout,
          blocks: [...baseWorkout.blocks, IMPORT_BLOCKS[workoutId]],
          exercises: [...baseWorkout.exercises, ...extras],
        }
  }

  return merged
}
