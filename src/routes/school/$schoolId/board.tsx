import { useCallback, useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../components/school/context'
import { Btn, Card, Chip, Notice, PageHeader } from '../../../components/school/ui'
import { api } from '../../../lib/school-client'
import type { BoardBucket, BoardSection, examBoard } from '../../../lib/schools/exam-board'

export const Route = createFileRoute('/school/$schoolId/board')({
  component: BoardPage,
})

// The exam-week board (principal: read only; the office can also try a failed sheet again). One card per paper, a row per
// section; tap a count to see the students behind it.
type Board = Awaited<ReturnType<typeof examBoard>>
type Who = { studentId: string; name: string; rollNo: string | null; status: string; reason: string | null }

const COLUMNS: Array<{ key: BoardBucket; label: string }> = [
  { key: 'uploaded', label: 'Uploaded' },
  { key: 'marked', label: 'AI-marked' },
  { key: 'waiting', label: 'Teacher to check' },
  { key: 'failed', label: 'Failed' },
]

function BoardPage() {
  const { schoolId, overview } = useSchool()
  const [data, setData] = useState<Board | null>(null)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(async () => {
    setData(await api<Board>(`/api/schools/${schoolId}/exam-board`))
  }, [schoolId])
  useEffect(() => {
    void load().catch((e: unknown) => setError(e instanceof Error ? e.message : 'Something went wrong.'))
  }, [load])

  if (overview.role !== 'school_admin' && overview.role !== 'principal')
    return <Notice>Only the principal and the school office can see this board.</Notice>
  const t = data?.totals
  return (
    <div className="space-y-4" data-testid="exam-board">
      <PageHeader title="Exam-week board" subtitle="Where every answer sheet stands" />
      {error ? <Notice kind="error">{error}</Notice> : null}
      {!data ? (
        error ? null : <p className="text-base">Loading…</p>
      ) : data.papers.length === 0 ? (
        <Notice>No approved papers yet. Papers appear here once their answer key is approved.</Notice>
      ) : (
        <>
          {t ? (
            <Card className="grid grid-cols-2 gap-3 sm:grid-cols-5" data-testid="board-totals">
              <Total n={t.students} label="Students" />
              <Total n={t.uploaded} label="Sheets uploaded" />
              <Total n={t.marked} label="AI-marked" />
              <Total n={t.waiting} label="Teacher to check" tone={t.waiting > 0 ? 'wait' : undefined} />
              <Total n={t.failed} label="Failed" tone={t.failed > 0 ? 'bad' : undefined} />
            </Card>
          ) : null}
          {data.papers.map((p) => (
            <PaperCard key={p.paperId} paper={p} canRetry={overview.role === 'school_admin'} onChanged={load} />
          ))}
        </>
      )}
    </div>
  )
}

function Total({ n, label, tone }: { n: number; label: string; tone?: 'wait' | 'bad' }) {
  return (
    <div>
      <p className={`text-2xl font-bold tabular-nums ${tone === 'bad' ? 'text-red-700' : tone === 'wait' ? 'text-amber-800' : ''}`}>{n}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  )
}

function PaperCard({
  paper,
  canRetry,
  onChanged,
}: {
  paper: Board['papers'][number]
  canRetry: boolean
  onChanged: () => Promise<void>
}) {
  const { schoolId } = useSchool()
  const [open, setOpen] = useState<{ sectionId: string; bucket: BoardBucket } | null>(null)
  const [who, setWho] = useState<Array<Who> | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function show(sectionId: string, bucket: BoardBucket) {
    if (open?.sectionId === sectionId && open.bucket === bucket) {
      setOpen(null)
      return
    }
    setOpen({ sectionId, bucket })
    setWho(null)
    setError(null)
    try {
      const r = await api<{ students: Array<Who> }>(
        `/api/schools/${schoolId}/exam-board?paper_id=${paper.paperId}&section_id=${sectionId}&bucket=${bucket}`,
      )
      setWho(r.students)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }
  async function retry(studentId: string) {
    setBusy(studentId)
    setError(null)
    try {
      await api(`/api/schools/${schoolId}/own-papers/${paper.paperId}/marking`, {
        body: { action: 'mark', student_id: studentId },
      })
      await onChanged()
      if (open) await show(open.sectionId, open.bucket).then(() => show(open.sectionId, open.bucket))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <Card className="space-y-3" data-testid="board-paper">
      <div>
        <h2 className="text-lg font-bold">{paper.title}</h2>
        <p className="text-sm text-slate-600">
          Class {paper.grade} · {paper.subject}
        </p>
      </div>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-base">
          <thead>
            <tr className="text-sm text-slate-600">
              <th className="py-1 pr-2 font-semibold">Section</th>
              {COLUMNS.map((c) => (
                <th key={c.key} className="px-1 py-1 font-semibold">
                  {c.label}
                </th>
              ))}
              <th className="px-1 py-1 font-semibold">Results</th>
            </tr>
          </thead>
          <tbody>
            {paper.sections.map((s) => (
              <tr key={s.sectionId} className="border-t border-slate-200" data-testid="board-section">
                <td className="py-2 pr-2 font-semibold">
                  {s.section} <span className="text-sm font-normal text-slate-600">({s.students})</span>
                </td>
                {COLUMNS.map((c) => (
                  <td key={c.key} className="px-1 py-1">
                    <Count n={countOf(s, c.key)} active={open?.sectionId === s.sectionId && open.bucket === c.key} bad={c.key === 'failed'} onClick={() => void show(s.sectionId, c.key)} testid={`count-${c.key}`} />
                  </td>
                ))}
                <td className="px-1 py-1">{s.released ? <Chip tone="good">Released</Chip> : <Chip>Not released</Chip>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open ? (
        <div className="space-y-2 rounded-xl bg-slate-50 p-3" data-testid="board-students">
          <p className="text-sm font-semibold text-slate-700">
            {paper.sections.find((s) => s.sectionId === open.sectionId)?.section} ·{' '}
            {COLUMNS.find((c) => c.key === open.bucket)?.label}
          </p>
          {!who ? (
            <p className="text-base">Loading…</p>
          ) : who.length === 0 ? (
            <p className="text-base text-slate-600">No one.</p>
          ) : (
            <ul className="space-y-2">
              {who.map((w) => (
                <li key={w.studentId} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="min-w-0 flex-1 text-base">
                    {w.rollNo ? `${w.rollNo}. ` : ''}
                    {w.name}
                    {w.reason ? <span className="block text-sm text-red-800">{w.reason}</span> : null}
                  </span>
                  {open.bucket === 'failed' && canRetry ? (
                    <Btn kind="plain" disabled={busy === w.studentId} onClick={() => void retry(w.studentId)}>
                      {busy === w.studentId ? 'Trying…' : 'Try again'}
                    </Btn>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </Card>
  )
}

function countOf(s: BoardSection, key: BoardBucket): number {
  return key === 'uploaded' ? s.uploaded : key === 'marked' ? s.marked : key === 'waiting' ? s.waiting : key === 'failed' ? s.failed : 0
}

function Count({ n, onClick, active, bad, testid }: { n: number; onClick: () => void; active: boolean; bad: boolean; testid: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={n === 0}
      data-testid={testid}
      className={`min-h-11 min-w-11 rounded-lg border px-2 text-base font-bold tabular-nums ${active ? 'border-emerald-700 bg-emerald-50' : 'border-slate-300 bg-white'} ${bad && n > 0 ? 'text-red-700' : ''} disabled:border-transparent disabled:bg-transparent disabled:text-slate-400`}
    >
      {n}
    </button>
  )
}
