// The checks in front of creating the demo school on a REAL database (scripts/provision-demo-school-prod.ts).
// Pure, so every refusal is tested. The script only ever creates a school; it cannot change one.

export const PROD_DEMO_DEFAULT_SUBJECTS = ['MATH', 'SCI', 'SST'] as const

export interface ProdDemoArgs {
  production: boolean
  name: string | null
  code: string | null
  confirmCode: string | null
  adminName: string | null
  adminEmail: string | null
  teacherName: string | null
  teacherEmail: string | null
  subjects: Array<string>
}

export function parseProdDemoArgs(argv: ReadonlyArray<string>): ProdDemoArgs {
  const get = (n: string) => {
    const i = argv.indexOf(`--${n}`)
    const v = i >= 0 ? argv[i + 1] : undefined
    return v && !v.startsWith('--') ? v : null
  }
  const subjects = get('subjects')
  return {
    production: argv.includes('--production'),
    name: get('name'),
    code: get('code'),
    confirmCode: get('confirm-code'),
    adminName: get('admin-name'),
    adminEmail: get('admin-email'),
    teacherName: get('teacher-name'),
    teacherEmail: get('teacher-email'),
    subjects: subjects
      ? subjects
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [...PROD_DEMO_DEFAULT_SUBJECTS],
  }
}

/** Every reason the run must stop. An empty list means it may go on to the typed confirmation. */
export function prodDemoProblems(a: ProdDemoArgs): Array<string> {
  const p: Array<string> = []
  if (!a.production)
    p.push(
      'Add --production to say you mean a real database. Nothing was done.',
    )
  for (const [flag, v] of [
    ['--name', a.name],
    ['--code', a.code],
    ['--admin-name', a.adminName],
    ['--admin-email', a.adminEmail],
    ['--teacher-name', a.teacherName],
    ['--teacher-email', a.teacherEmail],
  ] as const)
    if (!v) p.push(`${flag} is missing.`)
  if (a.code && !/^demo-[a-z0-9-]{2,36}$/.test(a.code))
    p.push(
      '--code must start with "demo-" (for example demo-prepplan), lower-case letters, digits and hyphens.',
    )
  if (a.code && a.confirmCode !== a.code)
    p.push('--confirm-code must repeat --code exactly.')
  for (const e of [a.adminEmail, a.teacherEmail])
    if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      p.push(`"${e}" is not a valid e-mail address.`)
  if (a.adminEmail && a.adminEmail === a.teacherEmail)
    p.push('The office and the teacher need different e-mail addresses.')
  if (a.subjects.length === 0)
    p.push('--subjects needs at least one subject code.')
  for (const s of a.subjects)
    if (!/^[A-Z0-9]{2,12}$/.test(s) || /SEED|E2E/.test(s))
      p.push(`"${s}" is not a real subject code.`)
  return p
}

/** What the script says it is about to create, shown before the typed confirmation. */
export function prodDemoSummary(a: ProdDemoArgs, host: string): string {
  return [
    `Database host:  ${host}`,
    `School:         ${a.name} (code ${a.code}), flagged DEMO, AI spend cap Rs 50`,
    `Contents:       Class 7 section A, 30 invented students, subjects ${a.subjects.join(', ')}, two ready-made layouts`,
    `Office login:   ${a.adminEmail} (one-time code, printed once)`,
    `Teacher login:  ${a.teacherEmail} (one-time code, printed once)`,
    'It only creates. No existing school, student or question is changed or deleted.',
  ].join('\n')
}
