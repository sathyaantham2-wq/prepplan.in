# v3 re-review: class8/ch06.json (MATH8, Ganita Prakash Gr 8 Part I ch6, hegp106)

Method: diffed against the pre-edit copy (42 items changed: 1.0 1.8 1.9 1.10 1.12 1.14 1.16 1.17 1.18; 2.10 2.21;
3.4 3.5 3.11 3.12 3.16 3.17; 4.0 4.2 4.5 4.9 4.10 4.14 4.20; 5.2 5.3 5.4 5.5 5.6 5.9 5.12 5.13 5.15 5.16 5.17;
6.0 6.5 6.8 6.10 6.16 6.18 6.21). Every changed key, every case-study part, every option set and every step-mark
sum was recomputed by hand and in python; facts checked against pages 020 and 032 and scope_in/scope_out.
Index `n.k` = concept 6.n, 0-based question index.

Programmatic checks on all 129: option items have key at o[0] and no duplicate options; step marks sum to marks
everywhere; no positional option wording; all 10 fill_blank answers are plain numbers; no a^3+b^3.

## v2 status

- M1 (cap-knocks-out-option case studies): mostly fixed. 1.16 is now a real trade-off (takings up Rs 90 but
  profit Rs 0, versus profit +Rs 130); 5.6, 5.15, 6.21, 2.21, 3.4 recast (check a clerk, check a label, test a
  helper's rule). 4.5 still has the cap shape (Plan 1 over Rs 39,000), see M1 below. FIXED except 4.5.
- M2 (repeats): 1.8, 1.18, 4.14, 4.20, 5.9, 5.13, 5.16 recast; 3.4/3.11/3.12/3.17 now cover 101, 1001, 10001
  as well as 99. Concept 6.5 still holds about six 1C-numeric items (5.0, 5.2, 5.5, 5.9, 5.13, 5.17). Improved,
  not eliminated (LOW L1).
- M3 (easy in disguise): 1.14, 2.10, 3.16, 6.10, 5.13 rewritten. 1.14 and 5.13 are now genuine misconception items;
  3.16 asks why a place sum of 10 carries; 2.10 is still near-direct (L2). Method-named scenario MCQs remain for
  1.9, 5.5 (L3).
- M4: 4.2 stem no longer states the overlap; fixed.
- M5: 5.3(d) now rests on a supplied factor pair, no parity argument; 5.16 restricted to the two claims tested.
  Fixed. (Book p.32 itself states "odd squares are 1 more than multiples of 8", so 6.12 S2 is in scope.)
- LOW items: 4.5 wording, 5.12(a), 3.5 grouping, 6.5, 6.8, 6.18, 6.16 all fixed. 4.9 R changed but still
  unrelated (L4). Difficulty spread unchanged: 106 Hard, 23 Hardest (L5).

## HIGH

None. All 42 changed keys verified (examples: 36x21-34x18 = 144; 1.9 2268 vs 2244, by 24; 1.16 takings +70/+90,
profit +130/0; 2.21 trays 104, 135, 170 equal to direct 8x13, 9x15, 10x17; 3.4 3,146, total 76,594, undercharge
1,100; 3.16 161051; 4.5 784/768, Rs 39,200/38,400; 5.3 16,14; 71,21; 5.6 15617, Rs 2,34,255; 5.15 200/600/150/
325/444; 6.8 483, Step 8 = 99; 6.21 24 tiles, size 12). No wrong option equals the key; each item has one
defensible answer.

## MEDIUM

**M1. 4.5 is still the cap-threshold decision.** "At most Rs 39,000 on the extra area" knocks out Plan 1 (Rs 39,200)
by a Rs 200 margin; the chapter only supplies the two areas. Smallest fix: make both plans feasible and ask for
the cheaper cost per sq m of extra area, or ask which plan the school should choose given that Plan 2 costs
less but gives less ground, with the student stating the trade-off.

**M2. 3.4 stem and key disagree on what the clerk did.** Stem: "writing the neighbouring-digit sums of 286 one
after another" would give 2, 10, 14, 6 -> 210146, not the billed 2,046; the key says he "kept only the last digit
of each sum". Fix the stem: "He wrote only the units digit of each neighbouring-digit sum (2, 0, 4, 6) and
ignored the carries."

## LOW

- L1. 5: midpoint 1C numeric idea still in about six items (5.0, 5.2, 5.5, 5.9, 5.13, 5.17); turn 5.17 into a
  decimal or algebraic term case if a slot is wanted.
- L2. 2.10: R is the definition of like terms and A its direct application; both true, R explains, one-step.
  Make A about a different simplification (for example whether a x term survives) or give R a plausible slip.
- L3. 1.9 ("Writing 36x63 as (34+2)(66-3)") and 5.5 still hand over the method; 4.0, 3.5, 3.11, 5.2 are single
  computations. Acceptable, but 1.9 should drop the bracketed hint.
- L4. 4.9: R (99x101 = 9999) is true but unrelated; "R does not explain A" is by irrelevance. Use a tempting
  R such as "99^2 = (100-1)^2 = 100^2 - 1^2 = 9999", which makes A (9801) false-looking; then key becomes
  "A true, R false", changing the verdict mix (currently exactly one of each).
- L5. All items are Hard or Hardest; 1-mark single-step items (4.0, 5.17, 6.0) are not Hard. Retag honestly.
- L6. 3.19(a) reads "Find the number of flats in one step"; "in all" is meant.
- L7. 6.21(d) justifies impossibility by "50 is not a multiple of 4"; safer to say 4(y+1) = 50 gives y+1 = 12.5,
  not a whole number. 5.3(c) (every odd number is a difference of consecutive squares) is a mild extension but
  follows directly from Identity 1A.
- L8. 1.17(a) is a pure substitution into an expression given in the stem; 6.16(v) is short; both fine for marks.

## Option and key checks (changed items)

MCQ/AR/MS/match: key at o[0] in all; correct option longest in only 1.9-style ties, not a pattern; multi_statement
keys unchanged and spread; AR outcomes all four present; claim-check mix unchanged (No 3, Partly 2, Yes 1);
true_false 6 with reasons, 3 True / 3 False (1.8 True, 5.9 True, both with a misconception to avoid).
fill_blank: 5.4 = 64, 5.17 = 74, 6.18 = 45, all numbers.

## Per-concept verdicts

- C8M-6.1: keys correct; 1.16 now a strong decision. Load-ready.
- C8M-6.2: keys correct; 2.21 label check good; 2.10 L2. Load-ready.
- C8M-6.3: keys correct; 3.4 stem wording M2. Load-ready after M2 wording fix (one line).
- C8M-6.4: keys correct; 4.5 cap shape (M1). Load-ready.
- C8M-6.5: keys correct; scope clean; repeats L1. Load-ready.
- C8M-6.6: keys correct; 6.8, 6.21, 6.5, 6.18 repaired. Load-ready.

## Counts

Read: 129 (42 changed in full, 87 unchanged re-checked only where related). HIGH 0, MEDIUM 2, LOW 8.
Templated: no (case-study decisions now varied; residual only 4.5).

## Verdict: load-ready (no HIGH; M2 is a one-line stem fix, worth doing before load, M1 optional).
