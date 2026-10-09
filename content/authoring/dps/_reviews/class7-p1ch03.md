# Review: Class 7 Maths Part I ch 3 "A Peek Beyond the Point" (gegp103), `content/authoring/dps/class7/p1ch03.json`

Read: all 184 questions (9 concepts: 20/20/21/20/21/21/20/20/21), none sampled. Every number was recomputed
(Decimal in Python for the permutation puzzles and long sums, by hand for the rest) and checked against
`content/extracted/gegp103/pages/`. 9 of 9 concepts are inside scope_in; no scope_out line is violated
(no percentages, rounding, multiplication, recurring decimals).

## HIGH (wrong or unanswerable as written)

1. **C7M-3.5, long_answer "Radha's mother lists sugar 704 g, ghee 0.56 kg, rice 2.5 kg, salt 250 g and tea 99 g."**
   Part (a) says "Write the **four** items given in grams in kilograms". Only three are in grams (sugar, salt,
   tea); ghee and rice are already in kg. The key itself converts three. Fix: "the three items given in grams".

2. **C7M-3.6, long_answer "A school tank in Vadodara can hold 300 litres. In the morning 346.8 litres were pumped
   into a storage drum ..."** The setting is incoherent and part (c) has a second defensible answer. The stem
   says the tank holds 300 L, yet 346.8 L is pumped in (and 261.05 L "remains in the drum"). Part (c) then says the
   tanker's 45.5 L is "poured into a 300-litre tank". The key adds 45.5 to the drum's 261.05 L to get 306.55 L and
   an overflow of 6.55 L. A reader who takes the tank as separate from the drum gets "no overflow" (45.5 < 300).
   Fix: one container only, e.g. "a 600-litre drum" holding the 261.05 L, and the tanker pours 45.5 L into that
   drum (261.05 + 45.5 = 306.55; choose a capacity such as 300 only if the morning pumping is reworded so it does
   not already exceed it). State explicitly where the tanker water goes.

3. **C7M-3.5, short_answer "Indian Railways charges 35 paise for optional travel insurance per e-ticket passenger. ...
   2 lakh passengers"** The book (p.79, Q12 of the chapter exercise) says the fee is **45 paise** per passenger for
   1 lakh. The item states a different fact about a real body than the textbook (QUESTION_STANDARD s.11, "do not claim
   more than the book does"), and it is the book item with two numbers changed. The arithmetic is right for 35
   paise (2,00,000 x 35 = 70,00,000 paise = Rs 70,000). Fix: drop the real-body claim ("An online ticket app charges
   35 paise ...") or change the setting entirely, and change the situation, not just the numbers.

## MEDIUM

4. **C7M-3.6, short_answer "Add 19.99 and 6.01. Show the carries ..."** Key says "units 9 + 6 + 1 = 16, tens 1 + 0 = 1.
   Sum = 26.00". The tens column must take the carry: 1 + 0 + 1 = 2 (write 6 carry 1, then 2), giving 26. As
   written the working gives 16. Final answer is right; the worked key is wrong and would mislead marking of
   step 1. Fix the key text.

5. **C7M-3.6, short_answer "A student works out 12.65 - 4.8 and gets 8.05."** Key guesses the slip was "lined up 4.8
   as 4.08 or ignored the borrow". 12.65 - 4.08 = 8.57, and no simple borrow slip gives 8.05 (it equals 12.65 -
   4.6). The recomputation (7.85, check 8.05 + 4.8 = 12.85) is right; delete the speculative cause or give an error
   that really yields the wrong answer (e.g. use a wrong result of 8.25, which comes from subtracting the smaller digit
   from the larger in the tenths column).

6. **C7M-3.8, long_answer "A bus leaves Hyderabad at 6:00 a.m. ... 5.4 hours"** Part (c) asks "how many minutes does he wait
   extra?" but the key says "he is 16 minutes late". Whether the friend waits (he plans for 11:40, bus is there at
   11:24) or is late is a different statement. The 16 is right either way. Fix wording: "by how many minutes does his
   expected arrival differ from the true arrival?".

7. **All 9 claim-checks have the same verdict and frame.** Every one is "<Name> says: '...' Is he/she right?" and every
   answer is "No" (Imran, Meena, Rahul, Raj, Sunita, Neha, Rishi, Zoya, Dev). Several are strawmen
   (Anti-template rule on strawman decisions): e.g. 3.4 Raj "more digits and a lot of 9s", 3.9 Dev "begins with 3.0",
   3.1 Imran "43 is more than 4 and 3". s.3 asks for claims that are "subtly wrong or right for a limited case".
   Fix: make 2 or 3 of the nine true (e.g. 3.3 "0.50 and 0.5 are equal, so 0.500 is too?", 3.7 "the sum of 6.9 and 5.9 lies
   between 11 and 13", 3.5 "75 paise is Rs 0.75"), or true for a limited case ("true only when the fractional parts are
   both non-zero"), and vary the frame ("Which of the two students is right", "Find the error", tables).

8. **Items taken from the book with the same numbers (s.1 says change the numbers).**
   - C7M-3.6 uses the book's own Figure-it-Out items unchanged: MCQ "Find 17 - 16.198", "Find 34.505 - 18.1",
     "What is 0.934 + 0.6?"; MS statements "18 + 8.8", "0.75 + 0.03", "9.9 - 9.09"; AR "17 - 0.05"; claim-check
     "18 - 8.8" (book p.~30 Q1-Q2). Seven of the concept's 21 items are the book's exercise.
   - C7M-3.8 short "door 2 ft 5 in ... 2.5 ft" is the book's example (p.32) with the same numbers.
   - C7M-3.3 uses the book's list 4.5, 4.05, 4.50, 4.005, 04.50 (Q2, Q6, Q7); C7M-3.2 Q10 part (a) is the book's item
     "1 hundred, 1 one and 1 hundredth" and Q2/Q13/Q6 are the book's 0.274 example; C7M-3.5 uses 134 mm and 5.6 cm
     from the book; C7M-3.9 Q9 option is the first four terms of the book's "5.5, 6.4, 6.39, 7.29" pattern.
   Fix: change numbers/settings in these (new decimals, raise the level), keeping one or two as honest recall.

9. **Slot pattern is identical in all 9 concepts (templated structure).** Same order and shape every time: 4-5 plain/
   scenario MCQs, MS, AR, match, five 2-mark (a)/(b) items, claim-check, show-impossible ("Show that ... cannot"),
   "Create / Make up a real-life situation" reverse, two 5-mark (a)-(d), two 4-mark case studies of 83-127 words with
   (a)-(d) at 1 mark each. Case-study part (d) is always the decision, (a) is always a conversion or read-off. 5-mark
   items are mostly "(a) convert (b) add (c) compare" strings of computation rather than the multi-part
   "justify / compare and analyse" the DPS standard asks for. Individual items are fine; the bank still feels
   mechanical. Fix: vary a few shapes per concept (a 3-part case study; a table-based item; a "find the error in this
   worked solution" 3-marker; a 5-mark item that is one extended justification).

10. **Case-study decisions in several items are forced, not trade-offs (Anti-template rule).**
    - 3.1 Ramesh's lace: buy 2/10 m (Rs 60) or 1 m (Rs 90): the 2/10 piece covers the 1-tenth shortage and is cheaper, so
      nothing is weighed against anything.
    - 3.6 picnic money: the standard lunch is simply unaffordable (part (c) already says so).
    - 3.7 baggage: removing a bottle that is free beats paying Rs 300; 3.8 Q19 spinner (c) already gives the answer to (d);
      3.5 Madurai dosa: stem says "spent as much of the rest as he could", which dictates the dosa.
    Fix: give each a real competing criterion (e.g. a bigger piece costs more but avoids a second purchase; a smaller
    menu has a cost, etc.) so a student must justify rather than read it off.

11. **C7M-3.7 assertion-reason "Estimating first can help us catch a decimal-point slip" / R "sum is greater than the sum of
    whole parts".** Keyed "R true but does not explain A". R is the lower-bound half of the same range rule that makes the
    check work, so "R explains A" is defensible. Replace R with a true statement that clearly does not explain A
    (e.g. a fact about aligned points), or make A the lower-bound claim.

12. **AR keys:** only 2 of 9 are "both true, R not the explanation" (3.2, 3.7). s.9/s.11 want that about as often as "explains"
    (3.1, 3.5, 3.9 are "explains"; the rest are one-sided true/false). Change one or two "explains" or "A false/R true"
    items into a true-but-not-explaining R.

## LOW

13. C7M-3.2: the 0.274 example appears three times (MCQ read-aloud, MS statement 1, short answer "Aditi reads 0.274"); two are the same question
    (read digit by digit). Vary the number in one.
14. C7M-3.3: "which pair/decimal is NOT equal" appears twice (Q2 4.5/4.05 and Q9 0.05) and "how many different weights" twice (Q6 seed packets,
    Q18 rice packets). Replace one of each pair.
15. C7M-3.7: "show/reject a wrong total using whole parts" appears four times (Q4, Q11, Q15, plus Q18 treasurer). Q11 (2 marks) and Q15 (3 marks) are the same move.
16. C7M-3.1 Q12 ("Say aloud ... (i) 4/10 and (ii) 41 1/10. State one difference") has a weak (b): size difference of two unrelated numbers; make (b) compare the two or use a conversion.
17. C7M-3.2 Q16 key wording "each place moves one step to the left in value" is muddled; say each digit moves to a place worth 10 times as much.
18. C7M-3.4 Q4 distractors "2.3" and "30.3" do not correspond to a clear slip (only 20.3 does); C7M-3.5 Q6 option "Both ... equal after dropping a zero" is a throwaway.
19. C7M-3.4 Case 1 (19): part (c) is a strawman ("8 is the biggest digit"), and the "under 14.25" rule in (d) is redundant (third fastest already misses the top two).
20. C7M-3.2 Q19 and Q20 case studies: Q19(a) is partly handed in the stem rule; Q20(d) "which scale for decimals" is guided by the stem ("add them up in the decimal system").

## Checks that passed

- Keys recomputed for every item; all MCQ/MS/AR/match keys correct apart from items above. Examples verified by code: 3.9 Q12 best is 19.75 (diff 0.25);
  3.9 Q19 (a) 59.720 (0.28), (b) 205.79; 3.6 Q18 34.775 / 7.275 / 5.875; 3.7 Q18 7358.35; 3.6 Q20 6396.25, 2146.00, 52.40; 3.9 Q21 totals 155.00 / 182.50.
- Case-study chains (a)-(d) are consistent with their data in all 18 case studies except where noted (3.6 tank).
- MS false statements are spread over 1, 2 and 3 and keys vary ("1 and 3", "2 and 3", "all three", "2 only", "3 only", "1 and 2", "1 only"); no key is "1 and 2 only" more than once.
- Level mix: Remember+Understand 32.6% (limit 60%), Analyse/Evaluate/Create 30.4% (min 15%). Match items present in 6 of 9 concepts (>= 1 per two). Type minimums met in every concept.
- Reversal words ("NOT", "cannot", "rejected") are marked `rev: true` where they decide the item; 3.7 Q4 "rejected" is marked and could be unmarked (harmless).
- Settings are Indian throughout (Jaipur, Nagpur, Surat, Kochi, Pune, Rs, lakh); reading level fine for Class 7. Thousandths, 0.1 h = 6 min, feet/inches, and over notation are all on the book's pages, so no scope drift.

## Per-concept verdict

- C7M-3.1: sound; fix the forced lace decision (medium) and weak Q12.
- C7M-3.2: sound; repeated 0.274, weak (a) in two case studies.
- C7M-3.3: sound; duplicated "not equal" and "how many different" items; book list reused.
- C7M-3.4: sound; Chitra strawman in case study.
- C7M-3.5: **fix Radha "four items" and the railways fact/copy**; rest sound.
- C7M-3.6: **fix tank/drum item and the 19.99 + 6.01 key**; seven items copied from the book exercise.
- C7M-3.7: sound; AR arguable; repeated "reject a total" move.
- C7M-3.8: sound; fix wording of the Hyderabad bus part (c); door item is the book's.
- C7M-3.9: sound; all keys correct.

## Overall

Arithmetic is almost entirely correct (3 HIGH defects, all fixable by editing one stem or key). The bank reaches the DPS standard in
type spread and thinking level, but is templated in structure (same slot shapes in every concept, nine "X says ... No" claim-checks,
forced case-study decisions) and leans on the book's own exercise numbers in 3.6. Not ready to load until the 3 HIGH items are fixed;
the MEDIUM items should be fixed in the same pass.
