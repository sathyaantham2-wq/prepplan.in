import { mkdirSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Browser, Page } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { deleteSchoolTermsForTest, signInSchoolUserForTest } from '../src/db/test-helpers'
import { provisionSampleSchool } from '../src/lib/schools/sample-school-fixture'

/**
 * The paper builder (docs/SCHOOLS_MODULE_PLAN.md section 16) in a browser: Auto + edit with a swap, Hand-pick with
 * filters and the checklist warning, Fill the rest, Make paper and the printed question paper. Local test database.
 * With UI_SHOTS_DIR set it also saves the review pictures at 1440 px and phone size.
 */
const SHOTS = process.env.UI_SHOTS_DIR
const PHONE = { width: 390, height: 844 }
const WIDE = { width: 1440, height: 1000 }

async function shot(page: Page, name: string) {
  if (!SHOTS) return
  mkdirSync(SHOTS, { recursive: true })
  // Sticky bars land mid-image in a full-page shot taken while scrolled.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(250)
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true })
}

test.describe.serial('paper builder', () => {
  let db: Db
  let browserRef: Browser
  const tag = `${Date.now()}`.slice(-8)
  let subjectId = ''
  let sourceId = ''
  let schoolId = ''
  let teacherUserId = ''
  let page: Page

  async function buildBank() {
    sourceId = (await db.insertInto('sources').values({ subject_id: subjectId, title: 'Ganita Prakash', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()).id
    const chapter = async (no: number, name: string) => {
      const ch = await db.insertInto('chapters').values({ source_id: sourceId, subject_id: subjectId, part: 'I', chapter_no: no, name, order_index: no }).returning('id').executeTakeFirstOrThrow()
      return (await db.insertInto('concepts').values({ chapter_id: ch.id, board: 'CBSE', class: 7, code: `E2E-BU-${tag}-${no}`, name, difficulty_base: 'Easy' }).returning('id').executeTakeFirstOrThrow()).id
    }
    const add = async (concept: string, texts: Array<string>, type: string, marks: number, bloom: string, difficulty = 'Easy') => {
      for (const [i, text] of texts.entries()) {
        const q = await db
          .insertInto('questions')
          .values({ concept_id: concept, board: 'CBSE', class: 7, bloom: bloom as never, difficulty: (i % 3 === 2 ? 'Hard' : difficulty) as never, marks, type: type as never, text: `${text}`, text_hash: `e2e-bu-${tag}-${Math.random()}`, answer: `Worked answer for: ${text}`, status: 'approved', origin: 'manual', created_by: 'e2e', tags: [] })
          .returning('id')
          .executeTakeFirstOrThrow()
        if (type === 'mcq' || type === 'assertion_reason')
          for (const [k, label] of ['A', 'B', 'C', 'D'].entries())
            await db.insertInto('question_options').values({ question_id: q.id, label, text: `${['1/2', '3/4', '2/3', '5/6'][k]}`, is_correct: k === 1, order_index: k + 1 }).execute()
      }
    }
    const f = await chapter(3, 'Fractions and Decimals')
    const e = await chapter(4, 'Simple Equations')
    const d = await chapter(5, 'Data Handling')
    const n = (k: number, s: (i: number) => string) => Array.from({ length: k }, (_, i) => s(i))
    await add(f, n(14, (i) => `Which of these fractions is the greatest? (set ${i + 1})`), 'mcq', 1, i2bloom(0))
    await add(e, n(10, (i) => `If ${i + 2}x = ${(i + 2) * 3}, what is x?`), 'mcq', 1, 'Apply')
    await add(d, n(6, (i) => `Assertion: the mean of ${i + 2}, ${i + 4} and ${i + 6} is ${i + 4}. Reason: the mean is the middle value of three numbers in order.`), 'assertion_reason', 1, 'Apply')
    await add(f, n(8, (i) => `Write ${i + 1}/${i + 3} as a decimal and explain each step.`), 'short_answer', 2, 'Understand')
    await add(e, n(6, (i) => `Solve ${i + 3}x − 4 = ${(i + 3) * 2 + 4} and check your answer.`), 'short_answer', 2, 'Remember')
    await add(f, n(8, (i) => `Riya ate ${i + 1}/8 of a cake and Sam ate ${i + 2}/8. How much is left? Show your working.`), 'short_answer', 3, 'Apply')
    await add(d, n(4, (i) => `The marks of five students are ${i + 10}, ${i + 12}, ${i + 9}, ${i + 15} and ${i + 14}. Find the mean and the range.`), 'short_answer', 3, 'Understand')
    await add(f, n(4, (i) => `A tank is ${i + 2}/5 full. After ${i + 30} litres are added it is full. Find the capacity, and explain your method.`), 'long_answer', 4, 'Analyse')
    await add(e, n(3, (i) => `Make an equation for this: “${i + 4} more than twice a number is ${2 * (i + 5) + i + 4}”. Solve it and check.`), 'long_answer', 4, 'Evaluate')
  }
  function i2bloom(_: number) {
    return 'Understand'
  }

  test.beforeAll(async ({ browser }) => {
    browserRef = browser
    db = createDb()
    subjectId = (await db.insertInto('subjects').values({ board: 'CBSE', class: 7, code: `E2E-BU-${tag}`, name: 'Mathematics', language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()).id
    await buildBank()
    const d = await provisionSampleSchool(db, {
      name: 'Sri Vidya High School',
      code: `bu-${tag}`,
      adminName: 'Lakshmi Office',
      adminEmail: `bu-office-${tag}@e2e.school`,
      teacherName: 'Ravi Teacher',
      teacherEmail: `bu-teacher-${tag}@e2e.school`,
      subjectCodes: [`E2E-BU-${tag}`],
    })
    schoolId = d.schoolId
    teacherUserId = (await db.selectFrom('school_members').select('user_id').where('school_id', '=', schoolId).where('role', '=', 'teacher').executeTakeFirstOrThrow()).user_id
    const session = await signInSchoolUserForTest(teacherUserId)
    const ctx = await browserRef.newContext({ viewport: WIDE })
    const eq = session.cookie.indexOf('=')
    await ctx.addCookies([{ name: session.cookie.slice(0, eq), value: session.cookie.slice(eq + 1), url: 'http://localhost:3000' }])
    page = await ctx.newPage()
  })

  test.afterAll(async () => {
    const { sql } = await import('kysely')
    const ids = [schoolId]
    const mem = await db.selectFrom('school_members').select('user_id').where('school_id', 'in', ids).execute()
    const own = await db.selectFrom('school_questions').select('question_id').where('school_id', 'in', ids).execute()
    await db.updateTable('school_questions').set({ replaced_by_id: null }).where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_questions').where('school_id', 'in', ids).execute()
    const mu = mem.map((m) => m.user_id)
    for (const t of ['sessions', 'accounts', 'notifications']) await db.deleteFrom(t as 'sessions').where('user_id', 'in', mu).execute()
    for (const t of ['school_exam_versions', 'school_exam_questions', 'school_booklet_layouts', 'school_exam_sections', 'school_demo_results'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await db.updateTable('school_exams').set({ set_of: null }).where('school_id', 'in', ids).execute()
    for (const t of ['school_exams', 'school_paper_templates', 'audit_log', 'school_student_guardians', 'school_students'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
    for (const t of ['school_teacher_assignments', 'school_subjects', 'school_sections', 'school_classes', 'school_credential_codes'] as const)
      await sql`delete from ${sql.table(t)} where school_id in (${sql.join(ids)})`.execute(db).catch(() => undefined)
    await deleteSchoolTermsForTest(db, ids)
    if (own.length) {
      const qids = own.map((o) => o.question_id)
      await db.deleteFrom('question_options').where('question_id', 'in', qids).execute()
      await db.deleteFrom('question_step_marks').where('question_id', 'in', qids).execute()
      await db.deleteFrom('questions').where('id', 'in', qids).execute()
    }
    await db.deleteFrom('school_members').where('school_id', 'in', ids).execute()
    const sh = await db.selectFrom('schools').select('household_id').where('id', 'in', ids).execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    const hh = mu.length ? await db.selectFrom('users').select('household_id').where('id', 'in', mu).execute() : []
    if (mu.length) await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...sh.map((h) => h.household_id), ...hh.map((h) => h.household_id)]).execute().catch(() => undefined)
    // This spec's own "Mathematics" subject keeps its chapters and questions, so it is switched off rather than
    // deleted. Left on, the next spec's school wizard added it beside the real one and a teacher file saying
    // "Mathematics" no longer matched a single subject.
    await db.updateTable('subjects').set({ is_active: false }).where('id', '=', subjectId).execute()
    await db.destroy()
  })

  async function newPaper(title: string, mode: RegExp) {
    await page.goto(`/school/${schoolId}/exams/new`, { waitUntil: 'networkidle' })
    await page.getByLabel('Name of the exam').fill(title)
    await page.getByRole('radio', { name: /Unit Test, 40 marks/ }).check()
    for (const ch of [/Chapter 3 · Fractions and Decimals/, /Chapter 4 · Simple Equations/, /Chapter 5 · Data Handling/]) await page.getByLabel(ch).check()
    await page.getByRole('radio', { name: mode }).check()
    await page.getByRole('button', { name: /Make it, then let me change it|Start choosing questions/ }).click()
    await page.waitForURL(/\/exams\/build\//)
    await expect(page.getByTestId('paper-builder')).toBeVisible()
  }

  test('Auto + edit: the paper is filled, a swap offers questions of the same kind, one is swapped in', async () => {
    await newPaper('Unit Test 2', /^Auto \+ edit/)
    await expect(page.getByTestId('next-step')).toContainText('Everything is in place')
    const first = page.getByTestId('paper-question').first()
    await first.getByTestId('swap').click()
    const panel = page.getByTestId('swap-panel')
    await expect(panel).toBeVisible()
    await expect(panel.getByTestId('use-this').first()).toBeVisible()
    await panel.scrollIntoViewIfNeeded()
    await shot(page, 'builder-auto-edit-swap-1440')
    // the phone has its own layout: open the swap there too
    await page.setViewportSize(PHONE)
    await page.getByTestId('paper-question').first().getByTestId('swap').click()
    await expect(page.getByTestId('swap-panel')).toBeVisible()
    await shot(page, 'builder-auto-edit-swap-390')
    await page.setViewportSize(WIDE)
    await page.getByTestId('paper-question').first().getByTestId('swap').click()
    await expect(panel).toBeVisible()
    const before = await first.innerText()
    await panel.getByTestId('use-this').first().click()
    await expect(panel).toHaveCount(0)
    await expect(first).not.toHaveText(before)
  })

  test('Hand-pick: empty to start, filters narrow the bank, the checklist says what is missing', async () => {
    await newPaper('Unit Test 3', /^Hand-pick/)
    await expect(page.getByTestId('empty-place').first()).toBeVisible()
    await expect(page.getByTestId('next-step')).toContainText('needs')
    const bank = page.getByTestId('bank-panel')
    await bank.getByLabel('Type').selectOption('mcq')
    await bank.getByLabel('Level').selectOption('Remember')
    await expect(bank.getByTestId('bank-question').first()).toBeVisible()
    for (let i = 1; i <= 3; i++) {
      await bank.getByTestId('add-question').first().click()
      await expect(page.getByTestId('marks-count')).toContainText(`${i} of 40`)
    }
    await bank.getByRole('button', { name: 'Show answer' }).first().click()
    await expect(bank.getByTestId('bank-answer').first()).toContainText('Worked answer')
    await shot(page, 'builder-hand-pick-filters-1440')
    await page.getByTestId('checklist').scrollIntoViewIfNeeded()
    await page.getByText(/things to look at/).click()
    await expect(page.getByTestId('warnings')).toContainText('needs')
    await shot(page, 'builder-checklist-warning-1440')
    await page.setViewportSize(PHONE)
    await page.getByRole('tab', { name: 'Question bank' }).click()
    await shot(page, 'builder-hand-pick-filters-390')
    await page.getByRole('tab', { name: /Paper/ }).click()
    await page.getByTestId('checklist-bar').click()
    await shot(page, 'builder-checklist-warning-390')
    await page.setViewportSize(WIDE)
    // Make paper waits while the bank can still fill the empty places
    await expect(page.getByTestId('make-paper')).toBeDisabled()
  })

  test('Fill the rest, Make paper: the paper is finished and its question paper prints', async () => {
    await page.getByTestId('fill-rest').click()
    await expect(page.getByTestId('next-step')).toContainText('Everything is in place', { timeout: 30_000 })
    await page.getByTestId('make-paper').click()
    await page.waitForURL(/\/exams\/[0-9a-f-]{36}$/)
    await expect(page.getByText('Version 1', { exact: true })).toBeVisible()
    const examId = page.url().split('/').at(-1) as string
    const pdf = await page.request.get(`/api/schools/${schoolId}/exams/${examId}/question-paper`)
    expect(pdf.status()).toBe(200)
    if (SHOTS) writeFileSync(`${SHOTS}/builder-final-question-paper.pdf`, await pdf.body())
    await shot(page, 'builder-finished-exam-1440')
    // set B with the same questions in a new order
    await page.getByTestId('set-b-shuffle').click()
    await expect(page.getByText('Set B', { exact: true }).first()).toBeVisible()
  })

  test('Our questions: a teacher writes one, the AI suggests where it belongs, and Make paper offers it with its badge', async () => {
    await page.goto(`/school/${schoolId}/questions`, { waitUntil: 'networkidle' })
    await expect(page.getByRole('heading', { name: 'Our questions' })).toBeVisible()
    await shot(page, 'our-questions-empty-1440')
    await page.getByRole('button', { name: 'Write a question' }).first().click()
    const form = page.getByTestId('own-question-drawer')
    await form.getByLabel('Kind of question').selectOption('short_answer')
    await form.getByLabel('Marks', { exact: true }).selectOption('3')
    await form.getByLabel('Question', { exact: true }).fill('Meena had 3/4 of a pizza and ate 1/8 of it. How much is left? Show your working.')
    await form.getByLabel('Model answer').fill('3/4 − 1/8 = 6/8 − 1/8 = 5/8 of the pizza is left.')
    await form.getByLabel('Step 1', { exact: true }).fill('Writes both fractions with denominator 8')
    await form.getByLabel('Marks for step 1').fill('1')
    await form.getByRole('button', { name: 'Add a step' }).click()
    await form.getByLabel('Step 2', { exact: true }).fill('Subtracts correctly: 6/8 − 1/8')
    await form.getByLabel('Marks for step 2').fill('1')
    await form.getByRole('button', { name: 'Add a step' }).click()
    await form.getByLabel('Step 3', { exact: true }).fill('Answer 5/8 with the unit')
    await form.getByLabel('Marks for step 3').fill('1')
    await expect(form.getByTestId('oq-step-total')).toContainText('3 of 3 marks')
    await form.getByRole('button', { name: 'Suggest chapter and level' }).click()
    await expect(form.getByRole('status')).toContainText('Suggested')
    await expect(form.getByLabel('Chapter', { exact: true })).not.toHaveValue('')
    await expect(form.getByLabel('Topic', { exact: true })).not.toHaveValue('')
    await shot(page, 'our-questions-form-1440')
    await page.setViewportSize(PHONE)
    await shot(page, 'our-questions-form-390')
    await page.setViewportSize(WIDE)
    await form.getByRole('button', { name: 'Save question' }).click()
    await expect(page.getByTestId('our-questions-table')).toContainText('Meena had 3/4 of a pizza')
    await shot(page, 'our-questions-list-1440')
    await page.setViewportSize(PHONE)
    await shot(page, 'our-questions-list-390')
    await page.setViewportSize(WIDE)
    // in Make paper it is in the bank with the "Our question" badge
    await newPaper('Unit Test 4', /^Hand-pick/)
    const bank = page.getByTestId('bank-panel')
    await bank.getByLabel('From').selectOption('ours')
    await expect(bank.getByTestId('bank-question')).toHaveCount(1)
    await expect(bank.getByTestId('ours-badge')).toBeVisible()
    await bank.getByTestId('add-question').first().click()
    await expect(page.getByTestId('paper-question').getByTestId('ours-badge')).toBeVisible()
    await bank.getByTestId('bank-question').first().scrollIntoViewIfNeeded()
    await shot(page, 'builder-our-question-1440')
  })
})
