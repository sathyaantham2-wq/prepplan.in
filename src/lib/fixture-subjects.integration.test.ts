import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import { subjectsRepository } from '../db/repositories'
import {
  assertLocalDatabase,
  isFixtureSubjectCode,
  blockedFixtureSubject,
  isProductionRuntime,
  listActiveFixtureSubjects,
} from './fixture-subjects'

describe('seed/fixture/E2E subjects can never reach students in production', () => {
  let db: Db
  const tag = `${Date.now()}`.slice(-8)
  const codes = {
    seed: `GUARD-${tag}-SEED`,
    e2e: `E2E-GUARD-${tag}`,
    real: `GUARDREAL-${tag}`,
  }
  beforeAll(async () => {
    db = createDb()
    for (const code of Object.values(codes))
      await db
        .insertInto('subjects')
        .values({
          board: 'GUARDTEST',
          class: 1,
          code,
          name: code,
          language: 'en',
          is_active: true,
        })
        .execute()
  })
  afterAll(async () => {
    await db.deleteFrom('subjects').where('board', '=', 'GUARDTEST').execute()
    await db.destroy()
  })

  it('knows which codes are fixtures', () => {
    for (const c of ['MATH-SEED', 'SCI-SEED', 'E2E-AD-1790061218739'])
      expect(isFixtureSubjectCode(c)).toBe(true)
    for (const c of ['MATH', 'SCI9', 'POLITY', 'MATH12', 'SEEDLING'])
      expect(isFixtureSubjectCode(c)).toBe(false)
  })

  it('a production runtime is recognised from VERCEL_ENV or NODE_ENV', () => {
    expect(isProductionRuntime({ VERCEL_ENV: 'production' })).toBe(true)
    expect(isProductionRuntime({ NODE_ENV: 'production' })).toBe(true)
    expect(
      isProductionRuntime({ VERCEL_ENV: 'preview', NODE_ENV: 'development' }),
    ).toBe(false)
    expect(isProductionRuntime({})).toBe(false)
  })

  it('the student subject list leaves fixture subjects out in production, even if they are active', async () => {
    const prod = (
      await subjectsRepository.listByBoardClass(db, 'GUARDTEST', 1, false, true)
    ).map((s) => s.code)
    expect(prod).toEqual([codes.real])
    const dev = (
      await subjectsRepository.listByBoardClass(
        db,
        'GUARDTEST',
        1,
        false,
        false,
      )
    )
      .map((s) => s.code)
      .sort()
    expect(dev).toEqual(Object.values(codes).sort())
  })

  it('the admin warning lists every active fixture subject, and not a real one', async () => {
    const active = await listActiveFixtureSubjects(db)
    expect(active).toEqual(expect.arrayContaining([codes.seed, codes.e2e]))
    expect(active).not.toContain(codes.real)
    await db
      .updateTable('subjects')
      .set({ is_active: false })
      .where('code', '=', codes.seed)
      .execute()
    expect(await listActiveFixtureSubjects(db)).not.toContain(codes.seed)
  })

  it('the school module offers no fixture subject in production (add a subject, layouts, chapters)', () => {
    expect(blockedFixtureSubject('MATH-SEED', true)).toBe(true)
    expect(blockedFixtureSubject('E2E-AD-1', true)).toBe(true)
    expect(blockedFixtureSubject('MATH', true)).toBe(false)
    expect(blockedFixtureSubject('MATH-SEED', false)).toBe(false) // local development and tests still use them
  })

  it('the seed script refuses a database that is not local, with no override', () => {
    expect(() =>
      assertLocalDatabase(
        'postgresql://u:p@db.example.supabase.co:5432/postgres',
        'The seed script',
      ),
    ).toThrow(/refuses to run/)
    expect(() => assertLocalDatabase(undefined, 'The seed script')).toThrow(
      /refuses to run/,
    )
    expect(() =>
      assertLocalDatabase(
        'postgresql://u:p@localhost:5432/examprep_test',
        'The seed script',
      ),
    ).not.toThrow()
    expect(() =>
      assertLocalDatabase('postgresql://u:p@127.0.0.1/x', 'The seed script'),
    ).not.toThrow()
  })
})
