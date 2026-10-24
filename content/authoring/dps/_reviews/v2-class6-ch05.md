# Review: Class 6 Mathematics, Ch 5 "Prime Time" (fegp105) - content/authoring/dps/class6/ch05.json

First independent review. Read all 128 questions (21+21+20+22+22+22) against pages 001-033 of
content/extracted/fegp105/pages and the scope in content/authoring/class6/ch05.json. Every key,
count and case-study part was recomputed in python (gcd/lcm, divisor lists, sieve counts, leap years,
raffle and budget arithmetic) before comparing with the stored key. Programmatic checks: every
mcq/match key equals one of its options (128/128 fine); every assertion_reason and multi_statement key
starts with exactly one option (12/12); no duplicate options; four options everywhere; step marks sum to
`m` everywhere; no positional option references ("option (b)" etc.: none; the four regex hits were
"choice"/"(a) A and D" false positives). Scope: no HCF/LCM/GCD wording, no squares, no tests for
3/6/7/9, no Euclid, no long-division method is taught; the "without long division" phrases are fine.

Result in one line: arithmetic is clean (no wrong numeric key). One rubric with a second defensible
answer (HIGH), several soft decisions and repeated ideas (MEDIUM), a visible chapter-level template (MEDIUM).

## HIGH

1. **C6M-5.5, index 12 (short_answer, 2 marks)**: "Guna says he needs to check 7,640 for only two of the
   numbers 2, 4, 5, 8 and 10 to be sure it is divisible by all five. Which two could he check ...".
   Key and step: "He checks 5 and 8" / step "Names 5 and 8". The question says "could", and 8 with 10 is
   equally valid (10 gives 2 and 5, 8 gives 4 and 2), so a correct student answer "8 and 10" loses the
   mark. Second defensible answer in a rubric. Smallest fix: change the stem to "Name one pair of
   them that is enough" and make the step "Names a valid pair: 8 with 5, or 8 with 10", or change
   the 'a' text to "8 together with either 5 or 10 (8 gives 4 and 2; 5 with an even number gives 10;
   10 gives 2 and 5)". Also note this is book Figure-it-Out Q5 almost verbatim (book answer 5 and 8).

## MEDIUM

2. **C6M-5.5, index 20 (case study, Sports Day)**: the stem says the event is held on 29 February "so it
   can only be held in a leap year", yet Schedule Q (every 4 years from 2092) puts it in 2100, which is
   not a leap year; the key then says "Either choice is accepted" and treats Q as workable with "a
   different date or a skipped event". The stem rules Q out, so (d) is not a real trade-off and the
   rubric contradicts the stem. Fix: drop the "only in a leap year" constraint and state a real aim
   (for example "he wants the event to be on 29 February but never more than 8 years apart"), or make
   (d) a decision with one supported answer (P) and a cost for it.
3. **C6M-5.1, index 20 (case study, Annual Day)**: "not so often that the game stops flowing" is not a
   number, so (d) cannot be marked on the data; key says "Either plan can be justified ... Either with a
   reason earns the mark". Fix: give a cap ("no more than 6 stands") so plan 2 (5 stands) is the only
   answer, or keep both plans valid and add the numeric aim "closest to 6 stands".
4. **C6M-5.3, index 18 (case study, lights)**: stem says both strings "start together at time 0" and asks
   for "shared blinks in 300 seconds". Counting time 0 gives 11, 5 and 4 instead of the keyed 10, 4 and 3.
   Fix: add "do not count the start at time 0" in the stem.
5. **C6M-5.3, index 19 and C6M-5.2, index 20 (case studies)**: decision parts have no deciding objective
   (5.3: three pairs B+C, C+D, B+D all give team size 5 within budget, the key says "either choice is
   acceptable"; 5.2: 36 vs 40 dance team, key says "40 for variety or 36 if saving money"). These are
   soft decisions, not a trade-off the numbers settle. Fix: state the aim in the stem (for example
   "the school wants to involve the most students within budget", which makes B+C the answer, or
   "the lowest cost with at least 3 formations", which makes 40 the answer).
6. **Chapter-wide, decision endings**: 8 of the 12 case studies end the key with "either choice is
   acceptable / any sensible plan is accepted" (5.1-20, 5.2-20, 5.3-18, 5.3-19, 5.4-21, 5.5-20, 5.5-21,
   5.6-21), and 5.2-17 / 5.1-15 / 5.4-15 do the same in a long or short answer. That is a repeated
   authoring move that weakens the "last part is a real decision" rule. Keep it only where the stem
   gives two conflicting aims; elsewhere (5.1-20, 5.2-20, 5.3-19, 5.5-20) give one aim so there is one
   supported answer. 5.4-20 (box sizes, cheapest = 36) and 5.1-19 (stall, only pair C meets both limits)
   are the good models.
7. **Template, slot order (counts)**: all six concepts have exactly the same slot sequence, to the item:
   5 mcq (1 mark), multi_statement, assertion_reason, fill_blank, match, then 5 two-mark short answers, 3
   (or 4) three-mark short answers, two 5-mark long answers, two 4-mark case studies. Even the tag
   order is the same (true_false at index 8/13, claim_check, show_impossible, reverse in the same slot
   positions). Reorder, and vary the shape of some slots, per concept (the standard's anti-template
   rule). 5.3 has no `match` item (chapter total 5 meets max(2, 3), so only a note).
8. **Template, correct option is the longest**: 21 of 30 mcq (70%); 5.5 is 5 of 5, 5.2 is 4 of 5. In
   5.4 index 2 and 3 the key is a full sentence and the distractors are shorter or vaguer; 5.3 index 4 the
   key is the longest sentence by far; 5.5 index 0 and 4 likewise. Even the options out (lengthen the
   distractors or shorten the key) so that no more than about 40% of keys are longest.
9. **Repeated ideas inside a concept** (the same move re-asked with new numbers):
   - 5.1: counting common multiples up to N appears in index 2 (8), 7 (fill_blank, 8), 10(b) (8), 17(iii)
     (10) and 20(a) (8); "first common multiple of two numbers" in 1, 10(a), 12, 14, 16. Replace two
     of the "how many times" items with a different idea (for example the number-of-common-factors or
     "find the missing second number" reverse).
   - 5.3: "first common multiple equals the product" is in index 1, 4, 7, 9, 17 and the lights case study 18;
     "even or odd pairs and co-prime" is in 5 (statement 2), 11, 12 and 13. Replace 12 or 13 and one of 7/9.
   - 5.4: "splitting into pieces does not show every factor, so no common piece proves nothing" is in 0 (Dev,
     105 and 130), 14 (Dev, 72 and 55) and 21 (Rhea, 84 and 90). Change two of them.
   - 5.5: the 12 versus 22 last-digit argument is in index 2 and 11; leap years are in 1, 9, 13 and 20.
   - 5.6: the set 16, 24, 40, 51 is used twice (index 12 and 18(i), same answer 51); "pick the only prime
     in the set" is in 7, 10 and 18(ii).
10. **Mechanical five-markers labelled Hardest**: five repeats of one procedure, copied from the book's own
    exercise: 5.3 index 16 (five co-prime checks) and 17 (five first-common-multiple computations,
    Bloom "Evaluate"), 5.4 index 18 (five factorisations, book Ex 1), 5.5 index 18 (remainders for five
    numbers, book Ex 4), 5.6 index 18 (five odd-one-out sets). They are marks for patience, not DPS "5 mark"
    reasoning. Fix at least 5.3-17, 5.5-18 and 5.4-18 so that each part demands a different judgement
    (for example part (v) a "why" or a reverse), or lower the Bloom/d label to match.
11. **Easy in disguise (a one-line fact the book states)**: 5.2 index 12 ("Explain why 1 is neither prime nor
    composite": the book's sentence "1 has only one factor"); 5.4 index 12 (why 3x3x7 and 3x7x3 are not
    different: the book's "order does not matter" paragraph); 5.5 index 11 (12 and 22 end in 2, so last digit
    cannot decide: the book's own argument; the same idea is MCQ index 2); 5.3 index 4 (early first common
    multiple means a common factor: the book's observation, and the key is the longest option); 5.1 index 6
    (assertion-reason on 28 and 70 reproduces book Ex Q7 and its answer "1, 2, 7, 14"). Make each ask the
    student to use the fact on a new case (for example give a number and ask the student to build a case
    where the book's argument breaks), not to repeat it.
12. **C6M-5.6, index 21 (case study)**: part (a) and (b) are needed from the chapter, but (d) accepts "any
    plan within Rs 2,000" and the key's own plan ("about Rs 3 each") is a number the student is not asked to
    compute elsewhere; fine arithmetic (25, 12, 8 winners, Rs 1,970; extra 10 winners, Rs 2,170 all
    verified) but the decision is thin. Add "she may change the extra prize amount but not the number of
    winners", so the answer is Rs 3 per ticket.

## LOW

13. **C6M-5.1, index 5; 5.2, 5; 5.3, 5; 5.4, 5; 5.5, 5; 5.6, 5 (multi_statement)**: these use Statements 1-3.
    CLAUDE.md says Maths uses two statements (I, II); the DPS standard section 10/12 says "Statements 1, 2
    and 3". Fine under the DPS standard; note it for the caller. Key spread is good ("1 only", "2 and 3
    only", "1 and 3 only", "1 and 2 only", "3 only", "2 only"; every statement position is false at least
    once).
14. **C6M-5.4 index 13 and C6M-5.6 index 13 (true_false)**: both "True" and a one-line reason (a 2 and a 5 give
    10; the set 10, 21, 33, 39 has one even number). The chapter has 3 True and 3 False, which is balanced,
    but these two True items carry no misconception. Replace one True with a trap such as "Every number with
    a 2 and a 4 in its factorisation is divisible by 8" (False; needs three 2s).
15. **C6M-5.6, index 19 (Karan)**: "special" is open ended, so "14 is not special for the properties used"
    is a judgement. Keep, but say in the stem "using only the properties prime/composite, multiples of 3, 4,
    5, 7 and 8".
16. **C6M-5.6, index 20 (mystery number)**: well built and verified (21 numbers; 5/16, 6/15, 5/16, 11/10;
    even is best), but it is an information puzzle that goes beyond the book's special-numbers activity; it
    stays within chapter skills, so no change is required.
17. **C6M-5.2, index 19**: part (d) is a classification of three cutoffs rather than a trade-off decision;
    acceptable but if reviewing again, make it "which N=40, 60, 100 would you set for a class that has only
    10 minutes" or similar.
18. **C6M-5.1, index 0 and 1, C6M-5.5 index 2**: one-step gcd or lcm or "which number" scenario MCQs
    (labelled Apply Hard). They are application items in the chapter's own vocabulary and acceptable as the
    1-mark slot, but are the thinnest items in the pack.

## Verified correct (no action)

Every key below was recomputed. 5.1: gcd(18,42)=6, lcm(4,6)=12, 120/15=8, common factors of 28 and 70 and
of 18 and 48, 100 and 200 over 12 and 24 (8 each), only 8 and 9 meet after 70, 150-count case (50, 30, 10,
40, 20, 80), perfect-number sums (15, 28, 42), stall case study (5, 1, 2, 0 winners; Rs 1,000/200/400/0; only
C meets both limits), Annual Day (24; 8; 40; 5). 5.2: 53, 91, 41 to 50 (3 vs 7), 66, 59 and 61, 2-and-3-only
statement, 90+7, 83/89/97, 49/77/91, 15 primes up to 50, 24 and 7 counts, 34 composites, 25 left after 2, 3, 5,
dance-team case (47; 4, 5, 8 rows; 2 and 3 formations; Rs 16,800 over budget). 5.3: coprime and non-coprime
pairs (all 10 pairs of 12, 25, 35, 49, 56), 126, 70, 40, 30, 120, 50, lights (30, 70, 90; 10, 4, 3), team
sizes (4, 3, none for 36 and 35; 19 teams Rs 1,520; size 5 options Rs 1,360/1,280/1,200). 5.4: 270, 105 and
130 share 5, 504 not divisible by 48, 5 threes in 54x45, 1080, 1470, 7x11x13, 1260 divisibility and the
quotient 45, boxes case (30, 36, 45 work; 102, 85, 68 boxes; Rs 1,428, 1,360, 1,496), quiz case (160 s, 3
pairs, 25 s spare). 5.5: 5,436 fits 4 not 8; 2400; 22; 7,224 (d=2 is the only option); 5, 0, 1; 4,560 (d=0);
24 leap years 2001-2100; remainders for 463, 1980, 2375, 5046, 8119; pencils case (4 left over, 3,073 packs,
Rs 1,59,776 against Rs 1,57,312). 5.6: 39, 29, 91, 105, 53, 61, 51, 72, 77, 33; raffle (25, 12, 8; Rs 1,970; 10
new winners; Rs 2,170); mystery number (41, 43, 47, 53, 59; worst cases 16, 15, 16, 11). Assertion-reason
spread: explains (5.1, 5.5), does not explain (5.3, 5.6), A false (5.2), R false (5.4). Claim-check
verdicts mixed (not right 5.1, 5.5, 5.6; right 5.2; partly 5.3; right conclusion, wrong method 5.4).
True/false verdicts 3 True and 3 False.

## Counts and chapter checks

- Read: 128 (5.1: 21, 5.2: 21, 5.3: 20, 5.4: 22, 5.5: 22, 5.6: 22).
- Types: short_answer 51, mcq 30, long_answer 24 (12 are case studies), multi_statement 6,
  assertion_reason 6, fill_blank 6, match 5, true_false 6, claim_check 6, show_impossible 5, reverse 4.
- Bloom: Apply 49, Analyse 47, Evaluate 24, Create 6, Understand 2, Remember 0 (Understand 1.6%; Analyse+Evaluate+
  Create 60%). Labels: Hard 104, Hardest 24, Easy 0.
- Correct mcq option is the longest: 21 of 30 (70%).
- Wrong keys: 0. Second defensible answers: 1 (5.5 index 12 rubric).

## Verdict per concept

- C6M-5.1: pass after fixes (items 3, 9 and 11; arithmetic all correct, idli-vada ideas repeated).
- C6M-5.2: pass after fixes (items 5, 11, 14; sieve work and counts all correct).
- C6M-5.3: pass after fixes (items 4, 5, 9, 10; the even/odd and lcm-equals-product ideas are overused).
- C6M-5.4: pass after fixes (items 9, 10, 11; strong factorisation and divisibility items; the split-pieces
  claim is repeated three times).
- C6M-5.5: pass after fixes (HIGH item 1, then items 2, 9, 10, 11).
- C6M-5.6: pass after fixes (items 9, 10, 12; the set 16, 24, 40, 51 is used twice).

Overall: pass after fixes. The numbers are right; one rubric needs a second accepted answer; the pack
carries a visible template (identical slot order, 70% correct-is-longest, "either choice" endings) and several
repeated ideas. Not a rework.
