import { test, expect } from '@playwright/test'
import { createDb } from '../src/db/connection'

/**
 * "Try as guest" on the sign-in page (2026-10-04 request): tick the parent-or-guardian box, one
 * tap, and she is signed in as a student and lands on finishing her profile -- no email, no
 * password.
 */
test('a guest is signed in with one tap and lands on profile setup', async ({ page }) => {
  const db = createDb()
  let householdId: string | undefined
  try {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)

    const guestButton = page.getByRole('button', { name: 'Try as guest' })
    // Not until the declaration is ticked.
    await expect(guestButton).toBeDisabled()
    await page.getByRole('checkbox').check()
    await expect(guestButton).toBeEnabled()
    await guestButton.click()

    await page.waitForURL('**/profile-setup', { timeout: 30_000 })
    await expect(page.getByRole('heading', { name: 'Set up your profile' })).toBeVisible()
    await expect(page.getByLabel('Student name')).toHaveValue('Guest')

    const me = await page.request.get('/api/auth/get-session')
    const body = (await me.json()) as { user?: { household_id?: string; email?: string } }
    expect(body.user?.email?.endsWith('@guest.prepplan.invalid')).toBe(true)
    householdId = body.user?.household_id
  } finally {
    if (householdId) {
      await db.deleteFrom('consents').where('household_id', '=', householdId).execute()
      await db.updateTable('students').set({ user_id: null }).where('household_id', '=', householdId).execute()
      await db.deleteFrom('users').where('household_id', '=', householdId).execute()
      await db.deleteFrom('households').where('id', '=', householdId).execute()
    }
    await db.destroy()
  }
})
