# Review v3: Class 6 Mathematics ch02 "Lines and Angles" (dps/class6/ch02.json), after fixes from v2

Read: 123 questions (6 concepts: 20, 21, 20, 21, 21, 20), no sampling. Every number was recomputed in python or by hand before reading the key. Every mcq/match/AR/multi_statement key text equals one of its options (0 mismatches). No option is named by position. Book pages under content/extracted/fegp102/pages were opened for book facts.

v2 items re-checked after the fix:
- H1 hamlets: AC is now 5. Triangle inequalities hold for ABC (3,4,5), ACD (5,5,6), ABD (3,6,8), BCD (4,5,8). 31 km, Rs 12,40,000, chain 12 km vs 6 km, the 25 km limit (Rs 10 lakh / Rs 40,000) are all correct. Fixed.
- H2 acute-angle pattern item: gone. The fold items (1/4, 1/8, 1/16) are unambiguous. Fixed.
- H3 protractor mcq: the "140 on the right-start scale" option is now "140 on the scale whose 0 lies on YZ", a real error. Exactly one defensible answer. Fixed.
- M1 (slit rule stated in stem), M4 (circle made Monday, part c now needs angle kinds), M10 (AR re-keyed: R now explains A) all fixed and correct.

Result: 1 HIGH, 6 MEDIUM, 8 LOW. Overall: pass after fixes (one false sentence in a model answer; everything else computes).

## HIGH

H1. C6M-2.6, case study (guessing game, 4 marks), model answer to (d): "it can make one near-boundary guess (90 for 83) cost more than a 20-degree error."
Problem: false by the chapter's own numbers. 90 for 83 costs 7 + 10 penalty = 17 points, which is less than Team 1's 20-point error in round 4. A student who follows the model answer is taught a wrong comparison. (All totals are right: Team 2 45, Team 1 50; wrong-kind guesses Team 2 once, Team 1 none; with penalty 55 vs 50.)
Fix: replace the clause with a true one, for example "but it adds 10 points to a guess that was only 7 degrees out, so a guess of 90 for 83 (17 points) is punished almost as hard as an 18-degree error of the right kind (18 points)", or say "it can turn a team's lead into a loss, as here (45 against 50 becomes 55 against 50)".

## MEDIUM

M1. C6M-2.5 long answer "Five arms OT, OS, OR, OQ and OP" (5 marks, Hardest): parts (a) to (d) are four subtractions and (e) adds 165 and 15. One-line book skill, not Hardest 5-mark thinking. Fix: give two readings from different scales, or an arm whose reading is on the other scale, or an angle that needs 360 minus the unmarked one, so the scale choice is the hard part. Same for C6M-2.6 "K, L, M" 5-mark (all 180 minus or 360 minus): add a trap such as a given reflex reading.

M2. C6M-2.5 repeated idea: short answer "Ravi measures ... 50 outer, 130 inner" and short answer "Zoya ... 50 outer, 130 inner" are the same item with the same numbers (acute-looking angle, read the scale with 0 on the arm). Add the mcq with 65/115 and C6M-2.6 mcq/short (Dev, Sana) and the scale-choice idea appears five times. Fix: keep one of Ravi/Zoya; replace the other with reading an angle from a protractor whose base is not at 0 (subtracting), or the unmarked-angle idea.

M3. Repeated idea "360 is not divisible by 7 / not a whole number of degrees": C6M-2.5 mcq (7 wedges), baker (b), show_impossible, plus the 23-spoke case study (b) and C6M-2.5 multi_statement S2. Keep the show_impossible and the spoke case; change the mcq to another count (11 or 13) and the baker to a different design question.

M4. C6M-2.2 angle counting from n points appears at five places: mcq (4 points, 12), fill_blank (5 points, 30), short (A, B, C, D), 5-mark (4 and 5 points), plus the park case (3, 4 and 5 paths). C6M-2.1 pair counting (bus stops, villages, water points, hamlets, pegs) is down to five items but still the main idea; n(n-1)/2 is not in this book (the "4 x 3 / 2" in the villages key is the author's tool, not the book's). Fix: keep two per concept; replace the others with perpendicular creases, naming a line by a small letter (l, m), reading a ray name, or an angle in a figure with a given picture.

M5. Book-lifted items (a student may have met the exact answer): C6M-2.5 short "hands of a clock make 30 at 1 o'clock ... 4 o'clock and 6 o'clock" is the book's own Figure it Out Q1 (pages 033 and 051); C6M-2.6 mcq with angle TER 80 and BET 100 and the R, E, B setting is the book's Let's Explore. Change the numbers and the setting (for example 3 o'clock and 9 o'clock with a different hour hand question, or angle 65 and 115).

M6. Easy in disguise (answer is a one-line book fact): C6M-2.6 mcq "Which list gives the steps for drawing an angle ... in the correct order?" (pure recall of the procedure, and wrong lists are obviously wrong); C6M-2.4 short "In terms of turns, say what makes an angle acute and what makes an angle obtuse" (definition); C6M-2.4 5-mark "Justify that every obtuse angle is larger than every acute angle" (parts a, b, e are definitions; only c and d think); C6M-2.3 short "State the two things that decide whether it passes" and "Describe, in order, how you would use a transparent circle" (book procedure); C6M-2.2 show_impossible on rays with different starting points (the definition restated); C6M-2.1 short "Why can nobody draw a complete picture of a line?" and "State two differences between the line segment AB and the line AB". Add a twist (a wrong given reading, a mixed set of kinds, a named counter-example) or lower to 1-2 marks of easy, but the bank allows none: rework at least four of these.

## LOW

L1. C6M-2.3 case study (eight arms, part d): trimming Rs 3 against rebuilding Rs 20 has an obvious dominant plan (strawman decision). Make trimming limited (an arm shorter than 6 cm after trimming is unstable) or give a time cost, so trim-versus-rebuild is a real trade-off.
L2. C6M-2.4 fan case: with the stated criteria (acute, budget Rs 50) the 4-wedge fan dominates (cheaper, meets both) and "8 has finer wedges" is not a stated need. Add a measurable need such as "wedges must also be at most 25 degrees" to separate 4 and 8 wedges. Also, the windmill case (8 vs 12 blades) is a real choice only because of the budget; fine, but it repeats the "cost per item against a budget" frame.
L3. C6M-2.5 spoke case (23 vs 24 spokes): part (b) already shows 23 fails the whole-number condition, so (d) is decided by (b); the Rs 12 saving is a token tension. Offer 24 vs 25 vs 26 spokes so more than one option satisfies "at most 16 degrees" and the whole-number need.
L4. C6M-2.5 protractor purchase case (d): mixed purchase is dominated by all-semicircular (Rs 750, extra step for 20 percent). Either offer a time cost for the extra step or drop the mixed option.
L5. C6M-2.6 "I am a whole-number acute angle" solves inequalities with x (3x < 90, 4x > 90): algebra above this book. Reword as a table to fill (try 20, 22, 23, 29, 30, 31 and say which fit).
L6. C6M-2.6 chart case (a) asks only acute, obtuse and reflex while the chart has a right angle (90) and a straight angle (180); say "how many are neither acute, obtuse nor reflex" so the count of 10 closes.
L7. C6M-2.4 fill_blank answer "1.5" (pointer turns): accept "3/2" and "1 1/2" in the key note or ask for the number of half turns (3) so a machine can match.
L8. Correct option is the longest in 17 of 30 mcq (57 percent): per concept 2, 4, 4, 3, 2, 2. Concepts 2.2 and 2.3 are 4 of 5. Trim the "because ..." clause on the key or add one to the distractors.

## Template check (counts)

- Slot order: C6M-2.1, 2.2, 2.5, 2.6 are identical (5 mcq, fill_blank, multi_statement, assertion_reason, [match], 5 short 2-mark, 3 short 3-mark, 2 five-mark, 2 four-mark). C6M-2.3 puts the multi_statement first and 2.4 puts a case study first; after that they are the same. Still one fixed spine; reorder the middle of at least three concepts.
- multi_statement keys: one each of "2 and 3 only", "1 and 3 only", "1 only", "2 only", "1 and 2 only", "3 only"; no "all three" (3-statement format; this house style asks 2 statements, I and II; the note in CLAUDE.md allows the Maths house style, loader accepted). assertion_reason keys: 3 both true/R explains, 2 A false R true, 1 A true R false; the 3 "R explains" keys are for 2.1, 2.4, 2.5 and in 2.5 R ("two right angles form a straight angle") is almost the definition: make it a clearly weaker or independent R.
- claim_check verdicts: No 4, Partly 2, Yes 1. OK.
- Case studies: money-and-budget frame in 6 of 12 (hamlets, park plates, windmill/fan, protractors, spokes, chart/hire); non-money ones are the harbour, pegs, guessing game, craft-time, arm-fitting. Acceptable now.
- Difficulty is all Hard/Hardest; Bloom spread is sensible.
- Verdict on templating: moderately templated at slot level, not at item level; stems are distinct, keys correct.

## Per-concept verdicts

- C6M-2.1: pass (pair counting still four times; hamlets now correct).
- C6M-2.2: pass after fixes (M4 angle counting repeated; M6 show_impossible is a definition).
- C6M-2.3: pass (L1; M6 recall items).
- C6M-2.4: pass (M6; L2).
- C6M-2.5: pass after fixes (M1, M2, M3, M5; L3, L4).
- C6M-2.6: pass after fixes (H1 false clause in the guessing-game key; M1, M5, M6).

## Counts read

123 questions read; 1 HIGH, 6 MEDIUM, 8 LOW. Overall: pass after fixes.
