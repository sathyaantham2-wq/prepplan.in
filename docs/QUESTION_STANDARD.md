# Question standard — "school exam standard"

Applies to every question written for the bank, by `chapter-author`, by the
`examprep-question-generation` skill, or by hand. `bank-reviewer` audits against it.

The target feel is a good school half-yearly paper or revision worksheet (the Delhi Public School
Class 7 sets are the reference for *style*). The target *content* is always the NCERT chapter in
front of us. When the two disagree, the chapter wins (CLAUDE.md invariant 5): a school worksheet
may test something this edition of the book does not teach, and we do not follow it there.

## 1. Where a question comes from

Build each question from the chapter's own material: its worked examples, activities, "Figure it
Out" items, stories and the characters/settings the book uses. Then:

1. Take the book item.
2. Change the numbers or the setting.
3. Raise it one thinking level (a recall item becomes an application, an application becomes a
   check or a decision).

A question that cannot be traced to a section of the chapter, or to an IN-scope line in the
scope record, is discarded. The book's own method and vocabulary are used: if the chapter teaches
a thing one way, the question does not require a method from a later class or from a half-remembered
older syllabus.

## 2. Thinking-level mix per concept (out of 20)

| Level | Share | Of 20 | What it is |
|---|---|---|---|
| Recall | ~25% | 5 | state, name, identify, match, one-step fact or computation |
| Application | ~45% | 9 | use a rule/method on a new number or setting, multi-step, word problems |
| Reasoning and checking | ~30% | 6 | claim-check, "show it cannot work", find the error, compare methods, decide |

This is a *reading* of the existing Bloom × difficulty grid, not a new grid, so no migration and no
re-authoring of loaded chapters is implied:

| Level | Grid cells (count) |
|---|---|
| Recall (5) | Remember Easy 3 + Remember Hard 1 + Understand Easy 1 |
| Application (9) | Understand Easy 2 + Understand Hard 2 + Apply Easy 2 + Apply Hard 3 |
| Reasoning (6) | Apply Hardest 1 + Analyse Hard 2 + Analyse Hardest 1 + Evaluate Hard 1 + Create Hardest 1 |

(5 + 9 + 6 = 20; every question in the grid is counted exactly once, with the three "Understand
Easy" items split 1 recall / 2 application. The author decides which two are the application ones
by their demand, not by position. If the grid in `examprep-question-generation` changes, update
this mapping with it.)

Papers use the same three levels when they pick questions, so a concept authored to this mix
supplies a paper with the right proportions without any extra tagging.

## 3. Question types to include (where the concept allows)

Do not force a type onto a concept that does not suit it; an unnatural item is worse than none.
Across a chapter, every type below should appear at least once where any concept in it fits.

| Type | Shape | Loader type |
|---|---|---|
| **Claim-check** | "Meera thinks … Do you agree? Why?" The claim is plausible and either subtly wrong or right for a limited case. Marks go for the verdict *and* the reason. | `short_answer` (steps: verdict / reason), or `mcq` with reasons as options |
| **Show it cannot work** | An impossible triangle, angles that do not add up, a total that exceeds the whole, a pattern that breaks. The student must show *why*, with a number. | `short_answer` |
| **Reverse** | "Describe a situation for this expression" / "write a story that gives 3x + 5" / "make a question whose answer is …" | `short_answer` or `long_answer` |
| **Case study** | 4–5 parts that get harder, built on one realistic setting, ending with a decision ("so which plan should the school choose, and why?"). Parts are marked separately. | `long_answer`, one step per part (see §6) |
| **Scenario MCQ** | "A student observes … which idea explains this?" | `mcq` |
| **Assertion–reason** | Standard four-option A/R form. Use a reason that is true but does **not** explain A as often as one that does. | `assertion_reason` |
| **Statement 1-2-3** | Three numbered statements; options are combinations. | `multi_statement` (see note below) |
| **Match the columns** | 4 items to 4 items, with one distractor-prone pair. | `match` (not yet accepted by `load-authored-chapter.ts`; until it is, write as `mcq` whose options are the possible pairings, and report that as a loader gap — do not invent a workaround in the file format) |

Note on `multi_statement`: the bank's established convention is a **2-statement (I, II)** format in
Maths. The 3-statement form asked for by this standard applies to **new** Science and Social
Science items and to any chapter re-authored under it. Do not mix the two inside one chapter
without noting it in the report. (Known earlier inconsistency in Class 10 Maths is recorded in
CLAUDE.md and is not part of this change.)

Existing house rules still apply: `assertion_reason` and `multi_statement` follow the per-subject
density already set (Maths: one of each per concept; Social Science: one of either per concept,
alternating). `"rev": true` on any reversal word.

## 4. Wrong options and false statements

- Every wrong option is a **real concept or a common mistake from the same chapter**: the sign
  dropped, the rule flipped, the neighbouring term from the same chapter, the textbook's own
  "common error" box. Not a random number, not a concept from another chapter or class.
- Name the mistake for yourself while writing it. If you cannot say what a student did to arrive
  at the option, replace it.
- Exactly one option is defensibly correct. Argue for each distractor before finalising.
- Statements meant to be **false** should hinge on an absolute word: *always, only, never, every,
  all, must, any*. Statements meant to be **true** should be qualified (*can, may, usually, in this
  case*). Do not make every "always/only" statement false by habit — a few absolute statements must
  be genuinely true (e.g. a definition), or students learn the cue instead of the concept.
- Not "all of the above" / "none of the above" unless the chapter genuinely turns on it.

## 5. Settings and originality

- Indian settings: ₹, lakh and crore (place-value questions use the Indian system as the book does),
  school events (sports day, annual day, science fair, tuck shop, library), local markets, trains,
  rangoli, cricket, monsoon, festivals, Indian place names and rivers. Names should be a spread of
  Indian names.
- **Never copy** a school worksheet, paper or key. The reference sets show *style* only. Write
  original items with different numbers, setting and wording. If an item is recognisably a school
  question with one number changed, it fails.
- Original wording and original figures only. No textbook or school images are reproduced; a
  question that needs a figure is described in words/data or left out.
- Reading level matches the class (see `bank-reviewer`).

## 6. Case studies

- One setting, 4–5 parts, each part harder than the one before: read the data → one-step
  calculation → multi-step → check/justify → **decision** (a recommendation backed by earlier
  parts).
- Part marks are 1, 1, 2, 2, 2 style (the total is the question's `m`). Each part is one named step
  in `s`, so evaluation can show *which part* the student stopped at (this is what the product is
  for). Step names describe what earns the mark ("Part (c): converts to metres"), never "solve".
- Each part must be answerable using the earlier parts' answers stated in the key, so one early slip
  does not make later parts unmarkable; the key states each part's answer separately.

## 7. Verification (bank-reviewer)

- **Every answer is recomputed independently** by the reviewer from the question text, not read off
  the key. The key is then compared.
- **For case studies every part is checked**, in order, including that each part's expected answer
  is consistent with the data given and with the parts before it.
- For `match`, `multi_statement` and `assertion_reason`: each statement/pair is judged on its own.
- Also checked: trace to scope (quote the IN line), level mix per concept against §2, type spread
  against §3, distractors against §4, originality against §5.
- Reviewer reports how many questions it read, and which ones it only sampled.

## 8. Quick self-check before loading

1. Which book item did this come from? (§1)
2. Which level is it — recall, application, reasoning? Does the concept still total 5 / 9 / 6? (§2)
3. Can I say what mistake each wrong option represents? (§4)
4. Is it in ₹/lakh/crore or an Indian setting where it can be? (§5)
5. Did I recompute the key, and every case-study part, myself? (§7)

## 9. What the DPS Class 7 papers actually do (read from the 36 sets in `question papers dps/`)

These are *patterns*, not text to copy. Match them; never reproduce an item.

**Maths (PT and half-yearly revision sets)**
- Part I MCQ (about 12): place value and number names with lakh and crore, "which expression
  describes this situation", one assertion-reason, one figure-based item. Wrong options are the
  chapter's own slips (face value for place value, 3-3-3 comma grouping for 3-2-2, a bracket in the
  wrong place).
- Part II short answer (2 marks): nearly always **two parts, (a) and (b)** — a conversion plus a
  comparison, a number name in two systems, "find the product using a shortcut: (a)… (b)…".
- Part III long answer (3 to 5 marks): a **story with several data points and a chain of steps**
  (ribbon collected and used, toys made, shipped and packed into containers), a reverse item
  ("here is an expression, create a real-life situation for it"), and a **claim-check** ("X thinks
  the product of a 3-digit and a 4-digit number is always a 7-digit number — investigate and
  explain"). Puzzle items (a calculator with +1, +10, +100 and the fewest clicks; a caterpillar
  climbing and slipping) appear here.
- Part IV **case study** (4 marks): a paragraph of setting and data, then parts (a)-(d) that get
  harder — read a place value, convert, round, then **predict from a pattern** or make a decision.
- Everything is in ₹, lakh and crore, school fairs, camps, factories, farms, a carpenter, a cloth
  merchant. Numbers are deliberately awkward (125.75, 98.50, 2,39,485), so the arithmetic is real.

**Science**
- MCQ: "which statement is false about…", **match the columns with the answer as a letter-mapping
  option** (I→B, II→C…), a lab set-up described or drawn ("what will he observe?"), "which of the
  following are true" with (i)-(iv) statements and combination options, "which precaution need not
  be taken". Then a separate assertion-reason block (about 10), "define", "differentiate between",
  and short answers built on a scenario ("farmers grow the same crop every year… mention two ways").
- Case-based items give a paragraph, then "define / name / analyse what happens".

**Social Science**
- Objective worksheet per chapter: one-line MCQs, then **assertion-reason where the reason is true
  but does not explain the assertion**, **"Statement I / Statement II"** items, "consider the
  following statements 1, 2, 3 — which is/are correct", match-the-columns as a list mapping to
  option strings, and **case-based items** (a source paragraph, then "define / name / analyse").
- Subjective worksheet per chapter in **2-, 3- and 5-mark** blocks. The command words climb: 2
  marks "what is meant by / state two / name"; 3 marks "interpret why / describe / give reasons /
  explain with an example"; 5 marks "**'…was not limited to the north.' Justify**", "compare … and
  analyse how", "analyse how X is called one of the earliest…".

**Intensity.** Not harder numbers or rarer facts: harder *thinking per item* — two parts, a chain of
steps, a claim to test, a pattern to predict, a decision to make. A student who only memorised the
page loses marks on the (b), (c), (d) parts, which is the product's whole point.

## 10. The DPS bank (owner decision 2026-10-05: the whole bank is rewritten to this standard)

The Easy / Hard / Hardest grid is retired as the way questions are made. A student picks 10, 15 or
30 questions on her chapters and every one of them must be a school-exam-standard item (section 9).
The new bank for a class is authored chapter by chapter into
`content/authoring/dps/<set>/<chapter>.json`, validated and loaded by `scripts/load-dps-pack.ts`
into concepts that already exist. The old grid questions are **retired, never deleted**, once the
new ones for that class are loaded (retiring in production is a separate, explicit step). Each
question still carries a Bloom level and a `d` tag, but `d` is only an internal label and is no
longer shown or chosen: use `Easy` for the plain recall items DPS also sets, `Hard` for most, and
`Hardest` for 5-mark and case-study items.

**Per concept, about 20 questions (the loader enforces the minimums):**

| Item | How many | Form |
|---|---|---|
| Plain multiple choice | 3+ | `mcq`, direct recall or understanding (the "easy" items every DPS paper has) |
| Scenario multiple choice | 2+ | `mcq`, tag `scenario` ("a student observes… which idea explains it?") |
| Statements | 1+ | `multi_statement`, Statements 1, 2 and 3 |
| Assertion-reason | 1+ | `assertion_reason`; "true but not the explanation" about as often as "explains" |
| 2-mark short answer | 5+ | `short_answer`; at least 2 with parts (a) and (b), two steps; others define / state / differentiate / one-line reason |
| 3-mark answer | 3+ | `short_answer` or `long_answer`; at least 1 tagged `claim_check`, `show_impossible` or `reverse` |
| 5-mark answer | 2+ | `long_answer`, 2+ named steps, multi-part or "justify / compare and analyse" |
| Case study | 2+ | `long_answer` 4 marks, tag `case_study`: a real stem (setting + data, 45+ words), 3 or 4 parts labelled (a), (b)… one step each, parts get harder, the last part a decision or justified judgement |

Total 20 to 24 per concept; every chapter also holds match-the-columns items (`match`, tag `match`,
four options that are the possible pairings) — at least one per two concepts. At the chapter level
no more than 60% of items are Remember/Understand and at least 15% are Analyse/Evaluate/Create.
Maps, ruler-and-compass constructions and anything needing a figure are tagged `map`,
`construction` or `figure` and are written only where an original figure can exist; otherwise they
are left out and reported, never faked.

**Case-study marks.** A 4-mark case study has three parts (1+1+2) or four (1+1+1+1). A 5-part case
study is a 5-mark long answer.

## 11. Lessons from reviewing the first two chapters (apply to every chapter)

- **Every part of a case study must need the chapter.** If part (a), (b) or (c) is answered in the
  stem, it is a free mark. Recall in (a) is fine only if the stem does not state it. Each part feeds
  the next, and the last part is a decision that uses the earlier answers.
- **A 2-mark (a)/(b) item is not two recall facts.** (b) is a comparison, a consequence, a reason or
  a conversion that uses (a).
- **State everything the item needs.** A calculator with certain buttons, a table's values, a
  scale: if the answer depends on it, it is in the stem, never "as in the book".
- **Scenario distractors are real confusions from the chapter**, not throwaway options. Make the
  options the same length so the longest is not the answer.
- **Assertion-reason:** R must be a real fact about the topic (not trivia, not a restatement of A).
  Check A true? R true? Does R explain A?
- **Do not claim more than the book does.** Facts, dates and causes are exactly what this textbook
  says (check the extracted pages): if the book says silver is soft, do not write that silver was
  chosen because it is soft.
- **Keep settings realistic** (no 80-year career), and **vary the shape of reasoning items** so the
  bank does not repeat one move ("always N digits") and does not mirror a DPS item.
- **Verify by computation.** Recompute every number in code, every case-study part, every claim.

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

## 12. Owner decision 2026-10-08: every DPS item type, and no easy questions

This section overrides sections 9-11 wherever they disagree (the "plain multiple choice" row of the
section 10 table, the `Easy` label, and the 60% Remember/Understand cap).

**No easy questions.** The bank has no recall items. Concretely, `scripts/load-dps-pack.ts` rejects:
any item at Bloom level `Remember`; the `d` label `Easy` (use `Hard`, or `Hardest` for 5-mark and
case-study items); a chapter where more than 30% of items are `Understand`; and a chapter where
fewer than 30% are `Analyse`/`Evaluate`/`Create`. The old "3+ plain MCQ" minimum is gone. The
one-mark slot is filled by application-level items instead: a situation, a comparison, a number to
work out, a misconception to catch. A fact the book states in one sentence is not asked as a
one-sentence question. (Define / state / name are still the DPS command words for 2 marks; make them
"differentiate with an example", "give a reason", "say what happens and why".)

**Every DPS item type is in the pack.** Per concept: 3+ scenario `mcq`, 1+ `multi_statement`, 1+
`assertion_reason`, 8+ one-mark items in all, 5+ two-mark, 3+ three-mark, 2+ five-mark, 2+ case
studies (the other minimums in section 10 stand). Per chapter, each at least `max(2, ceil(concepts/2))`:
- `match` (as before);
- `fill_blank`: 1 mark, the text holds a blank `___`, the answer is a word or number of at most
  four words so it can be marked automatically (the app already does this). It must be
  application-level: a computed value, a reasoned term, a rule applied, never a name copied from
  the page;
- `true_false`: a 2-mark `short_answer` tagged `true_false` with two steps: the verdict (the
  answer begins "True" or "False"), then the reason or the corrected statement. The false ones hinge
  on a real chapter misconception, and the chapter's verdicts are mixed (25% to 75% True; the loader
  checks it once there are four or more). (The database has no true/false type, and none is added.)

**Figure-based items** are allowed when the figure is described completely in words in the stem
(which line is above which, which side is left, every label and measure), as the Class 7 angle
chapter does. Tag them `figure`. **Maps to point at, and compass-and-ruler constructions, stay out**
until the app can draw an original figure; report them as gaps.

**The existing bank does not meet this yet** (checked 2026-10-08 over 50 files / 6,945 questions:
every file fails: 1,099 Remember items, 1,237 `Easy` labels, 314 concepts short of scenario MCQs,
and no chapter has fill-blank or true/false items). Reworking it is a separate decision; do not
load a file that fails `--check`.