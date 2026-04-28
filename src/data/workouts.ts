import { blocks } from '@/data/blocks'
import { VOLUME_DATA } from '@/data/constants'
import { exercises } from '@/data/exercises'
import { shoulderBlocks, shoulderExercises, shoulderVolumeData, shoulderWorkout } from '@/data/shoulders'
import type { WorkoutDefinition, WorkoutId } from '@/types'

export const DEFAULT_WORKOUT_ID: WorkoutId = 'arms'

export const WORKOUT_OPTIONS: Array<{ id: WorkoutId; label: string }> = [
  { id: 'arms', label: 'Arms' },
  { id: 'shoulders', label: 'Shoulders' },
]

export const WORKOUTS: Record<WorkoutId, WorkoutDefinition> = {
  arms: {
    id: 'arms',
    name: 'Arm Day',
    startLabel: 'Arms',
    subtitle: 'Destroyer Protocol',
    overviewDescription: 'The same mobile workout flow, opened up into a wider workstation for curls, extensions, and finishers.',
    workspaceDescription: 'Review the split, trim the view, and launch the session from the desktop surface.',
    referenceTitle: 'Arm Reference',
    summaryLabel: 'Arm Work',
    summaryGroups: ['biceps', 'triceps'],
    shellBackground: 'radial-gradient(circle_at_top, rgba(123,183,255,0.14), transparent 30%), radial-gradient(circle_at_bottom_right, rgba(255,155,94,0.14), transparent 28%), #040509',
    filters: [
      { id: 'full', label: 'Full Session' },
      { id: 'arms', label: 'Arms Only' },
      { id: 'forearms', label: 'Forearms' },
      { id: 'finishers', label: 'Finishers' },
    ],
    volumeTargets: VOLUME_DATA,
    blocks,
    exercises,
  },
  shoulders: {
    id: 'shoulders',
    name: shoulderWorkout.name,
    startLabel: 'Shoulders',
    subtitle: `${shoulderWorkout.version} · ${shoulderWorkout.frequency}`,
    overviewDescription: 'The same workstation flow, now tuned for front delts, side delts, rear delts, and traps.',
    workspaceDescription: 'Review the split, trim the shoulder focus, and launch the session from the desktop surface.',
    referenceTitle: 'Shoulder Reference',
    summaryLabel: 'Delt Work',
    summaryGroups: ['front', 'side', 'rear'],
    shellBackground: 'radial-gradient(circle_at_top, rgba(108,184,255,0.16), transparent 32%), radial-gradient(circle_at_bottom_right, rgba(79,209,197,0.12), transparent 28%), radial-gradient(circle_at_center_right, rgba(255,122,102,0.1), transparent 26%), #040509',
    filters: [
      { id: 'full', label: 'Full Session' },
      { id: 'front', label: 'Front Delts' },
      { id: 'side', label: 'Side Delts' },
      { id: 'rear', label: 'Rear Delts' },
      { id: 'traps', label: 'Traps' },
      { id: 'finishers', label: 'Finishers' },
    ],
    volumeTargets: shoulderVolumeData,
    blocks: shoulderBlocks,
    exercises: shoulderExercises,
  },
}
