# Review v4: content/authoring/dps/class7/p1ch04.json (Class 7 Maths, Part I ch 4, source gegp104)

Fourth review, after the fix pass on v3-class7-p1ch04.md. Indices are 0-based within each concept. Every key was recomputed by hand or in python before reading the stored answer, including all 7 multi_statement, all 7 assertion_reason, all 3 match items and every case study. Step marks sum to `m` on every written item (checked in code). Counts: 141 questions (20 x 6 + 21 in 4.3), 45 or 46 marks per concept, every short and long answer carries steps. No option names another option by position.

## Verdict: PASS

No HIGH. No wrong key found. No second defensible answer found in any mcq, match, multi_statement or assertion_reason item. The remaining issues are MEDIUM and LOW only.

## v3 findings, status

- HIGH 4.2 [18] tea stall, "at least 14 litres": FIXED. Now "sells at least 16 litres" (14 gives 12, 15 gives exactly 30, 16 gives 48), consistent with the parenthetical.
- HIGH 4.7 [11] column of 354: FIXED. The stem now says columns are numbered 1 to 6 from the left. 354 = 6 x 59, column 6, only one option fits.
- MEDIUM 4.7 [5] AR: FIXED. R is now the cancellation argument, so "R explains A" is the only defensible reading.
- MEDIUM scope drift (two-letter products) in 4.4 [8]: FIXED. Now 6m - 2n + 4m + 2n = 10m (True). The old 2lb and 29cd options are gone.
- MEDIUM case-study decision shape: PARTLY FIXED. 4.4 [10] is now an error-finding case (the camp store formula, excess 120y, total 1,200, all recomputed) and 4.7 [16] is now a prove-the-formula case. Remaining "choose between plans" cases: 4.1 [2], 4.2 [18], 4.3 [0], 4.4 [12] (a cost comparison, not really a choice), 4.5 [3], 4.5 [14] is an error case. About 5 of 14 now, down from 9. Acceptable.
- MEDIUM 4.6 "matching values do not prove equality": PARTLY FIXED. 4.6 [8], [10], [17] were recast. The idea still shows in 4.6 [3], [4], [9], [13], [14], [16], [18] (7 items, was 9). See MEDIUM 2.
- MEDIUM 4.4 [2] and 4.3 [15] thin fill_blank: 4.4 [2] now has a three-day build (6, 4 more, double that) before substituting: acceptable. 4.3 [15] is still one substitution and difference (LOW).
- LOW multi_statement `a` as a sentence: FIXED. Every MS answer now equals its option text.
- LOW correct option longest: reduced to 4.2 [0], 4.3 [9] and 4.6 [8] strictly longest (3 of 38 mcq, 7.9%; was 2 of 38 by v3's count but v3 counted differently). Still LOW.

## HIGH

None.

## MEDIUM

1. **Easy-in-disguise is reduced but not gone.** Firm (about 12 of 141, under 9%): 4.1 [7] (reprice shirts, 5m less, one substitution), 4.1 [11] (two direct translations and a bracket), 4.1 [14] (true_false, 20n + 3 vs 20(n + 3), one test value), 4.2 [11] (fill_blank, substitute m = -2 into 5 - 3m + 2m), 4.3 [7] (all four evaluated at n = 3), 4.3 [18] (translate, substitute n = 6), 4.4 [5] (add six numbers per letter), 4.4 [9] (perimeter of 4x by 3x), 4.5 [2] (open a bracket, collect), 4.5 [13] (one expand-and-subtract), 4.7 [3] (find term 1, then 4n + 2) and 4.7 [10] (day 30 minus day 10, 20 x 4). These are tagged Analyse or Apply but are one translation or one calculation. Borderline (about 15): 4.1 [15], 4.1 [16], 4.2 [2], 4.2 [10], 4.3 [3], 4.3 [10], 4.4 [13], 4.5 [12], 4.5 [15], 4.6 [1], 4.6 [15], 4.6 [19], 4.7 [9], 4.7 [15], 4.3 [15]. No cure needed for a pass; if one more pass is done, swap the firm ones for items that need a decision or a second move.
2. **Repeated idea, "test values do not prove equality" in 4.6**, 7 items: [3] (Aman's wrong form), [4] S2, [9], [13] (c), [14], [16], [18]. [9] and [13] and [18] are the same shape (a value that hides a mismatch). Replace one or two with a different skill, for example a four-term simplification that needs a sign change or a check that something is true for all n by cancelling.
3. **Repeated idea in 4.7**: [6] (two patterns, which has more at step 50) and [12] (two patterns, which has more at step 2 and step 10) are the same structure with new numbers. [12] adds a crossover, which is the better item; [6] could be replaced.
4. **4.7 [17] Statement 3 has an ill-posed premise.** "The two diagonal sums of a 2 x 2 block differ when the top-left number is a multiple of 7": in a 7-column grid a multiple of 7 sits in the last column, so no 2 x 2 block starts there. A careful student can say the statement is neither true nor false. The key (1 only) still stands, since the sums are equal anyway under any reading, but the wording invites a second reading. Smallest fix: replace S3 with "the two diagonal sums of a 2 x 2 block are equal for every block", which is True, and change the key accordingly, or make S3 clearly false by another route.

## LOW

- Assertion_reason `a` is an explanatory sentence rather than the option text in 4.3 [20], 4.4 [18] and 4.6 [11] (the other four AR items store the option text). The sentence is correct and points to the right option, but a string match against the options will fail. Set `a` to the option text and keep the sentence in the steps or notes.
- Correct mcq option strictly longest: 4.2 [0], 4.3 [9], 4.6 [8].
- 4.3 [20] and 4.4 [18] AR reasons are filler true facts ("the bag costs more than seven books"; "both give 1 at x = 1, y = 1"). The 4.4 one is at least on topic (a single check does not explain). 4.3 [20] R is irrelevant by design; fine as a "true but does not explain" item but adds no maths.
- 4.3 [16] answer sentence "the 3 sticks of an L pair make 1.5 L's" is clumsy; say "3 sticks make 1.5 L shapes". The result (C, 115 shapes) is right: shapes = 140 - m/2, so fewest T's (50) is best.
- 4.4 [0] Imran is labelled "Partly right" but his stated answer 3a + b is simply wrong; only his working on the a-terms is right. The verdict is defensible; "No, but part of it is right" would be cleaner.
- 4.4 [12] part (d) rise of bills: fine, but the "why do they not rise equally" is answered by item counts alone; mild.
- 4.1 and 4.2 still reuse the "fixed charge + per-km rate" model (4.1 [5] [14] area, 4.2 [10] [16]): 3 items.
- 4.3 [3] and 4.3 [10] and 4.3 [9] all concern multiples/nth term of a multiple; three items, not excessive.
- 4.2 [5] open-ended reverse item (any two-term linear expression through the two points is 4x + 5, but a non-linear one would also pass): the stem says "an expression in x with two terms", and the answer states any correct one is accepted, so fine.

## Per-concept recompute log (all keys correct)

- C7M-4.1: match 1-B 2-D 3-A 4-C; calendar w-8, w-7, w-6, w-1, w+1; wire 140 / 136 / 152 / 148 (3 rolls = 150 m); 4k - 9; Shabnam changes by 6; 80 + 25p - 30; Rohan 130 vs 285; Nandini 28, 7(4+q), 7(4+2q), 105; fill_blank 2d + 6 (d + d - 4 + 10); Rekha 120 vs 160; AR both true and R explains; canteen +10 and -22; hens 30 legs; MS "2 and 3 only" (S1 false: 235 = 60 + 35 x 5, so 5 metres, not 6); lab fee 190/190, 760/310, 150/300/600, refunds for 3 and 5 sessions; flags x + y + 2z.
- C7M-4.2: Anu -17 only with q = 3; 11 vs 14; -50; quiz scores 42, 44, -9, 60/50, 24/38; cold store 6, 0, -6, hour 4; 4x + 5; worksheet 8, 10, correct, 2; house scores 26, 19, 43, 88, g = 6; Rani 21; 29 vs 18; bills 106 + 150 = 256; fill_blank 7; 3a - 2b gives 7 and 2; MS "1 and 3 only" (S2 false: day 3 to day 5 falls by 300); trekking Y leads by 3; kabaddi 38, 32, 6; cab 109, 193, 84; Hari 9 vs 5; tea stall -60, 12, 120, -6, 12, 14 litres, -24, 48; AR A false (8 - (-3) = 11), R true.
- C7M-4.3: bench 24 and 16, costs 43,200 and 41,600, floor 48 and 56, net 40,200 and 41,000; MS "2 only" (S1 gives 10 not 4; S3 is 5x + 10); 35 vs 17; 105 and 7n; 6p + 10 unique; 360, 345, 336; 13 vs 25; n = 3 gives 12, 12, 12, 13; 14th term 84 = 30 + 54; 348 vs 341; Neha 900 vs 400, months 4, 8, 9, first month 9; square perimeter grows by 12; match 1-B 2-D 3-C 4-A; 25a + 50b; +18; matchsticks A 110, B 120 (breaks rule), C 115; 18, 48; ₹34; four-student checks 35, 24, 25, 19; AR both true, R does not explain.
- C7M-4.4: Imran 10 vs 4, correct 3a + 7b; 19g + 7f = 925; fill_blank 288; match 1-A 2-B 3-C 4-D; 17n + 16p; 2a + 6b + 7; add/subtract 9m - n - 3, 4a - 3b + 9, 14 both ways; 10m True; 14x; camp store 210 vs 330, 35x + 140y, excess 480 and 720, 120y, total 1,200; 19m - 5n + 3; 19a + 14b, 4a + 6b, 1,110/800, rises 165/115; 13b; 19p - 7q, 2p + 2q; board 15n, 9n, 5n, 20; MS "1, 2 and 3"; perimeter 7a + 9, 30 m; AR both true, one test value does not explain; c.
- C7M-4.5: 22a + 40b; fill_blank 15; bills 432 / 384 / 382 and 648 / 576 / 598; worksheet a + 9, correct, 5 + 5z, 13 - 2m, 8r + 12; AR both true, R explains; Tara half right; 4a + 17b, 21; 12; 9x + 2y, 24; cancels to 0; MS "1 and 2 only"; tank 6; 7m + 7; hostel 2,110 / 1,630 / 480 / 1,990; profit falls by 10 (132 to 122); 90 + m, 100; 4a + 5b, 30, 32; -x + 5; match 1-A 2-B 3-C 4-D.
- C7M-4.6: perimeter 20, 20, 20, 13, D short by l; 4x + 10; 7n + 15 and 7n + 5 differ by 10, 43 vs 33; 13 - a, 6, 6, -2; MS "3 only" (S1 is 3k + 3, S2 false); 3a + 3b with 15 and 21; 7x - (3x + 2) = 4x - 2; clerk A = 5p + 12; only k = 3 works; m = 4 is the only value where 3(m + 4) = 4m + 8; line 3 is the first to differ (13 vs 19); AR A true, R false; Esha right; tiles 5, 8, 11 and 5, 7, 9, short by 39; Vikram right conclusion, not a proof; 2x + 10 meets 3(x + 2) at x = 4; (m + 9) vs (m + 7); sheets 4,700 each, 8,200 / 8,200 / 9,200, 1,200 / 1,200 / 200, 12,400 vs 14,600; n + 12, 52.
- C7M-4.7: match 1-B (101) 2-A (79) 3-D (66) 4-C (200); position 100 is lotus (cycle starts at the peacock); 3n + 4; 6 dots, 4n + 2, 102; calendar a + 1, a + 7, a + 8, 2a + 8, 40, 4a + 16, 80; AR plus shape 5a, R explains; 5s + 2 vs 3s + 9, 252 vs 159, 93; position 30 gives X and U; formula 3a - b, (6, 5) gives 13; step 9; 80 more shirts; column 6; 2y + 4 and 3y; 150 is not 4n - 1; 3n + 1, 121, 100, 103, first above 100 at 34; remainder 3 gives C, D appears 27 times; tables 12, 2n + 2, helper wrong at n = 1 and 3, 14 tables for 30 (₹2,100), 15 for 31 (₹2,250); MS "1 only"; 5, 11, 17, 23; border 62 elephants, 63 lotuses, position 250 is a lotus, cost ₹11,860.

## Scope

All items sit inside gegp104 (patterns, expressions, substitution, simplification with brackets, nth term, remainder-based positions, calendar grids; remainder appears at chapter page 017). No two-letter products remain. No equation solving beyond reading a value off a formula. Negative substitution is used (4.2) and is taught in the chapter.

## Case studies

14 tagged (2 per concept). None is a strawman in this pass: the 4.1 wire, 4.1 lab fee, 4.3 benches, 4.3 matchsticks, 4.4 camp store, 4.5 hostel bill, 4.6 pavement/spreadsheets and 4.7 tables/weaver all force a computation that decides something. 4.4 [12] (P and Q committees) is the weakest, closer to a multi-part exercise than a case.

## Counts

Types per concept: 8 short_answer, 4 long_answer, 4-6 mcq (incl. scenario), 1 match, 1 fill_blank, 1 MS, 1 AR (4.3 has one extra mcq). One true_false-tagged item in each of 4.1, 4.2, 4.4, 4.5 (verdicts: False, False, True, False). MS keys: "2 and 3 only", "1 and 3 only", "2 only", "1, 2 and 3", "1 and 2 only", "3 only", "1 only": all differ. AR keys: explains (4.1), A false (4.2), not explain (4.3), not explain (4.4), explains (4.5), R false (4.6), explains (4.7).
