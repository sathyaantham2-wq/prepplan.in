# ADR-0003 — School tenancy and separate school students

**Status:** Accepted · 2026-10-29 (owner approved `docs/SCHOOLS_MODULE_PLAN.md`)

## Context

PrepPlan for Schools is a paid B2B module. Until now the tenant root has been the household
(`household_id` on every private table, enforced in the repository layer). A school has many users
with different roles, teachers who may see only some sections and subjects, and data that must
never reach another school, a personal PrepPlan account, or any analytics, marketing or AI-training
use (owner decisions 2026-10-29, written into `CLAUDE.md` as "School module rules").

## Decision

1. A new tenant root `schools`. Every school-side table carries `school_id NOT NULL`; children use
   composite foreign keys `(school_id, parent_id)` so the database refuses cross-school links.
2. School roles live in `school_members.role`. `users.role` stays the platform role and is not widened.
3. Scope is a branded `SchoolScope` value produced only by `requireSchoolRole`, taken from the URL and
   verified against membership on every request; a foreign school returns 404. Teachers carry their
   `(section_id, subject_id)` pairs, plus the pairs whose sample check they do.
4. A school student is a `students` row with `school_id` set, created only by the school admin. She is
   never linked to a personal account. `school_id` is the purpose-limit marker: every consumer query,
   cron, email and event writer excludes or refuses her.
5. No per-student consent. One append-only `school_terms_acceptances` row per school (who, when,
   version); a school without the current version cannot add students, print booklets or run marking.
6. School marking state lives beside the evaluation, not in it. `evaluations.confirmed_at` keeps its
   meaning ("load-bearing marks") and is set at lock by calling the existing `confirmEvaluation`.
7. Consumer confirm/review/dispute routes refuse school attempts (`assertNotSchoolAttempt`).

## Consequences

- Cross-school leakage is blocked at four layers (scope type, repository factory, composite FKs,
  schema-lint test) and tested against the local test DB.
- Existing consumer tables change only additively (`papers.school_exam_id`, `students.school_id`,
  `audit_log.school_id`, `ai_jobs.school_id`).
- Every new feature that reads `students` must handle `school_id`; the purpose-limit sweep test fails
  CI if one does not.
- A child who is both a school student and a PrepPlan consumer has two unrelated accounts.
- Reversing this later (merging school students into personal accounts) would break the legal basis
  the module relies on, which is why it is settled before the first migration.
- Open: legal confirmation of the DPDP Fourth Schedule Part A exemption for a vendor-supplied tool is
  the owner's to settle with counsel; this ADR does not assert it.
