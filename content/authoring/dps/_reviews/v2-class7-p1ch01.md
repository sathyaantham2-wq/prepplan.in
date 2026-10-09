# Review v2: DPS bank, Class 7 Maths, Part I ch 1 "Large Numbers Around Us" (gegp101)

File: `content/authoring/dps/class7/p1ch01.json`. Method: every question read concept by concept, every number recomputed in python / by hand, facts checked against `content/extracted/gegp101/pages/001-023`. Item numbers (#n) are the position in the concept's list. Diffed against `content/authoring/dps-v1-backup-2026-10-08/class7/p1ch01.json`.

(Findings are appended concept by concept below; the severity-ordered summary is at the end of the file.)

## C7M-1.1 (21 items)
Keys: all 21 recomputed, all correct.
- MEDIUM #9 (scenario mcq, 'forty lakh five thousand twelve' typed 40,50,012): the keyed option says "He left out a 0". He did not leave one out: 40,05,012 and 40,50,012 both have 7 digits; the 0 is misplaced (after the 5 instead of before it). Fix: "He put the 0 after the 5 instead of before it, so the 5 sits in the ten-thousands place instead of thousands".
- MEDIUM easy-in-disguise #4 (name 60,07,085 / write 'four crore four lakh forty'), #14(a) (name 6,57,03,210), #17 (add one crore, then read it), #2 (three read/write conversions, 5 marks), #20(a)(b). All are the book's own "write in words / figures" exercise (p.4-5) with bigger numbers: one-step lookup of the 3-2-2 rule. #4, #14 were relabelled Understand -> Apply with the text unchanged. Fix: give each a second move (e.g. #4: the number name is wrong in a ledger, find which digit moved and by how much; #17: find which place changes when one crore is added to a number with 99 lakh).
- MEDIUM #7 assertion-reason: A "98,76,543 is a 7-digit number" is a digit count (labelled Analyse); R "Indian system is used in Nepal and Sri Lanka" is true (p.8) but unrelated trivia, so "true, not explanation" is a padding outcome. Fix: make R a place-value fact about A (e.g. R: the largest 6-digit number is 9,99,999) and use a different outcome elsewhere.
- LOW #10 'three crore six lakh' digits: a one-step count, labelled Apply (was Understand, text unchanged). Easy-in-disguise (counted).
- LOW #16(b) "what does it tell you" is soft; the book states 99,999+1 = 1,00,000 in a line. Easy-in-disguise (counted).
- LOW #21 case study (d) "Did the corporation meet its target?": answer is read straight off (c) (7,01,46,000 > 7,00,00,000), a confirmation not a trade-off. #1 (d) same (the 500 vs 375 step is a neat consequence, that one is acceptable).
- LOW #11 fill_blank key "10,000": fine (sameNumber handles commas) but state in the stem "in figures, no commas" or key "10000" to be safe.

## C7M-1.2 (21 items)
Keys: all 21 recomputed, all correct (#1 total is exactly 10,00,00,000 = 100 million, so "No" is right; #20 4,02,06,00,000 and 2,06,00,000 correct).
- MEDIUM easy-in-disguise, one-conversion items: #5 (250 million -> 25 crore), #9 (540,000,000 -> 54 crore), #11 (2,500 crore -> 25 billion), #13 (12,50,00,000 -> 125,000,000), #14 (regroup + name), #4 (relabelled Understand -> Apply, text unchanged), #12 (count the commas, labelled Analyse; trivial). Each is one application of the book's table rule (1 crore = 10 million; 10 lakh = 1 million) or a regrouping; the second step the standard asks for is missing. #5/#13 and #9/#11 are the same move four times. Fix: keep two, and turn the rest into e.g. a two-amount comparison, a figure with a misplaced comma to catch, or a conversion whose answer is then used (total, difference, per-head share).
- MEDIUM #8 match: the key is the diagonal I-A, II-B, III-C, IV-D (Column II is listed in the same order as Column I). Reorder Column II (e.g. 250 thousand, 3 million, 120 million, 50 million) so the key is not the identity pairing. Also all four rows are one conversion each (easy-in-disguise).
- LOW #7 assertion-reason: fine (R explains A) but the item is a two-line restatement of the book's rule table; labelled Analyse. Easy-in-disguise (counted).
- LOW #21 case study (d): 270 million vs 250 million "enough" is a confirmation, not a trade-off; give a competing cost (e.g. extra ground-work 3 crore) so the answer can go either way.
- LOW #16/#15 are near duplicates (lakh <-> crore + million): one idea tested twice; #17 is a third.
- Claim-checks in this concept: #3 No, #18 Yes, #19 show_impossible (No-type).

## C7M-1.3 (21 items)
Keys recomputed: all correct except the stem problem in #14.
- HIGH #14: stem says "A calculator has the buttons +1, +10, +100, +1000." then (b) "How many clicks does Systematic Sippy need for that value (31,508)?" The key is 17 (3+1+5+0+8), which uses a +10000 button the stem says the calculator does not have. With only the four stated buttons the fewest is 31 + 5 + 0 + 8 = 44 clicks. Two defensible answers (17 and 44). Fix: state the buttons as "+1, +10, +100, +1000, +10000 and +100000" (as in the book's Sippy) or ask for 44 deliberately and change the key and step.
- MEDIUM #18 claim-check (Handy Hundreds): "numbers that Tedious Tens and Thoughtful Thousands cannot show but I can". Read distributively ("a number Thoughtful Thousands cannot show but Handy can"), the statement is TRUE (8,300 is a multiple of 100 not of 1,000), which is exactly what #20(c) of the same concept proves. The key "No" needs the reading "numbers neither can show". Fix: write "a number that neither Tedious Tens nor Thoughtful Thousands can show, but I can", or ask only about Tens.
- MEDIUM repetition: the digit-sum rule ("fewest clicks = sum of the digits") is the answer to #1(a), #2(c), #4(a), #5, #6, #8, #9, #13, #14(b), #15(b), #19, #20(a), #21 - about 13 of 21 items. Divide-by-button-value ("number / button") is #4(b), #10, #11, #16, #17(a), #20(b) (6 items; #11, #16, #17(a) are the book's own exercise 3(f), 2(d), 1(f)). Cut #5/#9 to one, #10/#11/#16 to one, and replace with items on the other IN ideas (many-ways expressions, +10,000/+100 only calculators, exactly-30-clicks puzzle from p.7).
- MEDIUM easy-in-disguise: #5, #9 (digit sum of one number), #11, #16, #17(a), #10 (book exercise numbers), #8 (match of four digit sums, relabelled Remember -> Apply, text unchanged), #12 (why ten presses = next button; the book's own Math Talk, relabelled Understand -> Analyse, one-line reason), #4 (relabelled Understand -> Apply).
- LOW #7 assertion-reason: R "Creative Chitti has seven buttons" is a trivia fact, not about A; padding for the "true, not explanation" outcome. Fix: R about ten +10 presses = one +100 press (then it EXPLAINS A, change the key to "explains") or keep the pattern and make R a real number fact.
- LOW #1: part (c) is largely visible in (b)'s own numbers and (d) uses a strawman ("Rohit says 20 clicks"); acceptable because the reason needs (a) and (c). #21 (d) threshold of 30 is arbitrary but computed; fine.
- Fill_blank #10 (answer 460): machine-matchable, but it is exercise-level (4,60,000/1000), see easy-in-disguise.

## C7M-1.4 (21 items)
Keys: all 21 recomputed in python; all correct.
- MEDIUM #17 "smallest 5-digit number that rounds to 50,000 at the nearest ten thousand": the answer 45,000 depends on the "exactly halfway rounds up" convention, which this book never states (it only gives the up/down contexts, p.10-11). A student who says 45,001 is defensible. Fix: add "(a number exactly halfway rounds up)" to the stem, or ask for the smallest 6-digit number that rounds to 1,00,000 at the nearest lakh with the convention stated.
- MEDIUM easy-in-disguise: #12 ("Which situation calls for rounding UP?", the book's own 468/470/76,068 examples; relabelled Understand -> Apply, text unchanged), #11 (nearest lakh of one number), #8 (match of four roundings, relabelled Remember -> Apply; it is the book's "nearest neighbours" table p.11), #15 (the book's own Chintamani 76,068), #9 (nearest crore of one number), #4 (relabelled Understand -> Apply; (b) is the book's sweets example).
- LOW #6 Statement 1 "Rounding down is the right choice in every situation" is a strawman a student rejects without the chapter; make it "Rounding to the nearest thousand always gives a number below the original".
- LOW #5/#13/#16(a)/#20(a) all test "round up so nobody is short" (4 items) and #20(c)/#16(b) the opposite; reduce to two.
- LOW #21 (d): clear-cut (ten-thousand rounding obviously closer); no real trade-off. #1 (d) also asks only whether "Over" is fair.
- Claim-checks: #3 No ("not always"), #19 No, #18 show_impossible. True/false #10 is True (the misconception: different roundings give different numbers) - fine, but 49,960 is a very friendly number; the reason is a restatement.

## C7M-1.5 (20 items; the only concept below the 21 of the others, fine)
Keys: all 20 recomputed in python; all correct (exact values: #1 9,10,070; #2 10,46,880; #15 3,86,400; #19 7,49,680; #20 41,24,644 and 86,02,652).
- MEDIUM easy-in-disguise: #16 (add 3,02,500 to itself, compare with 6,00,000: arithmetic, "who is right" is decoration), #8 (round two numbers to the lakh and add: one step), #10 fill_blank (round two numbers, subtract: one step), #9 (same move at ten-thousand level). #8, #9, #10, #13 are one idea ("round both, then add/subtract") four times.
- LOW #6 Statement 1 ("estimating before calculating can help catch a wrong exact answer") and #7 R (same sentence) are platitudes the book does not state; #7's R does not bear on A (fine as "true, not explanation") but it is the same filler fact as #6. Use a real estimation fact (e.g. rounding both numbers down never overshoots the sum) in R.
- LOW #11 (key "More, as the first is 2,000 under 4,00,000 and the second 2,500 over") is much longer than every distractor and the only one that gives a reason: see the longest-option count in the template section.
- LOW #17 claim-check is a "Yes", the only claim-check in this concept (the rest are show_impossible); acceptable for the verdict mix.
- #1, #2, #19, #20 are strong: each part needs the chapter, bounds are verified, the last part is a real judgement (#19 shows a close call where the estimate says "enough" and the exact total says not).

## C7M-1.6 (21 items)
Keys: all 21 recomputed in python; all correct.
- MEDIUM easy-in-disguise: the stem hands over the method and the student only computes: #9 (tailor: "finds 248 x 10, then halves it"), #10 ("36 x 25 can be found as 36 x 100 divided by 4. What is the answer?"), #11 ("Using 250 = 1000/4, what is 64 x 250?"), #4 (both parts name the method; relabelled Understand -> Apply), #16 (both parts name the method), #14(a). Also single lookups of the rule: #5 (which regrouping for 25), #13 (which for 125), #8 (match of four products, relabelled Remember -> Apply). #15 and #2(a) are the book's own exercise 1 (2 x 1768 x 50; 125 x 40 x 8 x 25) with new numbers. That is about 11 of 21.
- MEDIUM #12 true/false: the statement is true and straightforward (72 x 125 = 9,000, double for 250 = 18,000); there is no chapter misconception for a student to fall into, so True is the "easy" verdict. Fix: make it False on a real slip, e.g. "72 x 250 as 72 x 1000 / 8 = 9,000" (forgetting 250 = 1000/4), or "x 25 = x 10 / 4".
- LOW #7 assertion-reason: R "125 x 8 = 1000" is the same fact as A rearranged (not a separate fact about the topic). Replace by a reason that is not a rewording (e.g. "dividing by 8 is the same as multiplying by 125 then dividing by 1000").
- LOW #1 (d): the rival pays Rs 2 x 25 = Rs 50 a box, identical to the box price, so the carton cost alone decides: not a real trade-off and nothing in (a)-(c) is genuinely needed beyond subtraction. Give the rival a different rate (e.g. Rs 1.80 per pen) so the comparison depends on (a) and (b).
- LOW #19: "Create a multiplication ... that gives it" has one answer, 960 (1,20,000 / 125); it is a division, not a creation. Either ask for any pair using 125 and 8 (e.g. free choice of second factor with a given product) or drop the Create label.
- LOW repetition: 72 x 125 appears in #1(c) and #12 (and is the book's own hint); 56 x 125 in #2(b) and #13; 36 x 25 in #10 and #14; 3,176 / 2,356 style "grouping to 100 or 1000" in #2(a), #15, #20.
- LOW #6 key "1 and 3 only" repeats the key of 1.2 #6.
- Claim-checks: #3 No, #18 No (both No).

## C7M-1.7 (21 items)
Keys: all 21 recomputed in python; all correct. #12 checked by factorisation: 99,999 (271 x 369), 1,00,000 (250 x 400) and 5,67,432 (568 x 999) are products of two 3-digit numbers, 9,876 is not, so the key is the only answer.
- MEDIUM case studies #1 and #21 are the same frame twice (a form/field of digit boxes; (a) smallest and largest product, (b) how many digits, (c) check one given product, (d) is the box count safe). In both, part (c) is answered in its own stem: "how many digits does 17,64,000 / 23,40,00,000 have?" is a count of a number already printed (free mark; the multiplication is also printed). Fix: in (c) ask for the product to be found or for the digit count of an unprinted product (e.g. "price 450, 5,20,000 tickets: the digits without multiplying"), and give the two case studies different settings and different decision types (one a threshold/capacity, one a mixed-shape choice).
- MEDIUM easy-in-disguise: the whole concept is "m x n digits gives m+n-1 or m+n" and it is asked as bare rule applications in #5, #10 (fill_blank, 5-digit x 3-digit, at most ___ digits: pure m+n lookup), #11 (relabelled Understand -> Apply, text unchanged), #13, #14(a), #15(a), #4(a) (relabelled), #16 (the book's own 2-digit x 2-digit reasoning, p.15), #8 (match of four shapes, relabelled Remember -> Apply, text unchanged), #9 (one rule applied, labelled Analyse). About 10 of 21 are one-step lookups. Fix: keep 2, convert the rest to items where the shape is not given (find which shapes can give an N-digit product, or use bounds on actual numbers such as #17).
- LOW #7 assertion-reason: R is another instance of the same pattern (1-digit x 1-digit), so "true, not explanation" is decoration; make R a statement about bounds (the smallest 5-digit x 5-digit product is 10,000 x 10,000) which would explain A.
- LOW #19 uses "m + n = 9 or 10" which is correct; fine. #2 and #20 overlap (smallest and largest bounds) but test different shapes.
- No claim-check "Yes" in this concept: #3 No, #18/#19 show_impossible/reverse.

## C7M-1.8 (22 items)
Keys: all 22 recomputed in python; all correct (#2(d) 43 km: 42 x 9,125 = 3,83,250 < 3,84,400 <= 43 x 9,125 = 3,92,375; #21 1,47,000 days vs 1,46,000; #22 17 days = 1,22,40,000 and 18 days = 1,29,60,000).
- MEDIUM easy-in-disguise, one-step arithmetic from the book's page 18-19 examples: #11 (250 babies a minute -> an hour; book's own), #12 (1 coin a second -> an hour; book's own), #10 (100 km x 365; new but a single multiplication), #14 (choose the operation: divide), #8 (match, four multiples of 365 by 10; relabelled Remember -> Apply), #5 (which staged plan; the plan is named in the first option's text). All six are single multiplications; #11/#12 text unchanged from the backup.
- MEDIUM Bloom labels do not match the thinking: #1, #2, #22 are labelled Create, and #3, #20 Evaluate/Analyse, yet each is staged multiplication then a comparison (Apply). They carry the chapter's 30% Analyse/Evaluate/Create floor. Relabel honestly (Apply) or add a genuine design step (e.g. in #22 choose the number of trains so that the line carries the city in a week and justify the assumption).
- MEDIUM decision parts are strawmen: #1 (d) "the secretary says 42 tankers a week is enough" (needs 70) and #22 (d) "an official says 15 days is enough" (needs 18), both "an official makes a wrong claim, say No". Give a real trade-off (a budget per tanker, a second supply, a range of per-flat use of 400-600 litres).
- LOW #2: a daily 8 km run for 25 years and the part (d) answer 43 km a day: fine as arithmetic but the story is a stretch; use a walking/cycling commute instead.
- LOW #9 (reverse, 3 marks, label Hardest): free-response with a sample answer; the mark scheme accepts any situation, OK, but 3 marks labelled Hardest is high. #7 A/R is a clean "R explains A".
- LOW #13 true/false is good (the 50 lakh vs 5 crore zero slip).
- Claim-checks: #19 No.

## C7M-1.9 (21 items)
Keys: all 21 recomputed in python; all correct (#9: 100 lakh = 1 crore has 8 digits, the others fit in 7; #12 1,00,000/365 = 273.97, so 274; #19 5 x 365 x 60 = 1,09,500).
- MEDIUM easy-in-disguise, the book states the fact in a line: #15 (zeros of lakh/crore/arab = 5, 7, 9 and each 100 times the last; the only Understand-labelled item left; page 8 and summary), #18 (claim-check "5 zeros and 7 zeros so a crore is 100 times a lakh": the book states it; verdict "Yes" is the book's line), #12 (one lakh days = about 274 years, p.4 verbatim), #13 (1,06,000 minus one lakh: the book's Figure it Out Q2 with the same number), #16 (the book's Q1-Q3 with new numbers), #5 (99,999 + 1; p.2 and p.9), #4 (relabelled Understand -> Apply; 8 crore in lakh, zeros of 100 crore: p.8), #2(c) (the stadium excess and 99,999+1). That is 8 items.
- MEDIUM #8 match: Column II is ordered so the key is the diagonal I-A, II-B, III-C, IV-D again (same flaw as 1.2 #8). Shuffle Column II. The four rows are also all "multiply a unit and read it in lakh/crore".
- LOW #1: a seed-bank programme running 80 years is an unrealistic setting (the standard says "no 80-year careers") and (d) "The director says the team can finish ... do you agree?" is answered by (b) alone (87,600 < 1,00,000). Use a 10-year project and a rate that sits close to the line.
- LOW #7: R "99,999 + 1 = 1,00,000" is an unrelated true fact (filler), see the template note on assertion-reason Rs.
- LOW #21 (d): the board sentence is trivially checked from (c); no trade-off.
- LOW #3 is a good partly-right claim-check (the only one in the chapter that is "partly right"); keep.
- Claim-checks: #3 partly, #18 Yes.

## C7M-1.10 (21 items)
Keys: all 21 recomputed; #2, #14, #11 and #19 by brute force over all 10-digit permutations / all 5-of-9 subsequences (largest multiple of 5 = 9876543210, smallest multiple of 5 = 1023467895, smallest even = 1023456798, largest odd = 9876543201; #19 92648 / 12648); #4 and #16 by enumerating the digit set given in the stem (71; 10 and 1111). Stick counts in the stems are consistent with the book's own 42,019 = 23 sticks and 63,890 -> 88,078. All correct.
- MEDIUM repetition: 9876543210 and "a multiple of 5 ends in 0 or 5" are the answer or the premise of #2(a), #3, #6 S2, #7, #9, #14(a) (six items), and "+10,000/+100 can show only multiples of 100" of #1(b), #5, #6 S1, #13(b), #17 (five items). #2(a)(b) is the book's own exercise 1 (p.20). Cut #14 and #7 or change them to a different digit set; replace with the untested IN ideas (exactly-30-clicks puzzle p.7, "997 with a different number of clicks", toothpick "make any number with 24 sticks / biggest / smallest" p.23, 7-digit number name with the most letters).
- MEDIUM easy-in-disguise: #5 (which numbers +100/+10,000 can show: one rule), #10 (add four given stick counts), #21 fill_blank (add four given stick counts: not application-level for a fill_blank), #11 (relabelled? no, labelled Analyse; the answer 8 is read off #2(b)), #13 (repeat of #1(b)), #18 (Create: any a + b = 20, a one-step choice). 
- LOW #20 (d): "the largest 5-digit plate with 30 sticks" is 99,999 whatever the sticks (it just happens to need exactly 30); the decision does not use (a)-(c). Ask instead for the largest number of any length the 30 sticks can make (fifteen 1s) vs the largest 5-digit one, so sticks matter.
- LOW #1 (d) "which earns the bonus" is read from the counts in (a) and (c). #17 is a good partly-right claim-check (keep).
- True/false #8 is False (1,074 vs 7,401 need the same 15 sticks) and fits the misconception "bigger number needs more sticks".

---------------------------------------------------------------------------

# SUMMARY (severity-ordered)

Read: all 210 questions in 10 concepts (21, 21, 21, 21, 20, 21, 21, 22, 21, 21). Types: 50 mcq, 86 short_answer, 40 long_answer, 10 multi_statement, 10 assertion_reason, 8 match, 6 fill_blank (the loader minimum max(2, ceil(10/2)) = 5 is met for fill_blank, match and true_false).

## HIGH (1)
1. C7M-1.3 #14: stem gives the calculator buttons +1, +10, +100, +1000 only, then asks Systematic Sippy's fewest clicks for 31,508 and keys 17 (3+1+5+0+8, which needs +10000). With the stated buttons the answer is 31+5+0+8 = 44. Fix: list +10000 and +100000 in the stem (as the book's Sippy has) or key 44.

## MEDIUM (chapter-level, then item-level; full detail in the concept sections above)
1. Mostly not rewritten. 183 of 210 items (87%) are word-for-word the backup items; 27 are new (the 6 fill_blank, 5 true_false, 3 matches, 4 scenario mcq in 1.2/1.9 and a few mcq). 18 of the unchanged items only had their Bloom label raised: Understand -> Apply (1.1 #4/#10/#14, 1.2 #4, 1.3 #4, 1.4 #4/#12, 1.5 #4, 1.6 #4, 1.7 #4/#11, 1.9 #4), Understand -> Analyse (1.3 #12), and five matches Remember -> Apply (1.3, 1.4, 1.6, 1.7, 1.8 #8). The loader's no-Remember rule is therefore met by labels, not by thinking.
2. Easy-in-disguise count: 72 of 210 (34%) answer a one-step lookup or a single computation whose method is stated in the stem or the book (concept lists above: 1.1 7, 1.2 9, 1.3 8, 1.4 6, 1.5 4, 1.6 10, 1.7 10, 1.8 6, 1.9 7, 1.10 5). Typical shapes: "using 25 = 100/4 what is 36 x 25?", "250 babies a minute -> an hour", "regroup 540,000,000", "a 7-digit x 1-digit product has 7 or 8 digits", "1,06,000 minus one lakh" (the book's own exercise), "zeros in lakh/crore/arab = 5, 7, 9". Of the 6 fill_blank, 1.7 #10 (m + n lookup), 1.10 #21 (add four given numbers) and 1.3 #10 (460 = 4,60,000 / 1,000) are not application-level.
3. Slot order is identical in all 10 concepts: positions 1-7 are always long-4 case study, long-5, short-3, short-2, mcq, multi_statement, assertion_reason (then match/mcq). Rotate and mix the order, and make the claim-check not always in position 3.
4. Assertion-reason alternates strictly: "true, not the explanation" in 1.1, 1.3, 1.5, 1.7, 1.9, "explains" in 1.2, 1.4, 1.6, 1.8, 1.10 (5/5, a perfectly even split but in order), and the not-explanation R is filler in 1.1 (Nepal and Sri Lanka), 1.3 (seven buttons), 1.5 (estimating catches errors), 1.9 (99,999 + 1) while the "explains" R in 1.6 is A reworded. No A-false outcomes at all (fine for Maths but note).
5. Case-study decisions: about 14 of the 20 case studies end with a confirmation that the arithmetic already settled (1.1 #21, 1.2 #21, 1.5 #20, 1.6 #21, 1.7 #1/#21, 1.9 #21, 1.10 #1/#20) or a strawman official/director/secretary making a wrong claim (1.6 #1, 1.8 #1/#22, 1.9 #1). Part (c) is answered in its own stem in 1.7 #1 and #21. Real trade-offs exist in 1.1 #1, 1.2 #1, 1.3 #21, 1.4 #21 and 1.5 #19 and should be the model.
6. Bloom labels: 1.8 #1/#2/#22 (Create), 1.8 #3 and 1.8 #20 (Evaluate/Analyse), 1.1 #7, 1.2 #7, 1.2 #12, 1.7 #9 (Analyse) are Apply-level thinking, inflating the 35.7% Analyse/Evaluate/Create share (75 of 210).
7. Claim-check verdict mix (16 items tagged claim_check): 11 No/Wrong, 3 Yes (1.2 #18, 1.5 #17, 1.9 #18), 2 partly right (1.9 #3, 1.10 #17). 69% No against the "about half" target; add Yes and partly-right verdicts to 1.1, 1.4, 1.6, 1.7 (all No).
8. C7M-1.3 #18 reads two ways (distributive "and"); C7M-1.4 #17 relies on an unstated half-up rule; C7M-1.1 #9 key text says "left out a 0" which is not what the typist did. All single-item fixes noted above.
9. Repetition inside a concept: 1.3 (digit sum ~13 items), 1.10 (9876543210 six times), 1.4 (round up for safety four times), 1.7 (m + n rule ~14 items), 1.2 (million/crore conversions ~10).
10. Matches: 1.2 #8 and 1.9 #8 have the identity key (I-A, II-B, III-C, IV-D); all rows of 1.2/1.3/1.4/1.6/1.7/1.8 matches are four mechanical evaluations of the same type. 1.5 and 1.10 have no match (fine, 8 >= 5 required).

## LOW
- Settings: 1.9 #1 (80-year seed-bank programme), 1.8 #2 (daily 8 km for 25 years), 1.8 #22 (150 trains a day).
- 1.1 #11 fill_blank key "10,000" has commas (the app's sameNumber normaliser should accept "10000", but state the format).
- The correct MCQ option is always first in the authored list (50 of 50): safe only because the loader shuffles; confirm the shuffle ran in the last --check.
- No option is named by position anywhere (grep for "option (b)", "first/second/third option": 0 hits).
- 1.6 #19 and 1.10 #18 are labelled Create but have one or trivially many answers.

## Counts read (not impressions)
- Correct MCQ option longest (ties counted): 22 of 50; excluding the numeric / one-token ties, 6 of 22 text-option items (1.1 #9, 1.3 #12, 1.5 #5, 1.5 #11, 1.6 #13, 1.7 #9); 1.5 #5 (88 vs 78-83 chars) and 1.5 #11 (68 vs 56-61) lead by 5-12 characters. Near chance; no systematic skew, but fix 1.5 #11 and 1.5 #5.
- multi_statement keys: 1&2, 1&3, 1 only, 2&3, 1&2&3, 1&3, 2 only, 1 only, 2&3, 1&3. False statement position spread over 1, 2, 3 (1: 1.4/1.7/1.9; 2: 1.2/1.3/1.6/1.7?/1.8/1.10; 3: 1.1/1.3/1.7/1.8). Acceptable; "1 and 3 only" three times (1.2, 1.6, 1.10).
- true_false: 5 items, 3 False (1.2 #10, 1.8 #13, 1.10 #8), 2 True (1.4 #10, 1.6 #12) = 40% True, inside 25-75%. The two True items have no real misconception behind them.
- Types per concept: 2 case studies, 2 five-mark, 5+ two-mark, 3+ three-mark everywhere; scenario mcq tag count 34 (3+ per concept met); no Remember, no Easy, 11 Understand (5.2%).
- Identical slot order across concepts: yes (positions 1-7 in 10 of 10).
- Repeated ideas: see MEDIUM 9.

## Per-concept verdict
- C7M-1.1: pass after fixes (1 MEDIUM key-text fix #9; replace 5-6 conversion items).
- C7M-1.2: pass after fixes (about 9 one-step conversions; match key diagonal).
- C7M-1.3: rework the stem of #14 (HIGH), #18 wording; cut digit-sum repetition.
- C7M-1.4: pass after fixes (#17 convention; relabelled items).
- C7M-1.5: pass (strongest concept; fix the two long correct options).
- C7M-1.6: pass after fixes (method-given items, weak T/F #12).
- C7M-1.7: pass after fixes (case studies #1/#21 free part (c) and same frame; rule-lookup items).
- C7M-1.8: pass after fixes (one-step book examples, strawman decisions, Create labels).
- C7M-1.9: pass after fixes (book-fact items, match key).
- C7M-1.10: pass after fixes (repetition of the 9876543210 idea, thin fill_blank).

## Overall verdict
Pass after fixes, leaning to a partial rework: keys are sound (1 HIGH, a stem defect in 1.3 #14), but 87% of the chapter is the unchanged old text with raised Bloom labels, about a third is one-step, and the slot order is identical in every concept. Rewrite the 72 easy-in-disguise items (starting with the 18 relabelled ones) before this counts as meeting the "no easy questions" rule.
