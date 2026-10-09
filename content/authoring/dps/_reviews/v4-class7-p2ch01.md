# Review v4: Class 7 Maths, Ganita Prakash Part II ch 1 "Geometric Twins" (gegp201)

File: content/authoring/dps/class7/p2ch01.json (141 items: 20,20,20,20,20,21,20). Items cited as concept.index (0-based, file order), e.g. 1.3.16 = 17th item of C7M-1.3.
Latest prior review: v3-class7-p2ch01.md (06:39). The chapter file was last modified 05:07, i.e. BEFORE v3, and git shows no change since the commit. So no v3 finding has been fixed; this v4 is an independent re-check that confirms them. Every key was recomputed (angle sums, SSA triangle counts by code, all money totals) before reading the answer.

## Result of the independent recompute
- All keys correct except the SSA cases below. Step marks sum to item marks in every item. Money totals re-verified (1.1.18 1,100 vs 1,000; 1.2.19 7,200 vs 7,560; 1.3.19 7,400/4,000; 1.4.18 5,000 vs 7,200; 1.4.19 1,600 vs 1,900; 1.5.19 720 vs 660; 1.6.20 348).
- SSA counts by code (adjacent side a, opposite side b, angle at the shared vertex; two triangles only if a*sin(angle) < b < a):
  - 1.3.16 pair 2 (a=7, b=9, 48 deg): 1 triangle. 1.3.7 row 2 (a=6, b=8, 50 deg): 1 triangle.
  - 1.3.13(b) (7, 6, 47), 1.3.17 (9, 7, 40), 1.5.17 (12, 8, 25), 1.5.5 (12, 9, 40): 2 triangles each, keys right.
  - Proposed fixes check out: (9, 7, 48) and (8, 7, 50) both give 2.
- No positional option references (the only hit, 1.4.18, names the stem's own Option A / Option B plans).

## Status of v3 findings
All still open (file unchanged): the HIGH 1.3.16, and every MEDIUM listed in v3 (1.1.11, 1.1.18(d), 1.2.17 duplicate of 1.2.8, 1.2.18(d), 1.3.7 row 2, 1.3.18(d), 1.4.19, 1.5.13, 1.5.19, 1.6.9, 1.6.20, 1.7.17, 1.7.18(d)).

## Severity-ordered issues

HIGH (1)
1. 1.3.16 (5 marks) Pair 2: AB = PQ = 7, AC = PR = 9, angle B = angle Q = 48 deg. The side opposite the 48 deg angle (AC = 9) is longer than the adjacent side (AB = 7), so exactly one triangle exists and the plates ARE congruent. Key (b) says "two different triangles can fit and congruence is not certain": false for these numbers; a student who draws it has a second defensible answer. Fix: AB = PQ = 9, AC = PR = 7 (two triangles, checked above).

MEDIUM
2. 1.3.7 (match) row 2: AB = PQ = 6, BC = QR = 8, angle A = angle P = 50 deg keyed "d, SSA, congruence not guaranteed". Same flaw, unique triangle. Fix: AB = PQ = 8, BC = QR = 7.
3. 1.5.19 (b),(d): "pay only for boards found with a right angle", key counts two usable boards. A right angle between the 12 and 15 cm sides is not congruent to board P (15 must be the hypotenuse), so the premise of "measure first, 660" is false. Fix: right angle opposite the 15 cm side.
4. 1.5.13 key quotes 8 cm and 4.4 cm (from Pythagoras); scope_out excludes Pythagoras. Delete the numbers; the step marks do not need them.
5. 1.7.17 scope drift: a quadrilateral with both pairs of opposite sides parallel (parallelogram) is not in the chapter (no hit for "parallelogram" in gegp201 pages; the book only has AB parallel to CD with AB = CD, p013 Q2). Use that figure.
6. 1.1.11: "T3 fits over T2 only after being turned over" is impossible for a rectangle (it is its own mirror image). Say "half turn" or use a non-symmetric shape.
7. 1.4.19: Plot 3 has no vertices but "side CA" is Plot 1's label; plan B (three sides) also needs Plot 1's other sides, so 1,900 understates the cost. Label Plot 3's vertices and say Plot 1's sides are known.
8. 1.4.10 (b): "why is it not ASA?" Since AB parallel CD also gives angle OBA = angle OCD (alternate angles, transversal BC), BO = CO lies between angle OBA and angle BOA, so ASA is equally valid. The key's "not ASA" is a second-defensible-answer risk. Reword to "name one condition that works".
9. 1.2.18 (d), 1.3.18 (d): decision forced by a stated deadline (Tailor A needs 6 days vs 4 left; Anil "only by Friday evening" vs Friday morning); one option is impossible, so no trade-off. 1.7.18 (d): answer is (c) restated and Imran's 35 cm mark is a strawman. 1.1.18 (d): arithmetic only, congruence plays no part. 1.6.20: chapter content is only (a) 60 deg and (b) 360/60, the rest is shopping arithmetic.
10. 1.2.8 and 1.2.17 are the same item (HEN and BIG, book's Figure-it-out Q1). Replace 1.2.17.
11. 1.6.9 (two angles 50 and 80, find third): angle sum only, the isosceles fact is not needed; disguised one-step item.
12. Repeated ideas: "write congruence in correct order" about 10 of 20 in 1.2; "SSA gives two triangles" 8 in 1.3; "third angle then ASA/AAS" 12 of 20 in 1.4; "(180 - a)/2" 13 of 21 in 1.6; rectangle diagonal gives two congruent triangles 6 times across the chapter (1.2.4, 1.2.19, 1.3.10, 1.5.12, 1.7.2, 1.7.9). Several items are the book's own worked examples or Figure-it-out questions with new numbers (1.2.13, 1.2.16, 1.3.13, 1.6.5, 1.7.2, 1.7.5, 1.7.8, 1.7.9).
13. Template: all seven concepts use the same slot order and every case study the same four-part frame (identify, condition, arithmetic, Decide); 10 of 14 case studies are money-driven. Correct MCQ option is strictly longest in 10 of 33 (30%), and is the first listed option in 25 of 33 (acceptable only if the loader shuffles).

LOW
- 1.4.7 row 2 (AAS, option b) could also be read as option c (ASA after the third angle is found); option c is built for row 3, so the intended mapping is unique but not airtight.
- 1.4.16 (d) has a second valid change (angle L = 75 deg). 1.1.13 "symbols" is undefined. 1.6.11 uses linear equations. 1.7.6 is all-true (weak). 1.4.5 and 1.5.6 are book-line statements with an obviously false companion. Fill-blanks 1.1.2, 1.2.12, 1.5.11, 1.6.6, 1.7.11 are single-step.
- Easy-in-disguise (firm, same test as v3): about 31 of 141 (22%): 1.1.9, 1.1.10, 1.1.16, 1.1.17, 1.2.17, 1.3.4, 1.3.6, 1.3.11, 1.3.13, 1.3.15, 1.3.17, 1.4.3, 1.4.5, 1.4.6, 1.4.8, 1.4.13, 1.5.6, 1.5.11, 1.5.12, 1.5.14, 1.6.5, 1.6.9, 1.6.13, 1.6.15, 1.7.0, 1.7.10, 1.7.11, 1.7.12, 1.7.14, 1.7.15, 1.7.16.

## Verdicts
- C7M-1.1: pass after fixes (1.1.11 impossible premise; 1.1.18(d) arithmetic only).
- C7M-1.2: pass after fixes (duplicate 1.2.17, forced 1.2.18(d)).
- C7M-1.3: FIX REQUIRED (HIGH 1.3.16 wrong key, MEDIUM 1.3.7 same flaw).
- C7M-1.4: pass after fixes (1.4.19 labels, 1.4.10(b) ASA ambiguity).
- C7M-1.5: pass after fixes (1.5.19 flawed premise, 1.5.13 Pythagoras numbers).
- C7M-1.6: pass (small MEDIUMs only: 1.6.9, 1.6.20).
- C7M-1.7: pass after fixes (1.7.17 scope drift, 1.7.18(d) strawman).

Overall: NOT a clean pass. One HIGH (1.3.16, wrong key on a 5-mark item) plus the 1.3.7 twin. Both are quick number swaps and I confirmed the replacement numbers give two triangles. Once 1.3.16 and 1.3.7 are changed and the 1.5.19 premise and 1.5.13 numbers are corrected, the chapter is a pass; the remaining issues (templating, repeated ideas, easy items, forced case-study decisions) are MEDIUM/LOW and can follow.
