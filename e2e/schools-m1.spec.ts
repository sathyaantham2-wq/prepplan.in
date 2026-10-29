import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Browser, Page } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { schoolsRepository } from '../src/db/repositories'
import { issueFirstAdminCode } from '../src/lib/schools/credentials'
import { provisionDemoSchool } from '../src/lib/schools/demo-provision'

/**
 * PrepPlan for Schools, M1 on a phone: the first sign-in wizard (every question), the home screen with
 * its three big actions, and the demo school with its sample results. Provisions its own schools and
 * its own small question bank, and removes all of it afterwards. Screenshots go to SCHOOL_SHOTS.
 */
const SHOTS = process.env.SCHOOL_SHOTS ?? 'test-results/school-screens'
mkdirSync(SHOTS, { recursive: true })
const PHONE = { width: 390, height: 844 }
const PASSWORD = 'a-good-password-1'

test.use({ viewport: PHONE, hasTouch: true, isMobile: true })

async function shot(page: Page, name: string) {
  const size = page.viewportSize()
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  )
  if (size)
    await page.setViewportSize({
      width: size.width,
      height: Math.min(Math.max(height, size.height), 3000),
    })
  await page.waitForTimeout(150)
  await page.screenshot({ path: `${SHOTS}/${name}.png` })
  if (size) await page.setViewportSize(size)
}

/** One part of a long page, so it is not lost in a very tall picture. */
async function shotOf(page: Page, selector: string, name: string) {
  const box = await page
    .locator(selector)
    .first()
    .evaluate((el) => {
      const r = el.getBoundingClientRect()
      return {
        x: 0,
        y: r.top + window.scrollY,
        width: window.innerWidth,
        height: r.height,
      }
    })
  await page.screenshot({
    path: `${SHOTS}/${name}.png`,
    fullPage: true,
    clip: box,
  })
}

async function looksRight(page: Page) {
  const r = await page.evaluate(() => {
    const small: Array<string> = []
    for (const el of document.querySelectorAll<HTMLElement>(
      '[data-no-sound] :is(button, select, input:not([type=checkbox]):not([type=file]), a[class*="min-h"])',
    )) {
      const b = el.getBoundingClientRect()
      if (b.width > 0 && b.height > 0 && b.height < 44)
        small.push(
          `${el.tagName} "${(el.innerText || el.getAttribute('aria-label') || '').slice(0, 30)}" ${Math.round(b.height)}px`,
        )
    }
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      small,
    }
  })
  expect(r.overflow, 'page is wider than the screen').toBeLessThanOrEqual(0)
  expect(r.small, 'controls too small to tap').toEqual([])
}

async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
}

async function setPassword(page: Page, email: string, code: string) {
  await open(page, '/school/set-password')
  await page.getByRole('button', { name: /teacher or office staff/ }).click()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Code from your slip').fill(code)
  await page.getByLabel('Choose a password').fill(PASSWORD)
  await page.getByLabel('Type it again').fill(PASSWORD)
  await page.getByRole('button', { name: 'Save and continue' }).click()
}

test.describe.serial('M1: wizard, home and the demo school on a phone', () => {
  let db: Db
  let browserRef: Browser
  const tag = `${Date.now()}`.slice(-8)
  const subjectCode = `E2E-M1-${tag}`
  const wizEmail = `wiz-${tag}@e2e.school`
  const demoAdminEmail = `demo-office-${tag}@e2e.school`
  const demoTeacherEmail = `demo-teacher-${tag}@e2e.school`
  let subjectId = ''
  let sourceId = ''
  let wizSchoolId = ''
  let wizCode = ''
  let demoSchoolId = ''
  let demoTeacherCode = ''
  const schoolIds: Array<string> = []

  async function buildBank() {
    sourceId = (
      await db
        .insertInto('sources')
        .values({
          subject_id: subjectId,
          title: 'Ganita Prakash',
          publisher: 'NCERT',
        })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    const chapter = async (no: number, name: string, n: number) => {
      const ch = await db
        .insertInto('chapters')
        .values({
          source_id: sourceId,
          subject_id: subjectId,
          part: 'I',
          chapter_no: no,
          name,
          order_index: no,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      const ids: Array<string> = []
      for (let i = 1; i <= n; i++)
        ids.push(
          (
            await db
              .insertInto('concepts')
              .values({
                chapter_id: ch.id,
                board: 'CBSE',
                class: 7,
                code: `E2E-M1-${tag}-${no}.${i}`,
                name: `${name} ${i}`,
                difficulty_base: 'Easy',
              })
              .returning('id')
              .executeTakeFirstOrThrow()
          ).id,
        )
      return ids
    }
    const add = async (
      concept: string,
      n: number,
      type: string,
      marks: number,
      bloom: string,
    ) => {
      for (let i = 0; i < n; i++) {
        const q = await db
          .insertInto('questions')
          .values({
            concept_id: concept,
            board: 'CBSE',
            class: 7,
            bloom: bloom as never,
            difficulty: 'Easy',
            marks,
            type: type as never,
            text: `E2E M1 ${tag} ${Math.random()}`,
            text_hash: `e2e-m1-${tag}-${Math.random()}`,
            answer: 'a',
            status: 'approved',
            origin: 'manual',
            created_by: 'e2e',
            tags: [],
          })
          .returning('id')
          .executeTakeFirstOrThrow()
        if (type === 'mcq' || type === 'assertion_reason')
          for (const [i2, label] of ['A', 'B', 'C', 'D'].entries())
            await db
              .insertInto('question_options')
              .values({
                question_id: q.id,
                label,
                text: `Option ${label}`,
                is_correct: i2 === 0,
                order_index: i2 + 1,
              })
              .execute()
      }
    }
    const [f1, f2] = await chapter(3, 'Fractions and Decimals', 2)
    const [e1] = await chapter(4, 'Simple Equations', 1)
    const [d1] = await chapter(5, 'Data Handling', 1)
    await add(f1, 14, 'mcq', 1, 'Understand')
    await add(e1, 10, 'mcq', 1, 'Apply')
    await add(d1, 6, 'assertion_reason', 1, 'Apply')
    await add(f2, 8, 'short_answer', 2, 'Understand')
    await add(e1, 6, 'short_answer', 2, 'Remember')
    await add(f1, 8, 'short_answer', 3, 'Apply')
    await add(d1, 4, 'short_answer', 3, 'Understand')
    await add(f2, 4, 'long_answer', 4, 'Analyse')
    await add(e1, 3, 'long_answer', 4, 'Evaluate')
  }

  test.beforeAll(async ({ browser }) => {
    browserRef = browser
    db = createDb()
    subjectId = (
      await db
        .insertInto('subjects')
        .values({
          board: 'CBSE',
          class: 7,
          code: subjectCode,
          name: 'Mathematics',
          language: 'en',
          is_active: true,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
    ).id
    await buildBank()
    const w = await schoolsRepository.provision(db, {
      name: 'Greenfield School',
      code: `wiz-${tag}`,
      board: 'CBSE',
      adminName: 'Office Admin',
      adminEmail: wizEmail,
    })
    wizSchoolId = w.school.id
    schoolIds.push(wizSchoolId)
    wizCode = (await issueFirstAdminCode(db, wizSchoolId, w.adminMemberId)).code
    const d = await provisionDemoSchool(db, {
      name: 'PrepPlan Demo School',
      code: `demo-${tag}`,
      adminName: 'Demo Office',
      adminEmail: demoAdminEmail,
      teacherName: 'Demo Teacher',
      teacherEmail: demoTeacherEmail,
      subjectCodes: [subjectCode],
    })
    demoSchoolId = d.schoolId
    schoolIds.push(demoSchoolId)
    demoTeacherCode = d.teacherCode ?? ''
  })

  test.afterAll(async () => {
    const ids = schoolIds
    const members = await db
      .selectFrom('school_members')
      .select('user_id')
      .where('school_id', 'in', ids)
      .execute()
    const mu = members.map((m) => m.user_id)
    const hh = await db
      .selectFrom('users')
      .select('household_id')
      .where('id', 'in', mu)
      .execute()
    const sh = await db
      .selectFrom('schools')
      .select('household_id')
      .where('id', 'in', ids)
      .execute()
    for (const t of ['sessions', 'accounts', 'notifications'])
      await db
        .deleteFrom(t as 'sessions')
        .where('user_id', 'in', mu)
        .execute()
    for (const t of [
      'school_demo_results',
      'school_credential_codes',
      'school_print_job_parts',
      'school_print_jobs',
      'school_scan_chunks',
      'school_scan_pages',
      'school_scan_batches',
      'school_exam_absences',
      'audit_log',
      'school_booklet_pages',
      'school_booklets',
      'school_booklet_layouts',
      'school_exam_questions',
      'school_exam_sections',
      'school_exams',
      'school_student_guardians',
      'school_students',
      'students',
      'school_import_batches',
      'school_paper_templates',
      'school_teacher_assignments',
      'school_subjects',
      'school_sections',
      'school_classes',
    ] as const)
      await db
        .deleteFrom(t as 'school_exams')
        .where('school_id', 'in', ids)
        .execute()
    const { sql } = await import('kysely')
    await sql`alter table school_terms_acceptances disable trigger school_terms_acceptances_append_only`.execute(
      db,
    )
    await db
      .deleteFrom('school_terms_acceptances')
      .where('school_id', 'in', ids)
      .execute()
    await sql`alter table school_terms_acceptances enable trigger school_terms_acceptances_append_only`.execute(
      db,
    )
    await db
      .deleteFrom('school_members')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db
      .deleteFrom('households')
      .where('id', 'in', [
        ...hh.map((h) => h.household_id),
        ...sh.map((h) => h.household_id),
      ])
      .execute()
    const qs = await db
      .selectFrom('questions')
      .select('id')
      .where('created_by', '=', 'e2e')
      .where('text', 'like', `E2E M1 ${tag}%`)
      .execute()
    if (qs.length)
      await db
        .deleteFrom('question_options')
        .where(
          'question_id',
          'in',
          qs.map((q) => q.id),
        )
        .execute()
    await db
      .deleteFrom('questions')
      .where('created_by', '=', 'e2e')
      .where('text', 'like', `E2E M1 ${tag}%`)
      .execute()
    await db
      .deleteFrom('concepts')
      .where('code', 'like', `E2E-M1-${tag}-%`)
      .execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  let page: Page
  test('the first sign-in opens the wizard at question 1, with a progress bar and a way to skip', async () => {
    page = await (
      await browserRef.newContext({
        viewport: PHONE,
        hasTouch: true,
        isMobile: true,
      })
    ).newPage()
    await setPassword(page, wizEmail, wizCode)
    await page.waitForURL(`**/school/${wizSchoolId}/welcome`)
    await expect(
      page.getByRole('heading', { name: 'Welcome. What should we call you?' }),
    ).toBeVisible()
    await expect(page.getByText('Question 1 of 5')).toBeVisible()
    await expect(
      page.getByRole('progressbar', { name: 'Setup progress' }),
    ).toHaveAttribute('aria-valuenow', '1')
    await expect(
      page.getByRole('button', { name: 'Skip for now' }),
    ).toBeVisible()
    await shot(page, 'm1-01-wizard-you')
    await looksRight(page)
    await page.getByLabel('Your name').fill('Meera Iyer')
    await page.getByLabel(/Your mobile number/).fill('98765 43210')
    await page.getByRole('button', { name: 'Next' }).click()
  })

  test('question 2: the school, its board, and the terms', async () => {
    await expect(
      page.getByRole('heading', { name: 'What is your school called?' }),
    ).toBeVisible()
    await expect(page.getByText('Question 2 of 5')).toBeVisible()
    await page.getByLabel('School name').fill('Greenfield Public School')
    await page.getByLabel('Town or city').fill('Pune')
    await page.getByLabel(/I accept the PrepPlan school terms/).check()
    await shot(page, 'm1-02-wizard-school')
    await looksRight(page)
    await page.getByRole('button', { name: 'Next' }).click()
  })

  test('question 3: the classes and their sections; the subjects are added for her', async () => {
    await expect(
      page.getByRole('heading', {
        name: 'Which classes does your school have?',
      }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Class 6' }).click()
    await page.getByRole('button', { name: 'Class 7' }).click()
    await page.getByLabel('Class 7: how many sections?').selectOption('2')
    await shot(page, 'm1-03-wizard-classes')
    await looksRight(page)
    await page.getByRole('button', { name: 'Next' }).click()
  })

  test('question 4: a teacher is added with her class and subject', async () => {
    await expect(
      page.getByRole('heading', { name: 'Who teaches at your school?' }),
    ).toBeVisible()
    await expect(page.getByLabel('Which class and section?')).toContainText(
      'Class 7 · Section A',
    )
    await shot(page, 'm1-04-wizard-teachers')
    await page.getByLabel('Teacher’s name').fill('Neha Kulkarni')
    await page.getByLabel('Teacher’s e-mail').fill(`neha-${tag}@e2e.school`)
    await page
      .getByLabel('Which class and section?')
      .selectOption({ label: 'Class 7 · Section A' })
    await page.getByRole('button', { name: 'Add this teacher' }).click()
    await expect(page.getByText('Neha Kulkarni was added.')).toBeVisible()
    await expect(page.getByTestId('wizard-teachers')).toContainText(
      'Neha Kulkarni',
    )
    await shot(page, 'm1-05-wizard-teacher-added')
    await looksRight(page)
    await page.getByRole('button', { name: 'Next' }).click()
  })

  test('question 5: students from a file', async () => {
    await expect(
      page.getByRole('heading', { name: 'Now your students' }),
    ).toBeVisible()
    await expect(page.getByText('Question 5 of 5')).toBeVisible()
    await shot(page, 'm1-06-wizard-students')
    await page.getByRole('button', { name: 'Choose my student list' }).click()
    await page.locator('input[type=file]').setInputFiles({
      name: 'students.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(
        'Name,Class,Section,Roll No,Admission No,Parent Phone\nAsha Rao,7,A,1,2024/0101,9876543210\nRavi Kumar,7,A,2,2024/0102,9876543211\nKiran Das,7,B,1,2024/0103,\n',
      ),
    })
    await page.getByRole('button', { name: 'Check my file' }).click()
    await expect(
      page.getByRole('button', { name: /Add them|Add 3/ }),
    ).toBeVisible()
    await shot(page, 'm1-07-wizard-students-checked')
    await page.getByRole('button', { name: /Add them|Add 3/ }).click()
    await expect(page.getByTestId('wizard-students')).toContainText(
      '3 students added',
      { timeout: 20_000 },
    )
    await looksRight(page)
  })

  test('every step can be skipped, and "You are ready" sums up what was done', async () => {
    // a student list was added, so this step has no "skip"; the others do
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(
      page.getByRole('heading', { name: 'You are ready' }),
    ).toBeVisible()
    await expect(page.getByText('School terms accepted')).toBeVisible()
    await expect(page.getByText('3 students added')).toBeVisible()
    await shot(page, 'm1-08-wizard-done')
    await looksRight(page)
    await page.getByRole('button', { name: 'Go to my school' }).click()
    await page.waitForURL(`**/school/${wizSchoolId}`)
  })

  test('the home screen shows three big actions', async () => {
    const big = page.getByTestId('big-actions')
    await expect(big.getByRole('link', { name: /Make a paper/ })).toBeVisible()
    await expect(
      big.getByRole('link', { name: /Upload answer sheets/ }),
    ).toBeVisible()
    await expect(big.getByRole('link', { name: /See results/ })).toBeVisible()
    await expect(page.getByTestId('demo-banner')).toHaveCount(0)
    await shot(page, 'm1-09-home-three-actions')
    await looksRight(page)
    // the wizard does not come back, and a real school has no results yet
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.getByTestId('big-actions')).toBeVisible()
    await big.getByRole('link', { name: /See results/ }).click()
    await expect(
      page.getByText(
        'Results appear here after the answer sheets of an exam have been marked.',
      ),
    ).toBeVisible()
    await shot(page, 'm1-10-results-empty-real-school')
    await looksRight(page)
  })

  test('a skipped wizard: the office can leave at question 1 and still reach the home screen', async () => {
    // a second admin would be needed for a pristine school; instead reopen this school's wizard
    const res = await page.request.post(`/api/schools/${wizSchoolId}/wizard`, {
      data: { action: 'reopen' },
    })
    expect(res.status()).toBe(200)
    await open(page, `/school/${wizSchoolId}`)
    await page.waitForURL(`**/welcome`)
    await page.getByRole('button', { name: 'Skip for now' }).click()
    await expect(page.getByText('Question 2 of 5')).toBeVisible()
    await page.getByRole('button', { name: 'Back' }).click()
    await expect(page.getByText('Question 1 of 5')).toBeVisible()
    await page
      .getByRole('button', { name: 'Leave setup, I will do it later' })
      .click()
    await page.waitForURL(`**/school/${wizSchoolId}`)
    await expect(page.getByTestId('big-actions')).toBeVisible()
  })

  let teacher: Page
  test('the demo teacher signs in and sees the DEMO label, the three actions and Reset demo', async () => {
    teacher = await (
      await browserRef.newContext({
        viewport: PHONE,
        hasTouch: true,
        isMobile: true,
      })
    ).newPage()
    await setPassword(teacher, demoTeacherEmail, demoTeacherCode)
    await teacher.waitForURL(`**/school/${demoSchoolId}`)
    await expect(teacher.getByTestId('demo-banner')).toHaveText(
      'DEMO - sample data',
    )
    await expect(teacher.getByTestId('big-actions')).toBeVisible()
    await expect(
      teacher.getByRole('button', { name: 'Reset demo' }),
    ).toBeVisible()
    await expect(teacher.getByTestId('demo-cap')).toContainText('₹50')
    await expect(teacher.getByText('You are the class teacher')).toBeVisible()
    await shot(teacher, 'm1-11-demo-home')
    await looksRight(teacher)
  })

  let examUrl = ''
  test('"Make a paper" gives a real paper from the bank in one go', async () => {
    await teacher
      .getByTestId('big-actions')
      .getByRole('link', { name: /Make a paper/ })
      .click()
    await expect(
      teacher.getByRole('heading', { name: 'Make an exam paper' }),
    ).toBeVisible()
    await teacher.getByLabel('Name of the exam').fill('Unit Test 1')
    await teacher
      .getByLabel('Paper layout')
      .selectOption({ label: 'Unit Test, 40 marks' })
    await teacher.getByLabel(/Chapter 3 · Fractions and Decimals/).check()
    await teacher.getByLabel(/Chapter 4 · Simple Equations/).check()
    await teacher.getByLabel(/Chapter 5 · Data Handling/).check()
    await shot(teacher, 'm1-12-demo-make-paper')
    await looksRight(teacher)
    await teacher.getByRole('button', { name: 'Make the paper' }).click()
    await teacher.waitForURL(/\/exams\/[0-9a-f-]{36}$/)
    examUrl = teacher.url()
    await expect(
      teacher.getByRole('heading', { name: 'Unit Test 1' }),
    ).toBeVisible()
    await expect(teacher.getByTestId('demo-sample-card')).toBeVisible()
    await shotOf(
      teacher,
      '[data-testid=demo-sample-card]',
      'm1-13-demo-sample-button',
    )
    await looksRight(teacher)
  })

  test('"Use sample answer sheets" shows the class results: marks, where they were lost, heatmap and flags', async () => {
    await teacher
      .getByRole('button', { name: 'Use sample answer sheets' })
      .click()
    await expect(teacher.getByTestId('class-results')).toBeVisible({
      timeout: 30_000,
    })
    await expect(
      teacher.getByRole('heading', { name: 'Unit Test 1' }),
    ).toBeVisible()
    await expect(teacher.getByTestId('demo-banner')).toBeVisible()
    await expect(teacher.getByText('DEMO - sample data').first()).toBeVisible()
    await shotOf(
      teacher,
      '[data-testid=class-results]',
      'm1-14-demo-results-class-top',
    )
    await expect(teacher.getByTestId('topics-to-fix')).toBeVisible()
    await shotOf(teacher, '[data-testid=heatmap]', 'm1-15-demo-habit-heatmap')
    await expect(
      teacher.getByTestId('heatmap').locator('tbody tr'),
    ).toHaveCount(30)
    await shotOf(teacher, '[data-testid=flags]', 'm1-16-demo-teacher-flags')
    expect(
      await teacher.getByTestId('flags').locator('li').count(),
    ).toBeGreaterThanOrEqual(3)
    await shotOf(
      teacher,
      '[data-testid=student-list]',
      'm1-17-demo-student-list',
    )
    await expect(teacher.getByTestId('student-list').locator('li')).toHaveCount(
      30,
    )
    await looksRight(teacher)
  })

  test('one student report: knowledge gap against writing habit, strengths and topics to fix', async () => {
    await teacher.getByTestId('student-list').locator('li a').first().click()
    await expect(teacher.getByTestId('student-report')).toBeVisible()
    await expect(teacher.getByText('Not learnt yet:')).toBeVisible()
    await expect(teacher.getByText('Writing habit:')).toBeVisible()
    await expect(teacher.getByTestId('strengths')).toBeVisible()
    await expect(teacher.getByTestId('to-fix')).toBeVisible()
    await expect(teacher.getByText('DEMO - sample data').first()).toBeVisible()
    await shot(teacher, 'm1-18-demo-student-report')
    await looksRight(teacher)
    await teacher.getByRole('button', { name: 'Back to the class' }).click()
    await expect(teacher.getByTestId('class-results')).toBeVisible()
  })

  test('Reset demo puts it all away, and the demo is ready to use again', async () => {
    await open(teacher, `/school/${demoSchoolId}`)
    teacher.once('dialog', (d) => void d.accept())
    await teacher.getByRole('button', { name: 'Reset demo' }).click()
    await expect(teacher.getByText('The demo is reset.')).toBeVisible()
    await shot(teacher, 'm1-19-demo-reset')
    await teacher
      .getByTestId('big-actions')
      .getByRole('link', { name: /See results/ })
      .click()
    await expect(teacher.getByText('No sample results yet.')).toBeVisible()
    const old = await teacher.request.get(
      examUrl
        .replace('/school/', '/api/schools/')
        .replace(/\/exams\//, '/results/'),
    )
    expect(old.status()).toBe(404)
    await teacher.getByRole('link', { name: 'Exams' }).last().click()
    await expect(teacher.getByText('Unit Test 1')).toHaveCount(0)
  })
})
