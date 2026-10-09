# Review v2: Class 7 Maths Part II ch 7 "Finding the Unknown" (gegp207), rewrite pass
File: content/authoring/dps/class7/p2ch07.json. Questions read: 146 of 146 (7 concepts, 20-21 each), no sampling.
Method: every number in every item (changed and unchanged) recomputed in Python with exact fractions; every history fact checked against pages 019-021 of content/extracted/gegp207/pages/; scope from content/structure/class7-maths-part2.md (Part II Ch 7). Compared with the v1 backup (content/authoring/dps-v1-backup-2026-10-08/class7/p2ch07.json) and the older review class7-p2ch07.md.

## Headline
- **Keys: 0 wrong, 0 second-answer.** All 146 keys recompute, all step-mark sums equal the item marks, no option is named by position, `a` is always among `o`. The author's unverified arithmetic is in fact right.
- **Text-identical to the backup: 114 of 146 (78%)**; 32 items are new (per concept 5,5,4,4,4,5,5). For all 114 the key, options, type, Bloom, marks and tags are also unchanged (no relabelling). The 32 dropped backup items were the MCQ/define recall items.
- **The "no easy questions" rule is NOT met.** 71 of 146 items (49%) have an answer that is a one-step operation, a definition or a line the book states, or a book example with new numbers. 53 of the 71 are unchanged from the backup, and **18 are NEW items the rewrite added** (mainly one-mark MCQs and fill-blanks that replaced old recall items with new one-step ones). 19 of the 71 carry an Analyse/Evaluate/Create label, so the Bloom mix (Remember 0, Understand 11%, Analyse/Evaluate/Create 46%) passes the loader while the thinking does not.
- Claim-check verdicts were rebalanced past the target: 4 Yes / 2 No / 1 partly (57% Yes), and all four Yes items just confirm a computation whose result is printed in the stem.
- Verdict: **pass after fixes** on accuracy; **rework of the easy list** needed before this meets section 12.

## HIGH (0)
None. (The two HIGH defects of the older review, 7.2 case study (d) timing and 7.6 case study (d) one-slip-each, are fixed and recompute correctly.)

## MEDIUM

M1. **Easy-in-disguise: 71 items, listed in EASY LIST at the end.** Fix: replace the one-mark and 2-mark ones with items that need two ideas (a slip to find AND a value to compute; a comparison of two methods; a "which of these four is wrong" across four equations) and re-label the rest honestly. Targets worth doing first: all four `fill_blank` that are one step (7.1 #5, 7.5 #7, 7.6 #15, 7.7 #8), the 7.1 matchstick MCQs (#4, #17, #20), the history items in 7.7.

M2. **Claim-checks over-corrected to Yes (7.3 #6, 7.4 #14, 7.5 #12, 7.7 #11; No: 7.1 #2, 7.6 #8; partly: 7.2 #11).** Each verdict is correct (recomputed: Teena x = 7 both ways; Isha 40 x 40 + 500 = 2100 exactly; Divya 6(n+2) = 54 and n = 7; Sara 16 / 4 = 4). But in the four Yes items the claim already contains the answer, so the work is one substitution. Target is about half No, a quarter Yes, a quarter partly. Fix: turn 7.3 #6 and 7.5 #12 into "partly right" (for example Teena right about the answer but wrong that expanding first needs no bracket step; Divya right that the solutions agree but wrong about the reason), and make 7.4 #14 a "No" (budget 2,100 but the fee is 45 per student: 40 x 45 + 500 = 2300 > 2100). Keep 7.7 #11 as the one Yes only if the claim hides an A=C trap.

M3. **Case-study last part is forced or read off the data (not a real decision):**
 - 7.2 #6 (d): "whole-number trials or the systematic method?" 65/4 = 16.25 settles it; (a),(b) are bare substitution and reading, answerable without the chapter.
 - 7.3 #4 (d): the stem already says "every member must receive a whole number", so 10 not 11 is forced; (b),(c) are plain division.
 - 7.5 #14 (d): read straight off (c) (P equal, Q unequal); (a),(b) just carry out steps printed in the stem.
 - 7.6 #10 (d): 2 of 3 outputs wrong, stem sets up "approve if right most of the time", answer is "no" (strawman-lite).
 - 7.7 #12 (d): "will A and C ever hold the same amount?" is determinate (A = C), not a judgement; (a) is the stem restated.
 - 7.7 #16 (d): the stem says the answer must be a positive number of coins, so card 1 is forced.
 Fix: give each a cost or two-sided trade-off (as 7.4 #9 and 7.5 #1 already do) or ask for a new quantity: for 7.3 #4, "the group keeps 12 members but one is absent; who pays the rest?"; for 7.7 #16, drop the "positive" requirement and ask what the dot does to the equation's solution when the curator needs a total of 40 coins.

M4. **7.2 #19 (Bhavna) stem leaks part (c).** (d) says "On the day of that 8th deposit", giving m = 8 which (c) asks for. Fix: "On the day she reaches exactly Rs 350 the shop raises the price to Rs 380, before she can buy."

M5. **7.4 #9 (picnic) budget inconsistency.** At 45 people Caterer B (Rs 2020) is already over the Rs 2000 budget, so A is forced by the budget not by the crossover; at 90 people both exceed Rs 2000 so the budget is silently dropped. Fix: "The budget for the bigger event is Rs 4000".

M6. **Repeated ideas inside a concept (one idea tested more than about twice):**
 - 7.1: "position n uses 2n+1 (or similar) sticks, find n or the equation" in #1, #4, #5, #8, #10, #13, #14(c), #20 (8 of 20).
 - 7.2: "same operation on both sides of an arithmetic equality" in #1, #3, #4, #8, #12, #13, #16, #21 (all clones of book Examples 1-4).
 - 7.4: "fixed fee plus rate per unit" in #1, #3, #4, #7, #12, #14, #19 (7 of 21); Imran/Zoya in both #8 and #13 (same data); "sum 84, five times" in #1 and #15.
 - 7.5: "start from a solution, apply operations, state the same solution" in #2, #5, #7, #15, #19, #20, #21. #5 and #19 are near duplicates (add then multiply).
 - 7.6: "divide only one term" in #1, #4, #7, #9(i), #10 (R), #14 (S1); "moved a term without flipping the sign" in #2, #5, #9(iii), #10 (P), #11, #17, #18; "bracket not multiplied" in #11, #19, #20.
 - 7.7: "plug into Brahmagupta's formula" in #1, #3, #5, #6, #8, #11 (6 of 21); "dot over a number means negative" in #10, #15, #16, #19.
 - 7.3: u = 14 for 5u - 6 = 4u + 8 appears twice (#13 and #17).
 Fix: keep one or two per idea and replace the rest with the ideas the concept has not yet tested (7.1: balance with an unknown on both pans AND a negative; 7.5: two equations with the same solution decided without solving; 7.7: a case where D - B is negative).

M7. **Book clones with only the numbers changed** (the standard asks for fresh settings): 7.2 #8 / #13 / #12 / #16 are the book's Examples 1, 3, 4 pattern; 7.2 #21 is Example 2's reasoning; 7.3 #2 (9k = 5k) is Figure it Out 1(b); 7.3 #15 is Example 6 shape; 7.4 #6, #13, #21 follow Examples 9 and 12; 7.5 #6 and #18 are the book's "write equations with solution -2" and "no-solution" prompts; 7.6 #2, #4, #7 clone the book's "Mind the Mistake" items 1 and 4; 7.7 #6 is the book's Example 16 answer (100); 7.7 #4 / #17 reskin the Bakhshali and horse problems. Fix: keep at most one clone per concept.

M8. **Easy items wearing high Bloom labels** (Analyse/Evaluate/Create on one-step items): 7.2 #3 (Analyse; true_false is Example 2), 7.2 #7, #20 (Analyse; reads a table), 7.4 #14 (Evaluate; verify), 7.4 #20 (Evaluate; two absurd statements), 7.6 #1, #20 (Analyse), 7.6 #14 (Evaluate), 7.7 #2 (Evaluate; history fact), 7.7 #6 (Analyse; book's own answer), 7.7 #9 (Analyse), 7.7 #11, #18 (Evaluate). The 30% Analyse floor is met only because of these labels. Fix: after rewriting the easy list, recount.

M9. **True/false verdict mix passes (2 True, 2 False) but both True items are book restatements** (7.2 #3 is Example 2; 7.7 #6 is Example 16's answer). Both False items (7.4 #2, 7.6 #5) are good misconception items. Fix: make 7.2 #3 a False (divide only the visible factors, or claim the value is 16380 / 5 / 9) and keep 7.7 #6 only if the sign of D is the trap.

## LOW

L1. 7.2 #4: "Using Example 2 of the chapter as a model" refers to the book, not to the item; say what to do ("give a product of five whole numbers and its value, ask for the product of four").
L2. 7.5 #3: "The solution of y + 0 = 6 is y = 6, and four students each write an equation they claim keeps y = 6..." is clumsy; say "Which of these equations does NOT have y = 6 as its solution?" with the four equations only.
L3. 7.5 #1 step mark for (d) lumps four things (950 v 975, 1400 v 1380, advice, justification) into 1 mark; split or reword.
L4. 7.6 #2 key "1 taken from -7 as well" is hard to read; write "the 1 should be subtracted, giving -7 - 1".
L5. Correct MCQ option is uniquely the longest in 9 of 37 MCQs (24%, no systematic bias) but visibly longer in 7.2 #2 (83 v 61), 7.5 #4 (91 v 75), 7.7 #2 (89 v 59), 7.6 #1 (59 v 53 / 25 / 27), 7.2 #5 (62 v 57). Trim these keys or lengthen the distractors.
L6. 7.3 #4 and 7.4 #11 part (a) restate stem data as an expression (little chapter work).
L7. 7.4 #2 true_false uses "True or False: [story]. Decide": phrase as a statement ("Bhumika can invite 20 friends").
L8. 7.7 #15 and #16 both decode the dot convention; 7.7 #19 tests it a third time.
L9. Reading level and realism fine; settings are Indian and plausible (Nashik, Pune, Hyderabad, Chennai).

## Checks that passed (counts read)
- Keys recomputed: 146/146. Case studies (14) recomputed part by part: all consistent; parts mostly climb.
- Step marks: sum equals item marks in all 146; none names a position; steps agree with stems and keys (including 7.7 #4 (a) = 2 marks and 7.5 #9 (a) = 2 marks).
- Assertion-reason (7): 7.1 true/true not explanation; 7.2 explains; 7.3 not explanation; 7.4 explains; 7.5 A true R false; 7.6 explains; 7.7 A false R true. All four outcomes appear. (The 7.7 #13 wording "English word algebra" from the older review is fixed.)
- `multi_statement` (7): keys 1&2, 1&3, 2&3, 2, 3, 1, all three: seven different keys; the false statement is spread (7.1: 3; 7.2: 2; 7.3: 1; 7.4: 1 and 3; 7.5: 1 and 2; 7.6: 2 and 3; 7.7: none). No template. Note 7.7 #18 (all three true) is three book-line facts.
- `fill_blank` (5: 7.1, 7.3, 7.5, 7.6, 7.7): every answer one number, machine-matchable (20, 56, 35, 3, 7). Only 7.3 #12 is more than one step; the others are easy (see list). Count meets max(2, ceil(7/2)) = 4.
- `true_false` (4: 7.2, 7.4, 7.6, 7.7): verdicts 2 True / 2 False, each begins with True/False, each has two steps. Count meets 4.
- `match` (4: 7.3, 7.4, 7.5, 7.7): pairings are distinct, keys unique and correct. 7.7 #10 is four recalled facts (easy).
- Slot order is no longer identical: first items are as/claim/case (7.1), mcq (7.2, 7.3...), match (7.4) etc. Reverse items tend to sit late (7.1 #19, 7.3 #21, 7.5 #20, 7.6 #17, 7.7 #20): a mild pattern only.
- Scenario MCQ: 3+ in every concept (3,5,3,4,3,3,3).
- Scope: no two-equation systems, quadratics, inequalities, tangram or number-lock items. 7.1 #18 (d) "within the limit" and 7.4 #3 are comparisons of numbers, not inequalities. History: bīja = seed; Ch 18 of Brāhmasphuṭasiddhānta 628 CE; Al-Khwarizmi, al-jabr gave "algebra"; yā/rū/dot/kā; formula x = (D - B)/(A - C) all match pages 019-021. "kā ... another unknown" is within "first letters of colour names".
- Positional wording ("option (b)", "third option"): none.

## Per-concept verdicts
- C7M-7.1: keys all correct; 12 of 20 easy (4 new). Pass after fixes (fix the matchstick repetition and one-step MCQs first).
- C7M-7.2: keys correct; 11 of 21 easy (2 new); case study (c) leak and forced (d). Pass after fixes.
- C7M-7.3: keys correct; 8 of 21 easy (2 new) plus many routine solves (see below); case study 7.3 #4 weak. Pass after fixes.
- C7M-7.4: keys correct; 8 of 21 easy; fixed-fee framing repeated 7 times; Imran/Zoya duplicated. Pass after fixes.
- C7M-7.5: keys correct; 10 of 21 easy (2 new); chain idea repeated 7 times; 7.5 #1 is a good real trade-off. Pass after fixes.
- C7M-7.6: keys correct; 8 of 21 easy (3 new); slips repeated; 7.6 #5 (True/False) is excellent. Pass after fixes.
- C7M-7.7: keys correct; 14 of 21 easy (4 new), the weakest concept (history items, formula plug-ins). Rework the one-mark slots.

Counts: 146 read, 0 HIGH, 9 MEDIUM, 9 LOW, 71 easy-in-disguise (18 new, 53 unchanged), 114 text-identical to backup. Templated: partly (repeated moves within concepts, not identical slot order).

## ROUTINE (not counted as easy, but borderline: two-or-more-step solve of a given equation with a book-typical shape; at 1 or 2 marks these should be replaced by items with a second idea)
7.3 #1, #8, #9, #12, #15, #20; 7.4 #5, #12, #13, #18, #19; 7.5 #13; 7.6 #2, #6, #7, #8, #16, #18, #21; 7.2 #14.

## EASY LIST
(concept#position: reason; position = order in the file, 1-based; "NEW" = added by the rewrite)

C7M-7.1
- C7M-7.1#1: AR whose A is the book's LHS definition; R unrelated; nothing to work out.
- C7M-7.1#4 (NEW): frame 5k+2 = 87 and one subtraction/division; book's matchstick move with new numbers.
- C7M-7.1#5 (NEW): fill_blank, 2n+1 = 41, one step, book's own expression.
- C7M-7.1#6 (NEW): remove one sack from each pan; 12 - 5 = 7; the book's hint.
- C7M-7.1#8: substitute n = 12; frame 2n+1 = 61; both lines are the book's matchstick lines.
- C7M-7.1#9: (a) is the book's hint verbatim; (b) one subtraction.
- C7M-7.1#11 (NEW): one substitution of y = 7 into both sides.
- C7M-7.1#12: frame 3b+4 = 22 and one subtraction/division.
- C7M-7.1#13: S1 and S2 are the book's definitions; S3 is a plain wrong "close to 99".
- C7M-7.1#16: expression versus equation; the book's definition.
- C7M-7.1#17: translate "p + 7 on one pan, 19 on the other" into p + 7 = 19.
- C7M-7.1#20: the book's own "find n with 2n+1 = N" frame.

C7M-7.2
- C7M-7.2#1: Example 1 rule (subtract 19 from both sides) with new numbers.
- C7M-7.2#3 (NEW): true_false whose verdict is Example 2 (divide by 5) restated; True.
- C7M-7.2#7 (NEW): one division (111 - 103) / 4 to find the next trial.
- C7M-7.2#8: Example 1 again, numbers changed; one subtraction.
- C7M-7.2#10: one substitution (91) and "larger".
- C7M-7.2#13: Example 3 again, numbers changed.
- C7M-7.2#15: 5x-4 = 7: "11/5 is not a whole number" is the book's Math Talk answer.
- C7M-7.2#17: subtract 1, divide by 6; the book's method, two lines.
- C7M-7.2#18: S1 and S3 are book sentences, S2 absurd.
- C7M-7.2#20: read which interval the target 98 falls into from a three-row table.
- C7M-7.2#21: AR restating Example 2's rule.

C7M-7.3
- C7M-7.3#2: 9k = 5k, one subtraction (Figure it Out 1(b) type).
- C7M-7.3#5: match of four equations to their first step: pure rule lookup.
- C7M-7.3#10 (NEW): -4x = 52, one division.
- C7M-7.3#13: AR; A by one substitution, R is the book's "check by substituting".
- C7M-7.3#14: -6w = -15, one division.
- C7M-7.3#16 (NEW): divide 2(3x-4) = 40 by 2, write the next line.
- C7M-7.3#17: the answer "put 14 in the original equation" is the book's single sentence (duplicates #13's equation).
- C7M-7.3#19: S2 and S3 are the book's observations (a) and (c) verbatim; S1 the reverse of (b).

C7M-7.4
- C7M-7.4#1: four direct story-to-equation translations, each one framing.
- C7M-7.4#2 (NEW): true_false, the book's Example 8 trap (p counts family members): subtract 6.
- C7M-7.4#6: one framing, n + 4n = 90 (book Example 12 pattern).
- C7M-7.4#8: choose the equation for two savers; book Example 9 reskin.
- C7M-7.4#14: claim whose own numbers are the check (40 x 40 + 500 = 2100).
- C7M-7.4#15: AR; A is the result, R is the method; R trivially explains.
- C7M-7.4#20: S1 and S3 are absurd; S2 is the book's check sentence.
- C7M-7.4#21: (a) is the book's "y + 30" trick; (b) one solve.

C7M-7.5
- C7M-7.5#2: same operation on both sides keeps the solution; book rule applied once.
- C7M-7.5#5: add then multiply, write the new equation; the book's chain, mechanical.
- C7M-7.5#6: "write an equation with solution -2": the book's Figure it Out prompt.
- C7M-7.5#7 (NEW): fill_blank 5 x (4 + 3) = 35, one product.
- C7M-7.5#8: S1 and S2 contradict the book's rule on sight; S3 is the book's no-solution example.
- C7M-7.5#12: claim whose verification is one expansion; verdict Yes.
- C7M-7.5#15: apply four listed operations to four equations; mechanical.
- C7M-7.5#18: "give one equation with no solution": the book's hint (x+4 = x+5).
- C7M-7.5#19: second copy of the #5 chain (add 4, multiply by 3).
- C7M-7.5#21 (NEW): a(-2) + 4 = 10, one step.

C7M-7.6
- C7M-7.6#1: spot "only 5k and 60 divided by 5"; the book's Mind-the-Mistake slip.
- C7M-7.6#3: AR; substitute k = 11, get 65.
- C7M-7.6#4: same divide-one-term slip as #1 (and book item 1).
- C7M-7.6#12 (NEW): one substitution, 5 x 21/5 + 3 = 24.
- C7M-7.6#13 (NEW): divide each term of 12x - 18 = 30 by 6.
- C7M-7.6#14: S1 is the book rule; S2 absurd; S3 the book's inverse-term rule.
- C7M-7.6#15 (NEW): fill_blank, 9w - 2w = 7w, then 21 / 7.
- C7M-7.6#20: bracket not multiplied; third copy of this slip (see #11, #19).

C7M-7.7
- C7M-7.7#1: plug A, B, C, D into the formula; the book's own question with other numbers.
- C7M-7.7#2 (NEW): history recall (algebra from al-jabr), one book sentence.
- C7M-7.7#3: write A, B, C, D and apply the formula.
- C7M-7.7#5: choose the formula expression; direct lookup.
- C7M-7.7#6 (NEW): true_false; the book's Example 16 answer (100) re-derived by the formula.
- C7M-7.7#8 (NEW): fill_blank, formula plug-in, 35 / 5.
- C7M-7.7#9: A = C so the formula cannot be used; one stated fact.
- C7M-7.7#10: match of four notation facts, all recall.
- C7M-7.7#11: claim whose own numbers are the check; verdict Yes.
- C7M-7.7#13: AR of two book sentences (algebra from al-jabr; bija means seed).
- C7M-7.7#15 (NEW): decode a card with the book's yā/rū/dot table; three recalled conventions.
- C7M-7.7#18: three book sentences, all true.
- C7M-7.7#19: write yā 5 rū 2 and the dot; the book's table.
- C7M-7.7#21: the book's seed-and-tree sentence copied back.

Total EASY LIST: 71 (7.1: 12; 7.2: 11; 7.3: 8; 7.4: 8; 7.5: 10; 7.6: 8; 7.7: 14). New items among them: 18. Unchanged from backup among them: 53.
