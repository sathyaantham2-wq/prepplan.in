import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb } from '../../db/connection'
import type { Db } from '../../db/connection'
import { schoolsRepository } from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { deleteSchoolTermsForTest, deleteTestCredentials } from '../../db/test-helpers'
import { loadSchoolScope } from '../school-session'
import { createSchoolTeacher } from './people'
import { maskSettings, saveMaskSettings } from './mask-settings'
import { schoolMaskTemplate } from './marking'
import { DEFAULT_MASK } from './mask-template'
import { acceptSchoolTerms } from './terms'

// The school's own name-area mask: who may change it, what is refused, that it is audited and that marking reads it.
// Local test database only.
describe('school mask settings', () => {
  let db: Db
  const tag = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  let schoolId: string
  let admin: SchoolScope
  let teacher: SchoolScope
  const userIds: Array<string> = []
  const households: Array<string> = []

  beforeAll(async () => {
    db = createDb()
    const p = await schoolsRepository.provision(db, { name: `Mask School ${tag}`, code: `mk-${tag}`, board: 'CBSE', adminName: 'Admin', adminEmail: `mk-${tag}@school.test` })
    schoolId = p.school.id
    userIds.push(p.adminUserId)
    const sa = await loadSchoolScope(db, p.adminUserId, schoolId, ['school_admin'])
    if (!sa.ok) throw new Error('scope')
    admin = sa.scope
    await acceptSchoolTerms(db, admin)
    const t = await createSchoolTeacher(db, admin, { name: 'Tara Teacher', email: `tara-${tag}@school.test` })
    households.push(t.user.household_id)
    userIds.push(t.user.id)
    const ts = await loadSchoolScope(db, t.user.id, schoolId, ['teacher'])
    if (!ts.ok) throw new Error('scope')
    teacher = ts.scope
  })

  afterAll(async () => {
    await deleteTestCredentials(userIds)
    await db.deleteFrom('audit_log').where('school_id', '=', schoolId).execute()
    await deleteSchoolTermsForTest(db, [schoolId])
    const mem = await db.selectFrom('school_members').select('user_id').where('school_id', '=', schoolId).execute()
    await db.deleteFrom('school_members').where('school_id', '=', schoolId).execute()
    const sh = await db.selectFrom('schools').select('household_id').where('id', '=', schoolId).execute()
    await db.deleteFrom('schools').where('id', '=', schoolId).execute()
    const mu = mem.map((m) => m.user_id)
    const hh = mu.length ? await db.selectFrom('users').select('household_id').where('id', 'in', mu).execute() : []
    if (mu.length) await db.deleteFrom('users').where('id', 'in', mu).execute()
    await db.deleteFrom('households').where('id', 'in', [...sh.map((h) => h.household_id), ...hh.map((h) => h.household_id), ...households]).execute()
    await db.destroy()
  })

  it('a new school uses the default top strip', async () => {
    expect(await maskSettings(db, admin)).toEqual({ template: DEFAULT_MASK, custom: false })
    expect(await schoolMaskTemplate(db, admin)).toEqual(DEFAULT_MASK)
  })

  it('a teacher can neither see nor change it', async () => {
    await expect(maskSettings(db, teacher)).rejects.toMatchObject({ code: 'forbidden' })
    await expect(saveMaskSettings(db, teacher, { boxes: [], everyPageStrip: true })).rejects.toMatchObject({ code: 'forbidden' })
  })

  it('refuses a box outside the page and leaves the saved template alone', async () => {
    await expect(saveMaskSettings(db, admin, { boxes: [{ x: 0.9, y: 0, w: 0.5, h: 0.1 }], everyPageStrip: false })).rejects.toMatchObject({ code: 'invalid' })
    expect((await maskSettings(db, admin)).custom).toBe(false)
  })

  it('saves the school’s boxes, marking reads them, and the change is audited', async () => {
    const t = { boxes: [{ x: 0.5, y: 0, w: 0.5, h: 0.2 }], everyPageStrip: true }
    await saveMaskSettings(db, admin, t)
    expect(await maskSettings(db, admin)).toEqual({ template: t, custom: true })
    expect(await schoolMaskTemplate(db, admin)).toEqual(t)
    const log = await db.selectFrom('audit_log').select('action').where('school_id', '=', schoolId).where('action', '=', 'school.mask_template').execute()
    expect(log).toHaveLength(1)
  })

  it('going back to the default clears it', async () => {
    await saveMaskSettings(db, admin, null)
    expect(await maskSettings(db, admin)).toEqual({ template: DEFAULT_MASK, custom: false })
  })
})
