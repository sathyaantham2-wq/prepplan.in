/**
 * Creates a school and its first admin (PrepPlan for Schools, platform step run by the owner;
 * there is deliberately no web route for this).
 *
 *   npm run schools:provision:test -- --name "Sample School" --code sample-school \
 *       --admin-name "Asha Rao" --admin-email asha@sample.school [--board CBSE] [--city Hyderabad]
 *
 *   A DEMO school (one Class 7 section, 30 invented students, a demo teacher, a small AI spend cap):
 *   npm run schools:provision:test -- --demo --name "PrepPlan Demo School" --code demo-school \
 *       --admin-name "Demo Office" --admin-email office@demo.example --teacher-name "Demo Teacher" \
 *       --teacher-email teacher@demo.example \
 *       [--subjects MATH,SCI,SST]
 *
 * LOCAL / TEST DATABASE ONLY. It refuses to run unless DATABASE_URL points at this machine, and
 * there is no override flag: running it against production needs the owner's explicit, separate
 * approval and a change to this file (owner decision 2026-10-29).
 *
 * It prints a one-time code (works once, 7 days) for the admin to choose a password with.
 * The school terms are NOT accepted here: the admin must accept them before adding students.
 */
import { createDb } from '../src/db/connection'
import { schoolsRepository } from '../src/db/repositories'
import { issueFirstAdminCode } from '../src/lib/schools/credentials'
import { provisionDemoSchool } from '../src/lib/schools/demo-provision'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

export function assertLocalDatabase(url: string | undefined): void {
  let host = ''
  try {
    host = new URL(url ?? '').hostname.replace(/^\[|\]$/g, '')
  } catch {
    // fall through to the refusal below
  }
  if (!LOCAL_HOSTS.has(host)) {
    throw new Error(
      `Refusing to provision a school on database host "${host || '(unparseable)'}": local databases only.`,
    )
  }
}

async function main() {
  assertLocalDatabase(process.env.DATABASE_URL)
  const name = arg('name')
  const code = arg('code')
  const adminName = arg('admin-name')
  const adminEmail = arg('admin-email')
  if (!name || !code || !adminName || !adminEmail) {
    throw new Error(
      'Usage: --name --code --admin-name --admin-email [--board CBSE] [--city ...]',
    )
  }
  if (!/^[a-z0-9][a-z0-9-]{2,40}$/.test(code)) {
    throw new Error(
      '--code must be 3-41 characters: lower-case letters, digits and hyphens.',
    )
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail))
    throw new Error('--admin-email is not a valid address.')
  const db = createDb()
  try {
    if (process.argv.includes('--demo')) {
      const teacherName = arg('teacher-name')
      const teacherEmail = arg('teacher-email')
      if (!teacherName || !teacherEmail)
        throw new Error('--demo also needs --teacher-name and --teacher-email.')
      const demo = await provisionDemoSchool(db, {
        name,
        code,
        adminName,
        adminEmail,
        teacherName,
        teacherEmail,
      })
      console.log(
        `DEMO school ${demo.schoolId} (${code}) created: Class 7 section A, 30 invented students, ${demo.subjects} subjects.`,
      )
      console.log(
        `Office sign-in: ${adminEmail} with one-time code ${demo.adminCode}`,
      )
      console.log(
        `Teacher sign-in: ${teacherEmail} with one-time code ${demo.teacherCode}`,
      )
      console.log(
        'Each code works once and expires in 7 days. There is no public sign-up for the demo.',
      )
      return
    }
    const result = await schoolsRepository.provision(db, {
      name,
      code,
      board: arg('board') ?? 'CBSE',
      city: arg('city'),
      adminName,
      adminEmail,
    })
    console.log(
      `school ${result.school.id} (${code}) created; admin user ${result.adminUserId}`,
    )
    const first = await issueFirstAdminCode(
      db,
      result.school.id,
      result.adminMemberId,
    )
    console.log('')
    console.log(
      `First sign-in for ${adminEmail}: one-time code ${first.code} (works once, expires ${first.expiresAt.toISOString().slice(0, 10)}).`,
    )
    console.log(
      'Give it to the admin on paper; they enter their e-mail and this code to choose a password.',
    )
    console.log(
      'The admin must then accept the school terms before adding students.',
    )
  } finally {
    await db.destroy()
  }
}

// Run only when executed directly, so the guard can be imported by a test.
if (process.argv[1]?.endsWith('provision-school.ts')) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e)
    process.exit(1)
  })
}
