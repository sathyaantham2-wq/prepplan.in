import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Browser, Page } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { schoolsRepository } from '../src/db/repositories'
import { issueFirstAdminCode } from '../src/lib/schools/credentials'

/**
 * PrepPlan for Schools, S3: the school screens on a phone-sized screen. Provisions its own school,
 * walks the admin through setup, then signs a teacher and a student in with their one-time codes.
 * Screenshots of every screen go to SCHOOL_SHOTS (default test-results/school-screens).
 */
const SHOTS = process.env.SCHOOL_SHOTS ?? 'test-results/school-screens'
mkdirSync(SHOTS, { recursive: true })
const PHONE = { width: 390, height: 844 }
const PASSWORD = 'a-good-password-1'

test.use({ viewport: PHONE, hasTouch: true, isMobile: true })

/** A clean picture of the whole page: the window is made as tall as the page so the fixed bottom menu stays at the bottom. */
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

async function looksRight(page: Page) {
  // Fits the screen width, and every control is big enough to tap.
  const r = await page.evaluate(() => {
    const small: Array<string> = []
    for (const el of document.querySelectorAll<HTMLElement>(
      // only the school screens themselves (not the developer tools shown in dev)
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

/** Opens a page and waits until it has finished loading, so the first tap is not lost to a page still starting up. */
async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
}

const csv = (lines: Array<string>) => Buffer.from(lines.join('\n') + '\n')
const CODE = /^[2-9A-HJKMNP-Z]{5}-[2-9A-HJKMNP-Z]{5}$/

test.describe.serial('school screens on a phone', () => {
  let db: Db
  const tag = `${Date.now()}`.slice(-8)
  const schoolCode = `e2e-${tag}`
  const adminEmail = `admin-${tag}@e2e.school`
  const teacherEmail = `tina-${tag}@e2e.school`
  let schoolId = ''
  let adminCode = ''
  let subjectId = ''
  let adminPage: Page
  let browserRef: Browser

  test.beforeAll(async ({ browser }) => {
    browserRef = browser
    db = createDb()
    const subject = await db
      .insertInto('subjects')
      .values({
        board: 'CBSE',
        class: 7,
        code: `E2E-${tag}`,
        name: 'E2E Maths',
        language: 'en',
        is_active: true,
      })
      .returning('id')
      .executeTakeFirstOrThrow()
    subjectId = subject.id
    const p = await schoolsRepository.provision(db, {
      name: 'Sunrise Public School',
      code: schoolCode,
      board: 'CBSE',
      city: 'Hyderabad',
      adminName: 'Anita Rao',
      adminEmail,
    })
    schoolId = p.school.id
    adminCode = (await issueFirstAdminCode(db, schoolId, p.adminMemberId)).code
    adminPage = await (
      await browser.newContext({
        viewport: PHONE,
        hasTouch: true,
        isMobile: true,
      })
    ).newPage()
  })

  test.afterAll(async () => {
    const ids = [schoolId]
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
    await db
      .deleteFrom('school_credential_codes')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db
      .deleteFrom('school_student_guardians')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_students')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
    await db
      .deleteFrom('school_import_batches')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_teacher_assignments')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_subjects')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_sections')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_classes')
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
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  test('the sign-in page is plainly a school page: no sign-up, nothing from the personal app', async ({
    page,
  }) => {
    await open(page, '/school/sign-in')
    await expect(
      page.getByRole('heading', { name: 'Sign in to your school' }),
    ).toBeVisible()
    await shot(page, '01-sign-in-student')
    const text = (await page.locator('body').innerText()).toLowerCase()
    for (const banned of [
      'sign up',
      'create account',
      'google',
      'guest',
      'whatsapp',
      'register',
    ])
      expect(text, banned).not.toContain(banned)
    await expect(page.getByLabel('School code')).toBeVisible()
    await expect(page.getByLabel('Your ID')).toBeVisible()
    await looksRight(page)
    await page.getByRole('tab', { name: 'Teacher or school office' }).click()
    await expect(page.getByLabel('Email')).toBeVisible()
    await shot(page, '02-sign-in-teacher')
    // a wrong password says so in plain words
    await page.getByLabel('Email').fill(adminEmail)
    await page.getByLabel('Password', { exact: true }).fill('not-the-password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByRole('alert')).toContainText('not right')
    await shot(page, '03-sign-in-wrong-password')
  })

  test('set-password: choices, then the office sets a password with the printed code', async () => {
    const page = adminPage
    await open(page, '/school/set-password')
    await expect(
      page.getByRole('heading', { name: 'Set up your sign-in' }),
    ).toBeVisible()
    await shot(page, '04-set-password-choices')
    await looksRight(page)
    await page.getByRole('button', { name: /teacher or office staff/ }).click()
    await page.getByLabel('Email').fill(adminEmail)
    await page.getByLabel('Code from your slip').fill(adminCode)
    await page.getByLabel('Choose a password').fill(PASSWORD)
    await page.getByLabel('Type it again').fill('different-password')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await expect(page.getByRole('alert')).toContainText('not the same')
    await page.getByLabel('Type it again').fill(PASSWORD)
    await shot(page, '05-set-password-staff-form')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.waitForURL(`**/school/${schoolId}`)
    await expect(
      page.getByRole('heading', { name: 'Get your school ready' }),
    ).toBeVisible()
  })

  test('the office home shows the steps; the terms come first', async () => {
    const page = adminPage
    await expect(page.getByText('Sunrise Public School').first()).toBeVisible()
    await shot(page, '06-admin-home-new-school')
    await looksRight(page)
    await page
      .getByRole('link', { name: /Accept the PrepPlan school terms/ })
      .click()
    await expect(
      page.getByRole('heading', { name: 'PrepPlan school terms' }),
    ).toBeVisible()
    await expect(page.getByTestId('terms-placeholder')).toContainText(
      'Placeholder',
    )
    await shot(page, '07-terms')
    await expect(
      page.getByRole('button', { name: 'Accept the terms' }),
    ).toBeDisabled()
    await page.getByLabel(/I have read these terms/).check()
    await page.getByRole('button', { name: 'Accept the terms' }).click()
    await expect(
      page.getByText('Your school has accepted the current terms.'),
    ).toBeVisible()
    await shot(page, '08-terms-accepted')
    await looksRight(page)
  })

  test('teachers: add from a file (errors shown first), then print a code', async () => {
    const page = adminPage
    await page.getByRole('link', { name: 'Teachers' }).last().click()
    await expect(page.getByRole('heading', { name: 'Teachers' })).toBeVisible()
    await page.getByRole('button', { name: 'Add teachers from a file' }).click()
    await page.locator('input[type=file]').setInputFiles({
      name: 'teachers.csv',
      mimeType: 'text/csv',
      buffer: csv([
        'Name,Email',
        `Tina Class,${teacherEmail}`,
        'Tom Maths,tom-' + tag + '@e2e.school',
        'Bad Row,not-an-email',
      ]),
    })
    await page.getByRole('button', { name: 'Check my file' }).click()
    await expect(page.getByText('need fixing')).toBeVisible()
    await expect(page.getByText('Line 3:')).toBeVisible()
    await shot(page, '09-teachers-upload-problems')
    await looksRight(page)
    await page.locator('input[type=file]').setInputFiles({
      name: 'teachers.csv',
      mimeType: 'text/csv',
      buffer: csv([
        'Name,Email',
        `Tina Class,${teacherEmail}`,
        'Tom Maths,tom-' + tag + '@e2e.school',
      ]),
    })
    await page.getByRole('button', { name: 'Check my file' }).click()
    await shot(page, '10-teachers-upload-ready')
    await page.getByRole('button', { name: /^Add 2 teachers$/ }).click()
    await expect(page.getByText('Done. 2 teachers added.')).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByText('Tina Class')).toBeVisible()
    await shot(page, '11-teachers-list')
    await looksRight(page)
  })

  test('classes: add a class, sections, a subject, class teachers and who teaches what', async () => {
    const page = adminPage
    await page.getByRole('link', { name: 'Classes' }).last().click()
    await expect(page.getByRole('heading', { name: 'Classes' })).toBeVisible()
    await shot(page, '12-classes-empty')
    await page.getByRole('button', { name: 'Add class' }).click()
    await expect(page.getByRole('heading', { name: /Class 7/ })).toBeVisible()
    for (const s of ['A', 'B']) {
      await page.getByLabel('New section').fill(s)
      await page.getByRole('button', { name: 'Add section' }).click()
      await expect(
        page.getByText(`Section ${s}`, { exact: true }),
      ).toBeVisible()
    }
    await page.getByLabel('Add a subject').selectOption({ label: 'E2E Maths' })
    await page.getByRole('button', { name: 'Add subject' }).click()
    await expect(page.getByText('E2E Maths').first()).toBeVisible()
    await page
      .getByLabel('Class teacher')
      .nth(0)
      .selectOption({ label: 'Tina Class' })
    await expect(page.getByText('Class teacher saved.')).toBeVisible()
    await page
      .getByLabel('E2E Maths')
      .nth(0)
      .selectOption({ label: 'Tom Maths' })
    await expect(page.getByText('E2E Maths: teacher saved.')).toBeVisible()
    await expect(page.getByLabel('Spot-checks done by')).toBeVisible()
    await shot(page, '13-classes-set-up')
    await looksRight(page)
  })

  test('students: a file with a mistake is stopped, a good one loads, the slips and a new code work', async () => {
    const page = adminPage
    await page.getByRole('link', { name: 'Students' }).last().click()
    await expect(page.getByRole('heading', { name: 'Students' })).toBeVisible()
    await page.getByRole('button', { name: 'Add students from a file' }).click()
    const head = 'Name,Class,Section,Roll No,Admission No,Parent Phone'
    await page.locator('input[type=file]').setInputFiles({
      name: 's.csv',
      mimeType: 'text/csv',
      buffer: csv([
        head,
        'Asha Rao,7,A,1,2024/0101,9876543210',
        'Ravi K,9,A,2,,',
      ]),
    })
    await page.getByRole('button', { name: 'Check my file' }).click()
    await expect(page.getByText('Class 9 is not set up')).toBeVisible()
    await shot(page, '14-students-upload-problems')
    await looksRight(page)
    await page.locator('input[type=file]').setInputFiles({
      name: 's.csv',
      mimeType: 'text/csv',
      buffer: csv([
        head,
        'Asha Rao,7,A,1,2024/0101,9876543210',
        'Ravi K,7,A,2,,',
        'Kiran B,7,B,1,2024/0103,',
      ]),
    })
    await page.getByRole('button', { name: 'Check my file' }).click()
    await shot(page, '15-students-upload-ready')
    await page.getByRole('button', { name: /^Add 3 students$/ }).click()
    await expect(page.getByText('Done. 3 students added.')).toBeVisible()
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByText('Asha Rao')).toBeVisible()
    await expect(page.getByText('2024/0101')).toBeVisible()
    await shot(page, '16-students-list')
    await looksRight(page)
    // the slips come back as a PDF
    const slips = page.waitForResponse(
      (r) =>
        r.url().includes('/credentials/students') &&
        r.request().method() === 'POST',
    )
    await page.getByRole('button', { name: /Print sign-in slips/ }).click()
    const res = await slips
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('application/pdf')
    await shot(page, '17-students-slips-made')
  })

  let studentId = ''
  let studentCode = ''
  test('a new password code can be given to one student', async () => {
    const page = adminPage
    await page
      .getByRole('button', { name: 'Give a new password code' })
      .first()
      .click()
    await shot(page, '18-reset-confirm')
    await page.getByRole('button', { name: 'Yes, give a new code' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    studentCode = (await dialog.getByText(CODE).innerText()).trim()
    studentId = (await dialog.locator('b').first().innerText()).trim()
    expect(studentId).toMatch(/^[A-Z0-9/._-]+$/)
    await shot(page, '19-student-code')
    await looksRight(page)
    await page.getByRole('button', { name: 'Close' }).click()
  })

  test('the student sets her own password, lands on her page, and the personal app is out of reach', async () => {
    const ctx = await browserRef.newContext({
      viewport: PHONE,
      hasTouch: true,
      isMobile: true,
    })
    const page = await ctx.newPage()
    await open(page, '/school/set-password')
    await page.getByRole('button', { name: /I am a student/ }).click()
    await page.getByLabel('School code').fill(schoolCode)
    await page.getByLabel('Your ID').fill(studentId)
    await page.getByLabel('Code from your slip').fill(studentCode)
    await page.getByLabel('Choose a password').fill(PASSWORD)
    await page.getByLabel('Type it again').fill(PASSWORD)
    await shot(page, '20-student-set-password')
    await looksRight(page)
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.waitForURL(`**/school/${schoolId}`)
    await expect(
      page.getByText(/Your exams and results will show here/),
    ).toBeVisible()
    await shot(page, '21-student-home')
    await looksRight(page)
    // the personal home page and its pages send her back to the school area
    await open(page, '/')
    await page.waitForURL('**/school/**')
    expect(page.url()).toContain('/school')
    // and the code cannot be used twice
    const again = await ctx.newPage()
    await open(again, '/school/set-password')
    await again.getByRole('button', { name: /I am a student/ }).click()
    await again.getByLabel('School code').fill(schoolCode)
    await again.getByLabel('Your ID').fill(studentId)
    await again.getByLabel('Code from your slip').fill(studentCode)
    await again.getByLabel('Choose a password').fill('another-password-2')
    await again.getByLabel('Type it again').fill('another-password-2')
    await again.getByRole('button', { name: 'Save and continue' }).click()
    await expect(again.getByRole('alert')).toContainText('not right')
    await shot(again, '22-student-code-used-twice')
    // sign out, sign in again with school code + ID + password
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.waitForURL('**/school/sign-in')
    await page.getByLabel('School code').fill(schoolCode)
    await page.getByLabel('Your ID').fill(studentId.toLowerCase())
    await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL(`**/school/${schoolId}`)
    await ctx.close()
  })

  test('the class teacher gets a code, signs in, sees her class and her students', async () => {
    const page = adminPage
    await page.getByRole('link', { name: 'Teachers' }).last().click()
    const card = page.locator('li', { hasText: 'Tina Class' })
    await card.getByRole('button', { name: 'Print a code instead' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const code = (await dialog.getByText(CODE).innerText()).trim()
    await shot(page, '23-teacher-code')
    await page.getByRole('button', { name: 'Close' }).click()

    const ctx = await browserRef.newContext({
      viewport: PHONE,
      hasTouch: true,
      isMobile: true,
    })
    const t = await ctx.newPage()
    await open(t, '/school/set-password')
    await t.getByRole('button', { name: /teacher or office staff/ }).click()
    await t.getByLabel('Email').fill(teacherEmail)
    await t.getByLabel('Code from your slip').fill(code)
    await t.getByLabel('Choose a password').fill(PASSWORD)
    await t.getByLabel('Type it again').fill(PASSWORD)
    await t.getByRole('button', { name: 'Save and continue' }).click()
    await t.waitForURL(`**/school/${schoolId}`)
    await expect(t.getByRole('heading', { name: 'Your classes' })).toBeVisible()
    await expect(t.getByText('You are the class teacher')).toBeVisible()
    await shot(t, '24-teacher-home')
    await looksRight(t)
    // a teacher has no set-up pages
    await expect(t.getByRole('link', { name: 'Classes' })).toHaveCount(0)
    await t.getByRole('link', { name: 'See students' }).click()
    await expect(t.getByText('Asha Rao')).toBeVisible()
    await expect(
      t.getByRole('button', { name: /Print sign-in slips/ }),
    ).toBeVisible()
    await expect(
      t.getByRole('button', { name: 'Add students from a file' }),
    ).toHaveCount(0)
    await shot(t, '25-teacher-students')
    await looksRight(t)
    await ctx.close()
  })

  test('on a wider screen the same pages show a top menu instead of the bottom bar', async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      viewport: { width: 1200, height: 800 },
    })
    const page = await ctx.newPage()
    await open(page, '/school/sign-in')
    await page.getByRole('tab', { name: 'Teacher or school office' }).click()
    await page.getByLabel('Email').fill(adminEmail)
    await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL(`**/school/${schoolId}`)
    await expect(
      page.getByRole('heading', { name: 'Get your school ready' }),
    ).toBeVisible()
    await shot(page, '26-admin-home-desktop')
    await ctx.close()
  })
})
