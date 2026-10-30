# Round 2: class7-topup/p1ch05-gap.json (C7M P1 ch5)

Loader --check: valid, 42 questions, slot mix unchanged from v1. Step marks sum to marks everywhere. 19 items changed; all recomputed from the figure descriptions and keys are correct, with one-answer logic confirmed: 5.2 Q4 x=15, AOC 60, y=28, COE 30, turns 30 and 60 (checked with directions); 5.3 Zara (3x2 = 6 crossings, 24 right angles, right); 5.4 mcq "Either 2 or 4" (sets {x,180-x} and {y,180-y} overlap in 0 or 2 values, so 2 or 4); 5.4 kite 65 and 510; 5.4 rails 16 angles, 4 measures, at most 8; 5.5 True/False; 5.6 mcq 133, handrail 34/34/34; 5.7 co-interior 90/90, shed 90/52/108/72/120, 8 and 12 degrees; 5.8 illusion 74, strips 17 lines/3 cm/12 cm/5 folds/33 lines, paper fold 5x3=15, 20, 70, 110.

## Earlier findings: status
Resolved: 5.8 diagonal-fold scope item removed; 5.3 Zara figure changed; 5.2 perpendicular true/false changed; 5.8 5-cm strips (b) replaced; illusion now truly parallel; 5.4 Q1 and mcq no longer share a case; 5.5 Q2 changed to a different method; 5.6 mcq now two-step; 5.7 Q2 raised; 5.7 stem adds B; 5.2 Q4 (c) now a real decision (turn to perpendicular); 5.4 Q4 (d) predicts without measuring; the "Always exactly 8" distractor replaced; 5.3 Q0 key no longer longest; 5.6 Q3 no longer names the method; 5.3 Q2 step 1 tightened.

## Problems
| Item | Sev | Problem | Fix |
|---|---|---|---|
| C7M-5.7 Q2 (true_false, 3x and x+60) | MEDIUM (repeat) | Same idea and same outcome as the existing class7/p1ch05.json C7M-5.7 short_answer "interior angles 3p and 2p+30": sum 180 gives both angles 90 and the transversal is perpendicular. Also near the existing fill_blank (2x and 3x-10). | Change the claim, e.g. "Two interior angles on one side are 5m and 3m + 20; one must be larger than 90" or drop the algebra: "If one interior angle is 90 the other must also be 90" with the reason. |
| C7M-5.5 Q0 and Q3 | LOW | Both rely on a vertically-opposite or linear-pair hop to reach the corresponding angle, and both end by equating algebraic angles. Different enough now that Q2 changed. | None needed |
| C7M-5.2 Q0 multi_statement | LOW | Note: 3 statements are accepted by the task brief; not a finding. | None |
| C7M-5.5 Q2 (True) | LOW | True verdict with a one-line reason; the misconception (needs two readings) is mild. | Optional: add a false twin ("measuring two angles at m is needed") |

## Counts and template reads
Claim-check/True-False verdicts: partly (Aman), right (Zara), wrong (Mitra), wrong (Gauri), right (Kunal), Riya wrong, Tanvi's illusion parallel: varied. True/False: False, True, False (5.7), plus the earlier ones; balanced. multi_statement 1, match 1. Correct-option-longest: 0 of 6 now. No option named by position. Algebraic angle expressions are used throughout the existing pack, so I did not treat them as out of scope. No new item repeats class7/p1ch05.json or p1ch05-la4.json except the 5.7 Q2 above.

HIGH 0 / MEDIUM 1 / LOW 3

VERDICT: PASS
