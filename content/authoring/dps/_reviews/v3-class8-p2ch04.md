# Review v3: class8 p2ch04 (Exploring Some Geometric Themes), after one fix pass

Pack: content/authoring/dps/class8/p2ch04.json. 128 questions read, every one (21+21+22+21+22+21). Pre-edit copy diffed; the pack was reshuffled so almost every position moved, so all items were re-read, not only the ~45 changed.
Index convention: concept index c (0 to 5 = C8M-4.1 to 4.6) and item index i in file order, written [c.i]. Example: [3.19] = C8M-4.4 item 19.

Checkers (scratch: /private/tmp/claude-501/-Users-satyanarayanareddy-claude-projects--Prepplan/70c21740-1569-43a7-bbe6-855c6fa89a85/scratchpad/v3-class8-p2ch04/nets.py, views.py, path.py):
- Cube folding by simulated rolling over all 216 hexominoes (every net has perimeter 14); opposite faces of [2.2], [2.11] and both variants, all four [2.13] options, [2.9] block.
- Cube-stack views: brute-force min/max and view counts for [4.2], [4.7], [4.11] (a)-(e), [4.14], [4.18], [4.21].
- Shortest surface path by dense mesh Dijkstra over the box surface for [3.4], [3.5], [3.6], [3.7], [3.10], [3.11], [3.12], [3.18]. All keys reproduced (20, 26 = global minimum, 17, 13, 180, 20, 15, 13).
- Fractal, Koch, prism/pyramid and isometric counts recomputed by arithmetic in my head and cross-checked in code where non-trivial.

## v2 status
- v2 MEDIUM 1 (4.5[4] "four cubes" with 8 cubes in the stacks): FIXED. Now [4.2] "Eight identical cubes", front view 5 (code: front view [3,2]).
- v2 MEDIUM 2 (identical slot rotation): FIXED. Slot sequences now differ per concept, case studies and long answers fall in different places.
- v2 MEDIUM 3 (repeated computations): PARTLY fixed. H4 = 585 now 2 items, the 2x3 grid duplicate is gone, "3(a+b+c)" is down to 3 items. New and remaining clusters: see MEDIUM 5.
- v2 MEDIUM 4 (easy in disguise): PARTLY fixed. See MEDIUM 4 for what remains.
- v2 MEDIUM 5 (4.2[18] low-demand 5-marker): FIXED. Replaced by [1.6], a computed model comparison (still see LOW 3).
- v2 MEDIUM 6 (MCQ length cue): FIXED. Correct option is longest or tied in 5 of 30 (17%), strictly longest in 0.
- v2 LOW 4.1[13](b) wording: fixed ([0.5](b) "shares any length of the outer edge"). AR "fewer holes": fixed ([0.9] "different number"). 4.3[16] duplicate net: fixed (only option 1 of [2.13] folds, checked all four, and the options are four different ideas). 4.4[16](c) strawman: fixed, [3.11] now compares 20 cm with 21 to 22 cm (a 1 cm margin, genuinely close). 4.4[11](b) wording: fixed in [3.7](b). 4.4[17](d) algebra: gone ([3.6](d) uses numbers). 4.6[12] mirror clause: added in [5.4]. 4.3[11] strip net: [2.7](b) now gives coordinates 0 to 12 and 3 to 15.
- The staircase net the lead flagged: [2.2] key "4" is RIGHT (code: opposite pairs 1-4, 2-5, 3-6). Note the v2 review text said "opposite of 1 is 3"; that sentence in v2 was wrong, the pack is right.

## HIGH

1. C8M-4.4 [3.19] assertion_reason. Quote: R "Every path on the surface of a cuboid becomes a path of the same length on its net, and every path on the net becomes a path of the same length on the cuboid." Keyed "Both A and R true, R explains A".
   Problem: R is stated as a universal and is false as written. A path that crosses a cut edge of the net has no matching path on the net, and a line that leaves the net (empty paper) is not a path on the box. The pack's own [3.0] answer says exactly this. A careful student can defend "A true, R false", so the key is not unique.
   Smallest fix: restrict R to the case in A: "When two adjacent faces are laid flat about their shared edge, every path across that edge keeps its length, so a straight segment on the flat picture is a path of the same length on the box."

2. C8M-4.2 [1.2] long_answer, part (e). Quote: "She wants the most detailed pendant. Which starting side should she choose, and how much more wire does it take?" Key: 18 cm, 80 cm more.
   Problem: only 9 cm and 18 cm were ever introduced, and the stem never limits the choice to them. By the stem's own limits any start from 13.5 cm to about 21.0 cm reaches Step 3 (checked: 20 cm gives Step 3, side 0.74 cm, wire 142.2 cm), so a student answering 20 cm (94.2 cm more) is also right. The part has no unique answer.
   Smallest fix: "She can choose a starting side of 9 cm or 18 cm. Which gives the more detailed pendant, and how much more wire does it need?" Keep the key.

## MEDIUM

1. C8M-4.6 [5.8] short_answer (impossible triangle). scope_out: "The 'impossible triangle' (Figure it Out Q4 on p.101) as a testable exercise beyond simple recognition that it cannot be built from real cubes". The item asks the student to show the 3+3+3 axis path closes on paper and ends 3 along, 3 deep, 3 up on the solid, and to explain how the impossible triangle is drawn but not built. That is a derivation beyond recognition. Fix: cut to a recognition-level 2 mark item (which of two drawings can be built) or replace with another isometric idea (hidden edges, counting visible faces of a staircase).

2. C8M-4.5 [4.6](b). Key: the extra cube goes "directly behind any one of the four cubes". A cube glued on the front of any cube also leaves the front-view silhouette unchanged and changes the top view (new square in front). The model answer and the reason ("hidden behind a cube already there") omit this valid answer, so a correct response would be marked down. Fix: "behind or in front of any cube (the silhouette is unchanged, the top view gains a square)", or restate the question as "Give one place...".

3. C8M-4.6 [5.14] mcq. Stem calls it "a 2 x 2 x 2 block of unit cubes" and asks how many cubes it "could be made of". Key 7 or 8 (the one cube at the back, bottom, left is hidden). A student reading "2 x 2 x 2 block" as 8 cubes has a defensible "8 only". Fix: "An isometric drawing shows the top, front and right faces of a solid, each a 2 by 2 grid of unit squares. How many unit cubes could the solid be made of?"

4. Easy or one-step in disguise (answer is a one-line book fact or a single direct lookup, whatever the label). All are labelled Hard.
   - [4.0] torch moved back, shadow shrinks to the projection (book fact), Understand.
   - [4.1] solid with triangle, triangle, square-with-diagonals views: lookup of the pyramid.
   - [4.17] match of cylinder, cube, cone views: standard views, plain lookup.
   - [5.20] solid cube shows 7 corners and 9 edges: book fact.
   - [5.19] cube projected in three positions: square, rectangle, hexagon: book facts in order.
   - [3.0] "why does her line not give a path": one-sentence explanation of the book's own warning.
   - [2.18] hexagonal pyramid, faces at apex and at base corner: direct count.
   - [2.0] octagonal prism 3n, 2n: one formula.
   - [2.12] pyramid with 11 vertices: one step.
   - [4.19] pencil 13 and 5 gives 12: a single triple lookup.
   - [4.2] front view of four stacks: one max per column.
   - [1.17], [1.9], [3.2]: one division or repeated halving.
   Fix: for each, add a twist (a changed rule, "which statement is wrong and why", a second condition), or relabel Apply/Understand. At 1 mark most can stay if a twist is added to the stem.

5. Repeated ideas inside concepts (same computation in new clothes).
   - C8M-4.3: the prism/pyramid counts 3n, 2n, n+1 drive [2.0], [2.12], [2.17], [2.19], [2.20] (5 items); cube-net opposite pairs in [2.2], [2.11], [2.13], [2.9].
   - C8M-4.4: "ant on front face, laddu on top face, unfold, legs sum" is [3.7], [3.11], [3.18] (three items, near identical geometry); cuboid corner-to-corner squares are [3.1], [3.6], [3.10], [3.12] ([3.1] and [3.12] use the same 12 x 4 x 5 box and 225/281/305).
   - C8M-4.5: holes through a wall are [4.8], [4.13], [4.16]; min/max cubes from three views are [4.6], [4.7], [4.11], [4.14], [4.18], [4.21].
   - C8M-4.6: the cube in three positions and its hexagon appear in [5.7], [5.11], [5.13], [5.16], [5.19], [5.20].
   Fix: in each cluster replace two items with an idea not yet used (e.g. 4.4 a cylinder-label cut-out with seam overlap; 4.5 a projection of a parallelogram or a rod onto a wall; 4.6 hidden edges of a staircase, a two-block combination, counting visible faces of a given drawing).

## LOW

1. C8M-4.2 [1.15] "A print inspired by Escher's 'Smaller and Smaller' has rings ... 6 lizards, 32 cm". The data are invented but read as fact about a print. Say "In a model of a lizard-ring design". ([1.1] and [1.6] are correctly framed as models.)
2. C8M-4.6 [5.12](c) "unit segments in the visible outline": the count 27 is of all visible edges (3 x (4+2+3)), not the outline (an outline is the 6 outer sides). Say "visible edges".
3. C8M-4.2 [1.6](e) the justification argues by definition. The numbers (5 levels, Step 5) are almost identical for the temple and the snowflake, so they do not separate the two objects, and the mark scheme accepts a restatement. Acceptable, but weak as an Evaluate argument.
4. C8M-4.5 [4.21] claim_check verdict "Partly right": the premise is right and the conclusion ("always tell exactly") is wrong, so "No" is also defensible. Add to the mark scheme that either reasoned verdict earns the mark, or restate the claim.
5. C8M-4.5 [4.20] uses 3-D coordinates (right, back, up) and an identity on squares. Within Pythagoras and the book's projection idea, but close to scope_out "vector methods for computing projections". Keep the wording to lengths, not coordinates.
6. Reversal items: three in the chapter ([1.20], [3.7], [5.1], plus the "could NOT" flag on [4.16]); concepts C8M-4.1 and C8M-4.3 have none. Meets "one per two concepts", at the floor. v2 had six.
7. C8M-4.1 [0.9] A's reasoning ("1 of 4 versus 1 of 9, so a different number of holes") is a non sequitur; keyed correctly as A false, but a cleaner A would be "The gasket has more holes than the carpet after Step 1".

## Checks passed
- Every key recomputed in code or arithmetic and agrees except as listed in HIGH 1 and 2. Specific confirmations: [0.6] gasket 500 holes at Step 7; [0.12] costs 618/354/462; [0.18] Step 3 and Step 5, Rs 146/242; [1.2] wire limit Step 5 versus bending Step 2; [1.19] 576 and 768; [2.4] perimeters 40 and 52; [2.15] 20 x 24 versus 28 x 24; [3.5] Route 2 = 26 cm and it is the global minimum; [3.9] 9 against 8 labels, 57 sheets; [4.3] 2.4, 1, space more than 2.5; [4.14] 12 and 10 with a unique minimal arrangement; [4.18] 9 to 11; [4.21] 10, then 8 to 12; [5.4] tetracubes 3 (8 minus 5 flat, mirror counted); [5.5] 7, 19, 37, 61.
- Options: correct option at o[0] everywhere, 4 distinct options, no wrong option equal to the key, no option named by position, no "option (b)" text.
- Step marks sum to marks in every item with steps (0 mismatches).
- Figure items ([2.2], [2.8], [2.11], [2.13], [2.15], [3.8], [4.2], [4.11], [4.14], [4.21], [5.x] drawings) are fully described in words. Slant directions are fixed in the stem wherever they matter ([5.8]); other isometric items use vertical or "axes".
- Made-up data: tower models [1.1] and [1.6], jeweller, panel and school items are presented as models or scenarios (see LOW 1 for the lizard rings).
- Types: fill_blank 6, all application with a number answer; true_false 6 (3 False, 3 True), each with a real misconception and a reason requested; claim_check 7 (Yes 2, Partly 2, No 3); show_impossible 4.
- Template counts: multi_statement keys 1 and 3 only; 1 only; 2 and 3 only; 1 and 2 only; 1, 2 and 3; 3 only (six distinct, three-statement is the DPS standard). AR keys: A false R true x2, both true and explains x2, A true R false x1, both true not explains x1. Correct-longest MCQ 5 of 30. Slot order differs per concept.
- Scope: no surface area or volume, no limits or infinite sums, no Euler's formula, no icosahedron, shortest paths only on a cuboid; octahedron 11 nets and dodecahedron 43,380 used as book facts, not derived; 5.4 matches the book's own question about extra ways of gluing four cubes (p.101). One scope_out line violated: MEDIUM 1.
- Recall level: no Remember or Easy items; levels are Understand 5, Apply 26, Analyse 67, Evaluate 21, Create 6 (approx.), all Hard or Hardest. See MEDIUM 4 for items whose real demand is below their label.

## Verdicts per concept
- C8M-4.1: pass after fixes ([1.2]-type issue none; LOW 7; MEDIUM 4 items [0.0] mild).
- C8M-4.2: not load-ready until HIGH 2 ([1.2](e)) is fixed; LOW 1, 3.
- C8M-4.3: pass after fixes (MEDIUM 4 [2.0], [2.12], [2.18]; MEDIUM 5 cluster).
- C8M-4.4: not load-ready until HIGH 1 ([3.19] AR) is fixed; MEDIUM 4 [3.0], [3.2]; MEDIUM 5.
- C8M-4.5: pass after fixes (MEDIUM 2 [4.6](b); MEDIUM 4 [4.0], [4.1], [4.17], [4.19], [4.2]; MEDIUM 5; LOW 4, 5).
- C8M-4.6: pass after fixes (MEDIUM 1 scope [5.8], MEDIUM 3 [5.14], MEDIUM 4 [5.19], [5.20]; MEDIUM 5; LOW 2).

## Counts read
128 read. HIGH 2. MEDIUM 5 (items or clusters). LOW 7. Templated: no (slot order, keys, verdict mix and option length are varied); some repeated ideas remain (MEDIUM 5).

Verdict: NOT load-ready. Fix HIGH 1 ([3.19]) and HIGH 2 ([1.2](e)) and MEDIUM 1 to 3; MEDIUM 4 and 5 can follow in the same pass. No other key or fact error found.
