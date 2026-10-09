# Review v4 (third independent review after the fix pass): Class 7 Maths Part I ch 7, `content/authoring/dps/class7/p1ch07.json`

Method: latest prior review is v3 (`v3-class7-p1ch07.md`); the chapter file was edited after it (file time later than v3). All 140 items (7 concepts x 20) were read and every key was recomputed by hand and in Python BEFORE reading the key (angle sums, ranges of the third side, counts, costs, the cosine-rule angles on the 7.7 #20 cards, the 7.7 #18 count, the 7.3 #18 s-range, all multi_statement and assertion_reason verdicts). Structure was checked by script: option membership of every key, step-mark totals against item marks, type and tag counts. Source facts checked against `content/extracted/gegp107/pages/` (27 pages).

## Status of the v3 findings

| v3 finding | Status |
|---|---|
| HIGH 7.7 #19 (d): stem supplied a reason to re-measure all four plots | FIXED. The stem now says the clerk "will use it on a plot that the angle-sum check has shown to be wrong"; the decision is single-answer (Plot D). The check is now determinate rather than a trade-off (see LOW 6). |
| M3 7.4 #3 "five cards" but four listed | FIXED (now 7.4 #2 "four cards"). |
| M4 7.6 #19 (d) cheapest well allowed by its rule | FIXED (now 7.6 #20 "wants the cheapest well that its rule allows"). |
| L9 7.3 #6 S2 collided with the book's "three comparisons" sentence | FIXED (now 7.3 #8 S2: "two shorter lengths add up to exactly the longest ... still exists", unambiguously false). |
| L10 7.3 #19 (d) equal-likelihood sentence | FIXED (in the stem). |
| L11 7.4 #5 S1 "greater than 0 and less than 180" | FIXED (now 7.4 #6 S1). |
| L12 7.6 #15 reused the book's triangle TRY / 140 | FIXED (now DEF, 130). |
| L13 7.6 #12 "inside" | FIXED (item replaced by the fold item). |
| L15 level labels (Create/Evaluate that are Apply/Analyse) | MOSTLY FIXED: no `Create` left; 13 `Evaluate` items remain, 7.1 #13/#14 and 7.7 #9 still sit below Evaluate (see LOW 7). |
| L16 correct MCQ option strictly longest | MOSTLY FIXED (7.1 #5, 7.2 #4 and 7.2 #7 keys are still the longest by a margin; see LOW 8). |
| M2 easy-in-disguise 32 (22.7%) | IMPROVED to about 18 of 140 (13%); list in MEDIUM 1. |
| M5 repeated ideas | NOT FIXED (see MEDIUM 2). |
| M6 template frame | PARTLY FIXED (see LOW 9). |
| M7 "faulty reading, re-measure" case study repeated | FIXED. Each case study now has a different frame (7.3 #19 surveyor with cost, 7.4 #20 survey acceptance, 7.7 #19 register). |
| M8 algebra/ratio load in 7.5 | FIXED. 7.5 now uses parallel-line, exterior-angle and design-choice items; only 7.5 #3 (A = 2B) and 7.7 #18 (k and 130 - k) are equation-style, and both are within what the chapter's angle-sum work supports. |
| LOW 14, 17, 18 | 7.7 #20 (d) is still a determinate filter-plus-minimum; 7.7 #5 no longer offers its answers in the stem; 7.5 #4, 7.6 #1 are still single-step fill_blanks. |

## Recompute results (all concepts)

0 wrong keys, 0 second defensible answers found. Highlights of what was checked:

- C7M-7.1: #4 C(4,2) = 6 triangles from O; #6 S1 T, S2 T, S3 F -> "1 and 2 only"; #9 R true but does not explain "exactly two"; #11 1-A (side 7), 2-B (4+6+6 = 16), 3-C, 4-D; #15 (20 - 8)/2 = 6, then 8-10-10 -> 28; #18 CD = 2 x 5 sin 60 = 8.66 (stated "about 8.7"); #19 12 min against 18 + 10 = 28 min; #20 PQ = 7 gives 19 x 450 = 8550 <= 8600, unique among 6, 7, 8.
- C7M-7.2: #1 6, 7 is the only scalene pair (5 + 8 gives 8, 5, 8; 6.5 + 6.5 isosceles; 7 + 7 sums to 22); #6 S1 F, S2 T, S3 T -> "2 and 3 only"; #9 only flag B has no equal pair on any base -> 1; #11 third side 6, only base 6 fits 5.5 -> unique; #20 Layout 1 over compass (7 or 8 cm arcs) and over budget (735), Layout 3 (595) cheaper but no equal ropes, Layout 2 (630) unique.
- C7M-7.3: #1 only 6, 9, 15 touches; #4 70 < HS < 830 -> 790 only; #9 5 < r < 13 -> 6 only; #10 15 values, 14 isosceles; #11 match consistent; #15 m = 9; crossing 10-14; not meeting 5-8; #16 19, 11, 10; #17 {7, 9, 12} perimeter 28; #18 s = 9..16 (8 values), then 9, 10, 11; #19 110 < 115, margins 5 and 5 and 5 against error 6, costs 460 / 240 / 200; #20 spare 3 and 9 work, 9 gives 19.
- C7M-7.4: #1 130; #2 cards 1 and 3 -> 2; #4 114; #7 pairs 1, 2, 4 -> 3; #8 90, 50, 10, 1 and stops at 130; #18 Rule B / Rule C verdicts correct; #19 D4 third angle exactly 20 is not "sharper than 20", so D4 (260) beats D1 (300); #20 131 / no / 7 / only 100.
- C7M-7.5: #3 B = 38; #6 1-B 2-D 3-C 4-A; #16 100, 50, 30 unique; #17 ACD 115, EAB 116; #19 largest angles 77, 79, 75, rule "at least 3 below 80" leaves Designs 1 and 3, costs 305 and 290 -> Design 3; #20 A = 60, 63, 65 and exterior angles 108, 118, 100 -> only T3.
- C7M-7.6: #3 only 120, 30, 30 has exactly one inside altitude (90-45-45 has two sides); #5 C is obtuse (105); #6 S1 F, S2 T, S3 F (the altitude from the right-angle vertex is inside, not a side) -> "2 only"; #17 Z = 20, XYP = 56, YXP = 34; #19 (d) 1 + 2 + 2 = 5 > 4, greatest number 2.
- C7M-7.7: #5 only Card 3 is a real acute triangle (card 1 sums to 190); #6 S2 is right-angled (25 + 65), so only S3 -> "3 only"; #7 129; #18 obtuse k: 1..39 and 91..129 = 78; #19 sums 180, 180, 180, 190 -> Plot D only; #20 third angles 60, 102, 82.8, 90, 73.4 recomputed with the cosine rule (R: 41.4 / 55.8 / 82.8; T: 48.2 / 58.4 / 73.4); acute scalene R and T, T cheaper (24 cm, Rs 72).

Structure by script: every MCQ / AR / MS key is among its options; step-mark totals equal the item marks in all items; every concept has 4-5 scenario MCQs (>= 3), 2 case studies, 1 reverse, 1 AR, 1 three-statement MS; match 5 of 7 concepts (requirement 4), fill_blank 7, true_false 5 (False in 7.1, 7.5, 7.7; True in 7.2, 7.4, a 3-2 mix); MS keys vary ("1 and 2 only", "2 and 3 only", "1 and 3 only", "1 only", "1, 2 and 3", "2 only", "3 only"); no `Remember`, `Easy` or `Create`; Understand 3 of 140. No positional references (the only hits for "above/below" are geometric, "above AB" and "below 80"). Scope: all content sits inside the extracted chapter (construction from sides, SAS-type angle constructions, angle sum, exterior angle, altitudes, classification by angles, triangle inequality); 7.4 #14 cites the book's own "3 cm, 120 degrees, 8 cm" (page 016) correctly; no congruence, trigonometry or Pythagoras is needed to answer anything (the cosine rule is used only by the author to make the 7.7 #20 numbers, the cards give the angles).

## Findings by severity

### HIGH
None.

### MEDIUM
1. Easy-in-disguise, about 18 of 140 (13%; v3 32, v2 54). Remaining one-step or book-statement items: 7.1 #5 (describe a 6.5, 6.5, 6.2 triangle), #6 S1 and S3, #7 (middle letter is the vertex), #12 (two radii give isosceles; same idea as #4), #13 (collinear points); 7.2 #11 (a), #12 (equal arcs on the 5 cm base), #16 (a), (b); 7.3 #13 ("why only the longest"), #3 (a); 7.5 #4, #7, #11 (a), #13; 7.6 #1, #11 (a); 7.7 #2, #12, #13. None is wrong, and the bank has enough hard items around them, so this is a swap-when-convenient list, not a blocker.
2. Repeated ideas, still heavy (v3 M5, untouched): 7.3 range-of-third-side appears in #2, #4, #9, #10, #11, #15, #17, #18, #19, #20 (ten); 7.4 sum-below-180 boundary appears in about fifteen items (#1, #4-#8, #10, #12, #13, #15-#20); 7.7 third angle then name in #3, #4, #11, #12, #13, #16, #19, #20. The concepts are narrow, so some repetition is natural, but 7.3 and 7.4 would be tighter at about eight each. Replace two or three per concept with a different move (for example 7.3: a perimeter-plus-condition item; 7.4: a parallel-lines consequence or a construction record).
3. 7.6 #20 (case study): the numbers cannot both be perpendicular lengths. With angles R = 140, T = 25, Y = 15 the altitude from R to TY is about 0.66 times the altitude from T to the line RY (sin 25 / sin 140), yet the stem prices Well A (from R) at 14 m and Well B (from T) at 8 m, "which needs a pipe". If the pipe is the perpendicular itself the data are impossible for this triangle; if the pipe comes from elsewhere the stem should say so. Fix: "a pipe run from the tank to the well" or swap the lengths to, for example, 8 m (A) and 12 m (B) and adjust the costs so the rule still decides.

### LOW
4. 7.5 #19: mixes "Rs" with the rupee sign used elsewhere; the "3 degrees below 80 because the protractor can be off by 2" rule reads as slightly unmotivated (a 2 degree error would justify 2 degrees). Unambiguous as stated, so cosmetic.
5. 7.6 #19 (d) and 7.7 #20 (d), 7.4 #20 (d), 7.5 #20 (d): determinate (filter then cheapest) rather than a real trade-off; 7.6 #19 (d) is arithmetic (any two fit). Acceptable as 4-mark case studies, but the chapter has only a few genuine trade-offs (7.1 #19, 7.2 #20, 7.3 #20, 7.5 #19 with its 3 degree rule).
6. 7.7 #19: now a single-answer item (fixed), but (d) mainly asks the student to note that a correct sum does not prove each entry right, which is a remark, not a decision.
7. Level labels: 7.1 #13 (Understand, fine), 7.1 #14 (Evaluate, is a one-step "mark the key"), 7.4 #14 and 7.5 #15 (claim checks, correctly Evaluate), 7.7 #9 (Evaluate but a single counter-example, Analyse at most), 7.7 #14 (Evaluate, ok).
8. Correct MCQ option longest by a clear margin: 7.1 #5 (the key is the only option containing an instruction), 7.2 #4 and 7.2 #7, 7.3 #6. Trim or lengthen a distractor in two of these.
9. Template: the claim-check items (7.1 #14, 7.2 #14, 7.3 #14, 7.4 #14, 7.5 #15, 7.6 #14, 7.7 #14) now use different frames ("Mark this key", "Mark each sentence", "Find the faulty step", "Is the argument valid", "Is this always/sometimes/never", "Give counter-examples"); no further action.
10. 7.7 #20 gives angles to one decimal place (41.4, 55.8) as if measured with a protractor; a class could not measure to 0.1 degree. Round to whole degrees or say "calculated".
11. 7.4 #18 names the rules "Rule B" and "Rule C" (no Rule A in the stem).
12. 7.1 #9 (R): "R is not the correct explanation of A" is a defensible key but a few students may argue R explains why the crossing points are valid vertices; the item is safe because "exactly two" is the claim and R does not give it.

## Per-concept verdicts
- C7M-7.1: keys sound; 6 easy items; pass.
- C7M-7.2: keys sound; 4 easy; pass.
- C7M-7.3: keys sound; range idea ten times (MEDIUM 2); pass.
- C7M-7.4: keys sound; boundary idea about fifteen times; pass.
- C7M-7.5: keys sound; 4 easy, algebra weight fixed; pass.
- C7M-7.6: keys sound; #20 pipe-length inconsistency (MEDIUM 3), fix before loading if convenient; pass.
- C7M-7.7: keys sound; the v3 HIGH is fixed; 3 easy; pass.

## Verdict

pass. 140 items read, 0 wrong keys, 0 second defensible answers, 0 HIGH. Three MEDIUM (about 18 easy items, repeated ideas in 7.3 and 7.4, and the 7.6 #20 pipe-length numbers) and nine small LOW items. The 7.6 #20 reword is the one fix worth doing before loading; the rest can be swapped in a later pass.
