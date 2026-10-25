import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { createParentSession, createStudentSession } from '../src/db/test-helpers'
import type { TestSession } from '../src/db/test-helpers'
import { createClass7Fixture, removeClass7Fixture } from './class7-fixture'
import type { Class7Fixture } from './class7-fixture'

/**
 * The new paper builder on /my-paper?layout=c (the old preview links ?layout=a and ?layout=b land
 * on it too): the "Made for you" quick path, the three-step customise path with its live summary,
 * and the inline Classic | New switch keeping her selections. Builds its own two-chapter subject.
 */

let db: Db
let parent: TestSession
let student: TestSession
let fixture: Class7Fixture
let studentId: string

test.beforeAll(async () => {
  db = createDb()
  fixture = await createClass7Fixture(db, 'layoutc')
  parent = await createParentSession('e2e-lc-parent')
  // Through the API, so the parental-consent record exists and generation is not blocked.
  const created = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: parent.cookie,
      origin: 'http://localhost:3000',
    },
    body: JSON.stringify({ name: 'Layout Kid', class: 7, board: 'CBSE', consent_accepted: true }),
  }).then((r) => r.json())
  studentId = created.id
  student = await createStudentSession('e2e-lc-student', parent.householdId, studentId)
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

test('quick path, customise path and the switch', async ({ page }) => {
  await signIn(page)

  // Quick path: the card is the whole screen; one tap makes a real paper.
  await page.goto(`/my-paper?layout=c&subject=${fixture.subjectId}`)
  await expect(page.getByRole('heading', { name: 'New paper' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /E2E Class 7 layoutc/ })).toBeVisible({
    timeout: 20_000,
  })
  await expect(page.getByText('Made for you')).toBeVisible()
  await expect(page.getByRole('radio', { name: 'New' })).toBeChecked()
  await expect(page.getByRole('button', { name: 'Customise' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Make this paper' })).toBeEnabled({ timeout: 20_000 })

  // The old preview aliases show the same builder.
  await page.goto(`/my-paper?layout=b&subject=${fixture.subjectId}`)
  await expect(page.getByRole('button', { name: 'Customise' })).toBeVisible({ timeout: 20_000 })
  await page.goto(`/my-paper?layout=c&subject=${fixture.subjectId}`)
  await expect(page.getByRole('button', { name: 'Customise' })).toBeVisible({ timeout: 20_000 })

  // Customise: steps, skip to review, selections kept across Classic | New.
  await page.getByRole('button', { name: 'Customise' }).click()
  await expect(page.getByRole('heading', { name: 'Which subject?' })).toBeFocused()
  await page.getByRole('button', { name: 'Next: Chapters' }).click()
  await expect(page.getByRole('heading', { name: 'Which chapters?' })).toBeFocused()
  // One search box only.
  await expect(page.getByLabel('Find a chapter or topic')).toHaveCount(1)
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

  // Switch to Classic and back: the 15 and the chapter choice survive.
  await page.getByRole('radio', { name: 'Classic' }).click()
  await expect(page.getByLabel('Questions', { exact: true })).toHaveValue('15')
  await page.getByRole('radio', { name: 'New' }).click()
  await expect(page.getByRole('button', { name: 'Customise' })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByRole('list', { name: 'Chapters in this paper' }).getByRole('listitem')).toHaveCount(1)

  // Customise all the way through and make the paper from the review step.
  await page.getByRole('button', { name: 'Customise' }).click()
  await page.getByRole('button', { name: 'Next: Chapters' }).click()
  await page.getByRole('button', { name: 'Next: Size and style' }).click()
  await expect(page.getByRole('radio', { name: /^15/ })).toBeChecked()
  const make = page.getByRole('button', { name: 'Make this paper' })
  await expect(make).toBeEnabled({ timeout: 20_000 })
  await make.click()
  await page.waitForURL('**/attempt/**', { timeout: 30_000 })
})

test('quick path makes a real paper', async ({ page }) => {
  await signIn(page)
  await page.goto(`/my-paper?layout=c&subject=${fixture.subjectId}`)
  const make = page.getByRole('button', { name: 'Make this paper' })
  await expect(make).toBeEnabled({ timeout: 20_000 })
  await make.click()
  await page.waitForURL('**/attempt/**', { timeout: 30_000 })
})

test('no layout query shows the classic builder, without the switch', async ({ page }) => {
  await signIn(page)
  await page.goto(`/my-paper?subject=${fixture.subjectId}`)
  await expect(page.getByLabel('Questions', { exact: true })).toBeVisible({ timeout: 20_000 })
  await expect(page.getByRole('radio', { name: 'Classic' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Customise' })).toHaveCount(0)
})
