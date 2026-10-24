# Review: Class 6 Mathematics ch02 "Lines and Angles" (dps/class6/ch02.json), independent review

Read: 123 questions (6 concepts: 20, 21, 20, 21, 21, 20), no sampling. Every key recomputed in python or by hand before reading the stored answer; every mcq/match/AR/multi_statement key text was checked to equal one of its options (0 mismatches); no option is named by position anywhere. Pages under content/extracted/fegp102/pages were opened for book facts. An earlier review file at this path was read and cross-checked; its two HIGH findings are confirmed independently below (H1, H3), and the points it raised that I also verified are merged in.

Result: 3 HIGH, 10 MEDIUM, 8 LOW. All other keys, sums and costs are correct.

## HIGH

H1. C6M-2.1, case_study (hamlets) "no three hamlets lying in a straight line. The distances in km are AB 3, BC 4, CD 5, DA 6, AC 7 and BD 8."
Problem: AB 3 + BC 4 = AC 7, so A, B, C are collinear. This contradicts the stem and breaks the chain-versus-direct-segment reasoning in (c). The key arithmetic (33 km, Rs 13,20,000, chain 12 km, 6 km longer) is right for the numbers as written.
Fix: change AC to 5 (triangles ABC 3,4,5; ACD 5,5,6; ABD 3,6,8; BCD 4,5,8 all valid). New total 31 km, cost Rs 12,40,000, over Rs 10 lakh; update the (b) answer and step 2 text. Chain figures unchanged.

H2. C6M-2.4, short_answer (2 marks) "The numbers of acute angles in three successive figures of a pattern are 3, 12 and 21. (a) ... next two figures. (b) ... 10th figure?"
Problem: no figure or rule is given; 3, 12, 21 fit more than one rule, so "30, 39, 9n - 6, 84" is only the most likely guess (second defensible answer). It also needs nothing from the chapter (acute/obtuse/right) and 9n - 6 is above the chapter.
Fix: replace with a described fold sequence (straight angle folded to a right angle, then folded again, and again): how many equal wedges fill a half turn and what fraction of a full turn each is after 1, 2, 3 folds, and what kind of angle.

H3. C6M-2.6, mcq "Sana wants to draw angle XYZ = 40 degrees ... base ray YZ pointing to the left ... lines YZ up with the 0 at the left end ... Where should she mark X?"
Problem: key "At 40 on the scale that has its 0 on the ray YZ (the inner scale here)". Another option reads "At 140 on the scale that starts at the right end, because the base ray points left". With the base ray at the left, the point at 40 on the left-start scale is the same physical mark as 140 on the right-start scale (40 + 140 = 180). So that option also marks X correctly and its reason is true: two defensible answers. The stem also never says which scale is the inner one.
Fix: replace that option with a genuine error, for example "At 140 on the scale that has its 0 on the ray YZ, because the angle is measured the long way round", or "At 50 on the scale that has its 0 on the ray YZ". Drop "(the inner scale here)".

## MEDIUM

M1. C6M-2.3 (slit items: "R5 straws 15 cm", arms 1 and 6 with 12 and 15 cm, "State the two things that decide whether it passes"). The book (p. 26) says only that the arm passes if its angle equals the slit's "as long as they are shorter than the length of the slit". It never says longer straws fail; the key treats that as a firm failure. Fix: state it in the stem ("an arm whose straws are not shorter than the slit does not fit") or drop the long-straw cases. In the Aman item R1 (10 cm) is listed and never asked about; delete it.

M2. C6M-2.1 repeats pair counting n(n-1)/2 in about 8 of 20 items (five bus stops, villages, Ravi's 7 houses, water points, hamlets, bus pads). n(n-1)/2 is not in this book. Keep two; replace the rest with end points, naming a line by a small letter (l, m), uniqueness of a line, and why a line cannot be drawn completely.

M3. C6M-2.1 bus-pad case (Rs 120, Rs 2,500) and C6M-2.2 park-plates case (Rs 15, Rs 70): parts (a) to (c) are counting and arithmetic answerable from the stem, and both end with "Rs 20 short, ask for more". Same frame twice. Give each part a chapter step (for example whether a ticket for QP is separate from PQ) and vary the final tension.

M4. C6M-2.3 case study (Method T against Method C): pure minutes arithmetic; the chapter is only the setting. Part (a) is also ambiguous: key counts the 10-minute circle-making for Tuesday (22 minutes) but part (b) says the circle is made on Monday, so Tuesday alone would be 12 minutes. State whether the circle is made on the day in (a), and add a part that needs angle knowledge (which pairs the eye can settle, which need the circle).

M5. C6M-2.3 eight-arms case: the last part (trim Rs 3 against rebuild Rs 20, need 5 arms) has an obviously dominant choice (strawman). Make it a real trade-off or ask which arms may not be trimmed.

M6. C6M-2.4 windmill case and Rohit's fan case: same frame (equal subdivision, per-item cost, budget, "or the larger option if Rs X more"). In the windmill case 4 blades is both cheapest and meets both needs, so there is no real choice. In the fan case "wedge angles to look fine" is not a criterion and the key accepts 4 or 8. State a measurable criterion (for example wedges must be acute) so two options qualify at different cost.

M7. Repeated ideas in C6M-2.5 and 2.6: 360 not divisible by 7 appears in the mcq, the baker, the show_impossible, multi_statement S2 and the spoke case study (5 items); equal spokes again twice in C6M-2.6. C6M-2.2 angle counting from n points: idx 2, 5, 11, 17, 19. C6M-2.6 "unmarked 102, marked 258" appears in both the short answer and the claim check. Keep one or two per idea; use the freed slots for bisecting by folding, perpendicular lines as a named idea and protractor reading, which are thin.

M8. Items lifted from the book's own examples and exercises (a student may have seen the exact answer): C6M-2.5 clock item (1, 4 and 6 o'clock, the book's Figure it Out Q1, p. 45) and the 20 and 55 example (also parts (a) and (b) of the 5-mark item); C6M-2.6 mcq with angle TER 80 and BET 100 (book's Let's Explore) and the 5-mark R, E, B item; the 102 and 258 pair (book's PTW and WTP). Change numbers and settings.

M9. Easy in disguise (answer is a one-line book fact, whatever the label): C6M-2.3 fill_blank ("equal"); C6M-2.4 door mcq (obtuse), fill_blank (two straight angles is 1 turn), and "say what makes acute and obtuse"; C6M-2.5 5-mark paper-protractor item (360, 180, 90, 45/135, 112.5/157.5 are five book facts) and the "steps for measuring" item; C6M-2.6 "list gives the steps in order" mcq (tagged scenario with no scenario) and "steps to draw 112"; C6M-2.2 show_impossible on rays with different starting points (the definition restated); C6M-2.1 items on shortest path and segment against line. C6M-2.5 5-mark "Five arms" is five subtractions and part (e) merely adds two numbers, not "Hardest" 5-mark thinking. Add a twist (a wrong given reading, mixed scales, an unmarked-angle reading) or lower the marks.

M10. C6M-2.4 assertion_reason (crease is straight; so a folded straight angle gives two right angles): both true, key says R does not explain A. R is a step the book uses (p. 28: a fold makes a straight crease through O), so "R explains A" is defensible. Replace R with a clearly independent true statement or a clearly explanatory one and re-key.

## LOW

L1. C6M-2.2 mcq (Raju, Meera, ray OA through B): "goes on past A" implies B beyond A; B may lie between O and A. Say "a point B on the ray".
L2. C6M-2.5 mcq (Rima's paper protractor, "new crease between 90 and 180"): 112.5 is a later crease; say "after this one fold".
L3. C6M-2.6 "I am a whole-number acute angle" is tagged Create but is analysis; it also solves inequalities with an unknown, above the chapter. Retag Analyse or give a table to fill.
L4. true_false verdicts: C6M-2.2, 2.3 and 2.5 are all True with a restated fact; make at least one a False with a tempting wrong reason.
L5. C6M-2.6 short (150 degrees, "how does the kind change and what does the mark's position tell you") is vague and the key adds a 30 degrees point never asked. Ask a direct question.
L6. C6M-2.4 mcq distractor "One straight angle that has become a full turn after folding" is not a real confusion; use "Two equal angles, each a straight angle".
L7. Correct option longest in 16 of 30 mcq (53%): per concept 2, 4, 4, 2, 2, 2 of 5; keys carry "because ..." clauses the distractors lack (2.2 and 2.3 at 4 of 5). Give every option a reason clause or none.
L8. claim_check verdicts over 7: No 4, Yes 2, Partly 1; make one more "Yes" hide a subtle error. C6M-2.1 Ravi's 21 wires and C6M-2.6 Kiran only confirm; make one claim a plausible wrong count.

## Template check (counts)

- Slot order is almost identical in every concept: 5 mcq, fill_blank, multi_statement, assertion_reason (match in 3), 5 short 2-mark items, then 3-mark items in the order claim_check / show_impossible / apply or create, then 4 long answers ending in two case studies. Only 2.3 and 2.4 shuffle the start. Each concept has one claim_check, one show_impossible, one true_false, one reverse or create. Shuffle slot order in at least three concepts.
- Case studies: about 10 of 12 use "unit cost times count against a budget, small overrun, either option accepted". Make at least four non-money (range, fit, safety) like the harbour searchlight item in C6M-2.2, which is good.
- multi_statement keys: "2 and 3 only", "1 and 3 only", "1 only", "2 only", "1 and 2 only", "3 only" (no "all three"). assertion_reason keys: 2 both-true-explains, 2 A false R true, 1 A true R false, 1 both true not explaining (good spread). 3-statement format is used throughout.
- Difficulty tags are all Hard or Hardest. Bloom: Analyse 54, Apply 34, Evaluate 27, Understand 5, Create 3.
- Verdict: moderately templated at slot and case-study level, fixable; individual stems are mostly distinct and the maths is accurate.

## Per-concept verdicts

- C6M-2.1: pass after fixes (H1; pair counting repeated; M3).
- C6M-2.2: pass after fixes (no wrong key; angle counting repeated; M3; L1). The searchlight case is a good decision item.
- C6M-2.3: pass after fixes (M1, M4, M5, fill_blank recall).
- C6M-2.4: pass after fixes (H2, M6, M10, recall items).
- C6M-2.5: pass after fixes (M7, M8, M9 incl. the 5-mark recall item).
- C6M-2.6: pass after fixes (H3, M8, L3, L5). The guessing-game case and the chart-time case are strong and fully recomputed.

## Counts read

123 questions read; 3 HIGH, 10 MEDIUM, 8 LOW. Overall: pass after fixes.
