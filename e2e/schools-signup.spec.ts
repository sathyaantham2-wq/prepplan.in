import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'

/**
 * A school starts itself, on a phone: the sign-up screen, the e-mail form, the wizard it lands in, the
 * plain refusal for an e-mail that is taken, and the Google button's school marker.
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
      '[data-no-sound] :is(button, select, input:not([type=checkbox]):not([type=radio]):not([type=file]):not([tabindex="-1"]), a[class*="min-h"])',
    )) {
      const b = el.getBoundingClientRect()
      if (b.width > 0 && b.height > 0 && b.height < 44)
        small.push(`${el.tagName} ${Math.round(b.height)}px`)
    }
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      small,
    }
  })
  expect(r.overflow, 'page is wider than the screen').toBeLessThanOrEqual(0)
  expect(r.small, 'controls too small to tap').toEqual([])
}

test.describe.serial('a school starts itself (phone)', () => {
  let db: Db
  const tag = `${Date.now()}`.slice(-8)
  const email = `start-${tag}@e2e.school`
  let schoolId = ''

  test.beforeAll(() => {
    db = createDb()
  })
  test.afterAll(async () => {
    const schools = await db
      .selectFrom('schools')
      .select(['id', 'household_id'])
      .where('name', 'like', `Start School ${tag}%`)
      .execute()
    const ids = schools.map((s) => s.id)
    if (ids.length) {
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
      for (const t of ['sessions', 'accounts', 'notifications'])
        await db
          .deleteFrom(t as 'sessions')
          .where('user_id', 'in', mu)
          .execute()
      await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
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
          ...schools.map((s) => s.household_id),
        ])
        .execute()
    }
    await db.destroy()
  })

  test('the sign-in page offers a way to start a school, and the sign-up screen is plain and phone-sized', async ({
    page,
  }) => {
    await page.goto('/school/sign-in', { waitUntil: 'networkidle' })
    await page.getByRole('link', { name: 'Create your school account' }).click()
    await expect(
      page.getByRole('heading', { name: 'Start with your school' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Continue with Google' }),
    ).toBeVisible()
    await expect(page.getByLabel('School name')).toBeVisible()
    // the robot trap is not there for a person
    await expect(page.getByLabel('Website')).toBeHidden()
    const text = (await page.locator('body').innerText()).toLowerCase()
    for (const banned of [
      'student sign up',
      'parent',
      'guest',
      'whatsapp',
      'bloom',
      'json',
    ])
      expect(text, banned).not.toContain(banned)
    await shot(page, 'su-01-sign-up')
    await looksRight(page)
  })

  test('the Google button leaves the school marker (so a new Google login becomes a school login, never a student)', async ({
    page,
  }) => {
    await page.goto('/school/sign-up', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Continue with Google' }).click()
    await expect
      .poll(async () =>
        (await page.context().cookies()).some(
          (c) => c.name === 'pp_school_intent' && c.value === '1',
        ),
      )
      .toBe(true)
    // on this test machine Google is not configured: the person is told, in plain words, what to do
    await expect(
      page.getByText(
        /Google sign-in is not available right now|Opening Google/,
      ),
    ).toBeVisible({ timeout: 15_000 })
  })

  test('the e-mail form: a refusal in plain words, then the school is made and she is in the wizard', async ({
    page,
  }) => {
    await page.goto('/school/sign-up', { waitUntil: 'networkidle' })
    await page.getByLabel('School name').fill(`Start School ${tag}`)
    await page.getByLabel('Your name').fill('Rekha Nair')
    await page.getByLabel('Your e-mail').fill(email)
    await page.getByLabel('Choose a password').fill('short')
    await page.getByRole('button', { name: 'Create my school' }).click()
    await expect(page.getByRole('alert')).toContainText('at least 8 characters')
    await shot(page, 'su-02-password-too-short')
    await page.getByLabel('Choose a password').fill(PASSWORD)
    await page.getByLabel(/Town or city/).fill('Nagpur')
    await shot(page, 'su-03-form-filled')
    await page.getByRole('button', { name: 'Create my school' }).click()
    await page.waitForURL(/\/school\/[0-9a-f-]{36}(\/welcome)?$/, {
      timeout: 20_000,
    })
    schoolId = page.url().match(/school\/([0-9a-f-]{36})/)![1]
    await page.waitForURL(`**/school/${schoolId}/welcome`)
    await expect(
      page.getByRole('heading', { name: 'Welcome. What should we call you?' }),
    ).toBeVisible()
    await expect(page.getByLabel('Your name')).toHaveValue('Rekha Nair')
    await expect(page.getByText('Start School ' + tag).first()).toBeVisible()
    await shot(page, 'su-04-lands-in-wizard')
    await looksRight(page)
  })

  test('the same e-mail cannot start a second school, and she can sign out and in again with the e-mail and password', async ({
    page,
    browser,
  }) => {
    const ctx = await browser.newContext({
      viewport: PHONE,
      hasTouch: true,
      isMobile: true,
    })
    const p = await ctx.newPage()
    await p.goto('/school/sign-up', { waitUntil: 'networkidle' })
    await p.getByLabel('School name').fill(`Start School ${tag} two`)
    await p.getByLabel('Your name').fill('Rekha Nair')
    await p.getByLabel('Your e-mail').fill(email)
    await p.getByLabel('Choose a password').fill(PASSWORD)
    await p.getByRole('button', { name: 'Create my school' }).click()
    await expect(p.getByRole('alert')).toContainText(
      'already has a PrepPlan account',
    )
    await shot(p, 'su-05-email-taken')
    expect(
      await db
        .selectFrom('schools')
        .select('id')
        .where('name', '=', `Start School ${tag} two`)
        .execute(),
    ).toEqual([])
    await p.goto('/school/sign-in', { waitUntil: 'networkidle' })
    await p.getByRole('tab', { name: 'Teacher or school office' }).click()
    await p.getByLabel('Email').fill(email)
    await p.getByLabel('Password', { exact: true }).fill(PASSWORD)
    await p.getByRole('button', { name: 'Sign in', exact: true }).click()
    await p.waitForURL(`**/school/${schoolId}/welcome`)
    await ctx.close()
    expect(page).toBeTruthy()
  })
})
