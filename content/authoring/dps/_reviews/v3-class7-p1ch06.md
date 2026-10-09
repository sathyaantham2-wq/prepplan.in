# Review v3: Class 7 Maths Part I ch 6 "Number Play" (gegp106), content/authoring/dps/class7/p1ch06.json

VERDICT: PASS. 0 HIGH, 5 MEDIUM, 11 LOW. Every key is correct and uniquely determined. The remaining problems are repeated ideas in 6.4/6.5 and a short list of one-step items, none of which makes a key wrong.

Method: all 140 questions read (7 concepts x 20), no sampling. Keys recomputed in python before reading the key text: permutation search for every height line (6.1), brute force over all 362,880 fillings for every 3x3 grid (6.4), all magic squares including the 4x4 Yantra (6.5), every 2-/3-/4-/6-/9-term cryptarithm with and without the "different letters / leading letter not 0" rules (6.7), and the Virahanka counts and parities (6.6). Page text gegp106/001-019 checked for the dates, "generally", and the digit convention. Read the latest earlier review (v2-class7-p1ch06.md) first and checked each finding against the current file. Note: the v1 file `class7-p1ch06.md` and v2 exist; this is v3. Also verified: step marks sum to item marks everywhere, no option is named by position anywhere (grep of q, a, steps and options), 7 assertion_reason + 7 multi_statement + 6 fill_blank + 4 match + 4 true_false, 14 case studies.

## Status of the v2 findings

Fixed:
- 6.1: Q2 is now a real computation (total of six calls = 6, recomputed), Q3 is a new "exactly three call 0" item (tallest is the last 0-caller, recomputed), the Q3/Q15 duplicate is gone, Q4/Q13 are new applications. Q19(d) keeps its real trade-off.
- 6.2: Q7 no longer copies the book's puzzle (target 40/36/29/28 over 7 cards; (d) verified: only 4 boxes works, 21 would have to be left out for 6 boxes). Q15 fill_blank is now a computed value (5 odd totals among 3,6,10,15,21,28,36,45,55). Q4 now uses Imran 1,258 so parity leaves two even reports. Q16 and Q1 reworked.
- 6.3: Q16 case study now has a real competing cost (4-apart wish vs 62-bill book vs 70-bill festival day). Q9 claim is now false ("No"), so claim-check verdicts are mixed. Q5 key reworded to say R only says 2n is even. The nth-odd lookups were cut down (Q18 replaced by a new item).
- 6.5: Q9 and Q11 keep the corner argument but are now reasoned items; Q16/Q17/Q19 are different ideas. 
- 6.6: Q5 reason is now mathematical (13 + 8) instead of poem trivia. Q14 now has a competing cost (recount only one).
- 6.7: the digit conventions are now stated in the stem of Q3, Q6, Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q15, Q16, Q17, Q19, Q20 and Q1's reason. Q11 vs Q8 duplicate removed (Q8 is now C2+C2=DEE).

Not fixed or only partly fixed: 6.4 "totals = 45" repetition, 6.5 "transform every number" cluster, 6.1 Q18(e) packing, the keyed-option-longest cases in 6.3 Q18 and 6.7 Q10 (details below).

## Keys: recomputed, all correct

- 6.1: lines 0,1,1,1,1 -> 5,1,2,3,4; 0,0,0,3,3 -> 3,4,5,1,2; 0,1,1,0,4 -> 4,2,3,5,1; 0,0,2,0,4,2,5 -> 4,6,3,7,1,5,2; 0,1,1,0,4,1,6 -> 5,3,4,7,2,6,1 (each has exactly one solution); 0,1,0,4,2,5 and 0,1,3,0,2,1 have none. Q9 = 0,0,2,1,4; Q13 = 0,1,1,3,2 and 0,0,0,2,1; Q18 totals 5/5/10, 28 for 8 children; Q19 calls 0,0,2,0,4,2 with 1/0/3 children who cannot see; Q12 calls 1 or 2 (heights 152-154 give 2, 156-158 give 1), Bela calls 4 whatever Aman's height. MS Q6 = "2 and 3 only" (S1 false: a caller of 3 is 4th or later). Match Q8 = 1-b 2-a 3-c 4-d.
- 6.2: 414+475+420 = 1,309; 255+480+455+60 = 1,250; 1..75 has 38 odd numbers, sum 2,850; 3,493 -> 3,528; MS Q14 "1 and 3 only"; Q11 (ab+a+b odd iff at least one odd) correct.
- 6.3: 4n-1 = 251 -> n = 63, houses 125 and 126; MS Q2 "1 and 2 only"; Q15 T F T F T; Q16 numbers 62 and 110 and the festival-day count; Q19 tokens 119/120, 79th, 100 each; Q20 match.
- 6.4: sets for 8 {1,2,5},{1,3,4}; for 9 {1,2,6},{1,3,5},{2,3,4}; Q5 has exactly one grid and it is the keyed one; Q8(c) and (d) have 0 solutions; Card A has exactly 1 solution, B, C and D have 0 (D passes both totals); Q13 has exactly 14 boards; Q15 has 0 solutions; Q4 puzzles 1-3 have 0, puzzle 4 has 25; Q18's example grid is valid; eight 3-sum triples for 15.
- 6.5: exactly 8 magic squares of 1-9, centre always 5, 9 and 5 never in a corner; every square in Q2, Q8, Q10, Q18(b), Q19 and the Yantra is magic with the stated sum; Neel's square has diagonals 12 and 24 and the swapped square has rows 17,13,15 and diagonals 10,22 exactly as keyed.
- 6.6: counts 13/5/8/8 = 34; 21; 233; 29; parity period 3 (30th term odd); dates match page 015 (Virahanka c. 700 CE, Gopala c. 1135, Hemachandra c. 1150, Fibonacci 1202; "not first, nor second, not even the third").
- 6.7: unique solutions: S6x3=TUS (258), G3+G3=HMM (166), L7+7L=MNM (121), C2+C2=DEE (144), T5x3=UVT (165), 9B=CB (B=5), K9x3 (237), K9x4 (276), A5+5B (104), A3+2B (105), N8+N8 (136), PQx3 (255), CB+B (100), Z4+Z4 (188), K+K+K=LK (one solution, so MS Q6 statement 1 is false); no solution for D+D=ED, P5+P5=QRP, E+E+E+E=FE, AB+AB=CAA; four for P x6 = QP; two for G5+4H=JK5 (G = 8 or 9); six for VE+EV=WXW.

## MEDIUM

1. 6.5 repeated idea: "transform every number, find the new magic sum (add k -> +3k, scale, 10-x)" is Q1, Q6, Q7, Q8, Q10, Q12, Q13, Q14, Q15(c) and Q19, ten of 20 items. Q1, Q13 and Q14 (fill_blank 63-12=51) are one-step. Replace Q13 and Q14 with a different idea (for example which cells of a given partial 3x3 square are forced, or the sum of the two diagonals through the centre, or a non-consecutive set such as odd numbers 1,3,...,17).
2. 6.4 repeated idea: "rows must total 45, check it" is still in about ten items (Q4, Q5, Q6, Q8(c), Q11, Q13(a), Q16, Q17, Q19) and the "row 6 / column 24 share one square so no grid" argument is three items (Q8(d), Q11(b), Q15). Drop Q15 (it is Q11(b) with other numbers) and make one of Q6/Q17 a different grid fact (for example how many row sums can be 6; where 1 can sit given a row of 15).
3. Remaining one-step 1-mark items still carrying a Hard label (they pass as mixed difficulty but do not discriminate): 6.2 Q12 (odd count of odd addends) and Q20 (R is the rule, A one product); 6.3 Q8 and Q12 (expression parity with an obvious distractor set); 6.4 Q20 (sum 7 = {1,2,4}); 6.5 Q1, Q3, Q13, Q14; 6.6 Q10 and Q13 (read a term off the sequence); 6.7 Q12 (both answers are given with their checks and the three wrong options are silly) and Q18 (first step given). Replace about four of these with a two-step item each.
4. Keyed option is much the longest in two mcq: 6.3 Q18 (68 chars vs 42/42/61) and 6.7 Q10 (73 vs 49/60/57). Smaller cases: 6.2 Q11, 6.3 Q8 and 6.3 Q12 (key tied or marginally longest). Shorten the key or lengthen two distractors.
5. 6.6 parity-pattern idea ("odd, odd, even repeating") is Q4, Q6, Q7, Q14(c) and Q15, five items, and Q7 is the first-principles version of Q4. Replace Q7 or Q15.

## LOW

- 6.1 Q18(e) still packs three tasks (3-child test, prediction, check) into one 1-mark step. Split the mark or the part.
- 6.1 Q12(a) says "between 152 and 158"; the key lists 153,154 and 156,157 only. 152 and 158 give the same calls (2 and 1) so the answer is safe, but say "from 152 to 158" or list all.
- 6.1 Q7 reason ("the first child in any line calls 0") is an obviously irrelevant truth, so the not-explanation key is cue-guessable. Use a reason that is about the heights rule.
- 6.2 Q20 assertion-reason is guessable (R is the standard product rule and A is a direct application; "explains" is the only coherent pairing).
- 6.3 Q18 uses "a multiple of 4" while the scope file excludes divisibility other than parity; the key's n = 22.5 route is fine, but the option text should talk about solving 4n = 90, not divisibility.
- 6.3 Q19(d) accepts either option (reprint or third counter); that is an open recommendation with no cost figure, so it is weakly assessable.
- 6.4 Q13(d) (should Neha get the prize) and 6.6 Q19(d) (only 6 beats fit the 40 minutes) and 6.7 Q17(d) (105 + 50 > 150) are determined by one comparison; the case study is carried by the earlier parts.
- 6.5 Q2 step 2 asks for the reason 16 cannot be in a corner but the key gives none; state the book observation (the largest number cannot be in a corner).
- 6.5 Q5(a) and (e) and Q18 (centre m) follow the book's own Figure-it-Out tasks closely (the book's 4x4 Yantra check and the general form); acceptable, but change Q18(b)'s smallest number if the book's example uses 31.
- 6.6 Q14(d) key explicitly accepts either daisy; fine as an open decision but the marking step must credit a reasoned choice only.
- 6.7 Q5 stem lacks the "different letters / leading letter not 0" sentence that the sibling items carry (without it G3+G3=HMM has two readings, with H = 0 allowed); (e) relies on HMM being three-digit. Add the sentence.

## Calibration notes

- Bloom: Analyse 65, Apply 44, Evaluate 20, Create 7, Understand 4 (Analyse/Evaluate/Create = 66%); difficulty Hard 126, Hardest 14. The Analyse label is generous on the one-step items listed in MEDIUM 3.
- No scope_out violation except the wording note at 6.3 Q18; negatives in 6.5 Q13 follow the book's own "use negative numbers" line; no modular arithmetic, factorial counting, 5x5 squares or closed-form Fibonacci anywhere.
- No second defensible answer in any mcq/MS/AR/match; no wrong key; no positional option reference.
- claim_check verdicts now mixed (Yes: 6.1 Farhan, 6.2 Sana, 6.6 Ravi; No: 6.3 Tarun, 6.5 Aman, 6.7 quiz book; split: 6.4 Tara, 6.5 Sanju). AR keys: not-explanation 3, explains 2, A false 1, R false 1.

## Per-concept verdicts
- C7M-6.1 pass; 6.2 pass; 6.3 pass; 6.4 pass (repetition); 6.5 pass (repetition cluster, weakest concept); 6.6 pass; 6.7 pass.

Totals: 0 HIGH, 5 MEDIUM, 11 LOW.
