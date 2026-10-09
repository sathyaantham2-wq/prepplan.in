# Review: CBSE Class 7 Maths, Ganita Prakash Part II ch 1, "Geometric Twins" (gegp201)

File: content/authoring/dps/class7/p2ch01.json. Questions are cited as concept code plus 0-based index in the
file's order (for example 1.4#11 is the 12th question of C7M-1.4). Read: all 141 (20/20/20/20/20/21/20), no sampling.
Every number was recomputed in Python. Every SSA two-triangle claim was checked by the height test
(adjacent x sin(angle) < opposite < adjacent gives two triangles). Textbook facts were checked against the
extracted pages 001-023.

## Result in one line
All 141 keys are correct. There is no second defensible answer anywhere. The problems are a missing figure, one
garbled stem, one scope leak, one imprecise fact, heavy copying of the textbook's own exercises and numbers, and a
repeated template in the case studies and claim-checks.

## HIGH (wrong key, second correct answer, arithmetic or fact error)
None found.

Verified, not just assumed: 1.2#10 (ΔLMN ≅ ΔFDE), 1.2#14 (ΔABC ≅ ΔYXZ), 1.2#18(b) (ΔPQR ≅ ΔNLM), 1.5#10 (ΔABC ≅ ΔFED), 1.5#15 (ΔPQR ≅ ΔYXZ),
the SSA claims 1.3#4 (7, 5, 40° gives 2 triangles), 1.3#9(b) (7, 6, 47° gives 2), 1.3#12 and 1.5#17(b) (8, 30°, 5 gives 2), 1.3#17 (9, 7, 40° gives 2),
and all money (₹3,240; ₹760; ₹37,440 with ₹2,560 spare; ₹22,75,000; ₹2,480; ₹864 against ₹720; ₹350 against ₹432; ₹5,000).

## MEDIUM
1. **1.4#11 (short, 2 marks), figure that does not exist.** "In the figure, ∠ABC = ∠DBC and ∠ACB = ∠DCB ..." There is no
   figure, and the item is the textbook's own Figure-it-Out 3 verbatim. It is only answerable if A and D lie on opposite
   sides of BC, which the stem never says. Fix: replace "In the figure" with "A and D lie on opposite sides of BC, so that
   ABDC (A-B-D-C) forms two triangles ΔABC and ΔDBC sharing BC", or drop it. Do not tag it `figure`.
2. **1.2#13 (claim-check, 3 marks), garbled stem.** "Dev says ΔABD ≅ ΔCDB can be written with A matching C but B and D staying in
   place". ΔCDB already swaps B and D, so the quoted congruence is the correct one and Dev's claim contradicts it. The key
   itself is right (AB = 9 cm cannot lie on CB = 5 cm). Fix: "Dev writes ΔABD ≅ ΔCBD, with B and D staying in place, because BD is common. Is he right?"
   The answer then gives the correct ΔABD ≅ ΔCDB.
3. **1.5#18 (case study), scope leak and part (d) rests on an unstated fact.** "The organiser wants every stake 4 m from its pole.
   Is this safe for tent C?" Nothing in the stem says tent A's stake is 4 m. That is only known by the 3-4-5 / Pythagoras
   computation, and scope_out says "Pythagoras and hypotenuse calculation". The key ("C is not congruent, so measure
   separately") never uses 4 m. Fix: state "tent A's stake is measured at 4 m from its pole" and ask whether the same 4 m can be assumed for C.
4. **1.5#19 (case study), imprecise fact.** The key says the eight no-right-angle boards are "not guaranteed" congruent to P. Board P has a
   right angle, so a triangle with no right angle can never be congruent to P. They are definitely not congruent. The
   "SSA" label in (a) and the "may not match" wording in (d) are wrong. Fix: say the eight boards have sides 12 cm and 15 cm and
   their angles were never measured (then "not guaranteed" is correct), or say definitely not congruent and make (d) a pure cost decision.
5. **1.1#19 (case study) (a), ill-posed.** "Which tile is congruent to T1?" T1 is itself in the list, and the key answers "T1 itself ... no other".
   Fix: "Which other tile is congruent to T1, if any?" with key "none: T2 has radius 10.5 cm". Part (d) is again the
   "non-congruent so no" move, and the hedge "unless a mismatch is acceptable" weakens the decision.
6. **Strawman or free-mark case studies (QUESTION_STANDARD anti-template rules).**
   - 1.1#18: part (a) is in the stem ("Boards 1, 2 and 3 have arms 4 and 8 with angle 80°"). Part (d) "should the inspector also measure the angle?" is a strawman answered by (b) and (c).
   - 1.3#18: part (a) is in the stem. Chitra's order "18 and 24" is the only thought needed. Part (d) "should she check only one side and the angle?" is an absurd option. The 3-5 mark steps are free.
   - 1.4#18: the stem prints "the 3 m side AB between them" (gives ASA in (b)) and "opposite ∠X" (gives (c)). Part (d) "should the type-3 frames be used instead?" is answered "no, not congruent".
   - 1.4#19: part (c) (combined value of the two road sides) feeds nothing in (d). Part (d) is hedged ("location and soil would still be judged separately").
   - 1.5#18 and 1.5#19: the decision is again "not congruent, so no".
   Fix: remove the printed givens from the stems. Make (d) a real trade-off, for example a cheaper but non-congruent supplier where the saving is large against a stated tolerance, or two congruent-by-different-condition options with different costs.
7. **1.6#19 (case study), parts do not climb.** (a), (b) and (c) are the same formula (180 - apex)/2 three times. Merge them into one part and add a part that uses the rule across the trusses (for example the largest apex angle that still gives a base angle of at least 60°).
8. **Items copied or lightly changed from the textbook's own exercises and examples.** The brief asks for these to be flagged.
   - 1.3#3 uses the book's exact example numbers (AB = XY = 6, AC = XZ = 5, ∠A = 30°).
   - 1.4#1 uses the book's 35°, 75°, giving 70°.
   - 1.4#11 is the book's Ex 3 verbatim.
   - 1.4#9 (and 1.4#17 as its 5-mark twin) is the book's Ex 2 with the symbols kept.
   - 1.3#16, 1.3#19 and 1.7#4 are the book's O-midpoint / "AB parallel to CD" Ex 3, with only lengths changed.
   - 1.7#8 and 1.7#16(a)(b) are Ex 4 (square ABCD, ΔABC ≅ ΔADC and ΔCDA). 1.7#16(c) is the book's "six ways" prompt.
   - 1.7#12 is Ex 1 verbatim (ΔAIR ≅ ΔFLY).
   - 1.6#5 and 1.6#11 are Ex 5 (A centre of circle, find ∠B, ∠C).
   - 1.6#17 uses the book's worked example (AB = AC, ∠A = 80°, altitude AD).
   - 1.5#9 and 1.5#4 reuse the book's RHS numbers (QR = 4, radius 5).
   - 1.1 uses the book's signboard symbol (AB = 4, BC = 8, 80°) in 6 items (#3, #7, #11, #15, #18 and the stem of #16).
   - 1.2#5 and 1.2#11 are the book's 6 cm / 4 cm / 8 cm circles activity twice.
   Fix: keep one anchor per concept at most. Change the shapes and numbers elsewhere (for example a different angle pair, a trapezium or an arrow-head figure, a different side set).
9. **Near-duplicates (a grid cell wasted).**
   - The same "gate bars cross at O, SAS" item appears in 1.3#8, 1.3#16, 1.3#19 and again in 1.7#4 and 1.7#15.
   - The same "AB ∥ CD, AB = CD, ASA, O midpoint" appears as 1.4#9 and 1.4#17.
   - 1.4#8, 1.4#16 and 1.4#19 are the same ∠, ∠, side → third angle 70° item with 42/68, 48/62 and 48/62.
   - The isosceles-with-altitude/midpoint proof appears in 1.6#3, 1.6#9(b), 1.6#17, 1.7#11 and 1.7#17.
   - The 6.5 m ladder with 6 m reach is both 1.5#5 and 1.5#16.
   - The kite with AB = AD and CB = CD is both 1.2#9 and 1.2#16.
   - The square diagonal is 1.7#2, #5, #8, #16 and #18.
   - "AAA fails" is tested 6 times in 1.3 (#2, #5 S1, #6, #7, #11, #14).
   - 1.3#12 and 1.5#17(b) are the identical SSA construction (8 cm, 30°, 5 cm).
   Fix: keep one of each and replace the others with the unused ideas listed under "Not tested at all" below.

## LOW
- **Template feel across concepts (QUESTION_STANDARD anti-template).** Every concept has the identical slot map: 5-7 mcq, 1 multi_statement, 1 AR, 8 short answer (5 two-mark, 3 three-mark with the same claim_check / show_impossible / reverse trio), 4 long, and the 2 case studies built as "paid ₹X per congruent item → (a) which are congruent (b) condition (c) money (d) accept?". The claim-check is always "Name says 'always ...'. Do you agree?", seven times. AR is "A false, R true, with an 'always' assertion" in both 1.1 and 1.5. Each case study's (d) is a cost-versus-congruence accept/reject. Vary the stem frames: a reversed order (condition first, then a failing instance), a repair task, a measurement-plan task, and a "which two of three sets fit" comparison.
- **1.3#13 over-generalises.** "If it does not [include the angle], it is the SSA case and two different triangles can be drawn." For 8, 6, 35° with the 35° opposite the longer 8 cm side there is exactly one triangle (computed). Fix: "...two different triangles may be possible, so she cannot be sure."
- **1.4#8 and 1.4#16(c) key wording.** Given ∠A, ∠C and BC (BC is not between A and C) the direct condition is AAS. The key says "ASA ... (this is the AAS condition)", which gives two names. Fix: key as "AAS (or ASA once ∠B is found)", and make the mark step name AAS.
- **Weak distractors.** 1.4#2 "The altitude from R" and 1.7#1 "∠A and ∠D of the quadrilateral" are invented, not the book's look-alikes. 1.1#1 "the four angles" is a distractor no student would pick; offer "length and a diagonal" instead (a real confusion the book does not address, so ok only if the diagonal is not in scope; otherwise use "perimeter").
- **AR with an unrelated R.** 1.4#6 (R is the SAS statement) and 1.7#7 (R = angle sum) are true-but-not-explaining by construction. Fine as the "not the explanation" type but R should relate to A (for example R = "alternate angles are equal for parallel lines" is too close to A; try "the triangles are congruent by ASA").
- **Mark splits.** 1.7#17 gives 2 marks to (d), a trivial sum check, while the proof (a) gets 1. Re-weight to (a) 2, (d) 1.
- **Realism.** 1.3#19 steel at ₹18 per cm of bar (₹1,800 a metre) is high; use ₹18 per metre-scaled units or a rate per bar. 1.1#19 and 1.7#18 are fine.
- **1.3#17 and 1.5#17** carry 2 marks for pure recall ("the five conditions in words"); 1.5#17(a) in particular repeats 1.5#11.
- **1.6#8 AR** R merely restates A (R explains by definition). Acceptable but the weakest AR; use R = "angles opposite equal sides are equal".
- **1.1#18 and 1.3#18 name students as inspectors** without saying they are students in the stem (1.3#18 "Which students' sheets"); add "three students".

## Standard checks
- Distribution at chapter level: Remember + Understand = 36.9% (limit 60%); Analyse + Evaluate + Create = 27.7% (minimum 15%). Passes.
- Case-study marks: all 14 are 4-mark with four 1-mark parts and 80-131 words; 1.7#18 and 1.6#20 are fine on words but see MEDIUM 6/7.
- Correct option longest: not systematic (1-3 of 5-7 per concept).
- multi_statement keyed combinations vary: "2 and 3 only", "1 and 3 only", "1 and 2 only", "3 only", "1 only", "2 only", "all three". The false statement is spread across 1, 2 and 3. Pass.
- Reversal words: all NOT / "cannot" / "does not" items checked carry `rev` (1.1#2, 1.5#1 and the claim-check / show_impossible items). 1.5#6 and 1.6#7 are phrased positively; fine.
- Scope_out: no similarity beyond the allowed AAA contrast, no quadrilateral or polygon congruence, no area or perimeter. The only breach is the Pythagorean 3-4-5 reliance in 1.5#18(d) (MEDIUM 3), and the sides 30-40-50 in 1.2#18 and 5-13 in 1.5#15 sit on Pythagorean triples but are not used as such.
- DPS reference papers (Cl-7 HYE WS-2, PT-2): no congruence content, so no DPS copy was found.
- Not tested at all: the "rotate and flip" case with a mirror-image triangle in an SAS setting, ASA/AAS in the kite or isosceles setting, a case study where two different conditions (SAS and RHS) are both usable, and a "which condition does not fit" classification with five given triples.
- Settings: Indian (Jaipur, Surat, Ludhiana, Gram Panchayat, rangoli, hostel) and mostly realistic.

## Per-concept verdict
- C7M-1.1: keys right; 1.1#18 and #19 need the case-study fixes (MEDIUM 5 and 6); signboard numbers overused.
- C7M-1.2: keys right; 1.2#13 stem garbled (MEDIUM 2); kite duplicate; 4-6-8 activity copied from the book.
- C7M-1.3: keys right; textbook numbers (6, 5, 30°) copied, gate bars repeated 3 times, "AAA fails" overtested; 1.3#18 free-mark case study.
- C7M-1.4: keys right; 1.4#11 has no figure (MEDIUM 1); 1.4#9 and #17 duplicate the book's Ex 2; 1.4#18 gives away its own answers.
- C7M-1.5: keys right; 1.5#18 Pythagoras leak (MEDIUM 3); 1.5#19 imprecise (MEDIUM 4); ladder duplicate.
- C7M-1.6: keys right; the proof items repeat the book's worked example; 1.6#19 does not climb.
- C7M-1.7: keys right; the weakest on originality (Ex 1, 4, 5 of the book plus the square diagonal five times); the river case study 1.7#19 is the best item in the chapter.

## Count read
141 of 141.

## Overall verdict
Keys: 141 of 141 correct. Not a recall-in-disguise bank, but only moderately originated: it tests the five conditions well in claim-checks and SSA arithmetic, yet lets the textbook's own exercises carry about a fifth of the chapter and uses one slot template per concept. Needs a revision pass for MEDIUM items 1-9 before it is loaded. Does not need re-authoring.
