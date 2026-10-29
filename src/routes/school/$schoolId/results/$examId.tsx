import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSchool } from '../../../../components/school/context'
import { Btn, Card, Chip, Notice } from '../../../../components/school/ui'
import { api } from '../../../../lib/school-client'
import { DEMO_LABEL, HABITS } from '../../../../lib/schools/demo-results'
import type {
  DemoResults,
  StudentReport,
} from '../../../../lib/schools/demo-results'

export const Route = createFileRoute('/school/$schoolId/results/$examId')({
  validateSearch: (s: Record<string, unknown>) => ({
    student: typeof s.student === 'string' ? s.student : undefined,
  }),
  component: Results,
})

function Results() {
  const { schoolId } = useSchool()
  const { examId } = Route.useParams()
  const { student } = Route.useSearch()
  const [r, setR] = useState<DemoResults | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    void api<DemoResults>(`/api/schools/${schoolId}/results/${examId}`).then(
      setR,
      (e: unknown) =>
        setError(e instanceof Error ? e.message : 'Something went wrong.'),
    )
  }, [schoolId, examId])
  if (error) return <Notice kind="error">{error}</Notice>
  if (!r) return <p className="text-base text-slate-700">Loading…</p>
  const one = student
    ? r.students.find((s) => s.studentId === student)
    : undefined
  return one ? (
    <Report r={r} s={one} schoolId={schoolId} examId={examId} />
  ) : (
    <ClassView r={r} schoolId={schoolId} examId={examId} />
  )
}

const DemoTag = () => <Chip tone="wait">{DEMO_LABEL}</Chip>

/** Two bars side by side: what was lost to not knowing, and what was lost to a writing habit. */
function LostBar({ gap, habit }: { gap: number; habit: number }) {
  const total = gap + habit
  if (total === 0)
    return <p className="text-base text-slate-700">No marks lost.</p>
  return (
    <div className="space-y-2">
      <div
        className="flex h-5 overflow-hidden rounded-full bg-slate-200"
        role="img"
        aria-label={`${gap} marks lost to topics not learnt, ${habit} marks lost to writing habits`}
      >
        <div
          className="bg-rose-700"
          style={{ width: `${(gap / total) * 100}%` }}
        />
        <div
          className="bg-amber-500"
          style={{ width: `${(habit / total) * 100}%` }}
        />
      </div>
      <p className="flex flex-wrap gap-x-4 text-base">
        <span>
          <span
            aria-hidden="true"
            className="mr-1.5 inline-block size-3 rounded-full bg-rose-700"
          />
          Not learnt yet: <b>{gap}</b>
        </span>
        <span>
          <span
            aria-hidden="true"
            className="mr-1.5 inline-block size-3 rounded-full bg-amber-500"
          />
          Writing habit: <b>{habit}</b>
        </span>
      </p>
    </div>
  )
}

function ClassView({
  r,
  schoolId,
  examId,
}: {
  r: DemoResults
  schoolId: string
  examId: string
}) {
  const c = r.classSummary
  const lostGap = r.students.reduce((n, s) => n + s.lostToGap, 0)
  const lostHabit = r.students.reduce((n, s) => n + s.lostToHabit, 0)
  const shade = ['bg-white', 'bg-amber-100', 'bg-amber-300', 'bg-rose-400']
  return (
    <div className="space-y-4" data-testid="class-results">
      <div className="space-y-1">
        <Link
          to="/school/$schoolId/results"
          params={{ schoolId }}
          className="inline-flex min-h-11 items-center text-base font-semibold text-emerald-900 underline"
        >
          All results
        </Link>
        <h1 className="text-2xl font-bold">{r.examTitle}</h1>
        <DemoTag />
      </div>

      <Card className="space-y-3">
        <h2 className="text-lg font-bold">How the class did</h2>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Num n={`${c.average}%`} label="Average" />
          <Num n={`${c.highest}%`} label="Highest" />
          <Num n={`${c.lowest}%`} label="Lowest" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-base">
          {c.buckets.map((b) => (
            <div
              key={b.label}
              className="rounded-lg border border-slate-300 py-2"
            >
              <b className="text-lg">{b.students}</b>{' '}
              <span className="text-slate-700">{b.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-bold">Where the marks were lost</h2>
        <LostBar gap={lostGap} habit={lostHabit} />
        <p className="text-base text-slate-700">
          About {c.lostToGapShare}% of the lost marks are topics not learnt yet.
          The rest are writing habits, which are quicker to fix.
        </p>
      </Card>

      <Card className="space-y-2" data-testid="topics-to-fix">
        <h2 className="text-lg font-bold">Topics to teach again</h2>
        <ul className="space-y-1 text-base">
          {c.topFixTopics.map((t) => (
            <li key={t.topic}>
              <b>{t.topic}</b>{' '}
              <span className="text-slate-700">
                · {t.students} students need it
              </span>
            </li>
          ))}
          {c.topFixTopics.length === 0 ? <li>Nothing stands out.</li> : null}
        </ul>
      </Card>

      <Card className="space-y-3" data-testid="heatmap">
        <h2 className="text-lg font-bold">Writing habits: the whole class</h2>
        <p className="text-base text-slate-700">
          Darker means the habit cost that student more answers.
        </p>
        <div className="-mx-1 overflow-x-auto px-1">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="py-1 pr-2 text-left font-semibold">Student</th>
                {r.heatmap.habits.map((h) => (
                  <th
                    key={h.key}
                    className="px-0.5 py-1 text-center text-xs leading-tight font-semibold"
                    scope="col"
                  >
                    {h.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.heatmap.rows.map((row) => (
                <tr key={row.studentId}>
                  <th
                    scope="row"
                    className="max-w-28 truncate py-0.5 pr-2 text-left text-sm font-normal"
                  >
                    {row.name.split(' ')[0]}
                  </th>
                  {row.levels.map((l, i) => (
                    <td key={i} className="p-0.5">
                      <div
                        className={`h-6 rounded ${shade[l]} border border-slate-200`}
                        aria-label={`${r.heatmap.habits[i].label}: ${['none', 'a little', 'some', 'a lot'][l]}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="space-y-1 text-sm text-slate-700">
          {c.topHabits.map((h) => (
            <li key={h.key}>
              <b>{h.label}</b>: {h.students} students
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-3" data-testid="flags">
        <h2 className="text-lg font-bold">
          Answers for a teacher to check ({r.flags.length})
        </h2>
        <ul className="space-y-2">
          {r.flags.map((f) => (
            <li
              key={f.id}
              className="rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-base text-amber-950"
            >
              <b>{f.studentName.split(' ')[0]}</b>, question {f.position} (
              {f.topic})
              <br />
              {f.reason} The sample marker suggests {f.suggested} out of{' '}
              {f.outOf}.
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-2" data-testid="student-list">
        <h2 className="text-lg font-bold">Every student</h2>
        <ul className="space-y-2">
          {r.students.map((s) => (
            <li key={s.studentId}>
              <Link
                to="/school/$schoolId/results/$examId"
                params={{ schoolId, examId }}
                search={{ student: s.studentId }}
                className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-slate-300 px-3 py-2"
              >
                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold">
                    {s.name}
                  </span>
                  <span className="block text-sm text-slate-600">
                    Roll {s.roll} · not learnt {s.lostToGap} · habit{' '}
                    {s.lostToHabit}
                  </span>
                </span>
                <span className="shrink-0 text-lg font-bold">
                  {s.got}/{s.outOf}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Num({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white py-2">
      <p className="text-2xl font-bold">{n}</p>
      <p className="text-sm text-slate-700">{label}</p>
    </div>
  )
}

function Report({
  r,
  s,
  schoolId,
  examId,
}: {
  r: DemoResults
  s: StudentReport
  schoolId: string
  examId: string
}) {
  const navigate = useNavigate()
  const habitLines = HABITS.filter((h) => (s.habits[h.key] ?? 0) > 0)
  return (
    <div className="space-y-4" data-testid="student-report">
      <Btn
        kind="plain"
        onClick={() =>
          void navigate({
            to: '/school/$schoolId/results/$examId',
            params: { schoolId, examId },
            search: { student: undefined },
          })
        }
      >
        Back to the class
      </Btn>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{s.name}</h1>
        <p className="text-base text-slate-700">
          {r.examTitle} · Roll {s.roll}
        </p>
        <DemoTag />
      </div>
      <Card className="space-y-3">
        <p className="text-4xl font-bold">
          {s.got}{' '}
          <span className="text-2xl font-semibold text-slate-600">
            out of {s.outOf}
          </span>
        </p>
        <p className="text-base">{s.summary}</p>
        <LostBar gap={s.lostToGap} habit={s.lostToHabit} />
      </Card>
      <Card className="space-y-2" data-testid="strengths">
        <h2 className="text-lg font-bold">Strong topics</h2>
        <ul className="space-y-1 text-base">
          {s.strengths.map((t) => (
            <li key={t.topic}>
              <b>{t.topic}</b>{' '}
              <span className="text-slate-700">
                · {t.percent}% of the marks
              </span>
            </li>
          ))}
          {s.strengths.length === 0 ? (
            <li>No topic is above 75% yet.</li>
          ) : null}
        </ul>
      </Card>
      <Card className="space-y-3" data-testid="to-fix">
        <h2 className="text-lg font-bold">Topics to fix</h2>
        {s.toFix.map((t) => (
          <div
            key={t.topic}
            className="space-y-1 rounded-lg border border-slate-300 p-3"
          >
            <p className="flex flex-wrap items-center gap-2 text-base font-bold">
              {t.topic}
              <Chip tone={t.why === 'gap' ? 'wait' : 'plain'}>
                {t.why === 'gap' ? 'Not learnt yet' : 'Writing habit'}
              </Chip>
            </p>
            <p className="text-base text-slate-700">{t.note}</p>
          </div>
        ))}
        {s.toFix.length === 0 ? (
          <p className="text-base">Nothing to fix.</p>
        ) : null}
      </Card>
      {habitLines.length > 0 ? (
        <Card className="space-y-2" data-testid="habits">
          <h2 className="text-lg font-bold">Writing habits to work on</h2>
          <ul className="space-y-2 text-base">
            {habitLines.map((h) => (
              <li key={h.key}>
                <b>{h.label}</b>{' '}
                <span className="text-slate-700">
                  · {s.habits[h.key]}{' '}
                  {s.habits[h.key] === 1 ? 'answer' : 'answers'}
                </span>
                <br />
                <span className="text-slate-700">{h.tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      <Card className="space-y-2">
        <h2 className="text-lg font-bold">Question by question</h2>
        <ul className="space-y-1">
          {s.questions.map((q) => (
            <li
              key={q.position}
              className="flex items-center justify-between gap-2 border-b border-slate-200 py-1.5 text-base"
            >
              <span className="min-w-0 truncate">
                Q{q.position} <span className="text-slate-600">{q.topic}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <b>
                  {q.got}/{q.outOf}
                </b>
                {q.cause === 'gap' ? (
                  <Chip tone="wait">Not learnt</Chip>
                ) : q.cause === 'habit' ? (
                  <Chip>Habit</Chip>
                ) : (
                  <Chip tone="good">Full</Chip>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
