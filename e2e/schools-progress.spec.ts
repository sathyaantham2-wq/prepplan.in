import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import type { Browser, BrowserContext, Page } from '@playwright/test'
import { createDb } from '../src/db/connection'
import type { Db } from '../src/db/connection'
import { signInSchoolUserForTest } from '../src/db/test-helpers'
import { schoolsRepository } from '../src/db/repositories'
import { loadSchoolScope } from '../src/lib/school-session'
import { createSchoolStudent, createSchoolTeacher } from '../src/lib/schools/people'
import { seedProgressDemo } from '../src/lib/schools/progress-demo'
import { addSchoolSubject, createClass, createSection } from '../src/lib/schools/setup'
import { acceptSchoolTerms } from '../src/lib/schools/terms'

/**
 * The Progress Report (student and parent) and Class Progress (teacher), on a phone: English, Telugu and dark
 * mode, the exam report, the topic map, writing habits, the parent summary, WhatsApp, the heatmaps and the
 * export. History is the deterministic demo seed; no AI and no vendor is called.
 */
const SHOTS = process.env.SCHOOL_SHOTS ?? 'test-results/school-screens'
mkdirSync(SHOTS, { recursive: true })
const PHONE = { width: 390, height: 844 }
test.use({ viewport: PHONE, hasTouch: true, isMobile: true })

async function shot(page: Page, name: string) {
  const size = page.viewportSize()
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  if (size) await page.setViewportSize({ width: size.width, height: Math.min(Math.max(height, size.height), 5000) })
  await page.waitForTimeout(200)
  await page.screenshot({ path: `${SHOTS}/${name}.png` })
  if (size) await page.setViewportSize(size)
}
async function noOverflow(page: Page) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(over, 'page is wider than the screen').toBeLessThanOrEqual(0)
}
async function asUser(browser: Browser, userId: string): Promise<{ ctx: BrowserContext; page: Page }> {
  const session = await signInSchoolUserForTest(userId)
  const eq = session.cookie.indexOf('=')
  const ctx = await browser.newContext({ viewport: PHONE, hasTouch: true, isMobile: true })
  await ctx.addCookies([{ name: session.cookie.slice(0, eq), value: session.cookie.slice(eq + 1), url: 'http://localhost:3000' }])
  return { ctx, page: await ctx.newPage() }
}

const SUBJECTS = [
  { name: 'Mathematics', code: 'A', chapters: ['Large Numbers Around Us', 'Arithmetic Expressions', 'A Peek Beyond the Point', 'Expressions Using Letter-Numbers', 'Parallel and Intersecting Lines', 'Number Play'] },
  { name: 'Science', code: 'B', chapters: ['Electricity: Circuits and Their Components', 'Light: Shadows and Reflections', 'Nutrition in Plants', 'Measurement of Time and Motion', 'Heat Transfer in Nature', 'Exploring Substances: Acidic, Basic, and Neutral'] },
  { name: 'Social Science', code: 'C', chapters: ['Geographical Diversity of India', 'Understanding the Weather', 'The Rise of Empires', 'Towards Unity', 'Our Constitution', 'Money and Markets'] },
]
const NAMES = ['Aarav Menon', 'Diya Nair', 'Kabir Shah', 'Ishita Rao', 'Vihaan Reddy', 'Anaya Iyer', 'Rohan Das', 'Meera Pillai', 'Arjun Verma', 'Sana Khan', 'Tara Joshi', 'Yash Kulkarni']

test.describe.serial('progress report and class progress (phone)', () => {
  let db: Db
  const tag = `${Date.now()}`.slice(-8)
  let schoolId = ''
  let adminUser = ''
  let studentUser = ''
  let parentUser = ''
  const sourceIds: Array<string> = []
  const subjectIds: Array<string> = []
  let sectionId = ''
  let student: { ctx: BrowserContext; page: Page }

  test.beforeAll(async ({ browser }) => {
    db = createDb()
    const p = await schoolsRepository.provision(db, {
      name: 'Greenfield Public School',
      code: `pg-${tag}`,
      board: 'CBSE',
      adminName: 'Office Admin',
      adminEmail: `pg-${tag}@e2e.school`,
    })
    schoolId = p.school.id
    adminUser = p.adminUserId
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    const admin = sa.scope
    await acceptSchoolTerms(db, admin)
    const cls = await createClass(db, admin, 7, '2026-27')
    sectionId = (await createSection(db, admin, cls.id, 'A')).id
    for (const s of SUBJECTS) {
      const sub = await db.insertInto('subjects').values({ board: 'CBSE', class: 7, code: `E2E-PG-${s.code}-${tag}`, name: s.name, language: 'en', is_active: true }).returning('id').executeTakeFirstOrThrow()
      subjectIds.push(sub.id)
      const src = await db.insertInto('sources').values({ subject_id: sub.id, title: `${s.name} book`, publisher: 'NCERT' }).returning('id').executeTakeFirstOrThrow()
      sourceIds.push(src.id)
      for (const [i, name] of s.chapters.entries()) {
        const ch = await db.insertInto('chapters').values({ source_id: src.id, subject_id: sub.id, part: 'I', chapter_no: i + 1, name, order_index: i + 1 }).returning('id').executeTakeFirstOrThrow()
        const con = await db.insertInto('concepts').values({ chapter_id: ch.id, board: 'CBSE', class: 7, code: `E2E-PG-${s.code}-${tag}-${i + 1}.1`, name, difficulty_base: 'Easy' }).returning('id').executeTakeFirstOrThrow()
        for (let q = 0; q < 4; q++)
          await db.insertInto('questions').values({ concept_id: con.id, board: 'CBSE', class: 7, bloom: 'Apply', difficulty: 'Easy', marks: 2, type: 'short_answer', text: `Practice question ${q + 1} on ${name}: explain the main idea in your own words.`, text_hash: `${tag}-${s.code}-${i}-${q}`, answer: `A full answer names the idea and gives one example (${name}).`, status: 'approved', origin: 'manual', created_by: 'test', tags: [] }).execute()
      }
      await addSchoolSubject(db, admin, cls.id, sub.id)
    }
    const kids: Array<{ id: string; user: string }> = []
    for (const [i, n] of NAMES.entries()) {
      const s = await createSchoolStudent(db, admin, { name: n, grade: 7, sectionId, sectionName: 'A', rollNo: String(i + 1), admissionNo: null, guardianPhone: null, guardianName: null })
      kids.push({ id: s.schoolStudent.id, user: s.user.id })
    }
    studentUser = kids[0].user
    const par = await createSchoolTeacher(db, admin, { name: 'Suresh Menon', email: `parent-${tag}@e2e.school` })
    await db.updateTable('school_members').set({ role: 'parent' }).where('id', '=', par.member.id).execute()
    await db.insertInto('school_student_guardians').values({ school_id: schoolId, school_student_id: kids[0].id, phone_e164: '+910000000001', name: 'Suresh Menon', user_id: par.user.id }).execute()
    parentUser = par.user.id
    await seedProgressDemo(db, schoolId)
    student = await asUser(browser, studentUser)
  })

  test.afterAll(async () => {
    const { sql } = await import('kysely')
    const ids = [schoolId]
    const mem = await db.selectFrom('school_members').select('user_id').where('school_id', 'in', ids).execute()
    const mu = mem.map((m) => m.user_id)
    const hh = await db.selectFrom('users').select('household_id').where('id', 'in', mu).execute()
    const sh = await db.selectFrom('schools').select('household_id').where('id', 'in', ids).execute()
    for (const t of ['sessions', 'accounts', 'notifications']) await db.deleteFrom(t as 'sessions').where('user_id', 'in', mu).execute()
    await sql`alter table school_upload_checks disable trigger school_upload_checks_append_only`.execute(db)
    await db.deleteFrom('school_upload_checks').where('school_id', 'in', ids).execute()
    await sql`alter table school_upload_checks enable trigger school_upload_checks_append_only`.execute(db)
    for (const t of ['school_exam_reflections', 'school_answer_disputes', 'school_paper_releases', 'school_answer_marks', 'school_sheet_marking', 'school_own_sheets', 'school_own_questions', 'school_own_papers', 'school_student_guardians', 'school_students', 'students', 'school_credential_codes', 'audit_log', 'school_teacher_assignments', 'school_subjects', 'school_sections', 'school_classes'] as const)
      await db.deleteFrom(t as 'school_classes').where('school_id', 'in', ids).execute()
    await sql`alter table school_terms_acceptances disable trigger school_terms_acceptances_append_only`.execute(db)
    await db.deleteFrom('school_terms_acceptances').where('school_id', 'in', ids).execute()
    await sql`alter table school_terms_acceptances enable trigger school_terms_acceptances_append_only`.execute(db)
    await db.deleteFrom('school_members').where('school_id', 'in', ids).execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...hh.map((h) => h.household_id), ...sh.map((h) => h.household_id)]).execute()
    for (const sid of subjectIds) {
      const ch = await db.selectFrom('chapters').select('id').where('subject_id', '=', sid).execute()
      const cids = (await db.selectFrom('concepts').select('id').where('chapter_id', 'in', ch.map((c) => c.id)).execute()).map((c) => c.id)
      if (cids.length) {
        await db.deleteFrom('questions').where('concept_id', 'in', cids).execute()
        await db.deleteFrom('concepts').where('id', 'in', cids).execute()
      }
      await db.deleteFrom('chapters').where('subject_id', '=', sid).execute()
      await db.deleteFrom('sources').where('subject_id', '=', sid).execute()
      await db.deleteFrom('subjects').where('id', '=', sid).execute()
    }
    await db.destroy()
  })

  test('1 · My Progress: growth line, this week’s focus (three), personal best, compact header', async () => {
    const page = student.page
    await page.goto(`/school/${schoolId}/progress`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('who')).toContainText('Aarav Menon')
    await expect(page.getByTestId('who')).toContainText('Class 7 A · Greenfield Public School')
    await expect(page.getByTestId('growth-line')).toBeVisible()
    await expect(page.getByTestId('focus-item')).toHaveCount(3)
    await expect(page.getByTestId('best')).toContainText(/best|record/i)
    await expect(page.getByTestId('exam-link')).toHaveCount(9)
    await shot(page, 'pg-1-my-progress')
    await noOverflow(page)
  })

  test('2 · Subjects: a tile each with latest %, trend arrow and the ring of topics at Proficient', async () => {
    const page = student.page
    await page.getByRole('tab', { name: 'Subjects' }).click()
    await expect(page.getByTestId('subject-tile')).toHaveCount(3)
    await expect(page.getByTestId('subject-tile').first()).toContainText('Mathematics')
    await shot(page, 'pg-2-subjects')
    await noOverflow(page)
  })

  test('3 · Exam report: score and grade, where marks went, three things to fix, the question grid', async () => {
    const page = student.page
    await page.getByRole('tab', { name: 'Progress' }).click()
    await page.getByTestId('exam-link').first().click()
    await expect(page.getByTestId('exam-report')).toBeVisible()
    await expect(page.getByTestId('score')).toContainText('/ 30')
    await expect(page.getByTestId('grade')).toHaveText(/^[A-E][12]?$/)
    await expect(page.getByTestId('split-bar')).toContainText("Didn't know it")
    await expect(page.getByTestId('split-bar')).toContainText('Writing habits')
    expect(await page.getByTestId('fix').count()).toBeGreaterThan(0)
    expect(await page.getByTestId('fix').count()).toBeLessThanOrEqual(3)
    await expect(page.getByTestId('fix').first().getByRole('link', { name: 'Practise this' })).toBeVisible()
    await shot(page, 'pg-3-exam-report')
    // the grid: open a written answer to see the marks for each step
    const rows = page.getByTestId('grid-row')
    await expect(rows).toHaveCount(16)
    await rows.nth(9).locator('summary').click()
    await expect(rows.nth(9)).toContainText('Marks for each step')
    await rows.nth(9).scrollIntoViewIfNeeded()
    await shot(page, 'pg-3b-exam-report-grid-open')
    await noOverflow(page)
    // "Practise this": try, a hint on request, the answer and the steps, then a fresh one on her own
    const href = (await page.getByTestId('fix').first().getByRole('link', { name: 'Practise this' }).getAttribute('href')) ?? ''
    expect(href).toContain('/progress/practise?topic=')
    await page.goto(href, { waitUntil: 'networkidle' })
    const pr = page.getByTestId('practise')
    await expect(pr).toContainText('Try this one yourself first')
    await expect(pr).toContainText('Nothing is saved')
    await pr.getByTestId('hint-btn').click()
    await expect(pr.getByTestId('hint')).toBeVisible()
    await shot(page, 'pg-3c-practise-hint')
    await pr.getByLabel('Write your answer here, or in your notebook').fill('my attempt')
    await pr.getByTestId('check-btn').click()
    await expect(pr.getByTestId('checked')).toContainText('The answer')
    await shot(page, 'pg-3d-practise-answer')
    await pr.getByRole('button', { name: 'I got it right' }).click()
    await expect(pr).toContainText('Now a fresh one. Do it on your own.')
    await pr.getByTestId('check-btn').click()
    await pr.getByRole('button', { name: 'Not yet' }).click()
    await expect(pr.getByTestId('practise-summary')).toContainText('With a hint')
    await expect(pr.getByTestId('practise-summary')).toContainText('On my own')
    await expect(pr.getByTestId('practise-summary')).toContainText('One success is a good start')
    await shot(page, 'pg-3e-practise-summary')
    await noOverflow(page)
    // the printable worksheet is still there
    const pdfHref = await pr.getByRole('link', { name: 'Print a worksheet instead' }).getAttribute('href')
    const r = await page.request.get(pdfHref ?? '')
    expect(r.status()).toBe(200)
    expect(r.headers()['content-type']).toBe('application/pdf')
    writeFileSync(`${SHOTS}/pg-practise-this.pdf`, await r.body())
  })

  test('4 · Topic map: every topic at Beginner / Progressing / Proficient', async () => {
    const page = student.page
    await page.goto(`/school/${schoolId}/progress?tab=topics`, { waitUntil: 'networkidle' })
    const rows = page.getByTestId('topic-row')
    expect(await rows.count()).toBeGreaterThanOrEqual(12)
    const text = await page.getByTestId('topic-map').innerText()
    expect(text).toMatch(/Beginner|Progressing|Proficient/)
    await shot(page, 'pg-4-topic-map')
    await noOverflow(page)
  })

  test('5 · Writing habits: a trend for each habit across exams', async () => {
    const page = student.page
    await page.goto(`/school/${schoolId}/progress?tab=habits`, { waitUntil: 'networkidle' })
    expect(await page.getByTestId('habit-card').count()).toBeGreaterThan(0)
    await expect(page.getByTestId('habits')).toContainText(/Steps skipped|Units or final line missing|Stopped writing too early|Misread the question/)
    await shot(page, 'pg-5-habits')
    await noOverflow(page)
  })

  test('Telugu and dark mode', async () => {
    const page = student.page
    await page.goto(`/school/${schoolId}/progress`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'తె' }).click()
    await expect(page.getByTestId('progress')).toContainText('ఈ వారం దృష్టి పెట్టాల్సినవి')
    await shot(page, 'pg-6-telugu-home')
    await page.getByRole('tab', { name: 'అంశాలు' }).click()
    await shot(page, 'pg-7-telugu-topic-map')
    await page.getByRole('button', { name: 'డార్క్ మోడ్' }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.getByRole('tab', { name: 'పురోగతి' }).click()
    await shot(page, 'pg-8-dark-home-telugu')
    await page.getByRole('button', { name: 'EN' }).click()
    await page.getByTestId('exam-link').first().click()
    await expect(page.getByTestId('exam-report')).toBeVisible()
    await shot(page, 'pg-9-dark-exam-report')
    await noOverflow(page)
    await page.getByRole('button', { name: 'Dark mode' }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('self-reflection after an exam is saved for the Holistic Progress Card', async () => {
    const page = student.page
    await page.goto(`/school/${schoolId}/progress?tab=home`, { waitUntil: 'networkidle' })
    await page.getByTestId('exam-link').first().click()
    const box = page.getByTestId('reflection')
    await box.scrollIntoViewIfNeeded()
    await box.getByLabel('Which question was hardest?').selectOption({ index: 3 })
    await box.getByLabel('What will you do differently next time?').selectOption('show_steps')
    await box.getByRole('button', { name: 'Good' }).click()
    await box.getByRole('button', { name: 'Save' }).click()
    await expect(box.getByRole('button', { name: 'Saved' })).toBeVisible()
    await shot(page, 'pg-10-reflection')
  })

  test('the parent summary (PDF, English and Telugu) and the WhatsApp text', async ({ browser }) => {
    const parent = await asUser(browser, parentUser)
    const page = parent.page
    await page.goto(`/school/${schoolId}/progress`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('who')).toContainText('Aarav Menon')
    await expect(page.getByTestId('progress')).not.toContainText('Diya')
    await shot(page, 'pg-11-parent-view')
    for (const lang of ['en', 'te'] as const) {
      const pdf = await page.request.get(`/api/schools/${schoolId}/progress/summary?lang=${lang}&format=pdf`)
      expect(pdf.status()).toBe(200)
      expect(pdf.headers()['content-type']).toBe('application/pdf')
      const body = await pdf.body()
      expect(body.subarray(0, 4).toString()).toBe('%PDF')
      writeFileSync(`${SHOTS}/pg-parent-summary-${lang}.pdf`, body)
      // the page the PDF is printed from, shown as an A4 sheet
      const html = await (await page.request.get(`/api/schools/${schoolId}/progress/summary?lang=${lang}&format=html`)).text()
      const sheet = await parent.ctx.newPage()
      await sheet.setViewportSize({ width: 794, height: 1123 })
      await sheet.setContent(html, { waitUntil: 'load' })
      await sheet.screenshot({ path: `${SHOTS}/pg-parent-summary-${lang}.png`, fullPage: true })
      await sheet.close()
    }
    // WhatsApp: the share sheet opens with the summary text, nothing is stored
    await parent.ctx.route('https://wa.me/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<p>WhatsApp</p>' }))
    const popup = page.waitForEvent('popup')
    await page.getByTestId('whatsapp').click()
    const wa = await popup
    expect(wa.url()).toContain('https://wa.me/?text=')
    expect(decodeURIComponent(wa.url())).toContain('Aarav Menon')
    // a parent cannot write the child's reflection or flag marks
    const r = await page.request.post(`/api/schools/${schoolId}/progress/reflection`, { data: { paper_id: '00000000-0000-4000-8000-000000000000' } })
    expect([401, 403, 404]).toContain(r.status())
    await parent.ctx.close()
  })

  test('Class Progress for the teacher: heatmaps, who needs attention, flags, export', async ({ browser }) => {
    const t = await asUser(browser, adminUser)
    const page = t.page
    await page.goto(`/school/${schoolId}/class-progress`, { waitUntil: 'networkidle' })
    const cp = page.getByTestId('class-progress')
    await expect(cp).toContainText('Class 7 A')
    await expect(page.getByTestId('topic-heatmap').locator('tbody tr')).toHaveCount(12)
    await expect(page.getByTestId('habit-heatmap').locator('tbody tr')).toHaveCount(13)
    await expect(cp).toContainText('Students who need attention this week')
    await expect(cp).toContainText('Flags with a teacher')
    await shot(page, 'pg-12-class-progress')
    await noOverflow(page)
    for (const f of ['xlsx', 'csv'] as const) {
      const dl = page.waitForEvent('download')
      await page.getByTestId(`export-${f}`).click()
      const file = await dl
      const path = `${SHOTS}/pg-export-${f === 'xlsx' ? 'class-7A-progress.xlsx' : 'class-7A-progress.csv'}`
      await file.saveAs(path)
      expect(statSync(path).size).toBeGreaterThan(300)
    }
    // the same screen on a laptop
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.reload({ waitUntil: 'networkidle' })
    await shot(page, 'pg-13-class-progress-desktop')
    await page.setViewportSize(PHONE)
    // a student cannot reach any of it
    const denied = await student.page.request.get(`/api/schools/${schoolId}/class-progress`)
    expect([401, 403, 404]).toContain(denied.status())
    // class rank is off, and the office can switch it on
    await page.goto(`/school/${schoolId}/settings`, { waitUntil: 'networkidle' })
    await page.getByTestId('progress-settings').scrollIntoViewIfNeeded()
    await shot(page, 'pg-14-settings-rank-and-window')
    await page.getByTestId('progress-settings').getByRole('checkbox').check()
    await page.getByTestId('progress-settings').getByRole('button', { name: 'Save' }).click()
    await expect(page.getByTestId('progress-settings')).toContainText('Saved')
    await student.page.goto(`/school/${schoolId}/progress`, { waitUntil: 'networkidle' })
    await expect(student.page.getByTestId('best')).toContainText('Class rank:')
    await shot(student.page, 'pg-15-rank-switched-on')
    await t.ctx.close()
  })

  test('while a flag window is open the exam report says so and lets the student flag; levels leave that exam out', async () => {
    const page = student.page
    const last = await db
      .selectFrom('school_paper_releases as r')
      .innerJoin('school_own_papers as p', 'p.id', 'r.paper_id')
      .select(['r.id', 'r.paper_id'])
      .where('r.school_id', '=', schoolId)
      .where('p.title', 'like', 'Mathematics Half-Yearly%')
      .executeTakeFirstOrThrow()
    await db.updateTable('school_paper_releases').set({ locked_at: null, window_closes_at: new Date(Date.now() + 4 * 86_400_000) }).where('id', '=', last.id).execute()
    await page.goto(`/school/${schoolId}/progress?tab=home`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('exam-link')).toHaveCount(8) // only locked marks feed the home screen
    await page.goto(`/school/${schoolId}/progress/exam/${last.paper_id}`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('not-final')).toContainText('not final')
    const row = page.getByTestId('grid-row').nth(9)
    await row.locator('summary').click()
    await expect(row.getByRole('button', { name: 'I think this mark is wrong' })).toBeVisible()
    await row.scrollIntoViewIfNeeded()
    await shot(page, 'pg-16-exam-report-flag-window-open')
    await noOverflow(page)
  })
})
