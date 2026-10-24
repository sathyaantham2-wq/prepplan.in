# v3 review: class8 ch02 "Power Play" (MATH8, hegp102), after one fix pass

File: content/authoring/dps/class8/ch02.json (127 questions: 21/21/21/21/21/22). Indices are 0-based inside each concept, in file order.
Method: diffed against the pre-edit copy by exact item match. 51 items are new or changed (2.1: 8, 2.2: 7, 2.3: 7, 2.4: 8, 2.5: 8, 2.6: 13). Every one was recomputed in code or by hand. The 76 unchanged items were already read in v2. Their option items, multi_statement items and assertion_reason items were re-read here.
Structural checks run in code over all 127: o[0] equals the key in all 46 option items, no duplicate options, step marks sum to `m` in every item with steps, no option named by position.

## v2 status
- M1 (2.6 Q6 "100^4", options equal in value to the key): FIXED. It is now 2.6 Q5. Options are 3.08x10^8, 3.08x10^7, 0.308x10^10 (=3.08x10^9) and 3.8x10^8. None is equal in value to the key, and only the key is in scientific notation. I also checked every other option item in the chapter for value-equality with its key: 2.6 Q7 (11.2x10^11 is 1.12x10^12), 2.6 Q8, 2.6 Q9 (0.5x10^3 is 500, not 5000), 2.5 Q0, Q6, Q8, 2.2 Q2, Q7, 2.2 Q20 and 2.4 Q7. None has a second equal option.
- M2 (26^6 by hand): FIXED. 2.1 Q15 now uses 20^6 = 64 x 10^6 against 10^5, a 640x ratio and a clear 500x claim.
- M3 (easy-in-disguise): MOSTLY FIXED. The 2.3 Q6/Q8, 2.4 Q4/Q7/Q8, 2.5 Q2/Q6/Q9, 2.6 Q2/Q4/Q8/Q9/Q10, 2.1 Q5/Q7 items are now two-step or error-finding. Residual cases are under L1.
- M4 (weak last parts): FIXED. 2.3 knockout now has a 10-day limit and two grounds, and I recomputed 11 days against 8 days. 2.5 chart (d) is now a real scale decision (pitch needs k <= -2, grain k >= 0). 2.6 planets now needs the scale choice (only 2x10^10 works). 2.6 grandmother and 2.4 tracer are sound. 2.2 tiling has a new defect, see M1 below.
- M5 (templating): PARTLY FIXED. See M2 below.
- M6 (correct option longest): ACCEPTABLE. Strictly longest keys among the 46 option items: 1 (the fixed-text assertion_reason in 2.6). The lopsided 2.1 Q4 key now has similar-length distractors.
- L1 (0^0), L2 (expanded form wording), L3 (true_false 6^4), L4 (2^-6 constraint), L5 (2.4 Q15), L6 (medicine to tracer), L7 (whole-number age), L8: all addressed.

## HIGH
None. Every changed key was recomputed and is correct, with exactly one defensible answer. Checks that passed:
- 2.1: 0.25 x 2^7 = 32 mm; 5^5 sachets; the sign items (A false since 5 + 3 = 8 negative factors, so the product is positive); 1296 = 2^4 x 3^4 = 6^4 = 36^2; 20^6/10^5 = 640.
- 2.2: 4^8; tiles 2^16 in both designs; 256 packs = Rs 1,15,200; 2^20 tiles = 4096 packs = Rs 18,43,200; shortfall Rs 3,43,200; (2^6)^6 is the only non-2^12 option; k = 9; 5^6 is the only square-and-cube option.
- 2.3: 6^3 = 216; 3^9 / 9^2 = 243; k = 7 and m = 10; P/Q days (4+2+5 = 11 days, Rs 3,30,000; 2+1+5 = 8 days, Rs 4,00,000); 625 < 1000 < 1024; 343 / 25 / 1 / largest (a).
- 2.4: 1 g; 343 times; 8^-2 x 2^-2 = 2^-8 is the only non-1/16 option; exponent -10; 2^4 x 2^-10; the order 3^-2 < 2^-3 < 3^0 < 2^3; tracer 16 ug, 2^-2, 42 h, 72 h.
- 2.5: m - n = 3 - (-1) = 4; 10^-2; 10^7; Y by 50 crore (2.5 billion = 250 crore); chart values 30 grains, 0.2012 m, 6x10^-5 m; 42,000.
- 2.6: 1.25 and 10; n = 6; 6.25x10^4; 1.12x10^11; the second-largest is State Q (R 1.2x10^8, Q 9.8x10^7, P 5x10^7, S 1.2x10^7); 5x10^3 bacteria; 1.8x10^10 m and 500 s; 8.5x10^8; Mars as 2,27,90,00,00,000 m, 13 times, 22.79 and 77.85 cm, and the 2x10^10 scale as the unique fit; 1.92x10^11 coins, 7.68x10^8 kg, 24 each; 70 years, 1956, 2.33x10^9 s against 2.4x10^9.

## MEDIUM
M1. C8M-2.2 Q6 (tiling case study, part d): "reasoning that 4 times the side needs only 4 times the foyer's cost" does not match the Rs 15,00,000 budget.
- Four times the foyer's Rs 1,15,200 is Rs 4,60,800, not Rs 15,00,000. The stated reasoning cannot have produced that figure. A careful student will be puzzled about whether the Rs 15 lakh is the school's budget or the result of the faulty reasoning.
- The answer (Rs 18,43,200, short by Rs 3,43,200) is arithmetically right and the decision is real. Only the stem is inconsistent.
- Smallest fix: set the budget to Rs 4,60,800 ("The school has budgeted 4 times the foyer's cost, Rs 4,60,800"). The key becomes short by Rs 13,82,400. Alternatively drop the "reasoning" clause and keep Rs 15,00,000 as a plain budget. If the figure changes, update the key text and the step line.

M2. Slot template is still visible (carried from v2 M5, only slightly improved).
- Mark order is almost identical in all six concepts. Slots 0-8 or 9 are 1-mark items (mcq / fill_blank / multi_statement / assertion_reason / match). Then come five or more 2-mark short answers. Then 3-mark items, then long answers of 4 to 5 marks, ending with a 4-mark case study at slot 20. 2.1, 2.3, 2.4, 2.5 and 2.6 all end `lon 5, lon 5/4, lon 4` and 2.2 ends `lon 4, mcq`. The tag spread is the same in each concept (2 case studies, claim_check, true_false, show_impossible, scenarios).
- "X says / X writes" correction frames appear in about 13 stems, down from 18 but still heavy.
- Keys are well spread, so this is not a sentence template. multi_statement keys are 2-and-3, 1-only, 1-and-3, all three, 2-only and 1-and-2, which is good. assertion_reason keys are 4 distinct values, which is good. claim_check mix is mixed (right x2, partly x2, wrong x3).
- Smallest fix: move the 1-mark block and the 3-mark block in at least two concepts (for example put a case study at slot 12 in 2.3 and 2.5, and an mcq at the end in 2.4 and 2.6). Also cut four or five "X says" frames.

## LOW
L1. Items that are still near one-step recall (the bank allows no easy items). These are acceptable only if the author wants to keep them.
- C8M-2.2 Q1 (assertion_reason: (5^3)^2 = 5^6; the reason is the chapter's rule restated).
- C8M-2.3 Q8 (mcq: (10^4 x 10^3) / 10^7 = 1, a two-rule substitution with easy distractors).
- C8M-2.4 Q3 (assertion_reason: 10^-3 is not negative).
- C8M-2.5 Q3 (assertion_reason on place value; R merely restates the rule) and Q8 (mcq: the stem hands over both place values, so the answer is 5 - (-2) = 7).
- C8M-2.4 Q1 and C8M-2.1 Q0 (single-rule scenario mcqs).
- Smallest fix: for 2.5 Q8, ask for the ratio of the leftmost 4 to the rightmost 4 without giving the place values.

L2. C8M-2.6 Q3 (assertion_reason): the key "both true, R not the explanation" is defensible. A could be read as "it is correct that the product is 6x10^7", in which case R seems to explain it. The A text depends on the coefficient 6 lying in [1, 10), which R never mentions. To close the second reading, rewrite A as "6 x 10^7 is in scientific notation because 6 is between 1 and 10".

L3. C8M-2.5 Q0 (mcq): the key leaves out the zero terms (0 x 10^4, 0 x 10^2, 0 x 10^0). The fourth option includes "0 x 10^4" but is wrong through "6 x 10^0". A student who believes zero terms must be written would hesitate. Add "(leave out any place holding 0)" to the stem.

L4. C8M-2.6 Q8: the stem says "after rewriting each in scientific notation", but the options stay in non-scientific form. This is fine for a key but slightly odd. State the value in each option, or ask "State Q's output is the second-largest" in a true/false form.

## Scope check
Everything stays inside the chapter: powers, exponent laws, negative exponents, powers of 10, expanded form, scientific notation, large-number applications (kharab, krill, light-seconds). No fractional exponents, logarithms or surds. "Rs 1 coin" thickness and the planet distances are realistic. The scope file still lists large-number applications only through "Powers of 10" and "Scientific notation" (carried over from v2: add "lakh, crore, billion and large-number estimates" to scope_in).

## Per-concept verdicts
- C8M-2.1: keys correct, M2 only. Load-ready.
- C8M-2.2: keys correct, but Q6(d) stem is inconsistent (M1). Not load-ready until M1 is fixed.
- C8M-2.3: keys correct; the case study now has a real decision. Load-ready.
- C8M-2.4: keys correct; tracer case study is good. Load-ready.
- C8M-2.5: keys correct; chart case study now a real decision. Load-ready (L1/L3).
- C8M-2.6: keys correct; M1 value-equality bug fixed in every option item. Load-ready (L2/L4).

## Counts read
127 read. HIGH 0, MEDIUM 2, LOW 4.
Types: short_answer 47, mcq 30, long_answer 27, multi_statement 6, fill_blank 7, assertion_reason 6, match 4. Case studies 12. Correct option at o[0] in 46 of 46 option items.

## Verdict
Not load-ready until M1 (2.2 Q6 budget figure) is fixed. That is a one-line edit with no change to any other item. After it the chapter is load-ready; M2 and the LOW items are optional polish. If the caller treats M1 as a one-number stem fix, then the pack is load-ready after it.
