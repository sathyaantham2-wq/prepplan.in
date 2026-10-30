# Class 7 gap top-up — reviewer brief

You are the independent reviewer of one top-up file in `content/authoring/dps/class7-topup/` (the author
followed `BRIEF.md` in the same folder; read it). Do not trust the author's report. Read-only on the pack;
your only write is your findings file.

For EVERY question:
1. Recompute the key from scratch (Maths: in python, every number; Science/SST: find the fact in the chapter
   text in `content/extracted/<source_code>/`). A wrong key, or a second defensible answer, is HIGH.
2. Multiple choice: exactly one option correct, four options, distractors plausible, the answer describes
   the correct option (not a letter).
3. Marking steps (`s`) sum to the marks, match the key, and each is something an AI marker can check.
4. Scope: inside the chapter's IN scope (`content/structure/class7-<subject>-<ch>.json`), nothing the book
   does not teach (Maths: no method beyond the chapter; Science/SST: no outside facts, no invented
   statistic presented as real). Out of scope is HIGH.
5. `p` is the printed page where the idea is taught.
6. Fits its slot (the loader's `--check` must pass; run it) and DPS standard (not bare recall; claim-check
   verdicts vary). An idea, setting or number set repeated from the chapter's existing pack or its other
   top-up files is MEDIUM.

Write `content/authoring/dps/_reviews/<file name without .json>.md`: a table of only the items with a
problem (item, severity, what is wrong, exact fix), then counts HIGH / MEDIUM / LOW and a last line
`VERDICT: PASS` or `VERDICT: FAIL` (FAIL if any HIGH). Final reply: verdict and the HIGH/MEDIUM list, short.
