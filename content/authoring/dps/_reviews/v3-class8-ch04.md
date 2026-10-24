# Review v3: Class 8 Maths ch04 Quadrilaterals (C8M-4.1 to 4.6), re-review after one fix pass

Pack: content/authoring/dps/class8/ch04.json (129 items). Diffed against the pre-edit copy: 62 items changed (4.1: 6, 4.2: 9, 4.3: 12, 4.4: 12, 4.5: 9, 4.6: 14). Every changed item was recomputed by hand and in code (angles, lengths, congruence orders, the 4.6 idx 7 triangle-join enumeration), facts checked against pages 94-95 and the Figure-it-Out answers (p. 108-109). Indices are 0-based within each concept.

## v2 status

v2 had 0 HIGH. The two things it asked to fix first are fixed:
- 4.5 idx 16 (under-determined, needed sqrt 3): replaced by Rani's working (35 -> 55 -> 110 -> 70); no sqrt 3, determined, key correct. FIXED.
- 4.3 reflex/arrowhead thread: now only idx 15 remains (S3 of idx 1, idx 6, 9, 17, 18, 19 rewritten on convex quadrilaterals; grep for reflex/dented/arrowhead is clean elsewhere). idx 15 is the book's own Figure-it-Out Q10 (a dented ADCB, "will the angle sum also be 360, find by reasoning using a diagonal"), so it is inside scope_in (pp. 94-95 angle sum, p. 108-109 exercise). The stem describes the figure fully. KEPT, ACCEPTABLE (note LOW below that it is near-verbatim the book's answer).
- Recall-heavy five-markers: 4.1 idx 18, 4.2 idx 17, 4.3 idx 19, 4.4 idx 19, 4.5 idx 17/19, 4.6 idx 19 all reworked into error-analysis or multi-property problems; each has a real judgement part. 4.6 idx 19 (Tanvi's proof, circular-or-complete) is now good. FIXED.
- Weak case-study decisions: 4.1 idx 17(c), 4.4 idx 0(d), 4.3 idx 18(d), 4.2 idx 17 now have a real "partly right" or "data cannot decide" judgement; 4.3 idx 21 and 4.5 idx 21(d) are genuine trade-offs. FIXED.
- 4.4 idx 12 (secret rectangle) fixed (OX = x + 4; WY = 22, XZ = 18, unequal). 4.4 idx 9 option repeat fixed. 4.6 idx 3 now states both definitions in the stem. FIXED.
- Easy-in-disguise one-steppers raised to two-step: 4.1 idx 1, 2; 4.2 idx 0, 2, 3; 4.3 idx 0, 3, 4; 4.4 idx 1, 5, 8, 11, 15; 4.5 idx 0; 4.6 idx 0, 2, 5, 7, 8, 13. FIXED.
- NOT fixed (still as in v2): 4.3 idx 8, 4.4 idx 13, 4.5 idx 1 (one-step), 4.6 idx 6 (AR whose R is the rule that gives A); see MEDIUM.

## Verification of changed items (all recomputed; no wrong key found)

4.1: idx 1 (PO + OQ = 14, so QS = 14), idx 2 (AOD 70, AOB 110, OAD 55), idx 3, idx 14 (OB must be 1.3 m), idx 17 (110, 70, 55, 90; both ways fail), idx 18 (40/100, 50 not 45, 45/90, 100 matches 40) all correct.
4.2: idx 0 (7, BD = 14, 90), idx 1 (rhombus not square), idx 2 (rectangle not square), idx 3 (APO 70, APB 110), idx 5 (A, R true, explains), idx 9, idx 10 (80/100), idx 11 (False; kite counter-example valid: sides sqrt34, sqrt74), idx 17 (55/35, SAS, 15 vs 20, rhombus, changes) correct.
4.3: idx 0 (D = 60, 100), idx 1 ("3 only": S1 and S2 false, S3 true, e.g. 80, 80, 80, 120), idx 3 (60, 90, 90, 120: only PQ and SR), idx 4 (A = C = 70, B = D = 110, ABD 55), idx 5, idx 6 (D = 110 from the 70 exterior angle, C = 75), idx 9 (b, c, d, a), idx 15, idx 17 (x = 60; 90, 120, 60, 90), idx 18 (plots 2 and 4; 65; trust A, D; B = 75 or C = 100), idx 19 (D = 75, A = 105, B = 60, C = 120, 65 both ways, 165), idx 21 (X 80/110/80, Y 67.5/135/67.5, X wins) correct.
4.4: idx 0 (sqrt700 = 26.5, sqrt1900 = 43.6; 120/60/120; 21.8, 13.25; 90; partly right), idx 1, idx 2 (x = 20, A = 110), idx 3 (A true, R false), idx 5 (BC = 11), idx 8 (POQ ~ ROS ASA; the other three orders/conditions are invalid), idx 9, idx 11 (48, 82), idx 12 (x = 5, XZ = 18), idx 15 (Yes; AOD 64), idx 17 (40, 35, 105, CDA ASA, CD = 8), idx 19 (ASA, OX = OY, LX = MY, YP = 9, claim rejected) correct.
4.5: idx 0 (OB 6, OA 8, BD 12; 6-8-10 consistent), idx 7, idx 8 (3 others; the four large triangles are not congruent to GOA), idx 15, idx 16, idx 17 (35, 125, 110, 55 each side; PBD 35 check holds), idx 18 (rhombus, kite 10-7-7-10, parallelogram 10-7-10-7, rhombus + kite perpendicular, axis bisects), idx 19 (x = 15, 70/110, 55, y = 7, AC = 26, BD cannot equal AC), idx 21 (12 and 8, rhombus, 5 cm, 6/4 cut) correct.
4.6: idx 0 (C = 120, D = 50), idx 2 (P + Q = 180, PS parallel to QR; ends 72 and 80 so not isosceles), idx 3 ("1 and 2 only"), idx 5 (P = 75, SPR = 40; also 180 - 105 - 35 = 40), idx 6, idx 7 (see below), idx 8 (c, d, b, a), idx 10 (kite 5-5-8-8; convex), idx 11, idx 12 (11, 5, 11, 5), idx 13 (B = D, rhombus), idx 17 (x = 42; 94, 86, 72, 108, not isosceles), idx 19 (a: B-bisected; b: SSS; c: complete; d: AB need not equal AD; e: 52 and 90, angles 90 + 90 + 104 + 76 = 360), idx 20 (F, T, F, T, T) correct.

4.6 idx 7 enumeration (right isosceles triangle, legs 6, joined along equal sides, no overlap): leg to leg with the right angles at the same end gives collinear legs, i.e. a big triangle, not a quadrilateral; leg to leg with the right angles at opposite ends gives the parallelogram (sides 6 and 6 sqrt 2, angles 45 and 135); hypotenuse to hypotenuse gives a square both ways. So the list "a square and a 45-135 parallelogram" is complete; no rectangle, no kite, no rhombus other than the square. Exactly one option fits. OK.

Mechanical checks (code): every step list sums to its marks (0 mismatches); all option items have the key at o[0] and no wrong option equals the key; no item names an option by position; no sqrt, symmetry, area/perimeter, circle or coordinate content; no construction item (4.4 idx 11 narrates the book's parallelogram construction but only asks for angles, acceptable).

## HIGH

None. No wrong key, no second defensible answer, no arithmetic or fact error in any of the 62 changed items or in the unchanged ones re-read.

## MEDIUM

1. [4.3 idx 5, assertion_reason] R: "The four angles formed at the point where the two diagonals of a quadrilateral cross add up to 360 degrees." This is true only when the diagonals cross, i.e. a convex quadrilateral. The same concept's idx 15 says the dented figure's diagonal BD lies outside, so R is false for that quadrilateral, and "A true, R false" becomes a defensible second answer to a student who has met idx 15. R is also still a chapter-unrelated fact paired to A (v2 complaint). Smallest fix: R = "In a convex quadrilateral the four angles formed where the diagonals cross add up to 360 degrees", or better a related true non-explaining R such as "A quadrilateral can have three acute angles".
2. [4.2 idx 5 vs 4.5 idx 5 (and 4.5 idx 6), repeated idea introduced by the fix] 4.2 idx 5 AR now asserts "a frame of four equal rods with one corner fixed at 90 degrees must be a square", which is the same claim as 4.5 idx 5 (true_false: "four 25 cm rods, one corner at exactly 90 degrees, must be a square") with new numbers; 4.5 idx 6 (four hinged 15 cm rods) is the same frame. Three items on one fact. Fix: change 4.2 idx 5 A to a different square test (e.g. "A parallelogram with one right angle and perpendicular diagonals is a square", A true, R = "the diagonals of every rectangle bisect each other" true but not explaining) or give 4.5 idx 5 a different claim.
3. [4.6 idx 6, assertion_reason] A (kite angle BAD = angle BCD) and R (triangles ABD and CBD congruent by SSS) are the book's own two-line proof; R explaining A is automatic, so this is an easy item (v2 asked for a non-explaining R; not done). Fix: A about the diagonal BD bisecting angle ABC, R "the diagonals of a kite are equal" (false), or R true but unrelated ("a kite can have a right angle").
4. [4.3 idx 8, 4.4 idx 13, 4.5 idx 1, still one-step, unchanged from v2] 4.3 idx 8 (add 85 + 95 + 100 + 90 = 370, "a measurement is wrong"), 4.4 idx 13 (unequal diagonals so not a rectangle), 4.5 idx 1 (76 gives 38 then 90 - 38 = 52 in one fact). Each answers with a single book line in one step. Fix: 4.3 idx 8 add a given diagonal angle (as in idx 10) or turn it into "which one reading could be corrected so the angles also fit a parallelogram"; 4.4 idx 13 give the perimeter of triangle AOB and one side and ask the other diagonal; 4.5 idx 1 ask for angle between the diagonal and the other side plus a second fact, or delete it (4.5 still has seven angle-halving items).
5. [4.3 idx 11 and idx 14(a), thin] idx 11 (true_false: three right angles gives the fourth, then opposite sides equal) and idx 14 (a) (360 - 90 - 90) are single-line facts in the book (p. 95 states the first nearly verbatim). Fix: make idx 11 a false claim (e.g. "three equal angles force a rectangle"), keeping the "reason or correction" format.

## LOW

- [4.3 idx 15] The reasoning is the book's own Q10 answer almost line for line; as a claim check it earns its 3 marks only by the judge-Ali framing. Acceptable; a variant with the dent at a different corner or asking which diagonal to use would be less recall.
- [Easy-in-disguise remnants, one book line each] 4.2 idx 9 (Venn: squares in the overlap; deliberately kept), 4.4 idx 3 (R "diagonals of every parallelogram are equal" is plainly false), 4.4 idx 9 and 4.3 idx 9 (match items of four one-line facts/subtractions), 4.4 idx 2 (opposite angles, one linear equation), 4.5 idx 8 (the four small triangles are congruent), 4.5 idx 7 (two one-fact parts), 4.6 idx 11 (four equal angles). Each is at most a short two-fact chain; the bank allows none, so upgrade if there is spare budget.
- [4.1 idx 14] OB = half of AC is the whole answer in one step (Evaluate label); add the other diagonal's partial reading.
- [4.1 idx 20(b) and 4.1 idx 17 (a)/(b)] part (b)-style "reject the helper's wrong claim" remains a mild strawman; fine at its marks.
- [Repeated ideas, now at the margin] 4.4: "opposite equal / adjacent add to 180" in 9 of 22 (idx 0, 4, 10, 15, 16, 17, 19, 20, 21), down from 11. 4.5: angle-halving in 7 of 22 (idx 9, 12, 14, 16, 17, 19, 20), down from 9. "Perpendicular diagonals do not give a square/rhombus" appears in 4.2 idx 11, 4.5 idx 13, 4.6 idx 20(a) (three; each a different slip: missing bisect, kite counter-example, missing equal). Ropes/strips-at-midpoints story: 4.1 idx 0, 12, 17; 4.2 idx 1, 4, 5, 17; 4.6 idx 8; now acceptable.
- [4.4 idx 14] answer quotes constructed lengths 8.7 and 2.5 cm; the rubric must not demand them (already noted in v2).
- [4.6 idx 20(b)] needs a converse proof in one line (opposite angles equal gives parallel sides); the key does give it, so fine.
- [4.1 idx 18 (a), 4.5 idx 15 (a)-(b), 4.2 idx 0 (b)] parts reproduce the book's derivations (equal and bisecting diagonals give a rectangle; SSS then 90 degrees on a straight line); each sits beside a judgement part, so marks are defensible.
- [4.5 idx 18 / 4.6 idx 10, 12] placement words "flipped over" and "turned half a turn" are used only to place the triangles, not as a symmetry property; within scope_out.

## Chapter-wide counts read (129 items)

Types: short_answer 51, mcq 31, long_answer 25, fill_blank 6, assertion_reason 6, multi_statement 6, match 4 (unchanged). No easy items by label (Hard 104, Hardest 25). Bloom: Analyse 66, Evaluate 41, Apply 18, Create 3, Understand 1. true_false: 6, keys False, False, True, False, True, False (3 T / 3 F), each with a reason or counter-example. claim_check verdicts (9): No 5, Yes 2, Partly 2. multi_statement keys: "1 and 3 only", "2 and 3 only", "3 only", "1, 2 and 3", "1 only", "1 and 2 only" (well spread; false statement position varies). assertion_reason outcomes: A false R true, explains x2, not explains x2, A true R false (all four used). fill_blank (6): answers 14, 110, 55, 12, 40, 110... all single numbers, application-level two-step chains (4.4 idx 2 is the thinnest). MCQ: correct option strictly the longest 0 of 31, tied for longest 9 (fine). Every option item has the key at o[0] (loader shuffles). Slot order: positions 0-19 differ across concepts in type and marks (no identical-column pattern beyond the loader's prescribed shape). Templated: no.

## Per-concept verdicts

- C8M-4.1 Rectangles: load-ready (all keys right; thin points only LOW).
- C8M-4.2 Squares: load-ready after the optional MEDIUM 2 (duplicate "four equal rods, one 90 degree corner" claim); keys right.
- C8M-4.3 Angle sum: not yet load-ready only for MEDIUM 1 (idx 5 R truth depends on convexity, contradicts idx 15); otherwise keys right and scope clean. One-line change.
- C8M-4.4 Parallelograms: load-ready (idx 13 one-step is the only unresolved v2 item; MEDIUM 4).
- C8M-4.5 Rhombus: load-ready (idx 1 one-step; MEDIUM 4).
- C8M-4.6 Kite and trapezium: load-ready (idx 6 AR still the book's own proof; MEDIUM 3).

## Counts and verdict

HIGH 0. MEDIUM 5 (one of which, 4.3 idx 5, is a possible second defensible answer and should be fixed before load; the other four are thinness/duplication). LOW 10. Items read: 129 (62 changed, all recomputed). Fix pass introduced no wrong key and no new HIGH; it introduced one duplicated idea (MEDIUM 2) and one convexity gap (MEDIUM 1).

VERDICT: NOT load-ready yet by the strict rule, but one two-line edit away: fix 4.3 idx 5 (R) and 4.2 idx 5 (duplicate claim), preferably also 4.6 idx 6; the remaining items can load as they are.
