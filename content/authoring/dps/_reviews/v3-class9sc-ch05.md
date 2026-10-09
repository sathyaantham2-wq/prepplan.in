# v3 targeted verification: class9sc ch05 (iesc105)

Verdict: PASS. 0 HIGH, 0 MEDIUM, 2 LOW.

## Programmatic checks
- Loader: `load-dps-pack.ts --check` -> 6 concepts, 126 questions, valid.
- Key-option scan over all mcq (27), match (3), assertion_reason (6), multi_statement (6): 0 keys missing from options, 0 duplicate options.
- Diff vs HEAD at item level: exactly 11 items changed (5.1 q10; 5.2 q4; 5.3 q20; 5.4 q0, q4, q7, q20; 5.6 q4, q17, q19, q20). Nothing else changed; counts per concept still 21, type mix unchanged. (The file-level git diff is large because of whitespace/line-ending reformatting only; item content outside the 11 is identical.)

## Recomputed changed items
- 5.2 q4 match: 6/150=4% (b), 9/60=15% (a), 10/90=11.1% (c), 3.6/400=0.9% (d). Key `1-b, 2-a, 3-c, 4-d` equals option 0 verbatim. Unique.
- 5.4 q4 match: acetone/water -> distillation (c), alcohol/benzene -> fractional (b), leaf pigments -> chromatography (a), salt -> crystallization (d). Key equals option 0. Unique.
- 5.6 q4 match: lemon+milk coagulation (b), centrifugation (a), Tyndall (c), soap emulsion (d). Key equals option 0. Unique.
- 5.4 q0 mcq: 78 vs 80 = 2 C difference, fractional distillation; knife-edge fixed. Single defensible answer.
- 5.4 q7 fill_blank: 56+22=78 correct.
- 5.3 q20: 50 g water holds 83.5 g KNO3 / 18.5 g NaCl at 80 C; at 20 C holds 16 g so 14 g separates; at 10 C holds 10.5 g so 19.5 g separates; NaCl 18 g capacity at 10 C so 2 g stays dissolved. Part (d) now needs the calculation (14 < 17 < 19.5). Correct.
- 5.4 q20: three spots match pen X, Z has an extra spot, X only consistent. Sound.
- 5.6 q17 (iii) reworded to "settle and be removed after alum with no other change"; bottle 2 is the single defensible answer. 5.6 q19 (D = 800 nm colloid) and q20 (40 g, 150 L) correct.
- 5.1 q10 now uses iron nails and sawdust (in the chapter). Correct.

## LOW
1. 5.4 q0 distractor 3 says "acetone and benzene are solids" but the stem is about alcohol and benzene; harmless (still plainly wrong) but name the right pair.
2. 5.6 q17 (iii) answer text for bottle 3 ("not the case that alum alone removes its solid") still leans on a colloid being coagulable in principle (milk to paneer); the stem's "no other change" and "nothing settles in a day" keep bottle 2 the only defensible pick. Optional wording polish.

Carried over unchanged from v2, not blocking: Hard/Hardest tag inflation on recall items, repeated tumbler/brass ideas in 5.1, all mcq/match keys at option index 0 (confirm loader shuffles).
