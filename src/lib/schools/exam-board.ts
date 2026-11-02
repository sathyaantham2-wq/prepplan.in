import type { Db } from '../../db/connection'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError } from './common'

/**
 * The exam-week board (M4 additions plan, section 6): for the office and the principal, one row per paper and
 * section with how far its answer sheets have come. Everything is counted from existing tables; nothing is stored.
 * Teachers keep their own narrower list (the correction screens), so this refuses them.
 */
export type BoardBucket = 'uploaded' | 'marked' | 'waiting' | 'failed' | 'released'

export interface BoardSection {
  sectionId: string
  section: string
  /** Active students of the section. */
  students: number
  /** Students with at least one answer page that passed the page checks. */
  uploaded: number
  /** Marked by the AI and nothing left for a teacher. */
  marked: number
  /** The AI marked them but answers wait for a teacher (or the AI is still working). */
  waiting: number
  /** Marking could not read the sheet, or every page was refused by the upload checks. */
  failed: number
  released: boolean
}

export interface BoardPaper {
  paperId: string
  title: string
  subject: string
  grade: number
  sections: Array<BoardSection>
}

function assertBoardRole(scope: SchoolScope): void {
  if (scope.role !== 'school_admin' && scope.role !== 'principal')
    throw new SchoolError('forbidden', 'Only the principal and the school office can see the exam-week board.')
}

type StudentState = {
  studentId: string
  name: string
  rollNo: string | null
  sectionId: string
  uploaded: boolean
  status: 'none' | 'marked' | 'waiting' | 'failed' | 'ready'
  reason: string | null
}

/** Where every active student of every section of the paper stands, as plain facts. */
async function paperStudents(db: Db, scope: SchoolScope, paper: { id: string; class_id: string }): Promise<Array<StudentState>> {
  const students = await db
    .selectFrom('school_students as ss')
    .innerJoin('students as st', 'st.id', 'ss.student_id')
    .innerJoin('school_sections as sec', 'sec.id', 'ss.section_id')
    .select(['ss.id as id', 'ss.roll_no as roll_no', 'ss.section_id as section_id', 'st.name as name'])
    .where('ss.school_id', '=', scope.schoolId)
    .where('ss.status', '=', 'active')
    .where('sec.class_id', '=', paper.class_id)
    .execute()
  const sheets = await db
    .selectFrom('school_own_sheets')
    .select(['school_student_id', 'kind', 'status', 'check_state'])
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paper.id)
    .execute()
  const marking = await db
    .selectFrom('school_sheet_marking')
    .select(['school_student_id', 'status', 'message'])
    .where('school_id', '=', scope.schoolId)
    .where('paper_id', '=', paper.id)
    .execute()
  return students.map((s) => {
    const mine = sheets.filter((x) => x.school_student_id === s.id)
    const pages = mine.filter((x) => x.status === 'placed' && x.kind === 'page' && x.check_state !== 'refused')
    const refused = mine.some((x) => x.check_state === 'refused')
    const m = marking.find((x) => x.school_student_id === s.id)
    let status: StudentState['status'] = pages.length === 0 ? 'none' : 'ready'
    let reason: string | null = null
    if (m?.status === 'marked') status = 'marked'
    else if (m?.status === 'needs_teacher' || m?.status === 'checking') status = 'waiting'
    else if (m?.status === 'rejected') {
      status = 'failed'
      reason = m.message
    } else if (pages.length === 0 && refused) {
      status = 'failed'
      reason = 'Every page of this sheet was refused by the upload checks. Upload clearer photos.'
    }
    return {
      studentId: s.id,
      name: s.name,
      rollNo: s.roll_no,
      sectionId: s.section_id,
      uploaded: pages.length > 0,
      status,
      reason,
    }
  })
}

async function board(db: Db, scope: SchoolScope, only?: string) {
  let q = db
    .selectFrom('school_own_papers as p')
    .innerJoin('school_subjects as ssub', 'ssub.id', 'p.school_subject_id')
    .innerJoin('subjects as sub', 'sub.id', 'ssub.subject_id')
    .innerJoin('school_classes as cls', 'cls.id', 'p.class_id')
    .select(['p.id as id', 'p.title as title', 'p.class_id as class_id', 'sub.name as subject', 'cls.grade as grade'])
    .where('p.school_id', '=', scope.schoolId)
    .where('p.archived_at', 'is', null)
    .where('p.status', '=', 'approved')
  if (only) q = q.where('p.id', '=', only)
  const papers = await q.orderBy('p.created_at', 'desc').execute()
  const sections = await db
    .selectFrom('school_sections')
    .select(['id', 'name', 'class_id'])
    .where('school_id', '=', scope.schoolId)
    .orderBy('name')
    .execute()
  const releases = await db
    .selectFrom('school_paper_releases')
    .select(['paper_id', 'section_id'])
    .where('school_id', '=', scope.schoolId)
    .execute()
  return { papers, sections, releases }
}

/** Every approved paper with its sections' counts, and the totals across all of them. */
export async function examBoard(db: Db, scope: SchoolScope) {
  assertBoardRole(scope)
  const { papers, sections, releases } = await board(db, scope)
  const out: Array<BoardPaper> = []
  for (const p of papers) {
    const students = await paperStudents(db, scope, { id: p.id, class_id: p.class_id })
    out.push({
      paperId: p.id,
      title: p.title,
      subject: p.subject,
      grade: p.grade,
      sections: sections
        .filter((s) => s.class_id === p.class_id)
        .map((s) => {
          const mine = students.filter((x) => x.sectionId === s.id)
          return {
            sectionId: s.id,
            section: s.name,
            students: mine.length,
            uploaded: mine.filter((x) => x.uploaded).length,
            marked: mine.filter((x) => x.status === 'marked').length,
            waiting: mine.filter((x) => x.status === 'waiting').length,
            failed: mine.filter((x) => x.status === 'failed').length,
            released: releases.some((r) => r.paper_id === p.id && r.section_id === s.id),
          }
        }),
    })
  }
  const all = out.flatMap((p) => p.sections)
  return {
    papers: out,
    totals: {
      students: all.reduce((n, s) => n + s.students, 0),
      uploaded: all.reduce((n, s) => n + s.uploaded, 0),
      marked: all.reduce((n, s) => n + s.marked, 0),
      waiting: all.reduce((n, s) => n + s.waiting, 0),
      failed: all.reduce((n, s) => n + s.failed, 0),
      sectionsReleased: all.filter((s) => s.released).length,
      sections: all.length,
    },
  }
}

/** The students behind one count, with the plain reason for a failed one. */
export async function boardStudents(
  db: Db,
  scope: SchoolScope,
  paperId: string,
  sectionId: string,
  bucket: BoardBucket,
) {
  assertBoardRole(scope)
  const { papers, releases } = await board(db, scope, paperId)
  const paper = papers.at(0)
  if (!paper) throw new SchoolError('not_found', 'Paper not found.')
  const all = (await paperStudents(db, scope, { id: paper.id, class_id: paper.class_id })).filter((s) => s.sectionId === sectionId)
  const released = releases.some((r) => r.paper_id === paperId && r.section_id === sectionId)
  const keep = (s: StudentState) =>
    bucket === 'uploaded'
      ? s.uploaded
      : bucket === 'marked'
        ? s.status === 'marked'
        : bucket === 'waiting'
          ? s.status === 'waiting'
          : bucket === 'failed'
            ? s.status === 'failed'
            : released && s.status === 'marked'
  return all
    .filter(keep)
    .sort((a, b) => (Number(a.rollNo?.replace(/\D/g, '')) || 0) - (Number(b.rollNo?.replace(/\D/g, '')) || 0))
    .map((s) => ({ studentId: s.studentId, name: s.name, rollNo: s.rollNo, status: s.status, reason: s.reason }))
}
