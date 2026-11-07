import { useMemo, useState } from 'react'
import { Plus, Sparkles, Trash2 } from 'lucide-react'
import { Drawer, useShell } from './kit'
import { Btn, Field, Notice, Select, inputClass } from './ui'
import { api } from '../../lib/school-client'

// The form for one of the school's own questions (docs/SCHOOLS_MODULE_PLAN.md section 16.13): what it asks, its answer,
// and where it belongs. The AI only suggests the chapter, topic and level; the teacher sees them filled in and changes
// anything that is wrong before saving. Nothing is saved without a chapter and a topic.

export interface Choices {
  subjects: Array<{
    id: string
    label: string
    chapters: Array<{ id: string; label: string; topics: Array<{ id: string; name: string }> }>
  }>
  mayWrite: boolean
}

export interface OwnQuestion {
  id: string
  schoolSubjectId: string
  chapterId: string
  conceptId: string
  text: string
  type: string
  marks: number
  bloom: string
  difficulty: string
  answer: string
  options: Array<{ text: string; correct: boolean }>
  steps: Array<{ description: string; marks: number }>
}

export const KINDS: Array<{ value: string; label: string; choice: boolean }> = [
  { value: 'mcq', label: 'Multiple choice', choice: true },
  { value: 'assertion_reason', label: 'Assertion and reason', choice: true },
  { value: 'fill_blank', label: 'Fill in the blank', choice: false },
  { value: 'short_answer', label: 'Short answer', choice: false },
  { value: 'long_answer', label: 'Long answer', choice: false },
]

const LEVELS: Array<{ value: string; label: string }> = [
  { value: 'Remember', label: 'Remember (recall a fact)' },
  { value: 'Understand', label: 'Understand (explain in own words)' },
  { value: 'Apply', label: 'Apply (use it to solve)' },
  { value: 'Analyse', label: 'Analyse (break down, compare)' },
  { value: 'Evaluate', label: 'Evaluate (judge, give reasons)' },
  { value: 'Create', label: 'Create (make something new)' },
]
const HARDNESS = ['Easy', 'Hard', 'Hardest']
const LETTERS = ['A', 'B', 'C', 'D']

const blankOptions = () => LETTERS.map(() => ({ text: '', correct: false }))

export function OwnQuestionForm({
  schoolId,
  choices,
  editing,
  open,
  onClose,
  onSaved,
}: {
  schoolId: string
  choices: Choices
  /** a question being changed; null for a new one */
  editing: OwnQuestion | null
  open: boolean
  onClose: () => void
  onSaved: () => void
}) {
  const { toast } = useShell()
  const first = choices.subjects.at(0)
  const [subjectId, setSubjectId] = useState(editing?.schoolSubjectId ?? first?.id ?? '')
  const [type, setType] = useState(editing?.type ?? 'mcq')
  const [marks, setMarks] = useState(editing?.marks ?? 1)
  const [text, setText] = useState(editing?.text ?? '')
  const [options, setOptions] = useState(editing && editing.options.length === 4 ? editing.options : blankOptions())
  const [answer, setAnswer] = useState(editing && !KINDS.find((k) => k.value === editing.type)?.choice ? editing.answer : '')
  const [steps, setSteps] = useState<Array<{ description: string; marks: number }>>(editing?.steps.length ? editing.steps : [{ description: '', marks: 1 }])
  const [chapterId, setChapterId] = useState(editing?.chapterId ?? '')
  const [conceptId, setConceptId] = useState(editing?.conceptId ?? '')
  const [bloom, setBloom] = useState(editing?.bloom ?? '')
  const [difficulty, setDifficulty] = useState(editing?.difficulty ?? 'Easy')
  const [suggested, setSuggested] = useState<unknown>(undefined)
  const [busy, setBusy] = useState<'save' | 'suggest' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  const subject = choices.subjects.find((s) => s.id === subjectId)
  const chapter = subject?.chapters.find((c) => c.id === chapterId)
  const choice = KINDS.find((k) => k.value === type)?.choice ?? false
  const stepTotal = useMemo(() => steps.reduce((n, s) => n + (Number(s.marks) || 0), 0), [steps])
  const touch = () => setDirty(true)

  function setKind(v: string) {
    setType(v)
    if (KINDS.find((k) => k.value === v)?.choice) setMarks(1)
    else if (marks === 1 && (v === 'short_answer' || v === 'long_answer')) setMarks(v === 'long_answer' ? 5 : 2)
    touch()
  }

  async function suggest() {
    setError(null)
    setHint(null)
    setBusy('suggest')
    try {
      const r = await api<{ chapterId: string | null; conceptId: string | null; bloom: string | null; difficulty: string | null; confidence: number | null; message: string }>(
        `/api/schools/${schoolId}/our-questions/suggest`,
        { body: { schoolSubjectId: subjectId, text, type, marks, options: choice ? options : [] } },
      )
      if (r.chapterId) setChapterId(r.chapterId)
      if (r.conceptId) setConceptId(r.conceptId)
      if (r.bloom) setBloom(r.bloom)
      if (r.difficulty) setDifficulty(r.difficulty)
      setSuggested(r)
      setHint(r.message)
      touch()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(null)
    }
  }

  async function save() {
    setError(null)
    setBusy('save')
    try {
      const r = await api<{ id: string; message: string }>(
        editing ? `/api/schools/${schoolId}/our-questions/${editing.id}` : `/api/schools/${schoolId}/our-questions`,
        {
          body: {
            schoolSubjectId: subjectId,
            chapterId,
            conceptId,
            type,
            marks,
            text,
            options: choice ? options : [],
            answer: choice ? '' : answer,
            steps: !choice && marks >= 2 ? steps : [],
            bloom,
            difficulty,
            aiSuggestion: suggested,
          },
        },
      )
      toast(r.message)
      setDirty(false)
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <Drawer
      open={open}
      title={editing ? 'Change this question' : 'Write a question'}
      help="Only your school sees it. Once saved, it can be picked in Make paper."
      onClose={onClose}
      dirty={dirty}
      testId="own-question-drawer"
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Btn kind="plain" onClick={onClose}>
            Cancel
          </Btn>
          <Btn onClick={() => void save()} disabled={busy !== null}>
            {busy === 'save' ? 'Saving…' : 'Save question'}
          </Btn>
        </div>
      }
    >
      <div className="space-y-6">
        {error ? <Notice kind="error">{error}</Notice> : null}

        <section className="space-y-4" aria-labelledby="oq-what">
          <h3 id="oq-what" className="text-base font-bold text-slate-900">1. The question</h3>
          <Select label="Class and subject" value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setChapterId(''); setConceptId(''); touch() }}>
            {choices.subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Kind of question" value={type} onChange={(e) => setKind(e.target.value)}>
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </Select>
            <Select
              label="Marks"
              value={String(marks)}
              disabled={choice}
              hint={choice ? 'A choice question carries 1 mark.' : undefined}
              onChange={(e) => { setMarks(Number(e.target.value)); touch() }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
          </div>
          <Field label="Question" hint="Write it as it should print. Maths in plain text works: 3/4, x^2, √(x+1).">
            {(id) => (
              <textarea id={id} rows={4} value={text} onChange={(e) => { setText(e.target.value); touch() }} className={`${inputClass} py-2`} />
            )}
          </Field>
        </section>

        <section className="space-y-4" aria-labelledby="oq-answer">
          <h3 id="oq-answer" className="text-base font-bold text-slate-900">2. The answer</h3>
          {choice ? (
            <fieldset className="space-y-3">
              <legend className="mb-1 text-[15px] font-semibold text-slate-900">Four options. Tick the right one.</legend>
              {options.map((o, i) => (
                <div key={LETTERS[i]} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="oq-right"
                    aria-label={`Option ${LETTERS[i]} is the right answer`}
                    checked={o.correct}
                    onChange={() => { setOptions(options.map((x, j) => ({ ...x, correct: j === i }))); touch() }}
                    className="size-5 accent-emerald-700"
                  />
                  <span className="w-6 font-semibold">{LETTERS[i]}</span>
                  <input
                    aria-label={`Option ${LETTERS[i]}`}
                    value={o.text}
                    onChange={(e) => { setOptions(options.map((x, j) => (j === i ? { ...x, text: e.target.value } : x))); touch() }}
                    className={inputClass}
                  />
                </div>
              ))}
            </fieldset>
          ) : (
            <>
              <Field label="Model answer" hint="What a full-marks answer says. The AI marks against this.">
                {(id) => (
                  <textarea id={id} rows={3} value={answer} onChange={(e) => { setAnswer(e.target.value); touch() }} className={`${inputClass} py-2`} />
                )}
              </Field>
              {marks >= 2 ? (
                <fieldset className="space-y-3">
                  <legend className="mb-1 text-[15px] font-semibold text-slate-900">What earns each mark</legend>
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <input
                        aria-label={`Step ${i + 1}`}
                        title={s.description}
                        placeholder={`Step ${i + 1}, for example "Writes the formula"`}
                        value={s.description}
                        onChange={(e) => { setSteps(steps.map((x, j) => (j === i ? { ...x, description: e.target.value } : x))); touch() }}
                        className={`${inputClass} min-w-0 flex-1`}
                      />
                      <input
                        aria-label={`Marks for step ${i + 1}`}
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={s.marks}
                        onChange={(e) => { setSteps(steps.map((x, j) => (j === i ? { ...x, marks: Number(e.target.value) } : x))); touch() }}
                        className={`${inputClass} w-20! shrink-0 text-center`}
                      />
                      <Btn kind="plain" className="shrink-0 px-3" aria-label={`Remove step ${i + 1}`} disabled={steps.length === 1} onClick={() => { setSteps(steps.filter((_, j) => j !== i)); touch() }}>
                        <Trash2 aria-hidden="true" className="size-4" />
                      </Btn>
                    </div>
                  ))}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Btn kind="plain" onClick={() => { setSteps([...steps, { description: '', marks: 1 }]); touch() }}>
                      <Plus aria-hidden="true" className="size-4" />
                      Add a step
                    </Btn>
                    <p className={`text-sm font-semibold ${stepTotal === marks ? 'text-emerald-800' : 'text-amber-800'}`} data-testid="oq-step-total">
                      Steps add up to {stepTotal} of {marks} marks
                    </p>
                  </div>
                </fieldset>
              ) : null}
            </>
          )}
        </section>

        <section className="space-y-4" aria-labelledby="oq-where">
          <h3 id="oq-where" className="text-base font-bold text-slate-900">3. Where it belongs</h3>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm text-slate-800">Let the AI read the question and fill in the chapter, topic and level. You check them before saving.</p>
            <Btn kind="plain" className="mt-2" onClick={() => void suggest()} disabled={busy !== null || text.trim().length < 5}>
              <Sparkles aria-hidden="true" className="size-4" />
              {busy === 'suggest' ? 'Reading…' : 'Suggest chapter and level'}
            </Btn>
            {hint ? <p className="mt-2 text-sm font-semibold text-emerald-900" role="status">{hint}</p> : null}
          </div>
          <Select label="Chapter" value={chapterId} onChange={(e) => { setChapterId(e.target.value); setConceptId(''); touch() }}>
            <option value="">Choose the chapter</option>
            {subject?.chapters.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </Select>
          <Select label="Topic" value={conceptId} disabled={!chapter} onChange={(e) => { setConceptId(e.target.value); touch() }}>
            <option value="">{chapter ? 'Choose the topic' : 'Choose the chapter first'}</option>
            {chapter?.topics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Level" value={bloom} onChange={(e) => { setBloom(e.target.value); touch() }}>
              <option value="">Choose the level</option>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </Select>
            <Select label="How hard" value={difficulty} onChange={(e) => { setDifficulty(e.target.value); touch() }}>
              {HARDNESS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </Select>
          </div>
        </section>
      </div>
    </Drawer>
  )
}
