# v3 re-review: class8 p2ch02 (C8M-2.1 to 2.6), 130 questions, 50 changed items

Method: diffed against the pre-edit copy (50 items differ), recomputed every changed item in python (triples to 20, (28,45,53), (21,220,221), (17,144,145), squares of 28.2..28.29, 1.41..1.4146, 2.82/2.825/2.83, ramp, wedge, napkin, courtyard T/C, board 4.81 vs 4.84, grids). Unchanged items were not re-read except by automated checks.

## v2 status
- 2.5 idx4 triple definition: FIXED. Stem now defines a<b<c, a x a + b x b = c x c, counts every triple; brute force gives exactly 6 and "4" stays as the book-list distractor.
- 2.6 rhombus premise: FIXED in idx3, idx11, idx19 (clause in each stem); idx1 Statement 2 is now a computation (12, 16 gives side 10, not 20) and the key is no longer all-true.
- 2.3 fraction bounds: FIXED. idx0 no longer uses 10/7 or 7/5; idx6 and idx7(d) test 17/12 and 99/70 only through the book's own equation (m x m against 2 x n x n), not as bounds. Acceptable for scope_in ("cannot be a fraction m/n", pages 38-39); not a scope_out breach (only sqrt 2).
- 2.4 idx15 figure: FIXED. Fully described (3 and 7 cm squares side by side, 3 x 7 rectangle against the right side, strip 4 cm, triangle 10.5, square 58).
- Three-statement multi_statement: not flagged per instruction.
- Other v2 mediums: 2.1 idx12 now a False claim; 2.1 idx20 numeric; 2.2 repeated idea reduced (idx16, idx18 changed); 2.3 idx14 now an application; 2.5 idx13 now (28, ___, 53); 2.5 idx9 now False; 2.4 idx8(d) condition stated; 2.4 idx17 stmt 3 changed. All addressed.

## HIGH
None. Every changed key recomputed and matches; every option item has the key at o[0], no duplicate options, no wrong option equal in value to the key, no option named by position; step marks sum to marks on all 130 items.

## MEDIUM
- [2.3 idx5] fill_blank "side of a square of area 200 sq cm lies between 14.1 cm and ___ cm", key 14.2. 14.3 or 15 are also true upper bounds, so a machine match on "14.2" rejects a defensible answer. Fix: "...lies between 14.1 cm and the next number with one decimal place, ___ cm."

## LOW
- [2.1 idx0] Statement 1 ("original square is 2 small triangles, square on diagonal is 4") depends on the book's figure; add one clause describing it (square cut by both diagonals into 4 triangles... or state "a square cut along one diagonal gives 2 triangles").
- [2.2 idx8] one-step (side squared = 25, times 16); Easy in disguise, keep only if other 1-mark items stay harder.
- [2.4 idx2, idx12, idx21] single-substitution items (24 for 36+64 to 26; wedge 1.3; 9-40-41 perimeter 90). Keep; they are the only low-step items.
- [2.4 idx20] (c) "longer run is less steep" is answered by comparing 2.4 with 1.2 and is a mild strawman; the 3 marks are 1+1+1.
- [2.5 idx3] (a), (b), (d), (e) are four comparisons of the same type; parts do not climb much though (c) and (d) add reasoning.
- [2.5 idx6, idx17] odd-square method asked twice (17 and 21); acceptable, different numbers and asks.
- [2.6 idx1] every option contains "1", so Statement 1 is effectively given; the choice reduces to statements 2 and 3 (both false).
- [2.6 idx4] stem hands over the method (triangle with hypotenuse 7 and side 5); one subtraction. 
- [2.6 idx16 / idx20] (unchanged from v2) grid-square areas idea still appears twice if both remain; scope_in has no grid line (p55 Figure it Out).
- [2.3 idx3] correct option is the single exact-by-construction choice; fine.

## Template counts
- multi_statement keys: 1 and 3 only; 2 only; 3 only; 1 and 2 only; 2 and 3 only; 1 only (all different, no all-true key).
- Correct MCQ option longest or tied: 7 of 26 plain MCQs (27%), down from 46%.
- true_false: 4 True / 5 False in the tagged set (2.2 idx6, 2.4 idx11, 2.6 idx2 True; the rest False); True ones carry a counterintuitive trap (7+7 vs 10; sums 79 vs 89; areas 7 vs 25). claim_check mix: Partly right 3, "claim is wrong" 4, right 2.
- Slot mix still the fixed recipe per concept (flagged in v2); orders differ.

## Verdicts
- C8M-2.1: load-ready (idx0 clause optional).
- C8M-2.2: load-ready.
- C8M-2.3: not yet; one MEDIUM (idx5 fill_blank bound), otherwise correct. Smallest fix is one phrase.
- C8M-2.4: load-ready.
- C8M-2.5: load-ready.
- C8M-2.6: load-ready.

## Counts
Read: 130 counted, 50 changed items fully recomputed. HIGH 0, MEDIUM 1, LOW 9.
Chapter verdict: not load-ready until 2.3 idx5 is reworded (one-phrase fix); otherwise load-ready.
