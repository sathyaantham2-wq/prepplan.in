/**
 * Creates a school and its first admin (PrepPlan for Schools, platform step run by the owner;
 * there is deliberately no web route for this).
 *
 *   npm run schools:provision:test -- --name "Sample School" --code sample-school \
 *       --admin-name "Asha Rao" --admin-email asha@sample.school [--board CBSE] [--city Hyderabad]
 *
 * LOCAL / TEST DATABASE ONLY. It refuses to run unless DATABASE_URL points at this machine, and
 * there is no override flag: running it against production needs the owner's explicit, separate
 * approval and a change to this file (owner decision 2026-10-29).
 *
 * The admin is created without credentials; the credentials step (S2c) issues the one-time link.
 * The school's terms are NOT accepted here: the admin must accept them before adding students.
 */
import { createDb } from '../src/db/connection'
import { schoolsRepository } from '../src/db/repositories'

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
    console.log(
      'No credentials yet. The admin must accept the school terms before adding students.',
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
