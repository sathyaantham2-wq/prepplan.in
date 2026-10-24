# Review: class8 p2ch04 (Exploring Some Geometric Themes), v2

Pack: content/authoring/dps/class8/p2ch04.json. 128 questions read, every one, no sampling (21+21+22+21+22+21).
Note: the six concepts in the file are C8M-4.1 Sierpinski carpet/gasket, 4.2 Koch snowflake and fractals in art, 4.3 solids and nets, 4.4 cylinder/cone nets and cuboid shortest paths, 4.5 projections and views, 4.6 isometric. (The brief listed only the solids half of the chapter.)

Checkers (scratch: /Users/satyanarayanareddy/claude projects /Prepplan/scratchpad/review-class8-p2ch04/chk.py and geo.py):
- Tetracubes enumerated in 3D by code: 8 shapes if mirror images count as different, 7 if mirror images are the same, 5 planar (a flat L and J turn over in 3D so they are one shape either way). Non-planar: 3 (mirror different) or 2 (mirror same).
- Cube nets: 216 hexominoes folded by simulated rolling; exactly 11 free nets. Opposite faces recomputed.
- Shortest surface paths over a box by full unfolding search (all face sequences, segment must cross each shared edge).
- Views: every cube-grid item brute-forced for min/max cubes and view counts.
- Fractal, Koch, prism/pyramid, isometric counts recomputed arithmetically.

## HIGH
None. All 128 keys confirmed. Specifically:
- 4.6[12] (four-cube shapes, key 3) is CORRECT for the rule as stated. 8 total minus 5 flat = 3 (a tripod plus a left-hand and a right-hand twist). The stem does not restrict the set further. The book says five Tetris shapes (p.29-31), which agrees with the stem's "5 flat". Only the mirror-same reading gives 2, and the stem rules that out.
- Shortest paths: 4.4[0] 13; [6] 15 and squares 225/281/305; [12] 180 (sqrt 13.416); [16] 20 and 25 to 26; [17] 17; [19] Route 2 = 26 cm, also the global minimum over all unfoldings. All match.
- Cube nets: 4.3[4] only one option folds (checked all four); 4.3[10] opposite of 1 is 3; 4.3[21] pairs A-C, B-D, E-F, and moving F below D changes nothing. All match.
- Views: 4.5[5] 7/6/7; [8] and [11] max 11, min 9; [18] 2,3,2 / 3,2,1 / 7 / add 2; [20] min 10, max 12, the arrangement in the key is valid. All match.
- No wrong option equals the key, no duplicate options, o[0] is correct everywhere, no option named by position.

## MEDIUM
1. C8M-4.5[4] fill_blank: "Four identical cubes stand on a 2-by-2 grid ... stacks 3,1 / 2,2". The stacks hold 8 cubes, not 4. The answer 5 is right, but the stem is internally false. Fix: "Eight identical cubes" (or "Cubes stand in four stacks on a 2-by-2 grid").
2. Template, slot order. Every concept is the same rotation of the same slot list. Concepts 4.2, 4.4, 4.5 and 4.6 end with exactly long_answer 5, 5, 4, 4 in the last four positions (4.3 ends 5, 4, 4). Positions 1-6 are mcq / AR-or-MS / short / MS / fill_blank in each concept. Fix: shuffle the slot order per concept and vary where the case studies fall.
3. Repeated ideas inside concepts (the same computation re-asked in different clothes):
   - 4.1: H4 = 585 is reached in [4], [9], [12], [18], [19], [20] (six items). The holes recurrence is tested far more than anything else in 4.1.
   - 4.2: the 192 / 768 sides and 3 / 1 cm perimeter chain appears in [5], [7], [15], [17], [19], [20].
   - 4.3: edges 3n / 2n appear in [1], [7], [8], [13], [14], [19]. The cross-shaped net with opposite faces is [10] and [21] (plus [12](a)).
   - 4.5: the 2x3 grid with front 3,1,2 and side 3,2 is identical in [8] and [11]; the 3x3 views are re-done in [5], [18], [20].
   - 4.6: "3 x (a + b + c) visible segments" appears in [3], [8], [9], [17], [19].
   Fix: replace two or three of each cluster with a distinct idea. Under-used ideas: Sierpinski area; Koch triangles raised; octahedron/dodecahedron facts in 4.3 or 4.4 as reasoning items; projection of a parallelogram as a worked case; isometric drawing with hidden edges.
4. Easy-in-disguise (the answer is a one-line book fact or a direct lookup, whatever the label):
   - 4.2[3] (temple), [12] (Escher), [6] (odd one out, a chessboard); 4.2[8] AR (definition of the step); 4.2[16](a) (3x3x3 = 27).
   - 4.4[7] ("what does the chapter tell her": no net wraps a sphere); 4.3[15](a) (three faces meet at a cube corner).
   - 4.6[1] (cube on a corner gives a regular hexagon); [5] (height axis is vertical); [7] (parallel stays parallel); [13] ("state the two facts"); [16](a) (hexagon angle 120 degrees); 4.5[7] AR.
   - 4.1[15], 4.3[9] and 4.5[10] (match): the values are a plain lookup once the formula is known. 4.1[4] is a one-step recurrence given in the stem.
   - 4.5[17] (views of an L of 4 cubes) is a describe-the-picture item at Apply level.
   Fix: for each, add a twist (a changed rule, a "which is wrong and why", or two steps) or relabel to a mark value that fits.
5. C8M-4.2[18] long_answer, 5 marks. Parts (a) 1904 - 1025, (b) recall of the temple feature, (d) recall of the Fulani pattern and (e) opinion are all low-demand. Only (c) is a computation. The "Justify this statement" frame carries no real argument. Fix: cut to 3 marks, or replace (a), (b) and (d) with a fractal-vs-real-pattern comparison that needs the numbers.
6. MCQ length cue. Over the 30 mcq items the correct option is never strictly the longest, but it is the longest or tied in 13 (43%, against 25% for chance). Items to trim: 4.1[0], 4.3[18], 4.4[3], 4.5[1], 4.6[1]. Lengthen the distractors to the same length.

## LOW
- 4.1[13](b) says the removed middle triangles "none of them touches the outer edge". Each inverted triangle touches the outer edge at its corner (a midpoint of a side). The count of 8 is right. Fix: "no removed triangle shares any length of the outer edge".
- 4.1[1] AR: "gasket has fewer holes than the carpet after Step 1". Both have 1 hole, so A is false as keyed, but A's premise ("removes 1 of 4 vs 1 of 9") sounds like a trap on the wrong word. Acceptable, but "more holes" or "fewer" could be tightened to "different number of".
- 4.3[16]: options 3 and 4 are the same net (one is turned over), so the distractor set is really three ideas. Replace option 4 with a different valid net.
- 4.4[16](c): the straight line on the net against "up 9 then across" is shorter by the triangle inequality, so the decision is a strawman. Fix: offer a competing route that is close in length.
- 4.4[11](b) wording: "goes straight to the shared edge first and then turns towards the laddu along the edge and across the face" is hard to follow. Fix: "goes straight up to the edge, then along the edge, then straight back across the top face".
- 4.4[17](d) uses (a+b)^2 expansion in general letters. This is within Class 8 algebra, but the book never does this; mark the 5 marks as stretch.
- 4.6[12]: add the clause "(a left-handed and a right-handed twist count as two shapes)". It removes any doubt about the mirror-same answer of 2.
- 4.3[11]: the strip-of-four net is described only in words ("pointing up and down in turn"). It is unambiguous, but a two-line coordinate description would be safer if the figure is lost.

## Checks passed
- Figure items (4.3[4], [10], [16], [20], [21]; 4.4[8]; 4.5[4], [5], [18], [20]; 4.6): all fully described in words. No item depends on grid-line slant directions. Isometric items use "height / length / depth axes" and vertical, never "left slant".
- Circle formula: 4.4[1], [3], [5], [18], [20] state "circumference = 2 x 22/7 x radius". 4.4[8] needs only that the arc becomes the rim. No area formula for a circle is used.
- Scope: no surface area or volume of a solid, no limits or infinite sums, no Euler formula, no trigonometry, no icosahedron, and shortest paths only on a cuboid (the cube is a cuboid). Area of the fractal region is asked for in the book (p.3, Q3), so 4.1[5], [8], [14] are in scope.
- Book facts checked: octahedron 11 nets; dodecahedron 43,380; temple 1025 CE; Von Koch 1904; five Tetris shapes; torch/sun shadow equals projection; cartoon hole shape.
- fill_blank (6): all application, one numeric answer. true_false (6: 4.1[5], 4.2[7], 4.3[2], 4.4[4], 4.5[6], 4.6[7]): each has a real misconception and asks for a reason. Verdict mix 3 False, 3 True.
- Claim-check verdicts (7): No x3, Yes x2, Partly x2. Mixed, not templated.
- multi_statement keys (6): 1 and 3 only; 1 only; 2 and 3 only; 1 and 2 only; 1, 2 and 3; 3 only. All six distinct, good spread. They use three statements (the bank-wide house style is two; the owner left this as-is for Class 10, so noted only).
- Assertion-reason keys (6): A false R true x2; both true and R explains x2; A true R false x1; both true but R does not explain x1. Good spread.
- No item at Remember or Easy; no marks/thinking mismatch other than MEDIUM 4-5 above. Case-study step marks equal part counts in every case study read.

## Verdicts per concept
- C8M-4.1: pass after fixes (MEDIUM 2, 3, 4; LOW 13, AR wording).
- C8M-4.2: pass after fixes (MEDIUM 2, 3, 4, 5).
- C8M-4.3: pass after fixes (MEDIUM 2, 3, 4; LOW 3 net options).
- C8M-4.4: pass after fixes (MEDIUM 2, 6; LOW 4.4[11], [16], [17]).
- C8M-4.5: pass after fixes (MEDIUM 1 stem error; 3, 4).
- C8M-4.6: pass after fixes (MEDIUM 3, 4; LOW 12).

## Counts read
128 read. HIGH 0. MEDIUM 6 (items or clusters). LOW 8. Templated: moderately, in slot order and repeated computations; not in keys, option length, verdict mix or AR/MS spread.

Overall verdict: pass after fixes. All keys are right, including the four-cube item. Fix 4.5[4], break the slot order, and trim the repeated and recall items.
