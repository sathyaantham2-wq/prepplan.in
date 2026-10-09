# Review: Class 7 Maths Part I ch 6 "Number Play" (gegp106), content/authoring/dps/class7/p1ch06.json

Read: all 140 questions (7 concepts x 20), no sampling. Every key, case-study part, puzzle, grid, parity
and cryptarithm claim was recomputed by brute force (python): all height-line reconstructions and
uniqueness, all 3x3 grid counts (including the "exactly 14 boards" claim in 6.4 Q20), all magic squares,
all cryptarithm solution sets, all sequence/parity values. Book facts were checked on pages 002, 011, 012,
015, 016-019 of the extracted text (Khajuraho/Chautisa, Navagraha, 700 CE / 300 BCE / c.1150 / 1202, "generally",
Ex 10 expressions, UT+TA=TAT, K2+K2=HMM). Compared against the DPS Cl-7 WS-1 (Ch.2, Ch.6) sheet.

Result: **0 wrong keys, 0 arithmetic errors, 0 factual errors.** Every numerical claim in the file is true.
Findings below are about a wrong rule in one key, a second defensible answer in one graded step,
reuse/templating, closeness to the book and DPS, and scope.

## MEDIUM (fix before load)

1. **C7M-6.7 Q17 (e)** "A student says G = 3 and M = 6. Show that she is wrong." The key says G = 3 "would also
   repeat the digit 3 already in the units place of the addends, so only G = 8 works." That is not a rule of the
   chapter (letters are only distinct from other letters; the book never forbids a letter equalling a printed digit,
   and K2+K2=HMM in the book does not say so). A student who writes the correct reason (33+33=66 is not a 3-digit
   sum) is fine, but a marker following the key could penalise the correct line of thought or teach a false rule.
   Fix: delete the "repeat the digit 3" sentence; keep only "G = 3 gives 66, not HMM".
2. **C7M-6.2 Q19 (d)** "Which block should get the extra row so that the whole hall can be filled by pairs? If more
   than one works, say which you prefer." Q (1,334) and R (1,324) both make the hall total even; the key prefers Q
   only because Q's own block also becomes even, but the question never says blocks are seated separately. Preferring R
   (cheaper, a shorter row of 15) is equally defensible, and the step says "chooses Q". Fix: add to the stem
   "each block is seated separately" so that only Q works, or change the step to accept Q or R with a correct parity check.
3. **Templating of the claim-check items (all concepts).** Each concept has one claim-check in the same slot (item 14,
   3 marks), same frame ("<Name> says: '...'. Is <he/she> right? ..."), and **all seven verdicts are "No / wrong"**
   (6.1 Q14 Rohan, 6.2 Q14 Sana, 6.3 Q14 Tarun, 6.4 Q14 Tara, 6.5 Q14 Aman, 6.6 Q14 Kabir, 6.7 Q14 Ritu). The
   student learns the cue "a named child makes a claim, so it is wrong". Also: every concept has exactly the same slot grid
   (5-6 mcq, 1 MS, 1 AR, 8 short answer, 4 long answer; marks 8x1, 5x2, 3x3, 2x5, 2x4 in all seven), the
   show-impossible item is always item 15, and 11 of the 14 case studies end "(d) Which ... should ... choose, and why?".
   Fix: make at least two claim-checks correct or correct only for a case (6.2 Q14 can be "Sana is right only if ..."; 6.3 Q14
   could be a true claim about 2n+... ), vary the verb ("Do you agree?", "A student writes ... find the slip"), and break the
   slot order in at least three concepts.
4. **C7M-6.7 puzzle reuse across items.** The same four puzzles are asked as stand-alone items and again as case-study parts:
   S6+S6+S6=TUS (Q11 and Q19a), P+P+P+P+P+P=QP (Q14 and Q19b), D+D=ED (Q8 and Q19c), N8+N8=OPN (Q6, Q20 and as the
   "own example" in the key of Q18e). Q19 is therefore three already-asked items stapled together, and Q18(e)'s model
   answer is a copy of Q6. Fix: give Q19 three new puzzles (for example a two-addend one with a carry into the hundreds,
   one with 2 answers, one with none), and change Q18(e)'s example to a different cryptarithm.
5. **C7M-6.4 reuse of one argument four times.** Rows 6,15,24 with columns 10,13,22 ("rows 6 and 24 force 1,2,3 and 7,8,9,
   so every column is at least 12") is the answer to Q14, Q18(d) and Q19(b) (Card D); Card A / grid 2 5 8 / 1 3 4 / 6 7 9 is
   the answer to Q15 and Q19(c). That is one idea in five cells. Fix: replace Q18(d) with a different failing set
   (for example rows 7,15,23) and Q19's Card D with a new impossible card; vary Q15's numbers.
6. **Close to the textbook exercise (C7M-6.3 Q6, 6.1 Q6, 6.1 Q14/Q17).** 6.3 Q6 reproduces Exercise 10 (a), (b), (c) almost
   word for word ("4m - 1 always odd", "6j - 4", "2p+1 and 2q-1"), and 6.3 Q5 reuses 2f+3 from (d); 6.1 Q6 and Q17 are the book's
   Exercise 2 (a)-(e) restated and Q14 is Exercise 2(d). A student who has done the exercise gets them free; QUESTION_STANDARD
   section 1 requires changing the numbers and raising the level. Fix: change the expressions (for example 10m - 3, 8j - 6,
   3p + 3 vs 2q + 1) and, in 6.1, change the frames (for example "the child who calls 3 is the 4th tallest").
7. **C7M-6.1 Q18 scope (pair counting).** Parts (d) and (e) need "how many pairs can be made from five children" and 28 pairs from 8,
   with the argument "the taller of each pair is in front in exactly one of the two lines". Counting pairs/combinations is not taught in
   this chapter, and scope_out lists "counting arrangements with factorials". The result (total = 1+2+...+7 = 28) is true
   (verified for n = 2..8), but the route is a Class 8+ idea. Fix: ask only for the totals of the two lines and the pattern
   "total = 1 + 2 + ... + (n-1)" tied to the position rule from Q15, or move to a Create-level extension flagged optional.

## LOW

8. **C7M-6.1 Q19 (d)** decision is not a trade-off: "shortest first" gives 0 children who cannot see, so it dominates both
   plans; the "price" is not in the data. Add a competing consideration (for example the photograph needs tall children
   at the front, or the stage allows at most 2 cannot-see children).
9. **C7M-6.5 Q20 (d)** and **C7M-6.6 Q20 (d)**: both rest on a named character with a doomed idea (Neel's swap; the president wants to
   discard 40). Q20 also tells the student to use the word in the quotation ("generally"). Standard: no strawman as the decision.
   Fix 6.6 Q20: remove "using the word in the quotation"; fix 6.5 Q20: let Neel propose a swap that works in one of two lines.
10. **C7M-6.6 Q6, statement 1** "The numbers were first discovered in the study of poetry": the book says Virahanka "was the first
    known person in history to explicitly consider" them and the summary says "first discovered in history through the Arts". Align
    the statement to the book's wording ("first known to be written down in the study of rhythms").
11. **C7M-6.4 Q17 (e)**: the key grid 6 8 9 / 1 3 7 / 2 4 5 has row sums 23, 11, 11 but the stem lists 11, x, 2x+1 = 11, 11, 23. Give
    the key grid in the stem's order (for example 2 4 5 / 1 3 7 / 6 8 9) or say "in any order" in the stem.
12. **C7M-6.7 Q10 (b) and Q15 key**: Q10 picks B = 9 without saying why (units: 5 + B ends in A needs a check of cases); Q15 says
    "the only multiple of 10 it can match is 0" without noting 3E is a multiple of 3 (so 10 and 20 are out). Both answers are
    right; the reasoning in the key should be complete since steps are graded from it.
13. **C7M-6.7 Q18 (d)** "Yes, if it has digits that fit" is a hedge in the key; it does have a solution (89+89=178), so state
    that plainly.
14. **Distractors not from the chapter (minor):** 6.2 Q5 options 1 and 2 ("cannot give a three-digit total", "must be a multiple of 9"),
    6.6 Q1 option "12 is just 2 x 6", 6.6 Q4 option "14 is 2 x 7", 6.6 Q3 "178, 267 by doubling and tripling". Each should be a
    slip a student of this chapter makes (for 6.6 Q1: 7, the sum of 4-beat and 3-beat counts, or 11).
15. **C7M-6.3 Q7 (A/R):** R is nearly a restatement of A (the n-th odd is 1 less than the n-th even is how 2n - 1 is
    derived). Prefer an R that is a separate true fact (for example "2n is even for every n") so the "does R explain A" call is a real one.
16. **C7M-6.6 Q9** is the textbook Exercise 7 and DPS WS-1 Q15 with the numbers changed (consecutive terms; previous two and next two).
    **C7M-6.5 Q15** mirrors DPS Q17 (magic square of sum 48) and book Exercise 4 (sum 60). **C7M-6.2 Q19** has the same shape as DPS
    Q24 (parity of block totals, which one to change so all are even). Different numbers and settings, so not a copy,
    but each needs a further twist (for example a three-column constraint) to be clear of the sources.
17. **Overlap inside a concept:** 6.1 has four items on "the largest call in n children is n - 1" (Q2, Q13a, Q15, Q17iii);
    6.6 has three on "first move is a 1 or a 2" (Q5, Q10, Q17c-d). Replace one in each.
18. **Reversal flag:** every item whose key turns on a reversal word in the 1-mark objective set is flagged (6.1 Q3, 6.2 Q2, 6.3 Q3, 6.5 Q3,
    6.7 Q4). 6.7 Q7/Q8 use "cannot" inside a rule statement (not a reversal item) so no flag is needed. No missing flags found.

## What passed, for the record

- MS keys are spread: 2 and 3 only (6.1), 1 and 3 only (6.2), 1 and 2 only (6.3), 2 only (6.4), 3 only (6.5), 1 only (6.6),
  all three (6.7); false statement in 1, 2 and 3. AR: 4 of the 7 are "true, not the explanation", one A-true-R-false, one A-false-R-true.
- Correct MCQ option is strictly the longest in only 3 of 38 (6.1 Q1, Q4 and 6.3 Q5 — 6.1 Q1 and 6.3 Q5 by 9-17 characters).
- Level mix at chapter level: Remember/Understand 43 of 140 = 31% (limit 60%); Analyse/Evaluate/Create 53 of 140 = 38% (minimum 15%).
- Match-the-columns: 4 of 7 concepts (6.1, 6.3, 6.4, 6.6), meets "one per two concepts".
- No case-study part (a) is printed in the stem; every part (a)-(d) needs the chapter. Part marks equal the step marks everywhere.
- Settings are Indian and realistic (₹, school fair, Madurai, Pune, Surat, Siliguri, Coimbatore). Reading level suits Class 7.
- Anti-template: stem frames vary acceptably except the claim-check/slot pattern flagged in finding 3.

## Per-concept verdict

- C7M-6.1 Sequences from heights: all keys correct (reconstructions verified unique); fix findings 6, 7, 8, 17.
- C7M-6.2 Parity of sums/differences/products: all keys correct; fix 2 (Q19d), 14 (distractors).
- C7M-6.3 Parity of expressions, nth even/odd: all keys correct; fix 6 (Q6 is the book's Ex 10), 15.
- C7M-6.4 Row-and-column sum grids: all keys correct, "14 boards" verified; fix 5 and 11.
- C7M-6.5 Magic squares: all keys correct (squares, 4x4 sums, 297/306 totals verified); fix 9, 16.
- C7M-6.6 Virahanka-Fibonacci: all keys correct, history matches the book; fix 9, 10, 14, 17.
- C7M-6.7 Cryptarithms: all keys correct (solution sets and uniqueness verified); fix 1, 4, 12, 13.

## Count read

140 of 140 (all seven concepts, every question including all 14 case studies and all 14 five-mark / long answers).

## Verdict

Reaches the DPS standard of section 9 in substance (two-part, multi-step, claim-check, show-impossible, reverse and case
studies are real, with awkward numbers and decisions). Not recall in disguise. Needs the medium fixes (a false rule in 6.7 Q17e, a
second defensible answer in 6.2 Q19d, claim-check and slot templating, reused puzzles in 6.7 and 6.4, book-copy in 6.3 Q6) before it is a clean pack.
