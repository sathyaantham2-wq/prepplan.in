import {
  createHmac,
  hkdfSync,
  randomBytes,
  randomInt,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto'
import { hashPassword } from 'better-auth/crypto'
import { UNAMBIGUOUS_ALPHABET } from './alphabet'
import { ADMISSION_NO } from './roster-parse'
import type { Db } from '../../db/connection'
import {
  schoolCredentialCodesRepository,
  schoolLoginRepository,
  schoolSectionsRepository,
} from '../../db/repositories'
import type { SchoolScope } from '../../db/school-scope'
import { auth } from '../auth'
import { buildSchoolCredentialsEmail, sendTransactionalEmail } from '../email'
import type { EmailDelivery } from '../email'
import { env } from '../env'
import {
  SchoolError,
  assertAdmin,
  auditSchool,
  auditSchoolEvent,
} from './common'

// S2c: how school people get a password (owner decisions 2026-10-29).
//   Staff:    a one-time set-password link by e-mail, or a printed one-time code.
//   Students: school code + login id + password. The class teacher prints one-time code slips for
//             the section; the student sets her own password on first sign-in; the class teacher
//             can reset it (audited). No student e-mail is needed.
//   Parents:  no login in Phase 1.
// A code works once and expires after 7 days. Only a keyed hash is stored. Five wrong codes or
// passwords in a row lock the account for 15 minutes. The person sees the same plain message
// whether the school, the id or the secret was wrong.

export const CODE_TTL_DAYS = 7
export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 128
export const BAD_CREDENTIALS =
  'That school code, ID, code or password is not right.'
export const LOCKED_MESSAGE =
  'Too many tries. Try again in 15 minutes, or ask your teacher to reset it.'

function hashKey(): Buffer {
  return Buffer.from(
    hkdfSync(
      'sha256',
      env.BETTER_AUTH_SECRET,
      'prepplan-school',
      'credential-code-v1',
      32,
    ),
  )
}
export function hashCode(code: string): string {
  return createHmac('sha256', hashKey()).update(code).digest('hex')
}
const sameHash = (a: string, b: string) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))

/** A printable code, e.g. K7M2P-9QXAB: 10 characters, about 50 bits. */
export function newSlipCode(): string {
  let c = ''
  for (let i = 0; i < 10; i++)
    c += UNAMBIGUOUS_ALPHABET[randomInt(UNAMBIGUOUS_ALPHABET.length)]
  return `${c.slice(0, 5)}-${c.slice(5)}`
}
export const normaliseSlipCode = (input: string) =>
  input.toUpperCase().replace(/[^A-Z0-9]/g, '')

const expiry = (now: Date) =>
  new Date(now.getTime() + CODE_TTL_DAYS * 24 * 60 * 60 * 1000)

// ---- the student's sign-in ID -----------------------------------------------------------------

/**
 * A student signs in with the school's admission number (or the permanent ID generated for her
 * when the roster had none). It never changes when she is promoted, so slips stay valid year after
 * year. Spaces are ignored and case does not matter.
 */
export function normaliseAdmissionNo(input: string): string | null {
  const id = input.trim().replace(/\s+/g, '').toUpperCase()
  return ADMISSION_NO.test(id) ? id : null
}

// ---- issuing ----------------------------------------------------------------------------------

async function issue(
  db: Db,
  input: {
    schoolId: string
    memberId: string
    kind: 'staff_link' | 'staff_code' | 'student_code'
    createdBy: string | null
  },
  now: Date,
) {
  await schoolCredentialCodesRepository.revokeOpenForMember(
    db,
    input.schoolId,
    input.memberId,
    now,
  )
  const id = randomUUID()
  const secret =
    input.kind === 'staff_link'
      ? randomBytes(32).toString('base64url')
      : newSlipCode()
  const hashed =
    input.kind === 'staff_link' ? secret : normaliseSlipCode(secret)
  const expiresAt = expiry(now)
  await schoolCredentialCodesRepository.insertCode(db, {
    id,
    schoolId: input.schoolId,
    memberId: input.memberId,
    kind: input.kind,
    codeHash: hashCode(hashed),
    expiresAt,
    createdBy: input.createdBy,
  })
  return { id, secret, expiresAt }
}

/** Platform provisioning (the local script): a printed code for a school's first admin. */
export async function issueFirstAdminCode(
  db: Db,
  schoolId: string,
  memberId: string,
  now = new Date(),
) {
  const r = await issue(
    db,
    { schoolId, memberId, kind: 'staff_code', createdBy: null },
    now,
  )
  await auditSchoolEvent(db, {
    schoolId,
    actorUserId: null,
    action: 'school.credentials_issued',
    entity: 'school_members',
    entityId: memberId,
    before: null,
    after: { kind: 'staff_code', by: 'provisioning' },
  })
  return { code: r.secret, expiresAt: r.expiresAt }
}

export type StaffIssueResult =
  | { delivery: 'email'; emailStatus: EmailDelivery; expiresAt: Date }
  | { delivery: 'slip'; code: string; email: string; expiresAt: Date }

/** Admin only. Email: a one-time link (the link itself is never shown to the admin). Slip: a printed code. */
export async function issueStaffCredentials(
  db: Db,
  scope: SchoolScope,
  input: { memberId: string; delivery: 'email' | 'slip' },
  now = new Date(),
): Promise<StaffIssueResult> {
  assertAdmin(scope)
  const staff = await schoolLoginRepository.staffMemberInSchool(
    db,
    scope,
    input.memberId,
  )
  if (!staff) throw new SchoolError('not_found', 'Staff member not found.')
  const school = await db
    .selectFrom('schools')
    .select('name')
    .where('id', '=', scope.schoolId)
    .executeTakeFirstOrThrow()
  if (input.delivery === 'slip') {
    const r = await issue(
      db,
      {
        schoolId: scope.schoolId,
        memberId: staff.member_id,
        kind: 'staff_code',
        createdBy: scope.userId,
      },
      now,
    )
    await auditSchool(
      db,
      scope,
      'school.credentials_issued',
      'school_members',
      staff.member_id,
      null,
      { kind: 'staff_code' },
    )
    return {
      delivery: 'slip',
      code: r.secret,
      email: staff.email,
      expiresAt: r.expiresAt,
    }
  }
  const r = await issue(
    db,
    {
      schoolId: scope.schoolId,
      memberId: staff.member_id,
      kind: 'staff_link',
      createdBy: scope.userId,
    },
    now,
  )
  const link = `${env.BETTER_AUTH_URL}/school/set-password?token=${encodeURIComponent(`${r.id}.${r.secret}`)}`
  const emailStatus = await sendTransactionalEmail(db, {
    userId: staff.user_id,
    template: 'school_credentials',
    content: buildSchoolCredentialsEmail({
      name: staff.name,
      schoolName: school.name,
      link,
    }),
  })
  await auditSchool(
    db,
    scope,
    'school.credentials_issued',
    'school_members',
    staff.member_id,
    null,
    { kind: 'staff_link', email: emailStatus },
  )
  return { delivery: 'email', emailStatus, expiresAt: r.expiresAt }
}

export interface StudentSlip {
  schoolStudentId: string
  name: string
  rollNo: string
  loginId: string
  code: string
  expiresAt: Date
}

async function assertMayHandleStudents(
  db: Db,
  scope: SchoolScope,
  sectionId: string,
) {
  // A section of another school is simply not found, whoever asks.
  if (!(await schoolSectionsRepository.findById(db, scope, sectionId))) {
    throw new SchoolError('not_found', 'Section not found.')
  }
  if (scope.role === 'school_admin') return
  if (
    scope.role === 'teacher' &&
    (await schoolLoginRepository.isClassTeacherOf(db, scope, sectionId))
  )
    return
  throw new SchoolError(
    'forbidden',
    "Only the section's class teacher or the school admin can do this.",
  )
}

/** One-time code slips for a section: its class teacher (or the admin). Students who already set a password are skipped. */
export async function issueStudentSlips(
  db: Db,
  scope: SchoolScope,
  sectionId: string,
  options: { includeActivated?: boolean } = {},
  now = new Date(),
): Promise<Array<StudentSlip>> {
  await assertMayHandleStudents(db, scope, sectionId)
  const students = await schoolLoginRepository.studentsForSlips(
    db,
    scope,
    sectionId,
    options.includeActivated ?? false,
  )
  const slips: Array<StudentSlip> = []
  await db.transaction().execute(async (trx) => {
    for (const s of students) {
      const r = await issue(
        trx,
        {
          schoolId: scope.schoolId,
          memberId: s.member_id,
          kind: 'student_code',
          createdBy: scope.userId,
        },
        now,
      )
      slips.push({
        schoolStudentId: s.school_student_id,
        name: s.name,
        rollNo: s.roll_no,
        loginId: s.admission_no,
        code: r.secret,
        expiresAt: r.expiresAt,
      })
    }
    await auditSchool(
      trx,
      scope,
      'school.student_slips_issued',
      'school_sections',
      sectionId,
      null,
      { count: slips.length },
    )
  })
  return slips
}

/** Class teacher (or admin): the old password stops working at once, sessions end, a new code is issued. Logged. */
export async function resetStudentPassword(
  db: Db,
  scope: SchoolScope,
  schoolStudentId: string,
  now = new Date(),
): Promise<StudentSlip> {
  const s = await schoolLoginRepository.studentById(db, scope, schoolStudentId)
  if (!s) throw new SchoolError('not_found', 'Student not found.')
  await assertMayHandleStudents(db, scope, s.section_id)
  let slip!: StudentSlip
  await db.transaction().execute(async (trx) => {
    await schoolLoginRepository.clearPassword(trx, s.user_id)
    await schoolLoginRepository.expireSessions(trx, s.user_id, now)
    await schoolLoginRepository.clearFailures(trx, s.member_id)
    const r = await issue(
      trx,
      {
        schoolId: scope.schoolId,
        memberId: s.member_id,
        kind: 'student_code',
        createdBy: scope.userId,
      },
      now,
    )
    slip = {
      schoolStudentId: s.school_student_id,
      name: s.name,
      rollNo: s.roll_no,
      loginId: s.admission_no,
      code: r.secret,
      expiresAt: r.expiresAt,
    }
    // The code itself is never written to the log.
    await auditSchool(
      trx,
      scope,
      'school.student_password_reset',
      'school_students',
      s.school_student_id,
      null,
      { by_role: scope.role },
    )
  })
  return slip
}

// ---- activating and signing in ---------------------------------------------------------------

export type SignInResult =
  | { ok: true; setCookies: Array<string> }
  | { ok: false; reason: 'bad_credentials' | 'locked' | 'weak_password' }

export function checkPassword(pw: string): boolean {
  return pw.length >= MIN_PASSWORD_LENGTH && pw.length <= MAX_PASSWORD_LENGTH
}

export async function signInUser(
  email: string,
  password: string,
): Promise<{ ok: true; setCookies: Array<string> } | { ok: false }> {
  try {
    const res = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    })
    if (!res.ok) return { ok: false }
    return { ok: true, setCookies: res.headers.getSetCookie() }
  } catch {
    return { ok: false }
  }
}

interface LoginTarget {
  memberId: string
  schoolId: string
  userId: string
  email: string
  locked: boolean
}

async function resolveStudent(
  db: Db,
  schoolCode: string,
  loginId: string,
  now: Date,
): Promise<LoginTarget | null> {
  const school = await schoolLoginRepository.findActiveSchoolByCode(
    db,
    schoolCode,
  )
  const admissionNo = normaliseAdmissionNo(loginId)
  if (!school || !admissionNo) return null
  const r = await schoolLoginRepository.findStudentByAdmission(
    db,
    school.id,
    admissionNo,
  )
  if (!r?.is_active) return null
  return {
    memberId: r.member_id,
    schoolId: school.id,
    userId: r.user_id,
    email: r.email,
    locked: schoolLoginRepository.isLocked(r, now),
  }
}

/** First sign-in of a student: school code + login id + the slip code + a password she chooses. */
export async function activateStudent(
  db: Db,
  input: {
    schoolCode: string
    loginId: string
    code: string
    newPassword: string
  },
  now = new Date(),
): Promise<SignInResult> {
  const t = await resolveStudent(db, input.schoolCode, input.loginId, now)
  if (!t) return { ok: false, reason: 'bad_credentials' }
  if (t.locked) return { ok: false, reason: 'locked' }
  const wanted = hashCode(normaliseSlipCode(input.code))
  const open = await schoolCredentialCodesRepository.openForMember(
    db,
    t.schoolId,
    t.memberId,
    now,
  )
  const match = open.find(
    (c) => c.kind === 'student_code' && sameHash(c.code_hash, wanted),
  )
  if (!match) {
    await schoolLoginRepository.registerFailure(db, t.memberId, now)
    return { ok: false, reason: 'bad_credentials' }
  }
  if (!checkPassword(input.newPassword))
    return { ok: false, reason: 'weak_password' }
  return finishActivation(db, t, match.id, match.kind, input.newPassword, now)
}

async function finishActivation(
  db: Db,
  t: LoginTarget,
  codeId: string,
  kind: string,
  newPassword: string,
  now: Date,
): Promise<SignInResult> {
  const hash = await hashPassword(newPassword)
  const used = await db.transaction().execute(async (trx) => {
    if (!(await schoolCredentialCodesRepository.markUsed(trx, codeId, now)))
      return false // used twice at once
    await schoolLoginRepository.setPassword(trx, t.userId, hash)
    await schoolLoginRepository.clearFailures(trx, t.memberId)
    await auditSchoolEvent(trx, {
      schoolId: t.schoolId,
      actorUserId: t.userId,
      action: 'school.credentials_activated',
      entity: 'school_members',
      entityId: t.memberId,
      before: null,
      after: { kind },
    })
    return true
  })
  if (!used) return { ok: false, reason: 'bad_credentials' }
  const signed = await signInUser(t.email, newPassword)
  return signed.ok ? signed : { ok: false, reason: 'bad_credentials' }
}

/** Staff opening their e-mailed link: the token is "<code id>.<secret>". */
export async function activateStaffWithToken(
  db: Db,
  input: { token: string; newPassword: string },
  now = new Date(),
): Promise<SignInResult> {
  const [id, secret] = input.token.split('.')
  if (!id || !secret || !/^[0-9a-f-]{36}$/i.test(id))
    return { ok: false, reason: 'bad_credentials' }
  const code = await schoolCredentialCodesRepository.findOpenById(db, id, now)
  if (
    !code ||
    code.kind !== 'staff_link' ||
    !sameHash(code.code_hash, hashCode(secret))
  )
    return { ok: false, reason: 'bad_credentials' }
  const m = await schoolLoginRepository.memberWithUser(db, code.member_id)
  if (!m || m.status !== 'active')
    return { ok: false, reason: 'bad_credentials' }
  if (!checkPassword(input.newPassword))
    return { ok: false, reason: 'weak_password' }
  return finishActivation(
    db,
    {
      memberId: m.member_id,
      schoolId: m.school_id,
      userId: m.user_id,
      email: m.email,
      locked: false,
    },
    code.id,
    code.kind,
    input.newPassword,
    now,
  )
}

/** Staff with a printed code slip: their e-mail address + the code. */
export async function activateStaffWithCode(
  db: Db,
  input: { email: string; code: string; newPassword: string },
  now = new Date(),
): Promise<SignInResult> {
  const members = await schoolLoginRepository.findStaffMembersByEmail(
    db,
    input.email,
  )
  if (members.length === 0) return { ok: false, reason: 'bad_credentials' }
  if (members.some((m) => schoolLoginRepository.isLocked(m, now)))
    return { ok: false, reason: 'locked' }
  const wanted = hashCode(normaliseSlipCode(input.code))
  for (const m of members) {
    const open = await schoolCredentialCodesRepository.openForMember(
      db,
      m.school_id,
      m.member_id,
      now,
    )
    const match = open.find(
      (c) => c.kind === 'staff_code' && sameHash(c.code_hash, wanted),
    )
    if (match) {
      if (!checkPassword(input.newPassword))
        return { ok: false, reason: 'weak_password' }
      return finishActivation(
        db,
        {
          memberId: m.member_id,
          schoolId: m.school_id,
          userId: m.user_id,
          email: m.email,
          locked: false,
        },
        match.id,
        match.kind,
        input.newPassword,
        now,
      )
    }
  }
  for (const m of members)
    await schoolLoginRepository.registerFailure(db, m.member_id, now)
  return { ok: false, reason: 'bad_credentials' }
}

/** Every later student sign-in: school code + login id + password. */
export async function signInStudent(
  db: Db,
  input: { schoolCode: string; loginId: string; password: string },
  now = new Date(),
): Promise<SignInResult> {
  const t = await resolveStudent(db, input.schoolCode, input.loginId, now)
  if (!t) return { ok: false, reason: 'bad_credentials' }
  if (t.locked) return { ok: false, reason: 'locked' }
  const signed = await signInUser(t.email, input.password)
  if (!signed.ok) {
    await schoolLoginRepository.registerFailure(db, t.memberId, now)
    return { ok: false, reason: 'bad_credentials' }
  }
  await schoolLoginRepository.clearFailures(db, t.memberId)
  return signed
}
