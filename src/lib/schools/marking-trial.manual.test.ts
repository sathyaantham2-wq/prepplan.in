import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { afterAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../db/test-helpers'
import { isAiConfigured } from '../ai-provider'
import { encryptScan } from '../scan-crypto'
import { getScanStore } from '../scan-storage'
import { loadSchoolScope } from '../school-session'
import { markStudentSheets, studentMarking } from './marking'
import { createSchoolStudent } from './people'
import { addSchoolSubject, createClass, createSection } from './setup'
import { acceptSchoolTerms } from './terms'

// A REAL-AI TRIAL of the marking engine on handwritten sheets. Not part of the normal test run: it does
// nothing unless MARKING_TRIAL names a JSON file (see docs/trial/marking-trial.example.json). It spends real
// money on the AI key in the environment, in the LOCAL test database only, and refuses to run without a key
// and with OWN_PAPER_AI=fake. It writes a report (HTML and CSV) to MARKING_TRIAL_OUT (default
// test-results/marking-trial): per student and question, what the AI read, the three marks it gave, the mark
// that stands, whether it was flagged and why, and (if you gave your own marks) how close it was; plus the
// cost per student. Run:
//   ANTHROPIC_API_KEY=... MARKING_TRIAL=/path/trial.json node scripts/with-test-env.mjs npx vitest run src/lib/schools/marking-trial.manual.test.ts
const file = process.env.MARKING_TRIAL
interface Q {
  type: string
  marks: number
  text: string
  options?: Array<string>
  correct?: string
  key?: string
  steps?: Array<[string, number]>
}
interface Trial {
  subject: string
  grade: number
  questions: Array<Q>
  students: Array<{ name: string; pages: Array<string>; ownMarks?: Array<number> }>
}

describe.skipIf(!file)('marking trial (real AI)', () => {
  const trial: Trial = file ? (JSON.parse(readFileSync(file, 'utf8')) as Trial) : ({} as Trial)
  const tag = `${Date.now()}`.slice(-8)
  const db = createDb()
  const userIds: Array<string> = []
  const households: Array<string> = []
  let schoolId = ''
  let subjectId = ''
  const keep = process.env.MARKING_TRIAL_KEEP === '1'

  afterAll(async () => {
    if (!schoolId || keep) return void (await db.destroy())
    const ids = [schoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_answer_marks', 'school_sheet_marking', 'school_own_sheets', 'school_own_questions', 'school_own_papers'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_student_guardians').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_students').where('school_id', 'in', ids).execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
    for (const t of ['school_teacher_assignments', 'school_subjects', 'school_sections', 'school_classes'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await deleteSchoolTermsForTest(db, ids)
    const members = await db.selectFrom('school_members').select('user_id').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_members').where('school_id', 'in', ids).execute()
    const sh = await db.selectFrom('schools').select('household_id').where('id', 'in', ids).execute()
    await db.deleteFrom('ai_jobs').where('household_id', 'in', sh.map((h) => h.household_id)).execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    const mu = members.map((m) => m.user_id)
    const hh = mu.length ? await db.selectFrom('users').select('household_id').where('id', 'in', mu).execute() : []
    if (mu.length) await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...sh.map((h) => h.household_id), ...hh.map((h) => h.household_id), ...households]).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  it('marks every student on the real AI and writes the report', async () => {
    // MARKING_TRIAL_DRYRUN=1 checks the plumbing and the report with the free stand-in; the real trial never sets it
    if (process.env.MARKING_TRIAL_DRYRUN !== '1') {
      expect(process.env.OWN_PAPER_AI, 'unset OWN_PAPER_AI: the trial must use the real AI').not.toBe('fake')
      expect(isAiConfigured(), 'no AI key in the environment (ANTHROPIC_API_KEY or GEMINI_API_KEY)').toBe(true)
    }
    const p = await schoolsRepository.provision(db, {
      name: `Trial School ${tag}`,
      code: `trial-${tag}`,
      board: 'CBSE',
      adminName: 'Trial Admin',
      adminEmail: `trial-${tag}@school.test`,
    })
    schoolId = p.school.id
    userIds.push(p.adminUserId)
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    const admin = sa.scope
    await acceptSchoolTerms(db, admin)
    subjectId = (
      await db.insertInto('subjects').values({ board: 'CBSE', class: trial.grade, code: `TR-${tag}`, name: trial.subject, language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()
    ).id
    const cls = await createClass(db, admin, trial.grade, '2026-27')
    const sec = await createSection(db, admin, cls.id, 'A')
    const ss = await addSchoolSubject(db, admin, cls.id, subjectId)
    const total = trial.questions.reduce((n, q) => n + q.marks, 0)
    const paper = await db
      .insertInto('school_own_papers')
      .values({ school_id: schoolId, class_id: cls.id, school_subject_id: ss.id, title: 'Marking trial', source_kind: 'prepplan_exam', status: 'approved', phase: 'done', total_marks: String(total), created_by_user_id: admin.userId })
      .returning('id')
      .executeTakeFirstOrThrow()
    for (const [i, q] of trial.questions.entries()) {
      const opts = (q.options ?? []).map((text, k) => ({ label: 'ABCD'[k], text }))
      await db
        .insertInto('school_own_questions')
        .values({
          school_id: schoolId,
          paper_id: paper.id,
          position: i + 1,
          section: 'A',
          type: q.type,
          text: q.text,
          original_text: q.text,
          options: JSON.stringify(opts),
          marks: String(q.marks),
          key_text: q.type === 'mcq' ? `Correct option: (${q.correct}) ${opts.find((o) => o.label === q.correct)?.text ?? ''}` : (q.key ?? ''),
          key_steps: JSON.stringify((q.steps ?? []).map(([description, marks]) => ({ description, marks }))),
          key_source: 'teacher',
          key_status: 'approved',
        })
        .execute()
    }
    const rows: Array<{ student: string; qNo: number; q: string; max: number; read: string; runs: string; final: number; state: string; flag: string; loss: string; own: number | null }> = []
    const per: Array<{ student: string; costInr: number; tokens: number; seconds: number; flagged: number; total: number; max: number; own: number | null }> = []
    for (const [si, st] of trial.students.entries()) {
      const s = await createSchoolStudent(db, admin, { name: st.name, grade: trial.grade, sectionId: sec.id, sectionName: 'A', rollNo: String(si + 1), admissionNo: null, guardianPhone: null, guardianName: null })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      for (const [pi, path] of st.pages.entries()) {
        const key = `trial/${schoolId}/${s.schoolStudent.id}-${pi}`
        await getScanStore().put(key, encryptScan(readFileSync(path)))
        await db.insertInto('school_own_sheets').values({ school_id: schoolId, paper_id: paper.id, school_student_id: s.schoolStudent.id, kind: 'page', status: 'placed', placed_by: 'teacher', seq: pi + 1, image_key: key, original_key: key, check_state: 'passed', uploaded_by_user_id: admin.userId }).execute()
      }
      const before = await db.selectFrom('ai_jobs').select(['cost_inr', 'tokens_in', 'tokens_out', 'latency_ms']).where('household_id', '=', p.school.household_id).execute()
      const t0 = Date.now()
      const r = await markStudentSheets(db, admin, paper.id, s.schoolStudent.id)
      const seconds = (Date.now() - t0) / 1000
      const after = await db.selectFrom('ai_jobs').select(['cost_inr', 'tokens_in', 'tokens_out']).where('household_id', '=', p.school.household_id).execute()
      const mine = after.slice(before.length)
      const v = await studentMarking(db, admin, paper.id, s.schoolStudent.id)
      const raw = await db.selectFrom('school_answer_marks').select(['own_question_id', 'runs']).where('school_id', '=', schoolId).where('school_student_id', '=', s.schoolStudent.id).execute()
      for (const [qi, a] of v.answers.entries()) {
        const runs = (raw.find((x) => x.own_question_id === a.questionId)?.runs ?? []) as Array<{ marks: number; choice: string | null }>
        rows.push({
          student: st.name,
          qNo: qi + 1,
          q: a.text,
          max: a.maxMarks,
          read: a.answerText ?? '',
          runs: runs.map((x) => (x.choice ? x.choice : x.marks)).join(' / '),
          final: a.finalMarks ?? 0,
          state: a.state ?? '',
          flag: a.flagReason ?? '',
          loss: a.lossKind && a.lossKind !== 'none' ? `${a.lossKind}: ${a.lossReason ?? ''}` : '',
          own: st.ownMarks?.[qi] ?? null,
        })
      }
      per.push({
        student: st.name,
        costInr: mine.reduce((n, j) => n + Number(j.cost_inr ?? 0), 0),
        tokens: mine.reduce((n, j) => n + (j.tokens_in ?? 0) + (j.tokens_out ?? 0), 0),
        seconds,
        flagged: v.answers.filter((a) => a.state === 'flagged').length,
        total: r.totalMarks ?? 0,
        max: r.maxMarks ?? total,
        own: st.ownMarks ? st.ownMarks.reduce((n, x) => n + x, 0) : null,
      })
    }
    const scored = rows.filter((r) => r.own !== null)
    const exact = scored.filter((r) => r.own === r.final).length
    const within = scored.filter((r) => Math.abs((r.own ?? 0) - r.final) <= 0.5).length
    const out = process.env.MARKING_TRIAL_OUT ?? 'test-results/marking-trial'
    mkdirSync(out, { recursive: true })
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
    writeFileSync(`${out}/answers.csv`, [['Student', 'Q', 'Question', 'Max', 'What the AI read', 'Three readings', 'Mark', 'State', 'Flag reason', 'Why marks were lost', 'Your mark'], ...rows.map((r) => [r.student, r.qNo, r.q, r.max, r.read, r.runs, r.final, r.state, r.flag, r.loss, r.own ?? ''])].map((r) => r.map(esc).join(',')).join('\r\n'))
    const h = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] ?? c)
    const summary = {
      students: per.length,
      answers: rows.length,
      flaggedAnswers: rows.filter((r) => r.state === 'flagged').length,
      accuracyExact: scored.length ? Math.round((exact / scored.length) * 100) : null,
      accuracyWithinHalf: scored.length ? Math.round((within / scored.length) * 100) : null,
      costPerStudentInr: per.length ? Number((per.reduce((n, x) => n + x.costInr, 0) / per.length).toFixed(2)) : 0,
      secondsPerStudent: per.length ? Math.round(per.reduce((n, x) => n + x.seconds, 0) / per.length) : 0,
    }
    writeFileSync(`${out}/summary.json`, JSON.stringify({ summary, per }, null, 2))
    writeFileSync(
      `${out}/report.html`,
      `<!doctype html><meta charset="utf-8"><title>Marking trial</title><style>body{font:14px system-ui;margin:20px}table{border-collapse:collapse;width:100%;margin:12px 0}td,th{border:1px solid #cbd5e1;padding:4px 6px;text-align:left;vertical-align:top}.f{background:#fef3c7}.bad{background:#fee2e2}</style>
<h1>Marking trial</h1><pre>${h(JSON.stringify(summary, null, 2))}</pre>
<h2>Per student</h2><table><tr><th>Student</th><th>AI total</th><th>Your total</th><th>Flagged</th><th>Cost (Rs)</th><th>Tokens</th><th>Seconds</th></tr>${per.map((x) => `<tr><td>${h(x.student)}</td><td>${x.total}/${x.max}</td><td>${x.own ?? ''}</td><td>${x.flagged}</td><td>${x.costInr.toFixed(2)}</td><td>${x.tokens}</td><td>${x.seconds.toFixed(0)}</td></tr>`).join('')}</table>
<h2>Every answer</h2><table><tr><th>Student</th><th>Q</th><th>Question</th><th>Read from the sheet</th><th>3 readings</th><th>Mark</th><th>Flag</th><th>Why lost</th><th>Yours</th></tr>${rows.map((r) => `<tr class="${r.state === 'flagged' ? 'f' : r.own !== null && r.own !== r.final ? 'bad' : ''}"><td>${h(r.student)}</td><td>${r.qNo}</td><td>${h(r.q)}</td><td>${h(r.read)}</td><td>${h(r.runs)}</td><td>${r.final}/${r.max}</td><td>${h(r.flag)}</td><td>${h(r.loss)}</td><td>${r.own ?? ''}</td></tr>`).join('')}</table>`,
    )
    console.log(`\nMARKING TRIAL: ${JSON.stringify(summary)}\nReport: ${out}/report.html\n`)
    expect(per.length).toBe(trial.students.length)
  }, 1_800_000)
})
