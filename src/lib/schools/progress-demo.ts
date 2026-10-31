import { createHash } from 'node:crypto'
import type { Db } from '../../db/connection'

// Sample history for a demo school's Progress screens (owner direction 2026-10-31, plan section 15.7):
// three LOCKED exams in each of up to three subjects, for every student, written as real rows (papers,
// questions, releases, marking, marks per step, habits, a few settled flags, reflections) by a deterministic
// generator. The same school always gets the same history. No AI call and no scanned image is involved; the
// rows are what real marking would have left. Safe to run again: a school that already has this history is
// left alone. Used only for a demo school (the caller checks), and by the browser tests.

export const PROGRESS_DEMO_TAG = 'Progress demo'

function rng(seed: string) {
  let a = createHash('sha256').update(seed).digest().readUInt32LE(0)
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const half = (n: number) => Math.round(n * 2) / 2

const EXAMS = [
  { title: 'Unit Test 1', daysAgo: 84 },
  { title: 'Unit Test 2', daysAgo: 49 },
  { title: 'Half-Yearly', daysAgo: 14 },
] as const

/** 16 questions, 30 marks: eight 1-mark choices, four 2-mark, two 3-mark, two 4-mark written answers. */
const SHAPE: Array<{ type: string; marks: number }> = [
  ...Array.from({ length: 8 }, () => ({ type: 'mcq', marks: 1 })),
  ...Array.from({ length: 4 }, () => ({ type: 'short_answer', marks: 2 })),
  ...Array.from({ length: 2 }, () => ({ type: 'short_answer', marks: 3 })),
  ...Array.from({ length: 2 }, () => ({ type: 'long_answer', marks: 4 })),
]
const STEP_WORDS = ['States the idea', 'Applies it to the numbers', 'Works out the answer', 'Writes the answer with its unit']
const HABITS = ['skipped_steps', 'units_missing', 'stopped_early', 'misread_question'] as const
const HABIT_REASON: Record<string, string> = {
  skipped_steps: 'Working was left out between the steps.',
  units_missing: 'The answer was right but had no unit or closing line.',
  stopped_early: 'The answer stopped before it was complete.',
  misread_question: 'The answer was about something the question did not ask.',
}

export async function seedProgressDemo(
  db: Db,
  schoolId: string,
  now = new Date(),
): Promise<{ papers: number; students: number; skipped: boolean }> {
  const had = await db
    .selectFrom('school_own_papers')
    .select('id')
    .where('school_id', '=', schoolId)
    .where('message', '=', PROGRESS_DEMO_TAG)
    .executeTakeFirst()
  if (had) return { papers: 0, students: 0, skipped: true }

  const admin = await db
    .selectFrom('school_members')
    .select('user_id')
    .where('school_id', '=', schoolId)
    .where('role', '=', 'school_admin')
    .executeTakeFirstOrThrow()
  const section = await db
    .selectFrom('school_sections')
    .select(['id', 'class_id'])
    .where('school_id', '=', schoolId)
    .orderBy('created_at')
    .executeTakeFirstOrThrow()
  const students = await db
    .selectFrom('school_students')
    .select(['id', 'roll_no'])
    .where('school_id', '=', schoolId)
    .where('section_id', '=', section.id)
    .where('status', '=', 'active')
    .orderBy('roll_no')
    .execute()
  const subjects = await db
    .selectFrom('school_subjects as ss')
    .innerJoin('subjects as sub', 'sub.id', 'ss.subject_id')
    .select(['ss.id as ssId', 'sub.id as subjectId', 'sub.name', 'sub.code'])
    .where('ss.school_id', '=', schoolId)
    .where('ss.class_id', '=', section.class_id)
    .orderBy('sub.code')
    .execute()

  let papers = 0
  for (const [si, sub] of subjects.slice(0, 3).entries()) {
    const chapters = await db
      .selectFrom('chapters')
      .select(['id', 'name'])
      .where('subject_id', '=', sub.subjectId)
      .orderBy('part')
      .orderBy('chapter_no')
      .execute()
    if (chapters.length === 0) continue
    for (const [ei, ex] of EXAMS.entries()) {
      // four topics per exam, sliding along the book, so a topic is met in two or three exams
      const topics = Array.from({ length: 4 }, (_, k) => chapters[(ei + k) % chapters.length])
      const releasedAt = new Date(now.getTime() - ex.daysAgo * 86_400_000)
      const closes = new Date(releasedAt.getTime() + 7 * 86_400_000)
      const paper = await db
        .insertInto('school_own_papers')
        .values({
          school_id: schoolId,
          class_id: section.class_id,
          school_subject_id: sub.ssId,
          title: `${sub.name} ${ex.title}`,
          message: PROGRESS_DEMO_TAG,
          source_kind: 'prepplan_exam',
          status: 'approved',
          phase: 'done',
          total_marks: '30',
          created_by_user_id: admin.user_id,
          approved_at: releasedAt,
          approved_by_user_id: admin.user_id,
          created_at: new Date(releasedAt.getTime() - 5 * 86_400_000),
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      papers++
      const qs: Array<{ id: string; marks: number; type: string; topic: number; position: number }> = []
      for (const [qi, q] of SHAPE.entries()) {
        const topic = qi % 4
        const row = await db
          .insertInto('school_own_questions')
          .values({
            school_id: schoolId,
            paper_id: paper.id,
            position: qi + 1,
            section: q.type === 'mcq' ? 'A' : q.marks <= 2 ? 'B' : 'C',
            type: q.type,
            text: `${topics[topic].name}: question ${qi + 1}`,
            original_text: `${topics[topic].name}: question ${qi + 1}`,
            options: JSON.stringify(
              q.type === 'mcq' ? ['A', 'B', 'C', 'D'].map((label) => ({ label, text: `Choice ${label}` })) : [],
            ),
            marks: String(q.marks),
            chapter_id: topics[topic].id,
            map_confidence: '1',
            key_text: q.type === 'mcq' ? 'Correct option: (B) Choice B' : 'See the marking steps.',
            key_steps: JSON.stringify(
              q.type === 'mcq' ? [] : Array.from({ length: q.marks }, (_, k) => ({ description: STEP_WORDS[k % 4], marks: 1 })),
            ),
            key_source: 'bank',
            key_status: 'approved',
          })
          .returning('id')
          .executeTakeFirstOrThrow()
        qs.push({ id: row.id, marks: q.marks, type: q.type, topic, position: qi + 1 })
      }
      await db
        .insertInto('school_paper_releases')
        .values({
          school_id: schoolId,
          paper_id: paper.id,
          section_id: section.id,
          released_by_user_id: admin.user_id,
          released_at: releasedAt,
          window_days: 7,
          window_closes_at: closes,
          locked_at: closes,
        })
        .execute()

      for (const [stIdx, st] of students.entries()) {
        const r = rng(`${schoolId}|${sub.code}|${ei}|${st.id}`)
        // her ability in this subject, growing a little with each exam, and the habit she tends to slip on
        const ability = clamp(0.4 + 0.5 * rng(`${st.id}|${sub.code}`)() + 0.05 * ei - 0.02 * si, 0.25, 0.97)
        const habit = HABITS[Math.floor(rng(`${st.id}|habit`)() * HABITS.length)]
        let total = 0
        const answerRows = qs.map((q) => {
          const hard = [-0.1, 0.05, -0.02, 0.1][q.topic]
          const p = clamp(ability + hard + (r() - 0.5) * 0.24, 0.02, 1)
          let marks: number
          if (q.type === 'mcq') marks = r() < p ? 1 : 0
          else marks = clamp(half(p * q.marks + (r() - 0.5)), 0, q.marks)
          const lost = q.marks - marks
          const gap = lost > 0 && (q.type === 'mcq' || r() < 0.6)
          const kind = lost === 0 ? 'none' : gap ? 'knowledge_gap' : 'writing_habit'
          const habitCode = kind === 'writing_habit' ? (r() < 0.6 ? habit : HABITS[Math.floor(r() * HABITS.length)]) : null
          total += marks
          let left = marks
          const steps =
            q.type === 'mcq'
              ? []
              : Array.from({ length: q.marks }, (_, k) => {
                  const got = Math.min(1, left)
                  left -= got
                  return { no: k + 1, description: STEP_WORDS[k % 4], awarded: got, max: 1 }
                })
          return {
            school_id: schoolId,
            paper_id: paper.id,
            school_student_id: st.id,
            own_question_id: q.id,
            found: true,
            answer_text: q.type === 'mcq' ? `Option ${marks === 1 ? 'B' : 'C'}` : 'Answer as written on the sheet',
            runs: '[]',
            ai_marks: String(marks),
            final_marks: String(marks),
            max_marks: String(q.marks),
            state: 'ai_final',
            loss_kind: kind,
            loss_reason:
              kind === 'none'
                ? null
                : kind === 'knowledge_gap'
                  ? 'The idea needed for this question was not shown.'
                  : HABIT_REASON[habitCode ?? 'skipped_steps'],
            habit: habitCode,
            steps: JSON.stringify(steps),
          }
        })
        await db.insertInto('school_answer_marks').values(answerRows).execute()
        await db
          .insertInto('school_sheet_marking')
          .values({
            school_id: schoolId,
            paper_id: paper.id,
            school_student_id: st.id,
            status: 'marked',
            total_marks: String(total),
            max_marks: '30',
            started_at: releasedAt,
            finished_at: releasedAt,
          })
          .execute()
        // a few settled flags in the last exam: the AI raised one, a teacher decided another
        if (ei === 2 && si === 0 && stIdx % 9 === 4) {
          const lostRow = await db
            .selectFrom('school_answer_marks')
            .select(['id', 'final_marks', 'max_marks'])
            .where('school_id', '=', schoolId)
            .where('paper_id', '=', paper.id)
            .where('school_student_id', '=', st.id)
            .where('max_marks', '>=', '2')
            .orderBy('own_question_id')
            .execute()
          const pick = lostRow.find((x) => Number(x.final_marks) < Number(x.max_marks))
          if (pick) {
            const before = Number(pick.final_marks)
            const raised = Math.min(Number(pick.max_marks), before + 1)
            await db
              .insertInto('school_answer_disputes')
              .values({
                school_id: schoolId,
                paper_id: paper.id,
                school_student_id: st.id,
                answer_mark_id: pick.id,
                reason: 'I wrote this step on the second page.',
                status: 'resolved',
                ai_reply: `The AI read your answer again and raised the mark from ${before} to ${raised}.`,
                marks_before: String(before),
                marks_after: String(raised),
                decided_at: new Date(releasedAt.getTime() + 2 * 86_400_000),
              })
              .execute()
            await db
              .updateTable('school_answer_marks')
              .set({ final_marks: String(raised) })
              .where('id', '=', pick.id)
              .execute()
            await db
              .updateTable('school_sheet_marking')
              .set({ total_marks: String(total + (raised - before)) })
              .where('paper_id', '=', paper.id)
              .where('school_student_id', '=', st.id)
              .execute()
          }
        }
        // a reflection from about three students in four
        if (r() < 0.75)
          await db
            .insertInto('school_exam_reflections')
            .values({
              school_id: schoolId,
              paper_id: paper.id,
              school_student_id: st.id,
              hardest_question_no: String(1 + Math.floor(r() * 16)),
              next_time: (['read_carefully', 'show_steps', 'write_more', 'revise_topic', 'manage_time'] as const)[
                Math.floor(r() * 5)
              ],
              feeling: 1 + Math.floor(r() * 3),
              created_at: new Date(releasedAt.getTime() + 86_400_000),
              updated_at: new Date(releasedAt.getTime() + 86_400_000),
            })
            .execute()
      }
    }
  }
  return { papers, students: students.length, skipped: false }
}
