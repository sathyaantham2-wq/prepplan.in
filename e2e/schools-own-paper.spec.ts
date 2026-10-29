import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { schoolsRepository } from '../src/db/repositories'
import { issueFirstAdminCode } from '../src/lib/schools/credentials'

/**
 * "Use your own paper" on a phone: upload a Word paper, watch it being read, fix a question, approve the
 * paper, approve the answers. The reader is the free stand-in (OWN_PAPER_AI=fake in the browser-test
 * server); no AI vendor is called.
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

async function looksRight(page: Page) {
  const r = await page.evaluate(() => {
    const small: Array<string> = []
    for (const el of document.querySelectorAll<HTMLElement>(
      '[data-no-sound] :is(button, select, input:not([type=checkbox]):not([type=file]), a[class*="min-h"])',
    )) {
      const b = el.getBoundingClientRect()
      if (b.width > 0 && b.height > 0 && b.height < 44)
        small.push(
          `${el.tagName} "${(el.innerText || '').slice(0, 24)}" ${Math.round(b.height)}px`,
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

test.describe.serial('use your own paper (phone)', () => {
  let db: Db
  const tag = `${Date.now()}`.slice(-8)
  const email = `own-${tag}@e2e.school`
  const subjectCode = `E2E-OWN-${tag}`
  let schoolId = ''
  let subjectId = ''
  let sourceId = ''
  let page: Page

  test.beforeAll(async ({ browser }) => {
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
    for (const [no, name] of [
      [3, 'Fractions and Decimals'],
      [4, 'Simple Equations'],
    ] as const) {
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
      await db
        .insertInto('concepts')
        .values({
          chapter_id: ch.id,
          board: 'CBSE',
          class: 7,
          code: `${subjectCode}-${no}.1`,
          name,
          difficulty_base: 'Easy',
        })
        .execute()
    }
    const p = await schoolsRepository.provision(db, {
      name: 'Own Paper School',
      code: `own-${tag}`,
      board: 'CBSE',
      adminName: 'Office Admin',
      adminEmail: email,
    })
    schoolId = p.school.id
    const code = (await issueFirstAdminCode(db, schoolId, p.adminMemberId)).code
    page = await (
      await browser.newContext({
        viewport: PHONE,
        hasTouch: true,
        isMobile: true,
      })
    ).newPage()
    await page.goto('/school/set-password', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /teacher or office staff/ }).click()
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Code from your slip').fill(code)
    await page.getByLabel('Choose a password').fill(PASSWORD)
    await page.getByLabel('Type it again').fill(PASSWORD)
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.waitForURL(`**/school/${schoolId}/welcome`)
    // set the school up the quick way: class 7 with its subjects, then leave the wizard
    await page.request.post(`/api/schools/${schoolId}/wizard`, {
      data: {
        action: 'classes',
        academic_year: '2026-27',
        classes: [{ grade: 7, sections: 1 }],
      },
    })
    await page.request.post(`/api/schools/${schoolId}/wizard`, {
      data: { action: 'finish', skipped: true },
    })
  })

  test.afterAll(async () => {
    const ids = [schoolId]
    const mem = await db
      .selectFrom('school_members')
      .select('user_id')
      .where('school_id', 'in', ids)
      .execute()
    const mu = mem.map((m) => m.user_id)
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
      'school_own_questions',
      'school_own_papers',
      'school_credential_codes',
      'audit_log',
      'school_teacher_assignments',
      'school_subjects',
      'school_sections',
      'school_classes',
    ] as const)
      await db
        .deleteFrom(t as 'school_classes')
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
    await db
      .deleteFrom('concepts')
      .where('code', 'like', `${subjectCode}-%`)
      .execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  test('the home screen links to it, and the list starts empty', async () => {
    await page.goto(`/school/${schoolId}`, { waitUntil: 'networkidle' })
    await page.getByRole('link', { name: 'Or use your own paper' }).click()
    await expect(
      page.getByRole('heading', { name: 'Your own papers' }),
    ).toBeVisible()
    await expect(page.getByText('No papers yet.')).toBeVisible()
    await shot(page, 'op-01-list')
    await looksRight(page)
  })

  test('upload a Word paper: it is read, matched to chapters, and the teacher is told what to check', async () => {
    await page.getByRole('link', { name: 'Use your own paper' }).click()
    await expect(
      page.getByRole('heading', { name: 'Use your own paper' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Upload and read the paper' }),
    ).toBeDisabled()
    await page.getByLabel('Name of the paper').fill('Unit Test 2')
    const lines = [
      'Sunrise School Unit Test 2 Mathematics Class 7 half yearly',
      '1. What is 3/4 of 20? [1]',
      '2. Write 0.25 as a fraction. [1]',
      '3. Solve x/2 + 3 = 7 and show the steps. [3]',
      '4. Find the area of a square of side 5 cm. [2]',
    ]
    const bytes = Buffer.from(
      await Packer.toBuffer(
        new Document({
          sections: [
            {
              children: lines.map(
                (l) => new Paragraph({ children: [new TextRun(l)] }),
              ),
            },
          ],
        }),
      ),
    )
    await page.locator('#paper-files').setInputFiles({
      name: 'unit-test-2.docx',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      buffer: bytes,
    })
    await expect(page.getByTestId('paper-chosen')).toHaveText(
      'unit-test-2.docx',
    )
    await shot(page, 'op-02-upload-form')
    await looksRight(page)
    await page
      .getByRole('button', { name: 'Upload and read the paper' })
      .click()
    await page.waitForURL(/\/own-papers\/[0-9a-f-]{36}$/)
    await expect(page.getByTestId('own-paper')).toHaveAttribute(
      'data-status',
      'needs_review',
      { timeout: 60_000 },
    )
    await expect(page.getByTestId('own-question')).toHaveCount(4)
    await expect(page.getByTestId('summary')).toContainText('4 questions')
    await expect(page.getByTestId('summary')).toContainText(
      'No answer sheet can be marked until you also approve every answer.',
    )
    await expect(page.getByTestId('summary')).toContainText(
      'Answers approved: 0 of 4',
    )
    await expect(
      page.getByText('Answer drafted by PrepPlan AI: check it').first(),
    ).toBeVisible()
    await shot(page, 'op-03-ready-to-check')
    await looksRight(page)
  })

  test('the teacher fixes a question, approves the paper, then every answer; only then is it ready for marking', async () => {
    const first = page.getByTestId('own-question').first()
    await first.getByRole('button', { name: 'Change', exact: true }).click()
    await first.getByLabel('Marks').fill('2')
    await first.getByLabel('Chapter').selectOption({ index: 1 })
    await shot(page, 'op-04-edit-question')
    await first.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(first).toContainText('2 marks')
    await page.getByRole('button', { name: 'Approve this paper' }).click()
    await expect(page.getByTestId('summary')).toContainText(
      'The paper is approved. Approve every answer below before anything can be marked.',
    )
    // the questions are frozen now
    await expect(
      page
        .getByTestId('own-question')
        .first()
        .getByRole('button', { name: 'Change', exact: true }),
    ).toHaveCount(0)
    await page.getByRole('button', { name: /Approve all 4 answers/ }).click()
    await expect(page.getByTestId('summary')).toContainText(
      'The paper and every answer are approved. It can be used for marking.',
    )
    await expect(page.getByTestId('summary')).toContainText(
      'Answers approved: 4 of 4',
    )
    await shot(page, 'op-05-approved')
    await looksRight(page)
    // and the list shows it as approved
    await page.getByRole('link', { name: 'Your own papers' }).click()
    await expect(page.getByText('Approved').first()).toBeVisible()
  })

  test('a file that cannot be read is told so in plain words', async () => {
    await page.getByRole('link', { name: 'Use your own paper' }).click()
    await page.getByLabel('Name of the paper').fill('Bad file')
    await page.locator('#paper-files').setInputFiles({
      name: 'old.doc',
      mimeType: 'application/msword',
      buffer: Buffer.from('x'),
    })
    await page
      .getByRole('button', { name: 'Upload and read the paper' })
      .click()
    await expect(page.getByRole('alert')).toContainText('old Word file (.doc)')
    await shot(page, 'op-06-old-word-file')
  })
})
