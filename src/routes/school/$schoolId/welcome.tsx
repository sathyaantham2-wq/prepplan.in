import { useCallback, useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../components/school/context'
import { UploadPanel } from '../../../components/school/upload-panel'
import {
  Btn,
  Card,
  Chip,
  Notice,
  Select,
  TextInput,
} from '../../../components/school/ui'
import { api } from '../../../lib/school-client'
import type { WizardState, WizardStep } from '../../../lib/schools/wizard'

export const Route = createFileRoute('/school/$schoolId/welcome')({
  component: Welcome,
})

// Five questions, one per screen: you, your school, your classes, your teachers, your students.
const QUESTIONS: Array<{ step: WizardStep; title: string }> = [
  { step: 'you', title: 'About you' },
  { step: 'school', title: 'Your school' },
  { step: 'classes', title: 'Your classes' },
  { step: 'teachers', title: 'Your teachers' },
  { step: 'students', title: 'Your students' },
]
const ORDER: Array<WizardStep> = [...QUESTIONS.map((q) => q.step), 'done']

function Welcome() {
  const { schoolId, reload } = useSchool()
  const navigate = useNavigate()
  const base = `/api/schools/${schoolId}/wizard`
  const [w, setW] = useState<WizardState | null>(null)
  const [step, setStep] = useState<WizardStep>('you')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void api<WizardState>(base).then(
      (s) => {
        setW(s)
        setStep(s.done ? 'you' : s.step)
      },
      (e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
    )
  }, [base])

  /** Saves what was typed (if anything), then goes to another screen. */
  const go = useCallback(
    async (
      next: WizardStep,
      save?: { action: string; [k: string]: unknown },
    ) => {
      setBusy(true)
      setError(null)
      try {
        let state = save ? await api<WizardState>(base, { body: save }) : w
        state = await api<WizardState>(base, {
          body: { action: 'step', step: next },
        })
        setW(state)
        setStep(next)
        window.scrollTo({ top: 0 })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong.')
      } finally {
        setBusy(false)
      }
    },
    [base, w],
  )

  async function leave(skipped: boolean) {
    setBusy(true)
    try {
      await api(base, { body: { action: 'finish', skipped } })
      await reload()
      await navigate({ to: '/school/$schoolId', params: { schoolId } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setBusy(false)
    }
  }

  if (!w)
    return error ? (
      <Notice kind="error">{error}</Notice>
    ) : (
      <p className="text-base text-slate-700">Loading…</p>
    )

  const at = ORDER.indexOf(step)
  const back = at > 0 ? ORDER[at - 1] : null
  const after = ORDER[at + 1] as WizardStep | undefined
  const q = QUESTIONS.findIndex((x) => x.step === step)

  return (
    <div className="space-y-4" data-testid="wizard" data-step={step}>
      {q >= 0 ? (
        <div className="space-y-2">
          <p className="text-base font-semibold text-slate-700">
            Question {q + 1} of {QUESTIONS.length}
          </p>
          <div
            role="progressbar"
            aria-label="Setup progress"
            aria-valuemin={0}
            aria-valuemax={QUESTIONS.length}
            aria-valuenow={q + 1}
            className="h-3 w-full overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="h-full bg-emerald-800 transition-all"
              style={{ width: `${((q + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      {error ? <Notice kind="error">{error}</Notice> : null}

      {step === 'you' ? (
        <YouScreen
          w={w}
          busy={busy}
          onNext={(v) => go('school', { action: 'admin', ...v })}
          onSkip={() => go('school')}
        />
      ) : null}
      {step === 'school' ? (
        <SchoolScreen
          w={w}
          busy={busy}
          onBack={() => go('you')}
          onNext={(v) => go('classes', { action: 'school', ...v })}
          onSkip={() => go('classes')}
        />
      ) : null}
      {step === 'classes' ? (
        <ClassesScreen
          w={w}
          busy={busy}
          onBack={() => go('school')}
          onNext={(v) => go('teachers', { action: 'classes', ...v })}
          onSkip={() => go('teachers')}
        />
      ) : null}
      {step === 'teachers' ? (
        <TeachersScreen
          w={w}
          base={base}
          setW={setW}
          busy={busy}
          onBack={() => go('classes')}
          onNext={() => go('students')}
          onSkip={() => go('students')}
        />
      ) : null}
      {step === 'students' ? (
        <StudentsScreen
          w={w}
          schoolId={schoolId}
          base={base}
          setW={setW}
          busy={busy}
          onBack={() => go('teachers')}
          onNext={() => go('done')}
          onSkip={() => go('done')}
        />
      ) : null}
      {step === 'done' ? (
        <DoneScreen
          w={w}
          busy={busy}
          onFinish={() => leave(false)}
          onBack={back ? () => go(back) : undefined}
        />
      ) : null}

      {step !== 'done' && after ? (
        <p className="pt-2 text-center">
          <button
            type="button"
            className="min-h-11 px-3 text-base text-slate-700 underline"
            onClick={() => void leave(true)}
          >
            Leave setup, I will do it later
          </button>
        </p>
      ) : null}
    </div>
  )
}

function Nav({
  busy,
  onBack,
  onNext,
  onSkip,
  nextLabel = 'Next',
  nextDisabled = false,
}: {
  busy: boolean
  onBack?: () => void
  onNext: () => void
  onSkip?: () => void
  nextLabel?: string
  nextDisabled?: boolean
}) {
  return (
    <div className="space-y-2 pt-2">
      <Btn className="w-full" disabled={busy || nextDisabled} onClick={onNext}>
        {busy ? 'Saving…' : nextLabel}
      </Btn>
      {onSkip ? (
        <Btn kind="plain" className="w-full" disabled={busy} onClick={onSkip}>
          Skip for now
        </Btn>
      ) : null}
      {onBack ? (
        <Btn kind="plain" className="w-full" disabled={busy} onClick={onBack}>
          Back
        </Btn>
      ) : null}
    </div>
  )
}

function YouScreen({
  w,
  busy,
  onNext,
  onSkip,
}: {
  w: WizardState
  busy: boolean
  onNext: (v: { name: string; phone: string }) => void
  onSkip: () => void
}) {
  const [name, setName] = useState(w.me.name)
  const [phone, setPhone] = useState(w.me.phone?.replace(/^\+91/, '') ?? '')
  return (
    <Card className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome. What should we call you?</h1>
      <p className="text-base text-slate-700">
        This is how your name shows to your teachers.
      </p>
      <TextInput
        label="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
      />
      <TextInput
        label="Your mobile number (you can leave this empty)"
        value={phone}
        inputMode="numeric"
        onChange={(e) => setPhone(e.target.value)}
        autoComplete="tel-national"
        hint="We use it only to reach you about your school account."
      />
      <Nav busy={busy} onNext={() => onNext({ name, phone })} onSkip={onSkip} />
    </Card>
  )
}

function SchoolScreen({
  w,
  busy,
  onBack,
  onNext,
  onSkip,
}: {
  w: WizardState
  busy: boolean
  onBack: () => void
  onNext: (v: {
    name: string
    city: string
    board: string
    accept_terms: boolean
  }) => void
  onSkip: () => void
}) {
  const [name, setName] = useState(w.school.name)
  const [city, setCity] = useState(w.school.city ?? '')
  const [agree, setAgree] = useState(w.termsAccepted)
  return (
    <Card className="space-y-4">
      <h1 className="text-2xl font-bold">What is your school called?</h1>
      <TextInput
        label="School name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput
        label="Town or city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <Select
        label="Which board does your school follow?"
        value="CBSE"
        onChange={() => undefined}
      >
        <option value="CBSE">CBSE</option>
      </Select>
      <div className="space-y-2 rounded-lg border border-slate-300 p-3">
        <p className="text-base">
          Student information is used only for your school’s exams and reports.
          It is never used for advertising or to train AI.
        </p>
        <label className="flex min-h-11 items-start gap-3 text-base">
          <input
            type="checkbox"
            className="mt-1 size-6 shrink-0"
            checked={agree}
            disabled={w.termsAccepted}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>
            I accept the PrepPlan school terms for my school.
            {w.termsAccepted ? <Chip tone="good">Accepted</Chip> : null}
          </span>
        </label>
      </div>
      <Nav
        busy={busy}
        onBack={onBack}
        onNext={() =>
          onNext({ name, city, board: 'CBSE', accept_terms: agree })
        }
        onSkip={onSkip}
      />
    </Card>
  )
}

const GRADES = [6, 7, 8, 9, 10]

function ClassesScreen({
  w,
  busy,
  onBack,
  onNext,
  onSkip,
}: {
  w: WizardState
  busy: boolean
  onBack: () => void
  onNext: (v: {
    academic_year: string
    classes: Array<{ grade: number; sections: number }>
  }) => void
  onSkip: () => void
}) {
  const [chosen, setChosen] = useState<Record<number, number>>(
    Object.fromEntries(
      w.classes.map((c) => [c.grade, Math.max(1, c.sections.length)]),
    ),
  )
  const list = Object.entries(chosen).map(([g, n]) => ({
    grade: Number(g),
    sections: n,
  }))
  return (
    <Card className="space-y-4">
      <h1 className="text-2xl font-bold">
        Which classes does your school have?
      </h1>
      <p className="text-base text-slate-700">
        Tap every class. Then say how many sections each has. We add Maths,
        Science and Social Science for you.
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Classes">
        {GRADES.map((g) => {
          const on = g in chosen
          return (
            <button
              key={g}
              type="button"
              aria-pressed={on}
              onClick={() =>
                setChosen((c) => {
                  const next = { ...c }
                  if (on) delete next[g]
                  else next[g] = 1
                  return next
                })
              }
              className={`min-h-12 min-w-24 rounded-lg border px-4 text-base font-semibold ${on ? 'border-emerald-700 bg-emerald-100 text-emerald-900' : 'border-slate-300 bg-white text-slate-800'}`}
            >
              Class {g}
            </button>
          )
        })}
      </div>
      {list
        .sort((a, b) => a.grade - b.grade)
        .map((c) => (
          <Select
            key={c.grade}
            label={`Class ${c.grade}: how many sections?`}
            value={c.sections}
            onChange={(e) =>
              setChosen((x) => ({ ...x, [c.grade]: Number(e.target.value) }))
            }
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n === 1
                  ? '1 section (A)'
                  : `${n} sections (A to ${String.fromCharCode(64 + n)})`}
              </option>
            ))}
          </Select>
        ))}
      <Nav
        busy={busy}
        onBack={onBack}
        onNext={() => onNext({ academic_year: w.academicYear, classes: list })}
        nextDisabled={list.length === 0}
        onSkip={onSkip}
      />
    </Card>
  )
}

function TeachersScreen({
  w,
  base,
  setW,
  busy,
  onBack,
  onNext,
  onSkip,
}: {
  w: WizardState
  base: string
  setW: (s: WizardState) => void
  busy: boolean
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}) {
  const sections = w.classes.flatMap((c) =>
    c.sections.map((s) => ({ ...s, grade: c.grade, subjects: c.subjects })),
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? '')
  const subjects = sections.find((s) => s.id === sectionId)?.subjects ?? []
  const [subjectId, setSubjectId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState<string | null>(null)
  const subject = (subjects.find((s) => s.id === subjectId) ?? subjects[0]) as
    (typeof subjects)[number] | undefined

  async function add() {
    setSaving(true)
    setError(null)
    setAdded(null)
    try {
      setW(
        await api<WizardState>(base, {
          body: {
            action: 'teacher',
            name,
            email,
            section_id: sectionId,
            school_subject_id: subject?.id,
          },
        }),
      )
      setAdded(name)
      setName('')
      setEmail('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="space-y-4">
      <h1 className="text-2xl font-bold">Who teaches at your school?</h1>
      {sections.length === 0 ? (
        <Notice>
          Add your classes first (go back one step), or skip this and add
          teachers later.
        </Notice>
      ) : (
        <>
          <p className="text-base text-slate-700">
            Add one teacher at a time. We send each of them a link to choose a
            password.
          </p>
          <TextInput
            label="Teacher’s name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label="Teacher’s e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
          <Select
            label="Which class and section?"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                Class {s.grade} · Section {s.name}
              </option>
            ))}
          </Select>
          <Select
            label="Which subject?"
            value={subject?.id ?? ''}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          {error ? <Notice kind="error">{error}</Notice> : null}
          {added ? <Notice kind="good">{added} was added.</Notice> : null}
          <Btn
            kind="plain"
            className="w-full"
            disabled={saving || !name || !email || !subject}
            onClick={() => void add()}
          >
            {saving ? 'Adding…' : 'Add this teacher'}
          </Btn>
        </>
      )}
      {w.teachers.length > 0 ? (
        <ul className="space-y-1 text-base" data-testid="wizard-teachers">
          {w.teachers.map((t) => (
            <li key={t.memberId}>
              <b>{t.name}</b> <span className="text-slate-600">{t.email}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <Nav
        busy={busy}
        onBack={onBack}
        onNext={onNext}
        onSkip={w.teachers.length === 0 ? onSkip : undefined}
        nextLabel={w.teachers.length > 0 ? 'Next' : 'Next'}
      />
    </Card>
  )
}

function StudentsScreen({
  w,
  schoolId,
  base,
  setW,
  busy,
  onBack,
  onNext,
  onSkip,
}: {
  w: WizardState
  schoolId: string
  base: string
  setW: (s: WizardState) => void
  busy: boolean
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Card className="space-y-4">
      <h1 className="text-2xl font-bold">Now your students</h1>
      <p className="text-base text-slate-700">
        Send us your list of students as an Excel or CSV file. We check it first
        and tell you what to fix. Nobody is added until you say so.
      </p>
      {!w.termsAccepted ? (
        <Notice>
          To add students, please accept the school terms first (go back one
          step).
        </Notice>
      ) : open ? (
        <UploadPanel
          schoolId={schoolId}
          kind="students"
          defaultYear={w.academicYear}
          onDone={async () => {
            setW(await api<WizardState>(base))
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      ) : (
        <Btn className="w-full" onClick={() => setOpen(true)}>
          Choose my student list
        </Btn>
      )}
      <p className="text-base font-semibold" data-testid="wizard-students">
        {w.studentCount === 0
          ? 'No students added yet.'
          : `${w.studentCount} students added.`}
      </p>
      <Nav
        busy={busy}
        onBack={onBack}
        onNext={onNext}
        onSkip={w.studentCount === 0 ? onSkip : undefined}
      />
    </Card>
  )
}

function DoneScreen({
  w,
  busy,
  onFinish,
  onBack,
}: {
  w: WizardState
  busy: boolean
  onFinish: () => void
  onBack?: () => void
}) {
  const items = [
    { ok: w.termsAccepted, text: 'School terms accepted' },
    {
      ok: w.classes.length > 0,
      text: `${w.classes.length} ${w.classes.length === 1 ? 'class' : 'classes'} added`,
    },
    {
      ok: w.teachers.length > 0,
      text: `${w.teachers.length} ${w.teachers.length === 1 ? 'teacher' : 'teachers'} added`,
    },
    { ok: w.studentCount > 0, text: `${w.studentCount} students added` },
  ]
  return (
    <Card className="space-y-4">
      <h1 className="text-2xl font-bold">You are ready</h1>
      <p className="text-base text-slate-700">
        Here is what we have. Anything you skipped can be done later from your
        home screen.
      </p>
      <ul className="space-y-2 text-base">
        {items.map((i) => (
          <li key={i.text} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`flex size-7 items-center justify-center rounded-full text-sm font-bold ${i.ok ? 'bg-emerald-700 text-white' : 'border border-slate-400 text-slate-600'}`}
            >
              {i.ok ? '✓' : '–'}
            </span>
            <span className={i.ok ? '' : 'text-slate-600'}>
              {i.ok ? i.text : `${i.text.replace(/^\d+ /, 'No ')} yet`}
            </span>
          </li>
        ))}
      </ul>
      <Nav
        busy={busy}
        onBack={onBack}
        onNext={onFinish}
        nextLabel="Go to my school"
      />
    </Card>
  )
}
