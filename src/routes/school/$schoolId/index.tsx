import { Link, createFileRoute } from '@tanstack/react-router'
import { useSchool } from '../../../components/school/context'
import { Card, Chip } from '../../../components/school/ui'

export const Route = createFileRoute('/school/$schoolId/')({
  component: SchoolHome,
})

function SchoolHome() {
  const { overview, schoolId } = useSchool()
  const o = overview

  if (o.role === 'student' || o.role === 'parent') {
    return (
      <Card>
        <h1 className="mb-2 text-2xl font-bold">Hello, {o.me.name}</h1>
        <p className="text-base text-slate-700">
          Your exams and results will show here when your school sets them up.
        </p>
      </Card>
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
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Your classes</h1>
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
              <b className="text-lg">{r.title}</b>
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
              className="mt-3 inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-4 text-base font-semibold"
            >
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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {o.role === 'principal' ? 'Your school' : 'Get your school ready'}
      </h1>
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat n={o.counts.classes} label="Classes" />
        <Stat n={o.counts.teachers} label="Teachers" />
        <Stat n={o.counts.students} label="Students" />
      </div>
      {o.role === 'school_admin' ? (
        <ol className="space-y-2">
          {steps.map((s, i) => (
            <li key={s.label}>
              <Link
                to={`/school/$schoolId/${s.to}` as '/school/$schoolId/terms'}
                params={{ schoolId }}
                className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 ${i === next ? 'border-emerald-700 bg-emerald-50' : 'border-slate-300 bg-white'}`}
              >
                <span
                  aria-hidden="true"
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-base font-bold ${s.done ? 'bg-emerald-700 text-white' : 'border border-slate-400 text-slate-700'}`}
                >
                  {s.done ? '✓' : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold">
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
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white py-3">
      <p className="text-2xl font-bold">{n}</p>
      <p className="text-sm text-slate-700">{label}</p>
    </div>
  )
}
