import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../../db/connection'
import type { Db } from '../../../db/connection'
import { schoolsRepository } from '../../../db/repositories'
import type { SchoolScope } from '../../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../../db/test-helpers'
import { loadSchoolScope } from '../../school-session'
import { SchoolError } from '../common'
import { createSchoolStudent, createSchoolTeacher } from '../people'
import { commitRosterImport, dryRunRosterImport } from '../roster'
import { buildRosterTemplate } from '../roster-template'
import { createClass, createSection } from '../setup'
import { acceptSchoolTerms } from '../terms'
import { isPhoneOptedOut, listPermissions, recordStopReply, setParentPermission } from './permissions'
import { enqueueMessage } from './queue'
import { queueVars, templateDef } from './templates'

// Messaging stage 2 (docs/schools/MESSAGING_PLAN.md sections 2 and 8, tests 2 and 8): the roster columns, who
// confirmed and when, default no, STOP, and that a file can never undo a STOP. Local test database only.
const YEAR = '2026-27'
const csv = (lines: Array<string>) => Buffer.from(lines.join('\n') + '\n')
const HEAD = 'Name,Class,Section,Roll No,Parent Phone,Parent WhatsApp OK,Parent Language'

describe('parent messaging permission (stage 2)', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolA: string
  let schoolB: string
  let adminA: SchoolScope
  let adminB: SchoolScope
  let teacherA: SchoolScope
  let sectionA: string
  let sectionB: string
  const userIds: Array<string> = []
  const households: Array<string> = []
  const PHONE = '9876500011'
  const E164 = '+919876500011'

  async function upload(scope: SchoolScope, lines: Array<string>) {
    const dry = await dryRunRosterImport(db, scope, { kind: 'students', academicYear: YEAR, fileName: 'r.csv', bytes: csv([HEAD, ...lines]) })
    return dry
  }
  const perm = async (scope: SchoolScope, name: string) => (await listPermissions(db, scope)).find((r) => r.name === name)!

  beforeAll(async () => {
    db = createDb()
    const mk = async (n: string) => {
      const p = await schoolsRepository.provision(db, { name: `Perm School ${n} ${tag}`, code: `pm-${n}-${tag}`, board: 'CBSE', adminName: `Admin ${n}`, adminEmail: `pm-${n}-${tag}@school.test` })
      userIds.push(p.adminUserId)
      const sc = await loadSchoolScope(db, p.adminUserId, p.school.id, ['school_admin'])
      if (!sc.ok) throw new Error('scope')
      await acceptSchoolTerms(db, sc.scope)
      const cls = await createClass(db, sc.scope, 7, YEAR)
      const sec = await createSection(db, sc.scope, cls.id, 'A')
      return { id: p.school.id, scope: sc.scope, section: sec.id }
    }
    const a = await mk('a')
    const b = await mk('b')
    schoolA = a.id
    schoolB = b.id
    adminA = a.scope
    adminB = b.scope
    sectionA = a.section
    sectionB = b.section
    const t = await createSchoolTeacher(db, adminA, { name: 'Teach A', email: `tp-${tag}@school.test` })
    households.push(t.user.household_id)
    userIds.push(t.user.id)
    const ts = await loadSchoolScope(db, t.user.id, schoolA, ['teacher'])
    if (!ts.ok) throw new Error('scope')
    teacherA = ts.scope
  })

  afterAll(async () => {
    const ids = [schoolA, schoolB]
    await deleteTestCredentials(userIds)
    for (const t of ['school_message_events', 'school_messages', 'school_parent_messaging', 'school_import_batches'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await db.deleteFrom('audit_log').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_student_guardians').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_students').where('school_id', 'in', ids).execute()
    await db.deleteFrom('students').where('school_id', 'in', ids).execute()
    for (const t of ['school_teacher_assignments', 'school_subjects', 'school_sections', 'school_classes'] as const)
      await db.deleteFrom(t).where('school_id', 'in', ids).execute()
    await deleteSchoolTermsForTest(db, ids)
    const members = await db.selectFrom('school_members').select('user_id').where('school_id', 'in', ids).execute()
    await db.deleteFrom('school_members').where('school_id', 'in', ids).execute()
    const sh = await db.selectFrom('schools').select('household_id').where('id', 'in', ids).execute()
    await db.deleteFrom('schools').where('id', 'in', ids).execute()
    const mu = members.map((m) => m.user_id)
    const hh = mu.length ? await db.selectFrom('users').select('household_id').where('id', 'in', mu).execute() : []
    if (mu.length) await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...sh.map((h) => h.household_id), ...hh.map((h) => h.household_id), ...households]).execute()
    await db.destroy()
  })

  it('the sample file has the two new columns and says empty means no', async () => {
    const { bytes } = await buildRosterTemplate(db, adminA, 'students')
    const text = bytes.toString('latin1')
    expect(text.length).toBeGreaterThan(0)
    const { default: ExcelJS } = await import('exceljs')
    const wb = new ExcelJS.Workbook()
    await wb.xlsx.load(bytes as unknown as ArrayBuffer)
    const header = (wb.worksheets[0].getRow(1).values as Array<string>).filter(Boolean)
    expect(header).toEqual(expect.arrayContaining(['Parent WhatsApp OK', 'Parent Language']))
    const how: Array<string> = []
    wb.getWorksheet('How to fill')!.eachRow((r) => how.push(String(r.getCell(2).value)))
    expect(how.join(' ')).toMatch(/empty means no/i)
  })

  it('a file without the columns leaves every parent at NO (the default)', async () => {
    const dry = await dryRunRosterImport(db, adminA, {
      kind: 'students',
      academicYear: YEAR,
      fileName: 'r.csv',
      bytes: csv(['Name,Class,Section,Roll No,Parent Phone', `Plain Student,7,A,1,${PHONE}`]),
    })
    expect(dry.counts).toMatchObject({ new: 1, errors: 0 })
    await commitRosterImport(db, adminA, dry.batchId)
    const p = await perm(adminA, 'Plain Student')
    expect(p).toMatchObject({ whatsappOk: false, language: 'en', hasPhone: true, confirmedAt: null, optedOutAt: null })
  })

  it('yes records who confirmed and when; the language is kept', async () => {
    const dry = await upload(adminA, [`Yes Student,7,A,2,${PHONE},yes,Telugu`])
    expect(dry.counts).toMatchObject({ new: 1, errors: 0 })
    await commitRosterImport(db, adminA, dry.batchId)
    const p = await perm(adminA, 'Yes Student')
    expect(p).toMatchObject({ whatsappOk: true, language: 'te', confirmedBy: 'Admin a', optedOutAt: null })
    expect(p.confirmedAt).not.toBeNull()
    const audit = await db.selectFrom('audit_log').select('action').where('school_id', '=', schoolA).where('action', '=', 'school.parent_messaging_set').execute()
    expect(audit.length).toBeGreaterThan(0)
  })

  it('yes with no parent phone, or an unreadable cell, is refused with a plain sentence', async () => {
    const dry = await upload(adminA, ['No Phone,7,A,3,,yes,English', `Maybe,7,A,4,${PHONE},maybe,English`, `Hindi,7,A,5,${PHONE},no,Hindi`])
    expect(dry.counts.errors).toBe(3)
    expect(dry.committable).toBe(false)
  })

  it('uploading the same file again changes nothing; changing a cell is an update, not a new student', async () => {
    const same = await upload(adminA, [`Yes Student,7,A,2,${PHONE},yes,Telugu`])
    expect(same.counts).toMatchObject({ new: 0, unchanged: 1, update: 0 })
    const off = await upload(adminA, [`Yes Student,7,A,2,${PHONE},no,Telugu`])
    expect(off.counts).toMatchObject({ new: 0, update: 1, errors: 0 })
    expect(off.committable).toBe(true)
    await commitRosterImport(db, adminA, off.batchId)
    expect(await perm(adminA, 'Yes Student')).toMatchObject({ whatsappOk: false, language: 'te' })
    const back = await upload(adminA, [`Yes Student,7,A,2,${PHONE},yes,Telugu`])
    await commitRosterImport(db, adminA, back.batchId)
    expect(await perm(adminA, 'Yes Student')).toMatchObject({ whatsappOk: true })
    const students = await db.selectFrom('school_students').select('id').where('school_id', '=', schoolA).execute()
    expect(students).toHaveLength(2)
  })

  it('only the office can set a permission, and never for another school\'s student', async () => {
    const mine = (await perm(adminA, 'Plain Student')).studentId
    await expect(setParentPermission(db, teacherA, mine, { whatsappOk: true }, 'admin')).rejects.toBeInstanceOf(SchoolError)
    await expect(listPermissions(db, teacherA)).rejects.toBeInstanceOf(SchoolError)
    await expect(setParentPermission(db, adminB, mine, { whatsappOk: true }, 'admin')).rejects.toMatchObject({ code: 'not_found' })
    expect((await listPermissions(db, adminB)).map((r) => r.name)).not.toContain('Plain Student')
  })

  it('a parent with no phone number cannot be switched on', async () => {
    const s = await createSchoolStudent(db, adminA, { name: 'No Number', grade: 7, sectionId: sectionA, sectionName: 'A', rollNo: '9', admissionNo: null, guardianPhone: null, guardianName: null })
    households.push(s.user.household_id)
    userIds.push(s.user.id)
    await expect(setParentPermission(db, adminA, s.schoolStudent.id, { whatsappOk: true }, 'admin')).rejects.toMatchObject({ code: 'invalid' })
  })

  // ---------------------------------------------------------------- STOP
  it('STOP opts the number out in EVERY school, cancels queued messages and is logged in each school', async () => {
    // school B has a student whose parent has the SAME phone number
    const dry = await dryRunRosterImport(db, adminB, {
      kind: 'students',
      academicYear: YEAR,
      fileName: 'b.csv',
      bytes: csv([HEAD, `Sibling B,7,A,1,${PHONE},yes,English`]),
    })
    await commitRosterImport(db, adminB, dry.batchId)
    const yes = await perm(adminA, 'Yes Student')
    const g = await db.selectFrom('school_student_guardians').select('id').where('school_id', '=', schoolA).where('school_student_id', '=', yes.studentId).executeTakeFirstOrThrow()
    const vars = Object.fromEntries(queueVars(templateDef('weekly_focus')).map((v) => [v, 'x']))
    const queued = await enqueueMessage(db, { schoolId: schoolA, template: 'weekly_focus', language: 'te', studentId: yes.studentId, guardianId: g.id, variables: vars, dedupeKey: `stop-${tag}` })
    expect(queued).not.toBeNull()

    expect(await isPhoneOptedOut(db, E164)).toBe(false)
    const covered = await recordStopReply(db, E164)
    expect(covered).toBeGreaterThanOrEqual(3) // Plain Student + Yes Student in A, Sibling B in B

    expect(await perm(adminA, 'Yes Student')).toMatchObject({ whatsappOk: false, optedOutHow: 'stop_reply' })
    expect(await perm(adminB, 'Sibling B')).toMatchObject({ whatsappOk: false, optedOutHow: 'stop_reply' })
    expect((await perm(adminB, 'Sibling B')).optedOutAt).not.toBeNull()
    expect(await isPhoneOptedOut(db, E164)).toBe(true)
    const m = await db.selectFrom('school_messages').select(['status', 'reason']).where('id', '=', queued!).executeTakeFirstOrThrow()
    expect(m).toEqual({ status: 'skipped', reason: 'parent_opted_out' })
    for (const sid of [schoolA, schoolB]) {
      const a = await db.selectFrom('audit_log').select('action').where('school_id', '=', sid).where('action', '=', 'school.parent_opted_out').execute()
      expect(a.length).toBeGreaterThan(0)
    }
    // a second STOP is harmless and covers nobody new
    expect(await recordStopReply(db, E164)).toBe(0)
    expect(await recordStopReply(db, '+910000099999')).toBe(0)
  })

  it('a roster file can NEVER switch an opted-out parent back on, for an old or a new student', async () => {
    const again = await upload(adminA, [`Yes Student,7,A,2,${PHONE},yes,Telugu`])
    expect(again.counts).toMatchObject({ errors: 0, update: 0, unchanged: 1 })
    expect(again.rows[0].message).toMatch(/replied STOP/)
    expect(again.committable).toBe(false)
    expect((await perm(adminA, 'Yes Student')).whatsappOk).toBe(false)
    const fresh = await upload(adminA, [`Brand New,7,A,20,${PHONE},yes,English`])
    expect(fresh.rows.find((r) => r.status === 'new')?.message).toMatch(/replied STOP/)
    await commitRosterImport(db, adminA, fresh.batchId)
    expect(await perm(adminA, 'Brand New')).toMatchObject({ whatsappOk: false })
  })

  it('the same guard holds at commit time: a roster-origin yes for a stopped number is blocked, not applied', async () => {
    const id = (await perm(adminA, 'Brand New')).studentId
    expect(await setParentPermission(db, adminA, id, { whatsappOk: true }, 'roster')).toBe('blocked_stop')
    expect((await perm(adminA, 'Brand New')).whatsappOk).toBe(false)
  })

  it('the office can switch her back on only by confirming the parent asked again, and it is logged', async () => {
    const id = (await perm(adminA, 'Yes Student')).studentId
    await expect(setParentPermission(db, adminA, id, { whatsappOk: true }, 'admin')).rejects.toMatchObject({ code: 'conflict' })
    expect((await perm(adminA, 'Yes Student')).whatsappOk).toBe(false)
    expect(await setParentPermission(db, adminA, id, { whatsappOk: true, reenableAfterStop: true }, 'admin')).toBe('updated')
    const p = await perm(adminA, 'Yes Student')
    expect(p).toMatchObject({ whatsappOk: true, optedOutAt: null, confirmedBy: 'Admin a' })
    const log = await db.selectFrom('audit_log').select('after').where('school_id', '=', schoolA).where('entity_id', '=', id).where('action', '=', 'school.parent_messaging_set').orderBy('created_at', 'desc').executeTakeFirstOrThrow()
    expect(JSON.stringify(log.after)).toContain('reenabled_after_stop')
    expect(sectionB.length).toBeGreaterThan(0)
  })
})
