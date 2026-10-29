import { describe, expect, it } from 'vitest'
import {
  parseProdDemoArgs,
  prodDemoProblems,
  prodDemoSummary,
} from './demo-prod-guard'

const good = [
  '--production',
  '--name',
  'PrepPlan Demo School',
  '--code',
  'demo-prepplan',
  '--confirm-code',
  'demo-prepplan',
  '--admin-name',
  'Demo Office',
  '--admin-email',
  'office@example.org',
  '--teacher-name',
  'Demo Teacher',
  '--teacher-email',
  'teacher@example.org',
]
const problems = (extra: Array<string> = [], drop: Array<string> = []) =>
  prodDemoProblems(
    parseProdDemoArgs([
      ...good.filter(
        (g, i) => !drop.includes(g) && !drop.includes(good[i - 1]),
      ),
      ...extra,
    ]),
  )

describe('creating the demo school on a real database', () => {
  it('accepts a complete, matching command and defaults to the three real Class 7 subjects', () => {
    expect(problems()).toEqual([])
    expect(parseProdDemoArgs(good).subjects).toEqual(['MATH', 'SCI', 'SST'])
  })
  it('refuses without --production', () => {
    expect(problems([], ['--production'])[0]).toMatch(/--production/)
  })
  it('refuses when the code is not repeated exactly, or does not start with demo-', () => {
    const i = good.indexOf('--confirm-code')
    const other = [...good.slice(0, i + 1), 'demo-other', ...good.slice(i + 2)]
    expect(prodDemoProblems(parseProdDemoArgs(other)).join()).toMatch(
      /repeat --code exactly/,
    )
    const bad = prodDemoProblems(
      parseProdDemoArgs(
        good.map((g) => (g === 'demo-prepplan' ? 'real-school' : g)),
      ),
    )
    expect(bad.join()).toMatch(/must start with "demo-"/)
  })
  it('refuses a missing flag, a bad e-mail, one e-mail for both people, and fixture subjects', () => {
    expect(problems([], ['--teacher-email']).join()).toMatch(
      /--teacher-email is missing/,
    )
    expect(
      prodDemoProblems(
        parseProdDemoArgs(
          good.map((g) => (g === 'office@example.org' ? 'nope' : g)),
        ),
      ).join(),
    ).toMatch(/not a valid e-mail/)
    expect(
      prodDemoProblems(
        parseProdDemoArgs(
          good.map((g) =>
            g === 'teacher@example.org' ? 'office@example.org' : g,
          ),
        ),
      ).join(),
    ).toMatch(/different e-mail/)
    expect(problems(['--subjects', 'MATH-SEED']).join()).toMatch(
      /not a real subject code/,
    )
    expect(problems(['--subjects', 'E2E']).join()).toMatch(
      /not a real subject code/,
    )
  })
  it('says what it will create, and that it only creates', () => {
    const s = prodDemoSummary(parseProdDemoArgs(good), 'db.example.co')
    expect(s).toContain('db.example.co')
    expect(s).toContain('30 invented students')
    expect(s).toContain('only creates')
    expect(s).not.toMatch(/postgres:\/\//)
  })
})
