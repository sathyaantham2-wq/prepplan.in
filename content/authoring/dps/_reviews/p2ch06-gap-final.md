# p2ch06-gap final review

Loader --check: valid (7 concepts, 35 questions). Diff vs v1 backup: 6 items differ. Pages checked against content/extracted/gegp206 (file 010 = p145 ... 026 = p161).

## Carpenter wedge item (C7M-6.3 #3) - recomputed
(a) 360/40 = 9 wedges, 8 copies: correct. (b) SSS with two radii and the same chord: correct. (c) 7 x 48 = 336, gap 24: correct. (d) bisect -> 24, 360/24 = 15: correct. (e) 40 used as drawn -> 9 spokes; 48 bisected -> 15; 52: 6 wedges leave 48, bisected 26: 13 wedges leave 22; unbisected 52 and 48 do not divide 360. Unique answer: wheels 1 and 2 work, wheel 3 does not. 1 mark per part, 5 steps. Unique in the chapter: no other "wedge/spoke/carpenter" item in class7/p2ch06.json, p2ch06-la4.json or the gap file. Pages 145-147 correct (copying an angle, 360 deg round a point on p.147). PASS.

## Other replaced items
- 6.5 #1 (Veena, opening 6 on radius 5): angle at O = 2 asin(3/5) = 73.7 deg, six steps = 442 deg > 360: False is right. p.152-153 fine.
- 6.6 #1 (3 x 6 grid minus (1,1) and (3,1)): 18 squares, both removed squares same colour (row+column even), leaves 7 and 9: False is right.
- 6.7 #1 (triangle + 2 squares = 240, left 120; hexagon or two triangles): right, partly-right verdict is the only defensible one.
- 6.7 #3 (50+60+70 = 180; two of each = 360): arithmetic right.

| Item | Severity | Problem | Fix |
|---|---|---|---|
| C7M-6.6 #1 (Ria, 16 squares, True/False) | MEDIUM | Same misconception and same True/False form as existing C7M-6.6 #4 (6 x 6 minus two corners, "34 is even") plus #0 (Anil) and the AR on "even number of squares". Four items now test "even count therefore tileable". | Change the misconception, e.g. "removing any two squares of different colours always leaves a tileable region" tested on a 3 x 3 ring or a 3 x 5 grid minus the two squares at (1,2) and (2,1)... or make it a fill_blank on the number of each colour. |
| C7M-6.7 #3 (Meena, 50-60-70 tile) | LOW | Showing the corners sum to 360 round a point is necessary, not sufficient, for tiling the plane. The item rests on the book's remark (p.161) that non-regular shapes tile. | Add to the stem that "the book shows tilings with non-regular shapes" or word (c) "...so her word 'only' is not supported". |
| C7M-6.7 #1 and #3 | LOW | "p" is p.161 but the 360 deg round a point rule is p.147. | Set p to "pp. 147, 161". |
| C7M-6.5 #1 (Veena) | LOW | Near existing C7M-6.5 #7 (Rohan, 70 deg triangles round a point). | Accept. |

HIGH 0, MEDIUM 1, LOW 3.

VERDICT: PASS
