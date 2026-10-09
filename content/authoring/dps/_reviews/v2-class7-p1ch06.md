# Review v2: Class 7 Maths Part I ch 6 "Number Play" (gegp106), content/authoring/dps/class7/p1ch06.json

Method: all 140 questions read (7 concepts x 20), no sampling. Every key recomputed in python (brute-force
permutation search for height lines, grid/magic-square/cryptarithm enumeration, sequence and parity checks).
Textbook text read in full (pages 001-019). Structure/scope: content/structure/class7-maths-part1-ch02-08.md
(the path in the task, content/authoring/class7/p1ch06.json, does not exist). Diffed against the v1 backup.

KEY FACT ABOUT THIS VERSION: 119 of 140 question texts are byte-identical to the backup. Only 21 items are new
(the fill_blank / true_false / extra scenario items). The 11 items that were `Easy` in v1 were only relabelled
`Hard` with the same text and key. See "Easy-in-disguise" below.

## Progress log (appended per concept)

### C7M-6.1 (read 20, recomputed all by permutation search)
All keys correct and uniquely determined: 0,1,3,0,2,1 and 0,1,0,4,2,5 have no valid line; 0,1,1,1,1 -> 5,1,2,3,4;
0,0,0,3,3 -> 3,4,5,1,2; 0,1,1,0,4 -> 4,2,3,5,1; 0,0,2,0,4,2,5 -> 4,6,3,7,1,5,2; 0,1,1,0,4,1,6 -> 5,3,4,7,2,6,1;
Q9/Q12/Q18/Q19 calls recomputed, totals 5+5=10, 0+28=28, case-study counts 1/0/3 all correct. Q1 "must be true" holds in all
7-child lines. 0 HIGH.
- Easy-in-disguise: Q2 (fill_blank "11 children, last shortest, she calls ___" = n-1, the book's Ex 2(f) one-liner); Q4
  (Hema calls 4 in 5th place: "all four in front taller" is the definition of the call); Q13 (a)+(b) (8-6; "calls 19 means 20th or later" are
  one-step reads of the rule); borderline: Q9(a) and Q12 (pure mechanical application of the rule, 2 marks, no decision), Q3
  (relabelled Easy->Hard, text unchanged: spot the list with a call larger than its position - one observation).
- MEDIUM: repeated idea. "A call of k means k taller children in front, so position >= k+1" is the whole of Q2, Q3, Q4, Q13(b), Q15 (Q3 and Q15
  are the same "this list cannot be right because 4th child calls 4/3rd calls 3" item, Q15 only asks the rule aloud). Replace Q15 or Q3.
- LOW: Q14 verdict (Farhan "yes") is fine but is a one-line consequence of the same rule; Q17(i) "always" is the same fact again.
- LOW: Q19(d) now has a real trade-off (see-the-stage vs banner rule) - the v1 flag is fixed. Q18(e) packs three tasks (3-child test, prediction, check)
  into one 1-mark step; split the step mark or the part.
Verdict 6.1: pass after fixes (replace 2-3 low-level items with application items; remove duplicate Q3/Q15).

### C7M-6.2 (read 20)
All keys correct (recomputed: 414+475+420=1,309; 255+480+455+60=1,250; 75x76/2=2,850; 38 odd numbers in 1..75; 13+11+5+1=30;
13+11+3=27). The v1 problem in Q19(d) is fixed: stem now says each block is seated separately; only Q works (checked: P+18 leaves Q odd, R+15 leaves
Q odd). 0 HIGH.
- Easy-in-disguise: Q1 (83x56x17: one even factor; relabelled Easy->Hard, text unchanged; distractors "cannot be said" and "depends on order" are not
  chapter confusions); Q5 (define parity + parity of two consecutive numbers: the book's own sentence, p.131, a 2-mark recall); Q10 (give an example of
  even-odd and odd-odd: book Ex 3(e),(g) one-liners); Q12 ("which difference rule is NOT true", relabelled Easy->Hard, unchanged); borderline Q11 (9 odd
  cards cannot make 100: direct use of the book's rule), Q13 (two successive rule applications).
- MEDIUM: Q7 (a),(b) restate the book's own Kishor puzzle (5 cards to 30 from odd cards); only (c),(d) are new. Change the target/box count.
- MEDIUM: repeated idea - "someone claims a total, check its parity" is Q4(c), Q6, Q9, Q11 and Q19(c); "parity of a product, no multiplying" is Q1, Q8(a)(b),
  Q16, Q19(a), Q20. Replace Q16 (same seating-parity idea as Q19) and one of Q1/Q20.
- LOW: Q15 fill_blank answer is "odd" with the stem giving "(odd or even)": a 50% guess. Make the blank a computed value (for example "the units digit of
  the total of ... " or the parity of an expression the student must derive) or drop the hint.
- LOW: Q2 true_false (verdict True: 9 odd + 4 even + 1 odd = ten odd addends) is sound and a good misconception (student counts only the last addition).
- LOW: Q4 case study - (d) decision is mostly determined (parity rejects one, addition settles the other two); acceptable but make Imran's report
  odd-looking-plausible, e.g. 1,258, so the parity route leaves two even reports needing a real recomputation.
Verdict 6.2: pass after fixes.

### C7M-6.3 (read 20)
All keys correct (recomputed: 4n-1=251 -> n=63, houses 125/126; 7n+3 values 31/66/87; 4n-1 30th = 119; 3n+4=100 -> n=32; 25th odd 49, 91 is the 46th odd;
64th odd 127; 38th odd 75; bill numbers 7,10,13 and 154/202/300; tokens 119/120, 157 is the 79th, 100 each). Q2 keyed "1 and 2 only" is right
(10m-3 odd always; 3p+3 gives 3 and 6; 8j-6 misses 4). Q15 verdicts T F T F T all correct. 0 HIGH.
- Easy-in-disguise: Q3 (pick the always-odd expression; relabelled Easy->Hard, unchanged); Q4 (explain why the nth odd is 2n-1: the book's
  own derivation, p.133, a 2-mark recall); Q12 (64th odd number = 2x64-1; relabelled Easy->Hard, unchanged); Q18 (38th house on the left = 2n-1: same
  one-formula lookup in a Jaipur costume, and a third nth-odd item with Q11 and Q12); Q20 (match 2n / 2n-1 / 3n+4 / 100p to descriptions: the book's own
  labels, a pure vocabulary match); Q17 (write two always-even and two always-odd expressions: the book's own prompt, open and low demand);
  borderline Q11 and Q14 (substitute into a given formula).
- MEDIUM: Q16 case study. (a) is plain substitution (7, 10, 13) and (c) is plain substitution again, so two of the four marks need no chapter idea; the
  decision (d) is forced (only 4n+2 is both always-even and within 250), so there is no trade-off. Add a competing cost (for example 4n+2 skips numbers
  and wastes printed pages) or turn (a) into "which of the three rules ... for n = 1,2,3 shows it is not always even".
- MEDIUM: repeated idea. nth-odd lookup: Q11, Q12, Q18, Q19(a)(b), Q1(a). Expression-parity verdicts: Q2, Q8, Q10(b), Q13, Q15 all use the move "even part +/- constant".
  Cut Q18 and one of Q8/Q13 and replace with an expression whose parity depends on n in a non-obvious way (for example n(n+1), 5n+n).
- MEDIUM: Q8 correct option is the longest of the four (o0 is about 80 characters, distractors 55-65).
- LOW: Q5 key says "R says 2n - 1 is odd"; R actually says 2n is even. Reword the key.
- LOW: Q8 distractor "even numbers when h is odd, just as 3n + 4 does" is false about 3n+4 as well (it is even when n is even); harmless but muddled.
- LOW: Q15 is a five-way short truth/falsity list that overlaps Q2 (same 10m-3 / 8j-6 style statements). Q17 asks "other than ... from the textbook" without stating them: fine for a student who read it, but state them.
Verdict 6.3: pass after fixes (more easy-in-disguise than any other concept so far: 6-8 items).

### C7M-6.4 (read 20; every grid brute-forced over all 362,880 fillings)
All keys correct. Verified: sets for 8 = {1,2,5},{1,3,4}; for 9 = {1,2,6},{1,3,5},{2,3,4}; for 23 = {6,8,9}. Q5 has exactly 1 solution and it is the key's
grid. Q8(c) rows 17,15,15 / cols 10,20,15 has 0 solutions (rows total 47); Q8(d) rows 7,15,23 / cols 9,17,19 has 0 solutions (totals 45/45) as claimed.
Q11: Card A has 36 fillings (key's mat valid), B total 44, C has a 5, D (rows 6,16,23 / cols 6,17,22) has 0 solutions with both totals 45. Q13: rows
14,20,11 / cols 15,18,12 have exactly 14 fillings (the "exactly 14" claim is true) and the key's board is valid. Q16: x=11, rows 11,11,23, split 1+3+7 / 2+4+5
valid. Q18: rows 24,14,7 / cols 8,16,21 has 0 solutions, totals 45/45, all in 6..24. Q4 pairs 1-b,2-d,3-a,4-c correct (puzzle 4 is solvable, 25 fillings). Q10 2..10 sums to 54.
0 HIGH.
- Easy-in-disguise: Q7 (4 is below 6 / 25 is above 24: the book's own sentence, p.134); Q12 (why circles total 90: book p.134 gives it); Q14 (45-14-18: one subtraction,
  book fact); Q20 (largest column sum is 24: book states it; relabelled Easy->Hard, unchanged); borderline Q2 (add three numbers; 45-14-12), Q9 (list the triples
  for 8 and 23: small enumeration).
- MEDIUM: repeated idea. "Row sums must total 45, check it": Q2, Q3, Q4, Q6, Q8(c), Q12, Q13(a), Q14, Q15, Q16(a), Q17, Q19 = 12 of 20 items. "A puzzle that passes the
  totals but is still unsolvable because an extreme row forces the columns": Q8(d), Q11(b) and Q18 are the same argument with new numbers. Replace Q15 and Q18 or Q8(d)
  with a different grid idea (for example how many rows/columns can be 6, or where 1 and 9 can sit when a row sums to 15).
- MEDIUM: Q3 correct option (the rows must be {1,2,3},{4,5,6},{7,8,9}) is the longest option.
- LOW: Q13 gives "exactly 14 different boards" in (c) as data, which is true (verified); keep it, but note (d) "should Neha get the prize" is then a fairly easy yes/no.
- LOW: Q5 asks "say how you started" but the 3-mark steps do not pay for the method separately from the grid. Fine; flagging only for consistency.
- LOW: Q14 distractor 31 is 45-14 (forgot to subtract 18); the key explains 27 and 15 but not 31 - harmless.
Verdict 6.4: pass after fixes (grids are all sound; the concept is over-repetitive).

### C7M-6.5 (read 20; every square checked line by line in python)
All keys correct. Verified: 8 magic squares of 1-9 exist (so "1 and 9 not in a corner, 5 centre" holds); 15 8 13/10 12 14/11 16 9 (Q2) is magic with sum 36 and 16 in
the middle of the bottom row; Q18(b) 24 29 22/23 25 27/28 21 26 is magic (75); Q19 square 27 20 25/22 24 26/23 28 21 is magic with sum 72 and uses 20..28;
Chautisa Yantra rows/cols/diagonals/corners/centre four all 34, total 136; Q15 Neel 1 5 9/6 7 2/8 3 4 has diagonals 12 and 24, swapped square
1 7 9/6 5 2/8 3 4 has rows 17,13,15, columns 15,15,15, diagonals 10 and 22 exactly as keyed; Q4 totals 297 and 306; Q16's hypothetical 4x4 (all rows and columns 34,
diagonals 34 and 32) does exist (found by search), so the item is not impossible. 0 HIGH.
- Easy-in-disguise (the heaviest cluster in the chapter): Q1, Q3, Q10, Q12, Q14 are the same one-step item five times - "nine consecutive numbers, find the
  centre, multiply by 3" (2-10, 4-12, 7-15, 11-19, smallest 20). Q1 and Q12 are relabelled/unchanged; Q14 is a new fill_blank that adds nothing. Also Q19(a),(b)
  (same step twice), Q13 (which of 1,2,4,8 cannot be a corner: the book's Observation 3, relabelled Easy->Hard), Q11 (why 9 cannot be at the centre: the book's own
  argument, p.135, a 2-mark recall), borderline Q8 (+10, doubled: book Ex 3), Q9 and Q17 (corner arguments the book leaves as "Similarly...").
- MEDIUM: repeated ideas. "magic sum = 3 x centre" appears in 12 of 20 items (Q1,2,3,4,10,12,14,15c,18,19, plus Q7 check and Q20 key). "1 or 9 cannot be in a corner":
  Q6 (S2), Q9, Q13, Q17 and Q15(b). Keep one of Q1/Q3/Q10/Q12/Q14 and replace the rest with different ideas (for example sum of the two diagonals through the centre,
  which pairs of opposite cells add to 10, a magic square with a given corner, a square made of 9 numbers in steps of 2 - the book asks whether non-consecutive
  numbers can work - or a 4x4 with a given row).
- MEDIUM: Q18(b) "fill the magic square whose centre is 25" and (e) are the book's own Figure-it-Out 1 / generalised-form task (p.137); Q5 (a)-(c) is the
  book's own "other patterns that add to 34". Change the centre/numbers or ask the student to find a different pattern.
- LOW: Q15(d) Neel is slightly strawman-ish ("only my diagonals are wrong") but his claim is genuinely testable and the swap is checkable, so keep. Q15(b) "give two facts
  from the chapter" is recall-only; ask which of the two violations is enough alone.
- LOW: Q4 (d) is determinate once "multiple of 3" is seen; fine. Q7 verdict is "No" (see claim-check mix in the summary).
Verdict 6.5: pass after fixes - needs the largest rework of the one-step "centre x 3" cluster.

### C7M-6.6 (read 20; sequence, parities, brute-force counts of 1-and-2 compositions all recomputed)
All keys correct: counts for 1..10 beats = 1,2,3,5,8,13,21,34,55,89 (brute force agrees); f(9)-f(8)=f(7) (Q13 = 7); 30th term odd; 13x2, 21x2, 34x2 = 26, 42, 68;
date gaps 502/67/52/450 and the Q12 mapping; Q15 "even term is followed by an odd term" is true (even terms sit at positions 2,5,8,...); Q8 keyed "1 only" is right.
Dates match the book (700 CE, c.1135, c.1150, 1202). 0 HIGH.
- Easy-in-disguise (second heaviest cluster): Q2 (7 steps: 21, the 7th term; sibling of the book's Ex 8 with the number changed), Q10 (10 m strip = 10th term 89, printed in the
  book), Q9 (next two terms after 89; relabelled Easy->Hard, unchanged), Q18 (hidden middle term and the next: two additions), Q16(a) (fill 5,_,13,21,_,55: two additions), Q6(a),(b)
  (previous/next three terms: the book's own Ex 7 mechanics, 3 of 5 marks), Q8 (Statement 2 is a date recall; "Fibonacci wrote ~500 years after Virahanka" is stated in the book),
  Q20 (the double-name reason is the book's sentence "not first, nor second, not even the third"; (a) is 1202-700), Q5 (assertion-reason with R = "poem" trivia, see below),
  borderline Q1 (a),(c),(d) (reading terms off the sequence), Q12 (four date subtractions: arithmetic, not chapter reasoning).
- MEDIUM: Q5 reason is trivia ("Virahanka gave his rule in a Prakrit poem"), not a real fact about the count of 7-beat rhythms; the answer "true, not the explanation" is guessable from the
  topic mismatch alone. Replace R with a mathematical statement (for example "a 7-beat rhythm begins with a short stroke or a long stroke" which DOES explain, or "the count for 5 beats is 8", which does not).
- MEDIUM: repeated ideas. 700 CE/1202 CE gap is asked three times (Q8 S2, Q12 item 1, Q20(a)). "Climbing/tiling/beats = a Virahanka term" is Q1, Q2, Q10, Q13, Q17, Q19; Q17's model answer
  (a staircase of 7 steps = 21) is simply Q2 again. Make Q17 a different situation or ask for a situation whose answer is 34 and not already used.
- MEDIUM: Q14 (d) is not a real trade-off. Four of five readings already fit the sequence, the recount is free to spend on the only odd one, so "recount it" is obvious; the "discard"
  option is a strawman. Add a cost (for example two odd readings, 40 and 33, but only one recount) so the club must choose which to recount and justify it.
- LOW: Q19 (d) is fully determined by the 40-minute limit (only 6 beats fit) - acceptable but a one-line decision.
- LOW: Q3 true_false is good (doubling misconception). Q13 fill_blank is the best fill_blank in the file (number answer, needs the recurrence).
Verdict 6.6: pass after fixes.

### C7M-6.7 (read 20; all 20 cryptarithms brute-forced with and without the "distinct letters / leading letter not 0" rules)
All keys correct. Solution counts: D+D=ED 0; 6xP=QP 4 (P=2,4,6,8); S6x3=TUS 1 (258); G3+G3=HMM 1 (166); L7+7L=MNM 1 (121); 5H=IH 1; P5+P5=QRP 0; T5x3=UVT 1 (165);
9xB=CB 1 (B=5); 4E=FE 0; K9x3=LMK 1 (237); K9+K9=LMK 1 (178); A5+5B=CDA 1 (45+59=104); A3+2B=CD5 1 (83+22=105); N8+N8=OPN 1 (136); PQx3=RQQ 1 (255);
CB+B=DAA 1 (95+5=100); G5+4H=JK5 2 (G=8,9); AB+AB=CAA 0; Z4+Z4=XYY 1 (188). Every claim in Q3, Q9, Q14, Q15, Q16, Q17, Q19, Q20 is true. The v1 problems are fixed:
Q5(e) no longer invents the "repeat the digit 3" rule; the puzzles are no longer reused across Q19/Q20. 0 HIGH.
- MEDIUM (scope/"do not claim more than the book"): the book (page 143) says only "each letter stands for a particular digit". It never says different letters are different digits, or that a leading
  letter is not 0 (grep of the whole chapter finds neither). The scope file lists both, and Q20 and Q17 state them, but Q2, Q9, Q12, Q14, Q16 and Q19 depend on them without
  saying so (Q2 and Q12 test them as the answer). Put the two conventions in the stem of Q9, Q14, Q16, Q19, and either state them in Q2/Q12 or replace those items.
- Easy-in-disguise: Q2 (which is NOT allowed: leading letter 0; relabelled Easy->Hard, unchanged), Q12 (M=3 and N=3: the distinct-letters rule as a recall), Q13 (why start at the units
  column: "no carry comes in", a method sentence), Q6 (multi_statement whose answer is "all three": three rules read back, nothing to discriminate), Q8 (H+H+H+H+H=IH: twin of the book's
  T+T+T=UT; relabelled Easy->Hard, unchanged); borderline Q4 (S6x3=TUS, a twin of the book's examples), Q18 (stem already gives the units step).
- MEDIUM: Q11 (fill_blank, nine B's) and Q8 (five H's) are the same move (nB ends in B, so n x B = 10C + B); keep one. Q15 (a)-(c) and (d) are the same solve twice with a changed multiplier.
- LOW: Q17 (d) is arithmetic (105 + 50 = 155 > 150), not a use of the chapter; the cryptarithm is solved in (a)-(c). Q10 distractor wording is good (real slip). Q9 true_false (verdict True,
  units digit forces P = 0) is a fair misconception, but only valid with the leading-letter rule stated.
Verdict 6.7: pass after fixes.

## Chapter-level counts
- Questions read: 140 (7 x 20). Types: 32 mcq, 56 short_answer, 28 long_answer, 7 multi_statement, 7 assertion_reason, 6 fill_blank, 4 match. Marks 1/2/3/4/5 = 56/35/21/14/14.
- Diff against the v1 backup: 119 of 140 question texts byte-identical; 21 new (all 6 fill_blank, the 4 true_false, and 11 scenario mcq / short items such as 6.2 Q9, 6.3 Q13,
  6.4 Q3/Q4/Q5/Q10, 6.5 Q3/Q14/Q19, 6.6 Q3/Q10/Q12/Q13/Q20, 6.7 Q10/Q11). 11 items that were `Easy` in v1 are the same text relabelled `Hard`: 6.1 Q3, 6.2 Q1 and Q12,
  6.3 Q3 and Q12, 6.4 Q20, 6.5 Q1 and Q13, 6.6 Q9, 6.7 Q2 and Q8. A relabel does not meet "no easy questions" (QUESTION_STANDARD section 12).
- EASY-IN-DISGUISE total: 38 firm (6.1: 3, 6.2: 4, 6.3: 6, 6.4: 4, 6.5: 8, 6.6: 8, 6.7: 5) plus 17 borderline (one-step or mechanical applications). The firm list by id:
  6.1 Q2,Q4,Q13 | 6.2 Q1,Q5,Q10,Q12 | 6.3 Q3,Q4,Q12,Q17,Q18,Q20 | 6.4 Q7,Q12,Q14,Q20 | 6.5 Q1,Q3,Q10,Q11,Q12,Q13,Q14,Q19 | 6.6 Q2,Q5,Q8,Q9,Q10,Q16,Q18,Q20 | 6.7 Q2,Q6,Q8,Q12,Q13.
  Borderline: 6.1 Q3,Q9,Q12 | 6.2 Q11,Q13 | 6.3 Q11,Q14 | 6.4 Q2,Q9 | 6.5 Q8,Q9,Q17 | 6.6 Q1,Q6,Q12 | 6.7 Q4,Q18.
- Bloom: Understand 22 (15.7%, under the 30% cap), Analyse/Evaluate/Create 60 (42.9%, over the 30% floor) - but several labels are inflated (6.3 Q5 and 6.4 Q19 "Analyse" are cue-guessable assertion-reasons;
  6.6 Q20 and 6.4 Q12 "Evaluate/Understand" are book sentences).
- Correct MCQ option longest: of the 17 mcq with text options (the other 15 are numeric/short), the keyed option is the longest in 5 (6.1 Q4, 6.3 Q8, 6.3 Q13, 6.4 Q3, 6.7 Q10) and
  tied-longest in 2 (6.1 Q1, 6.5 Q3): 7 of 17 = 41%, against a chance rate of about 25-30%. Not systematic, but fix the five strict cases.
- Claim-check verdict mix (7 items tagged claim_check, excluding the always/sometimes/never list 6.1 Q17): Yes 4 (6.1 Q14 Farhan, 6.2 Q18 Sana, 6.3 Q9 Tarun, 6.6 Q15 Ravi), split 1 (6.4 Q1 Tara: yes
  for 8, no for 9), No 2 (6.5 Q7 Aman, 6.7 Q3 quiz book). The old all-"No" pattern is gone; it now leans Yes (4 of 7 plain Yes), acceptable. Because each Yes claim is correct, a student who answers
  "agree" scores 4/7 without reading: make one of Farhan/Tarun a false claim.
- true_false (4, minimum 4): 6.2 Q2 True, 6.4 Q18 False, 6.6 Q3 False, 6.7 Q9 True: 50% True, passes. All four hinge on a real misconception (counting only the last addition; checks being enough; doubling beats;
  leading zero). 2-mark, two steps, answer begins True/False: pass.
- fill_blank (6, minimum 4): 6.1 Q2 "10", 6.2 Q15 "odd", 6.4 Q10 "54", 6.5 Q14 "72", 6.6 Q13 "7", 6.7 Q11 "5". All machine-matchable. Application-level: 6.6 Q13, 6.7 Q11 and 6.4 Q10 yes; 6.1 Q2 (n-1),
  6.5 Q14 (3 x centre) are one-step; 6.2 Q15 is a two-word answer with the choice printed in the stem (50% guess).
- match (4, minimum 4): 6.1 Q8, 6.3 Q20, 6.4 Q4, 6.6 Q12. 6.4 Q4 is a genuine application item; 6.3 Q20 is pure vocabulary; 6.6 Q12 is date subtraction.
- multi_statement (7): keys 2&3, 1&3, 1&2, 2 only, 3 only, 1 only, all three - well spread; the false statement is in position 1, 2, 3, (1&3), (1&2), (2&3), none. No template issue. Only 6.7 Q6 is an all-true item that discriminates nothing.
- assertion_reason (7): not-the-explanation 4 (6.1, 6.3, 6.4, 6.6), explains 1 (6.2), R false 1 (6.5), A false 1 (6.7). The "true but not the explanation" key is 57%: slightly high, and 6.6 Q5's R is trivia.
- Slot order: differs per concept (case studies at 19-20 in 6.1/6.3/6.6, 11/13 in 6.4, 15/17 in 6.5/6.7), not a fixed grid. Not templated. Repeated-idea problems are the main weakness (see 6.4 "totals = 45", 6.5 "3 x centre", 6.6 "term lookup", 6.2 "claimed total fails parity").
- No option named by position in any answer or step (grepped all 140). Step marks sum to the item marks in every item. Every case study stem has 45+ words. No scope_out line is violated (no modular arithmetic beyond parity, no factorial counting, no 5x5 squares).
- 27-20-25 / 22-24-26 / 23-28-21 (6.5 Q19): the square is genuinely magic (all 8 lines = 72, numbers 20..28), the item describes it as "A 3 x 3 square is ..." and never calls it the Kubera Yantra, so it
  does not claim more than the book. The extracted text prints "A picture of a Kubera Yantra is shown below" on page 139 and the square at the foot of that page, so it very probably is the book's picture, but the
  OCR order cannot prove it; keep the item unnamed (or have the owner check the printed page before naming it). The Navagraha square (2 7 6 / 9 5 1 / 4 3 8) in Q8 IS named by the book and is correct.

## Per-concept verdicts
- C7M-6.1: pass after fixes (3 easy + 3 borderline; duplicate Q3/Q15).
- C7M-6.2: pass after fixes (4 easy; Q7 copies the book's puzzle; repeated parity-claim idea).
- C7M-6.3: pass after fixes (6 easy; Q16 case study has free marks).
- C7M-6.4: pass after fixes (4 easy; one idea repeated 12 times).
- C7M-6.5: rework (8 easy, five near-identical "3 x centre" items).
- C7M-6.6: pass after fixes (8 easy; trivia assertion-reason; Q14 decision weak).
- C7M-6.7: pass after fixes (rules not in the book must be stated; 5 easy).

## Overall
Keys, arithmetic, grids and cryptarithms are all correct (0 HIGH), and the new item types are well-formed. But the chapter does not yet meet "no easy questions": 38 firm easy-in-disguise items
(27%) plus 17 borderline, 11 of them simply relabelled from Easy to Hard, and 119 of 140 texts are unchanged from v1. Verdict: pass after fixes (heavy; 6.5 needs a rework of its one-step cluster).
Totals: 0 HIGH, 14 MEDIUM, 17 LOW (counting each bullet above once).
