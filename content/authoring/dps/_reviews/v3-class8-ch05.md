# Review v3: class8 ch05 (Number Play, hegp105), re-review after one fix pass

File: `content/authoring/dps/class8/ch05.json`, 132 questions (22+22+22+23+22+21). Diff against the pre-edit copy: 59 changed or new items, every one read in full and recomputed in python (scratch: `scratchpad/v3-class8-ch05/crypt.py`, `c.txt`). Index = 0-based position in the concept list. The other 73 items are word-for-word as in v2 and were not re-reviewed beyond the file-wide structural checks.

## v2 status
| v2 finding | Status |
|---|---|
| M1 C8M-5.6 KL x 3 = MML ("which digit must L be") | FIXED. Item removed; the slot is now #13 "AB x 4 = BCC, what is B" (key 2). Brute force: one solution, 72 x 4 = 288. The stem fixes the method (product below 400, so B is 1, 2 or 3) and the key tests B = 1 and B = 3 explicitly, so no live second option. |
| M2 book-copy items (5.2 #18, #20, 5.3 #6) | FIXED (renumbered and extended: 3,4,5 above 200; multiples of 24 around 60,000; seven odd numbers about 7p). Residual LOW 2. |
| M3 5.2 #19 product of 3 consecutive integers | FIXED. Replaced by the 15-and-12 chairs item (key 20, via LCM 60). Note the book itself asks the product-of-consecutive-integers question (p.133 item 14), so the v2 scope objection was too strict, but the replacement is cleaner anyway. |
| M4 forced last-part "decisions" | PARTLY FIXED. 5.2 #4(d), #15(d), 5.3 #14(d), #21(d), 5.4 #19(d) now carry a real cost trade-off with arithmetic. Still forced: 5.6 #5(d), #17(d), 5.1 #9(d). See M1 below. |
| M5 repeated ideas | PARTLY FIXED. "B x B ends in B" now 2 items (#12, #19); "sum begins with 1" 2 items (#0, #9); 4p+(4q+2) and 4-and-6-to-24 clusters thinned out. 5.6 still has a solution-count theme (see M2). |
| M6 easy in disguise | PARTLY FIXED. 5.4 #0, #3, #21, #22, 5.5 #5, 5.6 #20, 5.2 #14, #17, 5.3 #12/#17 reworked into two-step items. 5.4 #16 is still the book's own derivation (M3). |
| M7 5.2 #4 table answerable by direct division | FIXED (8 column gone; part (c) needs the last-three-digits test). |
| M8 composition template | UNCHANGED in substance (LOW 7). |
| L1 PQ x 6 = RS | FIXED (stem asks "which of these four values is a solution"; 15 is not offered). |
| L2 5.1 #18 empty condition | FIXED (unsimplified, 3+ terms, odd coefficient required). |
| L3 5.5 #3 leaked 545 | FIXED (example is now 7,337, which sits in Statement 2 and is true: 7,337 = 11 x 667). |
| L10 5.2 #21 stray figure tag | FIXED. |

## HIGH
None. Every changed item has its key recomputed and correct; no item has a second defensible answer; no option-item has a wrong option equal to the key or the key outside o[0]; every step list sums to its marks; no option is named by position (regex clean).

Brute force (distinct digits, no leading zero), solution counts against the key/stem:
AB+AC=BCA 1 (91+98=189); A+AB+ABC=BCB 1 (6+67+674=747); PQ x 6=RS 2 (13, 15; only 13 offered); GH x H=8K 0 (matches "no solution"); PQR x 3=SQR 2 (150, 250); PQ+PQ+PQ=RQQ 1 (85); AA x AA=BCB 1 (22); ABC x 5=DCB 1 (159); MN x N=MPM 1 (19); AB x B=CDA 2 (64, 93); AB x 4=BCC 1 (72); AB x 7=BCA 1 (42); AB x 9=BAC 1 (87); AB x 7=CA 1 (13); AB x 7=CD 2 (12, 14); AB x B=CAB 2 (25, 75); **AB x 6=CDB 23** (26, 28, 30, 32, 34, 36, 46, 52, 54, 58, 62, 64, 68, 70, 72, 76, 78, 82, 84, 86, 90, 94, 96), so the stem's "many solutions" is true and 28 x 6 = 168 is valid while 24 x 6, 18 x 6 and 12 x 6 fail as the key says. (The file never states the number 23; nothing to correct.)
Other recomputed keys: 5.1 #21 smallest positive value = 27 (values -51, -19, -5, 27, 31, 63, 77, 109); 5.4 #22 over all 6-digit numbers ending in 4 with digit sum 27 (5,520 of them) 18 always divides, 27 and 36 do not; 5.5 #17 gives 10 numbers; 5.5 #13 gives x = 3 only; 5.5 #3 has 82 three-digit palindromes not divisible by 11 and none among 4-digit ones ("2 only"); 5.5 #5 reversal of multiples of 11 checked up to 100,000; 5.2 #18 sets start 3, 63, 123, 183, 243 (period 60); 5.3 #14 counts 22 / 25 / 29 for d = 9 / 8 / 7. Case-study money totals: 5.2 #4 Rs 10,940 vs Rs 11,088 (diff 148); 5.2 #15 Rs 5,050 vs Rs 4,320; 5.3 #21 Rs 2,100 vs Rs 2,200; 5.4 #19 Rs 34,394 vs Rs 35,370 (diff 976); 5.1 #9 stalls 25-28, 28-32, Rs 480 vs Rs 500 per stall. All match the keys.

## MEDIUM
1. C8M-5.6 #17(d), C8M-5.6 #5(d), C8M-5.1 #9(d): last part is still not a real decision.
   - #17(d) "his brother says this adds a third, different puzzle. Is he right? Use (c)": the stem says the puzzle is built "in the same way", so it is AB x 7 = CD again and the answer is a recognition. Fix: ask which of two proposed puzzle sets (for example a set containing AB x 7 = CA, AB x 7 = CD and AB x 7 = CE) the magazine should print so that each answer is unique, or drop (d) and add a cost/limit twist.
   - #5(d) "Should Arun's entry be marked correct?": fully determined by (b). Fix: give a rule with a cost (the magazine can print only one answer; which puzzle, X or Y, should it run and why) or merge into (b).
   - #9(d): the block of 5 beats the block of 4 on both stated criteria (nearer the gate, cheaper per stall), so there is no tension. Fix: make the block of 4 the nearer one (for example choose the total so that the block of 4 starts at stall 12) so that near-the-gate and per-stall cost pull apart.
2. C8M-5.6 solution-count theme: 6 of 21 items are about how many solutions a puzzle has or making it unique (#5 two solutions, #12 all solutions and a uniqueness condition, #15 another solution and make it unique, #17 unique/two solutions, #19 "exactly one" claim, #20 "many solutions"). "AB x 7" puzzles appear three times (#14, #15 as x 3, #17). #0 and #18 are still the same frame ("explain why B must be ..., then find A and C"; similarity 0.51 now, down from 0.91). Fix: turn #20 (a one-mark four-way check by multiplication) into a different skill, for example a word-and-digit puzzle with a carry (BYE x 6 = RAY style, in scope_in), and make #15 a plain solve.
3. C8M-5.4 #16 (5 marks, Hardest): still the book's own derivation (pp.124-125) re-run; (c) is arithmetic on 6,254 and (d) is a one-line fact (multiple of 9, so of 3). Only (a) and (e) need thought. Fix: replace (d) with a harder claim (for example "the result is always a multiple of 18?" which needs the number's parity) or reduce to 4 marks.

## LOW
1. Light items labelled Hard (one rule, one step): C8M-5.1 #0 (three parity facts), C8M-5.2 #0 (N = (M+N) - M), #8 (multiples rule then 42 vs 28), #14 (360 against 8 and 32, the book's Venn fact in numbers), #20 (60,000 multiples), C8M-5.3 #12 (13k+12 then substitute), #15 (12k+7 as 6(2k+1)+1). Each is correct and two-step at most; accept, or fold #8's two parts into one.
2. Residual book echoes: C8M-5.2 #18 is the p.134 item 7 (2,3,4 every 12) with 3,4,5 and "above 200"; C8M-5.2 #13 follows the p.133 item 12(iv) pattern (8(7b-3) - 4(11b+1)). Both add a twist, so fine; note only.
3. C8M-5.3 #17: the wrong order of subtraction (5 - 2) also gives 3, so that slip is not caught by any option; the 7 and 1 options only catch adding. Optional: use remainders 1 and 4 (answer 3 only by borrowing, 4 - 1 = 3 would match...) or simply accept.
4. Divisors outside scope_in's named list: 27 (C8M-5.5 #20 and C8M-5.4 #22, distractors only; the key of 5.5 #20 refutes 27 by long division although the stem says "divisibility shortcuts only", so change the key to "no taught test certifies 27; 44 is the only size certified"), 121 (C8M-5.5 #16(e), refuted via LCM, in the spirit of p.130), 49 and 98 (C8M-5.3 #6, reached by algebra on 7p, not a digit shortcut). The combined divisors 18, 33, 36, 44, 15, 45, 60 are all reached by the LCM/factor rules and are inside scope_in; keep.
5. C8M-5.6 #2 uses three addends (A + AB + ABC); scope_in shows two-addend additions, though it is still one operation. Keep.
6. C8M-5.2 #18(b): "first such set above 200" is correct (period 60) but the key does not say why no set lies between the 60-steps; add "the pattern repeats exactly every 60" as in the book's own answer.
7. Template at composition level, counts read: each concept has 8-9 short answers, 4-5 long answers, 4-6 MCQs, exactly 1 assertion_reason, 1-2 multi_statement, 1-2 fill_blank, 0-1 match (shape strings differ; none identical). All 132 are Hard (97) or Hardest (35), no Easy or Medium, as the bank requires. Stem openers: "Assertion (A):" 6, "True or" 5, "(a) Without" 4, "A school" 4, "Show that" 4. Moderate, not a copy-paste recipe.
8. multi_statement keys (7): "1 and 3 only" x2 (5.1 #2, 5.5 #21), "1, 2 and 3", "2 and 3 only", "1 and 2 only", "2 only", "1 only": healthy spread. C8M-5.5 #21 stores "1 and 3 only. N is divisible by ..." in `a` while the other six keys are the bare label; make it consistent (the loader marks o[0], so no load effect). C8M-5.5 holds two multi_statement items (#3, #21); fine (rule is "1+").
9. C8M-5.4 #13 assertion-reason R ("4,005 is divisible by 5") is an unrelated true fact, so "R does not explain A" is easy to guess; unchanged from v2.

## Template and mix counts (read, not impression)
- claim_check (9): No 4, Yes 2 (5.3 #4, 5.6 #9), partly right 3 (5.2 #17, 5.3 #16, 5.6 #19). Healthy.
- true_false (7): 4 True, 3 False, all with a reason. Each has a real misconception.
- assertion_reason (6): both-and-explains 2, both-but-not 2, A true R false 1, A false R true 1.
- fill_blank (7): 46, 27, 3, 4, 4, 3, 5; all numeric, one answer each, no natural equivalents.
- MCQ correct option strictly longest: 0 of 30 (ties on numeric options only); option items 47, key at o[0] in all, no duplicate options.
- Case studies: all numbers and parts recomputed; step marks equal marks; 4 parts climb in the changed ones; 4 of the 6 changed final parts are genuine cost trade-offs, the other 3 are listed in M1.

## Per-concept verdict
- C8M-5.1: keys correct. PASS (fix #9(d) at leisure).
- C8M-5.2: keys correct, book echoes handled. PASS.
- C8M-5.3: keys correct. PASS.
- C8M-5.4: keys correct; #16 still heavy on book restatement. PASS after optional M3.
- C8M-5.5: keys correct; scope fine via combined factors. PASS.
- C8M-5.6: keys correct, solution counts confirmed; M1/M2 are variety, not correctness. PASS.

## Counts read
Read 59 changed or new items of 132 in full (the other 73 unchanged from v2), plus all 132 in the structural checks. HIGH 0. MEDIUM 3. LOW 9.

Verdict: **load-ready** (no wrong key, no second answer, no arithmetic or fact error; the three MEDIUM items are quality polish and can be done before or after the load).
