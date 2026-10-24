# Review v3: class8 p2ch06 (Algebra Play, MATH8, hegp206), after one fix pass

Indices are 0-based within the concept. Pack: content/authoring/dps/class8/p2ch06.json (121 questions). Scope and
scope_in/scope_out read from content/authoring/class8/p2ch06.json. The 55 changed items (diff against the pre-edit copy)
were each recomputed in python; calendar, date, digit and pyramid puzzles were brute-forced.
Scratch: scratchpad/v3-class8-p2ch06/ (show.py, chk.py).

## v2 status
- HIGH 6.1 #12: FIXED. Stem now says "Just after the step 'divide by 2', the expression is 2x + 4"; S1 true, S2 false
  (x + 4 remains), S3 true (add 18 gives 9). "1 and 3 only" is the unique correct set.
- MEDIUM repetition findings: largely addressed. 6.1 #9 now uses a different trick (add 3, x5, subtract 15, decode),
  #14 is a flow of boxes, #17 and #20 changed; 6.2 #3 (day added twice), #8 (add 2 trick), #11/#17 reworked; 6.3 #14
  (4a+4 puzzle), #7 (4-row with unknown pair); 6.5 #3/#10/#12 changed (#3 which student wrote the true maximum, #12 hidden
  card d); 6.6 #2/#10/#17 changed. Remaining repetition is minor (see LOW).
- LOW/MEDIUM scope flag 6.4 month-edge items: #8 and #10 no longer need month edges (#10 is now a pure 4-cell block
  question; #8 is a pyramid item). Only #6(c,d) and #18 still use it. Judgement below.

## HIGH

1. [6.4 #6, long_answer case study, part (a)] "One sum is impossible for any 2 x 2 block on any calendar. Which one, and
   why?" Key: 66 (not a multiple of 4). Second defensible answer: 116. A 2 x 2 block needs a + 8 <= 31, so a <= 23 and
   no block on any calendar can exceed 4 x 23 + 16 = 108; 116 is therefore impossible on every calendar, not only on this
   page. The key's own part (d) says the smallest and largest sums are 20 and 108 and that Rule X lets 116 through, and
   part (c) calls 116 "also impossible on this page, although it passes the test in (a)", which contradicts "any
   calendar". A student who answers 116 for (a) is right and loses the mark. Fix: reword (a) to "One sum cannot be the sum
   of any 2 x 2 block, whatever the month, because of the form of the block sum alone. Which one, and why?" (or "...cannot
   be written in the form 4a + 16"), and in (c) say "116 passes that test but is still impossible; show that, using the
   edge of the month, for this page". Also in (d) the phrase "from 20 to 108" can stay.
   Verified otherwise: 31-day month, 1st Wednesday, Saturdays 4, 11, 18, 25; genuine sums are exactly the multiples of 4
   from 20 to 108 except 32, 60, 88 (a = 4, 11, 18); 40 gives block 6, 7, 13, 14; 100 gives 21, 22, 28, 29; 116 gives
   a = 25 (a Saturday, and 33 is past the 31st). Step marks 1+1+1+1 = 4.

No other HIGH found.

## MEDIUM

None new. (Two earlier MEDIUM themes remain at the "twice" limit, listed under LOW.)

## LOW

- [6.4 #6(c,d) and #18, scope judgement] The month-edge reasoning (a Saturday cannot be a top-left date; the block cannot
  run past the 31st) is not stated on page 141, which only solves 4a + 16 = 36. It does follow from the book's own
  calendar picture (August 2025, seven columns, 2 x 2 block), and #18 uses that exact page (1 August 2025 is a Friday;
  9 August is a Saturday, so 4a + 16 = 52 has no block). It does not breach any scope_out line (scope_out excludes other
  grid sizes and shapes, not edge cases of the 2 x 2 block). Verdict: acceptable, in scope, but both stems state the
  weekday layout, which they must. #6 needs the HIGH fix above first.
- [6.4 #8 true_false] Verdict True with no misconception; it is a two-line deduction. Acceptable; if wished make the
  statement false (for example "the corners must each be 25").
- [6.4 #18, 6.3 #18] Apply-level, 2 or 3 marks, each is procedure plus a check; thinking is modest.
- [6.5 #10 fill_blank] Answer 783 (87 x 9) follows at once from "use the three largest digits"; the answer is unique and
  machine-matchable (verified by brute force over all triples of different non-zero digits), but it is thin for Hard.
- [6.6 #9(b)] The key says k runs from 2 to 8; the stem does not exclude a units digit 0 (for example 90 gives k = 9,
  90 - 09 = 81, 81 + 18 = 99, still 99). The claim is true either way; say "k from 2 to 9" or add "non-zero digits" to the
  stem.
- [6.6 #18] Bloom "Create" at 3 marks, but the task is describe-and-list; acceptable.
- [6.1 #1, #10, 6.2 #4, #13, 6.3 #6, #13, 6.4 #13, 6.5 #16, 6.6 #6] Final case-study parts are decisions with a real
  but easily computed winner (for example Pack X saves 3 against 2). Fine; none is a strawman, each needs the
  computed values from the earlier parts.
- Repetition still at the limit: "number plus reverse = 11(a+b)" in 6.6 #1, #3b, #12, #14, #16, #18; abcabc = abc x 1001 in
  6.6 #5, #6, #9 (original numbering), #11, #12. Not a defect now; do not add more.

## Per-item results for the 55 changed items (all keys recomputed)

6.1: #1 (Card A 5; leaving out divide gives 2x + 15, 31 for 8; Card B 15; marks 1+1+1+1) ok. #9 (5x; only "Divide by 5"
works, the other options give x + 3, x - 3, x - 3) ok. #10 (2x + 6, 7, changed gives 2x; 22 and 25; marks 1+1+2) ok.
#12 ok (fixed). #14 (box divide by 4; 24; x = 5; marks 3) ok. #17 (3x; 19; 50 not a multiple of 3) ok. #20 ok.
6.2: #2 (905 is 5 September; days 1 to 9) ok. #3 (100M + 2D = 1012 gives only 10 October, 6; unique) ok. #4 (979, 368,
1294 right; Dev should be 686; 566 decodes to 1 April; skipping add 6 gives 21 May, skipping add 9 gives day 46) ok.
#8 (1100 + 130 + 14 = 1244; unique) ok. #10 (100M + 195; 22 December; 30; 31 March against 1 March, the only same-month
pair) ok. #11 (S1 true, S2 true, S3 false because 100M + D is four digits from October; "1 and 2 only") ok. #13 (768, 775;
868; 107 gives 10 July uniquely; 31 May 696 and 1 June 766) ok. #17 (296, 366, 70; 595, 666, 71; 393 to 466, 73) ok.
6.3: #0 (a = 3; unique) ok. #6 (Green is 28; 20 from a + 2b + 2c + d; best tops Red 24, Blue 35, Green 28, Yellow 40) ok.
#7 (p = 5, q = 7) ok. #11 (8 against 5; a + 3b + 3c + d) ok. #13 (55, 34, 377 and 610) ok. #14 (corner 9, middle 11;
unique) ok. #16 (22 and 22) ok. #18 (top 40; bottom 2, 5, 7, 2) ok.
6.4: #0 (c = 23, left box 38) ok. #2 (1-R 17, 2-Q 13, 3-S 8, 4-P 23) ok. #4 (only the first puzzle fixes both shapes; the
others are multiples of one equation or a repeat) ok. #6 see HIGH. #7 (c = 9.5; AR true, true, explains) ok. #8 ok.
#10 (a = 19, block 19, 20, 26, 27; answer 27 whatever the month) ok. #13 (pen 14, eraser 6, sharpener 8; Pack X saves 3,
Pack Y saves 2) ok. #14 (6x + 15 = 75 gives 10) ok. #15 (16; circle 7; 10 and 6) ok. #18 ok.
6.5: #3 (brute force: only 62 x 9 equals its own best, 558) ok. #7 (swap 2 gives 774, swap 6 gives 738, swap 8 gives 558)
ok. #8 (only digits 3, 6, 8 give 504, with and without the "one is 8" clue) ok. #10 783 ok. #11 (405) ok. #12 (73 x d for
d = 8 and 9) ok. #15 (63, 455) ok. #16 (441, 738, 205; 576 against 520) ok. #17 (552 against 558; reason option unique) ok.
#18 (d in {1,2,3,4,6}; 371, 600; d = 4 only) ok. #19 (568 against 567; False) ok.
6.6: #2 (only 81 impossible, needs digits 9 and 0) ok. #5 (even, larger than reverse, tens - units = 3: 52, 74, 96; only 74
offered) ok. #6 (254254; remainder 1; the halves check accepts exactly the multiples of 1001 that are six-digit) ok.
#9 (99) ok. #10 (1998 = 111 x 18, digit sum 18) ok. #11 (divisors 7, 11, 13, 77, 91, 143; 8034) ok. #12 (1-R, 2-S, 3-P,
4-Q: 339339 / 77 = 4407) ok. #13 ok. #16 (parity) ok. #17 (111 x 16 = 1776, digit 5) ok. #18 (71, 82, 93) ok.

## Counts read
- Questions read: 121 (all). Changed items checked one by one: 55.
- Types: short_answer 49, mcq 25, long_answer 24, assertion_reason 7, fill_blank 6, multi_statement 6, match 4.
- Bloom: Analyse 81, Evaluate 21, Apply 15, Understand 2, Create 2; no Remember, no Easy.
- Option items: correct answer at o[0] in all 25 mcq, 4 AR, 6 MS and 4 match; no two options equal in value; the correct
  mcq option is strictly longest in 0 of 25. No option named by position anywhere.
- Step marks equal item marks for every written item (checked in code).
- multi_statement keys: 1 and 3 only; 1 and 2 only; 1 only; 3 only; all three; 2 and 3 only (spread). Three-statement
  format kept as the DPS standard.
- fill_blank answers are single numbers: 6.1 #3, 6.2 #8 (1244), 6.3 #7 (5), 6.4 #14 (10), 6.5 #10 (783), 6.6 #17 (5).
- Templating: not templated.

## Verdicts per concept
- C8M-6.1: load-ready (v2 HIGH fixed).
- C8M-6.2: load-ready.
- C8M-6.3: load-ready.
- C8M-6.4: not load-ready until #6(a) is reworded (HIGH 1).
- C8M-6.5: load-ready.
- C8M-6.6: load-ready.

HIGH 1, MEDIUM 0, LOW 8 (listed). Chapter verdict: NOT load-ready (one wording fix to 6.4 #6(a), then load-ready).
