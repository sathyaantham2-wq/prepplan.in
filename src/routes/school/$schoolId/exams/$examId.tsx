import { useCallback, useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import {
  Btn,
  Card,
  Chip,
  Notice,
  Select,
} from '../../../../components/school/ui'
import { ScanPanel } from '../../../../components/school/scan-panel'
import {
  api,
  downloadFile,
  openPdf,
  runBookletJob,
} from '../../../../lib/school-client'
import type { BookletJobProgress } from '../../../../lib/school-client'

export const Route = createFileRoute('/school/$schoolId/exams/$examId')({
  component: ExamPage,
})

interface Detail {
  id: string
  title: string
  className: string
  sections: Array<string>
  nominalMarks: number
  printedMarks: number
  status: string
  examDate: string | null
  gapLines: Array<string>
  rows: Array<{
    section: string
    slot: string
    questions: number
    marks: number
  }>
  bookletPages: number
  bookletsMade: number
  mayHandle: boolean
}

function ExamPage() {
  const { schoolId, overview } = useSchool()
  const navigate = useNavigate()
  const { examId } = Route.useParams()
  const [d, setD] = useState<Detail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [sectionId, setSectionId] = useState('')
  const [job, setJob] = useState<BookletJobProgress | null>(null)
  const base = `/api/schools/${schoolId}/exams/${examId}`

  const load = useCallback(async () => {
    try {
      setD(await api<Detail>(base))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }, [base])
  useEffect(() => {
    void load()
  }, [load])

  const sectionChoices = overview.classes.flatMap((c) =>
    c.sections
      .filter((s) => d?.sections.includes(s.name))
      .map((s) => ({
        id: s.id,
        label: `${c.grade === 0 ? '' : `Class ${c.grade} · `}Section ${s.name}`,
      })),
  )
  useEffect(() => {
    if (!sectionId && sectionChoices.length > 0)
      setSectionId(sectionChoices[0].id)
  }, [sectionChoices, sectionId])

  async function word() {
    setBusy('word')
    setMessage(null)
    setError(null)
    try {
      await downloadFile(`${base}/question-paper-docx`)
      setMessage('The Word file is downloaded. Edit it as you like.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(null)
    }
  }

  async function useSample() {
    setBusy('sample')
    setError(null)
    try {
      await api(`/api/schools/${schoolId}/demo/sample-results`, {
        body: { exam_id: examId },
      })
      await navigate({
        to: '/school/$schoolId/results/$examId',
        params: { schoolId, examId },
        search: { student: undefined },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setBusy(null)
    }
  }

  async function run(name: string, path: string, body?: unknown) {
    setBusy(name)
    setMessage(null)
    setError(null)
    try {
      await openPdf(path, body)
      setMessage(
        'Opened in a new tab. If nothing opened, allow pop-ups for this site and try again.',
      )
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(null)
    }
  }

  async function makeBooklets() {
    setBusy('booklets')
    setMessage(null)
    setError(null)
    setJob(null)
    try {
      await runBookletJob(base, { section_id: sectionId }, setJob)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(null)
    }
  }

  if (!d)
    return error ? (
      <Notice kind="error">{error}</Notice>
    ) : (
      <p className="text-base text-slate-700">Loading…</p>
    )
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{d.title}</h1>
      <p className="text-base text-slate-700">
        {d.className} · {d.sections.map((s) => `Section ${s}`).join(', ')}
        {d.examDate ? ` · ${d.examDate}` : ''}
      </p>
      {message ? <Notice kind="good">{message}</Notice> : null}
      {error ? <Notice kind="error">{error}</Notice> : null}

      <Card className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="good">{d.printedMarks} marks printed</Chip>
          {d.printedMarks !== d.nominalMarks ? (
            <Chip tone="wait">{d.nominalMarks} planned</Chip>
          ) : null}
          <Chip>{d.bookletsMade} booklets made</Chip>
        </div>
        <ul className="space-y-1 text-base text-slate-700">
          {d.rows.map((r, i) => (
            <li key={i}>
              {r.questions} × {r.slot} ({r.marks} marks)
            </li>
          ))}
        </ul>
      </Card>

      {d.gapLines.length > 0 ? (
        <div
          data-testid="exam-gaps"
          className="space-y-2 rounded-lg border-2 border-amber-500 bg-amber-50 px-4 py-3 text-base text-amber-950"
        >
          <b>Gaps in this paper.</b> The bank could not fill everything. These
          lines are printed on the teacher copy.
          <ul className="list-disc space-y-1 pl-5">
            {d.gapLines.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      ) : (
        <Notice kind="good">
          Every row was filled from the question bank.
        </Notice>
      )}

      <Card className="space-y-3">
        <h2 className="text-lg font-bold">Print</h2>
        <Btn
          className="w-full"
          disabled={busy !== null}
          onClick={() => run('paper', `${base}/question-paper`)}
        >
          {busy === 'paper'
            ? 'Making the file…'
            : 'Open the question paper (PDF)'}
        </Btn>
        <Btn
          kind="plain"
          className="w-full"
          disabled={busy !== null}
          onClick={() => void word()}
        >
          {busy === 'word'
            ? 'Making the Word file…'
            : 'Download the question paper (Word)'}
        </Btn>
        {d.mayHandle ? (
          <>
            <Btn
              kind="plain"
              className="w-full"
              disabled={busy !== null}
              onClick={() => run('copy', `${base}/teacher-copy`)}
            >
              {busy === 'copy'
                ? 'Making the file…'
                : 'Open the teacher copy (PDF)'}
            </Btn>
            <div className="space-y-2 border-t border-slate-200 pt-3">
              <h3 className="text-base font-bold">Answer booklets</h3>
              <p className="text-base text-slate-700">
                One booklet for each student, with her name and ID printed and a
                code on every page.
              </p>
              <Select
                label="For which section"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
              >
                {sectionChoices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
              <Btn
                kind="plain"
                className="w-full"
                disabled={busy !== null || !sectionId}
                onClick={makeBooklets}
              >
                {busy === 'booklets'
                  ? 'Making the booklets…'
                  : 'Make the answer booklets'}
              </Btn>
              {job ? (
                <div className="space-y-2" data-testid="booklet-progress">
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={job.total}
                    aria-valuenow={job.done}
                    className="h-3 w-full overflow-hidden rounded-full bg-slate-200"
                  >
                    <div
                      className="h-full bg-emerald-800 transition-all"
                      style={{
                        width: `${job.total === 0 ? 0 : Math.round((job.done / job.total) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-base text-slate-700">
                    {job.ready
                      ? `Ready: ${job.total} booklets, ${job.pages} pages.`
                      : `${job.done} of ${job.total} booklets made…`}
                  </p>
                  {job.ready ? (
                    <Btn
                      className="w-full"
                      onClick={() =>
                        void openPdf(
                          `${base}/booklet-jobs/${job.jobId}/result`,
                        ).catch((e: unknown) =>
                          setError(
                            e instanceof Error
                              ? e.message
                              : 'Something went wrong.',
                          ),
                        )
                      }
                    >
                      Open the answer booklets (PDF)
                    </Btn>
                  ) : null}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
        <p className="text-sm text-slate-600">
          Students cannot open any of these files. Print them for the exam.
        </p>
      </Card>
      {d.mayHandle && overview.school.isDemo ? (
        <Card
          className="space-y-3 border-amber-400 bg-amber-50"
          data-testid="demo-sample-card"
        >
          <h2 className="text-lg font-bold text-amber-950">
            Demo: no answer sheets needed
          </h2>
          <p className="text-base text-amber-950">
            Press the button to fill this exam with sample answer sheets for the
            30 invented students. You then see sample results. Nothing is
            scanned and no AI is used.
          </p>
          <Btn
            className="w-full"
            disabled={busy !== null}
            onClick={() => void useSample()}
          >
            {busy === 'sample'
              ? 'Making sample results…'
              : 'Use sample answer sheets'}
          </Btn>
        </Card>
      ) : null}
      {d.mayHandle ? <ScanPanel base={base} /> : null}
    </div>
  )
}
