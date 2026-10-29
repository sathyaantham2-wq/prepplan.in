# PrepPlan for Schools: putting the demo on the existing PrepPlan database (option A)

Written 2026-10-29 at the owner's choice ("go for A"). **Nothing in this document has been done.** No
migration was run, nothing was deployed, production was not touched. The owner runs every production step;
each step below says what it changes and how to undo it.

## 0. What option A means

The school module runs on the same Supabase database as PrepPlan (`examprep-ai-dev`, the production one),
so the demo school can draw from the real Class 7 Maths, Science and Social Science bank. The demo school is
an ordinary tenant (its own `school_id`, flagged `is_demo`); it shares tables, not rows, with real students.
It is **not** a preview: the school screens go live on `www.prepplan.in` for anyone who finds `/school/sign-in`.
No real school exists yet, and a school login can only be made by the provisioning script or an existing admin.

## 1. Settled on 2026-10-29

1. **WhatsApp is retired** (owner decision): its branch will not be merged, so the gap at `0077` stays
   as it is. I checked production read-only (`begin read only` ... `rollback`, names and counts only):
   - it has applied 76 migrations, the last is `0076_student_unlocks`;
   - `0077` is **not** applied, there are no `school_*` tables and no `students.school_id` yet.
   So Kysely will simply run 0078 to 0087 after 0076; the missing 0077 file is harmless. I also ran the
   whole chain from an empty local database without any 0077: 86 migrations, 25 school tables, no column
   that can hold file bytes.
2. **Take a backup before step 4.** `SOURCE_DATABASE_URL=... BACKUP_PASSPHRASE=... scripts/db-backup.sh <dir>`
   (encrypted, writes row counts to verify a restore). Keep it until the module has run a week.

## 2. What the ten migrations do

| Migration | Adds | Touches an existing table? |
|---|---|---|
| 0078 schools_core | `schools`, `school_members`, `school_classes`, `school_sections`, `school_subjects`, `school_terms_acceptances` (+ a trigger that makes acceptances append-only) | No |
| 0079 school_roster | `school_students`, guardians, teacher assignments, import batches | **Yes: `students.school_id` (nullable) + a unique constraint `(school_id, id)`; `audit_log.school_id` (nullable)** |
| 0080 school_credentials | one-time codes, `school_students.admission_no`, lock columns on `school_members` | No (school tables only) |
| 0081 school_paper_templates | layouts | No |
| 0082 school_exams | exams, sections, questions, booklet layouts, booklets, pages | No |
| 0083 school_scans_and_print_jobs | scan batches/pages, absences, print jobs | No |
| 0084 scan_originals_and_chunks | extra scan columns and the pieces table | No |
| 0085 scan_files_in_storage | keys instead of bytes (drops two columns it never filled) | No |
| 0086 originals_after_lock_and_print_files | lock date, purge dates, print file keys | No |
| 0087 school_wizard_demo | wizard and demo columns, `school_demo_results` | No |

Existing PrepPlan data impact: **two nullable columns added to two live tables** (`students.school_id`,
`audit_log.school_id`) and one extra unique constraint on `students`. No data is rewritten, no row is
deleted, existing queries are unaffected (every consumer query that lists students already excludes
`school_id is not null`, tested). Adding a nullable column without a default is instant in Postgres.
The `students` unique constraint builds an index on a table of a few hundred rows: sub-second.

**Undo:** each migration has a tested `down`. Run `npm run db:migrate:down` ten times in reverse, or restore
the backup. Because nothing is stored in these tables until a school exists, rolling back before the first
real school loses nothing.

## 3. Steps, in order (owner runs 1 to 5; I prepare and verify)

1. Take the backup (section 1).
2. Merge this branch (or the pieces you approve) into `main`; do **not** deploy yet.
3. Create the private Supabase Storage bucket and the three Vercel Production variables
   (`docs/schools/SCAN_STORAGE_SETUP.md`). Without them the app refuses scan uploads but everything else works.
4. Run the ten migrations on production: `npm run db:migrate` with the production `DATABASE_URL`.
   Verify: `select name from kysely_migration order by name desc limit 3;` shows 0087, and the student app
   still works (health check: `POST /api/auth/sign-in/email` with a fake e-mail answers 401, not 500).
5. Deploy `main` on Vercel (the owner, or me **only** on the owner's explicit "deploy").
6. **Make the demo school** (written and tested, not run). `scripts/provision-school.ts` still refuses every
   non-local database. `scripts/provision-demo-school-prod.ts` is the separate, guarded script: it needs
   `--production`, a school code starting `demo-` repeated in `--confirm-code`, both e-mail addresses, and
   a typed `CREATE DEMO <code>`; it checks that migration 0087 is applied, that no school with that code
   and no other active demo school exists, and that Class 7 `MATH`, `SCI`, `SST` exist with chapters. It
   only creates (if it fails half way, the school is suspended, never deleted). Command:
   `DATABASE_URL='<production>' npx tsx scripts/provision-demo-school-prod.ts --production --name "PrepPlan Demo School" --code demo-prepplan --confirm-code demo-prepplan --admin-name "Demo Office" --admin-email <you> --teacher-name "Demo Teacher" --teacher-email <you+2> `
   It prints the two one-time codes once. Use your own two addresses.
7. Check: sign in as the demo teacher with the one-time code, make a paper, use sample answer sheets,
   reset demo. Check the student app is unchanged.

## 4. Safety facts you can rely on

- A school login cannot reach any PrepPlan student screen (403 `school_account`, tested by a sweep of every
  API route), and PrepPlan students cannot reach any school screen (a school role is needed; tested).
- The demo school's data sits under its own `school_id`; another school cannot read it (tested).
- Seed, fixture and E2E subjects can never be listed in production (guard, tested). The demo uses the real
  `MATH`, `SCI`, `SST` of Class 7 (`--subjects MATH,SCI,SST`).
- School students are excluded from analytics, e-mail, points and leaderboards in code.
- Nothing in M1 calls an AI provider, so the demo cannot spend money.

## 5. Known gaps to accept or close before real schools

- **School terms:** the full legal text is a marked placeholder; the short list in the app is not the legal
  document. Fine for a demo; a real school must not be on-boarded before the owner supplies it.
- **Scan storage** needs the bucket before any real scanning; the demo does not scan.
- **The real-photo report** for the scan reader is still pending; S7/M4 wait for it.
- **Vercel preview deployments** must not get the production database variables if they should stay
  separate; check `DATABASE_URL` targets before any preview deploy (still open).
- The M1 work, the storage change and the demo are **local commits / staged only**; nothing is pushed.

## 6. What is left

1. Backup, then merge to `main`, bucket and variables (steps 1 to 3). Whenever you are ready.
2. You run `npm run db:migrate` on production (step 4); tell me the result and I run the read-only
   checks again.
3. You run the demo script (step 6), or tell me to, once you have given your e-mail addresses and typed
   the confirmation yourself. I will not run it for you.
4. Deploy: only on your explicit "deploy".
