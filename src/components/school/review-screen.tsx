import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Btn, Chip, Notice } from './ui'
import { api } from '../../lib/school-client'
import { MathText } from '../math-text'
import type { reviewData } from '../../lib/schools/marking'

// The teacher's side-by-side review of one student's marking (M4 additions plan, section 5): the original page
// where the AI found the answer on the left; on the right what the AI read, the model answer, the marks per step or
// criterion and one-tap buttons. Staff only; the pictures come from an audited, session-checked route.
type Review = Awaited<ReturnType<typeof reviewData>>
type Item = Review['answers'][number]

const num = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

export function ReviewScreen({
  base,
  studentId,
  onChanged,
  onClose,
}: {
  base: string
  studentId: string
  onChanged: () => Promise<void>
  onClose: () => void
}) {
  const [r, setR] = useState<Review | null>(null)
  const [at, setAt] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setR(await api<Review>(`${base}/marking?student_id=${studentId}&review=1`))
  }, [base, studentId])
  useEffect(() => {
    void load().catch((e: unknown) => setError(e instanceof Error ? e.message : 'Something went wrong.'))
  }, [load])

  // the answers the AI was not sure of come first, then the rest in paper order
  const items = useMemo(
    () =>
      r
        ? [...r.answers]
            .filter((a) => a.answerMarkId)
            .sort((a, b) => Number(b.state === 'flagged') - Number(a.state === 'flagged') || Number(a.questionNo) - Number(b.questionNo))
        : [],
    [r],
  )
  const a: Item | undefined = items.at(Math.min(at, items.length - 1))

  async function setMark(value: number, reason: string) {
    if (!a?.answerMarkId) return
    setBusy(true)
    setError(null)
    try {
      await api(`${base}/marking`, { body: { action: 'set_mark', answer_mark_id: a.answerMarkId, marks: value, reason } })
      await load()
      await onChanged()
      const next = items.findIndex((x, i) => i > at && x.state === 'flagged')
      if (next >= 0) setAt(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }
  const nextFlagged = () => {
    const n = items.findIndex((x, i) => i !== at && x.state === 'flagged' && i > at)
    setAt(n >= 0 ? n : Math.max(0, items.findIndex((x) => x.state === 'flagged')))
  }

  if (!r) return error ? <Notice kind="error">{error}</Notice> : <p className="text-base">Loading…</p>
  if (!a) return <Notice>There is nothing to review yet.</Notice>
  const flagged = a.state === 'flagged'
  const flaggedLeft = items.filter((x) => x.state === 'flagged').length

  return (
    <section className="space-y-3 rounded-xl border-2 border-slate-300 bg-white p-3" data-testid="review-screen">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold">
          Question {a.questionNo} <span className="text-slate-500">({at + 1} of {items.length})</span>
        </h3>
        <div className="flex gap-2">
          <Btn kind="plain" disabled={flaggedLeft === 0} onClick={nextFlagged} data-testid="next-flagged">
            Next to check <ChevronRight aria-hidden="true" className="size-4" />
          </Btn>
          <Btn kind="plain" onClick={onClose}>
            Close
          </Btn>
        </div>
      </div>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <div className="grid gap-3 lg:grid-cols-2">
        <PageCrop base={base} studentId={studentId} pageCount={r.pageCount} location={a.location} />
        <div className="space-y-3">
          <p className="text-base">
            <MathText text={a.text} />
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {flagged ? <Chip tone="wait">Please check</Chip> : a.state === 'teacher_set' ? <Chip>Set by a teacher</Chip> : <Chip tone="good">AI mark</Chip>}
            <span className="text-2xl font-bold">
              {a.finalMarks === null ? '—' : num(a.finalMarks)} <span className="text-slate-500">/ {num(a.maxMarks)}</span>
            </span>
          </div>
          {a.flagReason ? <p className="text-[15px] text-amber-950">{a.flagReason}</p> : null}
          <div>
            <p className="text-sm font-semibold text-slate-700">What the AI read on the sheet</p>
            <p className="text-base break-words whitespace-pre-wrap" data-testid="review-read">
              {a.found === false ? 'No answer was found on the pages.' : (a.answerText ?? '—')}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">The approved answer</p>
            <p className="text-base break-words whitespace-pre-wrap" data-testid="review-key">
              <MathText text={a.keyText} />
            </p>
          </div>
          {a.steps.length > 0 ? (
            <div>
              <p className="text-sm font-semibold text-slate-700">{a.rubric ? 'Criteria' : 'Steps'}: marks awarded</p>
              <ul className="space-y-1 text-[15px]" data-testid="review-steps">
                {a.steps.map((s) => (
                  <li key={s.no} className="flex justify-between gap-3">
                    <span>{s.description}</span>
                    <b className="shrink-0">
                      {num(s.awarded)} / {num(s.max)}
                    </b>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {a.lossReason ? <p className="text-[15px] text-slate-700">Why marks were lost: {a.lossReason}</p> : null}
          <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-2">
            <Btn
              disabled={busy || a.finalMarks === null}
              onClick={() => void setMark(a.finalMarks ?? 0, 'Teacher accepted the AI mark')}
              data-testid="review-accept"
            >
              Accept {a.finalMarks === null ? '' : num(a.finalMarks)}
            </Btn>
            <Btn kind="plain" disabled={busy} onClick={() => void setMark(a.maxMarks, 'Teacher gave full marks')}>
              Full marks ({num(a.maxMarks)})
            </Btn>
            <Btn kind="plain" disabled={busy} onClick={() => void setMark(0, 'Teacher gave no marks')}>
              No marks (0)
            </Btn>
          </div>
          <div className="flex justify-between gap-2">
            <Btn kind="plain" disabled={at === 0} onClick={() => setAt(at - 1)}>
              Previous
            </Btn>
            <Btn kind="plain" disabled={at >= items.length - 1} onClick={() => setAt(at + 1)}>
              Next
            </Btn>
          </div>
        </div>
      </div>
    </section>
  )
}

// The page where the AI found the answer, cropped to its box (a little margin around it); the whole page when the AI
// gave no usable box, and a plain note when it gave no place at all (never a guessed one).
function PageCrop({
  base,
  studentId,
  pageCount,
  location,
}: {
  base: string
  studentId: string
  pageCount: number
  location: Item['location']
}) {
  const [page, setPage] = useState(location?.page ?? 1)
  useEffect(() => {
    if (location) setPage(location.page)
  }, [location])
  const src = `${base}/marking-page?student_id=${studentId}&page=${page}`
  // Fetched and shown from memory: a plain <img> request is answered (404) by the dev server before the app sees it,
  // and this way the picture never has an address of its own.
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    let gone = false
    let made: string | null = null
    setUrl(null)
    void fetch(src, { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.blob() : null))
      .then((b) => {
        if (b && !gone) {
          made = URL.createObjectURL(b)
          setUrl(made)
        }
      })
      .catch(() => undefined)
    return () => {
      gone = true
      if (made) URL.revokeObjectURL(made)
    }
  }, [src])
  const box = location && location.page === page ? location.box : null
  // crop with a 6% margin; the picture is scaled so the box fills the frame width
  const view = box
    ? { x: Math.max(0, box[0] - 0.06), y: Math.max(0, box[1] - 0.04), w: 0, h: 0 }
    : { x: 0, y: 0, w: 1, h: 1 }
  if (box) {
    view.w = Math.min(1, box[2] + 0.06) - view.x
    view.h = Math.min(1, box[3] + 0.04) - view.y
  }
  return (
    <div className="space-y-2" data-testid="review-page">
      {!location ? <Notice>The AI did not say where this answer is. Pick the page below.</Notice> : null}
      <div className="relative w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-100" style={{ aspectRatio: box ? `${view.w * 3} / ${view.h * 4}` : '3 / 4' }}>
        {url ? (
          <img
            src={url}
            alt={`Page ${page} of the answer sheet`}
            className="absolute max-w-none"
            style={{
              width: `${100 / view.w}%`,
              left: `${(-view.x / view.w) * 100}%`,
              top: `${(-view.y / view.h) * 100}%`,
            }}
          />
        ) : null}
      </div>
      {pageCount > 1 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Page</span>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <Btn key={n} kind={n === page ? 'primary' : 'plain'} className="min-w-11" onClick={() => setPage(n)}>
              {n}
            </Btn>
          ))}
        </div>
      ) : null}
    </div>
  )
}
