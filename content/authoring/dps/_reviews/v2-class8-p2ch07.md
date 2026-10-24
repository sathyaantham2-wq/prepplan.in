# Review: Class 8 Maths Part II ch7 (Area), content/authoring/dps/class8/p2ch07.json

Reviewer: independent first review. 124 questions read (21, 21, 20, 20, 21, 21), every key and every case-study part recomputed in python or by hand. Indices below are 0-based positions inside the concept's `questions` array.

## HIGH (wrong key, second answer, fact or data error)

1. **C8M-7.2 [8] (case study, gable walls)**: "Each gable has a horizontal base of 9 m, and the top of the gable is 4 m vertically above the base. Each sloping edge measures 5 m."
   Impossible figure. A triangle with base 9 and both sloping edges 5 has height sqrt(25 - 20.25) = about 2.18 m, not 4 m. Height 4 with a 5 m edge only works for a 3-4-5 right-angled gable, and then the other edge is not 5. The chapter does not teach Pythagoras, so a student cannot even test it, but a careful student will notice the picture does not close. Part (c) "took the sloping edge as the height" also rests on it.
   Fix: say "the gable is a right-angled triangle: base 9 m, height 4 m, and the steeper sloping edge, which is 5 m" (3-4-5 on the left, base remainder 6 m), and word (c) as "took the 5 m steeper edge as the height". Answers (a)-(c) stay 18 sq m, 6 litres, 4.5 sq m.

No wrong key and no second defensible option found in any of the 124 items. All numbers in all six case studies and the five-mark items recompute correctly (checked: 7.1 [3] 56/160/81/25, [8] 388, [14] 1600/1510/1596 per sq m, [20] 252 and 126 tiles, Rs 630; 7.2 [10] 21 and 24 by shoelace, [18], [19]; 7.3 [0], [9], [10], [18]; 7.4 [3] 830 and Rs 45,000, [8], [11], [18] n = 11; 7.5 [2], [6], [16], [17]; 7.6 [0], [3], [15], [16], [20]).

## MEDIUM

2. **C8M-7.2 [8](d)**: "cheapest way to buy exactly the paint needed in (b)". The key compares "at least 6 litres" (two 4-litre cans = 8 litres is allowed), which is not "exactly". Fix: "at least 6 litres" in the stem (and then the 4+4 option is legitimate), or drop the 8-litre case.
3. **Easy in disguise (a book one-liner with an Understand or inflated Analyse label)**: the bank allows no easy items.
   - C8M-7.2 [13] mcq: "What else must he measure?" (perpendicular height). Book sentence. Replace with a measurement-choice item that has numbers (e.g. which of three given measurement sets lets the area be found, with one set using a slanting side).
   - C8M-7.3 [12] mcq: "Which cut always works?" (corner to midpoint). Book fact. Make it a situation with a numeric consequence, or drop (the median idea already appears 8 times, see 7).
   - C8M-7.3 [15] short (Understand, 2 marks): "Explain why ABC and DBC have the same area". One-line book result.
   - C8M-7.3 [13] mcq: "All of them have the same area" is the chapter headline stated as an option.
   - C8M-7.4 [10] mcq (Understand): "Which set of measurements is enough" (diagonal + two perpendiculars). Book sentence.
   - C8M-7.5 [10] mcq (Understand): same base, same height, all area 40. One-line fact.
   - C8M-7.5 [15] (Understand): half of the book's rhombus derivation, with AO and BD given.
   - C8M-7.5 [20] mcq labelled Analyse: "rhombus, diagonals 18 and 24, area?" is one formula, one step. Relabel Apply at most; better make it analytic (e.g. diagonals and side given, ask which of two tiles needs fewer per sq m).
   - C8M-7.6 [8] (1.2 m by 0.9 m in sq cm) and [18] (4 ft by 3 ft in sq in, labelled Analyse): one-step unit conversions. Keep the squared-factor trap but add a second step or a comparison.
   - C8M-7.6 [4] assertion-reason: A and R are both the book's own conversion statement (1 sq in = 6.4516 sq cm because 2.54 squared); recall level.
4. **Last case-study part is not a real decision (strawman or calculation)**:
   - C8M-7.1 [14](d): plot B is already cheapest per sq m in (c), and cheapest in total, so the "longest wall" worry from (b) never bites. Change prices so the cheapest land is not the cheapest after the wall, so the student must weigh the two.
   - C8M-7.2 [18](d): the neighbour's claim "the plot is bigger when measured from the road" is absurd; (a) and (b) answer it at once. Make the neighbour's claim plausible (e.g. "the longer side with the longer height gives the larger area") or ask which of two offers gives more land.
   - C8M-7.3 [18](d): a calculation (BD = 27.5), not a decision. Fine as a part, but the case study ends without a judgement; add "which of the three proposals is nearest this and by how many sq m".
   - C8M-7.4 [3](d): "Should the buyer accept the agent's price?" is a plain error-spotting item (agent used the wrong base). Acceptable but weak.
   - C8M-7.5 [17](d): both diagonals halve the plot equally, so the shorter diagonal is trivially cheaper. No trade-off. Add a second consideration (e.g. the long hedge also provides shade worth money, or a gate is needed at one end).
5. **Case-study parts answerable without the chapter**: 7.1 [3] (a)-(c) and [14] (a)-(c) are rectangle area and price division, Class 5 arithmetic; the chapter is needed only in the last part. Acceptable for Class 8 but weak; 7.1 [8] is better.
6. **7.5 [11]/[16] repeat** the diagonal-formula "partly right" and Sulba-Sutra rhombus idea; see 7 for counts.
7. **Repeated ideas (more than "about twice" per concept)**:
   - C8M-7.3: median halves the triangle: [1], [2], [5], [6], [11], [12], [16], [19] and [14] item 1 (9 items). Same base between the same parallels: [0], [3], [4], [10], [13], [14], [15], [17] (8 items).
   - C8M-7.4: diagonal plus two perpendiculars gives the area: [1], [2], [4], [9], [10], [12], [16], [17] (8 items). [1], [2] and [12] are the same calculation in three forms (12 is the inverse of 1).
   - C8M-7.2: obtuse triangle with the foot outside the base: [0], [6], [14] (3 items).
   - C8M-7.1: equal area, different perimeter contrast: [4], [6], [10], [11], [12], [13], [15], [18] (8 items).
   - C8M-7.5: rhombus diagonal formula on a numeric case: [2b], [8], [12], [14], [15], [16], [20] (7 items).
   Fix: replace about 2 items per concept with a different sub-idea (7.3: triangulation of a quadrilateral by a median; 7.4: a pentagon from a point inside; 7.5: parallelogram on two different bases; 7.1: squares scaling, perimeter of composite shapes).

## LOW

8. **C8M-7.3 [10]**: "it is known that DO is twice OB" brings in a similar-triangle ratio the chapter does not teach. It is supplied, so it is answerable, but flag it as given data; say "(this ratio comes from the shape of the trapezium)" or give OB and OD in cm.
9. **Fill_blank stems all end with the same sentence** "Write the number in digits." (all six). Vary: "Give the answer as a number only" or put the unit in the blank.
10. **C8M-7.6 [3](c)** and [15]: the key rounds with 0.0929 (gives 1,012) while the exact value is 1,011.7 (1,012 anyway). Price per sq m "about Rs 4,940" is 4,940.7 from 1,012 and 4,942 from 1,011.7; accept both in the steps ("about Rs 4,940 to 4,942").
11. **C8M-7.6 concept breadth**: only [0], [1], [5], [7], [9], [10], [14], [17] test the trapezium; 11 of 21 items are unit conversion. The concept carries the unit scope item well but the trapezium dissection types (rectangle plus triangles, parallelogram plus triangle, two copies joined) get one item each. Consider shifting two conversion items to the trapezium.
12. **C8M-7.5 [10]**: "Four different parallelograms ... perimeters differ". Two mirror-image slants can share a perimeter, so say "different slants of different lengths" or reword the option to "perimeters are not all equal".
13. **C8M-7.2 [13] and 7.3 [12]** carry the `scenario` tag but are not scenarios (no data); retag or rewrite.
14. **Slot order**: orders differ across concepts (e.g. 7.1 begins MFsL, 7.3 begins LMAS, 7.6 begins LMFL); not templated by position. Marks mix is identical in all six concepts (about 9/5/3/2/2), and the Hard/Hardest split is identical (17/4 or 16/4); that is the loader table, not a defect.

## Scope check

- Pythagoras: not used anywhere in the keys. Items that need a hypotenuse supply the height (7.2 [19], 7.5 [6], [17]); only 7.2 [8] gives data that would need it (HIGH 1).
- scope_out checked: no minimum-perimeter reflection item; no open "give a method" dissection ("convert a rectangle to a triangle") item; no bigha, gaj, katha, cent or ankanam factor; no real-city area; no circle area. The rhombus Sulba-Sutra dissection (7.5 [16](b)) is in scope: the book teaches it on pp. 164-166 as the derivation of the diagonal formula.
- 7.3 [3] Statement 3 and 7.3 [14] item 2 (area of a triangle cut by joining two midpoints = one quarter) is derivable from two median steps, not stated by the book; acceptable.
- 7.5 [11] rectangle claim-check: diagonals 10 cm are in the stem (6 by 8), so no Pythagoras is needed. Passes.
- 7.6 [6] Statement 1 (1 sq km = 10,00,000 sq m) follows from the book's own prompt "how many m2 is a km2"; in scope.

## Template counts

- Claim-checks (one per concept): No, Partly, Yes, No, Partly, Yes = 2 No / 2 Partly / 2 Yes. Fine, but "No" is below half; acceptable at six items.
- `multi_statement` keys: 2 only, 1 and 3 only, 1 only, 3 only, 2 and 3 only, 1 and 2 only: well spread. Every `multi_statement` uses three statements, as the DPS standard requires.
- `assertion_reason` outcomes: both-true-explains x4 (7.1, 7.4, 7.5 not explains, 7.6) in fact 7.1, 7.4, 7.6 explain, 7.5 does not explain, 7.2 R false, 7.3 R true: all four outcomes present.
- `true_false`: False, True, False, True, False, True: balanced; every item has a real misconception and a reason.
- Correct option longest strictly in 4 of 46 option items (9%): not systematic. Key is always the first option in the file (loader shuffles); no option equal in value to the key; no option named by position.
- Slot order differs per concept; no identical sequence.
- Bloom: Understand is 9 of 124 (7%), Apply 40, Analyse 50, Evaluate 21, Create 4; no Remember, no Easy. Create is thin (4 items) but the loader floor is met.
- Figure items (7.2 [10], 7.3 [9], 7.5 [6], 7.6 [0]) are fully described in words with coordinates or lengths; each recomputed and consistent.
- Fill_blanks: six, all one-number answers with the unit in the stem, no natural equivalents (258 is "nearest whole number"). Good.

## Per-concept verdicts

- C8M-7.1 (21): pass after fixes (items 4, 5, 7 minor; strong bank, good five-mark border item).
- C8M-7.2 (21): pass after fixes (HIGH 1 gable figure, MEDIUM 2, 3, 4, 7).
- C8M-7.3 (20): pass after fixes (repeated median and parallel ideas, two easy Understand items, a decision-less last part).
- C8M-7.4 (20): pass after fixes (diagonal-plus-perpendiculars repeated eight times, one easy MCQ).
- C8M-7.5 (21): pass after fixes (three disguised-easy items, hedge decision has no trade-off).
- C8M-7.6 (21): pass after fixes (conversion items easy and over-represented, trapezium thin).

## Counts

Read 124. HIGH 1. MEDIUM 6 findings (2, 3 with 11 items, 4 with 5 items, 5, 6, 7 with 5 concept groups). LOW 7 (8 to 14). Not templated (stems, slot order, settings and verdicts vary); repetition of sub-ideas is the main weakness.

Verdict: pass after fixes.
