import { test, expect } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { studentsRepository } from '../src/db/repositories'
import { createParentSession, createStudentSession } from '../src/db/test-helpers'
import type { TestSession } from '../src/db/test-helpers'
import { createClass7Fixture, removeClass7Fixture } from './class7-fixture'
import type { Class7Fixture } from './class7-fixture'

/**
 * Owner decision 2026-10-04: choosing Combined or Written on the paper page always brings written
 * questions, even for a brand-new student on a first paper -- before, those appeared only once her
 * concepts had moved up. The plan's own numbers are what the bar at the bottom shows, so this
 * checks them through the real page. (Which written questions get drawn is covered by the plan and
 * generation integration tests.)
 */

let db: Db
let parent: TestSession
let student: TestSession
let fixture: Class7Fixture

test.beforeAll(async () => {
  db = createDb()
  fixture = await createClass7Fixture(db, 'written')
  parent = await createParentSession('e2e-written-parent')
  const row = await studentsRepository.insert(db, {
    household_id: parent.householdId,
    name: 'Written Kid',
    class: 7,
    board: 'CBSE',
    target_exams: JSON.stringify([]),
  })
  student = await createStudentSession('e2e-written-student', parent.householdId, row.id)
})

test.afterAll(async () => {
  await db.deleteFrom('households').where('id', '=', parent.householdId).execute()
  await removeClass7Fixture(db, fixture)
  await db.destroy()
})

test('combined and written bring written questions, even for a brand-new student', async ({
  page,
}) => {
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

  const type = page.getByLabel('Question type', { exact: true })
  // Default Combined: 10 multiple choice + 2 short + 1 long answer.
  await expect(page.getByText(/·\s*13\s+questions/)).toBeVisible({ timeout: 20_000 })
  // Written only: 4 short + 2 long answers.
  await type.selectOption('written')
  await expect(page.getByText(/·\s*6\s+questions/)).toBeVisible()
  // Multiple choice only, as before.
  await type.selectOption('mcq')
  await expect(page.getByText(/·\s*10\s+questions/)).toBeVisible()
})
