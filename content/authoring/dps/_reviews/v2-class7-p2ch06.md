# Review v2: Class 7 Maths Part II ch 6 "Constructions and Tilings" (content/authoring/dps/class7/p2ch06.json)

Read all 150 questions (7 concepts; 21/21/22/21/22/21/22). Compared with the backup (dps-v1-backup-2026-10-08): **130 of 150 question stems are text-identical to the backup; only 20 are new** (6.1: 5, 6.2: 2, 6.3: 2, 6.4: 3, 6.5: 4, 6.6: 2, 6.7: 2). So the rewrite is a thin overlay (fill_blank, true_false, match and a few scenario MCQs added) on the old pack. All the older problems from content/authoring/dps/_reviews/class7-p2ch06.md that touch unchanged items are still there unless noted below.
Method: each concept dumped, answer decided before the key, numbers recomputed in python, book pages gegp206 001-028 checked.

## Concept notes (appended as reviewed)

### C7M-6.1
- HIGH [8] (NEW match): stem fixes XY = 10 cm and AB meets XY at O, so OX = OY = 5 cm. Row 4 then says "length OY, if OX = (2t + 1) cm and t = 3", key 7 cm. 2t+1 = 7 contradicts OX = 5 (t would be 2). Row 1 (OX = 5, c) and row 4 (OY = 5 really) both fit "5 cm" while the key forces 7. The stem is self-contradictory; a student who reasons from the stem gets OY = 5 for row 4. Fix: make row 4 independent, e.g. "length XY, if OX = (2t + 1) cm and t = 3" -> 14 cm (needs a column II value 14 and the other pairs adjusted), or "OX = (2t + 1) cm" with t = 2 -> 5 cm and drop the duplicate.
- MEDIUM [3] (NEW true_false), [12] (NEW) and [14] (claim_check "only line through the midpoint") all test the same single idea (many lines through the midpoint; only the perpendicular one is the bisector). Three items on one idea. Fix: change [12] to a different idea (e.g. a line at 90 degrees to XY but not through the midpoint is not the bisector, with a number to compute).
- MEDIUM [1] (NEW fill_blank): "upper arc AX = AY = 7 cm ... lower arc must have BY = ___": answer 7 copies the stem number. Not application. Fix: make it computed, e.g. the eye's supporting line XY = 8, upper radius 5; "AB passes through the midpoint, which is ___ cm from X" (4), or radius via equation.
- [10] LOW: "R has RX = RY = 3 cm" but XY not given; needs XY <= 6. State XY = 5 cm.
- Order/shape: see template section.

Easy-in-disguise 6.1 (for the EASY LIST): #0 (NEW) equidistant -> perpendicular bisector, numbers are decoration; #1 (NEW) answer copies stem number; #2 "XY has only one perpendicular bisector"; #4 school equidistant from two villages; #5 "how many lines through all four points" (one); #6 three book statements; #9 (a) "what is the supporting line"; #10 two one-line facts; #13 read equal pairs; #17 Hari's proof is the book's own proof walked step by step (recall chain).
Recomputed OK: [11] x = 4, TX = TY = 11; [18] radius > 4; [19] midpoint 6 cm from X, the 10 cm string needed; [20] 3000/7200, 8000/7200, choose S2. [7] AR now defines O and SSS explains the equal angles at A: fine. [19]/[20] last parts are forced by the data (string too short; arithmetic), not real trade-offs (carry-over).

### C7M-6.2
- MEDIUM (repetition): "radius must be more than half XY" is tested in [0] NEW, [2] NEW, [5], [12], [16], [17], [20]a (7 times); "O already lies on the bisector so one pair is enough" in [1], [8], [11], [17]c, [20]b (5 times); "upper and lower radii may differ" in [4], [7], [9]b, [10], [14] (5 times). The 20 new items made this worse, not better. Fix: replace [2] (NEW) and [12] with items on a different idea (e.g. the rope length needed for a given height, or a gap that cannot be done with a given rope).
- MEDIUM [0] NEW true_false: the verdict is True and the "reason" is the book rule restated (radius > OX). No misconception is tested. Fix: make it a False one that rests on a misconception (e.g. radius exactly OX = 4 cm: the arcs touch at O only, so no crossing -> False), keep the True mix elsewhere.
- MEDIUM [18]: parts (c) and (d) "advantage of the rope on the ground / compass on paper" are not in the book (not a deducible chapter fact); unmarkable opinion. Fix: replace with "the rope method needs a rope of at least what length for pegs 6 m apart (more than 6 m); show with a 6 m rope".
- MEDIUM [19]: decision (d) forced (rope P fails the 3 m limit, so "buy the cheapest?" -> No). Not a trade-off. Fix: add a budget cap so cost and height compete, e.g. Q fits the limits but exceeds a Rs 290 budget, so the choice is between Q and a lower seat.
Recomputed OK: [2] radius 5 > 4.5; [12] 4.5 and 5; [19] heights sqrt(4^2-3^2)=2.65, 4, 5.20; [20] 36 smallest, heights 8.4, 35.7, 71.9; [16] correct.
Easy-in-disguise 6.2: #1 (reason O is on bisector); #2 (NEW) radius greater than half; #3 reason in rope method; #5 radius = half touches; #6 "AB is the perpendicular bisector"; #9 (a) why equal radii; #11 (a)+(b) one-line facts; #12 (a) half of 9, (b) next whole number; #13 rope halves equal.

### C7M-6.3
- No wrong key. Recomputed: [0] NEW 112 -> 56 -> 28 -> DOB = 84 (correct); [1] NEW XOC = 75, XOD = 75 + 20 = 95 (correct, 95 < 150); [12] 63; [14] 65; [19] 40, 20, 10 / 2.5; [20] 16 and 40 minutes, 12 bisections, 5 spare minutes = 2 redos; [21] 5 and 8 cm fit 10 cm room.
- MEDIUM (repetition): "360/8 = 45 for eight petals" in [2], [3], [11], [20]a; "bisect 90 -> 22.5" in [6], [16], [17], [19]; "halve then halve again, find the last angle" in [0] NEW, [12], [14]-style. [0] NEW is the same chain as [12] (84 degrees, OD bisects AOC, find DOB). Fix: turn [0] into a different structure (e.g. angle trisection claim or three bisections reaching a given angle).
- MEDIUM [21]: decision (d) is forced by the stem ("a longer radius ... easier to measure", only 5 and 8 fit, so choose 8). Not a real trade-off. Fix: add a cost (e.g. a larger radius makes the arcs cross at a shallow angle if it is too short relative to OA, or the board edge limits the point C).
- MEDIUM [16] tagged `reverse` but it is "describe the steps to construct 22.5", a straight procedure that repeats [6]. Fix: make it a true reverse (e.g. "write a pair of statements about a diagram whose bisector gives 37.5 degrees") or drop the tag.
- LOW [7] Statement 2 says "as in the book's exercise" - the item must state what it needs. Say "on the far side of O from the angle".
- LOW [19](d)/(e): adding two copied angles (40 + 20) is not taught in the book (it teaches copying one angle); (e) is answered by (d). Keep (d), replace (e) with "name an angle she could not reach by this route".
- LOW [18] 5-mark: pure recall of the book's proof, parts (a)-(e) walk the proof in order.
Easy-in-disguise 6.3: #2 (45 by bisecting 90); #3 (360/8); #6 (bisect 90 twice); #9 match of procedure steps with purposes; #10 (a)(b) SSS facts; #11 (a) 360/8 and (b) bisect 90; #13 "isosceles, same third side"; #14 (a) halve 130; #16 steps for 22.5; #18 the book's proof.

### C7M-6.4
- No wrong key. Recomputed: [13] NEW 2x + 10 = 3x - 20, x = 30, angle 70 (correct); [19] 12 min = 2 copies, 3 correct stripes = Rs 450; [20] height sqrt(13^2 - 5^2) = 12, Rs 12,600 vs Rs 10,400 (correct); [6] 110; [11] 115.
- MEDIUM [0] NEW true_false: verdict True; the "reason" is the 90-degree case of the book rule. No misconception. Fix: make a False one, e.g. "copying the corresponding angle at B with the arc radius different from A's still gives n parallel to m provided the angle is measured with a protractor" or "n through B parallel to m is also parallel to l".
- MEDIUM [13] NEW: same device as 6.1 [11] (two algebraic expressions set equal, x, evaluate). The equation does the work; the geometry fact is one line ("corresponding angles equal"). Acceptable as a 2-mark but it is a template repeat across concepts (6.1 [11], 6.4 [13], plus 6.5's gap items). Fix: use it once per chapter.
- MEDIUM (repetition): "unequal radii in the copy spoil parallelism" in [4], [17], [19]; "copied corresponding angle then straight-line supplement" in [6], [11], [19]a; "PX = PY puts P on the bisector" in [3], [10], [14], [18]. [1] NEW repeats [2] (first step: arc from P must cut l).
- MEDIUM [19]: decision (d) is forced by the data (3 correct stripes in the time, any faulty stripe rejects the cloth). Make the trade-off real, e.g. the client pays Rs 150 per stripe but a stripe left faulty costs only that stripe.
- MEDIUM [15] (Apply, 3 marks, no tag): "write three measurements you would expect to see" is recall of the book's steps; the key is a restated procedure. Fix: give a described faulty drawing and ask which measurement is missing.
Easy-in-disguise 6.4: #0 (NEW) 90 degrees copy; #1 (NEW) arc radius greater than 5 cm; #2 first step of the perpendicular; #3 reason P is on the bisector; #5 B cannot lie on m; #6 straight-line supplement 180 - 70; #9 transversal / equal corresponding angles; #10 construction steps; #11 65 and 115; #12 62 at both, parallel; #15 recall of steps; #17 (a)-(c) read the radii off the stem; #18 compare two constructions (restated steps).

### C7M-6.5
- The earlier HIGH (250 tiles of side 9 cm) is fixed: the stem now says "still 250 tiles". Recomputed [20]: 60 x 0.8 = 48, 250 x 48 = 12,000; 54 x 0.8 = 43.2, x 250 = 10,800 (correct). No wrong key found: [0] NEW 360 - 325 = 35; [1] NEW 12 cm; [4] 330 -> 30; [9] NEW 7, 42, 14, 120 (match key correct); [11] NEW 6-6-4 triangle, angle at A about 38.9 degrees (correct); [19] 360/360/350/420; [21] 320, 40, 5, Rs 360 vs 150.
- MEDIUM (repetition): "gap angle = 360 minus the sum" in [0] NEW, [4], [19](c), [21]; "centre is a side-length from every vertex / diagonal = 2 x side" in [1] NEW, [5], [9] NEW, [13], [18](e), [20](b). The four NEW items [0], [1], [9] and [11]-[1]... all land on ideas already tested 3-6 times. Fix: replace [0] and [1] with items that add reasoning (e.g. gap angle where one piece is given as an expression; the number of 60-degree pieces needed for a straight angle and its link to the diagonal).
- MEDIUM [11] NEW is a good item but (b) "Is CAX equal to 60?" has a reason ("opposite the shorter side") that is beyond the book (side-angle ordering is not in this chapter); keep the reason as "the triangle is not equilateral, so the SSS argument for 60 degrees does not apply" and drop the opposite-side claim.
- MEDIUM [17] tagged `reverse` but it is "write the construction steps", a recall of the book's hexagon build. Fix: true reverse, e.g. "write a situation where six tiles meet at a point with angle expressions".
- MEDIUM [20]: decision (d) is forced by the budget (only 9 cm fits). The honest trade-off is stated in the key but the data decide it. Fix: add a second constraint (e.g. 10 cm tile allowed if the courtyard needs fewer than 200 tiles).
- LOW [19]: five-mark item is five additions/subtractions of angles around a point (4 x 90, 3 x 120, 5 x 70, 7 x 60), no chapter reasoning beyond 360. Labelled Evaluate. Fix: turn (c)-(d) into a design decision (which combination of 60 and 90 degree pieces fills the point).
Easy-in-disguise 6.5: #0 (NEW) 360 minus a sum; #1 (NEW) 2 x side; #2 60 degrees from an equilateral triangle; #3 six 60s make 360; #4 360 minus a sum; #5 centre-to-vertex = side; #9 (NEW) match of four one-line values; #12 120 = 60 + 60, 30 = half 60; #13 perimeter 24 and centre-to-corner 4; #14 hexagon angle = 60 + 60; #17 steps of the book's construction; #19 five angle-sum checks; #18 (c) "two" and (e) 2 x side.

### C7M-6.6
- No wrong key. Recomputed (python chessboard parity and tiling search, as in the older review): [0] NEW 6x6 minus opposite corners = 34 squares, 16 vs 18, False (correct, a real misconception: even count is not enough); [1] NEW 56/2 = 28; [14] Kiran Yes, 7 and 7 and a 7-tile tiling exists; [16] (1,1),(1,3) same colour, 4 vs 6; [18] 8 B / 7 W, centre white, 8 vs 6; [19] (1,1),(3,3) black, (6,9) white: 25/27 and 26/26, and Option Q is tileable; [20] 29 squares, 14 full tiles, Rs 1,360 vs 1,445.
- MEDIUM: this concept is mostly parity facts the book states in one line (odd count -> no; equal black and white needed; one even side -> yes). Ten of the 21 items are lookups with a number (see EASY LIST). [1] NEW (7x8 -> 28 tiles) is the weakest new item: tileable-by-even-side then divide by 2. Fix: make [1] "a 6 x 6 grid with one corner removed and then one more square removed: the number of tiles is ___" or ask the count of tiles that fit when a given square is removed from a tileable region.
- MEDIUM [19]: decision (d) has no trade-off ("Option P impossible, so Q"). Fix: add a cost or a pillar position that is equal-count but untileable (e.g. pillars at (1,1) and (2,2)? colours equal check by search) so that equal counts alone are not enough.
- MEDIUM [20]: (a)-(c) are arithmetic from the stem; the decision hedges ("either is acceptable") after a 6 percent cost difference. Fix: add a real constraint (a 3-year wear difference, or a fixed Rs 1,400 budget) that decides it.
- LOW [13]: "give one value of n" - an open answer; a marker must accept any even n. State the accepted set in the key (already "any even n"; fine) and add that n = 1 is not allowed or the answer for (b) is "any odd n".
- LOW [17] 5-mark: five yes/no verdicts and two strategy counts, no reasoning chain; [17](d) and (e) restate [9](b) and [6].
- Repetition: "odd number of squares -> not tileable" in [2], [4], [7]S1, [10], [15], [17]c, [20](b); "count tiles = squares / 2" in [1], [6], [9], [17]; "9 vs 7 unequal -> no" in [3], [5], [11].
Easy-in-disguise 6.6: #1 (NEW) 56/2; #2 which grid has an odd count; #3 equal black and white; #4 99 is odd; #5 9 vs 7; #6 54/2; #9 6x7 yes, 21 tiles; #10 2n is even, 27 odd; #11 10 vs 8; #12 15-1 = 14 and "colouring needed"; #13 pick an even / odd n; #15 63 is odd; #17 verdicts for 8x10, 5x8, 7x9 plus tile counts.

### C7M-6.7
- No wrong key. Recomputed: [0] NEW 360 - (120 + 90 + 90) = 60 -> 1 triangle (correct, a real 3.4.6.4 corner); [1] NEW 2 x 135 = 270 leaves 90, 3 x 135 = 405 overlaps, square fills the gap (correct); [5] 3 triangles; [14] 330, 390; [16] 420; [19] 360/330/330; [20] 360/360/330; [21] 3,600 s = 60 min, 540 cuts = 90 cells, squares 40 min.
- MEDIUM [1] NEW: (i) the correct option is 94 characters against 43/62/80 (longest by 14: a test-wise cue); (ii) a 135 degree corner is the regular octagon, and "octagon plus square tile the plane" is not in this book (the book says only that "a plane can also be tiled using more than one shape", p.161 of the print, file 026). The standard also puts "general proof of which polygons tile" OUT. Fix: use only squares, triangles and hexagons (e.g. corner angle 150 degrees from a dodecagon is also out; use 100 degrees with the existing 6.7 [4]) or give the 135 degrees as a given corner and ask only for the gap and overlap; shorten the correct option to about 60 characters.
- MEDIUM (repetition): "k copies of angle a: k x a vs 360" is tested in [2], [3], [4], [10], [12], [13], [15], [18] (8 items, all one-step); hexagon + triangle fill in [0] NEW, [11], [17], [20]; gap/overlap sums in [14], [16], [19], [20].
- MEDIUM [20]: the stock constraint decides (d) (hexagons scarce -> X); Plan Y's 3.3.6.6 corner is described by its angle sum only, so "Plan Y fills the point" is a necessary condition and not a proof of a tiling. Fix: say "fills the point" in (b) and ask which plan fits both the corner sum and the stock.
- LOW [6] bees: three wrong options are padded; [8] AR is an easy "both true, R does not explain" on the book's one line about hives.
- [21] is a genuine trade-off (90 hexagons in 45 min vs 120 squares in 40 min): keep.
Easy-in-disguise 6.7: #0 (NEW) 360 - 300; #2 3 x 120 = 360; #3 4 x 120 = 480; #4 3 x 100, 4 x 100; #5 two squares leave 180 = 3 triangles; #6 honeycomb idea; #9 match of tiling with copies at a point; #10 four squares / three hexagons; #11 360 - 240 and two triangles; #12 120 and 3 x 120; #13 3 x 100 and 4 x 100; #14 3 x 90 + 60 and +60 more; #18 angle and count for each polygon; #19 three angle sums.

## Template checks (counts)
- Slot order is identical in all seven concepts: 1-2 type-items (true_false / fill_blank / match) then 6 MCQs, then multi_statement at index 7 in six of seven (index 6 in 6.1), assertion_reason at 8, 8 short answers (2 x 2-mark claim position fixed: claim_check, then reverse/show_impossible, always 3-mark triple), then 2 x 5-mark and 2 x 4-mark case studies in that fixed order. Signatures: 6.1 MFMSMMXRTSSSSSSSSLLLL, 6.2 SMMMMMMXRSSSSSSSSLLLL, 6.3 FMMMMMMXRTSSSSSSSSLLLL, 6.4 = 6.2, 6.5 = 6.3, 6.6 SFMMMMMXRSSSSSSSSLLLL, 6.7 = 6.3. The new types were dropped into index 0-1 and 9 as a visible patch. MEDIUM: shuffle at least some of them (move a case study earlier, put a true_false in the middle).
- 130 of 150 stems are word-for-word the backup's; only the new fill_blank (5), true_false (4), match (3 new of 4), and 8 new MCQ/SA stems are new. The changes did not touch any of the five-mark and four-mark items.
- Claim-check verdicts (7): No 4 (6.1, 6.3, 6.4, 6.5), Yes 3 (6.2, 6.6, 6.7), "partly right" 0. Acceptable (the older all-No flaw is fixed); add one "partly right" (LOW).
- multi_statement keys (7): "1 and 3 only", "2 and 3 only", "2 only", "1 and 2 only", "1, 2 and 3", "1 only", "3 only": well spread. Pass.
- assertion_reason (7): explains x4 (6.1, 6.2, 6.4, 6.5), A true R false x1 (6.3), A false R true x1 (6.6), true-not-explain x1 (6.7). OK, but explains is 4/7; lean more on the other outcomes (LOW).
- true_false (4): False x2 (6.1 [3], 6.6 [0]), True x2 (6.2 [0], 6.4 [0]): 50% True, in the 25-75% band. But the two True items carry no misconception (they restate the book rule) so they are really easy 2-mark items. Chapter minimums met: match 4, fill_blank 5, true_false 4 (each >= 4).
- Correct MCQ option is strictly longest in 8 of 39 MCQs (21%); not systematic. But 6.4 [1] and 6.7 [1] (both NEW) are longest by 20 and 14 characters.
- Bloom: Apply 54, Analyse 35, Understand 32 (21%), Evaluate 24, Create 5; Analyse/Evaluate/Create = 64 (43%). Thresholds pass, but the labels are generous: many "Analyse" items are two-line recalls (see EASY LIST) and the "Evaluate" case studies are mostly arithmetic.
- No option is named by position anywhere (searched). Pass.
- Repeated ideas: see per-concept lists; the worst are 6.2 "radius > half XY" (7 items), 6.7 "k x angle = 360" (8 items), 6.5 gap-angle arithmetic and centre = side (4 and 6 items).
- Scope: no scope_out line violated except the borderline 6.7 [1] (octagon-type 135 degree corner, "which polygons tile") and the carried-over 6.7 combination sufficiency wording. Maps/constructions excluded properly; construction items are written as steps in words.
- Figures: no `figure`-tagged item exists and none was needed (6.1 [7] now defines O). Pass.

## Counts and verdicts per concept
- C7M-6.1: 21 read, 1 HIGH (match [8] contradictory stem), 3 MEDIUM, 10 easy items. Rework the new items.
- C7M-6.2: 21 read, 0 HIGH, 4 MEDIUM, 9 easy.
- C7M-6.3: 22 read, 0 HIGH, 4 MEDIUM, 10 easy.
- C7M-6.4: 21 read, 0 HIGH, 5 MEDIUM, 13 easy.
- C7M-6.5: 22 read, 0 HIGH, 5 MEDIUM, 12 easy.
- C7M-6.6: 21 read, 0 HIGH, 3 MEDIUM, 13 easy.
- C7M-6.7: 22 read, 0 HIGH, 3 MEDIUM, 14 easy.
Totals: 150 read; 1 HIGH; 27 MEDIUM; 12 LOW; 81 easy-in-disguise (54%), of which 10 are among the 20 new items and 71 are unchanged from the backup. Templated: yes (fixed slot order and idea repetition). Overall verdict: REWORK of the easy items (pass after fixes is not enough while 54% of the pack is a one-line book fact). Key arithmetic is sound; the earlier 6.5 HIGH is fixed.

## EASY LIST
Positions are 0-based indexes inside each concept's question array (the order in the file). NEW = added in this rewrite.
C7M-6.1#0: NEW: equidistant points lie on the perpendicular bisector; the 5/8/13 m are decoration
C7M-6.1#1: NEW fill_blank: lower radius = upper radius; answer copies the stem 7
C7M-6.1#2: only one perpendicular bisector (book line)
C7M-6.1#4: school equally far from two villages -> perpendicular bisector
C7M-6.1#5: how many lines through the four points: one
C7M-6.1#6: three book statements (MS)
C7M-6.1#9: (a) name the supporting line, (b) equal radii give symmetry
C7M-6.1#10: (a) PQ is the bisector, (b) R on it, both one-line facts
C7M-6.1#13: read off which pairs are equal
C7M-6.1#17: the book proof walked step by step (SSS, SAS, 90)
C7M-6.2#1: one pair of arcs suffices since O is on the bisector
C7M-6.2#2: NEW: radius must exceed 4.5 (half of 9)
C7M-6.2#3: rope halves are equal and stretched
C7M-6.2#5: radius = half touches only at midpoint
C7M-6.2#6: rope midpoint line is the perpendicular bisector
C7M-6.2#9: why equal radii within a pair; lower pair may differ
C7M-6.2#11: (a)(b) O is the midpoint; second pair not needed
C7M-6.2#12: half of 9 is 4.5; next whole number is 5
C7M-6.2#13: rope folded in half; B found the same way
C7M-6.3#2: 45 degrees by bisecting 90
C7M-6.3#3: 360/8 = 45
C7M-6.3#6: bisect 90 twice = 22.5
C7M-6.3#9: match of procedure steps to purposes
C7M-6.3#10: name SSS and the three equal pairs
C7M-6.3#11: (a) 360/8, (b) bisect 90
C7M-6.3#13: ABC isosceles; copy third side for SSS
C7M-6.3#14: (a) half of 130, (b) still SSS
C7M-6.3#16: steps for 22.5 (tagged reverse but a plain procedure)
C7M-6.3#18: the book proof of bisection in five labelled steps
C7M-6.4#0: NEW true_false True: copy 90 gives parallel and perpendicular
C7M-6.4#1: NEW: radius must exceed 5 cm
C7M-6.4#2: first step of the perpendicular construction
C7M-6.4#3: P is equidistant so it is on the bisector
C7M-6.4#5: B cannot lie on m
C7M-6.4#6: 180 - 70
C7M-6.4#9: transversal is l; corresponding angles equal
C7M-6.4#10: steps of the perpendicular construction
C7M-6.4#11: 65 and 115
C7M-6.4#12: 62 at both points, parallel
C7M-6.4#15: list of marks expected from the book method
C7M-6.4#17: (a)-(c) the wrong radius is read off the stem
C7M-6.4#18: compare two constructions by restating their steps
C7M-6.5#0: NEW fill_blank: 360 minus 325
C7M-6.5#1: NEW: longest cut = 2 x side
C7M-6.5#2: 60 degrees from an equilateral triangle
C7M-6.5#3: six 60 degree angles make 360
C7M-6.5#4: 360 minus a five-term sum
C7M-6.5#5: centre to vertex = side
C7M-6.5#9: NEW match: OA = 7, perimeter 42, AD = 14, 120 degrees
C7M-6.5#12: 60 + 60 = 120; half of 60
C7M-6.5#13: perimeter 24; centre 4 cm from corner
C7M-6.5#14: hexagon angle = 60 + 60
C7M-6.5#17: construction steps of the book hexagon (tagged reverse)
C7M-6.5#19: five angle-sum checks (4x90, 3x120, 5x70, 7x60)
C7M-6.6#1: NEW fill_blank: 56/2 = 28
C7M-6.6#2: pick the grid with an odd count
C7M-6.6#3: equal numbers of black and white squares
C7M-6.6#4: 99 is odd
C7M-6.6#5: 9 white vs 7 black
C7M-6.6#6: 54/2 = 27 tiles
C7M-6.6#9: 6x7 yes, 21 tiles
C7M-6.6#10: 27 is odd, n tiles cover 2n
C7M-6.6#11: 10 vs 8 -> no
C7M-6.6#12: 15 - 1 = 14; colouring needed
C7M-6.6#13: choose an even / an odd n
C7M-6.6#15: 63 is odd
C7M-6.6#17: verdicts on 8x10, 5x8, 7x9 and two tile counts
C7M-6.7#0: NEW fill_blank: 360 - 300 = 60 -> 1 triangle
C7M-6.7#2: 3 x 120 = 360
C7M-6.7#3: 4 x 120 = 480, overlap 120
C7M-6.7#4: 3 x 100 and 4 x 100 vs 360
C7M-6.7#5: two squares leave 180 = 3 triangles
C7M-6.7#6: honeycomb -> hexagons tile, three at a corner
C7M-6.7#9: match tilings with number of copies at a point
C7M-6.7#10: four squares, three hexagons
C7M-6.7#11: 360 - 240 = 120, two triangles
C7M-6.7#12: 120 degrees, 3 x 120 = 360
C7M-6.7#13: 3 x 100 and 4 x 100 again
C7M-6.7#14: 3 x 90 + 60 = 330, +60 = 390
C7M-6.7#18: angle and count for each of three polygons
C7M-6.7#19: three angle sums

EASY LIST total: 81
