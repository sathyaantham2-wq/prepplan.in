import { describe, expect, it } from 'vitest'
import {
  SCHOOL_INTENT_COOKIE,
  hasSchoolIntent,
  newAccountKind,
} from '../school-signup-intent'
import { schoolCodeFor } from './signup'

describe('school codes', () => {
  it('are readable, lower-case, safe and end in a short random tail', () => {
    const code = schoolCodeFor('Greenfield Public School', () => 0.5)
    expect(code).toMatch(/^greenfield-public-school-[a-z2-9]{4}$/)
    expect(schoolCodeFor('  St. Mary’s  High!!  ', () => 0.1)).toMatch(
      /^st-mary-s-high-[a-z2-9]{4}$/,
    )
    expect(schoolCodeFor('!!!', () => 0.1)).toMatch(/^school-[a-z2-9]{4}$/)
    expect(
      schoolCodeFor('A'.repeat(200), () => 0.2).length,
    ).toBeLessThanOrEqual(33)
  })
})

describe('which account a brand-new login becomes', () => {
  it('Google from a school page is a school login; Google anywhere else is still a student', () => {
    expect(newAccountKind({ viaSocial: true, schoolIntent: true })).toBe(
      'school',
    )
    expect(newAccountKind({ viaSocial: true, schoolIntent: false })).toBe(
      'student',
    )
  })
  it('the e-mail form is unchanged: student stays student, teacher stays teacher, anything else is a parent', () => {
    expect(
      newAccountKind({
        viaSocial: false,
        schoolIntent: false,
        formType: 'student',
      }),
    ).toBe('student')
    expect(
      newAccountKind({
        viaSocial: false,
        schoolIntent: false,
        formType: 'teacher',
      }),
    ).toBe('teacher')
    expect(
      newAccountKind({
        viaSocial: false,
        schoolIntent: false,
        formType: 'whatever',
      }),
    ).toBe('parent')
    expect(newAccountKind({ viaSocial: false, schoolIntent: false })).toBe(
      'parent',
    )
  })
  it('a school marker never turns the e-mail form into a school login (that has its own door)', () => {
    expect(
      newAccountKind({
        viaSocial: false,
        schoolIntent: true,
        formType: 'student',
      }),
    ).toBe('student')
    expect(
      newAccountKind({
        viaSocial: false,
        schoolIntent: true,
        formType: 'school',
      }),
    ).toBe('parent')
  })
  it('the marker is recognised only as an exact cookie', () => {
    expect(hasSchoolIntent(`a=b; ${SCHOOL_INTENT_COOKIE}=1; c=d`)).toBe(true)
    expect(hasSchoolIntent(`${SCHOOL_INTENT_COOKIE}=1`)).toBe(true)
    expect(hasSchoolIntent(`${SCHOOL_INTENT_COOKIE}=0`)).toBe(false)
    expect(hasSchoolIntent(`x${SCHOOL_INTENT_COOKIE}=1`)).toBe(false)
    expect(hasSchoolIntent(null)).toBe(false)
    expect(hasSchoolIntent('')).toBe(false)
  })
})
