import type { Db } from '../../../db/connection'
import { tr } from '../../school-i18n'
import type { Key } from '../../school-i18n'
import { countedAnswers, examSummaries, topicRows } from '../progress-calc'
import { lockedFor } from '../progress'
import { schoolAiStatus } from '../school-ai-budget'
import { FILL, examHighlights, fellTwice, firstName, marksText, parentFocus } from './content'
import { istDayLabel, istParts } from './ist'
import { enqueueMessage } from './queue'
import type { EnqueueInput } from './queue'
import type { Lang } from './templates'

// The events (plan section 1): WHAT is said and to WHOM. Each function only queues messages; the dispatcher decides
// whether and when they leave. Every parent message is built from the small shape in content.ts, so worrying news
// (a student falling two tests in a row) cannot reach a parent: it is queued for the class teacher only.
//
// There is no weekly cap on parent messages (owner decision 2026-11-01: the principal will choose a limit in his own
// settings in a later stage). Every message is still idempotent through its dedupe key.

const MS_DAY = 86_400_000
const OPEN_EXAM_DAYS = 45

async function put(db: Db, input: EnqueueInput): Promise<boolean> {
  try {
    return (await enqueueMessage(db, input)) !== null
  } catch (e) {
    console.error('school message not queued', input.template, e)
    return false
  }
}

const langOf = (v: string | null | undefined): Lang => (v === 'te' ? 'te' : 'en')

export async function messagingSchools(db: Db, schoolId?: string) {
  return db
    .selectFrom('schools')
    .select(['id', 'name'])
    .where('messaging_enabled', '=', true)
    .where('status', '=', 'active')
    .$if(schoolId !== undefined, (q) => q.where('id', '=', schoolId!))
    .execute()
}

interface Section {
  id: string
  label: string
  classId: string
  classTeacherMemberId: string | null
}
async function sectionsOf(db: Db, schoolId: string): Promise<Map<string, Section>> {
  const rows = await db
    .selectFrom('school_sections as s')
    .innerJoin('school_classes as c', 'c.id', 's.class_id')
    .select(['s.id', 's.name', 's.class_id', 's.class_teacher_member_id', 'c.grade'])
    .where('s.school_id', '=', schoolId)
    .execute()
  return new Map(rows.map((r) => [r.id, { id: r.id, label: `${r.grade}${r.name}`, classId: r.class_id, classTeacherMemberId: r.class_teacher_member_id }]))
}

interface Person {
  memberId: string
  name: string
  lang: Lang
}
async function people(db: Db, schoolId: string, memberIds: ReadonlyArray<string>): Promise<Map<string, Person>> {
  if (memberIds.length === 0) return new Map()
  const rows = await db
    .selectFrom('school_members as m')
    .innerJoin('users as u', 'u.id', 'm.user_id')
    .select(['m.id', 'u.name', 'm.message_language'])
    .where('m.school_id', '=', schoolId)
    .where('m.status', '=', 'active')
    .where('m.id', 'in', [...new Set(memberIds)])
    .execute()
  return new Map(rows.map((r) => [r.id, { memberId: r.id, name: firstName(r.name), lang: langOf(r.message_language) }]))
}

/** The teachers of a section-subject (the assigned ones); the class teacher when nobody is assigned. */
async function teachersOf(db: Db, schoolId: string, sectionId: string, schoolSubjectId: string | null, sec?: Section): Promise<Array<string>> {
  const rows = await db
    .selectFrom('school_teacher_assignments')
    .select('member_id')
    .where('school_id', '=', schoolId)
    .where('section_id', '=', sectionId)
    .$if(schoolSubjectId !== null, (q) => q.where('school_subject_id', '=', schoolSubjectId!))
    .execute()
  const ids = rows.map((r) => r.member_id)
  if (ids.length === 0 && sec?.classTeacherMemberId) ids.push(sec.classTeacherMemberId)
  return [...new Set(ids)]
}

interface ParentTarget {
  guardianId: string
  language: Lang
}
/** Students whose parent has said yes, has a phone and has not replied STOP. (The dispatcher checks again when it sends.) */
async function parentTargets(db: Db, schoolId: string, studentIds: ReadonlyArray<string>): Promise<Map<string, ParentTarget>> {
  if (studentIds.length === 0) return new Map()
  const perms = await db
    .selectFrom('school_parent_messaging')
    .select(['school_student_id', 'language'])
    .where('school_id', '=', schoolId)
    .where('whatsapp_ok', '=', true)
    .where('opted_out_at', 'is', null)
    .where('school_student_id', 'in', [...studentIds])
    .execute()
  if (perms.length === 0) return new Map()
  const guardians = await db
    .selectFrom('school_student_guardians')
    .select(['id', 'school_student_id'])
    .where('school_id', '=', schoolId)
    .where('school_student_id', 'in', perms.map((p) => p.school_student_id))
    .orderBy('created_at')
    .execute()
  const first = new Map<string, string>()
  for (const g of guardians) if (!first.has(g.school_student_id)) first.set(g.school_student_id, g.id)
  const out = new Map<string, ParentTarget>()
  for (const p of perms) {
    const g = first.get(p.school_student_id)
    if (g) out.set(p.school_student_id, { guardianId: g, language: langOf(p.language) })
  }
  return out
}

async function activeStudents(db: Db, schoolId: string, sectionId?: string) {
  const rows = await db
    .selectFrom('school_students as s')
    .innerJoin('school_members as m', 'm.id', 's.member_id')
    .innerJoin('users as u', 'u.id', 'm.user_id')
    .select(['s.id', 's.section_id', 'u.name'])
    .where('s.school_id', '=', schoolId)
    .where('s.status', '=', 'active')
    .$if(sectionId !== undefined, (q) => q.where('s.section_id', '=', sectionId!))
    .execute()
  return rows.map((r) => ({ id: r.id, sectionId: r.section_id, name: r.name, first: firstName(r.name) }))
}

// ---------------------------------------------------------------- result_ready and teacher_attention

/** After a section's results are released: one message to each parent who agreed, and a quiet word to the class teacher about a student who fell twice. */
export async function queueResultReady(
  db: Db,
  schoolId: string,
  paperId: string,
  sectionId: string,
): Promise<{ parents: number; teacher: number }> {
  const out = { parents: 0, teacher: 0 }
  if ((await messagingSchools(db, schoolId)).length === 0) return out
  const release = await db
    .selectFrom('school_paper_releases')
    .select('window_days')
    .where('school_id', '=', schoolId)
    .where('paper_id', '=', paperId)
    .where('section_id', '=', sectionId)
    .executeTakeFirst()
  const school = await db.selectFrom('schools').select('name').where('id', '=', schoolId).executeTakeFirstOrThrow()
  const students = await activeStudents(db, schoolId, sectionId)
  const marked = new Set(
    (
      await db
        .selectFrom('school_sheet_marking')
        .select('school_student_id')
        .where('school_id', '=', schoolId)
        .where('paper_id', '=', paperId)
        .where('status', '=', 'marked')
        .execute()
    ).map((m) => m.school_student_id),
  )
  const here = students.filter((s) => marked.has(s.id))
  if (here.length === 0 || !release) return out
  const data = await lockedFor(db, schoolId, here.map((s) => ({ studentId: s.id, sectionId })), true)
  const targets = await parentTargets(db, schoolId, here.map((s) => s.id))
  const secs = await sectionsOf(db, schoolId)
  const sec = secs.get(sectionId)
  const classTeacher = sec?.classTeacherMemberId ? (await people(db, schoolId, [sec.classTeacherMemberId])).get(sec.classTeacherMemberId) : undefined
  for (const s of here) {
    const d = data.get(s.id)!
    const exam = d.exams.find((e) => e.paperId === paperId)
    if (!exam) continue
    const summaries = examSummaries(d.exams, d.answers)
    const mine = summaries.find((x) => x.paperId === paperId)!
    const t = targets.get(s.id)
    if (t) {
      const h = examHighlights(paperId, d.answers)
      const l = t.language
      const ok = await put(db, {
        schoolId,
        template: 'result_ready',
        language: l,
        studentId: s.id,
        guardianId: t.guardianId,
        paperId,
        dedupeKey: `result_ready:${paperId}:${s.id}`,
        variables: {
          school: school.name,
          child: s.first,
          subject: exam.subject,
          exam: exam.title,
          score: `${marksText(mine.earned)}/${marksText(mine.max)}`,
          strength: h.strength ?? FILL.strength[l],
          practise_1: h.practise[0] ?? FILL.practise_1[l],
          practise_2: h.practise[1] ?? FILL.practise_2[l],
          window_days: String(release.window_days),
        },
      })
      if (ok) out.parents += 1
    }
    // worrying news goes to the class teacher only
    const series = summaries.filter((x) => x.subject === exam.subject).map((x) => x.pct)
    if (classTeacher && fellTwice(series)) {
      const ok = await put(db, {
        schoolId,
        template: 'teacher_attention',
        language: classTeacher.lang,
        memberId: classTeacher.memberId,
        paperId,
        dedupeKey: `teacher_attention:${paperId}:${s.id}`,
        variables: { teacher: classTeacher.name, child: s.first, section: sec!.label, subject: exam.subject },
      })
      if (ok) out.teacher += 1
    }
  }
  return out
}

// ---------------------------------------------------------------- weekly_focus

export async function queueWeeklyFocus(db: Db, schoolId: string, now: Date): Promise<number> {
  const students = await activeStudents(db, schoolId)
  const targets = await parentTargets(db, schoolId, students.map((s) => s.id))
  const mine = students.filter((s) => targets.has(s.id))
  if (mine.length === 0) return 0
  const data = await lockedFor(db, schoolId, mine.map((s) => ({ studentId: s.id, sectionId: s.sectionId })))
  const date = istParts(now).date
  let n = 0
  for (const s of mine) {
    const d = data.get(s.id)!
    // skip when nothing new has been locked since last week
    if (!d.exams.some((e) => e.releasedAt.getTime() > now.getTime() - 7 * MS_DAY)) continue
    const focus = parentFocus(d.exams, d.answers, topicRows(d.exams, d.answers))
    if (focus.length === 0) continue
    const t = targets.get(s.id)!
    const l = t.language
    const text = (i: number) => {
      const f = focus[i] as (typeof focus)[number] | undefined
      if (!f) return FILL.focus[l]
      return f.kind === 'habit' && f.habit ? tr(l, `habit_${f.habit}` as Key) : f.title
    }
    if (await put(db, { schoolId, template: 'weekly_focus', language: l, studentId: s.id, guardianId: t.guardianId, dedupeKey: `weekly_focus:${s.id}:${date}`, variables: { child: s.first, focus_1: text(0), focus_2: text(1), focus_3: text(2) } })) n += 1
  }
  return n
}

// ---------------------------------------------------------------- teacher reminders

interface OpenItem {
  sectionId: string
  schoolSubjectId: string
  at: Date
}
/** Answers flagged for a teacher's decision, and students' queries waiting for one. */
async function openFlags(db: Db, schoolId: string): Promise<Array<OpenItem>> {
  const marks = await db
    .selectFrom('school_answer_marks as am')
    .innerJoin('school_own_papers as p', 'p.id', 'am.paper_id')
    .innerJoin('school_students as st', 'st.id', 'am.school_student_id')
    .select(['st.section_id', 'p.school_subject_id', 'am.created_at', 'am.changed_at'])
    .where('am.school_id', '=', schoolId)
    .where('am.state', '=', 'flagged')
    .where('p.archived_at', 'is', null)
    .execute()
  const disputes = await db
    .selectFrom('school_answer_disputes as d')
    .innerJoin('school_own_papers as p', 'p.id', 'd.paper_id')
    .innerJoin('school_students as st', 'st.id', 'd.school_student_id')
    .select(['st.section_id', 'p.school_subject_id', 'd.created_at'])
    .where('d.school_id', '=', schoolId)
    .where('d.status', '=', 'with_teacher')
    .execute()
  return [
    ...marks.map((m) => ({ sectionId: m.section_id, schoolSubjectId: m.school_subject_id, at: m.changed_at ?? m.created_at })),
    ...disputes.map((m) => ({ sectionId: m.section_id, schoolSubjectId: m.school_subject_id, at: m.created_at })),
  ]
}

export async function queueFlagsWaiting(db: Db, schoolId: string, now: Date): Promise<number> {
  const items = await openFlags(db, schoolId)
  if (items.length === 0) return 0
  const assigns = await db
    .selectFrom('school_teacher_assignments')
    .select(['member_id', 'section_id', 'school_subject_id'])
    .where('school_id', '=', schoolId)
    .execute()
  const secs = await sectionsOf(db, schoolId)
  const per = new Map<string, { count: number; oldest: Date; sections: Set<string> }>()
  for (const a of assigns) {
    const mine = items.filter((i) => i.sectionId === a.section_id && i.schoolSubjectId === a.school_subject_id)
    if (mine.length === 0) continue
    const cur = per.get(a.member_id) ?? { count: 0, oldest: mine[0].at, sections: new Set<string>() }
    cur.count += mine.length
    for (const i of mine) if (i.at < cur.oldest) cur.oldest = i.at
    cur.sections.add(secs.get(a.section_id)?.label ?? '')
    per.set(a.member_id, cur)
  }
  const who = await people(db, schoolId, [...per.keys()])
  const date = istParts(now).date
  let n = 0
  for (const [memberId, v] of per) {
    const p = who.get(memberId)
    if (!p) continue
    const days = Math.max(0, Math.floor((now.getTime() - v.oldest.getTime()) / MS_DAY))
    if (await put(db, { schoolId, template: 'flags_waiting', language: p.lang, memberId, dedupeKey: `flags_waiting:${memberId}:${date}`, variables: { teacher: p.name, count: String(v.count), sections: [...v.sections].sort().join(', '), oldest_days: String(days) } })) n += 1
  }
  return n
}

interface MissingSheets {
  paperId: string
  title: string
  schoolSubjectId: string
  sectionId: string
  names: Array<string>
  createdAt: Date
}
/** For every exam still open (approved, not yet released to a section, made in the last 45 days): the students whose sheets are missing. */
export async function missingSheets(db: Db, schoolId: string, now: Date): Promise<Array<MissingSheets>> {
  const papers = await db
    .selectFrom('school_own_papers')
    .select(['id', 'title', 'class_id', 'school_subject_id', 'created_at'])
    .where('school_id', '=', schoolId)
    .where('archived_at', 'is', null)
    .where('approved_at', 'is not', null)
    .where('created_at', '>', new Date(now.getTime() - OPEN_EXAM_DAYS * MS_DAY))
    .execute()
  if (papers.length === 0) return []
  const ids = papers.map((p) => p.id)
  const released = new Set(
    (await db.selectFrom('school_paper_releases').select(['paper_id', 'section_id']).where('school_id', '=', schoolId).where('paper_id', 'in', ids).execute()).map((r) => `${r.paper_id}|${r.section_id}`),
  )
  const have = new Set(
    (
      await db
        .selectFrom('school_own_sheets')
        .select(['paper_id', 'school_student_id'])
        .where('school_id', '=', schoolId)
        .where('paper_id', 'in', ids)
        .where('status', '=', 'placed')
        .where('kind', '=', 'page')
        .execute()
    ).map((s) => `${s.paper_id}|${s.school_student_id}`),
  )
  const students = await activeStudents(db, schoolId)
  const secs = await sectionsOf(db, schoolId)
  const out: Array<MissingSheets> = []
  for (const p of papers)
    for (const sec of secs.values()) {
      if (sec.classId !== p.class_id || released.has(`${p.id}|${sec.id}`)) continue
      const missing = students.filter((s) => s.sectionId === sec.id && !have.has(`${p.id}|${s.id}`)).map((s) => s.first)
      if (missing.length > 0)
        out.push({ paperId: p.id, title: p.title, schoolSubjectId: p.school_subject_id, sectionId: sec.id, names: missing, createdAt: p.created_at })
    }
  return out
}

export async function queueUploadsPending(db: Db, schoolId: string, now: Date): Promise<number> {
  const open = await missingSheets(db, schoolId, now)
  if (open.length === 0) return 0
  const secs = await sectionsOf(db, schoolId)
  const date = istParts(now).date
  let n = 0
  for (const o of open) {
    const sec = secs.get(o.sectionId)!
    const recipients = await teachersOf(db, schoolId, o.sectionId, o.schoolSubjectId, sec)
    const who = await people(db, schoolId, recipients)
    for (const memberId of recipients) {
      const p = who.get(memberId)
      if (!p) continue
      const shown = o.names.slice(0, 8).join(', ')
      const more = o.names.length > 8 ? (p.lang === 'te' ? ` +${o.names.length - 8} మరిన్ని` : ` +${o.names.length - 8} more`) : ''
      if (await put(db, { schoolId, template: 'uploads_pending', language: p.lang, memberId, paperId: o.paperId, dedupeKey: `uploads_pending:${o.paperId}:${o.sectionId}:${memberId}:${date}`, variables: { teacher: p.name, exam: o.title, section: sec.label, names: shown + more } })) n += 1
    }
  }
  return n
}

export async function queueDisputeClosing(db: Db, schoolId: string, now: Date): Promise<number> {
  const closing = await db
    .selectFrom('school_paper_releases as r')
    .innerJoin('school_own_papers as p', 'p.id', 'r.paper_id')
    .select(['r.id', 'r.paper_id', 'r.section_id', 'r.window_closes_at', 'p.title', 'p.school_subject_id'])
    .where('r.school_id', '=', schoolId)
    .where('r.locked_at', 'is', null)
    .where('r.window_closes_at', '>', now)
    .where('r.window_closes_at', '<=', new Date(now.getTime() + MS_DAY))
    .execute()
  if (closing.length === 0) return 0
  const secs = await sectionsOf(db, schoolId)
  let n = 0
  for (const r of closing) {
    const open = await db
      .selectFrom('school_answer_disputes as d')
      .innerJoin('school_students as st', 'st.id', 'd.school_student_id')
      .select('d.id')
      .where('d.school_id', '=', schoolId)
      .where('d.paper_id', '=', r.paper_id)
      .where('st.section_id', '=', r.section_id)
      .where('d.status', '=', 'with_teacher')
      .execute()
    if (open.length === 0) continue
    const sec = secs.get(r.section_id)!
    const recipients = await teachersOf(db, schoolId, r.section_id, r.school_subject_id, sec)
    const who = await people(db, schoolId, recipients)
    for (const memberId of recipients) {
      const p = who.get(memberId)
      if (!p) continue
      if (await put(db, { schoolId, template: 'dispute_closing', language: p.lang, memberId, paperId: r.paper_id, dedupeKey: `dispute_closing:${r.id}:${memberId}`, variables: { teacher: p.name, exam: r.title, section: sec.label, closes: istDayLabel(r.window_closes_at), count: String(open.length) } })) n += 1
    }
  }
  return n
}

// ---------------------------------------------------------------- monday_pulse

export async function queueMondayPulse(db: Db, schoolId: string, now: Date): Promise<number> {
  const school = await db.selectFrom('schools').select('name').where('id', '=', schoolId).executeTakeFirstOrThrow()
  let recipients = (await db.selectFrom('school_members').select('id').where('school_id', '=', schoolId).where('role', '=', 'principal').where('status', '=', 'active').execute()).map((r) => r.id)
  if (recipients.length === 0)
    recipients = (await db.selectFrom('school_members').select('id').where('school_id', '=', schoolId).where('role', '=', 'school_admin').where('status', '=', 'active').execute()).map((r) => r.id)
  if (recipients.length === 0) return 0
  const who = await people(db, schoolId, recipients)
  const students = await activeStudents(db, schoolId)
  const secs = await sectionsOf(db, schoolId)
  const data = await lockedFor(db, schoolId, students.map((s) => ({ studentId: s.id, sectionId: s.sectionId })))

  const boxes = new Map<string, { label: string; earned: number; max: number; students: Set<string> }>()
  const rounds = new Map<string, Map<string, { at: string; pcts: Array<number> }>>() // section|subject -> paper -> scores
  for (const s of students) {
    const d = data.get(s.id)!
    const sec = secs.get(s.sectionId)?.label ?? ''
    for (const a of countedAnswers(d.answers)) {
      const subject = d.exams.find((e) => e.paperId === a.paperId)?.subject ?? ''
      const key = `${sec}|${subject}|${a.topicKey}`
      const b = boxes.get(key) ?? { label: `${sec} ${subject} ${a.topicLabel}`, earned: 0, max: 0, students: new Set<string>() }
      b.earned += a.finalMarks
      b.max += a.maxMarks
      b.students.add(s.id)
      boxes.set(key, b)
    }
    for (const x of examSummaries(d.exams, d.answers)) {
      const key = `${sec}|${x.subject}`
      const m = rounds.get(key) ?? new Map<string, { at: string; pcts: Array<number> }>()
      const r = m.get(x.paperId) ?? { at: x.at, pcts: [] }
      r.pcts.push(x.pct)
      m.set(x.paperId, r)
      rounds.set(key, m)
    }
  }
  const weak = [...boxes.values()]
    .filter((b) => b.max >= 10 && b.students.size >= 3)
    .map((b) => ({ label: b.label, pct: Math.round((b.earned / b.max) * 100) }))
    .sort((a, b) => a.pct - b.pct || a.label.localeCompare(b.label))
    .slice(0, 3)
  const improved: Array<string> = []
  for (const [key, m] of rounds) {
    const ordered = [...m.values()].sort((a, b) => (a.at < b.at ? -1 : 1))
    if (ordered.length < 2) continue
    const mean = (xs: Array<number>) => xs.reduce((a, b) => a + b, 0) / xs.length
    if (mean(ordered.at(-1)!.pcts) > mean(ordered.at(-2)!.pcts) + 0.5) improved.push(key.replace('|', ' '))
  }
  // stuck: flags older than 48 hours, exams with sheets still missing, AI spend over 80 %
  const old = (await openFlags(db, schoolId)).filter((i) => now.getTime() - i.at.getTime() > 2 * MS_DAY).length
  const uploads = (await missingSheets(db, schoolId, now)).filter((o) => now.getTime() - o.createdAt.getTime() > 2 * MS_DAY).length
  const ai = await schoolAiStatus(db, schoolId, now)
  const aiPct = ai.cap > 0 ? Math.round((ai.spent / ai.cap) * 100) : 0
  const date = istParts(now).date
  let n = 0
  for (const memberId of recipients) {
    const p = who.get(memberId)
    if (!p) continue
    const l = p.lang
    const none = l === 'te' ? 'ఇంకా తగినంత సమాచారం లేదు' : 'not enough data yet'
    const stuck: Array<string> = []
    if (old > 0) stuck.push(l === 'te' ? `${old} ఫ్లాగ్‌లు 48 గంటలకు పైగా` : `${old} flag(s) over 48 hours`)
    if (uploads > 0) stuck.push(l === 'te' ? `${uploads} పరీక్షల పత్రాలు అసంపూర్ణం` : `${uploads} exam(s) with sheets missing`)
    if (aiPct > 80) stuck.push(l === 'te' ? `AI వినియోగం ${aiPct}%` : `AI use at ${aiPct}%`)
    const w = (i: number) => (weak[i] ? `${weak[i].label} (${weak[i].pct}%)` : none)
    if (await put(db, { schoolId, template: 'monday_pulse', language: l, memberId, dedupeKey: `monday_pulse:${memberId}:${date}`, variables: { name: p.name, school: school.name, weak_1: w(0), weak_2: w(1), weak_3: w(2), improved: improved.slice(0, 4).join(', ') || (l === 'te' ? 'ఈ వారం లేవు' : 'none this week'), stuck: stuck.join('; ') || (l === 'te' ? 'ఏమీ లేదు' : 'nothing') } })) n += 1
  }
  return n
}

// ---------------------------------------------------------------- the clock

/** Creates the scheduled events that are due now (India time). A tick may run late; each event has a four-hour window. */
export async function scheduleDue(db: Db, now: Date, schoolId?: string): Promise<Record<string, number>> {
  const t = istParts(now)
  const within = (from: number) => t.hour >= from && t.hour < from + 4
  const totals: Record<string, number> = { weekly_focus: 0, flags_waiting: 0, uploads_pending: 0, dispute_closing: 0, monday_pulse: 0 }
  for (const s of await messagingSchools(db, schoolId)) {
    const run = async (key: string, due: boolean, f: () => Promise<number>) => {
      if (!due) return
      try {
        totals[key] += await f()
      } catch (e) {
        console.error('school message event failed', key, s.id, e)
      }
    }
    await run('weekly_focus', t.dow === 0 && within(18), () => queueWeeklyFocus(db, s.id, now))
    await run('flags_waiting', within(16), () => queueFlagsWaiting(db, s.id, now))
    await run('uploads_pending', within(10), () => queueUploadsPending(db, s.id, now))
    await run('dispute_closing', within(10), () => queueDisputeClosing(db, s.id, now))
    await run('monday_pulse', t.dow === 1 && within(8), () => queueMondayPulse(db, s.id, now))
  }
  return totals
}
