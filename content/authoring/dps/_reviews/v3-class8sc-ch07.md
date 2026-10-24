# Review v3: class8sc ch07, Particulate Nature of Matter (hecu107), re-review after one fix pass

File read: content/authoring/dps/class8sc/ch07.json (123 questions: 7.1 21, 7.2 21, 7.3 20, 7.4 20, 7.5 20, 7.6 21). Compared with the pre-edit copy by question text: 67 items are new or rewritten text, 56 unchanged. Every changed item was re-decided before reading the key, numbers recomputed in python, facts checked against content/extracted/hecu107/pages/001-018.
Index form: [c.i] = concept c (0..5 = C8SC-7.1..7.6), 0-based question index in file order (same as v2).

## Machine checks (counts)
- Correct option is o[0] in all 43 option-bearing items; no wrong option equals the key; step marks sum to marks in all 123; no option named by position.
- Types: short_answer 45, long_answer 29, mcq 25, assertion_reason 8, multi_statement 6, fill_blank 6, match 4. Bloom: Analyse 71, Evaluate 23, Apply 19, Understand 6, Create 4. All Hard (98) or Hardest (25); no Easy.
- Option length (the v2 MEDIUM): correct option is strictly longest in 1 of 25 MCQs and shortest or tied shortest in 8 of 25 (32%, was 69%). Fixed.
- multi_statement keys: "2 only", "1 and 3 only", "1, 2 and 3", "1 only", "2 and 3 only", "1 and 2 only": all different. All six are three-statement (the DPS standard). AR outcomes: explains 3, true-not-explanation 2, A true R false 2, A false R true 2 (wait: 8 items, balanced).
- true_false 8: four False (0.8, 2.2, 3.11, 5.5), four True (1.12, 2.16, 4.9, 5.17).
- Case-study endings: "decide" frame now in 1.4, 1.16, 2.0, 2.14, 5.3 (five, was eleven); others end on predict (3.5, 4.15, 5.13), judge/test (3.19, 4.1), correct (0.16), conclude (1.13), write (0.2). Fixed.

## v2 status
- v2 HIGH, 7.3 case study (d) [2.0]: FIXED. Plan Y now pours L back into the unwashed K and then on into a clean jar N and reads N, so only Plan X keeps 247 mL; the decision is now forced and the reason correct (see LOW 7.3[2.0] for a physics caveat).
- 7.1[0.9](a) grinding "cannot decide": FIXED (now "what does grinding show about each speck, and which claim of Model A it does not settle by itself"; (d) the chapter supports Model B).
- 7.1[0.17] snapped chalk premise: FIXED, the stem now states rough faces touching at a few points.
- 7.1[0.20], [0.5] one-line items: only partly fixed (see MEDIUM 7.1[0.20] and LOW [0.5]).
- 7.2[1.1] ice AR: FIXED (urea). 7.2[1.0] distractor "ice attracts more weakly": FIXED (distractors now about distance and extra particles; key farther apart is the book's ice exception, p.103).
- 7.2[1.13] ending: FIXED in form (corrected record, hot-plate prediction), still ends on a conclusion not a decision (LOW).
- 7.3[2.18] "three differences": FIXED ([2.17] now two differences, [2.18] now two observations).
- 7.3[2.1] negated one-liner: FIXED (samples S, T, U).
- 7.4[3.12] true_false recall: FIXED (now [3.11] False with a real misconception). 7.4[3.4] "slightly weaker" hinge: FIXED in [3.4] but re-introduced in [3.14] (MEDIUM).
- 7.5[4.8] AR R: FIXED (particles shrink, plainly false).
- 7.5[4.1](d) unfair comparison: FIXED and now a real inference.
- 7.6[5.3] decision at (a): FIXED (decision now (d), uses trend and a stated 5-minute slot and 50 C cap).
- Repetition clusters: partly reduced, see MEDIUM entries; 7.5 and 7.6 judged acceptable except the near-duplicates named.

## HIGH (1)
1. C8SC-7.1 [0.7] mcq "Which of these would the chapter call a constituent particle of sugar?" Options 3 and 4 are the same sentence: "A tiny speck of sugar dust floating in sunlight" and "A tiny speck of sugar dust floating in the sunlight". The key is not affected, but two wrong options are identical in meaning, so the item has only three real options and a student who sees through one sees through both; a duplicate-option check would also reject it. Smallest fix: replace option 4 with a different real confusion, e.g. "A crystal of sugar that is too small to see without a microscope" (a still-breakable unit) or "One molecule of the water that dissolves it".

## MEDIUM (11)
1. C8SC-7.1 [0.1], [0.0], [0.11] (and [0.6] Line 1, [0.18](c)): "constituent particles are too small to see even with an ordinary microscope" is the answer of three whole items. [0.1] (specks look continuous: too small for the microscope) and [0.11] (AR: particles cannot be seen; chalk is soft) are near-duplicates of [0.0](b). Also "grains are not the smallest unit" is in [0.0], [0.3], [0.6], [0.7], [0.12], [0.14], [0.18], [0.19] (eight to nine items). Narrow concept, but [0.11] should go or be rebuilt on a different point (e.g. R about attraction depending on the nature of the substance).
2. C8SC-7.1 [0.20] mcq "Where have the sugar particles gone?" Answer is a one-line book fact (p.101, "occupy the available spaces between the water particles") labelled Apply|Hard. Recall in disguise. Fix: make it a prediction with a twist, e.g. the water level before and after, or merge into [0.14].
3. C8SC-7.4 [3.14] long_answer Priya's gas column: the second "wrong" entry is "Interparticle attraction is slightly weaker than in liquids". A gas does have weaker attraction than a liquid, so that entry is true and is "wrong" only through the word "slightly"; a student can defend leaving it alone, and the item says exactly two are wrong. This is the same hinge v2 flagged in [3.4]. Fix: change the entry to "Interparticle attraction is the same as in liquids" or "stronger than in liquids".
4. C8SC-7.4 [3.12] mcq iodine vapour "Why does iodine vapour serve the same purpose?" Answer is the book sentence (p.106) restated; Analyse label overstates. Fix: give a short trial result (iodine jar vs a jar of solid iodine) and ask what the violet colour spreading through the jar shows about the vapour's particles.
5. C8SC-7.4 [3.2] and [3.5]: both are the smoke / joined-jar activity with the same prediction (smoke fills the second jar, gas has no fixed volume). Keep one and turn the other onto an under-used point (iodine, fluids). Also [3.3] (rank steel, oil, vapour) is the p.112 summary row in disguise (labelled Analyse), and [3.15] fill_blank fluids count is a one-step classification. At most one of [3.3]/[3.15] should stay.
6. C8SC-7.5 near-duplicates: [4.3] (CNG cylinder, which property of gases) and [4.10](a) (steel cylinder holding many times its volume of gas) are the same question. [4.18] (40 mL, push to 25 mL, back to 40 mL, particles spread out again) is [4.15](b) and [4.7] again, plus one subtraction, tagged Apply|Hard. Syringe compress and spring back is still the idea of about ten items ([4.0], [4.3], [4.5], [4.6], [4.7], [4.8], [4.10], [4.15], [4.17](a), [4.18]). Fix: delete [4.18] and either [4.3] or [4.10]; the concept then has 18, so replace both on dissolved sugar or sand-versus-sugar data.
7. C8SC-7.3 boiling versus evaporation is the idea of seven items ([2.2], [2.5] S2, [2.8], [2.10], [2.13], [2.14], [2.19]), not reduced since v2. [2.8] (read 78 off the stem) and [2.19] (two boiling points against a 70 C bath) are the thinnest; [2.8] answer is a number sitting in the stem. Fix: delete [2.8] and replace on the liquid-versus-solid table or the finger test.
8. C8SC-7.3 finger test: [2.3], [2.4], [2.11](b), [2.17], [2.18] all rest on "a finger moves through water but not a solid" (five). [2.17] and [2.18] overlap heavily (both ask for the two observations: shape of container and the finger). Fix: keep [2.17], rewrite [2.18] on compressibility-free evidence such as the table row for liquids.
9. C8SC-7.6 near-duplicates: [5.1](a) (what do water particles do to the grain) and [5.4] (why do first streaks appear beside the grain) have the same key; [5.11] and [5.20] both contrast a soluble solid with sand. Potassium permanganate appears in nine items. [5.16] is still five one-mark recitation parts ((a), (b), (d) from the activities and the summary page) labelled Hardest. Fix: delete [5.4]; shorten [5.16] to three parts or tie (e) to a given observation.
10. C8SC-7.6 [5.18] mcq "best evidence that the particles of the air in a closed, still room are always moving": the key is smoke specks jiggling; distractor "The air takes up all the space inside the closed room" is also evidence of free movement (it is the book's own argument for gases), so "best" leaves a second reading open, and "jiggling on their own" misstates the book (the specks are hit by air particles). Fix: change the distractor to something plainly not about movement (e.g. "The room air has a definite colour") and drop "on their own".
11. C8SC-7.1 [0.5] fill_blank: strongest A, a little weaker B, weakest C, "the gas is ___" is the summary-table row and one step; fix: give distances and a drastic-fall rule, or three samples with melting points and ask the one with the weakest attraction.

## LOW
- 7.3 [2.0](d): physics caveat. The walls of K are already wet from the first pour, so a second pass through K may retain less than the first; the stem should say K is "still unwashed and its walls dry out between pours" or Plan Y should use a second unwashed container, otherwise a careful student can predict 247 mL for both. Also Plan Y is a deliberately bad plan, so the decision is one-sided; add a cost to Plan X (e.g. needs one more clean container that is not available) for a real trade-off.
- 7.3 [2.7] oil: oily walls hold water poorly and rinsed-off oil would add volume, so "a little more" is not absurd; say "walls left unwashed and wet" (the book's "container not clean").
- 7.3 [2.14] decision is forced: the low flame has no stated cost (v2 asked for a trade-off). Add that A cooks the dal in 15 minutes while B needs 30 for the same result.
- 7.3 [2.16], 7.4 none, 7.5 [4.9], 7.6 [5.17]: true_false with verdict True and no misconception (three of the four True items). Rewrite one as False with a real slip (e.g. [4.9] "sand's level falls after stirring, like sugar's").
- 7.4 [3.8] Mona's "no shape at all" is declared right; say "no fixed shape". 7.4 [3.2](d) Trial 3 (side by side) also refutes "only upwards"; "most directly" is arguable. 7.4 [3.16](e) assumes the solid-to-vapour change without it being stated in the book.
- 7.2 [1.7] match: stone and iron both fit a and d loosely; the cues in the stems keep it single-answer. 7.2 [1.13] ends on a conclusion about interparticle attraction, not a decision.
- 7.1 [0.16] case study is a model-testing exercise (illustrative made-up units, stated as such); ends on correcting a note, not a decision; fine as is. 7.1 [0.18](a) "worn round" is beyond the book.
- 7.5 [4.5] solids' incompressibility is implied (definite volume), not stated in the book; [4.2] is a one-line correction.
- 7.6 [5.2], [5.9] fill_blank (2 of the 3 states let particles move from place to place), [5.10] are one-line summary facts; [5.16](e) "no such spreading" is absolute (suggest "no visible spreading in a day").
- Pattern: "find the two wrong lines/captions/entries, correct them, say which is right" opens [0.6], [1.18], [2.13], [3.14] (four items, one per concept in 7.1 to 7.4). Not a slot template, but vary one of them.

## Recomputed and confirmed
7.1[0.16] 1.0 to 1.1 is a 10% gap increase and 100 to 60 is a 40% fall; labelled "a simple model ... made-up units" in the stem, so the claim is illustrative, not a book fact. 7.5[4.1] sugar B-A 12 mL, C 158 so 4 mL (33%), salt 8 mL added, fall 3 (37.5%), sand 160 to 160; (b) 150+12=162 vs 158. 7.5[4.15](c) (20-11)/20 = 45%; labels swapped correctly. 7.4[3.5](d) 1.5+3 = 4.5 L, thinner than 3 L. 7.3[2.14] 30 mL/min, 20 min, 900 mL lost (100 mL left), B 12 mL/min, 360 lost, 640 left. 7.3[2.8] 78. 7.2[1.11] at 140 C ice and urea melt, iron stays solid: 1. 7.2[1.13] 55 C and 75 C lines wrong, 60 C below 62 so solid. 7.4[3.15] honey, water vapour, air, milk = 4. 7.4[3.19] X liquid, V fluid yes, Y gas, W solid. 7.4[3.4] key "1 only" (S2 false, S3 false). 7.6[5.3] 55 C between 42 C and 70 C so 2 to 4 min; 42 C to 50 C within 5 minutes; 27 C takes 7 min. 7.6[5.13] 1 m in 1 min, next 2 m in 3 min, next 3 m in 5 min. 7.2[1.1] urea AR: A false R true. 7.5[4.8] A true R false. 7.6[5.0] both true, R explains. 7.5[4.5] 1. 7.6[5.9] 2. 7.5[4.18] 15 mL. All keys correct and unique except as noted in MEDIUM 10 and LOW above. Scope: no scope_out line violated (no diffusion, atoms, Kanad, SPM, soap, Fig 7.16).

## Per-concept verdict
- C8SC-7.1: pass after one fix (HIGH [0.7] duplicate option; MEDIUM [0.11], [0.20]).
- C8SC-7.2: pass (LOW only).
- C8SC-7.3: pass after fixes for MEDIUM duplicates ([2.8], [2.18]); v2 HIGH closed.
- C8SC-7.4: pass after fixes ([3.14] hinge, [3.12], [3.2]/[3.5] duplicate).
- C8SC-7.5: pass after fixes (delete [4.18] and one of [4.3]/[4.10]).
- C8SC-7.6: pass after fixes ([5.4], [5.18], [5.16]).

## Counts
Read 123. HIGH 1, MEDIUM 11, LOW about 20. Templated: no by slot, type spread, key spread, option length or case-study ending; idea repetition remains in 7.3 to 7.6 and is judged acceptable for this narrow chapter except the near-duplicate pairs listed (MEDIUM, not HIGH).

Verdict: NOT load-ready yet; pass after fixes. The one HIGH ([0.7] duplicate option) is a one-line edit; with it and the near-duplicate deletions (7.4 [3.2]/[3.5], 7.5 [4.18]/[4.3], 7.6 [5.4], 7.1 [0.11]) and the [3.14] fix, it is load-ready.
