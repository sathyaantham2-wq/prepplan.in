import { expect, test } from '@playwright/test'
import { createParentSession, promoteToAdmin, TEST_PASSWORD } from '../src/db/test-helpers'

/**
 * 2026-10-16: the admin account has the admin console only. Signing in lands on /admin (the overview),
 * never on "add a student"; the sidebar shows the admin pages and nothing from the parent or student
 * apps; and the parent-only screens send the admin back to /admin.
 */
test('admin signs in to the console, with no student onboarding and no parent screens', async ({ page }) => {
  const admin = await createParentSession('e2e-console-admin')
  await promoteToAdmin(admin.userId)

  await page.goto('/', { waitUntil: 'networkidle' })
  await page.fill('#email', admin.email)
  await page.fill('#password', TEST_PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('**/admin')

  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible()
  await expect(page.getByText('Add a student')).toHaveCount(0)
  const nav = page.getByRole('navigation', { name: 'Admin' })
  for (const label of ['Overview', 'Student activity', 'Product funnel', 'AI usage & cost', 'Question bank', 'Question reports', 'Coverage', 'Syllabus', 'Blueprints', 'Concept videos', 'Users', 'Adaptive settings']) {
    await expect(nav.getByRole('link', { name: label })).toBeVisible()
  }
  await expect(nav.getByRole('link', { name: 'Generate Paper' })).toHaveCount(0)

  // The parent onboarding screen no longer serves the admin account.
  await page.goto('/onboarding')
  await page.waitForURL('**/admin')
})
