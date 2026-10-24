# Review v3: class6sc ch10 (SCI6, fecu110, Living Creatures), re-review after one fix pass

Pack: content/authoring/dps/class6sc/ch10.json. Scope: content/authoring/class6sc/ch10.json. Pages: content/extracted/fecu110/pages/001-024.
Every question (127) was keyed independently before the key was read; every number was recomputed in python
(scratchpad/rereview-class6sc-ch10/). Numbering is concept.question in file order. The pack was re-ordered by the fix pass, so v2
numbers do not map one to one; v2 items are traced by content.

## A. v2 status per finding

| v2 finding | Status | Where now |
|---|---|---|
| 1.21 (b)(c)(d) stem-answerable parts, strawman decision | FIXED | old case study replaced by a create item (1.21); 1.20 (d) is now a real touch-me-not vs Drosera trade-off |
| 1.20 (a)(b) pure arithmetic | PARTLY | (a) now needs the chapter (excretion), (b) is chapter-based, (c) chapter; 1.13 (b) still arithmetic from the stem |
| 1.16 / 1.21(c) "sunset is the stimulus" claim | FIXED | 1.16 says nothing of the stimulus; 1.21 key states the book does not name the amla stimulus; 1.20(c) names the stimulus only for the touch-me-not |
| 1.14 duplicate "two reasons" | FIXED | replaced by a negative-stem item |
| non-living-lookalike repeated 5 times | PARTLY | now 1.10 (robot dog), 1.17 (bat), 1.18 (4 things), 1.9 (car): 4 uses, within tolerance |
| 2.10, 2.18 easy in disguise | FIXED | now 2.10 (fair temperature test), 2.18 (packed soil) |
| 2.21 (b)(c)(d) | FIXED | rebuilt as three beds; (d) is a real two-option decision with numbers (15 vs 12 gain) |
| 2.2, 2.4/2.5 weak distractors | FIXED / acceptable | |
| store-grain idea 4 times | FIXED | now only 2.20 |
| four-pot activity rebuilt 7 times | PARTLY | cut to 2.2 (trays), 2.8, 2.9, 2.16; but "light not needed to germinate / needed after" still recurs (see M1) |
| 3.3 second defensible reading | FIXED | 3.6 now asks "which question is this pair of pots designed to answer"; only one option is a question the set-up answers |
| 3.5, 3.14 Bose recall | FIXED | Bose now 3.7, 3.8 S3, 3.12 (a decision on what a record can support) |
| 3.10 fill-blank one-line fact | FIXED | now 3.3, counts bent shoots (6); computed |
| 3.22(d) two answers, geotropism claim | FIXED | now 3.20(c): box with a hole vs second upside-down seedling, key rests on "lit from all directions" only |
| 3.19 recall; "beaker" not in stem | FIXED | now 3.15 compares pairs A-B, A-C and B-C (changed / same / shows) |
| 4.9 date fill-blank | FIXED | 4.2 names a stage for Day 55 (but see L3) |
| 4.10 / 4.8 stage numerals | FIXED | 4.15 matches to stage names; 4.8 orders four diary entries |
| 4.5 "no leaf on it" wording | FIXED | 4.14 "on a plant that has not opened any leaf" |
| 4.20(d) thin | FIXED | 80 vs 90 seeds with two germination rates (53 vs 60 plants): real |
| 4.21 death stage | FIXED | 4.17(d) says "including the death stage"; key consistent |
| 5.9 date fill | FIXED | 5.6 stage-count blank, answer 10 (12-2); clean |
| 5.19 life-cycle describe | FIXED | now 5.13 plan with stage per point and 5.21 design |
| 5.21 sites vs flats | FIXED | "9 sites, one in each of 9 flats"; 270 and 22.5% are right; "no oil" clause dropped |
| 5.18 key items 5,6 without a stage | FIXED | 5.13 now includes audit as acting on larvae/pupae; point text consistent |
| 6.21(d) adults leave the pond | FIXED | 6.18(c)-(d) now say adults live in water and on land; a real trade-off |
| 6.9 / 6.20 98 days | PARTLY | 6.2 asks "about 12 weeks"; still one book number (see L2) |
| 6.13 reasons not in book | FIXED | 6.5 asks what the instruction protects |
| 6.19 describe each stage | FIXED | 6.12 (three photographs in words) |
| 6.17 "Yes" claim restating the stem | FIXED | claim_checks now 6.7 and 6.15, both "No" |
| repeated 4.13/6.14/6.18 bean-mosquito-frog comparisons | NOT FIXED | 4.4, 4.20, 6.20, 6.21 remain (M3) |
| fixed slot order across concepts | FIXED | six different type/mark sequences (checked) |
| 6.10 copy of book exercise 4 | FIXED | |

Net: of about 30 items, 27 truly fixed, 3 partly. The fix pass produced no new wrong key or impossible number.

## B. Fixer's flagged calls

1. 3.13(b), "root keeps growing down under one-sided light". Accepted, and the worry is smaller than stated: the book does state it
   (p.194, point 3: "the shoot grows in the direction of light while the root continues to grow downwards"). The only inference is
   turning the box to the west for five more days; the key says "the chapter's rule that the shoot grows in the direction of
   light", and the root downward again follows point 3. LOW only (L1).
2. 4.19 (the fixer's number; the dark seedling is in file item 4.21 (c)-(e)). Acceptable as a hedged inference. The book says only
   that after germination "sunlight is required for further growth" (p.190). The key says Y is "unlikely" to flower and give seeds,
   and the stem asks "unlikely", so the claim is not stated as fact. Weakest link is (e): "Plant Y is unlikely to show reproduction".
   LOW (L4): add "may not" and accept "growth" as a partial.
3. 5.12 / 5.19 (fixer's numbers; the covered-container idea is file 5.12 and the plan point of 5.13). Partly acceptable. (a) "the open
   bucket is the breeding site" is sound (book: stagnant water, eggs laid on or near water). (b) "Which stage can never begin in
   Sana's covered pot? The egg stage ... the female cannot reach the water" overclaims: the book says eggs are laid "on or near
   water", so eggs could be laid on or near the lid; and the larva and pupa stages cannot begin either. See M2.

## C. HIGH

None. Every key was decided first and matches; recomputed in code: 1.5 (18), 1.13 (Riya, 4 more), 2.11 (85 / 90 percent), 2.21
(40 percent; gains 15 and 12), 3.3 (6), 3.10 (90 percent, 3), 3.20 (0.8 cm per day), 4.7 (75 percent, 240, 80, 53 and 60), 4.17 (42,
22), 5.3 (95 percent), 5.6 (10), 5.7 (25 sites, 56 percent, coolers 66.7), 5.19 (270, 22.5 percent), 6.8 (Day 9, 9 weeks, 12 weeks),
6.13 (Day 36), 6.18 (Day 32, 7 October). Statement and assertion-reason keys re-derived: 1.8 S1 only; 2.13 1 and 3; 3.8 2 and 3;
4.12 S2 only; 5.2 1 and 2; 6.6 all three; AR 1.2 / 2.7 both true not explaining, 3.1 / 6.3 explaining, 4.6 A false R true, 5.14
A true R false. No option is named by position; no scope_out term (cotyledon, radicle, phototropism, geotropism, mechanism of
stimulus, malaria mechanism, butterfly cycle) is used.

## D. MEDIUM

M1. Repetition within concepts (recurs after the fix).
- Concept 2: "light is not needed to germinate but is needed after" appears in 2.3, 2.5 (step 5), 2.7, 2.9, 2.11, 2.13, 2.16 (S3, S5),
  2.17, 2.19, 2.20, 2.21(none); 10 items. 2.7 (assertion-reason) and 2.17 (true/false) are near duplicates (dark pot germinates,
  light later). Fix: change 2.7 to the seed-coat/embryo idea (A: soaked seeds sprout sooner; R: water softens the seed coat) and
  turn 2.17 into the ground-for-roots idea (loose soil), keeping the light idea in 2.3, 2.11 and 2.19.
- Concept 3: the one-side-lit shoot result appears in 3.1, 3.2, 3.5, 3.6, 3.13, 3.15, 3.17, 3.18, 3.19, 3.20, 3.21 (11 of 22).
  3.19 (why a box with one hole) duplicates 3.6. Fix: replace 3.19 with a new idea (why a plant at a window leans only until the
  light is even; or what a seedling's shoot does with light from two sides of equal strength, only if the book supports it; else a
  moisture-source item).
- Concept 5: kerosene and air in 5.11, 5.13, 5.14, 5.17, 5.20 (5). Fix: replace 5.11 (a one-line book fact) with the idea "why
  eggs laid on dry land fail" or the adult lifespan limiting the cycle.
- Concept 4: stage order in 4.2, 4.8, 4.14, 4.15, 4.17, 4.19 (6). Replace 4.2 (reads a diary).

M2. 5.12(b): second defensible answer and overclaim. "Which stage of the life cycle can never begin in Sana's covered pot, and
why?" Key: the egg stage. The book says eggs are laid on or near water and larvae and pupae live in water; with a lid the larva
and pupa stages cannot start either, and eggs could still be laid near the lid. Smallest fix: "Which stage is blocked first by
the lid, and which later stages then cannot happen?" key: egg-laying on the water, so no larvae, no pupae. Same softening for
5.13 point (3) ("female cannot lay her eggs on the water" is fine; drop "cannot lay").

M3. Repeated comparison command. 4.4 ("Give two similarities and three differences", bean vs frog) and 6.21 (identical wording,
mosquito vs frog) are the same five-mark template; 4.20 (bean vs mosquito, 2 marks) and 6.20 (mosquito vs frog, 2 marks)
repeat the pairs; 6.20 duplicates 6.21. 4.4 and 6.21 are also the book's own exercises 1 and 6 (p.203-204) reworded. Fix: keep 6.21
with different wording ("a pond is drained twice: what happens to each cycle at each stage?"); delete 6.20; recast 4.4 as a
question that uses a stem-given table of stages rather than a free comparison.

M4. Case-study residue. (b) is still arithmetic read from the stem in 1.13(b) (walk to run), 3.20(b) (4.8/6), 4.7(b) (8 x 6 x 5),
5.7(b)/(c) (percentages), 5.19(b) (9 x 30) and 6.8(b) (63/7). Five of the 12 cases keep the shape (a) chapter fact, (b)
sum, (c) chapter fact, (d) choose. Several decisions are lopsided: 3.20(c) (the one-hole box clearly beats a second upside-down
seedling), 4.17(d) (60 days is less than 80, so the answer is "no, partly" from the numbers), 5.3(e) (Block A clearly beats Block
B). Fix: in 3.20 make both exhibits plausible (one-hole box vs two seedlings in light and shade) and in 5.3(e) ask for the one
improvement only, since the plan is already obvious.

M5. Easy in disguise (answer is a one-line book fact), about 28 of 127 (22 percent): 1.1, 1.6, 1.15, 2.6, 2.12, 2.14, 2.17, 3.1,
3.14, 3.19, 4.2, 4.5, 4.10, 4.16, 4.18, 5.1, 5.4, 5.11, 5.16, 6.1, 6.2, 6.4, 6.10, 6.16, 6.17, 5.20, 3.5, 6.9. Most are the
1-mark MCQs and the 2-mark "reason" items. Concrete cases to rework: 6.2 (12 weeks, the book's Stage III label), 6.4 (white jelly
is spawn, one sentence of p.200), 5.4 (larvae and pupae need air, one sentence of p.197), 5.11 (kerosene, one sentence),
2.14 (list recognition), 6.17 and 4.5 ("Differentiate", two definitions). Make each ask a consequence or a decision: for 6.2
give a two-row table of stage and day and ask in which week a visit finds "tadpoles with tails and legs" and why not "froglets".
All items are labelled Hard or Hardest (0 Easy), as the bank requires, but the label is not earned for these.

## E. LOW

L1. 3.13(b): turning the box to the west is outside the book's three set-ups; key says "the chapter's rule", fine.
L2. 6.2: "about 12 weeks"; Day 1 start and "about" make 11 to 13 defensible for a machine match. Ask "stage name" or give a
   lookup table.
L3. 4.2: "appearance of ___" and 2.3 "sunlight / light" need a variants list in the answer ("flowers", "flowering"; "sunlight", "light").
L4. 4.21(c)-(e): see B2.
L5. 4.11(a): "the arrow back to the start comes from the pod, not from the dead plant" asserts a figure detail (Fig. 10.4 labels
   only: Stage V, Fruit, Death of plant); the extracted page shows no arrows. Describe the figure in the stem or drop the arrow.
L6. 3.21: "closed steel box" is airless; a literal reader says air is missing too. Say "a box with a small gap at the lid".
L7. 6.14(a): book never says frog eggs are unlike a hen's egg (it only asks the question). Key is an inference; mark as such.
L8. 3.7(a): "growth is far too slow to see in five minutes" is the author's inference from the crescograph text; fine, keep it
   marked as such.
L9. 1.19(b): "which other characteristic must go with growth" has a single intended answer (food) only because of the second clause;
   keep the clause.
L10. 6.18(a): at Day 32 the book gives no stage between Day 7-10 and weeks 8-10; the key's "tailed, legless tadpoles" is the
   nearest reading. Add "the nearest stage the chapter gives".
L11. 2.18 option "makes water stand above it" is the only distractor that a thoughtful reader could half-defend for hard-packed
   soil; swap for "makes the seed coat too wet".
L12. 5.21 is the book's own Activity 10.5 wording ("without separating them"); acceptable as design, note the source.

## F. Counts read

127 questions (21, 21, 22, 21, 21, 21). Types: 32 mcq, 6 multi_statement, 6 assertion_reason, 5 match, 6 fill_blank, 48 short_answer
(6 true_false, 7 claim_check among them), 24 long_answer (12 tagged case_study, 5-mark items 12). Marks: 55 x 1, 30 x 2, 18 x 3, 12 x 4, 12 x 5.
Bloom: 3 Understand, 29 Apply, 55 Analyse, 32 Evaluate, 8 Create (75 percent Analyse/Evaluate/Create; before: 67 percent). Labels: 103 Hard, 24
Hardest, 0 Easy. Step marks equal the marks on every item; every 2+ mark item has steps; every key is in its options; no duplicate options.
- multi_statement keys: 1 only, 1 and 3, 2 and 3, 2 only, 1 and 2, all three (six different, false statement varies).
- assertion_reason: both true not explaining x2, both true explaining x2, A false R true x1, A true R false x1.
- true_false: 3 True, 3 False. claim_check: 3 No, 2 Partly, 2 Yes: good mix, one per concept at most twice.
- Correct MCQ option strictly longest: 0 of 32.
- Slot order: six different type/mark sequences (checked item by item); the old identical order is gone. Fill-blank: 6, none
  is date arithmetic; one is book-number lookup (6.2), one is stage lookup (4.2), one is counting (3.3), one is stage arithmetic (5.6),
  one is a two-value computation (1.5), one is a single word (2.3).
- Templating: slot order fixed; wording not templated; residual templates are the identical "two similarities and three
  differences" (4.4, 6.21), the case-study shape in M4, and one-activity repetition in M1.

## G. Verdicts per concept

- C6SC-10.1 (characteristics): pass. Keys right; case-study (d) a real decision; sunset claim removed. Residual: 1.13 arithmetic.
- C6SC-10.2 (germination): pass after fixes. Keys right; the light idea is over-tested (M1); 2.7 and 2.17 near duplicates.
- C6SC-10.3 (root, shoot, Bose): pass after fixes. Keys right; one-side-lit over-tested; 3.19 duplicates 3.6; 3.20(c) lopsided.
- C6SC-10.4 (plant life cycle): pass after fixes. Keys right; L5; 4.21 hedged inference; 4.4 template.
- C6SC-10.5 (mosquito): pass after fixes. Keys right; 5.12(b) overclaim (M2); kerosene repeated.
- C6SC-10.6 (frog): pass after fixes. Keys right; 6.20 and 6.21 duplicate; 6.2 and 6.4 recall.

## Verdict

PASS AFTER FIXES. 127 read, 0 HIGH, 5 MEDIUM groups (M1-M5, about 22 items to touch), 12 LOW. The v2 findings are almost all
genuinely fixed and the fix pass introduced no new wrong key, second answer or impossible number except the 5.12(b) overclaim.
Fix M2 and M3 and the near duplicates (2.7/2.17, 3.19, 6.20) before loading; M4 and M5 can follow in a later pass.
