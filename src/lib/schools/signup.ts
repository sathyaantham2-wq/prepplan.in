import type { Db } from '../../db/connection'
import {
  existingUserEmails,
  schoolLoginRepository,
  schoolsRepository,
} from '../../db/repositories'
import { hashPassword } from 'better-auth/crypto'
import { SchoolError, auditSchoolEvent } from './common'
import { checkPassword, signInUser } from './credentials'
import type { SignInResult } from './credentials'

// A school starts itself (owner decision 2026-10-29): the person who creates the school becomes its
// office admin. No e-mail confirmation and no approval: the account is active at once. Everything
// else about a school still works as before: students and teachers are created by the school, never
// by themselves.
//
// What stands between this and abuse is deliberately small and honest:
//  - a hidden "website" field that a person never fills in (a form-filling robot does),
//  - a brake on how many schools can start per hour and per day, for the whole platform,
//  - an e-mail that already belongs to a PrepPlan student or parent account is refused (a school
//    login is never joined to a personal one),
//  - the terms are accepted in the set-up wizard before any student can be added.

export interface SignUpLimits {
  perHour: number
  perDay: number
}
/** Ten schools an hour and forty a day for the whole platform; SCHOOL_SIGNUP_MAX_PER_HOUR / _PER_DAY change it. */
export function signUpLimits(
  env: Record<string, string | undefined> = process.env,
): SignUpLimits {
  const n = (v: string | undefined, d: number) =>
    v && Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : d
  return {
    perHour: n(env.SCHOOL_SIGNUP_MAX_PER_HOUR, 10),
    perDay: n(env.SCHOOL_SIGNUP_MAX_PER_DAY, 40),
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** A short, readable, unique-looking school code from its name: "Greenfield Public School" -> "greenfield-public-school-k7m2". */
export function schoolCodeFor(
  name: string,
  random: () => number = Math.random,
): string {
  const base =
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 28)
      .replace(/-+$/g, '') || 'school'
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789'
  let tail = ''
  for (let i = 0; i < 4; i++)
    tail += alphabet[Math.floor(random() * alphabet.length)]
  return `${base}-${tail}`
}

export interface SignUpInput {
  schoolName: string
  city: string
  yourName: string
  email: string
  password: string
  /** The hidden field: a person leaves it empty. */
  website: string
}

export type SignUpResult =
  | { ok: true; schoolId: string; setCookies: Array<string> }
  | { ok: false; status: number; message: string }

/** How many schools were started lately (demo schools do not count). */
async function startedSince(db: Db, since: Date): Promise<number> {
  const r = await db
    .selectFrom('schools')
    .select((eb) => eb.fn.countAll<string>().as('n'))
    .where('is_demo', '=', false)
    .where('created_at', '>=', since)
    .executeTakeFirstOrThrow()
  return Number(r.n)
}

export async function startedTooMany(
  db: Db,
  now = new Date(),
  limits: SignUpLimits = signUpLimits(),
): Promise<boolean> {
  const hour = await startedSince(db, new Date(now.getTime() - 3600_000))
  if (hour >= limits.perHour) return true
  return (
    (await startedSince(db, new Date(now.getTime() - 86_400_000))) >=
    limits.perDay
  )
}

function checkSchoolFields(
  name: string,
  city: string,
): { name: string; city: string } {
  const n = name.trim()
  if (n.length < 3 || n.length > 120)
    throw new SchoolError(
      'invalid',
      'Please type the name of your school (at least 3 letters).',
    )
  return { name: n, city: city.trim().slice(0, 80) }
}

async function uniqueCode(db: Db, name: string): Promise<string> {
  for (let i = 0; i < 8; i++) {
    const code = schoolCodeFor(name)
    const taken = await db
      .selectFrom('schools')
      .select('id')
      .where('code', '=', code)
      .executeTakeFirst()
    if (!taken) return code
  }
  throw new SchoolError(
    'conflict',
    'We could not make a code for your school. Please try again.',
  )
}

/** The e-mail form: school name, your name, e-mail, password. Signs the new admin in. */
export async function signUpSchoolWithEmail(
  db: Db,
  input: SignUpInput,
  now = new Date(),
  limits: SignUpLimits = signUpLimits(),
): Promise<SignUpResult> {
  const fail = (status: number, message: string): SignUpResult => ({
    ok: false,
    status,
    message,
  })
  if (input.website.trim() !== '')
    return fail(400, 'Something is missing. Check the form and try again.') // a robot
  let school: { name: string; city: string }
  try {
    school = checkSchoolFields(input.schoolName, input.city)
  } catch (e) {
    return fail(400, e instanceof Error ? e.message : 'Check the form.')
  }
  const yourName = input.yourName.trim()
  if (yourName.length < 2 || yourName.length > 80)
    return fail(400, 'Please type your name.')
  const email = input.email.trim().toLowerCase()
  if (!EMAIL.test(email) || email.length > 200)
    return fail(400, 'That e-mail address does not look right.')
  if (!checkPassword(input.password))
    return fail(400, 'Choose a password of at least 8 characters.')
  if (await startedTooMany(db, now, limits))
    return fail(
      429,
      'Too many schools were started just now. Please try again in an hour, or write to support@prepplan.in.',
    )
  if ((await existingUserEmails(db, [email])).size > 0)
    return fail(
      409,
      'That e-mail already has a PrepPlan account. If it is your school account, sign in. A student or parent account cannot also be a school account: use a different e-mail.',
    )

  const code = await uniqueCode(db, school.name)
  const created = await schoolsRepository.provision(db, {
    name: school.name,
    code,
    board: 'CBSE',
    city: school.city || undefined,
    adminName: yourName,
    adminEmail: email,
  })
  await schoolLoginRepository.setPassword(
    db,
    created.adminUserId,
    await hashPassword(input.password),
  )
  await auditSchoolEvent(db, {
    schoolId: created.school.id,
    actorUserId: created.adminUserId,
    action: 'school.signed_up',
    entity: 'schools',
    entityId: created.school.id,
    before: null,
    after: { via: 'email' },
  })
  const signed = await signInUser(email, input.password)
  if (!signed.ok)
    return fail(
      500,
      'Your school was made, but we could not sign you in. Please sign in with your e-mail and password.',
    )
  return {
    ok: true,
    schoolId: created.school.id,
    setCookies: signed.setCookies,
  }
}

/** What a signed-in person may do on the "start a school" screen. */
export type StartState =
  | { state: 'has_school' }
  | { state: 'can_create' }
  | { state: 'personal_account' }

export async function startState(db: Db, userId: string): Promise<StartState> {
  const user = await db
    .selectFrom('users')
    .select('signup_type')
    .where('id', '=', userId)
    .executeTakeFirstOrThrow()
  if (user.signup_type !== 'school') return { state: 'personal_account' }
  const memberships = await schoolLoginRepository.membershipsOf(db, userId)
  return memberships.length > 0
    ? { state: 'has_school' }
    : { state: 'can_create' }
}

/** The Google form: someone who just signed in with Google (a school-type login) names her school. */
export async function createSchoolForSignedInUser(
  db: Db,
  userId: string,
  input: { schoolName: string; city: string },
  now = new Date(),
  limits: SignUpLimits = signUpLimits(),
): Promise<{ schoolId: string }> {
  const s = await startState(db, userId)
  if (s.state === 'personal_account')
    throw new SchoolError(
      'forbidden',
      'This sign-in is a PrepPlan student or parent account. A school needs its own sign-in: use a different Google account or e-mail.',
    )
  if (s.state === 'has_school')
    throw new SchoolError('conflict', 'You already have a school.')
  const school = checkSchoolFields(input.schoolName, input.city)
  if (await startedTooMany(db, now, limits))
    throw new SchoolError(
      'conflict',
      'Too many schools were started just now. Please try again in an hour, or write to support@prepplan.in.',
    )
  const created = await schoolsRepository.provisionForUser(db, {
    userId,
    name: school.name,
    code: await uniqueCode(db, school.name),
    board: 'CBSE',
    city: school.city || undefined,
  })
  await auditSchoolEvent(db, {
    schoolId: created.school.id,
    actorUserId: userId,
    action: 'school.signed_up',
    entity: 'schools',
    entityId: created.school.id,
    before: null,
    after: { via: 'google' },
  })
  return { schoolId: created.school.id }
}

export type { SignInResult }
