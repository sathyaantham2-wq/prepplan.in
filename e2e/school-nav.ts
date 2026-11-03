import type { Locator, Page } from '@playwright/test'

/**
 * The school sidebar (UI redesign 2026-11-03): always shown on a wide screen; on a phone it is a menu that slides in
 * from the menu button. These helpers open it when needed so a test reads the same at every width.
 */
export async function schoolNav(page: Page): Promise<Locator> {
  const drawer = page.getByRole('dialog', { name: 'Menu' })
  const menu = page.getByTestId('menu-button')
  if (!(await drawer.isVisible()) && (await menu.isVisible())) await menu.click()
  return page.getByTestId('sidebar').filter({ visible: true })
}

/** Goes to a sidebar item by its label (exact text, or a pattern). */
export async function goTo(page: Page, name: string | RegExp): Promise<void> {
  const nav = await schoolNav(page)
  await nav.getByRole('link', typeof name === 'string' ? { name, exact: true } : { name }).click()
}

/** Closes the phone menu if it is open (after checking what it lists). */
export async function closeNav(page: Page): Promise<void> {
  const drawer = page.getByRole('dialog', { name: 'Menu' })
  if (await drawer.isVisible()) await drawer.getByRole('button', { name: 'Close the menu' }).click()
}

/** Signs out through the account menu. */
export async function signOutOfSchool(page: Page): Promise<void> {
  await page.getByTestId('profile-button').click()
  await page.getByRole('menuitem', { name: 'Sign out' }).click()
}
