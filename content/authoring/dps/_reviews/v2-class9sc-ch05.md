# Independent review v2: class9sc ch05 (Exploring Mixtures and their Separation, iesc105)

First independent review (no earlier class9sc-ch05 review file existed). Read 126 questions across 6 concepts (21 each): 27 mcq, 3 match, 6 multi_statement, 6 assertion_reason, 6 fill_blank, 48 short_answer, 30 long_answer. Every numeric key, every multi_statement and every assertion_reason key was recomputed or re-derived against the book text (pages 001-022 of iesc105) and Tables 5.4/5.5 before the stored key was read. Mark schemes sum to `m` in every item (checked in code). No duplicate options. All 27 mcq keys equal one option verbatim.

Result: 0 wrong keys by content. All arithmetic is correct (concentrations, saturation/crystal masses, boiling-point differences, density masses, percent yields). The only blocking issue is a structural one on the 3 match items.

## HIGH (3)

1. C9SC-5.2 q4 (match), C9SC-5.4 q4 (match), C9SC-5.6 q4 (match): the stored key `a` is an explanatory sentence ("Glucose gives 4% m/v, the perfume gives 15% v/v ...") and equals none of the four options, which are the strings like `1-b, 2-a, 3-c, 4-d`. The loader matches by text, so these will not resolve to a correct option. Content of the intended answer is right in all three (5.2: 1-b, 2-a, 3-c, 4-d; 5.4: 1-c, 2-b, 3-a, 4-d; 5.6: 1-b, 2-a, 3-c, 4-d). Fix: set `a` to exactly the matching option string and move the explanation elsewhere. The same prose-in-key pattern appears in match items of ch01-ch04, so check those too.

## MEDIUM (5)

1. C9SC-5.6 q17 part (iii): says bottle 3 (a colloid) would not be helped by a coagulant because it "stays dispersed on its own". The chapter itself says milk (a colloid) is coagulated by acid to make paneer and that blood coagulates, so a coagulant can act on a colloid. A second defensible answer exists; the key is only safe if the stem says "muddy-water style suspended impurities". Reword the question (e.g. "which bottle's solid will settle and be removed by alum without any further change") or drop the claim about bottle 3.
2. C9SC-5.4 q0 (and q7 fill_blank, q15 style): a 24 degrees C difference against the book's "at least about 25 degrees C" is a knife-edge. The book says "about", so option 2 ("24 is close enough to 25") is arguable. Use a clear case (e.g. 22 or 17) or avoid a difference within 3 degrees of the cutoff. q7 reuses the same acetone/benzene pair purely as subtraction (trivial).
3. Strawman or pre-decided "choose one" parts (d) in case studies: 5.3 q20(d) (stem already tells her 10 degrees C gives more crystals), 5.4 q20(d) ("consistent with" is the obviously safer wording), 5.6 q19(d) and q20(d) (the trade-off is stated in the stem). These test nothing beyond restating the stem. Make the decision depend on a computed or observed quantity.
4. Repeated ideas inside concepts: 5.1 reuses the sugar/sand/chalk/oil tumbler set-up in q0, q3, q18 and q19, and the brass/bronze 80:20 mass split in q7, q16, q20; hydrogen-oxygen homogeneity appears in q2, q6, q9 and q20(c). 5.5 q8, q11 and q16 are three variants of oil/water density. Replace some with different sub-ideas (e.g. soda and gas solubility, alloy properties, emulsions in 5.1).
5. Easy-in-disguise items tagged Hard: 5.1 q12, q13; 5.3 q10, q13; 5.4 q9, q12, q13; 5.5 q8, q12; 5.6 q8, q10, q11, q13. These are direct recall or one-step restatement of a book sentence. The whole file is Hard/Hardest (102 Hard, 24 Hardest, no Easy/Medium), so the label inflates difficulty. Either retag as Medium or add a twist.

## LOW (8)

1. All 27 mcq (and 3 match) keys sit at option index 0 in the stored order. Fine if the loader shuffles; confirm it does, otherwise answer position is guessable.
2. multi_statement items use 3 statements throughout this chapter; the bank convention elsewhere varies. Not an error here. Keys are correct (5.1: "1 only"; 5.2: "2 and 3 only"; 5.3: "1 and 3 only"; 5.4: all three true; 5.5: "2 only"; 5.6: "1 and 2 only").
3. 5.1 q10: iron filings with sulfur powder is not in the chapter (book uses iron nails and sawdust with a magnet). Content is correct but beyond this book; swap to iron nails and sawdust.
4. 5.5 q6 (AR): "R is not the explanation of A" is correct (density decides which layer is on top, immiscibility only gives layers), but a student could argue R explains why layers form. Add "upper layer" emphasis or accept; low risk.
5. 5.4 q20 and 5.5 q19: forensic ink matching and "76% vs 77% camphor" are applications beyond the chapter's text but need no new facts; acceptable.
6. 5.3 q19 gives only four table values in the stem and 5.3 q20 states "assume each salt dissolves independently", an extrapolation not in the book; acceptable because stated.
7. 5.2 q20(c): "what is likely at that strength" is answered by the book's generic "too little may not protect crops"; fine but the stem repeats the book sentence, giving the answer away.
8. 5.6 q20: the alum dose (2 g per 10 L) is invented; fine as given data, but the stem text could say it is the notebook's value, not the chapter's.

## Checks that passed

- Scope: every item stays within chapter 5 (mixtures, concentration, solubility with Table 5.4, distillation/fractional distillation with Table 5.5, chromatography, separating funnel, sublimation, centrifugation, coagulation, colloids, Tyndall effect). No positional option references ("all of the above", "option b") found.
- Key recomputations: 5.1 brass 30 g, bronze 200/50 g, brass 400/100 g; 5.2 4.5 g, 15%, concentrations 20/10/10%, 12.5 mL, saline 18 g, glucose 25 g, 0.8%, fill_blank 220 g; 5.3 148 g, 42 g (ammonium chloride unique), 9 g undissolved, 105 g, 155/15 g, 202.5 g, 501/405/315/438 g, 83.5/18.5/14/19.5 g; 5.4 differences 22/17/44/2/24; 5.5 2275 g, 2730/3000 g, 910 g/L, 23%, 0.5 g missing, 80%/95%; 5.6 40 g alum, size ranges (0.4, 300, 5000 nm; 0.6, 80, 1500 nm).
- Book facts verified in text: gas solubility generally decreases with temperature; pencil line 2 cm and thin water layer below spot; centrifuge tubes horizontal; alcohol or solvent mixture for spinach; 1 nm and 1000 nm limits; milk and vanishing cream oil-in-water, butter water-in-oil; brass 80/20 copper-zinc, bronze 80/20 copper-tin; 0.9% m/v saline; pesticide sentence.

## Verdict

Not a pass yet but close: content is sound (0 wrong keys, arithmetic clean); fix the 3 match keys (mechanical) and the 5.6 q17 coagulant ambiguity and 5.4 q0 knife-edge, and it passes. The remaining MEDIUM items are quality/variety, not correctness.
