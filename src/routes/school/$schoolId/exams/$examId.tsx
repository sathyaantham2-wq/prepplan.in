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
import { useShell } from '../../../../components/school/kit'
import { ScanPanel } from '../../../../components/school/scan-panel'
import {
  api,
  downloadFile,
  openPdf,
  runBookletJob,
} from '../../../../lib/school-client'
import type { BookletJobProgress } from '../../../../lib/school-client'
import { formatDate } from '../../../../lib/dates'

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
  stage: string
  version: number
  setLabel: string | null
  setOf: string | null
  setB: string | null
}

function ExamPage() {
  const { schoolId, overview } = useSchool()
  const { confirm, toast } = useShell()
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
      const x = await api<Detail>(base)
      // a paper whose questions are still being chosen opens in the builder
      if (x.stage === 'building' && x.mayHandle) {
        await navigate({
          to: '/school/$schoolId/exams/build/$examId',
          params: { schoolId, examId },
          replace: true,
        })
        return
      }
      setD(x)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }, [base, navigate, schoolId, examId])
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

  async function word(which: 'question-paper-docx' | 'answer-key-docx') {
    setBusy(which)
    setMessage(null)
    setError(null)
    try {
      await downloadFile(`${base}/${which}`)
      setMessage('The Word file is downloaded. Edit it as you like.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
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

  async function makeSetB(kind: 'shuffle' | 'alternatives') {
    setBusy('setb')
    setError(null)
    try {
      const r = await api<{ message: string; options: { examId: string } }>(
        `${base}/builder`,
        { body: { action: 'make_set_b', kind } },
      )
      toast(r.message)
      await navigate({
        to: '/school/$schoolId/exams/$examId',
        params: { schoolId, examId: r.options.examId },
      })
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
      <h1 className="text-[26px] leading-tight font-bold text-slate-900">
        {d.title}
      </h1>
      <p className="text-base text-slate-700">
        {d.className} · {d.sections.map((s) => `Section ${s}`).join(', ')}
        {d.examDate ? ` · ${formatDate(d.examDate)}` : ''}
      </p>
      {message ? <Notice kind="good">{message}</Notice> : null}
      {error ? <Notice kind="error">{error}</Notice> : null}

      <Card className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="good">{d.printedMarks} marks printed</Chip>
          <Chip>Version {d.version}</Chip>
          {d.setLabel ? <Chip>Set {d.setLabel}</Chip> : null}
          {d.printedMarks !== d.nominalMarks ? (
            <Chip tone="wait">{d.nominalMarks} planned</Chip>
          ) : null}
          {overview.bookletsEnabled ? (
            <Chip>{d.bookletsMade} booklets made</Chip>
          ) : null}
        </div>
        <ul className="space-y-1 text-base text-slate-700">
          {d.rows.map((r, i) => (
            <li key={i}>
              {r.questions} × {r.slot} ({r.marks} marks)
            </li>
          ))}
        </ul>
      </Card>

      {d.mayHandle ? (
        <Card className="space-y-3" data-testid="paper-actions">
          <h2 className="text-lg font-bold">The questions</h2>
          <div className="flex flex-wrap gap-2">
            <Btn
              kind="plain"
              disabled={busy !== null}
              data-testid="change-paper"
              onClick={async () => {
                if (
                  await confirm({
                    title: 'Change the questions of this paper?',
                    body: `Your changes become version ${d.version + 1} when you finish. Version ${d.version} stays on record, and printed copies of it are not affected.`,
                    confirmLabel: 'Change the questions',
                  })
                ) {
                  try {
                    await api(`${base}/builder`, { body: { action: 'reopen' } })
                    await navigate({
                      to: '/school/$schoolId/exams/build/$examId',
                      params: { schoolId, examId },
                    })
                  } catch (e) {
                    setError(
                      e instanceof Error ? e.message : 'Something went wrong.',
                    )
                  }
                }
              }}
            >
              Change the questions
            </Btn>
            {!d.setOf && !d.setB ? (
              <>
                <Btn
                  kind="plain"
                  disabled={busy !== null}
                  onClick={() => void makeSetB('shuffle')}
                  data-testid="set-b-shuffle"
                >
                  Make set B: same questions, new order
                </Btn>
                <Btn
                  kind="plain"
                  disabled={busy !== null}
                  onClick={() => void makeSetB('alternatives')}
                >
                  Make set B: other questions of the same kind
                </Btn>
              </>
            ) : null}
            {d.setB ? (
              <Btn
                kind="plain"
                onClick={() =>
                  void navigate({
                    to: '/school/$schoolId/exams/$examId',
                    params: { schoolId, examId: d.setB as string },
                  })
                }
              >
                Open set B
              </Btn>
            ) : null}
            {d.setOf ? (
              <Btn
                kind="plain"
                onClick={() =>
                  void navigate({
                    to: '/school/$schoolId/exams/$examId',
                    params: { schoolId, examId: d.setOf as string },
                  })
                }
              >
                Open set A
              </Btn>
            ) : null}
          </div>
          <p className="text-sm text-slate-600">
            Two sets stop students copying from a neighbour. Each set has its
            own question paper and its own answer key.
          </p>
        </Card>
      ) : null}

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
        <h3 className="text-base font-bold">Question paper</h3>
        <div className="grid gap-2 sm:grid-cols-2">
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
            onClick={() => void word('question-paper-docx')}
          >
            {busy === 'question-paper-docx'
              ? 'Making the Word file…'
              : 'Download the question paper (Word)'}
          </Btn>
        </div>
        {d.mayHandle ? (
          <>
            <h3 className="pt-1 text-base font-bold">
              Answer key and marking scheme
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <Btn
                kind="plain"
                className="w-full"
                disabled={busy !== null}
                onClick={() => run('copy', `${base}/teacher-copy`)}
              >
                {busy === 'copy'
                  ? 'Making the file…'
                  : 'Open the answer key (PDF)'}
              </Btn>
              <Btn
                kind="plain"
                className="w-full"
                disabled={busy !== null}
                onClick={() => void word('answer-key-docx')}
              >
                {busy === 'answer-key-docx'
                  ? 'Making the Word file…'
                  : 'Download the answer key (Word)'}
              </Btn>
            </div>
            {/* answer booklets are switched off (owner decision 2026-11-03); the code stays for later */}
            {overview.bookletsEnabled ? (
              <details className="rounded-xl border border-slate-200 px-3.5 py-3">
                <summary className="cursor-pointer text-base font-bold">
                  Answer booklets (optional)
                </summary>
                <div className="mt-3 space-y-2">
                  <p className="text-base text-slate-700">
                    One booklet for each student, with her name and ID printed
                    and a code on every page.
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
              </details>
            ) : null}
          </>
        ) : null}
        <p className="text-sm text-slate-600">
          The question paper has questions only. Students write their answers on
          your school’s own answer sheets. Students cannot open any of these
          files.
        </p>
      </Card>
      {/* scanning printed booklets (QR) is switched off with the booklets; answer sheets go through AI correction */}
      {d.mayHandle &&
      overview.bookletsEnabled &&
      overview.school.modules.includes('correction') ? (
        <ScanPanel base={base} />
      ) : null}
    </div>
  )
}
