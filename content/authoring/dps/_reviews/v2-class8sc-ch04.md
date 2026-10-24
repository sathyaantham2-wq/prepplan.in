# Review v2: class8sc ch04 (SCI8, hecu104) "Electricity: Magnetic and Heating Effects"

Pack: content/authoring/dps/class8sc/ch04.json. Read: 125 of 125 (4.1 = 20, 4.2 = 21, 4.3 = 20, 4.4 = 22, 4.5 = 21, 4.6 = 21).
Method: every key decided before reading it, every number and case-study part recomputed in python, every fact checked against pages 46-59 of hecu104. Question index [n] is 0-based within the concept.

## Headline checks (the ones the caller named)
- Electromagnet hook / power cut: C8SC-4.3 [7] key is "the rods fall" (field disappears when current stops). Correct. [2] (A true, R "stays magnetised for a few minutes" false) correct. [13] and [15] also treat loss of load on supply failure correctly. No item says an electromagnet holds a load after the current stops. NOT a HIGH.
- Weak cell gives smaller deflection (4.1 [1b], 4.2 [5], [16b], [17]): supported by pp. 49-51 ("cell may weaken quickly", "single cell small current, weak field"). Accepted. [1b] says "slowly becomes smaller" with no cause given in the stem; defensible but see MEDIUM M1.
- Dry cell more convenient than Voltaic (4.6 [4], [12], [17]): book p.57 says Voltaic cells "are not convenient for everyday use". Supported.
- Torch cells cap to zinc base (4.6 [16]): inferred, see MEDIUM M6.
- All arithmetic correct: 4.3[3] 9000 kg, 15 lifts, 8 h vs 2 h 45 min; 4.3[8] 32 loads x 450 = 14400; 4.3[18] 72 min; 4.4[3] rises 7, 20, 1 C; 4.5[5] 10 electrodes; 4.6[3] 50 %, 6 and 3 days; 4.6[10] 32 cells; 4.6[14] 28,800 / 7,500 / 21,300 / 1,440 vs 60; 4.6[18] 9 pairs.
- Step marks equal item marks everywhere; correct option is o[0] everywhere with no duplicate option; no option named by position anywhere.

## HIGH
None found. No wrong key, no second defensible answer that overturns a key, no arithmetic or fact error against the pages.

## MEDIUM

M1 (4.1 [1b], short_answer 2) "The needle's deflection slowly becomes smaller, though nothing has been moved. Give a reason based on the chapter." Answer key is only the weak-cell chain. Fine for the book but a student could also say "the wire heats up" (the book has heating of the wire, p.52) and not be wrong. Fix: add "the wire stays cool to touch" to the stem, or accept both in the mark scheme.

M2 (4.1 [13], case study) (c) "Explain the odd result of Trial 5" is answered by the stem's own sentence "one wire had slipped off the cell holder". (d) "Decide whether the record supports both halves" has an obviously-Yes answer, so it is a strawman decision. Fix: remove the slipped-wire sentence from the stem (let (c) be deduced from "ON, nothing between, needle unmoved"); make (d) a real call, e.g. "Rohini also wants to add 'and a thicker cover gives a weaker effect'. Does the record support it?" (answer: no, thickness was never varied).

M3 (4.2 [13], case study) (a) "Explain why 'South' is correct for end A" is fully given by the stem sentence "Unlike poles attract" plus the table; it needs no chapter. (d) paint-permanent-labels is a clear No (not a trade-off). Fix: drop "Unlike poles attract" from the stem (it is in the book, p.51), and give (d) a genuine cost, e.g. labels are wanted for a demonstration where the cell is fixed in a holder.

M4 (4.2 [0], case study) (d) "Decide which magnet to build" has one obvious answer (combine all three factors). Not a trade-off. Fix: add a limit, e.g. the cell weakens if kept ON, so the last trial must be one short connection; ask whether to use 2 cells or 100 turns when only ONE of the two is available.

M5 (4.3 [3], case study) (a) and (b) are answerable from the stem alone (the stem already says the rest is non-magnetic and gives 600 kg per lift); the chapter is needed only in (d). (d) Plan Y beats X by 5 h 15 min, so it is a strawman decision. Fix: add a real counter-factor to the data (e.g. the magnet's 15 lifts need an operator costing more per hour, or the crane is booked for only 30 min) so the numbers decide.

M6 (4.6 [16]) "Which arrangement lets current flow through both cells? ... cap of one cell touches the zinc base of the other". The book (p.57) gives the cap = positive and zinc container = negative, but nowhere states the series rule (unlike terminals join). Needs a fact the pages do not give. Fix: add to the stem "cells in a battery are joined positive terminal to negative terminal", or replace with "which end of the torch cell is positive".

M7 (4.4 [14], case study) Decision (a) "which wire and how many cells" is the book's own answer (nichrome, two cells) with no trade-off, and (b), (c) restate it. The parts do not climb. Fix: make the trade-off real (two cells heat faster but the cells run down; 1 h period; ask which wire AND how long to keep the switch ON, with a short table).

M8 (4.4 [3], case study) (a) is plain subtraction answerable from the stem; (b) uses the fair-test idea well; (c) is good. Parts (a) and (b) climb poorly. Fix: add a fourth reading, e.g. "nichrome 0.6 mm thick, 1 cell: 31 C", and ask what comparing it with A shows (thickness; book p.53).

M9 (4.5 [13], case study) (a) "State the rule for joining lemon cells into a chain": the book text does not state this rule, only "Join the copper wires and nails as shown in Fig. 4.8b" (a figure). The copper = positive fact is only in an "A step further" box (the stem supplies it, fine). (d) The stem states the answer ("lemons are old and nearly dried out", "LED glows on a fresh dry cell"), so the decision is a strawman. Fix: put the joining rule in the stem as data (a worked joint) and ask (a) to find the fault; in (d) remove "old and nearly dried out" and let the student infer it from the LED test.

M10 (4.5 [6], case study) (d) "P's LED very dim, same LED glows brightly on R: replace lemons or LED?" Answer is given by the evidence in the stem; not a decision. Also (b) leans on "pure distilled water" failing, which the book never says (p.55: electrolyte "usually a weak acid or salt solution"); it is fine here because the table supplies the result, but see M11. Fix: make the (d) data ambiguous (LED also dim on a fresh dry cell?) or accept as a diagnosis item and label marks accordingly.

M11 (4.5 [3] Statement 2) "Pure water would work better than lemon juice as the electrolyte because it is cleaner." The book never states pure water fails as an electrolyte (only that the electrolyte is usually a weak acid or salt solution). The falsehood hinges on a fact outside the pages. Fix: reword S2 so the book decides it, e.g. "Any liquid at all, even cooking oil, would work equally well as the electrolyte".

M12 (4.6 [3], case study) (a) and (c) are percentage and division from the stem (no chapter); (d) is a strawman ("the battery is dead, just like a used-up dry cell, so throw it away"). Fix: give the cousin a defensible claim ("buy a new battery now, it is worth it") and ask the student to decide using the table with a cost figure.

M13 (4.6 [14], 5 marks) (a)-(d) are 4 marks of pure arithmetic from the stem; the chapter is used only in (e), where the 5th mark is a stock "they wear out" answer. Thinking per mark is low for 5 marks. Fix: replace (c) or (d) with a chapter-based reasoning step (e.g. what happens to the saving if the batteries wear out at 1 year).

M14 Easy in disguise (answer is a one-line fact on the page), whatever the Bloom label. Rewrite each to need a chain or a choice:
- 4.1 [3] assertion-reason: R is just the definition and A restates it (both true, R explains) - identical content.
- 4.1 [8] mcq: "magnet and current-carrying wire have in common" = both have a field (book definition p.48).
- 4.1 [10] mcq: "which device does NOT use the magnetic effect" = the kettle; the book lists bell, fan, loudspeaker in one line (p.49).
- 4.3 [16] mcq: "coiled nail becomes a magnet only while current flows" (p.47 story).
- 4.4 [4] fill_blank: "copper coil instead of nichrome: ___ heat" = one sentence on p.53; also "less" has natural equivalents ("lesser", "lower", "smaller").
- 4.4 [5] mcq and [21] mcq: pick the heating-effect example / name the heating element.
- 4.5 [9] mcq: current flows from positive through the lamp to negative (p.55 sentence).
- 4.5 [14] mcq: iron nail + copper wire as electrodes.
- 4.5 [16] short_answer: define electrode vs electrolyte with one example each.
- 4.6 [0], [2], [12] mcq/true_false: a cell generates current chemically; "dry" means paste; dry cell is easier to use.
- 4.6 [17] short_answer: Voltaic vs dry cell (liquid vs paste, not convenient vs widely used) - the book states it in two adjacent sentences.
- 4.6 [20] short_answer 3 marks: "three reasons for the trend" are the book's list.

M15 Repeated ideas inside concepts (limit is about two per concept):
- 4.6: rechargeable vs single-use asked in [6], [8], [9], [11], [14], [15], [18], [19], [20] (nine items). Dry vs Voltaic convenience in [4], [12], [17].
- 4.5: LED polarity in [4], [6c], [13c], [17] (four); electrode/electrolyte/chemical-reaction/"dead" restated in [1], [11], [12], [15], [16], [18].
- 4.4: "heat depends on the current (one cell vs two)" in [0 S2], [2], [12b], [14c], [18]; nichrome vs copper resistance in [0], [3], [4], [7], [10].
- 4.2/4.3: reversing the current swaps poles but not strength in 4.2 [4], [15], [20], 4.3 [17b]; "cell weakens if left connected" in 4.1 [1b], 4.2 [5], [16], [17], 4.3 [9], [12], [14]. Across the chapter this is a repeated idea; keep one or two per concept and cut the rest.
Fix: replace the surplus items with ideas not yet used (e.g. 4.6: difference between a cell and a battery of several cells; 4.4: thickness/length effect with data; 4.5: why the LED needs correct polarity but a bulb does not, only if the book says it - it does not, so skip).

M16 5-mark "justify in five points" items are mostly the book's list restated: 4.2 [11], 4.4 [11], 4.5 [11], [15], 4.6 [9]. Each point is one stated fact, so they test memory and marks are earned by listing. Fix: give each a short data set or a situation so that points must be chosen, or lower to 3 marks.

## LOW

L1 (4.4 [1]) "low-voltage evening" and "supply": voltage is not in this book. Key "smaller current produces less heat" is right but the stem never says the current is smaller. Reword to "the supply is weak, so less current flows" or ask what changed.
L2 (4.4 [2]) Correction says resistance depends on "material, thickness and length"; p.53 says the heat depends on those; resistance for same size/length is the only book statement. Fine, but avoid "resistance depends on thickness and length".
L3 (4.4 [7b]) "nichrome poor choice for supply wires": book only says transmission wires lose energy; the nichrome/copper contrast for supply wires is an inference. Acceptable; mark scheme should allow "copper has less resistance".
L4 (4.5 [1], [20]) zinc rod/copper rod and dilute acid come from the "A step further" box (zinc/copper pairs). The stem supplies them so it is answerable, but it leans on out-of-scope material; use iron nail and copper wire like the book's activity.
L5 (4.5 [7], [20]) pulling an electrode out breaks the chain / lifting rods out switches the bulb off: sensible and single-answer, but the pages only show the intact set-up. Acceptable.
L6 (4.2 [2]) R "Electromagnets are used in devices such as electric bells and loudspeakers": p.49 says the magnetic effect has applications in electromagnets, bells, motors, loudspeakers, not that electromagnets are in bells. Reword R to "The magnetic effect of electric current is used in devices such as electric bells and loudspeakers".
L7 (4.2 [8], [9]) "a bar magnet cannot change strength or poles" and aluminium being a conductor rely on Grade 6/7 knowledge, not this chapter. Acceptable as prior learning; state in the stem if wanted.
L8 (4.4 [14]) sets a Class 6 student to heat a nichrome wire to melt thermocol. The book requires teacher supervision; add "under supervision".
L9 (4.1 [14]) household wires carry alternating current, which will not hold a steady compass deflection; the item treats them like a cell circuit. Fine within the book, but "a battery-powered model wiring panel" would be safer.
L10 (4.6 [1] match) "the small bump on top" is not a book term; use "metal cap" wording consistently or describe by function.
L11 Slot clustering: in all six concepts the 4- and 5-mark long answers sit in positions 11-15 and the run ends with short_answer/mcq; the opening 3-4 items are similar (assertion/mcq/short). Mild, not a template, but vary the placement in the next pass.
L12 Weak distractors: 4.4 [21] (o1 "electromagnet that pushes warm air", o2 "dry cell that stores heat") and 4.1 [10] (the other three are all clearly the book's own list) are not real chapter confusions.

## Template counts
- Types: short_answer 47, mcq 30, long_answer 27, multi_statement 6, assertion_reason 6, fill_blank 5, match 4. true_false is carried as a tag on six short_answer items (one per concept), 3 True / 3 False, each resting on a real misconception (copper not magnetic; "only more cells"; warm coil; resistance from cells; lemon makes electricity; "dry" cell). Mix is good.
- Claim-check verdicts: 7 items (4.1 [7] partly, 4.2 [10] yes, 4.3 [6] wrong, 4.4 [9] yes, 4.5 [8] wrong, 4.6 [8] partly, 4.6 [19] wrong): wrong 3, yes 2, partly 2. Mix acceptable (a little high on "yes" given the standard; 4.6 has two claim-checks about dry/rechargeable cells).
- multi_statement keys (6): 1 and 3 / all three / 2 only / 2 and 3 / 1 only / 1 and 2: all different. False statement position spreads (S2, none, S1&S3, S1, S2&S3, S3).
- assertion_reason (6): explains 2, not-explain 2, A true R false 1, A false R true 1. Good spread.
- Correct option longest: 4 of 46 option items. Not systematic. Correct always o[0] (loader shuffles); no key equal to a wrong option.
- Bloom: Analyse 63, Apply 30, Evaluate 20, Understand 7 (5.6 %), Create 5. No Remember, no Easy. Analyse+Evaluate+Create = 70 %. Thinking-label is higher than the real demand on the M14 items.
- Fill-blank (5): 4.2 [4] south, 4.3 [8] 14400, 4.4 [4] less, 4.5 [5] 10, 4.6 [10] 32. Four are good application with one machine-matchable answer; 4.4 [4] is the weak one (recall plus natural equivalents).
- Slot order: not a copy-paste template (positions differ per concept), but the 4/5-mark cluster in the second half and the closing mcq/short run repeat across concepts (L11).
- Scope: nothing taken from Oersted, Earth's magnetism, steel furnace, Li-ion, solid-state, motors/generators, or diagram labelling. Only L4 and M9 touch material from an "A step further" box (copper positive), supplied in the stem.

## Verdict per concept
- C8SC-4.1: pass after fixes (M1, M2, M14, L9). No wrong key.
- C8SC-4.2: pass after fixes (M3, M4, M15, M16, L6).
- C8SC-4.3: pass after fixes (M5, M6 not here, M14, M15, M16 minor). No wrong key; power-cut item correct.
- C8SC-4.4: pass after fixes (M7, M8, M14, M15, M16, L1, L8).
- C8SC-4.5: pass after fixes (M9, M10, M11, M14, M15, M16): most repetition and the two strawman decisions.
- C8SC-4.6: pass after fixes (M6, M12, M13, M14, M15): heaviest repetition and easy-in-disguise load.

Counts: read 125; HIGH 0; MEDIUM 16 items (M1-M16, covering about 45 questions); LOW 12.
Chapter verdict: PASS AFTER FIXES. Not templated in structure, but repetitive in ideas (rechargeable vs single-use, LED polarity, heat vs current, cell weakening) and has six strawman or stem-answered case-study decisions that should be rewritten.
