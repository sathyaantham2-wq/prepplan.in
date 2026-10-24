# Review v3 (independent): Class 6 Maths ch04 "Data Handling and Presentation" (dps/class6/ch04.json)

Read: all 124 questions (4.1: 22, 4.2: 20, 4.3: 20, 4.4: 20, 4.5: 21, 4.6: 21), no sampling, plus textbook pages of
fegp104 (4.1 to 4.6, summary, solutions). Every number, tally, ratio, rounding and case-study part was recomputed in
python before the stored key was read. Item numbers are the 0-based index inside the concept, in file order.
Programmatic checks: every mcq/match/AR/multi_statement key text equals one of its options (0 failures); no duplicate
options; no positional option references (0 hits); step marks sum to item marks in every item; no option-length tell
(correct option strictly longest in 6 of 30 mcq = 20%).

## v2 fixes: all re-verified
- 4.3 [5] multi_statement: Statement 2 now "fell by 2000 vehicles" (false), key "1 and 3 only" correct. Fixed.
- 4.5 [10] answer now says "close in height" (299 m, 0.6 cm), no false "much closer than the others". Fixed.
- 4.4 [14] (page height given), 4.2 [11] ("largest key", gcd 3 unique), 4.6 [10] (area-grows-faster wording), 4.4 [18](d)
  (cost phrase gone), 4.1 [1] (leap year gone), 4.2 [18], 4.3 [18], 4.1 [20] (now real decisions with a defended pick). Fixed.
  4.5 [14] was rebuilt as a correct claim (closest pair is Kilimanjaro-Elbrus, 253 m): verified against the page data.

## HIGH (2)

1. **C6M-4.3 [0] mcq: keyed "550 litres", but the stem gives 500.** "The bar for Tuesday is 14 units tall and the bar for
   Wednesday is 8 units shorter than Tuesday's... 1 unit length = 25 litres." Wednesday = 14 - 8 = 6 units; together
   (14 + 6) x 25 = 500 litres. 500 is not among the options (550, 22, 350, 200), so the key is wrong and no option is right.
   550 = (14 + 8) x 25, which is the answer if Wednesday's bar is 8 units tall (then the distractors 22 = unscaled sum,
   350 = Tuesday alone, 200 = Wednesday alone all work).
   Smallest fix: change the stem to "the bar for Wednesday is 8 units tall" (key 550 stays), or keep "8 units shorter"
   and change the key and one option to "500 litres".

2. **C6M-4.4 [15] claim_check (Mohan, tigers): the model answer suggests a scale that does not fit.** Key: "a larger
   scale such as 100 (14 to 37 units) or 500 is needed". The stem says the chart holds bars up to 10 units; 37 units
   does not fit (the item 4.4 [11](a) itself shows 3700 / 100 = 37 is too tall). A student who suggests 100 gets credit
   for a wrong remedy. Smallest fix: "a larger scale such as 500 (3 to 7.4 units)" and delete the 100 clause.

## MEDIUM (7)

1. **Template: slot order is still identical in all six concepts.** 5 mcq, multi_statement, assertion_reason,
   fill_blank/match, then short answers (true_false first among them in 4.1-4.5), then the same three-mark pair
   (claim, claim, then reverse/show_impossible), then two 5-mark and two 4-mark case studies in every concept; 11 of
   12 five-mark/case items end in a "recommend between plans" decision. Fix (not done since v2): in at least three
   concepts move show_impossible earlier, give one concept a 5-mark case study and three 4-mark items, move the
   match/fill_blank, and turn two case studies into something other than a two-plan recommendation (find the wrong bar,
   find the missing scale).
2. **Repeated idea, C6M-4.5 and 4.6 (unchanged from v2, only lightly trimmed).** 4.5: the Everest/Denali/Kilimanjaro/
   Koscuiszko "divide by 500" arithmetic is in [1], [4], [7], [10], [11], [14], [17] (seven items on one dataset), and
   "heights upward so vertical, lengths along the ground so horizontal" is in [0], [3], [5] (S1/S3), [8], [9], [15], [16],
   [17](d), [18](a), [19](a), [20](d). 4.6: "Everest drawn twice Elbrus, 2 x 5642 = 11,284" is the heart of [0], [16] and
   [20]; "triangle width grows with height" is [5], [6], [8], [12], [13], [14], [17], [18], [19]. Fix: keep [0] and [20]
   and drop [16] (it restates [0]); in 4.5 keep [1], [10], [14] for mountains and swap [4], [7], [11] to other
   data; keep [0], [9], [16], [18] for direction and give the rest other 4.5 ideas (fit to space with an odd scale,
   colour not changing accuracy, reading a comparison from a column graph).
3. **Beyond what this chapter teaches: area reasoning.** 4.6 [7] (fill_blank: "twice as tall and twice as wide... its area
   is ___ times"), 4.6 [8] (area of a triangle = half of width x height, ratio 2.5), 4.6 [10] key (area grows faster
   than height), 4.3 [12] (areas of bars 32 and 8, ratio 4:1). The book's only complaint about the triangles (p.104) is that
   width "implies additional information that may be misleading"; it never speaks of area or area ratios. Fix: reframe
   4.6 [7] and 4.3 [12] as "what extra message does the width give" or drop the area ratio; 4.6 [8] can stay if the
   area formula is given and the weight on the area ratio is lowered, but then [7] should go.
4. **Soft case-study decisions (the last part is "either is acceptable").** 4.2 [17], 4.2 [19], 4.3 [19], 4.4 [19], 4.5 [19],
   4.5 [20] each end "Either choice is acceptable if justified" (4.6 [20] likewise). In 4.2 [19] the stem's 30-symbol
   limit never decides anything (key 10 needs at most 14 symbols, key 5 at most 28, both fit), so the stated constraint is
   decoration. Fix: add a constraint that makes one option fail (poster row holds 20 symbols so key 5 fails for the 140
   stall; hanging space of 8 cm in 4.5 [20]) and have (d) turn on one computed number.
5. **Easy in disguise (a one-line book fact or a single division, labelled Hard).** 4.1 [5] (match: frequency, tally mark,
   ascending order, data - pure vocabulary), 4.1 [8] (fill_blank 34 - 30), 4.1 [0] (two small multiplications), 4.2 [7]
   (45 / 6), 4.2 [13] (no key means no counts; the book's own point), 4.4 [4] (order of the drawing steps, the book's list),
   4.6 [7] (fill_blank 2 x 2). All five fill_blank items are one-step arithmetic; the bank rule is application-level.
   Fix: give a blank a trap ("a half symbol stands for 3, so 45 dogs need ___ symbols in the key 1 symbol = 6 and 1 more
   dog's worth...", or the largest whole key for 40, 60, 100, 80 is ___) and give 4.1 [5] a matching of situations (a
   tally of 13 with a loose stroke) instead of definitions.
6. **Two true_false items have a True verdict with no misconception** (4.2 [8] two keys show the same 35; 4.5 [9] same
   table, same scale, same information). Mix is 2 True / 4 False so fine overall, but flip one to a tempting False: 4.2 [8]
   "...show different numbers of students because they have different numbers of symbols"; 4.5 [9] "...a column graph
   and a flat-bar graph of the same table show different data".
7. **C6M-4.3 [19](a) is nearly free.** The stem lists the bars "8, 5, 1, 10, 9, (no visible bar), 9 and 5 units", so
   "match 3 shows 1 x 10" is read off the stem. Fix: ask for the runs of match 4 and match 6 together, or the match with
   the most runs, and make the missing bar a reasoning step.

## LOW (6)

1. C6M-4.4 [9] key text: "The numbers divisible by all of 24, 20, 16 and 28 are 1, 2 and 4" is the wrong way round;
   write "The numbers that divide all of 24, 20, 16 and 28 are 1, 2 and 4".
2. C6M-4.2 [2] option 4 ("a smaller symbol standing for exactly 2 students can show it") is defensible only by changing the
   key; add "with only whole and half symbols allowed" to the stem to remove any second answer.
3. C6M-4.1 [20] stem is 167 words, [21] 142 words (others 90 to 135); trim the list of kit costs into one sentence.
4. C6M-4.2 [18]: pictograph counts are used as demand ("customers turned away" on Tuesday when only 80 were cooked); say
   "the pictograph shows how many customers wanted a samosa" in the stem.
5. C6M-4.5 [2]: the options include one visibly silly distractor ("400 m... rounding both to the nearest hundred metres").
   Replace with a mistake a student would make (subtracting 6194 - 5895 as 399).
6. C6M-4.4 [16] and [19]: both repeat the "scale fits the page" frame already used in [0], [10], [11], [12], [13], [14] and
   [15]; consider replacing [12] by "find the scale from two bars" as v2 suggested.

## Checked and fine

- multi_statement keys: 4.1 "2 and 3 only", 4.2 "1 only", 4.3 "1 and 3 only", 4.4 "3 only", 4.5 "1 and 2 only", 4.6 "1, 2
  and 3": six different keys, a good spread. Every statement was evaluated: truths match keys.
- assertion_reason keys: 2 "explains", 2 "does not explain", 1 "A true R false" (4.3 [6], R multiplies/divides reversed),
  1 "A false R true" (4.5 [6]). Truth values and explanation checked.
- claim_check verdicts (12): No 6, Yes 4, Partly 2. true_false: 2 True, 4 False.
- Case-study arithmetic all correct (recomputed): 4.1 [18] (13, 6, 6, 5), [19], [20] (13/10/8/5; K+C Rs 6000 covers 23,
  K+T 21), [21] (8 boxes, Rs 8000 v 8250, spare 1/2/1/4/2); 4.2 [18] (360 sold, 70 unsold v 140 unsold, 30 turned away);
  4.2 [19]; 4.3 [16] (4450; pair totals 1350, 2200, 1800, 1500, 1300), [18] (+Rs 100, +Rs 200), [19] (240 v 230);
  4.4 [17] (70 quintals per unit, total 2240), [18], [19]; 4.5 [17]-[20]; 4.6 [17]-[20] (6.4 cm, 1.4 cm).
- Facts match the book: sweets table, shoe sizes, Smriti's runs, population 36...102 crores, mountain heights and
  "Koscuiszko" spelling, Imran's expenditure. Nothing violates scope_out (no mean/median, pie, line, histogram, range,
  double bar, probability, sampling). The goal-total items use multiply-and-add without naming a mean.
- Bloom: Analyse 55, Apply 36, Evaluate 28, Create 4, Understand 1; difficulty Hard 100, Hardest 24. No Easy or Medium items.

## Per-concept verdicts

- C6M-4.1: pass (keys correct; a few easy items, 5 and 8, listed above).
- C6M-4.2: pass (keys correct; two soft case-study endings).
- C6M-4.3: fix [0] (HIGH wrong key); rest correct.
- C6M-4.4: fix [15] (HIGH); rest correct.
- C6M-4.5: pass after fixes (heavy repeat of mountain division and bar direction; soft endings).
- C6M-4.6: pass after fixes (repeated "twice"/"width" ideas, area beyond the book).

## Counts

124 read; 2 HIGH; 7 MEDIUM; 6 LOW. Templated: partly (identical slot order in all six concepts, a few repeated ideas;
item frames inside a concept vary). Overall: pass after fixes (both HIGH are one-line edits).
