# v3 verification: class9sc/ch04.json (Class 9 Science, iesc104)

Scope: targeted check of the v2 fixes plus a structural pass. File not edited. `load-dps-pack.ts --check`: 7 concepts, 147 questions, valid. git diff shows only the intended items changed (4.1 CS (iv) + option, 4.2 Route CS, 4.3 item, 4.4 CS (d) wording, 4.4 SA "10 s after that", 4.6 AR). Nothing else moved.

Counts: HIGH 0, MEDIUM 0, LOW 3. Verdict: PASS.

## Recomputed in code
- 4.2 Route CS: A = 600+1600+700+300 = 3200 m; B = 1000+1600+900+300 = 3800 m; extra 600 m = Rs 1.50; displacement A = 0. Ice cream travels 2200 m on A (600+1600), 1000 m on B. All match key and step marks. Trade-off is now real (1200 m less melting time vs Rs 1.50); "either if justified" is defensible and the step mark rewards the named trade-off.
- 4.3 new SA: 18/12 = 1.5 h, 6/6 = 1 h, 24/2.5 = 9.6 km/h; friend's 9 km/h wrong. Correct.
- 4.6 AR: s = 400/5 = 80 m, t = 20/2.5 = 8 s. A true, R true, R does not give 80 m (it is a separate result). One defensible key. The old 112.5 m duplicate with SA idx 14 is gone (idx 14 keeps 30 m/s, -4).
- 4.4 SA: a = -0.4 m/s^2; 10 + (-0.4)(10) = 6 m/s; new wording "10 s after that (35 s after it began slowing)" is unambiguous.
- 4.1 CS (iv): "rest from 20 s to 25 s?" answer No (-20 m to 0 m); option text matches. 4.4 CS (d) "release point" wording is consistent with the stem.
- Keys: all 56 mcq/match/AR/multi_statement keys equal option text (key starts with o[0]).

## LOW
1. C9SC-4.3 idx 15 vs idx 18 ("Priya's 5.33 m/s is wrong because the stages last unequal times"): same misconception (mean of speeds is not average speed). Repeated idea inside one concept. Fix: change idx 15 to a different angle (for example find the unknown speed for a target average), or accept as a deliberate reinforcement.
2. C9SC-4.2 idx 19 (d): Rs 1.50 against a melting parcel makes Route B the obvious pick; the "what do you give up" is thin. Fix (optional): raise the extra cost (for example Rs 25 per km) or add a second parcel on D1 that is time-critical.
3. Template counts: slot order is identical in 4.2 to 4.7 (6 mcq, multi, AR, fill, match, 8 SA, 4 LA); 4.1 differs only in lacking match. mcq correct-option-is-longest in 16 of 36 (44%, a little above chance of 25%). multi_statement key spread: "2 and 3", "1 and 3", "1", "1,2 and 3", "2", "1 and 2", "3": varied. Consider reordering one or two concepts; not blocking.

## Verdict per concept
4.1 pass; 4.2 pass; 4.3 pass (LOW 1); 4.4 pass; 4.5 pass; 4.6 pass; 4.7 pass.
