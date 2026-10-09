# Independent review: class9sc/ch07.json (Class 9 Science, Work, Energy, and Simple Machines, iesc107)

First independent review (no earlier class9sc ch07 review file existed). File not edited.
Read: 128 questions (6 concepts: 20, 21, 21, 22, 22, 22). Every numeric key, MS, AR, match and fill_blank was recomputed (by hand and spot-checked in code) before reading the stated key. All 29 mcq and 4 match items checked for key text against the options: the key is options[0] and the answer text starts with it in every case (the loader treats options[0] as correct and shuffles, so no key/option text mismatch). `load-dps-pack.ts --check` reports the pack valid. Scope checked against content/authoring/class9sc/ch07.json (scope_in / scope_out) and the extracted iesc107 pages.

Counts: HIGH 0, MEDIUM 2, LOW 7.

Verdict: PASS. No wrong keys found; all numbers verified; no out-of-scope items; no positional option references.

## HIGH
None.

## MEDIUM
1. C9SC-7.5 assertion_reason #8 (running up stairs in 1 min vs walking in 5 min; R: the same work is done in both cases). Key says "both true, R not the explanation". A reasonable examiner can argue R is the explanation (power is greater because the same work is done in less time; R supplies the "same work" half of that). Second defensible answer. Fix: change R to something plainly unrelated but true (for example "Power is measured in watts"), or make A depend on a different quantity.
2. C9SC-7.4 short_answer #10 (150 g ball lobbed to 12 m above the ground; part (b) asks the KE "just before it returns to the height from which it was thrown"). The throw height is never given, so 18 J holds only if the ball was thrown from the ground. Underspecified. Fix: say it is thrown from the ground, or ask for the KE just before it lands.

## LOW
1. Repeated idea, C9SC-7.5 #15 and #22: the scooter with a pillion passenger reaching the same speed in the same time (25% more energy). #22 is also Exercise 8 of the book almost verbatim. Replace one.
2. Repeated idea, C9SC-7.3 #17 and #18: the jet stopped by an arrester wire (80 m, 60 m/s), one solving for distance and the other for speed with the same figures. Stopping-distance is also used in #4, #19, #21 of this concept; vary one.
3. Repeated idea, C9SC-7.5 #6 and #18: the crane lifting to the 10th then the 20th floor in t and 2t (same power).
4. C9SC-7.6 #3 is Example 7.13 (seesaw A, B, D, E) with new masses, and #2 and #9(4) both give a 1.67 ramp; C9SC-7.4 #4 and #19 are close to book Exercise 12 and Example 7.9. Not scope errors, but near copies of the book.
5. Easy in disguise: C9SC-7.1 #1 (W = F x s, one step), C9SC-7.3 #1 (speed x3 gives 9x), C9SC-7.6 #1 (one ratio), and C9SC-7.2 #1 (stop a ball, 45 J in and out). Labelled Hard but are single-step.
6. C9SC-7.4 #12 gives "100 J mechanical energy" without stating g = 10, so the question cannot be checked from its own text.
7. Mildly strawman options: C9SC-7.1 #19(d) (equal work, so equal pay is the only reading) and C9SC-7.4 #21(d) (Plan 2 doubles the flow, which cannot change the speed). The case studies still carry real computation; keep, or sharpen the decision.

## Checked and fine (no action)
- All multi_statement keys (7.1 #7 = Statement 2 only; 7.2 #7 = 1 and 3; 7.3 #6 = all three; 7.4 #7 = 2 and 3; 7.5 #7 = 1 only; 7.6 #7 = 1 and 2) are correct.
- All assertion_reason keys other than 7.5 #8 are correct (7.1 #8 A true R false; 7.2 #8 A false R true; 7.3 #7 both true, not explanation; 7.4 #8 both true, explanation; 7.6 #8 A true R false).
- All four match keys (7.2 #9, 7.3 #8, 7.4 #9, 7.6 #9) are correct.
- Case studies (7.1 #19-20, 7.2 #20-21, 7.3 #20-21, 7.4 #21-22, 7.5 #21-22, 7.6 #21-22) recomputed: all arithmetic and the decisions (Rs 7000 vs 7500, Rs 1200 vs 1400, 62500 N, 14.1 m/s, 1.1 m release) are right.
- Scope: nothing uses W = Fs cos(theta), efficiency, U = -GMm/r, a spring formula or horsepower. The satellite statement in 7.4 #7 is used only as the false statement the chapter itself supports.
