# Review: Class 7 Maths, Part I ch 5 "Parallel and Intersecting Lines" (DPS pack)

File: `content/authoring/dps/class7/p1ch05.json`. Read in full: 164 of 164 questions (8 concepts, 20-21 each). No sampling.
Method: textbook text (`gegp105`, all pages) and the "Part I Ch 5" scope read first. Every numeric key recomputed in Python (all 22 algebra items, ratio items, fold counts, case-study data). Every figure described in words was redrawn by hand from the wording. Every key matched its recomputation. Defects are in figure wording, one mis-named angle pair, scope, and templating.

## HIGH (wrong fact, or a second defensible answer): 3

1. **C7M-5.3 #18 (5-mark, rectangle PQRS)** - "(b) Taking PQ as a transversal, name the pair of corresponding angles that show PS and QR are parallel"; key: "the angle at P between PQ and PS and the angle at Q between PQ and QR, both measured on the same side of PQ". These two angles are interior angles on the same side (co-interior). They are NOT corresponding angles. The pair sits on the facing sides of PS and QR, so each angle opens toward the other line. The true corresponding partner of angle SPQ is the exterior angle at Q between QR and the extension of PQ beyond Q, which is 90 degrees by a linear pair. (d) repeats the error ("PS as the transversal and angles at P and S"). The book proves parallelism only through equal corresponding angles. The converse for same-side interior angles is not taught.
   Smallest fix: in (b) ask for the angle at Q between QR and PQ extended beyond Q, and show it is 90 degrees by a linear pair. Do the same in (d), and adjust the step wording.

2. **C7M-5.4 #21 (case study, Hyderabad stage pipes)** - Readings at l: 70, 110, 70, 110. At m: 70, 110, 80, 100 (upper-left, upper-right, lower-right, lower-left). Key (a)/(b): "lower-right 80 and lower-left 100 are wrong; should be 70 and 110". The data cannot say which pair is faulty. The upper pair 70+110 is consistent, and the lower pair 80+100 is consistent. The clash is between the two pairs. If the upper pair were the wrong one, m would read 80, 100, 80, 100 and the pipes would not be parallel. So (b), (c) and (d) have a second defensible answer, and (d) ("upper-left angles are both 70, so probably parallel") is circular.
   Smallest fix: add a sentence that the upper two readings at m were re-checked with a set square and are reliable (or that the electrician read the upper two angles directly and computed the lower two). Then the key stands.

3. **C7M-5.7 #8 (assertion-reason)** - "AB is parallel to CD, and angle ADC is 60 degrees with AD as the transversal, then angle DAB is 120 degrees." The wording does not say B and C lie on the same side of AD. If they are on opposite sides (a Z shape), DAB = 60 and A is false. The key assumes the same side, so "A true" is not forced by the text.
   Smallest fix: write "In quadrilateral ABCD, AB is parallel to DC, angle ADC is 60 degrees..." or "B and C on the same side of AD".

## MEDIUM

4. **Scope drift, systemic: solving equations (about 22 items).** The Part I Ch 4 scope OUT line (`class7-maths-part1-ch02-08.md`, line 43) says "solving linear equations". The Part II scope OUT line (line 28) says "solving equations with integer coefficients (Part II Ch 7)". Solving two-sided equations (2y+15 = 4y-45) is a Part II Ch 7 method. It is not in this chapter's IN list or in `gegp105`, which uses only numeric angles. Affected items:
   - 5.1 #5, #11, #16, #17, #18, #20, #21
   - 5.2 #10, #16, #19, #20
   - 5.4 #17
   - 5.5 #9, #13, #16, #17, #18, #20
   - 5.6 #11, #17
   - 5.7 #11, #18
   - ratio items 5.1 #6, 5.7 #12 and #21 (ratio splits, milder)
   The DPS HYE sheet does set (3x+15)/(5x-25) items, so this is a deliberate style choice. But QUESTION_STANDARD says the chapter wins. Either the owner accepts it, or keep roughly 1-2 per concept and move the rest to numeric angles. Algebra currently carries 5.1 and 5.5: 7 of 21 and 6 of 20 items. Substituting a given value, as in 5.5 #20(a), is fine because Ch 4 teaches substitution.

5. **C7M-5.3 #19 (case study, ladder rungs)** - Part (d) reasoning: "equal corresponding angles on one rung prove the rails parallel, and if parallel every rung must agree, so one of the two readings is wrong." This is inconsistent. The question already admits a 2-degree reading error, so rung 1 (72/72) may be the faulty one. Re-measuring is a fine answer, but "one rung already proves it" is unsound. Part (a) and (b) also overlap.
   Fix: let (d) say neither rung can be trusted alone, so re-measure both. Or give a tolerance rule as 5.7 #20 does.

6. **Strawman or trivial decisions in case studies** (Anti-template rule: the decision must be a real trade-off):
   - 5.1 #21: (d) "can he build two identical bays?" - the answer follows directly from (c).
   - 5.2 #20: Plan 2 is the only perpendicular plan.
   - 5.3 #20: replace p by q - p was just shown non-parallel.
   - 5.4 #20: "should the planner turn m" - obviously yes.
   - 5.6 #21: 85 is not 90, so no.
   - 5.8 #19: "fewest folds" is a mechanical threshold.
   Best ones to copy: 5.8 #20 (₹800 vs ₹1,000), 5.5 #19 (angle and length together), 5.7 #21 (ratio limit), 5.7 #20 (1 degree tolerance).
   Some case studies also have a part that no later part uses, for example 5.7 #20(a) (DFE = 68).

7. **Templated slot pattern.** Every concept has the identical mix: 6 mcq, 1 multi_statement, 1 assertion_reason, 8 short, 2 five-mark and 2 case studies, plus a claim_check and a show_impossible in each concept. Within a concept:
   - The 5-mark items are mostly (a)-(e) scaffolds: "(a) name… (b) find… (c) find… (d) find… (e) what mark/how many". Each part hands over the next. The pattern repeats in 5.1 #19, 5.2 #17, 5.3 #17, 5.4 #18, 5.6 #18, 5.6 #19, 5.7 #18, 5.8 #17.
   - Many short and long items follow the frame "(Expression 1) and (Expression 2) -> equation -> x -> angle -> linear pair": 5.1 #11, #17, #18, #20, #21, 5.2 #10, #16, #20.
   - 5.8 has three items with the same three-lines-and-a-transversal frame (62/62/58, 65/65/72, 58/58/61): #12, #18, #20.
   - The claim-check frame "X says ... Do you agree?" appears in all 8 concepts.
   Fix: rewrite about 4-5 of the 5-mark items as less scaffolded tasks (find the error, compare two methods, "explain why this chain of reasoning fails"). Vary the algebra frame (ratio, "one angle is twice the other", numeric chains).

8. **Near-duplicates across concepts.** 5.2 #5 (Radha folds a square sheet in half; crease vs vertical side) and 5.8 #4 (Meera, same fold, same options). Merge or replace 5.8 #4 with a different fold fact. 5.2 #12 and 5.8 #10 both ask about parallel and perpendicular edges and creases of a square sheet.

## LOW

9. 5.1 #15: the key adds "the differences are too big to blame thickness of lines alone". The book gives no tolerance, and 10 degrees is a judgement. Make the readings clearly impossible (an obvious 50+120 = 170 against 180), or say the book only warns about small errors.
10. 5.3 #9(b), #13(b): "floor line and ceiling line never meet but not parallel" is the skew-line idea (OUT: "skew lines/3D"). The book only gives table-line vs board-line in its teacher note. Acceptable, but 5.3 #13(b) "running the other way" is vague. Say "table line and blackboard line", the book's example.
11. 5.3 #20 stem ("measured at the point on l between the right-hand part of l and the upward part of the line") is hard to parse for Class 7. Say "the angle above l on the right of the point".
12. 5.3 #13 key's (b) example needs the lines not to be parallel. State "a line on the floor and a line on the ceiling that cross when seen from above", or drop it.
13. 5.5 #4 and 5.6 #5 options use "supplementary", which the chapter does not use (it says "add up to 180"). Fine as a distractor, but rephrase.
14. 5.6 #8 R says a corresponding angle "is equal to it" without "for parallel lines". Add the qualifier.
15. 5.6 #17 resembles the DPS reference item 13(b) (alternate angles (3x+15) and (5x-25)): the 5x-25 and the structure are shared. Change to e.g. (2p+12)/(4p-18).
16. 5.8 #13 is tagged `reverse` but is "find n from 129". It is an inverse calculation, not a reverse-situation item. Retag as Apply, or ask "design a sheet so the count is 65".
17. Names repeat: Aman (5.4 #15, 5.6 #15), Pooja (5.2 #14, 5.8 #5), Meena/Meera (5.1 #3, 5.3 #14, 5.8 #4). The spread of Indian names is thin, and Hindi-belt names dominate.
18. 5.1 #3 option 4 "they never add to 180 degrees ever" is clumsy filler wording.
19. Several 2-mark "(a)/(b)" items have a (b) that is recall of the symbol or the word, for example 5.2 #9, #13, #11 and 5.8 #10. Fine as the Easy slot, but they are tagged Apply/Hard.

## Verified OK (no finding)
- All numeric keys, solved by code: 5.1 #5 (70), #11 (x=22), #17 (y=30), #18 (p=28), #20 (x=20, 65/115), #21 (y=24, 96/84); 5.2 #16 (x=13), #19 (k=20), #20 (m=16, n=25); 5.4 #17 (x=30), #20 (68); 5.5 #9 (27), #13 (24), #16 (13), #17 (k=40), #18 (x=10), #20 (88/88, 80/90, y=15); 5.6 #11 (20), #17 (15); 5.7 #11, #12 (80/100), #17 (72/110/70), #18 (x=25), #19 (95, 100), #21 (105/75, 108/72, 99/81); 5.8 fold counts 3, 5, 9, 17, 33, 65, 129 (n=7), the 20-lines impossibility, costs ₹800 vs ₹1,000.
- All four match items map correctly (5.1 #9, 5.4 #9, 5.6 #9, 5.7 #9). All 8 multi_statement keys check each statement. The false statements and keys vary: "1 and 3 only", "2 only", "all three", "2 and 3 only", "1 only", "1 and 2 only", "3 only", "1 and 3 only". The loader shuffles options, and the correct option is never the strictly longest in any of the 48 mcq.
- Assertion-reasons: A and R judged independently. The "true, not the explanation" cases are 5.1, 5.7. Explains: 5.2, 5.6. A-false and R-false cases: 5.3, 5.4, 5.5, 5.8.
- Reversal words carry `rev: true` throughout.
- Mix: chapter Remember/Understand = 33% (limit 60%); Analyse/Evaluate/Create = 33% (minimum 15%). Per-concept R/U is 6-9, Apply 6-8, A/E/C 6-9.
- All five case-study checks pass: part data is consistent and each part's key follows from the data given.
- The book's term "interior angles on the same side" is used (the chapter has no "co-interior" term). Angle-sum, congruence and slope are not used.
- Settings are Indian throughout (Nagpur, Jaipur, Surat, Karnal, Mysuru, Chennai, Indore, Pune, Ludhiana). ₹ appears in 5.7 #20 and 5.8 #20.

## Per-concept verdicts
- C7M-5.1: keys right. The algebra frame repeats (7 of 21) and is out of Ch 5 scope. 5.1 #15 is a judgement call. Case-study decisions are thin.
- C7M-5.2: keys right. Algebra heavy (4 of 20). 5.2 #5 duplicates 5.8 #4. Case-study 20 is a strawman.
- C7M-5.3: **one HIGH (#18)**. #19 logic is flawed and #20 is a strawman. The skew-line wording is borderline.
- C7M-5.4: **one HIGH (#21)**. Otherwise strong: #13, #16 and #19 are good reasoning items.
- C7M-5.5: keys right. 6 of 20 items are equation solving (out of scope), but the case studies are the best in the chapter (#19, #20).
- C7M-5.6: keys right. Good derivation items (#18, #19). 5.6 #17 resembles a DPS item.
- C7M-5.7: **one HIGH (#8)**. Strong angle-chasing: #17 and #19 are good. Case studies #20 and #21 are real.
- C7M-5.8: keys right. Three items share the same three-lines frame, and #4 duplicates 5.2 #5. #19 is mechanical, #20 is good.

## Overall
Standard: mostly reached. The chapter has real DPS-style depth (claim-checks, show-impossible, angle-chasing, costed decisions) and no wrong arithmetic. It is partly templated: identical slot pattern per concept, scaffolded 5-part items, and an algebra-angle frame repeated across 5.1-5.7. It cannot load as-is: fix the 3 HIGH items, decide on the equation-solving scope question (item 4), then rewrite a few scaffolded 5-mark items.

Count read: 164 of 164.
