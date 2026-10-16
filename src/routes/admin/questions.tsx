import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Label } from '../../components/ui/label'
import { AdminPage, Notice, Panel, Pill, StatTile } from '../../components/admin/admin-ui'

export const Route = createFileRoute('/admin/questions')({
  component: AdminQuestions,
})

interface Subject {
  id: string
  name: string
}
interface Concept {
  id: string
  name: string
  code: string
}
interface QuestionRow {
  id: string
  text: string
  type: string
  marks: number
  bloom: string
  difficulty: string
  status: string
  concept_id: string
  answer: string
  is_reversal_word: boolean
}
interface QuestionStats {
  attempts: number
  success_rate: number | null
  mean_time_sec: number | null
  success_rate_by_mastery: Record<string, number>
  anomaly: { flagged: boolean; reasons: Array<string> }
}

const BLOOM_LEVELS = [
  'Remember',
  'Understand',
  'Apply',
  'Analyse',
  'Evaluate',
  'Create',
]
const DIFFICULTIES = ['Easy', 'Hard', 'Hardest']

/**
 * F084 (tab06 /admin/questions): "Filterable bank, editor, bulk import, AI generate." Every
 * question is approved and usable the moment it's created -- there is no review/approval gate
 * (removed 2026-09-17 at the user's explicit request). A question later found to be wrong is
 * pulled from the pool with the Question bank section's Retire button, not "rejected". Launch
 * scope is CBSE Class 7 (CLAUDE.md) so subjects are fetched for that board/class directly rather
 * than building a full board/class picker nobody needs yet.
 */
function AdminQuestions() {
  const [subjects, setSubjects] = useState<Array<Subject>>([])
  const [subjectId, setSubjectId] = useState('')
  const [concepts, setConcepts] = useState<Array<Concept>>([])
  const [conceptId, setConceptId] = useState('')

  const [genBloom, setGenBloom] = useState('Remember')
  const [genDifficulty, setGenDifficulty] = useState('Easy')
  const [genCount, setGenCount] = useState(3)
  const [genResult, setGenResult] = useState<{
    generated: Array<unknown>
    rejected: Array<{ reason: string }>
    ai_configured: boolean
    message?: string
  } | null>(null)
  const [generating, setGenerating] = useState(false)

  const [importFile, setImportFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<{
    imported?: number
    rejected?: Array<unknown>
  } | null>(null)

  const [bankQuestions, setBankQuestions] = useState<Array<QuestionRow> | null>(
    null,
  )
  const [bankExpandedId, setBankExpandedId] = useState<string | null>(null)
  const [bankStats, setBankStats] = useState<QuestionStats | null>(null)
  const [bankError, setBankError] = useState<string | null>(null)
  const [bankPending, setBankPending] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'retired'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/syllabus/subjects?board=CBSE&class=7')
      .then((r) => r.json())
      .then((data: Array<Subject>) => {
        setSubjects(data)
        if (data.length === 1) setSubjectId(data[0].id)
      })
  }, [])

  useEffect(() => {
    setConceptId('')
    setConcepts([])
    if (!subjectId) return
    fetch(`/api/syllabus/concepts?subject_id=${subjectId}`)
      .then((r) => r.json())
      .then(setConcepts)
  }, [subjectId])

  function refreshBank() {
    if (!conceptId) return
    fetch(`/api/questions?concept=${conceptId}&pageSize=100`)
      .then((r) => r.json())
      .then((data: { items: Array<QuestionRow> }) => setBankQuestions(data.items))
  }

  useEffect(() => {
    setBankQuestions(null)
    setBankExpandedId(null)
    refreshBank()
  }, [conceptId])

  // F060: the only place in any screen a reversal-word tag can be set or corrected -- previously
  // API/CSV-only. PATCHes and updates local state directly rather than a full refreshBank() round
  // trip, since that would also drop the currently-loaded stats/expanded state.
  async function toggleReversalWord(q: QuestionRow) {
    const next = !q.is_reversal_word
    const response = await fetch(`/api/questions/${q.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ is_reversal_word: next }),
    })
    if (!response.ok) return
    setBankQuestions(
      (prev) =>
        prev?.map((r) =>
          r.id === q.id ? { ...r, is_reversal_word: next } : r,
        ) ?? null,
    )
  }

  async function toggleBankExpand(q: QuestionRow) {
    if (bankExpandedId === q.id) {
      setBankExpandedId(null)
      return
    }
    setBankExpandedId(q.id)
    setBankStats(null)
    setBankError(null)
    const stats = await (await fetch(`/api/questions/${q.id}/stats`)).json()
    setBankStats(stats)
  }

  // F118: "can be retired without deleting historical results" -- status is the only thing this
  // flips; every paper/attempt/evaluation that already used the question keeps referencing it
  // untouched (verified server-side in question-stats.integration.test.ts).
  async function toggleRetired(q: QuestionRow) {
    setBankError(null)
    setBankPending(q.id)
    try {
      const nextStatus = q.status === 'retired' ? 'approved' : 'retired'
      const response = await fetch(`/api/questions/${q.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      const body = await response.json()
      if (!response.ok) {
        setBankError(body.error ?? 'Could not update that question.')
        return
      }
      refreshBank()
    } finally {
      setBankPending(null)
    }
  }

  async function generate() {
    if (!conceptId) return
    setGenerating(true)
    setGenResult(null)
    try {
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          concept_id: conceptId,
          count: genCount,
          bloom: genBloom,
          difficulty: genDifficulty,
        }),
      })
      const body = await response.json()
      setGenResult(body)
      refreshBank()
    } finally {
      setGenerating(false)
    }
  }

  async function submitImport(e: React.FormEvent) {
    e.preventDefault()
    if (!importFile) return
    const formData = new FormData()
    formData.append('file', importFile)
    const response = await fetch('/api/questions/bulk-import', {
      method: 'POST',
      body: formData,
    })
    const body = await response.json()
    setImportResult(body)
    refreshBank()
  }

  const selectCls = 'border-input bg-card h-9 w-full rounded-md border px-3 text-sm'
  const total = bankQuestions?.length ?? 0
  const retiredCount = bankQuestions?.filter((q) => q.status === 'retired').length ?? 0
  const visible = (bankQuestions ?? []).filter(
    (q) =>
      (statusFilter === 'all' || q.status === statusFilter) &&
      (!search.trim() || q.text.toLowerCase().includes(search.trim().toLowerCase())),
  )

  return (
    <AdminPage
      title="Question bank admin"
      description="Generate, import, and manage the question bank."
    >
      <div className="bg-background/90 border-border sticky top-0 z-10 -mx-1 rounded-2xl border px-3 py-3 backdrop-blur">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <select
              id="subject"
              className={selectCls}
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="" disabled>
                Select a subject
              </option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          {subjectId && (
            <div className="space-y-1.5">
              <Label htmlFor="concept">Concept</Label>
              <select
                id="concept"
                className={selectCls}
                value={conceptId}
                onChange={(e) => setConceptId(e.target.value)}
              >
                <option value="" disabled>
                  Select a concept
                </option>
                {concepts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <Panel
        title="Question bank"
        subtitle={
          conceptId
            ? 'Approved and retired questions for the concept selected above, with live stats (F118).'
            : 'Select a concept above to browse its approved/retired questions.'
        }
      >
        {!conceptId && <Notice>Choose a subject and concept to load its questions.</Notice>}
        {conceptId && (
          <div className="space-y-4">
            {bankQuestions !== null && bankQuestions.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                <StatTile label="Questions" value={total} />
                <StatTile label="In use" value={total - retiredCount} tone="good" />
                <StatTile label="Pulled" value={retiredCount} />
              </div>
            )}
            {bankError && <Notice tone="bad">{bankError}</Notice>}
            {bankQuestions === null && <Notice>Loading questions…</Notice>}
            {bankQuestions !== null && bankQuestions.length === 0 && (
              <Notice>No approved or retired questions for this concept yet.</Notice>
            )}
            {bankQuestions !== null && bankQuestions.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="search"
                    aria-label="Search questions"
                    placeholder="Search question text"
                    className="border-input bg-card h-9 min-w-0 flex-1 rounded-md border px-3 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select
                    aria-label="Status filter"
                    className="border-input bg-card h-9 rounded-md border px-3 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  >
                    <option value="all">All statuses</option>
                    <option value="approved">Approved only</option>
                    <option value="retired">Pulled only</option>
                  </select>
                </div>
                {visible.length === 0 && <Notice>No questions match that filter.</Notice>}
                <ul className="divide-border divide-y">
                  {visible.map((q) => {
                    const open = bankExpandedId === q.id
                    return (
                      <li key={q.id}>
                        <button
                          type="button"
                          aria-expanded={open}
                          className="hover:bg-muted/50 flex w-full items-start gap-2 rounded-lg px-2 py-2.5 text-left transition-colors"
                          onClick={() => void toggleBankExpand(q)}
                        >
                          <ChevronRight
                            className={`text-muted-foreground mt-1 size-4 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="text-body block">{q.text}</span>
                            <span className="text-caption text-muted-foreground block">
                              {q.bloom} · {q.difficulty} · {q.marks} mark{q.marks === 1 ? '' : 's'}
                              {q.is_reversal_word ? ' · reversal word' : ''}
                            </span>
                          </span>
                          <Pill tone={q.status === 'retired' ? 'default' : 'good'}>{q.status}</Pill>
                        </button>
                        {open && (
                          <div className="bg-muted/30 mx-2 mb-3 space-y-3 rounded-xl p-4">
                            {!bankStats && (
                              <p className="text-small text-muted-foreground">Loading stats…</p>
                            )}
                            {bankStats && (
                              <div className="text-small space-y-1">
                                <p className="tabular-nums">
                                  <span className="font-semibold">
                                    {bankStats.attempts} attempt{bankStats.attempts === 1 ? '' : 's'}
                                  </span>
                                  {bankStats.success_rate !== null &&
                                    ` — ${bankStats.success_rate}% success rate`}
                                  {bankStats.mean_time_sec !== null &&
                                    ` — mean ${bankStats.mean_time_sec}s`}
                                </p>
                                {bankStats.anomaly.flagged && (
                                  <p className="text-[var(--bad)]">
                                    Flagged: {bankStats.anomaly.reasons.join(', ')}
                                  </p>
                                )}
                              </div>
                            )}
                            <label className="text-small flex items-start gap-2">
                              <input
                                type="checkbox"
                                className="mt-0.5"
                                checked={q.is_reversal_word}
                                onChange={() => void toggleReversalWord(q)}
                              />
                              Reversal-word (NOT / least / false) — wrong answers here get classified
                              as reading discipline, not a concept gap
                            </label>
                            <Button
                              size="sm"
                              variant={q.status === 'retired' ? 'default' : 'outline'}
                              disabled={bankPending === q.id}
                              onClick={() => void toggleRetired(q)}
                            >
                              {q.status === 'retired' ? 'Reinstate' : 'Retire'}
                            </Button>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        )}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Generate with AI" subtitle="Adds approved questions to the selected concept.">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="bloom">Bloom</Label>
                <select
                  id="bloom"
                  className="border-input bg-card flex h-9 w-full rounded-md border px-2 text-sm"
                  value={genBloom}
                  onChange={(e) => setGenBloom(e.target.value)}
                >
                  {BLOOM_LEVELS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  className="border-input bg-card flex h-9 w-full rounded-md border px-2 text-sm"
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value)}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="count">Count</Label>
                <input
                  id="count"
                  type="number"
                  min={1}
                  max={20}
                  className="border-input bg-card flex h-9 w-full rounded-md border px-2 text-sm"
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                />
              </div>
            </div>
            <Button onClick={generate} disabled={!conceptId || generating}>
              {generating ? 'Generating…' : 'Generate'}
            </Button>
            {!conceptId && <Notice>Select a concept first.</Notice>}
            {genResult &&
              (genResult.ai_configured === false ? (
                <Notice>{genResult.message}</Notice>
              ) : (
                <Notice tone="good">
                  {genResult.generated.length} question(s) added to the question bank,{' '}
                  {genResult.rejected.length} rejected by the scope guardrail.
                </Notice>
              ))}
          </div>
        </Panel>

        <Panel title="Bulk import" subtitle="CSV or JSON file of questions.">
          <form onSubmit={submitImport} className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              accept=".csv,.json"
              className="text-small min-w-0 max-w-full"
              onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
            />
            <Button type="submit" disabled={!importFile}>
              Import
            </Button>
          </form>
          {importResult && (
            <div className="mt-3">
              <Notice tone="good">
                Imported {importResult.imported ?? 0}, rejected {importResult.rejected?.length ?? 0}.
              </Notice>
            </div>
          )}
        </Panel>
      </div>
    </AdminPage>
  )
}
