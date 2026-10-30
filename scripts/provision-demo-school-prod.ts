/**
 * Creates the DEMO school on a REAL database (the owner runs this, once, after the school migrations
 * 0078 to 0087 are applied there). It only ever CREATES one new demo school; it cannot change or delete
 * anything, and it refuses without the full set of flags and a typed confirmation.
 *
 *   DATABASE_URL='postgres://...' npx tsx scripts/provision-demo-school-prod.ts --production \
 *     --name "PrepPlan Demo School" --code demo-prepplan --confirm-code demo-prepplan \
 *     --admin-name "Demo Office" --admin-email office@your-domain \
 *     --teacher-name "Demo Teacher" --teacher-email teacher@your-domain [--subjects MATH,SCI,SST]
 *
 * (The local script, scripts/provision-school.ts, still refuses every non-local database.)
 * It checks that the migrations are there and that Class 7 Maths, Science and Social Science exist with
 * chapters, shows what it will create, and waits for you to type CREATE DEMO <code>. If anything fails
 * after the school was made, the school is suspended (never deleted) and its id is printed.
 */
import { createInterface } from 'node:readline/promises'
import { createDb } from '../src/db/connection'
import { provisionDemoSchool } from '../src/lib/schools/demo-provision'
import {
  parseProdDemoArgs,
  prodDemoProblems,
  prodDemoSummary,
} from '../src/lib/schools/demo-prod-guard'

async function main() {
  const a = parseProdDemoArgs(process.argv.slice(2))
  const problems = prodDemoProblems(a)
  if (problems.length > 0) {
    for (const p of problems) console.error(`- ${p}`)
    process.exitCode = 2
    return
  }
  const host = (() => {
    try {
      return new URL(process.env.DATABASE_URL ?? '').hostname
    } catch {
      return '(unreadable DATABASE_URL)'
    }
  })()
  const db = createDb()
  try {
    // 1. the school migrations are there
    const has = await db
      .selectFrom('kysely_migration' as never)
      .select('name' as never)
      .where('name' as never, '=', '0087_school_wizard_demo' as never)
      .executeTakeFirst()
    if (!has)
      throw new Error(
        'Migration 0087_school_wizard_demo is not applied on this database. Run the migrations first.',
      )
    // 2. nothing with this code exists, and no other demo school does
    if (
      await db
        .selectFrom('schools')
        .select('id')
        .where('code', '=', a.code as string)
        .executeTakeFirst()
    )
      throw new Error(
        `A school with code "${a.code}" already exists. Nothing was done.`,
      )
    const other = await db
      .selectFrom('schools')
      .select('code')
      .where('is_demo', '=', true)
      .where('city', '=', 'Demo city') // a school that started itself is also a demo until approved; it is not this one
      .where('status', '=', 'active')
      .executeTakeFirst()
    if (other)
      throw new Error(
        `An active demo school ("${other.code}") already exists. Use Reset demo in it, or suspend it first.`,
      )
    // 3. the real subjects exist and have chapters
    for (const code of a.subjects) {
      const s = await db
        .selectFrom('subjects')
        .select('id')
        .where('code', '=', code)
        .where('board', '=', 'CBSE')
        .where('class', '=', 7)
        .where('is_active', '=', true)
        .where((eb) =>
          eb.exists(
            eb
              .selectFrom('chapters')
              .select('chapters.id')
              .whereRef('chapters.subject_id', '=', 'subjects.id'),
          ),
        )
        .executeTakeFirst()
      if (!s)
        throw new Error(
          `Class 7 subject ${code} is missing, inactive or has no chapters on this database.`,
        )
    }
    console.log(prodDemoSummary(a, host))
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    const typed = await rl.question(
      `\nType CREATE DEMO ${a.code} to go ahead: `,
    )
    rl.close()
    if (typed.trim() !== `CREATE DEMO ${a.code}`) {
      console.log('Not confirmed. Nothing was done.')
      return
    }
    let schoolId: string | null = null
    try {
      const demo = await provisionDemoSchool(db, {
        name: a.name as string,
        code: a.code as string,
        adminName: a.adminName as string,
        adminEmail: a.adminEmail as string,
        teacherName: a.teacherName as string,
        teacherEmail: a.teacherEmail as string,
        subjectCodes: a.subjects,
      })
      schoolId = demo.schoolId
      console.log(
        `\nDEMO school ${demo.schoolId} (${a.code}) created with ${demo.subjects} subjects.`,
      )
      console.log(
        `Office sign-in:  ${a.adminEmail}  one-time code ${demo.adminCode}`,
      )
      console.log(
        `Teacher sign-in: ${a.teacherEmail}  one-time code ${demo.teacherCode}`,
      )
      console.log(
        'Each code works once and expires in 7 days. Open /school/set-password to use it.',
      )
    } catch (e) {
      const row = await db
        .selectFrom('schools')
        .select('id')
        .where('code', '=', a.code as string)
        .executeTakeFirst()
      schoolId = row?.id ?? schoolId
      if (schoolId) {
        await db
          .updateTable('schools')
          .set({ status: 'suspended' })
          .where('id', '=', schoolId)
          .execute()
        console.error(
          `The school was only partly made. It is suspended (not deleted): ${schoolId}`,
        )
      }
      throw e
    }
  } finally {
    await db.destroy()
  }
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
