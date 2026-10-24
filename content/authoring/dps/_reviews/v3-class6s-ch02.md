# v3 re-review: class6s ch02 "Oceans and Continents" (SST6, fees102)

Diffed against orig.json: 69 items changed (2.1: 14, 2.2: 11, 2.3: 14, 2.4: 7, 2.5: 12, 2.6: 11). All 69 read, each key decided before reading the key, facts checked against fees102 pages 001-014 (printed pp. 27-40), arithmetic recomputed in python. Indices are 0-based within each concept's question list.

Mechanical (python, all 124): every option item has the key at o[0], no duplicate options, every step list sums to its marks, no option named by position, no Remember/Easy labels left. Correct option is strictly the longest in 0 of 27 mcq. Types: short_answer 49, mcq 27, long_answer 25, multi_statement 6, fill_blank 6, assertion_reason 6, match 5. Blooms: Analyse 72, Apply 23, Evaluate 22, Create 6, Understand 1.

## v2 status
- M1 (72/28 tie distractor): FIXED. Distractor is now 82/18 (7 away vs 3).
- M2 (freshwater scope): FIXED. No freshwater, salty-water or groundwater item remains (grep clean). One neighbour is left, see L1.
- M3 (repetition): PARTLY. C6S-2.3 now has the 2004 event in 2 items (was 7). Still heavy: C6S-2.6 plastic in 9 items and overfishing in 8; C6S-2.5 Greenland 9 and Antarctica 8; C6S-2.1 "three-fourths" in 9 and hemisphere in 6; C6S-2.2 Indian Ocean/Arabian Sea in 7-10. See M3 below.
- M4 (weak case studies): MOSTLY FIXED. 2.1 Q8(d), 2.2 Q15, 2.3 Q5 (5h wave / 22h storm / 4h and 20h team time, now a real trade-off), 2.6 Q12 (four parts) improved. Still weak: 2.5 Q2(d), see M5.
- M5 (easy in disguise): PARTLY. Many are now scenario items; several remain one-line recall (list in M6).
- M6 (beyond the book): FIXED for 2.5 Q18(d) (now an explicit, labelled inference from two quoted sentences) and 2.1 Q18(d).
- Q16 of C6S-2.5 (India larger than Greenland): supported, not HIGH. See note under 2.5 Q16.

## HIGH
None. All 69 changed keys are correct and have one defensible answer. Recomputed: 2.1 Q3 300; Q8 (61+81)/2 = 71, 75-61 = 14, 81-75 = 6; Q13 70 vs 75; 2.3 Q5 (20 h > 5 h; 4+20 = 24, 24-22 = 2); 2.3 Q6 2400/600 = 4; 2.4 Q0 (7 to 4 = 3 joins), Q6 (5), Q9 (4 and 3), Q16 (Africa a continent alone in 3 of 4 counts); 2.5 Q2 (1983-1981 = 2; 1+2 = 3), Q5 (10 x 2 = 20), Q9 (100000/1300 = 76.9, about 77); 2.6 Q5 (more than half = 5 of 10).

## MEDIUM
M1. C6S-2.5 Q8 ferry route. Stem: "from India's island group in the Bay of Bengal to its island group in the Arabian Sea". Option 2 is the same route reversed ("From the Lakshadweep Islands to the Andaman and Nicobar Islands"). A ferry route is two-way, so a careful student can defend option 2. Fix: drop the reversed option (replace with "From the Lakshadweep Islands to Greenland" or "Between the Andaman Islands and the Nicobar Islands only") and keep the stem direction.

M2. C6S-2.2 Q15 (wall-map case study), part (d). The key's "feature it could borrow from Team A" is "large, clear name labels", but the stem says both teams already print every ocean's name, and A's own features (bright separate colours, thick solid lines) are the ones the key rejects. A student cannot find the borrowed feature in the stem. Fix: give Team A a stated feature (for example "large lettering") or ask only "which design, and why", dropping the borrow clause.

M3. Repetition still above "one idea about twice" (counts by token in each concept). C6S-2.6: plastic in Q8, 9, 10, 11, 12, 14, 17, 19, 20 and overfishing in Q0, 4, 8, 11, 12, 14, 17, 19. C6S-2.5: Greenland in Q1, 5, 7, 8, 10, 13, 14, 15, 16; Antarctica in Q2, 7, 10, 11, 12, 15, 17, 18. C6S-2.1: "three-fourths" in 9 of 21. C6S-2.2: Arabian Sea in Q0, 1, 2, 8, 14, 17, 18. Fix: in each concept replace three of the changed items with other ideas (2.6: the water cycle and rain, migration/trade; 2.5: Lakshadweep, the scientific settlement; 2.2: Pacific and Arctic, flora and fauna; 2.1: Antarctica as land).

M4. Items answerable from their own stem, not needing the chapter (rule: each part must need the chapter). C6S-2.3 Q6 ("2,400 km at 600 km an hour" gives 4; the speed is not in the book). C6S-2.5 Q5 ("10 states average 2 lakh each" gives 20) and Q9 (a: 100000/1300; b follows from the stem). Fix: tie the number to a chapter fact the student must supply (2.5 Q5: ask for the number of states first in a two-step; 2.3 Q6: ask "how many of the 14 countries..." type arithmetic only after a chapter fact such as "more than half of the world's oxygen" or the count of countries). Alternatively drop and swap for a concept-led item.

M5. Weak last decision. C6S-2.5 Q2(d): the choice between "library and post office" and "teams study climate" for "why India is there" has an obvious answer (the library label is plainly not a reason). Fix: offer two real reasons (research on climate vs research on environment is not a choice either; better ask what a visitor panel should say about the programme's start vs its purpose) or turn (d) into a judgement on "1981 or 1983 as the year India reached Antarctica" with the chapter's definitions.

M6. Still one-line recall in a scenario wrapper (bank allows no easy items): C6S-2.3 Q1 (NDMA), Q7 (two events cause a tsunami; the "correction" is the same line), Q10, Q13(a), Q15; C6S-2.6 Q5 (oxygen "more than half" as 5 of 10), Q13, Q14, Q7(a); C6S-2.2 Q19 (fourth largest, Antarctic); C6S-2.4 Q16 (the page's table read as five parts). Fix: make one of each pair compare or predict (for example 2.3 Q1: give two disasters and ask which body or system is meant for which).

M7. C6S-2.6 Q12(d) rubric. The key demands "the lungs role" for the inland poster, but "food and medicine" also reaches inland students (they eat fish) and the stem lets the student justify any one role. A defensible second answer. Fix: allow "accept any one role with a chapter-based reason" in the step, or narrow the stem to "the role that does not depend on living near the coast".

## LOW
L1. C6S-2.2 Q11 (rivers and lakes chart) leans on p.31 "oceans together hold most of the water". The scope_in line cites p.31-33 for oceans and not the water-share sentence; it is one line and fits the first scope item ("mostly oceans"), so acceptable. Add the clause to scope_in to remove doubt.
L2. C6S-2.1 Q17(a): key says all four cards are landmasses, "a large body of land", but Card 4 (small islands) is not large. The book supports it ("continents do not include all landmass; smaller pieces ... islands"). Reword the key: "all four are land; the book calls the smaller pieces left out of the continents islands".
L3. C6S-2.2 Q10(b): "How many oceans does her list now show" assumes the other four are in her list. Add "with the other four".
L4. C6S-2.2 Q14(b): "sailed from India towards Africa ... which sea first" depends on the starting coast. Say "from India's western coast"? That would give it away; better "from Mumbai".
L5. C6S-2.5 Q9(b): "less than 1 in 77" holds only if the planet has more than 1,00,100 islands (true, as "lakhs" means at least 2 lakh). State that in the key.
L6. C6S-2.5 Q1 and C6S-2.1 Q1 are True items; the "misconception" they correct is thin (carried over from v2 L4). Keep 3/3 balance but add a real slip in the reason.
L7. C6S-2.6 Q20 distractors are all absurd ("more than all the plastic...", "about half"); replace one with a plausible slip ("a quarter of ...").
L8. 2.5 Q16: key's step (b) says "India has more states than these 10". The chapter does not state India's number of states; it follows from "the 10 largest states of India" and from India being all states together. Judged supported and single-answer (India = all states, hence larger than its ten largest together, hence larger than Greenland). Ask the grader to accept "India is more than its 10 largest states" as the same answer.
L9. 2.1 Q3: "a little more than that" keyed to exactly 300 is fine (matches "one-fourth works out to"). No change.

## Template check
- Claim-checks, true_false: 3 True, 3 False (unchanged balance). multi_statement and assertion_reason were not changed (0 of 69), so their v2 spread stands.
- Correct option strictly longest: 0 of 27 mcq. No length tell.
- Slot order and mark profile are the same in all six concepts (loader driven); stems vary (card game, ship log, memorial stone, evacuation cell, wall map). Not templated in wording; the repeated ideas are in M3.

## Verdicts per concept
- C6S-2.1: load-ready after nothing blocking (L2, L3 optional).
- C6S-2.2: pass after fixes (M2).
- C6S-2.3: pass after fixes (M4 Q6, M6).
- C6S-2.4: load-ready.
- C6S-2.5: pass after fixes (M1 Q8 reversed option, M4, M5).
- C6S-2.6: pass after fixes (M7).

## Counts
69 changed items read (124 mechanically checked). HIGH 0, MEDIUM 7 findings, LOW 9.

Verdict: NOT load-ready. All keys are correct and nothing is a fact error, but M1 (a second defensible option in 2.5 Q8) and M2 (an unfindable "borrowed feature" in 2.2 Q15) should be fixed before loading; the other MEDIUM items are quality fixes.
