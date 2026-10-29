import type { SchoolRole } from './enums'

/**
 * The tenant scope for every school-side query (ADR-0003). It is the school equivalent of the
 * household/student id the scoped repositories already require, with one difference: it is a
 * branded type, so a repository method cannot be called with a bare string or a hand-built
 * object. The only code that may call `issueSchoolScope` is `src/lib/school-session.ts` (after it
 * has checked the caller's membership) and test files; school-scope.test.ts fails if anything
 * else does.
 */

declare const schoolScopeBrand: unique symbol

export interface SectionSubjectPair {
  sectionId: string
  subjectId: string
}

export interface SchoolScope {
  readonly [schoolScopeBrand]: true
  readonly userId: string
  readonly schoolId: string
  readonly role: SchoolRole
  /**
   * What a teacher may mark and decide: their assigned section-subject pairs. 'all' for the
   * school admin and principal. Empty for everyone else, and for a teacher until the assignments
   * table exists (step S2): no pairs means no access, never "all".
   */
  readonly pairs: 'all' | ReadonlyArray<SectionSubjectPair>
  /**
   * Pairs whose sample check this person does (the class teacher by default, or the subject
   * teacher when the admin switches it). Grants the sample-check items only. Filled in step S2.
   */
  readonly samplePairs: ReadonlyArray<SectionSubjectPair>
}

export function issueSchoolScope(input: {
  userId: string
  schoolId: string
  role: SchoolRole
  pairs?: 'all' | ReadonlyArray<SectionSubjectPair>
  samplePairs?: ReadonlyArray<SectionSubjectPair>
}): SchoolScope {
  return {
    userId: input.userId,
    schoolId: input.schoolId,
    role: input.role,
    pairs: input.pairs ?? [],
    samplePairs: input.samplePairs ?? [],
  } as SchoolScope
}
