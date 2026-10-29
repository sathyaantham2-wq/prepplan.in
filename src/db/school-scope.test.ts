import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { pickRole } from '../lib/school-session'

function walk(dir: string, out: Array<string> = []): Array<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(ts|tsx)$/.test(name)) out.push(p)
  }
  return out
}

describe('SchoolScope issuing (ADR-0003)', () => {
  it('is issued only by school-session.ts, its own file and test files', () => {
    const offenders = walk('src').filter((file) => {
      if (/\.test\.tsx?$/.test(file)) return false
      if (
        file.endsWith('school-session.ts') ||
        file.endsWith('school-scope.ts')
      )
        return false
      return readFileSync(file, 'utf8').includes('issueSchoolScope(')
    })
    expect(offenders).toEqual([])
  })
})

describe('pickRole', () => {
  it('chooses the most senior allowed role', () => {
    expect(pickRole(['teacher', 'parent'], [])).toBe('teacher')
    expect(
      pickRole(['teacher', 'school_admin'], ['teacher', 'school_admin']),
    ).toBe('school_admin')
  })
  it('ignores roles the route does not allow', () => {
    expect(pickRole(['parent'], ['teacher'])).toBeNull()
    expect(pickRole(['school_admin', 'parent'], ['parent'])).toBe('parent')
  })
})
