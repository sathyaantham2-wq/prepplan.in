import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// 0102 left two keys between school tables without school_id, which the school-isolation schema lint catches: a
// version or a "set B" could in principle point at another school's exam. Both become composite (school_id, id)
// keys, like every other link between school tables. Constraints only: no data changes.
export async function up(db: Kysely<any>): Promise<void> {
  await sql`alter table school_exam_versions add constraint school_exam_versions_school_id_id_key unique (school_id, id)`.execute(db)
  await sql`alter table school_exam_versions drop constraint school_exam_versions_exam_id_fkey`.execute(db)
  await sql`alter table school_exam_versions add constraint school_exam_versions_exam_fk foreign key (school_id, exam_id) references school_exams (school_id, id) on delete restrict`.execute(db)
  await sql`alter table school_exams drop constraint school_exams_set_of_fkey`.execute(db)
  await sql`alter table school_exams add constraint school_exams_set_of_fk foreign key (school_id, set_of) references school_exams (school_id, id) on delete restrict`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`alter table school_exams drop constraint school_exams_set_of_fk`.execute(db)
  await sql`alter table school_exams add constraint school_exams_set_of_fkey foreign key (set_of) references school_exams (id) on delete restrict`.execute(db)
  await sql`alter table school_exam_versions drop constraint school_exam_versions_exam_fk`.execute(db)
  await sql`alter table school_exam_versions add constraint school_exam_versions_exam_id_fkey foreign key (exam_id) references school_exams (id) on delete restrict`.execute(db)
  await sql`alter table school_exam_versions drop constraint school_exam_versions_school_id_id_key`.execute(db)
}
