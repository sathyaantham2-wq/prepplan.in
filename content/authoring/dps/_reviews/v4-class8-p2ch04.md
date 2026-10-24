# v4 verification: content/authoring/dps/class8/p2ch04.json (MATH8, hegp204, Part II ch4)

Diff against the pre-edit copy: 28 items changed (not ~30). Index [concept.item] is 1-based item in file order, C8M-4.n.
Checkers (scratchpad/v4-class8-p2ch04/): views.py (stack views brute force, fractal and Koch counts, Pythagoras sums), path.py/v3 mesh Dijkstra (shortest surface paths), chk.py (isometric cube-count enumeration). Cube nets, tetrahedron opposite edges, tin rollings and rod shadows done by exact arithmetic.

## Both v3 HIGH fixed
- [4.4.20] AR: R now restricted to two faces laid flat about their shared edge; A restricted to "over those two faces" (unfolded pair is a convex rectangle, so the segment stays on it). A true, R true, R explains A. One answer. FIXED.
- [4.2.3](e): now "She can choose a starting side of 9 cm or 18 cm"; 18 cm gives Step 3 vs Step 2, 128-48 = 80 cm more. Unique. FIXED.

## Per changed item (all OK unless noted)
- 4.1.10 AR: after Step 1 both fractals have 1 hole (A false); gasket keeps 3/4, carpet 8/9 (R true). Key A false R true. OK.
- 4.2.3 long 5m: 27/36/48/64; sides 9,3,1,1/3 -> Step 2; wire to Step 5 (113.8, Step 6 151.7); 18 cm: Step 3 (side 2/3, 128 cm), Step 4 fails (2/9 cm, 170.7 cm); 80 cm. Steps 5x1. OK.
- 4.2.10: 48,24,12,6 -> 4 diamonds; 4x90=360. Steps 2. OK.
- 4.2.16: 6,12,24,48 lizards at 32,16,8,4 cm -> 48. Key o[0], distinct. OK.
- 4.2.18: sides 81,27,9,3 (next 1 < 2) -> Step 3, 3x4^3 = 192. OK.
- 4.3.1: non-touching straws are the 3 opposite pairs; every other pair meets at a corner -> 3 colours. OK.
- 4.3.13: cube edge: 4 touch, 3 parallel, 4 skew. Key 4. OK.
- 4.3.19: hexagonal pyramid: apex 6 faces, six base corners 3 faces each = 24. OK.
- 4.4.1: net coordinates reproduce Lina's 8.6 cm (sqrt 74) and the line does cross empty paper; top+right faces give legs 5 and 3, sqrt34 = 5.83, equals the global minimum by mesh Dijkstra. Steps 2. OK.
- 4.4.3: radius 14, 28+15+28 = 71. OK (see LOW 1).
- 4.4.13: r 7/h 22 and r 3.5/h 44; verdict No. Steps 3. OK.
- 4.4.19: sqrt160 = 12.65 (mesh 12.6498), other unfoldings 16.97 and longer; options 12, 16, 11.3 wrong. OK.
- 4.4.20: see HIGH fix. OK.
- 4.5.1: tilted edge 20 with depth difference 16 -> lateral sqrt(400-256) = 12; 30 by 12. OK.
- 4.5.2: square pyramid (top view square, front triangle) and triangular prism with length = base (square outline) both fit; cone gives a circle. Key unique among options. OK.
- 4.5.3: brute force greatest removable = 1 (front-left stack 2 -> 1). OK.
- 4.5.7: L views right; side view 2 stacked squares; a cube behind/in front of any cube keeps the front view, changes the top view. OK (see LOW 2).
- 4.5.8 true_false: True; projection of the parallelogram formed by the rods; the non-upright plane condition removes the degenerate case. Steps 2. OK.
- 4.5.9: shadow of a rectangle is a parallelogram, rectangle or segment, never a one-pair trapezium. OK.
- 4.5.18 match: R, P, S, Q each checked by view; other options wrong. OK.
- 4.5.20: sqrt(26^2-24^2) = 10; 35.4 is the sqrt(26^2+24^2) distractor. OK.
- 4.5.21 long 5m: 15, 17, 208/145/225 all < 289, flat 17/15/8, sums 578 both. Steps 5x1. OK.
- 4.5.22 claim_check 3m: (a) unique, 10; (b) 8 to 12 (brute force); verdict accepts "partly right" or "No". Steps 3. OK (see LOW 3).
- 4.6.9: faces 4 up, 3 front, 3 right, 10 squares; 5 cubes; per-cube faces 3+3+2+2+0 = 10. Steps 2. OK.
- 4.6.13 case study 4m: 4 high/3 long/2 deep; swap length and height; 3 x (4+2+3) = 27 both; do not send. Steps 4x1. Climbs; last is a real decision. OK.
- 4.6.15: enumeration gives 7 or 8 cubes. OK.
- 4.6.20: L of 4 squares. OK.
- 4.6.21: depth 3 wide, one column 2 high = 4. OK.

Checks over all 28: correct option at o[0], no wrong option equal to the key, no option named by position, step marks sum to marks, no scope_out violated (no impossible triangle, no Euler's formula, no area/volume; Pythagoras use is fine, taught in Part II ch2), figure items described in words.

## Findings
HIGH: 0.
MEDIUM: 0.
LOW: 3.
1. [4.4.3] "measured across the 88 cm sides" is slightly loose; clearer: "measured in the direction at right angles to the 88 cm sides". Key 71 stands.
2. [4.5.7](b) the cube behind the top-left cube is glued in mid-air; the stem says "glued", so valid, but "behind the right-hand cube, on the table" is the safe example.
3. [4.5.22](c) verdict accepts both "partly right" and "No"; fine for a marker, but name one preferred verdict in the key.

Verdict: load-ready.
