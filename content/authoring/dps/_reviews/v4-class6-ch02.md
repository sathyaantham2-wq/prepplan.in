# Review v4: Class 6 Mathematics ch02 "Lines and Angles" (dps/class6/ch02.json), after fixes from v3

Read: 123 questions (6 concepts: 20, 21, 20, 21, 21, 20), no sampling. Every number was recomputed (python or by hand) before reading the key. Programmatic checks: every mcq/match/AR/multi_statement key text equals one of its options (0 mismatches); no duplicate options; step marks sum to the question marks for all items; no option is named by position. Scope_out checked: no complementary/supplementary pairs, no compass constructions, no triangle angle sum, no parallel lines, no named theorems, no minutes/seconds (22.5 degrees is a half-degree multiple, allowed). Pages under content/extracted/fegp102/pages used for book facts.

v3 items re-checked:
- v3 H1 (guessing-game model answer): fixed. New clause "90 for 83 (17 points) is punished almost as hard as an 18-degree error of the right kind (18 points)" is true. Totals re-verified: Team 2 = 10+7+10+5+13 = 45, Team 1 = 6+9+8+20+7 = 50; wrong-kind guesses Team 2 once (90 for 83), Team 1 none; with penalty 55 vs 50. Correct.
- v3 M1 (OT, OS, OR, OQ 5-mark): now needs scale conversion (125 -> 55, 40 -> 140), reflex 255 and the "between" argument in (e). Computed: 50, 35, 70, 120, 255. Good; the Hardest slot now thinks.
- v3 M2/M3/M5 (clock-hand book item, TER 80 / BET 100 item, Zoya duplicate): gone. Zoya is now the cupboard-door reflex item. Fixed.
- v3 L1 (trim vs rebuild): now priced per centimetre. Recomputed: trim arm 1 Rs 12, trim arm 6 Rs 24 (rebuild Rs 20 is cheaper), need 3 more arms: 12 + 20 + 20 = Rs 52. Correct and a real trade-off.
- v3 L2 (fan): the 25-degree wedge limit added. Unique answer 8 wedges at Rs 48. Fixed (budget is now nearly decoration, see L3).
- v3 L5, L6, L7: "I am a whole-number acute angle" now a table; chart (a) counts "none of the three" (2); fill_blank for pointer turns now asks half turns (3). Fixed.

Result: 1 HIGH, 5 MEDIUM, 6 LOW. Overall: pass after fixes (one contradictory stem; everything else computes).

## HIGH

H1. C6M-2.1, long answer (5 marks, Hardest), "Four points A, B, C and D lie in this order along one straight line with AC = 3 cm, CB = 5 cm and BD = 2 cm, where C lies between A and B."
Problem: the stem contradicts itself. "In this order A, B, C, D" puts B before C, but the next clause puts C between A and B (and the key uses the order A, C, B, D). With the order A, B, C, D the data AC = 3, CB = 5 is impossible (CB cannot exceed AC), so a careful student cannot answer (a) to (e) as stated; a student who ignores "in this order" gets the key. This is a stem error, so it is HIGH even though the key arithmetic is right (AB 8, AD 10, six lengths 3, 5, 8, 2, 7, 10 all different; CD = 7 contains B).
Fix: write "Four points A, C, B and D lie in this order along one straight line with AC = 3 cm, CB = 5 cm and BD = 2 cm." and delete ", where C lies between A and B".

## MEDIUM

M1. Easy in disguise (answer is a one-line book fact), no twist: C6M-2.3 mcq "Which of these is NOT needed when two angles are compared by superimposition?" (book statement: arm length does not matter; the other three options are the book's own steps); C6M-2.4 short "Vidya turns the cover of her book. (a) fraction for a straight angle (b) for a right angle" (half, quarter); C6M-2.4 short "Describe, in steps that a friend ... how to fold a sheet to get a crease perpendicular" (book procedure); C6M-2.2 short "Write two differences between a ray and a line segment" (definitions); C6M-2.6 short "Write the readings you would use to draw a 75 and a 150 angle" and short "Team 2 guessed 62 for 71 ... find its points" (one subtraction each, then name acute). Rework at least four: add a given wrong reading to diagnose, a mixed set, or a second step (for example in the guessing-game item give a team whose guess is a reflex and ask which kind rule makes the score fair).

M2. Repeated idea "which protractor scale do I read": C6M-2.5 mcq (outer 65 / inner 115), C6M-2.5 short Ravi (outer 50 / inner 130), C6M-2.6 mcq Sana (0 at the left end, 40), C6M-2.6 short Dev (112, other scale 68), plus the 2.5 five-mark (b). Five items, one idea. Fix: keep the mcq and the 5-mark; replace Ravi with an angle whose arm does not lie on 0 but whose two readings are on different scales given as a trap (e.g. arm at outer 30 and arm at inner 50, which is a subtraction only after converting); replace Dev with a draw-an-angle error (centre placed on the wrong end).

M3. Repeated idea "360 is not divisible / whole-degree parts": C6M-2.5 mcq (11 wedges), short_impossible (7 parts), multi_statement S2 (9 parts), spoke case (b) (23 spokes), C6M-2.6 fill_blank / mcq (24, 40 divisions) are all the same divisibility check. Fix: change the mcq to a different count question (for example the angle between 2 numbers 5 apart on a clock) or the S2 statement to another fact.

M4. Repeated counting idea. C6M-2.2: angles from n points appears in fill_blank (5 points, 30), 5-mark (4 and 5 points) and the park case (3, 4, 5 paths): three items, the same pattern. C6M-2.1: pair counting appears in the bus-stop mcq (10), villages (6), pegs case (10 segments) and hamlets case (6 segments); the "4 x 3 / 2" in the villages key is the author's shortcut, not the book's (the book lists pairs). Fix: keep two per concept, replace the others with naming an angle in a given figure, or a segment-and-ray identification with a described figure.

M5. Three-statement format: all six multi_statement items use Statements 1, 2, 3 (keys "2 and 3 only", "1 and 3 only", "1 only", "2 only", "1 and 2 only", "3 only"). The Maths house style is two statements (I, II); the loader accepted it and the owner left this inconsistency as known, so it is only noted here. Key spread itself is varied (no "all three"; 3 is correct by exactly one statement six times: harmless but "all three" appears only as a distractor). No change required if the owner keeps the known inconsistency.

## LOW

L1. C6M-2.2 harbour case (d): one lamp at C aimed at A misses B (12 km > 10 km range), two lamps at S cover all. Dominant plan is obvious (no cost given). Add a cost per lamp or a power limit so the cheaper plan competes.
L2. C6M-2.3 craft-week case (d): total of 15 pairs makes C obviously faster (60 vs 25); and part (c) is not used in (d). Add a day on which C is slower overall, or drop (c).
L3. C6M-2.4 fan case: with the 25-degree limit only 8 wedges pass, so the Rs 50 budget no longer decides anything. Fine as a check, but make the budget bind (Rs 40) or add a 16-wedge option that passes the angle and fails the budget.
L4. C6M-2.5 protractor purchase case (d) is dictated ("as many circular ones as the Rs 1,000 allows"), so no real decision remains except the closing weighing sentence. Drop "as many as allows" and ask which purchase to recommend.
L5. C6M-2.2 mcq wrong option "folding twice makes the paper larger" is silly (C6M-2.4 mcq on two folds). Replace with "They are right angles again, since the first fold already made a right angle" style confusions.
L6. Correct option is longest in 8 of 30 mcq by raw characters (per concept 2, 0, 0, 3, 3, 0): fine, no pattern. Slot order: five concepts open with 5 mcq, fill_blank, multi_statement, assertion_reason, [match], 8 short, 4 long; C6M-2.3 and C6M-2.4 move one item to the front. Still one fixed spine; reorder the middle of two more concepts.

## Template check (counts)

- Slot order: 4 of 6 concepts identical in type order; Bloom/difficulty all Hard/Hardest. Stems are distinct at item level, so moderately templated by slot only.
- multi_statement keys: six different keys (see M5). assertion_reason keys: "both true, R explains" 2 (2.1, 2.4), "both true, not explain" 1 (2.5), "A false R true" 2 (2.2, 2.6), "A true R false" 1 (2.3). In C6M-2.4 R almost restates A (R contains "so they are equal ... made of two right angles"); acceptable.
- claim_check verdicts: No 4, Partly 2, Yes 1. OK.
- Case studies: 12; money/budget frame in 6 (hamlets, park, windmill, fan, protractors, spokes) plus craft time; non-money: harbour, pegs, chart/time, guessing game, arms. Acceptable.
- Reversal: C6M-2.3 mcq (NOT needed), C6M-2.4 mcq (NOT acute) present; reverse-tagged create items in 2.1, 2.2.

## Per-concept verdicts

- C6M-2.1: pass after fix (H1 stem contradiction; M4 pair counting).
- C6M-2.2: pass (M1 ray vs segment recall; M4; L1).
- C6M-2.3: pass (M1; L2).
- C6M-2.4: pass (M1; L3; L5).
- C6M-2.5: pass (M2, M3; L4).
- C6M-2.6: pass (M1, M2; guessing-game key now correct).

## Counts read

123 questions read; 1 HIGH, 5 MEDIUM, 6 LOW. Overall: pass after fixes (one stem to correct; the rest are recall/repetition polish).
