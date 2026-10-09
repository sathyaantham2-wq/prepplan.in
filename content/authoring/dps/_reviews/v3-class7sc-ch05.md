# Review v3: DPS bank, CBSE Class 7 Science, Curiosity ch 5 (gecu105), Changes Around Us

File: content/authoring/dps/class7sc/ch05.json (reworked after v2; file mtime 05:24, v2 written 05:01). Read against content/extracted/gecu105/pages/001-016, the latest prior review v2-class7sc-ch05.md, and the dps-question-style skill.

Read: all 141 questions (7 concepts: 20, 20, 20, 20, 20, 20, 21). No sampling. The chapter was rewritten, not patched: v2's 151 items are now 141, and v2's item numbers no longer apply.

Numbering: "5.n #k" is the 0-based position k of the question within concept n of the file (concept 1 = C7SC-5.1 and so on).

## Verdict: PASS (HIGH 0, MEDIUM 5, LOW 11)

## Checks run in code
- Step marks equal `m` on every item with steps: 0 mismatches.
- MCQ options: all four distinct in every item. The correct option (index 0, shuffled at load) is never the strictly longest in any real MCQ (the only "longest" hits are AR/MS option lists, where length is not a signal).
- No option named by position anywhere (regex over stems, answers, steps).
- fill_blank answers all within four words (7 items: 0, 5, oxygen, heat, 2, 2, 40).
- Per-concept mix: 4-5 scenario MCQ, 1 multi_statement, 1 assertion_reason, 8 one-mark (9 in 5.7), 5 two-mark, 3 three-mark, 2 five-mark, 2 four-mark case studies. Meets the table. match in 5.1, 5.2, 5.4, 5.6, 5.7 (5); true_false in all 7; fill_blank in all 7. Remember/Easy: none. Bloom Analyse+Evaluate+Create is well over 30% everywhere.
- Verdict mix: true_false 3 True / 4 False (5.2, 5.4, 5.6 True); claim_check 3 No (5.2, 5.3, 5.5), 2 Yes (5.4, 5.7), 2 partly right (5.1, 5.6). Both inside the required mix.
- multi_statement keys: "I and III", "II and III", "I and II", "III only", "II only", "I only", "None of the three". False statement position varies. All three-statement, as the skill requires. assertion_reason covers all four outcomes (A false/R true 5.1; both true, R explains 5.2, 5.5; both true, R does not explain 5.3, 5.6; A true/R false 5.4, 5.7).
- Every key recomputed by hand or in code (arithmetic: 5.2 #18 X 4x20+25=105, Y 5x14+25=95; 5.3 #18 3x450=1350, 3x300=900; 5.4 #17 rate 1 deg/s, 30+100=130; 5.4 #18 (340-300)/10x20=80 s and 340-5=335 at 10 s; 5.5 #19 40-28-5=7; 5.6 #19 4x52=208, 208x105=21,840, 12,000/2-12,000/4=3,000, 21,840-3,000=18,840; 5.7 #7 60/1.5=40; 5.7 #19 90/2.5=36). All correct. All 7 assertion_reason and 7 multi_statement truth values re-derived from the pages and hold.

## v2 findings: status
- Both v2 HIGHs are gone. 5.6 old #3 (two qualifying pairs) is replaced by a new item whose four options have exactly one both-reversible pair (steam condensing + ice melting; the other three pairs are mixed or both irreversible). 5.6 old #4(c) ("the chapter's example of a chemical change") no longer exists.
- Fixed: baking-soda-in-plain-water is no longer used as a key fact anywhere; the glowing-iron-nail item is gone; the 5.5 all-true statement item now has two false statements; "reversibility is not the test" is asked once (5.1 #0 plus the claim in #13 is a different point); the 74% easy-in-disguise rate fell to roughly a third (see MEDIUM 5); true_false True items now include misconception tests; fill_blank items are now computed or reasoned (counts remain, see LOW).
- Not fixed: Maths-style template risk is small now, but "Decide ..." as the last part of all 14 case studies and "Do you agree? Give reasons" for all 7 claim-checks remain (LOW).

## MEDIUM
1. 5.3 #3 (Zoya, "short magnesium ribbon inside a tightly closed glass jar of air", key: burns only until the oxygen is used up). The chapter shows only that a covered candle stops after some time. A short ribbon in a jar of air usually burns away completely before the oxygen runs out, so the key rests on an unstated assumption and a student who reasons "the ribbon is short and is all used" is not wrong. Fix: use the book's own candle, or say a long coil of ribbon.
2. 5.6 #16(b) ("Which two are the same kind of change but need opposite decisions?", key: kitchen waste in the pit and food spoiling on the shelf). Milk turning into curd (desirable) and food spoiling (undesirable) are also the same kind of change (decay by microbes), and rusting (undesirable) and compost (desirable) are both chemical changes. Several pairs defensible. Fix: ask "which two are the same process of decay but need opposite decisions" and drop curd from the list or state the pair needed.
3. 5.5 #19 (Sneha's candle, 40 g, 28 g, ring of 5 g). It is not stated whether the 28 g includes the hard-wax ring. If the ring is part of the 28 g the burnt wax is 12 g, not 7 g. Fix: say "the candle itself weighed 28 g and the ring, collected separately, weighed 5 g". The mother's claim is also a strawman, though the wax arithmetic is the real task.
4. Repeated ideas (more than the "about twice" limit): 5.1 uses crushed chalk in 6 of 20 items (#0, #7, #8, #16, #17, #19); 5.3 uses blanket/synthetic cloth in 4 of 20 (#6, #11, #14, #18) and a covered flame / closed air supply in 4 more (#3, #16, #17(S), #19). Replace two of the chalk items (for example a different size change such as tearing paper or breaking a stick) and fold #14 into #11.
5. Residual easy items, about 50 of 141 (35%), mostly 1-2 marks, resolve to one book line or a one-step sort: 5.1 #2, #7 (answer 0 from the stem), #8, #9, #11; 5.2 #1, #5, #6 (2+3 read off the stem), #7, #10; 5.3 #1, #4, #7 (oxygen), #9 (oxide colours), #12; 5.4 #1, #6, #7, #9, #11 (a); 5.5 #2, #4, #7, #8, #10, #17; 5.6 #1, #2, #6, #7, #10 (6 x 30), #12; 5.7 #2, #7, #8, #10, #12, #13. Down from 74% in v2, and the new items add a step or a decision, but 5.5 (thin concept, one paragraph) and 5.7 still lean on classification. Acceptable for loading; improve if time allows.

## LOW
- 5.2 #17 and 5.3 #18 and 5.5 #19 and 5.4 #19 and 5.7 #19: the last-part decision is close to a strawman (cold: use the plan where nobody blows; synthetic blanket costs less but the book says never; mother says candle burning is reversible; a match for a log; wait thousands of years for silt to harden). Each is still a usable decision, but a real two-sided choice exists only in 5.4 #18, 5.6 #18 (move or close the pit) and 5.5 #18 (arguably).
- 5.3 #18: both blanket types fit the Rs 1500 budget, so cost never forces a trade-off.
- 5.3 #5 header says "burning and rusting" but no statement is about rusting.
- 5.7 #5 (all three false, key "None of the three"): the option that is not a list is identifiable by shape alone. Make one statement true.
- 5.4 #17 (b) asks the student to name the temperature; the step says "ignition temperature" and the key never gives 180 degrees C. State both.
- 5.3 #16 (d) wording "the candle uses only half the air in B" is unclear; reword as "the flame in C needed half as much air as in B" or similar.
- 5.2 #6, 5.5 #7, 5.6 #6: fill_blank counts read off the stem; 5.6 #6 also counts "steam condensing" as reversible while its original (steam) is arguably not a thing one "gets back" (5.6 #0 uses the same pair).
- 5.3 #7: fill_blank answer "oxygen" is a name from the page (p.63 says "air"; accept "air" in the matcher).
- 5.6 #3: "boiling water in an open pan" reason is the author's inference; the book (exercise 2) leaves it open. Other options are clearly wrong, so the key stands.
- 5.7 #4: "downstream pebbles have been rubbed for longer" goes slightly beyond p.68 (which says pebbles are smoother due to constant erosion); the other options are clearly wrong.
- 5.4 #3 distractor "None, it only changes the wind" is weak.
- 5.1 #19, 5.1 #18 (Job 3 includes burning wood, so it is obviously off the list; the poster's "three stalls" excludes the diyas, so the key depends on counting the diyas, which the stem asks for).

## Good items (keep)
5.1 #3, #5, #6, #17 (misconception-based, one defensible answer); 5.2 #0, #8, #13, #16, #18; 5.3 #0, #13; 5.4 #0, #2, #4, #8, #15, #16, #18; 5.5 #3, #12 (claim with a real confusion), #13; 5.6 #0 (single both-reversible pair), #17, #18; 5.7 #3, #5, #14.

## Scope
No item needs a figure; no scope_out violation. No facts beyond this book are used as keys, apart from the small inferences in LOW. The "stray `rev: true`" on three items is still present (5.3 #1 only now); confirm the loader ignores it.

## HIGH items
None.
