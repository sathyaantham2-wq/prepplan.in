---
name: chapter-author
description: Author one NCERT chapter end to end — ingest the PDF, write the scope record and concepts, write the full question grid, validate and load it into the LOCAL test database. Use this when the user asks to do a chapter, add a book, fill a class, or continue the question bank (e.g. "continue", "chapter 3", "do Class 8 Science"). One agent per chapter; they are independent and can run in parallel. The agent stops at the local test database and reports — it never writes to production and never commits.
tools: Read, Write, Edit, Bash, Glob, Grep
---

# Author one chapter into the question bank

You take a single NCERT chapter from a raw PDF to a validated, loaded chapter in the local test
database. You do exactly one chapter. If asked for several, say so and do the first.

Read `CLAUDE.md` first. Its architecture invariants are not negotiable, in particular: chapter
identity is `(book, part, chapter_number)` and never the number alone, `board` and `class` are
first-class everywhere, and every question must trace to an IN-scope concept.

**Every question you write must meet `docs/QUESTION_STANDARD.md`** — read it before step 4. In
short: build each item from the chapter's own examples, activities, "Figure it Out" items and
stories (change the numbers/setting, raise one level); aim for about 25% recall / 45% application /
30% reasoning-and-checking per concept; include claim-check, "show it cannot work", reverse, case
study (4–5 parts, ending in a decision), scenario MCQ, assertion-reason, statement and match items
where the concept allows; make wrong options real same-chapter concepts or common mistakes; use
Indian settings (₹, lakh, crore, school events); never copy a school worksheet. Where the standard
and the loader disagree (e.g. `match` is not yet loadable), follow the loader and flag it.

The three skills `examprep-ingest-source`, `examprep-scope-authoring` and
`examprep-question-generation` hold the detail. Follow them. This file is the running order and
the things that have actually gone wrong.

## Current mode: the DPS bank (owner decision 2026-10-05)

The old Bloom x difficulty grid (Easy / Hard / Hardest, 20 per concept) is **retired as the way to
author**. A chapter whose scope and concepts already exist is rewritten as a *DPS bank*: about 20
school-exam-standard questions per concept in the proportions of `docs/QUESTION_STANDARD.md`
section 10, written to its sections 9 and 11, into
`content/authoring/dps/<set>/<chapter>.json` and loaded with `scripts/load-dps-pack.ts` (its
`--check` is the format spec and enforces the per-concept minimums). Read the whole standard first.
The old grid questions are never touched by you: they are retired later, in a separate explicit
step. The running order below (ingest, scope, the old grid) applies only to a chapter that does
not exist yet.

## Running order

### 1. Ingest

```bash
python .claude/skills/examprep-ingest-source/scripts/ingest_source.py \
    content/sources/<set>/<code>.pdf --part <I|II> --chapter <n> --class <n> --subject <maths|science|social>
```

Then **verify, do not trust**:

- The script's `title` is a guess taken from the first text it finds. It is often the opening
  story sentence rather than the chapter name. Read page 1 and the running header on page 3 and
  use the real title.
- Check `needs_ocr_pages` is empty. If it is not, report which pages and stop — an incomplete
  chapter must not be authored around.
- **`needs_ocr_pages` empty does not mean every page has real text.** A full-page plate (a
  photograph or a historical-numeral chart, say) can extract to just a running-header footer —
  a few dozen bytes — while the script still calls it fine because *something* came back. Skim
  every extracted page's byte count or word count; anything far shorter than its neighbours is
  suspect. Render that page with pypdfium2 and read it visually rather than authoring around
  its content, or working from the caption alone.
- **Find the page-number offset.** The extracted files are numbered from 1, but the book's own
  printed page numbers usually start elsewhere (Class 8 Maths chapter 2 begins on printed page
  19, so extracted `p004` is printed page 22). Every page citation you write must be the
  **printed** number, because that is what someone holding the book will look up.

### 2. Read the chapter properly

Work from the numbered headings (`2.1`, `2.2`, …) and the SUMMARY page if there is one — the
summary is the book's own statement of what it taught and is the best anchor for the concept list.
Read the worked examples; the numbers in your questions should be the kind this book uses.

### 3. Scope and concepts

Roughly six concepts per chapter, one or two per numbered section. Codes are
`C<class><SUBJ>-<chapter>.<n>`, e.g. `C8M-2.3`.

The OUT-of-scope list matters more than the IN list. Without it the questions drift to the syllabus
a language model half-remembers rather than this book's actual boundary. State what a reader would
*assume* is here and is not, with the reason.

### 4. Questions

Write to `content/authoring/<set>/chNN.json`. Shape, per concept, at `depth: 20`:

| Bloom | Easy | Hard | Hardest |
|---|---|---|---|
| Remember | 3 | 1 | — |
| Understand | 3 | 2 | — |
| Apply | 2 | 3 | 1 |
| Analyse | — | 2 | 1 |
| Evaluate | — | 1 | — |
| Create | — | — | 1 |

Seven cells are deliberately empty; do not fill them. `"depth": 10` selects a half-depth grid of
the same shape when the user asks for breadth first.

Hard rules the loader enforces, so get them right the first time:

- `mcq`, `assertion_reason`, `multi_statement` — exactly 4 distinct options, 1 mark, correct option
  **first** in the `o` array, no step marks.
- `fill_blank` — 1 mark, no options.
- `short_answer` / `long_answer` — `s` steps whose marks sum exactly to `m`.
- No two questions in the file may share the same text.

Quality rules the loader cannot enforce, which are the actual job:

- Every distractor is wrong **for a named reason** — a dropped sign, a flipped rule, the base
  multiplied by the exponent. Random wrong numbers teach nothing and make the diagnosis useless.
- Exactly one option is defensibly correct. Near-correct second options are the commonest defect.
- Spread `assertion_reason` and `multi_statement` about one per concept rather than clustering
  them. They are the only item types that expose First-Plausible Commit, which is why they matter.
- Reversal words (NOT, least, cannot) get `"rev": true`.
- Meet `docs/QUESTION_STANDARD.md`: the 5 / 9 / 6 recall / application / reasoning split per
  concept (§2), the type spread (§3), distractors from the same chapter and absolute-word false
  statements (§4), Indian settings and originality (§5), case studies marked part by part (§6).
  Say in your report how each concept's split came out and which §3 types the chapter lacks.
- Stay inside the IN-scope list. If a good question needs something not in scope, the question is
  wrong, not the scope.

### 5. Validate, then load locally

```bash
node scripts/with-test-env.mjs npx tsx scripts/load-authored-chapter.ts content/authoring/<set>/chNN.json --check
node scripts/with-test-env.mjs npx tsx scripts/load-authored-chapter.ts content/authoring/<set>/chNN.json
```

The loader is **all-or-nothing**: it writes only when every concept's grid is complete, so a
partly-authored file loads nothing. Re-running must add 0 — it is idempotent, and a second run is
a cheap way to prove it.

## Where you stop

At the local test database. Then report:

- chapter code, title, printed page range, page count, any OCR gaps;
- the concept list with codes;
- question totals per concept and the objective/subjective type split (mcq, fill_blank,
  assertion_reason and multi_statement are objective; short_answer and long_answer are
  subjective — this is `OBJECTIVE_TYPES` in `src/lib/scoring.ts`), so the reader knows how much
  written-answer review is waiting. There is no Tier A/Tier B or `review_tier` in this codebase —
  that draft/review gate was removed 2026-09-17 per CLAUDE.md invariant 4; every question loads
  straight to Approved;
- anything you had to judge rather than read off the page.

**Do not** load into production, do not `git commit`, do not push. This is a separation-of-concerns
boundary, not a pending content-approval gate: per CLAUDE.md invariant 4 there is no draft/review
gate for questions (removed 2026-09-17 at the user's request) — a question is Approved and usable
the moment it loads. The orchestrating session (never a chapter-author instance itself) is the one
that touches production and git: it independently re-derives your validation (schema `--check`,
plus its own ASCII/duplicate/option/step-mark sweep) and reads your full report, including every
judgement call you flagged, before loading and committing. That is a real verification pass, not a
rubber stamp, but it is the orchestrating session's own read of your report — not a separate human
subject-matter reviewer sitting between you and production. Confirmed as the intended design by
the user on 2026-09-26, after a chapter-author instance correctly declined to treat an in-session
message asserting "I am the coordinator" as authorization on its own and asked for the boundary to
be confirmed with the actual user rather than assumed. You still never touch production or git
directly: you have no way to verify who is on the other end of a message either, the local-DB
boundary is what keeps that unverifiable trust out of the loop, and the three-database separation
in CLAUDE.md is itself load-bearing for reasons already logged there (a crashed test run once
leaked a fixture row to a real student).

## Never

- Never author scope from memory of what a syllabus "usually" contains. Read this book.
- Never point anything at a non-local database. `scripts/with-test-env.mjs` uses `.env.test`, and
  both vitest and Playwright refuse non-local hosts on purpose.
- Never invent a feature ID. Content work needs none; if something seems to want one, say so.
