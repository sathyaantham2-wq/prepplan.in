# v3 re-review: Class 8 Maths Part II ch7 (Area), content/authoring/dps/class8/p2ch07.json

Reviewer: independent re-review after one fix pass. 124 questions in the pack; the diff against the pre-edit copy shows 42 changed items, and all 42 were re-read, every key and every case-study part recomputed, every figure checked for geometric possibility. Indices below are 1-based positions inside each concept (v2 used 0-based, so v2 "7.2 [8]" is v3 "7.2 #9").

## v2 status

- HIGH 1 (7.2 gable): FIXED. Now base 6 m, edges 5 m, top 4 m above the middle of the base (3-4-5 twice, closes). (a) 12 sq m, (b) 24 sq m = 6 litres, (c) 15 - 12 = 3 sq m, (d) "at least" 6 litres with 6x260 = 1,560, 900 + 520 = 1,420, 2x900 = 1,800: cheapest 1,420. Correct. MEDIUM 2 ("exactly" vs "at least") also FIXED.
- MEDIUM 3 (eleven easy-in-disguise items): all eleven replaced or rewritten with numbers (7.2 #14, 7.3 #13/#16/#14, 7.4 #11, 7.5 #11/#16/#21, 7.6 #5/#9/#19). None is a one-line book fact now.
- MEDIUM 4 (five decision-less last parts): all five now weigh two things (7.1 #15 land plus wall per sq m: 1,750 / 1,755 / 1,740; 7.2 #19 swap offer 572 vs 600; 7.3 #19 BD = 27 and nearest proposal; 7.4 #4 three payment routes 12,90,000 / 12,60,000 / 12,65,000; 7.5 #18 net gain 2,000 vs 1,500). All recompute.
- MEDIUM 5, 6, 7 (repeated ideas): improved (median, same-base-between-parallels, rhombus items partly swapped); concept 7.3 still leans on median/same-base ideas but not above a defensible level.
- LOW 8 (7.3 ratio given), 9 (fill-blank endings now varied), 10 (7.6 #4 now accepts 4,940 to 4,942), 12, 13: fixed. LOW 11 (trapezium thin) unchanged, see LOW below.

## HIGH

None. No wrong key, no second defensible answer, no impossible figure found in any of the 42 changed items. Items specifically checked:

- 7.2 #9 gable: closes (3-4-5 on each half), Pythagoras not needed, height supplied.
- 7.2 #19: area 600, QR = 40 gives 30 m; PR = 50 gives 24 m. Consistent figure (right angle at Q, legs 30 and 40, hypotenuse 50, distance from Q to PR = 30x40/50 = 24). Offer plot 1/2 x 52 x 22 = 572 < 600; possible triangle.
- 7.3 #7 trapezium: AOD = BOC = 18, ABC = 30 gives AOB = 12; then COD = 18x18/12 = 27 and AO:OC = 2:3 agrees both ways. Possible.
- 7.3 #11 trapezium AB 6, DC 12, h 8: diagonals cut in 1:2, so OB = 4, OD = 8, BD = 12 (horizontal offset sqrt(80), figure closes). AOB 8, AOD 16, BOC 16, COD 32 (= 4 x AOB), total 72 = 24 + 48. Five parts, five step marks.
- 7.3 #16 kite: BO = OD = 20, AO = 15, OC = 45, perpendicular diagonals; areas 150, 450, 450, 150. Real kite (AB = AD), unequal triangles.
- 7.3 #13 midpoint quarter: 640 - 160 = 480.
- 7.3 #15 match: 12, 36, 16, 48 sq cm, key 1-c, 2-d, 3-a, 4-b; all four options distinct.
- 7.3 #19: 900; 360 / 450 / 540; X = 486, BD = 27; misses 126 / 36 / 54, so Proposal 2 only.
- 7.4 #2 hexagon: side 8, apothem 8 x sqrt(3)/2 = 6.93 (6.9 given), area 165.6 both ways.
- 7.4 #3: 180 - 40 - 30 = 110 (cut triangles have right angles at A and at C, legs 10/8 and 10/6).
- 7.4 #13 coordinate quadrilateral: shoelace gives 37, outside pieces 8 + 5 + 6 = 19, 56 - 19 = 37.
- 7.5 #11 99; #14 72; #15 216 = 216; #16 120 and one half; #18 diagonal 40 (half-diagonals 15 and 20, side 25 consistent), height 24, fence 20,000, net 2,000 vs 1,500; #21 1,040 - 78 = 962.
- 7.6 #4: 10,890 sq ft; 929.0304 sq cm; 1,012 sq m; 4,940.7 (4,942 with 1,011.7) vs 5,142.9 per sq m; Plot X cheaper. #5 R explains A (12 x 0.0929 = 1.11 < 1.2). #9 5,000. #19 parallel sides 20 and 10, height 8, 120.
- Fill-blanks: 54, 7, 9, 8, 12, 258, all single numbers, no natural equivalent.
- Mechanics: every option item has the correct option at o[0]; no duplicate option text; no wrong option equal in value to the key; no option named by position; every `s` step list sums to `m` in all 124 items.

## MEDIUM

1. **C8M-7.3 #14** (mcq, three tiles): "A triangle is painted with its base along the bottom edge of the first tile and its top corner at the top-right corner of the third tile." The base length is not fixed: "along the edge" could be only part of it, and a reader who takes the base as the whole three-tile row gets 1/2 x 30 x 10 = 150 sq cm, which is a listed option. Fix: "with its base the whole bottom edge of the first tile". Key 50 sq cm then stands alone.

## LOW

2. **C8M-7.4 #10** (true_false, diagonal split, 65 sq cm): the answer is the single principle already stated as Reason R of 7.4 #5 and used in 7.4 #1 (triangles covering a polygon add to its area). Correct and has a reason, but it is the same idea a third time in one concept; swap if a slot is spare.
3. **C8M-7.3 #5** (fill_blank, 45 = 1/2 x 10 x h): one formula inversion; correct, Apply is the ceiling.
4. **C8M-7.5 #18(d)**: net gain per metre of hedge is positive (40 x 5 - 150 = 50), so the longer diagonal wins by construction; the trade-off is shallow. Acceptable.
5. **C8M-7.6 breadth** (v2 LOW 11): trapezium still tested by few items; unit conversions dominate. Not a defect.

## Template counts

- Claim-checks: No (7.1), Partly (7.2), Yes (7.3), No (7.4), Partly (7.5), Yes (7.6): 2 / 2 / 2.
- `true_false`: False, True, False, True, False, True; each asks for the reason.
- `multi_statement` (three statements, the DPS standard) keys: 2 only, 1 and 3 only, 1 only, 3 only, 2 and 3 only, 1 and 2 only: all different.
- `assertion_reason`: explains (7.1), R false (7.2), R true / A false (7.3), explains (7.4), not explains (7.5), explains (7.6): all four outcomes present.
- Correct option strictly longest in an mcq: 0 of 28 mcqs; key always first in the file (loader shuffles).
- Slot mix identical across concepts (about 5 mcq, 8 short, 4 long, 1 each fill_blank, match, AR, MS) is the loader table; item order differs per concept.
- Repetition: median-halves and same-base-between-parallels recur in 7.3 with different data and tasks; not templated.

## Per-concept verdicts

- C8M-7.1 (21): load-ready.
- C8M-7.2 (21): load-ready; gable fixed.
- C8M-7.3 (20): load-ready after the one-phrase fix of MEDIUM 1.
- C8M-7.4 (20): load-ready.
- C8M-7.5 (21): load-ready.
- C8M-7.6 (21): load-ready.

## Counts

Read 124 (42 changed, all recomputed). HIGH 0. MEDIUM 1. LOW 4. Not templated.

Verdict: not load-ready as it stands only because of the single MEDIUM wording ambiguity (7.3 #14); with that one-phrase edit, load-ready. No new HIGH introduced by the fix pass.
