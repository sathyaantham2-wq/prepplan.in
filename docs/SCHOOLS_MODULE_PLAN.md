# PrepPlan for Schools — design plan

Status: **ACCEPTED by the owner 2026-10-29; build in progress, S1 first.** Nothing is pushed or deployed, and nothing has touched production.
No F-number exists for this module. The "proposed backlog rows" in section 7 use working labels (`SCH-1` …)
only; the owner assigns real F-numbers and edits tab 03.

What was read to write this: `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/DATA_DICTIONARY.md` and, in the
code, `src/lib/session.ts`, `src/db/repositories/factory.ts`, `household-isolation.integration.test.ts`,
`src/lib/evaluation.ts` (`confirmEvaluation`), `src/lib/answer-review.ts`, `src/lib/adaptive/auto-confirm.ts`,
`src/lib/scans.ts`, `scan-crypto.ts`, `scan-mapping.ts`, `src/lib/school-paper.ts`, `school-blueprint.ts`,
`src/lib/pdf/page-count.ts`, `guardian-links.ts`, migrations 0063/0072/0074 and the generated `src/db/types.ts`.
Things I did **not** read in depth and must re-check at the step that touches them are marked **[verify]**.

**Revision 2 (2026-10-29, owner decisions):** (1) school students follow a separate rule set, now written
into `CLAUDE.md` as "School module rules"; (2) no parental consent in the school module, replaced by a
per-school terms-acceptance record; (3) purpose limit enforced in code and tested; (4) no public sign-up
for school students; (5) sample check by the class teacher by default, switchable per section-subject.
These **override** the earlier DPDP risk note (old R6), the per-student consent idea, and decisions D1, D5
and D12 below. Changed places are marked "(rev 2)".

`docs/DATA_DICTIONARY.md` says 40 tables; `types.ts` has grown well past that (scan, fix-it, points,
disputes, guardian tables). Treat `types.ts` as the truth and refresh the dictionary as part of step S1.

---

# Part A — Plain-language version

## A1. What we are building

A **School workspace** inside the same app. A school signs up (paid), its admin loads classes, sections,
students and teachers from Excel, and teachers design a question paper to the school's own marks pattern.
The app prints a **Smart Answer Booklet** for every student: each page carries a QR code, each question has
its own answer box sized to its marks, MCQs have bubbles, and there is a rough-work area. After the exam
the school scans the answered booklets (a PDF or a pile of phone photos, in any order). The app sorts
pages by QR code, tells you which student is missing which page, then the AI marks every answer box
against the step-wise marking scheme.

The big change from today: **the AI's marks are final unless flagged.** Teachers do not confirm every
mark. They resolve only the flagged ones, plus a small random sample the app asks them to spot-check.
After results are released, students get a dispute window (default 7 days, school can change it) with up
to 5 flags per paper. When the window closes the marks **lock**, and only locked marks feed mastery and
reports. Every change is logged and nothing is deleted.

## A2. Who sees what

| Role | Sees | Can do |
|---|---|---|
| School admin | Whole school | Set up classes/sections/subjects, upload students and teachers, assign teachers, pick dispute window, run reports. Cannot change a student's mark. |
| Principal | Whole school, read-only | See results, flag counts, teacher workload, sample-check results. |
| Teacher | **Only the section + subject pairs assigned to them** | Design papers, run scans, resolve flagged answers, do sample checks, release results, decide disputes. |
| Student | Own papers and own marks | Take the exam, see marks after release, flag up to 5 answers, get the report. |
| Parent | Own child's results, read-only | View only. |

Every school record carries a `school_id`, and the filter is built into the data layer (not typed into each
screen), the same way `household_id` works today. A school can never see another school's data, and a
teacher can never see a section they are not assigned to.

## A3. The life of one exam

1. Teacher builds a paper (or picks a saved school template) → app picks questions from the bank.
2. Teacher reviews the paper and the marking scheme; approves it.
3. App generates one booklet PDF per student, with QR codes. School prints and conducts the exam.
4. School scans the answered booklets and uploads them. App sorts pages, lists missing/unreadable pages per student.
5. AI marks every answer box. Each answer is either **final** or **flagged** (low confidence, unreadable, a diagram, or a missing page).
6. Teacher clears the flag queue and does the ~5% spot-check. The section can only be released when no AI flag is open.
7. Results release → the 7-day window starts. Students flag up to 5 answers. The AI re-reads once (keep or raise only). If the student is still not satisfied, the teacher decides, and that decision is final (can raise or lower).
8. Window closes and nothing is open → marks lock → mastery updates → student report PDF is available.

## A4. What is reused

Almost everything heavy already exists: the question bank and step-wise marking scheme, the blueprint/paper
generator, the Chromium PDF renderer with page-count checking, the AI grading and the "AI re-reads once,
keep or raise" dispute code, the encrypted scan storage, and the mastery tracker. What is new is the school
tenant, the roster/Excel upload, the booklet layout and QR sorting, the flag/lock rules, and the school screens.

## A5. The three things that need most care

1. **School tenancy.** Cross-school leakage is the worst possible bug for a B2B product. The plan puts the
   guard in the repository layer, in the database (composite foreign keys), and in tests.
2. **Not breaking today's flows.** A school exam's marks must never be confirmable through the existing
   parent or student screens, or the window and lock rules are bypassed. The plan adds one explicit guard
   and a test for it (section 4).
3. **Phone-photo scanning.** Reading boxes from skewed, shadowed phone photos is the riskiest technical part.
   The plan builds the booklet with corner alignment marks and does scanning as its own approvable steps.

## A5b. School students are a separate world (rev 2)

- **Separate rules.** School students follow the "School module rules" in `CLAUDE.md`, not the PrepPlan
  consumer rules. Nothing is shared between the two.
- **No consent per student.** The school relies on the educational-institution exemption in the DPDP
  Rules 2025 (Fourth Schedule, Part A), as you decided. What we record instead is **one row per school
  saying who accepted the PrepPlan school terms, when, and which version.** A school cannot be activated
  until that row exists. (I take the legal basis as your decision; I have not checked it.)
- **Purpose limit.** A school student's data is used only for that school's exams and reports. No product
  analytics events, no marketing or cross-sell email, no daily nudges or weekly cards, no leaderboard or
  points, no link to a personal PrepPlan account, and never as AI training data. This is enforced by a
  marker on the student record, checks at the places that send or count things, and a test that fails if
  any of them touches a school student.
- **No public sign-up.** Only the school admin creates school students, from the roster upload. They get a
  school-issued sign-in. The public sign-up page can never create one.
- **Sample check.** Done by the section's class teacher by default. The school admin can hand it to the
  subject teacher for any one section-subject.

## A6. What I need you to decide

See section 8 for the full list with my recommendation on each. The four that block the start are:
tenancy model for school students (D1), whether the pilot is one school only (D2), the hard-rule change
for CLAUDE.md (D3), and the dependencies I want to add (D4).

---

# Part B — Technical detail

## 1. New tables and changes to existing ones

### 1.1 Design rules

- Every school-side table has `school_id uuid not null references schools(id) on delete restrict`.
- Parents tables expose `unique (school_id, id)`; child tables use a **composite FK `(school_id, parent_id)
  → parent(school_id, id)`**. The database itself then refuses a row whose parent belongs to another school.
  This is defence in depth under the repository filter.
- No `on delete cascade` on school data (invariant 4). Rows move through `status` columns.
- `schools.household_id` points to a household created for the school (the existing billing/ownership
  unit; `households.plan` already exists). This keeps `audit_log.household_id` and `ai_jobs.household_id`
  `NOT NULL`-compatible, so existing household queries are untouched.
- `users.role` (`parent | student | teacher | admin`) stays the **platform** role and is not widened.
  School roles live in `school_members.role`. (The existing `'teacher'` platform role is used by the
  guardian-invite flow in migration 0063; reusing it for school teachers would conflate two meanings.)
- Chapter identity stays `(source_id, part, chapter_no)`; exams store `chapter_ids uuid[]` exactly like `papers`.
- Board and class stay first-class: `school_classes.grade` and `schools.board` are data, nothing hardcoded.

### 1.2 New tables

| Table | Purpose / key columns |
|---|---|
| `schools` | `id, household_id, name, code (unique slug), board, city, status (active/suspended), dispute_window_days default 7, sample_rate default 0.05, scan_retention_days, plan, created_at` |
| `school_members` | `school_id, user_id, role (school_admin/principal/teacher/student/parent), status, created_at`; unique `(school_id, user_id, role)`. A person may belong to several schools. |
| `school_classes` | `school_id, grade int, academic_year`; unique `(school_id, grade, academic_year)` |
| `school_terms_acceptances` (rev 2) | `school_id, accepted_by_user_id, accepted_at, terms_version, accepted_ip null`. Append-only; a new terms version is a new row. **Replaces any per-student consent record.** A school with no row for the current version cannot add students, print booklets or run marking. |
| `school_sections` | `school_id, class_id, name ('A'), academic_year, class_teacher_member_id null (rev 2)`; unique `(class_id, name)` |
| `school_subjects` | `school_id, class_id, subject_id → subjects` (the global `(board, class, code)` row). Phase 1 only offers subjects that already have a bank. |
| `school_teacher_assignments` | `school_id, member_id, section_id, subject_id, sample_checker text check in ('class_teacher','subject_teacher') default 'class_teacher' (rev 2)`; unique on the triple. **This is the teacher's marking scope.** Only the school admin can change `sample_checker`, and the change is audited. |
| `school_students` | `school_id, student_id → students, section_id, roll_no, status, created_by_user_id`; unique `(section_id, roll_no)`. Reuses `students` so mastery, papers, attempts and evaluations work unchanged. Created only by the school admin (rev 2); there is no consent row. |
| `school_student_guardians` | `school_id, school_student_id, name, phone_e164, user_id null, verified_at null` (parent phone from Excel; read-only view in Phase 2) |
| `school_import_batches` | `school_id, kind (students/teachers), file_sha256, status (dry_run/committed/failed), counts, row_errors jsonb, created_by`. Keeps the uploaded rows' outcome for audit. |
| `school_paper_templates` | `school_id, subject_id, name, version, status (active/retired), total_marks, duration_min, layout jsonb, config jsonb`. `layout` is blueprint-shaped sections: per section the question type, count, marks each, internal-choice rule, thinking-level mix. Versioned; an exam pins a version (same idea as `papers.blueprint_version`). |
| `school_exams` | `school_id, template_id, template_version, class_id, subject_id, title, chapter_ids uuid[], exam_date, status (draft/booklets_ready/conducted/scanning/marking/released/closed), dispute_window_days (snapshot), created_by` |
| `school_exam_questions` | The master paper: `exam_id, question_id, position, marks, section, choice_group, slot, expected_words` (mirrors `paper_questions`). |
| `school_exam_sections` | One row per exam × section: `released_at, window_closes_at, locked_at, sample_rate (snapshot)`. Release and lock are per section. |
| `school_booklet_layouts` | `exam_id, version, page_count, manifest jsonb` — box coordinates in mm per question per page, MCQ bubble positions, corner-mark positions. The scan cropper reads this. |
| `school_booklets` | `exam_id, student_id, attempt_id, paper_id, layout_version, pdf_ref, generated_at`. One per student. |
| `school_scan_batches` | `school_id, exam_id, section_id, uploaded_by, source (pdf/photos), file_count, status` |
| `school_scan_pages` | Staging + identified pages: `batch_id, image (bytea, AES-GCM via scan-crypto), qr_payload, exam_id null, student_id null, page_no null, status (unread/identified/duplicate/unreadable/orphan), quality_score, purged_at`. Same encryption and signed-URL pattern as `scan_pages`. |
| `school_item_marks` | **The school marking state, one row per `evaluation_items` row:** `school_id, evaluation_item_id (unique), state, ai_confidence, flag_reason null, current_marks, ai_marks, last_changed_by, locked_at`. States below in section 4. |
| `school_flags` | `school_id, evaluation_item_id, kind (ai/student), reason (low_confidence/unreadable/diagram/missing_page/student_dispute), student_comment null, status (open/ai_reviewed/with_teacher/resolved), ai_reply null, marks_before, marks_after null, resolved_by null, resolved_at null`. Append-only; a new decision is a new row, never an edit. |
| `school_sample_checks` | `school_id, exam_id, section_id, evaluation_item_id, selected_seed, status (pending/agreed/changed), reviewed_by null, marks_before, marks_after null` |
| `school_student_reports` | `school_id, student_id, exam_id, evaluation_id, pdf_ref, generated_at` (only built from locked marks) |

### 1.3 Changes to existing tables (all additive, nullable or defaulted)

| Table | Change | Why |
|---|---|---|
| `papers` | `school_exam_id uuid null` | Marks a per-student paper as a school paper so consumer screens can exclude it and the guard in section 4 can find it. |
| `audit_log` | `school_id uuid null` | School events carry the school; `household_id` is the school's household so the column stays `NOT NULL`. |
| `ai_jobs` | `school_id uuid null` | Per-school AI spend metering (the school marking cost is the main variable cost). |
| `users` | **no change** (rev 2: school users are created by the school service only, never by the public sign-up path; see 3.4) | |
| `students` (rev 2) | `school_id uuid null references schools(id)`. **This is the purpose-limit marker:** null for a PrepPlan student, set for a school student. Each school student sits in a household created for her (so `students.household_id NOT NULL` still holds) and is never linked to a personal account. | Every consumer query, cron, email and event writer filters on `school_id is null` or refuses when it is set (section 3.4). |
| `evaluations`, `evaluation_items`, `attempts`, `attempt_answers`, `concept_mastery` | **no schema change** | School marking state lives in `school_item_marks`; mastery is fed by calling the existing `confirmEvaluation` at lock time. |

### 1.4 Migration list (continues from 0076; each has `up` and `down`, tested in CI like the rest)

| # | File | up | down |
|---|---|---|---|
| 0077 | `schools_core` | `schools`, `school_terms_acceptances`, `school_members`, `school_classes`, `school_sections`, `school_subjects`; unique `(school_id, id)` on each | drop in reverse order |
| 0078 | `school_roster` | `school_students`, `school_student_guardians`, `school_teacher_assignments`, `school_import_batches`; `students.school_id` (+ index) | drop tables, drop column (refuses if any student has `school_id` set, so a school student is never silently turned into a consumer one) |
| 0079 | `school_paper_templates` | `school_paper_templates` | drop |
| 0080 | `school_exams` | `school_exams`, `school_exam_questions`, `school_exam_sections`; `papers.school_exam_id` | drop tables, drop column |
| 0081 | `school_booklets` | `school_booklet_layouts`, `school_booklets` | drop |
| 0082 | `school_scans` | `school_scan_batches`, `school_scan_pages` | drop |
| 0083 | `school_marking` | `school_item_marks`, `school_flags`, `school_sample_checks` | drop |
| 0084 | `school_audit_and_metering` | `audit_log.school_id`, `ai_jobs.school_id` (+ indexes) | drop columns |
| 0085 | `school_reports` | `school_student_reports` | drop |

Down-migration note: `down` for 0084 drops only the new columns; the audit rows themselves remain (they
still have a household). Down migrations are for the local test DB only. Production migrations are run by
the owner, as in earlier work, and are never run by me.

After each migration: `npm run db:codegen`, then refresh `docs/DATA_DICTIONARY.md`.

## 2. How school scoping is enforced

### 2.1 Layers (a row must pass all of them)

1. **A `SchoolScope` value that cannot be forged.** `requireSchoolRole(request, schoolId, ...roles)` (new,
   beside `requireRole` in `session.ts`) loads the caller's `school_members` row for that school and returns
   `SchoolScope { userId, schoolId, role, pairs, samplePairs }`. `pairs` is the teacher's `(section_id,
   subject_id)` list from `school_teacher_assignments` (empty list for non-teachers; admin and principal get
   `pairs = 'all'`). `samplePairs` (rev 2) is the list of pairs whose **sample check** this person does:
   for a class teacher, every pair in their section with `sample_checker = 'class_teacher'`; for a subject
   teacher, their own pairs with `sample_checker = 'subject_teacher'`. It grants access to the sample-check
   items and their answer images **only**, not to the rest of that subject (flag queue, release, disputes).
   `SchoolScope` is a branded type produced only by that function. The school id is taken from the URL
   (`/schools/$schoolId/...`) and **verified against membership on every request**, never read from a cookie
   or body. A 404 (not 403) is returned for a school the caller does not belong to, so existence is not leaked.
2. **Repository factory.** A new `createSchoolScopedRepository(table)` next to `createScopedRepository`. Every
   method takes `SchoolScope` and bakes in `where school_id = scope.schoolId`. Tables that are teacher-limited
   (exams, exam sections, school students, marks) additionally get a `scopedToPairs(query, scope)` helper that
   applies `(section_id, subject_id) in pairs` for the teacher role. Child tables with no section column are
   reached through their parent in the repository (same approach `evaluationsRepository` uses via `students`
   today). No route handler writes a school query itself; the existing ESLint rule that blocks `kysely` imports
   outside `src/db/**` already forces this.
3. **Database constraints.** Composite FKs (section 1.1) mean a child row cannot point at another school's
   parent. `school_id` is `NOT NULL` everywhere.
4. **Schema-lint test.** A test reads `information_schema` and fails if any table whose name starts with
   `school_` lacks a `NOT NULL school_id`, or lacks a composite FK to its parent, or is not exported from a
   repository file that uses the school factory. A new school table that forgets scoping fails CI.
5. **Defence in depth, later (D6).** Postgres row-level security keyed on `current_setting('app.school_id')`
   is possible but the app uses one pooled DB role; I recommend leaving RLS to Phase 2.

### 2.2 Isolation tests to add (same pattern as T02; **local test DB only**)

New file `src/db/repositories/school-isolation.integration.test.ts`, plus a route-level sweep modelled on
`src/routes/cross-household-access.integration.test.ts`. Setup: school A and school B, each with two sections,
two subjects, teachers (one assigned to A-1/Maths only), students, a guardian, an exam, booklets, scan pages,
item marks and flags. Assertions:

1. School A scope + School B's id for **every** exported school repository method → `undefined` / empty / throws.
2. Teacher T (assigned A-1 Maths) cannot list or fetch exams, scans, flags, marks or students of A-2 or A-1 Science, though they are in the same school.
3. Principal and admin read the whole school, and still nothing of school B.
4. Student sees only her own attempt, marks, flags and report; another student in the same section gets nothing.
5. Parent sees only the linked child; a parent with two children at different schools sees each in its own school context only.
6. Student cannot read the answer key, the master paper's key or another student's booklet at any school state (T09 equivalent).
7. Scan page signed URL: a URL for school A's page presented with a school B session → denied; expired URL → denied; tampered signature → denied.
8. QR token: a booklet QR from school A, replayed into school B's upload → rejected as `orphan`, never attached; a tampered token (any bit changed) → rejected.
9. Bulk import: a row naming a section or roll number of another school cannot be created or changed.
10. Audit log: school A admin reads only school A audit rows; the consumer `GET /api/audit-log` never returns school rows.
11. Schema-lint test (above).
12. **Consumer-flow guard test** (section 4.4): a school paper's attempt/evaluation is refused by every consumer confirm/review/dispute route.
13. Cross-pool: a user with membership in two schools, acting in school A, cannot touch school B rows even with B's ids.
14. Deactivated member (`status != active`) loses access on the next request, like `is_active` today.
15. (rev 2) **Sample-check scope.** A class teacher reaches the sample-check items of their own section's `class_teacher` pairs and nothing else of those subjects (no flag queue, no release, no dispute). When the admin switches one pair to `subject_teacher`, the class teacher loses it on the next request and the subject teacher gains it. Only the admin can make that switch.
16. (rev 2) **Purpose limit** (full list in 3.4): a school student is absent from `product_events`, daily nudges, weekly summaries, leaderboard, points, marketing/notification email and every consumer list; no code path links her to a personal account.
17. (rev 2) **No public sign-up for school students.** The public sign-up route, including Google sign-in, cannot create a user with a school role, and cannot attach itself to a school student's email.
18. (rev 2) A school with no `school_terms_acceptances` row for the current terms version cannot add students, print booklets or run marking.

`vitest.setup.ts` already refuses a non-local `DATABASE_URL`, so all of these run against the local
`examprep_test` database only. CI uses its own ephemeral Postgres.

## 3. Reused vs new code

### 3.1 Reused as-is or with a thin adapter

| Existing | Used for |
|---|---|
| `questions`, `question_options`, `question_step_marks`, `concepts`, `chapters` | The bank and the step-wise marking scheme the AI marks against |
| `blueprints` shape + `generatePaper` (`src/lib/papers.ts`), `school-paper.ts` (slot rules, tags, OR pairs, section-total/numbering/four-option checks), `school-blueprint.ts` | A school template is converted to a blueprint-shaped object in memory and fed to the same selector. **[verify]** the `GeneratePaperInput` shape in step S5; I read the signature only. |
| `src/lib/pdf/render.ts`, `page-count.ts` (`renderWithPageCount`), `paper-template.ts`, `key-template.ts`, `report-template.ts` | Question paper, key and student report PDFs; page count verified by the same loop |
| `scan-crypto.ts` (AES-256-GCM, HKDF labels, signed URLs) | Scan storage and signed URLs. A new HKDF label `booklet-qr-v1` signs QR tokens. |
| `ai-transcription.ts`, `scan-mapping.ts` (confidence threshold 0.85, blockers) | Reading handwriting. The booklet layout means we crop a known box instead of asking the model to find the question number, which is simpler and cheaper. |
| `ai-grading.ts` (`gradeSubjectiveAnswer`, `reviewDisputedAnswer`) | AI marking and the "keep or raise only" re-read |
| `answer-review.ts` (`MAX_DISPUTES_PER_PAPER = 5`, comment length rules) | Constants and the shape of the dispute logic; the school version is a sibling with school rules, not a modification |
| `evaluation.ts` `createEvaluation` / `confirmEvaluation` | School evaluations are created by `createEvaluation`; `confirmEvaluation` is called **once, at lock time**, so mastery, points and fix-it cards all fire from locked marks with no change to that function |
| `mastery.ts`, `diagnosis.ts`, `habit-drills.ts`, `fixit.ts`, `adaptive/*` | The report's gap-vs-habit split, strengths, topics to fix, habits to fix, and the worksheet |
| `ai-metering.ts` | Extended with a per-school spend ceiling (a sibling of `enforceStudentSpendBudget`) |
| `papaparse` | CSV path of the roster import |
| `audit_log` + `auditLogRepository` | School events, with `school_id` set |
| Vercel cron (`vercel.json`, `src/routes/api/cron/*`) | The lock job (hourly) |

### 3.2 New

- `src/lib/schools/*` — membership, `SchoolScope`, roster import, templates, exams, booklet layout/QR, scan ingest, school marking state machine, flags, sample selection, lock job, report assembly.
- `src/db/repositories/schools*.ts` — school-scoped repositories and `createSchoolScopedRepository`.
- `src/routes/schools/$schoolId/**` (screens) and `src/routes/api/schools/$schoolId/**` (API).
- A booklet PDF template (absolute positioned, mm units) and its manifest builder.
- Corner-mark deskew + box cropping for phone photos.
- Excel (`.xlsx`) reader for roster upload.

### 3.4 Purpose limit, enforced in code (rev 2)

The rule: a school student's data serves that school's exams and reports and nothing else. What I found in
the code that touches students today, and what each gets:

| Existing code | Problem for a school student | Plan |
|---|---|---|
| `logProductEvent` (`product-events.ts`), called from `attempt-submit`, `api/evaluations`, `api/papers/generate`, `.../pdf`, `api/remediation/generate`, `email.ts` | Writes analytics rows per student | Refuse inside `logProductEvent` itself when the student has `school_id` set (one choke point, one query), so a future caller cannot forget. |
| `cron/daily-nudge`, `cron/weekly-summary`, `weekly-card.ts`, `leaderboard.ts` (all `selectFrom('students')`) | Would nudge, email or rank her | Add `school_id is null` to each; leaderboard and points never include her. |
| `email.ts` | Marketing or progress email to her or her household | Only school-flow templates (result released, login issued) may be sent to a school student or guardian; every other template refuses when `school_id` is set. |
| `confirmEvaluation` → `recordPointsForConfirmedItems`, `recordFixitCardsForLostMarks` | At lock these would create points and fix-it cards: personal-app features | Skip both for a school student (small additive change inside the function: look up `students.school_id`). Mastery and the adaptive ledger **stay**, because the report and worksheet need them. **[verify]** the exact call sites in S2b. |
| `src/lib/auth.ts` `after` hook | For every new `student` it creates a Class 7 profile **and a consent row** | School users are created by the school service, not by sign-up, and the hook skips them. They get no `consents` row (rev 2 decision 2). |
| `guardian-links.ts` invites | Move a student into a guardian's household | Refuse when the student has `school_id` set. A school student can never be linked into a personal account. |
| Public sign-up and Google sign-in (commit `1bf36e6` links Google sign-in to an existing email account) | Could attach to a school student's email | School logins use credentials the school admin issues. Sign-in providers on a school user are restricted, and the link-by-email behaviour is refused for school users. **[verify]** in `auth.ts`. |
| `privacy.ts` export/delete | Household-based; a school student's data belongs to the school | Out of Phase 1; the school is the controller, so requests go to the school (flag in D15). |
| AI calls | Student answers are sent to the model provider | Marking calls go through the same provider layer; terms and the provider's no-training setting are recorded in the school terms. No student content is stored for training and no prompts are reused outside that school's exam. **[verify]** provider data-retention settings with the owner (D16). |
| Anything not in this table | Unknown | The purpose-limit test (test 16) is written as a sweep: it creates a school student, runs every cron handler and every exported function that selects `students` or sends mail/events, and fails if any produces output for her. A new feature that touches students must pass it. |

### 3.3 New dependencies (need approval, D4)

| Need | Candidate | Note |
|---|---|---|
| Read `.xlsx` | `exceljs` | Avoid the npm `xlsx` package (stale on npm). CSV already works via papaparse. |
| Generate QR | `qrcode` | Server-side SVG for the booklet |
| Decode QR from a photo | `jsqr` or `zxing-wasm` | Pick after a spike on real phone photos |
| Deskew / crop / compress | `sharp` | Vercel-compatible; **[verify]** serverless size and the 20 MB/3 MB-per-page limits in `scans.ts` |
| PDF → page images | `pdfjs-dist` is already installed | Needs a canvas backend on the server; spike in S7 |

## 4. How AI-flag / student-flag / lock fits the evaluation + `confirmed_at` model

### 4.1 Key idea

`evaluations.confirmed_at` keeps its current meaning: **"these marks are load-bearing; mastery and reports
may read them."** Everything that reads confirmed marks (dashboard, tracker, fix-it, points) already
filters on `confirmed_at is not null`. For school exams `confirmed_at` is set at the moment of **lock**,
not at AI marking. The school-specific life of a mark (final, flagged, disputed, decided) is held in the
new `school_item_marks` / `school_flags` tables. So:

- before lock: marks are visible to the school screens through `school_item_marks.current_marks`, and are
  invisible to mastery by construction;
- at lock: `confirmEvaluation(db, evaluationId)` runs unchanged, reading `evaluation_items.marks_awarded`,
  and writes mastery, points and fix-it cards in its existing transaction.

Every school mark change also writes `evaluation_items.marks_awarded` (and `overridden_by` when a teacher
changes it), so `confirmEvaluation` sees the right number and `evaluated_by` becomes `mixed` as it does today.

### 4.2 State machine per answer (`school_item_marks.state`)

```
            AI marks answer
                  │
     ┌────────────┴─────────────┐
 confident & readable        low confidence / unreadable /
 & not a diagram             diagram / missing page
     │                            │
  ai_final                   ai_flagged ── teacher resolves ──► teacher_set
     │                                                              │
     └───────────────── section released (no ai_flagged open) ──────┘
                                  │
                 student flags (≤5/paper, reason required) ──► student_flagged
                                  │
                       AI re-reads once (keep or raise only)
                          ┌───────┴────────┐
                       raised             kept
                          │               │ student accepts ──► (stays as is)
                    ai_rechecked          │ student asks teacher
                          │               ▼
                          │          with_teacher ── teacher decides (raise or lower, final) ──► teacher_final
                          └───────────────┬──────────────────────────────┘
                              window closed AND nothing open
                                          ▼
                                       locked  (school_item_marks.locked_at; then confirmEvaluation)
```

Rules enforced in code, not in the UI:

- A section cannot be released while any `ai_flagged` item exists in it. (Check lives in the release function.)
- The 5-flag cap counts `school_flags` rows of kind `student` per attempt, same constant as today.
- `AI re-read` may only keep or raise; a lower value from the model is discarded and logged.
- A teacher decision on a flag is final: a second decision on the same flag is refused.
- A lock is per evaluation: `window_closes_at` passed **and** no flag open. A student whose flag is still
  with a teacher stays unlocked until it is decided (D8 asks whether to cap that wait).
- Locked rows reject every change, including from the teacher. A correction after lock is out of scope for
  Phase 1; it would be an explicit "post-lock correction" feature with its own audit entry (D9).
- Each transition writes `audit_log` (`school.mark.ai_final`, `.ai_flagged`, `.teacher_set`, `.student_flagged`,
  `.ai_rechecked`, `.teacher_final`, `.locked`, `.released`, `.sample_checked`) with before/after.

### 4.3 Random sample check

At marking completion the app draws `sample_rate` (default 5%, per-school setting) of `ai_final` answers per
section, with a stored seed so the draw is reproducible and auditable, into `school_sample_checks`. **Who
checks (rev 2):** by default the section's **class teacher**; the school admin can switch any one
section-subject to the **subject teacher** (`school_teacher_assignments.sample_checker`). Each sample row
records `assigned_checker_member_id` at draw time, so a later switch never reassigns work already handed
out. A section with no class teacher set and no subject-teacher switch shows "no sample checker" and the
admin is told; because the sample is advisory (below) this does not block release, but it is flagged on
the release screen. The checker sees the answer image, the AI's marks and reasoning and chooses *agree* or *change*. A change goes
through the same audit path and updates the mark before release. Proposal (D7): the sample is **advisory** (does not block release), but the release
screen shows "sample not done", and a high disagreement rate (more than 10% changed) automatically widens the
sample to 20% and blocks release until that is done. The 10% and 20% numbers are my proposal, not requirements.

### 4.4 Not breaking the current parent/student flows

The existing flows assume that an unconfirmed evaluation is waiting for a parent or for the student's own
review (`answer-review.ts` `loadReview` states `waiting_for_parent | review`, `finalizeReview`,
`autoConfirmAttempt` on `submitAttempt`, parent `confirmEvaluation`). A school evaluation is unconfirmed
for days, so without a guard a school student could open it through the consumer screen and "accept" it,
confirming it before the window. The plan:

1. `papers.school_exam_id` marks school papers.
2. One function `assertNotSchoolAttempt(db, attemptId)` is called at the top of every consumer entry that
   can confirm or review: `submitAttempt` auto-confirm, `finalizeReview`, `disputeAnswer`, `removeAnswer`,
   the parent confirm route, `releaseUnmarkedToStudent`. It refuses with 409 for a school paper. **[verify]**
   the full list with `grep` in step S5; the list above is what I found by reading.
3. School attempts never go through `submitAttempt`; they have their own ingest path that sets
   `attempts.status = 'submitted'` itself.
4. Consumer lists (`papers-attempted`, dashboards, leaderboards) exclude `school_exam_id is not null` and
   students with `school_id` set (rev 2: school results never appear in any personal view; D5 settled).
5. Test 12 in section 2.2 pins this.
6. The hard rule "AI never finalises a mark on a normal paper" is superseded for school exams, the same way
   the 2026-10-02 student-paper decision superseded it. (Rev 2: on your instruction the "School module rules"
   section is now in `CLAUDE.md` and carries this rule; the sentence was:) *"School exams (PrepPlan for Schools): AI marks are final unless flagged; teacher
   resolves AI flags before release; students may flag up to 5 answers in the school's dispute window; marks
   lock when the window closes; only locked marks reach mastery."*

### 4.5 What the student may see (T09 consistency)

At release the student sees her own answer image, marks and step-wise feedback. The **model answer and key
are shown only after lock** (consistent with the existing rule that she sees the correct answer once marks
are confirmed). A downloadable key stays forbidden. If you prefer showing the model answer at release so the
dispute is better informed, that is a change to a hard rule and needs your explicit OK (D3).

## 5. Phase 1 build order

Each step is small, ends with green tests on the local test DB, and waits for your approval before the next.
No step touches production. Migrations are written and tested locally; **you** run them in production.

| Step | Deliverable | Migration | Tests |
|---|---|---|---|
| S0 | Approve this plan; assign F-numbers; decide D1–D4; approve the `CLAUDE.md` amendment text; write `ADR-0003-school-tenancy.md` | — | — |
| S1 | School tenant foundation: `schools`, `school_members`, classes, sections, school subjects; `SchoolScope`, `requireSchoolRole`, `createSchoolScopedRepository`; refresh data dictionary | 0077 | Isolation tests 1, 3, 11, 13, 14 |
| S2 | Roster tables; Excel/CSV upload with a **dry-run preview** (errors per row, duplicates, bad phone numbers) then commit, admin only; create `students` (with `school_id`) + a household per school student, **no consent row**; teacher accounts; section-subject assignments incl. `sample_checker` and class teacher; school terms acceptance (rev 2: S1 creates the table, S2 enforces "no terms, no students") | 0078 | Tests 2, 4, 9, 15, 17, 18; import unit tests |
| S2b (rev 2) | **Purpose-limit guards**: the `school_id` checks in section 3.4 (events, crons, leaderboard, email, points, fix-it, guardian invites, `auth.ts` hook), plus the sweep test | — | Test 16 (must be green before any school data is loaded anywhere) |
| S3 | School admin screens: setup (classes/sections/subjects), roster, teacher assignment; school-level audit entries | — | Route sweep for admin/teacher |
| S4 | School paper templates: marks pattern, sections, marks per question type, internal choice; versioned; validation reusing the section-total/numbering/four-option checks | 0079 | Template validation tests |
| S5 | Exams + master paper from template (reusing the selector), teacher review/swap of questions, question paper + teacher key PDF, per-student `papers` materialised; the consumer guard `assertNotSchoolAttempt` | 0080 | Tests 6, 12; paper totals/shortfall tests |
| S6 | Booklet layout engine: answer boxes sized to marks, MCQ bubbles, rough-work area, overflow page, corner marks, QR per page; manifest; PDF with verified page count; one PDF per class | 0081 | Layout unit tests; print-QA test like `print-qa.integration.test.ts`; QR signing/tamper test 8 |
| S7 | Scan intake: PDF or photos in any order, QR decode, sort by exam/student/page, duplicate/orphan detection, "missing or unreadable pages per student" view. **No AI marking yet.** | 0082 | Tests 7, 8; fixtures of rotated/skewed photos |
| S8 | AI marking per answer box against the step scheme; sets `ai_final` or `ai_flagged` with reason; per-school AI spend ceiling; internal only, nothing visible to students | 0083, 0084 | Marking contract tests with fake AI provider; flag-rule tests |
| S9 | Teacher marking workspace: flag queue (image + AI reasoning side by side), resolve, sample check; release gate (no open AI flag) | — | State-machine tests; gate tests |
| S10 | Release + student result view + student flags (≤5, reason) + AI re-read (keep/raise) + send to teacher + teacher final decision | — | Tests 4, 6; dispute-rule tests incl. "AI cannot lower" |
| S11 | Lock job (Vercel cron, hourly) → `confirmEvaluation`; lock rejects any later change; audit complete | — | Lock tests; mastery-after-lock test; "mastery unchanged before lock" test |
| S12 | Student report PDF (gap vs habit split, strengths, topics to fix, habits to fix) + personalised practice worksheet, built only from locked marks | 0085 | Report tests; "no report before lock" test |

Phase 2 candidates (not planned in detail yet): principal/admin dashboards, parent read-only portal with
phone OTP, multi-set papers (A/B variants), subjects outside the bank, post-lock correction, SSO/Google
Workspace, billing and invoices, Postgres RLS, WhatsApp delivery of reports.

## 6. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | Cross-school data leak | Section 2: branded scope, repo factory, composite FKs, schema-lint, 14 isolation tests, 404 for foreign schools |
| R2 | Bypassing the window via the consumer screens (section 4.4) | `assertNotSchoolAttempt` + test 12 |
| R3 | Phone-photo quality: skew, shadow, cut-off edges, handwriting variety | Corner marks + deskew; quality score per page; "unreadable" becomes an AI flag, never a guessed mark; spike on real photos before S7 is closed |
| R4 | AI marking accuracy, since AI marks are **final** unless flagged. Over-confident wrong marks never reach a teacher | Conservative flag thresholds at launch (flag anything below 0.85, the existing OCR threshold, plus any diagram); 5% sample with auto-widening; per-school disagreement dashboard; pilot with a teacher double-marking one full class and comparing before wider rollout (D2) |
| R5 | Cost: marking a class of 40 × ~20 answers per exam, plus vision calls | Per-school AI spend ceiling (`ai_jobs.school_id`); measure cost per booklet in the pilot before pricing (D10) |
| R6 (rev 2, replaces the earlier DPDP note) | Children's data without parental consent, relying on the DPDP Rules 2025 Fourth Schedule Part A educational-institution exemption (your decision) | The exemption is purpose-bound, so the plan makes purpose limit mechanical (3.4, test 16) and records the school's terms acceptance (who, when, version). Two things I cannot settle: whether PrepPlan as a *vendor* to the school fits the exemption's wording, and what the school terms must say (processing only for the school's exams and reports, no onward use, no AI training, retention, erasure and access requests handled by the school). **I have not verified the Rules text and this is not legal advice; have your lawyer confirm before the first real school.** |
| R7 | Scan retention. Today images purge 30 days after upload, but a school needs them through the dispute window and lock | Per-school `scan_retention_days`, floor = window + 30; text read from the image stays regardless |
| R8 | Serverless limits (request size, PDF generation time, Chromium cold start) for a 40-booklet batch | Generate booklets in a background job per student with resumable batches (same idea as `generation_batches`); upload pages one by one as `scans.ts` already does |
| R9 | Booklet layout drift: the QR/box manifest must match what was printed, even if the template changes later | Layout is versioned and pinned to the exam; scans always use the manifest of the printed version |
| R10 | Teacher turnover / absent teacher blocks release | Admin can reassign assignments; D8 on flag wait limits |
| R11 | Roll-number and name collisions in Excel (duplicate roll nos, two students with one parent phone) | Dry-run preview with row errors; unique `(section_id, roll_no)`; a phone may legitimately link several children |
| R12 | Existing docs are stale (dictionary says 40 tables) | Refresh in S1 |
| R13 | Scope creep into a general LMS | Out of scope: attendance, fees, timetable, homework, chat |

## 7. Proposed tab 03 backlog rows (working labels, **not F-numbers**; you assign numbers)

| Label | Title | Acceptance criteria |
|---|---|---|
| SCH-1 | School tenant and roles | A school, its members and the five roles exist. A request for another school's id returns 404. A teacher sees only assigned section-subject pairs. All school tables carry `school_id`; the schema-lint test passes. |
| SCH-2 | Classes, sections, subjects, assignments | Admin can create classes/sections, choose from subjects that have a bank, and assign teachers to section-subject pairs. Changes are audited. |
| SCH-3 | Excel/CSV roster upload | `.xlsx` and `.csv` of students (name, class, section, roll no, parent phone) and teachers upload with a dry-run preview listing every row error; commit is all-or-reportable; re-uploading the same file creates no duplicates. |
| SCH-4 | School paper templates | A teacher defines total marks, duration, sections, marks per question type, internal choice; saved as a versioned template; section totals and numbering are verified before save. |
| SCH-5 | School exam paper | From a template and chapters, a master paper is generated with shortfalls printed; teacher can swap questions; question paper and teacher key PDF render with a verified page count; student role cannot fetch the key. |
| SCH-6 | Smart Answer Booklet | One PDF per student; a signed QR on every page (school, exam, student, page); one answer box per question sized to marks; MCQ bubbles; rough-work area; overflow page; printed page count equals real page count. |
| SCH-7 | Bulk scan intake | PDF or phone photos of a class upload in any order; pages sorted by QR; duplicate, orphan and cross-school pages rejected; missing/unreadable pages listed per student. |
| SCH-8 | AI marking with flags | Each answer box is marked against the step scheme. Low confidence, unreadable, diagram or missing page → flagged with a reason. Unflagged marks are final. |
| SCH-9 | Teacher flag queue and sample check | Teacher resolves flags with image and AI reasoning side by side; ~5% of unflagged answers are queued for spot-check with a reproducible seed; a section cannot be released with an open AI flag. |
| SCH-10 | Release and student flags | Release starts the school's dispute window. A student can flag at most 5 answers with a reason; AI re-reads once and may only keep or raise; unresolved goes to the teacher whose decision is final (raise or lower). |
| SCH-11 | Mark lock | Marks lock when the window closes and no flag is open. Locked rows reject every change. Mastery and reports read only locked marks. Every transition is in `audit_log`. |
| SCH-12 | Student report and worksheet | A PDF per student with the knowledge-gap vs delivery-habit split, strengths, topics to fix, habits to fix, and a personalised practice worksheet; not available before lock. |
| SCH-13 | School isolation test suite | The 14 tests in section 2.2 pass against the local test DB and run in CI. |
| SCH-15 | School terms acceptance (rev 2) | A school admin accepts the current PrepPlan school terms; who, when and version are stored append-only. Without the current version the school cannot add students, print booklets or run marking. No per-student consent record exists. |
| SCH-16 | Purpose limit for school students (rev 2) | A school student is excluded from `product_events`, nudges, weekly summaries, leaderboard, points, marketing and notification email outside the school flow, guardian invites and personal-account linking; her data is never used as AI training data. The sweep test fails if any path produces output for her. |
| SCH-17 | Admin-only student creation and sample-check assignment (rev 2) | Public sign-up cannot create a school student. The class teacher does the sample check by default; the admin can switch any section-subject to the subject teacher; both changes are audited. |
| SCH-14 | Consumer-flow guard | No consumer confirm/review/dispute/parent route can act on a school attempt; consumer lists exclude school papers. |

## 8. Decisions needed from the owner

| # | Question | My recommendation |
|---|---|---|
| D1 (rev 2, settled) | How do school students relate to existing `students`/households? | **Separate.** A `students` row with `school_id` set, in a household created for her, linked via `school_students`. Never linked to a personal account; guardian invites refuse her. A child who is both a school student and a PrepPlan consumer has two unrelated accounts. |
| D2 | Pilot scope | One friendly school, one class, one subject, with a teacher double-marking in parallel to measure AI accuracy before turning on "AI final" for everyone. |
| D3 | OK to supersede the "AI never finalises" hard rule for school exams, with the exact `CLAUDE.md` text in 4.4? And: model answer shown only after lock (my default) or at release? | Yes to the amendment; model answer after lock. |
| D4 | OK to add dependencies in 3.3 (`exceljs`, `qrcode`, a QR decoder, `sharp`)? | Yes, after a one-day spike on real phone photos for the decoder and `sharp`. |
| D5 (rev 2, settled) | Should locked school marks show in a personal dashboard? | **No.** There is no personal account to show them in. School marks appear only in the school screens and the school report. |
| D6 | Add Postgres row-level security in Phase 1? | No; revisit in Phase 2. |
| D7 | Sample check: advisory or blocking? | Advisory, auto-widening to 20% and blocking if more than 10% are changed. The 10%/20% are my numbers. |
| D8 | Cap how long an unresolved flag can delay lock? | Teacher reminder at 3 days; admin may reassign; no auto-lock of an open flag. |
| D9 | Post-lock correction (teacher error discovered later) | Out of Phase 1; add as its own approved feature with its own audit entry. |
| D10 | Pricing unit (per student per year, per exam, per booklet)? | Decide after the pilot's real AI cost per booklet is known. |
| D11 | Which subjects are in the pilot? | One with a strong written-answer bank, e.g. Class 8 Science or Class 7 Maths. Subjects outside the bank are Phase 2. |
| D12 (rev 2, partly settled) | Class teacher | A class teacher exists (`school_sections.class_teacher_member_id`) but has **no general access** to other subjects: only the sample-check items for pairs set to `class_teacher`. If you also want them to see their section's results read-only, say so. |
| D15 | Access, correction and erasure requests for school students | Handled by the school as controller; PrepPlan provides export/erase tooling at the school's request. Out of Phase 1 build, but the terms must say so. |
| D16 | AI provider terms for school student answers | Confirm the provider's no-training and retention settings for the API key used for schools, and record them in the school terms. Consider a separate API key for school traffic so spend and settings are isolated. |
| D17 | At lock, skip points and fix-it cards for school students (section 3.4), keep mastery and the adaptive ledger for the report | Yes. Tell me if you want the adaptive ledger skipped too (the report's "topics to fix" would then be computed only from that exam). |
| D18 | The earlier D7 sample check rules (advisory, widen to 20% if more than 10% changed) | Unchanged, but now run by the class teacher by default. |
| D13 | Who may release a section: the assigned teacher only, or admin too? | Assigned teacher; admin only to reassign. Principal read-only. |
| D14 | What language/script must the marking handle (English only, or Telugu/Hindi answers too)? | English in the pilot. A multilingual answer is a Phase 2 spike because the marking and transcription accuracy are unknown. |

## 9. Out of scope for this plan

No code, no migrations written, no spreadsheet edits, no F-numbers, no change to `CLAUDE.md`, nothing
run against production, nothing pushed or deployed. Tests described here run only on the local
`examprep_test` database.

## 10. Build log

| Step | State | Notes |
|---|---|---|
| S0 | Done 2026-10-29 | ADR-0003 accepted; CLAUDE.md "School module rules" added. F-numbers still to be assigned by the owner. |
| S1 | Done, committed `8d5fade` | Migration **0078** `schools_core` (the plan said 0077; the unmerged WhatsApp-login branch owns `0077_wa_login`, so every school migration number is one higher than in section 1.4: roster is **0079**, templates 0080, exams 0081, and so on). |
| S2 | Done, committed `ca1b001` (no F-number in the message: none assigned yet; amend when you give one) | Migration 0079 `school_roster`: `school_students`, `school_student_guardians`, `school_teacher_assignments` (one teacher per section-subject, `sample_checker`), `school_import_batches`, `students.school_id`, `audit_log.school_id` (moved forward from 0084 because setup changes are audited from now on). Services in `src/lib/schools/`; API: `POST /api/schools/:id/imports`, `.../imports/:batchId/commit`, `.../terms/accept`. Dependency added: `exceljs` 4.4.0. Tests 2, 4, 9, 15, 17, 18 plus parser unit tests pass; full suite 870 passed on a scratch local DB. |

Decisions taken inside S2 that the plan left open:
- School staff (teachers, the admin) have platform `users.role = 'teacher'` and `signup_type = 'school'`; that platform role has no consumer-route access, and everything school-side comes from `school_members`.
- A teacher whose e-mail already has a PrepPlan account is an import error (not silently attached).
- Commit is all-or-nothing in one transaction; a batch with any row error cannot be committed.
- A student with no parent phone is allowed; a present phone must be valid (10-digit Indian mobiles get +91).
- School people are created **without credentials**. Nobody added this way can sign in yet.

### Items this surfaced (to schedule, none built)

1. **Credential issue (new step, call it S2c).** Without it no school person can sign in, so S3's screens cannot be used by a real school. Proposal: the admin receives a one-time set-password link at provisioning; the admin then issues one-time links or codes to teachers and students from the roster. Needs a decision on delivery (admin hands out printed slips vs. e-mail to teachers) and on whether students use a roll-number + code login.
2. **S2b must also guard `resolveEnabledStudent`** (`src/lib/access.ts`): a school student has `users.role = 'student'`, so once she can sign in she would otherwise reach every consumer student route (paper generation, spend budget, rewards). That function is the single choke point.
3. **Platform provisioning** (`schoolsRepository.provision`) has no route on purpose; the owner runs it from a script. A small script is still to be written.
4. **Local test DB:** `examprep_test` has `0077_wa_login` applied from the unmerged WhatsApp branch, so this branch cannot migrate it until that merges. All S1/S2 verification ran on a scratch DB `examprep_schools_s1`.

| S2b | Done, committed `ce4a127` | **One central guard plus function-level guards, no migration.** `requireUser`/`requireRole` (every consumer route funnels through them) now return 403 `school_account` to any login with `users.signup_type = 'school'`; `resolveEnabledStudent` refuses a student with `school_id` as a second layer. Purpose-limit guards: `logProductEvent`, `recordPointsForConfirmedItems`, `recordFixitCardsForLostMarks`, `sendTransactionalEmail` (school logins get only `SCHOOL_ALLOWED_TEMPLATES`, empty for now), guardian invites (send, receive, accept), leaderboard query, both crons (shared `listOutboundStudents`), admin overview and activity statistics. Tests: a sweep that calls every method of every `src/routes/api` route as a signed-in school student and as school staff (about 100 calls, all must be 403), and a purpose-limit suite. Both were shown to fail when a guard is removed. Provisioning script `scripts/provision-school.ts` (`npm run schools:provision:test`): refuses any non-local database, no override flag. Full suite 893 passed on the scratch DB. |

Migration numbering (owner instruction: WhatsApp branch merges first, or renumber). I renumbered rather than merge: school migrations are 0078 and 0079 and the WhatsApp branch keeps `0077_wa_login`. They sort correctly whichever merges first, but if the school branch reaches production before WhatsApp, `0077` will then run later than `0078/0079`; Kysely's migrator refuses out-of-order runs, so merge WhatsApp first or tell me and I renumber again. `types.ts` will also conflict between the two branches (regenerate after the merge).

Known limits of S2b (stated plainly):
- "Never AI training data" is enforced in code only as far as the content-generation AI files never read answer or school tables (pinned by a test). Whether the model provider trains on API traffic is a provider setting (open decision D16), not something the app can enforce.
- The page routes (screens such as /home) are not guarded themselves; they get all their data from the API routes above, which refuse a school login. S3 adds the school screens.
- A public sign-up cannot produce `signup_type = 'school'` (the sign-up hook overwrites it), pinned by the S2 tests.
| S2c | Done, committed locally | Migration **0080** `school_credentials`: `school_credential_codes` (keyed hash only, one use, 7-day expiry, revocable, optional issuer) and `school_members.failed_logins` / `locked_until`. Staff: e-mailed one-time link (`/school/set-password?token=...`, the link is never shown to the admin) or a printed code (admin issues; the first admin's code is printed by the provisioning script). Students: school code + **admission number** + password (owner decision: class, section and roll change every year on promotion, the admission number never does; a roster row with none gets a generated permanent ID like `PK7M2P9X`, unique per school, shown on the slip); the class teacher (or the admin) prints one-time code slips per section (JSON or A4 PDF, 8 per page), the student sets her own password on first sign-in; the class teacher or admin resets (old password and sessions end at once; audited without the code). Five failures lock an account for 15 minutes. Parents: no login. API: `POST /api/school-login`, `/api/school-login/activate`, `/api/school-login/activate-staff` (public by design), and admin/teacher `POST /api/schools/:id/credentials/staff`, `/credentials/students`, `/students/:id/reset-password`. Mail: new template `school_credentials`, the only one a school login may receive. `sendTransactionalEmail` now returns `sent`/`skipped`/`failed`. |

Open items after S2c:
- **Student sign-in ID (settled by the owner):** the school's admission number, an optional `Admission No` column in the student upload, unique per school; a permanent ID is generated when missing. Promotion changes class, section and roll number only; a test proves the same ID still signs her in after she moves.
- **The screens do not exist yet** (`/school/sign-in`, `/school/set-password`): the links and slips already point at them; S3 builds them. Until then these are API-only and tested by calling the functions.
- **E-mail delivery** uses the existing Make webhook. If it is not configured, the admin API answers `emailStatus: skipped` and the admin falls back to a printed code.
- **Class teacher scope:** a class teacher can print slips and reset passwords for her own section only; the admin can do both for any section (your text named the class teacher; the admin as a fallback is my addition).
| S3 | Done, committed locally (screens in `docs/schools/screens-s3/`, printed slips page in `27-printed-slips-a4.*`) | Screens, mobile first, plain English, their own look (white, dark green, no sounds, no personal-app navigation): `/school/sign-in` (student: school code + ID + password; staff: email + password; no sign-up, no Google, no guest), `/school/set-password` (e-mailed link, or code slip for students and staff), `/school` (straight into the person's school), and under `/school/:schoolId`: Home (admin checklist, teacher's classes, student greeting), Terms, Classes (classes, sections, subjects, class teacher, who teaches what, who spot-checks), Teachers (upload, e-mail link or printed code), Students (by section, upload, slips PDF, new password code). New data endpoints: `GET /api/school-me`, `GET /api/schools/:id/overview`, `POST /api/schools/:id/setup`, `GET /api/schools/:id/sections/:sid/students`. A school login that lands on a personal PrepPlan page is sent to `/school`; school logins are left out of PrepPlan's own activity pings and sounds. Tests: API tests per role plus a 10-step Playwright run at 390 px wide (checks no sideways scroll and every control at least 44 px, no sign-up wording, code reuse refused, student and teacher first sign-in) with a screenshot of every screen. Full suite 922 passed. |

Open items after S3:
- The full text of the school terms is not in the app: the Terms page shows a short list of what the app does with student data and a clearly marked placeholder box. The owner supplies the document (set `TERMS_DOCUMENT` in `src/lib/schools/terms-document.ts` and bump `CURRENT_SCHOOL_TERMS_VERSION`). Do not onboard a real school before that.
- The school browser tests (`e2e/schools.spec.ts`) are part of the existing CI `e2e` job (ephemeral Postgres 17 only; the Playwright config refuses any non-local database). The job keeps the screenshots as an artifact. The browser tests run without the dev server's floating developer-tools button (`VITE_NO_DEVTOOLS`), which covers the phone bottom menu.
- Printed slips: 8 to an A4 page (tested: 8 slips = 1 page, 9 = 2 pages). One-time codes and generated IDs use letters and digits without the look-alikes 0/O, 1/I/L. An admission number the school writes itself is printed exactly as written, in a monospaced face where 0 and O differ.
| S4 | Done, committed `971428f` | Paper layouts (templates): migration **0081** `school_paper_templates` (per school, versioned: an edit adds version + 1 and retires the old one, nothing deleted; one active version per layout). A layout is total marks, duration, rows (heading, kind of question: multiple choice / assertion and reason / short / long / case study, number of questions, marks each, how many have an OR) and the wanted thinking mix; it converts to the existing blueprint `Layout` (`toLayout`), and a test proves the ready-made 80-mark layout equals the generator's built-in CBSE pattern. Ready-made: **CBSE-style paper, 80 marks** (3 h; 20x1, 5x2, 6x3, 4x5, 3 case studies x4) and **Unit Test, 40 marks** (90 min; 10x1, 5x2, 4x3, 2x4). The two ready-made layouts and the Unit Test row mix are my reading, not copied from a real paper: check them. Chapters are chosen by book, part and chapter number (two chapters numbered 3 stay separate, labelled "Part I · Chapter 3" and "Part II · Chapter 3"). **Coverage preview** (`POST /api/schools/:id/templates/preview`): follows the generator's own rule for which question may fill a row; reports marks planned vs fillable per chapter, the remembering vs thinking split (planned vs what the bank's questions give), and every shortfall by chapter and kind of question, both as screen text and as the lines to print on the teacher's copy (`teacherCopyLines`; S5 prints them). A missing alternative of an OR costs the choice, not marks. API: `GET/POST /api/schools/:id/templates`, `GET /api/schools/:id/bank/chapters`, `POST .../templates/preview`. Screens: Papers, Change/Make a layout, Check against the bank. Bank depth report: `docs/schools/BANK_DEPTH_REPORT.md` + `bank-depth-by-chapter.csv` (script `scripts/bank-depth-report.ts`). |
| S5 | Built 2026-10-29, not yet committed | **One question paper per class and exam, the teacher copy, and a Smart Answer Booklet per student.** Migration **0082** (`school_exams` with a frozen copy of the layout and the gaps, `school_exam_sections`, `school_exam_questions` = the master paper, `school_booklet_layouts` = where every box and bubble sits in mm, `school_booklets`, `school_booklet_pages`). Paper: `buildMasterPaper` picks questions with the generator's own eligibility rule and pre-show checks (numbering, four options, section totals), spread over the chosen chapters, an OR's alternative from a different concept where possible; a gap never stops the paper, it is recorded and printed on the teacher copy (a missing OR alternative loses the choice, not marks). Documents: question paper (existing paper template; no answers, no correct option, no marking steps; test-proved), teacher copy (existing key template with a red "TEACHER COPY - NOT FOR STUDENTS" banner on every page, the answer key, the step-wise marking scheme and every gap), answer booklets (A4, fixed millimetre layout: name, ID, roll and section pre-printed; QR on every page; four corner marks; MCQ bubbles on page 1; one ruled box per written question, taller for more marks, one box for an OR; rough-work page; extra-space page; everything at least 7 mm from the paper edge; the printed page count is checked against the layout). Page QR = `PPB1-` + 26 characters from HMAC of school/exam/student/page, stored in `school_booklet_pages`, so a reprint is identical and the code says nothing about the child. Who: question paper = office, principal, teacher of the subject in all the exam's sections; teacher copy and booklets = office and that teacher only; **students and parents are refused everything (test-proved on every route)**. Screens: Exams, Make an exam paper, exam page with the gaps and the three PDFs. Also: coverage preview notes when a subject has no long-answer or case-based questions at all; the two ready-made layouts are labelled "Starting template: edit to match your school's pattern". Accidental formatting churn in 8 unrelated repository files from earlier prettier runs was reverted. Full suite 990 passed; browser run 14 passed. |

Decisions inside S5 that differ from the original plan (flag if you disagree):
- The student paper generator (`generatePaper`) is tied to one student (weak-concept weighting), so the exam paper uses its eligibility rule and checks but has its own selector.
- Per-student `papers` and `attempts` rows are NOT made at printing time. They are made when the answered booklets come back (S7); until then a booklet is identified by its QR pages only. This keeps the consumer tables untouched in S5.
- Principal can open the question paper but not the teacher copy or the booklets (least privilege; say if the principal should see the teacher copy).
- Printing a class of booklets was one request in S5; **S6 changed it to batches** (see the S6 row).
- Phone-photo reading of the booklet (corner marks, QR, box positions) is built into the layout but not tested with real photos yet (S7 spike).

| S6 | Built 2026-10-29 (owner's numbering: scan intake and QR sorting; the plan's section-9 table calls this S7), not yet committed | **Migration 0083** `school_scans_and_print_jobs`: `school_scan_batches`, `school_scan_pages` (status matched / duplicate / unreadable / manual / rejected; the picture is stored only as AES-256-GCM ciphertext; one current picture per booklet page, enforced by a partial unique index), `school_exam_absences` (cleared, never deleted), `school_print_jobs` and `school_print_job_parts`. All five are in the isolation registry and pass the schema lint. **Page reader** (`page-reader.ts`): finds the QR (several working sizes, contrast-stretched copy for shadows), turns the page upright from the QR's angle (any rotation, upside down included), finds the four corner marks and stretches the page to A4 (perspective correction). **Sorter** (`scan-service.ts`): one page per request; a page from another exam of the school is refused naming that exam; a page of another school is refused and nothing about it is kept or shown; an unknown code is refused; a repeat is kept as a duplicate; a teacher can re-upload one page (it replaces the current picture, the old one stays as a duplicate); a page with no readable code waits in a list until the teacher says whose page it is; a student can be marked absent (refused once her pages arrived; cleared automatically if one arrives). Pictures are served only through a signed, 10-minute link and only to the office and the teacher of the subject; the daily job blanks pictures past each school's `scan_retention_days` (rows stay). Routes under `/api/schools/:id/exams/:examId/`: `scan-batches`, `scans`, `scan-summary`, `scan-pages/:pageId/assign`, `absences`, and `/api/schools/:id/scan-images/:pageId`. **Booklet printing in batches** (owner instruction): `POST .../booklets` starts a job, `POST .../booklet-jobs/:jobId` makes the next batch (default 8 students), `GET` shows progress, `.../result` gives one joined PDF (kept 7 days, then blanked). The exam page shows a progress bar. Dependencies added: `sharp`, `jsqr`, `pdf-lib`. The per-student `papers`/`attempts` rows are still left to S7/S8 (agreed). |

S6 limits, stated plainly:
- A page whose QR cannot be read at all cannot be tied to a student by the machine; it waits for the teacher (by design, never guessed).
- Accuracy on **real** hand-filled photos is not yet measured. `test-fixtures/school-scans/` holds a printable practice booklet and the harness; the owner's photos go in `real/` and `real-scan-photos.test.ts` reports how many sorted correctly and fails on any wrong sort. Until then only synthetic phone photos (tilt, upside down, slanted, shadow, blur, grain, pen scribbles) have been measured.

S6 follow-up (owner review 2026-10-29): the booklet QR is now **30 mm** (was 20 mm; about 6 px per module in a 150-dpi A4 scan; content starts 44 mm from the top, bubbles at 118 mm). Synthetic tests now include flat scans at 150 dpi (1240 px), 150 dpi crooked, upside down, heavily compressed, and 100 dpi: every page read. The corner-mark finder now picks the rectangle that fits the page's geometry instead of the four most extreme blobs (a dark patch of desk had stolen a corner). **Nothing is shrunk or re-encoded on upload:** the browser sends a photo as the original file; a PDF page is drawn at 200 dpi as lossless PNG; a file over one request's limit (about 4.5 MB on Vercel) goes in pieces of at most 3.5 MB (`school_scan_chunks`, migration **0084**) and is joined on the server; the original is stored sealed in `school_scan_pages.original` (byte-for-byte equal, tested) next to the straightened copy in `image`; both are blanked at retention. The upload screen carries the note about original photos, WhatsApp and 200 dpi. `vite.config.ts` now also traces `sharp` and `@img/*` into the Vercel function (a local `vite build` with the vercel preset and the linux-x64 sharp packages shows `sharp-linux-x64.node` and `libvips-cpp.so` in `__server.func`; actual execution on Vercel is not yet verified, it needs a preview deployment).

S6 storage change (owner decision 2026-10-29): **no image bytes in Postgres.** Migration **0085** drops the bytea columns and keeps `image_key` / `original_key` on `school_scan_pages` and `storage_key` on `school_scan_chunks`. Files are sealed (AES-256-GCM) by the app and stored in a private Supabase Storage bucket `school-scans`, path `<school>/<exam>/<page>/original.bin|straightened.bin`, pieces under `<school>/_chunks/<upload>/<n>.bin` (deleted once joined). `src/lib/scan-storage.ts`: Supabase store (service key, server only), in-memory stand-in for every test (chosen whenever `VITEST`/`NODE_ENV=test`, even if storage settings are present), local-folder stand-in for development and the browser tests; a production runtime without the settings refuses uploads. Retention deletes the files and keeps the row with `purged_at`. A test pins that no column of the scan tables can hold bytes. Setup steps and the space estimate: `docs/schools/SCAN_STORAGE_SETUP.md`.

S6 storage rules update (owner decision 2026-10-29): migration **0086**. The **original** upload file is deleted 7 days after that exam's marks lock (`school_exams.marks_locked_at`, set by the later lock job), the straightened copy stays for the school's retention period; the row keeps `original_purged_at` with `original_key` cleared; each exam's deletion is logged (`school.scan_originals_purged`). Finished **booklet print PDFs moved out of Postgres** into the same private bucket (`<school>/<exam>/_print/<job>/`, sealed, deleted 7 days after the job; batches deleted as soon as they are joined). No `school_*` table has a bytes column any more (tested). Estimate updated in `docs/schools/SCAN_STORAGE_SETUP.md`.

---

## 11. Owner direction 2026-10-29: M1 to M4 (replaces S7 as the next work)

The numbering M1 to M4 is the owner's. Status: **M1 is built in this step; M2, M3, M4 are plans only.** Nothing here has an F-number; the rows at the end are proposals. Local and test database only: no push, no deploy, nothing in production. (The owner named this file `docs/schools/SCHOOLS_MODULE_PLAN.md`; the plan has always lived at `docs/SCHOOLS_MODULE_PLAN.md`, so the section is added here.)

### 11.1 Which class for the demo (re-confirmed from `docs/schools/BANK_DEPTH_PRODUCTION_2026-10-29.md`, read again, no new production query)

An 80-mark paper needs, per the built layout: Section D 4 long answers of 5 marks and Section E 3 case studies of 4 marks (plus ORs), drawn from the chapters the teacher picks (3 to 5 for a demo).

| Class | Maths | Science | Social Science |
|---|---|---|---|
| **7** | 222 long5 / 222 case, **14 or more in every one of 15 chapters** | 142 / 142, **6 or more in every chapter** (12 median) | 274 / 274, **12 or more in every one of 20 chapters** |
| 8 | 170 / 173 (12+ per chapter) | 157 / 161 (12+) | 242 / 243, but **Part II chapter 8 has 0 and 0** |
| 9 | 96 / 96 (12 per chapter, only 8 chapters) | 172 / 172 | 116 / 116 (10+) |
| 6 | **none at all** (0 long5, 0 case) | 145 / 148 | 174 / 175 |

**Class 7 is the right choice and the best of the four**: all three subjects are deep in every chapter, and Class 7 Maths is the deepest Maths (14 per chapter). Class 8 is the runner-up (one Social Science chapter is empty). Class 6 Maths and Classes 10 to 12 could not fill Sections D and E. One caution for the demo: Class 7 Science has a few chapters with only 6 long answers and 6 case studies, enough for one paper but thin if the same chapter is picked for many papers; the demo defaults to Maths first.

### 11.2 M1: usability and the demo school (built in this step)

**M1a. First sign-in wizard for the school admin.** One question per screen, a progress bar, plain English, "Skip for now" on every screen and a way out of the whole wizard. Screens: (1) your name and mobile number; (2) school name, city, board, and accepting the short school terms; (3) which classes the school has and how many sections each (the subjects Maths, Science and Social Science are added for you); (4) teachers: name, e-mail, which class and subject, "add another"; (5) students: upload the school's list or "I will do this later" (with the sample file); (6) "You are ready". The wizard stores only its position (`schools.wizard_step`, `wizard_done_at`); every answer goes through the same services as the existing screens, so nothing is done twice and every action is audited as before. The admin lands in the wizard on first sign-in; it can be reopened from the home screen.

**M1b. School home: three big actions.** After setup the home shows **Make a paper**, **Upload answer sheets**, **See results**. The old setup checklist moves below them. Teachers see the same three for their subjects.

**M1c. Demo school.** A school with `schools.is_demo = true`, created only by the provisioning script (`--demo`), never from the web. One Class 7 section A with **30 fictional students** (invented names, no real person, no guardian phone numbers), Maths, Science and Social Science added, a demo teacher and a demo office login. The teacher makes a **real** paper from the bank in one tap; **Use sample answer sheets** on the exam page then creates a set of **pre-filled sample results** for the 30 students, built from that paper's own questions and chapters:
- a **student report** per student: marks, how many lost marks were a **knowledge gap** and how many a **writing habit**, strengths, topics to fix;
- a **class habit heatmap** (students by habit);
- a few **teacher flags** (answers a teacher would be asked to look at).
The sample results use no AI call and no scanned image. Every demo screen carries a clear **DEMO - sample data** label. **Reset demo** archives the demo school's exams and sample results (`archived_at`; nothing is deleted) and the demo is ready to be used again. Demo data is separate by construction: it sits under the demo school's `school_id` like any tenant, the school is flagged, it is excluded from anything a real school or the platform counts, and demo endpoints refuse a school that is not a demo. **AI spend cap:** `schools.ai_spend_cap_inr` (demo default ₹50) is stored now and will be enforced by the AI steps (M3, M4); M1 spends nothing.

**M1 does not include** real marking, the student portal, scanned-sheet results or the Word export. The results screens are built so they can later show real results unchanged: M1 fills them from a generated sample, M4 from real marks.

### 11.3 M2 (plan only): the paper as an editable Word file, and its return

Download the master question paper (not the teacher copy) as **.docx**, edit freely, upload the final version. The upload goes through the **M3 reading and approval flow** (the same extraction and teacher approval), so a paper edited in Word is treated exactly like a school's own paper and the approved list becomes the exam's paper of record.

How Maths notation survives in Word (the question text in the bank is plain text with Unicode symbols, so this is a mapping, not an image):
- **Fractions, powers, roots, subscripts**: written as native Word equations (Office Math, OMML) so they stay editable. The bank's text is parsed with a small, tested converter (`a/b` between numbers or brackets to a stacked fraction; `x^2` and `x²` to a superscript; `√`, `π`, `°`, `≤`, `≥`, `≠`, `×`, `÷` kept as Unicode in the equation font). Anything the converter is not sure about stays as plain Unicode text rather than being guessed.
- **Font**: Cambria Math for equations, a normal body font elsewhere, so the file reads the same on any Word.
- **Figures and tables**: diagrams as embedded PNG at print resolution with alt text; tables as real Word tables.
- **Coming back**: the upload reader reads OMML back into the same plain-text notation (so `1/2` stays `1/2`, not a picture), keeps a hidden question id in each question's bookmark so edited questions are matched to their originals, and shows the teacher a **side-by-side diff** (changed, added, removed) before approval. A Word file with no bookmarks (the school retyped it) is read as an M3 "own paper".
- **Risks**: Word's equation editor stores some constructs several ways, and Google Docs and LibreOffice flatten equations on export. The mitigation is a fixed fixture set of the notation the bank really contains (pulled from the production bank, read-only) round-tripped in Word, LibreOffice and Google Docs before the step is called done, and an honest "we could not read this question" list rather than silent loss.
- Open decision for the owner: **docx generation library** (`docx` npm, MIT, supports OMML) against writing the XML ourselves. Proposal: `docx`.

### 11.4 M3 (plan only): "Use your own paper"

The school uploads its own question paper (Word, PDF or photo) and, optionally, its answer key.
1. **Read**: the file is turned into pages; an AI step extracts the structure (sections, question numbers, text, marks, options, OR choices, case-study stems with their sub-parts) as a typed list with a confidence per item. Maths notation is read from OMML for Word, and from the page image for PDF and photo.
2. **Map**: each question is mapped to a chapter and topic of the bank (book, part, chapter number, concept), with the match's confidence; unmapped questions stay unmapped and are marked "other" (they can still be marked, they just give no topic report).
3. **Teacher approves the list** screen by screen: edit text, marks, section, chapter. Nothing is marked until the list is approved. Approval is recorded (who, when) and frozen as a new version; later edits make a new version.
4. **The key**: if the school uploads one, it goes through the same read and approval. If not, the AI **drafts** an answer key and a step-wise marking scheme per question, clearly labelled "draft by PrepPlan AI", and the teacher **must approve or edit every question's key before any marking can start**; marking is blocked at the service level, not hidden in the screen.
5. **Answer sheets for a school's own paper**: PrepPlan prints a **QR cover page per student** (name, ID, exam, a code per page count the student declares or the teacher sets) to staple on top of the school's own answer sheets. The scan reader (S6) reads the cover QR and treats the pages after it, up to the next cover, as that student's. Fallback: **one upload per student, named by roll number** (`12.pdf`, `12-p3.jpg`), matched to the roster, with a clear list for names that do not match.
6. **Rules that stay**: the school-student purpose limit and the encrypted private storage (S6 and its follow-ups) apply unchanged; the school's paper and key are stored sealed like the scans; copyright of a school's own paper stays with the school (the terms must say so, flag for the owner's terms document).
- **Risks**: handwriting-free printed papers read well, photos of papers less so (hence the approval screen); mapping to topics is a judgement call (shown with confidence); a draft key can be wrong (hence mandatory approval).
- **Needs**: an AI provider choice and cost model per paper (the school spend cap above), and the owner's word on how long a school's uploaded paper is kept.

### 11.5 M4 (plan only): AI correction, with results in the student and teacher portals

Waits for the real-photo report on the scan reader. Then: marking per answer box against the approved key and step scheme (AI marks are final unless flagged; the flag, spot-check and dispute-window rules in CLAUDE.md "School module rules" apply as written), the teacher marking workspace for flags, release to the student portal, the lock job that sets `school_exams.marks_locked_at` (which starts the 7-day clock for deleting the original scan files) and the teacher portal's class results. The M1 results screens (student report, habit heatmap, flags) are the target design for this step: M4 replaces their generated sample with real marks without redesigning them. The student portal shows only a student's own results, after release, and never the key or paper beyond the CLAUDE.md exception.

### 11.6 Proposed backlog rows (working labels, not F-numbers; the owner assigns numbers)

| Working label | Story | Acceptance (short) |
|---|---|---|
| M1-A School setup wizard | As a school admin I set up my school one question at a time, and can skip any step | One question per screen, progress bar, skip on every screen, plain English, resumable, every action audited |
| M1-B School home with three actions | As staff I start my three common jobs from the home screen | Make a paper, Upload answer sheets, See results visible at phone width, tap targets 44 px |
| M1-C Demo school | As the owner I can show the product with a safe sample school | Created only by the provisioning script, 30 fictional students, labelled DEMO, separate, reset without deleting, spend cap stored |
| M1-D Sample results | As a teacher I can see what results will look like | Student reports (gap vs habit, strengths, topics to fix), class habit heatmap, a few flags, built from the real paper, no AI |
| M2-A Paper as Word | As a teacher I download the question paper as an editable Word file | Native equations for fractions and powers, round-trip fixture set passes |
| M2-B Edited paper back | As a teacher I upload my edited paper | Goes through M3 approval, shows what changed |
| M3-A Own paper upload and approval | As a teacher I use my own paper | AI extraction + chapter mapping, teacher approves before use |
| M3-B Answer key draft and approval | As a teacher I need no key to start | AI drafts key and scheme, approval mandatory, marking blocked until approved |
| M3-C QR cover page and per-roll upload | As a teacher I can scan the school's own answer sheets | Cover QR per student, roll-number fallback, clear mismatch list |
| M4-A AI correction and portals | As a student and teacher I see marked results | Per CLAUDE.md school marking rules, release, dispute window, lock |

### 11.7 M1 build log (built 2026-10-29, not committed; screenshots in `docs/schools/screens-m1/`)

- **Migration 0087**: `schools.is_demo`, `ai_spend_cap_inr`, `wizard_step`, `wizard_done_at`; `school_members.phone_e164`; `school_exams.archived_at`; `school_demo_results` (registry entry, composite FK, one open set per exam).
- **Wizard** (`/school/:id/welcome`, `lib/schools/wizard.ts`, `/api/schools/:id/wizard`, admin only): five questions, one per screen, a progress bar, "Skip for now" on every screen, Back, and "Leave setup, I will do it later". The first sign-in of a school admin is sent there; a finished or left wizard is not shown again and can be reopened by the API. Answers go through the existing services (class, section, subject, teacher, terms, roster upload), all audited.
- **Home**: Make a paper / Upload answer sheets / See results as three large buttons for the office and for teachers; the set-up checklist moves below.
- **Demo school**: `npm run schools:provision:test -- --demo ...` (local database only, no web route) makes Class 7 section A, 30 invented students (no guardian phone, reserved undeliverable addresses), the Class 7 subjects that have questions (or `--subjects CODES`), both ready-made layouts, a demo teacher (class teacher, all subjects) and one-time codes for the office and the teacher. `ai_spend_cap_inr` is 50; M1 itself spends nothing. A yellow "DEMO - sample data" bar sits under the header of every screen of a demo school. **Reset demo** archives the exams and sample results (nothing deleted; audited). Demo buttons are refused to any school that is not a demo; another school cannot open a demo school's results.
- **Sample results** (`lib/schools/demo-results.ts`): pure and deterministic, built from the paper the teacher just made and its chapters: student report (marks, marks lost to a topic not learnt against a writing habit, strong topics, topics to fix with why, habits with a tip, question by question), class view (average, spread, where marks were lost, topics to teach again, habit heatmap, a few teacher flags, every student). No AI, no image.
- **Tests**: 9 unit tests (sums, determinism, labels, plain words), 13 integration tests (wizard validation, permissions, demo set-up, sample results, isolation, refusal for real schools, reset), 13 phone E2E steps with screenshots; the existing 15 school E2E steps still pass. Full suite 1058 passed.
- **Known limits, stated plainly**: the demo uses whatever bank the database holds: on this machine that is small test content, so the screenshots show the layout, not the real Class 7 questions; in production the demo draws from the real Class 7 Maths, Science and Social Science bank. The sample results are invented and say so. Results for real schools do not exist until marking is built (M4); their screens say "Results appear here after the answer sheets of an exam have been marked."

### 11.8 Owner direction, same day: schools start themselves; order of the next work

Decisions (owner, 2026-10-29): (1) a school starts itself with Gmail or an e-mail and password, **active at once** (reverses "no public sign-up" for school **admins** only; students and teachers are still made by their school; CLAUDE.md updated); (2) the order is **sign-up, then DOCX (M2), then own paper (M3), then AI marking (M4)**; (3) AI cost: the existing AI set-up with a **per-school rupee cap** (`schools.ai_spend_cap_inr`, already stored).

**Step 1 built: school sign-up** (no migration). `/school/sign-up` with Continue with Google and an e-mail form (school name, town, your name, e-mail, password, a hidden robot trap); `POST /api/school-signup` makes the school, the first admin and a session; a Google login from a school page carries a marker cookie (`pp_school_intent`) so the one account-making hook (`src/lib/auth.ts`) makes a school login instead of a student, and `/school` then asks her to name her school (`POST /api/school-signup/create`). A student or parent login can never become a school login (refused with a plain sentence), an e-mail already in use is refused, the brake is 10 an hour and 40 a day for the whole platform (`SCHOOL_SIGNUP_MAX_PER_HOUR/_DAY`), and every sign-up is audited (`school.signed_up`, via email or google). The sign-in page links to it and offers Google to staff. Tests: unit (codes, which account a new login becomes), 6 integration, 4 phone E2E steps. **Known limits**: no e-mail confirmation (as decided), so a stranger can start a school with someone else's e-mail address (they cannot read anything of that person's, and the real owner of the address would find it taken; a reset-by-e-mail flow does not exist for school logins yet); the Google path was tested up to the button and the marker, the Google round trip itself needs the live Google credentials and was not run.

### 11.9 Step 2 built: the question paper as an editable Word file (M2, export half)

`GET /api/schools/:id/exams/:examId/question-paper-docx` (office, the subject's teacher, the principal; students and parents refused exactly as for the PDF; audited as `school.question_paper_docx_downloaded`) and a **Download the question paper (Word)** button on the exam page. Built with the `docx` library (MIT, added) from the **same data as the PDF**, so the two always agree, and it holds no answer, correct option or marking step (tested).

- Header table (name, roll, section, class, subject, date, maximum marks, time), general instructions, section headings with their totals, numbered questions with the marks (and the "(1+2)" split) at the right margin, options as (A) (B) (C) (D), OR pairs with one shared mark, diagrams as pictures, footer "Page X of Y", A4.
- **Maths:** `3/4`, `x/2`, `2.5/10` become real stacked Word fractions; `√9` and `√(x + 1)` become real radicals; `x^2`, `x²` and `H₂O` become raised or lowered text (editable by anyone, and they survive Google Docs and LibreOffice); symbols (≤ ≥ ≠ × ÷ π °) stay as text in Cambria. A slash that is not a fraction is left alone: `km/h`, `and/or`, dates `12/10/2026`, chains `1/2/3`, `Rs 20/-`. Anything the converter is unsure of stays exactly as typed.
- **Round trip:** each question carries a hidden bookmark `ppq_<exam question id>`, so an edited file can be matched back to the exam's questions. **The upload half (edited paper back, with a side-by-side "what changed" before approval) is part of step 3** (own paper), which has the reading and approval screens.
- Tests: 13 unit (maths parsing, real .docx structure read back with a zip reader: equations, radicals, raised text, bookmarks, the picture, no answers), 2 integration (same people as the PDF, bookmarks match the exam's questions), and the browser download test. A sample, `test-fixtures/school-docx/sample-question-paper.docx`, is there to open in Word.
- **Not yet checked: opening in Microsoft Word itself.** No Word or LibreOffice is available here; the file's parts are well-formed XML and the library is widely used, but please open the sample once in Word and in Google Docs and tell me anything that looks wrong (especially the fractions and the margin marks).

### 11.10 Step 3 built (first part): "Use your own paper"

**What a school can do now.** From the home screen, "Or use your own paper": choose the class and subject, name the paper, upload a **Word file**, a **PDF that has text**, or **photos of the pages** (JPG or PNG, up to 12), and optionally the school's **answer key** (Word, PDF or photos). PrepPlan reads it **in small steps with a progress bar** (one AI call per request, so no request runs long and a failed step can simply be repeated), matches every question to a chapter of the bank, reads the school's own key (or drafts one), and the teacher checks it: change a question's wording, marks or chapter, remove or add a question, write or edit an answer. Then **Approve this paper**, and **approve every answer** (one by one, or all drafts at once).

**The rules, in code (migration 0088, `school_own_papers`, `school_own_questions`):**
- **No marking from a draft.** `assertPaperReadyForMarking` (the one door every marking step must use, tested) refuses until the paper is approved by a teacher AND every question's key is approved by a teacher. An answer the AI drafted counts for nothing until a teacher says yes; a question whose wording is edited loses its approval; an approved paper is frozen (a key can still be corrected, and then needs a new yes).
- **Edited PrepPlan paper (the upload half of the Word step):** a Word paper PrepPlan made and a teacher edited in Word is recognised by its hidden question markers and **read exactly, with no AI**. Each question is matched to the printed one, takes that question's chapter, and the unchanged ones keep the bank's own reviewed answer; the changed ones are flagged "You changed this" and get a new key (drafted, then approved).
- **Cost:** a rupee cap per school per calendar month (`schools.ai_spend_cap_inr`; default **Rs 10,000** (owner decision 2026-10-30; it was Rs 100) for a school with no figure of its own, Rs 50 for the demo), checked before every reader call, plus the existing global and per-household daily call caps. The reader's calls are logged in `ai_jobs` against the school's own household (features SCH-01 read, SCH-02 map, SCH-03 draft key, SCH-04 read key). **Nothing about a student ever goes to the reader**: only the paper's own text or pictures and the subject and class (tested).
- **Storage:** the uploaded files are sealed (AES-256-GCM) in the private bucket under `<school>/_own/<paper>/`; no school table can hold file bytes.
- **Reading, honestly:** a PDF that is only a picture is refused with the advice to send the Word file or photos (the server cannot draw PDF pages as pictures); a very long paper is read in pieces; an item the reader gives back in the wrong shape is dropped and counted, never guessed; a reader reply that cannot be used leaves the paper where it was with a plain "Try again".

**The rest of step 3 is in 11.11 below.**

**Needs from the owner:** (1) ~~Is Rs 100 a month the right default?~~ Decided 2026-10-30: Rs 10,000 a month (`DEFAULT_SCHOOL_AI_CAP_INR`). (2) A first real try of the reader on a real school paper (the tests use a scripted stand-in; the prompts have never run against a live model), ideally Class 7 Maths from the Word file of an actual school. (3) How long to keep a school's uploaded paper (now: as long as the school).

### 11.11 Step 3 built (second part): cover pages and the answer sheets of a school's own paper

**What a school can do now.** On an approved own paper, an **Answer sheets** card: choose the section, **Print the cover pages (PDF)** (one A4 page per student: name, class and section, roll number, student ID, and a code), staple each student's cover on top of her own answer sheets, and **upload the scanned stack** (a PDF or photos, in order). Each cover starts that student's pages; the pages after it are hers until the next cover. The screen then shows, per student, how many pages arrived, and which students have none yet. Screens: `docs/schools/screens-own-paper/op-07` to `op-10`, the cover page itself `op-07b-cover-page.png`.

**Without covers:** "No cover pages? Upload one file per student", each file named by the roll number (`12.pdf`, `12-p2.jpg`, `roll 12.png`), matched to the section chosen above; a name that matches no roll number is listed and **not sent**. A page that arrives with no cover before it waits under **Pages waiting for a student**, with a picture to look at and a student picker; nothing is guessed.

**The rules, in code (migration 0089, `school_own_covers`, `school_own_sheets`):**
- A cover code is made once per student and paper (an HMAC, not guessable) and printed the same every time. The cover has the same four corner marks and the same 30 mm QR as the exam booklets, so the existing page reader straightens and reads it; the code is `PPC1-…`, so a booklet page of a PrepPlan exam (`PPB1-…`) is told apart and refused.
- Refused, and **nothing of it is kept**: a page of an exam booklet, a cover of another school, of another paper, a code PrepPlan never made, a student outside the teacher's sections, a file that is not a picture.
- Who: the office and the teacher of that subject and section only. Students, parents and other schools never (another school gets "not found", as everywhere in the module). Tested route by route.
- Storage as for scans: sealed (AES-256-GCM) under `<school>/_own/<paper>/sheets/`, pieces of at most 3.5 MB joined on the server (originals are never shrunk), signed 10-minute picture links, removed by the daily clean-up after the school's retention days; the row stays with `purged_at`. No school table holds file bytes (the existing test covers the new tables).
- **Not marked yet.** Marking these sheets is step 4 (AI marking), which waits for the owner's real-photo report.

**Production:** migration 0089 is **not** run on production and nothing is pushed. Both wait for the owner's go-ahead. As with step 3's first part, uploads need the Supabase bucket settings in Vercel.

### 11.12 A new look for the school screens (2026-10-30, owner: "better UI, world-class design")

One design pass over the whole school area, done in the shared pieces so every screen follows. No wording, button names or rules changed (the browser tests find screens by those words and still pass).
- **Look:** a calm light-grey page, white cards with a soft shadow and rounded corners, one dark green for actions; Manrope for text and Plus Jakarta Sans for headings (both already loaded by the app); a green focus ring on every control; checkboxes in green.
- **Frame:** the header carries a PrepPlan for Schools mark, the school's name and who is signed in (on a phone, Sign out becomes an icon so the school's name fits); wide screens get tabs with icons, phones a bottom bar with icons that respects the iPhone home bar.
- **Home:** a welcome banner, the three big actions as icon cards (the first one filled), the figures with icons, and the set-up steps with a progress bar ("5 of 7 done").
- **Sign-in, sign-up, first password:** one frame (`src/components/school/auth-shell.tsx`); on a wide screen a green panel beside the form says what the product does. The student/staff choice on sign-in is a segmented control.
- **New shared pieces** in `src/components/school/ui.tsx`: `PageHeader`, `Stat`, `EmptyState`, `Loading`, `linkButton`; `Notice` has icons, `Chip` has a red tone.
- **A real fix found on the way:** the app's global link colour (unlayered CSS) beat every colour class on a link, which is why the school code had to force colours with `!`. In the school area it now steps back (`color: revert-layer`), so a link's own colour works.

Screens of the new look: `docs/schools/screens-design/` (phone 390 px; `26-admin-home-desktop.png` for a wide screen).

## 12. Owner direction 2026-10-30: two parts, student-wise upload, wrong-upload checks (PLAN, not built)

### 12.0 The PDF bug on the live site (read-only findings, nothing changed)

- **What happened:** both tries of "Open the question paper (PDF)" on the demo school's exam (2026-10-30, started 06:49 and 07:04 IST) ran for 300 seconds and were stopped by Vercel ("Task timed out after 300 seconds", route `/api/schools/…/exams/…/question-paper`). No other error. These are the only PDF requests in the last 7 days, so there is no successful production PDF to compare with; git history has no proof a PDF ever completed on Vercel after the switch to serverless Chromium (2026-10-04, `7164eca`).
- **Not the storage bucket (suspect a):** the question paper and the teacher copy are made and sent straight back; they never touch storage. Answer booklets do go to storage, and without the bucket they are refused at once in plain words, not after 5 minutes.
- **Not sharp (suspect b, first half):** the question paper does not use sharp.
- **Chromium on Vercel (suspect b, second half): the cause.** The only steps with no time limit are inside the Chromium render (`src/lib/pdf/render.ts`): extracting/launching `@sparticuz/chromium`, `document.fonts.ready`, `page.pdf()`. One of them never returns on Vercel. Which one cannot be read from the logs: Vercel Hobby keeps runtime logs for one hour and a timeout leaves no stack.
- **Proposed fix (needs your approval to deploy):** (1) every Chromium step gets a time limit and a log line, so a failure ends in under a minute with a plain message ("The PDF could not be made. Download the Word file instead.") and the log names the step; (2) then fix that step (most likely the serverless Chromium settings: `headless: 'shell'`, its own fonts, more function memory). Until then, **the Word download works** (it does not use Chromium).
- Separate, older: "max clients reached" database errors on 2026-10-13 to 10-27 (connection pool of 15 full). Not related to PDFs; worth a look later.

**Live in production now:** school code `demo-prepplan` ("PrepPlan Demo School", demo, active, AI cap Rs 50, 30 students, 1 exam); it is the only school. Migrations: 88 applied, the last 13 being 0076 and 0078–0089 (0078–0087 on 2026-10-29 15:24 UTC, 0088 at 17:35 UTC, 0089 on 2026-10-30 00:35 UTC). 0077 is the retired WhatsApp branch's and was never applied. Code: `b93d814`.

### 12.1 Two parts, chosen after set-up

- After the set-up (school details → teachers → students) a last wizard question: **What will you use PrepPlan for?** "Make exam papers", "AI correction of answer sheets", or both (both ticked by default). Stored as `schools.modules` (`text[]`, migration 0090). Changeable later in a new **Settings** screen (office only), with the same two ticks.
- The home screen shows only the chosen part(s): papers → "Make a paper"; correction → "Correct answer sheets" and "See results". The nav follows: "Papers" (layouts) disappears from the bar; "Exams" stays for papers; a new "Correction" tab appears for correction. Turning a part off hides it; nothing is deleted.

### 12.2 "Make exam papers", simpler

- The layout editor (today's "Papers" tab) moves under **Settings → Advanced: paper patterns**.
- "Make a paper" asks for: class and sections, subject, chapters, and a **pattern**: *Unit Test, 40 marks*, *Half-yearly, 80 marks* (the two ready ones that already exist) or any pattern the school saved. No layout screen in between.
- The made paper offers four downloads: **question paper (PDF, Word)** and **answer key (PDF, Word)**. The answer key Word file is new (same builder as the Word paper, with the answers and marking steps). Answer booklets stay available, but under "Answer booklets (optional)".

### 12.3 "AI correction", usable on its own

A new **Correction** area, `/school/:id/correction`:
1. **Choose the paper**: "Upload your own paper" (today's own-paper reader) or "Use a paper made here" (one of the school's PrepPlan exams; it is turned into the same kind of record, every unchanged question keeping the bank's reviewed answer). Either way the **answer key must be approved by a teacher** first (the existing rule, `assertPaperReadyForMarking`).
2. **Upload answer sheets student by student**: choose the section, tap a student, add that student's pages (camera or files, in order). Students write **name and roll number at the top of every sheet**; no QR booklet or cover page is needed. The list shows each student as *not yet / checking / ready / needs you / refused*.
3. The QR cover pages and booklets stay as an optional faster way for schools that print them; they are not required.

### 12.4 Wrong-upload checks, before any marking (per student upload)

Run when a student's pages are added; nothing is marked until they pass or a teacher confirms.

| Check | How | Sent to the AI |
|---|---|---|
| Same image used for two students | SHA-256 of the file (exact copy) and a 64-bit perceptual hash of the straightened page (same photo re-saved, resized or re-compressed), compared with every page of this paper | nothing (done on our server) |
| Blank page | share of dark pixels on the straightened page | nothing |
| Unreadable page | sharpness (blur) and size checks | nothing |
| Name and roll on the sheet | AI reads the handwritten **top strip only** (a crop of the top ~12% of each page) and returns the name and roll it sees; **the comparison with the class list is done on our server**, never by the AI | the top-strip crop only; no student list, no names from us |
| Right exam and subject | AI looks at the page (downscaled) and says whether it is a handwritten answer sheet, a question paper, or something else, and which question numbers it can see; we compare those numbers and the subject with this paper | the downscaled page, the subject name and the question numbers of this paper |
| Photo of the question paper / not an answer | same AI look as above ("question paper" or "other") | as above |

**Decisions:** a *clear* mismatch is **refused with a plain reason** ("This page is the same photo as Ravi K's page 2", "This is a photo of the question paper, not an answer sheet", "The page is blank"). An *unsure* result asks the teacher ("The name on this sheet looks like **Ravi K** (roll 2). You chose **Asha Rao** (roll 1). Is this Asha's sheet?" → Yes, it is hers / No, move it to Ravi K / Remove). A clear pass is accepted. **Every decision is logged** (new append-only table `school_upload_checks`: page, check, result, the AI's raw answer where one was used, who decided, when) and in `audit_log`. The AI calls are cheap (one small vision call per page, the cheapest tier), go through the existing provider chain, and count against the school's monthly AI allowance; when the allowance is used up, the AI checks are skipped and the teacher is asked to confirm instead (never silently accepted).

Thresholds (starting values, tuned on the owner's real photos): perceptual-hash distance ≤ 6 of 64 = same image; ≥ 98.5% white = blank; name match by a forgiving comparison (initials, spelling slips), "unsure" in between.

### 12.5 Data changes (migration 0090, local first)

- `schools.modules text[] not null default '{papers,correction}'`.
- `school_own_sheets`: `sha256`, `phash` (bigint), `check_state` (`pending | passed | needs_confirm | refused`), `check_summary` (short plain reason). Existing rows untouched.
- New `school_upload_checks` (append-only, school-scoped, in the tenant registry): `sheet_id`, `check`, `result` (`pass | unsure | fail | skipped`), `detail jsonb`, `ai_job_id`, `decided_by_user_id`, `created_at`.
- No file bytes in Postgres (as now).

### 12.6 Screens (each gets a phone screenshot)

Wizard "What will you use PrepPlan for?"; Settings (parts + Advanced: paper patterns); Home for papers-only, correction-only and both; Make a paper with the pattern picker; the made paper's four downloads; Correction list; choose a paper; student list with states; one student's upload; the teacher-confirm prompt; a refused upload.

### 12.7 Order of work

1. Migration 0090 + modules + wizard question + Settings + home/nav (tests: each combination shows the right things).
2. Make-a-paper with patterns; layouts under Advanced; answer key Word + PDF.
3. Correction area: choose a paper (own or made here), student-wise upload.
4. Checks: fingerprints, blank, blur (no AI) first; then the AI top-strip and page-kind reads (fake AI in tests; prompts tried on real photos when you send them).
5. Screenshots, docs, full test run, one local commit per step. **Nothing to production without your approval** (0090 and the PDF fix both need it).

### 12.8 Built (local only, 2026-10-30): what changed against the plan

All of 12.1 to 12.4 is built and tested on the local scratch database; **nothing is in production** (migration 0090 and the PDF fix both wait for the owner). Screens: `docs/schools/screens-restructure/`.

- **Parts (12.1):** as planned. On a phone the bottom bar is Home, Students, Exams (papers), Correction (AI correction), Settings; Classes and Teachers are reached from Settings (a phone bar has no room for seven).
- **Make a paper (12.2):** ready patterns are offered as "Unit Test, 40 marks" and "Half-yearly, 80 marks" (the latter is the existing CBSE-style 80-mark layout); a ready pattern is saved for the school the first time it is used. Four downloads: question paper PDF/Word, answer key PDF/Word. The booklet scan card shows only when the school uses AI correction.
- **AI correction (12.3):** the Correction tab. "Use a paper made here" copies the printed paper (sections, OR pairs, options, chapters) with the bank's answers as **drafts** a teacher must approve (as the owner asked: upload paper → approve key → upload sheets). Student-by-student upload appears only once every answer is approved. Cover pages and roll-number files sit under "Other ways (optional)".
- **Checks (12.4), one change from the plan:** the "same image" fingerprint is a **32 x 32 thumbnail compared by correlation**, not a 64-bit perceptual hash. Measured on generated answer pages: the 64-bit hash put two *different* pages 4–9 bits apart and the *same* photo re-saved 1–7 bits apart (overlapping, so it would have refused correct pages); a 256-bit hash still overlapped (13–33 vs 34+). The thumbnail correlation separated them cleanly (same photo re-saved ≥ 0.985, different pages ≤ 0.834); thresholds: ≥ 0.97 refused, 0.93–0.97 asks the teacher. A second photo of the same sheet (taken again) is a different picture and is not caught by this check; the name check still applies to it. A blur measure was tried and dropped (it did not move steadily with blur); "unreadable" comes from size (< 600 px) and from the AI.
- **Blank thresholds:** under 0.1% dark pixels refused as blank, under 0.25% asks the teacher (lowered from the plan's 0.25% / 0.6% after typed test pages with a few lines tripped them).
- **AI calls:** SCH-05 (top strip only, cheap tier) and SCH-06 (the page with the strip blanked, shrunk to at most 1024 px, cheap tier). Tested: the strip is a strip, the second picture arrives with its top white, and no name from the class list is ever in what is sent. With the AI not set up or the allowance used up, every page asks the teacher.
- **Two bugs found by the browser tests and fixed:** (1) sharp shrinks before it composites, so blanking the strip on a photo wider than 1024 px failed; (2) the dev server answers an `<img>` request for a page picture itself (404), so the pictures are fetched and shown from memory.
- **Not yet:** marking itself (step 4 of the original order) still waits for the owner's real-photo report; the thresholds above should be re-tuned on those photos.

## 13. M4 stage 1 (owner direction 2026-10-30): the marking engine

Local and test database only. Built: migration `0091_school_marking` (`school_sheet_marking`: where each student's marking stands; `school_answer_marks`: one row per student and question, with what each of the three passes said), `src/lib/schools/marking-logic.ts` (pure rules) and `marking.ts` (service). No screens yet (stage 2), no real-AI run yet (stage 3).

- **Marking a student** (`markStudentSheets`): needs an approved paper with every key approved, the student inside the caller's classes, at least one usable page, and no page still waiting for the teacher's yes. The AI is sent the page pictures (the name strip of the first page painted white) and the questions with the approved key, never a name, roll number or ID. Three passes over the same pages; AI feature `SCH-07` (strong tier, vision providers), counted against the school's rupee allowance like every other school AI call.
- **Rules per answer**: multiple choice is marked from the key in code (the AI only reads which letter was chosen); a written answer takes the middle of three marks; the three passes disagreeing, a reading below 0.5 confidence, a question found in some passes only, or fewer than three usable replies flag the answer for a teacher. Found in none of the three: zero marks, not a flag ("no answer found"). Marks are in half-mark steps, never above the question. An OR pair counts once, as the better answer.
- **Why marks were lost**: each lost mark is `knowledge_gap` or `writing_habit` by majority of the passes, `unclear` when they disagree, `none` when nothing was lost.
- **Student status**: checking, marked, needs_teacher (something flagged), rejected (plain reason). A re-upload and re-marking replaces the AI marks and logs the old ones (`school.marking_rerun`).
- **Teacher** (`setAnswerMark`): any answer, flagged or not, in half-mark steps with a reason; logged (`school.mark_changed`); when nothing is flagged any more the student is marked and her total follows.
- **Not built yet**: the 5 % spot-check queue, release to the student, the dispute window (5 flags, one AI re-read that may only keep or raise), the lock job, the student and teacher portals, class results.

## 14. M4 release, the student's flags and the lock (owner direction 2026-10-31)

Local and test database only. Built: migration `0092_school_release_and_disputes` (`school_paper_releases`, `school_answer_disputes`), `src/lib/schools/results-release.ts`, the release panel on the paper page, and the student's "My results" screens.

- **Release is per section** (teacher of that section, or the office). Blocked while any student of the section has sheets that are not marked, is being marked, has answers waiting for a teacher, or could not be marked. Students with no sheets do not block it. The window is the school's `dispute_window_days` (default 7) from that moment, kept on the release row.
- **After release the marks are fixed:** marking again and the teacher's direct mark change are refused for that section. A mark can then change only through a flag.
- **The student** (role `student`, her own record only) sees the papers released to her section in which she was marked: her marks, her answer as read, the correct answer next to it (CLAUDE.md exception 2026-09-22; no download), what to work on, and her flags. A paper not released, or in which she was not marked, answers "not available", never a different message.
- **Flags:** at most 5 per student per paper, one per answer, a reason of 5 to 500 characters, only while the window is open and only on an answer without full marks. The AI re-reads once (with her reason) and may only keep or raise; a raise settles it. A kept mark can be sent to the teacher ("Ask my teacher") while the window is open. With the AI off or over the allowance a flag goes straight to the teacher. The teacher's decision is final, may raise or lower, needs a reason the student sees, and is logged.
- **Lock:** `lockDueReleases` locks a release once its window has closed and no flag is still with a teacher (a flag the student left after the AI's answer does not hold it). It runs when results are read, and can be called by a scheduled job. Locked marks are what mastery and reports use. `school.marks_locked`, `school.results_released`, `school.answer_flagged`, `school.dispute_to_teacher`, `school.dispute_decided` go to `audit_log`.
- **Purpose limit kept:** no e-mail, no notification, no points or ranking, no analytics event for any of this.
- **Not built:** the 5 % spot-check queue; the student's own answer picture next to her marks (she sees the text read from it); a scheduled job to lock without anyone opening a page; the principal's view; parents. The 7-day deletion of the original scan files after the lock is not connected to own papers yet.

## 15. Progress Report (student and parent) and Class Progress (teacher): PLAN, awaiting the owner's approval

Owner direction 2026-10-31. **Plan only: nothing in this section is built.** No F-number (the owner assigns one). Original design and wording; no other product's layout, names or copy. Local and test database only until the owner approves.

### 15.1 What this stands on, and what is missing

Already built and reused: locked marks (`school_paper_releases.locked_at`, section 14), per-answer marks with `loss_kind` (knowledge gap / writing habit) and a free-text reason (`school_answer_marks`), the student's "My results" screens and flags, the teacher's release panel and flag queue, the demo school and its sample-results generator (`demo-results.ts`, whose five habits are the starting list), the dark theme (`.dark`), the server PDF renderer, the Excel library.

**Missing, and therefore part of this build** (stated plainly so it is not discovered later):
1. **No language toggle exists in the web app.** Telugu is only in PDF fonts. This build adds a small dictionary and a toggle for these screens. **Scope of Telugu:** all screen text, level names, habit names and tips, the PDF and the WhatsApp text. **Not translated:** question text, the AI's per-answer reasons and the school's own wording (they stay as authored, in English). A translation of those would be a second AI step; not proposed here.
2. **The AI does not yet name the habit.** Marking stores `writing_habit` plus a sentence. Habit trends need a code, so the marking output gains a `habit` field (`skipped_steps`, `units_missing`, `stopped_early`, `misread_question`, `other`). Older marks have none and count as `other`.
3. **Marks per step are not stored** (the AI returns them; they are dropped). The exam report's "marks per step" needs them stored. Older marks show the total only.
4. **A topic is not recorded on an answer.** A paper made here keeps the bank question, so its topic is the **concept** (through `source_exam_question_id`); a school's own paper has only the **chapter**. Rule: topic = concept where there is one, else chapter. Both are shown under the same word "topic".
5. **Parents.** The role `parent` and `school_student_guardians` exist, but nothing lets a parent sign in or see a child. CLAUDE.md allows no guardian invite and no account linking. Proposal: **the school creates the parent login** like it creates staff (a code on a slip), read-only, one login per guardian, seeing only their own child's Progress screens and PDF. See decision D2.

### 15.2 The level rule (exact)

Words: **Beginner, Progressing, Proficient** (the CBSE Holistic Progress Card words). "Not yet assessed" when a topic has no evidence.

**Evidence.** A topic's score in one exam = marks earned / marks available on that topic, from **locked** marks only (never a paper whose window is open, never a flag still with a teacher). An exam counts as evidence for a topic only if the topic carried **at least 2 marks** in it (one 1-mark question is luck, not evidence).

**Band of one score:** high ≥ 75 %, middle 50 to 74 %, low < 50 %. (Proposed thresholds; a school setting later.)

**Walk the exams in date order, keeping a current level.** First evidence: low → Beginner, middle → Progressing, high → **Progressing** (one exam never makes anyone Proficient).
- **Up:** the level rises one step when the **two latest** scores are both at or above that step's bar: Beginner to Progressing needs two scores ≥ 50 %; Progressing to Proficient needs two scores ≥ 75 %.
- **Down:** the level falls one step only when the **two latest** scores are both below the current level's bar (below 50 % for Progressing; below 75 % for Proficient). **One bad test changes nothing** except a "dip" mark shown beside the level.
- Otherwise the level stays.

So the level is the most recent *consistent* performance, with memory: someone Proficient who scores 40 % once stays Proficient (with a dip mark); a second weak score in a row brings her to Progressing. Worked examples and a table test will be in the code (`topic-level.ts`, pure, no database). Exams of different weight do not change the rule; the score of a topic is a fraction.

**Subject tile:** "ring of topics at Proficient" = Proficient topics / assessed topics. **Subject trend arrow:** the latest locked exam % of the subject against the one before (up, flat within 2 points, down).

### 15.3 Student and parent screens (phone first)

Header on every screen: **name, class, school** only. Language toggle (English / తెలుగు) and dark mode in the profile menu. Bottom bar: Progress, Subjects, Topics, Habits. Reached from "My results" too.

1. **My Progress.** One growth line (percentage per locked exam, this academic year, all subjects together, each point labelled with the exam). **This week's focus:** three items (topics or habits), chosen by rule: the topic with the biggest marks lost to "didn't know" in the latest exam; the habit that cost most marks over the last two exams; the Progressing topic closest to Proficient. **Personal best:** a badge when the latest exam is her best overall (or best in a subject), and always "your best so far: X %". Class rank is shown **only if the school turned it on** (default off); personal best is always shown.
2. **Subjects.** A tile per subject: latest %, trend arrow, the ring of topics at Proficient. Tap for the subject's exams and topics.
3. **Exam report, insight first.** Score and grade. **Where marks went:** one bar split "Didn't know" (blue) and "Writing habits" (amber), with the marks counted in each. **Three things to fix**, each with **Practise this** (see 15.6). Below, expandable: the **question grid** and, for each answer, her scanned page, **marks per step**, the reason, and **Flag this mark** while the dispute window is open (the existing flag flow).
4. **Topic map.** Every topic of the year at a level, grouped by subject then chapter, with the dip mark and "how this level was decided" in one plain line.
5. **Writing habits.** For each habit (steps skipped, units missing, stopped early, misread the question, other): marks lost per exam, as a small trend, and one tip.

**Also:** a **one-page parent summary PDF** (English or Telugu, chosen when it is made) and a **WhatsApp share** (a text summary through the share sheet; no stored link, as for PrepPlan students). An optional **three-question self-reflection** after each released exam: "Which question was hardest?" (pick a question), "What will you do differently next time?" (a short choice list plus free text), "How did you feel about this exam?" (a 3-step scale). It is stored for the Holistic Progress Card export and is **not** used for marking, levels, ranking or analytics.

### 15.4 Teacher "Class Progress" (a tab next to Correction)

1. **Topic heatmap:** students by topics, three level colours plus "not assessed", with the dip mark; filter by section and subject.
2. **Habit heatmap** per section: students by habit, marks lost over the last two exams.
3. **Flag queue:** the existing flags waiting for a teacher, brought into this screen.
4. **Students who need attention this week**, by a visible rule (any one): Beginner in 3 or more topics; latest exam 15 or more points below the one before; the same habit cost marks in each of the last two exams; no sheets handed in for the latest exam. Each row says which rule fired. (Proposed numbers.)
5. **Export** (CSV and Excel): one row per student and topic with the level and the number of exams behind it, and a second sheet with the self-reflections, shaped for entering into the Holistic Progress Card. The exact HPC column names are not known to me: I will use plain headers and the owner may send the sheet to match.

### 15.5 Data, in one migration (0093) and one pure module

`school_answer_marks`: `habit` (text, checked), `steps` (jsonb). `schools`: `show_class_rank` (default false). `school_exam_reflections`: one row per student and paper, her three answers, append-only in spirit (an edit is logged). Language is a per-person preference in the browser (no new column); the PDF takes the language at creation. Topic levels and trends are **computed on read** from locked marks (pure functions, no stored copy that could drift). Nothing here adds an e-mail, a notification, points or an analytics event; the school-student purpose-limit test sweep is extended to the new routes.

### 15.6 "Practise this"

The bank has questions per concept. A school student has no practice-attempt flow (CLAUDE.md consumer-flow guard), so this makes a **printable worksheet only**: a short PDF of bank questions for that topic (not the ones in her exam), with an answer page after it. No attempt, no marking, no mastery recorded. For a topic known only by chapter, it is a chapter worksheet. The answer page follows the CLAUDE.md exception (she has seen her marks for that topic).

### 15.7 Demo data

The demo school gets **three locked exams** (about four weeks apart) across Maths, Science and Social Science for its 30 students, written by a deterministic generator as real rows (papers, releases, marking, per-step marks, habits, flags, reflections), so every screen above is alive and the same each time. No AI, no image. The demo draws on whatever question bank the database has: on this machine that is small test content, so topic names in local screenshots will be the test bank's; in production they are the real Class 7 topics. Marked DEMO as before.

### 15.8 Build order (each slice tested, shown with phone screenshots)

P1 level rule + habit code + step storage + migration + tests. P2 student Progress, Subjects, Topic map. P3 Exam report with Where marks went, fixes, grid and flags, plus Habits. P4 Class Progress (heatmaps, attention, export). P5 PDF, WhatsApp text, Telugu dictionary, reflection. P6 demo seed and the full screenshot set. Out of scope: the Holistic Progress Card itself, parent chat, notifications, rank by default, Telugu translation of question text.

### 15.9 Decisions needed from the owner (my default if you say nothing is in brackets)

D1. Level thresholds 75 / 50 and the "two in a row" rule above [accept]. D2. Parents get a read-only login created by the school [accept; otherwise parents see only the PDF and WhatsApp text the student shares]. D3. Telugu covers screen text and fixed labels, not question text or AI reasons [accept]. D4. A topic needs at least 2 marks in an exam to count [accept]. D5. "Practise this" is a printable worksheet, no tracked attempt [accept]. D6. The "needs attention" numbers in 15.4 [accept]. D7. The first migration to production is run by the owner, as for 0091 and 0092 [accept].
