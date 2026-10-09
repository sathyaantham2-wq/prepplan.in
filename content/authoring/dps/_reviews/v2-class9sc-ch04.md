# Independent review: class9sc/ch04.json (Class 9 Science, Describing Motion Around Us, iesc104)

First independent review (no earlier class9sc ch04 review file existed). File not edited.
Read: 147 questions (7 concepts x 21). Every numeric key, MS, AR, match and fill_blank was recomputed in code/by hand before reading the stated key. Collision-gap result (4.6 CS) confirmed by a time-step simulation.

Counts: HIGH 1, MEDIUM 3, LOW 8.

## HIGH
1. C9SC-4.2 index 19 (case study, Route A vs Route B): the key's trade-off is false. The ice cream for D2 is reached after 1000 m in BOTH routes (Route A: W to D1 600 + D1 to D2 400; Route B: W to D2 1000). So "Route B delivers the ice cream first / in A the ice cream travels longer" is wrong by distance; Route A is cheaper by Rs 1.50 with no distance penalty on the ice cream. The part (d) premise is a strawman and the model answer contradicts the data (a stop at D1 is not stated). Fix: make Route B visit D2 first without passing through D1 (for example D1 placed behind D3), or drop the ice-cream premise.

## MEDIUM
1. C9SC-4.6 AR index 6 and SA index 14 are the same item (30 m/s, -4 m/s^2, 112.5 m); repeated idea in one concept. Change the numbers in one.
2. C9SC-4.6 AR index 6: R (valid only for constant acceleration) is a precondition for A. Key is "true, not the explanation", but a reasonable examiner can read R as the justification for using the equations; mild second-defensible-answer risk. Prefer an R that is clearly irrelevant or clearly the reason.
3. C9SC-4.3 SA index 15 (two cyclists closing 21 km/h, meeting time): relative/closing speed is not in this chapter; goes beyond the book. Also 4.6 index 17 and 19 compute reaction-time distance and following gaps; the book only mentions reaction time in the "Bridging Science and Society" aside (p.65, scope_out lists V2V), so these are an extension, not taught content.

## LOW
- 4.1 LA index 17 (iv): "at rest at that instant? Not necessarily" is ambiguous; rest is defined over an interval, so an instant reading cannot decide it. Reword (for example "is she at rest from 20 s to 25 s").
- 4.1 CS index 20 (d): pillar vs second train is nearly a strawman (the answer is obviously the pillar).
- 4.2 SA index 16 (iii) and LA index 18 (iii): "distance decides tiredness/time/fuel" repeats the same distance-for-effort idea across 4.2 (also MCQ index 1); effort is not a book fact.
- 4.4 CS index 19 (d): "heights above the ground become negative" with downward positive is confusing; heights above the release point are the negative ones.
- 4.4 SA index 16 (iii): "10 s later" is ambiguous (after the 25 s, or from the start).
- Easy-in-disguise items tagged Hard: 4.4 MCQ index 3 (constant velocity gives zero), 4.2 SA index 12 (distance vs displacement wording), 4.1 AR index 7, 4.5 AR index 6, 4.5 MCQ index 1, 4.7 match index 8.
- Multi-statement items use 3 statements throughout (same in ch03/ch05 of this subject), so it is consistent within SCI9; noted only because the Maths house style is 2.
- Case studies in 4.5 index 20 and 4.7 index 20 ask for a decision on a single obviously-better option; trade-off is thin but not wrong.

## Verified clean (recomputed)
All MCQ keys, all 7 multi_statement keys (4.1 "2 and 3 only"; 4.2 "1 and 3 only"; 4.3 "1 only"; 4.4 "1,2 and 3"; 4.5 "2 only"; 4.6 "1 and 2 only"; 4.7 "3 only"), all 7 assertion_reason keys, all 6 match keys, fill_blank values (12, 95, 20, -2, 36, 24, 4), and every long-answer figure (including the 30 m minimum gap in 4.6, 28.2 m / 33.1 m well depths, 45 and 36 km/h in 4.3, 12 s in 4.5 lift, 40.125 m in 4.6). No positional option references in any answer text. No wrong keys found. Scope otherwise stays inside scope_in (no instantaneous velocity, no scalar/vector definitions, no variable acceleration, no extra kinematic equations).

## Verdict
Needs one fix (not a pass): one HIGH (wrong model-answer rationale in 4.2 case study). With that corrected, the chapter would pass; remaining items are MEDIUM/LOW.
