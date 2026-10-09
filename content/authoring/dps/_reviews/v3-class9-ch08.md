# Review v3: Class 9 Maths, ch08 (iemh108), content/authoring/dps/class9/ch08.json

Read: all 124 questions (8.1: 20, 8.2: 20, 8.3: 20, 8.4: 21, 8.5: 21, 8.6: 22). Latest prior review: v2-class9-ch08.md.
Method: every key, case-study part and distractor recomputed by hand/in code before reading the stated key; scope checked against `content/extracted/iemh108/pages/` (27 pages).

Result: 0 HIGH, 2 MEDIUM, 5 LOW. Verdict: PASS.

## v2 items, status
- HIGH (8.4 Q20 d): FIXED. Stem now states the criterion ("judge each plan by the salary paid in her final year"). Recomputed: year 4 B 5,64,000 > A 5,40,000; year 10 A 7,20,000 > B 6,72,000; equal in year 6. Key consistent.
- 8.4 Q21 (d) strawman: FIXED (two patterns each of at least Stage 40 gives a real constraint; 49 vs 99 recomputed).
- 8.3 tribonacci (Q7 item 4, Q13): FIXED (two-term rules only; Q7 gives 17, 16, 5, 7; Q13 gives 55 at t8).
- 8.6 Q4: FIXED (S3 now false, key "1 and 2 only" correct).
- 8.3 Q15 now uses 130 (terms 1,5,13,29,61,125,253), 8.1 Q8 option 4 replaced: FIXED.
- Difficulty inflation (v2 item 2): NOT changed, still open (below).

## MEDIUM
1. **Difficulty tags inflated.** Nearly every non-long item is tagged Hard though many are one step: 8.1 Q1, Q2, Q3, Q6, Q12; 8.2 Q1, Q6, Q7; 8.5 Q1, Q8, Q9; 8.6 Q1, Q6, Q8, Q13. Retag Medium/Apply or add a second step. Does not affect correctness.
2. **8.6 repeats the Sierpinski-triangle idea five times** (Q3 plots, Q4 S3, Q5 AR, Q12, Q19). 8.6 Q5 is easy in disguise: R ("number of black triangles becomes smaller") is false on sight (3^n grows). Swap Q5 for a carpet/bounce idea or make R subtler.

## LOW
3. 8.4 Q21 (d): the arithmetic is easy (two inequalities); the "choose" sentence is decoration. Acceptable.
4. 8.5 Q20 (kabaddi league, counting matches as S_(n-1)) is not in this book; it uses only triangular-number sums, so in scope, but it is an extension context.
5. 8.1 Q14 and 8.2 Q5/Q12: "n must be natural / negative n" idea repeated across three items.
6. Mixed notation s_n / t_n / u_n inside concepts 8.1 and 8.2 (each item self-consistent).
7. 8.1 Q19/Q17 and 8.5 Q19 chair/rangoli contexts overlap (L-borders and chair rows); 8.2 Q19 (d) and 8.6 Q22 (d) have slightly open "which plan" answers, but both are anchored by computed values.

## Recomputed, all correct
All mcq/fill/match/true_false keys; multi_statement (3-statement format as in bank): 8.1 Q4 "1 and 3", 8.2 Q4 "2 and 3", 8.3 Q4 "2 only", 8.4 Q4 "1 and 2", 8.5 Q4 "3 only" (S1 = 210 not 420; S2 should be S58-S24), 8.6 Q4 "1 and 2". assertion_reason: 8.1 Q5 A+R explains; 8.2 Q5 A true R false; 8.3 Q5 (4,12,132) both true, R not explanation; 8.4 Q5 A false R true; 8.5 Q5 explains; 8.6 Q5 A true R false. Case studies recomputed part by part: 8.1 Q17-Q20, 8.2 Q17-Q20, 8.3 Q17-Q20, 8.4 Q18-Q21, 8.5 Q18-Q21, 8.6 Q19-Q22 (e.g. 8.6 Q22 month 3 both 1,600; B month 8 4,882.81; 8.6 Q21 70.2% and 62.4%; 8.5 Q21 S54 = 1485, S55 = 1540). No second defensible answer found. No scope_out violations, no positional option references, no facts beyond the book except noted item 4.
