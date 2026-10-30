# Review: p2ch04-gap.json (Class 7 Maths P2 ch4, gegp204)

Read all 34 questions. Every number, key and marking step recomputed in python; loader `--check` says valid
(7 concepts, 34 questions). Pages checked against the extracted book (folios 68-95). Multi_statement 3-statement
format is not a finding (loader requirement). The brief gave no per-slot counts, so slot counts were not checked
against an order; the file has no assertion_reason (ar1) item and no la4/cs4 item (mcq1 6, sa2 6, sa3 15, la5 7),
so confirm that matches the requested counts.

| Item | Sev | Problem | Exact fix |
|---|---|---|---|
| C7M-4.2 Tina auto fare la5 | HIGH | Second defensible reading. The monthly plan says "a fixed Rs650, and then only Rs4.25 for each km after the first 1.5 km of a trip". It never says the Rs30 minimum fare is waived on the plan. A pupil who still pays Rs30 a trip gets 830.20 + 240 = Rs1070.20 for 8 trips, so the plan is dearer by Rs215.40 and every answer to (c), (d), (e) changes. The key assumes the Rs30 is not charged. | Add to the stem: "The Rs650 also pays the minimum fare for the first 1.5 km of every trip." Keys then stand (plan Rs830.20; break-even is 8 trips, since 650 + 22.525n < 106.85n only for n >= 8). |
| C7M-4.6 la5 halving lists, part (e) | MEDIUM | Scope. Asks why 1/24 cannot become a denominator of 10, 100, 1000 and uses "24 = 2x2x2x3, 10 and 100 are made only of 2s and 5s, so no power of ten is a multiple of 3". The chapter never teaches prime factors of denominators; its only hint is the Math Talk "Why are 2 and 5 related in this way?" (p.87). Method beyond the chapter. | Replace (e) with a chapter-level reason: "Divide 1 by 24 further and show the remainder 16 returns, so the digits repeat; say what that means for whether it ends." Keep the 2 x 5 = 10 remark only in (b). Update step 5 and key. |
| C7M-4.6 sa3 Priya 1/12 vs 3/12 | MEDIUM | Same idea as the existing "True or False: 12 is even so 1/12 ends" and "write one division with divisor 6 that ends and one that never ends". Its reason (3/12 = 1/4 = 25/100) also needs cancelling to a lowest-terms denominator test, which the chapter does not state. | Swap for a different idea (e.g. a remainder-chain item on a new divisor) or keep but drop the "depends on the dividend" framing. |
| C7M-4.6 (100/11 9th digit; 5/27 50th digit) | MEDIUM | Repeated idea: the existing pack already has three "nth digit after the point from a repeating block" items (5/6 10th, 1/21 15th, 2/13 25th). This file adds two more (100/11 9th, 5/27 50th). Finding the 50th digit by 50 = 3x16+2 is also beyond what the chapter does. | Keep one at most; replace the other with a distinct remainder-cycle idea (e.g. which divisors must have a block no longer than n-1 digits). |
| C7M-4.5 sa3 microscope bench | MEDIUM | Same trick as the existing "7.5 litre can fills 15 bottles of 0.05 litre, show this cannot be right". Also 4.1 "0.4567 cannot be right" plus the existing 5.3/4 = 1.3 item make the show-it-is-impossible shape appear five times in the chapter. | Change the microscope item to a different form (e.g. compare two fits by 3/0.45 versus 3/0.5 and judge a claim) or drop the show_impossible framing. |
| C7M-4.5 sa3 Nitya table | MEDIUM | Existing pack has Tanvi's "84/3.5, 840/35, 8400/350 give the same answer, agree?". Same idea (equal quotients when both numbers scale together); only the one wrong cell is new. | Fine to keep only if the new point is the sharp one: reduce to the single wrong cell and drop the two cells already tested by Tanvi, or replace. |
| C7M-4.2 sa2 Ravi | MEDIUM | Same idea as existing "0.045 x 0.8 digits before final zero", "Meena 0.25 x 0.8 = 0.2" and "31.85 x 4 = 127.4" (a product whose trailing zeros vanish). | Replace with a new setting, e.g. a product that is a counting number but asked through a context of units. |
| C7M-4.3 sa3 "2.4 x 3.5 = 8.4, find missing" and tf "37 x 43 = 1591" | MEDIUM | Both are the "given product, write related products" idea already covered by existing matches/fill_blank/long items (24x15, 63x14, 9x7) and p2ch04-la4 (247x36). Fourth and fifth use of that trick. | Keep the tf (it has a real misconception); replace the missing-number item with a different idea. |
| All seven la5 items | MEDIUM | Templated shape: every la5 is exactly "(a) ... (e)" at 1 mark each, with parts (a)-(d) computation then (e) a judgement. No la5 has parts of unequal weight. | Vary at least two: give one a 2-mark part and a 1-mark part, or 3 parts at 1+2+2. |
| C7M-4.2 sa3 bill expression "reverse" | LOW | Open-answer key accepts "any fitting story" but the step demands 6 and 2.5 be quantities and 12.75 and 40 be rates. A valid story (12.75 kg at Rs6 a kg) fits 6 x 12.75 yet fails the step; the key lists no reject. | Step: "writes a situation where each product in the expression is a sensible quantity x rate". Add: "Reject a story that gives no unit or whose numbers do not make 6 x 12.75 and 2.5 x 40 meaningful." |
| C7M-4.4 la5 Rupa part (e) | LOW | Open choice of method: key accepts either method "with a reason" but does not say a choice without a reason earns nothing. | Add: "A choice with no reason, or a reason not tied to the numbers, does not earn the mark." |
| C7M-4.7 la5 planet part (e) | LOW | Open answer: "any rule restoring exactly 5 leap years earns the mark" but no reject. | Add: "Reject a rule restoring a different number of years, or one not checked by counting to 185 leap years." |
| C7M-4.1 sa3 balance reading | LOW | (a) and (b) are place-value transcription (3.0462 and 30462/10000); only (c) needs thinking. Close to bare recall for an Apply sa3. | Make (c) carry more: ask which of 10-10000 makes the reading and 3.0462 + 0.0538 both counting numbers, or compare two readings. |
| C7M-4.4 mcq Hema "what next" | LOW | Understand-level recall of the book's step ("put the point, regroup Ones as Tenths"). Not wrong. | Optional: ask for the final quotient digit pattern or the remainder after the Tenths step. |
| C7M-4.4 tracks / jug, C7M-4.5 Patiganita, C7M-4.3 Meher | LOW | Reworded book exercises (Figure it Out p.87 Q7 and Q8, p.94 Q6 and Q10). Correct but little beyond the book. | Optional; vary numbers or add a judgement part. |
| C7M-4.7 sa3 1200/4 - 1200/100 + 1200/400 | LOW | Tag `reverse` does not describe it (it is explain-the-expression). | Change tag to none or `explain`. |
| C7M-4.1 dam, 4.1 balance, 4.1 mustard | LOW | Denominator 10000 and 1 g = 1000 mg lie slightly outside the structure line (10, 100, 1000), though the book's table on p.75 includes 10000 and p.94 gives the mg unit. | None needed; mention only. Mustard stem already supplies the unit. |

## Checked and correct (no change)
All numeric keys verified: 0.285/28.5, 0.0285/2.85, 63/1000 = 6.3 cm, 40.5 m; 2.11 mg; 3.0462; 7.5 x 0.4 = 3;
176.50 and 23.50; match 1-b, 2-d, 3-a, 4-c; auto fare 106.85, 854.80, 830.20 (given the fix), 641.10, 785.15;
3.06 x 0.24 = 0.7344; zoom 18.6, 9.3, 0.75, 0.8, 12.276; 8.2 x 7.3 = 59.86 is the true maximum for 2,3,7,8;
3.825/5.1/127.5 cm; 261/8 = 32.625; 25, 8, 625 multipliers with 8.675, 2.776, 21.6875; 12.18/6 = 2.03; 625 mL and 1.875 L;
6; 31, 31, 310; 750/900 strides, 7.5/7.2 min, 18 s, 72 and 75 m/min; microscope 6 fit, 0.3 m left; 1/41 block 02439;
100/11 9th digit 0; 5/27 = 0.185 repeating, 50th digit 8; 0.03125, 0.00032, 0.1/0.01/0.001, 1/24 = 0.041666...;
1/12 and 3/12; Kunal block 243 leap years, 3,65,243 days, 0.8 ahead; planet 18.5, 1.5 ahead, 0.5 behind, 5 behind, 185 leap years;
Sohan app fails only for 2000; 291 leap years, 438291 days, 0.36 more. Marking steps sum to marks everywhere.
No option is named by position. Page folios are correct for every `p`.

## Template counts
- claim_check verdicts (7): claim wrong 3 (Meher, Tara, Kunal), partly right 2 (Nitya, Naina), right 2 (Ayaan, Priya). Varied.
- true_false (3): True 2, False 1. Acceptable.
- Correct MCQ option is the longest in 1 of 4 mcq (Hema, only by two characters). Not templated.
- multi_statement: 1 item only (key "2 and 3 only"), no spread to read.
- Slot order differs between concepts. la5 shape is uniform (see above).
- Repeats with the existing pack/top-up: 6 MEDIUM above.

## Counts
HIGH 1 / MEDIUM 8 / LOW 7

Per concept: 4.1 pass after LOW tweaks; 4.2 FAIL until the Tina stem is fixed; 4.3 pass after one swap; 4.4 pass; 4.5 pass after swaps; 4.6 pass after scope fix (e) and dedupe; 4.7 pass.

VERDICT: FAIL
