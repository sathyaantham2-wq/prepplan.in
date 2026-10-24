# Review v3: class6sc ch07 (C6SC, Temperature and its Measurement, fecu107)

Reviewer: independent re-review after one fix pass. File: content/authoring/dps/class6sc/ch07.json, 126 questions read
(7.1: 20, 7.2: 21, 7.3: 22, 7.4: 21, 7.5: 21, 7.6: 21). Index = 0-based position inside the concept. Every number,
average, range and case-study part was recomputed in python or by hand; facts checked against content/extracted/fecu107/pages/.
Arithmetic is sound throughout: no wrong number among 126. The defects below are a key that is not an option, one
non-unique key, scope, and repetition.

## v2 status (checked in the file, not on the fixer's word)

| v2 | Status | Note |
|---|---|---|
| 1 (7.5 five readings, second cause) | FIXED | Now 7.5 Q12: stem rules out tilt, bulb position, eye level and lifting; later 46 rules out cooling. Unique. |
| 2 (7.1 flask 70 C boundary) | FIXED | Now 7.1 Q0: "from 60 C to 70 C, both included"; 70, 57, 44 and 25 more minutes recomputed OK. |
| 3 (templated slot order) | FIXED in order | Type order differs in every concept; case studies no longer always last. Mark profile still near-identical (1-mark x8, 2 x5, 3 x3-4, 4 x2-3, 5 x2-3); that is the DPS minimum, accept. |
| 4 (repetition) | PARTLY | 7.6 table reuse fixed (distinct data sets). 7.5 "lifting out lowers the reading" still in 7 items (see M3). 7.6 and 7.1 still repetitive (M3). |
| 5 (strawman last parts) | FIXED, but a new frame appeared | Jaya and Aryan strawmen gone; 7.4 Q17, 7.5 Q4/Q18, 7.6 Q2/Q12/Q20, 7.3 Q21 are real trade-offs. See M4. |
| 6 (easy in disguise) | PARTLY | About 25 of 126 remain (M5). |
| 7 (bare-subtraction fill_blank) | PARTLY | 7.1 and 7.2 fill_blank gone (chapter minimum 3 still met: 4). Remaining blanks are one-step (M5). |
| 8 (7.3 Rekha stem) | FIXED | "Rekha measures her own temperature". |
| 9 (7.2 "NOT normal") | FIXED | Now "lies outside the band"; only 43.5 qualifies. |
| 10 (7.2 non-contact boiling water) | FIXED | Item replaced; kettle item names only the clinical thermometer. |
| 12-13 | FIXED | Joke distractors replaced; 7.1 Q19 now a plan with constraints (no ice, matka, Class 5 child). |
| 14 | FIXED | No stem says "the book" (searched). |
| 15 | PARTLY | 7.2 Q16 now defines normal as within 0.5 C; still the shape of the book exercise (days x times table). LOW. |
| 16-18 | FIXED | Ice-at-0 and "upper part" items gone; 7.3 Q19 key mentions no upper limit (but see H1). |

## HIGH

H1. **C6SC-7.3 Q19** (mcq, "Which one can NOT be a real temperature?"): the key `a` is
"-300 C. It is below absolute zero, close to -273.15 C (0 kelvin), ... so 3000 C is possible." but the four options are bare
"-300 C", "-250 C", "5 K", "3000 C". The key string is not equal to any option; it is the only mcq of 126 like this
(script check). The loader shuffles options and matches the key text, so this item will have no correct option or will be
rejected. Fix: set `a` to exactly "-300 °C" (copy the option character for character) and move the explanation into the
question's explanation/steps field if one exists, or drop it.

H2. **C6SC-7.5 Q17** (lab thermometer for fever; the "judge it" item). The conclusion is sound and supported by the chapter
(clinical thermometers are for body temperature, laboratory ones for other purposes, page 124; once out of the body the
column falls). The weak part is (a): "Which rule ... would he find hard to follow while the bulb is in his mouth?" is keyed
to one rule only ("read while the bulb is still in place, eye in line"), and the key says "he cannot do that". Two defects:
(1) another chapter rule is at least as defensible and a student who gives it loses the step mark: hold it vertically,
not tilted (a thermometer in a mouth lies at a slant) and bulb not touching the sides (it rests against cheek and tongue);
(2) "cannot" is overstated, since a helper or a mirror can read it in place. Fix: ask "Name one rule ... he would
find hard to follow while it is in his mouth" and accept vertical / bulb clear of the sides / eye in line while in place,
with the step reading "any one chair rule that mouth placement breaks, with the reason". Part (b) stays as it is.
(Verdict on the reasoning: legitimate reasoning from the chapter's rules for (b); (a) needs the wider mark scheme.)

## MEDIUM

M1. **C6SC-7.2 Q17** (grandfather, mercury thermometer): part (b) "Mercury is extremely toxic, so a broken mercury thermometer
is a danger". scope_out in the pack says the mercury "Do you know?" box is out "beyond the single fact that digital
thermometers are replacing mercury ones". Toxicity is the beyond. Fix: restate (b) as "digital thermometers are replacing
mercury ones; say what 'no battery' gains and what digital gives (numbers easier to read)", or take the toxicity item out of
scope_out. Also check the 7.2 Q8 option "Mercury clinical thermometers, since they need no batteries" (fine as a distractor).

M2. **C6SC-7.5 Q0 (v)** "Which of his mistakes is most likely to have made 39 C lower than the real temperature?" The chapter
links only removal to a falling column. Held by the bulb (hand cooler or warmer than the water), bulb on the bottom of the
beaker and a slanted/overhead reading can each move the reading either way, and the book does not say which. Keyed answer is
the best of them but "most likely" rests on reasoning the page does not give. Fix: "Which mistake does the chapter tell
you makes the column fall?" or add to the stem that the water is warmer than the hand.

M3. **Repetition beyond about twice a concept.**
- 7.5: "taking it out makes the column fall" is the tested idea in Q0(v), Q1 (S3), Q7, Q8, Q14, Q17, Q18(b) (7 items).
  Replace three with other page ideas (parallax in the reading, a tilted thermometer, the early/late reading rule is already in Q4, Q5, Q19).
- 7.6: the "weather varies daily, the rise or fall is only a general trend" idea is Q4(iii), Q7, Q8 (S3), Q9(iv), Q11, Q14, Q17(iv)
  (7 items); "minimum cannot exceed maximum" is Q1(b), Q18, Q20(a). Merge Q11 and Q7; turn Q18 into a numeric
  case or drop it.
- 7.1: "the hand judges by where it was before" is behind Q1, Q2, Q3, Q5, Q7, Q10, Q13, Q14, Q17, Q18 and Q19: 11 of 20 items.
  The concept is thin, but add one item on a different idea (temperature is a number that can be compared by difference; a
  difference of readings across two days; Dolly-type fever check) in place of two of these.
- 7.2: non-contact thermometer for crowds is now Q8, Q15 (S2 only), Q19 (3 items): acceptable.

M4. **Closing-part frame is now a template.** The decision part of the case studies in 7.3 Q0 and Q21, 7.4 Q17, 7.5 Q4 and
Q18, 7.6 Q2, Q12 and Q20 all end the key with "Either can be defended / A good answer chooses one and states what it
gives up" (8 of 13 case studies). Two consequences: the answer is not checkable (step: "justified choice"), and the frame
repeats. Fix: write what a good answer must contain for each side (two points each) and vary the wording; in at least three
make one side clearly better on the data but tempting (7.5 Q4(d): the 60 s reading would be 0.5 C low *and* the group would
not know the column had stopped; 7.3 Q9(d): kelvin is the dominant answer, so make Celsius carry a reason).

M5. **Easy in disguise (answer is a page fact, one step, or one conversion)**, about 25 of 126 (20 percent):
- 7.1: Q3 (activity conclusion), Q9 (AR whose R restates A), Q15 (higher reading means hotter).
- 7.2: Q1 (the steps of Activity 7.2), Q2 (two page precautions), Q12 (add the missing wash step), Q18 (37.3 is not a fever).
- 7.3: Q1 (25 + 273.15), Q7 (fill: -196 + 273.15), Q12 (310.15 - 273.15), Q13 (unit-writing rules), Q20 (true_false: "0 C is the lowest" is a page line).
- 7.4: Q0 (four divisions), Q2 (10 / 5), Q10 (fill: 10 / 20, the book's own calculation), Q19 (choose the finest division).
- 7.5: Q9 (AR, handle with care), Q11 (eye in line), Q13 (fill: 0, a page fact), Q15 (two page precautions), Q16 (page sentence), Q19 (two reasons, both on the page).
- 7.6: Q5 (forecast), Q10 (fill, 20 + 3 x 2), Q15 (AR, forecast data), Q18 (maximum below minimum), Q3.
Raise with a number or a conflict (for example give a reading and ask which procedure error explains it; give the
thermometer and ask whether it can measure two stated things). Labels of these are still "Hard"; tag them honestly or lift
them. The fill_blank answers are word or number: fine.

## LOW

L1. **C6SC-7.4 Q17** and 7.6 Q2 are good decisions but (a) and (b) of 7.4 Q17 and (a)-(b) of 7.6 Q12 are answerable from
their own stems; only (c)/(d) need the chapter. Acceptable for four marks; note for later.
L2. **C6SC-7.2 Q6** (claim_check, "Partly right"): Mohan applies the armpit correction to a tongue reading, which is wrong;
the claim is mostly "No". A marker may mark "No" as equally correct. Rename "No, only true for armpit readings" or change the claim.
L3. **C6SC-7.2 Q10** (match): 98.6 F is also "the average temperature of healthy people" (b), so item 2 has two true matches;
the options still give one answer, but remove the overlap (use "37.0 C on another scale" only for 98.6 F and a different
descriptor for b).
L4. **C6SC-7.5 Q4(a)**: "At what time did the column stop rising?" The data show 59 at 75 s and 90 s; it may have stopped between 60 and 75 s.
Ask "By which reading was the column no longer rising?".
L5. **C6SC-7.5 Q10 (iv)**: key states the water "boils at about 97 C at this school"; the book gives readings of 97.8 to 98.1 in
Shillong but no reason. Say "the readings show these thermometers agree; only 96.4 needs explaining" without the cause.
L6. **C6SC-7.6 Q2(b)** "all four room readings lie between the town's maximum and minimum": true here, but a room is not bound
by outside extremes in general (an air-conditioned room). Change to "Is the 2 pm room reading above the town's minimum?" or drop.
L7. **C6SC-7.2 Q16** still mirrors book exercise 9 (days x times table); change the setting (a child on four days, 8 am and 8 pm).

## Template counts (read, not impression)
- Claim-check verdicts (7 items): No 3 (7.1, 7.3 Q4, 7.5), Yes 1 (7.3 Q11), Partly 3 (7.2, 7.4, 7.6). Acceptable (L2 would add one No).
- multi_statement keys: "1 and 3 only", "1 only", "2 and 3 only", "all three", "2 only", "1 and 2 only". Spread, not a template.
- assertion_reason: explains (7.1, 7.5, 7.6), not-explains (7.3), A true R false (7.2), A false R true (7.4). All outcomes present.
- true_false: 7 items, 3 False, 4 True (43 percent False). OK.
- fill_blank 4 (7.3-7.6), match 4 (7.2, 7.3, 7.4, 7.6), true_false 7: chapter minimum (3) met.
- Correct option strictly the longest: 11 of 45 option items (24 percent); not systematic. Positions: no option named by position.
- Slot order per concept: now different in every concept (checked); case studies at positions 0/16, 3/14, 0/9/21, 4/17, 4/18, 2/12/20.
- Bloom: Understand 3 of 126; Analyse+Evaluate+Create 92 percent; no Easy or Remember. Marks per concept 45 to 50.
- Case studies: 14. Parts recomputed (7.1 Q0 and Q16, 7.2 Q3 and Q14, 7.3 Q0, Q9, Q21, 7.4 Q4 and Q17, 7.5 Q4 and Q18, 7.6 Q2, Q12, Q20): all keys correct; decisions are real except 7.3 Q9(d) (kelvin dominates).
- Scope: Anna Mani, Sun at 15 million C, pulse, diagram questions not used. Mercury toxicity used once (M1). Salt-and-ice at -15 and -20 C is scenery only.

## Verdicts per concept
- C6SC-7.1: keys right; one idea repeated in 11 items (M3); several easy-in-disguise (M5). Pass after fixes.
- C6SC-7.2: keys right; scope breach in Q17 (M1); Q6, Q10 minor. Pass after fixes.
- C6SC-7.3: **Q19 key is not an option (H1)**; rest arithmetic correct. Rework that item, then pass.
- C6SC-7.4: keys right; four bare-division items (M5). Pass after fixes.
- C6SC-7.5: Q17 mark scheme (H2), Q0(v) (M2), "lift out" repeated 7 times (M3). Pass after fixes.
- C6SC-7.6: keys right; trend idea repeated 7 times (M3); Q18/Q1/Q20 same max-min idea. Pass after fixes.

## Counts read
126 questions read. HIGH 2 (H1, H2), MEDIUM 5 (M1-M5), LOW 7 (L1-L7). v2 HIGH items both fixed; the two new HIGH are from the fix pass
(H1 an unmatched key, H2 the lab-thermometer mark scheme). Templated: not in structure now; mild template in the case-study
closing frame (M4) and in repeated ideas (M3). Overall: pass after fixes (H1 must be fixed before load).
