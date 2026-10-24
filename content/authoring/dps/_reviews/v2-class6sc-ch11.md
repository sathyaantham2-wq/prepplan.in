# Review v2: Class 6 Science ch11 "Nature's Treasures" (SCI6, fecu111)

File reviewed: `content/authoring/dps/class6sc/ch11.json`. 6 concepts x 21 = 126 questions, all read.
Every number was recomputed by hand and in python (air shares, roof harvest, solar units, forest hectares, fuel litres, coal tonnes, gooseberry kg, bead counts). Facts were checked against `content/extracted/fecu111/pages/001-024.txt`. Question indexes below are 0-based positions in the concept's list.

Result in one line: all keys and all arithmetic are correct, one item has a second defensible answer, the chapter is heavily templated, and about a third of the items are one-line book facts under a Hard/Analyse label.

## HIGH (1)

1. **C6SC-11.6, index 19 (case study, nine things used on Sunday).** The list includes "a stone slab for grinding chutney". The key counts it as a natural resource (rock): (a) = 3 human-made, (b) = 3 renewable and 3 non-renewable. A shaped grinding slab is made by people, and the chapter itself says tools made from rock (hand axes, arrowheads) come from rocks. So (a) = 4 human-made and (b) = 3 and 2 is equally defensible, and every mark in (a) and (b) is affected.
   Fix: replace the slab with an unambiguous natural item, such as "a pebble she picked up from the riverbank". Then (a) stays 3, (b) becomes 3 and 3 again, and the key stands. Or name it "a rough granite boulder in the courtyard".

## MEDIUM

2. **Template, whole chapter (counts).** Every concept has the same recipe:
   - 5 MCQ + 1 multi_statement + 1 assertion_reason + 1 match + 1 fill_blank + 1 true_false + 4 two-mark + 1 claim_check + 1 other 3-mark (a reverse in C1, C3 and C5; a figure/reverse, show_impossible or plain 3-marker elsewhere) + 2 five-mark + 2 case studies.
   - Slot order is identical in C3 and C5 (C5 only swaps the first MCQ and multi_statement positions). C1, C2, C4 and C6 differ only by moving 1-2 items.
   - Every concept totals exactly 46 marks and has exactly 17 Hard + 4 Hardest, with no other difficulty value.
   - All 12 case studies share one shape: (a) a chapter fact, (b) and (c) arithmetic on given data, (d) "should X or Y? Justify", and the key says "Either with a reason" every time.
   - All 6 first five-mark items are "Justify / Evaluate this statement in five points" with one mark per point.
   - All 30 MCQs open with a named person or place in a scenario frame.
   Fix: vary at least 2 concepts. Give one case study a decision first, one a table to read, one a part that reverses (given the result, find the input). Put a 4-mark non-case item in place of one case study in two concepts. Vary marks per concept (e.g. 44 to 48). Use Medium for the easier items instead of the one Hard label.

3. **Easy in disguise (one-line facts under Hard/Analyse labels).** The bank allows none. Fix by adding a second step (a count, a comparison, or a "which of these two is wrong and why").
   - C1: idx 1 (78 nitrogen / 21 oxygen, labelled Analyse), idx 3, idx 4 (oxygen-lack, labelled Evaluate), idx 12 (breeze vs storm), idx 13.
   - C2: idx 1 (sea water is saline), idx 2 (pond is easily accessible), idx 5 (waste dumped in river), idx 13 (saline vs fresh).
   - C3: idx 1 (cow gets energy through grass), idx 3 (solar panel makes electricity), idx 4, idx 13 (the book's own "if the Sun is not visible" activity).
   - C4: idx 3 (laterite; the wrong options Coal and Cobalt are not rocks used for walls), idx 4 (earthworms), idx 11(b), idx 12 (the (b) part is "which animal", an earthworm), idx 14 (the book's own exercise 11).
   - C5: idx 1 (coal makes electricity; the distractor "lining stepwell walls" is absurd), idx 2, idx 4, idx 11, idx 12.
   - C6: idx 2 (the book lists solar panels as human-made), idx 5, idx 12, idx 17 (list five activities, the book's own exercise 7).
   Several 5-mark and 3-mark items are the book's own end-of-chapter exercises restated: C4 idx 17 (exercise 15), C5 idx 15 (exercise 5), C3 idx 15 (exercise 13), C6 idx 10(a) (exercise 4), C6 idx 16. This is fine as a base but should not be the hardest items in the concept.

4. **Repetition (one idea more than about twice in a concept).**
   - C1: percentage-of-air arithmetic is the core of idx 0, 7, 8, 10, 15, 18 and 20, which is seven items. Keep three and replace the rest with other air ideas (wind, a firki vs a windmill, which gas matters, gases other than oxygen).
   - C3: idx 7 (fill_blank, 4 x 12 + 3 x 3 = 57) is the same computation as case study idx 19(b). The solar cooker appears in idx 8, 11, 20 and 0. The "no sunlight for a week" scenario appears in both idx 5 and idx 15.
   - C4: roots hold soil / soil washed away appears in idx 1, 14, 17 and 19(c). A hectares-lost-per-year calculation appears in both idx 9 and idx 19.
   - C5: "millions of years, buried remains, limited" appears in idx 4, 6(R), 14, 15, 16 and 20(a).
   - C6: clay to soil appears in idx 0, 11, 16 and 19; soil as non-renewable appears in idx 6 and 15 and again in C4 idx 0.

5. **C6SC-11.3, idx 19 (case study, Reddy family solar panels).** Even a normal week gives 57 units against 70 needed, so the family is short every week. "Add panels or keep the city connection" is then close to a strawman: the data answer is "keep the connection", whatever else is done. Fix: make the normal week roughly meet the need (e.g. 4 x 12 + 3 x 4 = 60 units against a 60-unit need) so the panels cover a normal week and the question is whether to add panels or a battery for monsoon weeks. Then recompute (c).

6. **C6SC-11.5, idx 19 (case study, 4 CNG vs 2 electric buses).** Part (d) needs the number of people each bus type carries, and the stem gives none. The key's "4 CNG buses carry more people" is invented. Fix: add the capacity (e.g. each bus seats 50) and the total demand, or recast (d) around fuel use and air quality only.

7. **C6SC-11.1, scope.** `scope_out` allows percentages only as air's own 78/21/1 figures. Seven items turn this into repeated percent-of-volume maths (250 m³, 300 L, 400 m³, 500 L, 1,500 m³, 200 beads, "how many times as much", a bead model change). That tests Class 6 maths more than the science. Fix: cut the volume-based items to about three (see item 4) and keep the others to the chapter's composition and the oxygen reasoning.

8. **C6SC-11.5, idx 13.** "Give two reasons from the chapter" why the city air smells of smoke. The key's second reason, "very few trees", is noticed in the chapter but never given as a cause of the smoke smell; the chapter attributes the smoke to fossil fuels in vehicles. Fix: ask for "two things the children notice in the city, and which one is the cause of the smoke", or use two real causes (vehicle fuel burning, over-dependence on fossil fuels).

9. **C6SC-11.4, idx 5 and idx 20 (old-phone drive, e-waste recycling).** The book only says a basic phone has about a dozen minerals (page 221). It never mentions recycling phones or e-waste. The key in idx 20(d) says "recycling saves ... minerals", which is beyond the book. In idx 5 the three wrong options (soil only, one mineral only, slate and laterite) are absurd. Fix: reframe both around "minerals took very long to form, so use them responsibly", which the book does say, and make the wrong options real confusions.

## LOW

10. **Label inflation.** All 126 items are Hard (102) or Hardest (24), including 1-mark book facts. Use Medium for the plain scenario MCQs so the label means something.
11. **C6SC-11.6, idx 10(b).** "Which one of the renewable resources in your list" has only one candidate (forests), so there is nothing to choose. Reword to "which of your resources could still be lost, and how".
12. **C6SC-11.3, idx 14.** Lion eating deer: the key is "Yes". The book shows only the cow and grass; the extension to lions is sound but is not in the book. Keep, or use a food chain the book gives.
13. **C6SC-11.1, idx 3.** "Which job could the windmill NOT do" is arguable, because windmill electricity could run a dryer. Reword to "which job is NOT mentioned in the chapter for a windmill".
14. **fill_blank answers** (C2 idx 8 "30000", C5 idx 7 "67.5") may not match "30,000". Say in the stem "(write digits only, no commas)", or accept both.
15. **C6SC-11.1, idx 16 (reverse).** "6 is the number of hundreds of litres" is a clumsy reading. The key is fine, but the marking point can be "21 per 100 and 6 hundreds".
16. **C6SC-11.4, idx 11 stem.** "faced men who had come to fell the trees" is an embellishment. The book says only that women encircled and hugged the trees to stop them being felled. Drop the "faced men" wording.

## Data realism (invented numbers, all framed as given or "suppose")
- Roof rain (1 mm on 1 m² = 1 L; 700 mm; 80% catch): realistic and stated as a rule.
- Gold 0.025 g per phone: realistic (about 0.03 g in a real phone) and stated as "suppose".
- Coal 8,000 t/day, bus 4 km/L, car 15 km/L, panels 12 and 3 units/day, windmill mill 40 kg/h, gooseberries 30 kg/tree at Rs 40/kg: all plausible and stated.
- Solar cooker 2.5 h vs LPG Rs 40/day for 30 students: plausible, stated.
No unrealistic data found. All of it is clearly framed.

## Counts read
- 126 questions. Types: 30 mcq, 6 multi_statement, 6 assertion_reason, 6 match, 6 fill_blank, 6 true_false, 36 two-mark + 21 three-mark + 12 five-mark short/long answers (including 7 claim_checks, 4 reverse, 1 show_impossible, 1 figure), 12 case studies.
- Claim-check verdicts: No 3, Yes 2, partly right 2. Fine.
- true_false verdicts: False 3 (C1, C3, C5), True 3 (C2, C4, C6). Fine, though the True ones (C2, C4) rest on no real misconception.
- multi_statement keys: 2&3, 1 only, all three, 1&3, 2 only, 1&2. Good spread; the false statement moves across 1, 2 and 3.
- assertion_reason outcomes: both true and explains (C1, C5), both true but not explaining (C2, C6), A true R false (C3), A false R true (C4). Good.
- Correct option is the longest in 4 of 48 MCQ/MS/AR items (the AR and multi_statement "longest" cases are an artefact of the fixed option text). Not a tell.
- No option is named by position anywhere. No "as in the book" phrasing.
- Bloom: Analyse 47, Apply 32, Evaluate 33, Understand 9, Create 5; no Remember, no Easy. Analyse/Evaluate/Create is about 67%, Understand about 7%.

## Verdicts per concept
- C6SC-11.1 Air: keys all correct; pass after fixes (items 3, 4, 7).
- C6SC-11.2 Water: keys all correct; pass after fixes (item 3).
- C6SC-11.3 Sun: keys all correct; pass after fixes (items 3, 4, 5).
- C6SC-11.4 Forests and soil: keys all correct; pass after fixes (items 3, 4, 9).
- C6SC-11.5 Fossil fuels: keys all correct; pass after fixes (items 3, 4, 6, 8).
- C6SC-11.6 Resources: one second-answer defect (item 1); pass after fixes.

**Overall: pass after fixes.** 126 read, 1 HIGH, 8 MEDIUM, 7 LOW. Templated: yes, strongly, at the recipe level (item 2).
