# Arm Day Destroyer — Greenfield Rebuild
**Date:** 2026-04-12
**Status:** Approved

---

## Context

The current "Arm Annihilation V6" is a 1,279-line monolithic JSX component with 1,380 lines of raw CSS. No TypeScript, no tests, no component boundaries, no persistence, no shadcn/ui, no Geist fonts — despite being described as a premium personal tool. It fails on four axes simultaneously: it looks generic, behaves generically, reads generically, and is architecturally embarrassing. The decision is to scrap everything and rebuild from zero. Only the exercise data (10 exercises, 7 blocks) is worth porting — retyped from scratch.

**Scope:** Local-first personal app. No Supabase. No auth. No routing beyond a two-view toggle.

**Stack:** Vite + React 19 + TypeScript strict + Tailwind CSS + shadcn/ui + Vitest

---

## Success Criteria

1. Open on phone mid-workout — current exercise, rest timer, and execution cues are all visible without any taps
2. Code is typed, split into focused components, covered by tests — not embarrassing to read
3. Interactions feel faster and more tactile than the current version

---

## Architecture

### Project Structure

```
src/
  data/
    exercises.ts        # Typed exercise array
    blocks.ts           # Block config (A–G)
    constants.ts        # RPE scale, technique glossary, volume targets
  components/
    session/
      SessionView.tsx
      ExercisePanel.tsx
      RestTimer.tsx
      ProgressBar.tsx
    overview/
      OverviewView.tsx
      ExerciseCard.tsx
      BlockGroup.tsx
    shared/
      WorkoutTimer.tsx
      QuickRestGrid.tsx
      ReferenceSheet.tsx   # The "?" drawer
  hooks/
    useRestTimer.ts
    useWorkoutTimer.ts
    useLocalStorage.ts
  types/
    workout.ts
  App.tsx
  main.tsx
```

### State

All state is colocated via hooks. No global store. `SessionState` persists to `localStorage` via `useLocalStorage` — reload mid-workout and you return exactly where you left off. Cleared on "End Workout."

---

## Data Model

```typescript
type MuscleGroup = 'biceps' | 'triceps' | 'delts' | 'forearms'
type FocusFilter = 'full' | 'arms' | 'delts' | 'forearms' | 'finishers'
type SupersetGroup = 'a' | 'b' | 'c' | 'd'

interface Exercise {
  id: string                        // 'a1', 'b2', etc.
  block: string                     // 'A' | 'B' | ... | 'G'
  group: MuscleGroup
  name: string
  equipment: string
  cue: string                       // execution note
  sets: string                      // '3×6–8'
  tempo: string                     // '3-0-2'
  rest: string                      // '90s' | '0s → A2'
  restSec: number
  rpe: string                       // '8–9'
  science: string
  dbId: string                      // free-exercise-db image key
  tags: string[]
  supersetGroup?: SupersetGroup
  lastSetTechnique?: 'DROPSET' | 'REST-PAUSE' | 'MYO-REPS'
  isFinisher?: boolean
}

interface Block {
  id: string                        // 'A'–'G'
  name: string
  accent: string                    // hex color value e.g. '#7bb7ff'
  summary: string
}

interface SessionState {
  started: boolean
  startedAt: number | null          // timestamp
  currentIndex: number
  completedIds: string[]
  setProgress: Record<string, number>  // exerciseId → sets completed so far
}
```

---

## Views

### Session View (primary surface)

Designed for mid-workout phone use. Everything critical visible without taps.

**Layout:**
```
┌─────────────────────────────┐
│  BLOCK A · 2 of 3 sets      │  progress context, always visible
│  EZ Bar Curls — Heavy       │  exercise name, large
│  3×6–8 ⓘ · 3-0-2 ⓘ · RPE 8 ⓘ│  metrics row, monospace, tappable
├─────────────────────────────┤
│  [REST 90s]  [REST-PAUSE]   │  primary action buttons
│  ████████░░░░░░░  0:47      │  timer bar + countdown, dominant
├─────────────────────────────┤
│  Outer camber grip.         │  execution cue, always visible
│  Stretch at bottom.         │
│  ↑ SUPERSET → A2            │  superset indicator if applicable
├─────────────────────────────┤
│  ▸ WHY THIS WORKS           │  collapsed by default, one tap
├─────────────────────────────┤
│  ← PREV      NEXT →      ? │  nav + reference drawer trigger
└─────────────────────────────┘
```

**Rules:**
- No collapsed sections for primary content — cue is always visible
- Timer dominates the lower half when active
- Science note collapsed by default, labeled "WHY THIS WORKS"
- Metric chips (`3-0-2 ⓘ`) open a shadcn `Popover` with inline explanation
- Demo images removed from session view (you know your form by session time)
- `?` button (bottom-right, small) opens the `ReferenceSheet` drawer

### Overview View

Reference surface — used before workouts or when planning.

**Layout:**
- Vertical list of blocks (A–G), each a collapsible section header
- Inside each block: compact exercise cards
- Expanded card: full cue, science note, demo images, rest timer buttons
- Sticky top toolbar: focus filter chips (Full / Arms / Delts / Forearms / Finishers)
- START SESSION button → jumps to session view at exercise 1
- No sidebar — sidebar was wasted space on mobile; reference content lives in `ReferenceSheet`

### ReferenceSheet (`?` Drawer)

Shared between both views. Contains:
- Tempo guide (what X-Y-Z means)
- RPE scale (8→10+)
- Technique glossary (Dropset, Rest-Pause, Myo-Reps, Superset)

Implemented as shadcn `Sheet` from bottom. Swipe down to dismiss.

---

## Design System

### Color Tokens (Tailwind CSS variables)

```
iron-900  #040509   page backgrounds
iron-800  #0a0c12   surfaces, cards
iron-700  #11141e   borders, dividers
iron-500  #3d4258   muted elements
iron-300  #b8b1a7   secondary text
iron-100  #f2ede6   primary text
```

Muscle-group accents:
```
biceps    #7bb7ff
triceps   #ff9b5e
delts     #bd8cff
forearms  #82e6a8
```

### Typography

- **Geist Sans** — all UI text
- **Geist Mono** — metrics row, tags, timestamps, IDs

### shadcn Components

| Component | Usage |
|-----------|-------|
| `Card` | Exercise cards in overview |
| `Button` | Rest triggers, nav, START SESSION |
| `Sheet` | Reference drawer |
| `Popover` | Metric tooltips |
| `Progress` | Rest timer bar |
| `Collapsible` | WHY THIS WORKS, block sections |

### Interaction Rules

- No gradients except rest-complete alert (intentional urgency signal)
- No `rounded-full` except icon buttons
- Hover state on every interactive element
- Focus rings visible
- Transitions: 150ms ease-out maximum

---

## Testing Strategy

- **Vitest + React Testing Library**
- Every hook tested in isolation (`useRestTimer`, `useWorkoutTimer`, `useLocalStorage`)
- Every component has a smoke test minimum
- Critical paths tested: timer countdown, session persistence, exercise navigation, focus filtering
- TDD enforced: failing test before any implementation

---

## Out of Scope

- Supabase / backend
- User accounts
- Workout logging / history
- Custom exercise addition
- Dark/light mode toggle
- Routing (React Router, etc.)
