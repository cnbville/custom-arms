import { useState } from 'react'
import { CheckCircle2, RefreshCcw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { WorkoutDefinition, WorkoutId } from '@/types'
import {
  analyzeQuickImportPayload,
  parseQuickImportPayload,
  type QuickImportAnalysis,
} from '@/lib/quickImport'

interface QuickImportPanelProps {
  workouts: Record<WorkoutId, WorkoutDefinition>
  currentWorkoutId: WorkoutId
  importedCounts: Record<WorkoutId, number>
  onApplyImport: (analysis: QuickImportAnalysis) => void
  onClearImported: (workoutId: WorkoutId) => void
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'new' | 'existing' | 'duplicate' | 'ignored'
}) {
  const toneClasses = {
    new: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
    existing: 'border-iron-600/60 bg-iron-800/80 text-iron-200',
    duplicate: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
    ignored: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  }

  return (
    <div className={cn('rounded-2xl border px-4 py-3', toneClasses[tone])}>
      <p className="text-[10px] font-mono uppercase tracking-[0.28em] opacity-75">{label}</p>
      <p className="mt-2 text-3xl font-black leading-none">{value}</p>
    </div>
  )
}

function StatusPill({ status }: { status: 'new' | 'existing' | 'duplicate' | 'ignored' }) {
  const styleMap = {
    new: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
    existing: 'border-iron-600/60 bg-iron-800 text-iron-200',
    duplicate: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
    ignored: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  }

  const labelMap = {
    new: 'New',
    existing: 'Already There',
    duplicate: 'Duplicate',
    ignored: 'Ignored',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-mono uppercase tracking-[0.22em]',
        styleMap[status]
      )}
    >
      {labelMap[status]}
    </span>
  )
}

function formatFeedback(analysis: QuickImportAnalysis, workouts: Record<WorkoutId, WorkoutDefinition>): string {
  const parts = analysis.sections
    .filter((section) => section.targetWorkoutId && section.counts.new > 0)
    .map((section) => `${section.counts.new} to ${workouts[section.targetWorkoutId as WorkoutId].name}`)

  const addedLine = parts.length > 0
    ? `Added ${parts.join(', ')}.`
    : 'No new exercises were added.'

  const skippedParts = [
    analysis.totals.existing > 0 ? `${analysis.totals.existing} already existed` : null,
    analysis.totals.duplicate > 0 ? `${analysis.totals.duplicate} were duplicated in the file` : null,
    analysis.totals.ignored > 0 ? `${analysis.totals.ignored} were ignored` : null,
  ].filter(Boolean)

  return skippedParts.length > 0
    ? `${addedLine} Skipped ${skippedParts.join(', ')}.`
    : addedLine
}

export function QuickImportPanel({
  workouts,
  currentWorkoutId,
  importedCounts,
  onApplyImport,
  onClearImported,
}: QuickImportPanelProps) {
  const [draft, setDraft] = useState('')
  const [analysis, setAnalysis] = useState<QuickImportAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const totalImported = Object.values(importedCounts).reduce((sum, count) => sum + count, 0)
  const currentImported = importedCounts[currentWorkoutId] ?? 0

  const handleReview = () => {
    try {
      const payload = parseQuickImportPayload(draft)
      const nextAnalysis = analyzeQuickImportPayload(payload, workouts)

      setAnalysis(nextAnalysis)
      setError(null)
      setFeedback(null)
    } catch (nextError) {
      setAnalysis(null)
      setFeedback(null)
      setError(nextError instanceof Error ? nextError.message : 'Quick import failed.')
    }
  }

  const handleApply = () => {
    if (!analysis || analysis.totals.new === 0) return

    onApplyImport(analysis)
    setFeedback(formatFeedback(analysis, workouts))
    setDraft('')
    setAnalysis(null)
    setError(null)
  }

  const handleDraftChange = (value: string) => {
    setDraft(value)
    setAnalysis(null)
    setError(null)
    setFeedback(null)
  }

  const sortedSections = analysis
    ? analysis.sections.map((section) => ({
        ...section,
        items: [...section.items].sort((left, right) => {
          const order = { new: 0, existing: 1, duplicate: 2, ignored: 3 }
          if (order[left.status] !== order[right.status]) return order[left.status] - order[right.status]
          return left.exerciseName.localeCompare(right.exerciseName)
        }),
      }))
    : []

  return (
    <section className="rounded-[28px] border border-iron-700/70 bg-iron-900/82 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-iron-500">Quick Import</p>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-iron-50 lg:text-3xl">
            Review the import before anything gets added.
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-iron-400">
            Paste workout JSON, review the breakdown, then add only the brand-new exercise names.
            Existing exercises stay untouched, so you can see clearly what is actually new.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 lg:min-w-[15rem]">
          <div className="rounded-2xl border border-iron-700/60 bg-iron-950/70 px-3 py-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-iron-500">Arms Live</p>
            <p className="mt-2 text-2xl font-black text-iron-100">{importedCounts.arms}</p>
          </div>
          <div className="rounded-2xl border border-iron-700/60 bg-iron-950/70 px-3 py-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-iron-500">Shoulders Live</p>
            <p className="mt-2 text-2xl font-black text-iron-100">{importedCounts.shoulders}</p>
          </div>
          <div className="rounded-2xl border border-iron-700/60 bg-iron-950/70 px-3 py-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-iron-500">Total Live</p>
            <p className="mt-2 text-2xl font-black text-iron-100">{totalImported}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-3">
          <label htmlFor="quick-import-json" className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">
            Workout JSON
          </label>
          <textarea
            id="quick-import-json"
            value={draft}
            onChange={(event) => handleDraftChange(event.target.value)}
            placeholder={`{\n  "version": 1,\n  "workouts": [ ... ]\n}`}
            className="min-h-[220px] w-full rounded-[24px] border border-iron-700/70 bg-iron-950/80 px-4 py-4 font-mono text-sm leading-6 text-iron-200 outline-none transition-colors placeholder:text-iron-600 focus:border-iron-500"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleReview}
              className="bg-iron-100 text-iron-900 hover:bg-white"
            >
              Review Import
            </Button>
            <Button
              variant="outline"
              onClick={handleApply}
              disabled={!analysis || analysis.totals.new === 0}
              className="border-emerald-400/35 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20 hover:text-emerald-50"
            >
              Add {analysis?.totals.new ?? 0} New Exercise{analysis?.totals.new === 1 ? '' : 's'}
            </Button>
            <Button
              variant="ghost"
              disabled={currentImported === 0}
              onClick={() => {
                onClearImported(currentWorkoutId)
                setAnalysis(null)
                setError(null)
                setFeedback(`Removed ${currentImported} imported exercise${currentImported === 1 ? '' : 's'} from ${workouts[currentWorkoutId].name}.`)
              }}
              className="text-iron-300 hover:bg-iron-800 hover:text-iron-50"
            >
              <RefreshCcw className="size-4" />
              Clear {workouts[currentWorkoutId].name}
            </Button>
          </div>
        </div>

        <div className="rounded-[24px] border border-iron-700/70 bg-iron-950/75 p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-iron-500">What Happens</p>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-iron-300">
            <p>1. Review the file before anything changes.</p>
            <p>2. Only brand-new exercise names get added.</p>
            <p>3. Existing names are kept as-is and marked clearly.</p>
            <p>4. New exercises land in a dedicated Quick Import block inside the workout.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {feedback && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <p>{feedback}</p>
        </div>
      )}

      {analysis && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="New" value={analysis.totals.new} tone="new" />
            <SummaryCard label="Already There" value={analysis.totals.existing} tone="existing" />
            <SummaryCard label="Duplicate" value={analysis.totals.duplicate} tone="duplicate" />
            <SummaryCard label="Ignored" value={analysis.totals.ignored} tone="ignored" />
          </div>

          <div className="space-y-3">
            {sortedSections.map((section) => (
              <div key={`${section.sourceWorkoutName}-${section.targetWorkoutName}`} className="rounded-[24px] border border-iron-700/60 bg-iron-950/70 overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-iron-800/80 px-4 py-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-lg font-bold text-iron-100">{section.sourceWorkoutName}</p>
                    <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.24em] text-iron-500">
                      {section.targetWorkoutId ? `Into ${section.targetWorkoutName}` : 'Not mapped to a workout'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill status="new" />
                    <span className="text-sm text-iron-400">{section.counts.new}</span>
                    <StatusPill status="existing" />
                    <span className="text-sm text-iron-400">{section.counts.existing}</span>
                    <StatusPill status="duplicate" />
                    <span className="text-sm text-iron-400">{section.counts.duplicate}</span>
                    <StatusPill status="ignored" />
                    <span className="text-sm text-iron-400">{section.counts.ignored}</span>
                  </div>
                </div>

                <div className="divide-y divide-iron-800/80">
                  {section.items.map((item) => (
                    <div key={`${section.sourceWorkoutName}-${item.exerciseName}-${item.status}`} className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-iron-100">{item.exerciseName}</p>
                        <p className="mt-1 text-xs text-iron-500">{item.reason}</p>
                      </div>
                      <StatusPill status={item.status} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
