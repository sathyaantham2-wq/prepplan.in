/**
 * The owner's approval of a school that started itself (owner decision 2026-10-30). Such a school is
 * a DEMO with the demo AI allowance until this is run; it then has the normal allowance. There is
 * deliberately no web route for this.
 *
 *   Local:      node scripts/with-test-env.mjs npx tsx scripts/approve-school.ts --code greenfield-k7m2
 *   Production: load .env.local, then
 *               npx tsx scripts/approve-school.ts --code greenfield-k7m2 --confirm-code greenfield-k7m2 --production
 *
 * A database that is not on this machine needs both --production and the code typed twice.
 */
import { createDb } from '../src/db/connection'
import { approveSchool } from '../src/lib/schools/signup'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])

function arg(name: string): string | null {
  const i = process.argv.indexOf(`--${name}`)
  const v = i >= 0 ? process.argv[i + 1] : undefined
  return v && !v.startsWith('--') ? v : null
}

async function main() {
  const code = arg('code')
  if (!code) throw new Error('Usage: --code <school code>')
  const host = new URL(process.env.DATABASE_URL ?? 'x://').hostname
  if (
    !LOCAL_HOSTS.has(host) &&
    (!process.argv.includes('--production') || arg('confirm-code') !== code)
  )
    throw new Error(
      'This is not a local database: add --production and --confirm-code with the same code. Nothing was done.',
    )
  const db = createDb()
  try {
    const school = await approveSchool(db, code)
    console.log(`Approved: ${school.name} (${code}). It is no longer a demo.`)
  } finally {
    await db.destroy()
  }
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
