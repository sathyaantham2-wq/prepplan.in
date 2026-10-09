# Review v3: DPS bank, Class 7 Maths, Part I ch 1 "Large Numbers Around Us" (gegp101)

File: `content/authoring/dps/class7/p1ch01.json` (modified after v2; 210 questions in 10 concepts: 21, 21, 21, 21, 20, 21, 21, 22, 21, 21). Item numbers (#n) are the position in the concept's list. Pages checked: `content/extracted/gegp101/pages/001-023`.

Method: every key was worked out independently (by hand and in python) before reading the stored answer, with brute force for 1.3 #13 (30 clicks), 1.7 #1 (factor pairs), 1.7 #16/#20/#15c (products), 1.10 #3 (24 sticks), #6, #12, #15 (digit sequences), 1.3 #10 (max digit sum). Multi_statement and assertion_reason were all recomputed statement by statement.

## Verdict: PASS (no HIGH; small MEDIUM and LOW only)

All 210 keys are correct. No second defensible answer was found in any item except the small ambiguities listed under LOW. All options and statements are self-contained (no positional references; the one grep hit, 1.9 #11 "Option A/B", is defined in the stem).

## Status of the v2 findings

- HIGH 1.3 #14 (buttons +1..+1000 but key 17): FIXED, the item is gone; the replacement (#16) states all six buttons and 17 is correct.
- 1.1 #9 key text ("left out a 0"): FIXED (now #12, "put the 0 after the 5").
- 1.3 #18 distributive-"and" claim-check: FIXED (now #9, verdict "partly right", the counterexample 70 is correct).
- 1.4 #17 half-up convention: FIXED (#19 states it; #11 states it).
- Identity-diagonal matches (1.2 #8, 1.9 #8): FIXED (keys now I-B, II-C, III-D, IV-A and I-C, II-D, III-A, IV-B; no match is the identity).
- Identical slot order in all concepts: FIXED (orders now differ in each concept).
- Assertion-reason filler Rs and the "true, not explanation" padding: FIXED. Outcomes now mix: explains (1.3, 1.4, 1.7, 1.8), true-not-explanation (1.5), A true R false (1.1, 1.9), A false R true (1.2, 1.6, 1.10).
- Claim-check verdicts now mix: No (1.1 #2, #13, 1.4 #3, 1.5 #2 ...), Yes (1.2 #19, 1.5 #19, 1.6 #9), True (1.4 #15), partly right (1.3 #9, 1.9 #19, 1.10 #5).
- Strawman case-study decisions: mostly replaced by real trade-offs (1.8 #7 taps vs tankers with a break-even week, 1.9 #11 cost vs time, 1.7 #3 saving vs reprint, 1.10 #4 which extra button, 1.2 #10 and 1.5 #7/#20 close calls).
- Easy-in-disguise count: from about 72 in v2 to about 15 (listed below).
- Bloom labels raised without changing the text: largely fixed. 10 Understand items remain (all multi_statement, one per concept, 4.8%), which is within range.

## MEDIUM

1. Repetition of one idea across 1.3 and 1.10 (calculator with buttons whose values are all multiples of 100):
   - "a calculator with only +100 (and +1000 / +10,000) can show only multiples of 100, so 47,300 / 8,60,450 / 6,43,550 ... cannot": 1.3 #3(b), #4(b), #9, #21(c) and 1.10 #4(b), #5, #7, #11 S1 (8 items). 1.3 #3 and 1.10 #4 are the same case study frame (counter with two buttons, a bonus click threshold, add one button) with different numbers.
   - "9876543210 / smallest even / multiple of 5 from digits 0-9": 1.10 #6, #11 S3, #14, #16, #17 (5 items; #17(b) and #11 S3 test the same fact).
   - "fewest clicks = digit sum" in 1.3: #2, #5, #6, #8, #10, #11, #12, #14, #15, #16, #17, #20 (about 12 of 21). Cut two or three of #14/#16/#17 (the same "your way minus Sippy's way" subtraction three times) and use the freed slots for the untested book ideas (the exactly-30-clicks puzzle is there in #13/#19; add one on a calculator that lacks +1, or on the number of different ways to show 321).
2. Remaining easy-in-disguise items (one lookup or one multiplication, method given by the book or the stem):
   - 1.2 #12 (540,000,000 -> 54 crore), #13 (25,000,000 -> 2,50,00,000), #16 (36 million -> lakh -> crore and lakh); these are three one-conversion items; keep one.
   - 1.8 #17, #18, #19, #20 (single or two-step multiplication with a comparison to a round number; #18 is the book's own steps example). #10 (divide then convert days to years).
   - 1.9 #16 (25 lakh x 40, fill_blank), #12 (convert and compare two amounts), #21 (8 crore 40 lakh in lakh, then divide by 70).
   - 1.1 #14 (zero count of 3,06,00,000), #15 (place value of one digit, fill_blank), #16 (read 3,05,00,070).
   - 1.6 #8 (25 x 36 + 125 x 8; recognise two pairings), #18 (scale a given product).
   Each is correct and fair, but at Hard/Hardest they are Apply-level; convert about half into items where the method must be chosen or a misconception caught (as 1.6 #6, 1.6 #13 and 1.5 #4 do well).
3. 1.7 near-duplicates: the same "bounds of the two numbers -> digit count -> check against the exact product" move appears in #3(b), #15(c), #16, #18, #20(c) and #21(b); and #3 and #21 are the same frame (a software field of digit boxes, price x copies/tickets, "is the field long enough") with different shapes. Keep #3 (good trade-off in (d)), change #21 to a different setting or decision (for example a shop bill that overflows a 7-digit display), and drop one of #16/#18.
4. Bloom/mark inflation: 1.8 #5 is labelled Create and 4 marks, but (a)-(c) are straight staged multiplication and (d) is one division; Apply/Analyse is honest (a real design step would be "choose the number of coaches/trains to meet a target"). 1.10 #9 is Hardest/4 marks yet (a)-(c) read stick counts from the given table; only (d) is a decision. 1.10 #4 (Evaluate) is good.

## LOW

- 1.3 #10: the stem does not say which buttons Systematic Sippy has. The key 45 (digit sum of 99,999) needs a +10000 button; without it the answer differs. Add "(buttons +1 to +100000)".
- 1.9 #1: "How many kilometres has it really run?" is read by the key as the true odometer total (1,00,003), but a student can read "run since 99,998 km" and answer 5. Reword to "What does the odometer really read / how many km in all has the scooter run?"
- 1.4 #2: "the order may be a round number: which one?" The key 750 relies on the options only (800 is also round and 750 has the fewest spare among the options that are not short). Say "to the nearest 50".
- Longest-correct-option lean on three items: 1.1 #12 (108 characters against 77), 1.5 #4 (134 against 113), 1.5 #8 (109 against 96). Across the chapter the correct option is strictly longest in 9 of 49 mcq (about chance), so this is only these three.
- Trivially false statements in the multi_statement items: 1.1 #4 S3 ("25,00,000 is twenty five crore") and 1.2 #7 S2 ("one arab is a hundred billion") are one-glance rejections; 1.9 #7 S1 ("a crore is a hundred times a thousand") is also quick. Not wrong, only low density.
- 1.4 #18 (b) closes with "rounding to the thousand hides a change smaller than 500". Not strictly true (a change of 80 across a boundary shows as 1,000; a change of 499 within one bracket hides). Say "can hide a small change, even 80".
- 1.4 #5 (d) and 1.4 #21: the editor's "Over 6 lakh" is a mild strawman (the answer is read off (c)); acceptable.
- 1.5 #6: A is a difference, R is about sums, so "R is not the explanation" is partly by mismatch of topic. Fine as keyed; use a subtraction R if reworked.
- 1.10 #1 and #12 are the book's own Try This items (p.20 Q3 and Q6a) with the answer unchanged; #13 is the book's Q4 with a new number string. Allowed, but they are lookups for any student who has done the exercise.
- 1.3 #1 reduces to a restatement of the book's Math Talk (10 presses of +10 = 1 press of +100); keyed correctly as "R explains A".
- 1.8 #16 key "about 18 hours 20 minutes" counts 110 departures x 10 minutes; the first departure at time 0 gives 18 h 10 min; the word "about" covers it.

## Key verification notes (all correct)

- 1.1 #3: 90,09,009; short 81,08,100; 3,04,05,06,070; 5,70,03,800 - 5,07,03,800 = 63,00,000. #5 total 7,01,46,000, after refund 6,99,96,000 (4,000 short). #10 total 27,49,625, 375 short, a Rs 500 gift clears it. #21 order Q<S<P<R, difference 43,69,500, only Q+S below 50 lakh.
- 1.2 #3 270 million against 280 million needed; #10 total exactly 10,00,00,000 so the bonus "more than 100 million" fails; #4 A false because 50 crore is 500 million.
- 1.3 #13: 993 (digit sum 21 plus one swap = 30); 994-999 have digit sums 22-27, none congruent to 3 mod 9, brute force agrees. #19 click counts 25, 34, 43 so 30 is impossible. #5 27, #14 18 fewer, #16 36 fewer, #17 45 more.
- 1.4 #10 exact gap 69,268, so "more than 70,000" is false; #7 50,00,000; #11 D, B, A, C; #19 45,000 and 54,999 (half-up stated).
- 1.5 #3 86,02,652 against 84,25,970; #15 10,46,880 (Roxie closer); #20 7,49,680 against the estimate 7,50,000; #11 4,200.
- 1.6 #5 profit 18,94,500 (1,05,500 short); #7 rival 1,77,400 against 1,73,400; #14 744 x 125 = 93,000; #12 A false (25 is 100/4, not 100/5).
- 1.7 #1 only 9,876 is not a product of two 3-digit numbers (99,999 = 271 x 369, 1,00,000 = 250 x 400, 5,67,432 = 568 x 999); #8 10, 11 or 12 digits; #14 smallest 1-digit multiplier is 2 (9,999,999 x 2 has 8 digits); #16 1,75,95,54,050; #20 40,83,92,118; #15c true product 2,53,69,828.
- 1.8 #5 371 trains a day (370 give 1,24,32,000, short); #7 taps cheaper from week 3 (week 2: 1,40,000 against 1,55,000; week 3: 2,10,000 against 1,72,500); #11 43 km a day.
- 1.9 #8 with 6 lost minutes the counter reaches exactly 1,00,000, so "more than a lakh" is false; #11 option A 1,44,00,000 against option B 1,50,00,000; #6 A true (273.97 years), R false (365 x 250 = 91,250); #7 S1 false (a crore is 10,000 thousand).
- 1.10 #3 2008 (brute force over all numbers; fewer than 4 digits cannot reach 24 sticks); #6 30,861; #12 the 1000th digit is 3 (first digit of 370); #15 the 500th digit is the 0 of 203; #13 92648 and 12648; #20 eight digits (seven 1s and one 7); #16 A false (9876543210), R true.

## Structure counts

- Types: 87 short_answer, 49 mcq, 40 long_answer, 10 multi_statement, 10 assertion_reason, 8 match, 6 fill_blank. Bloom: Analyse 99, Apply 67, Evaluate 26, Understand 10, Create 8, no Remember. Difficulty: Hard 183, Hardest 27, no Easy. Marks per concept 45-50.
- Rubric points sum to the stated marks in every short_answer/long_answer item (checked in code).
- Every concept has 2+ case-study long answers, scenario mcq, at least one claim-check/true-false, and one reverse item (rev tag in 1.1 #20, 1.2 #20, 1.3 #4, 1.4 #20, 1.5 #2, 1.6 #14, 1.7 #5, 1.8 #2, 1.9 #13, 1.10 #10, plus others).
- Scope: all items stay inside the chapter (lakh/crore/arab and million/billion, rounding to ten thousand/lakh/ten lakh/crore, estimation, regrouping with 25/125/250, digit-count of products, the 365-day staged estimates, toothpick digits and the p.20 Try This items). No out-of-scope topic found.
