import { describe, expect, it } from 'vitest'
import {
  countedAnswers,
  examSummaries,
  gradeOf,
  habitSeries,
  personalBest,
  roundsOf,
  subjectTiles,
  topicRows,
  weeklyFocus,
} from './progress-calc'
import type { AnswerRow, ExamInfo } from './progress-calc'

const exams: Array<ExamInfo> = [
  { paperId: 'p1', title: 'Unit Test 1', subject: 'Maths', at: '2026-08-01' },
  { paperId: 'p2', title: 'Unit Test 2', subject: 'Maths', at: '2026-09-01' },
  { paperId: 'p3', title: 'Half Yearly', subject: 'Maths', at: '2026-10-01' },
]
let n = 0
const a = (paperId: string, topic: string, finalMarks: number, maxMarks: number, over: Partial<AnswerRow> = {}): AnswerRow => ({
  paperId,
  questionId: `q${n++}`,
  questionNo: String(n),
  orGroup: null,
  found: true,
  finalMarks,
  maxMarks,
  lossKind: finalMarks < maxMarks ? 'knowledge_gap' : 'none',
  habit: null,
  lossReason: null,
  topicKey: `c:${topic}`,
  topicLabel: topic,
  ...over,
})

describe('gradeOf (CBSE nine-point)', () => {
  it('maps percentages to grades', () => {
    expect([100, 91, 90, 81, 80, 71, 61, 51, 41, 33, 32, 0].map(gradeOf)).toEqual(
      ['A1', 'A1', 'A2', 'A2', 'B1', 'B1', 'B2', 'C1', 'C2', 'D', 'E', 'E'],
    )
  })
})

describe('countedAnswers', () => {
  it('counts only the better member of an OR pair, so the unattempted one is not marks lost', () => {
    const rows = [
      a('p1', 'T', 4, 5, { orGroup: 'g' }),
      a('p1', 'T', 0, 5, { orGroup: 'g', found: false }),
      a('p1', 'T', 1, 1),
    ]
    const c = countedAnswers(rows)
    expect(c).toHaveLength(2)
    expect(c.find((x) => x.orGroup)?.finalMarks).toBe(4)
  })
})

describe('examSummaries', () => {
  it('splits marks lost into "did not know" and "writing habit", with the grade', () => {
    const rows = [
      a('p1', 'Fractions', 3, 5, { lossKind: 'writing_habit', habit: 'stopped_early' }),
      a('p1', 'Decimals', 1, 3),
      a('p1', 'Decimals', 2, 2),
    ]
    const [s] = examSummaries([exams[0]], rows)
    expect(s).toMatchObject({ earned: 6, max: 10, pct: 60, grade: 'C1', lostHabit: 2, lostKnowledge: 2, lostUnclear: 0 })
  })
})

describe('topicRows and subject tiles', () => {
  const answers = [
    // Fractions: strong, strong, one bad -> Proficient with a dip
    a('p1', 'Fractions', 4, 4), a('p2', 'Fractions', 4, 4), a('p3', 'Fractions', 1, 4),
    // Decimals: weak, weak, weak -> Beginner
    a('p1', 'Decimals', 1, 4), a('p2', 'Decimals', 1, 4), a('p3', 'Decimals', 1, 4),
    // Ratio: only in the last exam, 3 of 4 -> Progressing
    a('p3', 'Ratio', 3, 4),
  ]
  it('levels follow the rule and keep the dip', () => {
    const t = topicRows(exams, answers)
    const by = (l: string) => t.find((x) => x.label === l)!
    expect(by('Fractions')).toMatchObject({ level: 'proficient', dip: true, evidence: 3, latestPct: 25 })
    expect(by('Decimals')).toMatchObject({ level: 'beginner', evidence: 3 })
    expect(by('Ratio')).toMatchObject({ level: 'progressing', evidence: 1 })
  })
  it('the subject tile has the latest %, the trend and the proficient ring', () => {
    const s = examSummaries(exams, answers)
    const tiles = subjectTiles(s, topicRows(exams, answers))
    expect(tiles[0]).toMatchObject({ subject: 'Maths', proficient: 1, assessed: 3 })
    expect(tiles[0].latestPct).toBe(s[2].pct)
    expect(tiles[0].trend).toBe('down')
  })
})

describe('roundsOf', () => {
  it('one point per exam day, scored by all the marks of that day together', () => {
    const subs = examSummaries(
      [
        { paperId: 'a', title: 'UT1 Maths', subject: 'Maths', at: '2026-08-01T05:00:00Z' },
        { paperId: 'b', title: 'UT1 Science', subject: 'Science', at: '2026-08-01T09:00:00Z' },
        { paperId: 'c', title: 'UT2 Maths', subject: 'Maths', at: '2026-09-01T05:00:00Z' },
      ],
      [a('a', 'X', 1, 4), a('b', 'Y', 3, 4), a('c', 'X', 4, 4)],
    )
    const r = roundsOf(subs)
    expect(r.map((x) => x.pct)).toEqual([50, 100])
    expect(r[0].subject).toBe('All subjects')
    expect(r[1].subject).toBe('Maths')
  })
})

describe('habits, personal best and focus', () => {
  const answers = [
    a('p1', 'Fractions', 2, 4, { lossKind: 'writing_habit', habit: 'units_missing' }),
    a('p2', 'Fractions', 3, 4, { lossKind: 'writing_habit', habit: 'units_missing' }),
    a('p2', 'Decimals', 1, 4, { lossKind: 'knowledge_gap' }),
    a('p3', 'Decimals', 0, 4, { lossKind: 'knowledge_gap' }),
    a('p3', 'Fractions', 2, 4, { lossKind: 'writing_habit', habit: 'stopped_early' }),
    a('p3', 'Ratio', 3, 4, { lossKind: 'writing_habit', habit: null }),
  ]
  it('habit series per exam, an unnamed habit is "other"', () => {
    const h = habitSeries(exams, answers)
    expect(h.find((x) => x.habit === 'units_missing')?.perExam.map((p) => p.lost)).toEqual([2, 1, 0])
    expect(h.find((x) => x.habit === 'other')?.total).toBe(1)
    expect(h.find((x) => x.habit === 'misread_question')?.total).toBe(0)
  })
  it('a new best is only claimed when it beats every earlier exam', () => {
    const s = examSummaries(exams, answers)
    expect(personalBest(s.slice(0, 1))).toMatchObject({ latestIsBest: false })
    expect(personalBest(examSummaries(exams, [a('p1', 'X', 1, 4), a('p2', 'X', 2, 4), a('p3', 'X', 3, 4)]))).toMatchObject({ bestPct: 75, latestIsBest: true })
    expect(personalBest([])).toEqual({ bestPct: null, bestTitle: null, latestIsBest: false })
  })
  it('focus: biggest gap topic, costliest recent habit, nearest-to-proficient topic', () => {
    const f = weeklyFocus(exams, answers, topicRows(exams, answers))
    expect(f[0]).toMatchObject({ kind: 'topic', title: 'Decimals', n: 4 })
    expect(f[1]).toMatchObject({ kind: 'habit' })
    expect(f.length).toBeLessThanOrEqual(3)
    expect(weeklyFocus([], [], [])).toEqual([])
  })
})
