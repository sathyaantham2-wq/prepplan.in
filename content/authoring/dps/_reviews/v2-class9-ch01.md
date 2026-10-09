# Review v2: DPS bank, Class 9 Maths, Part I ch 1 "Orienting Yourself: The Use of Coordinates" (iemh101)

File: `content/authoring/dps/class9/ch01.json`. First independent review (no earlier class9-ch01 review file existed). Method: all 120 questions read (6 concepts x 20); every key recomputed in python or by hand BEFORE reading the key (distances, midpoints, reflections, quadrant signs, all multi_statement / assertion_reason / match verdicts); facts and scope checked against `content/extracted/iemh101/pages/001-015` and the chapter's `scope_in` / `scope_out` (`content/authoring/class9/ch01.json`). Item numbers are `concept.position`.

## Result: 0 HIGH, 5 MEDIUM, 9 LOW. Verdict: PASS (apply the MEDIUM fixes in the next fix pass; none blocks loading)

Keys: all 120 recomputed, all correct. No scope_out violation (no line equations, section formula in ratio m:n, 3-D, area of a triangle from coordinates, rotation or translation). No positional option references. History facts (Sindhu-Sarasvati 10 m streets, Descartes 1637, Brahmagupta c. 628 CE, Aryabhata c. 499 CE) match pages 001-002. The 1.4 distractors are deliberate mis-attributions of real book facts, which is acceptable. Multi_statement keys vary (1&3, 2&3, 1&2, 1 only, 3 only, all). AR outcomes are mixed. Match keys are not the identity pairing.

## MEDIUM

- 4.18(c) near-tie: S(-4,-4), T(-1,0), U(5,9). True values ST + TU = 15.8167 and SU = 15.8114 (gap 0.0053). The stem says "decimals to two places", which gives 15.82 vs 15.81, a gap of 0.01 that a student can reasonably call "equal within rounding" and conclude "collinear". The key "not on one line" holds only by exact comparison (squaring / surds), so a second defensible answer exists. Fix: ask the student to decide with exact surds (e.g. compare (ST+TU)^2 with SU^2, or show TU + ST is irrational vs SU), or choose a clearly non-collinear triple (gap > 0.5).
- Claim-check verdicts are all "No": 1.14, 2.14, 3.14, 4.14, 5.14, 6.14 (Dev, Anand, Ritu, Kabir, Sana, Meera). The style rule is about half No, a quarter Yes, a quarter partly right. Teaches "claim means disagree". Fix: make two of them "partly right" (e.g. 3.14 Ritu has the right idea |x2-x1| but the wrong arithmetic) and one fully correct (e.g. 5.14 where Sana is right about the y-axis case).
- Repetition of two ideas:
  (a) (x, y) versus (y, x): 2.5 (swapped distances), 2.20 (swapped app entries), 3.3 (p with swap), 3.6, 3.7 S3, 3.12 and 3.19 (4,3)/(3,4) crossings, about 7 items. 3.12 and 3.19(a) are the book's own exercise 14 (a),(b) with the same numbers. Keep 3.6 and 2.20; recast the rest.
  (b) Door width on an axis, 3.5 / 3.10 / 3.20, with the same 3.5 ft figure and the same 3 ft wheelchair need in 3.10 and 3.20; this is the book's Exercise Set 1.1 (iii)-(iv) (p. 5). Keep 3.20 and change 3.5 and 3.10 to another axis-distance setting.
  Also the 5-12-13 triple appears in 4.1, 4.8, 4.12 and 6.20(a).
- Case-study trade-offs that the stem settles (strawman decisions): 2.19(d) the stem already says the passage runs along the y-axis, so (0,-5) obviously blocks it; 3.20(d) the stem says the side door needs no ramp, so widening it is obvious; 1.19(d) the "80 m race" is not a rival to a 100 m race, so the full race after shifting the stall wins. 6.20(d), 5.19(d) and 4.20(d) are better (4.20(d) is settled by the 7 m limit, which is fine because it is a computed constraint). Good ones: 1.20(d), 3.19(d) (tie on total, 1000 m vs 800 m split), 4.19(d), 6.19(d), 5.20(d). Fix the three by making the data, not the stem, carry the answer (e.g. 2.19: do not say the passage is blocked; give the passage width and ask whether (0,-5) leaves room).
- Easy-in-disguise cluster of 1-mark items where one lookup finishes the task and the Hard label is a stretch: 1.1 (down the vertical axis), 1.2 (negative x is left), 2.2 (distance from x-axis is |y| = 9), 5.2, 5.4 ((0,6) in the y-axis), 5.6, 6.2 and 3.5. These are the "application-level in context" the style allows, so each is only LOW alone, but eight of them together lower the real difficulty of concepts 1 and 5. Give 1.2 / 2.2 / 5.2 / 5.4 a second move (for example 5.4: a point on the y-axis and the image of its x-axis reflection, both asked; 2.2: a point given as distance from each axis plus a quadrant clue).

## LOW

- 4.17(c) says "by the converse of the theorem": the converse of the Baudhayana-Pythagoras theorem is not stated in this chapter (p. 8-11, 15). Say "if the squares of two sides add to the square of the third, the angle between them is a right angle" in the stem, or drop the word "converse".
- 2.17(b) asks to "name the side that is parallel to an axis": LM and MN are each parallel to an axis (one to each), so the singular is ambiguous (this mirrors the book's exercise 3 (ii), where the answer is "any one"). Ask for "one side parallel to the x-axis and one parallel to the y-axis".
- 2.11 repeats the book's end-of-chapter exercise 2 (Point W, x = -5, quadrants of H) word for word; 1.15 is exercise 5 and 2.17 is exercise 3 (RAMP) with new labels. In scope (starred and end-of-chapter exercises are IN) but not fresh DPS-style items; rewrite 2.11 with a new setting.
- 2.7 assertion-reason: R (-2, 7 in Quadrant II) is true and unrelated to A, a padding case of "true, not the explanation". Replace R with a real sign rule (e.g. "Quadrant IV points have positive x and negative y"), which would then explain A and change the key to "R explains".
- 1.10(b) assumes east is the positive x direction; the stem never says so. Add "with east and north as the positive directions" or accept either orientation in the key.
- 1.4 key is the longest option (the only MCQ in the chapter where it is the sole longest); the other three are one-clause slips. Lengthen the distractors a little.
- 4.8 and 6.8 have the identical match key (1-c, 2-d, 3-a, 4-b) in option position A. Reorder one of the Column II lists.
- 4.11 and 4.2 are single applications of the distance formula on 3-4-5 / 8-15-17 numbers, near-copies of the book's worked examples (Fig. 1.9 style). Lowest-value 2-mark item is 4.11.
- 3.12(a) ("how many crossings can be named (4, 3)": exactly one) is a one-line fact for 2 marks; merge into 3.19 or raise to the "same name, different crossing" argument only.

## Concept-by-concept notes (keys all correct)

- C9M-1.1: 1.7 S2 false by design; 1.19 (30 m, 45 m, 80 m, 155 m) and 1.20 (200 vs 195, longest 100 vs 75) recomputed. 1.13 height claim matches p. 8 ("the height of the table"). 1.17 centre-origin corners (+-12, +-7.5) correct.
- C9M-1.2: 2.5 answer (-8,-3), 2.8 key d b c a, 2.13 (4,5), 2.20 swap logic recomputed (only D unchanged). 2.19 Physics at (5,4).
- C9M-1.3: 3.3 p = 3 (gives (5,5)); 3.4 k = 3; 3.17 perimeter 21 units = 210 cm; 3.19 totals tie at 2000 m with 5/6 and 5/4 block split recomputed.
- C9M-1.4: 4.5 sqrt(65); 4.6 "1 only"; 4.7 A false (distance 5, not 7); 4.15 sides 3, 4, 5; 4.17 sides 5, 5, sqrt50; 4.19 Route X 29.42 km vs Route Y 31 km, B reached at 15 km on both; 4.20 areas 18 and 32 m^2, spreads 6 and 8.
- C9M-1.5: 5.7 "3 only"; 5.8 A true R false; 5.10 sqrt208; 5.12 x-axis; 5.19 border 22.8 ft, Shop X about Rs 4,105 vs Shop Y Rs 4,000; 5.20 12 km ring, Rs 84 lakh + Rs 6 lakh = Rs 90 lakh exactly.
- C9M-1.6: 6.2 x + y = 5; 6.10 P (1,-1), Q (5,-4); 6.17 A (-2,6), B (4,-2), C (8,4); 6.18 centre distance sqrt(121700) = 348.9; 6.19 M (2,-1), 854 m; 6.20 H and B on the edge (13), T 13.45, S 11.66.

## Counts

Read 120. HIGH 0, MEDIUM 5, LOW 9. Verdict: pass.
