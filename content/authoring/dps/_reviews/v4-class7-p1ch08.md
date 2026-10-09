# Review v4: Class 7 Maths Part I ch 8 "Working with Fractions" (gegp108), dps/class7/p1ch08.json

Verdict: **PASS** (0 HIGH, 3 MEDIUM, 6 LOW). The chapter file (modified 04:52) is unchanged since the v3 review (06:18), so no v3 finding has been fixed; none of them is blocking.

Method: all 143 items (7 concepts: 20/20/21/20/21/20/21) read in full. Every key was recomputed independently with arithmetic before I read the stored key, multi_statement and assertion_reason first. Structural checks run in code: the key appears in the options on every mcq/AR/MS/match item, there are no duplicate options, step marks sum to `m` on every item that has steps, and no option refers to another option by position. Facts (Brahmagupta's formula, Baudhayana's bricks, dramma and cowrie shells, reciprocal) all appear on pages 010-022 of gegp108.

## Keys and defensibility
- 143 of 143 keys correct. No second defensible answer found.
- All 12 multi_statement and 8 assertion_reason items were recomputed. Examples: 8.1 Q8 (S2 5x2/9 = 10/9, so "1 and 3"), 8.3 Q13 (35/12 x 18/25 = 21/10 true), 8.4 Q7 (45/28 lies between 5/7 and 9/4), 8.5 Q19 (S3 1/6 / 1/3 = 1/2, false), 8.6 Q8 (6 / 3/2 = 4, 12 / 1/6 = 72), 8.7 Q3 (1/2 of 2/3 of 1200 = 400).
- The tie and "equal" items each have a unique answer: 8.2 Q11, Q13, Q14, Q17; 8.3 Q3 and Q20; 8.5 Q1, Q10, Q11. 8.4 Q5, Q19 and Q20 each have exactly one option that satisfies the condition.
- Case-study data is consistent: 8.1 Q11 (36 m, 1,440, roll 1,500 vs 1,530), 8.3 Q19 (3500 quintal, 1050 and 1000, 15,75,000 vs 18,00,000), 8.4 Q9 and Q11, 8.6 Q20 (2,040 vs 1,920), 8.7 Q12 and Q13. Each answer's open "decision" part is marked as open-ended and accepts either defended choice.
- Positional references: none. The only grep hits ("above 1", "below 1") are mathematical.

## Status of the v3 findings (all still open, file untouched)
- M1 (easy-in-disguise, 16 of 143) is open.
- M2 (8.2 rectangle-area concentration, with Q7 duplicating Q3(b) numbers 2/3 x 4/5) is open.
- M3 (8.7 has 11 "x of y of a quantity" items) is open.
- M4 (cross-concept mirrors 8.4 Q17 / 8.6 Q19, and 8.4 Q18 / 8.6 Q18) is open.
- L1 to L5 are open.

## Findings
HIGH: none.

MEDIUM
- M1. Easy items remain, each a single direct operation with no choice or trap: 8.1 Q9 and Q18; 8.2 Q4; 8.3 Q5, Q8; 8.5 Q3, Q5, Q21; 8.6 Q15. Fix: add a comparison, a trap or a second stage, or reclassify them as Understand-level fillers. Do 8.5 Q3 and Q21 first.
- M2. C7M-8.2: 10 of 20 items are "area of a rectangle from fractional sides" (Q3, Q4, Q6, Q7, Q8, Q10, Q11, Q13, Q14, Q15), and Q7 repeats Q3(b) (2/3 m by 4/5 m). Replace Q7 and one of Q13/Q14/Q15 with a picture or unit-square item that is not an area product.
- M3. C7M-8.7: about half the concept is "fraction of a fraction of a quantity" (Q4, Q5, Q7, Q11, Q14, Q16, Q17, Q18, Q19, Q20, Q21). Swap two for a different structure, for example "of" combined with division in a reverse problem (find the whole from a part).

LOW
- L1. Tie pattern ("surprise, equal"): 8.2 Q11, Q13, Q17; 8.5 Q1, Q10, Q11. Make one per concept unequal (for example 8.2 Q17 as 5/24 vs 5/18).
- L2. Mirrors: 8.4 Q17 vs 8.6 Q19 (the "rises towards 12" idea and the "pattern series" idea, both Analyse); 8.4 Q18 vs 8.6 Q18 (both true_false on the size rule). Change the verdict or the shape of one of each pair. 8.6 Q16 and Q19 are also two "pattern in a series" items.
- L3. Slight stretch beyond the book: 8.4 Q6(d) ("never reaches 0") and Q17(c) ("rises towards 12"). Reword to "stays positive and smaller" and "stays below 12".
- L4. Strawman decision parts: 8.2 Q3(d) (93 > 90 is forced), 8.3 Q7(d), 8.5 Q14(d) (a 2 m piece obviously covers 1 7/8 m).
- L5. 8.3 Q6 AR: in 2/3 x 4/9 nothing cancels at all. A is correctly false, but a student may argue "3 and 9 share 3" and the false verdict rests on "denominators only". Say "can be cancelled with each other". 8.5 Q15 AR is keyed "R true but not the explanation". That is correct, but R explains the size of the quotient and A states its value, so it is borderline.
- L6. Incidental unlike-fraction subtraction not taught in this chapter: 8.2 Q10, 8.7 Q17 and Q18.

## Per-concept
- 8.1: pass. Keys right, step marks agree with the stems.
- 8.2: pass with fixes (M2, L1).
- 8.3: pass.
- 8.4: pass; best concept (mixed-number square, rate chains).
- 8.5: pass with minor fixes (M1, L1).
- 8.6: pass.
- 8.7: pass with fixes (M3).

Overall: **pass** (0 HIGH, 3 MEDIUM, 6 LOW). Easy-in-disguise items are about 10 of 143 on a strict reading.
