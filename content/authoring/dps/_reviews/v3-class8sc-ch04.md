# Review v3: class8sc ch04 (SCI8, hecu104), re-review after one fix pass

Pack: content/authoring/dps/class8sc/ch04.json, 125 questions. Diffed against the pre-edit copy: 55 items changed, all 55 read. Every changed key was recomputed or checked against pages 46-59 (hecu104 pages 005-013 plus 010, 011, 012). Index [n] is 0-based within the concept. Three-statement multi_statement is accepted as the DPS standard.

Code checks (python): step marks sum to marks on every item; correct option is o[0] on all 46 option items; no duplicate options; no option named by position; multi_statement keys 1&3 / all / 2 / 2&3 / 1 / 1&2 (all different); correct option longest (or equal) on 11 of 46 (24 %).
Recomputed: crane Y Rs 8,000 + 2 h x 1,200 = Rs 10,400 vs X Rs 9,600 (Y dearer by Rs 800, 2 h 45 min vs 8 h); with the Rs 1,000/h truck wait (8 - 4 = 4 h) X = Rs 13,600, so Y wins: correct. Hot-wire cutter 90 cuts: 1 cell 1,080 s = 18 min (over 15), 2 cells 360 s = 6 min (within 15 and inside its 25 min): correct. Phone battery 30/25/20/15 h at 5 h a day: 3 days now, 2 days at 4 years (10 h), 1 day at 5 years; 2 days needed, so buy at about 4 years: correct. School cells 28,800 / 7,500 / 21,300 / 13,500 / 15,300 / 1,440 / 60 / 120: correct. Test strip rises 7, 20, 1, 4 C: correct. Seven-device count = 4 (heater, kettle, iron, immersion rod): correct. 4.2 [13] table: Trial 2 entry is the wrong one, Trial 4 = north / South: correct.

## v2 status
- M1 4.1[1]: FIXED ("wire stays cool" added, one reason remains).
- M2 4.1[13]: FIXED (slipped-wire sentence removed; (d) now a real call on a third claim).
- M3 4.2[13]: FIXED ("unlike poles attract" removed from stem; (d) has a real display constraint).
- M4 4.2[0]: FIXED (one cell OR 100 turns, table decides, limit named).
- M5 4.3[3]: FIXED (truck waiting charge makes the numbers decide).
- M6 4.6[17]: rule now in stem, BUT see HIGH H1 (new defect).
- M7 4.4[14], M8 4.4[3]: FIXED (real trade-off with a time budget; fourth reading and fair-test point added).
- M9 4.5[13]: FIXED (rule card in stem, fault found from the LED test, no stem giveaway).
- M10 4.5[6]: FIXED (single-test design in (d)).
- M11 4.5[3] S2: FIXED (now "juice acts as an electrode", book decides). S3 see M1 below.
- M12 4.6[3], M13 4.6[14]: FIXED (battery-life decision with a threshold; wear-out recompute added).
- M14 (easy in disguise): mostly fixed by scenario dressing. Residual: 4.6[0], 4.6[15], 4.6[9], 4.4[5], 4.5[9], 4.1[3] still rest on one book sentence each (see LOW).
- M15 repeated ideas, M16 five-point lists: partly addressed (4.2[11], 4.4[11], 4.5[11], 4.6[9] now carry cases or a judgement). Rechargeable-vs-single-use still appears in 4.6 [3], [6 no], [9], [11], [12], [14], [15], [19]. Not blocking.
- L-items not touched are unchanged and still LOW.

## HIGH

H1 (C8SC-4.6 [17], short_answer 2) "Rima's torch holds two dry cells, one above the other, with the bulb's contact at the top. The instruction card says: 'Each cell's positive terminal must press on the next cell's negative terminal.'" Key: lower cell's metal cap touches upper cell's zinc base; upper cell's cap (positive) touches the bulb contact. Problem: which cell is "next" and which end of the bottom cell rests on the torch spring are not given. Reading the rule from the top ("upper cell's positive presses on lower cell's negative") gives upper cell zinc base touching the bulb contact, "negative", and (a) reversed. A bulb works either way round, so this is a second defensible answer to both parts. Fix: add "The torch's bottom spring presses on the zinc base of the lower cell" (or "the lower cell's metal cap faces up"), and rewrite the rule as "cells in a battery are joined positive terminal to negative terminal".

H2 (C8SC-4.5 [4], mcq) "Diya pushes a copper wire into one lemon and an iron nail into a second lemon ... The LED stays dark whichever way round it is joined. What is wrong?" Key "Each lemon needs both a copper wire and a nail in it". Wrong option "The copper wire should be moved to the second lemon" is a working remedy (both electrodes then sit in one lemon and the cell works), so it is a second defensible answer to "what is wrong". The key's wording is also loose (a single lemon with both electrodes is a working cell; "each lemon needs both" is not a rule). Fix: key "The two electrodes are in different lemons, so there is no electrolyte joining them; both must dip into the same lemon", and replace the wrong option with something that fails, e.g. "The copper wire should be replaced by a second iron nail".

## MEDIUM

M1 (C8SC-4.5 [3], multi_statement) Statement 3 "The LED is connected between the iron nail of the first lemon and the iron nail of the last lemon." Marked false, correct by chain logic (ends of a chain of unlike-joined cells are one copper and one nail), but the book states the joining only in Fig. 4.8b ("copper wire of the first lemon and the iron nail of the last lemon", p.56 text). Defensible, answerable from p.56, but the stem does not say how the lemons are joined. Fix: add "Each lemon's iron nail is joined to the next lemon's copper wire" to the stem.

M2 (C8SC-4.5 [17], short_answer 2) Judgement of the flagged inference: more lemon cells give a larger current is in the book (p.51, p.52 for batteries); "brighter LED" is NOT in the book (it says only that a glowing LED shows the cell works). Physically correct and the answer is unique, but the stem asks for an effect the pages never state. Fix: stem "so that a larger current flows through the LED" and keep (b); or keep "brighter" and add "(a larger current makes an LED glow more brightly)" to the stem.

M3 (C8SC-4.4 [3](c)) "the thicker wire heated less" is given by the table, not the book (p.53 only says heat depends on thickness, not which way). The item is answerable (data supplies direction) and fair; the model answer should say "from the table" rather than imply book knowledge. Low risk, noted so the author does not state it as a rule.

M4 (C8SC-4.6 [15], long_answer 4) The four stages are four consecutive book sentences (chemical reaction; positive to negative; chemicals used up; single-use). Recall in disguise for 4 marks. Fix: give data (e.g. a torch dimming over 3 weeks) and ask what to conclude.

M5 (C8SC-4.6 [0], mcq) Answer is the book's Snapshot sentence "a cell or a battery generates current because of chemical reactions". Easy item in a scenario wrapper. Fix: make the three devices differ in what is removed (e.g. which can be recharged) or drop.

## Judged inferences (the three the caller flagged)
- 4.5 [16b] dry salt vs salt solution: ACCEPTED. The book says "weak acid or salt solution" and "liquid called an electrolyte"; dried-out lemons plus dry crystals gives no conducting liquid, and the model answer rests on the word "solution". One defensible reading, not a HIGH. Optionally add "completely dry crystals" in (b).
- 4.5 [17] brighter: see M2 (physically right, not in the book; reword the stem).
- 4.6 [6] and [20] carbon rod and zinc container: ACCEPTED. p.57 states zinc container = negative terminal, carbon rod with metal cap = positive; p.55 states electrodes are "two metal rods made of different materials". [6] stem supplies "copper positive, iron negative" so it needs no outside fact. [20] answer uses the book rule. The carbon rod is not a metal, but the key says "different materials", which is the book's wording.

## LOW
L1 4.4 [5] mcq (fair-test pair P and Q) and 4.5 [9] (potato electrolyte = juice) are one-step applications of one book line; the potato is not in the book (analogue of the lemon) but is physically sound. 4.1 [3] A/R rests on "needle is a magnet", fine but simple.
L2 4.2 [11] (2) and (5) use Grade 6 bar-magnet and aluminium facts; the stem says "or from earlier learning", so acceptable.
L3 4.2 [13](d) "decide whether they should paint" is mildly lopsided (yes), but the key adds the letters and the reasoning.
L4 4.4 [21] and 4.6 [1] have distractors that are the author's inventions ("warm cord", "metal cap, zinc case") rather than real confusions; keep or sharpen.
L5 Repetition: 4.6 still spends about 6 items on rechargeable vs single-use; replace one or two with ideas not yet used if the pack is reopened.
L6 Unchanged v2 LOW items (L1 to L12) still stand; none blocks loading.

## Counts and template read
- 125 read in total, 55 re-read in full (changed); the rest are as in v2 (0 HIGH there).
- Types: short_answer 47, mcq 30, long_answer 27, multi_statement 6, assertion_reason 6, fill_blank 5, match 4. Slot order differs by concept (long answers at positions 3-14 and 15-18, mcq and short mixed); the 4-5 mark cluster in the middle repeats but is not a copy-paste template.
- Correct-option-longest rate 24 %, multi_statement key spread varied: not templated.
- Scope: nothing outside scope_in; Earth's magnetism, Li-ion, motors, Oersted not used. 4.1[14] and 4.4[14] carry supervision wording.

Counts: HIGH 2, MEDIUM 5, LOW 6.

## Verdict per concept
- C8SC-4.1: pass (no HIGH; changed items 1, 3, 8, 10, 13, 14 all single-answer and correct).
- C8SC-4.2: pass (0, 2, 5, 11, 13, 15 correct).
- C8SC-4.3: pass (3, 11, 12, 16 correct; crane numbers verified).
- C8SC-4.4: pass (all 12 changed items correct; 14 verified).
- C8SC-4.5: fix first (H2 on [4]; M1 on [3]; M2 on [17]).
- C8SC-4.6: fix first (H1 on [17]; M4, M5).

Chapter verdict: NOT load-ready until H1 and H2 are fixed (two stem or option rewrites, no new items needed). After those two fixes it is load-ready; M1 and M2 are recommended in the same pass.
