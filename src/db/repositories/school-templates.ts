import { sql } from 'kysely'
import type { Db } from '../connection'
import { createSchoolScopedRepository } from './factory'
import type { SchoolScope } from '../school-scope'

// The special tags a question can carry that decide which slot it may fill (src/lib/school-paper.ts
// SPECIAL_TAGS). Kept as plain text here so this file has no dependency on lib/.
const SPECIAL = ['case_study', 'map', 'construction', 'figure']

export const schoolPaperTemplatesRepository = {
  ...createSchoolScopedRepository('school_paper_templates'),
  async listActive(db: Db, scope: SchoolScope) {
    return db
      .selectFrom('school_paper_templates')
      .selectAll()
      .where('school_id', '=', scope.schoolId)
      .where('status', '=', 'active')
      .orderBy('name')
      .execute()
  },
  async activeByKey(db: Db, scope: SchoolScope, key: string) {
    return db
      .selectFrom('school_paper_templates')
      .selectAll()
      .where('school_id', '=', scope.schoolId)
      .where('template_key', '=', key)
      .where('status', '=', 'active')
      .executeTakeFirst()
  },
}

export interface ChapterListRow {
  id: string
  sourceId: string
  sourceTitle: string
  part: string
  chapterNo: number
  name: string
  discipline: string | null
  concepts: number
  approvedQuestions: number
}

/**
 * Global question-bank reads for the paper layout screens. The bank is not school data (it is the
 * same for every school), so these take no scope; the service checks the caller may use the subject.
 */
export const bankRepository = {
  /** Chapters of a subject, identified by book, part and chapter number, with how much the bank holds. */
  async chaptersForSubject(
    db: Db,
    subjectId: string,
  ): Promise<Array<ChapterListRow>> {
    const rows = await db
      .selectFrom('chapters as ch')
      .innerJoin('sources as so', 'so.id', 'ch.source_id')
      .select([
        'ch.id',
        'ch.source_id',
        'so.title as source_title',
        'ch.part',
        'ch.chapter_no',
        'ch.name',
        'ch.discipline',
        'ch.order_index',
        sql<string>`(select count(*) from concepts c where c.chapter_id = ch.id)`.as(
          'concepts',
        ),
        sql<string>`(select count(*) from questions q join concepts c on c.id = q.concept_id where c.chapter_id = ch.id and q.status = 'approved')`.as(
          'approved',
        ),
      ])
      .where('ch.subject_id', '=', subjectId)
      .orderBy('so.title')
      .orderBy('ch.part')
      .orderBy('ch.chapter_no')
      .execute()
    return rows.map((r) => ({
      id: r.id,
      sourceId: r.source_id,
      sourceTitle: r.source_title,
      part: r.part,
      chapterNo: r.chapter_no,
      name: r.name,
      discipline: r.discipline,
      concepts: Number(r.concepts),
      approvedQuestions: Number(r.approved),
    }))
  },

  /** Approved questions of the given chapters, counted by what decides which slot they fit. */
  async bankRows(db: Db, chapterIds: ReadonlyArray<string>) {
    if (chapterIds.length === 0) return []
    const res = await sql<{
      chapter_id: string
      type: string
      marks: number
      bloom: string
      special: string
      has_diagram: boolean
      n: number
    }>`
      select c.chapter_id, q.type, q.marks, q.bloom,
        coalesce((select string_agg(t, ',' order by t) from unnest(q.tags) as t where t = any(${SPECIAL}::text[])), '') as special,
        (q.diagram_kind is not null) as has_diagram,
        count(*)::int as n
      from questions q
      join concepts c on c.id = q.concept_id
      where q.status = 'approved' and c.chapter_id = any(${sql.val([...chapterIds])}::uuid[])
      group by c.chapter_id, q.type, q.marks, q.bloom, special, has_diagram
    `.execute(db)
    return res.rows.map((r) => ({
      chapterId: r.chapter_id,
      type: r.type,
      marks: r.marks,
      bloom: r.bloom,
      special: r.special,
      hasDiagram: r.has_diagram,
      n: r.n,
    }))
  },
}
