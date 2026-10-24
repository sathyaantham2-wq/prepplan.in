# Review v5: Class 6 Mathematics ch02 "Lines and Angles" (dps/class6/ch02.json), after fixes from v4

Read all 123 questions (6 concepts: 20, 21, 20, 21, 21, 20), no sampling. Every number was recomputed (python or by hand) before reading the key. Programmatic checks: every mcq/match/AR/multi_statement key text equals one of its options (0 mismatches); no duplicate options; step marks sum to question marks for every short/long item; no option or step names an option by position. Scope_out (all six lines) checked; pages under content/extracted/fegp102/pages used for book facts (transparent circle p.012, paper protractor 22.5/67.5/112.5 p.027 and p.050, reflex p.039, guessing game p.036, "unmarked" p.050).

v4 re-check:
- v4 H1 (contradictory stem, points A,B,C,D): fixed. Now "A, C, B and D lie in this order" and all five parts recompute (AB 8, AD 10, six lengths 3,5,8,2,7,10, all different).
- v4 L1 (harbour), L2 (craft week), L3 (fan), L4 (protractor purchase), L5 (silly option): all addressed. Harbour now has lamp costs; craft week (d) now compares two schedules (26 vs 23 minutes, recomputed); fan now has a binding Rs 30 budget (2 wedges too wide, 8 wedges Rs 48, only 4 wedges work); protractor purchase now compares Rs 990 against 56 vs 120 minutes (recomputed); the "folding makes paper larger" option is gone.
- v4 M2/M3/M4 repeats partly reduced (Ravi/Dev items replaced, pair-counting trimmed), but see M2 below.

Result: 1 HIGH, 4 MEDIUM, 5 LOW. Overall: pass after fixes (one mcq with a second defensible answer; the rest is polish).

## HIGH

H1. C6M-2.6, mcq (item 4 of 20), "Arun has only a semicircular protractor and must draw an angle of 300° at a point O. Which plan gives it?"
Key: "Draw a 60° angle and take the larger region on the other side, as 360° - 60° = 300°".
Problem: the distractor "Draw a 150° angle twice, side by side, because 150° + 150° makes the 300° needed" is also correct. Two adjacent 150° angles on a semicircular protractor really do form a 300° angle, and angles adding is ordinary geometry. A careful student has two defensible answers.
Fix: replace that option with a real confusion, for example "Draw a 150° angle once and call it 300°, since 150° is half of 300°", or "Draw a 120° angle and take the larger region on the other side, since 360° - 120° = 300°" (careful: that one is a false calculation, which is the intended trap, and the existing 120° option can stay as the second wrong option).

## MEDIUM

M1. Easy in disguise (answer is one book line or one operation). Please rework at least four:
- C6M-2.3 fill_blank "straws shortened from 8 cm to 5 cm ... changes by ___ degrees" (answer 0: the book's key point stated directly; same idea as 2.3 mcq on 10 cm arms and the 2.3 short Hari item, so three items on "arm length does not change an angle").
- C6M-2.5 fill_blank "18 equal spokes ... ___ degrees" (360 / 18 = 20) and C6M-2.6 fill_blank "40 divisions, 7 apart" (9 x 7): one division each, no twist. Make the 2.5 one carry a catch (for example spokes numbered 1 to 18, angle between spoke 3 and spoke 12 the shorter way).
- C6M-2.2 short "(a) Name the ray that starts at C and passes through D. (b) Can the ray from D through C be given the same name?" and the scissors short (vertex and arms): definitions only.
- C6M-2.4 mcq "Which of these turns does NOT form an acute angle?" (compare four fractions with 1/4: one step).
Fix: add a wrong reading to diagnose or a second step.

M2. Repeated idea, wheel with equal spokes: C6M-2.5 fill_blank (18 spokes), C6M-2.5 case (23/24/30/36 spokes), C6M-2.6 mcq (24 spokes, right angle), C6M-2.6 short (30 spokes, largest acute angle). Four items, one calculation (360 divided by n, then multiples). Fix: replace the 2.6 mcq with a different kind of item (for example the kind of angle between a given pair of clock hands) and keep one of the other two.

M3. Repeated pair in C6M-2.5: mcq "hour hand at 2, minute hand at 9, smaller angle" (150) and short "minute hand from number 2 to number 9" (210 and 150) use exactly the same two numbers and the same 7-gap and 5-gap argument. Fix: change the numbers in one (for example 4 and 11, or 3 and 10 with a different question) or drop the mcq.

M4. Three-statement format: all six multi_statement items use Statements 1, 2, 3 (keys 2 and 3 only, 1 and 3 only, 1 only, 2 only, 1 and 2 only, 3 only). The Maths house style is two statements (I, II). The owner left this as a known inconsistency, so it is noted only. Key spread is good (six different keys; no "all three" key).

## LOW

L1. C6M-2.2 harbour case (d): plan X misses ship B (12 km, beyond the 10 km range) and plan Z (a spare third lamp) is over budget, so plan Y is the only one left. The "choice" is a check, not a trade-off. Make Z a real alternative, for example two lamps at a different place that also reach everything at a different price.
L2. C6M-2.4 windmill case (d): 12 blades is over budget and 4 and 6 blades fail a stated need, so 8 is forced. Fine as a check; lower the budget to 1,900 only if a real trade-off is wanted.
L3. C6M-2.5 spoke case (d) says "Either is accepted" between 24 and 30 spokes; fine (both satisfy the needs), but give one extra need (for example a spare of at least Rs 50) if a single recommendation is wanted.
L4. C6M-2.3 AR: R ("size of an angle depends on lengths of its arms") is false so the key (A true, R false) stands whatever one thinks of A. A is true per p.012 ("without superimposition"). No change.
L5. True/False items whose verdict is True (C6M-2.2 "can be named angle NMK or KMN", C6M-2.5 "150 outer is 30 inner"): the misconception is thin when the statement is true. Make one of them false.
L6. Slot order: five of six concepts still follow mcq x5, fill_blank, multi_statement, assertion_reason, [match], short x8, long x4 (2.3 opens with multi_statement; 2.4 opens with a long answer). The Bloom/difficulty labels are Hard/Hardest everywhere. Reorder the middle of two concepts to loosen the spine.

## Per-concept verdicts

- C6M-2.1: pass (all recomputed; the A,C,B,D stem is fixed).
- C6M-2.2: pass (M1 recall pieces; L1).
- C6M-2.3: pass (M1 fill_blank of 0; L4).
- C6M-2.4: pass (M1 NOT acute; L2).
- C6M-2.5: pass (M1, M2, M3; L3, L5).
- C6M-2.6: pass after fix (H1 second defensible answer; M1, M2).

## Template check (counts)

- multi_statement keys: 6 distinct of 6 (M4 on format only).
- assertion_reason keys: both true and R explains 2 (2.1, 2.4), both true and R does not explain 1 (2.5), A false R true 2 (2.2, 2.6), A true R false 1 (2.3). Spread fine.
- claim_check verdicts: No 4, Partly 2, Yes 1. Fine.
- Correct option longest in mcq: 2.1 2 of 5, 2.2 0, 2.3 0, 2.4 3, 2.5 3, 2.6 0 (8 of 30 in total). No pattern.
- Slot order identical in 4 of 6 concepts (L6). Stems are distinct at item level; repeats are in M2 and M3.
- Case studies: 12; money frame in 7, non-money in 5. No strawman beyond L1/L2.

## Counts read

123 questions read; 1 HIGH, 4 MEDIUM, 5 LOW. Not heavily templated (slot spine only). Verdict: pass after fixes (fix the 300-degree mcq option; polish the rest if time allows).
