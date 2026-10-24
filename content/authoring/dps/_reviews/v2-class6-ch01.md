# Review: dps/class6/ch01.json (Class 6 Maths, Patterns in Mathematics, fegp101), independent review

Read: 132 questions (6 concepts x 22). Every numeric key and every mcq/match/AR/multi_statement key was recomputed in python or read off pages 001-017 before comparison. Programmatic checks: every mcq/match/AR/multi_statement key text equals one of its options (0 misses); no option is named by position; step marks sum to question marks on every short/long item; no duplicate options. Item numbers below are 0-based positions inside the concept (same order as the file).

Result: 131 of 132 keys right; one key carries a false mathematical sentence (H1). All 12 case studies recomputed part by part: arithmetic is right throughout.

## HIGH

H1. C6M-1.4 item 15 (short_answer, 3 marks, claim check on three neighbouring Triangular numbers). Quote: "...neither is a square (...). The square pattern belongs to two neighbours only."
Problem: the verdict "No" is right (1+3+6=10, 3+6+10=19) but the closing sentence is false in general. Three neighbouring Triangular numbers do sometimes add to a square: 15+21+28 = 64 (python: sums run 10, 19, 31, 46, 64, 85, ...). A sharp student who finds 64 is told the pattern "belongs to two neighbours only", which is untrue.
Fix: replace the last sentence of the key with "So the claim fails: three neighbours do not always add to a square (the square result was found for two neighbours)." Keep the step "Verdict: the claim fails for three neighbours".

## MEDIUM

M1. Case-study part (d) is hedged in 11 of 12 case studies (all except C6M-1.1 item 20), so the "decision" has no answer. Quotes: 1.1 item 21 "Either is allowed by the Rs 200 limit"; 1.2 item 20 "Either can be defended"; 1.2 item 21 "Either is defensible if justified"; 1.3 item 20 "Either fits the 13 km limit"; 1.3 item 21 "Both are sensible"; 1.4 items 20 and 21, 1.5 items 20 and 21, 1.6 items 20 and 21 "Either is defensible/fine". Several are also strawmen or red herrings:
- 1.2 item 20: 11 x 11 needs one extra tile (Rs 25) and uses all; 10 x 10 wastes 20. One option dominates.
- 1.4 item 20: the festival is 7 days; Plan Q breaks the Rs 500 cap on day 7 (1093), so it cannot cover the festival, yet the key says either is defensible.
- 1.1 item 21: the Rs 200 daily limit never binds (largest deposit 128), so it is a red herring.
- 1.6 item 20: two groups of 6 include everyone in 15 minutes, one group of 9 leaves 3 out in 18; dominated unless "more mixing" is stated as a goal.
- 1.4 item 21 / 1.3 item 21: "two customers might each buy" is a gamble with no data.
Fix: give each (d) a constraint that one plan breaks (a cap, a deadline) and key one recommended answer plus the rejected plan's failing figure. Keep "another choice accepted if the figures are quoted" only as a marking note.

M2. Scope_out violation (algebraic notation). scope_out: "Formal algebraic notation for the nth term of a sequence ... variables and algebraic notation are not introduced until later chapters". Stems/keys use n and k as symbols: C6M-1.3 item 6 R "The sum of the first n odd numbers ... is the square number n x n"; 1.3 item 10 key "Up and down to n gives n x n"; 1.3 item 19 stem "tallest column of n, then back down n - 1"; 1.6 item 14 key "The lines in K_n are the (n - 1)th Triangular number"; 1.6 item 19 stem "the k-th shape"; 1.2 item 19 key "n + (n + 1) = 51 when n = 25"; 1.1 item 20/1.3 item 20 "day k". Fix: say it in words and numbers ("the sum of the first 10 odd numbers is 10 x 10"; "K5 has the 4th Triangular number of lines").

M3. Templated at slot level (counts). All six concepts use the same skeleton: items 0-3 mcq, then match/multi_statement/AR/fill_blank, items 8-13 six 2-mark, 14-17 four 3-mark, 18-19 5-mark, 20-21 4-mark case study; the last 14 positions are identical in all 6. Inside them the frames repeat: item 8 is always "True or False ... Give the reason" (6/6); items 14-15 are "<Name> says/claims ... Test ... verdict" (12/12); item 16 is "Show that no ... / not ... lies between two terms" (6/6); item 17 is "Write a real-life situation ..." (5 of 6, 1.2 varies). Case studies: 8 of 12 are "Plan X/Y (P/Q) compare, which is better". Correct mcq option is the longest in 18 of 26 (69 percent: 1.1 4/4, 1.2 3/4, 1.3 3/5, 1.4 3/4, 1.5 1/5, 1.6 4/4); all 26 mcq keys are first in the file order (fine if the loader shuffles). Fix: reorder slots in at least three concepts, vary the verdict-frame openings, and lengthen two wrong options in 1.1, 1.3 and 1.6.

M4. Repeated ideas inside one concept (standard: about twice).
- C6M-1.2: "next hexagonal number is 61" in items 3, 11, 18; "36 is both square and triangular" in items 0, 5, 13.
- C6M-1.4: "first six hexagonal numbers add to 216" in items 3, 7 (row 4), 18(b); "running sum of powers of 2 plus 1" in items 2, 6, 9, 13, 14 (items 6, 9 and 14 are near copies: ...+512 +1, ...+64 +1, ...+256 +1).
- C6M-1.5: Koch counts 3, 12, 48, 192 in items 3, 6, 8, 10, 15, 16, 19, 21.
Fix: keep two per idea; replace the rest (for example a reverse: which running total is 1023).

M5. Easy-in-disguise items (a one-line book fact or one step with the rule given; the bank allows none).
- C6M-1.5: item 1 (mcq, definition of "regular"), item 2 (K7: 6 lines at a dot), item 3 (speed bump = 4, read off 3 -> 12 in the stem), item 13 (2 marks, key restates the book's sentence "replaced by a speed bump ... tinier and tinier"), item 12 (differentiate square from rhombus; rhombus not used in this book).
- C6M-1.6: item 12 (stacked triangles give squares because odd numbers add to squares, the chapter's headline), item 7 (fill_blank 169 -> 13 rows), item 3 (11th polygon, n + 2).
- C6M-1.3: item 7 (fill_blank first 50 odd numbers = 2500; the book's own "first 100 odd numbers" move), item 0 (15 rows -> 15 x 15).
- C6M-1.2: item 6 (fill_blank 8 x 8 x 8), item 2 (6 x 6 x 6).
- C6M-1.1: item 7 (fill_blank 28 + 8 step), item 0 (next term 21 + 13 with the rule stated).
Fix: invert or add a step (ask for the position of the first Triangular number above 200, or the last odd number in a sum that totals 2500); make the 2-mark recall items (a)+(b) where (b) uses (a).

M6. Case-study parts (a)-(c) mostly do not climb: one-step arithmetic from the stem, then (d). Examples: 1.2 item 21 (a) 4^3, (b) 5^3, (c) 25 x 40; 1.1 item 20 (a) 1+...+6; 1.5 item 21 (a) 192 and 768. Fix: make one middle part need a chapter relation (use the running-total or neighbouring-sum rule without adding every term).

M7. C6M-1.2 item 18 (5 marks): (b) "Show that the fifth and sixth hexagonal numbers are 61 and 91" repeats (a) (marks for 37 + 24 = 61 and 61 + 30 = 91 twice). Fix: make (b) a check with 6 x triangular + 1.

M8. Wording issues. C6M-1.2 item 21 (d) "The floor area of the block grows with the side" (not asked for a cube block, and area is Chapter 6). C6M-1.3 item 21 "bricks to edge square flower beds" but a bed of side k uses k x k bricks (filling, not edging). C6M-1.1 item 11 (Aman): his own rule "add 1, 1, 2, 3, 5" already gives 13 + 8 = 21, so "he adds 4 next" is arbitrary; let him guess "1, 1, 2, 3, then 4" and test it against the table.

## LOW

L1. C6M-1.3 item 3: distractor "26" is even, so it cannot be a last odd number; use 23.
L2. C6M-1.3 item 18(b) "Check the answer by subtraction" is the same method as (a) when (a) is done by 169 - 144.
L3. C6M-1.3 item 12/13 running-total reason (1.4 item 13): answered by checking four cases, not a reason.
L4. C6M-1.4 item 20 uses sums of powers of 3 (1093); the book teaches running sums for powers of 2 only. Computing by addition is fine; do not imply the "plus 1" rule holds for 3.
L5. C6M-1.1 item 5, statement 3: "27 is the 3rd term of the Powers of 3" hinges on counting; state "the first term is 1" in the stem to avoid an off-by-one dispute.
L6. "scenario" tag on pure fact stems (1.1 item 3, 1.2 item 0, 1.4 item 1, 1.4 item 3).

## Other counts
- claim_check (12): No-type 6 (1.1 first, 1.2 first, 1.3 second, 1.4 second, 1.5 first, 1.6 second), Yes 4, partly right 2: a good mix.
- multi_statement keys (6, all three-statement): "1 and 2 only", "1 and 3 only", "2 and 3 only", "1 and 3 only", "3 only", "1, 2 and 3"; spread is fine. Format is 3-statement; QUESTION_STANDARD says 3 for Science/Social and 2 (I, II) for Maths houses, so the author brief must decide whether Maths needs 2 (not a key error).
- assertion_reason keys: explains, not-explains, A false R true, not-explains, A true R false, explains. All four outcomes, each recomputed.
- true_false verdicts (6): 3 True, 3 False.

## Per-concept verdicts
- C6M-1.1 Number sequences: pass after fixes (M1, M3, M5).
- C6M-1.2 Visualising number sequences: pass after fixes (M1, M4, M7, M8).
- C6M-1.3 Sum of consecutive odd numbers: pass after fixes (M1, M2, M5, L1).
- C6M-1.4 Other relations among sequences: pass after fixes (H1, M1, M4).
- C6M-1.5 Shape sequences: pass after fixes (M1, M4 Koch repeats, M5).
- C6M-1.6 Relating shape sequences to number sequences: pass after fixes (M1, M2, M5).

## Counts read
132 items read, all keys recomputed. HIGH 1, MEDIUM 8, LOW 6. Templated: yes at slot and case-study level; numerically every item is sound. Overall: pass after fixes.
