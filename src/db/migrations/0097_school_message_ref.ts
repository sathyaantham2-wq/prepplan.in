import type { Kysely } from 'kysely'

// A message that links to one exam (a parent's result link, a teacher's upload or query screen) remembers WHICH paper
// in one column, not in the template variables: the variables are only what the template shows, and the link itself
// is made at send time (a parent's link expires 7 days after it is sent).
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('school_messages').addColumn('ref_paper_id', 'uuid').execute()
  await db.schema
    .alterTable('school_messages')
    .addForeignKeyConstraint('school_messages_paper_fk', ['school_id', 'ref_paper_id'], 'school_own_papers', ['school_id', 'id'], (cb) =>
      cb.onDelete('restrict'),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('school_messages').dropConstraint('school_messages_paper_fk').execute()
  await db.schema.alterTable('school_messages').dropColumn('ref_paper_id').execute()
}
