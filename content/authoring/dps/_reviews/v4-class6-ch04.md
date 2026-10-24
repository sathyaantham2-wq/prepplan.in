# Review v4 (independent): Class 6 Maths ch04 "Data Handling and Presentation" (dps/class6/ch04.json)

Read: all 124 questions (4.1: 22, 4.2: 20, 4.3: 20, 4.4: 20, 4.5: 21, 4.6: 21), no sampling, against fegp104 pages
(sweets and shoe tables, pictograph pages, Smriti's runs, Imran's expenditure, the seven-mountain table, infographic page).
Every number, tally, ratio, rounding and case-study part was recomputed in python or by hand before the stored key was
read. Item numbers are the 0-based index inside the concept, in file order.
Programmatic checks: every mcq/match/AR/multi_statement key text equals one of its options (0 failures); no duplicate
options; no positional option references (0 hits); correct option strictly longest in 7 of 30 mcq (23%, no tell).

## v3 findings: re-verified
- 4.3 [0] (was HIGH): stem now says Wednesday's bar is 8 units tall; (14 + 8) x 25 = 550, key and options right. Fixed.
- 4.4 [15] (was HIGH): key now "a larger scale such as 500 (bars from 2.8 to 7.4 units)"; 1400/500 = 2.8, 3700/500 = 7.4. Fixed.
- 4.4 [9] key wording ("divide all of"), 4.2 [2] option 4 ("only whole and half symbols allowed"), 4.1 [20]/[21] stem
  length, 4.3 [19] (missing bar now a reasoning step), 4.3 [12] and 4.6 [7]/[8] area reasoning (now width-as-extra-message,
  heights only), 4.5 [2] distractor (now "399 m"): all fixed.
- The other v3 items recomputed again below; no new key error appeared.

## HIGH (0)

None. All keys match my independent answers. Items I recomputed with particular care and found correct:
4.1 [4] (53 goals), [5] (carrom = 2; 1-C, 2-B, 3-A, 4-D), [6] (banana 12 < 9 + 4 = 13, so S1 false; "2 and 3 only"), [10] (counts 4, 7,
5, 3, 1; 9 above one), [18] (13, 6, 6, 5), [19] (3, 6, 5, 6, 4, 6), [20] (13/10/8/5; pairs 6000/23, 4300/21, 5800/18, 4700/18,
6200/15, 4500/13: only kabaddi + cricket reaches 22 within Rs 6000), [21] (boxes 1, 2, 2, 2, 1 = 8; spare 1, 2, 1, 4, 2);
4.2 [1]/[7] (gcd 20), [12] (gcd 3), [17] (215, 43, 21.5), [18] (360; 80 a day: 30 away, 70 unsold; 100 a day: 0 away, 140 unsold),
[19] (12, 8.5, 6.5, 14, 10; key 5 gives 24 and 28, which break the 20-symbol row, so key 10 is forced);
4.3 [5] (S2 false: a fall of 2 units is 200 vehicles; "1 and 3 only"), [16] (4450; pairs 1350, 2200, 1800, 1500, 1300), [17]
(rises 8, 10, 14, 16, 18), [18] (Fri 600, Sat 700; gains Rs 100 and Rs 200; Rs 300), [19] (240 v 230; 1 v 2 matches);
4.4 [0] (scale 200 is the only option keeping 400 at 2 units and 3400 at 17), [13] (scale 3), [17] (70; 2240; scale 140 gives
6, 4, 2, 3, 1), [18] (Banyan drawn 3 not 2), [19] (8, 6, 10, 9, 7; 4, 3, 5, 4.5, 3.5; 15 and 7.5);
4.5 [14] (gaps 1886, 768, 299, 253, 750, 2664: Kilimanjaro-Elbrus is closest), [17] (17.7, 13.9, 12.4, 11.8, 11.3, 9.8, 4.5),
[18], [19], [20] (3.6, 8.4, 5.2, 6.8, 1.8); 4.6 [9] (6848/228 = 30.0, 8848/2228 = 3.97), [16] (8.5 cm), [17] (8.8, 7.0, 6.2, 5.9, 5.6,
4.9, 2.2), [19] (4.5, 8, 7, 4, 1), [20] (11,284; 6.4; 1.4). multi_statement and assertion_reason truth values: all matched keys.

## MEDIUM (5)

1. **Template: slot order is identical in all six concepts (unchanged since v2 and v3).** Every concept is 5 mcq, multi_statement,
   assertion_reason, fill_blank or match, then 8-9 short answers (2-2-...-3-3-3), then long answers 5, 5, 4, 4 in that exact order;
   4.2 and 4.4 even share the same marks sequence (a 3-mark show_impossible at slot 10). Eleven of the twelve long/case items
   end in "recommend / choose a plan". Fix: in at least three concepts move the fill_blank/match and the show_impossible
   earlier or later, make one concept's last two items 5 and 5 and a different one 4, 4, 4, and turn two case studies into
   "find the wrong bar / recover the missing scale" (as 4.4 [17] and [18] already do) instead of a two-plan recommendation.
2. **Repeated ideas in C6M-4.5 and 4.6 (still heavy).** 4.5: the mountain "divide by 500" arithmetic is in [1], [2], [7], [10], [11],
   [14], [17]; "heights vertical, lengths horizontal" is the centre of [0], [3], [5], [8], [9], [13](partly), [15], [16], [17](d), [18](a),
   [19](a), [20](d) (about 12 items). 4.6: "twice as tall as Elbrus" is [0], [10] (key) and [20]; "width grows with height" is
   [2], [5], [8], [10], [12], [13], [14], [17], [18](c), [19]. Fix: keep one item per idea (4.5: [0], [1], [14], [18]; 4.6: [0], [8], [14],
   [20]) and swap the rest for other chapter ideas (fit to space with an awkward scale, colour not changing accuracy, reading
   a comparison from a column graph, a graph that does not start at zero).
3. **Easy in disguise (a one-line book statement or one division, labelled Hard).** Book-line recall: 4.1 [1] (almost the book's own
   exercise 4: which questions need data), 4.1 [3] (book exercise 2: the table does not say which child), 4.1 [13] (same point
   as [3] again), 4.1 [5] (match: frequency, highest, lowest and tally reading, only read-off), 4.3 [4] (names two of the
   bar-graph features the book lists), 4.5 [0], 4.5 [13], 4.5 [15], 4.5 [16] (book's vertical-for-height rule), 4.6 [10] (two
   ways decoration misleads: "Understand"), 4.6 [11] (book's definition of infographic). Single-division items: 4.1 [8]
   (34 - 30), 4.2 [0], 4.2 [14] (36 = 3 x 12, the key adds nothing), 4.3 [14] (15 : 3 = 5), 4.5 [7], 4.6 [7] (all five fill_blanks are one-step
   arithmetic; the bank rule is application level). Fix: give each fill_blank a trap or second step (for example "a half symbol
   stands for 3, so 45 dogs need ___ symbols"; or "the smallest page-fitting whole scale for 13, 7 and 9 on 5 units is ___")
   and rewrite 4.1 [3]/[13] into one item plus a new idea (a tally of 13 drawn with a loose stroke).
4. **Soft case-study endings ("Either choice is acceptable if justified").** 4.2 [17], 4.3 [19], 4.5 [19], 4.5 [20], 4.6 [20] and
   4.4 [19] (balanced) have no computed number that decides the pick. 4.2 [19] and 4.2 [18] already show the better design
   (a constraint that makes one option fail). Fix: add one constraint to each, for example 4.5 [19] "the poster has a 12 cm
   column limit" (4 m fails for 15 cm) so that the key 6 m is forced; for 4.2 [17] a 12-symbol row limit decides between key 5
   (up to 7 per class) and key 1.
5. **True_false items with a True verdict and no real misconception.** 4.2 [8] (same 35 shown by two keys) and 4.5 [9] (same table and
   scale give the same information) are still True, unchanged since v3. Mix is 2 True / 4 False, so acceptable overall, but flip
   one to a tempting False: 4.5 [9] "a column graph and a flat-bar graph of the same table show different data"; 4.2 [8]
   "the row of 7 symbols (key 5) shows more students than the row of 3 whole and 1 half symbol (key 10) because it has more symbols".

## LOW (5)

1. C6M-4.2 [1] and [7] use the same four counts (40, 60, 100, 80) and the same answer (key 20); [7] is a restatement of [1].
   Change the numbers in [7] (for example 45, 75, 105 and 60 with key 15) or drop one.
2. C6M-4.1 [14] key "an error of 2 in some count" could be several counts that cancel; say "the counts are off by 2 in total".
3. C6M-4.5 [19](d) "all whole" (key 6 m: 4, 6, 2, 8, 10) reads as a contrast with 4 m, but 4 m also gives whole heights (6, 9, 3, 12, 15);
   remove "all whole".
4. C6M-4.3 [9] argues "scale must divide every number"; add "(scales are whole numbers here)" so a student does not suggest 2.5.
5. C6M-4.3 [13] (Nina) and 4.1 [15] (Rohit) are mild strawman claims whose refutation is a single sentence; fine as claim_checks but
   strengthen by giving a plausible-looking true half (see 4.4 [15]).

## Checked and fine

- Scope: nothing violates scope_out (no pie, line graph, histogram, mean/median/mode, range, double bar, probability or sampling).
  The goal-total, run-total and book-total items multiply-and-add without naming a mean. Area reasoning no longer appears.
  Starting-from-zero (4.3 [10], 4.6 [9], 4.6 [17](d)) is in the book (pp. 87, 100). Facts match the book, including the spelling
  "Koscuiszko", the mountain order, Imran's and Smriti's data and Pooja's tickets.
- multi_statement keys: "2 and 3 only", "1 only", "1 and 3 only", "3 only", "1 and 2 only", "1, 2 and 3": six different keys.
  Option text length: no tell.
- assertion_reason: 2 explains (4.2, 4.4), 2 does-not-explain (4.1, 4.6), 1 A true R false (4.3), 1 A false R true (4.5). Good spread.
- claim_check verdicts (12): No 6, Yes 4, Partly 2. true_false: 2 True, 4 False.
- Case studies climb (read, combine, compare, decide) and step marks equal item marks throughout. Last parts are real
  decisions in 4.1 [20], 4.1 [21], 4.2 [18], 4.2 [19], 4.3 [18], 4.4 [17], 4.4 [18]; the rest are soft (MEDIUM 4).
- Bloom and difficulty: Analyse 55, Apply 36, Evaluate 28, Create 4, Understand 1; Hard 100, Hardest 24. No Easy or Medium items.

## Per-concept verdicts

- C6M-4.1: pass (keys correct; easy items 1, 3, 5, 8, 13).
- C6M-4.2: pass (keys correct; [1]/[7] duplicate, [14] trivial, one soft case study).
- C6M-4.3: pass (v3 HIGH fixed; keys correct).
- C6M-4.4: pass (v3 HIGH fixed; keys correct; best-designed concept).
- C6M-4.5: pass after trim (heavy repeat of mountain division and bar direction; two soft case studies).
- C6M-4.6: pass after trim (repeated "twice" and "width" ideas; recall items 10 and 11).

## Counts

124 read; 0 HIGH; 5 MEDIUM; 5 LOW. Templated: partly (identical slot order and mark sequence in all six concepts, and a
"recommend a plan" ending in nearly every long item; item frames inside a concept do vary). Overall: pass (no wrong key,
no second defensible answer; the MEDIUMs are polish and variety, not correctness).
