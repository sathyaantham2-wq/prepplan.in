import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../components/school/context'
import {
  BarChart3,
  Check,
  ChevronRight,
  FilePlus2,
  FileUp,
  LayoutGrid,
  ScanLine,
  UserRound,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Btn,
  Card,
  Chip,
  Loading,
  Notice,
  Stat,
  linkButton,
} from '../../../components/school/ui'
import { api } from '../../../lib/school-client'

export const Route = createFileRoute('/school/$schoolId/')({
  component: SchoolHome,
})

function SchoolHome() {
  const { overview, schoolId, reload } = useSchool()
  const navigate = useNavigate()
  const o = overview
  const [demoMsg, setDemoMsg] = useState<string | null>(null)
  const [demoBusy, setDemoBusy] = useState(false)

  // The school admin's first sign-in starts the setup wizard.
  const needsWizard =
    o.role === 'school_admin' && !o.wizardDone && !o.school.isDemo
  useEffect(() => {
    if (needsWizard)
      void navigate({
        to: '/school/$schoolId/welcome',
        params: { schoolId },
        replace: true,
      })
  }, [needsWizard, navigate, schoolId])
  if (needsWizard) return <Loading />

  async function resetDemo() {
    if (
      !window.confirm(
        'Reset the demo? The sample papers and results are put away and you can start again.',
      )
    )
      return
    setDemoBusy(true)
    try {
      await api(`/api/schools/${schoolId}/demo/reset`, { body: {} })
      setDemoMsg('The demo is reset. Make a new paper to start again.')
      await reload()
    } catch (e) {
      setDemoMsg(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setDemoBusy(false)
    }
  }

  // Only the parts the school chose (Settings): making papers, AI correction, or both.
  const usePapers = o.school.modules.includes('papers')
  const useCorrection = o.school.modules.includes('correction')
  const actions = [
    usePapers ? (
      <BigAction
        key="make"
        to="/school/$schoolId/exams/new"
        schoolId={schoolId}
        title="Make a paper"
        hint="Choose the chapters and a pattern. Get the paper and the answer key."
        icon={FilePlus2}
        lead
      />
    ) : null,
    useCorrection ? (
      <BigAction
        key="correct"
        to="/school/$schoolId/own-papers"
        schoolId={schoolId}
        title="Correct answer sheets"
        hint="Upload the question paper, then each student's answer sheets."
        icon={ScanLine}
        lead={!usePapers}
      />
    ) : null,
    <BigAction
      key="results"
      to="/school/$schoolId/results"
      schoolId={schoolId}
      title="See results"
      hint="Marks, strong topics and topics to fix for each student."
      icon={BarChart3}
    />,
  ].filter(Boolean)
  const bigActions = (
    <div className="space-y-3" data-testid="big-actions">
      <div
        className={`grid gap-3 ${actions.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
      >
        {actions}
      </div>
      {usePapers && !useCorrection ? (
        <Link
          to="/school/$schoolId/exams"
          params={{ schoolId }}
          className={`${linkButton.plain} w-full`}
        >
          <FileUp aria-hidden="true" className="size-5 text-emerald-700" />
          Your exam papers
        </Link>
      ) : null}
    </div>
  )
  const demoBox = o.school.isDemo ? (
    <Card className="space-y-2 border-amber-300! bg-amber-50!">
      <p className="font-display text-lg font-bold text-amber-950">
        This is the demo school
      </p>
      <p className="text-base text-amber-950">
        One Class 7 section with 30 invented students. Make a paper, open it,
        and press “Use sample answer sheets” to see sample results. Nothing here
        is real.
      </p>
      <p className="text-sm text-amber-950" data-testid="demo-cap">
        AI spend cap for this demo: ₹{o.school.aiSpendCapInr ?? 0}. The sample
        results use none of it.
      </p>
      {demoMsg ? <Notice kind="good">{demoMsg}</Notice> : null}
      <Btn
        kind="plain"
        className="w-full"
        disabled={demoBusy}
        onClick={() => void resetDemo()}
      >
        {demoBusy ? 'Resetting…' : 'Reset demo'}
      </Btn>
    </Card>
  ) : null

  if (o.role === 'student' || o.role === 'parent') {
    return (
      <div className="space-y-4">
        <Welcome name={o.me.name} school={o.school.name} />
        <Card>
          <h1 className="mb-2 text-2xl font-bold">Hello, {o.me.name}</h1>
          <p className="text-base text-slate-700">
            Your exams and results will show here when your school sets them up.
          </p>
        </Card>
      </div>
    )
  }

  if (o.role === 'teacher') {
    const rows = o.classes.flatMap((c) =>
      c.sections.map((s) => ({
        key: s.id,
        title: `Class ${c.grade} · Section ${s.name}`,
        count: s.studentCount,
        isClassTeacher:
          s.classTeacherMemberId !== null &&
          s.classTeacherMemberId === o.me.memberId,
        subjects: o.assignments
          .filter((a) => a.sectionId === s.id && a.memberId === o.me.memberId)
          .map((a) => c.subjects.find((x) => x.id === a.schoolSubjectId)?.name)
          .filter((n): n is string => !!n),
      })),
    )
    return (
      <div className="space-y-5">
        <Welcome name={o.me.name} school={o.school.name} />
        {demoBox}
        {bigActions}
        <h2 className="pt-2 text-xl font-bold">Your classes</h2>
        {rows.length === 0 ? (
          <Card>
            <p className="text-base">
              You have no classes yet. The school office will add you.
            </p>
          </Card>
        ) : null}
        {rows.map((r) => (
          <Card key={r.key}>
            <div className="flex flex-wrap items-center gap-2">
              <b className="font-display text-lg">{r.title}</b>
              {r.isClassTeacher ? (
                <Chip tone="good">You are the class teacher</Chip>
              ) : null}
            </div>
            <p className="mt-1 text-base text-slate-700">
              {r.count} {r.count === 1 ? 'student' : 'students'}
              {r.subjects.length ? ` · You teach ${r.subjects.join(', ')}` : ''}
            </p>
            <Link
              to="/school/$schoolId/students"
              params={{ schoolId }}
              search={{ section: r.key }}
              className={`${linkButton.plain} mt-4`}
            >
              <Users aria-hidden="true" className="size-5 text-slate-500" />
              See students
            </Link>
          </Card>
        ))}
      </div>
    )
  }

  const hasClasses = o.classes.length > 0
  const hasSections = o.classes.some((c) => c.sections.length > 0)
  const hasSubjects = o.classes.some((c) => c.subjects.length > 0)
  const hasTeachers = o.counts.teachers > 0
  const hasClassTeachers = o.classes.some((c) =>
    c.sections.some((s) => s.classTeacherMemberId),
  )
  const hasAssignments = o.assignments.length > 0
  const hasStudents = o.counts.students > 0
  const steps: Array<{
    done: boolean
    label: string
    to: string
    hint?: string
    show?: boolean
  }> = [
    {
      done: o.termsAccepted,
      label: 'Accept the PrepPlan school terms',
      to: 'terms',
      hint: 'Needed before you add students.',
    },
    {
      done: hasClasses && hasSections,
      label: 'Add your classes and sections',
      to: 'classes',
    },
    {
      done: hasSubjects,
      label: 'Choose the subjects for each class',
      to: 'classes',
    },
    { done: hasTeachers, label: 'Add your teachers', to: 'teachers' },
    {
      done: hasClassTeachers && hasAssignments,
      label: 'Choose class teachers and who teaches what',
      to: 'classes',
    },
    { done: hasStudents, label: 'Add your students', to: 'students' },
    {
      done: false,
      label: 'Print sign-in slips for each class',
      to: 'students',
      hint: 'Each class teacher can also do this.',
    },
  ]
  const next = steps.findIndex((s) => !s.done)
  const doneCount = steps.filter((s) => s.done).length

  return (
    <div className="space-y-5">
      <Welcome name={o.me.name} school={o.school.name} />
      {demoBox}
      {o.role === 'school_admin' ? bigActions : null}
      <h2 className="pt-2 text-xl font-bold">
        {o.role === 'principal' ? 'Your school' : 'Your school set-up'}
      </h2>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat
          n={o.counts.classes}
          label="Classes"
          icon={<LayoutGrid className="size-4" />}
        />
        <Stat
          n={o.counts.teachers}
          label="Teachers"
          icon={<UserRound className="size-4" />}
        />
        <Stat
          n={o.counts.students}
          label="Students"
          icon={<Users className="size-4" />}
        />
      </div>
      {o.role === 'school_admin' ? (
        <Card className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-display text-base font-bold">
                Getting your school ready
              </p>
              <p className="text-sm font-semibold text-slate-600 tabular-nums">
                {doneCount} of {steps.length} done
              </p>
            </div>
            <div
              aria-hidden="true"
              className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all"
                style={{ width: `${(doneCount / steps.length) * 100}%` }}
              />
            </div>
          </div>
          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={s.label}>
                <Link
                  to={`/school/$schoolId/${s.to}` as '/school/$schoolId/terms'}
                  params={{ schoolId }}
                  className={`group flex min-h-14 items-center gap-3 rounded-xl border px-3.5 py-3 text-slate-900! transition-colors ${i === next ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${s.done ? 'bg-emerald-600 text-white' : i === next ? 'bg-white text-emerald-800 ring-2 ring-emerald-600' : 'bg-white text-slate-500 ring-1 ring-slate-300'}`}
                  >
                    {s.done ? (
                      <Check className="size-4" strokeWidth={3} />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-base font-semibold ${s.done ? 'text-slate-500' : ''}`}
                    >
                      {s.label}
                    </span>
                    {s.hint ? (
                      <span className="block text-sm text-slate-600">
                        {s.hint}
                      </span>
                    ) : null}
                  </span>
                  <span className="sr-only">
                    {s.done ? 'Done' : 'Not done yet'}
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-5 shrink-0 text-slate-400 group-hover:text-slate-600"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}
    </div>
  )
}

function greeting(): string {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function Welcome({ name, school }: { name: string; school: string }) {
  const first = name.split(/\s+/)[0] || name
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 px-5 py-6 text-white shadow-lg shadow-emerald-900/20 sm:px-7 sm:py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 left-1/3 size-56 rounded-full bg-teal-400/20 blur-3xl"
      />
      <p className="relative text-sm font-semibold tracking-wide text-emerald-100/90 uppercase">
        {school}
      </p>
      <p className="font-display relative mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
        {greeting()}, {first}
      </p>
    </div>
  )
}

function BigAction({
  to,
  schoolId,
  title,
  hint,
  icon: Icon,
  lead = false,
}: {
  to:
    | '/school/$schoolId/exams/new'
    | '/school/$schoolId/own-papers'
    | '/school/$schoolId/results'
  schoolId: string
  title: string
  hint: string
  icon: LucideIcon
  lead?: boolean
}) {
  return (
    <Link
      to={to}
      params={{ schoolId }}
      className={`group flex min-h-24 items-center gap-4 rounded-2xl border p-4 transition-all sm:flex-col sm:items-start sm:gap-3 sm:p-5 ${lead ? 'border-emerald-700 bg-emerald-700 text-white! shadow-md shadow-emerald-900/20 hover:bg-emerald-800' : 'border-slate-200 bg-white text-slate-900! shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)] hover:border-emerald-300 hover:shadow-md'}`}
    >
      <span
        aria-hidden="true"
        className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${lead ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-700'}`}
      >
        <Icon className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-display block text-lg leading-snug font-bold">
          {title}
        </span>
        <span
          className={`mt-0.5 block text-[15px] leading-snug ${lead ? 'text-emerald-50/90' : 'text-slate-600'}`}
        >
          {hint}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className={`size-5 shrink-0 transition-transform group-hover:translate-x-0.5 sm:hidden ${lead ? 'text-white/80' : 'text-slate-400'}`}
      />
    </Link>
  )
}
