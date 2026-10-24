# Review: Class 8 Maths, Part I ch1 "A Square and a Cube" (hegp101), first review

File: content/authoring/dps/class8/ch01.json. Read all 127 questions (C8M-1.1 21, 1.2 21, 1.3 22, 1.4 21, 1.5 21, 1.6 21). Indexes below are 0-based positions inside the concept's question list.
Every key, every case-study part and every step-mark total was recomputed in python (squares, cubes, roots, LCMs, factor counts, digit patterns, the locker count). Textbook pages 1-2, 4, 7-8, 13, 15 checked.

## HIGH (wrong key, second answer, arithmetic or fact error)
None found. All 127 keys recompute, step marks sum to the marks, and no MCQ has a second defensible option.
Notable checks that passed: 1.1[1] 7 open lockers of 60; 1.1[4] only 49 of the options has exactly 3 factors; 1.1[19] 12 open of 150, 10 primes to 30, max 120 lockers; 1.2[19] 576+1600 = 40^2 and the other two pairs are not squares; 1.2[20] only 2,209 and 2,809; 1.3[19] 17 subtractions leave 11, next odd 35, 11+24 = 35; 1.3[21] 66+78 = 144, 210+231 = 441; 1.4[18]-[20]; 1.5[5] LCM 180 so 900; 1.5[19] 360, 3,600, 176,400 = 420^2; 1.6[20] 1,331/44 vs 1,458/42.

## MEDIUM

1. C8M-1.4[5] (true_false) "The square root of 0.09 is larger than 0.09." The verdict True holds only on the positive-root convention. The book (p.8) writes the root symbol as giving both values and says only "in this chapter we shall only consider the positive square root". Under the book's own symbol meaning, -0.3 is also a root and it is not larger. Fix: say "the positive square root of 0.09". Same dependence, lower risk because the stem names the convention or a length: 1.4[4] (claim on 64, 1, 0.25), 1.4[7], 1.4[0]; add "positive" there too.
2. C8M-1.4[1], [9], [13], [15] rest on the two-roots fact (statement 1 "-9 is not a root of 81", "roots of 144 are 12 and -12", "both integer roots of 121", "-60 is rejected"). The book states this on p.7-8, so it is in scope, but [9] is a one-line book fact (see item 9 below) and the four together make the sign convention 4 of 21 items. Keep [1] and [15], rework [9] and [13].
3. C8M-1.6[17] (5 marks) compares 51^3 - 50^3 and 31^3 - 30^3 and asks why consecutive cubes grow faster. Successive differences of cubes is not in scope_in (the book only sets it as an open exercise on p.15, "compute successive differences... what do you notice"), and the explanation expected ("three square layers of about n x n cubes") is beyond what the book says. The arithmetic (132,651, 29,791) is also heavy and is the point of the item. Fix: replace by an in-scope 5-marker (e.g. cube of side n to n+1 using the unit-cube build-up on p.12, or cube-root by estimation), or have the scope file list the topic first.
4. C8M-1.6[20] (case study) part (d) "Which plan wastes the fewest unit cubes?" 42 left (two edge-9 cubes) against 44 (edge 11 plus edge 5) is correct only if she stops after two cubes. Nothing stops her from building edge 3, 2 and 1 cubes from the 44, which leaves 0, so "as few as possible" has a second reading. Fix: state "she builds only the cubes asked for in (a)-(c), no more", or "at most two solid cubes".
5. C8M-1.4[19] (case study) part (d) is a strawman decision. The school "wants the largest possible part of the roof covered"; Type A covers all 144 sq m and Type B cannot beat that, so there is no trade-off. Fix: add a price per panel or a budget so the choice is cost against coverage and the data supports both ways.
6. C8M-1.1 repeats one idea. The locker game is items [1], [4], [19] and the factor-pairing argument [6]; 4 of 21 items test "squares have an odd number of factors". Keep [19] and [6], replace [1] and [4] (e.g. an area-scaling item and a fractions/decimals item).
7. C8M-1.2 repeats one frame. [17] (five numbers, reject by units digit, reject by zeros, root, test the survivors), [19] (five houses, reject by units digit, reject by zeros, roots, combine) and [1] ((a) units digit, (b) zeros) are the same reject-by-two-tests sequence. Units-digit and zero-count rules together appear in about 12 of 21 items. Rework [19] into a different situation (for example a reverse or a decision), and drop [1].
8. Cross-concept template. C8M-1.5[17] (factorise 6,300, multiply to square, divide to square, peer multiplies by 28, explain) and C8M-1.6[18] (factorise 2,560, multiply to cube, divide to cube, peer multiplies by 5, explain) are the same four-part frame with swapped nouns; 1.5[8] and 1.6[0] are also the same smallest-multiplier 2-marker. Change one of each pair (for example 1.5[17] to start from a word problem about packing items in a square, with divide-or-multiply as the choice).
9. Easy-in-disguise (the answer is a one-line rule or a single step from the book, labelled Apply/Hard or Understand/Hard). The bank allows no easy items.
   - C8M-1.1[0] (0.6^2 = 0.36), [15] (1.1^2 and 11^2), [8] fill (49-25).
   - C8M-1.2[2] (units digit of 4,357^2), [5] (zeros in 3,000^2), [9] fill (last two digits of 135^2), [10] match (units digits of four squares), [16](a).
   - C8M-1.3[1] (36th odd number, 71), [7] fill (1+3+...+47 = 24^2), [13] (1+...+x = 1,600), [8] (13 odd numbers).
   - C8M-1.4[0] (root of 2.25), [7] fill (root of 49/64), [9] (the roots of 144 are 12 and -12, a one-line book fact), [13](a), [5].
   - C8M-1.5[7] fill (3,025 = 5x5x11x11, find the side), [10] match, [13] (A/R where R restates the factorisation), [14].
   - C8M-1.6[5] fill (cube root of 15,625 by units digit), [15], [9] (units-digit table), [19](a) (read the digit off the table printed in the stem).
   Smallest fix: give each a second step or a misconception (a wrong working to repair, a missing number to find from a context) or move them to mark 1 only where one genuine inference is needed. About 25 items.
10. Template signal in structure. Every concept ends with the identical tail of four items (5 marks, 5 marks, 4-mark case study, 4-mark case study), and the slot order of the first 17 items follows one recipe in all six concepts (MCQ, 2-marker, MCQ/AR, claim-check, true_false, etc., at near-identical positions). All items are Hard (98) or Hardest (29). Reorder and vary the difficulty labels across concepts, or drop one tail case study for a 3-mark item.
11. Case-study parts that do not need the chapter. C8M-1.6[19](a) is read off the table printed in its own stem. C8M-1.1[20] (a) and (b) are plain division (3.6/0.3, 3.6/0.4); the squaring only enters as the count of tiles. C8M-1.3[20](a) is answerable from the list in the stem (25-16). Fix: make (a) require the chapter fact, or merge (a) and (b) into one part.
12. C8M-1.4[7] (fill_blank) answer "7/8" has natural equivalents (0.875, 14/16). A machine matching one string fails correct answers. Fix: ask "Write the side as a decimal" (0.875) or "numerator of the side in simplest form" (7).
13. C8M-1.2[19], [20], C8M-1.3[20], [21], C8M-1.4[20] end on a computation or puzzle, not a decision; 1.5[19](d) and 1.6[19](d) are real judgements. Of 12 case studies only four end on a trade-off (1.1[20], 1.5[19], 1.6[19], 1.6[20]). Rework the last part of at least two.

## LOW

- C8M-1.1[12] "Which one is a perfect square? 196, 6.25, 9/25, 0.16": correct only because the book defines perfect squares as squares of natural numbers (p.4). Restate in the stem ("a perfect square, the square of a natural number") so the 6.25 and 9/25 distractors are not arguable.
- C8M-1.6[2] and [16] (1,729 and 4,104 as sums of two cubes): the Hardy-Ramanujan taxicab note is on p.13 (4,104 is given there as an exercise), but scope_in does not list it. Add to scope or accept; the [16] stem gives away two of the four numbers.
- C8M-1.6[12] (number that is both a square and a cube): "both" is not taught in the book; the item is answerable by testing four options, but the expected idea (sixth power) is beyond scope_in. Low risk; replace with an in-scope item if a slot is needed.
- C8M-1.3[6] and [14], C8M-1.6[2]: correct option is the strictly longest option (3 of about 51 option items, so not systematic). Shorten the correct option in those three.
- C8M-1.5[9], [15], [18](c) test estimation by bracketing inside the prime-factorisation concept; concept 1.4 is the natural home. Move one into 1.4 or relabel, since 1.5 also has two prime-factor items that are really only the root.
- C8M-1.5[20](d) Dev's claim "root ends in 2, so 42" is a strawman unsupported by anything but the units digit; the claim is checkable but weak. Make Dev's reasoning half right.
- C8M-1.1[17] and C8M-1.4[17] both subtract a centred or inner square from a large square, then run an inverse question; vary one.
- "Two squares add to a square" appears in 1.1[3], 1.2[19](d), 1.3[12], 1.4[12], 1.4[20](c): five times across the chapter. Keep two.
- C8M-1.3[11] (tag figure): the figure is described fully in the stem, so it passes; part (a) is answerable from the stem (5+5-1).
- C8M-1.2[14](b) example "3 followed by six zeros" is fine but unusual wording; "3,000,000" is clearer.
- C8M-1.1[16] reverse item needs three things (situation, unit, perfect-square verdict) for 3 marks; ok but the third mark is a recall of the definition.

## Template counts
- claim_check verdicts: 3 No (1.1, 1.4, 1.6), 2 Partly (1.2, 1.5), 1 Yes (1.3). Acceptable mix.
- true_false: 3 False (1.1, 1.3, 1.5), 3 True (1.2, 1.4, 1.6). Mixed.
- assertion_reason (6): both-true-R-explains twice (1.1, 1.5), both-true-not-explain twice (1.3, 1.6), A true R false once (1.2), A false R true once (1.4). Good spread.
- multi_statement (6) keys: "1 and 3 only", "1 only", "2 and 3 only", "3 only", "1, 2 and 3", "1 and 2 only". No mostly-same key. The false statement is spread.
- Correct option is the strictly longest in 3 of 51 option items (6%). Correct option is always o[0] in the file (fine; loader shuffles). No item names an option by position.
- Fill blank 6, match 4, true_false 6, figure 1: tags meet one per two concepts. fill_blank answers are numbers except 1.4[7] (item 12).
- Bloom: Analyse 60, Apply 30, Evaluate 28, Understand 6, Create 3; no Remember, no Easy. Difficulty Hard 98, Hardest 29.
- Slot order: first 17 items nearly the same recipe; last four identical (5, 5, 4, 4) in every concept.

## Per-concept verdicts
- C8M-1.1: keys all correct; repetition of locker idea (item 6), easy items 0, 15, 8; shop case study is a good real decision. Pass after fixes.
- C8M-1.2: keys all correct; strong chapter-needing items but repeated reject-by-tests frame (item 7) and several one-line rules (item 9). Pass after fixes.
- C8M-1.3: keys all correct; good proofs (4, 5, 18, 19), two weak case-study endings (item 13), one-line pattern fills (item 9). Pass after fixes.
- C8M-1.4: keys all correct; positive-root dependence in 1.4[5] (item 1), strawman roof decision 1.4[19] (item 5), fill_blank equivalent (item 12). Pass after fixes.
- C8M-1.5: keys all correct; strong factorisation items; 1.5[17] duplicates the 1.6[18] frame (item 8); estimation items misplaced (LOW). Pass after fixes.
- C8M-1.6: keys all correct; 1.6[17] drifts out of scope (item 3), 1.6[20] stopping-rule ambiguity (item 4). Pass after fixes.

## Counts read
Questions read: 127. HIGH 0. MEDIUM 13. LOW 11.
Overall: keys are clean; the bank is only lightly templated (same tail slot order, a few repeated frames) and has about 25 one-step items that read as easy. Verdict: pass after fixes.
