import { test, expect } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { createParentSession, promoteToAdmin } from '../src/db/test-helpers'
import type { TestSession } from '../src/db/test-helpers'

/**
 * F167: the admin question-quality screen. The detectors and decisions are covered by
 * src/lib/quality/quality-loop.integration.test.ts; this proves the screen loads for an admin, the
 * "Check latest answers" button runs the refresh and shows its summary, and a non-admin is refused.
 */

let db: Db
let admin: TestSession
let parent: TestSession

test.beforeAll(async () => {
  db = createDb()
  admin = await createParentSession('e2e-quality-admin')
  await promoteToAdmin(admin.userId)
  parent = await createParentSession('e2e-quality-parent')
})

test.afterAll(async () => {
  await db.deleteFrom('households').where('id', 'in', [admin.householdId, parent.householdId]).execute()
  await db.destroy()
})

test('an admin opens the quality queue and checks the latest answers', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.fill('#email', admin.email)
  await page.fill('#password', admin.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForTimeout(1500)

  await page.goto('/admin/quality', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: 'Question quality' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Question quality' })).toBeVisible()

  await page.getByRole('button', { name: 'Check latest answers' }).click()
  await expect(page.getByText('First-time answers read')).toBeVisible()
  await expect(page.getByText('New cases')).toBeVisible()
  if (process.env.QUALITY_SHOT) await page.screenshot({ path: process.env.QUALITY_SHOT, fullPage: true })
})

test('a parent cannot read the quality queue', async ({ request }) => {
  const response = await request.get('/api/admin/quality', {
    headers: { cookie: parent.cookie },
  })
  expect(response.status()).toBe(403)
})
