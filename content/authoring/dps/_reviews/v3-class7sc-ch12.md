# Review v3: DPS Class 7 Science ch12 "Earth, Moon, and the Sun" (gecu112)

File: `content/authoring/dps/class7sc/ch12.json` (7 concepts x 20 = 140 items). Textbook pages 001-020 read in full (incl. exercises, Fascinating Facts, Know a Scientist). Previous review: `v2-class7sc-ch12.md`.

Notation: `12.n#k` = concept C7SC-12.n, position k in the file.

## Status of v2 findings
The file was rewritten after v2 was written (file time 05:57 vs review 05:32; every concept has a new item order and most v2 items are gone or reworded). Checked against v2:
- v2 case-study strawmen (12.1#4/#8, 12.2#7/#12, 12.3#4/#14, 12.4#3/#7, 12.5#3/#4, 12.6#9/#12, 12.7#3/#13): the old items are gone. Each concept now has two case studies (#19, #20) whose part (d) is a real choice or a discriminating test (e.g. 12.2#19 Plan 1 vs Plan 2, 12.3#20 which night separates Imran from Jaya, 12.5#20 festival dates, 12.6#19 goggle rota vs projection, 12.7#19/#20 cost and trip trade-offs). FIXED.
- v2 12.6#1 ambiguous claim_check (Sana): now 12.6#14 and reads "nobody outside that small area sees any part of the Sun hidden"; key is unambiguous. FIXED.
- v2 12.5#6 date fill_blank: gone (12.5#8 is now "0" hours). FIXED.
- v2 12.7#14 key text mismatch: item gone. FIXED. Keys and option text now agree in all 49 option-bearing items (checked in code).
- v2 AR slot had no false statement: now 12.1#6 (R false), 12.2#7 (A false), 12.7#6 (A false). FIXED.
- v2 correct-option-is-longest bias: now 10 of 49 option items (20%), was 52%. FIXED.
- v2 repetition: partly fixed (see MEDIUM 4 and 5 below); 12.3 and 12.4 are now acceptable.
- v2 "easy-in-disguise" mass: much reduced. Most items now need a computation, a rule applied to a new situation, or a judged comparison. A residual cluster remains (LOW 9).

## Keys recomputed in code or by hand before reading the keys: all correct
Verified: 12.1#8 4 rotations; #11 168/30 = 5.6 -> 5 cycles, 18 h left; #19 15 deg/h, 5 deg = 20 min -> 5:40, 95 min = 23.75 deg, Dwarka west; 12.2#8 9/24 x 360 = 135; #10 235.9 s and 30 x 235.9 = 7077 s = 1 h 57 min 57 s; #15 10/(365.25x24) x 360 = 0.41 deg; #17/#19 15, 30, 150, 45 deg; 12.3#10 182.6 -> 183 days; #17 10 Jan to 10 Jul = 181 days; #19 -6, +8, -10 and spreads 1 and 17 days; #20 183 days; 12.4#20 147, 152, 5, 5/147 = 3.4 per cent; 12.5#10 94 days; #14/#18 185 and 180 days; #19 174, 171, latest starts 25 April and 22 October; #20 12 h, 13 h 55, 12 h, 10 h 20 and all of (b)(c)(d) margins; 12.6#2 0.0133 < 0.02; #4 0.0091, 0.0093, 0.0003 (Sun/Venus about 31); #8 6 m; #10 5 m; #17 3 m, 9 m, 0.006; #18 3600, 6, 6000; #19 8 pairs, 360, 4 turns = 40 min; 12.7#12 126 and 45,990; #19 40 pairs, 5 turns.
Multi_statement keys: 12.1#5 "2 and 3 only" (1 F); 12.2#6 "1 and 2 only" (3 F); 12.3#5 "1 and 3 only" (2 F); 12.4#6 "1, 2 and 3" (all T); 12.5#5 "2 only" (1 F, 3 F); 12.6#6 "3 only" (1 F, 2 F); 12.7#5 "1 only" (2 F, 3 F). Seven different keys. All correct.
Assertion_reason keys: 12.1#6 A T / R F; 12.2#7 A F / R T; 12.3#6 both T, no explanation; 12.4#7 both T, explains; 12.5#6 both T, no explanation; 12.6#7 both T, explains; 12.7#6 A F / R T. All correct against the text; spread of the four outcomes is good.
Type spread: true_false verdicts 4 True / 3 False; claim_check verdicts disagree x3, partly x2, agree x1 (12.3#14), right x1 (12.5#14); fill_blank answers 4, 135, 365, half, 0, 6, Earth. No position references ("option (b)", "first option") and no explanation appended to option text anywhere (scanned). Step marks sum to the item mark in every short/long item (scanned). No Easy-difficulty items. Match items: 4 (12.1, 12.3, 12.5, 12.7), all keys correct.

## Findings

### HIGH
None.

### MEDIUM
1. 12.1#14 (Create, 3 marks, "Give an example of rotation from daily life that is NOT mentioned in the chapter"): the model key gives "a ceiling fan or a potter's wheel". Fig. 12.2(b) in the chapter is a spinning fan, so the key's first example breaks the stem's own condition and would mark a correct "not in chapter" answer inconsistently. Fix: replace the key example with a potter's wheel / a rotating door / a merry-go-round's neighbour such as a bicycle wheel, and add "spinning top, fan and ball are in the chapter" to the stem.
2. 12.2#3 (mcq, Ishita sketches every two hours "for at least 8 hours"): the key is 5 sketches, last at 5 am (exactly 8 hours). Option "6 sketches, the last at 7 am" also gives a record of at least 8 hours (10 hours), and the stem asks how many she will have made "when she finishes" without saying she stops as soon as 8 hours are covered. Two defensible answers. Fix: "for exactly 8 hours" (from the first to the last sketch).
3. 12.4#20 (case study, Rani's two circles) uses the 14.7 cm / 15.2 cm, 1 cm = 10 million km data of the Exploratory Projects box, and the closest/farthest distances 147 and 152 million km, which appear only there. `scope_out` lists "Exploratory projects". The reasoning (distance not the cause, closest in January) is in scope; the numbers are not. Fix: give the distances in the stem as invented data ("closest 147 million km, farthest 152 million km") and drop the circle-drawing frame, or keep the frame and say "invented for the exercise".
4. Repetition in 12.5: the North Pole sunshine dates (21 Mar - 22 Sep, 6 months, South Pole opposite) carry 12.5#3, #5, #6, #8, #11, #14, #15, #18 and #19: 9 of 20 items on one Fascinating Facts box, with #14 and #18 both counting 185 days. Fix: replace #14 (or #18) and #6 with items on the equator/Srinagar contrast, the 21 June to 22 December day-length difference at other latitudes, or a Southern Hemisphere city's year (the chapter's reversal rule).
5. Repetition in 12.6: eye-safety rules appear in 12.6#3, #6, #7, #12, #18, #19 and #20 (7 of 20), and the "apparent size = size / distance" arithmetic in #1, #2, #4, #8, #10 and #17 (6 of 20, three of them near-identical ball-and-lamp calculations: #2, #8, #17). Fix: merge #8 and #10 into #17's pattern, and replace #7 and one of #3/#18 with items on the Transit of Venus, the moving shadow (why totality lasts only minutes) or the diamond-ring phase.

### LOW
1. 12.2#9 and 12.3#9 (true_false) rely on "the stars are very far away", which this chapter does not say. The verdicts are right, but the corrections lean on outside knowledge. Reword the false claims so that the key needs only the chapter's reason.
2. 12.3#8 (fill_blank "about ___ rotations in one revolution", key 365): the book gives 365 days 6 hours, so "365" is the only reasonable answer but "365.25" or "about 365 and a quarter" will be typed. Accept 365 to 366 in the key or say "to the nearest whole number".
3. 12.4#8 (fill_blank, key "half"): machine matching must accept "1/2", "one half", "50%". State the form wanted ("as a fraction").
4. 12.5#14 (claim_check): the claim says "nearly six months" and the key says 185 days is "about 6.2 months, so 'nearly six months' is right". 6.2 is slightly over six months, not nearly. Change the claim to "about six months".
5. 12.6#3 (mcq): the option "look straight at the Sun only during totality" is rejected by the chapter's blanket rule ("directly viewing ... must be strictly avoided"). That is the right key for this book, but a student with outside knowledge could pause. Keep, and add "the chapter's rule" in the key text.
6. 12.7#18 key says the Moon's shadow covers only a small area "because the Moon is much smaller than the Earth"; the chapter compares the Moon with the Sun only, not with the Earth. Reword to "because the Moon's shadow is small by the time it reaches the Earth, while the Earth's shadow covers the whole Moon" (the shadow facts are in pages 180 and 182). Same mild stretch in 12.7#2/#10/#14 ("seen from a large part of the Earth"): exercise 11 asks it, the book does not answer it; the shadow comparison alone is enough for the key.
7. 12.4#17 (v): "both places are at the same distance from the Sun" is loose for Delhi and Perth. Say "almost the same distance".
8. 12.4#19 (d): ideas B and C make no day-length prediction, so Test 2 "tells A apart" only because A alone predicts the reversal. Defensible and the key explains it; consider rephrasing to "which test can only Idea A explain".
9. Easy-in-disguise residue (answerable from one book line or a one-step lookup): 12.1#7 match, #12; 12.2#4 (Foucault), #13; 12.3#13 (Maru, 2 years), #16; 12.4#5 (Perth and Hobart), #11 (exercise 12, key not in the book); 12.5#12; 12.6#5, #9, #12; 12.7#3, #8, #11, #13. About 16 of 140 items, none harmful; replace a few if the owner wants a still higher bar.
10. Bloom labels: Remember 0, Understand 12, Apply 31, Analyse 63, Evaluate 24, Create 10 (Analyse is 45%). A few "Analyse" items are applications of a single rule (12.4#1-#5, 12.5#2). Harmless for the loader; labels are slightly generous.
11. 12.3#4 and 12.4#3 have weak distractors ("a perfect square", "nearer the lamp" given with the wrong direction). Not defensible as keys; they only lower discrimination.

## Other checks
- Strawman case studies: none left. Marks of case-study parts sum to the item mark (4). 12.1#19 part (d) (Model X vs Model Y) has one defensible answer, the key explains why Y fails requirement (ii).
- Second defensible answers: only 12.2#3 (MEDIUM 2). Wrong keys: none.
- Scope: every other item is inside pages 169-186; exercise reuse (12.1, 12.4#11, 12.4#16/#18, 12.7) is allowed. Only 12.4#20 touches `scope_out` (MEDIUM 3).
- Facts beyond this book: minor (LOW 1, 6); real-world facts used in invented data (Delhi sunrise/sunset table, Kodaikanal 1899) are consistent with the text.
- Repeated idea check for other concepts: 12.1 (rotation direction) is acceptable; 12.2 "15 deg per hour arcs" in #5, #8, #15, #17, #19 (5 of 20) is acceptable because each asks a different question; 12.3 and 12.4 no longer repeat more than 4 times.

## Counts read
Read 140 of 140. HIGH 0, MEDIUM 5, LOW 11.

## Verdict
PASS. No wrong key, no HIGH. The five MEDIUM items are small, local fixes (one stem condition, one "at least" wording, one scope-out data source, two repetition trims). Safe to load after these fixes; they are not blocking.
