import { useCallback, useEffect, useState } from 'react'
import { ApiError, api } from '../../lib/school-client'
import { blobToBase64, filesToPages, formatBytes } from '../../lib/scan-client'
import type {
  ScanSummary,
  ScanUploadResult,
  StudentScanRow,
} from '../../lib/schools/scan-service'
import { Btn, Card, Chip, Notice, Select } from './ui'

// S6: the scanned answer sheets of one exam. Upload a whole section as one PDF or many phone
// photos, in any order; each page is sorted to its student and page by the code printed on it.
// Below that, who has sent everything, who is missing pages, and what needs a teacher's decision.

interface UploadItem {
  key: string
  source: string
  size: number
  state: 'waiting' | 'sending' | 'done' | 'failed'
  result?: ScanUploadResult
  error?: string
}

const pagesText = (n: Array<number>) =>
  `${n.length === 1 ? 'page' : 'pages'} ${n.join(', ')}`

const PICK =
  'inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-base font-semibold text-slate-800 focus-within:ring-2 focus-within:ring-emerald-700/40 hover:bg-slate-50'

function FilePick({
  label,
  disabled,
  multiple = true,
  onFiles,
  testId,
}: {
  label: string
  disabled?: boolean
  multiple?: boolean
  onFiles: (files: Array<File>) => void
  testId?: string
}) {
  return (
    <label
      className={`${PICK} ${disabled ? 'pointer-events-none opacity-50' : ''}`}
    >
      <input
        type="file"
        className="sr-only"
        data-testid={testId}
        multiple={multiple}
        accept="image/*,application/pdf"
        disabled={disabled}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          e.target.value = ''
          if (files.length > 0) onFiles(files)
        }}
      />
      {label}
    </label>
  )
}

export function ScanPanel({ base }: { base: string }) {
  const [summary, setSummary] = useState<ScanSummary | null>(null)
  const [items, setItems] = useState<Array<UploadItem>>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'attention'>('all')
  const [open, setOpen] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setSummary(await api<ScanSummary>(`${base}/scan-summary`))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }, [base])
  useEffect(() => {
    void load()
  }, [load])

  /** Sends pages one at a time. With a target, they are the pictures of one student's page. */
  async function send(
    files: Array<File>,
    target?: { schoolStudentId: string; pageNo: number },
  ) {
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const pages = await filesToPages(files)
      const list: Array<UploadItem> = pages.map((p) => ({
        key: p.key,
        source: p.source,
        size: p.blob.size,
        state: 'waiting',
      }))
      setItems(list)
      const batchId = target
        ? undefined
        : (
            await api<{ batchId: string }>(`${base}/scan-batches`, {
              body: {},
            })
          ).batchId
      for (const [i, p] of pages.entries()) {
        const patch = (u: Partial<UploadItem>) =>
          setItems((cur) =>
            cur.map((it, k) => (k === i ? { ...it, ...u } : it)),
          )
        patch({ state: 'sending' })
        try {
          const result = await api<ScanUploadResult>(`${base}/scans`, {
            body: {
              data: await blobToBase64(p.blob),
              name: p.source,
              batch_id: batchId,
              replace: target ? true : undefined,
              target: target
                ? {
                    school_student_id: target.schoolStudentId,
                    page_no: target.pageNo,
                  }
                : undefined,
            },
          })
          patch({ state: 'done', result })
        } catch (e) {
          patch({
            state: 'failed',
            error: e instanceof Error ? e.message : 'This page was not sent.',
          })
        }
      }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  async function setAbsent(s: StudentScanRow, absent: boolean) {
    setError(null)
    try {
      await api(`${base}/absences`, {
        body: { school_student_id: s.schoolStudentId, absent },
      })
      setMessage(
        absent ? `${s.name} is marked absent.` : `${s.name} is not absent.`,
      )
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }

  const students =
    summary?.students.filter(
      (s) => filter === 'all' || s.state === 'missing' || s.state === 'none',
    ) ?? []
  const doneCount = items.filter(
    (i) => i.state === 'done' || i.state === 'failed',
  ).length

  return (
    <div className="space-y-4" data-testid="scan-panel">
      <Card className="space-y-3">
        <h2 className="text-lg font-bold">Scanned answer sheets</h2>
        <p className="text-base text-slate-700">
          Upload a whole section as one PDF, or take photos with a phone. Any
          order is fine, and a page may be upside down or tilted. Each page is
          matched to its student by the code printed on it.
        </p>
        <FilePick
          label="Choose photos or a PDF"
          disabled={busy}
          testId="scan-files"
          onFiles={(f) => void send(f)}
        />
        {items.length > 0 ? (
          <div className="space-y-2" data-testid="scan-progress">
            <p className="text-base font-medium">
              {busy
                ? `Sending… ${doneCount} of ${items.length}`
                : `${items.filter((i) => i.result?.status === 'matched' || i.result?.status === 'manual').length} of ${items.length} pages were placed.`}
            </p>
            <ul className="space-y-1.5">
              {items.map((it) => (
                <li
                  key={it.key}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-base"
                >
                  <span className="block break-words font-medium">
                    {it.source}{' '}
                    <span className="font-normal text-slate-600">
                      ({formatBytes(it.size)})
                    </span>
                  </span>
                  <span
                    className={
                      it.state === 'failed' || it.result?.status === 'rejected'
                        ? 'text-red-800'
                        : it.result?.status === 'unreadable'
                          ? 'text-amber-900'
                          : 'text-slate-700'
                    }
                  >
                    {it.state === 'waiting'
                      ? 'Waiting'
                      : it.state === 'sending'
                        ? 'Sending…'
                        : it.state === 'failed'
                          ? (it.error ?? 'This page was not sent.')
                          : it.result?.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      {message ? <Notice kind="good">{message}</Notice> : null}
      {error ? <Notice kind="error">{error}</Notice> : null}

      {summary ? (
        <>
          <Card className="space-y-3">
            <h2 className="text-lg font-bold">Who has sent what</h2>
            <div className="flex flex-wrap gap-2" data-testid="scan-totals">
              <Chip tone="good">{summary.totals.complete} complete</Chip>
              <Chip tone={summary.totals.missing > 0 ? 'wait' : 'plain'}>
                {summary.totals.missing} missing pages
              </Chip>
              <Chip>{summary.totals.none} not started</Chip>
              <Chip>{summary.totals.absent} absent</Chip>
            </div>
            <Select
              label="Show"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'attention')}
            >
              <option value="all">Every student</option>
              <option value="attention">Only those who need attention</option>
            </Select>
            <ul className="space-y-2" data-testid="scan-students">
              {students.map((s) => (
                <li
                  key={s.schoolStudentId}
                  className="space-y-2 rounded-lg border border-slate-300 px-3 py-3"
                  data-state={s.state}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="min-w-0 break-words text-base font-bold">
                      {s.name}
                      <span className="ml-2 font-normal text-slate-600">
                        Section {s.section}
                        {s.rollNo ? ` · Roll ${s.rollNo}` : ''}
                      </span>
                    </span>
                    <Chip
                      tone={
                        s.state === 'complete'
                          ? 'good'
                          : s.state === 'missing'
                            ? 'wait'
                            : 'plain'
                      }
                    >
                      {s.state === 'complete'
                        ? 'All pages in'
                        : s.state === 'missing'
                          ? `${s.received.length} of ${s.pageCount} pages`
                          : s.state === 'absent'
                            ? 'Absent'
                            : 'Nothing yet'}
                    </Chip>
                  </div>
                  {s.missing.length > 0 && s.state === 'missing' ? (
                    <p className="text-base font-medium text-amber-900">
                      Missing: {pagesText(s.missing)}
                    </p>
                  ) : null}
                  {s.duplicates.length > 0 ? (
                    <p className="text-base text-slate-700">
                      Sent twice: {pagesText(s.duplicates.map((d) => d.pageNo))}{' '}
                      (the extra copy is kept aside)
                    </p>
                  ) : null}
                  <Btn
                    kind="plain"
                    className="w-full sm:w-auto"
                    aria-expanded={open === s.schoolStudentId}
                    onClick={() =>
                      setOpen(
                        open === s.schoolStudentId ? null : s.schoolStudentId,
                      )
                    }
                  >
                    {open === s.schoolStudentId ? 'Close' : 'Fix or add a page'}
                  </Btn>
                  {open === s.schoolStudentId ? (
                    <StudentFix
                      s={s}
                      busy={busy}
                      onSend={(file, pageNo) =>
                        void send([file], {
                          schoolStudentId: s.schoolStudentId,
                          pageNo,
                        })
                      }
                      onAbsent={(a) => void setAbsent(s, a)}
                    />
                  ) : null}
                </li>
              ))}
              {students.length === 0 ? (
                <li className="text-base text-slate-700">
                  Nobody needs attention.
                </li>
              ) : null}
            </ul>
          </Card>

          <Unmatched
            base={base}
            summary={summary}
            onChanged={load}
            onMessage={setMessage}
            onError={setError}
          />
        </>
      ) : null}
    </div>
  )
}

function StudentFix({
  s,
  busy,
  onSend,
  onAbsent,
}: {
  s: StudentScanRow
  busy: boolean
  onSend: (file: File, pageNo: number) => void
  onAbsent: (absent: boolean) => void
}) {
  const [pageNo, setPageNo] = useState(s.missing[0] ?? 1)
  return (
    <div className="space-y-3 border-t border-slate-200 pt-3">
      <Select
        label="Which page is the new picture of?"
        value={pageNo}
        onChange={(e) => setPageNo(Number(e.target.value))}
      >
        {Array.from({ length: s.pageCount }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            Page {n}
            {s.received.includes(n) ? ' (replace the one we have)' : ''}
          </option>
        ))}
      </Select>
      <FilePick
        label="Choose a photo for this page"
        multiple={false}
        disabled={busy}
        testId={`scan-fix-${s.admissionNo ?? s.rollNo ?? s.name}`}
        onFiles={(f) => onSend(f[0], pageNo)}
      />
      {s.absent ? (
        <Btn kind="plain" className="w-full" onClick={() => onAbsent(false)}>
          She was not absent
        </Btn>
      ) : s.received.length === 0 ? (
        <Btn kind="plain" className="w-full" onClick={() => onAbsent(true)}>
          Mark absent
        </Btn>
      ) : null}
    </div>
  )
}

function Unmatched({
  base,
  summary,
  onChanged,
  onMessage,
  onError,
}: {
  base: string
  summary: ScanSummary
  onChanged: () => Promise<void>
  onMessage: (m: string | null) => void
  onError: (m: string | null) => void
}) {
  const waiting = summary.unmatched.filter((u) => u.status === 'unreadable')
  const refused = summary.unmatched.filter((u) => u.status === 'rejected')
  const [studentId, setStudentId] = useState<Record<string, string>>({})
  const [pageNo, setPageNo] = useState<Record<string, number>>({})
  const [conflict, setConflict] = useState<Record<string, string>>({})

  async function assign(id: string, replace: boolean) {
    onError(null)
    onMessage(null)
    const sid = studentId[id]
    if (!sid) {
      onError('Choose the student first.')
      return
    }
    try {
      const r = await api<ScanUploadResult>(`${base}/scan-pages/${id}/assign`, {
        body: { school_student_id: sid, page_no: pageNo[id] ?? 1, replace },
      })
      setConflict((c) => ({ ...c, [id]: '' }))
      onMessage(r.message)
      await onChanged()
    } catch (e) {
      if (e instanceof ApiError && e.status === 409)
        setConflict((c) => ({ ...c, [id]: e.message }))
      else onError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }

  if (waiting.length === 0 && refused.length === 0) return null
  return (
    <>
      {waiting.length > 0 ? (
        <Card className="space-y-3">
          <h2 className="text-lg font-bold">
            Pages we could not place ({waiting.length})
          </h2>
          <p className="text-base text-slate-700">
            The code on these pages could not be read. Say whose page each one
            is.
          </p>
          <ul className="space-y-3" data-testid="scan-unmatched">
            {waiting.map((u) => (
              <li
                key={u.id}
                className="space-y-2 rounded-lg border border-amber-400 bg-amber-50 px-3 py-3"
              >
                {u.url ? (
                  <img
                    src={u.url}
                    alt={u.name ?? 'A page we could not place'}
                    loading="lazy"
                    className="max-h-56 w-auto max-w-full rounded border border-slate-300"
                  />
                ) : null}
                <p className="break-words text-base text-amber-950">
                  {u.name ? `${u.name}: ` : ''}
                  {u.reason}
                </p>
                <Select
                  label="Student"
                  value={studentId[u.id] ?? ''}
                  onChange={(e) =>
                    setStudentId((c) => ({ ...c, [u.id]: e.target.value }))
                  }
                >
                  <option value="">Choose a student</option>
                  {summary.students.map((s) => (
                    <option key={s.schoolStudentId} value={s.schoolStudentId}>
                      {s.name} ({s.section}
                      {s.rollNo ? `, roll ${s.rollNo}` : ''})
                    </option>
                  ))}
                </Select>
                <Select
                  label="Page"
                  value={pageNo[u.id] ?? 1}
                  onChange={(e) =>
                    setPageNo((c) => ({ ...c, [u.id]: Number(e.target.value) }))
                  }
                >
                  {Array.from(
                    { length: summary.pageCount },
                    (_, i) => i + 1,
                  ).map((n) => (
                    <option key={n} value={n}>
                      Page {n}
                    </option>
                  ))}
                </Select>
                {conflict[u.id] ? (
                  <Notice kind="error">{conflict[u.id]}</Notice>
                ) : null}
                <Btn
                  className="w-full"
                  onClick={() => void assign(u.id, false)}
                >
                  Save as this page
                </Btn>
                {conflict[u.id] ? (
                  <Btn
                    kind="plain"
                    className="w-full"
                    onClick={() => void assign(u.id, true)}
                  >
                    Use this picture instead
                  </Btn>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      {refused.length > 0 ? (
        <Card className="space-y-2">
          <details>
            <summary className="flex min-h-12 cursor-pointer items-center text-base font-bold">
              Pages that were not accepted ({refused.length})
            </summary>
            <ul className="mt-2 space-y-2" data-testid="scan-refused">
              {refused.map((u) => (
                <li
                  key={u.id}
                  className="break-words rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-base text-red-900"
                >
                  {u.name ? `${u.name}: ` : ''}
                  {u.reason}
                </li>
              ))}
            </ul>
          </details>
        </Card>
      ) : null}
    </>
  )
}
