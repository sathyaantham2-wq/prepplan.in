# Review v3: Class 6 Mathematics ch10 "The Other Side of Zero" (dps/class6/ch10.json), after fixes from v2

Read: all 123 questions (C6M-10.1: 21, 10.2: 20, 10.3: 21, 10.4: 20, 10.5: 21, 10.6: 20). Every key recomputed in python or against the pages (fegp110 pages 025-028). Programmatic checks: 33 of 33 mcq/match key texts equal an option; 12 of 12 assertion_reason and multi_statement keys start with an option; step marks sum to the question marks in every short and long item; no option is named by position; no scope_out line is violated (no multiplication or division of integers, no |x|, no fractions, no ring, no learning sheets).

Counts: HIGH 0, MEDIUM 3, LOW 6.

The v2 HIGH (C6M-10.4 case study, supplier discount) is fixed: the stem now says the full Rs 9,000 is paid and the discount is a separate refund. Recomputed: Monday balances -500, -6700, -2600, -7900, -1100 (lowest -7,900, 5 negative days, net 720 - 750 = -30); Wednesday 3 negative days (360 - 450 = -90); Friday 1 negative day (-150); no-payment Thursday balance 1,100. All match the key. v2 M2, M3 (case 10.6 d now has a constraint and sources are no longer described in the stem), M5 (grid and dice repetition), M6 (10.1 MCQ 1 now a real trap), M8 (927) are fixed.

## HIGH
None.

## MEDIUM

**M1. C6M-10.6, mcq 0** "The Nine Chapters ... take the latest date, 200 CE ... Which reply is correct?" Key: "They were completed at most 428 years before Brahmagupta, and before the Bakhshali manuscript". The book says "completed by the first or second century CE", so with 200 CE as the latest date the gap is at least 428 years (exactly 428 with the date the stem tells you to take), not "at most". The key is still the only defensible option, but its wording is the wrong way round and will confuse a careful student. Fix: change the key and options 1, 2 and 4 to "428 years before Brahmagupta" / "328 years before Brahmagupta" (drop "at most").

**M2. C6M-10.6, still recall in disguise.** Items whose answer is a line of pages 266-267:
- mcq 4 (Bakhshali writes a symbol after the number): a one-line fact despite the scenario frame.
- short 11 (accounting first; symbol after the number): 2 marks of pure recall with the claim_check tag.
- long 17 (5 marks): parts (a) and (b) transcribe page 267 (Kautilya, Bakhshali, Brahmagupta's equal-footing treatment); only (c) needs a judgement, and it is a plain subtraction (628 - 300).
- short 13 (Ishita) repeats the same facts as long 17(a).
Fix: keep one of short 11 / short 13; turn mcq 4 into a comparison between two named manuscripts and a date; give long 17 a choice that needs weighing (for example, which one earlier work is closest to Brahmagupta's rules and why).

**M3. C6M-10.4, true_false short 8** (credits 13,500, debits 16,500, opening 2,000, verdict True) still has no misconception behind it and the verdict True just restates the sum. Fix: make the statement false by a real slip, for example "Because her credits and debits nearly cancel, she ends the week with a positive balance" (answer: False, 2,000 - 3,000 = -1,000).

## LOW

- **L1.** C6M-10.2, multi_statement: Statement 1 "(+40) - (-50) = -10" mentions no setting while the key's explanation talks about a level from -50 up to +40. Harmless, but drop the phrase "as from Level -50 up to Level +40" or open the stem with a lift line.
- **L2.** C6M-10.1 long 18(d) still repeats part (b) ("Why is -21 below -17 although 21 is greater than 17?"). Replace (d) with only "which gap is wider, and by how many integers".
- **L3.** C6M-10.5, long 17 (the six sign cases) is the book's own Figure It Out Q8 (page 266) and belongs better under 10.2 or 10.6; it is also 5 marks of one-step rule application. Add a twist, for example "give one case where your answer would change if the first number were 0".
- **L4.** C6M-10.1 mcq 0, mcq 3 and 10.5 mcq 0 are single-step applications; the bank allows no easy items, so make each carry one trap option built on a real slip (for example, counting "between" inclusively in 10.1 mcq 3 is already present; add it to 10.5 mcq 0 by giving a top row with a missing corner).
- **L5.** Slot order is identical in all six concepts (5 mcq, multi_statement, assertion_reason, fill_blank, [match], 8 short, 4 long, with the two case studies last), and the first four mcq of nearly every concept carry the "scenario" tag. Move the claim_check or reverse item to a different position in two concepts.
- **L6.** The grid 5 8 11 / -1 2 5 / -7 -4 -1 still appears in four items of C6M-10.5 (match, true_false, claim_check, case study 20). Acceptable because each asks something different, but swap the match item to another grid.

## Template check (counts)
- multi_statement keys: "1 and 3", "2 and 3", "1 and 2", "3 only", "1, 2 and 3", "1 only": six different keys, all three-statement format as the loader needs.
- assertion_reason verdicts: explains (10.1, 10.6), true but no explanation (10.3, 10.5), A true R false (10.2), A false R true (10.4): spread.
- claim_check: 9 items; verdicts No 3, Yes 2, partly 2, "No, both parts wrong" 1, plus one Yes: mixed. true_false: False 4, True 2 (see M3).
- Correct option is uniquely the longest in 4 of 33 option items (12 per cent): no length cue.
- Sentence frames differ item to item; not templated in wording. Ideas repeat mildly (L6, and the no-year-0 step three times in 10.5/10.6 with different dates).

## Per-concept verdicts
- C6M-10.1: pass (L2, L4).
- C6M-10.2: pass (L1).
- C6M-10.3: pass, cleanest concept (all token counts, pair counts and the box totals 29/36/37 against 30 recomputed).
- C6M-10.4: pass after M3.
- C6M-10.5: pass (L3, L4, L6).
- C6M-10.6: pass after M1; M2 recall remains the weakest area, partly because the history section is thin.

Overall: pass. No wrong key, no second defensible answer, no arithmetic error, no scope violation.
