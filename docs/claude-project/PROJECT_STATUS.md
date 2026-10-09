# PrepPlan: status snapshot (2026-10-04)

Update this file whenever the picture changes; it is meant to be uploaded as Project knowledge.

## Built
- 110 of 131 backlog features Done, 8 In Progress, 12 Not Started (spreadsheet tab 03).
- Web app live at www.prepplan.in: paper generation, attempts, instant marking, mastery tracker,
  PDF export, adaptive practice, student-only sign-up, mastery sharing, install prompt, admin usage page.
- Question bank, all fully loaded to production: CBSE Maths Classes 6-12; Science 6-9;
  Social Science 6-9 and 10 (Geography only). See `CLAUDE.md` for per-book detail.
- Android TWA project builds in CI and locally.

## Not built
- P0: F105 AI accuracy harness, F109 UAT with real papers, F095 DPDP consent (placeholder copy).
- In progress: F005, F014 (Supabase free plan has no backups), F023, F051, F080, F107, F131.
- Not started: F019, F054, F081, F085, F088-F090 (Telugu), F100-F102 (plans, payments, tutors).
- Content gaps: Class 10 Science; Class 10 SST History/Civics/Economics; Class 11-12 Science and
  SST; Class 9 Maths Part II.

## Android launch checklist
- [x] Local toolchain on the Mac (brew openjdk@21, gradle, Android SDK 36); local debug build OK
- [x] Student self-delete in Settings and `/delete-account` page (done 2026-10-01)
- [x] Domain live; privacy and delete-account pages live
- [ ] Owner: create upload keystore (`~/prepplan-keys/upload.keystore`), back up twice
- [ ] Set 4 `ANDROID_*` GitHub secrets, run Android workflow, get signed `.aab`
- [ ] Owner: `support@prepplan.in` mailbox (no MX records yet), send a test mail
- [ ] Owner: Play Console developer account ($25, identity verification)
- [ ] Owner: 12+ tester Gmail addresses; 14-day closed test before production
- [ ] Copy Play app-signing + upload SHA-256 into Vercel `ANDROID_CERT_SHA256`; check assetlinks.json
- [ ] Store assets: 1024x500 feature graphic, 2+ phone screenshots from a real account
- [ ] Owner: confirm Gemini is on a paid tier (children's answers and handwriting photos go to it)
- [ ] Owner: legal review of `/privacy` and consent copy

## Known inconsistencies, left as-is by owner decision
- Class 10 Maths multi_statement uses 3 statements in some chapters (should be 2).
- Class 8 Social Science uses the denser Maths AR/MS pattern.

## Useful commands
- `npm run dev` | `npm test` (needs local Postgres, see `.env.test.example`) | `npm run db:setup:test`
- Local Android build: see memory note "android-local-toolchain" or `android/README.md`.
