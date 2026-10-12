# Final verification: ncert_polity1.json (140 items, prefix CS-POL-ncp1-)

Method: saved file read in full; all 140 items recomputed cold against the Class 7 chapter text (content/extracted/gees109, pp.185-208) and Laxmikanth 8e ch03 p.59, ch04 pp.68/83, ch05 pp.86-87/91-92, ch13 pp.206-212. A script (scratchpad/fv1/chk.py) re-derived every which/how-many key from the per-statement verdicts in the explanations, checked o[0]==a, 4 distinct options, 3 wrong-reasons, and that each w[] "includes/leaves out statement N" claim matches its option. check-civil-pack.py: 0 problems. dup-check at 0.8: 1 hit (below).

Verdict: FAIL (1 HIGH).

## Counts
HIGH 1, MEDIUM 6, LOW 2.

## HIGH
- **6-09** (CVP-1.6, key "1, 3 and 4 only"). Statement 4 reads "Laxmikanth holds that a government run under a constitution must by its nature be democratic." Laxmikanth p.59 says "Constitutional government should necessarily be democratic government" inside the constitutionalism definition, and in the same section (point 1) says a dictatorship can have a constitution. As worded, "government run under a constitution" is false on the same page, so a careful candidate can reject statement 4 and defend "1 and 3 only" (an option). Two defensible answers. Fix: reword to "In Laxmikanth's formulation, constitutional government (government limited by a constitution) should necessarily be democratic government", or drop statement 4 and use a clearly false one. Statements 1-3 are fine (p.59).

## Earlier HIGH items
- 2-11: resolved. Statement 1 is now false in real law and in the chapter (p.192); key "2 only" is single and correct; w[] consistent.
- 2-17: resolved. Statement 3 false (Swiss women 1971, UK 1928, USA 1965), statement 4 false (six principles, pp.191-192); statements 1, 2 true; "Only two" correct.

## Re-checked fix list (all recomputed, all correct unless noted)
2-11, 2-17, 1-03, 5-13, 2-05, 7-03, 7-04, 7-19, 1-12, 4-14, 4-17, 5-11, 5-17, 6-09 (HIGH above), 6-11, 6-19, 4-09, 7-06, 7-05, 7-10 to 7-15, 7-17, 7-20: key, explanation and w[] agree; each false statement is false in the book and in real law (7-17 statement 1: advice binding after 42nd/44th Amendments, p.206 fn1; 7-12 statement 4 limit is the demerit on p.209; 7-13 statement 4 contradicts p.210). 1-12 (Bulmer, procedural/prescriptive) now matches p.59; the ncert_polity2 6-08 near-copy is gone.
Match items 2-20, 3-20, 4-20, 6-20 (also 1-20, 5-20, 7-20): List-I A-D and List-II 1-4 complete; keys A-3 B-4 C-2 D-1 / A-3 B-4 C-2 D-1 / A-4 B-1 C-2 D-3 / A-4 B-3 C-2 D-1 recomputed by hand and correct; each distractor and its w[] line correspond (swap descriptions verified).

## MEDIUM
1. **Within-pack repeats of the same fact**: 6-12 and 6-18 share two identical statements (Laski, Ramsay Muir); 4-12 and 4-14 have the identical stem (republic vs monarchy, p.87); 6-16, 6-19, 7-08 all test the Table 9.2 franchise row; 4-05, 4-13, 4-19 all test "neither absolute nor beyond question"; 3-13 statement 2 vs 3-18 statement II (Art 75); 4-04/4-08. Not wrong, but wastes slots; consider re-angling one of each pair.
2. **5-12 vs ncert_polity3 4-16** (0.91): same countersign sentence, one true here, one false there. Consistent with p.211 but a flipped twin; re-angle one.
3. **3-20 vs ncert_polity4 5-07** (0.73): Jennings "cabinet system... nucleus of power" tested twice.
4. **Statement-I/II "explains" calls** are judgement calls: 3-18 (Art 75 -> no-confidence) and 1-19, 2-19, 4-18, 5-18 key "explains"; 1-18, 6-18, 7-19 key "does not explain". All defensible and well argued, but 3-18 and 7-19 could be argued the other way by a candidate; consider swapping 3-18 for an unambiguous pair.
5. **Weak wrong-reasons**: 3-05 w[1], w[2] ("not cited by the chapter") say nothing about why Articles 161-162 and 356-357 are wrong; 2-02/5-02 fine.
6. **Format mix vs 2020-26 column**: direct 25% (trend 26%), which 45% (48%), how-many 15% (12%), Statement-I/II 10% (6%), match 5% (not a UPSC 2020-26 format). Acceptable; Statement-I/II slightly heavy.

## LOW
- 5-15: statement 3 (Russia, Sri Lanka as presidential) is only true "according to Laxmikanth"; stem does say so. No change needed.
- 1-05: key is the only short option, others long explanatory strings (mild length tell).

## Spot-check of unchanged items (15+, all pass)
1-01, 1-04 (p.92 fn11), 1-05 (p.211 fn3), 1-15, 1-19, 2-03, 2-10 (p.68, 61st Amendment), 2-14, 2-19, 2-20, 3-01/3-02 (p.92 fn12), 3-08 (Table, p.193), 3-15 (p.211 item 3 India either House), 3-16 (Swaran Singh, p.211), 3-17 (Table 13.1), 4-03, 5-05 (p.91-92 fn9), 5-14 (p.206), 6-12 (p.209), 6-16 (Table 9.2), 7-16. Page citations verified.

## Near-copies
dup-check 0.8: only 5-12 vs ncert_polity3 4-16 (flip twin, MEDIUM 2). At 0.7 also 3-20 vs ncert_polity4 5-07. No tagged-PYQ near-duplicates seen.
