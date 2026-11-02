import type { Db } from '../../../db/connection'
import { examSummaries, topicRows } from '../progress-calc'
import { lockedFor } from '../progress'
import { examHighlights, firstName, parentFocus } from './content'
import type { ParentFocusItem } from './content'
import { verifyParentLink } from './link-token'

// The read-only page behind a personal link (plan section 3): one child, one report, no login. It shows a
// first name only, the class, the school and the same small shape a message carries. It is loaded with a
// server-side check on every visit that the student is still an active student of that school.

export type ParentView =
  | { state: 'invalid' }
  | {
      state: 'exam'
      child: string
      grade: number
      section: string
      school: string
      subject: string
      exam: string
      earned: number
      max: number
      pct: number
      strength: string | null
      practise: Array<string>
      /** True while the dispute window is open: the mark may still change. */
      final: boolean
      windowClosesAt: string
      expiresAt: string
    }
  | {
      state: 'focus'
      child: string
      grade: number
      section: string
      school: string
      focus: Array<ParentFocusItem>
      expiresAt: string
    }

const INVALID: ParentView = { state: 'invalid' }

export async function loadParentView(db: Db, token: string, now = new Date()): Promise<ParentView> {
  const claims = verifyParentLink(token, now)
  if (!claims) return INVALID
  const who = await db
    .selectFrom('school_students as s')
    .innerJoin('school_members as m', 'm.id', 's.member_id')
    .innerJoin('users as u', 'u.id', 'm.user_id')
    .innerJoin('school_sections as sec', 'sec.id', 's.section_id')
    .innerJoin('school_classes as c', 'c.id', 'sec.class_id')
    .innerJoin('schools as sch', 'sch.id', 's.school_id')
    .select(['s.id', 's.section_id', 'u.name', 'c.grade', 'sec.name as section', 'sch.name as school'])
    .where('s.school_id', '=', claims.s)
    .where('s.id', '=', claims.st)
    .where('s.status', '=', 'active')
    .executeTakeFirst()
  if (!who) return INVALID
  const base = {
    child: firstName(who.name),
    grade: who.grade,
    section: who.section,
    school: who.school,
    expiresAt: new Date(claims.exp * 1000).toISOString(),
  }
  const data = (
    await lockedFor(db, claims.s, [{ studentId: who.id, sectionId: who.section_id }], claims.k === 'exam')
  ).get(who.id)!
  if (claims.k === 'exam') {
    const exam = data.exams.find((e) => e.paperId === claims.r)
    if (!exam) return INVALID
    const [summary] = examSummaries([exam], data.answers.filter((a) => a.paperId === exam.paperId))
    const h = examHighlights(exam.paperId, data.answers)
    return {
      state: 'exam',
      ...base,
      subject: exam.subject,
      exam: exam.title,
      earned: summary.earned,
      max: summary.max,
      pct: summary.pct,
      strength: h.strength,
      practise: h.practise,
      final: exam.lockedAt !== null,
      windowClosesAt: exam.windowClosesAt.toISOString(),
    }
  }
  return {
    state: 'focus',
    ...base,
    focus: parentFocus(data.exams, data.answers, topicRows(data.exams, data.answers)),
  }
}
