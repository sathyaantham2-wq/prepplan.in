# Re-review (round 2): top-up p2ch01-la4.json, Class 7 Maths P2 Ch1 "Geometric Twins"

Method: diffed against topup-la4-v1/p2ch01-la4.json. Changed items: 1.1 (difficulty only, Hard to Medium),
1.2 Asha/Bilal/Charu, 1.2 swing frame, 1.3 sign-maker, 1.4 steel plates, 1.6 wheel. 1.5 ladders, 1.6 tile and
1.7 gate are byte-identical to v1 (not re-judged). Every length and angle recomputed in python; no trigonometry
is needed by the pupil in any changed item (given "measured" angles, congruence, angle sum, isosceles base
angles only). Page spans checked against gegp201 pages 9-19. No repeat of the existing class7/p2ch01.json ideas
found (searched for plate, sign, wheel, spoke, swing, gusset, Asha/Bilal).

## Findings

| Item | Sev | Problem | Fix |
|---|---|---|---|
| C7M-1.3 sign-maker part (b)/(c) | MEDIUM | Key is correct (4 cm none; 5.14 cm one; 6.5 cm two, BC 2.15 and 10.10; 10 cm one, other root BC = -2.45 is off the ray). But the book teaches only the TWO-point case (pp.11-12, 30 deg, 6 cm, 4 cm) and the right-angle RHS case (pp.16-17). "No point", "arc just touches" and "B inside the circle so only one point" are never taught or argued in gegp201, so this is counting beyond the book. Also the shortest distance is really 5.1423; a 5.14 cm arc would just miss the line, so "one triangle at exactly 5.14" depends on reading 5.14 as exact. Part (a) is a one-line recall (1 mark). | Keep the book's own case: ask only 6.5 cm (two triangles, shown by the arc) against the RHS-style one-triangle case, or drop 4 cm / 5.14 cm and state "take 5.14 as exact". Leave (a) but fold it into the verdict step. |
| C7M-1.4 steel plates (a) | LOW | Key correct (angle C 60; ASA needs XY = 60; AAS gives YZ = 53 or XZ = 65, both recomputed 53.07 and 65.10; K/L/M gives L = 50, 60 cm side between; DF = 53 matches CB; EF = 60 not 65). But after finding angle Z = 60, YZ = 53 and XZ = 65 are also ASA sides, so "a different side for AAS" is only unique if the pupil uses just the two given angles. Step 2 even says "using angle Z = 60", which blurs the label. The inspector note refers to "the 65 cm side of Plate 3" that the stem never gives. | In (a) say "using only the two angles given"; reword step 2 without Z; in the key say "DE (which would be 65 cm)". |
| C7M-1.4 steel plates | LOW | Third three-triangle/ASA-vs-AAS item in the topic (existing Rina T1/T2/T3 and roof frames). Different task (missing records, name the side), so not a repeat, but the same family. | None needed. |
| C7M-1.6 wheel (a),(b),(c) | LOW | Key correct (45, 67.5; SAS; 80 gives 20 deg so 18 spokes; 50 gives 80 deg and 360/80 = 4.5; part (d) divisors of 180 in 8..20 are 9, 10, 12, 15, 18, 20, base angles 70, 72, 75, 78, 80, 81; 8 gives 67.5). Part (d) is a good climb, but (a) and (c) are the same one-line calculation and the item never uses a triangle fact beyond base angles. Step 4 is a 4-way list (all-or-nothing). | Optional: allow half a mark for the rule "n divides 180". |
| C7M-1.2 Asha/Bilal | LOW | Key correct: ABC to PQR and ACB to PQR both valid SSS; Charu BAC to PQR fails (AC 8 vs QR 5; angle B 72 vs P 36); DFE to XYZ fails (DF 7 vs XY 8). Given 36 and 72 are consistent with the sides (computed 36.4 and 71.8), so a measured value is fine. Part (b) can also be done by isosceles base angles, which gives the same answer, no second key. Step 1 hides two checks (Asha and Bilal) under one mark. | Optional split of step 1. |
| C7M-1.2 swing frame | LOW | Key correct. Built from coordinates: EA = ED = 11, EB = EC = 10 give exactly 15.50, 23.07 and 54.07 degrees, matching the given 15.5, 23, 54. Needs the chapter (SSS naming) and the common-piece argument. Marks 2+1+1 match parts. Step 1 (2 marks) lumps (a) and (b); a marker can still split 1+1. | Optional: make the step "AC = DB = 7 cm (1)" and "SSS, E to E, A to D, C to B (1)". |
| Template (counts) | LOW | claim_check tags: 3 of 9 (1.1, 1.2 Asha/Bilal, 1.4); verdicts now mixed: helper wrong, Bilal right (Charu wrong), inspector half right. Down from 5 refutations to a real mix. Step shape: 7 of 9 items are still 4 steps of 1 mark each (swing 2+1+1, sign 1+2+1 differ). No options. Slot order all Hard/Hardest or Medium, no easy items. | None needed. |

## Pages
1.2 Asha/Bilal "pp. 6-9" right; swing "pp. 4-9" right; sign "pp. 10-12" right; steel plates "pp. 12-16" right;
wheel "pp. 17-19" right (isosceles base angles).

## Counts
HIGH 0. MEDIUM 1 (sign-maker beyond the book). LOW 5 (plates labels, plates family, wheel, Asha/Bilal step, swing
step) plus template note.

Verdict: PASS (no HIGH, no wrong key, nothing a Class 7 pupil cannot compute). Fix the MEDIUM on the sign-maker
item before loading if the scope rule "only what this book teaches" is held strictly.
