# Review v6: Class 7 Maths Part I ch 3 (gegp103), `content/authoring/dps/class7/p1ch03.json`, after the v5 fix pass

Scope: the 20 items the fixer changed were recomputed by hand/python (indices are 0-based): 3.1 Q19; 3.2 Q19; 3.3 Q3, Q8; 3.5 Q1, Q13, Q16;
3.6 Q13, Q15, Q16, Q18; 3.7 Q0, Q14, Q16; 3.8 Q10, Q12, Q20. Structural checks run over all 188 items: step marks = item marks everywhere, every
key is among its options, no duplicate options, no option named by position. Unchanged items were taken as passed in v5.

## HIGH

1. **C7M-3.8 Q20 (case study) is internally impossible and (d) is not uniquely determined.** Stem: "A bowler may bowl at most 4 overs in the match",
   Kabir has bowled 3, the spinner 3, and "a third bowler is finishing the current over" (17th). 16 overs are done, so the other bowlers must have bowled
   16 - 3 - 3 = 10 overs; with a 4-over cap that needs at least two more bowlers, and the stem never says so. Consequences:
   (i) the third bowler cannot have bowled more than 4 overs, and his quota for the 19th is not stated;
   (ii) a fourth bowler could take the 18th or the 19th, so "Which over does the third bowler take?" has a second defensible outcome (the spinner on
   the 19th and a fourth bowler on the 18th, third bowler not bowling at all). The key's "the 18th goes to the spinner (the only one left for it)" and
   "someone else" = the third bowler are assumptions, not given facts. Also (c) "someone else" is read in the key as the third bowler.
   Smallest fix: add to the stem "Every other bowler has used up his 4 overs; the only bowlers who can still bowl are Kabir, the spinner and the
   third bowler, who has bowled 2 overs so far including the 17th." Then 18th/19th/20th must be shared among exactly these three, the key's chain
   (Kabir 20th, spinner not 20th and not... , third bowler not 18th) gives one arrangement: spinner 18th, third bowler 19th, Kabir 20th. Check also that
   the spinner has only 1 over left (4-3), so each of the three bowls exactly one of the last three: consistent. Keep "(c)" wording "someone else (the
   third bowler)".

(All other changed keys recomputed correct, each with one defensible answer; see below.)

## Changed items recomputed

- **3.1 Q19**: 27+35+18 = 80 tenths = 8 m; 81-80 = 1 tenth short; with trim 86, so 6 tenths short; three 2/10 cuts = 6 tenths = Rs 180, one 1 m piece (10 tenths)
  Rs 90 with 4 tenths spare; border only: one cut (Rs 60) is cheaper than the piece. Correct. Pronoun now "she" in stem and key. Pass.
- **3.2 Q19**: P: 4x4 = 16 parts, 1/16; Q: 100 parts, 1/100; 1/16 = 0.0625 is below 0.1, so both meet the 0.1 need; 2.37 - 2.3 = 0.07. Part (d) now
  has exactly one defensible answer: the record sheet allows only decimals with at most two places, so Q is the only scale all of whose marks qualify;
  P's marks 1/16, 3/16 ... are 0.0625, 0.1875 ... (4 places) and cannot be written. The drawback (slow to read) is tied to the stated 30 minutes and the
  "more marks, slower" sentence. The key's wording "most of its marks ... only marks such as 1/4, 1/2, 3/4 can" is now accurate. CONFIRMED single answer. Pass.
- **3.3 Q3**: 0.3+0.4+0.2 = 0.9 L, 0.1 L fits, 0.05 L spills. Correct, unique.
- **3.3 Q8**: 3.5+0.35+12 = 15.85, +0.5 = 16.35 > 16.000, so display 16.350 g and warning. Correct, unique.
- **3.5 Q1**: 0.25+1.5+0.38 = 2.13 kg, 130 g above 2 kg. Correct, unique.
- **3.5 Q13**: 3 x 25 = 75 paise + 85 paise = Rs 1.60; Rs 2 - 1.60 = Rs 0.40. Correct; "Rs 4.00" distractor format fixed.
- **3.5 Q16**: 1.2 kg + 250 g = 1450 g (c); 2 m - 110 cm = 90 cm (d); Rs 1 - 35 p = Rs 0.65 (a); 4.3 cm + 2.7 cm = 7.0 cm = 0.07 m (b). Key 1-c 2-d 3-a 4-b
  correct; the three other permutations each break at least one pair. Unique.
- **3.6 Q13**: 17.4+6.85+0.09 = 24.34; with 0.09 misplaced as 0.9: 17.4+6.85+0.9 = 25.15, matches the stem. Correct.
- **3.6 Q15**: 52.806 - 25.9 = 26.906; whole parts 52-25 = 27, range 26 to 28; 52.547 = 52.806 - 0.259 so "treated 25.9 as 0.259" is exact. Correct, unique.
- **3.6 Q16**: 25 - 9.7 = 15.3, 15.3+9.7 = 25. Correct.
- **3.6 Q18**: 1.6 - (0.478+0.7) = 1.6 - 1.178 = 0.422. Correct, unique.
- **3.7 Q0**: 47.3 - 18.8 = 28.5; whole parts 47-18 = 29 so range 28 to 30; 31.5 is outside (ruled out), 29.5 is inside (not ruled out) yet wrong. The stem's claim is true. Correct.
- **3.7 Q14**: 31-12 = 19, range 18 to 20; 20.4 outside; 31.4 - 12.8 = 18.6. Correct.
- **3.7 Q16**: range 15 to 17; 9.6+6.4 = 16.0; 9.35+6.65 = 16.00 and the carry description (5+5, 3+6+1, 9+6+1) is right. Correct.
- **3.8 Q10**: 0.9 h = 54 min, so 1.9 h = 1 h 54 min, agree; 114 - 69 = 45 min. Correct.
- **3.8 Q12**: 9.4 = 9x6+4 = 58 balls; 94 = 15x6+4 -> 15.4; 120-94 = 26 = 4x6+2 -> 4.2. Correct.
- **3.8 Q20**: parts (a)-(c) correct (16x6+4 = 100, 20 remain, 2 balls left in the 17th, 18 balls = 3 overs, each of Kabir/spinner 1 over left); (d) see HIGH 1.

## MEDIUM

1. **C7M-3.8 Q20 (d)** after the HIGH fix: the step mark for (d) lists "rules out the 18th ... spinner on the 18th" - keep the key consistent with the revised stem.
2. **Still light (carried from v5, not blocking):** 3.3 Q3 and Q8 (one to two computations, decoration around them), 3.5 Q1 (convert, add, compare), 3.5 Q16
   (four conversions), 3.6 Q13 (one column sum; the "find the misplaced digit" idea is the only thinking), 3.7 Q0 (task is 47.3 - 18.8 once the stem hands over
   the range). Each is a recompute-and-compare, not a one-line book fact, so they are acceptable; no further change required.
3. **Repetition (carried):** 3.6 Q14-Q17 is still a four-item MCQ run; 3.7 is still mostly the range rule; 3.8 still has an overs/balls pair (Q12, Q20) and
   decimal-hours pair (Q10 and one other).

## LOW

- C7M-3.7 Q16: "give a second pair, each with two digits after the point" - "each" is ambiguous (both pairs or the second pair only). Say "a second pair, each number
  with two digits after the point".
- C7M-3.6 Q15: correct option is the longest of the four (a length tell). Shorten it to "Wrong: the range is 26 to 28; 26.906 g is left (she used 0.259)".
- C7M-3.1 Q19 part (a) remains a bare conversion (a ramp; acceptable).
- C7M-3.5 Q13: "1970s bill" with a "Rs 2 coin" is cosmetic only; no change needed.
- Scope: no breach of scope_out found in the changed items; paise and unit conversions are in the book (pp. 023, 024, 034); no decimal multiplication or percentages.

## Verdict per concept
- C7M-3.1: pass.
- C7M-3.2: pass (Q19 now has one defensible answer).
- C7M-3.3: pass.
- C7M-3.4: pass (unchanged this pass).
- C7M-3.5: pass.
- C7M-3.6: pass (LOW length tell on Q15).
- C7M-3.7: pass (LOW wording Q16).
- C7M-3.8: pass after fix (Q20 stem must state the other bowlers have exhausted their quota).
- C7M-3.9: pass (unchanged this pass).

## Counts read
188 items (20 changed ones recomputed in full, all 188 structurally checked). mcq 40: correct option longest-or-tied in 22 (55%), strictly longest in 8 per v5; no
systematic tell. claim_check: 1 per concept (9). multi_statement keys: "1 and 3 only" x3, "2 and 3 only" x2, "1 and 2 only" x2, "3 only" x1, "1 only" x1 (spread fine).
Slot order differs per concept. Templated: no.
Overall: pass after fixes (one HIGH, 3.8 Q20 stem inconsistency; all other keys correct).
