# v7 review: class7 p1ch03 (Class 7 Maths Part I ch3, Ganita Prakash)

Scope: 3.8 Q20, 3.7 Q16, 3.6 Q14-Q18 recomputed in full (indices as in the file: Q20 = 3.8 index 20, the 21st item); all 188 items checked structurally by script.

## HIGH
None.

## MEDIUM
None.

## LOW
- C7M-3.1..3.9 ending: every concept ends with two long_answer case studies (3.4 with three) at the same tail positions. Mild slot repetition; acceptable, vary if the file is touched again.
- C7M-3.1 has 20 items, 3.2-3.9 have 21 (total 188). Not a quality fault; confirm the loader/target does not require exactly 20 per concept.
- Carried, not blocking: 3.3 Q3/Q8, 3.5 Q1/Q16, 3.6 Q13 and 3.7 Q0 are recompute-and-compare items, acceptable.

## Verified (no action)
- **3.8 Q20(d)**: brute force over all 27 assignments of Kabir/spinner/third bowler to overs 18-20 with quotas K<=1, S<=1, T<=2, T bowled the 17th, no repeats in a row, Kabir only the 20th, spinner not the 20th gives exactly ONE arrangement: (18 spinner, 19 third bowler, 20 Kabir). Key says the third bowler takes the 19th with that sequence. Correct, one defensible answer. Parts (a)-(c): 16x6+4 = 100 balls, 20 remain; 2 balls left in the 17th, 18 balls = 3 overs; K and S one over each left, one over for the third bowler (who has 2 available). Correct. Step mark (d) now matches the revised stem; marks 1+1+1+1 = 4. Parts climb (balls, split, quotas, scheduling puzzle). Part (d) is mostly stem logic, but (a)-(c) need the overs.balls idea from the chapter; fine.
- **3.7 Q16**: 9.6+6.4 = 16; range 15 to 17; 9.35+6.65 = 16.00, carries described correctly. "each number with two digits after the point" is now unambiguous. Marks 1+1 = 2.
- **3.6 Q13** 24.34 correct (wrong total 25.15 reproduced). **Q14**: 10-0.22 = 9.78; the other three are real slips, exactly one defensible. **Q15**: 52.806-25.9 = 26.906, range 26 to 28, 52.547 = 52.806-0.259; the correct option is no longer the longest (it is now shorter than option 3), the length tell is gone. **Q16** 15.3 and check 15.3+9.7 = 25, marks 1+1+1 = 3. **Q17** 26.00, carries right, marks 2. **Q18** 1.6-0.478-0.7 = 0.422, distractors 0.522, 0.378, 1.178 (=0.478+0.7) are real slips. The moved items leave no four-MCQ run: order is mc, mc, short, short, mc.
- Other checks: fill_blank answers all recomputed (24, 8.25, 100, 9, 1000, 24.34, 28.5, 9:48, 8) correct. Claim checks 9 (one per concept): No x3, Partly x3, Yes x3, balanced. multi_statement keys: "1 and 3 only" x3, "2 and 3 only" x2, "1 and 2 only" x2, "3 only" x1, "1 only" x1. assertion_reason 9 (keys mix of both-true-explains, both-true-not-explains, A true R false, A false R true). Step marks equal item marks everywhere (script, zero mismatches). All mcq keys are in their options, no duplicate options, no positional "option (b)" references anywhere. Correct option strictly longest in 8 of 40 mcq (20%), longest-or-tied 21 of 40 (52%): no tell. No scope_out breach found in changed items.

## Verdict per concept
3.1 pass; 3.2 pass; 3.3 pass; 3.4 pass; 3.5 pass; 3.6 pass; 3.7 pass; 3.8 pass; 3.9 pass.

## Counts read
188 items (9 concepts). Types: short_answer 80, mcq 40, long_answer 36, fill_blank 9, assertion_reason 9, multi_statement 9, match 5. Templated: no (slot order differs per concept; only the closing case-study pair repeats).
Overall: pass.
