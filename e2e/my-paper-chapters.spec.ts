import { test, expect } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { studentsRepository } from '../src/db/repositories'
import { createParentSession, createStudentSession } from '../src/db/test-helpers'
import type { TestSession } from '../src/db/test-helpers'
import { createClass7Fixture, removeClass7Fixture } from './class7-fixture'
import type { Class7Fixture } from './class7-fixture'

/**
 * Choosing chapters by part in the paper builder (/my-paper, Customise, step 2): chapters are
 * grouped under Part I, Part II ... with a "n of m selected" count each, and Select all / Clear
 * and ticking one chapter keep those counts right. Builds its own two-part Class 7 subject (see
 * class7-fixture.ts), because chapter identity is (part, number) and CI has no real Class 7 data.
 */

let db: Db
let parent: TestSession
let student: TestSession
let fixture: Class7Fixture
let studentId: string

test.beforeAll(async () => {
  db = createDb()
  fixture = await createClass7Fixture(db, 'written')
  parent = await createParentSession('e2e-parts-parent')
  const row = await studentsRepository.insert(db, {
    household_id: parent.householdId,
    name: 'Parts Kid',
    class: 7,
    board: 'CBSE',
    target_exams: JSON.stringify([]),
  })
  studentId = row.id
  student = await createStudentSession('e2e-parts-student', parent.householdId, studentId)
})

test.afterAll(async () => {
  await db.deleteFrom('households').where('id', '=', parent.householdId).execute()
  await removeClass7Fixture(db, fixture)
  await db.destroy()
})

test('chapters are grouped by part and selected per part', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.fill('#email', student.email)
  await page.fill('#password', student.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  // A first sign-in finishes the profile first, as the adaptive-flow spec does.
  await page.waitForURL('**/profile-setup')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForURL('**/choose-board**')
  await page.getByRole('button', { name: 'Class 7' }).click()
  await page.getByRole('button', { name: 'Save and continue' }).click()
  await page.waitForURL('**/my-paper**')

  await page.goto(`/my-paper?subject=${fixture.subjectId}`)
  await page.getByRole('button', { name: 'Customise' }).click({ timeout: 20_000 })
  await page.getByRole('button', { name: 'Next: Chapters' }).click()
  await expect(page.getByRole('heading', { name: 'Which chapters?' })).toBeVisible()

  const partI = page.getByText(/^Part I · \d of 1 selected$/)
  const partII = page.getByText(/^Part II · \d of 1 selected$/)
  await expect(partI).toBeVisible()
  await expect(partII).toBeVisible()

  await page.getByRole('button', { name: 'Clear' }).click()
  await expect(partI).toHaveText('Part I · 0 of 1 selected')
  await expect(partII).toHaveText('Part II · 0 of 1 selected')

  // Ticking the Part II chapter changes Part II only.
  await page
    .locator('label')
    .filter({ hasText: /E2E chapter part II/ })
    .click()
  await expect(partI).toHaveText('Part I · 0 of 1 selected')
  await expect(partII).toHaveText('Part II · 1 of 1 selected')
  await expect(page.getByText('1 selected', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Select all' }).click()
  await expect(partI).toHaveText('Part I · 1 of 1 selected')
  await expect(partII).toHaveText('Part II · 1 of 1 selected')
  await expect(page.getByText('2 selected', { exact: true })).toBeVisible()
})
