// The sample results of a demo school (M1). A pure, deterministic generator: the same paper and the
// same 30 students always give the same results, so a demo looks the same every time it is shown. It
// makes no AI call, reads no scanned image and touches no database. Everything it returns is marked
// as demo data. The shapes below are what the real results screens will also receive in M4, filled
// with real marks instead of these invented ones.

export const DEMO_LABEL = 'DEMO - sample data'

/** What a student can lose a mark to, other than not knowing the topic. Plain words only. */
export const HABITS = [
  {
    key: 'stopped_early',
    short: 'Stopped early',
    label: 'Stopped writing too early',
    tip: 'Write the full answer, then read it once more.',
  },
  {
    key: 'no_working',
    short: 'No working',
    label: 'Did not show the working',
    tip: 'Show each step, even the easy ones.',
  },
  {
    key: 'skipped',
    short: 'Left blank',
    label: 'Left a question blank',
    tip: 'Always write something for every question.',
  },
  {
    key: 'units_missing',
    short: 'No units',
    label: 'Forgot the units or the final line',
    tip: 'End with the answer and its unit.',
  },
  {
    key: 'misread',
    short: 'Misread',
    label: 'Did not read the whole question',
    tip: 'Underline what the question asks before you start.',
  },
] as const
export type HabitKey = (typeof HABITS)[number]['key']

export interface DemoQuestion {
  position: number
  marks: number
  type: string
  /** The topic the question tests, in plain words. */
  topic: string
}
export interface DemoStudent {
  id: string
  name: string
  roll: string
}

export type Cause = 'full' | 'gap' | 'habit'
export interface QuestionResult {
  position: number
  topic: string
  outOf: number
  got: number
  /** Why marks were lost: not knowing the topic, or a writing habit. 'full' = nothing lost. */
  cause: Cause
  habit?: HabitKey
}
export interface TopicLine {
  topic: string
  percent: number
}
export interface FixLine {
  topic: string
  /** What mostly went wrong in this topic. */
  why: 'gap' | 'habit'
  note: string
}
export interface StudentReport {
  studentId: string
  name: string
  roll: string
  got: number
  outOf: number
  percent: number
  lostToGap: number
  lostToHabit: number
  strengths: Array<TopicLine>
  toFix: Array<FixLine>
  habits: Partial<Record<HabitKey, number>>
  questions: Array<QuestionResult>
  /** One plain sentence for the teacher to say to the student. */
  summary: string
}
export interface Flag {
  id: string
  studentId: string
  studentName: string
  position: number
  topic: string
  reason: string
  /** What the sample marker suggested before a teacher decides. */
  suggested: number
  outOf: number
}
export interface DemoResults {
  demo: true
  label: typeof DEMO_LABEL
  examTitle: string
  totalMarks: number
  students: Array<StudentReport>
  heatmap: {
    habits: Array<{ key: HabitKey; label: string; short: string }>
    /** Per student, a 0 to 3 level for each habit in the same order as `habits`. */
    rows: Array<{
      studentId: string
      name: string
      levels: Array<0 | 1 | 2 | 3>
    }>
  }
  flags: Array<Flag>
  classSummary: {
    average: number
    highest: number
    lowest: number
    lostToGapShare: number
    topFixTopics: Array<{ topic: string; students: number }>
    topHabits: Array<{ key: HabitKey; label: string; students: number }>
    buckets: Array<{ label: string; students: number }>
  }
}

/** A small seeded random generator (mulberry32), so the sample never changes between runs. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hashSeed = (s: string) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

const FLAG_REASONS = [
  'The handwriting is hard to read.',
  'The answer runs off the edge of the box.',
  'There is a diagram that a person should check.',
  'Two answers are written in one box.',
  'The marker was not sure about this answer.',
]

const round1 = (n: number) => Math.round(n * 10) / 10

export function generateDemoResults(input: {
  examTitle: string
  questions: ReadonlyArray<DemoQuestion>
  students: ReadonlyArray<DemoStudent>
  seedText: string
}): DemoResults {
  const rand = rng(hashSeed(input.seedText))
  const totalMarks = input.questions.reduce((n, q) => n + q.marks, 0)
  const topics = [...new Set(input.questions.map((q) => q.topic))]
  // each topic is a little harder or easier for the whole class
  const topicShift = new Map(topics.map((t) => [t, (rand() - 0.5) * 0.3]))

  const reports: Array<StudentReport> = input.students.map((s) => {
    const ability = 0.45 + rand() * 0.5 // how much of the subject she knows
    const habitProne = new Map<HabitKey, number>(
      HABITS.map((h) => [
        h.key,
        rand() < 0.35 ? 0.25 + rand() * 0.45 : rand() * 0.08,
      ]),
    )
    const questions: Array<QuestionResult> = input.questions.map((q) => {
      const knows =
        rand() <
        Math.min(0.97, Math.max(0.05, ability + (topicShift.get(q.topic) ?? 0)))
      const written = q.type !== 'mcq' && q.type !== 'assertion_reason'
      if (!knows) {
        const part =
          written && q.marks >= 3 ? Math.floor(rand() * (q.marks * 0.5)) : 0
        return {
          position: q.position,
          topic: q.topic,
          outOf: q.marks,
          got: part,
          cause: 'gap' as const,
        }
      }
      // she knows it: a writing habit may still cost marks
      const habits = HABITS.filter((h) => written || h.key === 'misread')
      for (const h of habits) {
        const p = (habitProne.get(h.key) ?? 0) * (q.marks >= 3 ? 1 : 0.6)
        if (rand() < p) {
          const lost = Math.max(
            1,
            Math.min(q.marks, Math.round(q.marks * (0.25 + rand() * 0.4))),
          )
          return {
            position: q.position,
            topic: q.topic,
            outOf: q.marks,
            got: q.marks - lost,
            cause: 'habit' as const,
            habit: h.key,
          }
        }
      }
      return {
        position: q.position,
        topic: q.topic,
        outOf: q.marks,
        got: q.marks,
        cause: 'full' as const,
      }
    })
    const got = questions.reduce((n, q) => n + q.got, 0)
    const lostToGap = questions
      .filter((q) => q.cause === 'gap')
      .reduce((n, q) => n + (q.outOf - q.got), 0)
    const lostToHabit = questions
      .filter((q) => q.cause === 'habit')
      .reduce((n, q) => n + (q.outOf - q.got), 0)
    const habits: Partial<Record<HabitKey, number>> = {}
    for (const q of questions)
      if (q.habit) habits[q.habit] = (habits[q.habit] ?? 0) + 1

    const byTopic = topics.map((t) => {
      const qs = questions.filter((q) => q.topic === t)
      const out = qs.reduce((n, q) => n + q.outOf, 0)
      const g = qs.reduce((n, q) => n + q.got, 0)
      const gap = qs
        .filter((q) => q.cause === 'gap')
        .reduce((n, q) => n + (q.outOf - q.got), 0)
      const hab = qs
        .filter((q) => q.cause === 'habit')
        .reduce((n, q) => n + (q.outOf - q.got), 0)
      return {
        topic: t,
        out,
        percent: out === 0 ? 100 : Math.round((g / out) * 100),
        gap,
        hab,
      }
    })
    const strengths = byTopic
      .filter((t) => t.percent >= 75 && t.out > 0)
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 3)
      .map((t) => ({ topic: t.topic, percent: t.percent }))
    const toFix: Array<FixLine> = byTopic
      .filter((t) => t.percent < 70 && t.out > 0)
      .sort((a, b) => a.percent - b.percent)
      .slice(0, 3)
      .map((t) => {
        const why = t.gap >= t.hab ? ('gap' as const) : ('habit' as const)
        const topHabit = (Object.entries(habits).sort(
          (a, b) => b[1] - a[1],
        )[0]?.[0] ?? 'no_working') as HabitKey
        return {
          topic: t.topic,
          why,
          note:
            why === 'gap'
              ? 'She has not learnt this yet. Teach it again, then give her practice questions.'
              : `She knows this, but lost marks by habit. ${HABITS.find((h) => h.key === topHabit)?.tip ?? ''}`,
        }
      })
    const percent = totalMarks === 0 ? 0 : Math.round((got / totalMarks) * 100)
    const summary =
      lostToGap === 0 && lostToHabit === 0
        ? 'Very good paper. Nothing to fix.'
        : lostToHabit > lostToGap
          ? `Most of the ${lostToGap + lostToHabit} marks lost came from writing habits, not from missing knowledge. Better habits could win back about ${lostToHabit} marks.`
          : `Most of the ${lostToGap + lostToHabit} marks lost came from topics not learnt yet (${lostToGap} marks). About ${lostToHabit} more were lost to writing habits.`
    return {
      studentId: s.id,
      name: s.name,
      roll: s.roll,
      got,
      outOf: totalMarks,
      percent,
      lostToGap,
      lostToHabit,
      strengths,
      toFix,
      habits,
      questions,
      summary,
    }
  })

  // the class view
  const heatmap = {
    habits: HABITS.map((h) => ({ key: h.key, label: h.label, short: h.short })),
    rows: reports.map((r) => ({
      studentId: r.studentId,
      name: r.name,
      levels: HABITS.map(
        (h) => Math.min(3, r.habits[h.key] ?? 0) as 0 | 1 | 2 | 3,
      ),
    })),
  }
  const writtenAnswers = reports.flatMap((r) =>
    r.questions.filter((q) => q.outOf >= 2).map((q) => ({ r, q })),
  )
  const flags: Array<Flag> = []
  const used = new Set<string>()
  for (let i = 0; i < 5 && writtenAnswers.length > 0; i++) {
    const pick = writtenAnswers[Math.floor(rand() * writtenAnswers.length)]
    const key = `${pick.r.studentId}-${pick.q.position}`
    if (used.has(key)) continue
    used.add(key)
    flags.push({
      id: `flag-${i + 1}`,
      studentId: pick.r.studentId,
      studentName: pick.r.name,
      position: pick.q.position,
      topic: pick.q.topic,
      reason: FLAG_REASONS[i % FLAG_REASONS.length],
      suggested: pick.q.got,
      outOf: pick.q.outOf,
    })
  }

  const percents = reports.map((r) => r.percent)
  const gapTotal = reports.reduce((n, r) => n + r.lostToGap, 0)
  const lostTotal = gapTotal + reports.reduce((n, r) => n + r.lostToHabit, 0)
  const fixCount = new Map<string, number>()
  for (const r of reports)
    for (const f of r.toFix)
      fixCount.set(f.topic, (fixCount.get(f.topic) ?? 0) + 1)
  const bucket = (lo: number, hi: number, label: string) => ({
    label,
    students: percents.filter((p) => p >= lo && p <= hi).length,
  })
  return {
    demo: true,
    label: DEMO_LABEL,
    examTitle: input.examTitle,
    totalMarks,
    students: reports,
    heatmap,
    flags,
    classSummary: {
      average: round1(
        percents.reduce((n, p) => n + p, 0) / Math.max(1, percents.length),
      ),
      highest: Math.max(0, ...percents),
      lowest: percents.length ? Math.min(...percents) : 0,
      lostToGapShare:
        lostTotal === 0 ? 0 : Math.round((gapTotal / lostTotal) * 100),
      topFixTopics: [...fixCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([topic, students]) => ({ topic, students })),
      topHabits: HABITS.map((h) => ({
        key: h.key,
        label: h.label,
        students: reports.filter((r) => (r.habits[h.key] ?? 0) > 0).length,
      }))
        .sort((a, b) => b.students - a.students)
        .slice(0, 3),
      buckets: [
        bucket(0, 39, 'Under 40%'),
        bucket(40, 59, '40 to 59%'),
        bucket(60, 79, '60 to 79%'),
        bucket(80, 100, '80% and above'),
      ],
    },
  }
}
