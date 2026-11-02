import type { Db } from '../../../db/connection'
import type { SchoolScope } from '../../../db/school-scope'
import { SchoolError, assertAdmin, auditSchool, auditSchoolEvent } from '../common'

// The parent's WhatsApp contact permission (plan section 2). Default NO. A yes needs a parent phone on file and
// records who confirmed it and when. A STOP reply opts the number out everywhere and only the school admin can
// switch it back on, on purpose, with the parent's re-confirmation (the admin states it). A roster upload can set
// yes or no but can never undo a STOP. Nothing here sends a message.

export type ParentLang = 'en' | 'te'

export interface PermissionChange {
  /** true = parent said yes, false = no. Omit to leave as it is. */
  whatsappOk?: boolean
  language?: ParentLang
  /** The admin confirms the parent asked to be messaged again after a STOP. Only the admin screen sets this. */
  reenableAfterStop?: boolean
}

export async function guardianPhoneOf(db: Db, schoolId: string, studentId: string): Promise<string | null> {
  const g = await db
    .selectFrom('school_student_guardians')
    .select('phone_e164')
    .where('school_id', '=', schoolId)
    .where('school_student_id', '=', studentId)
    .orderBy('created_at')
    .executeTakeFirst()
  return g?.phone_e164 ?? null
}

/** True when ANY guardian row in ANY school with this number has been opted out (STOP). Protective only; it reveals nothing. */
export async function isPhoneOptedOut(db: Db, phone: string): Promise<boolean> {
  const hit = await db
    .selectFrom('school_parent_messaging as pm')
    .innerJoin('school_student_guardians as g', (j) =>
      j.onRef('g.school_id', '=', 'pm.school_id').onRef('g.school_student_id', '=', 'pm.school_student_id'),
    )
    .select('pm.id')
    .where('g.phone_e164', '=', phone)
    .where('pm.opted_out_at', 'is not', null)
    .executeTakeFirst()
  return hit !== undefined
}

/** Which of these numbers have replied STOP (in any school). */
export async function optedOutPhones(db: Db, phones: ReadonlyArray<string>): Promise<Set<string>> {
  if (phones.length === 0) return new Set()
  const rows = await db
    .selectFrom('school_parent_messaging as pm')
    .innerJoin('school_student_guardians as g', (j) =>
      j.onRef('g.school_id', '=', 'pm.school_id').onRef('g.school_student_id', '=', 'pm.school_student_id'),
    )
    .select('g.phone_e164')
    .where('g.phone_e164', 'in', [...new Set(phones)])
    .where('pm.opted_out_at', 'is not', null)
    .execute()
  return new Set(rows.map((r) => r.phone_e164))
}

/**
 * Sets one student's permission and/or language. Returns what it did: 'unchanged', 'updated', or 'blocked_stop'
 * (a roster tried to switch an opted-out parent back on; nothing was changed).
 */
export async function setParentPermission(
  db: Db,
  scope: SchoolScope,
  studentId: string,
  change: PermissionChange,
  via: 'roster' | 'admin',
  now = new Date(),
): Promise<'unchanged' | 'updated' | 'blocked_stop'> {
  assertAdmin(scope)
  const student = await db
    .selectFrom('school_students')
    .select('id')
    .where('school_id', '=', scope.schoolId)
    .where('id', '=', studentId)
    .executeTakeFirst()
  if (!student) throw new SchoolError('not_found', 'That student is not in this school.')
  const row = await db
    .selectFrom('school_parent_messaging')
    .selectAll()
    .where('school_id', '=', scope.schoolId)
    .where('school_student_id', '=', studentId)
    .executeTakeFirst()
  const phone = await guardianPhoneOf(db, scope.schoolId, studentId)
  const stopped = row?.opted_out_at != null || (phone !== null && (await isPhoneOptedOut(db, phone)))
  let turnOn = change.whatsappOk === true && !(row?.whatsapp_ok ?? false)
  if (change.whatsappOk === true) {
    if (!phone) throw new SchoolError('invalid', 'Add a parent phone number first; there is no number to message.')
    if (stopped && !(via === 'admin' && change.reenableAfterStop === true)) {
      // the parent said STOP: only the admin, stating the parent asked again, can undo it
      if (via === 'roster') return 'blocked_stop'
      throw new SchoolError('conflict', 'This parent replied STOP. Confirm that the parent asked to be messaged again to switch it back on.')
    }
    if (stopped) turnOn = true
  }
  const nextOk = change.whatsappOk ?? row?.whatsapp_ok ?? false
  const nextLang = change.language ?? (row?.language as ParentLang | undefined) ?? 'en'
  const changed = !row
    ? nextOk || nextLang !== 'en'
    : nextOk !== row.whatsapp_ok || nextLang !== row.language || (stopped && change.whatsappOk === true)
  if (!changed) return 'unchanged'
  const values = {
    whatsapp_ok: nextOk,
    language: nextLang,
    ...(turnOn ? { confirmed_by_user_id: scope.userId, confirmed_at: now } : {}),
    ...(stopped && change.whatsappOk === true ? { opted_out_at: null, opted_out_how: null } : {}),
    updated_at: now,
  }
  if (row)
    await db.updateTable('school_parent_messaging').set(values).where('school_id', '=', scope.schoolId).where('id', '=', row.id).execute()
  else
    await db.insertInto('school_parent_messaging').values({ school_id: scope.schoolId, school_student_id: studentId, ...values }).execute()
  await auditSchool(db, scope, 'school.parent_messaging_set', 'school_parent_messaging', studentId, row ? { whatsapp_ok: row.whatsapp_ok, language: row.language, opted_out: row.opted_out_at !== null } : null, { whatsapp_ok: nextOk, language: nextLang, via, reenabled_after_stop: stopped && change.whatsappOk === true })
  return 'updated'
}

/**
 * A STOP reply from a phone number (plan section 4, decision D8): every guardian row with this number, in every
 * school, is marked opted out; queued or held parent messages to it are cancelled; each affected school gets an
 * audit entry. Deliberately not school-scoped: opting out protects the parent and exposes nothing.
 * Returns how many students it covered.
 */
export async function recordStopReply(db: Db, phone: string, now = new Date()): Promise<number> {
  const guardians = await db
    .selectFrom('school_student_guardians')
    .select(['id', 'school_id', 'school_student_id'])
    .where('phone_e164', '=', phone)
    .execute()
  let covered = 0
  for (const g of guardians) {
    const existing = await db
      .selectFrom('school_parent_messaging')
      .select(['id', 'opted_out_at'])
      .where('school_id', '=', g.school_id)
      .where('school_student_id', '=', g.school_student_id)
      .executeTakeFirst()
    if (existing?.opted_out_at) continue
    if (existing)
      await db
        .updateTable('school_parent_messaging')
        .set({ whatsapp_ok: false, opted_out_at: now, opted_out_how: 'stop_reply', updated_at: now })
        .where('school_id', '=', g.school_id)
        .where('id', '=', existing.id)
        .execute()
    else
      await db
        .insertInto('school_parent_messaging')
        .values({ school_id: g.school_id, school_student_id: g.school_student_id, whatsapp_ok: false, opted_out_at: now, opted_out_how: 'stop_reply', updated_at: now })
        .execute()
    const pending = await db
      .selectFrom('school_messages')
      .select('id')
      .where('school_id', '=', g.school_id)
      .where('recipient_guardian_id', '=', g.id)
      .where('status', 'in', ['queued', 'held'])
      .execute()
    for (const m of pending) {
      await db
        .updateTable('school_messages')
        .set({ status: 'skipped', reason: 'parent_opted_out' })
        .where('school_id', '=', g.school_id)
        .where('id', '=', m.id)
        .execute()
      await db
        .insertInto('school_message_events')
        .values({ school_id: g.school_id, message_id: m.id, status: 'skipped', detail: 'parent_opted_out' })
        .execute()
    }
    await auditSchoolEvent(db, {
      schoolId: g.school_id,
      actorUserId: null,
      action: 'school.parent_opted_out',
      entity: 'school_parent_messaging',
      entityId: g.school_student_id,
      before: null,
      after: { how: 'stop_reply', cancelled: pending.length },
    })
    covered += 1
  }
  return covered
}

export interface PermissionRow {
  studentId: string
  name: string
  grade: number
  sectionId: string
  sectionName: string
  rollNo: string
  hasPhone: boolean
  whatsappOk: boolean
  language: ParentLang
  confirmedBy: string | null
  confirmedAt: string | null
  optedOutAt: string | null
  optedOutHow: string | null
}

/** Every active student with her parent's permission status (office only). */
export async function listPermissions(db: Db, scope: SchoolScope): Promise<Array<PermissionRow>> {
  assertAdmin(scope)
  const rows = await db
    .selectFrom('school_students as s')
    .innerJoin('school_members as m', 'm.id', 's.member_id')
    .innerJoin('users as u', 'u.id', 'm.user_id')
    .innerJoin('school_sections as sec', 'sec.id', 's.section_id')
    .innerJoin('school_classes as c', 'c.id', 'sec.class_id')
    .leftJoin('school_parent_messaging as pm', (j) =>
      j.onRef('pm.school_id', '=', 's.school_id').onRef('pm.school_student_id', '=', 's.id'),
    )
    .leftJoin('users as cu', 'cu.id', 'pm.confirmed_by_user_id')
    .select([
      's.id', 'u.name', 'c.grade', 'sec.id as section_id', 'sec.name as section', 's.roll_no',
      'pm.whatsapp_ok', 'pm.language', 'pm.confirmed_at', 'pm.opted_out_at', 'pm.opted_out_how', 'cu.name as confirmed_by',
    ])
    .where('s.school_id', '=', scope.schoolId)
    .where('s.status', '=', 'active')
    .execute()
  const phones = new Set(
    (await db.selectFrom('school_student_guardians').select('school_student_id').where('school_id', '=', scope.schoolId).execute()).map((g) => g.school_student_id),
  )
  return rows
    .map((r) => ({
      studentId: r.id,
      name: r.name,
      grade: r.grade,
      sectionId: r.section_id,
      sectionName: r.section,
      rollNo: r.roll_no,
      hasPhone: phones.has(r.id),
      whatsappOk: r.whatsapp_ok ?? false,
      language: (r.language ?? 'en') as ParentLang,
      confirmedBy: r.confirmed_by,
      confirmedAt: r.confirmed_at ? r.confirmed_at.toISOString() : null,
      optedOutAt: r.opted_out_at ? r.opted_out_at.toISOString() : null,
      optedOutHow: r.opted_out_how,
    }))
    .sort((a, b) => a.grade - b.grade || a.sectionName.localeCompare(b.sectionName) || a.rollNo.localeCompare(b.rollNo, undefined, { numeric: true }))
}
