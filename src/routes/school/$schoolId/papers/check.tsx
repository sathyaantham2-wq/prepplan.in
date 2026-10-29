import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import { Btn, Card, Notice, Select } from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'
import type {
  CoveragePreview,
  SavedTemplate,
} from '../../../../lib/schools/template-service'

export const Route = createFileRoute('/school/$schoolId/papers/check')({
  validateSearch: (s: Record<string, unknown>) => ({
    key: typeof s.key === 'string' ? s.key : undefined,
  }),
  component: Check,
})

interface Chapter {
  id: string
  book: string
  part: string
  chapterNo: number
  name: string
  label: string
  concepts: number
  approvedQuestions: number
}
interface Listing {
  templates: Array<SavedTemplate>
  subjects: Array<{ id: string; name: string; grade: number }>
}

function Check() {
  const search = Route.useSearch()
  const { schoolId } = useSchool()
  const [listing, setListing] = useState<Listing | null>(null)
  const [key, setKey] = useState(search.key ?? '')
  const [subjectId, setSubjectId] = useState('')
  const [chapters, setChapters] = useState<Array<Chapter>>([])
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [result, setResult] = useState<CoveragePreview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api<Listing>(`/api/schools/${schoolId}/templates`)
      .then((l) => {
        setListing(l)
        setKey((k) => k || l.templates[0]?.key || '')
        setSubjectId((s) => s || l.subjects[0]?.id || '')
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
      )
  }, [schoolId])

  useEffect(() => {
    if (!subjectId) return
    setPicked(new Set())
    setResult(null)
    api<{ chapters: Array<Chapter> }>(
      `/api/schools/${schoolId}/bank/chapters?subject_id=${subjectId}`,
    )
      .then((r) => setChapters(r.chapters))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
      )
  }, [schoolId, subjectId])

  // Group the chapters as the book does: book, then part, then chapter number.
  const groups = useMemo(() => {
    const out: Array<{ heading: string; items: Array<Chapter> }> = []
    for (const c of chapters) {
      const heading = `${c.book} · Part ${c.part}`
      const last = out.length > 0 ? out[out.length - 1] : null
      if (last && last.heading === heading) last.items.push(c)
      else out.push({ heading, items: [c] })
    }
    return out
  }, [chapters])

  async function check() {
    setBusy(true)
    setError(null)
    try {
      setResult(
        await api<CoveragePreview>(
          `/api/schools/${schoolId}/templates/preview`,
          { body: { subject_id: subjectId, chapter_ids: [...picked], key } },
        ),
      )
    } catch (e) {
      setResult(null)
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  if (!listing)
    return error ? (
      <Notice kind="error">{error}</Notice>
    ) : (
      <p className="text-base text-slate-700">Loading…</p>
    )
  if (listing.templates.length === 0 || listing.subjects.length === 0) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Check against the bank</h1>
        <Notice>
          {listing.templates.length === 0
            ? 'Save a paper layout first (see Papers).'
            : 'You need a subject you teach in a class before you can check a layout.'}
        </Notice>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Check against the bank</h1>
      <p className="text-base text-slate-700">
        See how well the question bank can fill a layout for the chapters you
        choose, before a paper is made.
      </p>
      <Card className="space-y-4">
        <Select
          label="Layout"
          value={key}
          onChange={(e) => {
            setKey(e.target.value)
            setResult(null)
          }}
        >
          {listing.templates.map((t) => (
            <option key={t.key} value={t.key}>
              {t.name}
            </option>
          ))}
        </Select>
        <Select
          label="Subject"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
        >
          {listing.subjects.map((s) => (
            <option key={s.id} value={s.id}>
              Class {s.grade} · {s.name}
            </option>
          ))}
        </Select>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Chapters</h2>
        {groups.length === 0 ? (
          <Notice>This subject has no chapters in the bank yet.</Notice>
        ) : null}
        {groups.map((g) => (
          <Card key={g.heading} className="space-y-1">
            <h3 className="text-base font-bold">{g.heading}</h3>
            {g.items.map((c) => (
              <label
                key={c.id}
                className="flex min-h-12 items-start gap-3 py-2 text-base"
              >
                <input
                  type="checkbox"
                  className="mt-1 size-5 shrink-0"
                  checked={picked.has(c.id)}
                  onChange={(e) => {
                    const next = new Set(picked)
                    if (e.target.checked) next.add(c.id)
                    else next.delete(c.id)
                    setPicked(next)
                    setResult(null)
                  }}
                />
                <span>
                  <b>Chapter {c.chapterNo}</b> · {c.name}
                  <span className="block text-sm text-slate-600">
                    {c.approvedQuestions} questions in the bank
                  </span>
                </span>
              </label>
            ))}
          </Card>
        ))}
      </section>

      {error ? <Notice kind="error">{error}</Notice> : null}
      <Btn
        className="w-full"
        disabled={busy || picked.size === 0}
        onClick={check}
      >
        {busy
          ? 'Checking…'
          : `Check ${picked.size || ''} ${picked.size === 1 ? 'chapter' : 'chapters'}`.replace(
              '  ',
              ' ',
            )}
      </Btn>

      {result ? <Result r={result} /> : null}
    </div>
  )
}

function Bar({
  value,
  max,
  tone,
}: {
  value: number
  max: number
  tone: 'good' | 'plain'
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="h-3 w-full rounded-full bg-slate-200" role="presentation">
      <div
        className={`h-3 rounded-full ${tone === 'good' ? 'bg-emerald-700' : 'bg-slate-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function Result({ r }: { r: CoveragePreview }) {
  const complete =
    r.fillableMarks >= r.totalMarks &&
    r.shortfalls.every((g) => g.kind !== 'paper')
  const marksFull = r.fillableMarks >= r.totalMarks
  const paperGaps = r.shortfalls.filter((s) => s.kind === 'paper')
  const chapterGaps = r.shortfalls.filter((s) => s.kind === 'chapter')
  const thinking = (v: number) => Math.round((100 - v) * 10) / 10
  return (
    <div className="space-y-4" aria-live="polite" data-testid="coverage-result">
      <Card
        className={`space-y-2 ${complete ? 'border-emerald-500' : 'border-amber-500'}`}
      >
        <p className="text-sm font-semibold text-slate-600 uppercase">
          {r.layoutName}
        </p>
        <p className="text-2xl font-bold">
          The bank can fill {r.fillableMarks} of {r.totalMarks} marks
        </p>
        <Bar value={r.fillableMarks} max={r.totalMarks} tone="good" />
        {complete ? (
          <p className="text-base">
            Every row can be filled for these chapters.
          </p>
        ) : marksFull ? (
          <p className="text-base text-amber-950">
            All the marks can be filled, but some choices (OR) will have no
            alternative. The details are below and are printed on your copy of
            the paper.
          </p>
        ) : (
          <p className="text-base text-amber-950">
            Some questions cannot be filled. The gaps are listed below and are
            printed on your copy of the paper.
          </p>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-bold">Marks for each chapter</h2>
        {r.chapters.map((c) => (
          <div key={c.chapterId} className="space-y-1">
            <p className="text-base font-semibold">{c.label}</p>
            <p className="text-sm text-slate-700">
              Planned {c.plannedMarks} marks · from the bank {c.expectedMarks}{' '}
              marks
            </p>
            <Bar value={c.plannedMarks} max={r.totalMarks} tone="plain" />
            <Bar value={c.expectedMarks} max={r.totalMarks} tone="good" />
          </div>
        ))}
      </Card>

      <Card className="space-y-2">
        <h2 className="text-lg font-bold">Remembering and thinking</h2>
        <table className="w-full text-left text-base">
          <thead>
            <tr className="text-sm text-slate-600">
              <th className="py-1 font-medium"> </th>
              <th className="py-1 font-medium">Planned</th>
              <th className="py-1 font-medium">From the bank</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1">Remembering and understanding</td>
              <td>{r.levels.plannedRecall}%</td>
              <td>{r.levels.expectedRecall}%</td>
            </tr>
            <tr>
              <td className="py-1">Thinking (using and thinking deeper)</td>
              <td>{thinking(r.levels.plannedRecall)}%</td>
              <td>{thinking(r.levels.expectedRecall)}%</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-bold">Gaps</h2>
        {paperGaps.length === 0 && chapterGaps.length === 0 ? (
          <p className="text-base">No gaps.</p>
        ) : null}
        {paperGaps.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-base font-bold text-red-800">
              Cannot be filled
            </h3>
            <ul className="space-y-2" data-testid="paper-gaps">
              {paperGaps.map((g, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-base text-red-950"
                >
                  <b>{g.slot}</b> ({g.section.split(' — ')[0]}): {g.short} of{' '}
                  {g.needed} {g.needed === 1 ? 'question' : 'questions'} missing
                  {g.marksMissing > 0 ? ` · ${g.marksMissing} marks short` : ''}
                  {g.choicesLost > 0
                    ? ` · ${g.choicesLost} ${g.choicesLost === 1 ? 'choice' : 'choices'} (OR) will have no alternative`
                    : ''}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {chapterGaps.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-base font-bold text-amber-900">
              A chapter is short
            </h3>
            <ul className="space-y-2" data-testid="chapter-gaps">
              {chapterGaps.map((g, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-base text-amber-950"
                >
                  <b>{g.chapterLabel}</b>
                  <br />
                  {g.slot}: needs {g.needed}, the bank has {g.have}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-700">
              Other chapters make up the difference where they can, so the paper
              may still be full.
            </p>
          </div>
        ) : null}
      </Card>

      <details className="rounded-xl border border-slate-300 bg-white p-4">
        <summary className="min-h-12 cursor-pointer py-2 text-base font-semibold">
          What will be printed on your copy
        </summary>
        {r.teacherCopyLines.length === 0 ? (
          <p className="mt-2 text-base">Nothing: there are no gaps.</p>
        ) : (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-base">
            {r.teacherCopyLines.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        )}
      </details>
    </div>
  )
}
