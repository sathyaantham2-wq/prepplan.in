# Review v3: dps/class6/ch01.json (Class 6 Maths, Patterns in Mathematics, fegp101)

Read: 132 questions (6 concepts x 22), every one. Every numeric key, mcq/match/AR/multi_statement key and all 12 case-study parts were recomputed in python or read off the book (pages 001-014) before comparing. Programmatic checks: every mcq/match/AR/multi_statement key text equals one of its options (0 misses); no option is named by position; step marks sum to question marks on every short/long item (0 mismatches); no algebraic letter (n, k, nth, K_n) remains in any stem/key/option.

## v2 fixes verified
- H1 (C6M-1.4 item 16, three neighbouring Triangular numbers): fixed. Key now says three neighbours "do not always" add to a square and cites 15+21+28=64. Correct (1+3+6=10, 3+6+10=19 both between squares).
- M1 (hedged case-study part d): fixed. All 12 now commit to one answer with figures; every (d) recomputed and right.
- M2 (algebraic notation): fixed. No letters left.
- M4 (repeats in 1.2 and Koch repeats): reduced in 1.2; some remain, see M2 below.
- M7 (1.2 item 18 b repeating a): fixed (now the L-border explanation).
- M8 (1.1 item 11 Aman, 1.3 item 21 wording): fixed. L1 (26 distractor): fixed (23).

## HIGH
None. No wrong key, no second defensible answer, no arithmetic or fact error found.

## MEDIUM

M1. Case studies are still one pattern: "one plan breaks a stated cap, choose the other". Count: 9 of 12 (1.1 item 21 Rs 100 daily cap on Plan II; 1.2 item 19 Rs 100 cap on 12x12; 1.2 item 21 Rs 600 budget on side 5; 1.3 item 20 deadline on Plan X; 1.3 item 21 500 bricks on Plan Q; 1.4 item 18 Rs 500 on Plan Q; 1.5 item 20 Rs 100 on K6+pentagon; 1.5 item 21 300-minute period on shape 5; 1.6 item 21 20-minute limit on a single group). In 1.2 item 21, 1.3 item 21 and 1.4 item 18 the rejected plan is obviously dominated (its figure is already computed in part (b) or (c) and exceeds the limit), so (d) is a restatement, not a decision. Genuine trade-offs exist in 1.1 item 20, 1.4 item 21 (money against laddoos) and 1.6 item 19; use them as the model.
Fix: in 1.2 item 21, 1.3 item 21 and 1.4 item 18 make both plans feasible and let the rejected one lose on a second measure (waste, money earned, time), or ask (d) to name the limit at which the choice flips.

M2. Repeated ideas inside a concept (standard: about twice).
- C6M-1.4: "hexagonal numbers add up to cubes" in items 3, 5 (S3), 7 (row 4), 13(b), 19, 21; "6 x Triangular + 1" in items 2, 5 (S2), 7, 8, 13, 14, 19. Replace two or three, e.g. a reverse of the running total of Powers of 2 or a neighbouring-sum item not already used (items 10, 11 are both "neighbours add to a square").
- C6M-1.5: Koch counts 3, 12, 48, 192 in items 3, 5 (S3), 6, 15, 19, 21; complete-graph lines in items 1, 2, 9, 10, 14, 17, 18, 20 (eight of 22).
- C6M-1.6: complete-graph league (K9/K8/K12 pairs) in items 1, 3, 9, 10, 17, 18, 19; Koch in items 0, 5, 13.
Fix: swap one or two of each for a different idea in the same concept (stacked squares, regular polygon corner count, Powers of 3 running total).

M3. Easy-in-disguise (answer is one book line or one operation; bank allows none).
- 1.5: item 1 (28 lines -> 8 dots, a lookup of Triangular numbers), item 4 (bottom row of 6th = 11, rule in stem), item 8 (true/false, 9 not 5), item 11(b) (sides = corners), item 12 (square vs rectangle, book definition of "regular"), item 15 (divide three pairs, stem lists 3, 12, 48, 192).
- 1.6: item 0 (7th Koch term, continue x4), item 2 (12th square = 144), items 11 and 12 (sides = n + 2 and sides = corners; item 12 also repeats 1.5 item 11), item 14 (real-life situation with its answer in the stem).
- 1.1: item 9 (next three Triangular numbers 36, 45, 55 and the gaps 8, 9, 10), item 12 (odd vs Triangular differences), item 13 (finding three sequences that start 1, 3 by scanning Table 1).
- 1.3: item 12 (sum 30, not a square), item 13 (the book's L-shape explanation for 7 odd numbers).
- 1.2: item 13 (3rd square vs 3rd cube).
Fix: invert or add a step (for 1.5 item 4: which shape has a bottom row of 41 and how many triangles in all; for 1.6 item 2: which Stacked Squares shape has 225 squares).

M4. Slot template. Items 8-21 are in the same positions in all six concepts: two 2-mark openers (item 8 is "True or False ... reason/correction" in 1.1, 1.3, 1.5 and a "(a)/(b)" or true/false in the rest), items 14-15 claim-check ("<Name> says/claims ... test ... verdict") in 6/6, item 16 "Show that no ... " in 6/6 (1.1, 1.2, 1.3, 1.4 item 14, 1.5, 1.6), item 17 "Write a real-life situation" in 5/6, items 18-19 five-mark or 4-mark long, items 20-21 case studies in 6/6. Only the first eight slots are shuffled (type order differs in 1.2, 1.4, 1.6). Correct mcq option is the longest or tied-longest in 16 of 26 (62 percent, ties counted; mostly numeric options). Claim-check verdicts: wrong 7 (1.1 item 14, 1.2 item 16, 1.3 item 15, 1.4 items 15 and 16, 1.5 item 14, 1.6 item 15), right 3 (1.1 item 15, 1.3 item 14, 1.5 item 15), partly right 4 (1.2 item 14, 1.6 item 16 and the Aman/Priya-style items); good mix. multi_statement keys: "1 and 2 only", "1 and 3 only", "2 and 3 only", "1 and 3 only", "3 only", "1, 2 and 3" (spread good). AR keys: explains, not-explains, A false R true, not-explains, A true R false, explains (all four outcomes).
Fix: move the claim-check and "Show that no" frames to different positions in at least three concepts and vary the opening ("Test ... " vs "Find the error in ... ").

## LOW

L1. C6M-1.2 item 20 (and items 3, 7, 12) use the "6 x Triangular + 1" rule, which belongs to concept 1.4. Acceptable since the stem states the rule, but it pre-teaches 1.4.
L2. C6M-1.1 item 21 (d): Plan II is rejected because day 8 breaks the Rs 100 cap; a sharp student could cap Plan II at Rs 100 and reach Rs 250 by day 9, earlier than Plan I. Add "the plan must follow its rule exactly" to the stem.
L3. C6M-1.4 item 6 (AR): R is one example (6 + 10 = 16) offered for an "always" statement. The key (R true, does not explain) is right, but a student may read R as the proof; acceptable.
L4. C6M-1.3 item 18 key writes "2 x 13 - 1" for the 13th odd number; fine arithmetic but close to the scope_out nth-term formula. Say "the 13th odd number is 25 (count 13 odd numbers)".
L5. C6M-1.2 item 19 (d) and 1.2 item 21 (d) fine, but 12 by 12 costing Rs 600 against a Rs 100 limit is a strawman; see M1.
L6. Tags: "scenario" on pure-fact stems (1.4 item 1, 1.6 item 0) is cosmetic.
L7. Bloom/difficulty: every item is Hard or Hardest as the bank rule requires; Understand appears 3 times only. Fine.

## Per-concept verdicts
- C6M-1.1 Number sequences: pass (M3 items only).
- C6M-1.2 Visualising number sequences: pass (L1, M3 item 13).
- C6M-1.3 Sum of consecutive odd numbers: pass after minor fixes (M1 item 21, M3).
- C6M-1.4 Other relations among sequences: pass after fixes (M1 item 18, M2 repeats).
- C6M-1.5 Shape sequences: pass after fixes (M2, M3 heavy).
- C6M-1.6 Relating shape sequences to number sequences: pass after fixes (M2, M3).

## Counts read
132 items read, all keys recomputed, 0 key misses. HIGH 0, MEDIUM 4, LOW 7. Templated: mildly (slot positions 8-21 identical, case-study "cap" frame 9/12); numerically sound. Overall: pass (medium items are polish, not blockers).
