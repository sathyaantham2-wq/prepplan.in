# Seed and E2E subjects in production: read-only check (2026-10-29)

Done at the owner's request with a **read-only transaction** (`begin read only` ... `rollback`). Nothing was changed. Only counts were read; no names or e-mail addresses are recorded here. Nothing has been fixed: the owner decides.

## What exists

| Subject | Active? | Chapters | Approved questions |
|---|---|---|---|
| `MATH-SEED` (CBSE 7) | **yes** | 24 ("Sample Chapter ... (seed)" and "Adaptive fixture chapter") | 852 |
| `SCI-SEED` (CBSE 7) | **yes** | 1 | 0 |
| 29 subjects named `E2E-AD-<number>` (CBSE 7) | **no (inactive)** | 0 for 27 of them, 1 each for two | 0 for 27, 12 each for two |

## Can a real student see them?

- **Yes, MATH-SEED and SCI-SEED can be seen.** The student paper-generation page (`/generate`) asks for "subjects of my board and class that have content", and both are active and have chapters. All **43** CBSE Class 7 students would see both in that list. SCI-SEED has no questions, so a paper from it would be empty; MATH-SEED has 852 sample questions, so a student could generate a paper from "Sample Chapter" content.
- **The 29 E2E-AD subjects are not listed to anyone** (inactive).

## Does a real student have papers or attempts on them?

Everything found looks like test accounts, not real students:

| Subject | Papers | Attempts | Students | Dates | What the students look like |
|---|---|---|---|---|---|
| `MATH-SEED` | 2 | 2 | 1 | 2026-09-22 | one account with an `example.com` address |
| `E2E-AD-1790061218739` | 1 | 1 | 1 | 2026-09-22 | one account with an `example.com` address (also holds one "chosen subject" row) |
| `E2E-AD-1790074242777` | 0 | 0 | 0 | | one `example.com` account holds a "chosen subject" row only |
| `SCI-SEED` and the other 27 | 0 | 0 | 0 | | none |

Other traces: `MATH-SEED` has 2 concept-mastery rows (1 student) and 2 question-usage rows; `E2E-AD-1790061218739` has 10 question-usage rows; no points or Fix-it rows. The judgement "test account" rests on the `example.com` e-mail address; it was not checked against any other record.

## What would remove the exposure (not done)

Setting `is_active = false` on `MATH-SEED` and `SCI-SEED` would hide both from every subject list without deleting anything (CLAUDE.md invariant 4: nothing is deleted). The test run that created the E2E subjects (2026-09-22) is the one the project notes record as having leaked fixtures before.
