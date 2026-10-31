import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronRight,
  Loader2,
  XCircle,
} from 'lucide-react'
import { Btn, Chip, Notice, Select } from './ui'
import { MarkAllPanel, STATUS_LOOK, StudentMarking } from './marking-panel'
import type { Overview } from './marking-panel'
import { api } from '../../lib/school-client'
import {
  filesToOriginalPages,
  sendInPieces,
} from '../../lib/school-scan-client'
import type {
  OwnSheetResult,
  OwnSheetsSummary,
} from '../../lib/schools/own-sheets'

// AI correction, step 2: answer sheets uploaded student by student (owner direction 2026-10-30). The
// teacher picks a student and adds that student's pages; each page is checked before marking (the same
// photo under two students, blank, the question paper, another subject, a name that is someone else's).
// A clear mismatch is refused in plain words; an unsure one asks the teacher here.

interface Loaded extends OwnSheetsSummary {
  sections: Array<{ id: string; name: string; students: number }>
}

interface StudentPages {
  student: {
    schoolStudentId: string
    name: string
    rollNo: string
    section: string
  }
  pages: Array<{
    id: string
    seq: number | null
    kind: string
    status: string
    name: string | null
    checkState: string | null
    checkSummary: string | null
    suggestId: string | null
    url: string | null
  }>
}

const STATE: Record<
  string,
  { text: string; tone: 'plain' | 'good' | 'wait' | 'bad' }
> = {
  none: { text: 'Not yet', tone: 'plain' },
  received: { text: 'Ready', tone: 'good' },
  checking: { text: 'Checking', tone: 'plain' },
  needs_you: { text: 'Needs you', tone: 'wait' },
  refused: { text: 'Refused', tone: 'bad' },
}

export function StudentSheets({
  base,
  onMarkingChanged,
}: {
  base: string
  onMarkingChanged?: () => void
}) {
  const [d, setD] = useState<Loaded | null>(null)
  const [marking, setMarking] = useState<Overview | null>(null)
  const [sectionId, setSectionId] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const x = await api<Loaded>(`${base}/sheets`)
      setMarking(await api<Overview>(`${base}/marking`).catch(() => null))
      onMarkingChanged?.()
      setD(x)
      setSectionId((s) => s || x.sections[0]?.id || '')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }, [base, onMarkingChanged])
  useEffect(() => {
    void load()
  }, [load])

  if (!d) return error ? <Notice kind="error">{error}</Notice> : null
  const sectionName = d.sections.find((s) => s.id === sectionId)?.name ?? ''
  const mine = d.students.filter((s) => s.section === sectionName)
  return (
    <section className="space-y-3" data-testid="student-sheets">
      <div>
        <h2 className="text-lg font-bold">Answer sheets, student by student</h2>
        <p className="text-base text-slate-700">
          Choose a student and add the photos of her answer sheets. Students
          write their name and roll number at the top of every sheet.
        </p>
      </div>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <MarkAllPanel
        base={base}
        ready={
          marking?.students.filter(
            (s) => s.status === 'ready' || s.status === 'rejected',
          ).length ?? 0
        }
        onChanged={load}
      />
      <Select
        label="Section"
        value={sectionId}
        onChange={(e) => {
          setSectionId(e.target.value)
          setOpen(null)
        }}
      >
        {d.sections.map((s) => (
          <option key={s.id} value={s.id}>
            Section {s.name} ({s.students} students)
          </option>
        ))}
      </Select>
      <div className="flex flex-wrap gap-2">
        <Chip tone="good">{d.totals.received} ready</Chip>
        <Chip>{d.totals.none} not yet</Chip>
        {d.totals.needsYou > 0 ? (
          <Chip tone="wait">{d.totals.needsYou} need you</Chip>
        ) : null}
      </div>
      <ul className="space-y-2">
        {mine.map((s) => (
          <li
            key={s.schoolStudentId}
            className="rounded-2xl border border-slate-200 bg-white"
          >
            <button
              type="button"
              aria-expanded={open === s.schoolStudentId}
              onClick={() =>
                setOpen(open === s.schoolStudentId ? null : s.schoolStudentId)
              }
              className="flex min-h-14 w-full items-center gap-3 px-3.5 py-2.5 text-left"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                {s.rollNo}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-semibold text-slate-900">
                  {s.name}
                </span>
                <span className="block text-sm text-slate-600">
                  {s.pages === 0
                    ? 'No pages yet'
                    : `${s.pages} ${s.pages === 1 ? 'page' : 'pages'}`}
                </span>
              </span>
              {(() => {
                const m = marking?.students.find(
                  (x) => x.schoolStudentId === s.schoolStudentId,
                )
                // marking wins once it has started; before that the state of her pages
                return m && m.status !== 'not_uploaded' && m.status !== 'ready' ? (
                  <Chip tone={STATUS_LOOK[m.status].tone}>
                    {STATUS_LOOK[m.status].text}
                    {m.status === 'marked' &&
                    m.totalMarks !== null &&
                    m.maxMarks !== null
                      ? ` · ${m.totalMarks}/${m.maxMarks}`
                      : ''}
                  </Chip>
                ) : s.state === 'received' ? (
                  <Chip>Ready to mark</Chip>
                ) : s.state === 'none' ? (
                  <Chip>Not uploaded</Chip>
                ) : (
                  <Chip tone={STATE[s.state].tone}>{STATE[s.state].text}</Chip>
                )
              })()}
              <ChevronRight
                aria-hidden="true"
                className={`size-5 shrink-0 text-slate-400 transition-transform ${open === s.schoolStudentId ? 'rotate-90' : ''}`}
              />
            </button>
            {open === s.schoolStudentId ? (
              <OneStudent
                base={base}
                studentId={s.schoolStudentId}
                classmates={mine}
                onChanged={load}
                markingStatus={
                  marking?.students.find(
                    (x) => x.schoolStudentId === s.schoolStudentId,
                  )?.status ?? 'ready'
                }
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * A page picture behind a signed, short-lived link. It is fetched and shown from memory: a plain <img>
 * request is sent as an "image" request, which the dev server answers itself (404) before the app sees it.
 */
function SignedImg({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className: string
}) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    let gone = false
    let made: string | null = null
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
  return url ? (
    <img src={url} alt={alt} className={className} />
  ) : (
    <div role="img" aria-label={alt} className={className} />
  )
}

function OneStudent({
  base,
  studentId,
  classmates,
  onChanged,
  markingStatus,
}: {
  base: string
  studentId: string
  classmates: Loaded['students']
  onChanged: () => Promise<void>
  markingStatus: Overview['students'][number]['status']
}) {
  const [p, setP] = useState<StudentPages | null>(null)
  const [busy, setBusy] = useState(false)
  const [lines, setLines] = useState<
    Array<OwnSheetResult & { source: string }>
  >([])
  const [moveTo, setMoveTo] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setP(await api<StudentPages>(`${base}/sheets?student_id=${studentId}`))
  }, [base, studentId])
  useEffect(() => {
    void load().catch((e: unknown) =>
      setError(e instanceof Error ? e.message : 'Something went wrong.'),
    )
  }, [load])

  async function add(files: Array<File>) {
    setBusy(true)
    setError(null)
    setLines([])
    try {
      const out: Array<OwnSheetResult & { source: string }> = []
      for (const pg of await filesToOriginalPages(files)) {
        const { uploadId, chunks } = await sendInPieces(
          base,
          pg.blob,
          'sheet-chunks',
        )
        const r = await api<OwnSheetResult>(`${base}/sheets`, {
          body: {
            action: 'add',
            upload_id: uploadId,
            chunks,
            name: pg.source,
            student_id: studentId,
          },
        })
        out.push({ ...r, source: pg.source })
        setLines([...out])
      }
      await load()
      await onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  async function decide(sheetId: string, decision: string, to?: string) {
    setBusy(true)
    setError(null)
    try {
      await api(`${base}/sheets`, {
        body: {
          action: decision === 'remove-page' ? 'remove' : 'confirm',
          sheet_id: sheetId,
          decision: decision === 'remove-page' ? undefined : decision,
          student_id: to,
        },
      })
      await load()
      await onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  if (!p)
    return (
      <p className="flex items-center gap-2 px-3.5 pb-3 text-base text-slate-600">
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        Loading…
      </p>
    )
  const kept = p.pages.filter((x) => x.status === 'placed')
  const refused = p.pages.filter((x) => x.status !== 'placed')
  return (
    <div
      className="space-y-3 border-t border-slate-200 px-3.5 py-3"
      data-testid="one-student"
    >
      {error ? <Notice kind="error">{error}</Notice> : null}
      <label
        className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-base font-semibold text-white shadow-sm hover:bg-emerald-800 ${busy ? 'pointer-events-none opacity-60' : ''}`}
      >
        <Camera aria-hidden="true" className="size-5" />
        {busy ? 'Sending and checking…' : `Add ${p.student.name}'s pages`}
        <input
          type="file"
          multiple
          accept="application/pdf,image/*"
          disabled={busy}
          data-testid="student-pages-input"
          className="sr-only"
          onChange={(e) => {
            const f = Array.from(e.target.files ?? [])
            e.target.value = ''
            if (f.length > 0) void add(f)
          }}
        />
      </label>
      {lines.length > 0 ? (
        <ul className="space-y-1" data-testid="upload-results">
          {lines.map((l, i) => (
            <li key={i} className="flex items-start gap-2 text-[15px]">
              {l.checkState === 'refused' || l.status === 'rejected' ? (
                <XCircle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-red-600"
                />
              ) : l.checkState === 'needs_confirm' ? (
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-amber-600"
                />
              ) : (
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-emerald-600"
                />
              )}
              <span>
                <b>{l.source}:</b> {l.message}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {kept.length === 0 ? (
        <p className="text-base text-slate-600">No pages yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {kept.map((x) => (
            <li
              key={x.id}
              className={`overflow-hidden rounded-xl border ${x.checkState === 'needs_confirm' ? 'border-amber-400' : 'border-slate-200'}`}
            >
              {x.url ? (
                <a href={x.url} target="_blank" rel="noreferrer">
                  <SignedImg
                    src={x.url}
                    alt={
                      x.kind === 'cover'
                        ? `Cover page of ${p.student.name}`
                        : `Page ${x.seq ?? ''} of ${p.student.name}`
                    }
                    className="aspect-[3/4] w-full bg-slate-100 object-cover"
                  />
                </a>
              ) : (
                <div className="flex aspect-[3/4] items-center justify-center bg-slate-100 text-sm text-slate-500">
                  Deleted after the keeping time
                </div>
              )}
              <div className="flex items-center justify-between gap-1 px-2 py-1.5 text-sm">
                <span className="font-semibold">
                  {x.kind === 'cover' ? 'Cover page' : `Page ${x.seq}`}
                </span>
                {x.checkState === 'passed' ? (
                  <span className="text-emerald-700">Checked</span>
                ) : x.checkState === 'needs_confirm' ? (
                  <span className="text-amber-700">Needs you</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {kept
        .filter((x) => x.checkState === 'needs_confirm')
        .map((x) => {
          const suggestion = classmates.find(
            (c) => c.schoolStudentId === x.suggestId,
          )
          return (
            <div
              key={x.id}
              className="space-y-2 rounded-xl border border-amber-300 bg-amber-50 p-3"
              data-testid="confirm-page"
            >
              <p className="text-base text-amber-950">
                <b>Page {x.seq}:</b> {x.checkSummary}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Btn disabled={busy} onClick={() => void decide(x.id, 'keep')}>
                  Yes, it is {p.student.name}'s
                </Btn>
                {suggestion ? (
                  <Btn
                    kind="plain"
                    disabled={busy}
                    onClick={() =>
                      void decide(x.id, 'move', suggestion.schoolStudentId)
                    }
                  >
                    No, move it to {suggestion.name}
                  </Btn>
                ) : (
                  <Select
                    label="Or move it to"
                    value={moveTo[x.id] ?? ''}
                    onChange={(e) => {
                      setMoveTo({ ...moveTo, [x.id]: e.target.value })
                      if (e.target.value)
                        void decide(x.id, 'move', e.target.value)
                    }}
                  >
                    <option value="">Choose a student</option>
                    {classmates
                      .filter((c) => c.schoolStudentId !== studentId)
                      .map((c) => (
                        <option
                          key={c.schoolStudentId}
                          value={c.schoolStudentId}
                        >
                          {c.rollNo} · {c.name}
                        </option>
                      ))}
                  </Select>
                )}
                <Btn
                  kind="danger"
                  disabled={busy}
                  onClick={() => void decide(x.id, 'remove')}
                >
                  Remove this page
                </Btn>
              </div>
            </div>
          )
        })}

      {kept.some((x) => x.checkState === 'passed') ? (
        <details className="text-[15px]">
          <summary className="cursor-pointer font-semibold text-slate-700">
            Take a page out
          </summary>
          <div className="mt-2 flex flex-wrap gap-2">
            {kept.map((x) => (
              <Btn
                key={x.id}
                kind="plain"
                disabled={busy}
                onClick={() => void decide(x.id, 'remove-page')}
              >
                Remove page {x.seq}
              </Btn>
            ))}
          </div>
        </details>
      ) : null}

      {refused.length > 0 ? (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700">Refused</p>
          <ul className="space-y-1 text-[15px] text-slate-700">
            {refused.map((x) => (
              <li key={x.id} className="flex items-start gap-2">
                <XCircle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-red-600"
                />
                <span>
                  {x.name ? <b>{x.name}: </b> : null}
                  {x.checkSummary ?? 'Removed by a teacher.'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {kept.some((x) => x.checkState === 'passed') &&
      !kept.some((x) => x.checkState === 'needs_confirm') ? (
        <StudentMarking
          base={base}
          studentId={studentId}
          status={markingStatus}
          onChanged={onChanged}
        />
      ) : null}
    </div>
  )
}
