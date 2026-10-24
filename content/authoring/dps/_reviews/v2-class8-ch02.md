# Review: class8 ch02 "Power Play" (MATH8, hegp102), first independent review

File read: content/authoring/dps/class8/ch02.json. Questions are numbered 0-based inside each concept, in file order.
Read: 127 of 127 (C8M-2.1 to 2.5 have 21 each, C8M-2.6 has 22). Every key, every case-study part, every step-mark sum was recomputed in python or checked against the pages.
Result: 0 HIGH, 6 MEDIUM, 8 LOW. Keys are all correct, with one exception taken up in M1 (the question is fine, one option is arguable). Step marks equal `m` in every item. No option is named by position.

## HIGH
None. No wrong key and no second defensible answer was found. The arithmetic checks below were run in code and all passed:
- C8M-2.1: 19.2 mm, 7^4*2^3 = 19208, 26^6 = 30,89,15,776, 10^4/26^3/26^2*10^2 = 10,000 / 17,576 / 67,600 against 18,000 needed, 2^24 = 1,67,77,216 against 3^15/3^16, the P/Q cell cultures (hours 13 and 14), and 3^14/3^15 against 1 crore.
- C8M-2.2 to 2.4: the tile counts, the 2^16 packs and Rs 23,040, the 46,656 = 6^6 algae counts (17,496 and 26,244), the 2^34/2^21/2^30 pen-drive items, the seed-bank 512/4 farmers/256 shortfall, the dye 4^-4, and the medicine 42 h and 72 h.
- C8M-2.5 and 2.6: all expanded forms, the 4.88 m, 30 grains, 1.92e11 coins, 24 coins, 7.68e8 kg, 5.8 days, 3.17e6 years, and 70 years / 1956 / 2.33e9 s.

## MEDIUM

M1. C8M-2.6 Q6 ("Four reports write the number 30,80,00,000 ... correctly in scientific notation").
- Option "3.08 x 100^4" has the same numerical value as the key (100^4 = 10^8), and "30.8 x 10^7" and "0.308 x 10^9" are equal too.
- Only the form is wrong, which the stem does not say strongly enough. A student who reads "correctly" as "equal in value" sees four correct options.
- Fix: ask "Which one is in scientific notation (x x 10^y with 1 <= x < 10)?". Alternatively, replace the 100^4 option with a value-different slip, such as 3.08 x 10^7.

M2. C8M-2.1 Q14 (claim check, 26^6 against 10^5, "more than 3000 times").
- The decision depends on 26^6 = 30,89,15,776, which no Class 8 student can find by hand in exam time. The ratio 3089 against 3000 is a 3% margin, so only an exact value settles it.
- It reads as calculator work, not a chapter idea.
- Fix: use numbers that give a clear estimate. For example, a 6-slot lock with digits (10^6) against a 4-slot lock (10^4) and the claim "100 times as many". Or keep 26 but use 26^3 = 17,576 against 10^3, with "more than 17 times".

M3. Easy-in-disguise items, whose answer is one line the book states or a one-step conversion (the bank allows none). The Bloom label does not change this.
- C8M-2.3 Q6 (Evaluate): why the rule needs n not 0. The answer is the book's own sentence, and the three wrong options are implausible ("0 to any power is 1").
- C8M-2.3 Q8: 3^9 / 3^4 = 243, read straight off the power line.
- C8M-2.4 Q4: 7^2 / 7^-1 = 343, a one-step subtraction of exponents. Q7 (4^-2 = 1/16) and Q8 (p^3 * p^-10) are one-rule substitutions.
- C8M-2.5 Q2 (fill_blank, tenths place gives -1), Q3 (assertion-reason, both statements restate place value), Q6 (expanded form of 6,072, a near-duplicate of Q0) and Q9 (1 billion = 100 crore, one division).
- C8M-2.6 Q2 (fill_blank, 6.08 x 10^n), Q10 (0.000002 = 2 x 10^-6), Q4 (assertion-reason on a one-line conversion), Q8 (two numbers multiplied) and Q9 (ordering three numbers by exponent).
- C8M-2.1 Q7 (which power of a negative number is negative) and Q5 (assertion-reason on the sign of an even power).
- Fix: at least one extra step. Make the student choose between two rules, find the error in a worked line, or combine two ideas. For example, turn C8M-2.3 Q8 into "3^9 / 3^4 given only 3^5 = 243, say why no division is needed".
- Roughly 17 of the 127 items are affected, concentrated in the 1-mark MCQ, fill_blank and assertion_reason slots.

M4. Weak last-part decisions in case studies (strawman or forced by one visible number).
- C8M-2.3 Q20 (knockout, "book 6 days or 7 days"). The answer is forced the moment the student sees 128 = 2^7, and 6 days obviously leaves 2 teams. Add a real trade-off, for instance a second option such as a 10-team knockout, or a venue that costs more per day.
- C8M-2.5 Q19 (science-fair chart). Part (d), "two buses or the cricket pitch", is a plain decimal comparison (25 against 20.12) with no power-of-10 thinking. Parts (a) and (b) are also direct conversions that the stem itself gives. The climb is flat.
- C8M-2.6 Q0 (planets). Part (a), "which is nearest, explain using the exponents", is answerable from the stem alone, and (c) is a one-line comparison. The decision in (d) (Mars fits on a 60 cm poster) is fine but follows from simple scaling.
- C8M-2.2 Q18 (tiling). Design 2 is cheaper only through border strips, which have nothing to do with exponents. The real work is in (a) and (b), so (c) is not a chapter decision.
- Fix: make the last part depend on a power-law result, for example "which plan stays under budget if panels double".

M5. Templating.
- Every concept carries the same tag set: 2 case studies, 1 true_false, 1 claim_check (2.6 has 2), 1 show_impossible, 3 to 4 scenarios, 1 match (2.1, 2.3, 2.4, 2.6). The macro slot order is also nearly constant: a block of 1-mark objective items, then 2-mark short answers, then 3-mark items in the order claim_check, show_impossible, reverse, then two long answers or case studies.
- Named-pupil correction frames appear 18 times ("Ramu says", "Kavya says", "Ravi says", "Mehul says", "Sohan says" and so on). Each uses the same shape: a pupil states a slip, the student corrects it.
- Repeated ideas:
  - paper folding or doubling in 2.1 (Q0, Q11, Q17);
  - halving in 2.3 (Q1, Q11, Q20) and 2.4 (Q1, Q19);
  - "decide whether a coefficient is allowed" in 2.6 (Q3 statement 2, Q14, Q15, Q18);
  - linear against exponential growth in 2.1 (Q12, Q18);
  - units-digit tricks in 2.3 (Q4, Q16);
  - "write both as a power of the same base and compare" in 2.2 (Q10, Q17).
- The claim-check verdict mix is acceptable: right x2, partly right x2, wrong x3 (including the "both wrong" item). Statement keys are spread across six values.
- This is not a sentence-frame template with swapped nouns, but it is a visible slot template.
- Fix: vary the slot order per concept, drop one duplicated halving or fold item per concept, and cut the "X says ..." frame to about 8 uses.

M6. Correct option is the longest in too many MCQs.
- Counts (longest-by-characters, ties included): 2.1 has 2 of 5, 2.2 has 1 of 5, 2.3 has 0 of 5, 2.4 has 2 of 4, 2.5 has 3 of 6, 2.6 has 4 of 6. That is 12 of 31 (39%) against 25% by chance.
- Many of these are numeric options of near-equal length, so the real bias is modest.
- Genuinely lopsided: C8M-2.1 Q4 (key "She added four 6s; 6^4 is 1296" is much longer than the others), C8M-2.3 Q6 is not longest, C8M-2.6 Q1 (key is the longest sentence) and C8M-2.6 Q5.
- Fix: lengthen the distractors in those items, or shorten the keys.

## LOW

L1. C8M-2.3 Q0 (claim check): the key says "Both parts are wrong", including 0^0 "cannot be given a value". The book never discusses 0^0, and many sources define 0^0 = 1 by convention. Safer wording: "the division rule cannot produce 0^0 because it needs n not 0".

L2. C8M-2.5 Q15 ("show that 3 x 10^4 + 12 x 10^3 cannot be the expanded form of any number"): "expanded form" with single-digit coefficients is a convention the item does not state. A sharp student can say that the sum is a number and its sum of powers is valid. Add "in the place-value expanded form where each power of 10 has one digit".

L3. C8M-2.2 Q8 (true_false, "6^4 can be written both as 2^4 x 3^4 and as (6^2)^2"): the statement is plainly true, so there is no real misconception. Replace it with a mixed statement, such as 6^4 = 2^4 + 3^4 or 6^4 = 6^2 x 6^2 = 12^2.

L4. C8M-2.4 Q14 ("write 2^-6 as a product of two powers two ways"): open-ended, any pair works, and the 2-mark answer is "any pair adding to -6". It tests only the addition rule. Add a constraint, for example "one factor must be 2^4".

L5. C8M-2.4 Q15 (Analyse, 2 marks): compute four small values and order them. This is Apply at most.

L6. C8M-2.4 Q19 (medicine): a drug at 2^6 = 64 mg first reading with 0.5 mg as an effective threshold is unrealistic. The data are clearly given and the arithmetic is right, so the fix is optional: use mg per litre, or say "a trace marker in the blood" instead of a medicine.

L7. C8M-2.6 Q21 (grandmother): the "diamond badge" margin (2.33e9 against 2.4e9) is fine, but "about 1956" and "74 years in 2030" assume her birthday has passed and treat 3.15 x 10^7 s per year as exact. State "take her age as a whole number of years".

L8. C8M-2.1 Q12 (Ramu / ladder / lotuses): the ladder gives 13 m but the stem's "4 x 3" suggests 12. A student may be confused about why the ladder is 1 + 3 x 4. Part (b) is adequate, but say "starts at 1 m" in the explanation.

## Scope check
- scope_out is not violated. No fractional exponents, logarithms, surds, exponential-function graphs or significant-figure rules appear. 0^0 is touched only in 2.3 Q0, where the answer says it is not given a value (see L1).
- The lakh, crore, million, billion, trillion and kharab items (C8M-2.5 Q9, Q17; C8M-2.6 Q5, Q13, Q19, Q20 and others) and the large-number estimates (krill, buffaloes, Himalayas, 10^15 seconds, the 1 billion seconds exercise) come from the chapter itself. The relevant pages are 019, 020, 023-025 and 027 in content/extracted/hegp102/pages (the "Figure it Out" exercises and section 2.5 "A Pinch of History"). Specifically:
  - kharab = 100 arab, 3 trillion trees and 5 x 10^14 krill appear on 020 and 025;
  - the 2 x 10^8 water buffaloes appear on 019;
  - the Himalayas at 5.5 crore years appear on 023;
  - the units-digit exercise (2^224 / 4^32) appears on 026.
- Verdict on scope: IN scope. The chapter teaches these as applications of powers of 10. scope_in lists them only through "Powers of 10 (pp. 30-31)" and "Scientific notation (pp. 31-33)", so the scope file under-lists them. Recommend the scope file adds "lakh, crore, kharab, million, billion, trillion as powers of 10 and large-number estimates (pp. 34-45)". No author change is needed.
- The units-digit idea in 2.3 Q4 and Q16 is the book's own exercise.
- Case-study data are realistic or clearly given:
  - planet distances match real values, as does the cricket pitch at 20.12 m;
  - coin thickness 2 mm and mass 4 g are plausible;
  - the dye, the toy weights and the housing-society codes are plausible;
  - the halving medicine is stylised (L6).

## Per-concept verdicts
- C8M-2.1: keys correct. Two weak points: M2 (hand-computing 26^6) and M3 items Q7 and Q5. Pass after fixes.
- C8M-2.2: keys correct, strong set (Q16, Q17, Q19 and the tiling case study). Weak points: Q8 (L3) and the cost-of-border part of Q18 (M4). Pass.
- C8M-2.3: keys correct. Weak points: Q6 and Q8 are recall (M3), Q20 has a forced decision (M4), and Q0 has the 0^0 wording (L1). Pass after fixes.
- C8M-2.4: keys correct, best case studies (the dye and the weights). Weak points: Q4, Q7 and Q8 are one-step (M3) and Q15 is low-level (L5). Pass.
- C8M-2.5: keys correct. Many items are straight place-value conversions (M3 lists Q2, Q3, Q6, Q9) and Q0 duplicates Q6. The case studies are flat (M4). Pass after fixes.
- C8M-2.6: keys correct. M1 (Q6 option 100^4), and Q2, Q4, Q8, Q9 and Q10 are one-step. The planets case study climbs weakly (M4). Pass after fixes.

## Counts read
127 questions (21 / 21 / 21 / 21 / 21 / 22). Types: short_answer 47, mcq 31, long_answer 27, multi_statement 6, fill_blank 6, assertion_reason 6, match 4. Case studies 12 (2 per concept), claim_check 7, true_false 6, show_impossible 6, reverse 3 (tagged `rev`, in 2.1 and 2.2; 2.3 to 2.6 carry `reverse`-tag items that are creation tasks).
Correct option is o[0] in every option item (all shuffled by the loader). Fill_blank keys are all single numbers with no natural equivalents. Step marks sum to `m` in every item.

## Overall verdict
Pass after fixes. Mathematically clean (0 wrong keys, 0 second answers), with good case studies in 2.2 and 2.4. The remaining work is to make about 17 one-step 1-mark items harder (M3), flatten the identical slot pattern (M5), tighten four case-study decisions (M4), and fix M1 and M2.
