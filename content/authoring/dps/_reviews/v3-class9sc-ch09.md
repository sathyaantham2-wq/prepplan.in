# Review v3: class9sc ch09 (targeted verification + structural pass)

Counts: HIGH 0, MEDIUM 0, LOW 1. Verdict: PASS.

Loader check: `load-dps-pack.ts --check` -> 6 concepts, 125 questions, valid.
Structure: 21/21/21/21/21/20 questions per concept; no duplicate options in any mcq/match/AR/multi_statement; correct answer is o[0] (loader convention, so "key text equals an option" holds by construction); every step-mark list sums to the item mark for the edited items.
Diff scope: 20 line changes, all in the items listed by the fixer, plus a trailing newline at end of file. Nothing else changed.

Recomputed edited items
- 9.3 idx 15 (H double bond): fixed correctly. One electron means one shared pair; double bond = 4 electrons around H, capacity 2. Steps and model answer agree.
- 9.3 idx 14 (claim_check): verdict now "not right", with the systematic-name point as reason and common-name point as the refutation. Steps (3 x 1) match the answer.
- 9.3 idx 16 (SF6): "why" part removed; now formula, 7 atoms, 6 fluorine. Steps match.
- 9.3 idx 19: H2S now "dihydrogen monosulfide" (prefix on every element); the count of three differing cards (CS2, H2S, PCl3) still correct.
- 9.5 idx 6 (AR, Al2(SO4)3): R rewritten (polyatomic ion needs a bracket when more than one unit). Now both true and R explains A; one defensible answer. o[0] updated to "R is the correct explanation", options reordered, no duplicates.
- 9.1 idx 5 (multi_statement): S3 now "precipitate in a closed flask, mass unchanged" (true). S1 true, S2 false, S3 true -> "1 and 3 only" is still correct and unique.
- 9.1 idx 19: set-up 1 reworded (open flask, gas escapes); numbers unchanged (178.46 - 177.58 = 0.88 g).
- 9.2 idx 14: neutral metal M; ratio 36:8 = 9:2, answer "Yes" correct.
- 9.2 idx 19: (c) now states 5.0 g H goes with 40 g O (45 g sample) vs 36 g weighed; 36/9 = 4 g H vs 5.0 g found. Consistent.

## LOW
1. 9.2 idx 19 (c): the stem now hands over the 40 g / 45 g inference that the student was meant to derive, which lowers the item slightly. Still sound and one defensible answer; optional to trim.

Unaddressed v2 items (not blocking, as v2 rated them polish): repeated ideas within concepts, partly strawman case studies, Hard labels on easy items.
