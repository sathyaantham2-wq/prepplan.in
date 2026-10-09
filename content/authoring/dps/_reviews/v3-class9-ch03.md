# Review v3: class9 ch03 (The World of Numbers, iemh103)

File: content/authoring/dps/class9/ch03.json. Latest prior review: v2-class9-ch03.md (2 HIGH, 6 MEDIUM, 6 LOW).
Read: 124 questions (3.1: 21, 3.2: 20, 3.3: 20, 3.4: 20, 3.5: 22, 3.6: 21). Every numeric key, all 6 multi_statement and
all 8 assertion_reason were recomputed (by hand/in code) before reading the key. A programmatic check that each mcq/match/
multi_statement key is literally one of its options was also run.

Result: 1 HIGH, 2 MEDIUM, 5 LOW. Verdict: NOT PASS (one HIGH left, easy fix).

## v2 items: status
- 3.4 Q15 key/option mismatch: FIXED (key now identical to option 0; q^2 = k^2 recomputed, correct).
- 3.6 Q15(c) "shifted left by 3": FIXED (rotation left by 4, verified 076923 -> 230769; cycles 1,3,4,9,10,12 / 2,5,6,7,8,11 verified).
- 3.2 Q13 strawman: FIXED (big packs Rs116 for 5/3 kg, extra 1/6 kg at Rs48/kg; recomputed, genuine trade-off).
- 3.2 repeated 5/0 idea: reduced (only AR Q3 remains).
- 3.3 Q15 farmer case: FIXED (per-night damage vs Rs500 cover; 2400/400/0 and 900/1000/2800 recomputed, correct).
- 3.4 Q18 Madhava-series computation: FIXED (now (99/70)^2 - 2 = 1/4900, verified).
- 3.5 Q12 duplicate of Q2: FIXED (18/45 now vs 21/35). 3.5 Q18 rounding rule: FIXED (stated in stem).

## HIGH
1. C9M-3.4 Q0 (mcq, index 0): STILL BROKEN after the fix. Key reads "p^2 is twice an integer, so p^2 is even and a number whose
   square is even is itself even" but NO option says that. Option 0 reads "...so p^2 is even, and an even square can also come
   from an odd p" (false statement, and not equal to the key); options 1-3 are the circular/lowest-terms/irrational reasons.
   So the loader cannot match the key and the true statement is absent: the item has no correct option. Fix: make option 0 end
   "...so p^2 is even, and a number whose square is even is itself even", and keep a different wrong option (e.g. the "odd p" one).

## MEDIUM
1. C9M-3.4 uses 17/12 (Q9 and Q13) and 99/70 (Q18) as approximations of sqrt2. These fractions are not in the book (pages 013, 016,
   021 give only the diagonal construction and 1.4142...). Arithmetic is right (289/144 - 2 = 1/144; 9801/4900 - 2 = 1/4900) and a
   student can verify them, so it is not a wrong fact, but three items on "a close fraction is not sqrt2" is one idea retested, and
   Q13 (d) is obvious (1/144 error vs 0.04). Vary Q18 (e.g. another construction) or make Q13's alternative rope competitive.
2. C9M-3.3 "take the average" still drives about six items (AR Q3, Q9, Q11, Q13, Q14, Q19): reduced from ten but still one idea.
   Replace one or two with common-denominator density or absolute-value problems.

## LOW
- C9M-3.4 proof-of-sqrt2 steps appear in Q0, Q4, Q8, Q11, Q15, Q19 (six): Q4 (a)-(b) is a subset of Q11.
- C9M-3.5 Q2 (21/35) and Q12 (18/45) are still the same misconception (unreduced fraction), now different numbers.
- C9M-3.5 Q17 (d) (round vs sell in 12 g lots) is contrived; the "lots of 12 g" option is clearly the exact one.
- C9M-3.1 Q5 (Lothal ratio 7 per 3) is mental arithmetic, easy in disguise; Q15/Q14 acceptable now.
- AR keys are explanation strings, not literally in the option lists (all chapters do this; assumed to be loader convention).
  3.2 Q17 option wording is standard now.

## Checked and clean
All numeric keys in 3.1, 3.2, 3.3, 3.5, 3.6 recomputed correct (e.g. 3.1 Q14 -100; 3.2 Q12 12 panels, 1/10 m short; 3.3 Q15 costs;
3.5 Q16 100th digit 9, Q18 20th digit 9; 3.6 Q13 81/110, Q16 4/11 km, 91 m, 364 m choice; 3.6 Q18 1142856 = 999999 + 142857).
Multi_statement keys: 3.1 "1 and 3 only", 3.2 "2 and 3 only", 3.3 "1 and 2 only", 3.4 "2 and 3 only", 3.5 "1 only", 3.6 all three: all
correct and varied. AR keys all correct. No positional option references. No second defensible answer found except 3.4 Q0 (no
correct option). Facts (Ishango, Lothal, Saraswati, asanna, Lambert 1761, Aryabhata 499, Madhava 14th c., 2.47 = 2.46999..)
are in the book. Scope: Madhava only referenced as "an infinite series", acceptable.
