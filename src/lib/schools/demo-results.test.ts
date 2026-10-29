import { describe, expect, it } from 'vitest'
import { DEMO_LABEL, HABITS, generateDemoResults } from './demo-results'

const questions = [
  ...Array.from({ length: 12 }, (_, i) => ({
    position: i + 1,
    marks: 1,
    type: 'mcq',
    topic: ['Fractions', 'Decimals', 'Integers'][i % 3],
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    position: 13 + i,
    marks: 3,
    type: 'short_answer',
    topic: ['Fractions', 'Decimals', 'Integers'][i % 3],
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    position: 19 + i,
    marks: 5,
    type: 'long_answer',
    topic: ['Fractions', 'Decimals', 'Integers'][i % 3],
  })),
]
const students = Array.from({ length: 30 }, (_, i) => ({
  id: `s${i + 1}`,
  name: `Student ${i + 1} Demo`,
  roll: String(i + 1),
}))
const make = (seedText = 'seed-a') =>
  generateDemoResults({ examTitle: 'Unit Test', questions, students, seedText })
const total = questions.reduce((n, q) => n + q.marks, 0)

describe('sample results of the demo school', () => {
  const r = make()

  it('is labelled as demo data and says so in the data itself', () => {
    expect(r.demo).toBe(true)
    expect(r.label).toBe('DEMO - sample data')
    expect(DEMO_LABEL).toBe(r.label)
  })

  it('is the same every time for the same paper and school, and different for another', () => {
    expect(make()).toEqual(r)
    expect(make('seed-b')).not.toEqual(r)
  })

  it('one report per student, and the marks add up exactly', () => {
    expect(r.students).toHaveLength(30)
    for (const s of r.students) {
      expect(s.outOf).toBe(total)
      expect(s.questions).toHaveLength(questions.length)
      expect(s.questions.reduce((n, q) => n + q.got, 0)).toBe(s.got)
      // every lost mark is either "not learnt" or "a writing habit": nothing else, nothing twice
      expect(s.lostToGap + s.lostToHabit).toBe(total - s.got)
      expect(s.percent).toBe(Math.round((s.got / total) * 100))
      for (const q of s.questions) {
        expect(q.got).toBeGreaterThanOrEqual(0)
        expect(q.got).toBeLessThanOrEqual(q.outOf)
        if (q.cause === 'full') expect(q.got).toBe(q.outOf)
        if (q.cause === 'habit') expect(q.habit).toBeDefined()
        if (q.cause !== 'habit') expect(q.habit).toBeUndefined()
      }
    }
  })

  it('shows both kinds of lost mark across a class, and both strengths and topics to fix', () => {
    expect(r.students.some((s) => s.lostToGap > 0)).toBe(true)
    expect(r.students.some((s) => s.lostToHabit > 0)).toBe(true)
    expect(r.students.some((s) => s.strengths.length > 0)).toBe(true)
    expect(r.students.some((s) => s.toFix.length > 0)).toBe(true)
    for (const s of r.students) {
      expect(s.strengths.length).toBeLessThanOrEqual(3)
      expect(s.toFix.length).toBeLessThanOrEqual(3)
      for (const f of s.toFix) {
        expect(['gap', 'habit']).toContain(f.why)
        expect(f.note.length).toBeGreaterThan(10)
      }
      expect(s.summary.length).toBeGreaterThan(10)
    }
  })

  it('a habit only ever appears on answers that can lose a mark to it', () => {
    for (const s of r.students)
      for (const q of s.questions) {
        const def = questions.find((x) => x.position === q.position)!
        if (def.type === 'mcq' && q.habit) expect(q.habit).toBe('misread')
      }
  })

  it('the heatmap has a row per student and a level 0 to 3 for each habit', () => {
    expect(r.heatmap.habits.map((h) => h.key)).toEqual(HABITS.map((h) => h.key))
    expect(r.heatmap.rows).toHaveLength(30)
    for (const row of r.heatmap.rows) {
      expect(row.levels).toHaveLength(HABITS.length)
      for (const l of row.levels) expect([0, 1, 2, 3]).toContain(l)
    }
    expect(r.heatmap.rows.some((row) => row.levels.some((l) => l > 0))).toBe(
      true,
    )
  })

  it('a few teacher flags, each on a real answer of a real student, with a plain reason', () => {
    expect(r.flags.length).toBeGreaterThanOrEqual(3)
    expect(r.flags.length).toBeLessThanOrEqual(5)
    const keys = new Set<string>()
    for (const f of r.flags) {
      const s = r.students.find((x) => x.studentId === f.studentId)!
      expect(s).toBeDefined()
      expect(s.questions.some((q) => q.position === f.position)).toBe(true)
      expect(f.reason.endsWith('.')).toBe(true)
      expect(f.suggested).toBeLessThanOrEqual(f.outOf)
      keys.add(`${f.studentId}-${f.position}`)
    }
    expect(keys.size).toBe(r.flags.length)
  })

  it('the class summary agrees with the reports', () => {
    const c = r.classSummary
    expect(c.buckets.reduce((n, b) => n + b.students, 0)).toBe(30)
    expect(c.highest).toBe(Math.max(...r.students.map((s) => s.percent)))
    expect(c.lowest).toBe(Math.min(...r.students.map((s) => s.percent)))
    expect(c.lostToGapShare).toBeGreaterThanOrEqual(0)
    expect(c.lostToGapShare).toBeLessThanOrEqual(100)
    expect(c.topFixTopics.length).toBeGreaterThan(0)
  })

  it('uses plain words: no technical term reaches a teacher', () => {
    const text = JSON.stringify(r).toLowerCase()
    for (const bad of [
      'bloom',
      'json',
      'null',
      'undefined',
      'confidence',
      'ocr',
      'embedding',
      'token',
    ])
      expect(text, bad).not.toContain(bad)
  })
})
