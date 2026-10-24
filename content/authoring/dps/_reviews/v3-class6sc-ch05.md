# Review v3: class6sc ch05 (SCI6, Measurement of Length and Motion, fecu105)

Re-review after one fix pass. All 123 questions read (20, 20, 20, 21, 20, 22), none sampled. Every key and every case-study part recomputed in code (scratch: scratchpad/rereview-class6sc-ch05/show.py). The fixer reordered each concept, so v2 indices no longer match; "idx" below means the 0-based position in the CURRENT file.

## 1. Status of the v2 findings

v2 had no HIGH. Result: the 5.2, 5.3, 5.4 and 5.6 MEDIUMs are fixed; the 5.5 repetition MEDIUM is NOT fixed; a few recall items were swapped for slightly harder recall.

C6SC-5.1
- v2 idx 11 (differentiate body-based vs standard): FIXED in form (item gone); replacement idx 11 (Ravi "Length = 42", what is missing) is again a one-line book fact. PARTLY.
- v2 idx 10(a) (number and unit): now idx 10 (a) "what one extra piece of information the carpenter needs" is still a recall answer (whose handspan); (b) computes. PARTLY (LOW).
- v2 idx 8 true_false verdict True: FIXED (idx 2 is now False with a real misconception).
- v2 idx 12 unsupported step mark ("strides not exactly equal"): FIXED (text absent).
- v2 idx 15 claim_check overreach (dhanusa, yojana): FIXED (idx 17 judges only the angula).
- v2 idx 18 case study (floor/wall, weak trade-off): FIXED (idx 0, one wall, closing shop, delivery after the event; real cost).

C6SC-5.2
- v2 idx 17 (copy of book Q12, steel/paper reasoning): FIXED (idx 9 rubber strip with data; recomputed 100 cm, 4 cm short, 10.4 mm). Residue: the key's "wood or metal" is not in the book (LOW, see L3).
- v2 idx 12 (boxed question): FIXED (idx 11 converts two lengths and chooses a unit).
- v2 idx 13 (stack method not in book): FIXED (stack of 200 sheets given in the stem; 0.08 mm correct).
- v2 idx 18 (dominated decision): FIXED in numbers (Rs 250 vs 130 cm at Rs 180 = Rs 234), but see L4: the stem now makes waiting free, so the choice is again one-sided.
- v2 idx 19 (dictionary only fit): FIXED (idx 4, 39 mm, either fits, not both; named preferred answer).
- v2 idx 2 longest-correct: FIXED.

C6SC-5.3
- v2 nine-times "subtract the start" repetition: FIXED. Now idx 3 (claim), idx 18 (case) and one clause of idx 16. idx 10 fill_blank no longer needs subtraction.
- v2 idx 1, 2, 11, 12, 17 (page recall): idx 2 is now a real twist (average of 8.8, 8.4, 8.3 = 8.5, rejected) FIXED; idx 17 replaced by idx 14 (pot, three lengths, conversion) FIXED; idx 1/12 folded into idx 6 and idx 8; idx 11 (precaution claim) remains a restatement, see M5.
- v2 idx 19 (no decision): FIXED (idx 4 leaf lesson, 30 min vs 20 min; idx 18 torn tape, an hour late).
- v2 idx 6 universal assertion, idx 16(d) half-hidden mark, idx 5 all-true MS: FIXED (items replaced; MS is now "Statement 3 only").

C6SC-5.4
- v2 bicycle method in four items: FIXED to one (idx 20). Scope judgement in section 4.
- v2 rubber band repeated: FIXED (idx 12 and one match option).
- v2 idx 12/13 recall: FIXED (idx 3 chooses instrument for three shapes; idx 17 claim about thread vs tape).
- v2 idx 0 true_false verdict True: FIXED (idx 6 False).
- v2 idx 19(d) either-choice: FIXED (idx 15 names the strands to buy, with the 0.5 m margin).
- v2 idx 2/10 wrap count not stated: FIXED (idx 0, 14 say "5 times", "3 times"; idx 2 is 6 arcs).

C6SC-5.5
- v2 rest/motion repetition (nine items): NOT FIXED. Now ten items: idx 1, 2, 4, 6, 10, 13(d), 15, 16, 17, 19. The nouns changed (train, merry-go-round, tree, escalator, ferry, ship) but the idea is the same.
- v2 idx 10, 11, 12 recall: replaced (idx 9 pole moved, idx 11 four stones, idx 12 multi-statement). FIXED mostly; idx 6 assertion-reason is now a definition (see M6).
- v2 idx 19 (a) answered in stem, (d) either: FIXED (idx 3 asks the error and carry-over; preferred answer named); but see L5.
- v2 idx 16(d) several answers, idx 8 True true_false, "same straight road": FIXED.

C6SC-5.6
- v2 idx 8 assertion with march-past: FIXED (idx 14 heavy box on straight floor, A true, R false).
- v2 idx 9 fill_blank "periodic": FIXED (idx 2 counts periodic motions, answer 2).
- v2 idx 3, 11, 12, 13 recall: partly. Unfamiliar objects added (wiper idx 16, sewing needle idx 11, bicycle mark idx 12), but idx 11 gives the definition inside the stem, see M7.
- v2 idx 20 / 21 either-choice: FIXED (idx 4 has the Rs 600 rule; idx 15 one eraser forces the allocation).
- v2 marble/loop repeats and rollercoaster mirror: idx 7 still mirrors end-of-chapter Q11 in shape (LOW L6).

## 2. New findings

### HIGH
H1. C6SC-5.4 idx 10 (Arjun and the verandah arch), impossible data. "he holds a metre scale straight across ... and reads 1.6 m. His sister straightens the same marked thread and reads 2.3 m." The chapter's metre scale is 100 cm long (Fig. 5.2, "One metre is divided into 100 equal divisions"), so it cannot read 1.6 m or 2.3 m in one placement; the 15 m tape in idx 7 is the only long instrument the pack gives. A Class 6 reader who has just learned the scale will see the stem is impossible, and the key (2.3 m, 0.7 m short) rests on it. Smallest fix: say "a 3 m measuring tape" for both readings, or keep the metre scale and change the numbers to 0.6 m (straight gap) and 0.9 m (straightened thread), key 0.9 m and 0.3 m short.

### MEDIUM
M1. C6SC-5.4 idx 15 (a) and (b), same instrument issue: "using a thread and a metre scale" for arches of 2.4 m; the thread is longer than the scale. Fix: add "laying the metre scale along it more than once" or change to "a measuring tape". (Also 5.4 idx 2 "1.62 m" and idx 20 "1.8 m" give a straightened length without naming an instrument; fine, but keep consistent.)

M2. C6SC-5.5 repetition not fixed. Ten of 20 items test "rest or motion depends on the reference point" (idx 1, 2, 4, 6, 10, 13(d), 15, 16, 17, 19); five more test kilometre-stone readings (idx 0, 11, 12, 13, 14). The standard is about two per idea. Fix: keep idx 2 (merry-go-round), idx 16 (escalator) and idx 13(d); replace idx 1, 4, 6, 15, 17, 19 by items from other 5.5 ideas (position of one house from two reference points with a numerical answer, choosing the reference point that puts a given object at rest, a Kabaddi-court layout with distances, the reading on a stone after a stop).

M3. C6SC-5.3 new repetition inside the fix. The "scale not touching the object / notebook diagonal" idea is in idx 8 (Q and S records), idx 9 (notebook diagonal, 29.4 cm, the same numbers as record S in idx 8), idx 11, idx 12 and idx 13(a): five items; idx 11 and idx 12 (scale held above the line) are the same question in two formats. Eye position is in idx 2, 4, 5, 13, 16, 17. Fix: delete idx 12 and change idx 9 to different numbers and a different object, or fold it into idx 8.

M4. Easy in disguise, chapter-wide. By the bank rule (answer is a fact the book states in a line, or a single step), about 34 of 123 items (28%) are easy whatever their Hard label. Index of the clearest, by concept:
- 5.1: idx 1 (more handspans means shorter hand), 3, 7 (15 x 60 cm), 11 (unit missing), 18.
- 5.2: idx 0 (km for track, mm for sheet is the book's own boxed question), 1 (1.68 m to mm), 5 (3 km 40 m), 10 match, 14 (inch is not SI), 18 (unit-writing rules).
- 5.3: idx 0, 6 (flexible tape or thread for girth), 10 (reading 9.7), 12, 15 (a correct reading is the same on any scale), 17, 19.
- 5.4: idx 0 (47.5/5), 2, 5, 14 (66.3/3), 16 (procedure for a rangoli curve), 19 (why tailors' tapes are flexible).
- 5.5: idx 0 (85 minus 47), 1, 14, 17 (negative statement with an absurd option), 18, 19 (a)-(c).
- 5.6: idx 0, 5, 9 match, 11, 16, 17, 21, 12.
Most are 1-mark MCQs and one-step fill_blanks marked Hard. Fix: either re-label them honestly or raise them: add a second step (a conversion plus a comparison, or a stated error and its size), or replace the one-line facts with data items like idx 8 in 5.1, idx 2 in 5.3 and idx 9 in 5.5.

M5. C6SC-5.3 idx 11 (Sana holds the scale a centimetre above the line): recall in disguise at 3 marks (chapter says "place the scale in contact"); key reason "can tilt or shift" is not in the book. Fix: give a reading error (with the scale 1 cm above the end the reading is 6.4 cm against the true 6.0 cm?) or drop it with M3.

M6. C6SC-5.5 idx 6 assertion-reason (Understand): A is a restatement of the book bus example and R is the book definition, so it is a read-aloud item. Fix: use an unfamiliar object (a seated cyclist, a parked bike seen from a moving car) in A.

M7. C6SC-5.6 idx 11 (sewing needle): the stem hands over the definition of oscillatory and periodic ("up and down, again and again, about a fixed position, repeating its path after a fixed interval"), so the key is a word-match. Fix: remove the definitional phrases and give only what the needle does.

M8. Correct-option-is-longest rate for plain MCQs: 11 of 29 (38%), up from 24% in v2. Per concept 5.1 idx 5, 14, 18 (3 of 5), 5.3 idx 2, 6, 12 (3 of 5), 5.4 idx 8, 16, 5.5 idx 5, 9, 5.6 idx 5. Fix: shorten those keys or lengthen a distractor in each, so the rate falls to about 25%.

M9. C6SC-5.4 procedure items. "Lay the thread, mark, straighten, read on the scale" is the answer or part of the answer in idx 3(b), 4(a), 5, 11, 14(b), 15(a), 16, 17, 18(b) and 7(d): ten items for one book sentence. Keep idx 11 (reverse), idx 17 (claim) and the case studies; turn idx 5, 16 and 18 into data items (error sizes, a thread that slips, a stretched thread).

### LOW
L1. C6SC-5.1 idx 10 (a) "what one extra piece of information" is a recall answer; make (a) compute (customer 18 cm: what length in cm does 'six handspans' ask for?).
L2. C6SC-5.1 idx 15 (d): the choice is lopsided (a centimetre length is clearly better). Add a cost for it (tailor cannot read a tape reading to 0.1 cm) or accept.
L3. C6SC-5.2 idx 9 (d): "a material that does not stretch, such as wood or metal" is outside the book; add "(for example the metal rod in the shop)" or mark any non-stretching material acceptable.
L4. C6SC-5.2 idx 15 (d): the stem says the cloth is always in stock and she passes the shop anyway, so waiting has no cost and the answer is forced. Remove one of those two clauses so the Rs 16 saving is weighed against the risk.
L5. C6SC-5.5 idx 3 (d): re-marking all three stations takes 15 min and the relay is 20 min away, so both options fit in time and the choice is Rs-free: moving two stations only is simply better. Make the wait 25 min for a full re-mark.
L6. C6SC-5.6 idx 7 (toy track P Q loop R S): tags figure, fully described in words (good), but the P-to-Q, loop, dip chain still mirrors end-of-chapter Q11. Acceptable; change the shapes if load rules ban mirrors.
L7. C6SC-5.3 idx 2 is tagged `figure` but there is no figure; the readings are in words. Drop the tag or keep "scenario" only.
L8. C6SC-5.3 idx 7 (b): that eye position "does not apply" to a visually impaired student is the author's reasoning, not the book's (the book gives only raised markings). Mark as accepted extension.
L9. C6SC-5.6 repetition of nouns: ceiling-fan blade in idx 2, 8, 9, 10; swing in idx 1, 4, 5, 13, 18, 20; pendulum in idx 9, 10, 17; "swing is curved so circular" is idx 18 and idx 20(d). Replace idx 8 (fan blade) and idx 18 or 20(d).
L10. C6SC-5.2 idx 12 (a): "one sheet is far thinner than 1 mm" is asserted before the data in (b); say "a sheet is much thinner than 1 mm" or ask (a) after (b).
L11. Case studies (a)-(c) are still mostly arithmetic or lookup from the stem (5.1 idx 0, 15; 5.2 idx 15, 19; 5.5 idx 13 (a)-(c)); the chapter is needed for the last part. Acceptable (each (d) now carries a real decision), but 5.5 idx 13 (a) "what is the reference point on these stones" is in the stem.

## 3. Checks, counts

- Keys: all 123 keys recomputed or checked against pages 80-100; none wrong, no second defensible option found (AR/MS truth values, match pairings, every claim verdict and every "NOT" item re-derived).
- Arithmetic confirmed: 8 m, 25 cm, 12.8 m, 4.8 m; 195 cm, 13.9 cm; 15/12/11.25/10 handspans; 9 m; 12 cm; 3 m; 15 m, 10 m, 30 strides; 93 cm / 8 cm, 91.4 cm, 1.6 cm; 3040 m; 1680 mm; 2350 m = 23 x 100 m + 50 m; 1100 m < 1150 m < 1200 m < 1250 m; 250 cm; 0.08 mm; 416 mm, 39 mm; 5 m, Rs 900, 140 cm, Rs 234; 18 km, 0.5 km; 8.5 cm average; 2.75 m, 3.00 m, 2.87 m (Charu wrongly qualifies); 246 mm and 583 mm; 9.5 cm; 27 cm; 22.5 cm, 4 per strip, 8 strips, 90/21.5 = 4.19; 42 tiles; 25.0 cm; 22.1 cm; 8.7 m, Rs 700 against Rs 690, 1.3 m and 0.3 m spare; 1350 m; 38 km; 47 m (2 m over); 1.5, 1.5, 0.8, 2.2, 0.7 km; 3.0/2.4/1.6/0.9 km; 64 km; Rs 500 over, Rs 500 under. All correct.
- Step marks equal the question marks in every item. Key present in options in every option item. No option named by position. No "as in the book" phrases.
- Slot order: NO LONGER identical. The six concepts now have six different mark/type sequences (checked), case studies and five-markers are spread through the list. v2's templating finding is fixed. Remaining shared shape: every concept still has 2 case studies (4 marks) and 2 five-mark items; each case-study (d) is "justify a choice", now with real tension in 5.3, 5.4, 5.6 and 5.1 (idx 0).
- Difficulty: 93 Hard, 30 Hardest, none lower (labels inflated, M4). Bloom: Analyse 55, Evaluate 38, Apply 27, Create 3, Understand 2 (1.6%); Analyse/Evaluate/Create 96 of 123 (78%).
- Claim_check (12): No 5, Yes 3, Partly right 4. Fine.
- true_false (7): False 5, True 2 (5.3 idx 5, 5.6 idx 8). Both True items carry a real trap (slant reading, fixed fan with moving tips). Fine.
- multi_statement keys (6): Statement 2 only; 1 and 3 only; 3 only; 2 and 3 only; 1 only; 1 and 2 only. Well spread, no all-three key.
- assertion_reason (7): both true and explains 2, both true not explains 2, A true R false 2, A false R true 1. All four covered.
- fill_blank (6): all numeric answers (9, 1680, 9.7, 27, 38, 2); machine matchable.
- Match (3) and figure (1, 5.6 idx 7) are fully described.
- Longest-correct plain MCQ: 11 of 29 (38%), M8.

## 4. Scope: the bicycle-wheel item (5.4 idx 20)

Judgement: acceptable as ONE item, with a bookkeeping fix. It comes from the "Learning further" box on page 100 of this same chapter and uses only a thread round a curve (in scope) times a count of turns; no speed, no time, no scope_out line is broken. It is not a second concept: the thread-round-the-wheel step is exactly 5.4. But it is not in scope_in, and part (e) (missed clicks, answer too small) and the 1350 m to 1.35 km chain go slightly beyond the box. Fix: add a scope_in line ("distance by counting wheel turns, p.100, Learning further") or keep as is and note it; drop part (e) if a strict "this book says" rule applies. No other item uses it (v2 had four).

## 5. Index

HIGH: H1 (5.4 idx 10).
MEDIUM: M1 (5.4 idx 15), M2 (5.5 repetition), M3 (5.3 idx 8, 9, 11, 12, 13), M4 (about 34 easy items), M5 (5.3 idx 11), M6 (5.5 idx 6), M7 (5.6 idx 11), M8 (11 of 29 longest-correct), M9 (5.4 procedure items).
LOW: L1 to L11.
Counts: 1 HIGH, 9 MEDIUM, 11 LOW.

## 6. Verdicts

- C6SC-5.1: pass after fixes (L1, L2; M4 items idx 1, 3, 7, 11, 18; M8 idx 5, 14, 18).
- C6SC-5.2: pass after fixes (M4 idx 0, 1, 5, 10, 14, 18; L3, L4, L10).
- C6SC-5.3: pass after fixes (M3, M5, M8; M4 items).
- C6SC-5.4: rework one item first (H1 idx 10, M1 idx 15), then pass after fixes (M9, M8).
- C6SC-5.5: pass after fixes (M2 repetition is the main defect; M6; L5).
- C6SC-5.6: pass after fixes (M7, M4 items, L9).

CHAPTER VERDICT: PASS AFTER FIXES. The fix pass worked on the structure, the case-study decisions and the true_false and key spread, and no key is wrong. One new HIGH (a metre scale reading 1.6 m and 2.3 m, impossible data) and one remaining repetition problem (5.5) must be fixed before loading. The easy-in-disguise share (about 28%) and the longest-correct rate (38%) are the main quality gaps.
