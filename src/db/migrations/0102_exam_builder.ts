import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// Teacher control over question selection in "Make paper" (docs/SCHOOLS_MODULE_PLAN.md section 16). Additive only:
// every existing paper becomes a finished ("final") version 1 made in Quick mode, and its exact questions are recorded
// as version 1, so "used before" works for old papers too. Nothing is deleted. Local first; the owner runs it on production.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('school_exams')
    .addColumn('stage', 'text', (col) => col.notNull().defaultTo('final').check(sql`stage in ('building', 'final')`))
    .addColumn('mode', 'text', (col) => col.notNull().defaultTo('quick').check(sql`mode in ('quick', 'auto_edit', 'hand_pick')`))
    .addColumn('version', 'integer', (col) => col.notNull().defaultTo(1))
    .addColumn('set_label', 'text', (col) => col.check(sql`set_label in ('A', 'B')`))
    .addColumn('set_of', 'uuid', (col) => col.references('school_exams.id').onDelete('restrict'))
    .addColumn('edited_at', 'timestamptz')
    .execute()
  await db.schema
    .alterTable('school_exam_questions')
    .addColumn('locked', 'boolean', (col) => col.notNull().defaultTo(false))
    .execute()
  await db.schema
    .createTable('school_exam_versions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('school_id', 'uuid', (col) => col.notNull().references('schools.id').onDelete('restrict'))
    .addColumn('exam_id', 'uuid', (col) => col.notNull().references('school_exams.id').onDelete('restrict'))
    .addColumn('version', 'integer', (col) => col.notNull())
    .addColumn('finalized_by_user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('finalized_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
    // [{ question_id, section, slot, position, marks, choice_group, is_alternate }]
    .addColumn('questions', 'jsonb', (col) => col.notNull())
    .addColumn('printed_marks', 'integer', (col) => col.notNull())
    .addUniqueConstraint('school_exam_versions_exam_version', ['exam_id', 'version'])
    .execute()
  await sql`create index school_exam_versions_school on school_exam_versions (school_id, finalized_at)`.execute(db)
  // every paper made so far is version 1 of itself
  await sql`
    insert into school_exam_versions (school_id, exam_id, version, finalized_by_user_id, finalized_at, questions, printed_marks)
    select e.school_id, e.id, 1, e.created_by_user_id, e.created_at,
      coalesce((select jsonb_agg(jsonb_build_object(
        'question_id', q.question_id, 'section', q.section, 'slot', q.slot, 'position', q.position,
        'marks', q.marks, 'choice_group', q.choice_group, 'is_alternate', q.is_alternate) order by q.position, q.is_alternate)
        from school_exam_questions q where q.exam_id = e.id), '[]'::jsonb),
      e.printed_marks
    from school_exams e`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('school_exam_versions').execute()
  await db.schema.alterTable('school_exam_questions').dropColumn('locked').execute()
  await db.schema
    .alterTable('school_exams')
    .dropColumn('edited_at')
    .dropColumn('set_of')
    .dropColumn('set_label')
    .dropColumn('version')
    .dropColumn('mode')
    .dropColumn('stage')
    .execute()
}
