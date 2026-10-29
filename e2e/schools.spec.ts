import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import type { Browser, Page } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { schoolsRepository } from '../src/db/repositories'
import { issueFirstAdminCode } from '../src/lib/schools/credentials'
import { buildBookletsHtml } from '../src/lib/schools/booklet-html'
import type { BookletManifest } from '../src/lib/schools/booklet-layout'
import {
  photograph,
  renderPagePngs,
} from '../src/lib/schools/scan-test-support'

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

/** A picture of one part of the page (the whole page can be taller than a screenshot may be). */
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

  let sourceId = ''
  /** A small bank for the coverage preview: two chapters both numbered 3 (Part I and Part II), deep in some places and empty in others. */
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
    const chapter = async (
      part: string,
      no: number,
      name: string,
      nConcepts: number,
    ) => {
      const ch = await db
        .insertInto('chapters')
        .values({
          source_id: sourceId,
          subject_id: subjectId,
          part,
          chapter_no: no,
          name,
          order_index: no,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
      const ids: Array<string> = []
      for (let i = 1; i <= nConcepts; i++)
        ids.push(
          (
            await db
              .insertInto('concepts')
              .values({
                chapter_id: ch.id,
                board: 'CBSE',
                class: 7,
                code: `E2E-${tag}-${part}${no}.${i}`,
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
      tags: Array<string> = [],
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
            text: `E2E ${tag} ${Math.random()}`,
            text_hash: `e2e-${tag}-${Math.random()}`,
            answer: 'a',
            status: 'approved',
            origin: 'manual',
            created_by: 'e2e',
            tags,
          })
          .returning('id')
          .executeTakeFirstOrThrow()
        // a multiple-choice question is only complete with its four options
        if (type === 'mcq' || type === 'assertion_reason') {
          for (const [i2, label] of ['A', 'B', 'C', 'D'].entries()) {
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
      }
    }
    const [a1, a2, a3] = await chapter('I', 3, 'Fractions and Decimals', 3)
    const [b1] = await chapter('II', 3, 'Data Handling', 1)
    const [c1, c2] = await chapter('I', 4, 'Simple Equations', 2)
    await add(a1, 30, 'mcq', 1, 'Understand')
    await add(a1, 6, 'assertion_reason', 1, 'Apply')
    await add(a2, 14, 'short_answer', 2, 'Understand')
    await add(a3, 10, 'short_answer', 3, 'Apply')
    await add(a3, 6, 'long_answer', 5, 'Analyse')
    await add(b1, 6, 'mcq', 1, 'Remember')
    await add(b1, 1, 'short_answer', 2, 'Understand')
    await add(c1, 12, 'mcq', 1, 'Apply')
    await add(c2, 3, 'short_answer', 4, 'Analyse', ['case_study'])
    await add(c2, 4, 'short_answer', 3, 'Apply')
  }

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
    await buildBank()
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
    await db
      .deleteFrom('school_print_job_parts')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_print_jobs')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_scan_chunks')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_scan_pages')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_scan_batches')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_exam_absences')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db
      .deleteFrom('school_booklet_pages')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_booklets')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_booklet_layouts')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_exam_questions')
      .where('school_id', 'in', ids)
      .execute()
    await db
      .deleteFrom('school_exam_sections')
      .where('school_id', 'in', ids)
      .execute()
    await db.deleteFrom('school_exams').where('school_id', 'in', ids).execute()
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
      .deleteFrom('school_paper_templates')
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
    const e2eQs = await db
      .selectFrom('questions')
      .select('id')
      .where('created_by', '=', 'e2e')
      .where('text', 'like', `E2E ${tag}%`)
      .execute()
    if (e2eQs.length)
      await db
        .deleteFrom('question_options')
        .where(
          'question_id',
          'in',
          e2eQs.map((q) => q.id),
        )
        .execute()
    await db
      .deleteFrom('questions')
      .where('created_by', '=', 'e2e')
      .where('text', 'like', `E2E ${tag}%`)
      .execute()
    await db
      .deleteFrom('concepts')
      .where('code', 'like', `E2E-${tag}-%`)
      .execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
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
    // a school starts itself (its own link), but students are never invited to sign up here, and
    // nothing from the personal app shows
    for (const banned of ['guest', 'whatsapp', 'register', 'parent'])
      expect(text, banned).not.toContain(banned)
    await expect(
      page.getByRole('link', { name: 'Create your school account' }),
    ).toBeVisible()
    await expect(page.getByLabel('School code')).toBeVisible()
    await expect(page.getByLabel('Your ID')).toBeVisible()
    await looksRight(page)
    await page.getByRole('tab', { name: 'Teacher or school office' }).click()
    await expect(page.getByLabel('Email')).toBeVisible()
    await shot(page, '02-sign-in-teacher')
    // a wrong password says so in plain words
    await page.getByLabel('Email').fill(adminEmail)
    await page.getByLabel('Password', { exact: true }).fill('not-the-password')
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
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
    // a school admin's first sign-in starts the set-up wizard; this walk-through leaves it
    // (the wizard itself is covered in schools-m1.spec.ts)
    await page.waitForURL(`**/school/${schoolId}/welcome`)
    await page
      .getByRole('button', { name: 'Leave setup, I will do it later' })
      .click()
    await page.waitForURL(`**/school/${schoolId}`)
    await expect(
      page.getByRole('heading', { name: 'Your school set-up' }),
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
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
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

  test('paper layouts: a ready-made one is saved, and your own is built with the marks checked as you go', async () => {
    const page = adminPage
    await page.getByRole('link', { name: 'Papers' }).last().click()
    await expect(
      page.getByRole('heading', { name: 'Paper layouts' }),
    ).toBeVisible()
    await shot(page, '30-papers-empty')
    await looksRight(page)
    await page.getByRole('button', { name: 'Use this layout' }).first().click()
    await expect(
      page.getByText('CBSE-style paper, 80 marks').first(),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Use this layout' }).last().click()
    await expect(page.getByText('Unit Test, 40 marks').first()).toBeVisible()
    await shot(page, '31-papers-saved-layouts')
    await looksRight(page)

    await page.getByRole('button', { name: 'Make your own layout' }).click()
    await expect(
      page.getByRole('heading', { name: 'Make a layout' }),
    ).toBeVisible()
    await page.getByLabel('Name').fill('Half-yearly, 60 marks')
    await page.getByLabel('Total marks').fill('60')
    await page.getByLabel('Time (minutes)').fill('120')
    // the marks do not add up yet: the page says so, and saving is blocked
    await expect(
      page.getByText(/The rows add up to 10 marks, but the total is 60/),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Save layout' }),
    ).toBeDisabled()
    await shot(page, '32-builder-marks-do-not-add-up')
    await looksRight(page)

    const addRow = async (
      heading: string,
      kind: string,
      count: string,
      marks: string,
      or: string,
    ) => {
      await page.getByRole('button', { name: 'Add a row' }).click()
      const row = page
        .locator('section')
        .filter({ hasText: /Row \d/ })
        .last()
      await row.getByLabel('Heading on the paper').fill(heading)
      await row.getByLabel('Kind of question').selectOption({ label: kind })
      await row.getByLabel('How many questions').fill(count)
      await row.getByLabel('Marks for each').fill(marks)
      if (or) await row.getByLabel('Questions with a choice (OR)').fill(or)
    }
    await addRow(
      'Section B — Short answer (2 marks each)',
      'Short answer',
      '5',
      '2',
      '1',
    ) // 10
    await addRow(
      'Section C — Short answer (3 marks each)',
      'Short answer',
      '4',
      '3',
      '1',
    ) // 12
    await addRow(
      'Section D — Long answer (5 marks each)',
      'Long answer',
      '2',
      '5',
      '1',
    ) // 10
    await addRow(
      'Section E — Case studies (4 marks each)',
      'Case study',
      '2',
      '4',
      '',
    ) // 8
    await page.getByLabel('Total marks').fill('50')
    await expect(page.getByText('Ready: 50 marks')).toBeVisible()
    await shot(page, '33-builder-ready')
    await looksRight(page)
    await page.getByRole('button', { name: 'Save layout' }).click()
    await page.waitForURL('**/papers/check**')
    await expect(
      page.getByRole('heading', { name: 'Check against the bank' }),
    ).toBeVisible()
  })

  test('coverage preview: choose chapters by book, part and chapter, then see marks, thinking and every gap', async () => {
    const page = adminPage
    await page.getByRole('link', { name: 'Papers' }).last().click()
    await page
      .getByRole('button', { name: 'Check against the bank' })
      .first()
      .click()
    await expect(
      page.getByRole('heading', { name: 'Check against the bank' }),
    ).toBeVisible()
    // the two chapters numbered 3 are told apart by their part
    await expect(
      page.getByText('Ganita Prakash · Part I', { exact: true }),
    ).toBeVisible()
    await expect(
      page.getByText('Ganita Prakash · Part II', { exact: true }),
    ).toBeVisible()
    await expect(page.getByText('Chapter 3').first()).toBeVisible()
    await shot(page, '34-check-choose-chapters')
    await looksRight(page)
    await page.getByLabel(/Chapter 3 · Fractions and Decimals/).check()
    await page.getByLabel(/Chapter 3 · Data Handling/).check()
    await page.getByLabel(/Chapter 4 · Simple Equations/).check()
    await page.getByRole('button', { name: /^Check 3 chapters$/ }).click()
    const result = page.getByTestId('coverage-result')
    await expect(result).toBeVisible()
    await expect(result).toContainText('The bank can fill')
    await expect(page.getByTestId('paper-gaps')).toBeVisible()
    await expect(page.getByTestId('chapter-gaps')).toBeVisible()
    await page.getByText('What will be printed on your copy').click()
    await shot(page, '35-coverage-preview')
    await looksRight(page)
  })

  let examId = ''
  test('exams: one paper for the class, its gaps shown, and the question paper, teacher copy and booklets open as PDFs', async () => {
    const page = adminPage
    await page.getByRole('link', { name: 'Exams' }).last().click()
    await expect(page.getByRole('heading', { name: 'Exams' })).toBeVisible()
    await shot(page, '40-exams-empty')
    await looksRight(page)
    await page.getByRole('button', { name: 'Make an exam paper' }).click()
    await expect(
      page.getByRole('heading', { name: 'Make an exam paper' }),
    ).toBeVisible()
    await page.getByLabel('Name of the exam').fill('Half-yearly Maths')
    await page
      .getByLabel('Paper layout')
      .selectOption({ label: 'CBSE-style paper, 80 marks' })
    await expect(page.getByLabel(/Section A/)).toBeChecked()
    await page.getByLabel(/Chapter 3 · Fractions and Decimals/).check()
    await page.getByLabel(/Chapter 3 · Data Handling/).check()
    await page.getByLabel(/Chapter 4 · Simple Equations/).check()
    await shot(page, '41-exam-make')
    await looksRight(page)
    await page.getByRole('button', { name: 'Make the paper' }).click()
    await page.waitForURL(/\/exams\/[0-9a-f-]{36}$/)
    examId = page.url().split('/').pop()!
    await expect(
      page.getByRole('heading', { name: 'Half-yearly Maths' }),
    ).toBeVisible()
    // the bank cannot fill every row: the gaps are shown, never hidden
    await expect(page.getByTestId('exam-gaps')).toContainText(
      '4-mark case study',
    )
    await expect(
      page.getByText('Students cannot open any of these files'),
    ).toBeVisible()
    await shot(page, '42-exam-detail-gaps')
    await looksRight(page)

    // the three documents, as the signed-in office would fetch them
    const base = `/api/schools/${schoolId}/exams/${examId}`
    for (const [name, path] of [
      ['question paper', '/question-paper'],
      ['teacher copy', '/teacher-copy'],
    ] as const) {
      const res = await page.request.get(base + path)
      expect(res.status(), name).toBe(200)
      expect(res.headers()['content-type']).toBe('application/pdf')
      expect(res.headers()['cache-control']).toBe('private, no-store')
      expect((await res.body()).subarray(0, 4).toString()).toBe('%PDF')
    }
    const sectionA = await db
      .selectFrom('school_sections')
      .select('id')
      .where('school_id', '=', schoolId)
      .where('name', '=', 'A')
      .executeTakeFirstOrThrow()
    const started = await page.request.post(`${base}/booklets`, {
      data: { section_id: sectionA.id, batch_size: 1 },
    })
    expect(started.status()).toBe(200)
    let job = (await started.json()) as { jobId: string; status: string }
    for (let i = 0; i < 4 && job.status === 'running'; i++) {
      const step = await page.request.post(`${base}/booklet-jobs/${job.jobId}`)
      expect(step.status()).toBe(200)
      job = (await step.json()) as typeof job
    }
    expect(job.status).toBe('done')
    const booklets = await page.request.get(
      `${base}/booklet-jobs/${job.jobId}/result`,
    )
    expect(booklets.status()).toBe(200)
    expect((await booklets.body()).subarray(0, 4).toString()).toBe('%PDF')

    // and the buttons open them in a new tab
    const popup = page.waitForEvent('popup')
    await page
      .getByRole('button', { name: 'Open the question paper (PDF)' })
      .click()
    await popup
    await expect(page.getByText(/Opened in a new tab/)).toBeVisible()
  })

  test("scans: a section's photographed booklets are sorted by their codes; missing pages are listed and can be fixed", async () => {
    test.setTimeout(240_000)
    const page = adminPage
    // the printed booklets of section A, as pictures (the real pages, then made to look like phone photos)
    const layout = await db
      .selectFrom('school_booklet_layouts')
      .select('manifest')
      .where('exam_id', '=', examId)
      .executeTakeFirstOrThrow()
    const manifest = layout.manifest as unknown as BookletManifest
    const booklets = await db
      .selectFrom('school_booklets as b')
      .innerJoin('school_students as ss', 'ss.id', 'b.school_student_id')
      .innerJoin('students as st', 'st.id', 'ss.student_id')
      .select(['b.id', 'st.name', 'ss.admission_no', 'ss.roll_no'])
      .where('b.exam_id', '=', examId)
      .orderBy('ss.roll_no')
      .execute()
    expect(booklets.length).toBeGreaterThanOrEqual(2)
    const tokens = new Map<string, Array<string>>()
    for (const b of booklets)
      tokens.set(
        b.id,
        (
          await db
            .selectFrom('school_booklet_pages')
            .select('token')
            .where('booklet_id', '=', b.id)
            .orderBy('page_no')
            .execute()
        ).map((t) => t.token),
      )
    const html = await buildBookletsHtml({
      schoolName: 'E2E School',
      examTitle: 'Half-yearly Maths',
      subjectName: 'Maths',
      className: 'Class 7',
      durationMin: 180,
      totalMarks: 80,
      manifest,
      students: booklets.map((b) => ({
        name: b.name,
        admissionNo: b.admission_no,
        rollNo: b.roll_no,
        sectionName: 'A',
        tokens: tokens.get(b.id) ?? [],
      })),
    })
    const pages = await renderPagePngs(html)
    const dir = mkdtempSync(join(tmpdir(), 'scan-e2e-'))
    const n = manifest.pageCount
    const looks = [
      { rotate: 180 },
      { rotate: 6, perspective: 0.5 },
      { shadow: true, rotate: -4 },
      { rotate: 90, noise: 8 },
      {},
    ]
    const file = async (student: number, pageNo: number, label: string) => {
      const path = join(dir, `s${student + 1}-p${pageNo}-${label}.jpg`)
      writeFileSync(
        path,
        await photograph(pages[student * n + pageNo - 1], {
          ...looks[(pageNo + student) % looks.length],
          size: 2400,
          seed: pageNo * 7 + student,
        }),
      )
      return path
    }
    const all = Array.from({ length: n }, (_, i) => i + 1)
    // student 1: every page, scrambled, and page 1 sent twice. student 2: all but pages 2 and 3.
    const first = [
      ...all.filter((x) => x % 2 === 0),
      ...all.filter((x) => x % 2 === 1),
    ]
    const files: Array<string> = []
    for (const p of first) files.push(await file(0, p, 'a'))
    files.push(await file(0, 1, 'again'))
    for (const p of all.filter((x) => x !== 2 && x !== 3))
      files.push(await file(1, p, 'b'))
    // a page whose code cannot be read: a blank sheet
    const blank = join(dir, 'smudged-sheet.png')
    writeFileSync(
      blank,
      await (
        await import('sharp')
      )
        .default({
          create: {
            width: 900,
            height: 1200,
            channels: 3,
            background: '#e8e3d6',
          },
        })
        .png()
        .toBuffer(),
    )
    files.push(blank)

    const base = `/api/schools/${schoolId}/exams/${examId}`
    await page.goto(`/school/${schoolId}/exams/${examId}`, {
      waitUntil: 'networkidle',
    })
    await page.waitForTimeout(600)
    await expect(
      page.getByRole('heading', { name: 'Scanned answer sheets' }),
    ).toBeVisible()
    await expect(page.getByTestId('scan-students')).toContainText(
      booklets[0].name,
    )
    await expect(page.getByTestId('scan-original-note')).toHaveText(
      "Upload the original photos. Don't forward them through WhatsApp first. Scanners: 200 dpi or more.",
    )
    await shot(page, '50-scan-upload')
    await looksRight(page)

    await page.getByTestId('scan-files').setInputFiles(files)
    await expect(page.getByTestId('scan-progress')).toContainText(
      /pages were placed/,
      { timeout: 200_000 },
    )
    await expect(page.getByTestId('scan-progress')).toContainText(
      'Received: ' + booklets[0].name,
    )
    await expect(page.getByTestId('scan-progress')).toContainText(
      'Already received',
    )
    await expect(page.getByTestId('scan-progress')).toContainText(
      'We could not read the code',
    )
    await shotOf(page, '[data-testid=scan-panel]', '51-scan-uploaded')
    await looksRight(page)

    // who has sent what
    const one = page.locator('[data-testid=scan-students] li', {
      hasText: booklets[0].name,
    })
    const two = page.locator('[data-testid=scan-students] li', {
      hasText: booklets[1].name,
    })
    await expect(one).toHaveAttribute('data-state', 'complete')
    await expect(one).toContainText('All pages in')
    await expect(one).toContainText('Sent twice: page 1')
    await expect(two).toHaveAttribute('data-state', 'missing')
    await expect(two).toContainText('Missing: pages 2, 3')
    await expect(page.getByTestId('scan-unmatched')).toBeVisible()
    await shotOf(page, '[data-testid=scan-students]', '52-scan-missing-pages')
    await shotOf(page, '[data-testid=scan-unmatched]', '52b-scan-unplaced-page')
    await looksRight(page)

    // re-upload one page for student 2 (page 2), and place the unreadable sheet as her page 3
    await two.getByRole('button', { name: 'Fix or add a page' }).click()
    await two.getByLabel('Which page is the new picture of?').selectOption('2')
    await shotOf(page, '[data-testid=scan-students]', '53-scan-fix-a-page')
    await looksRight(page)
    await two
      .locator('input[type=file]')
      .setInputFiles(await file(1, 2, 'redo'))
    await expect(two).toContainText('Missing: page 3', { timeout: 60_000 })
    await expect(page.getByTestId('scan-progress')).toContainText(
      'Received: ' + booklets[1].name + ', page 2',
    )
    const lost = page.getByTestId('scan-unmatched').locator('li').first()
    const secondStudentId = (
      await db
        .selectFrom('school_booklets')
        .select('school_student_id')
        .where('id', '=', booklets[1].id)
        .executeTakeFirstOrThrow()
    ).school_student_id
    await lost.getByLabel('Student').selectOption(secondStudentId)
    await lost.getByLabel('Page').selectOption('3')
    await lost.getByRole('button', { name: 'Save as this page' }).click()
    await expect(two).toHaveAttribute('data-state', 'complete', {
      timeout: 30_000,
    })
    await expect(page.getByTestId('scan-unmatched')).toHaveCount(0)
    await expect(page.getByTestId('scan-totals')).toContainText('2 complete')
    await shotOf(page, '[data-testid=scan-students]', '54-scan-all-in')
    await looksRight(page)

    // the page pictures are only reachable through short-lived signed links, and not without signing in
    const summary = (await (
      await page.request.get(`${base}/scan-summary`)
    ).json()) as { students: Array<{ pages: Array<{ url: string }> }> }
    const link = summary.students[0].pages[0].url
    expect((await page.request.get(link)).status()).toBe(200)
    expect(
      (
        await page.request.get(link.replace(/sig=[^&]+/, 'sig=forged'))
      ).status(),
    ).toBe(404)
    const stranger = await page.context().browser()!.newContext()
    expect(
      (
        await stranger.request.get(new URL(link, page.url()).toString())
      ).status(),
    ).toBe(401)
    await stranger.close()
  })

  test('a signed-in student is refused every exam file (question paper, teacher copy, booklets, lists)', async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ viewport: PHONE })
    const page = await ctx.newPage()
    const login = await page.request.post('/api/school-login', {
      data: {
        school_code: schoolCode,
        login_id: studentId,
        password: PASSWORD,
      },
    })
    expect(login.status()).toBe(200)
    const base = `/api/schools/${schoolId}/exams`
    for (const path of [
      base,
      `${base}/${examId}`,
      `${base}/${examId}/question-paper`,
      `${base}/${examId}/teacher-copy`,
      `${base}/${examId}/scan-summary`,
    ]) {
      expect((await page.request.get(path)).status(), path).toBe(403)
    }
    for (const path of ['scan-batches', 'scans', 'absences'])
      expect(
        (
          await page.request.post(`${base}/${examId}/${path}`, { data: {} })
        ).status(),
        path,
      ).toBe(403)
    expect(
      (
        await page.request.post(`${base}/${examId}/booklets`, { data: {} })
      ).status(),
    ).toBe(403)
    expect(
      (
        await page.request.post(base, {
          data: { title: 'x', subject_id: subjectId, template_key: 'x' },
        })
      ).status(),
    ).toBe(403)
    // the school pages she can open do not list exams at all
    await open(page, `/school/${schoolId}`)
    await expect(page.getByRole('link', { name: 'Exams' })).toHaveCount(0)
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
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    await page.waitForURL(`**/school/${schoolId}`)
    await expect(
      page.getByRole('heading', { name: 'Your school set-up' }),
    ).toBeVisible()
    await shot(page, '26-admin-home-desktop')
    await ctx.close()
  })
})
