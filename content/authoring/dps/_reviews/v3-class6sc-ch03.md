# Review v3: Class 6 Science ch03 (Mindful Eating), content/authoring/dps/class6sc/ch03.json

Re-review after one fix pass. Source: content/extracted/fecu103/pages (all 26 pages read). Read: 127 questions (3.1:20, 3.2:21, 3.3:22, 3.4:21, 3.5:22, 3.6:21). Every key recomputed (numbers in python, facts against the pages) before reading the stored answer.

Programmatic checks, all clean: correct option sits at o[0] and equals the key on every option item; no duplicate options; step marks sum to `m` on every item with steps; no positional option references; no scope_out hit (the only "precaution" hit is 3.3 idx 15, the washing-vegetables point, which is chapter text and not the lab-safety list). All items are Hard (103) or Hardest (24).

## v2 status

- v2 HIGH (3.2 canteen case): FIXED. 3.2 idx 8 now says "one serving each of two different carbohydrate items and one serving of a fat item". Recomputed: cheapest two different carbohydrates banana 6 + sweet potato 15 = 21; plus groundnuts 10 = 31 > 30, so No; drop one carbohydrate: banana + groundnuts = 16. Key correct, one answer only.
- v2 items 7-12 (recall in disguise): partly fixed, many items replaced by scenario or evaluation items; remaining one-line facts listed below.
- v2 item 5 (the "bag of wheat" frame): NOT fixed (see M3).
- v2 item 4 (label arithmetic in 3.5): NOT fully fixed (see M3).
- v2 items 6, 20, 25 (3.3 vitamin C part (a), Jaya, iron option): fixed.
- v2 item 18 (sugar and iodine): 3.4 idx 6 still uses it, but the book's own end exercise 9 (p.58) states that sugar does not turn blue-black, so it is supported (LOW L5).
- v2 item 26 (3.6 farm-to-plate order): see judgements.

## Judgements asked for

- 3.4 idx 8 (potato turns blue-black, stated in the stem): acceptable, not HIGH, but weak (M2). The stem hands over the link (starch food plus iodine gives blue-black), so the answer is derivable without the chapter.
- 3.4 idx 19 (plain chapati result given as an observation): OK. The stem gives observations, not conclusions; (a) still needs the chapter's rules (blue-black means starch, oily patch means fat), and "fat not detected" is correctly hedged. (b) is sound.
- 3.6 idx 16 (farm-to-plate order vs Fig. 3.10): the key (growing wheat, threshing and winnowing, storage, grinding and packing, transport to the retail shop, food on the plate) matches the figure's label set and is the only logically possible chain: the wrong options put threshing before growing, storage before threshing, or food on the plate before transport. The page text gives labels only, no arrows, and no source PDF is in the repo, so the printed arrow order could not be checked visually. One answer is defensible. Relabel Hard/Understand as is; it is a figure-sequence recall.

## HIGH

None found. All 127 keys recomputed correct; every option item has exactly one defensible answer.

## MEDIUM

M1. C6SC-3.5 idx 18 (school lunch plan, "Which day should the principal change?"): key is Thursday. Tuesday (noodles and a carbonated drink) is nearly as bad: no protein-rich food, no fruit or vegetable, one named junk food plus noodles. The key's tiebreak ("two named junk foods") is only implied. Fix: add to the stem "the principal ranks days by how many foods the chapter names as junk", or give Tuesday a protein item (for example an egg).
M2. C6SC-3.4 idx 8 (lost label, potato slice): the stem says the potato "turns blue-black with iodine", which supplies the chapter fact; (a) is then pure logic, and the item is close to the book's own exercise 13. Also other starch foods would work, so "potato slice" is not the only answer. Fix: remove the stated colour ("Her class tested potato slices in Activity 3.5") and accept any starch food in the step.
M3. Chapter-light arithmetic still present (answerable from the stem; the book adds little):
 - 3.6 idx 0 (sum 543), idx 4 (120/210 = 57.1%), idx 12 (fill_blank 85) and idx 14 part (i) (1500/30): four items on one frame, distance addition and ratio. Keep idx 0 and idx 12 (the latter does test the "wheat without the car trip" definition); replace idx 4 with a judgement (which leg is cheapest to cut and why).
 - 3.5 idx 7 (35.0 x 2.5 = 87.5), idx 10 (per-pack scaling), idx 15 (read two labels, answerable entirely from the stem) and idx 17 (25 g of 536 kcal = 134). Four items scale or read the same label. Replace idx 7 and idx 15.
 - 3.4 idx 20 (5-mark tally: parts i, ii, iii, v are counting from the stem; only iv needs the chapter) and 3.1 idx 7 (counts and sorting from the lists printed in the stem; only (v) needs the chapter). Move counts into a table the student must read from the chapter or cut marks to 3.
M4. Repeated idea: wafers vs chana is asked in 3.5 idx 0, 2, 5, 6, 10, 15 and 21 (7 of 22). Cut two. "Millets suit uncertain rainfall" is asked in 3.6 idx 3, 13 and 14.
M5. Recall in disguise (the answer is one book line, the bank allows no easy items): 3.1 idx 12 (fill_blank "improved transportation"), 3.2 idx 15 (count fat sources in a list), 3.2 idx 6 and 19 (butter and curd are animal fat sources; the same fact twice), 3.3 idx 20 (raw vs boiled guava), 3.3 idx 21 (protein sources), 3.5 idx 14, 16, 20, 21, 3.6 idx 9, 11, 17, 18, 19. Make three or four of these a scenario that needs a second chapter idea.
M6. C6SC-3.4 idx 5 part (c): "the patch was read while wet, so it may be from water" is the author's inference; the book only says to let the paper dry, with no reason. Defensible; mark the step as accepting "the procedure was not followed" as an equivalent.

## LOW

L1. 3.1 idx 7 (iii-v): "makki di roti, from maize" is a book table pairing, but "makki" meaning is general knowledge; chhole bhature (chickpea) is also a valid answer to (i). Accept any matching pair in the step.
L2. 3.1 idx 18 (d): Punjab "pulses" and Karnataka "urad" overlap (urad is a pulse), so Stalls A and C arguably also share a crop. Part (c) stays unique (rice). Say "a crop named in both lists".
L3. 3.2 idx 14: "potato curry" is normally cooked in oil, so "no fat" can be argued. Use "boiled potato".
L4. 3.2 idx 6: step names butter and curd; ghee also qualifies. Say "for example".
L5. 3.4 idx 6 true_false: true statement; the sugar detail rests on the book's exercise 9 (p.58), outside scope_in's page range for the tests. Cite it as the book's own statement. True_false mix is 4 False, 3 True (3.2 idx 9, 3.3 idx 12, 3.4 idx 6); acceptable, but make one True item false.
L6. 3.3 idx 6: wrong option "Groundnuts fried in ghee with butter" contains groundnuts, a plant protein source per the book; "best" is still tuar dal, peas and kidney beans. Swap for walnuts and butter.
L7. 3.3 idx 7: 5-mark chart look-up (three disease rows); the (iv) and (v) parts carry the thinking.
L8. 3.6 idx 8 and 20: the decision is dictated by a stated rule (strawman-light). 3.6 idx 2 is a tautology (any total is at least one leg).
L9. Case-study frame: 5 of 12 case studies are a rupee-decision (3.1 idx 4, 3.2 idx 8, 3.5 idx 10, 3.6 idx 8, 3.6 idx 20). Convert one to a deficiency or experiment-fault diagnosis.
L10. 3.6 idx 16 is tagged Understand but Hard.

## Template and key checks (counts)

- Correct option strictly longest: 3.1 2/7, 3.2 2/8, 3.3 2/9, 3.4 1/7, 3.5 2/7, 3.6 1/7 (10 of 45, 22%): fine.
- multi_statement keys: "1 and 3 only", "2 only", "2 and 3 only", "3 only", "1 and 2 only", "1 only": spread, false statement moves position. Each statement truth checked.
- assertion_reason: R explains A x1, R true but does not explain x3, A true R false x1, A false R true x1. All correct.
- claim_check: partly right x3, no x3, yes x1. True_false: False x4, True x3.
- Slot order differs between concepts; 1 fill_blank in five concepts (none in 3.3), 3 match.
- Fill_blank answers (transportation, 3, 72, 87.5, 85) are machine-matchable.
- Case studies (12): all parts recomputed and correct (3.1 idx 4: 17.5 h, Rs 685, 5 months; 3.2 idx 8: 21, 31, 16; idx 10: 40%, 25%; 3.3 idx 15: 37.5%, 60 and 37.5 mg, 48.75 and 11.25; idx 17: 20%; 3.4 idx 13: 400 drops = 20 mL, 80 drops = 4 mL, 10 and 26 mL left; 3.5 idx 10: 214.4, 213, 2.8, 1.92, 11.184, 10.08, Rs 330 to 150; 3.6 idx 8: Rs 120, Rs 1,440; idx 20: 10 kg, 4.5%). Step marks match parts.
- Scope: no violation; no lab-safety precautions tested.

## Per-concept verdicts

- C6SC-3.1: load-ready (L1, L2; M3 last bullet).
- C6SC-3.2: load-ready (L3, L4).
- C6SC-3.3: load-ready (L6, L7).
- C6SC-3.4: load-ready after optional fix M2 (not wrong, weak).
- C6SC-3.5: not blocked by a wrong key, but fix M1 (second defensible day) before loading.
- C6SC-3.6: load-ready (M3 arithmetic frame repeats).

## Counts read

127 questions read. HIGH 0, MEDIUM 6, LOW 10. Templated: mildly (money-decision case frames, label and distance arithmetic frames); objective types well varied.

Verdict: not load-ready until M1 is fixed (one ambiguous decision item); everything else is load-ready as is. Pass after fixes.
