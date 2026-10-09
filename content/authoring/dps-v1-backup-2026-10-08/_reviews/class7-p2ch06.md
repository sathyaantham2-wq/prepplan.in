# Review: Class 7 Maths Part II ch 6 "Constructions and Tilings" (content/authoring/dps/class7/p2ch06.json)

Read: all 150 questions (7 concepts, 21-22 each), every key recomputed. Tiling and counting claims brute-forced in Python
(domino-tiling search on every grid/region used, colour counts, angle sums, costs, times). Book text (gegp206 pages 001-028) read in full.

## Verified correct by computation (no action)
5x7, 9x11, 7x9 not tileable; 4x6, 4x7, 6x5, 8x8, 6x7, 5x8, 8x10 tileable; 5x3 minus (3,2) not tileable, 5x3 minus corner tileable,
5x3 minus any "minority colour" square not tileable; 4x4 minus opposite corners not tileable (6 vs 8); 6x9 minus (1,1),(3,3) not tileable (25 v 27);
6x9 minus (1,1),(6,9) IS tileable (26 v 26), so 6.6 case study (c)/(d) is sound. Angle sums (330, 280, 320, 300, 420, 360 combos) all correct.
Costs 12000 / 10800, 1360 / 1445, 720 cuts = 60 min, 480 = 40 min, 90 cells all correct. No wrong key found.

## HIGH (1)

1. C7M-6.5 [20] case study, "courtyard is paved with hexagonal tiles ... edging for 250 tiles ... tiles of side 9 cm instead. Should it?"
   Key says 9 cm tile fits the budget (250 x 43.20 = 10,800). That holds only if 250 tiles are still used. A 9 cm hexagon covers 0.81 of the area of a
   10 cm one, so the same courtyard needs about 309 tiles = about Rs 13,350, over the Rs 11,000 budget. A second defensible answer ("No, more tiles needed")
   makes the decision part ambiguous. Smallest fix: state "the courtyard needs 250 tiles of side 10 cm; with side 9 cm the school would still lay 250 tiles and
   accept a smaller floor", or drop the size comparison and compare two prices of edging strip.

## MEDIUM

2. All 7 claim-checks (6.1 Anil, 6.2 Priya, 6.3 Arjun, 6.4 Ritu, 6.5 Rohan, 6.6 Kiran, 6.7 Zoya) are keyed "No". Anti-template rule: not all should end "No". Fix: turn at
   least two into correct claims (suggest 6.2 Priya becomes "arcs of one pair need equal radii, but the pairs may differ" -> Yes; 6.6 Kiran becomes a corner pair of opposite colours -> Yes).
3. Case-study decisions are forced or strawman in most concepts. The last part (d) is settled by the stem or by one comparison: 6.1[20] ("only on the path": Imran's spot is stated "off the path"),
   6.2[19] (30 vs 45 cm string, 40 cm half-length), 6.2[20] (5 m rope for 6 m gap), 6.3[20] (36 min > 30), 6.3[21] (friend suggests 5.5 cm; obvious No), 6.4[19]
   (redo the one that is wrong), 6.4[20] (bridge must be 90 degrees), 6.5[21] (exact 40 degrees vs 45). Genuine trade-offs exist only in 6.1[19], 6.6[20], 6.7[21] and partly 6.7[20].
   Fix: give each a real competing consideration (cost vs look, time vs accuracy) as 6.6[20] does.
4. Part (a) of several case studies is printed or implied in the stem (free mark): 6.2[19](a) (40 each side -> 80), 6.3[21](a),(b) (arc radius 5 cm stated, ask AB, AC, XZ, XY),
   6.4[19](a) (copy 70 degrees -> 70), 6.6[20](b) (stem says one square cannot be covered), 6.1[20](a) (10 m apart, "halfway" -> 5 m). 6.7[21](a)-(c) are plain multiplication
   from the stem and need no chapter idea at all. Fix: make (a) a chapter fact the stem does not give.
5. C7M-6.4 [8] assertion-reason keyed "true, R does not explain A": A = line from copied corresponding angle is parallel; R = angle copied by isosceles triangle with SSS.
   Defensible reading: R explains why the two angles are equal, hence A. Second defensible option. Fix: change R to a true unrelated fact (e.g. a transversal l is any line through A and B) or make R the missing link "corresponding angles equal => parallel" and key "explains".
6. C7M-6.1 [7] AR: "In the figure with AX = AY = BX = BY, the angles XAO and YAO are equal." No figure can be printed and O is never defined (also 6.1 [11], [17](d) use O undefined).
   Fix: say "AB meets XY at O" in each stem.
7. C7M-6.1 [18] key (c)-(d): "Infinitely many, one for each choice of a pair of centres" is imprecise. A symmetric eye needs AX = BX, so shapes are one per radius, not per pair of centres; part (c) key is circular. Fix: (d) "one for each common radius greater than 4 cm"; reword (c) key.
8. C7M-6.3 [3] and [11] "8 supporting lines / eight equally spaced lines through a point -> 45 degrees". Literal full lines would give 22.5. The book's figure has 4 lines (8 rays). Fix: say "8 rays" or "4 lines". Same for the "16-petalled lines" in [19].
9. Repetition inside a concept, one idea tested 4-6 times (violates "do not repeat the same question"):
   - 6.1: P,Q on opposite sides gives perpendicular bisector ([5] and [10], both "Rohan marks P"); AOX/AOY SAS-via-ABX/ABY in [7], [11], [17]; "one bisector only" in [2], [16], [18]b, [19]b.
   - 6.2: "upper and lower radii may differ" in [4], [7], [9]b, [14], [15]; "radius > half XY" in [5], [12], [16], [17], [19]; rope in [3], [13], [18], [20].
   - 6.3: bisector SSS proof in [1], [8], [10], [18]; "OA = OB needed" in [4], [7]S1, [15]; 22.5 in [6], [12], [16], [19], [20].
   - 6.4: perpendicular-from-P construction/midpoint in [2], [3], [5], [10], [12], [18], [20]; unequal radii copy in [4] and [19] (Rahul/Rahim).
   - 6.5: gap-angle arithmetic in [4], [10], [21] (three near-identical items); hexagon centre = side in [5], [13], [18], [20].
   - 6.6: 5x3 minus centre in [7]S3, [16], [18]. 6.7: "number of polygons at a corner" in [1], [2], [10], [18]; Plan "square + hexagon + 2 triangles" is the same plan in [19](c) and [20](c).
   Fix: cut to one item per idea; replace with new shapes (e.g. a 3 x 4 with two squares removed, 12 and 30 degree angles, parallel through a point on the other side).
10. Cross-concept near-duplicates: 6.1 [5] and 6.2 [6] (final answer "its perpendicular bisector"); 6.1 [13] and 6.4 [12] (same equal/unequal distance idea).
11. Textbook examples reused almost verbatim (needs one more raise of level): 6.6 [5] (8 white, 6 black), [10] (5x7 = 35 squares), [1]-[2] (4x6, 4x7, 5x7); 6.3 [3] and [11] (8 petals, 360/8 = 45); 6.2 [10] (the book's three steps); 6.5 [13] (4 cm hexagon) and [17] (5 cm hexagon); 6.7 [3], [12], [14] (Escher 1898-1972, bees' eggs/larvae/pupae).
    The Escher and bee-fact items (6.7 [3], [12], [14]) are pure trivia recall; replace one with a tiling-reasoning item.
12. Multi-part 5-mark items are scaffolds of the book's own argument, not reasoning: 6.1 [17], 6.2 [17], [18], 6.3 [18], 6.4 [17], [18], 6.5 [18], 6.6 [17], 6.7 [18]. Each (a)-(e) just walks the book's steps. Several are tagged Analyse/Hardest.
    The 5-mark 6.5 [19] and 6.7 [19] are 5 arithmetic additions. Bloom labels are inflated (Evaluate on arithmetic case studies). Fix: have one part ask "find the error / compare two methods / which fails and why".
13. C7M-6.2 [8] AR: R ("Sulba-Sutras are texts on fire altars") has no mathematical link to A; the answer is guessable by irrelevance. Section 11: R must be a real fact about the topic. Fix: R = "Any point equidistant from X and Y lies on the perpendicular bisector" with a key of explains, or keep a related-but-insufficient R.
14. C7M-6.3 [5] "arcs 4 cm vs 5 cm ... triangles are not congruent, so the angles differ": non-congruence does not by itself prove unequal angles. Contrast 6.4 [4] ("may differ"). Make both say "need not be equal".
15. C7M-6.6 [2] "Which of these grids cannot be tiled" lacks "rev": true (the only unmarked genuine reversal).
16. Scope: C7M-6.7 vertex-sum items ([5], [9] option D, [11], [17], [19], [20]) rely on "polygons combine to tile if angles add to 360". The book states only that the plane "can also be tiled using more than one shape" (p.161); no vertex counts or combinations. The structure file lists it IN, but it is beyond the book's text. Safe only as "fits round a point" (necessary condition). 6.7 [20] "Plan Y ... at every corner" and "combinations tile" imply sufficiency; 3.3.6.6 sums to 360 yet does not extend. Fix: word as "a corner that can be filled", not "tiles".
    No scope_out violation otherwise: regular pentagon appears only as a distractor in 6.7 [0] (replace with "regular octagon" or similar and keep out of scope_out); no tangram, optical illusion, or 65.5 degrees. 22.5 / 16-petal items are an extension of "bisect 45" (book Fig it Out Q4 asks "other angles by bisection") and are acceptable.

## LOW

17. Tags: "reverse" is put on construction descriptions (6.1 [15] shows AX = AY, 6.3 [16], 6.4 [15], 6.5 [17]); only 6.6 [16], 6.7 [17] and 6.2 [15] are true reverse items. 6.1 [15] is a straight proof.
18. Same slot shape in all 7 concepts: 1 MS + 1 AR + 7 MCQ (2-3 tagged scenario) + 8 SA + 4 LA (1 claim, 1 show-impossible, 1 reverse, 2 case studies), identical order. Case-study stems all end "(d) which ... should ... and why?". Vary the number and position of parts and the final-part form.
19. Weak distractors that contradict the stem or invent a rule: 6.4 [5] option "at P itself, which lies on the bank" (P is off the bank); 6.6 [3] "each tile has an odd centre"; 6.6 [4] "divisible by 3"; 6.2 [1] and [5] odd options; 6.7 [3] "Kepler" is not in the chapter (use a book term).
20. 6.5 [11] stem garbled: "cutting the arc from A at B" -> "the arc from A cuts AX at B". 6.4 [17] key uses labels C, D, E, F that the stem never defines.
21. Multi-statement uses 3 statements throughout. The Maths convention in QUESTION_STANDARD section 3 is 2 (I, II); section 10 asks for 3 for the DPS bank. Note only; consistent inside the file. False statements are well spread (position 1, 2, 3, two-false, all true) and keys vary (1 and 3; 2 and 3; 2 only; 1 and 2; all three; 1 only; 3 only).
22. Names: Rohan x4, Rahul x4, Anita x3, Priya x3; mostly male-North Indian; add a wider spread.

## Per-concept verdict
- C7M-6.1: keys sound; weakest: undefined O/figure (6), imprecise [18] key (7), forced case study [20], heavy repetition of the SAS/SSS argument.
- C7M-6.2: keys sound; heavy repetition (equal radii, radius > half), irrelevant AR reason, two forced case studies.
- C7M-6.3: keys sound; lines-vs-rays wording, 22.5 overused, strawman case [21], "angles differ" overclaim.
- C7M-6.4: keys sound; AR [8] arguable, two forced decisions, perpendicular-from-P idea repeated 7 times.
- C7M-6.5: one HIGH (case study [20]); gap-sum triplication; strawman case [21].
- C7M-6.6: best concept; all counting verified; case studies [19] and [20] are good; missing rev on [2]; 5x3 centre repeated.
- C7M-6.7: all keys right; trivia items, vertex-combination scope, repeated Plan Z; case study [21] is the best trade-off item in the chapter.

## Mix and templating
Levels: R/U 36.7%, A/E/C 35.3% (meets 60% and 15% limits), but labels inflated (see 12). Type spread complete per concept; match items in 6.1, 6.3, 6.5, 6.7 (4 of 7 concepts, meets one per two). Correct MCQ option strictly longest in only 5 of 48 (fine).
AR keys: 2 explains, 3 true-not-explaining, 1 R false, 1 A false (good mix). Verdict on templating: slot structure and the "(a)..(e) walk-through" and "(d) which should choose" frames are templated across concepts; sentence content is mostly original but repeated within concepts.

## Overall
No wrong key except the ambiguous 6.5 [20]. The bank is accurate but below the DPS standard in reasoning depth: many items repeat one idea, case-study decisions are forced, and all claim-checks are "No". Needs a revision pass on items 1-6, 9, 12 before loading.

Count read: 150 of 150 (no sampling).
