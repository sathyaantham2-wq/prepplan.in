import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  BarChart3,
  Check,
  ChevronRight,
  FilePlus2,
  ScanLine,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useSchool } from '../../../components/school/context'
import { InfoTip, useShell } from '../../../components/school/kit'
import {
  Btn,
  Card,
  Chip,
  Loading,
  Notice,
  PageHeader,
  linkButton,
} from '../../../components/school/ui'
import { api } from '../../../lib/school-client'
import type { SchoolOverview } from '../../../lib/school-client'
import type { RecentPaper, TodayItem, schoolToday } from '../../../lib/schools/today'

export const Route = createFileRoute('/school/$schoolId/')({
  component: SchoolHome,
})

type Today = Awaited<ReturnType<typeof schoolToday>>

// Home (UI redesign plan, section 5): a greeting with one main button, what is waiting today, the set-up checklist
// until it is done, the main actions the school turned on, a slim row of figures and the recent papers.
function SchoolHome() {
  const { overview: o, schoolId, reload } = useSchool()
  const navigate = useNavigate()
  const { confirm, toast } = useShell()
  const [demoMsg, setDemoMsg] = useState<string | null>(null)
  const [demoBusy, setDemoBusy] = useState(false)
  const [today, setToday] = useState<Today | null>(null)
  const staff = o.role === 'school_admin' || o.role === 'principal' || o.role === 'teacher'

  // The school admin's first sign-in starts the setup wizard.
  const needsWizard = o.role === 'school_admin' && !o.wizardDone
  useEffect(() => {
    if (needsWizard)
      void navigate({ to: '/school/$schoolId/welcome', params: { schoolId }, replace: true })
  }, [needsWizard, navigate, schoolId])
  useEffect(() => {
    if (!staff || needsWizard) return
    api<Today>(`/api/schools/${schoolId}/today`).then(setToday, () => setToday(null))
  }, [schoolId, staff, needsWizard])
  if (needsWizard) return <Loading />

  async function resetDemo() {
    if (
      !(await confirm({
        title: 'Reset the demo?',
        body: 'The sample papers and results are put away and you can start again.',
        confirmLabel: 'Reset demo',
        danger: true,
      }))
    )
      return
    setDemoBusy(true)
    try {
      await api(`/api/schools/${schoolId}/demo/reset`, { body: {} })
      setDemoMsg('The demo is reset. Make a new paper to start again.')
      toast('Demo reset')
      await reload()
    } catch (e) {
      setDemoMsg(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setDemoBusy(false)
    }
  }

  const first = o.me.name.split(/\s+/)[0] || o.me.name
  const usePapers = o.school.modules.includes('papers')
  const useCorrection = o.school.modules.includes('correction')

  if (o.role === 'student' || o.role === 'parent') {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <PageHeader title={`${greeting()}, ${first}`} help={o.school.name} />
        <Card>
          <h2 className="mb-2 text-xl font-bold">Hello, {o.me.name}</h2>
          <p className="text-base text-slate-700">Your exams and results will show here when your school sets them up.</p>
          {o.role === 'student' ? (
            <Link to="/school/$schoolId/my-results" params={{ schoolId: o.school.id }} className={`${linkButton.primary} mt-4`}>
              My results
            </Link>
          ) : null}
        </Card>
      </div>
    )
  }

  const steps = setupSteps(o)
  const doneCount = steps.filter((s) => s.done).length
  // set-up is finished once the first six steps are done (printing the slips is a reminder, not a gate)
  const setupLeft = o.role === 'school_admin' && steps.slice(0, 6).some((s) => !s.done)
  const nextStep = steps.find((s) => !s.done)
  const primary =
    o.role === 'school_admin' && nextStep && nextStep.to !== 'students' && doneCount < 6 ? (
      <Link to={`/school/$schoolId/${nextStep.to}` as '/school/$schoolId/terms'} params={{ schoolId }} className={linkButton.primary}>
        Next: {nextStep.short}
      </Link>
    ) : usePapers && o.role !== 'principal' ? (
      <Link to="/school/$schoolId/exams/new" params={{ schoolId }} className={linkButton.primary}>
        <FilePlus2 aria-hidden="true" className="size-5" /> Make a paper
      </Link>
    ) : null

  const actions = [
    usePapers && o.role !== 'principal' ? (
      <ActionCard key="make" to="/school/$schoolId/exams/new" schoolId={schoolId} title="Make a paper" hint="Choose the chapters and a pattern. Get the paper and the answer key." icon={FilePlus2} cta="Start" />
    ) : null,
    useCorrection && o.role !== 'principal' ? (
      <ActionCard key="correct" to="/school/$schoolId/own-papers" schoolId={schoolId} title="Correct answer sheets" hint="Upload the question paper, then each student's answer sheets. The AI marks them; your teachers check." icon={ScanLine} cta="Open" />
    ) : null,
    o.role !== 'principal' ? (
      <ActionCard key="results" to="/school/$schoolId/results" schoolId={schoolId} title="See results" hint="Marks, strong topics and topics to fix for each student." icon={BarChart3} cta="View" />
    ) : null,
  ].filter(Boolean)

  const demoBox = o.school.isDemo ? (
    <Card className="space-y-2 border-amber-300! bg-amber-50!">
      <p className="text-lg font-bold text-amber-950">This is a demo school</p>
      <p className="text-base text-amber-950">
        Make a paper, open it, and press “Use sample answer sheets” to see sample results. To use PrepPlan for real, write to
        support@prepplan.in; we switch your school on after a check.
      </p>
      <p className="text-sm text-amber-950" data-testid="demo-cap">
        AI spend cap for this demo: ₹{o.school.aiSpendCapInr ?? 0}. The sample results use none of it.
      </p>
      {demoMsg ? <Notice kind="good">{demoMsg}</Notice> : null}
      <Btn kind="plain" disabled={demoBusy} onClick={() => void resetDemo()}>
        {demoBusy ? 'Resetting…' : 'Reset demo'}
      </Btn>
    </Card>
  ) : null

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting()}, ${first}`}
        help={o.role === 'principal' ? `How ${o.school.name} is doing today.` : `Here is what needs you today at ${o.school.name}.`}
        primary={primary}
      />
      {demoBox}
      <div className="grid items-start gap-5 xl:grid-cols-12">
        <div className={setupLeft ? 'xl:col-span-7' : 'xl:col-span-12'}>
          <TodayPanel today={today} schoolId={schoolId} role={o.role} />
        </div>
        {setupLeft ? (
          <div className="xl:col-span-5">
            <SetupCard steps={steps} doneCount={doneCount} schoolId={schoolId} />
          </div>
        ) : null}
      </div>
      {actions.length ? (
        <div className="space-y-3" data-testid="big-actions">
          <div className={`grid gap-4 ${actions.length === 3 ? 'md:grid-cols-3' : actions.length === 2 ? 'md:grid-cols-2' : ''}`}>{actions}</div>
        </div>
      ) : null}
      {o.role === 'teacher' ? <TeacherClasses o={o} schoolId={schoolId} /> : null}
      <section aria-label="Your school in numbers">
        <dl className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-4">
          <Figure n={o.counts.classes} label="Classes" />
          <Figure n={o.counts.teachers} label="Teachers" />
          <Figure n={o.counts.students} label="Students" />
          <Figure n={today?.examsThisYear ?? '–'} label="Exams this school year" />
        </dl>
      </section>
      <RecentPapers recent={today?.recent ?? null} schoolId={schoolId} />
    </div>
  )
}

function greeting(): string {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

// ---------------------------------------------------------------- today

const TODAY_TEXT: Record<TodayItem['kind'], (i: TodayItem) => { title: string; detail: string; button: string; tone: string }> = {
  to_check: (i) => ({
    title: `${i.count} answer${i.count === 1 ? '' : 's'} to check`,
    detail: `${i.paperTitle ?? ''} · the AI was not sure`,
    button: 'Check now',
    tone: 'bg-amber-600',
  }),
  window_closing: (i) => ({
    title: `Question window closes ${closesIn(i.closesAt)}`,
    detail: `${i.paperTitle ?? ''} · students can still ask about a mark`,
    button: 'See questions',
    tone: 'bg-amber-600',
  }),
  no_sheets: (i) => ({
    title: `${i.count} student${i.count === 1 ? ' has' : 's have'} no answer sheets yet`,
    detail: i.paperTitle ?? '',
    button: 'Upload sheets',
    tone: 'bg-sky-600',
  }),
  not_sent: (i) => ({
    title: `${i.count} parent message${i.count === 1 ? '' : 's'} not sent`,
    detail: 'In the last 7 days',
    button: 'Open messages',
    tone: 'bg-red-600',
  }),
}

function closesIn(iso: string | null): string {
  if (!iso) return 'soon'
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
  return days <= 1 ? 'within a day' : `in ${days} days`
}

function TodayPanel({ today, schoolId, role }: { today: Today | null; schoolId: string; role: SchoolOverview['role'] }) {
  return (
    <Card data-testid="today">
      <div className="flex items-center gap-1">
        <h2 className="text-lg font-bold">Today</h2>
        <InfoTip>Things waiting for someone at your school. Each one has a button that takes you straight there.</InfoTip>
      </div>
      {today === null ? (
        <p className="mt-2 text-[15px] text-slate-600">Looking…</p>
      ) : today.items.length === 0 ? (
        <p className="mt-2 text-[15px] text-slate-700" data-testid="today-clear">
          Nothing is waiting. You are all caught up.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-slate-200">
          {today.items.map((i) => {
            const t = TODAY_TEXT[i.kind](i)
            return (
              <li key={`${i.kind}-${i.paperId ?? ''}`} className="flex flex-wrap items-center gap-3 py-3" data-testid={`today-${i.kind}`}>
                <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${t.tone}`} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-slate-900">{t.title}</span>
                  <span className="block text-sm text-slate-600">{t.detail}</span>
                </span>
                <TodayButton item={i} schoolId={schoolId} role={role} label={t.button} />
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

function TodayButton({ item, schoolId, role, label }: { item: TodayItem; schoolId: string; role: SchoolOverview['role']; label: string }) {
  const cls = `${linkButton.plain} min-h-10! shrink-0`
  if (item.kind === 'not_sent')
    return (
      <Link to="/school/$schoolId/messages" params={{ schoolId }} className={cls}>
        {label}
      </Link>
    )
  // the principal reads correction through the exam-week board; staff go to the paper itself
  if (role === 'principal' || !item.paperId)
    return (
      <Link to="/school/$schoolId/board" params={{ schoolId }} className={cls}>
        {label}
      </Link>
    )
  return (
    <Link to="/school/$schoolId/own-papers/$paperId" params={{ schoolId, paperId: item.paperId }} className={cls}>
      {label}
    </Link>
  )
}

// ---------------------------------------------------------------- set-up checklist

interface Step {
  done: boolean
  label: string
  short: string
  to: string
  hint?: string
}

function setupSteps(o: SchoolOverview): Array<Step> {
  const hasClasses = o.classes.length > 0
  const hasSections = o.classes.some((c) => c.sections.length > 0)
  const hasSubjects = o.classes.some((c) => c.subjects.length > 0)
  const hasClassTeachers = o.classes.some((c) => c.sections.some((s) => s.classTeacherMemberId))
  return [
    { done: o.termsAccepted, label: 'Accept the PrepPlan school terms', short: 'accept the terms', to: 'terms', hint: 'Needed before you add students.' },
    { done: hasClasses && hasSections, label: 'Add your classes and sections', short: 'add classes', to: 'classes' },
    { done: hasSubjects, label: 'Choose the subjects for each class', short: 'choose subjects', to: 'classes' },
    { done: o.counts.teachers > 0, label: 'Add your teachers', short: 'add teachers', to: 'teachers' },
    { done: hasClassTeachers && o.assignments.length > 0, label: 'Choose class teachers and who teaches what', short: 'choose who teaches what', to: 'classes' },
    { done: o.counts.students > 0, label: 'Add your students', short: 'add students', to: 'students' },
    { done: false, label: 'Print sign-in slips for each class', short: 'print sign-in slips', to: 'students', hint: 'Each class teacher can also do this.' },
  ]
}

function SetupCard({ steps, doneCount, schoolId }: { steps: Array<Step>; doneCount: number; schoolId: string }) {
  const next = steps.findIndex((s) => !s.done)
  return (
    <Card className="space-y-3" data-testid="setup">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold">Your school set-up</h2>
        <p className="text-sm font-semibold text-slate-600 tabular-nums">
          {doneCount} of {steps.length} done
        </p>
      </div>
      <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-700" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
      </div>
      <ol className="space-y-1">
        {steps.map((s, i) => (
          <li key={s.label}>
            <Link
              to={`/school/$schoolId/${s.to}` as '/school/$schoolId/terms'}
              params={{ schoolId }}
              className={`group flex min-h-11 items-center gap-3 rounded-lg px-2 py-1.5 text-slate-900! hover:bg-slate-50 ${i === next ? 'bg-emerald-50' : ''}`}
            >
              <span
                aria-hidden="true"
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.done ? 'bg-emerald-700 text-white' : i === next ? 'border-2 border-emerald-700 text-emerald-800' : 'border border-slate-400 text-slate-600'}`}
              >
                {s.done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-[15px] ${i === next ? 'font-semibold' : ''} ${s.done ? 'text-slate-600' : ''}`}>{s.label}</span>
                {s.hint && !s.done ? <span className="block text-sm text-slate-600">{s.hint}</span> : null}
              </span>
              <span className="sr-only">{s.done ? 'Done' : 'Not done yet'}</span>
              <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-slate-500" />
            </Link>
          </li>
        ))}
      </ol>
    </Card>
  )
}

// ---------------------------------------------------------------- the rest

function ActionCard({
  to,
  schoolId,
  title,
  hint,
  icon: Icon,
  cta,
}: {
  to: '/school/$schoolId/exams/new' | '/school/$schoolId/own-papers' | '/school/$schoolId/results'
  schoolId: string
  title: string
  hint: string
  icon: LucideIcon
  cta: string
}) {
  return (
    <Link
      to={to}
      params={{ schoolId }}
      className="group flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 text-slate-900! transition-colors hover:border-emerald-700"
    >
      <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
        <Icon className="size-5" />
      </span>
      <span className="text-base font-bold">{title}</span>
      <span className="text-[15px] text-slate-600">{hint}</span>
      <span className="mt-1 inline-flex items-center gap-1 text-[15px] font-semibold text-emerald-800">
        {cta} <ChevronRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

function Figure({ n, label }: { n: number | string; label: string }) {
  return (
    <div className="border-slate-200 px-5 py-4 not-first:border-l max-sm:nth-3:border-l-0 max-sm:nth-[n+3]:border-t">
      <dt className="text-sm text-slate-600">{label}</dt>
      <dd className="text-2xl font-bold text-slate-900 tabular-nums">{n}</dd>
    </div>
  )
}

const STATE: Record<RecentPaper['state'], { text: string; tone: 'plain' | 'good' | 'wait' | 'bad' }> = {
  to_check: { text: 'Answers to check', tone: 'wait' },
  uploading: { text: 'Sheets coming in', tone: 'plain' },
  results_out: { text: 'Results out', tone: 'good' },
  ready: { text: 'Ready', tone: 'plain' },
}

function RecentPapers({ recent, schoolId }: { recent: Array<RecentPaper> | null; schoolId: string }) {
  if (!recent || recent.length === 0) return null
  return (
    <Card data-testid="recent-papers">
      <h2 className="mb-2 text-lg font-bold">Recent exams</h2>
      <ul className="divide-y divide-slate-200">
        {recent.map((r) => (
          <li key={r.id}>
            <Link
              to={r.kind === 'made' ? '/school/$schoolId/exams/$examId' : '/school/$schoolId/own-papers/$paperId'}
              params={r.kind === 'made' ? { schoolId, examId: r.id } : { schoolId, paperId: r.id }}
              className="flex flex-wrap items-center gap-3 py-3 text-slate-900! hover:bg-slate-50"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">{r.title}</span>
                <span className="block text-sm text-slate-600">
                  Class {r.grade} · {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </span>
              <Chip tone={STATE[r.state].tone}>{r.state === 'to_check' ? `${r.toCheck} to check` : STATE[r.state].text}</Chip>
              <ChevronRight aria-hidden="true" className="size-4 text-slate-500" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function TeacherClasses({ o, schoolId }: { o: SchoolOverview; schoolId: string }) {
  const rows = o.classes.flatMap((c) =>
    c.sections.map((s) => ({
      key: s.id,
      title: `Class ${c.grade} · Section ${s.name}`,
      count: s.studentCount,
      isClassTeacher: s.classTeacherMemberId !== null && s.classTeacherMemberId === o.me.memberId,
      subjects: o.assignments
        .filter((a) => a.sectionId === s.id && a.memberId === o.me.memberId)
        .map((a) => c.subjects.find((x) => x.id === a.schoolSubjectId)?.name)
        .filter((n): n is string => !!n),
    })),
  )
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold">Your classes</h2>
      {rows.length === 0 ? (
        <Card>
          <p className="text-base">You have no classes yet. The school office will add you.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <Card key={r.key}>
              <div className="flex flex-wrap items-center gap-2">
                <b className="text-base">{r.title}</b>
                {r.isClassTeacher ? <Chip tone="good">You are the class teacher</Chip> : null}
              </div>
              <p className="mt-1 text-[15px] text-slate-700">
                {r.count} {r.count === 1 ? 'student' : 'students'}
                {r.subjects.length ? ` · You teach ${r.subjects.join(', ')}` : ''}
              </p>
              <Link to="/school/$schoolId/students" params={{ schoolId }} search={{ section: r.key }} className={`${linkButton.plain} mt-3`}>
                See students
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
