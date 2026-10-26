import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { createParentSession, createStudentSession } from '../src/db/test-helpers'
import type { TestSession } from '../src/db/test-helpers'
import { createClass7Fixture, removeClass7Fixture } from './class7-fixture'
import type { Class7Fixture } from './class7-fixture'

/**
 * The student's paper builder on /my-paper: the "Made for you" quick path, the three-step
 * customise path with its live summary, and going back to the quick card keeping her changes.
 * Builds its own two-chapter subject. An old ?layout=... link from the preview period still lands
 * on the same builder.
 */

let db: Db
let parent: TestSession
let student: TestSession
let fixture: Class7Fixture
let studentId: string

test.beforeAll(async () => {
  db = createDb()
  fixture = await createClass7Fixture(db, 'builder')
  parent = await createParentSession('e2e-pb-parent')
  // Through the API, so the parental-consent record exists and generation is not blocked.
  const created = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: parent.cookie,
      origin: 'http://localhost:3000',
    },
    body: JSON.stringify({ name: 'Builder Kid', class: 7, board: 'CBSE', consent_accepted: true }),
  }).then((r) => r.json())
  studentId = created.id
  student = await createStudentSession('e2e-pb-student', parent.householdId, studentId)
})

test.afterAll(async () => {
  const attempts = await db.selectFrom('attempts').select('id').where('student_id', '=', studentId).execute()
  const attemptIds = attempts.map((a) => a.id)
  const papers = await db.selectFrom('papers').select('id').where('student_id', '=', studentId).execute()
  const paperIds = papers.map((p) => p.id)
  if (attemptIds.length > 0) {
    await db.deleteFrom('attempt_answers').where('attempt_id', 'in', attemptIds).execute()
    await db.deleteFrom('attempts').where('id', 'in', attemptIds).execute()
  }
  if (paperIds.length > 0) {
    await db.deleteFrom('paper_questions').where('paper_id', 'in', paperIds).execute()
    await db.deleteFrom('papers').where('id', 'in', paperIds).execute()
  }
  await db.deleteFrom('households').where('id', '=', parent.householdId).execute()
  await removeClass7Fixture(db, fixture)
  await db.destroy()
})

async function signIn(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.fill('#email', student.email)
  await page.fill('#password', student.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  // A first sign-in finishes the profile first, as the adaptive-flow spec does.
  if (await page.waitForURL('**/profile-setup', { timeout: 8000 }).then(() => true, () => false)) {
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.waitForURL('**/choose-board**')
    await page.getByRole('button', { name: 'Class 7' }).click()
    await page.getByRole('button', { name: 'Save and continue' }).click()
  }
  await page.waitForURL('**/my-paper**')
}

test('customise path through every step makes a real paper, and back to quick keeps changes', async ({
  page,
}) => {
  await signIn(page)
  await page.goto(`/my-paper?subject=${fixture.subjectId}`)
  await expect(page.getByRole('button', { name: 'Customise' })).toBeVisible({ timeout: 20_000 })

  await page.getByRole('button', { name: 'Customise' }).click()
  await expect(page.getByRole('heading', { name: 'Which subject?' })).toBeFocused()
  await page.getByRole('button', { name: 'Next: Chapters' }).click()
  await expect(page.getByRole('heading', { name: 'Which chapters?' })).toBeFocused()
  // One search box only.
  await expect(page.getByLabel('Find a chapter or topic')).toHaveCount(1)
  await expect(page.getByPlaceholder('Search chapters…')).toHaveCount(0)
  await page.getByRole('button', { name: 'Clear' }).click()
  await expect(page.getByText('Pick at least one chapter to continue.')).toBeVisible()
  await expect(page.getByRole('button', { name: /^Next: / })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Skip to review' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Make this paper' })).toBeDisabled()
  await page.getByText('E2E chapter part I', { exact: false }).first().click()
  await expect(page.getByRole('button', { name: /^Next: / })).toBeEnabled()
  // Skip to review lands on the last step with the review card.
  await page.getByRole('button', { name: 'Skip to review' }).click()
  await expect(page.getByRole('heading', { name: 'Size and style' })).toBeFocused()
  await page.getByRole('radio', { name: /^15/ }).click()
  await page.getByRole('button', { name: /More options/ }).click()
  await expect(page.getByRole('radio', { name: 'Written' })).toBeVisible()

  // Back to the quick card: the 15 and the single chapter survive.
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Back', exact: true }).click()
  await page.getByRole('button', { name: 'Back to the quick version' }).click()
  await expect(page.getByRole('button', { name: 'Customise' })).toBeVisible()
  await expect(
    page.getByRole('list', { name: 'Chapters in this paper' }).getByRole('listitem'),
  ).toHaveCount(1)

  // Customise all the way through and make the paper from the review step.
  await page.getByRole('button', { name: 'Customise' }).click()
  await page.getByRole('button', { name: 'Next: Chapters' }).click()
  await page.getByRole('button', { name: 'Next: Size and style' }).click()
  await expect(page.getByRole('radio', { name: /^15/ })).toBeChecked()
  // The fixture holds a single multiple-choice question, so ask for that kind only: a Combined
  // paper also wants written questions, which the fixture does not have.
  // (More options stays open from the first pass, so only open it when it is closed.)
  const more = page.getByRole('button', { name: /More options/ })
  if ((await more.getAttribute('aria-expanded')) !== 'true') await more.click()
  await page.getByRole('radio', { name: 'Multiple choice' }).click()
  const make = page.getByRole('button', { name: 'Make this paper' })
  await expect(make).toBeEnabled({ timeout: 20_000 })
  await make.click()
  await page.waitForURL('**/attempt/**', { timeout: 30_000 })
})

// Runs after the customise test on purpose: the fixture has one question per chapter and a paper
// does not repeat a question she has just had, so the single-chapter paper goes first and this one
// still finds the other chapter's question.
test('quick path makes a real paper', async ({ page }) => {
  await signIn(page)
  await page.goto(`/my-paper?subject=${fixture.subjectId}`)
  await expect(page.getByRole('heading', { name: 'New paper' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /E2E Class 7 builder/ })).toBeVisible({
    timeout: 20_000,
  })
  await expect(page.getByText('Made for you')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Customise' })).toBeVisible()
  const make = page.getByRole('button', { name: 'Make this paper' })
  await expect(make).toBeEnabled({ timeout: 20_000 })
  await make.click()
  await page.waitForURL('**/attempt/**', { timeout: 30_000 })
})

test('there is no Classic switch, and an old ?layout= link still shows the builder', async ({
  page,
}) => {
  await signIn(page)
  for (const layout of ['a', 'b', 'c', 'classic', 'nonsense']) {
    await page.goto(`/my-paper?layout=${layout}&subject=${fixture.subjectId}`)
    await expect(page.getByRole('button', { name: 'Customise' })).toBeVisible({ timeout: 20_000 })
    await expect(page.getByRole('radio', { name: 'Classic' })).toHaveCount(0)
    await expect(page.getByRole('radio', { name: 'New' })).toHaveCount(0)
    await expect(page.getByLabel('Question type', { exact: true })).toHaveCount(0)
  }
})

test('a link to one chapter shows the paper for that chapter', async ({ page }) => {
  await signIn(page)
  const second = await db
    .selectFrom('chapters')
    .select('id')
    .where('subject_id', '=', fixture.subjectId)
    .where('part', '=', 'II')
    .executeTakeFirstOrThrow()
  await page.goto(`/my-paper?subject=${fixture.subjectId}&chapters=${second.id}`)
  await expect(page.getByRole('button', { name: 'Customise' })).toBeVisible({ timeout: 20_000 })
  const chapters = page.getByRole('list', { name: 'Chapters in this paper' }).getByRole('listitem')
  await expect(chapters).toHaveCount(1)
  await expect(chapters.first()).toContainText('E2E chapter part II')
  await expect(page.getByRole('button', { name: 'Make this paper' })).toBeEnabled({ timeout: 20_000 })
})
