# Round 2: class7-topup/p1ch07-gap.json (Class 7 Maths Part I ch 7)

Diffed against `_reviews/v1/p1ch07-gap.json`: 6 items changed (7.1 x1, 7.4 x1, 7.5 x2, 7.6 x1, 7.7 x1 part (e)); 33 identical to v1. Every new item recomputed. Loader `--check`: valid (7 concepts, 39 questions). Marks sum; no positional option reference.

## Earlier findings: resolved?
- 7.6 la5 LMN (repeat of XYZ): replaced by the carpenter's right triangle (C = 55; ABD 55, CBD 35; claim about right triangles tested on 28, 62, 90 and proved by angle sum; height depends on base). Keys correct. Resolved, but see MEDIUM below.
- 7.1 craft-teacher perimeter mcq: replaced by the jammed compass at 5.2 cm: arcs meet only if the base is under 10.4 cm; 10.4 gives a degenerate "triangle" (5.2 + 5.2 = 10.4), 5.2, 9.8 and 2.6 all work. One correct option, uses the triangle-inequality idea taught in 7.1. Resolved.
- 7.5 sa2 (K = 3L) and 7.4 (x, 3x): now K = L + 20 (L 48, K 68, exterior 116 both ways) and "40 more" (60 and 100, third angle 20, base length irrelevant, 100 -> 120 smallest change that fails). Correct; ratio reuse removed.
- 7.5 exterior-angles-add-to-360 (not stated in book): replaced by Shreya "two exterior angles = 180 + third angle": 128 + 109 = 237 = 180 + 57; general proof via the exterior angle property; (c) 115 + 140 - 180 = 75, check 65 + 40 + 75. Correct, derivable from the chapter's exterior-angle property.
- 7.7 (e) ambiguity: now "same type by angles" explicit, F1 and F4 both obtuse (F4: B = 70 - 25 = 45, C = 110), verdict partly right. Resolved.
- 7.2 plot ABCD LOW: unchanged, accepted in round 1.

## New findings
| item | sev | problem | fix |
|---|---|---|---|
| 7.6 la5 carpenter (a), (b) | MEDIUM | In a right triangle the two legs are altitudes, and the set square touching A at B, repeat existing pack items (the PQR match with the right angle at Q, Sana's set-square beyond B, and la4 "which two altitudes are sides"). Two of the five marks are repeated ideas. Parts (c) to (e) are new. | Drop (b) and give its mark to (d) (the right-triangle claim), or shift (b) to a new idea such as the altitude to the hypotenuse for a different triangle. |
| 7.6 la5 (a) wording | LOW | "How many altitudes must he add as new pieces" while the stem already says a strut BD runs from B. The key (one new piece, BD) is clear, but the stem reads as if BD exists. | Say "how many of the three altitudes are not already sides". |
| 7.7 la5 (e) | LOW | F4 has angles 25, 45, 110, all different; the key says the data "do not show" it is isosceles because no sides are given. Fine inside the book (types by sides and by angles are separate), but a pupil may say "F4 is scalene" from its angles. | Add to the last step: also accept "F4 has three different angles so it is not isosceles". |
| 7.5 Shreya (c) | LOW | Close to the existing "exterior at B 118, at C 130, find interior" item. Setting and aim differ. | None. |

## Counts read
39 items; types mcq 7, multi_statement 3, match 2, short_answer 20, long_answer 7. multi_statement keys "1 only", "2 and 3 only", "1, 2 and 3". Correct option the longest in 3 of 7 mcq. Claim-check verdicts vary (true, right, wrong, partly right). Slot order the same in every concept (forced by the slot counts).

No new item repeats `class7/p1ch07.json` or `p1ch07-la4.json` except the 7.6 (a)-(b) overlap above (the rangoli item and "perimeter 19.5" are no longer echoed).

HIGH 0 / MEDIUM 1 / LOW 3
VERDICT: PASS
