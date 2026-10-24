# Review: class6s ch06 "The Beginnings of Indian Civilisation" (SST6, fees106)

Pack: `content/authoring/dps/class6s/ch06.json`. Questions read: **127 of 127** (6.1 = 21, 6.2 = 20, 6.3 = 21, 6.4 = 22, 6.5 = 21, 6.6 = 22). No sampling. Every key decided before reading the key. Every number recomputed in python (all arithmetic is correct; every case-study part recomputed). Index `[n]` is the 0-based position inside the concept (the order in the file).

Mechanical checks, all clean: every mcq key equals o[0] and is among the options; every step-mark list sums to `m`; every case study stem is 45+ words; no option is named by position; no `Easy` tags.

## Number trace (page text has lost most digits)

| Number | Used in | Trace |
|---|---|---|
| 2600 to 1900 BCE | many | CONFIRMED on page: Fig 6.2 caption "about 2600 to 1900 BCE" (digits survive). |
| 3100 / 3500 / 4000 / 2000 | 6.1 [15] [17] | Digits survive in the timeline figure text. Egypt 3100, Mesopotamia 3500 is consistent with "followed a few centuries later". The pack's assignment is a reading of label order; acceptable. The body text also says Mesopotamia "about 6,000 years ago" (about 4000 BCE), so the book itself is loose. See M12. |
| 1920-21 (Harappa excavated) | 6.2 [0] [1] [7] | Page shows "way back in [..], over a century ago" with the dash glyph surviving between two numbers, so a range is confirmed; the exact digits come from scope only. |
| 1924 (identification) | 6.2 [1] [15] [16] | Page: "identification goes back to [..], a century ago"; digits lost, scope only. |
| 12 x 7 m Great Bath | 6.3 [3] [11] | Page "about [..] x [..] metres"; two numbers confirmed in form, values from scope. |
| about 700 wells | 6.3 [10] [11] [16] | Page "about [..] wells"; value from scope. |
| 73 m largest reservoir | 6.3 [7] [10] [11] | Page "measured [..] metres in length"; value from scope. Only the Fig 6.8 caption "33 metres" (one rock-cut reservoir) is readable. No conflict, but a student may see 33 and 73. |
| 217 x 36 m Lothal | 6.5 [4] [11] [15] [17] | Page "[..] metres in length and [..] metres in width ... a little more than two football grounds"; 217/2 = 108.5 is consistent. Values from scope. |
| 10.8 cm, 7 cm, 25 cm, 4 cm | 6.6 [0], 6.5 [4] | CONFIRMED on page captions. |
| 3500 BCE (villages grow into towns) | 6.1 [17]? no; 6.2 [4] [6] [11] [18] [19] | **CANNOT TRACE.** Page reads "from about [....] BCE, villages grew into towns ... around [....] BCE" with both numbers lost. The 3500 comes only from the scope file (2600 is corroborated by Fig 6.2). Six items in 6.2 and the "900 years" in [4] depend on it. Re-check against the PDF before load (M1). |
| 2200 BCE (drier phase) | 6.4 [6] [15], 6.6 [5] [7] [8] [13] [14]... | Page "from [..] BCE onward"; lost, scope only. 6.6 [8] (answer 300) depends on it. |
| "more than 4,000 years" (thirsty crow) | 6.6 [7] [14] | Page "more than [..], years"; lost, scope does not cite it. Quoted in item [14] as a book quote. Confirm. |

## HIGH

None that are a certain wrong key. One borderline second-answer risk, which I rate HIGH until fixed:

**H1. C6S-6.4 [9]** "For a school fair, students cook a 'Harappan meal' using only ingredients the chapter reports... Which dish passes the test?" Key: barley porridge with milk and banana. Distractors contain chilli, tomato, potato, onion and "dal". The chapter reports only "a variety of vegetables" and (glossary) pulses including lentils and dal, never potato, tomato, onion or chilli by name. A student who reads "a variety of vegetables" can defend "lentil dal with turmeric and potato" or "rice with fish and onion" as passing, so there is a second defensible answer, and the item secretly tests outside knowledge about when potato and chilli reached India (beyond this book). Fix: build each wrong option around one ingredient the chapter plainly does not name and that is not a vegetable or pulse (for example tea, sugar-cane juice, bread baked in an oven, coconut, or a clearly later import named in a way the stem can state), or change the stem to "an ingredient the chapter says was found by scientific examination of pots", with options built from the four pot items versus crops.

## MEDIUM

**M1. C6S-6.2 (several) untraceable 3500 BCE.** See the number table. If the book's village-to-town date differs from 3500, [4], [6], [11], [18], [19] and the "900 years" in [4] are all wrong at once. Smallest fix: confirm the date against the PDF; if it cannot be confirmed, phrase "from the early period the chapter describes" and drop the subtraction.

**M2. C6S-6.5 [5]** Assertion "The Harappans used bronze, **not plain copper**, to make tools." The chapter says they mastered working copper and used bronze for tools, pots, pans and figurines; it never says they did not use copper tools. The "not plain copper" clause is an overclaim, so A is arguably unsupported and the key (A true, R explains A) can be challenged. Fix: "The Harappans used bronze to make tools, pots and pans."

**M3. C6S-6.5 [15]** fill_blank "...each football ground in this comparison is a little less than ___ metres long." Key 108.5. The blank accepts any number slightly under 108.5 (108, 105, 100); a machine matcher will reject valid answers. It is also a single halving with the number in the stem. Fix: "Half of the Lothal basin's length is ___ metres, so a football ground in the comparison is a little less than that" with answer 108.5 only for the first blank, or make it a short_answer.

**M4. Scope drift into open-ended prompts (scope_out: "'Let's Explore', 'Think About It' discussion questions ... no single fixed answer").**
- 6.3 [7] part (iii) "what [Dholavira's reservoirs] tell us about its organisation" is the book's own Think About It discussion (who organised the workers, was there a local authority). The key admits "archaeologists say such answers are not always final". Drop (iii) or make it "state two jobs the chapter says someone must have organised".
- 6.3 [11] part (c) "City A's shafts stayed in use for centuries. What does this suggest about how the city was run?" is exercise Q7 "Discuss the implications".
- 6.3 [16] same inference as an mcq (the book never states the conclusion).
- 6.3 [15](b) "Why does this leave its purpose open to debate?" tests the Let's Explore debate that scope_out names ("beyond the ruled-out public-bath idea").
- 6.6 [14](b) "What does its survival in memory 'for more than 4,000 years' suggest..." is the Let's Explore question "how was such a story remembered ... in your opinion?".
- 6.6 [11](b) "why is a figurine like this useful when asking which practices still feel familiar" turns the exercise-5 activity into a graded question.
Fix each by asking for the book's stated fact or by moving the inference into a marked-as-opinion step.

**M5. Case studies where parts do not climb, a part is free, or the last part is not a decision.**
- 6.2 [1] (discovery wall): (b) "why are they called Harappans" repeats 6.2 [0](a) and is given away by Row 1 plus part (a); (c) and (d) are fine, but the last part is an explanation, not a decision.
- 6.3 [17] (model contest): (a) Team B is obvious because Team A is a deliberate strawman (mud huts, waste water in lanes); (b) restates; the last part (d) is a recall of the Dholavira caption. The decision is in (a), not last.
- 6.4 [6] (grain for the city): (b) and (c) are pure arithmetic on numbers given in the stem and need nothing from the chapter; only (a) and (d) use the chapter, and (a) is a recall hinted by "Besides wheat".
- 6.4 [17] (riverbank village): (a) is answered by the stem ("soft, rich soil left by the water"), (b) restates one line, (c) and (d) are plain recall; parts get easier, and Sites 1 and 3 are strawmen. Needs a real decision (for example two plausible sites, one with water but a hazard, judged on the chapter's reasons).
- 6.5 [4] (trade panel): last part (d) is an explanation, not a decision; (a) is recall.
- 6.5 [16] (bead-maker): (b) "which two techniques" is stated in the speaker's own words in the stem, so it is a free mark.
- 6.6 [15] (two film titles): (a) and (b) are the same point, Title P is the book's own discarded idea so the decision is predictable, and the decision comes first rather than last. Same idea as 6.6 [3] and [10].
- 6.1 [10] (three settlements): (c) is easier than (a); the climb is wrong. (b) key lists "external trade" as lacking for P, but P has no trade at all; accept "trade".
Smallest fix for all: make the last part a choice between two defensible options and move the pure recall part to be the first and worth 1.

**M6. Distractors that are not chapter confusions.**
- 6.4 [18] "model from Banawali proves bronze ploughs": options 1, 2 and 3 (model is of bronze; Banawali is coastal; it is a terracotta whistle) are absurd. A real confusion: "the model shows ploughs were pulled by oxen", "it shows every village had a plough".
- 6.5 [13] "Gujarat coast to Oman": options say the sea was not yet used, boats came much later, Susa is the only way out. None is a plausible student mistake.
- 6.6 [12] "Priest King listed under daily use": the chapter has only two groups, so options 1-3 ("export goods", "farming tools", "seals") invent groups the chapter does not have. Use the chapter's two groups plus a swapped-caption confusion.
- 6.3 [0] Reason ("an inscription found beside the Great Bath names it as a bath for the royal family") is an invented strawman; the book says there is NO inscription. Keep A true / R false but make R a real near-miss (for example "the Great Bath was a public bath, which the chapter has ruled out").

**M7. Easy in disguise (answer is a fact the book states in one line, Bloom label notwithstanding).** 28 items, about 22%:
6.1 [20] (external vs internal trade), [15] (subtract 3100 from 2600; both numbers in stem);
6.2 [2] (Ghaggar), [5] (Ganweriwala), [12] (increasing trade and exchanges), [16] (2026 minus 1924, numbers in stem), [6](a);
6.3 [3] (12 x 7 = 84; Class 6 maths, no chapter needed), [8] (bitumen), [13], [20] (well vs reservoir with the city), [4] (two recall parts), [2], [5] (stem hands over "raised area with larger buildings");
6.4 [0] (why settle by rivers), [16] (coastal Gujarat and Sindh), [20] (pulses glossary), [8] (match is one-to-one with the text);
6.5 [7], [11] (Lothal dockyard), [12] (two recall parts), [13], [19], [20] (two recall parts);
6.6 [8] and [20] (subtract numbers given in the stem), [19] (swastika seal), [21] (gamesboard), [1].
Minimum fix: for the pure-subtraction items (6.1 [15], 6.2 [16], 6.6 [8], 6.6 [20], 6.3 [3]) either drop the numbers from the stem so the student must recall them, or merge them into the case studies already doing this. For the rest, add a second step that uses the fact (as 6.4 [11], 6.2 [9] and 6.6 [10] already do well). Repeating "subtract two dates given in the stem" five times is also a template (see T2).

**M8. 2-mark (a)/(b) items that are two recall facts (QUESTION_STANDARD 11).** 6.3 [4], 6.3 [12], 6.4 [16], 6.4 [20], 6.5 [3], 6.5 [12], 6.5 [20], 6.6 [5], 6.6 [14]. (b) restates a line or "(b) Why is the list shorter?" answers itself ("not so clear"). Make (b) a consequence or comparison using (a).

**M9. Claims beyond what the book says.**
- 6.3 [14] "One of the small rooms ... contained a well, a source of water to fill it": the book says only that the tank was surrounded by small rooms, one of which contained a well. The well filling the bath is an inference.
- 6.3 [5] stem adds "a raised area with larger buildings"; the book gives no height or size for the upper town.
- 6.3 [11] "round brick-lined shafts"; 6.5 [4] and [11] "brick-lined basin"/"brick basin" (Lothal): the chapter says only "basin".
- 6.4 [15] puts "keeping animals and fishing" under villages; the chapter does not assign them to villages.
- 6.4 [13](b) "evidence stronger than guessing the diet from crops" is the author's judgement, not the chapter's.
- 6.2 [11] "the earliest cities in the chapter's story ... hence 'first'" is the author's reading; the book only says the development is "also called the First Urbanisation of India".
Replace each with the book's wording.

**M10. Repeated ideas (counted).**
- Agriculture must feed cities / daily supply from villages: 15 items (6.1 [2] [6] [9]? [10] [14] [16], 6.4 [6] [7] [15] [19], 6.5 [8] [12], 6.6 [0] [12] [16] by keyword). In 6.1 alone it is [2], [6], [14] and [16] (four items, one fact).
- Village-to-town 3500 and town-to-city 2600: 6.2 [4], [6], [11], [12], [18], [19] (six items repeat the same two dates).
- Seals unreadable but linked to trade: 6.5 [1], [3], [6] (three items, one idea).
- Warfare / invasion rejected: 6.6 [3], [10], [15].
- Harappan naming: 6.2 [0], [1](b), [13], [7].
- "Probably imported copper": 6.5 [2], [8], [12], [20].
Replace roughly 8 of these with ideas the bank does not yet test (Fig 6.3 map reasoning is out by scope_out; but unused in-scope content includes Dholavira's three zones beyond one MS statement, the Sarasvati's mention in the Rig Veda as goddess and river, Mesopotamia/Egypt dates compared, the fortification and cardinal orientation as a planning clue, cotton as a first in Eurasia beyond one true_false, turmeric/ginger/banana inference).

**M11. 6.1 [12] true_false.** Statement is built so the answer is obviously False; fine, but "carried there from Mesopotamia" is nowhere near a real student misconception. Better: "Because the Mesopotamian civilisation began earlier, the Indus civilisation must be a copy of it."

**M12. Internal date tension 6.1 [11] vs [17].** Option text quotes "Mesopotamia ... about 6,000 years ago" (about 4000 BCE) while [17] and [7]-style items place Mesopotamia at 3500 BCE. Both come from the book; add "about" and do not combine them in one item.

## LOW

- 6.1 [1] fill_blank "cultural ideas": "plan of a decorated building" could be read as urbanism (town-planning). Say "the carving on a decorated building"; accept "cultural idea(s)".
- 6.1 [5] "bead polisher: trade" is the wrong pairing (it is crafts) but beads were also a trade good; wording "belongs to" fixes it.
- 6.1 [13] key reasons (one household cannot arrange water) go beyond the book's one line on urbanism.
- 6.1 [14] stem nearly states the definition ("only enough food for the villages").
- 6.1 [19] metallurgy glossary is a margin note; fine, but bronze is chapter-later.
- 6.2 [3], 6.3 [6] statement items: 6.3 [6] has all three statements true (answer "1, 2 and 3") and all three are caption facts. One false statement would make it discriminate.
- 6.2 [7] match: column B (d) "the river on whose plains the first-found cities lay" also fits "Indus Valley"; key is unique only because (b) "obsolete" fits only Indus Valley. Fine, but reword (d) to "the river system of the first-found cities".
- 6.3 [7] and [19] tagged Hardest or 5 marks for a 3-mark item ([7] is m3 labelled Hardest, [21] in 6.4 same). Use Hard.
- 6.4 [3] statement 1 "first people in the world to grow wheat" is the right kind of trap; keep.
- 6.5 [4] item (iv) "a list of goods with a blank" is contrived; replace with a plain "what did Harappans import?" part.
- 6.5 [12](a) accepts only "ornaments, timber, daily objects" and "gold, cotton"; the book also lists "possibly food items", so the key should note that.
- 6.6 [17](a) bronze objects: the chapter also names tools, pots and pans; key lists only mirror and chisel, so accept those.
- 6.6 [9] true_false is True and not about a real misconception; fine but weak.
- 6.2 [16] fixes the year "2026" in the stem; it will age (fine for this release).
- Claim-check verdict mix (8 items): yes 2, partly right 2, no 4. Not templated, but "No" is half; change one "No" to "partly right".
- Bloom labels inflated: 61 of 127 are tagged Analyse while about a quarter are one-line recall (M7). Relabel after fixing.

## Template check (counts)

- Claim-check verdicts: yes 2 / partly 2 / no 4 (8 items). Fine.
- true_false verdicts: False 3 / True 3 (6 items). Fine.
- `multi_statement` keys (6): "1 and 3 only", "2 and 3 only", "1, 2 and 3", "2 only", "1 and 2 only", "3 only". Well spread, one per concept, 3-statement format (house style for Social Science).
- assertion_reason keys (6): explains 2, not-explain 2, A true R false 1, A false R true 1. Good spread, but 6.5 [5] and 6.1 [6] are near-trivial (R restates A).
- Correct option longest in the mcq: 6 of 31 (19%), above chance only in 6.2 where short numeric/name options make it moot. Fine.
- Slot order: differs across concepts (examples MFSTSMAL..., SLMTSFSX..., ASMFSMTL...). No identical order. Fine.
- Sentence frames: the "Is X right? Give reasons from the chapter" frame (8 items) and the "(a)... (b) Use your answer to explain..." frame (about 20 of 46 short answers) repeat, as do "Justify this statement ... " (6.1 [7], 6.3 [10], 6.4 [1], 6.5 [8], 6.6 [7]) and "A student/claim says X; which correction fits the chapter?" mcq (6.4 [14], 6.5 [19], 6.6 [1], 6.6 [19], 6.6 [21], 6.1 [11]). Readable variety inside each frame, so mildly templated, not a template failure. The number-from-the-stem subtraction items (T2) are the clearest repeated shape.
- T2. Subtraction of two dates in the stem: 6.1 [15], 6.2 [16], 6.6 [8], 6.6 [20], plus the timeline case 6.1 [17]. Five items of one shape.
- Chapter-level mix: Understand 7, Apply 27, Analyse 61, Evaluate 29, Create 3, Remember 0. Recall and Understand 5% (limit 60%); Analyse/Evaluate/Create 73% (floor 15%). Passes numerically, but see the Bloom note in LOW.
- Types: short_answer 46, mcq 31, long_answer 27, fill_blank 7, multi_statement 6, assertion_reason 6, match 4 (concepts 6.1, 6.2, 6.4, 6.5; meets one per two concepts). Case studies: 12 (2 per concept), all 4 marks, parts sum correctly. fill_blank: 7, of which 4 are trivial subtraction and 2 are good (6.4 [11] count of four, 6.1 [1]).

## Per-concept verdict

- C6S-6.1 What is a civilisation? **Pass after fixes.** Keys all correct; case 6.1 [10] and [17] arithmetic correct (1.0 m, 1.8 m, 2.8 to 4.2 m, 3900 BCE); agriculture idea repeated four times; [15] trivial.
- C6S-6.2 Names, rivers, urbanisation. **Pass after fixes.** Keys correct; blocked on the untraceable 3500 BCE (M1); six items repeat the same two dates; [2], [5], [12] recall.
- C6S-6.3 Town planning and water. **Pass after fixes.** Keys correct; scope drift into Think About It prompts (M4); [3] is free arithmetic; strawman case [17].
- C6S-6.4 Food and farming. **Rework one item, then pass.** H1 (meal item) must be fixed; [17] case study is recall; [6] arithmetic correct (20 villages, 25 villages, shortfall 800 kg).
- C6S-6.5 Trade, crafts, seals. **Pass after fixes.** M2 (A overclaim), M3 (blank ambiguity), heavy repetition of copper/gold/seals.
- C6S-6.6 Daily life and decline. **Pass after fixes.** Keys correct (25.8 cm, 4.2 cm spare; 300; 700); open-ended-prompt items [11], [14]; repetition of the warfare idea three times.

## Counts

Read 127 / 127. HIGH 1 (borderline second answer, 6.4 [9]). MEDIUM 12 groups (M1 to M12, covering about 75 item references). LOW 15. Wrong keys found: 0 certain. Arithmetic: every computation correct. Facts: no confirmed error; digit-dependent facts (3500 villages, 2200, 73, 700, 217 x 36, 1920-21, 1924, "4,000 years") are scope-only and listed above.

**Overall verdict: PASS AFTER FIXES.** Not templated in the sense of the standard (types, key spread, slot order and verdicts all varied), but one repeated shape (stem-given subtraction) and several repeated ideas should be thinned. Fix H1, M1, M2, M3 first; then M4, M5, M7.
