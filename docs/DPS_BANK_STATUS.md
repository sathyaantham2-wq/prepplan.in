# DPS bank rewrite — status (owner decision 2026-10-05)

The whole question bank is being rewritten to the DPS school-exam standard
(`docs/QUESTION_STANDARD.md` sections 9-11), class by class, Class 7 and Class 9 first. Students pick
10, 15 or 30 questions; the Easy/Hard/Hardest choice is gone. Authors write
`content/authoring/dps/<set>/<chapter>.json` (brief: `docs/DPS_AUTHORING_BRIEF.md`); each file is
checked with `scripts/load-dps-pack.ts --check`, independently reviewed, and only then loaded.
Old grid questions are RETIRED (never deleted) after the new ones for a class are loaded in
production. Nothing below has been loaded into production.

Authoring stages: queued -> authored (file passes --check) -> reviewed (independent recompute, fixes applied) -> loaded local -> loaded production -> old grid retired.

| Class / subject | Chapters | Authored | Reviewed | Loaded to production |
|---|---|---|---|---|
| 7 Maths (MATH) | 15 (Part I 8, Part II 7) | in progress | pilot ch1 only | no |
| 7 Science (SCI) | 12 | in progress | no | no |
| 7 Social Science (SST) | 20 | pilot Part I ch4 | pilot ch4 only | no |
| 9 Maths (MATH9) | 8 | no | no | no |
| 9 Science (SCI9) | 13 | no | no | no |
| 9 Social Science (SST9) | 9 | no | no | no |

Structure files for Class 7 Maths (not in the repo's authored set): `content/structure/`.
Class 9 Maths reference papers: only `Class_IX_Math_Concept_Test` is text; `Class_IX_Math_PT1_Rev_ws_KEY.pdf`
is a scanned image with no text layer.

## Where it stands (2026-10-09, late)

Rules: QUESTION_STANDARD section 12 (no easy questions, every DPS item type), enforced by `scripts/load-dps-pack.ts --check`. Skill `dps-question-style`, agents `dps-author` (Modes A new / B fix-from-review / C upgrade) and `dps-reviewer`. Old pre-rewrite versions: `content/authoring/dps-v1-backup-2026-10-08/`. Nothing is loaded to production.

The loader checks labels and counts only. The independent review (`dps-reviewer`, writes `content/authoring/dps/_reviews/v2-*.md` for the first review, `v3-*.md` for the re-review after a fix pass) found the real defects. Findings: keys are almost always right, but each chapter had 18-78% "easy in disguise" items (a one-line book fact or one-step lookup, whatever its Bloom label), 62-83% of texts were unchanged from v1, and fix passes themselves introduced new HIGH defects (second defensible answers, impossible data, stem/key mismatches) in about half the chapters re-reviewed. Plan per chapter: review -> fix -> re-review -> fix until the re-review shows no HIGH and the easy share is low (Maths Part I ch2 went 28.7% -> 8.7% in one fix pass; others needed three).

Status by set (first review / first fix / re-review):
- Class 7 Maths 15 chapters: review 15/15, fix 15/15, re-review done for Part I ch2, 3, 4, 5, 7, 8 (ch3, 4, 5, 7 needed a second fix); Part II re-reviews pending (ch1 in progress).
- Class 7 Science 12: review 12/12, fix 10/12 (ch1, ch2 not yet fixed); no re-review yet.
- Class 7 Social Science 20: Part I review 12/12, Part I fix 9/12 done (ch10-12 in progress); Part II (8 chapters) review ch1-3 in progress/done, others not started.
- Class 9 Maths 8, Class 9 Science 10/13 (ch11, 12, 13 interrupted; scratch pieces exist), Class 9 Social Science 0/9: written/upgraded once but NOT independently reviewed.

Open decision for the owner: Science and Social Science reviewers flag 45-78% of items as easy because many NCERT facts are one-line statements; the standard is strict. Relaxing it (e.g. allow up to 20% recall) would cut the work a lot.

Known leftovers (from reviews, not fixed everywhere): fill_blank items that are still arithmetic on numbers in the stem; case-study last parts that are forced decisions; repeated ideas within a concept; Maths Part II ch4/ch5 and Science chapters not yet re-reviewed.

Operational: agents died when the Mac slept ("computer went to sleep mid-response") and several stalls came from agents hunting for textbook page files that do not exist: `content/extracted/<src>/pages/` has chapter-relative files 001.txt.. and the scope files' page numbers are the BOOK's printed pages. Keep the Mac plugged in, lid open, `caffeinate -di` running. Max 8 agents at once.

Operational: the agents died every time the Mac slept. `caffeinate` alone does not stop lid-closed sleep on battery; keep the Mac plugged in with the lid open (or disable sleep) while authoring runs. Run at most 6-8 agents at once and have them write one concept at a time.


## Update 2026-10-09 (evening)

All 47 Class 7 chapters (Maths 15, Science 12, Social Science 20) now have an independent re-review with
0 HIGH (verdict "pass"; remaining MEDIUM/LOW are optional polish, listed in `_reviews/`). Class 9
(Maths 8, Science 13, Social Science 9) has not had its first independent review yet.
Nothing is loaded to production; loading and retiring the old grid need the owner's explicit OK
(old questions are retired, never deleted). Migration 0074 is NOT yet applied to production, so PR #20
is not merged (CI is green).

## Update 2026-10-09 (night)

All 77 packs (Class 7: 47, Class 9: Maths 8, Science 13, Social Science 9) pass `--check` and have had an
independent review with 0 HIGH (Class 9 Social Science ch09 had its last small fix applied after the final
review; wheat/MSP wording replaced by the book's minimum-wage example). Optional MEDIUM/LOW polish is listed in
`content/authoring/dps/_reviews/`. PR #20 is merged to main and migration 0074 is applied to production.
Nothing is loaded to production yet: the owner runs `scripts/load-dps-class7.sh trial|all` (and
`load-dps-class9.sh`) with the production DATABASE_URL; the old easy grid is not yet retired (a separate step,
retire never delete). The daily Backup workflow fails because secrets PROD_DATABASE_URL and BACKUP_PASSPHRASE
are not set in GitHub; set them before loading.
