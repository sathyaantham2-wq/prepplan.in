import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import {
  Btn,
  Card,
  Chip,
  Notice,
  Select,
  TextInput,
} from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'
import { AnswerSheets } from '../../../../components/school/own-sheets-panel'
import { StudentSheets } from '../../../../components/school/student-sheets'
import { MathText } from '../../../../components/math-text'
import { ClassResults } from '../../../../components/school/marking-panel'
import { ReleasePanel } from '../../../../components/school/release-panel'
import type {
  OwnPaperView,
  OwnQuestionView,
  PaperProgress,
} from '../../../../lib/schools/own-paper-service'

export const Route = createFileRoute('/school/$schoolId/own-papers/$paperId')({
  component: OwnPaperPage,
})

const PHASE_TEXT: Record<string, string> = {
  read: 'Reading your paper',
  map: 'Matching each question to a chapter',
  key: 'Reading your answer key',
  draft: 'Drafting answers for you to check',
}

function OwnPaperPage() {
  const { schoolId } = useSchool()
  const { paperId } = Route.useParams()
  const base = `/api/schools/${schoolId}/own-papers/${paperId}`
  const [v, setV] = useState<OwnPaperView | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<PaperProgress | null>(null)
  const started = useRef(false)
  const [otherOpen, setOtherOpen] = useState(false)
  const [resultsVersion, setResultsVersion] = useState(0)
  const bumpResults = useCallback(() => setResultsVersion((n) => n + 1), [])

  const load = useCallback(async () => {
    try {
      setV(await api<OwnPaperView>(base))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }, [base])

  const run = useCallback(async () => {
    setRunning(true)
    setError(null)
    try {
      for (let i = 0; i < 80; i++) {
        const p = await api<PaperProgress>(base, { body: { action: 'step' } })
        setProgress(p)
        if (p.status !== 'reading') break
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setRunning(false)
      await load()
    }
  }, [base, load])

  useEffect(() => {
    void load()
  }, [load])
  useEffect(() => {
    if (v?.status === 'reading' && !started.current) {
      started.current = true
      void run()
    }
  }, [v?.status, run])

  async function act(body: Record<string, unknown>) {
    setError(null)
    try {
      setV(await api<OwnPaperView>(base, { body }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }

  if (!v)
    return error ? (
      <Notice kind="error">{error}</Notice>
    ) : (
      <p className="text-base text-slate-700">Loading…</p>
    )
  const editable = v.status === 'needs_review' || v.status === 'reading'
  const phase = progress?.phase ?? v.phase
  const done = progress?.progress ?? v.progress
  const total = progress?.total ?? v.total

  return (
    <div className="space-y-4" data-testid="own-paper" data-status={v.status}>
      <div className="space-y-1">
        <Link
          to="/school/$schoolId/own-papers"
          params={{ schoolId }}
          className="inline-flex min-h-11 items-center text-base font-semibold text-emerald-900 underline"
        >
          AI correction
        </Link>
        <h1 className="text-2xl font-bold">{v.title}</h1>
        <p className="text-base text-slate-700">
          Class {v.grade} · {v.subjectName}
          {v.totalMarks !== null ? ` · ${v.totalMarks} marks` : ''}
        </p>
      </div>

      {error ? <Notice kind="error">{error}</Notice> : null}
      {v.message && v.status === 'reading' && !running ? (
        <Notice>{v.message}</Notice>
      ) : null}
      {v.status === 'failed' ? (
        <Notice kind="error">
          {v.message ?? 'This paper could not be read.'} Go back and upload it
          again.
        </Notice>
      ) : null}

      {v.status === 'reading' ? (
        <Card className="space-y-3" data-testid="reading">
          <h2 className="text-lg font-bold">
            {PHASE_TEXT[phase] ?? 'Working'}…
          </h2>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            className="h-3 w-full overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="h-full bg-emerald-800 transition-all"
              style={{
                width: `${total === 0 ? 5 : Math.round((done / total) * 100)}%`,
              }}
            />
          </div>
          <p className="text-base text-slate-700">
            This takes a minute or two. You can leave this page open.
          </p>
          {!running ? (
            <Btn className="w-full" onClick={() => void run()}>
              Try again
            </Btn>
          ) : null}
        </Card>
      ) : null}

      {v.status === 'needs_review' || v.status === 'approved' ? (
        <Card className="space-y-3" data-testid="summary">
          <div className="flex flex-wrap gap-2">
            <Chip>{v.summary.questions} questions</Chip>
            {v.summary.toCheck > 0 ? (
              <Chip tone="wait">{v.summary.toCheck} to check</Chip>
            ) : (
              <Chip tone="good">Chapters matched</Chip>
            )}
            {v.summary.changed > 0 ? (
              <Chip tone="wait">{v.summary.changed} changed by you</Chip>
            ) : null}
            <Chip
              tone={
                v.summary.keysApproved === v.summary.questions ? 'good' : 'wait'
              }
            >
              Answers approved: {v.summary.keysApproved} of{' '}
              {v.summary.questions}
            </Chip>
          </div>
          {v.status === 'needs_review' ? (
            <p className="text-base text-slate-800">
              Check the questions, marks and chapters below. Then approve the
              paper.{' '}
              <b>
                No answer sheet can be marked until you also approve every
                answer.
              </b>
            </p>
          ) : (
            <Notice kind={v.markable ? 'good' : 'info'}>
              {v.markable
                ? 'The paper and every answer are approved. It can be used for marking.'
                : 'The paper is approved. Approve every answer below before anything can be marked.'}
            </Notice>
          )}
          <div className="space-y-2">
            {v.status === 'needs_review' ? (
              <Btn
                className="w-full"
                disabled={!v.canApprove}
                onClick={() => void act({ action: 'approve' })}
              >
                Approve this paper
              </Btn>
            ) : null}
            {v.summary.keysDraft > 0 ? (
              <Btn
                kind="plain"
                className="w-full"
                onClick={() => void act({ action: 'approve_keys' })}
              >
                Approve all {v.summary.keysDraft} answers shown as drafts
              </Btn>
            ) : null}
          </div>
        </Card>
      ) : null}

      <ul className="space-y-3">
        {v.questions.map((q) => (
          <QuestionCard key={q.id} q={q} v={v} editable={editable} act={act} />
        ))}
      </ul>
      {v.status === 'approved' ? (
        v.markable ? (
          <>
            <Card>
              <StudentSheets
                base={base}
                onMarkingChanged={bumpResults}
              />
            </Card>
            <Card>
              <ClassResults base={base} version={resultsVersion} />
            </Card>
            <Card>
              <ReleasePanel
                base={base}
                version={resultsVersion}
                onChanged={bumpResults}
              />
            </Card>
            <details
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              data-testid="other-ways"
              onToggle={(e) => setOtherOpen(e.currentTarget.open)}
            >
              <summary className="min-h-11 cursor-pointer content-center text-base font-semibold">
                Other ways (optional): printed cover pages, files named by roll
                number
              </summary>
              {/* loaded each time it is opened, so its counts are never stale */}
              {otherOpen ? (
                <div className="mt-3">
                  <AnswerSheets base={base} />
                </div>
              ) : null}
            </details>
          </>
        ) : (
          <Notice>
            Approve every answer above. Then you can upload the students' answer
            sheets.
          </Notice>
        )
      ) : null}
      {editable && v.status === 'needs_review' ? (
        <AddQuestion v={v} act={act} />
      ) : null}
    </div>
  )
}

function keyChip(q: OwnQuestionView) {
  if (q.keyStatus === 'approved')
    return (
      <Chip tone="good">
        {q.keySource === 'bank'
          ? 'Answer from the PrepPlan bank'
          : 'Answer approved'}
      </Chip>
    )
  if (q.keyStatus === 'draft')
    return (
      <Chip tone="wait">
        {q.keySource === 'ai_draft'
          ? 'Answer drafted by PrepPlan AI: check it'
          : 'Answer to check'}
      </Chip>
    )
  return <Chip>No answer yet</Chip>
}

function QuestionCard({
  q,
  v,
  editable,
  act,
}: {
  q: OwnQuestionView
  v: OwnPaperView
  editable: boolean
  act: (b: Record<string, unknown>) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [keyOpen, setKeyOpen] = useState(false)
  const [text, setText] = useState(q.text)
  const [marks, setMarks] = useState(String(q.marks))
  const [chapter, setChapter] = useState(q.chapterId ?? '')
  const [answer, setAnswer] = useState(q.keyText ?? '')
  const [note, setNote] = useState(q.markingNote ?? '')
  const structural = v.status === 'needs_review' || v.status === 'reading'
  return (
    <li
      className={`space-y-2 rounded-xl border bg-white p-3 ${q.check ? 'border-amber-500' : 'border-slate-300'}`}
      data-testid="own-question"
    >
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <b className="text-base">Q{q.position}</b>
        {q.section ? <span className="text-slate-600">{q.section}</span> : null}
        <Chip>
          {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
        </Chip>
        {q.orGroup ? <Chip>OR pair</Chip> : null}
        {q.changedFromSource ? <Chip tone="wait">You changed this</Chip> : null}
        {q.check ? <Chip tone="wait">Check the chapter</Chip> : null}
      </div>
      {editing ? (
        <div className="space-y-3">
          <label className="block text-base font-medium">
            Question
            <textarea
              className="mt-1 block min-h-28 w-full rounded-lg border border-slate-400 px-3 py-2 text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <TextInput
            label="Marks"
            inputMode="decimal"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />
          <Select
            label="Chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
          >
            <option value="">No chapter chosen</option>
            {v.chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Btn
              onClick={async () => {
                await act({
                  action: 'update_question',
                  question_id: q.id,
                  text,
                  marks: Number(marks),
                  chapter_id: chapter || null,
                })
                setEditing(false)
              }}
            >
              Save
            </Btn>
            <Btn kind="plain" onClick={() => setEditing(false)}>
              Cancel
            </Btn>
          </div>
        </div>
      ) : (
        <>
          <p className="text-base break-words whitespace-pre-wrap">
            <MathText text={q.text} />
          </p>
          {q.options.length > 0 ? (
            <ul className="space-y-0.5 pl-3 text-base">
              {q.options.map((o) => (
                <li key={o.label}>
                  ({o.label}) {o.text}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-sm text-slate-700">
            Chapter: {q.chapterLabel ?? 'not chosen yet'}
          </p>
          {editable && structural ? (
            <div className="grid grid-cols-2 gap-2">
              <Btn kind="plain" onClick={() => setEditing(true)}>
                Change
              </Btn>
              <Btn
                kind="plain"
                onClick={() =>
                  void act({ action: 'remove_question', question_id: q.id })
                }
              >
                Remove
              </Btn>
            </div>
          ) : null}
        </>
      )}
      <div className="space-y-2 border-t border-slate-200 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <b className="text-base">Answer</b>
          {keyChip(q)}
        </div>
        {keyOpen ? (
          <div className="space-y-2">
            <textarea
              className="block min-h-24 w-full rounded-lg border border-slate-400 px-3 py-2 text-base"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              aria-label={`Answer to question ${q.position}`}
            />
            <label className="block text-sm font-semibold text-slate-700">
              Marking note (optional): anything the marker should know
              <input
                type="text"
                maxLength={400}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="For example: accept any valid method; no marks off for a missing unit"
                data-testid="marking-note"
                className="mt-1 block min-h-11 w-full rounded-lg border border-slate-400 px-3 text-base font-normal"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Btn
                onClick={async () => {
                  await act({
                    action: 'set_key',
                    question_id: q.id,
                    answer,
                    steps: q.keySteps,
                    approve: true,
                    note,
                  })
                  setKeyOpen(false)
                }}
              >
                Save and approve
              </Btn>
              <Btn kind="plain" onClick={() => setKeyOpen(false)}>
                Cancel
              </Btn>
            </div>
          </div>
        ) : (
          <>
            <p className="text-base break-words whitespace-pre-wrap">
              {q.keyText ? <MathText text={q.keyText} /> : 'Nothing yet. Write the answer.'}
            </p>
            {q.markingNote ? (
              <p className="text-sm text-slate-700" data-testid="note-shown">
                <b>Marking note:</b> {q.markingNote}
              </p>
            ) : null}
            {q.keySteps.length > 0 ? (
              <ul className="list-disc pl-5 text-sm text-slate-700">
                {q.keySteps.map((s, i) => (
                  <li key={i}>
                    {s.description} ({s.marks})
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              <Btn kind="plain" onClick={() => setKeyOpen(true)}>
                {q.keyText ? 'Change answer' : 'Write answer'}
              </Btn>
              {q.keyStatus === 'draft' ? (
                <Btn
                  onClick={() =>
                    void act({ action: 'approve_keys', question_ids: [q.id] })
                  }
                >
                  Approve answer
                </Btn>
              ) : null}
            </div>
          </>
        )}
      </div>
    </li>
  )
}

function AddQuestion({
  v,
  act,
}: {
  v: OwnPaperView
  act: (b: Record<string, unknown>) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [marks, setMarks] = useState('1')
  const [chapter, setChapter] = useState('')
  if (!open)
    return (
      <Btn kind="plain" className="w-full" onClick={() => setOpen(true)}>
        Add a question
      </Btn>
    )
  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-bold">Add a question</h2>
      <label className="block text-base font-medium">
        Question
        <textarea
          className="mt-1 block min-h-24 w-full rounded-lg border border-slate-400 px-3 py-2 text-base"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <TextInput
        label="Marks"
        inputMode="decimal"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
      />
      <Select
        label="Chapter"
        value={chapter}
        onChange={(e) => setChapter(e.target.value)}
      >
        <option value="">No chapter chosen</option>
        {v.chapters.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Btn
          disabled={text.trim().length < 2}
          onClick={async () => {
            await act({
              action: 'add_question',
              text,
              marks: Number(marks),
              chapter_id: chapter || null,
            })
            setOpen(false)
            setText('')
          }}
        >
          Add
        </Btn>
        <Btn kind="plain" onClick={() => setOpen(false)}>
          Cancel
        </Btn>
      </div>
    </Card>
  )
}
