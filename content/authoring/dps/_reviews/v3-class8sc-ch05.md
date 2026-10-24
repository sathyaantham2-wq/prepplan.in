# Review v3: class8sc ch05 "Exploring Forces" (SCI8, hecu105), re-review after one fix pass

File: `content/authoring/dps/class8sc/ch05.json`, 123 questions (5.1 20, 5.2 20, 5.3 20, 5.4 21, 5.5 20, 5.6 22). Diffed against the pre-edit copy: 51 changed or new items, all read; every number recomputed in python, facts checked against pages 65-76 (`hecu105` pages 004-014). Indexes are 0-based inside the concept. Mechanical checks (step marks = marks for every item, o[0] equals the key, no duplicate options, no option named by position, correct-option-longest 6 of 27 MCQs = 22%) are all clean.

## v2 status

- HIGH 5.5[19] (kg row): FIXED. The stem now says the table's only column is "Weight (N)" and Sumit reads the newton scale; 0.2 N step, 2.4 N = 12 divisions, 6.7 N between marks, 14 N over range all recompute; Row 1 is the only row that can stay.
- 2 (5.1[3] three defensible rows): FIXED (a now asks which of the two rows that name a push/pull is wrong; Row 1 pull).
- 3 (5.1[19] Event Q): FIXED (c says "look only at the force each card describes").
- 4 (5.2[7] parts did not climb, count strawman): FIXED. (c) now Trial 4 = direction + speed, (d) is a real choice with one answer (Trial 3).
- 5 (5.2[15] obvious winner): NOT FIXED, made worse (see HIGH 2).
- 6 (5.4[2] rule list hands the answers): partly fixed; the teacher sentence still gives the push rule. Acceptable.
- 7 (5.4[12] distance claim): FIXED (now about what 0 pins proves).
- 8 (5.5[6] true/false): FIXED (now false with a real slip, gram scale on the Moon; matches p.73).
- 11, 12 (fill-blank wording 5.1[4], 5.4[5]): FIXED ("write the number only", "write push or pull").
- 13 (litre of water): FIXED, no "litre" left. 15 (5.6[13] Note gives (a)): FIXED, and (d) 2.7 N recomputes.
- 14 (5.6[8]): NOT FIXED (see HIGH 1).
- 9, 16-19 (easy-in-disguise and repetition): mostly improved; 5.3 friction still in 16 of 20 items, 5.4 charge idea in 11 of 21 (see MEDIUM).
- LOW 21 (rev flags): 5.2[10] and 5.4[4] still tagged rev and are still plain negation MCQs; the new 5.3[1] ("NOT caused by muscular force") is tagged rev too and is the same kind.

## HIGH

1. **C8SC-5.6 [8]** (Assam raft, 5 marks), part (e) and its key "Chooses two trips (or justifies one trip) using the zero margin from (d)". Answer: it must be rewritten. Recomputed: empty 4-drum raft 4x20+400 = 480; 480+3x550 = 2130 < 2400; +300 = 2430 > 2400; 5-drum raft 500, family 4x550+300 = 2500, total 3000 = 5x600 exactly. So (d) lands on equality, and (e) then asks the student to pick one trip or two, with the key saying "a one-trip answer earns the mark if it recognises there is no margin". That is an "either is fine" decision, which the standard forbids, and equality makes (d) itself shaky: the stem calls the adults "about 550 N each", so an exact 3000 = 3000 comparison means nothing, and "floats with every drum just fully under" is a boundary case the chapter does not teach (the book: equal forces means floats). Smallest fix: change the child to 400 N (or an adult to 600 N) so the 5-drum total is 3100 N, more than 3000 N, so one trip sinks and two trips is the only defensible answer; state weights as exact ("weighs 550 N"); key (d) "3100 N > 3000 N, sinks"; key (e) "two trips, because one trip needs 3100 N of buoyant force but the drums give at most 3000 N". Step 5 then reads "Chooses two trips because the total exceeds the largest buoyant force".

2. **C8SC-5.2 [15]** (Channapatna bumpers), part (d) and key "Either choice with both points is accepted ... Sample decision: Z ... or W". Same defect: an explicit either-is-fine decision. Costs also make this a money puzzle (Rs 30 against Rs 40) rather than chapter science. Smallest fix: make the data decide. For example say the company's rule is "the bumper must look the same after every run" (then only Z qualifies, and W fails on change of shape), or make Z's cost Rs 25 so Z is both cheaper (Rs 25 against Rs 30) and shape-keeping, and ask "which bumper and why", key Z. Keep (c) as the arithmetic.

3. **C8SC-5.1 [9]** (five cards, 5 marks). Each card says "Give the force on the oar / on the pot / on the cart / on the pin / on her right thumb" without naming who applies it, and every one of those objects has several forces on it: card 1, the boatman's hands also push or pull the oar (and the Earth pulls it); card 2, the Earth pulls the pot as well as the rope; card 4, the Earth pulls the cart; card 5, the Earth pulls the pin. A student who writes "boatman, push, on the oar" is correct but is marked wrong. The "not the obvious one" sentence does not cure this. Smallest fix: name the applier in each card ("Give the force the water exerts on the oar", "the force the rope exerts on the pot", "the force the bullocks exert on the cart", "the force the magnet exerts on the pin", "the force the band exerts on her right thumb") and ask only the (i)(ii)(iii) answers, or keep the unnamed wording for card 1 only and call the key "water on oar" with the hand force also accepted.

## MEDIUM

4. **C8SC-5.6 [8]** also: parts (a), (c), (d) restate the stem's own rule; only (b) tests chapter knowledge. After the fix in 1 this is acceptable; no further action unless the author wants a harder stem.
5. **C8SC-5.2 [14]** (which event shows exactly two effects). The key says the marble "only starts moving from rest", but 5.2[6]'s key says moving from rest "is also a change of speed from zero", and 5.2[7] counts "stopping (change in speed)". By that counting the flicked marble (start plus speed up) is two effects and so is the cyclist. Fix: make the three distractors unambiguous single effects in the author's own counting, for example marble "rolls at steady speed after the flick" is not helpful; better, drop the "from rest" language from 5.2[6]'s key (call it one effect, "also accepted: change of speed") and add to this item's key that a start from rest is counted as one effect.
6. **C8SC-5.1 [3], [6], [19], 5.2 [8], [17]**: five items use the balanced-forces sentence; scope_out allows only the single mention. The uses are one line each and tied to the book's sentence, so low risk, but do not add more.
7. **C8SC-5.3**: friction appears in 16 of 20 items (5.3 [0, 1, 2, 4, 5, 7-11, 13, 15-19]) and **5.4**: balloon/charge idea appears in 11 of 21 items. The fix pass shifted wording but did not cut. Replace one or two per concept with a different idea (for 5.3: indirect contact through a stick, muscular force in animals; for 5.4: magnet poles, Earth's pull versus these two forces).
8. **C8SC-5.3 [9]**, **5.3 [15]**, **5.4 [6]**, **5.4 [15]**, **5.4 [18]**, **5.6 [14]**, **5.6 [21]**, **5.6 [19]** remain close to a one-line book fact (book at rest table: no friction; water friction shapes; magnet attracts only magnetic materials; attraction is a pull; electrostatic example; the log/pin claim; floating means equal; mug feels lighter). Each has a sound distractor set and one answer, so not blocking, but they are the weakest "no easy items" cases. 5.6 [21] and 5.6 [19] are the thinnest; give [21] a number (boat 3 N in two bodies of water plus a cargo added) if the author revises.
9. **C8SC-5.6 [19]** bucket: the key explains the lightness only by buoyancy; a FULL bucket also loses the water-inside advantage once it clears the surface (the rope then carries the water too), which the key does not mention. Answer is still correct and unique; add "and once the bucket clears the surface it must also carry the water inside" if desired.
10. **C8SC-5.5 [19]** (a): "6.7 N cannot have been read off this balance". A reader may estimate between marks; the chapter only says the smallest reading is 0.2 N. Fine given the stem, but say "cannot be a reading of this scale" in (a).
11. **C8SC-5.1 [16]** and **5.5 [16]**: both rest on one chapter sentence (each object feels a force; weight is the pull, not the size). Single answer, acceptable.

## LOW

12. 5.2[10], 5.4[4] and now 5.3[1] carry `rev: true` but are negation MCQs, not reversals. Drop the flag or write true reversal items. Concepts 5.1, 5.5, 5.6 carry no `rev` flag at all (as in the original). If the loader or brief requires one reversal per concept, 5.1, 5.5 and 5.6 do not meet it.
13. 5.4 now holds 21 items and 5.6 holds 22 (5.4[20], 5.6[20], 5.6[21] added). If the standard is exactly 20 per concept, retire or merge two in 5.6 and one in 5.4 (5.6 [11] and [21] overlap: floating means buoyant force equals weight).
14. 5.6[8]: if the raft sinks to the platform level the platform also displaces water; the stem ignores this. Say "the platform stays above the water".
15. 5.4[12]: "a pull too weak to lift a pin leaves the same record" is correct reasoning but goes slightly beyond the book; keep as an "evidence" point.

## Facts and numbers verified (changed items)

5.1[3] answers hold; 5.1[19] (a)-(c) hold; 5.2[6] 4+1 marks and minute 2-3 (no change) fine; 5.2[7] Trials (2 direction; 3 stop plus shape; 4 direction plus speed; Trial 3 survives as the visible shape) fine; 5.2[9] fine; 5.2[15](c) 60/20 = 3 bumpers = Rs 30, Z Rs 40; 5.3[4] 8 cm sand greatest, range 30-54 cm; 5.3[5], [6], [12], [14], [17] agree with pages 66-68 (indirect contact, alimentary canal, heart; bullocks' muscular force); 5.4[2] chain W opposite to A, S like A, so W attracts S; 5.4[5] unlike poles now facing so "pull"; 5.4[20] A like C, C unlike E (N), so C south, A south; 5.4[8] electromagnet page 69 confirms; 5.4[13], 5.5[14] "gravity always attractive" page 72 confirms; 5.5[1] 4.5 N = 0.45 kg = 450 g; 5.5[6] gram scale assumes Earth, page 73; 5.5[7] key "1 only", statement 3 false (mass unchanged); 5.5[12] "can vary very slightly" page 75; 5.5[15] 0.1 N coin = 0.01 kg, 0.016 N on Moon; 4x25.4 = 101.6 N; 5.5[19] as above; 5.6[6] steel in oil sinks, all liquids give upthrust (page 76); 5.6[11] 8000 to 9500 N; 5.6[13] 5.0-3.2 = 1.8 N, 5.0-2.3 = 2.7 N, stone sinks; 5.6[15] B and D sink (C hovers equal, does not sink); 5.6[16] linear 2/3/6 N, floats half under; 5.6[20] 1.5+0.4 = 1.9 N (one number); 5.6[21] 3 N both. fill_blank items: 5.1[4] "0", 5.4[5] "pull", 5.4[20] "south", 5.5[1] "450", 5.6[20] "1.9" each have one natural machine-matchable answer.

## Template counts

Types per concept unchanged (7 short, 5 long, 4-5 MCQ, 1 AR, 1 MS, 1-2 fill_blank, match in 4 of 6). multi_statement first-option keys: 5.1 "Statement 2 only", 5.2 "1 and 3", 5.3 "1, 2 and 3", 5.4 "2 and 3", 5.5 "1 only", 5.6 "1 and 2" (all different). Assertion-reason outcomes: A false R true; both true R explains (5.2, 5.6); both true R not explaining (5.3, 5.5); A true R false. Claim-check verdicts: 5.1 partly, 5.3 right (changed from the earlier mix), 5.4 wrong, 5.5 partly, 5.6 wrong = 2 partly / 1 right / 2 wrong. Correct-option-longest 22%. Shape lightly templated (same counts), not content.

## Verdict

Counts: HIGH 3 (5.6[8](e), 5.2[15](d), 5.1[9]), MEDIUM 8, LOW 4. The v2 HIGH at 5.5[19] is fixed, but the fix pass added or left two "either is fine" decisions and one ambiguous card item. 5.6[8](e) must be rewritten as above; the fixer's "accepts either choice" key is not acceptable.

Per concept: 5.1 not load-ready (HIGH 3); 5.2 not load-ready (HIGH 2); 5.3 load-ready after optional medium cuts; 5.4 load-ready; 5.5 load-ready; 5.6 not load-ready (HIGH 1).

**Chapter verdict: not load-ready** (three HIGH; one more small fix pass on 5.1[9], 5.2[15] and 5.6[8] makes it load-ready).
