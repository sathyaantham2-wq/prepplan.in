# Review: content/authoring/dps/class7-topup/p2ch06-gap.json

Class 7 Maths Part II ch 6, Constructions and Tilings (gegp206). 35 questions read, every one recomputed in python or by hand against the textbook pages (printed folio = file number + 135). Loader `--check`: valid (7 concepts, 35 questions).

All 35 keys are right. No second defensible answer except the one noted at C7M-6.3 (carpenter, MEDIUM). The tilings, colour counts, arithmetic and all construction claims were rechecked. The Neeta rhombus pieces, Ravi's 5x5 counts, the corridor plans, the staircase counts (n=3,4,7,8 even, black minus white = number of odd rows) and the arrow tile (area 36, perimeter 32, 600 tiles) are all correct.

## Judgement asked for: triangle angle sum (180)

- Not taught in gegp206. This chapter uses only the straight angle (p.137) and 360 round a point (p.152).
- It is taught in Part I ch 7 (gegp107): the angle sum property, printed pp.165-166, and the triangle inequality in the same chapter. Part II ch 6 already builds on Part I (SSS and SAS congruence, corresponding angles), so a pupil who has reached this chapter has met it.
- Explicit use: C7M-6.4 Yash (c), "125 + 90 more than 180". Implicit use: C7M-6.7 Meena, where a 50-60-70 triangle exists because the angles sum to 180.
- Same prerequisite status for the triangle inequality ("9 + 9 < 20, arcs cannot meet" in C7M-6.1 Q1 and Sara, Rina).
- Verdict: in scope as a same-grade prerequisite, not a violation. It is outside the chapter's own scope list, so it is LOW. Optional safer fix for Yash (c): "the foot is beyond B because angle ABC is obtuse; a perpendicular from A would meet the line on the side where the angle at B is acute", or cite gegp107 p.165 in the rubric.
- No quadrilateral angle sum anywhere. Neeta derives her 120/60 angles from two equilateral triangles. Good.

## Items with a problem

| Item | Sev | Problem | Exact fix |
|---|---|---|---|
| 6.3 carpenter wheel (5 marks) part (e) | MEDIUM | "Allowing at most one bisection ... how many spokes each then has". The 40 degree wedge also works after one bisection (20 degrees, 18 spokes), so "9 spokes" is not the only true count. Key and step 5 say 9. | Reword: "Without bisecting the 40 degree wedge, and allowing at most one bisection for the others", or accept 9 or 18 in the step. |
| 6.6 "3 x 8 grid, corners of row 1 removed" (true_false) | MEDIUM | Repeat of the existing pack item "4 x 4 grid, top-left and top-right corners removed ... different colours ... can be tiled" (same trick, same row-ends, same verdict, tiling by horizontal tiles). The name Kiran is also reused in the yoga-room item here. | Replace with a different removal: two squares of the same colour not in one row, or one removed square on an edge of a 3 x 8 that makes it untileable (key False). |
| 6.7 Sunil brick wall (3 marks) | MEDIUM | Same idea as existing 6.7 item "At a point on a straight wall the tiles meet along the wall, so corners fill 180 degrees" (a straight side takes 180). Also the brick wall is not in the book; the page range 152-161 is too wide. | Swap the setting to a different tiling idea, for example a tile with a 150 degree corner, or a three-shape point with 90 + 60 + 120 + 90. Set p to "p. 161". |
| 6.5 Veena (true_false) | MEDIUM | Recall in disguise: the book's one-line fact that six steps of a radius-length opening return to the start, answer True with the book's own reason. It also repeats part (a) of the Bina and Kunal 5-mark item. | Make it a claim with a flaw, for example opening 6 cm but circle radius 5 cm (False, steps do not return), or ask what happens after 7 steps. |
| 6.7 Meena (3 marks) | MEDIUM | (b) asks the pupil to see that two triangles joined by a half turn have parallel opposite sides and make strips. Neither parallelogram properties nor half-turn are taught in this chapter or on pp.160-162 (the chapter only says non-regular shapes can tile). Also the claim "only an equilateral triangle can tile" is contradicted on p.160-161 itself (squares, hexagons), so it is a strawman. | Make (b) "show that the six corners fill 360 degrees round a point"; set Meena's claim to "only triangles with all three corners equal can tile". |
| 6.5 Bina and Kunal (5 marks) | LOW | (a) "How many points does Bina mark" is 5 or 6 depending on whether the start counts; key says 6. (c) "4 constructions" assumes the angle at A is not constructed. (e) is a strawman (Bina's method is clearly better). | (a) "How many steps ... in all, counting the one that returns to the start". (c) "after AB is drawn, how many 120 degree angles at B, C, D, E". (e) Ask what error Kunal's method accumulates that Bina's does not. |
| 6.1 tent (2 marks) | LOW | Restates the book's own proof (p.137-138) with numbers. Part (b) is addition. Marked Hard/Apply but is near recall. | Make it a find-the-error: a pupil says AY is 2.4 m because OY = 2.4 m, so ask which pair of triangles shows the true AY and why. |
| 6.4 railway signal cabin p = "pp. 147-155" and 6.7 octagon "pp. 152-161", Meena "pp. 152-161", Sunil "pp. 152-161" | LOW | Pages span non-adjacent sections. Brief asks for the printed page(s) where the idea is taught; one range. | Octagon and Meena: "p. 152 and p. 161" as two cites is not allowed, so use "p. 161" (mixed shapes) and mention 360 round a point in the rubric. Railway: "pp. 147-148". |
| 6.3 Tara (mcq) | LOW | Two options say "Yes", differing only in the reason. Option SAS is wrong only because the equal angle at O is what is being proved; a pupil may not see that. Acceptable, but the stem could ask "Which reason shows...". | Make stem "Does OC bisect the angle, and why?" or keep. |
| Claim-check verdict mix | LOW | Hari wrong, Yash wrong, Ravi wrong, Meena wrong, Sunil partly right, Farah right. 1 right, 1 partial, 4 wrong. | Make one of the "wrong" ones right (for example Yash agrees that he must extend the line, or Ravi is right for a symmetric placement). |
| Names and settings | LOW | Kiran, Meena, Sunil, Ravi, Priya, Hari already used in the existing pack (different ideas). Neeta's "cuts along OA, OC, OE" sits next to the existing "ropes from O to A, C, E" item. "Stage" is also used in the existing la4 (L-shaped stage). | Change a few names and use "terrace" or "lawn" for the 5x5 stage. |
| 6.4 Rina (2 marks) | LOW | Neighbours the existing items on arcs of radius larger or smaller than the distance of P from l (Hari/Gita; Ravi second arc). Distinct enough (smallest whole radius). | None needed; note only. |

## Template and DPS counts

- Slots: short_answer 3 marks x15, short_answer 2 marks x9, long_answer 5 marks x7 (one per concept, every concept), mcq x3, multi_statement x1. No assertion_reason (not required by this brief). No case study.
- Slot order within a concept varies (the 5-mark item is last in four of seven concepts, first in one, second or fourth in two). Acceptable.
- Correct option the longest: 0 of 3 MCQ. multi_statement key "2 and 3 only" (one item, no spread to judge; no "2 only" distractor).
- Claim-checks: 6 (verdict mix above). True/false: 5 (True x3: Lata, Manu, Veena; False x2: Deepa, 3 x 8 grid).
- Recall in disguise: Veena, tent (part b), Lata's "arcs below the line" (the book shows arcs below; weak misconception).
- No item names an option by position. Marking steps sum to marks in all 35. One 1-mark step carries three results in the Q5 gate-panel (c) (angle, OX, AB), which is lenient but checkable.
- Template impression: not templated. Contexts are varied; 5-mark items have different last parts (decide, compute, justify, describe tiling, give reason). The same "show the colours differ" idea appears twice in 6.6 (grid corners and Ravi), which is acceptable.

## Counts

HIGH: 0
MEDIUM: 5 (carpenter 9 or 18 spokes; 3 x 8 corners repeat; Sunil wall repeat; Veena recall/repeat; Meena parallelogram unsupported and strawman)
LOW: 7

## Verdict per concept

- C7M-6.1: pass.
- C7M-6.2: pass.
- C7M-6.3: pass after fixing the carpenter wording.
- C7M-6.4: pass; Yash (c) uses the Part I angle sum (accepted, LOW).
- C7M-6.5: pass after replacing Veena and tidying Bina and Kunal.
- C7M-6.6: pass after replacing the 3 x 8 corners item.
- C7M-6.7: pass after replacing Sunil and fixing Meena (b).

VERDICT: PASS
