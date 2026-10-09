# Review v3 (independent): class9 ch02, Introduction to Linear Polynomials (iemh102)

File reviewed: `content/authoring/dps/class9/ch02.json` (not edited). Latest earlier review: `v2-class9-ch02.md`.
Scope from `content/authoring/class9/ch02.json`; source `content/extracted/iemh102/pages/`.

Questions read: 134 (2.1: 23, 2.2: 23, 2.3: 22, 2.4: 22, 2.5: 22, 2.6: 22). Every numeric key, all 6 assertion_reason, 6 multi_statement and 3 match keys recomputed (by hand and in code) before reading the stored answer. No wrong keys. No duplicate options, no positional option references.

Verdict: PASS (0 HIGH, 2 MEDIUM, 5 LOW).

## v2 items, status
- 2.3 #20 tea-party tables: FIXED. Stem now says exactly two rows; code gives minimum n1 + n2 = 28 (rows capped at 20), so 28 tables is the unique minimum.
- 2.1 #21 vegetable bed: FIXED. Part (d) now limited to the three lengths in (c); x = 10 fails the side test, x = 14 fails area, only x = 12 passes. (x = 11 and 9 would pass too but are outside the asked set.)
- 2.1 #20 and 2.2 #20 now have a crossover inside the asked range (n = 20; n = 30), so the decisions are real trade-offs.
- Claim-check mix: now No (2.1, 2.2, 2.5), Yes (2.4 #13, 2.6 #14), partly (2.3 #13). Acceptable.
- Repetition in v2: h(t) = 3 - 0.5t reduced to the MS item and 2.4 #14; Celsius pair, wire rectangle, 3z^2 - z^3 + 8 and the 2.6 line pair are no longer duplicated.

## HIGH
None.

## MEDIUM
1. Some items tagged Hard are still one-step (easy in disguise): 2.1 #2 (which is linear with negative constant), 2.1 #3, 2.2 #1 (form the equation), 2.3 #0 and #4 (nth term / solve 3n+1 = 100), 2.6 #2 (line through origin and (3,12)), 2.6 #4 (k = 6), and 2.2 #6 (R is just the worked steps of A, so "R explains A" is trivial). Not wrong; they pull the real difficulty down. Add a second step or a misconception distractor, or retag Medium.
2. 2.6 #16 (reverse problem, tank 800 L losing 20 L per minute) repeats the exact setting of 2.6 #20 Tank 1 (y = 800 - 20x). Change one of them.

## LOW
- 2.4 #20 (d): Zoya starts at 1400 and only falls, so "she can never buy the cycle" is immediate; the real work is Kabir only.
- 2.2 #7 statement 2 and 2.2 #9 evaluate a quadratic and a cubic polynomial; the chapter is about linear polynomials (scope_out: quadratic and cubic beyond naming degree). Tolerable since the book itself evaluates a quadratic; keep the cubic to naming/degree if tightening.
- 2.6 #17 (rewrite 3y = 6x + 5 in y = ax + b) is algebra rearrangement with fractional intercepts; borderline for the chapter but within "read slope and intercept".
- 2.3 #19 plan 2 is plainly better once plan 1 fails; fine as a check, weakly a decision.
- 2.6 #1 "largest fall per unit of x" is sound; the book states steepness only for positive a (p.16), so keep wording on size of fall.

## Passed
Two-variable expressions in 2.1 (#0, #4, #9, #18) are acceptable: the book introduces two-variable expressions in Examples 1-2 (p.3 of the chapter pages) before restricting to one variable, and no degree is asked of them. Slope, y-intercept, parallel lines, decay and Fahrenheit-Celsius all appear in the source pages. No fact beyond this book. Assertion-reason covers all four outcomes across the chapter; multi_statement keys vary.
