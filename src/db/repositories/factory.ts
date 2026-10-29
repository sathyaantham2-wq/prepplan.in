import type { Insertable, Selectable, Updateable } from 'kysely'
import type { Db } from '../connection'
import type { DB } from '../types'
import type { SchoolScope } from '../school-scope'

type TableName = keyof DB & string

/**
 * Repository for a table with no direct household_id/student_id column — global reference data
 * (subjects, questions, ...) or a table whose tenant ownership only exists via a join, which the
 * caller must check itself.
 *
 * There is deliberately no `remove`/`delete` method anywhere in this file: CLAUDE.md invariant 4
 * is "nothing is deleted" — rows move through a status column (draft/approved/retired,
 * pending/completed, ...) instead. If a future feature genuinely needs a hard delete, that is a
 * decision for that feature to justify explicitly, not a default this layer provides.
 *
 * Internals lean on `as any` because Kysely's query builder methods are overloaded and TypeScript
 * cannot pick an overload when the table is a generic type parameter — this is Kysely's own
 * documented shape for building a generic repository helper. The `as any` stays inside this one
 * factory; every call site gets back a fully typed `Selectable<DB[TTable]>`.
 */
export function createRepository<TTable extends TableName>(table: TTable) {
  const anyDb = (db: Db) => db as any

  return {
    async findById(db: Db, id: string) {
      return anyDb(db)
        .selectFrom(table)
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst() as Promise<Selectable<DB[TTable]> | undefined>
    },
    async list(db: Db) {
      return anyDb(db).selectFrom(table).selectAll().execute() as Promise<
        Array<Selectable<DB[TTable]>>
      >
    },
    async insert(db: Db, row: Insertable<DB[TTable]>) {
      return anyDb(db)
        .insertInto(table)
        .values(row)
        .returningAll()
        .executeTakeFirstOrThrow() as Promise<Selectable<DB[TTable]>>
    },
    async update(db: Db, id: string, row: Updateable<DB[TTable]>) {
      return anyDb(db)
        .updateTable(table)
        .set(row)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow() as Promise<Selectable<DB[TTable]>>
    },
  }
}

/**
 * Repository for a table with a direct household_id or student_id column. findById/list/update
 * all require that scope value as a parameter, so it is structurally impossible to query this
 * table without it — a route handler cannot forget the household/student filter because the
 * repository call will not type-check without one.
 *
 * scopeColumn's value is always a plain uuid string in this schema (household_id, student_id),
 * never nullable or Generated, so the scope parameter is typed as plain `string` rather than
 * derived generically from the column type.
 */
export function createScopedRepository<
  TTable extends TableName,
  TScope extends keyof DB[TTable] & string,
>(table: TTable, scopeColumn: TScope) {
  const anyDb = (db: Db) => db as any

  return {
    async findById(db: Db, scope: string, id: string) {
      return anyDb(db)
        .selectFrom(table)
        .selectAll()
        .where('id', '=', id)
        .where(scopeColumn, '=', scope)
        .executeTakeFirst() as Promise<Selectable<DB[TTable]> | undefined>
    },
    async list(db: Db, scope: string) {
      return anyDb(db)
        .selectFrom(table)
        .selectAll()
        .where(scopeColumn, '=', scope)
        .execute() as Promise<Array<Selectable<DB[TTable]>>>
    },
    async insert(db: Db, row: Insertable<DB[TTable]>) {
      return anyDb(db)
        .insertInto(table)
        .values(row)
        .returningAll()
        .executeTakeFirstOrThrow() as Promise<Selectable<DB[TTable]>>
    },
    async update(
      db: Db,
      scope: string,
      id: string,
      row: Updateable<DB[TTable]>,
    ) {
      return anyDb(db)
        .updateTable(table)
        .set(row)
        .where('id', '=', id)
        .where(scopeColumn, '=', scope)
        .returningAll()
        .executeTakeFirstOrThrow() as Promise<Selectable<DB[TTable]>>
    },
  }
}

/**
 * Repository for a school-side table (ADR-0003). Every method takes a SchoolScope, a branded value
 * only src/lib/school-session.ts can issue, and bakes `school_id = scope.schoolId` into the query.
 * insert() overwrites school_id with the scope's, so a row can never be written into another
 * school; update() refuses to change school_id. As everywhere in this file there is no delete.
 * The composite foreign keys in the migrations are the second layer under this one.
 */
export function createSchoolScopedRepository<TTable extends TableName>(
  table: TTable,
) {
  const anyDb = (db: Db) => db as any

  return {
    async findById(db: Db, scope: SchoolScope, id: string) {
      return anyDb(db)
        .selectFrom(table)
        .selectAll()
        .where('id', '=', id)
        .where('school_id', '=', scope.schoolId)
        .executeTakeFirst() as Promise<Selectable<DB[TTable]> | undefined>
    },
    async list(db: Db, scope: SchoolScope) {
      return anyDb(db)
        .selectFrom(table)
        .selectAll()
        .where('school_id', '=', scope.schoolId)
        .execute() as Promise<Array<Selectable<DB[TTable]>>>
    },
    async insert(
      db: Db,
      scope: SchoolScope,
      row: Omit<Insertable<DB[TTable]>, 'school_id'>,
    ) {
      return anyDb(db)
        .insertInto(table)
        .values({ ...row, school_id: scope.schoolId })
        .returningAll()
        .executeTakeFirstOrThrow() as Promise<Selectable<DB[TTable]>>
    },
    async update(
      db: Db,
      scope: SchoolScope,
      id: string,
      row: Omit<Updateable<DB[TTable]>, 'school_id'>,
    ) {
      if ('school_id' in row) throw new Error('school_id cannot be changed')
      return anyDb(db)
        .updateTable(table)
        .set(row)
        .where('id', '=', id)
        .where('school_id', '=', scope.schoolId)
        .returningAll()
        .executeTakeFirstOrThrow() as Promise<Selectable<DB[TTable]>>
    },
  }
}
