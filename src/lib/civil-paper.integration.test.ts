import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import { createCivilFixture } from '../db/civil-test-fixture'
import type { CivilFixture } from '../db/civil-test-fixture'
import { createParentSession } from '../db/test-helpers'
import type { TestSession } from '../db/test-helpers'
import { Route as StudentsRoute } from '../routes/api/students'
import { generateCivilPrelimsPaper, pickSpread } from './civil-paper'

type RouteHandler = (opts: { request: Request }) => Promise<Response>

async function newStudent(parent: TestSession, name: string): Promise<string> {
  const handler = (StudentsRoute.options.server as { handlers: Record<string, RouteHandler> }).handlers.POST
  const response = await handler({
    request: new Request('http://localhost/test', {
      method: 'POST',
      headers: { cookie: parent.cookie, 'content-type': 'application/json' },
      body: JSON.stringify({ name, class: 0, board: 'CIVILS', consent_accepted: true }),
    }),
  })
  return (await response.json()).id as string
}

/**
 * F132: the Civil Services paper generator against a fixture bank of two uneven chapters (a deep
 * 3-concept one and a shallow 1-concept one) plus decoys that must never be drawn.
 */
describe('generateCivilPrelimsPaper (F132)', () => {
  let db: Db
  let parent: TestSession
  let fixture: CivilFixture
  const tag = `civil-gen-${Date.now()}`

  beforeAll(async () => {
    db = createDb()
    parent = await createParentSession('civil-gen')
    // 40 + 40 + 40 in chapter 0, 8 in chapter 1: 128 civil one-mark questions, plus 4 decoys.
    fixture = await createCivilFixture(db, { tag, chapters: [[40, 40, 40], [8]], decoys: true })
  })

  afterAll(async () => {
    await db.deleteFrom('question_usage').where('question_id', 'in', fixture.questionIds).execute()
    const papers = await db.selectFrom('papers').select('id').where('subject_id', '=', fixture.subjectId).execute()
    const ids = papers.map((p) => p.id)
    if (ids.length > 0) {
      await db.deleteFrom('paper_questions').where('paper_id', 'in', ids).execute()
      await db.deleteFrom('papers').where('id', 'in', ids).execute()
    }
    await db.deleteFrom('households').where('id', '=', parent.householdId).execute()
    await fixture.cleanup()
    await db.destroy()
  })

  async function questionsOf(paperId: string) {
    return db
      .selectFrom('paper_questions as pq')
      .innerJoin('questions as q', 'q.id', 'pq.question_id')
      .select(['q.id', 'q.concept_id', 'q.tags', 'q.status', 'q.marks', 'q.type', 'pq.position', 'pq.marks as pq_marks'])
      .where('pq.paper_id', '=', paperId)
      .orderBy('pq.position')
      .execute()
  }

  for (const count of [10, 15, 30] as const) {
    it(`draws exactly ${count} distinct approved, civil-tagged one-mark objective questions`, async () => {
      const studentId = await newStudent(parent, `Count ${count}`)
      const { paper, paperQuestions, shortfalls } = await generateCivilPrelimsPaper(db, {
        studentId,
        questionCount: count,
        subjectCode: 'POLITY',
      })
      expect(paperQuestions).toHaveLength(count)
      expect(shortfalls).toEqual([])
      expect(paper.total_marks).toBe(count)
      expect(paper.subject_id).toBe(fixture.subjectId)
      const rows = await questionsOf(paper.id)
      expect(new Set(rows.map((r) => r.id)).size).toBe(count)
      expect(rows.map((r) => r.position)).toEqual(Array.from({ length: count }, (_, i) => i + 1))
      for (const r of rows) {
        expect(fixture.questionIds).toContain(r.id)
        expect(r.status).toBe('approved')
        expect(r.tags).toContain('civil')
        expect(r.marks).toBe(1)
        expect(r.pq_marks).toBe(1)
        expect(['mcq', 'multi_statement', 'assertion_reason', 'match']).toContain(r.type)
      }
      const usage = await db.selectFrom('question_usage').select('question_id').where('paper_id', '=', paper.id).execute()
      expect(usage).toHaveLength(count)
    })
  }

  it('reuses one stored blueprint per size', async () => {
    const studentId = await newStudent(parent, 'Blueprint')
    const a = await generateCivilPrelimsPaper(db, { studentId, questionCount: 10, subjectCode: 'POLITY' })
    const b = await generateCivilPrelimsPaper(db, { studentId, questionCount: 10, subjectCode: 'POLITY' })
    expect(a.paper.blueprint_id).toBe(b.paper.blueprint_id)
    const blueprint = await db.selectFrom('blueprints').selectAll().where('id', '=', a.paper.blueprint_id).executeTakeFirstOrThrow()
    expect(blueprint.name).toBe('Civil Prelims MCQ 10x1m')
    expect(blueprint.board).toBe('CIVILS')
    expect(blueprint.class).toBe(0)
  })

  it('spreads across concepts and chapters instead of letting the deep chapter dominate', async () => {
    const studentId = await newStudent(parent, 'Spread')
    const { paper } = await generateCivilPrelimsPaper(db, { studentId, questionCount: 10, subjectCode: 'POLITY' })
    const rows = await questionsOf(paper.id)
    const perConcept = new Map<string, number>()
    for (const r of rows) perConcept.set(r.concept_id, (perConcept.get(r.concept_id) ?? 0) + 1)
    // Four concepts exist; the per-concept cap of 2 binds first, then the cap is lifted to fill.
    expect(perConcept.size).toBe(4)
    expect(perConcept.get(fixture.conceptIds[3])).toBeGreaterThanOrEqual(2)
    expect(paper.chapter_ids.sort()).toEqual([...fixture.chapterIds].sort())
  })

  it('does not serve a question that was in her paper in the last 14 days', async () => {
    const studentId = await newStudent(parent, 'Recent')
    const first = await generateCivilPrelimsPaper(db, { studentId, questionCount: 30, subjectCode: 'POLITY' })
    const second = await generateCivilPrelimsPaper(db, { studentId, questionCount: 30, subjectCode: 'POLITY' })
    const firstIds = new Set((await questionsOf(first.paper.id)).map((r) => r.id))
    const secondIds = (await questionsOf(second.paper.id)).map((r) => r.id)
    expect(secondIds).toHaveLength(30)
    expect(secondIds.some((id) => firstIds.has(id))).toBe(false)
  })

  it('reports a shortfall, instead of failing, when the bank has too few unseen questions', async () => {
    const studentId = await newStudent(parent, 'Short')
    // Use up most of the bank: 4 x 30 = 120 of 128.
    for (let i = 0; i < 4; i++) {
      await generateCivilPrelimsPaper(db, { studentId, questionCount: 30, subjectCode: 'POLITY' })
    }
    const { paper, paperQuestions, shortfalls } = await generateCivilPrelimsPaper(db, {
      studentId,
      questionCount: 30,
      subjectCode: 'POLITY',
    })
    expect(paperQuestions).toHaveLength(8)
    expect(shortfalls).toHaveLength(1)
    expect(shortfalls[0].reason).toMatch(/22 of 30/)
    expect(paper.total_marks).toBe(8)
    expect(paper.shortfalls).toEqual(shortfalls)

    // Nothing left: an empty paper with the gap reported, still not an error.
    const empty = await generateCivilPrelimsPaper(db, { studentId, questionCount: 10, subjectCode: 'POLITY' })
    expect(empty.paperQuestions).toHaveLength(0)
    expect(empty.shortfalls).toHaveLength(1)
  })

  it('pickSpread takes turns between chapters and caps a concept at two before relaxing', () => {
    const mk = (id: string, concept: string, chapter: string) => ({ id, concept_id: concept, chapter_id: chapter })
    const candidates = [
      ...Array.from({ length: 10 }, (_, i) => mk(`a${i}`, 'ca', 'ch1')),
      ...Array.from({ length: 10 }, (_, i) => mk(`b${i}`, 'cb', 'ch2')),
    ]
    const picked = pickSpread(candidates, 6)
    expect(picked.filter((p) => p.chapter_id === 'ch1')).toHaveLength(3)
    expect(picked.filter((p) => p.chapter_id === 'ch2')).toHaveLength(3)
    // Ten asked, only two concepts: the cap relaxes rather than leaving the paper short.
    expect(pickSpread(candidates, 10)).toHaveLength(10)
  })

  it('refuses a subject code with no active civil subject', async () => {
    const studentId = await newStudent(parent, 'No subject')
    await db.updateTable('subjects').set({ is_active: false }).where('id', '=', fixture.subjectId).execute()
    try {
      await expect(
        generateCivilPrelimsPaper(db, { studentId, questionCount: 10, subjectCode: 'POLITY' }),
      ).rejects.toThrow(/No active civil subject/)
    } finally {
      await db.updateTable('subjects').set({ is_active: true }).where('id', '=', fixture.subjectId).execute()
    }
  })
})
