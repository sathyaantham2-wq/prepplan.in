# Review v3: Class 8 Maths, Part I ch1 "A Square and a Cube" (hegp101), re-review after one fix pass

File: content/authoring/dps/class8/ch01.json (127 questions: C8M-1.1 21, 1.2 21, 1.3 22, 1.4 21, 1.5 21, 1.6 21). Indexes are 0-based positions in each concept's question list.
Method: matched against the pre-edit copy by exact item content, 50 items are new or changed and each of those was read in full and recomputed in python or by hand (squares, cubes, factorisations, sums of odd numbers, taxicab pairs, budget and box counts, the two-cube leftover search). The 77 unchanged items were already cleared in v2 and were only re-checked structurally (option at o[0], no duplicate options, step totals, position wording). Pages 13 (cubes, zeros, taxicab) checked, plus the scope_in list in content/authoring/class8/ch01.json.

Structural checks, all 127: option items with the correct option at o[0] 44 of 44; no duplicate option values; step marks sum to marks on every item that has steps; no option named by position; multi_statement items all use the three-statement format the skill requires.

## v2 status

| v2 item | Status |
|---|---|
| 1 positive-root dependence (1.4[5], [4], [7], [0]) | Fixed. [5] now says "positive square root" and is restricted to decimals that are squares of decimals; [4] says "positive". |
| 2 two-roots items, [9] and [13] | Fixed. [9] is now an MCQ on units digit and bracket; [13] is a decimal-places repair. |
| 3 1.6[17] out of scope (successive cube differences) | Fixed. Replaced by the 4,104 taxicab search (book p.13). |
| 4 1.6[20] stopping rule | Fixed. Stem now says "at most two solid cubes (no more)"; I searched all two-cube pairs, the true minimum leftover is 42 (edge 9 and 9), so plan (c) is also the global optimum. |
| 5 1.4[19] strawman roof decision | Partly fixed, see LOW 1. |
| 6 locker repeat in 1.1 | Fixed. Seed-bed and Ravi items replace [1] and [4]; locker case study and the factor-pair item remain, which is fine. |
| 7 reject-by-two-tests frame in 1.2 | Fixed. The five-houses item is now a parity/flag-bearer case study; one reject frame remains (1.2[18]). |
| 8 1.5[17] / 1.6[18] twin frame, 1.5[8] / 1.6[0] | Fixed. 1.5[13] is now Plan A / Plan B; 1.6[18] is three sugar trays with a bracketing finish; 1.6[0] is a 12-children block. |
| 9 easy-in-disguise (about 25) | Mostly fixed, see MEDIUM 2 for what is left. |
| 10 identical tail and slot order | Fixed enough. Tails now differ (e.g. 1.2 ends lo5 lo5 lo4, 1.3 ends with a 3-mark show-impossible, 1.4 has sh3 between case studies); fill_blank sits at positions 8, 9, 7, 7, 7, 5. Difficulty is still only Hard (93) and Hardest (34), which matches the "no easy" rule. |
| 11 case-study parts answerable from the stem | Fixed. 1.6[19](a) now completes the table; 1.1[20] (a)-(b) feed a cost decision. |
| 12 1.4[7] fraction answer | Fixed. Now "perimeter as a decimal", answer 3.5. |
| 13 case studies ending in a puzzle | Mostly fixed. Decisions now close 1.1[20], 1.2[12], 1.3[17], 1.4[16], 1.5[13], 1.5[19], 1.6[14], 1.6[19]. |
| LOW: 1.1[12] perfect-square wording | Fixed (now [13], stem defines it). |
| LOW: 1.3[6] and [14], 1.6[2] longest correct option | 1.3[6] fixed. 1.3[14] and 1.6[2] still have the strictly longest correct option, see LOW 4. |
| LOW: 1.5[20](d) Dev strawman | Fixed (now [19](d), Dev is half right and the bracket completes it). |

## HIGH
None. Every changed key recomputes and each has exactly one defensible answer. Notable re-checks: 1.1[20] Shop P 12 boxes x Rs 216 = 2,592 against Shop Q 9 boxes x Rs 300 = 2,700, saves 108; 1.2[5] 120,000 is the only 6-digit option with exactly 4 trailing zeros; 1.2[9] 75^2 = 5,625 is the only square in 5,000-6,000 ending 25; 1.2[12] 29^2 - 784 = 57 and 784 - 27^2 = 55; 1.4[16] 49 x 2.56 = 125.44 and 49 x 16,000 = 7,84,000; 1.4[17] widest path 3 m (468 against 500, 4 m gives 640); 1.5[13] 6,300 = 2x2x3x3x5x5x7 so 7 schools and side 30, or 7 crates and side 210; 1.5[19] all four factorisations multiply back to 2,916, 3,872, 4,624, 2,304; 1.6[0] 216 and then 1,728; 1.6[16] 21,60,000 has 4 zeros, divide by 10 gives 60^3; 1.6[17] 4,104 = 2^3+16^3 = 9^3+15^3 (python finds only these two); 1.6[18] 17^3 = 4,913 < 5,572 < 5,832 = 18^3; 1.6[19] 65^3 = 2,74,625 and 47^3 = 1,03,823.

## MEDIUM

1. C8M-1.6[9] (true_false) "Since 13,824 is a perfect cube ending in 4, its cube root must end in 4 and lie between 20 and 30, so the cube root is 24." The stem is the whole solution and every clause is true, so the learner only confirms it. There is no misconception to catch and the reason asked for restates the stem. Fix: make the stem carry one false step (for example "must end in 6 because 4 x 4 = 16") and ask for the correction, or turn it into a plain MCQ/short item that asks for the root.
2. Easy-in-disguise survivors (one chapter fact, one step). Bank allows none. C8M-1.1[0] (0.36 x 50, one step); C8M-1.1[1] (9/16 x 32, one step); C8M-1.4[12] (area 400 split in 4 equal squares, side 10); C8M-1.6[12] (edge doubled, cube count x 8). Smallest fix: add a second inference or a plausible wrong working to detect (for example 1.4[12] "four squares in a 2 by 2 arrangement but one student divides the side by 4"; 1.6[12] ask for the edge of a cube with 27 times as many cubes, or give both volume and edge and require the choice). 1.5[14] (A/R, R restates the grouping) is also thin; acceptable at 1 mark, but watch it.

## LOW

1. C8M-1.4[16] (case study, 4 marks) part (d): Type A costs Rs 9,00,000 against a budget of Rs 8,00,000, so the choice is forced to Type B by the budget alone. It is a constraint check, not a trade-off, but it is a legitimate decision and the data are correct. Optional: lower the budget to Rs 9,50,000 so that both are affordable and coverage (144 against 125.44 sq m) must be weighed against Rs 9,00,000 against Rs 7,84,000.
2. Case studies whose last part is "apply the stated threshold": C8M-1.2[12](d) (within 5 names), C8M-1.3[17](d) (fewer than 30 dancers), C8M-1.5[13](d) (side at most 200). Each is correct and unique, but the rule is handed over, so the thinking is a comparison. Acceptable; keep at most two in one chapter if a revision happens.
3. C8M-1.6[17] and [11], 1.6[2]: the taxicab story (book p.13) and "a cube cannot end in exactly two zeros" (book p.13, set as a question there) sit inside the cube pages 11-13 of scope_in but are not named in the scope item text. Add one line to the scope item or accept.
4. Correct option is the strictly longest option in C8M-1.3[14] and C8M-1.6[2] (2 of 44 option items, 4.5%). Not systematic. Shorten the correct option in both, or lengthen a distractor.
5. C8M-1.2[18] still uses the old reject-by-units-digit-then-zeros frame as a 5-marker; with 1.2[0] and [5] and [11] the units-digit and zero tests appear in about eight items of 21. Fine now that the case study no longer repeats it.
6. C8M-1.4[13] part (b) explanation "moving the decimal point in the area does not simply move it in the side" is correct but loosely worded; a squarable decimal needs an even number of places, say so in the key.
7. Difficulty labels are only Hard and Hardest in all six concepts. This follows the no-easy rule; no action unless the owner wants a Medium band.

## Template counts
- claim_check verdicts: 3 No (1.1, 1.4, 1.6), 2 Partly (1.2, 1.5), 1 Yes (1.3). Mixed.
- true_false: 3 False (1.1, 1.3, 1.5), 3 True (1.2, 1.4, 1.6). Mixed, but 1.6[9] has no wrong step to catch (MEDIUM 1).
- assertion_reason (6): R explains A twice (1.1, 1.5), both true but R does not explain twice (1.3, 1.6), A true R false once (1.2), A false R true once (1.4).
- multi_statement (6) keys: "1 and 3 only", "1 only", "2 and 3 only", "3 only", "1, 2 and 3", "1 and 2 only". All different.
- Correct option longest: 2 of 44 (4.5%). Correct option at o[0] everywhere (loader shuffles).
- Types: short_answer 53, mcq 28, long_answer 24, multi_statement 6, fill_blank 6, assertion_reason 6, match 4. fill_blank answers are single numbers (5, 5625, 51, 3.5, 36, 625), machine-matchable. Figure item (1.3[11]) is described fully.
- Bloom: Analyse 75, Evaluate 31, Apply 18, Create 3. Easy items by one-line fact: 4 left (MEDIUM 2).
- Slot order: no longer one recipe; tails differ across the six concepts.

## Per-concept verdicts
- C8M-1.1: all keys correct; 2 easy items left (MEDIUM 2). Pass after fixes.
- C8M-1.2: all keys correct; parity and zeros items now need the chapter. Load-ready.
- C8M-1.3: all keys correct; one longest-option LOW. Load-ready.
- C8M-1.4: all keys correct; one easy item left (MEDIUM 2), forced decision (LOW 1). Load-ready after the optional edit.
- C8M-1.5: all keys correct; strong. Load-ready.
- C8M-1.6: all keys correct; 1.6[9] true_false has no misconception (MEDIUM 1), 1.6[12] easy (MEDIUM 2). Pass after fixes.

## Counts read
Questions read: 127 (50 changed read in full and recomputed; 77 unchanged re-checked structurally against v2). HIGH 0. MEDIUM 2. LOW 7.
Templated: no (the v2 shared tail and twin frames are gone; counts above are spread).
Verdict: not yet load-ready by the strict "no easy items" rule, but there is no wrong key and no second answer. Fix MEDIUM 1 and the four items in MEDIUM 2 (about five edits) and it is load-ready. If the owner accepts a one-step 1-mark item or two, it is load-ready as is.
