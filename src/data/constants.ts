export const TECHNIQUE_GLOSSARY: Array<[string, string]> = [
  ['Dropset', 'Hit failure → drop 25% → failure again'],
  ['Triple Drop', 'Failure → drop → failure → drop → failure'],
  ['Mech. Drop', 'Same weight → easier leverage variation → failure'],
  ['Rest-Pause', 'Hit failure → rack 15s → go again to failure'],
  ['Myo-Reps', 'Hit failure → 15s → 5 reps × 3 rounds'],
  ["21's", '7 bottom-half + 7 top-half + 7 full ROM = 1 set'],
]

export const RPE_DATA: Array<{ label: string; description: string; color: string }> = [
  { label: 'RPE 8–9', description: '1–2 reps in reserve', color: '#f6d365' },
  { label: 'RPE 9',   description: '1 rep left — heavy grinder', color: '#ff8a5b' },
  { label: 'RPE 10',  description: 'True failure', color: '#ff5f6d' },
  { label: 'RPE 10+', description: 'Failure + extended technique', color: '#ffd670' },
]

export const TEMPO_GUIDE = {
  format: 'Eccentric – Pause – Concentric',
  example: '3-1-2 = 3s lower, 1s pause, 2s lift',
  fields: [
    { position: 1, label: 'Eccentric', description: 'Lowering / lengthening phase (seconds)' },
    { position: 2, label: 'Pause',     description: 'Hold at stretched position (seconds)' },
    { position: 3, label: 'Concentric', description: 'Lifting / shortening phase (seconds)' },
  ],
  special: { CTRL: 'Controlled — no strict count, focus on tension throughout' },
}

export const QUICK_REST_OPTIONS = [30, 45, 60, 90] as const

export const VOLUME_DATA = [
  { label: 'Biceps',     color: '#7bb7ff', setsPerSession: 13, weeklyRaw: 26, effectiveRange: '~30–32', landmark: 'MRV' },
  { label: 'Triceps',    color: '#ff9b5e', setsPerSession: 13, weeklyRaw: 26, effectiveRange: '~30–32', landmark: 'MRV' },
  { label: 'Side Delts', color: '#bd8cff', setsPerSession: 10, weeklyRaw: 20, effectiveRange: '~26',    landmark: 'Upper MAV → MRV' },
  { label: 'Forearms',   color: '#82e6a8', setsPerSession: 6,  weeklyRaw: 12, effectiveRange: '~14–15', landmark: 'Upper MAV' },
]
