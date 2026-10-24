# Review v3: Class 6 Mathematics, Ch 5 "Prime Time" (fegp105) - content/authoring/dps/class6/ch05.json

Third pass, after the fixes made from v2-class6-ch05.md. All 128 questions read (5.1: 21, 5.2: 21, 5.3: 20,
5.4: 22, 5.5: 22, 5.6: 22) against pages of content/extracted/fegp105/pages and the scope in
content/authoring/class6/ch05.json. Every key, count and case-study part was recomputed in python
(gcd/lcm, common factors, primes, sieve counts, leap years, formations, costs, raffle and budget sums, worst-case
counts) before comparing with the stored answer.

Programmatic checks: every mcq/match/assertion_reason/multi_statement key text equals exactly one option
(77 of 77 option-bearing items checked, none missing, none matching two); no duplicate options; step marks sum
to `m` on every short and long answer; no positional option references ("option (b)" and similar: none).
Scope: no HCF/LCM/GCD wording, no squares, no tests for 3/6/7/9, no Euclid, no long-division method taught
(the phrase "without long division" is fine). The leap-year rule (multiple of 4, except multiples of 100 not
of 400) is stated on page 019 and 032 of this book, so 5.5 leap-year items are within it.

## Status of the v2 findings

- v2 HIGH (5.5 idx 12, "which two could he check"): FIXED. Stem now says "Name one pair ... that is enough",
  key accepts 8 with 5 and 8 with 10. Checked: the only valid pairs are exactly those two (8 is not implied
  by anything else, and with 8 you need 5 or 10). Closed.
- v2 #2 (5.5 idx 20 Sports Day): FIXED. P gives 7 events (2092, 2096, 2104, 2108, 2112, 2116, 2120), Q gives 8
  on paper with 2100 breaking the "always 29 February" rule; P is the single supported answer, cost = 8-year
  gap 2096 to 2104. Verified.
- v2 #3 (5.1 idx 20 Annual Day): FIXED. "At least 5 but no more than 6 times": plan 1 gives 8 (out), plan 2 gives 5
  (200/40). One answer.
- v2 #4 (5.3 idx 18 lights): FIXED. "Does not count the start at time 0" added; 10, 4, 3 correct; (6,10) fails the
  "after 50 s" rule; (7,10) beats (9,10) on shared blinks. One answer.
- v2 #5 (5.3 idx 19, 5.2 idx 20): FIXED. 5.3-19: smallest sizes 4 (A+B, 19 teams, Rs 1,520, over budget) and 3
  (A+C); next size 5 fits B+C, C+D, B+D within budget; most students = B+C (85 vs 80 vs 75). 5.2-20: 48 is Rs
  16,800 (over), 36 gives 2 formations, 40 gives 3 and costs Rs 14,000; 47 is Rs 16,450 and has no formation.
  One answer each.
- v2 #12 (5.6 idx 21 raffle): FIXED. 25, 12, 8 winners, Rs 1,970; 10 extra winners (25 multiples of 4 less 12 of 8
  less 20, 60, 100), Rs 2,170; Rs 30 spare / 10 = Rs 3. One answer.
- v2 #6 (soft "either choice" endings): mostly fixed; two remain (items 1 and 2 below).
- v2 #7 (identical slot order), #8 (correct option longest), #9 (repeated ideas), #10 (mechanical five-markers),
  #11 (easy in disguise), #14 (True items without a trap): NOT changed. See below.

## HIGH

None. No wrong key, no second defensible answer, no arithmetic or fact error found in 128 items.

## MEDIUM

1. **C6M-5.4, idx 21 (case study, quiz)**: key ends "Any sensible plan with these numbers is accepted", and part
   (d) asks "how would you use the leftover time?" The number part is settled (10 x 20 = 200 s, 160 s left,
   floor(160/45) = 3 full factorisations, 25 s spare) but the decision itself has no marking point
   ("spend the spare 25 s on quick checks of that pair" is not a supported choice). The step line also does not
   say what earns the mark. Fix: state an aim in the stem ("they want to be certain about as many of the 4
   unsettled pairs as possible") and make the (d) mark "3 pairs fully factorised, the 4th left unverified, 25 s
   spare", dropping "any sensible plan is accepted".
2. **C6M-5.5, idx 21 (case study, pencils)**: key ends "a reasoned preference for 10 is also accepted". The
   numbers decide it (Rs 1,59,776 against Rs 1,57,312, a gap of Rs 2,464 and the extra purchase already netted
   out), so accepting the opposite choice is a second answer in the rubric. Fix: either add a stated aim in the
   stem ("she wants the larger earnings") and delete the accepted-alternative sentence, or add a constraint that
   makes 10 a real rival (for example "she cannot buy extra pencils") so the trade-off is genuine.
3. **Template, slot order (counts)**: all six concepts have the same slot sequence: 5 mcq (1 mark), multi_statement,
   assertion_reason, fill_blank, match, five 2-mark short answers, then 3-mark short answers, two 5-mark long
   answers, two 4-mark case studies. 5.1 and 5.2 are identical item for item; 5.3 omits only `match`; 5.4, 5.5,
   5.6 are the same with a fourth 3-mark item. The tag order is also identical (true_false, claim_check,
   show_impossible, reverse at the same positions). Unchanged since v2. Fix: reorder differently in at least
   three concepts (move the case study, long answers or a 3-marker earlier; vary one concept's 2-mark count).
4. **Template, correct mcq option is the longest**: 21 of 30 (70%), unchanged. 5.5 is 5 of 5 and 5.2 is 4 of 5.
   Worst: 5.3 idx 4 (key is a full sentence, three short distractors), 5.4 idx 2 and 3, 5.1 idx 4 (key far
   longer than the other three). Fix: lengthen the distractors or shorten the key in about 8 items so the rate is
   40% or less.
5. **Repeated ideas inside a concept (unchanged from v2)**:
   - 5.1: counting "how many times idli-vada is said up to N" appears in idx 2 (answer 8), 7 (fill_blank, 8),
     10(b) (8) and 20(a) (8): the answer 8 occurs four times. Replace idx 7 (for example "find the largest N
     below 100 for which idli-vada is said exactly 5 times with 4 and 6": 60 to 71) and change one of 2 or 10(b).
   - 5.4: "splitting into pieces does not reveal every factor, so no common piece proves nothing" is in idx 0 (Dev,
     105 and 130), 14 (Dev, 72 and 55) and 21 (Rhea, 84 and 90). Keep one, change the other two.
   - 5.5: idx 11 and idx 14 both use 116 with "last two digits 16" and conclude "use the last three digits"; idx 2
     and idx 11 both argue "ends in 2" (12 versus 22 / 16 versus 26) against a last-digit rule. Change idx 14 to
     a different number pair or to the 4-test on a three-digit number.
   - 5.6: the set 16, 24, 40, 51 is used in idx 12 and idx 18(i) with the same answer 51. Change one set.
   - 5.2: 49, 77, 91 (composites that survive 2, 3, 5) appear in mcq idx 1 (91), idx 11 and case study idx 19.
     Keep two, or have idx 11 ask about a different range.
6. **Mechanical five-markers labelled Hardest**: 5.3 idx 16 (five co-prime checks) and idx 17 (five lcm
   computations), 5.4 idx 18 (five factorisations), 5.5 idx 18 (remainders for four numbers plus one rule), 5.6
   idx 18 (five odd-one-out sets). Every sub-part repeats one procedure, marks for patience not for reasoning.
   Fix the three most mechanical (5.3 idx 16, 5.4 idx 18, 5.6 idx 18) so that two or three sub-parts require a
   different judgement (a "why", a reverse, a set where two answers compete), or relabel the difficulty.
7. **Easy in disguise (one-line facts the book states)**: 5.2 idx 12 (why 1 is not on the list: "1 has only one
   factor"), 5.4 idx 12 (3x3x7 versus 3x7x3: the book's own order-does-not-matter point; labelled Understand, the
   only Understand item in the pack), 5.3 idx 4 (early common multiple means common factor: the book's
   observation, one-step mcq), 5.1 idx 6 (assertion-reason on 28 and 70 repeats the book's Figure-it-Out
   answer), 5.5 idx 19 (five restatements of the chapter's divisibility relations). Make each use the fact on a
   new case: for example 5.4 idx 12 could give four written factorisations of 180 and ask which are not the
   factorisation at all and why.

## LOW

8. **C6M-5.6, idx 19 (Karan)**: stem restricts the properties to "prime or composite, and multiples of 3, 4, 5, 7
   and 8", but the answer (iv) says 14 "shares the property of being even with 40". "Even" is not on the allowed
   list. Fix: say "14 is a multiple of 7 like 21, and not a multiple of 3, 4, 5 or 8 like 25, so for those
   properties it is not the only one" or add "and being even" to the property list. (25 is also valid for (iv);
   the step allows "14 or 25".)
9. **True/False verdict spread**: 5.2 idx 13 and 5.6 idx 13 are True with no misconception to separate a wrong
   reason from a right one (4 False, 2 True in total, which is fine, but these two True items are weak). Make
   5.6 idx 13 a trap: "10 is the only multiple of 5" in the set 10, 15, 21, 33 (False because of 15), or add a
   plausible wrong reason to reject.
10. **multi_statement uses three statements (1, 2, 3)** in all six concepts, while CLAUDE.md names a two-statement
    house style for Maths. The DPS standard allows three; note only. Key spread is good: "1 only", "2 and 3 only",
    "1 and 3 only", "1 and 2 only", "3 only", "2 only" (each statement false at least once, no repeated key).
11. **C6M-5.1, idx 0 and 1; 5.5, idx 2**: one-step scenario mcqs labelled Apply Hard (largest common jump size;
    first common multiple of 4 and 6; one counter-example to a last-digit rule). Acceptable as the 1-mark slot but
    the thinnest items; if the bank budget allows, give idx 1 a second step (for example the first number said
    after 50).
12. **C6M-5.2, idx 19(d)** is still a classification of three cutoffs rather than a decision; acceptable.
13. **Claim-check verdict mix**: 5.1 "not right", 5.2 "right", 5.3 "partly right", 5.4 "right conclusion, wrong
    method", 5.5 "not right", 5.6 "wrong reason, right conclusion about something else". Mixed, fine.
14. **Assertion-reason key spread**: 5.1 explains, 5.2 A false, 5.3 R does not explain, 5.4 R false, 5.5 explains,
    5.6 R does not explain. Mixed, fine. All six checked for A and R truth.

## Verified correct (no action)

5.1: gcd/lcm items, 100/12 = 8, 120/15 = 8, 200/24 = 8, common factors of 18 and 48 (1, 2, 3, 6), match key, 8 and
9 meeting at 72 as the only pair below 10 with lcm over 70 (python: only (8, 9)), 150 split 50/30/10/40/20/80,
perfect-number sums 12, 15, 28, 42, stall case (5, 1, 2, 0 sizes; 20, 4, 8, 0 winners; Rs 1,000, 200, 400, 0; only C),
Annual Day (24 then 8; 40 then 5). 5.2: 53, 91, 41 to 50 (3 primes, 7 composites), 66, 59 and 61, 90 + 7 = 97,
83/89/97, 15 primes up to 50, 24 evens, 7 new multiples of 3, 34 composites, 25 left after 2, 3, 5 (22 primes), dance
case. 5.3: all 5 mcq answers, 126, 70 and 40, all ten pairs among 12, 25, 35, 49, 56 (5 co-prime), the five pairs in
idx 16, 36/30/120/7/50, lights (30, 70, 90; 10, 4, 3), quiz teams. 5.4: 270, 504 against 48, 360, 54 x 45 has five
3s, match key, 392, 1080, 440 by 22 yes and 33 no, 315, 84, 7 x 11 x 13 = 1001, 126/405/2310/48x75/1470, 1260/28 =
45, boxes (30, 36, 45; 102, 85, 68; Rs 1,428, 1,360, 1,496). 5.5: 5,436, 2400, 22, 7,2d4 with d = 2 only, 5/0/1, 4,56d
with d = 0, match key, leap years 2000 and 2032 and 24 in 2001 to 2100, 1,624 and 116, 1,220, five-number set,
remainders, pencils (4 left, 3,073 packs, Rs 1,59,776 against Rs 1,57,312). 5.6: all mcq, 61, match key, 25 special
in two ways and still special with 27, 53, 51, 33/39 odd, 14/22/35/46, 30/42/70/105, 21 numbers from 40 to 60
(5 primes, 6 and 5 multiples of 4 and 5, 11 even; worst cases 16, 15, 16, 11), raffle.

## Counts read

- Read: 128. Types: short_answer 51, mcq 30, long_answer 24 (12 case studies), multi_statement 6,
  assertion_reason 6, fill_blank 6, match 5. Bloom: Apply 50, Analyse 47, Evaluate 24, Create 6, Understand 1.
  Difficulty: Hard 104, Hardest 24, Easy 0.
- Wrong keys: 0. Second defensible answers: 0. Positional references: 0. Keys not matching an option: 0.
- Correct mcq option is the longest: 21 of 30 (70%).
- Case studies ending in an accepted-alternative or "any sensible plan": 2 of 12 (5.4 idx 21, 5.5 idx 21).
- Identical slot order across concepts: yes (5.1 and 5.2 item for item).

## Verdict per concept

- C6M-5.1: pass after fixes (items 5, 7; all arithmetic correct).
- C6M-5.2: pass after fixes (items 5, 7, 9).
- C6M-5.3: pass after fixes (items 4, 6; case studies now clean).
- C6M-5.4: pass after fixes (items 1, 5, 6, 7).
- C6M-5.5: pass after fixes (items 2, 5).
- C6M-5.6: pass after fixes (items 5, 6, 8, 9).

Overall: pass after fixes. Every fix requested for correctness was done properly and the arithmetic is clean;
no HIGH remains. What is left is the visible chapter template (same slot order, 70% longest keys, some
repeated ideas and mechanical five-markers) and two soft case-study endings. None of this blocks loading
on correctness grounds, but the template items are the same as in v2 and should be done before the bank is treated as final.
