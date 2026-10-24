# Review: Class 8 Maths Part II ch1 "Fractions in Disguise" (dps/class8/p2ch01.json)

Reviewer: independent first review. Read all 130 questions (22, 21, 22, 22, 21, 22). Every key, every
case-study part and every step mark was recomputed in python; facts were checked against
`content/extracted/hegp201/pages/001-032`. Question numbers below are 0-based indices inside the concept.

## HIGH (wrong key, second defensible answer, fact or arithmetic error)

None found. All 130 keys recompute. All 25 MCQ keys sit among their options with no duplicate-value
options (no 25% vs 1/4 vs 0.25 pairs). All 6 multi_statement, 6 assertion_reason and 4 match keys
are correct. Every step-mark list sums to its question's marks. No option is named by position.

## MEDIUM

1. **C8M-1.1 q3, q8, q17; C8M-1.3 q9, q16, q21 (six items): "percentage points" is undefined and the key depends on it.**
   - Quotes: "...sugar share is more than 4 percentage points lower..."; "by how many percentage points?"; "By how many percentage points does the top class lead..."; "Who wins, and by how many percentage points?"; "Which team's winning percentage went down, and by how many percentage points?".
   - Problem: the book never uses the term. A Class 8 student who writes "5%" or "20% more" (relative: 30 against 25 is 20% more) has a defensible reading, and the key accepts only the plain difference of the two percentages. In q3(d) the decision itself rests on the term (5 against a 4 threshold), so a relative reading changes the verdict (59 to 54 is a 8.5% relative fall, which is more than 4 either way, but the wording is still unclear).
   - Smallest fix: define it once in each stem, e.g. "(the difference between the two percentages)", or write "how many marks out of 100 higher". C8M-1.3 q21 already defines it in the stem ("in percentage points" with the 85/75/80 percentages); use that style.

2. **C8M-1.3 q5 (true_false, Kunal 40% to 50%): second defensible reading.**
   - Quote: "Kunal's score went up from 40% in the first test to 50% in the second test (both out of 100 marks), so his score increased by 10%."
   - Problem: marks out of 100 went up by 10 marks, which is 10% of the maximum. Many students would call the statement true. The key's "False, 25%" only works if "score" means the 40 and 50 as the base. This is the percentage versus percentage-points trap, which the book does not teach, and the stem does not say which base is meant.
   - Fix: replace the statement with "...so the percentage increase in his marks is 10%." (marks 40 to 50, same wording as the book's tomato-price example), key stays False (25%).

3. **C8M-1.6 q11 (case study, metro fare): the decision does not depend on the key computation.**
   - The board promised "not more than 13%". The commuter's wrong figure is exactly 13%, which also keeps the promise, so the verdict is "kept" whether the student adds or compounds. The final part is therefore not a real decision and does not test the chapter's idea.
   - Fix: promise "not more than 12.9%". Then the commuter's 13% says "broken" while the correct 12.86% says "kept", and the verdict hinges on compounding.

4. **C8M-1.5 q13 (case study, tractor): the decision does not use (a) and (b).**
   - (c) is solved entirely from the Rs 4,86,000 given in the stem. Parts (a) (value a year ago) and (b) (price paid) are dead ends; the case study standard needs the last part to use earlier answers.
   - Fix: ask (c) in terms of the purchase price, e.g. "a loan of Rs 5,00,000 is outstanding... compare with the price paid", or make the rent and next-year value depend on (a): "he can sell at last year's value minus a further 10%..." Or drop (b) and add a part that uses (a).

5. **Templated decision frame across the case studies (counted).**
   Of about 16 case studies/decision items, at least 11 end with "a stated numeric threshold decides, student checks it": C8M-1.1 q3 (4 points), C8M-1.2 q9 (105%), q13 (40%), C8M-1.3 q6 (additives 11%), q9 (turnout rule), q21 (tie-break rule), C8M-1.4 q2 (15% profit), q18 (Rs 760), C8M-1.5 q17 (92,000), C8M-1.6 q11 (13%), and C8M-1.6 q3 (Rs 1,000 limit). The threshold is chosen to fall just between the two computed values, so the decision is mechanical, not a trade-off. Fix: in at least four of these, make the decision a genuine trade-off (e.g. C8M-1.3 q6: the family wants less sugar but Cereal Q has more nuts and costs less; let the student weigh two measured facts, with a note that either choice is acceptable if justified by the percentages).

6. **C8M-1.1 q3 and C8M-1.3 q6 are the same case study with swapped nouns.**
   Two products with grams per ingredient, "(a) a percentage, (b) which has more of X by percentage, (c) check/other ingredient, (d) a family/parent rule on one ingredient decides". Replace one (suggest C8M-1.3 q6) with a different setting, e.g. a table of mark-ups or a price change.

7. **Idea repeated more than about twice in a concept.**
   - C8M-1.4: gross/net profit appears in q6, q11, q13 and q21 (four items), although scope_out says the chapter has "one example each" of gross and net profit. Keep two (q6 and q21), replace q11 and keep q13 only if rewritten.
   - C8M-1.5: two-step depreciation is q10 (laptop 15%), q12 (scooter 10%), q19 (village 10%) and q13/q16; two-step growth is q3 (town 4%), q18 (bacteria 5%) and q17(a). q10/q12 and q3/q18 are the same one-step skill with new numbers. Replace q12 and q18 (see 8).
   - C8M-1.6: "percentage discount versus flat rupee discount" is q3(c), q9 and q15 (q9 and q15 differ only in numbers). Replace q15.
   - C8M-1.1: ratio-to-percentage is q8(a), q9(2), q10, q15 and q21 (five items).
   - C8M-1.1: per mille is q13, q16, q19 and q20 (four items) on a topic the book gives one side box for.

8. **Easy in disguise: single-step substitutions labelled Hard/Hardest and Analyse/Evaluate.**
   The bank rule is no easy items. These are one substitution into a formula the book states, in a 1-mark slot:
   C8M-1.1 q4 (9/40 as a percentage), q13 (3 in 250 per mille), q16 (18 per mille to percent); C8M-1.2 q1 (25% plus 10% of 360), q11 (540 of 400 as a percentage), q20 and q21? (see below); C8M-1.3 q0 and q1 (percent decrease 640 to 480, increase 32 to 44), q20 (9,000 after 20% rise); C8M-1.4 q1 (160 to 200), q3 (640 plus 35%); C8M-1.5 q15 (interest paid out, 12.5% for 4 years), q12 (80,000 at 10% for 2 years), q18 (4,00,000 at 5% for 2 hours); C8M-1.6 q2 (Rs 2,000, 25% off, 12% GST), q21 (p x 1.1 x 0.9).
   Fix: give each a misconception layer (e.g. ask for the percentage and which base a given wrong figure used; two quantities with a trap in the base; an unknown inside the formula) or promote it to a two-mark (a)/(b). Also relabel honestly: all 130 items are tagged Hard or Hardest (no Medium at all), so the difficulty tag carries no information.

9. **Items that are number-swapped clones of the book's own exercises (recall of the worked method).**
   C8M-1.1 q10 (book millet kanji, p.9); C8M-1.2 q7 (excursion, Figure it Out 8 on p.29: 40% Grade 8, 60% girls, 160 students), q12 (left-handed 98%, p.30), q15 (10% of a day against 1% of a week, p.13); C8M-1.3 q2 (Eesha two tests, p.14), q4 and q20 (demand fell 85%, p.20); C8M-1.4 q14 (selling price of 3 pencils equals cost of 5, p.29), q20 (Raghu's rice, p.17); C8M-1.5 q2 (Giridhar and Raghava loans, p.24), q14 (Bank of Yahapur and Wahapur, pp.22-23); C8M-1.6 q7 (rectangle, p.29), q19 (mice +5, -2, -3, p.28), q3 and q9 (stock-clearance sale and Cakely, p.26).
   Not wrong, but a student who did the book exercise answers from memory. Change the structure (not only the numbers) of at least half.

## LOW

10. C8M-1.1 q18, C8M-1.3 q4, q20, C8M-1.6 q21: Bloom tags Analyse/Evaluate on a one-step recall of an expression or a reverse-percentage calculation. Retag Apply, or add the misconception layer.
11. C8M-1.2 q14 (AR): R reads "multiplying the number y by the quantity". Clearly false, but a careless reader may take it as "by y/100". Reword to "multiplying y by the quantity" in plain words, or "multiplying y by the quantity and nothing else".
12. C8M-1.3 q17 (mcq): the correct option "They are equal" is 14 characters against 35 to 41 for the others, a visible tell. Lengthen it ("They are equal, as both work out to 124.8") or shorten the others. In all other MCQs the options are of similar length.
13. C8M-1.3 q13 (figure mcq): "More teenagers than twenties can swim" is ambiguous (more in number vs a larger share). The graph gives percentages only. Add "the groups have different sizes" to the stem so the wrong option is clearly unsupported.
14. C8M-1.5 q1: distractor "p + (p x 0.07)^5" is not a real confusion from this chapter. Replace with p x (1 + 0.07)^5/5 style slip, or p x (1.07 x 5).
15. C8M-1.5 q16 (show_impossible, value never zero): the book only shows repeated multiplication, not the "never zero" limit. Mild extension; the argument given is correct. Keep, or ask for V x (0.75)^t and the value after 3 years instead.
16. C8M-1.4 q18 (case study), part (a): "Check the subtotal from the table" is plain arithmetic and is answerable from the stem alone without the chapter. Swap for a part that needs the GST idea (e.g. what percentage of the total is the GST as printed).
17. C8M-1.1 q15 (case study, concrete): the decision is a feasibility check, and the "stronger slab" is dropped; part (b) (3,000 kg) is not used in (c). Fine to keep; adding "he has a budget of Rs X for cement" would make the choice a trade-off. This is the only 3-part case study (marks 1+1+2).
18. C8M-1.1 q19 (Understand, 2 marks): part (b) "which form is a whole number" is a one-line read of (a). Add a reason ("why does per mille suit rare events").
19. fill_blank answers with decimals (22.5, 129.5, 37.5, 1.8, 3200) are matchable, but check the matcher accepts "22.50", "3,200" and "22 1/2"; the stems do not say how to write them beyond "in digits".
20. C8M-1.2 q1 distractor 113 and C8M-1.4 q10 distractor 125 are not tied to a named slip; fine but weak.

## Counts read (no sampling)

- 130 questions: 22, 21, 22, 22, 21, 22. Types: 25 mcq, 6 multi_statement, 6 assertion_reason, 4 match, 8 fill_blank, 20-ish long_answer (case studies 14 tagged), 8 claim_check, 8 true_false, others short_answer.
- claim_check verdict mix (8): No 4 (C8M-1.2 q4, C8M-1.3 q14, C8M-1.4 q4, C8M-1.6 q4), Yes 2 (C8M-1.3 q2, C8M-1.5 q9), partly right 2 (C8M-1.1 q5, C8M-1.6 q19). Good mix (50/25/25). 
- true_false verdicts (8): True 4, False 4. Good.
- assertion_reason outcomes (6): both true and explains 2, both true not explaining 2, A true R false 1, A false R true 1. Good.
- multi_statement keys (6): "1 and 3 only", "2 only", "1, 2 and 3", "2 and 3 only", "1 only", "1 and 2 only". All six different; false statements move across 1, 2 and 3.
- Correct MCQ option longest: 0 of 25. Correct option strictly shorter than the rest by 6 or more characters: 1 of 25 (C8M-1.3 q17).
- Slot order: differs concept to concept (checked printed slot strings). Compositions are similar by design, but no concept repeats another's order.
- Key position: the key is o[0] in all 25 MCQs and in all 6+6+4 other option items (expected, the loader shuffles).
- "percentage points" in stems: 6 items, undefined (item 1).
- Scope: no violation of scope_out. No "Simple/Compound Interest" naming, no sub-annual compounding, no GST slabs, no solving for t, no formal costing framework beyond gross/net. Per mille and per decem are in scope_in and appear on book p.4.

## Per-concept verdicts

- C8M-1.1 Fractions, Decimals, Ratios and Percentages: pass after fixes (items 1, 6, 7, 8, 9).
- C8M-1.2 Percentage of a Quantity, and Percentages Greater Than 100: pass after fixes (items 7, 8, 9, 11, 12).
- C8M-1.3 Comparing Proportions and Percentage Increase/Decrease: pass after fixes (items 1, 2, 5, 8, 13).
- C8M-1.4 Profit, Loss, Discount and Tax: pass after fixes (items 5, 7 gross/net repetition, 8, 16).
- C8M-1.5 Interest, Compounding and Depreciation: pass after fixes (items 3, 4, 7, 8, 14).
- C8M-1.6 Successive Percentage Changes: pass after fixes (items 3, 5, 7, 8, 9).

## Overall

Numerically sound (0 HIGH). Not templated at slot level, and the claim, true/false, assertion and statement mixes are well spread. Weaknesses are: an undefined term the book never uses (item 1), one second-reading true/false (item 2), mechanical threshold decisions in case studies (items 3, 4, 5, 6), repeated ideas (item 7), and a layer of single-step and book-clone items (items 8, 9). Verdict: pass after fixes.
