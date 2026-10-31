import ExcelJS from 'exceljs'
import type { Db } from '../../db/connection'
import { examPrintRepository } from '../../db/repositories/school-exams'
import type { SchoolScope } from '../../db/school-scope'
import { SchoolError } from './common'
import { HABIT_CODES } from './marking-logic'
import type { HabitCode } from './marking-logic'
import {
  HABIT_LABEL,
  examSummaries,
  habitSeries,
  topicRows,
} from './progress-calc'
import type { TopicRow } from './progress-calc'
import { lockedFor } from './progress'
import { LEVEL_WORD } from './topic-level'

// Class Progress for teachers (owner direction 2026-10-31, SCHOOLS_MODULE_PLAN.md section 15.4). The same locked
// marks and the same level rule as the student's screens, for a whole section. A teacher sees only the
// section and subject pairs assigned to them; the office sees everything.

export interface Attention {
  studentId: string
  name: string
  rollNo: string
  reasons: Array<string>
}

const HANDLES = new Set(['school_admin', 'teacher', 'principal'])

async function sectionsAllowed(db: Db, scope: SchoolScope) {
  const all = await db
    .selectFrom('school_sections as sec')
    .innerJoin('school_classes as c', 'c.id', 'sec.class_id')
    .select(['sec.id', 'sec.name', 'c.grade'])
    .where('sec.school_id', '=', scope.schoolId)
    .orderBy('c.grade')
    .orderBy('sec.name')
    .execute()
  if (scope.pairs === 'all') return all
  const mine = new Set(scope.pairs.map((p) => p.sectionId))
  return all.filter((s) => mine.has(s.id))
}

export async function classProgress(
  db: Db,
  scope: SchoolScope,
  sectionId?: string | null,
  subjectName?: string | null,
) {
  if (!HANDLES.has(scope.role))
    throw new SchoolError('forbidden', 'Only the school office and teachers can see this.')
  const sections = await sectionsAllowed(db, scope)
  const section = sections.find((s) => s.id === sectionId) ?? sections.at(0)
  if (!section)
    return {
      sections: [] as Array<{ id: string; name: string }>,
      section: null,
      subjects: [] as Array<string>,
      subject: null,
      students: 0,
      heatmap: null,
      habitHeat: [] as Array<{ studentId: string; name: string; rollNo: string; lost: Record<HabitCode, number> }>,
      habitTotals: null,
      attention: [] as Array<Attention>,
      flags: [] as Array<{ paperId: string; title: string; count: number }>,
      hasData: false,
    }
  const roster = await examPrintRepository.studentsOfSections(db, scope, [section.id])
  const data = await lockedFor(
    db,
    scope.schoolId,
    roster.map((r) => ({ studentId: r.school_student_id, sectionId: section.id })),
  )
  // a teacher sees only the subjects they teach in this section
  const subjectOk = (id: string) =>
    scope.pairs === 'all' || scope.pairs.some((p) => p.sectionId === section.id && p.subjectId === id)
  const examsOf = (sid: string) => (data.get(sid)?.exams ?? []).filter((e) => subjectOk(e.subjectId))
  const subjects = [...new Set(roster.flatMap((r) => examsOf(r.school_student_id).map((e) => e.subject)))].sort()
  const subject = subjects.find((s) => s === subjectName) ?? subjects.at(0) ?? null

  type Row = { studentId: string; name: string; rollNo: string; topics: Array<TopicRow>; all: Array<TopicRow> }
  const rows: Array<Row> = roster.map((r) => {
    const d = data.get(r.school_student_id)!
    const exams = d.exams.filter((e) => subjectOk(e.subjectId))
    const ids = new Set(exams.map((e) => e.paperId))
    const answers = d.answers.filter((a) => ids.has(a.paperId))
    const all = topicRows(exams, answers)
    return {
      studentId: r.school_student_id,
      name: r.name,
      rollNo: r.roll_no,
      all,
      topics: all.filter((t) => t.subject === subject),
    }
  })

  // heatmap: students by topics
  const topicKeys = new Map<string, string>()
  for (const r of rows) for (const t of r.topics) topicKeys.set(t.key, t.label)
  const columns = [...topicKeys.entries()]
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label))
  const heatmap = {
    columns,
    rows: rows.map((r) => ({
      studentId: r.studentId,
      name: r.name,
      rollNo: r.rollNo,
      cells: columns.map((c) => {
        const t = r.topics.find((x) => x.key === c.key)
        return t ? { level: t.level, dip: t.dip, pct: t.latestPct } : null
      }),
    })),
  }

  // habit heatmap: marks lost to each habit over each student's last two exams
  const habitHeat = rows.map((r) => {
    const d = data.get(r.studentId)!
    const exams = d.exams.filter((e) => subjectOk(e.subjectId))
    const last2 = [...exams].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 2)
    const series = habitSeries(last2, d.answers)
    return {
      studentId: r.studentId,
      name: r.name,
      rollNo: r.rollNo,
      lost: Object.fromEntries(series.map((s) => [s.habit, s.total])) as Record<HabitCode, number>,
    }
  })
  const habitTotals = Object.fromEntries(
    HABIT_CODES.map((h) => [h, habitHeat.reduce((n, x) => n + x.lost[h], 0)]),
  ) as Record<HabitCode, number>

  // students who need attention this week (plan 15.4: any one rule)
  const attention: Array<Attention> = []
  const releases = await db
    .selectFrom('school_paper_releases as r')
    .innerJoin('school_own_papers as p', 'p.id', 'r.paper_id')
    .innerJoin('school_subjects as ss', 'ss.id', 'p.school_subject_id')
    .select(['r.paper_id', 'r.released_at', 'p.title', 'ss.subject_id'])
    .where('r.school_id', '=', scope.schoolId)
    .where('r.section_id', '=', section.id)
    .where('r.locked_at', 'is not', null)
    .execute()
  const latestRelease = releases.filter((x) => subjectOk(x.subject_id)).sort((a, b) => (a.released_at < b.released_at ? 1 : -1)).at(0)
  for (const r of rows) {
    const d = data.get(r.studentId)!
    const exams = d.exams.filter((e) => subjectOk(e.subjectId))
    const reasons: Array<string> = []
    const beginners = r.all.filter((t) => t.level === 'beginner').length
    if (beginners >= 3) reasons.push(`Beginner in ${beginners} topics`)
    for (const sub of [...new Set(exams.map((e) => e.subject))]) {
      const ex = exams.filter((e) => e.subject === sub)
      const sums = examSummaries(ex, d.answers.filter((a) => ex.some((e) => e.paperId === a.paperId)))
      if (sums.length >= 2) {
        const drop = sums[sums.length - 2].pct - sums[sums.length - 1].pct
        if (drop >= 15) reasons.push(`${sub}: down ${drop} points on the exam before`)
        const two = habitSeries(ex.slice(-2), d.answers.filter((a) => ex.some((e) => e.paperId === a.paperId)))
        for (const h of two)
          if (h.perExam.length === 2 && h.perExam.every((p) => p.lost >= 2))
            reasons.push(`${sub}: ${HABIT_LABEL[h.habit].toLowerCase()} cost 2 or more marks in each of the last two exams`)
      }
    }
    if (latestRelease && !exams.some((e) => e.paperId === latestRelease.paper_id))
      reasons.push(`No sheets handed in for ${latestRelease.title}`)
    if (reasons.length > 0)
      attention.push({ studentId: r.studentId, name: r.name, rollNo: r.rollNo, reasons })
  }

  // flags still with a teacher, per paper
  const flags = await db
    .selectFrom('school_answer_disputes as d')
    .innerJoin('school_students as s', 's.id', 'd.school_student_id')
    .innerJoin('school_own_papers as p', 'p.id', 'd.paper_id')
    .select(['d.paper_id', 'p.title'])
    .select((eb) => eb.fn.countAll<string>().as('n'))
    .where('d.school_id', '=', scope.schoolId)
    .where('s.section_id', '=', section.id)
    .where('d.status', '=', 'with_teacher')
    .groupBy(['d.paper_id', 'p.title'])
    .execute()

  return {
    sections: sections.map((s) => ({ id: s.id, name: `Class ${s.grade} ${s.name}` })),
    section: { id: section.id, name: `Class ${section.grade} ${section.name}` },
    subjects,
    subject,
    students: roster.length,
    heatmap,
    habitHeat,
    habitTotals,
    attention,
    flags: flags.map((f) => ({ paperId: f.paper_id, title: f.title, count: Number(f.n) })),
    hasData: subjects.length > 0,
  }
}

// ---------------------------------------------------------------- export for the Holistic Progress Card

/** Topic levels and self-reflections of one section as CSV text or an Excel file. */
export async function exportProgress(
  db: Db,
  scope: SchoolScope,
  sectionId: string,
  format: 'csv' | 'xlsx',
): Promise<{ body: Buffer | string; type: string; name: string }> {
  if (!HANDLES.has(scope.role))
    throw new SchoolError('forbidden', 'Only the school office and teachers can export this.')
  const sections = await sectionsAllowed(db, scope)
  const section = sections.find((s) => s.id === sectionId)
  if (!section) throw new SchoolError('not_found', 'That section is not yours.')
  const roster = await examPrintRepository.studentsOfSections(db, scope, [section.id])
  const data = await lockedFor(
    db,
    scope.schoolId,
    roster.map((r) => ({ studentId: r.school_student_id, sectionId: section.id })),
  )
  const subjectOk = (id: string) =>
    scope.pairs === 'all' || scope.pairs.some((p) => p.sectionId === section.id && p.subjectId === id)
  const levelRows: Array<Array<string | number>> = []
  for (const r of roster) {
    const d = data.get(r.school_student_id)!
    const exams = d.exams.filter((e) => subjectOk(e.subjectId))
    const ids = new Set(exams.map((e) => e.paperId))
    for (const t of topicRows(exams, d.answers.filter((a) => ids.has(a.paperId))))
      levelRows.push([
        r.roll_no,
        r.name,
        t.subject,
        t.label,
        t.level ? LEVEL_WORD[t.level] : 'Not assessed',
        t.dip ? 'yes' : 'no',
        t.evidence,
        t.latestPct ?? '',
      ])
  }
  const refl = await db
    .selectFrom('school_exam_reflections as x')
    .innerJoin('school_own_papers as p', 'p.id', 'x.paper_id')
    .innerJoin('school_subjects as ss', 'ss.id', 'p.school_subject_id')
    .select(['x.school_student_id', 'p.title', 'ss.subject_id', 'x.hardest_question_no', 'x.next_time', 'x.next_time_note', 'x.feeling', 'x.created_at'])
    .where('x.school_id', '=', scope.schoolId)
    .where('x.school_student_id', 'in', roster.map((r) => r.school_student_id))
    .execute()
  const FEEL = ['', 'Hard', 'Okay', 'Good']
  const reflRows = refl
    .filter((x) => subjectOk(x.subject_id))
    .map((x) => {
      const st = roster.find((r) => r.school_student_id === x.school_student_id)!
      return [st.roll_no, st.name, x.title, x.hardest_question_no ?? '', x.next_time ?? '', x.next_time_note ?? '', FEEL[x.feeling ?? 0], x.created_at.toISOString().slice(0, 10)]
    })
  const H1 = ['Roll', 'Student', 'Subject', 'Topic', 'Level', 'Dipped last exam', 'Exams behind it', 'Latest exam %']
  const H2 = ['Roll', 'Student', 'Exam', 'Hardest question', 'Next time', 'Note', 'How it felt', 'Date']
  const base = `class-${section.grade}${section.name}-progress`.replace(/[^A-Za-z0-9-]+/g, '-')
  if (format === 'csv') {
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
    const csv = (h: Array<string>, rows: Array<Array<string | number>>) => [h, ...rows].map((r) => r.map(esc).join(',')).join('\r\n')
    return {
      body: `${csv(H1, levelRows)}\r\n\r\n${csv(H2, reflRows)}\r\n`,
      type: 'text/csv; charset=utf-8',
      name: `${base}.csv`,
    }
  }
  const wb = new ExcelJS.Workbook()
  const a = wb.addWorksheet('Topic levels')
  a.addRow(H1).font = { bold: true }
  levelRows.forEach((r) => a.addRow(r))
  const b = wb.addWorksheet('Self-reflections')
  b.addRow(H2).font = { bold: true }
  reflRows.forEach((r) => b.addRow(r))
  for (const ws of [a, b]) ws.columns.forEach((c) => (c.width = 20))
  return {
    body: Buffer.from(await wb.xlsx.writeBuffer()),
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    name: `${base}.xlsx`,
  }
}
