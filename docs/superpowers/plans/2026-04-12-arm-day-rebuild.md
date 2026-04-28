# Arm Day Destroyer — Greenfield Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wipe the monolithic React app and rebuild it as a typed, tested, component-split Vite + React 19 + TypeScript + Tailwind + shadcn/ui app with session persistence.

**Architecture:** Two-view toggle (overview ↔ session) with all state colocated in hooks. No global store, no router. `SessionState` persisted to localStorage. Every component is single-responsibility and tested.

**Tech Stack:** Vite 6, React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui, Vitest, React Testing Library

---

## Task 1: Wipe and Scaffold

**Files:**
- Delete: `arm_annihilation_v6.jsx`, `src/styles.css`, `src/main.jsx`
- Create: `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Remove old files**

```bash
cd "/Users/raichelsusanna/Sync/Custom Arms"
rm -f arm_annihilation_v6.jsx src/styles.css src/main.jsx
```

- [ ] **Step 2: Install dependencies**

```bash
npm install react@^19 react-dom@^19
npm install -D typescript @types/react @types/react-dom vite @vitejs/plugin-react
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
npm install tailwindcss @tailwindcss/vite
npm install class-variance-authority clsx tailwind-merge lucide-react
```

- [ ] **Step 3: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}
```

- [ ] **Step 5: Write `tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

- [ ] **Step 6: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Arm Day Destroyer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Note: Geist via Google Fonts CDN. If unavailable use `npm install geist` and import from `geist/font`.

- [ ] **Step 7: Write `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --color-iron-900: #040509;
  --color-iron-800: #0a0c12;
  --color-iron-700: #11141e;
  --color-iron-600: #1e2235;
  --color-iron-500: #3d4258;
  --color-iron-400: #6b7280;
  --color-iron-300: #b8b1a7;
  --color-iron-200: #d4cfc9;
  --color-iron-100: #f2ede6;

  --color-accent-biceps: #7bb7ff;
  --color-accent-triceps: #ff9b5e;
  --color-accent-delts: #bd8cff;
  --color-accent-forearms: #82e6a8;

  --font-sans: "Geist", system-ui, sans-serif;
  --font-mono: "Geist Mono", monospace;
}

* {
  box-sizing: border-box;
}

body {
  background-color: #040509;
  color: #f2ede6;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 8: Write `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 9: Write `src/App.tsx` (stub)**

```tsx
export default function App() {
  return <div className="min-h-screen bg-iron-900 text-iron-100 p-4">Arm Day Destroyer</div>
}
```

- [ ] **Step 10: Write `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 11: Add scripts to `package.json`**

Ensure `package.json` scripts section contains:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 12: Verify it starts**

```bash
npm run dev
```
Expected: Dev server running at `http://localhost:5173`, page shows "Arm Day Destroyer"

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + TS + Tailwind v4 + Vitest"
```

---

## Task 2: Install shadcn/ui Components

**Files:**
- Create: `components.json`, `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`, `card.tsx`, `sheet.tsx`, `popover.tsx`, `progress.tsx`, `collapsible.tsx`

- [ ] **Step 1: Init shadcn**

```bash
npx shadcn@latest init
```

When prompted:
- Style: Default
- Base color: Neutral
- CSS variables: Yes

This creates `components.json` and `src/lib/utils.ts`.

- [ ] **Step 2: Install required components**

```bash
npx shadcn@latest add button card sheet popover progress collapsible
```

- [ ] **Step 3: Override CSS variables in `src/index.css`**

After the `@theme` block, add:
```css
:root {
  --background: 240 10% 2%;
  --foreground: 35 20% 93%;
  --card: 228 20% 6%;
  --card-foreground: 35 20% 93%;
  --border: 228 15% 10%;
  --input: 228 15% 10%;
  --ring: 213 80% 73%;
  --radius: 0.375rem;
}
```

- [ ] **Step 4: Verify components render**

Add a temporary button to `App.tsx`:
```tsx
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <div className="min-h-screen bg-iron-900 text-iron-100 p-8">
      <Button>Test</Button>
    </div>
  )
}
```

Run `npm run dev`, confirm button renders without errors.

- [ ] **Step 5: Revert App.tsx stub**

```tsx
export default function App() {
  return <div className="min-h-screen bg-iron-900 text-iron-100 p-4">Arm Day Destroyer</div>
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add shadcn/ui components"
```

---

## Task 3: Types

**Files:**
- Create: `src/types/workout.ts`
- Create: `src/types/index.ts`

- [ ] **Step 1: Write failing test**

Create `src/types/workout.test.ts`:
```ts
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
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- workout.test.ts
```
Expected: FAIL — "Cannot find module './workout'"

- [ ] **Step 3: Write `src/types/workout.ts`**

```ts
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
```

- [ ] **Step 4: Write `src/types/index.ts`**

```ts
export * from './workout'
```

- [ ] **Step 5: Run test — expect PASS**

```bash
npm test -- workout.test.ts
```
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add src/types/
git commit -m "feat: add TypeScript workout types"
```

---

## Task 4: Data — exercises.ts

**Files:**
- Create: `src/data/exercises.ts`

- [ ] **Step 1: Write failing test**

Create `src/data/exercises.test.ts`:
```ts
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
  it('block field matches id prefix', () => {
    exercises.forEach(ex => {
      expect(ex.block.toLowerCase()).toBe(ex.id[0])
    })
  })
})
```

Note: 15 exercises because the old app has exercises a1, a2, b1, b2, c1, c2, d1, d2, e1, e2, f1, f2, f3, g1, g2 = 15.

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm test -- exercises.test.ts
```
Expected: FAIL — "Cannot find module './exercises'"

- [ ] **Step 3: Write `src/data/exercises.ts`**

```ts
import type { Exercise } from '@/types'

export const exercises: Exercise[] = [
  {
    id: 'a1', block: 'A', group: 'biceps',
    name: 'EZ Bar Curls — Heavy',
    equipment: 'EZ CURL BAR',
    cue: 'Outer camber grip. 3-sec eccentric, explosive up. NO body English — if you\'re swinging it\'s too heavy. High-threshold motor unit recruiter. These fibers ONLY fully activate under heavy load — your 10-12 rep work in later blocks won\'t touch them.',
    sets: '3×6–8', tempo: '3-0-2', rest: '0s → A2', restSec: 0, rpe: '8–9',
    dbId: 'Barbell_Curl', tags: ['SS-A'], supersetGroup: 'a',
    science: 'Schoenfeld et al. (2021): including a heavy rep range alongside moderate ranges produces superior hypertrophy vs moderate-only programming.',
  },
  {
    id: 'a2', block: 'A', group: 'triceps',
    name: 'Close-Grip Floor Press',
    equipment: 'BARBELL + FLOOR',
    cue: 'Hands shoulder-width, lying on floor. 1-sec dead stop at bottom — eliminates stretch reflex, forces pure concentric power every rep. Tricep-dominant compound under heavy load. No rack needed, the floor is your safety.',
    sets: '3×6–8', tempo: '3-1-2', rest: '2 min', restSec: 120, rpe: '8–9',
    dbId: 'Close-Grip_Barbell_Bench_Press', tags: ['SS-B'], supersetGroup: 'b',
    science: 'Barnett et al. (1995): close-grip pressing produces significantly greater tricep activation than standard width.',
  },
  {
    id: 'b1', block: 'B', group: 'biceps',
    name: 'Low Cable Curls',
    equipment: 'CABLE — STRAIGHT BAR',
    cue: 'Full ROM, 1-sec squeeze at top. Tension NEVER drops — no dead zones, no gravity bailouts. Every inch of the ROM is loaded. Sets 1–2 at 2 RIR. Set 3: hit failure → drop 25% → failure again.',
    sets: '3×10–12', tempo: '3-1-2', rest: '0s → B2', restSec: 0, rpe: '8–9',
    dbId: 'Cable_Hammer_Curls_-_Rope_Attachment', tags: ['SS-A'], supersetGroup: 'a',
    lastSetTechnique: 'DROPSET',
    science: 'Frost et al. (2010): constant-tension modalities match or beat free weights for isolation hypertrophy.',
  },
  {
    id: 'b2', block: 'B', group: 'triceps',
    name: 'Overhead Cable Extension',
    equipment: 'CABLE — ROPE',
    cue: 'Face AWAY from stack. Rope behind head. DEEP stretch at bottom — hold 1 full second. Long head crosses the shoulder joint — it\'s ONLY fully stretched overhead. Pushdowns literally cannot replicate this stimulus. Sets 1–2 at 2 RIR. Set 3: drop set.',
    sets: '3×10–12', tempo: '3-1-2', rest: '90s', restSec: 90, rpe: '8–9',
    dbId: 'Triceps_Overhead_Extension_with_Rope', tags: ['SS-B'], supersetGroup: 'b',
    lastSetTechnique: 'DROPSET',
    science: 'Maeo et al. (2023): overhead tricep exercises produced significantly greater long head hypertrophy than pushdowns.',
  },
  {
    id: 'c1', block: 'C', group: 'biceps',
    name: 'Incline Dumbbell Curls',
    equipment: 'ADJ. BENCH (45°) + DUMBBELLS',
    cue: 'Arms hang behind torso. Long head fully stretched — the position where maximum hypertrophic stimulus occurs. Sets 1–2 at 1–2 RIR. Set 3: hit failure → stand up → hammer curl to failure. Mechanical advantage shift keeps motor units recruiting past normal failure.',
    sets: '3×10–12', tempo: '3-1-2', rest: '0s → C2', restSec: 0, rpe: '9',
    dbId: 'Alternate_Incline_Dumbbell_Curl', tags: ['SS-A'], supersetGroup: 'a',
    lastSetTechnique: 'MECH. DROP → HAMMER',
    science: 'Pedrosa et al. (2023): training at long muscle lengths produces significantly greater hypertrophy than short lengths.',
  },
  {
    id: 'c2', block: 'C', group: 'triceps',
    name: 'Cable Kickbacks',
    equipment: 'CABLE — SINGLE HANDLE',
    cue: 'Locked elbow, full extension, squeeze at peak. Block B hits long head at stretch — this hits it at peak contraction. Covering BOTH ends of the force-length curve across the session. Sets 1–2 controlled. Set 3: drop set.',
    sets: '3×12–15', tempo: '2-1-3', rest: '90s', restSec: 90, rpe: '9',
    dbId: 'Tricep_Dumbbell_Kickback', tags: ['SS-B'], supersetGroup: 'b',
    lastSetTechnique: 'DROPSET',
    science: 'Boeckh-Behrens EMG: kickbacks produce peak long head activation at full extension — complementary to overhead stretch work.',
  },
  {
    id: 'd1', block: 'D', group: 'biceps',
    name: 'EZ Bar Preacher Curls',
    equipment: 'EZ BAR + ADJ. BENCH',
    cue: 'Decline side of bench = makeshift preacher. Zero momentum — pure short head isolation. EVERY set rest-pause: hit failure → rack 15 sec → go again to failure. Every single rep is an effective rep.',
    sets: '2×10–12 +RP', tempo: '3-1-2', rest: '0s → D2', restSec: 0, rpe: '10',
    dbId: 'Preacher_Curl', tags: ['SS-A', 'REST-PAUSE'], supersetGroup: 'a',
    science: 'Prestes et al. (2019): rest-pause matches or beats traditional sets for hypertrophy in less total time.',
  },
  {
    id: 'd2', block: 'D', group: 'triceps',
    name: 'Rope Pushdowns',
    equipment: 'CABLE — ROPE',
    cue: 'Spread the rope at lockout, 1-sec squeeze. Different force angle from overhead — lateral head emphasis. Both sets rest-pause: failure → 15 sec → failure.',
    sets: '2×12–15 +RP', tempo: '2-1-3', rest: '90s', restSec: 90, rpe: '10',
    dbId: 'Triceps_Pushdown_-_Rope_Attachment', tags: ['SS-B', 'REST-PAUSE'], supersetGroup: 'b',
    science: 'Boehler et al. (2011): rope pushdowns with spread at lockout maximize lateral head recruitment.',
  },
  {
    id: 'e1', block: 'E', group: 'biceps',
    name: 'Concentration Curls',
    equipment: 'DUMBBELL',
    cue: 'One arm. Zero momentum. Peak contraction. MYO-REP: hit failure → 15 sec → 5 reps → 15 sec → 5 reps → 15 sec → 5 reps. That\'s ONE set. Two total. If you can make a fist after, you went too light.',
    sets: '2 × MYO-REP', tempo: '2-2-1', rest: '60s', restSec: 60, rpe: '10+',
    dbId: 'Concentration_Curls', tags: ['FINISHER'], isFinisher: true,
    science: 'Myo-reps (Fagerli): skip the easy reps, stack only effective reps back to back. Maximum stimulus per unit time.',
  },
  {
    id: 'e2', block: 'E', group: 'triceps',
    name: 'Straight Bar Pushdown 21\'s',
    equipment: 'CABLE — STRAIGHT BAR',
    cue: '7 top-half → 7 bottom-half → 7 full ROM. Different attachment from Block D = different force angle. Partials isolate portions of the strength curve full ROM misses. Two sets. Arms should be completely useless after this.',
    sets: '2×21', tempo: 'CTRL', rest: '60s', restSec: 60, rpe: '10+',
    dbId: 'Triceps_Pushdown', tags: ['FINISHER'], isFinisher: true,
    science: 'Partial-range partitioning forces maximal metabolite accumulation across the full ROM independently.',
  },
  {
    id: 'f1', block: 'F', group: 'delts',
    name: 'Cable Lateral Raises',
    equipment: 'CABLE — SINGLE HANDLE',
    cue: 'Behind-the-body cable path. Constant tension — zero dead zone at the bottom where gravity normally lets you coast with DBs. Sets 1–3 controlled. Set 4: myo-rep — hit failure → 15 sec → 5 reps × 3 rounds.',
    sets: '4×15–20', tempo: '2-1-2', rest: '45s', restSec: 45, rpe: '9',
    dbId: 'Cable_Lateral_Raise', tags: [], lastSetTechnique: 'MYO-REP',
    science: 'Cable laterals maintain resistance in the shortened position where DBs lose tension due to gravity vector alignment.',
  },
  {
    id: 'f2', block: 'F', group: 'delts',
    name: 'Dumbbell Lateral Raises',
    equipment: 'DUMBBELLS',
    cue: 'Different resistance curve from cables — hardest at 90° abduction where cables are easiest. Slight forward lean, lead with the pinky. Set 3: TRIPLE DROP — hit failure → drop 25% → failure → drop 25% → failure.',
    sets: '3×12–15', tempo: '2-1-2', rest: '45s', restSec: 45, rpe: '9',
    dbId: 'Side_Lateral_Raise', tags: [], lastSetTechnique: 'TRIPLE DROP',
    science: 'Combining cable + DB laterals covers complementary resistance curves — peak tension at different ROM positions (Vigotsky et al., 2018).',
  },
  {
    id: 'f3', block: 'F', group: 'delts',
    name: 'Behind-the-Back Cable Laterals',
    equipment: 'CABLE — SINGLE HANDLE',
    cue: 'Stand sideways to the cable, handle behind your back. This shifts the resistance curve to load the BOTTOM of the ROM — the exact portion DB and standard cable laterals miss. Third angle = third motor unit recruitment pattern. Set 3: drop set.',
    sets: '3×15–20', tempo: '2-1-2', rest: '45s', restSec: 45, rpe: '9',
    dbId: 'Cable_Lateral_Raise', tags: [], lastSetTechnique: 'DROPSET',
    science: 'Fonseca et al. (2014): exercise variation within a muscle group enhances hypertrophy via broader motor unit recruitment.',
  },
  {
    id: 'g1', block: 'G', group: 'forearms',
    name: 'Behind-the-Back Barbell Wrist Curls',
    equipment: 'BARBELL',
    cue: 'Standing, bar behind your back. Let it roll to FINGERTIPS, curl back with wrists only. Behind-the-back eliminates forearm pronation — pure wrist flexor isolation. High rep because forearms are slow-twitch dominant. Set 3: drop set.',
    sets: '3×20–25', tempo: '2-1-2', rest: '45s', restSec: 45, rpe: '9',
    dbId: 'Palms-Down_Wrist_Curl_Over_A_Bench', tags: [], lastSetTechnique: 'DROPSET',
    science: 'Forearm musculature is ~60-70% Type I (slow-twitch) fibers — higher rep ranges optimize hypertrophic stimulus (Schiaffino & Reggiani, 2011).',
  },
  {
    id: 'g2', block: 'G', group: 'forearms',
    name: 'Reverse Cable Curls',
    equipment: 'CABLE — STRAIGHT BAR',
    cue: 'Overhand grip, low cable. Brachioradialis — the muscle that makes your forearm look THICK from every angle. Constant cable tension makes this superior to reverse barbell curls. Last exercise of the day. Leave absolutely nothing. Set 3: myo-rep.',
    sets: '3×12–15', tempo: '3-1-2', rest: '45s', restSec: 45, rpe: '10',
    dbId: 'Reverse_Barbell_Curl', tags: ['FINISHER'], isFinisher: true,
    lastSetTechnique: 'MYO-REP',
    science: 'Brachioradialis hypertrophy requires pronated/neutral grip — supinated curls barely recruit it (Naito et al., 1998). Cable provides constant tension advantage.',
  },
]
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- exercises.test.ts
```
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/data/exercises.ts src/data/exercises.test.ts
git commit -m "feat: add typed exercises data (15 exercises)"
```

---

## Task 5: Data — blocks.ts and constants.ts

**Files:**
- Create: `src/data/blocks.ts`
- Create: `src/data/constants.ts`
- Create: `src/data/index.ts`

- [ ] **Step 1: Write failing test**

Create `src/data/blocks.test.ts`:
```ts
import { blocks } from './blocks'
import { RPE_DATA, TECHNIQUE_GLOSSARY, TEMPO_GUIDE } from './constants'

describe('blocks', () => {
  it('has 7 blocks A–G', () => {
    expect(blocks).toHaveLength(7)
    expect(blocks.map(b => b.id)).toEqual(['A','B','C','D','E','F','G'])
  })
  it('every block has accent color', () => {
    blocks.forEach(b => expect(b.accent).toMatch(/^#/))
  })
})

describe('constants', () => {
  it('RPE_DATA has 4 entries', () => {
    expect(RPE_DATA).toHaveLength(4)
  })
  it('TECHNIQUE_GLOSSARY has 6 entries', () => {
    expect(TECHNIQUE_GLOSSARY).toHaveLength(6)
  })
  it('TEMPO_GUIDE explains X-Y-Z format', () => {
    expect(TEMPO_GUIDE.format).toContain('Eccentric')
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- blocks.test.ts
```
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/data/blocks.ts`**

```ts
import type { Block } from '@/types'

export const blocks: Block[] = [
  { id: 'A', name: 'Heavy Compound', accent: '#ff5f6d',
    summary: 'Rep range variation, heavy tension, and true compound loading to wake up the highest-threshold fibers first.',
    detail: '6–8 reps · 2 min rest · antagonist pairing' },
  { id: 'B', name: 'Primary Cable', accent: '#69b7ff',
    summary: 'Constant tension work with drop sets on the last set to keep the stimulus high without messy loading changes.',
    detail: '10–12 reps · 90s rest · drop-set closer' },
  { id: 'C', name: 'Stretch Position', accent: '#d28dff',
    summary: 'Lengthened-biased isolation to exploit the strongest hypertrophy signal in the session.',
    detail: '10–15 reps · 90s rest · long-length emphasis' },
  { id: 'D', name: 'Isolation / Rest-Pause', accent: '#67d7ff',
    summary: 'Short, brutal rest-pause work to stack effective reps once the heavy work is already done.',
    detail: 'Failure work · 15s intra-set rest · 90s between pairs' },
  { id: 'E', name: 'Arm Finishers', accent: '#ffd670',
    summary: 'Pure metabolic stress to empty the tank and finish the arms with short rests and nasty techniques.',
    detail: '60s rest · myo-reps and 21s' },
  { id: 'F', name: 'Side Delt Specialization', accent: '#b98cff',
    summary: 'Three lateral raise resistance curves so the side delts get loaded at the bottom, middle, and shortened positions.',
    detail: '10 total sets · 45s rest · cable and DB coverage' },
  { id: 'G', name: 'Forearm Finish', accent: '#82e6a8',
    summary: 'Wrist flexor and brachioradialis work to finish the session with complete arm development.',
    detail: '6 total sets · 45s rest · slow-twitch friendly ranges' },
]
```

- [ ] **Step 4: Write `src/data/constants.ts`**

```ts
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
```

- [ ] **Step 5: Write `src/data/index.ts`**

```ts
export * from './exercises'
export * from './blocks'
export * from './constants'
```

- [ ] **Step 6: Run test — expect PASS**

```bash
npm test -- blocks.test.ts
```
Expected: PASS (5 tests)

- [ ] **Step 7: Commit**

```bash
git add src/data/
git commit -m "feat: add blocks and constants data"
```

---

## Task 6: Hook — useLocalStorage

**Files:**
- Create: `src/hooks/useLocalStorage.ts`
- Create: `src/hooks/useLocalStorage.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/hooks/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

beforeEach(() => localStorage.clear())

describe('useLocalStorage', () => {
  it('returns initial value when key is absent', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 42))
    expect(result.current[0]).toBe(42)
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))
    act(() => result.current[1](99))
    expect(localStorage.getItem('test-key')).toBe('99')
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('hello'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('hello')
  })

  it('supports functional updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0))
    act(() => result.current[1](prev => prev + 1))
    expect(result.current[0]).toBe(1)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- useLocalStorage.test.ts
```
Expected: FAIL — "Cannot find module './useLocalStorage'"

- [ ] **Step 3: Implement `src/hooks/useLocalStorage.ts`**

```ts
import { useState, useCallback } from 'react'

type SetValue<T> = (value: T | ((prev: T) => T)) => void

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue: SetValue<T> = useCallback(
    (value) => {
      setStoredValue(prev => {
        const next = value instanceof Function ? value(prev) : value
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // ignore write errors
        }
        return next
      })
    },
    [key]
  )

  return [storedValue, setValue]
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- useLocalStorage.test.ts
```
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useLocalStorage.ts src/hooks/useLocalStorage.test.ts
git commit -m "feat: add useLocalStorage hook"
```

---

## Task 7: Hook — useWorkoutTimer

**Files:**
- Create: `src/hooks/useWorkoutTimer.ts`
- Create: `src/hooks/useWorkoutTimer.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/hooks/useWorkoutTimer.test.ts
import { renderHook, act } from '@testing-library/react'
import { useWorkoutTimer } from './useWorkoutTimer'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useWorkoutTimer', () => {
  it('starts at 0 elapsed', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    expect(result.current.elapsed).toBe(0)
    expect(result.current.running).toBe(false)
  })

  it('increments elapsed each second when running', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.elapsed).toBe(3)
    expect(result.current.running).toBe(true)
  })

  it('stops incrementing after stop()', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(2000))
    act(() => result.current.stop())
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.elapsed).toBe(2)
    expect(result.current.running).toBe(false)
  })

  it('resets to 0', () => {
    const { result } = renderHook(() => useWorkoutTimer())
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5000))
    act(() => result.current.reset())
    expect(result.current.elapsed).toBe(0)
    expect(result.current.running).toBe(false)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- useWorkoutTimer.test.ts
```

- [ ] **Step 3: Implement `src/hooks/useWorkoutTimer.ts`**

```ts
import { useState, useRef, useCallback } from 'react'

interface WorkoutTimer {
  elapsed: number
  running: boolean
  start: () => void
  stop: () => void
  reset: () => void
}

export function useWorkoutTimer(): WorkoutTimer {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (intervalRef.current) return
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setElapsed(e => e + 1)
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setElapsed(0)
    setRunning(false)
  }, [])

  return { elapsed, running, start, stop, reset }
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- useWorkoutTimer.test.ts
```
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useWorkoutTimer.ts src/hooks/useWorkoutTimer.test.ts
git commit -m "feat: add useWorkoutTimer hook"
```

---

## Task 8: Hook — useRestTimer

**Files:**
- Create: `src/hooks/useRestTimer.ts`
- Create: `src/hooks/useRestTimer.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/hooks/useRestTimer.test.ts
import { renderHook, act } from '@testing-library/react'
import { useRestTimer } from './useRestTimer'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('useRestTimer', () => {
  it('starts inactive with 0 remaining', () => {
    const { result } = renderHook(() => useRestTimer())
    expect(result.current.active).toBe(false)
    expect(result.current.remaining).toBe(0)
  })

  it('counts down from given seconds', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => result.current.start(10))
    expect(result.current.active).toBe(true)
    expect(result.current.remaining).toBe(10)
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.remaining).toBe(7)
  })

  it('calls onComplete when reaching 0', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useRestTimer(onComplete))
    act(() => result.current.start(2))
    act(() => vi.advanceTimersByTime(2000))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(result.current.active).toBe(false)
  })

  it('cancel() stops countdown without calling onComplete', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useRestTimer(onComplete))
    act(() => result.current.start(10))
    act(() => result.current.cancel())
    act(() => vi.advanceTimersByTime(10000))
    expect(onComplete).not.toHaveBeenCalled()
    expect(result.current.active).toBe(false)
  })

  it('add() extends remaining time', () => {
    const { result } = renderHook(() => useRestTimer())
    act(() => result.current.start(30))
    act(() => result.current.add(15))
    expect(result.current.remaining).toBe(45)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- useRestTimer.test.ts
```

- [ ] **Step 3: Implement `src/hooks/useRestTimer.ts`**

```ts
import { useState, useRef, useCallback, useEffect } from 'react'

interface RestTimer {
  remaining: number
  active: boolean
  start: (seconds: number) => void
  cancel: () => void
  add: (seconds: number) => void
}

export function useRestTimer(onComplete?: () => void): RestTimer {
  const [remaining, setRemaining] = useState(0)
  const [active, setActive] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback((seconds: number) => {
    clear()
    setRemaining(seconds)
    setActive(true)
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clear()
          setActive(false)
          onCompleteRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clear])

  const cancel = useCallback(() => {
    clear()
    setActive(false)
    setRemaining(0)
  }, [clear])

  const add = useCallback((seconds: number) => {
    setRemaining(prev => prev + seconds)
  }, [])

  return { remaining, active, start, cancel, add }
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- useRestTimer.test.ts
```
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useRestTimer.ts src/hooks/useRestTimer.test.ts
git commit -m "feat: add useRestTimer hook"
```

---

## Task 9: Shared — WorkoutTimer display

**Files:**
- Create: `src/components/shared/WorkoutTimer.tsx`
- Create: `src/components/shared/WorkoutTimer.test.tsx`
- Create: `src/lib/format.ts`
- Create: `src/lib/format.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/format.test.ts
import { formatClock } from './format'

describe('formatClock', () => {
  it('formats seconds under 1 hour as MM:SS', () => {
    expect(formatClock(0)).toBe('0:00')
    expect(formatClock(65)).toBe('1:05')
    expect(formatClock(3599)).toBe('59:59')
  })
  it('formats seconds >= 1 hour as H:MM:SS', () => {
    expect(formatClock(3600)).toBe('1:00:00')
    expect(formatClock(3661)).toBe('1:01:01')
  })
})
```

```tsx
// src/components/shared/WorkoutTimer.test.tsx
import { render, screen } from '@testing-library/react'
import { WorkoutTimer } from './WorkoutTimer'

describe('WorkoutTimer', () => {
  it('renders elapsed time formatted', () => {
    render(<WorkoutTimer elapsed={125} />)
    expect(screen.getByText('2:05')).toBeInTheDocument()
  })
  it('shows running indicator when running', () => {
    render(<WorkoutTimer elapsed={0} running />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- format.test.ts WorkoutTimer.test.tsx
```

- [ ] **Step 3: Implement `src/lib/format.ts`**

```ts
export function formatClock(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}
```

- [ ] **Step 4: Implement `src/components/shared/WorkoutTimer.tsx`**

```tsx
import { formatClock } from '@/lib/format'
import { cn } from '@/lib/utils'

interface WorkoutTimerProps {
  elapsed: number
  running?: boolean
  className?: string
}

export function WorkoutTimer({ elapsed, running = false, className }: WorkoutTimerProps) {
  return (
    <div role="status" aria-label={`Workout time: ${formatClock(elapsed)}`}
      className={cn('flex items-center gap-2 font-mono text-sm text-iron-300', className)}>
      {running && (
        <span className="size-1.5 rounded-full bg-accent-biceps animate-pulse" aria-hidden />
      )}
      <span>{formatClock(elapsed)}</span>
    </div>
  )
}
```

- [ ] **Step 5: Run — expect PASS**

```bash
npm test -- format.test.ts WorkoutTimer.test.tsx
```
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add src/lib/format.ts src/lib/format.test.ts src/components/shared/WorkoutTimer.tsx src/components/shared/WorkoutTimer.test.tsx
git commit -m "feat: add WorkoutTimer component and formatClock utility"
```

---

## Task 10: Shared — QuickRestGrid

**Files:**
- Create: `src/components/shared/QuickRestGrid.tsx`
- Create: `src/components/shared/QuickRestGrid.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/shared/QuickRestGrid.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuickRestGrid } from './QuickRestGrid'

describe('QuickRestGrid', () => {
  it('renders all 4 preset buttons', () => {
    render(<QuickRestGrid onStart={vi.fn()} />)
    expect(screen.getByRole('button', { name: '30s' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '45s' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '60s' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '90s' })).toBeInTheDocument()
  })

  it('calls onStart with correct seconds', async () => {
    const onStart = vi.fn()
    render(<QuickRestGrid onStart={onStart} />)
    await userEvent.click(screen.getByRole('button', { name: '90s' }))
    expect(onStart).toHaveBeenCalledWith(90)
  })

  it('shows remaining time when timer is active', () => {
    render(<QuickRestGrid onStart={vi.fn()} remaining={47} active />)
    expect(screen.getByText('0:47')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- QuickRestGrid.test.tsx
```

- [ ] **Step 3: Implement `src/components/shared/QuickRestGrid.tsx`**

```tsx
import { Button } from '@/components/ui/button'
import { QUICK_REST_OPTIONS } from '@/data/constants'
import { formatClock } from '@/lib/format'
import { cn } from '@/lib/utils'

interface QuickRestGridProps {
  onStart: (seconds: number) => void
  onCancel?: () => void
  remaining?: number
  active?: boolean
  className?: string
}

export function QuickRestGrid({ onStart, onCancel, remaining = 0, active = false, className }: QuickRestGridProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {active && remaining > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono text-iron-100">{formatClock(remaining)}</span>
          {onCancel && (
            <button onClick={onCancel}
              className="text-xs text-iron-400 hover:text-iron-300 transition-colors">
              cancel
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-4 gap-1.5">
        {QUICK_REST_OPTIONS.map(sec => (
          <Button key={sec} variant="outline" size="sm"
            onClick={() => onStart(sec)}
            className="font-mono text-xs h-8 border-iron-700 bg-iron-800 hover:bg-iron-700 text-iron-300 hover:text-iron-100">
            {sec}s
          </Button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- QuickRestGrid.test.tsx
```
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/QuickRestGrid.tsx src/components/shared/QuickRestGrid.test.tsx
git commit -m "feat: add QuickRestGrid component"
```

---

## Task 11: Shared — ReferenceSheet

**Files:**
- Create: `src/components/shared/ReferenceSheet.tsx`
- Create: `src/components/shared/ReferenceSheet.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/shared/ReferenceSheet.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReferenceSheet } from './ReferenceSheet'

describe('ReferenceSheet', () => {
  it('renders trigger button with ?', () => {
    render(<ReferenceSheet />)
    expect(screen.getByRole('button', { name: /reference/i })).toBeInTheDocument()
  })

  it('opens sheet on click and shows tempo guide', async () => {
    render(<ReferenceSheet />)
    await userEvent.click(screen.getByRole('button', { name: /reference/i }))
    expect(screen.getByText(/Eccentric/i)).toBeInTheDocument()
  })

  it('shows RPE entries', async () => {
    render(<ReferenceSheet />)
    await userEvent.click(screen.getByRole('button', { name: /reference/i }))
    expect(screen.getByText('True failure')).toBeInTheDocument()
  })

  it('shows technique glossary', async () => {
    render(<ReferenceSheet />)
    await userEvent.click(screen.getByRole('button', { name: /reference/i }))
    expect(screen.getByText('Dropset')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- ReferenceSheet.test.tsx
```

- [ ] **Step 3: Implement `src/components/shared/ReferenceSheet.tsx`**

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { TEMPO_GUIDE, RPE_DATA, TECHNIQUE_GLOSSARY } from '@/data/constants'

export function ReferenceSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Reference guide"
          className="size-8 rounded-md text-iron-400 hover:text-iron-100 hover:bg-iron-800 font-mono text-sm">
          ?
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom"
        className="bg-iron-900 border-t border-iron-700 text-iron-100 max-h-[80vh] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-iron-100 font-sans text-base">Reference</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Tempo */}
          <section>
            <h3 className="text-xs font-mono uppercase tracking-widest text-iron-400 mb-2">Tempo</h3>
            <p className="text-sm text-iron-300 mb-1">{TEMPO_GUIDE.format}</p>
            <p className="text-sm font-mono text-iron-100">{TEMPO_GUIDE.example}</p>
            <div className="mt-2 space-y-1">
              {TEMPO_GUIDE.fields.map(f => (
                <div key={f.position} className="flex gap-2 text-sm">
                  <span className="font-mono text-iron-400 w-4">{f.position}</span>
                  <span className="text-iron-300">{f.label} — {f.description}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-iron-400 mt-1">CTRL = {TEMPO_GUIDE.special.CTRL}</p>
          </section>

          {/* RPE */}
          <section>
            <h3 className="text-xs font-mono uppercase tracking-widest text-iron-400 mb-2">RPE Scale</h3>
            <div className="space-y-1.5">
              {RPE_DATA.map(r => (
                <div key={r.label} className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-xs w-16" style={{ color: r.color }}>{r.label}</span>
                  <span className="text-iron-300">{r.description}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Techniques */}
          <section>
            <h3 className="text-xs font-mono uppercase tracking-widest text-iron-400 mb-2">Techniques</h3>
            <div className="space-y-1.5">
              {TECHNIQUE_GLOSSARY.map(([name, desc]) => (
                <div key={name} className="text-sm">
                  <span className="font-mono text-iron-100">{name}</span>
                  <span className="text-iron-400"> — </span>
                  <span className="text-iron-300">{desc}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- ReferenceSheet.test.tsx
```
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/ReferenceSheet.tsx src/components/shared/ReferenceSheet.test.tsx
git commit -m "feat: add ReferenceSheet drawer"
```

---

## Task 12: Overview — ExerciseCard

**Files:**
- Create: `src/components/overview/ExerciseCard.tsx`
- Create: `src/components/overview/ExerciseCard.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/overview/ExerciseCard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExerciseCard } from './ExerciseCard'
import { exercises } from '@/data/exercises'

const ex = exercises[0] // a1: EZ Bar Curls — Heavy

describe('ExerciseCard', () => {
  it('renders exercise name and equipment', () => {
    render(<ExerciseCard exercise={ex} blockAccent="#ff5f6d" onRestStart={vi.fn()} />)
    expect(screen.getByText('EZ Bar Curls — Heavy')).toBeInTheDocument()
    expect(screen.getByText('EZ CURL BAR')).toBeInTheDocument()
  })

  it('renders metrics row', () => {
    render(<ExerciseCard exercise={ex} blockAccent="#ff5f6d" onRestStart={vi.fn()} />)
    expect(screen.getByText('3×6–8')).toBeInTheDocument()
    expect(screen.getByText('3-0-2')).toBeInTheDocument()
    expect(screen.getByText('8–9')).toBeInTheDocument()
  })

  it('is collapsed by default — cue not visible', () => {
    render(<ExerciseCard exercise={ex} blockAccent="#ff5f6d" onRestStart={vi.fn()} />)
    expect(screen.queryByText(/Outer camber grip/)).not.toBeInTheDocument()
  })

  it('expands on click to show cue', async () => {
    render(<ExerciseCard exercise={ex} blockAccent="#ff5f6d" onRestStart={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /EZ Bar Curls/i }))
    expect(screen.getByText(/Outer camber grip/)).toBeInTheDocument()
  })

  it('calls onRestStart with exercise restSec', async () => {
    const onRestStart = vi.fn()
    const ex2 = exercises.find(e => e.restSec > 0)!
    render(<ExerciseCard exercise={ex2} blockAccent="#ff5f6d" onRestStart={onRestStart} />)
    await userEvent.click(screen.getByRole('button', { name: new RegExp(ex2.name, 'i') }))
    await userEvent.click(screen.getByRole('button', { name: /start rest/i }))
    expect(onRestStart).toHaveBeenCalledWith(ex2.restSec)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- ExerciseCard.test.tsx
```

- [ ] **Step 3: Implement `src/components/overview/ExerciseCard.tsx`**

```tsx
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'
import type { Exercise } from '@/types'
import { cn } from '@/lib/utils'

interface ExerciseCardProps {
  exercise: Exercise
  blockAccent: string
  onRestStart: (seconds: number) => void
}

function MetricChip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="font-mono text-xs text-iron-300 hover:text-iron-100 transition-colors cursor-help">
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-iron-800 border-iron-700 text-iron-200 text-xs p-2 max-w-48">
        {tooltip}
      </PopoverContent>
    </Popover>
  )
}

export function ExerciseCard({ exercise: ex, blockAccent, onRestStart }: ExerciseCardProps) {
  const [open, setOpen] = useState(false)
  const [scienceOpen, setScienceOpen] = useState(false)

  const tempoTooltip = ex.tempo === 'CTRL'
    ? 'Controlled — focus on tension throughout'
    : `Eccentric ${ex.tempo.split('-')[0]}s · Pause ${ex.tempo.split('-')[1]}s · Concentric ${ex.tempo.split('-')[2]}s`

  const rpeTooltip: Record<string, string> = {
    '8–9': '1–2 reps in reserve',
    '9': '1 rep left — heavy grinder',
    '10': 'True failure',
    '10+': 'Failure + extended technique',
  }

  return (
    <Card className="bg-iron-800 border-iron-700 overflow-hidden">
      <div className="h-0.5 w-full" style={{ backgroundColor: blockAccent }} />
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            aria-label={ex.name}
            className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-iron-700/50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-iron-400">{ex.id.toUpperCase()}</span>
                {ex.tags.map(t => (
                  <span key={t} className="text-xs font-mono px-1.5 py-0.5 rounded bg-iron-700 text-iron-300">{t}</span>
                ))}
              </div>
              <p className="text-sm font-medium text-iron-100 leading-snug">{ex.name}</p>
              <p className="text-xs text-iron-400 mt-0.5">{ex.equipment}</p>
            </div>
            <ChevronDown className={cn('size-4 text-iron-400 mt-1 shrink-0 transition-transform', open && 'rotate-180')} />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="px-4 pb-4 pt-0 space-y-3">
            {/* Metrics */}
            <div className="flex items-center gap-3 text-xs border-t border-iron-700 pt-3">
              <MetricChip label={ex.sets} tooltip="Sets × rep range" />
              <span className="text-iron-600">·</span>
              <MetricChip label={ex.tempo} tooltip={tempoTooltip} />
              <span className="text-iron-600">·</span>
              <MetricChip label={`RPE ${ex.rpe}`} tooltip={rpeTooltip[ex.rpe] ?? ex.rpe} />
              <span className="text-iron-600">·</span>
              <MetricChip label={ex.rest} tooltip="Rest period before next exercise" />
            </div>

            {/* Cue */}
            <p className="text-sm text-iron-300 leading-relaxed">{ex.cue}</p>

            {/* Science */}
            <Collapsible open={scienceOpen} onOpenChange={setScienceOpen}>
              <CollapsibleTrigger className="text-xs font-mono text-iron-400 hover:text-iron-300 transition-colors flex items-center gap-1">
                <ChevronDown className={cn('size-3 transition-transform', scienceOpen && 'rotate-180')} />
                WHY THIS WORKS
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="text-xs text-iron-400 mt-1.5 leading-relaxed">{ex.science}</p>
              </CollapsibleContent>
            </Collapsible>

            {/* Rest action */}
            {ex.restSec > 0 && (
              <Button size="sm" variant="outline"
                onClick={() => onRestStart(ex.restSec)}
                aria-label="Start rest"
                className="h-7 text-xs border-iron-600 bg-iron-700 hover:bg-iron-600 text-iron-200">
                Start rest · {ex.rest}
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- ExerciseCard.test.tsx
```
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/overview/ExerciseCard.tsx src/components/overview/ExerciseCard.test.tsx
git commit -m "feat: add ExerciseCard component"
```

---

## Task 13: Overview — BlockGroup + OverviewView

**Files:**
- Create: `src/components/overview/BlockGroup.tsx`
- Create: `src/components/overview/OverviewView.tsx`
- Create: `src/components/overview/OverviewView.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/overview/OverviewView.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OverviewView } from './OverviewView'

describe('OverviewView', () => {
  it('renders START SESSION button', () => {
    render(<OverviewView onStartSession={vi.fn()} onRestStart={vi.fn()} />)
    expect(screen.getByRole('button', { name: /start session/i })).toBeInTheDocument()
  })

  it('renders all 7 block headers', () => {
    render(<OverviewView onStartSession={vi.fn()} onRestStart={vi.fn()} />)
    expect(screen.getByText('Heavy Compound')).toBeInTheDocument()
    expect(screen.getByText('Arm Finishers')).toBeInTheDocument()
    expect(screen.getByText('Forearm Finish')).toBeInTheDocument()
  })

  it('calls onStartSession when START SESSION clicked', async () => {
    const onStartSession = vi.fn()
    render(<OverviewView onStartSession={onStartSession} onRestStart={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /start session/i }))
    expect(onStartSession).toHaveBeenCalledTimes(1)
  })

  it('focus filter "Arms" hides delt and forearm exercises', async () => {
    render(<OverviewView onStartSession={vi.fn()} onRestStart={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /arms only/i }))
    expect(screen.queryByText('Cable Lateral Raises')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- OverviewView.test.tsx
```

- [ ] **Step 3: Implement `src/components/overview/BlockGroup.tsx`**

```tsx
import type { Block, Exercise } from '@/types'
import { ExerciseCard } from './ExerciseCard'

interface BlockGroupProps {
  block: Block
  exercises: Exercise[]
  onRestStart: (seconds: number) => void
}

export function BlockGroup({ block, exercises, onRestStart }: BlockGroupProps) {
  if (exercises.length === 0) return null

  return (
    <section id={`block-${block.id}`}>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-mono text-xs" style={{ color: block.accent }}>{block.id}</span>
        <h2 className="text-sm font-medium text-iron-100">{block.name}</h2>
        <span className="text-xs text-iron-500 hidden sm:block">{block.detail}</span>
      </div>
      <div className="space-y-2">
        {exercises.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} blockAccent={block.accent} onRestStart={onRestStart} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Implement `src/components/overview/OverviewView.tsx`**

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BlockGroup } from './BlockGroup'
import { ReferenceSheet } from '@/components/shared/ReferenceSheet'
import { exercises } from '@/data/exercises'
import { blocks } from '@/data/blocks'
import type { FocusFilter, Exercise } from '@/types'
import { cn } from '@/lib/utils'

const FILTERS: Array<{ id: FocusFilter; label: string }> = [
  { id: 'full',      label: 'Full Session' },
  { id: 'arms',      label: 'Arms Only' },
  { id: 'delts',     label: 'Delts' },
  { id: 'forearms',  label: 'Forearms' },
  { id: 'finishers', label: 'Finishers' },
]

function filterExercises(exs: Exercise[], filter: FocusFilter): Exercise[] {
  switch (filter) {
    case 'full':      return exs
    case 'arms':      return exs.filter(e => e.group === 'biceps' || e.group === 'triceps')
    case 'delts':     return exs.filter(e => e.group === 'delts')
    case 'forearms':  return exs.filter(e => e.group === 'forearms')
    case 'finishers': return exs.filter(e => e.isFinisher)
    default:          return exs
  }
}

interface OverviewViewProps {
  onStartSession: () => void
  onRestStart: (seconds: number) => void
}

export function OverviewView({ onStartSession, onRestStart }: OverviewViewProps) {
  const [filter, setFilter] = useState<FocusFilter>('full')
  const filtered = filterExercises(exercises, filter)

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-iron-900/95 backdrop-blur-sm border-b border-iron-700 py-3 mb-6 -mx-4 px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={cn(
                  'text-xs px-2.5 py-1 rounded font-mono transition-colors',
                  filter === f.id
                    ? 'bg-iron-100 text-iron-900'
                    : 'text-iron-400 hover:text-iron-200 hover:bg-iron-800'
                )}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ReferenceSheet />
            <Button size="sm" onClick={onStartSession}
              className="h-8 text-xs bg-iron-100 text-iron-900 hover:bg-iron-200 font-medium">
              Start Session
            </Button>
          </div>
        </div>
      </div>

      {/* Block groups */}
      <div className="space-y-8">
        {blocks.map(block => (
          <BlockGroup key={block.id} block={block}
            exercises={filtered.filter(e => e.block === block.id)}
            onRestStart={onRestStart} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run — expect PASS**

```bash
npm test -- OverviewView.test.tsx
```
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/overview/
git commit -m "feat: add BlockGroup and OverviewView components"
```

---

## Task 14: Session — RestTimer display

**Files:**
- Create: `src/components/session/RestTimer.tsx`
- Create: `src/components/session/RestTimer.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/session/RestTimer.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestTimer } from './RestTimer'

describe('RestTimer', () => {
  it('renders nothing when inactive', () => {
    const { container } = render(<RestTimer active={false} remaining={0} total={90} onCancel={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows remaining time when active', () => {
    render(<RestTimer active remaining={47} total={90} onCancel={vi.fn()} />)
    expect(screen.getByText('0:47')).toBeInTheDocument()
  })

  it('shows progress bar', () => {
    render(<RestTimer active remaining={45} total={90} onCancel={vi.fn()} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('calls onCancel when dismissed', async () => {
    const onCancel = vi.fn()
    render(<RestTimer active remaining={30} total={90} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- RestTimer.test.tsx
```

- [ ] **Step 3: Implement `src/components/session/RestTimer.tsx`**

```tsx
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatClock } from '@/lib/format'

interface RestTimerProps {
  active: boolean
  remaining: number
  total: number
  onCancel: () => void
  label?: string
}

export function RestTimer({ active, remaining, total, onCancel, label }: RestTimerProps) {
  if (!active) return null

  const pct = total > 0 ? Math.round(((total - remaining) / total) * 100) : 0

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div>
          {label && <p className="text-xs text-iron-400 font-mono mb-0.5">{label}</p>}
          <p className="font-mono text-2xl font-medium text-iron-100">{formatClock(remaining)}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} aria-label="Cancel rest"
          className="text-iron-500 hover:text-iron-300 h-7 text-xs px-2">
          cancel
        </Button>
      </div>
      <Progress value={pct} className="h-1.5 bg-iron-700 [&>div]:bg-accent-biceps" />
    </div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- RestTimer.test.tsx
```
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/session/RestTimer.tsx src/components/session/RestTimer.test.tsx
git commit -m "feat: add RestTimer component"
```

---

## Task 15: Session — ExercisePanel

**Files:**
- Create: `src/components/session/ExercisePanel.tsx`
- Create: `src/components/session/ExercisePanel.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/session/ExercisePanel.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExercisePanel } from './ExercisePanel'
import { exercises } from '@/data/exercises'
import { blocks } from '@/data/blocks'

const ex = exercises[0]
const block = blocks[0]

describe('ExercisePanel', () => {
  it('renders exercise name', () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    expect(screen.getByText('EZ Bar Curls — Heavy')).toBeInTheDocument()
  })

  it('renders block context', () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    expect(screen.getByText(/block a/i)).toBeInTheDocument()
  })

  it('renders metrics row with sets, tempo, rpe', () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    expect(screen.getByText('3×6–8')).toBeInTheDocument()
    expect(screen.getByText('3-0-2')).toBeInTheDocument()
  })

  it('renders cue text', () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    expect(screen.getByText(/Outer camber grip/)).toBeInTheDocument()
  })

  it('WHY THIS WORKS is collapsed by default', () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    expect(screen.queryByText(/Schoenfeld/)).not.toBeInTheDocument()
  })

  it('expands WHY THIS WORKS on click', async () => {
    render(<ExercisePanel exercise={ex} block={block} setsCompleted={0} onRestStart={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /why this works/i }))
    expect(screen.getByText(/Schoenfeld/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- ExercisePanel.test.tsx
```

- [ ] **Step 3: Implement `src/components/session/ExercisePanel.tsx`**

```tsx
import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'
import type { Exercise, Block } from '@/types'
import { cn } from '@/lib/utils'

interface ExercisePanelProps {
  exercise: Exercise
  block: Block
  setsCompleted: number
  onRestStart: (seconds: number) => void
}

function MetricChip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="font-mono text-sm text-iron-200 hover:text-iron-100 transition-colors border-b border-dashed border-iron-600 cursor-help leading-none pb-0.5">
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-iron-800 border-iron-700 text-iron-200 text-xs p-2 max-w-48">
        {tooltip}
      </PopoverContent>
    </Popover>
  )
}

function parseSetsCount(sets: string): number {
  const match = sets.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

export function ExercisePanel({ exercise: ex, block, setsCompleted, onRestStart }: ExercisePanelProps) {
  const [scienceOpen, setScienceOpen] = useState(false)
  const totalSets = parseSetsCount(ex.sets)

  const tempoTooltip = ex.tempo === 'CTRL'
    ? 'Controlled — focus on tension throughout'
    : (() => {
        const [e, p, c] = ex.tempo.split('-')
        return `Eccentric ${e}s · Pause ${p}s · Concentric ${c}s`
      })()

  const rpeMap: Record<string, string> = {
    '8–9': '1–2 reps in reserve',
    '9': '1 rep left — heavy grinder',
    '10': 'True failure',
    '10+': 'Failure + extended technique',
  }

  return (
    <div className="space-y-4">
      {/* Block context */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs uppercase tracking-widest"
          style={{ color: block.accent }}>
          Block {block.id}
        </span>
        {totalSets > 0 && (
          <span className="text-xs text-iron-500 font-mono">
            · {setsCompleted} of {totalSets} sets
          </span>
        )}
        {ex.supersetGroup && (
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-iron-800 text-iron-400">
            SS-{ex.supersetGroup.toUpperCase()}
          </span>
        )}
      </div>

      {/* Exercise name */}
      <h1 className="text-2xl font-semibold text-iron-100 leading-tight">{ex.name}</h1>

      {/* Metrics row */}
      <div className="flex items-center gap-3 flex-wrap">
        <MetricChip label={ex.sets} tooltip="Sets × rep range" />
        <span className="text-iron-700">·</span>
        <MetricChip label={ex.tempo} tooltip={tempoTooltip} />
        <span className="text-iron-700">·</span>
        <MetricChip label={`RPE ${ex.rpe}`} tooltip={rpeMap[ex.rpe] ?? ex.rpe} />
        <span className="text-iron-700">·</span>
        <MetricChip label={ex.rest} tooltip="Rest before next exercise" />
      </div>

      {/* Execution cue */}
      <p className="text-sm text-iron-300 leading-relaxed">{ex.cue}</p>

      {/* Superset indicator */}
      {ex.rest === `0s → ${ex.id[0].toUpperCase()}2` && (
        <p className="text-xs font-mono text-iron-400">
          ↑ Superset — go straight to next exercise, no rest
        </p>
      )}

      {/* Special last-set technique */}
      {ex.lastSetTechnique && (
        <p className="text-xs font-mono text-amber-400">
          Last set: {ex.lastSetTechnique}
        </p>
      )}

      {/* WHY THIS WORKS */}
      <Collapsible open={scienceOpen} onOpenChange={setScienceOpen}>
        <CollapsibleTrigger asChild>
          <button aria-label="Why this works"
            className={cn(
              'flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest transition-colors',
              scienceOpen ? 'text-iron-300' : 'text-iron-500 hover:text-iron-400'
            )}>
            <ChevronDown className={cn('size-3 transition-transform', scienceOpen && 'rotate-180')} />
            Why This Works
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-xs text-iron-400 mt-2 leading-relaxed border-l-2 border-iron-700 pl-3">
            {ex.science}
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- ExercisePanel.test.tsx
```
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/session/ExercisePanel.tsx src/components/session/ExercisePanel.test.tsx
git commit -m "feat: add ExercisePanel component"
```

---

## Task 16: Session — SessionView

**Files:**
- Create: `src/components/session/SessionView.tsx`
- Create: `src/components/session/SessionView.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/components/session/SessionView.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SessionView } from './SessionView'
import { DEFAULT_SESSION_STATE } from '@/types'

const baseState = { ...DEFAULT_SESSION_STATE, started: true, startedAt: Date.now() }

describe('SessionView', () => {
  it('renders first exercise on load', () => {
    render(<SessionView sessionState={baseState} onSessionUpdate={vi.fn()} onEndSession={vi.fn()} />)
    expect(screen.getByText('EZ Bar Curls — Heavy')).toBeInTheDocument()
  })

  it('renders NEXT and PREV navigation', () => {
    render(<SessionView sessionState={baseState} onSessionUpdate={vi.fn()} onEndSession={vi.fn()} />)
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument()
  })

  it('advances to next exercise on NEXT click', async () => {
    const onUpdate = vi.fn()
    render(<SessionView sessionState={baseState} onSessionUpdate={onUpdate} onEndSession={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ currentIndex: 1 }))
  })

  it('prev is disabled on first exercise', () => {
    render(<SessionView sessionState={baseState} onSessionUpdate={vi.fn()} onEndSession={vi.fn()} />)
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled()
  })

  it('renders quick rest grid', () => {
    render(<SessionView sessionState={baseState} onSessionUpdate={vi.fn()} onEndSession={vi.fn()} />)
    expect(screen.getByRole('button', { name: '90s' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- SessionView.test.tsx
```

- [ ] **Step 3: Implement `src/components/session/SessionView.tsx`**

```tsx
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ExercisePanel } from './ExercisePanel'
import { RestTimer } from './RestTimer'
import { WorkoutTimer } from '@/components/shared/WorkoutTimer'
import { QuickRestGrid } from '@/components/shared/QuickRestGrid'
import { ReferenceSheet } from '@/components/shared/ReferenceSheet'
import { useWorkoutTimer } from '@/hooks/useWorkoutTimer'
import { useRestTimer } from '@/hooks/useRestTimer'
import { exercises } from '@/data/exercises'
import { blocks } from '@/data/blocks'
import type { SessionState } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SessionViewProps {
  sessionState: SessionState
  onSessionUpdate: (state: SessionState) => void
  onEndSession: () => void
}

export function SessionView({ sessionState, onSessionUpdate, onEndSession }: SessionViewProps) {
  const { elapsed, running, start: startTimer } = useWorkoutTimer()
  const restTimer = useRestTimer()

  useEffect(() => { startTimer() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const current = exercises[sessionState.currentIndex]
  const block = blocks.find(b => b.id === current.block)!
  const setsCompleted = sessionState.setProgress[current.id] ?? 0
  const isFirst = sessionState.currentIndex === 0
  const isLast = sessionState.currentIndex === exercises.length - 1

  const goNext = () => {
    if (isLast) return
    onSessionUpdate({ ...sessionState, currentIndex: sessionState.currentIndex + 1 })
  }

  const goPrev = () => {
    if (isFirst) return
    onSessionUpdate({ ...sessionState, currentIndex: sessionState.currentIndex - 1 })
  }

  const handleRestStart = (seconds: number) => restTimer.start(seconds)

  const totalSets = exercises.reduce((acc, ex) => {
    const match = ex.sets.match(/^(\d+)/)
    return acc + (match ? parseInt(match[1], 10) : 0)
  }, 0)

  const completedSets = Object.values(sessionState.setProgress).reduce((a, b) => a + b, 0)
  const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0

  return (
    <div className="min-h-screen bg-iron-900 flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-iron-800">
        <WorkoutTimer elapsed={elapsed} running={running} />
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-iron-500">{progressPct}%</span>
          <Button variant="ghost" size="sm" onClick={onEndSession}
            className="text-xs text-iron-500 hover:text-iron-300 h-7 px-2">
            end
          </Button>
          <ReferenceSheet />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-iron-800">
        <div className="h-full bg-iron-300 transition-all duration-300"
          style={{ width: `${progressPct}%` }} />
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <ExercisePanel
          exercise={current}
          block={block}
          setsCompleted={setsCompleted}
          onRestStart={handleRestStart}
        />

        {/* Rest timer */}
        <RestTimer
          active={restTimer.active}
          remaining={restTimer.remaining}
          total={current.restSec}
          onCancel={restTimer.cancel}
          label="Rest"
        />

        {/* Quick rest grid */}
        <div>
          <p className="text-xs font-mono text-iron-500 uppercase tracking-widest mb-2">Quick Rest</p>
          <QuickRestGrid
            onStart={handleRestStart}
            onCancel={restTimer.cancel}
            remaining={restTimer.remaining}
            active={restTimer.active}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-iron-800 px-4 py-3 flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={goPrev} disabled={isFirst}
          aria-label="Prev exercise"
          className="flex items-center gap-1 border-iron-700 bg-iron-800 hover:bg-iron-700 text-iron-300 disabled:opacity-30 h-9 px-4">
          <ChevronLeft className="size-4" />
          Prev
        </Button>

        {/* Set counter */}
        <button
          onClick={() => {
            const updated = { ...sessionState.setProgress, [current.id]: setsCompleted + 1 }
            onSessionUpdate({ ...sessionState, setProgress: updated })
          }}
          className="text-xs font-mono text-iron-400 hover:text-iron-200 transition-colors">
          +1 set
        </button>

        <Button variant="outline" size="sm" onClick={goNext} disabled={isLast}
          aria-label="Next exercise"
          className="flex items-center gap-1 border-iron-700 bg-iron-800 hover:bg-iron-700 text-iron-300 disabled:opacity-30 h-9 px-4">
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- SessionView.test.tsx
```
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/session/
git commit -m "feat: add SessionView component"
```

---

## Task 17: App Assembly

**Files:**
- Modify: `src/App.tsx`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/App.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => localStorage.clear())

describe('App', () => {
  it('renders overview by default', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /start session/i })).toBeInTheDocument()
  })

  it('switches to session view on Start Session', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /start session/i }))
    expect(screen.getByText('EZ Bar Curls — Heavy')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('returns to overview on End', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /start session/i }))
    await userEvent.click(screen.getByRole('button', { name: /end/i }))
    expect(screen.getByRole('button', { name: /start session/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
npm test -- App.test.tsx
```

- [ ] **Step 3: Implement `src/App.tsx`**

```tsx
import { useCallback } from 'react'
import { OverviewView } from '@/components/overview/OverviewView'
import { SessionView } from '@/components/session/SessionView'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useRestTimer } from '@/hooks/useRestTimer'
import type { SessionState } from '@/types'
import { DEFAULT_SESSION_STATE } from '@/types'

type View = 'overview' | 'session'

export default function App() {
  const [view, setView] = useLocalStorage<View>('add-view', 'overview')
  const [sessionState, setSessionState] = useLocalStorage<SessionState>(
    'add-session', DEFAULT_SESSION_STATE
  )
  const restTimer = useRestTimer()

  const startSession = useCallback(() => {
    setSessionState({ ...DEFAULT_SESSION_STATE, started: true, startedAt: Date.now() })
    setView('session')
  }, [setSessionState, setView])

  const endSession = useCallback(() => {
    setSessionState(DEFAULT_SESSION_STATE)
    setView('overview')
  }, [setSessionState, setView])

  if (view === 'session' && sessionState.started) {
    return (
      <SessionView
        sessionState={sessionState}
        onSessionUpdate={setSessionState}
        onEndSession={endSession}
      />
    )
  }

  return (
    <OverviewView
      onStartSession={startSession}
      onRestStart={restTimer.start}
    />
  )
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
npm test -- App.test.tsx
```
Expected: PASS (3 tests)

- [ ] **Step 5: Run full test suite**

```bash
npm test
```
Expected: All tests green — ~38 tests across 11 files.

- [ ] **Step 6: Type check**

```bash
npm run typecheck
```
Expected: No errors.

- [ ] **Step 7: Run dev and do a manual smoke test**

```bash
npm run dev
```
- Open `http://localhost:5173`
- Confirm overview renders with all 7 blocks
- Click Start Session — confirm session view loads on exercise a1
- Tap a metric chip — confirm popover appears
- Click "90s" rest — confirm timer counts down
- Click NEXT — confirm advances to exercise a2
- Click end — confirm returns to overview
- Reload page in session — confirm session state restored from localStorage

- [ ] **Step 8: Final commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: assemble App with view toggle and session persistence"
```

---

## Task 18: Finishing

- [ ] **Step 1: Run VibeSec check**

Use `VibeSec-Skill` bug-hunter mode. Focus on: localStorage data handling (no eval, no unescaped injection), external image URLs (free-exercise-db), no user input paths.

- [ ] **Step 2: Run verification-before-completion**

Use `superpowers:verification-before-completion` to confirm all success criteria:
1. Open on phone mid-workout — exercise, timer, cues visible without taps ✓
2. Code is typed, component-split, tested ✓
3. Interactions feel fast and tactile ✓

- [ ] **Step 3: Run finishing-a-development-branch**

Use `superpowers:finishing-a-development-branch` for final branch hygiene.

- [ ] **Step 4: Build check**

```bash
npm run build
```
Expected: No TypeScript errors, successful build in `dist/`.
