import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import { BookOpenCheck, FileUp } from 'lucide-react'
import {
  Btn,
  Card,
  Chip,
  PageHeader,
  EmptyState,
  Loading,
  Notice,
  cardClass,
} from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'

export const Route = createFileRoute('/school/$schoolId/own-papers/')({
  component: OwnPapers,
})

interface Row {
  id: string
  title: string
  status: string
  subjectName: string
  grade: number
  totalMarks: number | null
}

const STATUS: Partial<
  Record<string, { text: string; tone: 'plain' | 'good' | 'wait' }>
> = {
  reading: { text: 'Being read', tone: 'wait' },
  needs_review: { text: 'Check it', tone: 'wait' },
  approved: { text: 'Approved', tone: 'good' },
  failed: { text: 'Could not be read', tone: 'plain' },
  uploaded: { text: 'Uploaded', tone: 'plain' },
}

interface ExamRow {
  id: string
  title: string
  className: string
  printedMarks: number
  paperId: string | null
}

// The AI correction area (owner direction 2026-10-30): start from the school's own paper, or from a paper
// made here; then approve the answers; then upload each student's answer sheets.
function OwnPapers() {
  const { schoolId } = useSchool()
  const navigate = useNavigate()
  const [rows, setRows] = useState<Array<Row> | null>(null)
  const [exams, setExams] = useState<Array<ExamRow> | null>(null)
  const [picking, setPicking] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    void api<Array<Row>>(`/api/schools/${schoolId}/own-papers`).then(
      setRows,
      (e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
    )
  }, [schoolId])

  async function showExams() {
    setPicking(true)
    setError(null)
    try {
      setExams(
        (
          await api<{ exams: Array<ExamRow> }>(
            `/api/schools/${schoolId}/correction/exams`,
          )
        ).exams,
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }

  async function take(examId: string) {
    setBusy(examId)
    setError(null)
    try {
      const r = await api<{ paperId: string }>(
        `/api/schools/${schoolId}/correction/exams`,
        { body: { exam_id: examId } },
      )
      await navigate({
        to: '/school/$schoolId/own-papers/$paperId',
        params: { schoolId, paperId: r.paperId },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setBusy(null)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI correction"
        subtitle="Three steps: the question paper, its answers approved by a teacher, then each student's answer sheets."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/school/$schoolId/own-papers/new"
          params={{ schoolId }}
          className="group flex min-h-24 items-center gap-4 rounded-2xl border border-emerald-700 bg-emerald-700 p-4 text-white shadow-md shadow-emerald-900/20 hover:bg-emerald-800"
        >
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15"
          >
            <FileUp className="size-6" />
          </span>
          <span>
            <span className="font-display block text-lg font-bold">
              Use your own paper
            </span>
            <span className="block text-[15px] text-emerald-50/90">
              Upload it as Word, PDF or photos. We read it; you check it.
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => void showExams()}
          className="group flex min-h-24 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left text-slate-900 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] hover:border-emerald-300"
        >
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
          >
            <BookOpenCheck className="size-6" />
          </span>
          <span>
            <span className="font-display block text-lg font-bold">
              Use a paper made here
            </span>
            <span className="block text-[15px] text-slate-600">
              One of your exam papers from PrepPlan, with its answers ready to
              approve.
            </span>
          </span>
        </button>
      </div>
      {picking ? (
        <Card className="space-y-2" data-testid="exam-picker">
          <h2 className="text-lg font-bold">Which exam paper?</h2>
          {exams === null ? <Loading /> : null}
          {exams?.length === 0 ? (
            <p className="text-base text-slate-600">
              No exam papers made here yet.
            </p>
          ) : null}
          {exams?.map((e) => (
            <div
              key={e.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5"
            >
              <span className="min-w-0">
                <span className="block font-semibold">{e.title}</span>
                <span className="block text-sm text-slate-600">
                  {e.className} · {e.printedMarks} marks
                </span>
              </span>
              <Btn
                kind={e.paperId ? 'plain' : 'primary'}
                disabled={busy !== null}
                onClick={() => void take(e.id)}
              >
                {busy === e.id
                  ? 'Opening…'
                  : e.paperId
                    ? 'Open'
                    : 'Correct this paper'}
              </Btn>
            </div>
          ))}
        </Card>
      ) : null}
      <h2 className="pt-1 text-xl font-bold">Your papers</h2>
      {error ? <Notice kind="error">{error}</Notice> : null}
      {rows === null && !error ? <Loading /> : null}
      {rows?.length === 0 ? (
        <EmptyState icon={<FileUp className="size-6" />} title="No papers yet.">
          A paper you upload is listed here while it is read, checked and
          approved.
        </EmptyState>
      ) : null}
      {rows?.map((r) => (
        <Link
          key={r.id}
          to="/school/$schoolId/own-papers/$paperId"
          params={{ schoolId, paperId: r.id }}
          className={`${cardClass} block p-4! text-slate-900 transition-colors hover:border-emerald-300`}
        >
          <span className="flex flex-wrap items-center gap-2">
            <b className="font-display text-lg">{r.title}</b>
            <Chip tone={STATUS[r.status]?.tone ?? 'plain'}>
              {STATUS[r.status]?.text ?? r.status}
            </Chip>
          </span>
          <span className="mt-1 block text-base text-slate-700">
            Class {r.grade} · {r.subjectName}
            {r.totalMarks !== null ? ` · ${r.totalMarks} marks` : ''}
          </span>
        </Link>
      ))}
    </div>
  )
}
