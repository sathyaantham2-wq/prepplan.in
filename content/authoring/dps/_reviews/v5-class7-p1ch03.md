# Review v5: Class 7 Maths Part I ch 3 (gegp103), `content/authoring/dps/class7/p1ch03.json`, after the v4 fix pass

Scope of this pass: the file was diffed against the previous version; all 39 changed items (not ~24) were recomputed in python/by hand
and checked against `content/extracted/gegp103/pages/031-033.txt` and `content/structure/class7-maths-part1-ch02-08.md`. Unchanged items
were taken as passed in v4 (188 items in total, 9 concepts). Structural checks run over all 188: step marks equal item marks everywhere,
every key is among its options, no duplicate options, no option named by position.

Changed items checked (39): 3.1 Q2, Q8, Q19; 3.2 Q6, Q7, Q19; 3.3 Q3, Q5, Q8; 3.4 Q4, Q13, Q17; 3.5 Q1, Q13, Q16;
3.6 Q3, Q4, Q9, Q13, Q14, Q15, Q16, Q17; 3.7 Q0, Q1, Q2, Q6, Q11, Q14; 3.8 Q8, Q10, Q13, Q18, Q20; 3.9 Q0, Q1, Q13, Q14, Q18.

## HIGH

None. Every changed key recomputed and correct, each with exactly one defensible answer:
3.1 Q2 = 26+17-19 = 24 tenths; Q8 7 strips + 1/10 m; Q19 80 tenths, 1 short, 86 needed, 3 cuts = 180 vs 90;
3.2 Q6 7.05 vs 7.5 = 45 hundredths more; Q7 1-d 2-a 3-c 4-b; 3.3 Q3 0.1 L; Q5 18 thousandths, 0.0020 unchanged; Q8 15.850;
3.4 Q4 6.77 vs 6.72 = 0.05; Q13 third segment 6.27-6.28, fourth mark; Q17 order and gap 0.5; 3.5 Q1 2.13 kg yes; Q13 change ₹0.40; Q16 1-c 2-d 3-a 4-b;
3.6 Q3 7.85; Q9 3.05 m, 0.05 short; Q13 0.206; Q14 9.78; Q15 23.456, 0.544 short; Q16 0.422; Q17 6.7 kg, 7.2 no;
3.7 Q0 28.5; Q1 58 to 60, 59.15; Q2 7.2 and 8.8, neither 9 nor 7; Q6 only 7.3+7.9 (others give 14.3, range 13-15, range 15-17); Q11 4,333.05; Q14 18.6, outside 18-20;
3.8 Q8 9.2; Q10 2.3 h; Q13 85-77 = 8 balls; Q18 19.5, 1 ball; Q20 100 balls, 20 left, 2 balls then 3 overs;
3.9 Q0 1.08 (only piece >= 1 m); Q1 check 8 (4.9 L; check 7 is 5.4); Q13 6th term 3.9, R false (change is -0.3); Q14 terms 2.75, 3.25, 3, 3.5, 10th 3.5, 19th 4.25, 20th 4.75; Q18 week 5 at 5.8 (both).
All v4 MEDIUM key issues (3.6 Q4 R wording, 3.7 Q2 "exactly 7", 3.4 Q4 "three marks to the left", 3.2 Q19 1/16 decimal) are fixed.

## MEDIUM

1. **C7M-3.2 Q19 (case study) part (d) key, factual looseness.** Key says of scale P: "its readings are not tenths or hundredths, so they do not
   write directly as one- or two-place decimals." Marks of a quarter-of-a-quarter scale include 1/4, 1/2, 3/4 (4/16, 8/16, 12/16) = 0.25, 0.5, 0.75,
   which are one- and two-place decimals. Fix: "most of its marks (1/16, 3/16, 5/16 ...) are not tenths or hundredths, so they do not write as one- or
   two-place decimals". Also the stem's "30 minutes to read" is not tied to any number, so the "slower to read" drawback is an assumption; part (c)
   is a bare read-off. Part (d) accepts either choice, so it is a soft decision; give a deciding fact (e.g. "records must be written to two decimal
   places") to make Q the better choice.

2. **Easy-in-disguise remaining (changed items that are still a single step).** 3.3 Q3 (0.3+0.4+0.2 then 1-0.9; the trailing-zero idea is decoration);
   3.3 Q8 (pad to three places, add); 3.5 Q1 (convert, add, compare with 2); 3.5 Q16 (four conversions); 3.6 Q13 (30 - 28.206 vs 2, one subtraction);
   3.7 Q0 (the stem hands over the range and the wrong answer; the task is just 47.3 - 18.8); 3.9 Q0 (pick the one piece >= 1 m, one filter). Each is
   at most one conversion/one computation. Fix pattern: add a second idea (3.7 Q0: ask which of two wrong answers the range rules out and then give
   the exact value; 3.3 Q8: ask what the display reads if a fourth powder of 0.5 g is added and whether it stays under a limit).

3. **C7M-3.6 near-twin run not fixed.** Q9 (cloth), Q13 (rope), Q15 (salt) are all "start amount minus uses, compare the rest with a need, give the shortfall",
   and Q14-Q17 are still four consecutive MCQs. Q16 and Q17 are distinct enough; but Q9/Q13/Q15 should become two items at most. Replace Q13 with a
   find-the-slip or an estimate-then-check item (e.g. a column sum with a misplaced point).

4. **C7M-3.7 and 3.8 repetition unchanged** (v4 item 3): 3.7 is still almost wholly the range rule (Q1 vs Q16, Q2 vs Q13 twins untouched); 3.8 still has
   the overs/balls and decimal-hours pairs (Q4 and Q10 same item, new numbers). Vary at least two items per concept.

## LOW

- C7M-3.1 Q19 key: stem says "The customer says **she**", key says "than **he** has". Make both "she".
- C7M-3.1 Q19 part (a) ("3 5/10 in tenths") is a bare one-line conversion; fine as a ramp but contributes nothing from the chapter beyond 3.1's first page.
- C7M-3.8 Q20 (d): "The other bowler is the third bowler who is finishing the 17th over" is clumsy (the stem already introduces him). Rewrite: "The third bowler
  is finishing the 17th over." Also both 19th and 20th are accepted, so the final part is a mild choice rather than a hard decision; add "the spinner
  cannot bowl the 20th" so exactly one arrangement works if a single answer is wanted.
- C7M-3.9 Q14: alternating +0.5/-0.25 and "net change per two steps" go beyond the book (only constant-change sequences, p.031); acceptable as a stretch, now
  not circular. Note it as the single non-book idea in the chapter.
- C7M-3.7 Q14 (difference range 18 to 20): book only invites the student to "come up with a way" (p.031); acceptable, but the key states the range without
  derivation. Add "the difference is the whole-part difference 19 with up to 1 less or 1 more".
- C7M-3.6 Q14 option 4 "Ria added when she should have subtracted; 10.22 L is left" is a wrong diagnosis; harmless, but a weak distractor (nobody would pick it).
- C7M-3.5 Q13 distractor "₹4.0" looks like a typo in format beside "₹0.40"; use "₹4.00".
- Items carried from v4 and not changed: 3.5 Q19 (parts a, b bare conversions), 3.6 Q19 (strawman-ish yes), 3.3 Q0/Q1 (agree-type verdicts restating the book).
- Scope check: nothing breaches `OUT`. Q19(d) in 3.2 now compares unit fractions only (no fraction-to-decimal division). No percentages, rounding, or decimal
  multiplication found in changed items (3.8 Q10 uses 1 tenth of an hour = 6 min, taken from the book's clock discussion).

## Verdict per concept
- C7M-3.1: pass (fix pronoun).
- C7M-3.2: pass after fixes (Q19 d wording).
- C7M-3.3: pass; two easy items (Q3, Q8).
- C7M-3.4: pass.
- C7M-3.5: pass; Q1 and Q16 light.
- C7M-3.6: pass after fixes (repetition Q9/Q13/Q15, Q14-Q17 run).
- C7M-3.7: pass; repetition remains.
- C7M-3.8: pass; Q20(d) wording, repetition remains.
- C7M-3.9: pass.

## Counts read
188 items (3.1: 20, others 21). Types: mcq 40, short_answer ~80, long_answer 36, fill_blank 9, assertion_reason 9, multi_statement 9, match 5, true_false 8 (v4 counts; fixer changed no types).
Correct option strictly longest in 8 of 40 MCQs (20%), longest-or-tied in 22 (55%): no length tell.
Assertion-reason keys now: R explains x2 (3.2, 3.7), both true not explain x1 (3.6), A false x2 (3.1, 3.4), R false x4 (3.3, 3.5, 3.8, 3.9). All outcomes present.
multi_statement keys: "1 and 3 only" x3, "2 and 3 only" x2, "1 and 2 only" x2, "3 only" x1, "1 only" x1 (spread fine).
Slot order differs per concept; every concept ends with two long_answer case studies (loader slot rule). 3.6 still has a four-MCQ run (Q14-Q17), 3.7 a five-short run (Q1-Q5).
Templated: no, but concept-internal repetition in 3.6, 3.7, 3.8 persists.
Overall: pass after (small) fixes. No HIGH.
