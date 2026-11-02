import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Browser, Page } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { deleteSchoolTermsForTest, deleteTestCredentials, signInSchoolUserForTest } from '../src/db/test-helpers'
import { schoolsRepository } from '../src/db/repositories'
import { recordStopReply, setParentPermission } from '../src/lib/schools/messaging/permissions'
import { loadSchoolScope } from '../src/lib/school-session'
import { issueParentLink } from '../src/lib/schools/messaging/link-token'
import { createSchoolStudent, createSchoolTeacher } from '../src/lib/schools/people'
import { enqueueMessage } from '../src/lib/schools/messaging/queue'
import { queueVars, templateDef } from '../src/lib/schools/messaging/templates'
import { setClassTeacher, addSchoolSubject, createClass, createSection  } from '../src/lib/schools/setup'
import { seedProgressDemo } from '../src/lib/schools/progress-demo'
import { acceptSchoolTerms } from '../src/lib/schools/terms'

/**
 * The parent's personal report link on a phone (messaging stage 1): English, Telugu, dark mode, the focus page,
 * and the friendly page for an expired or altered link. No login, no vendor, no network beyond the local app.
 */
const SHOTS = process.env.SCHOOL_SHOTS ?? 'test-results/school-screens'
mkdirSync(SHOTS, { recursive: true })
const PHONE = { width: 390, height: 844 }
test.use({ viewport: PHONE, hasTouch: true, isMobile: true })

async function shot(page: Page, name: string) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  await page.setViewportSize({ width: PHONE.width, height: Math.min(Math.max(height, PHONE.height), 3000) })
  await page.waitForTimeout(200)
  await page.screenshot({ path: `${SHOTS}/${name}.png` })
  await page.setViewportSize(PHONE)
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
}

test.describe.serial('parent link page (phone)', () => {
  let db: Db
  const tag = `${Date.now()}`.slice(-8)
  let schoolId = ''
  let studentId = ''
  let adminUser = ''
  let paperId = ''
  let subjectId = ''
  let sourceId = ''
  let conceptId = ''
  const userIds: Array<string> = []
  const households: Array<string> = []
  const studentIds: Array<string> = []
  let teacherUser = ''
  let principalUser = ''

  test.beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, {
      name: 'Greenfield Public School',
      code: `pm-${tag}`,
      board: 'CBSE',
      adminName: 'Office Admin',
      adminEmail: `pm-${tag}@e2e.school`,
    })
    schoolId = p.school.id
    userIds.push(p.adminUserId)
    adminUser = p.adminUserId
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    await acceptSchoolTerms(db, sa.scope)
    subjectId = (await db.insertInto('subjects').values({ board: 'CBSE', class: 7, code: `PM-${tag}`, name: 'Mathematics', language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()).id
    sourceId = (await db.insertInto('sources').values({ subject_id: subjectId, title: 'Book', publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()).id
    let first = ''
    for (const [i, n] of ['Large Numbers Around Us', 'Arithmetic Expressions', 'A Peek Beyond the Point', 'Expressions Using Letter-Numbers', 'Parallel and Intersecting Lines', 'Number Play'].entries()) {
      const ch = await db.insertInto('chapters').values({ source_id: sourceId, subject_id: subjectId, part: 'I', chapter_no: i + 1, name: n, order_index: i + 1 }).returning('id').executeTakeFirstOrThrow()
      if (i === 0) first = ch.id
    }
    conceptId = (await db.insertInto('concepts').values({ chapter_id: first, board: 'CBSE', class: 7, code: `PM-${tag}-1.1`, name: 'Place value', difficulty_base: 'Easy' }).returning('id').executeTakeFirstOrThrow()).id
    const cls = await createClass(db, sa.scope, 7, '2026-27')
    const sec = await createSection(db, sa.scope, cls.id, 'A')
    await addSchoolSubject(db, sa.scope, cls.id, subjectId)
    for (const [i, n] of ['Aarav Menon Nair', 'Diya Nair', 'Kabir Shah', 'Ishita Rao', 'Vihaan Reddy', 'Anaya Iyer'].entries()) {
      const s = await createSchoolStudent(db, sa.scope, { name: n, grade: 7, sectionId: sec.id, sectionName: 'A', rollNo: String(i + 1), admissionNo: null, guardianPhone: i < 4 ? `+9198765000${10 + i}` : null, guardianName: i < 4 ? `Parent ${i}` : null })
      households.push(s.user.household_id)
      userIds.push(s.user.id)
      if (i === 0) studentId = s.schoolStudent.id
      studentIds.push(s.schoolStudent.id)
    }
    await setParentPermission(db, sa.scope, studentIds[0], { whatsappOk: true, language: 'te' }, 'admin')
    await setParentPermission(db, sa.scope, studentIds[1], { whatsappOk: true }, 'admin')
    await recordStopReply(db, '+919876500011')
    // a class teacher and a principal, and some messages in different states
    const staff = async (name: string, role?: 'principal') => {
      const t = await createSchoolTeacher(db, sa.scope, { name, email: `${name.split(' ')[0].toLowerCase()}-${tag}@e2e.school` })
      households.push(t.user.household_id)
      userIds.push(t.user.id)
      if (role) await db.updateTable('school_members').set({ role }).where('id', '=', t.member.id).execute()
      return t
    }
    const kavita = await staff('Kavita Rao')
    const prakash = await staff('Prakash Menon', 'principal')
    teacherUser = kavita.user.id
    principalUser = prakash.user.id
    await setClassTeacher(db, sa.scope, sec.id, kavita.member.id)
    await db.updateTable('schools').set({ messaging_enabled: true }).where('id', '=', schoolId).execute()
    const guardianOf = async (sid: string) => (await db.selectFrom('school_student_guardians').select('id').where('school_student_id', '=', sid).executeTakeFirstOrThrow()).id
    const mk = async (template: string, who: { s?: string; m?: string }, key: string, status: string, reason: string | null = null) => {
      const id = await enqueueMessage(db, {
        schoolId, template, language: who.s === studentIds[0] ? 'te' : 'en',
        ...(who.s ? { studentId: who.s, guardianId: await guardianOf(who.s) } : { memberId: who.m }),
        variables: Object.fromEntries(queueVars(templateDef(template)).map((v) => [v, v === 'child' ? 'Aarav' : v === 'teacher' || v === 'name' ? 'Kavita' : `${v}-x`])), dedupeKey: key,
      })
      await db.updateTable('school_messages').set({ status, reason, sent_at: status === 'queued' ? null : new Date() }).where('id', '=', id!).execute()
    }
    await mk('weekly_focus', { s: studentIds[0] }, 'e1', 'delivered')
    await mk('weekly_focus', { s: studentIds[1] }, 'e2', 'sent')
    await mk('weekly_focus', { s: studentIds[2] }, 'e3', 'failed', 'webhook_500')
    await mk('weekly_focus', { s: studentIds[3] }, 'e4', 'not_sent', 'messaging_not_connected')
    await mk('flags_waiting', { m: kavita.member.id }, 'e5', 'read')
    await mk('uploads_pending', { m: kavita.member.id }, 'e6', 'queued')
    await mk('monday_pulse', { m: prakash.member.id }, 'e7', 'delivered')
    await seedProgressDemo(db, schoolId, new Date())
    paperId = (await db.selectFrom('school_paper_releases').select('paper_id').where('school_id', '=', schoolId).orderBy('released_at', 'desc').executeTakeFirstOrThrow()).paper_id
  })

  test.afterAll(async () => {
    const schoolIds = [schoolId]
    await deleteTestCredentials(userIds)
    for (const t of ['school_message_events', 'school_messages', 'school_parent_messaging', 'school_exam_reflections', 'school_answer_disputes', 'school_paper_releases', 'school_answer_marks', 'school_sheet_marking', 'school_own_sheets', 'school_own_questions', 'school_own_papers'] as const)
      await db.deleteFrom(t).where('school_id', 'in', schoolIds).execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', schoolIds).execute()
    await db.deleteFrom('school_student_guardians').where('school_id', 'in', schoolIds).execute()
    await db.deleteFrom('school_students').where('school_id', 'in', schoolIds).execute()
    await db.deleteFrom('students').where('school_id', 'in', schoolIds).execute()
    for (const t of ['school_teacher_assignments', 'school_subjects', 'school_sections', 'school_classes'] as const)
      await db.deleteFrom(t).where('school_id', 'in', schoolIds).execute()
    await deleteSchoolTermsForTest(db, schoolIds)
    const members = await db.selectFrom('school_members').select('user_id').where('school_id', 'in', schoolIds).execute()
    await db.deleteFrom('school_members').where('school_id', 'in', schoolIds).execute()
    const sh = await db.selectFrom('schools').select('household_id').where('id', 'in', schoolIds).execute()
    await db.deleteFrom('schools').where('id', 'in', schoolIds).execute()
    const mu = members.map((m) => m.user_id)
    const hh = mu.length ? await db.selectFrom('users').select('household_id').where('id', 'in', mu).execute() : []
    if (mu.length) await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...sh.map((h) => h.household_id), ...hh.map((h) => h.household_id), ...households]).execute()
    await db.deleteFrom('chapters').where('source_id', '=', sourceId).execute()
    await db.deleteFrom('concepts').where('id', '=', conceptId).execute()
    await db.deleteFrom('sources').where('id', '=', sourceId).execute()
    await db.deleteFrom('subjects').where('id', '=', subjectId).execute()
    await db.destroy()
  })

  test('exam report link: first name, score, fixed title, English, Telugu, dark', async ({ page }) => {
    const { token } = issueParentLink({ schoolId, studentId, kind: 'exam', paperId })
    await page.goto(`/p/${token}`)
    await expect(page.getByTestId('parent-score')).toBeVisible()
    await expect(page).toHaveTitle('PrepPlan report')
    await expect(page.locator('h1')).toHaveText('Aarav')
    await expect(page.locator('body')).not.toContainText('Menon')
    expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toBe('PrepPlan report')
    await noOverflow(page)
    await shot(page, 'msg-parent-link-en')
    await page.getByRole('button', { name: 'తె' }).click()
    await expect(page.getByText('బాగా వచ్చినది').or(page.getByText('సాధన చేయాల్సినవి')).first()).toBeVisible()
    await noOverflow(page)
    await shot(page, 'msg-parent-link-te')
    await page.getByRole('button', { name: 'డార్క్ మోడ్' }).click()
    await shot(page, 'msg-parent-link-dark')
  })

  test('focus link shows this week\'s focus', async ({ page }) => {
    const { token } = issueParentLink({ schoolId, studentId, kind: 'focus' })
    await page.goto(`/p/${token}`)
    await expect(page.getByRole('heading', { name: /focus|దృష్టి/ })).toBeVisible()
    await noOverflow(page)
    await shot(page, 'msg-parent-focus')
  })

  test('an expired, altered or unknown link shows the same friendly page', async ({ page }) => {
    const old = issueParentLink({ schoolId, studentId, kind: 'focus' }, new Date(Date.now() - 9 * 86_400_000)).token
    const good = issueParentLink({ schoolId, studentId, kind: 'focus' }).token
    for (const [i, token] of [old, `${good.slice(0, -3)}AAA`, 'not-a-link'].entries()) {
      await page.goto(`/p/${token}`)
      await expect(page.getByTestId('parent-link-invalid')).toBeVisible()
      await expect(page.locator('body')).not.toContainText('Aarav')
      await expect(page.locator('body')).not.toContainText('Greenfield')
      if (i === 0) {
        await noOverflow(page)
        await shot(page, 'msg-parent-link-expired')
      }
    }
  })

  test('the office sees who agreed, who replied STOP and who has no phone', async ({ browser }) => {
    const { ctx, page } = await as(browser, adminUser)
    await page.goto(`/school/${schoolId}/messages?tab=permissions`)
    await expect(page.getByTestId('messages-permissions')).toBeVisible()
    await expect(page.getByText('WhatsApp on')).toBeVisible()
    await expect(page.getByText('Replied STOP').first()).toBeVisible()
    await expect(page.getByText('No phone').first()).toBeVisible()
    await expect(page.getByText(/Confirmed by Office Admin/)).toBeVisible()
    await noOverflow(page)
    await shot(page, 'msg-admin-permissions')
    // switch a parent on, then off, from the phone
    const off = page.getByTestId(`perm-${studentIds[2]}`)
    await off.getByRole('button', { name: 'The parent agreed' }).click()
    await expect(page.getByText('Recorded. This parent will get messages.')).toBeVisible()
    await expect(page.getByTestId(`perm-${studentIds[2]}`).getByText('WhatsApp on')).toBeVisible()
    await page.getByTestId(`perm-${studentIds[2]}`).getByRole('button', { name: 'Switch off' }).click()
    await expect(page.getByTestId(`perm-${studentIds[2]}`).getByText('Off', { exact: true })).toBeVisible()
    // a STOP parent: only after confirming
    await page.getByTestId(`perm-${studentIds[1]}`).getByRole('button', { name: 'Parent asked again…' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await shot(page, 'msg-admin-reenable')
    await page.getByRole('button', { name: 'Close' }).click()
    await ctx.close()
  })

  const sessions = new Map<string, string>()
  async function as(browser: Browser, userId: string) {
    if (!sessions.has(userId)) sessions.set(userId, (await signInSchoolUserForTest(userId)).cookie)
    const session = { cookie: sessions.get(userId)! }
    const eq = session.cookie.indexOf('=')
    const ctx = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true })
    await ctx.addCookies([{ name: session.cookie.slice(0, eq), value: session.cookie.slice(eq + 1), url: 'http://localhost:3000' }])
    return { ctx, page: await ctx.newPage() }
  }

  test('the office sees the activity and can try a failed message again', async ({ browser }) => {
    const { ctx, page } = await as(browser, adminUser)
    await page.goto(`/school/${schoolId}/messages`)
    await expect(page.getByTestId('messages-activity')).toBeVisible()
    await expect(page.getByText('Sent this week')).toBeVisible()
    await expect(page.getByTestId('message-row')).toHaveCount(7)
    await expect(page.getByText('The delivery service had a problem.')).toBeVisible()
    await expect(page.getByText('Messaging is not connected yet.')).toBeVisible()
    await expect(page.locator('body')).not.toContainText('Menon Nair')
    await noOverflow(page)
    await shot(page, 'msg-admin-activity')
    await page.getByRole('button', { name: 'Try again' }).first().click()
    await expect(page.getByText('It will be tried again at the next run.')).toBeVisible()
    await ctx.close()
  })

  test('a teacher sees only the messages about her own section', async ({ browser }) => {
    const { ctx, page } = await as(browser, teacherUser)
    await page.goto(`/school/${schoolId}/messages`)
    await expect(page.getByTestId('messages-activity')).toBeVisible()
    await expect(page.getByText('Prakash Menon')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Try again' })).toHaveCount(0)
    await expect(page.getByRole('tab')).toHaveCount(0)
    await noOverflow(page)
    await shot(page, 'msg-teacher-activity')
    await ctx.close()
  })

  test('the principal sees the school summary and sets his own limits', async ({ browser }) => {
    const { ctx, page } = await as(browser, principalUser)
    await page.goto(`/school/${schoolId}/messages`)
    await expect(page.getByTestId('messages-activity')).toBeVisible()
    await expect(page.getByTestId('message-row')).toHaveCount(0)
    await expect(page.locator('body')).not.toContainText('Aarav')
    await noOverflow(page)
    await shot(page, 'msg-principal-summary')
    await page.getByRole('tab', { name: 'Settings' }).click()
    await expect(page.getByTestId('messages-settings')).toBeVisible()
    await page.getByLabel('Most messages a parent may get about one child in a week').selectOption('3')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Saved.')).toBeVisible()
    await noOverflow(page)
    await shot(page, 'msg-principal-settings')
    await page.reload()
    await expect(page.getByLabel('Most messages a parent may get about one child in a week')).toHaveValue('3')
    await ctx.close()
  })
})
