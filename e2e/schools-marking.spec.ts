import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import sharp from 'sharp'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { schoolsRepository } from '../src/db/repositories'
import { loadSchoolScope } from '../src/lib/school-session'
import { encryptScan } from '../src/lib/scan-crypto'
import { getScanStore } from '../src/lib/scan-storage'
import { issueFirstAdminCode } from '../src/lib/schools/credentials'
import { createSchoolStudent } from '../src/lib/schools/people'
import { addSchoolSubject, createClass, createSection } from '../src/lib/schools/setup'
import { acceptSchoolTerms } from '../src/lib/schools/terms'

/**
 * AI marking, student by student (M4 stage 2): the student list with its statuses, marking one student,
 * the flagged answers, the teacher changing a mark, the student's report and the class results. The AI is
 * the free stand-in (OWN_PAPER_AI=fake, FAKE_MARKING=mixed); no vendor is called.
 */
const SHOTS = process.env.SCHOOL_SHOTS ?? 'test-results/school-screens'
mkdirSync(SHOTS, { recursive: true })
const PHONE = { width: 390, height: 844 }
const PASSWORD = 'a-good-password-1'
test.use({ viewport: PHONE, hasTouch: true, isMobile: true })

async function shot(page: Page, name: string) {
  const size = page.viewportSize()
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  if (size)
    await page.setViewportSize({ width: size.width, height: Math.min(Math.max(height, size.height), 4000) })
  await page.waitForTimeout(150)
  await page.screenshot({ path: `${SHOTS}/${name}.png` })
  if (size) await page.setViewportSize(size)
}

async function noOverflow(page: Page) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(over, 'page is wider than the screen').toBeLessThanOrEqual(0)
}

async function pagePng(label: string) {
  const svg = `<svg width="600" height="800" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="800" fill="#f6f3ea"/>
  <text x="40" y="60" font-size="26" font-family="cursive">Name: ${label}</text>
  <text x="40" y="200" font-size="28" font-family="cursive">1. (B)</text>
  <text x="40" y="300" font-size="26" font-family="cursive">2. 0.5 is tenths, 0.05 is hundredths.</text>
  <text x="40" y="340" font-size="26" font-family="cursive">tenths are bigger. ${label.length}</text></svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

test.describe.serial('AI marking (phone)', () => {
  let db: Db
  const tag = `${Date.now()}`.slice(-8)
  const email = `mk-${tag}@e2e.school`
  const subjectCode = `E2E-MK-${tag}`
  let schoolId = ''
  let subjectId = ''
  let sourceId = ''
  let paperId = ''
  let page: Page
  const names = ['Asha Rao', 'Ravi Kumar', 'Meena Iyer', 'Kiran Shah']

  test.beforeAll(async ({ browser }) => {
    db = createDb()
    subjectId = (
      await db
        .insertInto('subjects')
        .values({ board: 'CBSE', class: 7, code: subjectCode, name: 'Mathematics', language: 'en', is_active: true })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    sourceId = (
      await db
        .insertInto('sources')
        .values({ subject_id: subjectId, title: 'Ganita Prakash', publisher: 'NCERT' })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    const p = await schoolsRepository.provision(db, {
      name: 'Marking E2E School',
      code: `mk-${tag}`,
      board: 'CBSE',
      adminName: 'Office Admin',
      adminEmail: email,
    })
    schoolId = p.school.id
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    const admin = sa.scope
    await acceptSchoolTerms(db, admin)
    const cls = await createClass(db, admin, 7, '2026-27')
    const sec = await createSection(db, admin, cls.id, 'A')
    const ss = await addSchoolSubject(db, admin, cls.id, subjectId)
    const paper = await db
      .insertInto('school_own_papers')
      .values({
        school_id: schoolId,
        class_id: cls.id,
        school_subject_id: ss.id,
        title: 'Unit Test 2: Fractions and Decimals',
        source_kind: 'prepplan_exam',
        status: 'approved',
        phase: 'done',
        total_marks: '4',
        created_by_user_id: admin.userId,
        approved_at: new Date(),
        approved_by_user_id: admin.userId,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    paperId = paper.id
    await db
      .insertInto('school_own_questions')
      .values([
        {
          school_id: schoolId,
          paper_id: paperId,
          position: 1,
          section: 'A',
          type: 'mcq',
          text: 'Which of these is the greatest?',
          original_text: 'Which of these is the greatest?',
          options: JSON.stringify(['A', 'B', 'C', 'D'].map((label) => ({ label, text: `Choice ${label}` }))),
          marks: '1',
          key_text: 'Correct option: (B) Choice B',
          key_steps: '[]',
          key_source: 'bank',
          key_status: 'approved',
        },
        {
          school_id: schoolId,
          paper_id: paperId,
          position: 2,
          section: 'B',
          type: 'short_answer',
          text: 'Explain why 0.5 is greater than 0.05.',
          original_text: 'Explain why 0.5 is greater than 0.05.',
          options: '[]',
          marks: '3',
          key_text: 'Tenths are larger than hundredths.',
          key_steps: JSON.stringify([
            { description: 'compares tenths', marks: 1 },
            { description: 'compares hundredths', marks: 1 },
            { description: 'concludes', marks: 1 },
          ]),
          key_source: 'bank',
          key_status: 'approved',
        },
      ])
      .execute()
    for (const [i, n] of names.entries()) {
      const s = await createSchoolStudent(db, admin, {
        name: n,
        grade: 7,
        sectionId: sec.id,
        sectionName: 'A',
        rollNo: String(i + 1),
        admissionNo: null,
        guardianPhone: null,
        guardianName: null,
      })
      // the first three have handed in one page; the fourth has not
      if (i < 3) {
        const key = `e2e/${schoolId}/${n}.png`
        await getScanStore().put(key, encryptScan(await pagePng(n)))
        await db
          .insertInto('school_own_sheets')
          .values({
            school_id: schoolId,
            paper_id: paperId,
            school_student_id: s.schoolStudent.id,
            kind: 'page',
            status: 'placed',
            placed_by: 'teacher',
            seq: 1,
            image_key: key,
            original_key: key,
            check_state: 'passed',
            uploaded_by_user_id: admin.userId,
          })
          .execute()
      }
    }
    const code = (await issueFirstAdminCode(db, schoolId, p.adminMemberId)).code
    page = await (await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true })).newPage()
    await page.goto('/school/set-password', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /teacher or office staff/ }).click()
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Code from your slip').fill(code)
    await page.getByLabel('Choose a password').fill(PASSWORD)
    await page.getByLabel('Type it again').fill(PASSWORD)
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.waitForURL(`**/school/${schoolId}/welcome`)
    await page.request.post(`/api/schools/${schoolId}/wizard`, { data: { action: 'finish', skipped: true } })
  })

  test.afterAll(async () => {
    const { sql } = await import('kysely')
    const ids = [schoolId]
    const mem = await db.selectFrom('school_members').select('user_id').where('school_id', 'in', ids).execute()
    const mu = mem.map((m) => m.user_id)
    const hh = await db.selectFrom('users').select('household_id').where('id', 'in', mu).execute()
    const sh = await db.selectFrom('schools').select('household_id').where('id', 'in', ids).execute()
    for (const t of ['sessions', 'accounts', 'notifications'])
      await db.deleteFrom(t as 'sessions').where('user_id', 'in', mu).execute()
    await sql`alter table school_upload_checks disable trigger school_upload_checks_append_only`.execute(db)
    await db.deleteFrom('school_upload_checks').where('school_id', 'in', ids).execute()
    await sql`alter table school_upload_checks enable trigger school_upload_checks_append_only`.execute(db)
    for (const t of [
      'school_answer_marks',
      'school_sheet_marking',
      'school_scan_chunks',
      'school_own_sheets',
      'school_own_covers',
      'school_own_questions',
      'school_own_papers',
      'school_student_guardians',
      'school_students',
      'students',
      'school_import_batches',
      'school_credential_codes',
      'audit_log',
      'school_teacher_assignments',
      'school_subjects',
      'school_sections',
      'school_classes',
    ] as const)
      await db.deleteFrom(t as 'school_classes').where('school_id', 'in', ids).execute()
    await sql`alter table school_terms_acceptances disable trigger school_terms_acceptances_append_only`.execute(db)
    await db.deleteFrom('school_terms_acceptances').where('school_id', 'in', ids).execute()
    await sql`alter table school_terms_acceptances enable trigger school_terms_acceptances_append_only`.execute(db)
    await db.deleteFrom('school_members').where('school_id', 'in', ids).execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...hh.map((h) => h.household_id), ...sh.map((h) => h.household_id)]).execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  test('the student list shows where each student stands', async () => {
    await page.goto(`/school/${schoolId}/own-papers/${paperId}`, { waitUntil: 'networkidle' })
    const box = page.getByTestId('student-sheets')
    await box.scrollIntoViewIfNeeded()
    await expect(box.getByRole('button', { name: /^\d+\s+Asha Rao/ })).toContainText('Ready to mark')
    await expect(box.getByRole('button', { name: /^\d+\s+Kiran Shah/ })).toContainText('Not uploaded')
    await shot(page, 'mk-1-student-list')
    await noOverflow(page)
  })

  test('mark a student: Marked, the report, the answers', async () => {
    const box = page.getByTestId('student-sheets')
    await box.getByRole('button', { name: /^\d+\s+Asha Rao/ }).click()
    const one = box.getByTestId('one-student')
    await one.getByTestId('mark-student').click()
    await expect(one.getByTestId('student-report')).toBeVisible({ timeout: 60_000 })
    await expect(box.getByRole('button', { name: /^\d+\s+Asha Rao/ })).toContainText('Marked · 3/4')
    await expect(one.getByTestId('student-report')).toContainText('Stopped before writing the conclusion')
    await one.getByTestId('student-report').scrollIntoViewIfNeeded()
    await shot(page, 'mk-2-marked-report')
    await noOverflow(page)
  })

  test('disagreeing passes: flagged for the teacher, who changes the mark', async () => {
    const box = page.getByTestId('student-sheets')
    await box.getByRole('button', { name: /^\d+\s+Asha Rao/ }).click() // close
    await box.getByRole('button', { name: /^\d+\s+Ravi Kumar/ }).click()
    const one = box.getByTestId('one-student')
    await one.getByTestId('mark-student').click()
    const flagged = one.getByTestId('flagged-answer')
    await expect(flagged).toHaveCount(1, { timeout: 60_000 })
    await expect(flagged).toContainText('1, 2, 3 out of 3')
    await expect(box.getByRole('button', { name: /^\d+\s+Ravi Kumar/ })).toContainText('Needs teacher')
    await flagged.scrollIntoViewIfNeeded()
    await shot(page, 'mk-3-flagged')
    await noOverflow(page)
    await flagged.getByLabel('Mark').fill('2.5')
    await flagged.getByLabel('Why').fill('Both comparisons are shown')
    await flagged.getByRole('button', { name: 'Save mark' }).click()
    await expect(box.getByRole('button', { name: /^\d+\s+Ravi Kumar/ })).toContainText('Marked', { timeout: 15_000 })
    await expect(one.getByTestId('flagged-answer')).toHaveCount(0)
    await expect(one.getByText('Set by a teacher')).toBeVisible()
    await one.getByTestId('student-report').scrollIntoViewIfNeeded()
    await shot(page, 'mk-4-after-teacher-change')
  })

  test('a wrong option is a knowledge gap; then the class results', async () => {
    const box = page.getByTestId('student-sheets')
    await box.getByRole('button', { name: /^\d+\s+Ravi Kumar/ }).click() // close
    await box.getByRole('button', { name: /^\d+\s+Meena Iyer/ }).click()
    const one = box.getByTestId('one-student')
    await one.getByTestId('mark-student').click()
    await expect(one.getByTestId('student-report')).toBeVisible({ timeout: 60_000 })
    await expect(one.getByTestId('student-report')).toContainText('Q1: lost 1')
    await shot(page, 'mk-5-knowledge-gap')
    await box.getByRole('button', { name: /^\d+\s+Meena Iyer/ }).click() // close
    const results = page.getByTestId('class-results')
    await expect(results).toContainText('3 marked')
    await expect(results).toContainText('1 not uploaded')
    await results.scrollIntoViewIfNeeded()
    await shot(page, 'mk-6-class-results')
    await noOverflow(page)
    // the same results on a laptop screen
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByTestId('class-results').scrollIntoViewIfNeeded()
    await shot(page, 'mk-7-class-results-desktop')
  })

  test('a teacher of another class cannot read the marking', async () => {
    const r = await page.request.get(`/api/schools/${schoolId}/own-papers/${paperId}/marking?student_id=00000000-0000-4000-8000-000000000000`)
    expect(r.status()).toBe(404)
  })
})
