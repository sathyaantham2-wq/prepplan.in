# Class 7 gap top-up — author brief

Goal (owner, 2026-10-30): every Class 7 chapter can supply at least 3 different papers, with no question
repeated, in both school layouts (Unit Test 40 and CBSE 80). A top-up file adds exactly the counts it
is asked for, per paper slot. No F-number yet (F133 proposed, not assigned).

## The file

- Path: the one named in your task, in `content/authoring/dps/class7-topup/`.
- Shape: same as `content/authoring/dps/class7-topup/p1ch01-la4.json` (`kind: "dps_topup"`, subject,
  chapter, `source_code`, `concepts[].questions[]`). Read the `dps-question-style` skill
  (`.claude/skills/dps-question-style`) and `docs/QUESTION_STANDARD.md` first.
- Concepts: only codes in the chapter's structure file (`content/structure/class7-<subject>-<ch>.json`),
  spread roughly evenly over them. Stay inside the IN scope; never touch an OUT item.
- Every question has `"p"`: the PRINTED page (or one range, `"pp. 27-28"`) in the NCERT book where the
  idea is taught. Check it against `content/extracted/<source_code>/` (printed page numbers are the
  folios printed in the text, which may differ from file page numbers).
- `"d"` is `Hard` or `Hardest` only. No `Remember` items. Understand at most 30% of the file.

## Paper slots (the loader checks each question fits one; counts are per slot)

| slot | marks | type (`t`) | Bloom (`b`) | tags |
|---|---|---|---|---|
| mcq1 | 1 | `mcq`, `multi_statement` or `match` | Understand, Apply, Analyse | none of case_study/map/figure |
| ar1 | 1 | `assertion_reason` | Understand, Apply, Analyse | as above |
| sa2 | 2 | `short_answer` | Understand, Apply | as above |
| sa3 | 3 | `short_answer` | Understand, Apply, Analyse | as above |
| la4 | 4 | `long_answer` | Apply, Analyse, Evaluate, Create | as above |
| la5 | 5 | `long_answer` | Apply, Analyse, Evaluate, Create | as above |
| cs4 | 4 | `long_answer` | Apply, Analyse, Evaluate | exactly `case_study` (3-4 linked parts on one passage/data set) |

- Multiple choice: 4 options, exactly one correct, plausible distractors from real misconceptions; the
  answer text describes the correct option (never "option b": options are shuffled at load).
- Every 2-mark and longer question has marking steps (`"s"`: [step, marks] pairs) that sum to the marks,
  each step a checkable thing an AI marker can find in a pupil's answer. Multi-part questions show
  their split, e.g. 3 marks as (1+1+1).
- DPS standard: situations, comparisons, claim-checks, find-the-error, reasons; not bare recall. Vary
  the verdict of claim-checks (some claims are right). Vary settings and numbers.
- Do not repeat an idea, setting or number set already in the chapter's existing pack
  (`content/authoring/dps/<set>/<ch>.json`) or its other top-up files in this folder. Read them first.
  Before writing, list the settings, puzzle shapes and number sets already used there, and avoid them:
  reviews keep finding repeats (same setting, same trick with new numbers, three items with one idea).
- Vary the shape: slot order differs between concepts, 5-mark items do not all end in "who is right",
  the correct option is not usually the longest, true/false items are not all True.
- Bounds and ranges: a stem must not allow a second true answer ("lowest and highest", not "range").
- Maths: recompute every number in python before you write it. Use only methods the chapter teaches:
  no solving equations unless the chapter teaches it, no proofs by induction, no angle bisection or
  quadrilateral angle sum unless taught.
- Science / Social Science: every fact must be in the chapter text; no outside facts, no invented
  statistics presented as real (a made-up table is "a school's record", "a class survey", etc.).

## Check and stop

`node scripts/with-test-env.mjs npx tsx scripts/load-dps-pack.ts <your file> --check` must say valid.
Then count per slot (the counts asked are exact). Never load a database, never commit. Report briefly in
Telugu: counts per slot, and anything you could not do.
