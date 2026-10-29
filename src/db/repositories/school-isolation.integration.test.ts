import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { sql } from 'kysely'
import { createDb } from '../connection'
import type { Db } from '../connection'
import { createParentSession } from '../test-helpers'
import type { TestSession } from '../test-helpers'
import {
  SCHOOL_TABLE_REPOSITORIES,
  householdsRepository,
  schoolClassesRepository,
  schoolSectionsRepository,
  schoolSubjectsRepository,
  schoolTermsAcceptancesRepository,
  schoolsRepository,
} from '../repositories'
import { issueSchoolScope } from '../school-scope'
import type { SchoolScope } from '../school-scope'
import { loadSchoolScope, requireSchoolRole } from '../../lib/school-session'

/**
 * School isolation (SCH-13, the school counterpart of T02): school A's scope must never reach
 * school B's rows, at the repository layer, in the schema, and through the route guard. Covers
 * plan tests 1, 3, 11, 13, 14 (S1). Local test database only (vitest.setup.ts refuses others).
 */
describe('school isolation (S1)', () => {
  let db: Db
  const cleanup: { schools: Array<string>; households: Array<string> } = {
    schools: [],
    households: [],
  }
  let adminA: TestSession
  let teacherA: TestSession
  let adminB: TestSession
  let both: TestSession // principal in A, teacher in B
  let outsider: TestSession
  let schoolA: string
  let schoolB: string
  let scopeA: SchoolScope
  let scopeB: SchoolScope
  let classA: string
  let classB: string
  let sectionB: string
  let subjectId: string

  async function makeSchool(name: string) {
    const household = await householdsRepository.insert(db, {
      name: `${name} household`,
      plan: 'free',
    })
    cleanup.households.push(household.id)
    const school = await db
      .insertInto('schools')
      .values({
        household_id: household.id,
        name,
        status: 'active',
        code: `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
    cleanup.schools.push(school.id)
    return school.id
  }
  async function member(
    schoolId: string,
    userId: string,
    role: string,
    status = 'active',
  ) {
    return db
      .insertInto('school_members')
      .values({
        school_id: schoolId,
        user_id: userId,
        role: role as never,
        status: status as never,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
  }
  const req = (s: TestSession | null) =>
    new Request('http://localhost/x', {
      headers: s ? { cookie: s.cookie } : {},
    })

  beforeAll(async () => {
    db = createDb()
    ;[adminA, teacherA, adminB, both, outsider] = await Promise.all(
      ['adma', 'tcha', 'admb', 'both', 'out'].map((n) =>
        createParentSession(`sch-${n}`),
      ),
    )
    schoolA = await makeSchool('IsoSchoolA')
    schoolB = await makeSchool('IsoSchoolB')
    await member(schoolA, adminA.userId, 'school_admin')
    await member(schoolA, teacherA.userId, 'teacher')
    await member(schoolB, adminB.userId, 'school_admin')
    await member(schoolA, both.userId, 'principal')
    await member(schoolB, both.userId, 'teacher')

    scopeA = issueSchoolScope({
      userId: adminA.userId,
      schoolId: schoolA,
      role: 'school_admin',
      pairs: 'all',
    })
    scopeB = issueSchoolScope({
      userId: adminB.userId,
      schoolId: schoolB,
      role: 'school_admin',
      pairs: 'all',
    })

    subjectId = (
      await db
        .selectFrom('subjects')
        .select('id')
        .limit(1)
        .executeTakeFirstOrThrow()
    ).id
    classA = (
      await schoolClassesRepository.insert(db, scopeA, {
        grade: 7,
        academic_year: '2026-27',
      })
    ).id
    classB = (
      await schoolClassesRepository.insert(db, scopeB, {
        grade: 7,
        academic_year: '2026-27',
      })
    ).id
    await schoolSectionsRepository.insert(db, scopeA, {
      class_id: classA,
      name: 'A',
    })
    sectionB = (
      await schoolSectionsRepository.insert(db, scopeB, {
        class_id: classB,
        name: 'A',
      })
    ).id
    await schoolSubjectsRepository.insert(db, scopeB, {
      class_id: classB,
      subject_id: subjectId,
    })
    await schoolTermsAcceptancesRepository.insert(db, scopeB, {
      accepted_by_user_id: adminB.userId,
      terms_version: 'v1',
    })
  })

  afterAll(async () => {
    const ids = cleanup.schools
    // Terms are append-only by trigger; the fixture teardown is the one place that steps around it.
    await sql`alter table school_terms_acceptances disable trigger school_terms_acceptances_append_only`.execute(
      db,
    )
    await db
      .deleteFrom('school_terms_acceptances')
      .where('school_id', 'in', ids)
      .execute()
    await sql`alter table school_terms_acceptances enable trigger school_terms_acceptances_append_only`.execute(
      db,
    )
    await db
      .deleteFrom('school_subjects')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_sections')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_classes')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_members')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    await db
      .deleteFrom('households')
      .where('id', 'in', cleanup.households)
      .execute()
    await db.destroy()
  })

  describe('1. school A scope with school B ids', () => {
    it('findById returns nothing for every school-scoped repository', async () => {
      const bRows = {
        school_classes: classB,
        school_sections: sectionB,
        school_subjects: (
          await db
            .selectFrom('school_subjects')
            .select('id')
            .where('school_id', '=', schoolB)
            .executeTakeFirstOrThrow()
        ).id,
        school_terms_acceptances: (
          await db
            .selectFrom('school_terms_acceptances')
            .select('id')
            .where('school_id', '=', schoolB)
            .executeTakeFirstOrThrow()
        ).id,
        school_members: (
          await db
            .selectFrom('school_members')
            .select('id')
            .where('school_id', '=', schoolB)
            .executeTakeFirstOrThrow()
        ).id,
      }
      for (const [table, repo] of Object.entries(SCHOOL_TABLE_REPOSITORIES)) {
        const id = bRows[table as keyof typeof bRows]
        expect(id, table).toBeTruthy()
        expect(await repo.findById(db, scopeA, id), table).toBeUndefined()
        expect(
          await repo.findById(db, scopeB, id),
          `${table} own scope`,
        ).toBeDefined()
      }
    })

    it('list returns only the scope own rows', async () => {
      for (const [table, repo] of Object.entries(SCHOOL_TABLE_REPOSITORIES)) {
        const rows = (await repo.list(db, scopeA)) as Array<{
          school_id: string
        }>
        expect(
          rows.every((r) => r.school_id === schoolA),
          table,
        ).toBe(true)
      }
      expect(
        (await schoolClassesRepository.list(db, scopeA)).map((r) => r.id),
      ).not.toContain(classB)
    })

    it('update cannot reach or move a foreign row', async () => {
      await expect(
        schoolSectionsRepository.update(db, scopeA, sectionB, { name: 'Z' }),
      ).rejects.toThrow()
      await expect(
        schoolSectionsRepository.update(db, scopeB, sectionB, {
          school_id: schoolA,
        } as never),
      ).rejects.toThrow('school_id cannot be changed')
      const row = await db
        .selectFrom('school_sections')
        .select('name')
        .where('id', '=', sectionB)
        .executeTakeFirstOrThrow()
      expect(row.name).toBe('A')
    })

    it('insert always lands in the scope own school, whatever the row says', async () => {
      const row = await schoolClassesRepository.insert(db, scopeA, {
        grade: 8,
        academic_year: '2026-27',
        school_id: schoolB,
      } as never)
      expect(row.school_id).toBe(schoolA)
    })

    it('the database refuses a child row whose parent is another school (composite FK)', async () => {
      await expect(
        db
          .insertInto('school_sections')
          .values({ school_id: schoolA, class_id: classB, name: 'X' })
          .execute(),
      ).rejects.toThrow(/school_sections_class_fk/)
      const memberB = await db
        .selectFrom('school_members')
        .select('id')
        .where('school_id', '=', schoolB)
        .executeTakeFirstOrThrow()
      await expect(
        schoolSectionsRepository.update(
          db,
          scopeA,
          (await schoolSectionsRepository.list(db, scopeA))[0].id,
          {
            class_teacher_member_id: memberB.id,
          },
        ),
      ).rejects.toThrow(/school_sections_class_teacher_fk/)
    })
  })

  describe('3. admin and principal read the whole school and nothing of another', () => {
    it('a principal scope sees school A only', async () => {
      const r = await loadSchoolScope(db, both.userId, schoolA, [
        'school_admin',
        'principal',
      ])
      expect(r.ok && r.scope.role).toBe('principal')
      expect(r.ok && r.scope.pairs).toBe('all')
      if (!r.ok) throw new Error('expected a scope')
      const classes = await schoolClassesRepository.list(db, r.scope)
      expect(classes.every((c) => c.school_id === schoolA)).toBe(true)
      expect(classes.map((c) => c.id)).not.toContain(classB)
    })
    it('a teacher gets no pairs (no access) until assignments exist', async () => {
      const r = await loadSchoolScope(db, teacherA.userId, schoolA, ['teacher'])
      expect(r.ok && r.scope.pairs).toEqual([])
    })
  })

  describe('11. schema lint', () => {
    async function schoolTables() {
      const rows = await sql<{ table_name: string }>`
        select table_name from information_schema.tables
        where table_schema = 'public' and table_name like 'school\\_%'`.execute(
        db,
      )
      return rows.rows.map((r) => r.table_name)
    }
    it('every school_ table has school_id NOT NULL, a (school_id, id) unique key, and a repository', async () => {
      const tables = await schoolTables()
      expect(tables.length).toBeGreaterThan(0)
      for (const t of tables) {
        const col = await sql<{ is_nullable: string }>`
          select is_nullable from information_schema.columns
          where table_schema = 'public' and table_name = ${t} and column_name = 'school_id'`.execute(
          db,
        )
        expect(col.rows[0]?.is_nullable, `${t}.school_id`).toBe('NO')
        const key = await sql<{ n: string }>`
          select count(*)::text as n from pg_constraint c
          join pg_class r on r.oid = c.conrelid
          where r.relname = ${t} and c.contype = 'u'
            and (select array_agg(a.attname::text order by a.attname::text) from pg_attribute a
                 where a.attrelid = c.conrelid and a.attnum = any(c.conkey)) = array['id','school_id']`.execute(
          db,
        )
        expect(Number(key.rows[0].n), `${t} unique (school_id, id)`).toBe(1)
        expect(
          Object.keys(SCHOOL_TABLE_REPOSITORIES),
          `${t} has a school-scoped repository`,
        ).toContain(t)
      }
    })
    it('every foreign key between two school_ tables is composite and includes school_id', async () => {
      const fks = await sql<{ name: string; cols: Array<string> }>`
        select c.conname as name,
               (select array_agg(a.attname::text) from pg_attribute a
                where a.attrelid = c.conrelid and a.attnum = any(c.conkey)) as cols
        from pg_constraint c
        join pg_class r on r.oid = c.conrelid
        join pg_class p on p.oid = c.confrelid
        where c.contype = 'f' and r.relname like 'school\\_%' and p.relname like 'school\\_%'`.execute(
        db,
      )
      expect(fks.rows.length).toBeGreaterThan(0)
      for (const fk of fks.rows) {
        expect(fk.cols, fk.name).toContain('school_id')
        expect(fk.cols.length, fk.name).toBeGreaterThanOrEqual(2)
      }
    })
    it('school terms acceptances are append-only', async () => {
      const row = await db
        .selectFrom('school_terms_acceptances')
        .select('id')
        .where('school_id', '=', schoolB)
        .executeTakeFirstOrThrow()
      await expect(
        db
          .updateTable('school_terms_acceptances')
          .set({ terms_version: 'v9' })
          .where('id', '=', row.id)
          .execute(),
      ).rejects.toThrow(/append-only/)
      await expect(
        db
          .deleteFrom('school_terms_acceptances')
          .where('id', '=', row.id)
          .execute(),
      ).rejects.toThrow(/append-only/)
    })
  })

  describe('13. a user in two schools, acting in one', () => {
    it('gets a scope only for the school asked for, with that school own role', async () => {
      const a = await loadSchoolScope(db, both.userId, schoolA)
      const b = await loadSchoolScope(db, both.userId, schoolB)
      expect(a.ok && a.scope.role).toBe('principal')
      expect(b.ok && b.scope.role).toBe('teacher')
      if (!a.ok) throw new Error('expected a scope')
      expect(
        await schoolClassesRepository.findById(db, a.scope, classB),
      ).toBeUndefined()
    })
    it('is not a member of a school they do not belong to', async () => {
      expect(await loadSchoolScope(db, outsider.userId, schoolA)).toEqual({
        ok: false,
        reason: 'not_a_member',
      })
      expect(await loadSchoolScope(db, teacherA.userId, schoolB)).toEqual({
        ok: false,
        reason: 'not_a_member',
      })
      expect(await loadSchoolScope(db, adminA.userId, 'not-a-uuid')).toEqual({
        ok: false,
        reason: 'not_a_member',
      })
    })
    it('schoolsRepository.findForMember hides a school from a non-member', async () => {
      expect(
        await schoolsRepository.findForMember(db, adminA.userId, schoolB),
      ).toBeUndefined()
      expect(
        (await schoolsRepository.findForMember(db, adminA.userId, schoolA))?.id,
      ).toBe(schoolA)
    })
  })

  describe('14. membership is re-read on every request', () => {
    it('route guard: 401 without a session, 404 for a foreign school, 403 for a wrong role, scope otherwise', async () => {
      expect(
        (
          (await requireSchoolRole(
            req(null),
            schoolA,
            'school_admin',
          )) as Response
        ).status,
      ).toBe(401)
      expect(
        (
          (await requireSchoolRole(
            req(adminA),
            schoolB,
            'school_admin',
          )) as Response
        ).status,
      ).toBe(404)
      expect(
        (
          (await requireSchoolRole(
            req(teacherA),
            schoolA,
            'school_admin',
          )) as Response
        ).status,
      ).toBe(403)
      const ok = await requireSchoolRole(req(adminA), schoolA, 'school_admin')
      expect(ok instanceof Response).toBe(false)
      expect((ok as SchoolScope).schoolId).toBe(schoolA)
    })
    it('a deactivated member loses access on the very next request', async () => {
      expect((await loadSchoolScope(db, teacherA.userId, schoolA)).ok).toBe(
        true,
      )
      await db
        .updateTable('school_members')
        .set({ status: 'inactive' })
        .where('school_id', '=', schoolA)
        .where('user_id', '=', teacherA.userId)
        .execute()
      expect(await loadSchoolScope(db, teacherA.userId, schoolA)).toEqual({
        ok: false,
        reason: 'not_a_member',
      })
      expect(
        (
          (await requireSchoolRole(
            req(teacherA),
            schoolA,
            'teacher',
          )) as Response
        ).status,
      ).toBe(404)
      await db
        .updateTable('school_members')
        .set({ status: 'active' })
        .where('school_id', '=', schoolA)
        .where('user_id', '=', teacherA.userId)
        .execute()
    })
    it('a suspended school stops working for all its members', async () => {
      await db
        .updateTable('schools')
        .set({ status: 'suspended' })
        .where('id', '=', schoolA)
        .execute()
      expect(await loadSchoolScope(db, adminA.userId, schoolA)).toEqual({
        ok: false,
        reason: 'not_a_member',
      })
      await db
        .updateTable('schools')
        .set({ status: 'active' })
        .where('id', '=', schoolA)
        .execute()
      expect((await loadSchoolScope(db, adminA.userId, schoolA)).ok).toBe(true)
    })
  })
})
