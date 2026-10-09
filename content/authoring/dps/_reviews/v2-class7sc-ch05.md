# Review v2: DPS bank, CBSE Class 7 Science, Curiosity ch 5 (gecu105), Changes Around Us

File: content/authoring/dps/class7sc/ch05.json (rewrite). Read against content/extracted/gecu105/pages/001-016 (printed pp.57-72), scope content/authoring/class7sc/ch05.json (scope_out: "Exercises needing figures"), the previous DPS review class7sc-ch05.md and the v1 backup.

Read: all 151 questions (7 concepts: 22, 22, 21, 21, 21, 22, 22). No sampling. Findings are appended concept by concept below, then a summary, then the EASY LIST.

Text-identical to the v1 backup (same `q` stem text): 116 of 151 (77%). 35 items are new or reworded.

---
## Per-concept findings (appended as reviewed)

### C7SC-5.1 (22 items; 17 identical to backup)
Keys: all 22 recomputed/checked against pp.58-59; no wrong key, no second answer. fill_blank #7 = 1 (only burning wood) correct.
- MEDIUM, repeated idea: "physical changes need not be reversible / reversibility is not the test" is asked three times: #1 (chalk, true_false), #8(d) (brother), #20(d) (Rahul and Priya). Also the same four/five-item classification list (boiling, chopping, drying, burning, melting) is used in #3, #6, #7, #14, #22. Replace #8(d) and #20(d) with a different decision (e.g. a borderline case such as dissolving or a change both physical and chemical that the learner must reason on from the new-substance test), and make #7 count a list not already used.
- MEDIUM, easy in disguise (see EASY LIST): #3, #4, #5, #6, #9, #10, #11, #13, #14, #15, #16, #18, #19, #21, #22 are all "is X physical?" with the book's own examples (Table 5.1 / Activity 5.2 / p.59 list). The concept has almost no item where the learner must meet a case the book did not name. 
- LOW, #4 carries a stray key `rev: true` (extra field, harmless if loader ignores it); confirm loader accepts it.
- LOW, #18: "Name the two senses ... sight ... smell" - the stem already says "dark spots" and "smells stronger", so the key is read straight off the stem; also the banana example of p.57 reskinned.
- LOW, #17: Farhan claim is wrong (a "claim is wrong" frame, see claim-check mix below).
- Options: #3, #4, #19, #22 correct option is NOT the longest (checked in code, see summary).

### C7SC-5.2 (22 items; 17 identical to backup)
Keys all consistent with pp.60-61; no arithmetic. fill_blank #1 = B, #9 = 3 are correct and machine-matchable.
- MEDIUM, fact the book does NOT state: "baking soda with plain water gives no bubbles" is used as a key fact in #2(b), #3 (option logic), #17 (D "No bubbles are seen") and #22 (the ONLY false statement II rests on it). On p.61 the book only poses it as a question ("Do you observe any bubble formation? Is this a physical or chemical change?") and gives no answer. It is scientifically fine but Science items must follow this book. Fix: keep it in at most one item and phrase it as "predict, and say what you would check", or change #22's false statement to one the book settles (e.g. "Water is the only product when carbon dioxide reacts with lime water" - book says calcium carbonate plus a small amount of water, so a changed false statement such as "No new substance is formed when exhaled air meets lime water").
- MEDIUM, repeated idea: 19 of 22 items are the same lime-water-and-breath experiment (#1-#10, #13-#15, #17-#22). The word equation is asked in #2(c), #10(a), #13, #20 (implicitly), #21(d). #6, #7, #8 make the same point (tap water bubbles only, lime water milky). Replace two or three with different applications (e.g. a candle burning under a tumbler tested with lime water, p.63; yeast project p.72 is out of the chapter text so avoid; baking-soda comparison as 'which of three gases' data item).
- MEDIUM, strawman decisions: #2(d) "Aarav suggests plain water in place of lime water" (obviously no) and #4(d) "wants to blow into cup A twenty times to make it turn milky" (obviously no). Fix: make the last part a real two-sided choice, e.g. two students propose different tests for the same unknown gas and the learner must say which test discriminates.
- MEDIUM, easy in disguise (EASY LIST): #1, #5, #7, #8, #9, #10, #11, #12, #13, #14, #15, #16, #17, #18, #19, #20, #21 and the lookup parts of #2/#4. #19 is a two-fact recall (gas, new white substance) at 2 marks; #5 and #16 are Activity 5.4 word for word.
- LOW, #9: counting fill_blank (three of six) is answerable from the stem alone; not application of the chapter.
- LOW, #2 stem mixes two set-ups (Aarav "repeated the activity with baking soda and plain water" and then wants plain water in the second bottle); reword so the two roles are separate.
- Previous HIGH (milky vs calcium carbonate) is fixed: #19 now asks for "the new white substance ... that makes the liquid look milky" which matches p.60.

### C7SC-5.3 (21 items; 17 identical to backup)
Keys checked against pp.62-63; no arithmetic. fill_blank #15 = oxide matchable.
- MEDIUM, possible second answer / unsupported key: #16 "heats an iron nail in a flame until it glows red and then cools it ... Merely heating the nail to glowing without it reacting is not combustion". The stem never says the nail does not react, and a red-hot iron nail in air does oxidise; the book never discusses it. A student who calls it a reaction with oxygen giving heat and light can defend option "Burning the candle and heating the nail" or the nail+magnesium pair. Fix: replace the nail with a clearly non-reacting source of heat and light (an electric heater element glowing, a torch bulb lit) so exactly one pair is combustion.
- MEDIUM, #1(d): "burning the ribbon inside a tightly closed glass jar ... not a good plan ... the burning would stop." The book shows only that a covered candle goes out "after some time"; magnesium would still burn vigorously until the jar's oxygen is used, and the stated purpose (nobody near the flame) is met. A defensible "yes it is fine for the demonstration" exists. Fix: ask for a prediction ("Will the ribbon keep burning indefinitely? why") or change the jar plan to something the book settles.
- MEDIUM, #15 fill_blank "magnesium ___" -> oxide: a name copied from p.62, which section 12 forbids for fill_blank ("never a name copied from the page"). Fix: make it a derived value, e.g. "A candle covered by a tumbler burns for 12 s, a larger tumbler for 20 s; the component of air used up is ___" is also recall, so better: "Of fuel, oxygen and heat, the one removed when a blanket is wrapped round burning clothes is ___" (answer: oxygen/air).
- MEDIUM, repeated idea: covered-candle / air-supply reasoning in #9, #10, #13, #14, #17(a,b), #20; magnesium equation in #1(a), #12(a), #18(a); firefly in #2, #7, #11, #17(c); cloth-on-fire in #8, #17(d). Replace #13 and #9 (near duplicates) with new settings.
- MEDIUM, easy in disguise (EASY LIST): #2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13, #15, #18, #19 and the lookup parts of #1 and #17. #11 ("What is bioluminescence? Name one living thing") is a definition at Understand level.
- LOW, #17(d): "synthetic is lighter, cotton heavier" is a strawman trade-off; the book says "never" for synthetic. Make the weight or availability trade-off real (e.g. only a thin cotton sheet vs a thick wool-synthetic blend of unknown fibre) or drop the decision to a justification only.
- LOW, #20 is a good prediction item but "large tumbler lasts longer" is the author's inference from p.63 (acceptable; state 'because it holds more air' in the step, which it does).
- #14 (AR, R true but not the reason) is a sound analytical item; no change.
- Statement item #21: I true, II true, III false; key "I and II only".

### C7SC-5.4 (21 items; 17 identical to backup)
Keys checked against pp.63-64; no arithmetic beyond fill_blank #10 = 2 (fuel and heat remain; correct, matchable).
- MEDIUM, repeated idea: the magnifying-glass / sunray activity is the setting of #4, #5, #6, #9, #11, #12(b), #15, #21 (8 items); "match is hotter than the ignition temperature of paper" is the answer of #1, #7, #11(b), #14 (4 items, one of them a verbatim true statement as a True/False). Kadhai fire: #13, #18, #19. Cut #14 and #7 or change #7 into a False item (see below); #6 and #21 are the same observation asked two ways.
- MEDIUM, #7 true_false: the "True" statement is the book sentence word for word, so there is no misconception to catch. Fix: make it False, e.g. "Paper catches fire in the sunray spot because the spot supplies the oxygen the paper lacks", or keep True only if the reason demands a step the book does not hand over (e.g. using a stone vs paper under the same match).
- MEDIUM, #11 (d): key "Either can be allowed" is non-committal, so the 'decision' is not marked on a decision; and the step line (b) misspells "matchsticks hotter" (should be "the match is hotter"). Fix: key one choice with its precaution, accept the other only if justified.
- LOW, #13(d) and #17: strawman options ("carry the burning kadhai outside"; "stones block the air", "a match is too cool for any substance").
- MEDIUM, easy in disguise (EASY LIST): #1, #2, #3, #6, #7, #9, #10, #12, #14, #15, #16, #17, #18, #21. #12 asks the three sides of the fire triangle (a one-line book fact at Understand level); #2 is a four-line match of the book's definitions.
- Good: #4 (R false: focusing lowers ignition temperature) and #8 (four trials) need the chapter; #5 is a fair claim-check with a true verdict.
- #20 MS: I true, II false, III true; key "I and III only".

### C7SC-5.5 (21 items; 18 identical to backup)
Keys checked against p.65; fill_blank #14 = 1 is correct and matchable. No wrong key found. #1 (P and R, physical before the flame) is unique: Q is not offered in a pair with another physical change, S is chemical.
- MEDIUM, this is the thinnest concept in the book (one paragraph, one figure) and it is stretched to 21 items: "the vapour burns, melting and evaporation are physical" is the answer of #2, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13, #14, #19, #20, #21. The same fact gets re-asked in new clothes. Cut at least six (suggest #4, #8, #14, #20, #21, #6) and replace with items needing a new situation (e.g. a candle burning in an enclosed space linked to 5.3/5.4, a data table of wax mass before and after, a lamp using oil-soaked cotton wick vs candle).
- MEDIUM, #21 multi_statement: all three statements are true (key "I, II and III"). With no false statement to detect, it is a recall check; it also breaks the pattern of the other concepts only to the extent of being weaker. Fix: make one statement false (e.g. "The solidifying of wax drops is a chemical change because the wax cannot be reused").
- LOW, #10 Imran "the wick itself is what burns" marked simply wrong; in real candles the wick burns slowly too and the book only says wax is carried up the wick. Reword to "Imran says the flame is produced by the wick alone" and key "wrong: the flame is the burning of wax vapour".
- LOW, #5 (b) and (c) have the same answer (vapour burned); the parts do not climb. Make (c) the mass argument (shorter because wax is used up as vapour burned, new substances escape as gases).
- LOW, #6 and #11 both ask "both kinds of change" in plain form; the claim-check #7 and TF #3 and #10 evaluate the same "vapour burns" claim.
- MEDIUM, easy in disguise (EASY LIST): #2 (a)-(c), #4, #6, #7, #8, #9, #11, #12, #13, #14, #15, #16, #17, #18, #19, #20, #21. Eighteen of 21 items resolve to "melting/solidifying/evaporation physical, burning vapour chemical".
- Good: #1 (ordered notes, physical before the flame) and #3 (False; solid wax does not burn directly) rest on a real confusion.

### C7SC-5.6 (22 items; 20 identical to backup)
- HIGH, #3 (scenario MCQ, "Which pair of these actions includes one reversible and one irreversible change?"): option "Chopping onions; refreezing melted ice" is ALSO one irreversible (chopping) plus one reversible (refreezing/melting) change, so two options qualify. The key rationale "Each other pair is both reversible or both irreversible" is false for that option. Fix: replace the distractor "Chopping onions; refreezing melted ice" with a pair that is both reversible or both irreversible and uses only actions named in the stem (the stem names condensing steam, chopping onions, popping corn, so only the pair "popping corn; chopping onions" is both-irreversible and already present as option 2); add a fourth action to the stem (for example "ice melting in the glass") and use "Condensing steam; ice melting" for the both-reversible option.
- HIGH, #4(c) "Which change is the chapter's example of a chemical change?" (key: Rusting). The list also holds kitchen waste turning to compost, milk to curd and food spoiling, all chemical changes in real science (the book asks curd and compost as exercises 3(iii), 6, 8 without answering them in text). A student answering "curd" or "food spoiling" is right and loses the mark. Fix: ask "Which one of these is named in the chapter as a chemical change in section 5.3?" or tell the student to answer for the gate only.
- MEDIUM, #1 true_false is True and restates p.66 ("when water evaporates, it can be condensed back into liquid water"); no misconception is tested. Fix: make it False, e.g. "Because chopped vegetables are still vegetables, chopping is a reversible change", with the correction that the size and shape cannot be got back.
- MEDIUM, #20 is labelled Evaluate / Hardest / 5 marks but the key is two sentences lifted from p.67 plus an open suggestion (2 marks free). Same content as #9. Remove one of them; give #20 a real choice (rank three school measures by how much they reduce fuel use and justify).
- MEDIUM, repeated idea: decay is bad in storage and good as compost in #2, #4, #8, #12, #14, #15, #18, #21 (8 items); reversible/irreversible kitchen lists in #3, #7, #10, #13, #17.
- LOW, #22(b) 4 x 52 = 208 (checked, correct) is arithmetic answerable from the stem with no chapter idea; (d) "reduces more of the burning-fuel effect" is nearly decided by its own wording. Fix: give petrol saved against another saving with a real trade-off, or ask the student to use 208 litres in a justification of weekly impact.
- MEDIUM, easy in disguise (EASY LIST): #1, #2, #5, #6, #7, #9, #10, #11, #12, #13, #14, #17, #18, #20, #21.
- Good: #8 (move the pit or close it) is a real two-sided decision; #16 (False; burning fuel is chemical and adds carbon dioxide) is a genuine misconception; #19 (R true but not the reason) is sound.
- #15 MS: I false, II true, III true; key "II and III only"; statement I ("can never be desirable") is false on its face, so the detection is easy.

### C7SC-5.7 (22 items; 20 identical to backup)
Keys checked against pp.67-68. #15(c) 2 cm x 15 years = 30 cm recomputed (correct). fill_blank #2 "iron oxide" is two words (within four) and matchable.
- MEDIUM, #8 true_false is True and is the book sentence ("Erosion during a landslide is an example of a physical change"); no misconception. Fix: make it False ("Erosion by a landslide is a chemical change because the rock is destroyed") or require the student to classify a case the book does not name.
- MEDIUM, #2 fill_blank "red colour is due to ___ ___" asks the name printed beside Fig. 5.10b (p.67). Section 12: "never a name copied from the page". Same fact again in #4(b), #17, #20, #21(b). Fix: make the blank a count or a derived value (e.g. years of silt for a given thickness at 2 cm a year), keep one basalt item only.
- MEDIUM, #15 case study: (a) and (b) are largely handed over by the stem ("river ... water brown with soil", "water slows ... where a layer of silt settles"), (c) is a one-step multiplication, and (d) rests on one reading; the climb is weak. #18 is a strawman: "bare steep slope with fast streams" vs "gentle slope beside a calm lake"; (a) and (d) have the same answer so 2 of 5 marks repeat one point. Fix: give each site a mixed profile (fast stream and tree cover vs gentle slope and bare soil) so the decision needs weighing.
- LOW, #21(d): "which place gives samples that best show erosion" - the landslide earth movement at the cliff base is also erosion per p.68, so "cliff base" is not clearly wrong; key says riverbed. Fix: ask "which place has samples showing the effect of long, constant erosion" or give the answer in the key as "riverbed (smooth pebbles); the cliff base shows weathering and a landslide".
- MEDIUM, easy in disguise (EASY LIST): #2, #3, #4, #5, #6, #8, #9, #10, #11, #12, #13, #14, #16, #17, #18, #19, #20, #21, #22.
- Good: #7 (AR with false reason) and the multi-statement #1 need a distinction (weathering vs erosion, reversible/not).
- #1 MS: I true, II true, III false; key "I and II only".

---
## Summary

### HIGH (2, both in C7SC-5.6)
1. 5.6#3: second correct option ("Chopping onions; refreezing melted ice" is also one irreversible plus one reversible change); key rationale "each other pair is both reversible or both irreversible" is false.
2. 5.6#4(c): "Which change is the chapter's example of a chemical change?" has several scientifically correct answers (compost, curd, spoilage as well as rusting); only rusting is keyed.

### MEDIUM (main ones, details in the concept sections)
- Easy in disguise: 112 of 151 items (74%) resolve to a fact or one-step classification the book states in a line (EASY LIST). 85 of these are unchanged from the backup, 27 are new items the rewrite added (5.1#4,#7,#13; 5.2#1,#9,#12,#13; 5.3#3,#4,#5,#15,#19; 5.4#3,#7,#10,#21; 5.5#12,#14,#15; 5.6#1,#11,#13; 5.7#2,#8,#10,#11,#16). The rewrite replaced the Remember items and added the new types, but did not change the thinking demanded of the unchanged items: 116 of 151 stems are text-identical to the backup (same question, options and key), and none of the 116 was re-levelled (0 Bloom/difficulty changes). "Differentiate ...", "Name ...", "Match ..." and "Classify the five/four listed changes" remain the dominant frames.
- New fill_blank items (8): #5.1#7 (count of 1), 5.2#1 (B), 5.2#9 (count of 3), 5.3#15 (oxide), 5.4#10 (2), 5.5#14 (1), 5.6#11 (2), 5.7#2 (iron oxide). All are one machine-matchable word/number (good), but none is the "computed value / reasoned term / rule applied" section 12 asks for: 3 are counts read straight off the stem (5.1#7, 5.2#9, 5.4#10), 2 are counts of facts the book states (5.5#14, 5.6#11), 2 are names copied from the page (5.3#15, 5.7#2), and 1 is a one-line observation (5.2#1). Rework to genuine application.
- New true_false items (9): verdicts 5 False / 4 True (44% True; inside the 25-75% window). The five False items rest on real misconceptions (reversibility = chemical; bubbles = chemical; rusting = physical; solid wax burns directly; fuel burning has no effect) and are good. All four True items (5.1#13, 5.4#7, 5.6#1, 5.7#8) restate a book sentence, so no misconception is tested. Fix by turning two of the four into False.
- Facts not in this book used as keys: baking soda in plain water gives no bubbles (5.2#2, #3, #17, #22; the book only asks the question on p.61); glass is non-combustible, iron nail glowing without reacting (5.3#19, #16).
- Strawman decisions remain in last parts: 5.2#2(d), #4(d); 5.3#17(d); 5.4#13(d); 5.7#18. Real two-sided decisions: 5.4#13, 5.6#8, 5.7#15 (partly), 5.4#11.
- Repeated ideas (counts): lime-water-and-breath experiment in 19 of 22 items of 5.2; sunray/magnifying glass in 8 of 21 of 5.4; vapour-burns/physical-vs-chemical in 15 of 21 of 5.5; decay-bad-in-storage-good-as-compost in 8 of 22 of 5.6; reversibility-is-not-the-test in 5.1#1, #8(d), #20(d); the Mg word equation in 5.3#1(a), #12(a), #18(a); the word equation for lime water in 5.2#2(c), #10, #13, #21(d).
- Case studies (14): all have four parts and step marks sum to 4 (verified for all 151 items: step marks equal `m` everywhere; no mismatches). Most (a)-(c) parts are single-line lookups from the book; the (d) decision is real in only about 4 of 14. Stems that give away parts: 5.7#15(a)/(b), 5.5#2(a)/(c) (type), 5.2#4(a).

### LOW
- 5.1#4, 5.3#19, 5.6#10 carry an extra key `rev: true`; confirm the loader ignores it.
- 5.4#11 step text "matchsticks hotter" typo; 5.5#10 wick burns in reality; 5.5#5 (b)/(c) same answer; 5.6#22(b) arithmetic only; 5.7#21(d) cliff base also erosion.

### Template check (counts)
- Correct MCQ option is strictly the longest in 7 of 32 MCQs (22%): 5.3#19, 5.4#3, #6, #21, 5.5#6, #15, 5.7#11. The previous 65% is fixed. Correct option exceeds the mean of the wrong ones in 13 of 32 (41%). No option carries an appended explanation (only a few distractors include "because", e.g. 5.3#8, #10, which is in the distractor, not an explanation of the correct one).
- Claim-check verdicts (7): 5 agree, 2 disagree (5.3 Dev, 5.6 Tara). The old "always No" is fixed; but all named speakers are in the same "X says ... Do you agree? Give reasons/an example" frame in 7 of 7 concepts.
- multi_statement (7): keys "II and III" (5.1, 5.6), "I and III" (5.2, 5.4), "I and II" (5.3, 5.7), "I, II and III" (5.5, all true, weak). False statement sits at I (5.1, 5.6), II (5.2, 5.4), III (5.3, 5.7). Spread is now fine; 5.5 has no false statement.
- assertion_reason (7): A false/R true (5.1), both true R explains (5.2, 5.5), both true R not explain (5.3, 5.6), A true/R false (5.4, 5.7). Good spread. Items 5.1#15 and 5.2#14 and 5.5#11 are nevertheless one-line recall.
- Slot order is no longer identical across concepts (22-item sequences differ), a clear improvement. But frames recur: "Differentiate between ..." in 6 of 7 concepts (5.1#21, 5.2#7, 5.4#1, 5.5#20, 5.6#5, 5.7#14); "Show that/why ... cannot" in 5 (5.2#8, 5.3#9, 5.4#15, 5.6#12, 5.7#5); "Write a short story/news item/record ..." create+reverse in 6 (5.1#2, 5.4#16, 5.5#16, 5.6#2, 5.7#9, 5.2#11); case-study stems end "Decide ..." in 14 of 14.
- Match items (5): all four-line recalls; the keyed option is always the first listed in the file (shuffled at load). Correct mapping ends "-D" in 5.1, 5.2, 5.4 (4-B). Vary.
- Option referred to by position ("option (b)"): none found in any answer, step or stem.
- Per-concept minimums met: scenario MCQ 3+ (3-5), MS 1, AR 1, one-mark 8+, two-mark 5+, three-mark 3+, five-mark 2 each, case studies 2 each. Chapter-level: match 5 (>=4), fill_blank 8, true_false 9. Bloom: Understand 18 (12%), Analyse+Evaluate+Create 84 (56%); Remember 0; difficulty Hard 123, Hardest 28, no Easy.
- Scope: no scope_out violation (no item needs a figure; Fig. 5.11 not used). No figure-tagged items. No item contains an unsupported equation.

### Per-concept verdicts
- C7SC-5.1: no wrong key; pass after fixes (replace ~10 lookup items, de-duplicate reversibility idea).
- C7SC-5.2: no wrong key; the no-bubbles fact is not in the book; rework 8-10 items; the lime-water experiment is over-used.
- C7SC-5.3: no wrong key but two arguable keys (#1(d), #16); rework easy items and the fill_blank.
- C7SC-5.4: no wrong key; weak True/False (#7); pass after fixes.
- C7SC-5.5: no wrong key; thin concept over-stretched; rework six items and the all-true statement item.
- C7SC-5.6: TWO HIGH (#3 second answer, #4(c) multi-answer); fix before loading.
- C7SC-5.7: no wrong key; many lookup items and a weak True; pass after fixes.

Overall verdict: REWORK of the easy items (not a rewrite of the chapter). Keys are almost all right (2 HIGH, both in 5.6), the new-type items and statement/AR spread are fine, the old systemic templating (slot order, always-No claim checks, correct-longest) is fixed, but the central requirement of section 12 ("no easy questions") is not met: 74% of items are one-line lookups, three-quarters of them unchanged from the backup.

---
## EASY LIST
Format: concept#position: reason. (concept = last digit of C7SC-5.n; position = item number in the file for that concept.)

5.1#3: classify four tuck-shop changes; only fact is burning wood is chemical (Table 5.1/p.59)
5.1#4: which activity forms a new substance; burning the wick (one fact)
5.1#5: match four book examples to one-line descriptions
5.1#6: sort five Table 5.1 changes physical/chemical and name property changed (5 marks of one-step sorting)
5.1#7: fill_blank count of new-substance changes in a six-item list; answer is 1 (burning wood)
5.1#9: multi_statement, I obviously false (state change forms no new substance)
5.1#10: ice/water; physical, same substance (p.59 line)
5.1#11: claim-check; drying and melting are state changes, so physical (agrees)
5.1#13: true_false True; boiling and condensing are state changes (no misconception)
5.1#14: sort four listed changes; one burns
5.1#15: AR; boiling is physical (one fact)
5.1#16: liquid and gas, state change, physical
5.1#18: sight and smell from the stem (banana example p.57)
5.1#19: folding paper, shape only (Activity 5.2)
5.1#21: differentiate shape vs state change with examples
5.1#22: drying towels is liquid to gas, physical
5.2#1: fill_blank B; Activity 5.3 outcome
5.2#5: baking soda and lemon juice fizz, gas turns lime water milky (Activity 5.4 word for word)
5.2#7: differentiate tap water vs lime water outcome (Activity 5.3)
5.2#8: show milkiness is not just bubbles (same point as #6, #7)
5.2#9: fill_blank count 3 of 6 tumblers, read off the stem
5.2#10: word equation for lime water plus new substance (book equation)
5.2#11: two ways to make carbon dioxide (the book's two activities)
5.2#12: Hari; pass gas through lime water (one test step)
5.2#13: read reactants and insoluble product from the book equation
5.2#14: AR; both statements verbatim from p.60-61
5.2#15: white layer is insoluble calcium carbonate (p.60 line)
5.2#16: fizzing and milky lime water (Activity 5.4)
5.2#17: match four book facts
5.2#18: claim-check; milky lime water is the test for carbon dioxide (agrees)
5.2#19: name carbon dioxide and calcium carbonate (two-fact recall)
5.2#20: predict P, Q, R tumblers (Activity 5.3/5.4 outcomes)
5.2#21: design the book's Activity 5.4 test
5.3#2: fireflies make light without heat (bioluminescence, fascinating-facts box)
5.3#3: oxygen takes part; definition of combustion applied to Mg
5.3#4: brown substance is rust, iron oxide; chemical
5.3#5: true_false; rusting is chemical (one line, p.62)
5.3#6: name a new substance for Mg, rusting, candle
5.3#7: claim-check; firefly light without heat
5.3#8: wrap a cotton blanket; no synthetic (Science and Society box)
5.3#9: covered candle runs out of air (Activity 5.5)
5.3#10: covered diya goes out (Activity 5.5 reskinned)
5.3#11: define bioluminescence, name firefly
5.3#12: Mg equation, source of carbon dioxide, both need oxygen (4 one-line facts)
5.3#13: oxygen supports combustion; lime water test (Activity 5.5)
5.3#15: fill_blank "oxide", a name copied from p.62
5.3#18: Mg word equation, heat and light, combustion
5.3#19: pick the pair with glass (non-combustible) and cotton (combustible)
5.4#1: differentiate ignition temperature of paper from the match's temperature
5.4#2: match four book definitions
5.4#3: dry sticks need heat (p.63 "paper kept in air" line reskinned)
5.4#6: focused sunrays heat the page to its ignition temperature (Activity 5.6)
5.4#7: true_false True; match hotter than paper's ignition temperature (verbatim, no misconception)
5.4#9: smallest spot concentrates heat; paper smokes first
5.4#10: fill_blank 2; fuel and heat remain (counting the triangle)
5.4#12: name the three sides of the fire triangle; sunrays supply heat
5.4#14: match is hotter than ignition temperature of paper (fourth time)
5.4#15: heating is gradual, smoke first (Activity 5.6)
5.4#16: paper on a desk has fuel and oxygen, no heat (p.63 example)
5.4#17: stone is not a fuel
5.4#18: lid removes oxygen; switching off removes heat
5.4#21: report where paper burns under the focused spot (Activity 5.6)
5.5#4: wick carries wax; wax evaporates and vapour burns
5.5#6: Chitra's view (both kinds of change)
5.5#7: claim-check; flame is burning wax vapour (agrees)
5.5#8: list physical changes of wax; burning is chemical
5.5#9: explain the sequence from lighting to flame (restate p.65)
5.5#11: AR; both kinds of change (one fact)
5.5#12: combustion is the chemical change (Faraday box)
5.5#13: missing wax evaporated and vapour burned
5.5#14: fill_blank 1; one chemical change among four
5.5#15: set wax solidifying is physical
5.5#16: write two physical and one chemical change at a candle
5.5#17: dripping wax melts and hardens, physical
5.5#18: hardened wax solidifying, reversible
5.5#19: classify five candle changes
5.5#20: differentiate melting from burning of vapour
5.5#21: multi_statement with all three statements true (no false statement)
5.6#1: true_false True; vapour condenses back to water (verbatim, no misconception)
5.6#2: story labelling compost, rusting, ripening (book examples)
5.6#5: differentiate desirable vs undesirable with one example each
5.6#6: drying paint pollutes the air (p.67 line)
5.6#7: give a reversible and an irreversible kitchen change (book examples)
5.6#9: two ways human activity changes the environment (p.67 paragraph)
5.6#10: pair that cannot be reversed: chopping and popcorn
5.6#11: fill_blank 2; undesirable changes the book names
5.6#12: show a change can be both desirable and undesirable (compost; book line)
5.6#13: only melted ice can be refrozen
5.6#14: compost from peels is useful decay
5.6#17: match four book facts
5.6#18: claim-check; compost counter-example (disagrees)
5.6#20: note on human activity (restates #9; labelled Evaluate)
5.6#21: decay spoils stored food, compost from waste
5.7#2: fill_blank "iron oxide" copied from Fig. 5.10b
5.7#3: define sediments; smaller pieces of the rock
5.7#4: two physical causes of breaking; iron oxide in basalt
5.7#5: sediments take thousands of years to harden; cannot be reversed
5.7#6: sediments settle where water slows and harden over thousands of years
5.7#8: true_false True; landslide erosion is physical (verbatim p.68)
5.7#9: news item using weathering, erosion, settling in order
5.7#10: wind erosion moves soil
5.7#11: heap at cliff foot from physical breaking
5.7#12: roots break rock, physical weathering
5.7#13: sediments settle then harden into rock
5.7#14: differentiate weathering and erosion
5.7#16: weathering with a physical and a chemical cause
5.7#17: match four book terms
5.7#18: steep bare slope (A) more at risk; (a) and (d) same answer
5.7#19: river pebbles are smooth due to erosion (p.68 line)
5.7#20: claim-check; weathering has both physical and chemical changes (agrees)
5.7#21: case study; (a)-(c) are single book facts, scene is Fig. 5.10
5.7#22: trace rock to new rock (restates p.67-68)

Borderline (counted as not easy, but weak): 5.1#8(a)-(c), 5.1#12, 5.1#20(a)-(c), 5.2#2/#4(a)-(c), 5.3#1(a)-(c), 5.3#17(a)-(c), 5.4#11(a)-(c), 5.4#19, 5.5#2(a)-(c), 5.5#10.

Count: 112 easy-in-disguise of 151 (16, 17, 15, 14, 16, 15, 19 by concept); 85 of the 112 are text-identical to the backup, 27 are new items.
