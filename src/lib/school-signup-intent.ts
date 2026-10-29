// A person who presses "Continue with Google" on a SCHOOL page leaves this cookie first, so the one
// place that makes accounts (src/lib/auth.ts) knows the new login is a school login and not a student.
// It is not a secret and gives no power: anyone may start a school (the sign-up form is open too).
export const SCHOOL_INTENT_COOKIE = 'pp_school_intent'

export function hasSchoolIntent(
  cookieHeader: string | null | undefined,
): boolean {
  if (!cookieHeader) return false
  return cookieHeader
    .split(';')
    .some((c) => c.trim() === `${SCHOOL_INTENT_COOKIE}=1`)
}

/** Which account a brand-new login becomes. A Google login is a student unless it came from a school page. */
export function newAccountKind(o: {
  viaSocial: boolean
  schoolIntent: boolean
  formType?: string
}): 'school' | 'student' | 'teacher' | 'parent' {
  if (o.viaSocial) return o.schoolIntent ? 'school' : 'student'
  if (o.formType === 'student') return 'student'
  if (o.formType === 'teacher') return 'teacher'
  return 'parent'
}
