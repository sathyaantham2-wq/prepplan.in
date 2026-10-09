# Brief: author ONE chapter's DPS bank

You are rewriting one NCERT chapter's questions to the school-exam standard (owner decision
2026-10-05). The old Easy/Hard/Hardest grid is not what you write. Work on exactly one chapter.

## Read first (in this order)
1. `CLAUDE.md`
2. `docs/QUESTION_STANDARD.md` — ALL of it. Sections 9 (what the DPS papers do), 10 (the bank and
   its per-concept minimums) and 11 (lessons from review) are binding.
3. `scripts/load-dps-pack.ts` — `validatePack` is the format spec; `--check` enforces it.
4. The DPS reference papers (style only, never copy an item, never reuse their numbers): extracted
   text in `content/reference/dps/` (one `.txt` per PDF in `question papers dps/`; image-only PDFs have no text).
   Your task message names the most relevant ones for your subject; read those fully and skim the
   others in the folder for the same subject. Learn how hard their THINKING is: two-part items,
   chains, claims to test, patterns to predict, decisions to make.

## Inputs (your task message gives the paths)
- The chapter's structure: concept codes, names, ideas, rules, IN scope (with printed pages) and
  OUT scope. Stay inside IN scope; OUT scope is a hard boundary.
- The textbook's extracted text for the chapter (`content/extracted/<source code>/pages/`).
  Build items from the chapter's own examples, activities, "Figure it Out" items, sources, boxes and
  stories; change numbers or setting and raise one thinking level. Facts, names, dates and causes
  are exactly what THIS book says; check the pages, never rely on memory.
- The existing grid questions of the chapter, if a file is given: read them only to avoid repeating
  them. You do NOT edit, retire or delete them.

## Write
`content/authoring/dps/<set>/<file>.json` (your task message gives the exact path), shape:

```
{ "kind":"dps_pack",
  "subject":{"code":"<SUBJECT CODE>","class":<n>,"board":"CBSE"},
  "chapter":{"part":"<I|II>","chapter_no":<n>,"name":"<name>"},
  "source_code":"<code>",
  "concepts":[ {"code":"<concept code>","questions":[ ... ]}, ... every concept of the chapter ] }
```
Question: `{b, d, t, m, q, a, o?, s?, rev?, tags?}`
- `b` Bloom: Remember | Understand | Apply | Analyse | Evaluate | Create
- `d` internal label only: Hard for most, Hardest for 5-mark and case study. `Easy` is retired and rejected (owner decision 2026-10-08, QUESTION_STANDARD section 12)
- `t` mcq | assertion_reason | multi_statement | match | fill_blank | short_answer | long_answer
- `m` marks; `q` text (use `\n` for line breaks inside a case study or a match table); `a` the answer
- `o` four options for mcq / assertion_reason / multi_statement / match, CORRECT FIRST (the loader
  shuffles them)
- `s` for written questions: `[["what earns the mark", marks], ...]` summing to `m`; a case study has
  one step per part; step names say what earns the mark, never "Step 1" / "solve"
- `rev` true if NOT / least / cannot / false / never turns the question
- `tags`: `scenario`, `match`, `true_false`, `figure`, `case_study`, `claim_check`, `show_impossible`, `reverse`

Per concept the validator requires: 20 to 24 questions; 8+ objective (3+ scenario mcq, 1+ three-statement
`multi_statement`, 1+ `assertion_reason`; there are no plain recall items; fill_blank counts as objective); 5+ two-mark `short_answer`
(2+ with parts (a) and (b), two steps); 3+ three-mark (1+ tagged claim_check / show_impossible /
reverse); 2+ five-mark `long_answer`; 2+ four-mark case studies (`long_answer`, tag `case_study`,
45+ words of stem, 3 or 4 labelled parts (a) (b) (c) (d), one step per part). The chapter needs
`max(2, ceil(concepts/2))` match items (`t` match, tag `match`, a 4-to-4 table written in `q`,
options are four different pairings such as "1-b, 2-c, 3-a, 4-d"), the same number of `fill_blank` items
(1 mark, `___` in the text, a word-or-number answer) and of `true_false` items (2-mark `short_answer`, tag
`true_false`, steps: the verdict, then the reason or correction). No `Remember` item and no `Easy` label at
all, no more than 30% `Understand`, at least 30% Analyse/Evaluate/Create. See QUESTION_STANDARD section 12.

## Quality (the whole point)
- Every wrong option is a real confusion from this chapter, wrong for a reason you can name; exactly
  one defensible answer; options of similar length.
- False statements hinge on absolute words (always, only, never, all) but not every absolute
  statement is false.
- Indian settings (₹, lakh, crore, school events, local places) where the chapter allows.
- Every part of a case study needs the chapter, parts climb, the last part is a decision or a
  justified judgement; no part is answered in its own stem.
- Original wording and original numbers. Maps, figures and constructions: leave out.
- Reading level for the class.

## Verify before you finish
- Recompute EVERY number, and every case-study part, with real code (python via Bash). For fact
  items, check the extracted textbook page. Do this before writing the file, not after.
- Run `node scripts/with-test-env.mjs npx tsx scripts/load-dps-pack.ts <your file> --check` until it
  passes. (`--check` needs no database.) Do NOT load into any database, never touch production,
  never git commit.

## Report (keep it SHORT, under 150 words)
Counts per concept, any judgement calls or book gaps, anything in the standard you could not meet.
No sample items.

## Working files
Many authors run at once and share one scratchpad. Put every temporary script and file in your OWN
sub-folder named after your chapter (e.g. `<scratchpad>/c7m-p2ch04/`), never in a shared `w/` or at
the scratchpad root, so nobody overwrites your work.

## Anti-template rules (from the first Science review, which found a templated chapter)
- Do not give every concept the identical slot pattern with swapped nouns. Vary the stem frames,
  the settings and the order of ideas from one concept to the next.
- In `multi_statement` items the false statement must be spread across 1, 2 and 3, and the keyed
  combination must vary ("1 only", "2 and 3 only", "1 and 3 only", "all three"...), not mostly
  "1 and 2 only".
- The correct option must not be the longest in the item; across a concept the correct answer is
  not systematically longer than its distractors.
- Part (a) of a case study must not be printed in its stem. Do not use a strawman as the decision
  ("Dev says something absurd, do you agree?"): the decision must be a real trade-off or a
  judgement the data supports on both sides.
- Do not repeat the same question four times in one concept with different wording.
- A distractor that comes from outside the chapter is not a real confusion: use the book's own
  look-alike terms and its stated numbers.

## Write in pieces (a platform watchdog kills a step that runs silent for 10 minutes)
Never emit more than about 20 KB in one tool call. Write ONE concept at a time to its own small JSON
file in your scratch folder (e.g. `<scratch>/c1.json`, `c2.json`, ...), verify that concept's numbers
in code, and only at the end merge the pieces into the chapter file with a short script and run
`--check`. If you are interrupted, the finished concept files are your progress: resume from them.

## Answers never name an option letter or number
The loader SHUFFLES the four options. An answer or step that says "Option (b)", "choice 2" or "(a) is
correct" will point at the wrong option. Write what the correct option SAYS ("The reason is true but
does not explain the assertion"). `--check` now rejects any answer that names an option by letter
or number.
