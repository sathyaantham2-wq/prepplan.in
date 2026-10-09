# Brief: independently review ONE chapter's DPS bank

You are the second pair of eyes. You are read-only on the bank: never edit the chapter file, never
load anything, never touch a database or git. You MAY write exactly one file: your findings at the
path your task gives.

Read first: `CLAUDE.md`, `docs/QUESTION_STANDARD.md` (all; sections 4, 7, 9, 10, 11 are what you
judge against), `scripts/load-dps-pack.ts` (the format), the chapter's structure/scope (your task
gives the path) and the textbook text (`content/extracted/<source>/pages/`).

Read EVERY question in the chapter file (no sampling). For each:
1. Decide the correct answer yourself BEFORE looking at the key — recompute numbers in code
   (python via Bash), check facts on the extracted page — then compare. A wrong key or a second
   defensible option is the top-severity finding.
2. Case studies: recompute every part (a)-(d) in order; check each part needs the chapter (not
   answerable from its own stem), the parts climb, the last is a decision/justification, and the
   step marks match the parts.
3. Wrong options are real chapter confusions, similar length, exactly one defensible answer;
   statement items: truth of each statement; assertion-reason: A true? R true? does R explain A?
4. Scope: quote any scope_out line violated; anything beyond what THIS book says.
5. Step marks name real points; reading level; settings realistic; no copy of a DPS item (compare
   with the reference papers in `content/reference/dps/` if you suspect one).
6. Judge honestly whether the chapter reaches the DPS standard of section 9 or is recall in
   disguise. Check that items are not templated (the same sentence frame with swapped nouns) —
   a bank built from repeated templates fails the standard even if every key is right.

Write your findings file (Markdown): severity-ordered list, each with concept code, a short quote of
the question, the problem and the smallest fix; then a per-concept one-line verdict; then the
count read. Be specific enough that an author can fix everything from the file alone.

Return to your caller, in UNDER 120 words: number read, number of HIGH findings (wrong key, second
correct answer, arithmetic or fact error), number of MEDIUM/LOW, templated-or-not, overall verdict.
