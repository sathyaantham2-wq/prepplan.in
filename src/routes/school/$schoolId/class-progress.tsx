import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { useSchool } from '../../../components/school/context'
import { Card, Chip, EmptyState, Loading, Notice, PageHeader, Select } from '../../../components/school/ui'
import { api } from '../../../lib/school-client'
import { HABIT_CODES } from '../../../lib/schools/marking-logic'
import { HABIT_LABEL } from '../../../lib/schools/progress-calc'
import type { classProgress } from '../../../lib/schools/class-progress'
import { LEVEL_WORD } from '../../../lib/schools/topic-level'

export const Route = createFileRoute('/school/$schoolId/class-progress')({
  component: ClassProgress,
})

type D = Awaited<ReturnType<typeof classProgress>>

const CELL: Record<string, string> = {
  beginner: 'bg-sky-200 text-sky-950',
  progressing: 'bg-amber-200 text-amber-950',
  proficient: 'bg-emerald-300 text-emerald-950',
}

// Class Progress (owner direction 2026-10-31): the same levels as the students see, for a whole section.
function ClassProgress() {
  const { schoolId } = useSchool()
  const [section, setSection] = useState('')
  const [subject, setSubject] = useState('')
  const [d, setD] = useState<D | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const q = new URLSearchParams()
    if (section) q.set('section', section)
    if (subject) q.set('subject', subject)
    void api<D>(`/api/schools/${schoolId}/class-progress?${q.toString()}`)
      .then((x) => {
        setD(x)
        if (!section && x.section) setSection(x.section.id)
        if (!subject && x.subject) setSubject(x.subject)
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Something went wrong.'))
  }, [schoolId, section, subject])
  if (error) return <Notice kind="error">{error}</Notice>
  if (!d) return <Loading />
  if (!d.section)
    return <EmptyState title="No class yet">Classes you teach appear here.</EmptyState>
  const hm = d.heatmap
  const sec = d.section
  const totals = d.habitTotals
  return (
    <div className="space-y-4" data-testid="class-progress">
      <PageHeader title="Class progress" subtitle={`${d.section.name} · ${d.students} students. Only final marks are used.`} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Section" value={section} onChange={(e) => { setSection(e.target.value); setSubject('') }}>
          {d.sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>
        <Select label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
          {d.subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>
      {!d.hasData ? (
        <EmptyState title="Nothing final yet">Levels appear after a paper's results are released and its marks lock.</EmptyState>
      ) : (
        <>
          <Card>
            <h2 className="mb-2 text-lg font-bold">Students who need attention this week</h2>
            {d.attention.length === 0 ? (
              <p className="text-base text-slate-700">Nobody needs attention this week.</p>
            ) : (
              <ul className="space-y-2" data-testid="attention">
                {d.attention.map((a) => (
                  <li key={a.studentId} className="rounded-xl border border-amber-300 bg-amber-50 p-3" data-testid="attention-row">
                    <p className="text-base font-semibold">{a.rollNo} · {a.name}</p>
                    <ul className="list-disc pl-5 text-[15px] text-amber-950">
                      {a.reasons.slice(0, 3).map((r) => (<li key={r}>{r}</li>))}
                      {a.reasons.length > 3 ? <li>and {a.reasons.length - 3} more</li> : null}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-1 text-lg font-bold">Topic levels</h2>
            <div className="mb-2 flex flex-wrap gap-2 text-sm">
              {(['beginner', 'progressing', 'proficient'] as const).map((l) => (
                <span key={l} className={`rounded-md px-2 py-1 font-semibold ${CELL[l]}`}>{LEVEL_WORD[l]}</span>
              ))}
              <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-600">Not assessed</span>
            </div>
            <div className="overflow-x-auto" data-testid="topic-heatmap">
              <table className="w-full border-separate border-spacing-1 text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white px-2 text-left">Student</th>
                    {hm.columns.map((c) => (
                      <th key={c.key} className="max-w-24 px-1 align-bottom text-xs font-semibold text-slate-700">
                        <span className="line-clamp-3">{c.label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hm.rows.map((r) => (
                    <tr key={r.studentId}>
                      <td className="sticky left-0 bg-white px-2 py-1 whitespace-nowrap text-base">{r.rollNo} {r.name}</td>
                      {r.cells.map((cell, i) => (
                        <td
                          key={i}
                          title={cell ? `${cell.level ? LEVEL_WORD[cell.level] : ''}${cell.pct !== null ? ` (${cell.pct}%)` : ''}` : 'Not assessed'}
                          className={`h-8 min-w-8 rounded text-center font-bold ${cell?.level ? CELL[cell.level] : 'bg-slate-100'}`}
                        >
                          {cell?.dip ? '↓' : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm text-slate-600">↓ means the latest exam was below the level (one weak test does not change a level).</p>
          </Card>

          <Card>
            <h2 className="mb-1 text-lg font-bold">Writing habits</h2>
            <p className="mb-2 text-base text-slate-700">Marks lost to each habit in each student's last two exams.</p>
            <div className="overflow-x-auto" data-testid="habit-heatmap">
              <table className="w-full border-separate border-spacing-1 text-sm">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-white px-2 text-left">Student</th>
                    {HABIT_CODES.map((h) => (
                      <th key={h} className="max-w-24 px-1 align-bottom text-xs font-semibold text-slate-700">{HABIT_LABEL[h]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.habitHeat.map((r) => (
                    <tr key={r.studentId}>
                      <td className="sticky left-0 bg-white px-2 py-1 whitespace-nowrap text-base">{r.rollNo} {r.name}</td>
                      {HABIT_CODES.map((h) => (
                        <td
                          key={h}
                          className={`h-8 min-w-8 rounded text-center font-bold ${r.lost[h] === 0 ? 'bg-slate-100 text-slate-400' : r.lost[h] <= 2 ? 'bg-amber-200 text-amber-950' : 'bg-amber-500 text-white'}`}
                        >
                          {r.lost[h] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="sticky left-0 bg-white px-2 py-1 text-base font-bold">Section</td>
                    {HABIT_CODES.map((h) => (
                      <td key={h} className="rounded bg-slate-200 text-center font-bold">{totals[h]}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h2 className="mb-2 text-lg font-bold">Flags with a teacher</h2>
            {d.flags.length === 0 ? (
              <p className="text-base text-slate-700">No flag is waiting.</p>
            ) : (
              <ul className="space-y-2" data-testid="flag-queue">
                {d.flags.map((f) => (
                  <li key={f.paperId} className="flex items-center justify-between gap-3">
                    <span className="text-base">{f.title}</span>
                    <Chip tone="wait">{f.count} waiting</Chip>
                    <Link to="/school/$schoolId/own-papers/$paperId" params={{ schoolId, paperId: f.paperId }} className="text-base font-semibold underline">
                      Open
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-1 text-lg font-bold">For the Holistic Progress Card</h2>
            <p className="mb-2 text-base text-slate-700">Topic levels and the students' self-reflections for this section.</p>
            <div className="flex flex-wrap gap-2">
              {(['xlsx', 'csv'] as const).map((f) => (
                <a
                  key={f}
                  href={`/api/schools/${schoolId}/class-progress?export=${f}&section=${sec.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-base font-semibold text-slate-800 hover:bg-slate-50"
                  data-testid={`export-${f}`}
                >
                  <Download aria-hidden="true" className="size-4" /> {f === 'xlsx' ? 'Excel' : 'CSV'}
                </a>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
