# Review v2: class7s / p1ch01 (Class 7 Social Science, Exploring Society Part I ch 1, gees101)

File: content/authoring/dps/class7s/p1ch01.json (second pass after the "no easy questions, every item type" rewrite). Textbook pages 001-026 read in full; every one of the 123 questions read, no sampling (C7S-1.1 20, 1.2 20, 1.3 21, 1.4 20, 1.5 21, 1.6 21). Item numbers (#n) are the 1-based position inside the concept. Older review for the previous version: class7s-p1ch01.md.

## Summary
- Wrong keys: 0. Second-defensible answers that change a key: 0 (two near-misses listed as MEDIUM). Arithmetic: all recomputed in python and correct (overlap 4; 10x ratio; 2 m in 400 years; bus 11:00 a.m.; 2026 - 800 = 1226; tank 300 / 65 / 1950 / 450 / 366.7; Rs 2,700 / 2,400 / 3,300; quiz 6 and 4; 200 ha; Rs 100 crore; 464).
- Facts: every date, name and cause matches this book. Only small over-reaches are listed below.
- **The rewrite did not remove the easy items.** 82 of 123 questions (67%) are text-identical to the backup (72 fully identical in every field; 10 identical text with only the Bloom/difficulty label changed: 7 `Understand/Easy` became `Understand/Hard`, 3 `Remember` became `Apply` or `Understand`). Only 41 items are new. 73 of 123 (59%) are easy-in-disguise by the one-line-fact test (47 of them unchanged from the backup, 26 new). See EASY LIST at the end.
- Template: slot order is identical in all six concepts (1-mark block, then multi_statement, assertion_reason, five 2-mark, three 3-mark, two 5-mark, two case studies; the claim check sits at #14-#16 in every concept; both 5-mark items open "Justify ..." / "Compare ... and analyse ..." or "Suppose ..."). Case studies are all one frame: (a) lookup, (b) lookup, (c) lookup or arithmetic from the stem, (d) a decision the stem already settles.
- Verdict: **rework** (not a fix-by-polish: about 60% of the items need replacing with application-level versions, and the case-study frame needs real trade-offs).

## HIGH
None.

## MEDIUM
1. C7S-1.4 #19 (case study, SAME): "adopt desert water habits that would cut use by 2 litres ... at no cost" vs "a second tank of 2,000 litres would cost Rs 15,000". Habits give 450 days (spare 85) and cost nothing; the tank gives 366.7 days and costs Rs 15,000. The decision is one-sided (strawman). Parts (b) and (c) are arithmetic on stem numbers and (a) is described in the stem. Fix: make the habit saving small or costly (e.g. needs a Rs 8,000 filter, saves 0.5 L) so both options meet 365 days and the choice is a real trade-off, and ask (a) for something the stem does not describe.
2. C7S-1.4 #20 (case study, SAME): "the principal's rule is that all 40 students must go" plus the grant makes Zawar (Rs 28,000) impossible; (c) and (d) are one calculation. Fix: drop the "all 40" rule, make both sites affordable, decide on the learning aim.
3. C7S-1.5 #20 and #21 (case studies, SAME): same frame twice; part (c) is the identical question "What harm does the chapter link with coal?" in both; (d) is dictated by a pledge / gram-sabha rule written into the stem ("has publicly pledged to cut its contribution to global warming"). Fix: change one of the two parts (c); give the stem two competing aims (cost and emissions) so either plant can be defended.
4. C7S-1.3 #21 (case study, SAME): the gram sabha's "first aim is to raise food output", so the farm plot is the only answer; (d) is not a trade-off. Same for 1.3 #20 (aim = contrast with a hot desert, so only the cold display fits) and 1.6 #20 (project is "how rivers create farmland", so the east coast). Fix: state the aim loosely or give two aims.
5. C7S-1.3 #13 (new): (a) "Name two other uses (any two of industry, electricity, travel and trade)", (b) "Which of the uses you named has gone on for millennia?" key "travel and trade". A student who validly named industry and electricity cannot answer (b); the key depends on her choice in (a). Fix: ask (b) independently ("Which use of these rivers has gone on for millennia?").
6. C7S-1.2 #9 (new): the trekker says "This is where the Ganga itself begins" and the key treats this as an error ("only in this sense"). The same book box says the Bhagirathi is "a major tributary of the Ganga" and "remember, its journey began there!", so the trekker is arguably right per this book; the step "a tributary that joins to make the Ganga" is also not in the book. Fix: make the claim clearly wrong (e.g. "the Ganga's glacier is the Siachen") or ask only "which river rises at Gaumukh and at the edge of which glacier".
7. C7S-1.1 #14 (SAME claim check): key opens "Only partly", but Leela's claim ("India and the Indian Subcontinent mean the same thing") is false; only her naming reason is true. This is a "No", so the chapter's claim-check mix is really 6 No / 1 Partly / 1 Yes. Fix: make the key "No" or reword the claim so it is half right.
8. Whole chapter, template: identical slot order and the same (a) lookup / (b) lookup / (c) lookup / (d) decision case-study frame in all six concepts (counts above). Fix: vary positions and frames; replace some case studies with a data-table or "choose between two plans using stated numbers" frame.
9. Whole chapter, repeated ideas inside a concept (more than the "about twice" allowed): 1.1 boundaries on each side (#4, #9, #10, #17, #19b) and Himalayan vs subcontinent countries (#2, #7, #20); 1.2 Gaumukh/Bhagirathi (#1, #7, #9), the three ranges (#2, #4, #5, #16, #18, #20) and the 5 mm per year figure (#3, #11, #14, #15); 1.3 yak uses (#3, #5, #16, #20c) and plains fertility (#4, #7, #14, #21); 1.4 taanka (#10, #12, #15, #18, #19) and the Aravalli barrier role (#3, #9b, #14, #17); 1.5 waterfalls (#7, #12b, #13, #14, #17, #20a), Ghats (#2, #3, #5, #16, #19), coal harm (#20c, #21c); 1.6 west vs east coast (#15, #18, #20), delta formation (#1, #6, #10, #20a).
10. fill_blank items are not application-level (standard sec. 12: "a computed value, a reasoned term, never a name copied from the page"): 1.1 #3 ("___ countries", count a list; also key "seven" should accept 7), 1.3 #2 ("tso" = lake, copied from the page; Tso Moriri is not in this book), 1.5 #4 ("west-flowing river drains into the ___ Sea", stem hands "west"), 1.6 #2 (half of a hypothetical 10,000 sq km). Only 1.6 #2 is a computation, and it is one division. Fix: compute from two chapter facts (e.g. Himalayas rise 5 mm a year: ___ metres in 2,000 years) or use a reasoned term (the landform named by a description).
11. true_false: the three True items (1.3 #14, 1.5 #14, 1.6 #13) restate a sentence of the book with no misconception to catch (stem even includes the cause). Of the three False items, 1.2 #10 (government alone preserves the park) is trivia, not a chapter misconception. Fix: for True items, plant a tempting wrong reason in the stem; for 1.2 #10 use a real confusion (for example Himachal vs Himadri snow cover).

## LOW
- C7S-1.1 #11 asks what the colours of "the physical map at the end of the book" stand for; the item needs a map the student does not have in the stem (standard: never "as in the book"; scope_out "Physical map exercises that need the atlas"). It is answerable from the book's sentence, so not a violation, but the part (b) rationale is empty. Fix: state the legend in the stem and ask a reading task.
- C7S-1.1 #3 / #19a: "Counting India itself ... seven" vs "How many countries will the neighbours panel list ... Six": consistent but a trap. State "other than India" in #19.
- C7S-1.1 #1, 1.4 #1, 1.4 #3, 1.6 #1, 1.5 #7: some distractors are not chapter confusions ("Rainwater stored in kunds is washing it away", "The Zawar mines would become taanka tanks", "Pulicat is an archipelago", "yaks of the plains supply dung to every field"). Replace with look-alike chapter terms.
- C7S-1.3 #3 stem needs "fuel from dung"; the book says yaks are reared for dung, not for fuel.
- C7S-1.4 #15 says "two facts" but the 3 steps need three. #17 says "at least four points" but 5 marks are awarded for five items.
- C7S-1.4 #19 "a covered tank dug into the ground" is not in this book (the book only says taanka/kunds store rainwater).
- C7S-1.5 #8 statement 1 "younger than the Himalayas": the book says only "a very old land formation"; keep "recent" only. #9 R ("All the tribal communities of India live on the Peninsular Plateau") is absurd so A-true/R-false is guessable.
- C7S-1.6 #2: accepted answers "5000" only; add "5,000". #17 key "showing craft and patience" ("patience" is the author's inference).
- C7S-1.6 #8 multi_statement has no false statement ("1, 2 and 3"); the other five keys do. 1.2 #7 statement 1 and 1.3 #8 statements 1 and 2 are flagrant opposites, not word-level traps.
- C7S-1.2 #20 (case): the Himadri trek with a six-year-old is dropped by common sense, little chapter weighing.

## Counts read (template and type checks)
- Questions: 123 (20, 20, 21, 20, 21, 21). Types: 31 mcq, 4 fill_blank (one in each of 1.1, 1.3, 1.5, 1.6), 4 match (1.1, 1.3, 1.5, 1.6), 6 multi_statement, 6 assertion_reason, 6 true_false (3 True, 3 False = 50%, ok), 8 claim_check, case studies 12 (two per concept). `match` and `fill_blank` are 4 of 6 concepts (needs max(2,3)=3: ok). All `d` are Hard (99) or Hardest (24); no Remember; Understand 22 of 123 (18%); marks per concept meet the minima; step marks sum to the marks for every item.
- Claim-check verdicts (8): No 5, Partly 2, Yes 1 per the keys (1.1 #14 "Only partly" is really a No, so No 6 / Partly 1 / Yes 1). Yes: only 1.4 #16. Acceptable but No-heavy.
- multi_statement keys: 1&3 only, 2&3 only, 3 only, 1&2 only, 2 only, all three (good spread; the one "all three" has no false statement). assertion_reason keys: R not explaining A (1.1, 1.3), R explaining A (1.2, 1.4), A true R false (1.5), A false R true (1.6): all four outcomes, ok.
- Correct MCQ option (always first before the loader shuffles) is strictly the longest in 8 of 31 MCQs (26%); numeric/one-word option sets excluded this is not systematic. No option names a position ("option (b)"), no option has an explanation appended (the `a` field carries the explanation; options are clean).
- Slot order: identical in all six concepts (see Summary).
- Scope: no scope_out violation (no river or mountain statistics are required; the "physical map exercises" line is touched only by 1.1 #11).

## Per-concept verdict
- C7S-1.1: keys correct, facts correct; 10 of 20 items easy (7 unchanged); 5x boundaries repetition. Rework the easy ones.
- C7S-1.2: keys correct; #9 second reading (MEDIUM); 11 of 20 easy; three-range content repeated six times.
- C7S-1.3: keys correct; #13(b) dependent; 12 of 21 easy; case-study decisions dictated.
- C7S-1.4: keys correct; both case studies one-sided; 10 of 20 easy; taanka over-tested.
- C7S-1.5: keys correct; two near-identical case studies; 14 of 21 easy.
- C7S-1.6: keys correct; 16 of 21 easy (the weakest concept: almost every one-mark and 2-mark item is a one-line book fact; the multi_statement is all-true).


## EASY LIST
Format `concept#position: reason`. (SAME = text identical to the backup, N = new in this rewrite.) 73 definite of 123 (47 SAME, 26 N). Borderline (not counted) are listed at the end.

C7S-1.1 (10)
- 1.1#3: N, fill_blank, count the seven countries named in the page list.
- 1.1#4: SAME, match of four compass sides, one book paragraph.
- 1.1#5: SAME, Sri Lanka is in the page's neighbour list.
- 1.1#6: SAME, islands are the fifth region in the page's list.
- 1.1#9: SAME, name three boundaries (relabelled Understand), one sentence.
- 1.1#11: SAME, colours = altitudes; (b) is a platitude.
- 1.1#12: N, (a) the phrase is quoted in the stem; (b) restates the boundary sentence.
- 1.1#15: SAME, recite the five regions of the page's list.
- 1.1#17: SAME, 5 marks to restate the boundary paragraph.
- 1.1#18: SAME, 5 marks to restate one sentence on the subcontinent.

C7S-1.2 (11)
- 1.2#1: N, two meanings (Gaumukh, Himalaya) looked up.
- 1.2#4: SAME, NOT-question over four book lines about the Himadri.
- 1.2#5: SAME, Darjeeling is in the Himachal hill-station list, stem hands the climate clue.
- 1.2#6: SAME, the carpet analogy is in the stem and the book.
- 1.2#8: SAME, the book's own "Hence" sentence.
- 1.2#9: N, Bhagirathi and Gangotri Glacier looked up.
- 1.2#10: N, one-sentence trivia (government and village communities).
- 1.2#13: SAME, kath-kuni two reasons, one sentence.
- 1.2#14: SAME, claim check answered by the 5 cm / 5 mm sentence.
- 1.2#16: SAME, restates the Himadri and Himachal bullets.
- 1.2#18: SAME, 5 marks to restate three bullets.

C7S-1.3 (12)
- 1.3#1: SAME, why 'cold desert', two page lines.
- 1.3#2: N, fill_blank, "tso" = lake copied from the page.
- 1.3#3: N, yak; the stem lists the uses the book lists.
- 1.3#4: SAME, NOT-question over page lines.
- 1.3#5: N, match of four lookups (Pangong Tso, Losar, yak, moonland).
- 1.3#6: SAME, ocean past and erosion from one sentence.
- 1.3#7: SAME, river minerals make the plains fertile; the stem states the multi-cropping.
- 1.3#10: SAME, moonland and its cause, two lookups.
- 1.3#12: N, large population (book says so) plus one reason.
- 1.3#14: N, True item that restates the fertility sentence.
- 1.3#15: SAME, claim answered by a list of wildlife and festivals.
- 1.3#16: SAME, relabelled Create/reverse: choose three of the five yak uses the book lists.

C7S-1.4 (10)
- 1.4#3: N, stem gives the barrier role; one-step inference.
- 1.4#4: SAME, NOT-question: coal is not in the minerals list.
- 1.4#5: SAME, two figure-caption lookups (Kumbhalgarh, Jaisalmer).
- 1.4#6: SAME, the stem lists the minerals; answer Aravallis.
- 1.4#9: N, 6:30 + 4:30 and the barrier sentence.
- 1.4#11: N, one page sentence mapped to noon and midnight.
- 1.4#12: SAME, define taanka; (b) obvious.
- 1.4#13: N, subtract 800 from 2026 and name a mineral.
- 1.4#16: N, claim restates two book lines; verdict Yes.
- 1.4#17: SAME, 5 marks to list five facts.

C7S-1.5 (14)
- 1.5#2: SAME, taller / lower Ghats.
- 1.5#3: N, stem says "wall along the west coast"; picture captions.
- 1.5#4: N, fill_blank, west-flowing river drains into the Arabian Sea.
- 1.5#5: SAME, match of four lookups.
- 1.5#6: SAME, "tilts a little to the east", one sentence.
- 1.5#7: SAME, waterfalls over uneven rocky surfaces, one sentence.
- 1.5#10: SAME, define plateau and peninsular.
- 1.5#11: N, correct with one sentence; names from a list.
- 1.5#12: N, stem quotes the definition phrase; waterfall sentence.
- 1.5#13: N, uses of waterfalls; the caption of Fig. 1.1.
- 1.5#14: N, True item = the book's monsoon-waterfall sentence.
- 1.5#16: SAME, relabelled Create: write a clue for each of three features.
- 1.5#18: SAME, 5 marks to list minerals, rivers, forests, waterfalls.
- 1.5#19: SAME, 5 marks; the order of crossing is fixed by the stem, then restate three descriptions.

C7S-1.6 (16)
- 1.6#2: N, fill_blank, half of 10,000 (the hypothetical figure is stated in the stem; the book's "about half" is not misstated) is one division.
- 1.6#3: SAME, NOT-question over page lines.
- 1.6#4: N, the stem lists the features of the Northeast.
- 1.6#5: SAME, match of four lookups.
- 1.6#6: SAME, how a delta forms, one sentence.
- 1.6#7: SAME, Lakshadweep gives a vast marine area, one sentence.
- 1.6#8: SAME, all three statements true, each a page line.
- 1.6#10: SAME, delta formation and farming, two lookups.
- 1.6#11: SAME, Lakshadweep vs Andaman, two lookups.
- 1.6#12: SAME, the delta and half in India.
- 1.6#13: N, True item = the book's rainfall sentence.
- 1.6#14: N, estuary and delta, two lookups.
- 1.6#16: SAME, 36 vs more than 500.
- 1.6#17: N, festival, bridge and village are named in the stem; restate three captions.
- 1.6#18: SAME, 5 marks to compare two coasts from two paragraphs.
- 1.6#19: SAME, 5 marks to list four facts.

Borderline, not counted: 1.1#7, 1.1#10, 1.2#2, 1.2#11, 1.2#12, 1.2#15, 1.2#17, 1.3#8, 1.3#11, 1.3#13, 1.3#17, 1.3#18, 1.4#2, 1.4#15, 1.5#8, 1.5#9, 1.6#1, 1.6#9, 1.6#15. Case-study parts that are pure lookups or arithmetic on stem numbers (not counted as whole items, but fix them when rebuilding): 1.1#19(a)(b)(c), 1.1#20(a)(b), 1.2#19(a)(b)(c), 1.2#20(a)(b)(c), 1.3#20(a)(b)(c), 1.3#21(a)(b)(c), 1.4#19(b)(c), 1.4#20(a)(b)(c), 1.5#20(a)(b)(c), 1.5#21(a)(b)(c), 1.6#20(a)(b)(c), 1.6#21(a)(b)(c).

## Items that are good and should be kept (for the fixer)
1.1#2 (overlap 4), 1.1#10, 1.2#2, 1.2#3 (10x), 1.4#10, 1.4#14, 1.4#18, 1.5#1, 1.5#15, 1.5#17, 1.6#21 (best case-study decision: concrete bridge vs root bridge with a deadline).

## Per-concept working notes (details behind the findings above)

### C7S-1.1 (20 questions, 14 text-identical to the backup)
- Recomputed: Himalayan list {India, Nepal, Bhutan, China, Pakistan, Afghanistan} and subcontinent list {India, Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka, Myanmar} overlap = 4 (key 4, correct). Case study Rs: 1800+900=2700, 1500+900=2400, 1800+1500=3300 > 3000 (key correct). Quiz marks 6 and 6-2=4 (key correct). All facts match page 002 and 004.
- No wrong key found.
- Easy/recall candidates: 1.1#4 (match, 4 compass lookups, SAME), #5 (Colombo: Sri Lanka is in the list, SAME), #6 (islands = fifth region, SAME), #9 (name the three boundaries, SAME), #11 (colours = altitudes, SAME), #12 (phrase 'by its very geography' is quoted in the stem), #15 (recite the five regions, SAME), #17 and #18 (5-mark restatements of the one boundary paragraph / one sentence on the subcontinent, SAME), #3 (count a list of seven).
- Repeated idea: "boundaries on each side" is asked in #4, #9, #10, #17 and #19(b); "Himalayan countries vs subcontinent countries" in #2, #7(statement 2) and #20.
- #14 verdict is labelled "Only partly" but the claim ("India and the Indian Subcontinent mean the same thing") is false as a conclusion; only her naming reason is right. It is really a "No".
- #3 fill_blank key is "seven"; a student typing 7 should be accepted (put "7" as an accepted answer or ask for a numeral).

### C7S-1.2 (20 questions, 14 identical to backup)
- Recomputed: 50 mm / 5 mm = 10 (key correct); 5 mm x 400 = 2 m (correct); museum Rs: Water+Formation 7 > 6, Water+Life 6, Formation+Life 5; visitors 130 vs 110 (key correct). Facts match pages 004-008.
- #9(a) key step says the Bhagirathi is "a tributary that joins to make the Ganga": the book only says "a major tributary of the Ganga" and, in the same box, "Next time you see the Ganga, remember, its journey began there!". The stem's trekker claim is therefore close to what the book itself says; the key "begins there only in this sense" is a second defensible reading (MEDIUM). Fix: ask what Gaumukh means / which river and glacier, drop "joins to make".
- Gaumukh/Bhagirathi is tested in #1, #7(3), #9 (three times); Himadri/Himachal/Shivalik contrasts in #2, #4, #5, #16, #18, #20: heavy repetition. The 5 mm/yr figure appears in #3, #11, #14 (and #15 echoes it).
- Easy/recall: #1 (two meanings looked up), #4 (negation of 3 book lines), #5 (Darjeeling is in the Himachal list; stem hands the clues), #6 (the carpet analogy is in the book and in the stem), #8 (the book's own "Hence"), #9, #10 (one sentence), #13 (two reasons in one sentence), #14, #16 (restates a three-bullet list), #18 (5 marks for restating the bullet list), #12 (summer snowmelt: one inference + names), #11 (one multiplication). Case study #19 parts (a)-(c) and #20 parts (a)-(c) are pure lookups; only (d) thinks. #20(d): dropping the Himadri trek with a six-year-old is the obvious answer (weak trade-off; LOW).

### C7S-1.3 (21 questions, 14 identical to backup)
- Recomputed/checked: all facts against pages 008-011 (below -30 C, little rainfall, salt lake from dissolved minerals, sand-and-clay rocks from an ocean past, large share of population, roads and railways, multi-use rivers). Keys are right.
- #13 (new): part (a) says "name two other uses (any two of industry, electricity, travel and trade)", part (b) then asks "Which of the uses you named has gone on for millennia?" with key "travel and trade". A student who validly named industry and electricity cannot answer (b); the item depends on which two she picked (MEDIUM). Fix: make (b) independent: "Which use of these rivers has the chapter said has gone on for millennia?" or drop the "you named".
- #2 fill_blank "Tso Moriri ... a ___" key "lake": the meaning of tso is copied from the page (the standard bans a name copied from the page), and Tso Moriri is not in this book (LOW). Accept "lake" only; fine for the machine, weak for thinking.
- #14 true_false is a True item that restates the page's sentence; there is no misconception to catch. Keep as one of the True ones but make the stem carry a trap (e.g. "because they are fed by the ocean").
- #8 multi_statement: statements 1 and 2 are both flagrantly false (heavy rain, small share of population), key "3 only"; the false ones hinge on opposites of single lines, not on a word.
- #21 case study: the stem hands the decision ("The gram sabha has said its first aim is to raise food output") so (d) is dictated, not a trade-off (MEDIUM). #20(d) is similar (aim = difference from a hot desert, so cold display is the only fit) (LOW).
- Easy/recall: #1 (why 'cold desert'), #2, #3 (yak; stem lists the five uses it needs), #4 (NOT-question over four book lines), #5 (match, four lookups), #6, #7 (stem gives "crops one after another"), #10 (moonland and cause, SAME), #12, #14, #15, #16 (relabelled Create: pick three of the five yak uses the book lists, SAME), #11 mild. Yak uses are asked in #3, #5, #16 and #20(c) (four times); plains fertility in #4, #7, #14, #21.

### C7S-1.4 (20 questions, 12 identical to backup)
- Recomputed in python: bus 6:30 + 4h30 = 11:00 a.m. (key right); 2026 - 800 = 1226 (right; "over eight centuries ago" so "before about 1226" is right); tank 9000/30 = 300 days, 65 short, 65 x 30 = 1950 L, 9000/20 = 450, 11000/30 = 366.7 (all right); Zawar 40 x 700 = 28,000 over Rs 25,000, Chittorgarh 20,000 (right). Set difference of state lists = {Punjab} (right). Facts match pages 012-015.
- #19 case study (SAME): (b) and (c) are pure arithmetic from the stem, (a) is basically described in the stem ("covered tank ... fills during the monsoon ... for drinking") so the chapter adds only a name; in (d) the free option (habits, 450 days) beats the Rs 15,000 tank on every number, so the "decision" is a strawman (MEDIUM). Fix: make the habits saving smaller or uncertain (e.g. cut by 0.5 litre, or needs a family of 9) so the tank is a real alternative.
- #20 case study (SAME): the principal's rule "all 40 must go" and the grant make Zawar impossible; (c) and (d) are one calculation, so the decision is dictated (MEDIUM). Part (d) tacks on "what does the chapter say about hill forts" which is a recall line. Fix: remove the "all 40" rule or make both sites affordable and pick on the learning aim.
- #15 says "two facts" but the key and the 3 steps expect three items (water scarce, sand/rinse habit, taanka). #17 asks "at least four points" but steps allow five marks: align (LOW).
- #1 distractors: "Rainwater stored in kunds is washing it away" and #3 "Zawar mines would become taanka tanks" are not chapter confusions, they are filler (LOW).
- Easy/recall: #3 (stem hands the answer), #4 (NOT-minerals, SAME), #5 (two caption lookups, SAME), #6 (stem lists the minerals, SAME), #9 (a trivial addition + one-line barrier role), #11 (one sentence of the book mapped to noon/midnight), #12 (define taanka, SAME), #13 (subtract 800 from 2026 + a mineral list), #15 (SAME), #16 (the claim restates two book lines; verdict Yes), #17 (5 marks, list five facts, SAME), #2 (compare two lists printed in the stem; medium-light).
- Repetition: taanka/kunds tested in #10, #12, #15, #18, #19 (five items); the Aravalli "barrier" role in #3, #9(b), #14, #17.

### C7S-1.5 (21 questions, 13 identical to backup)
- Recomputed: 40% of 500 = 200 ha, leaving 300 (right); Rs 400 - 300 = Rs 100 crore (right); river count 3 east / 2 west (right: book p017). Facts match pages 016-018.
- Fill-in #4 "Tapti flows west, drains into the ___ Sea" key "Arabian": a one-word lookup, and "west" in the stem gives the answer (EASY; not application).
- #20 and #21 case studies are the same frame (a) lookup, (b) lookup, (c) "what harm does the chapter link with coal?" (identical in both, so the same fact is scored twice in one concept) and (d) a decision whose answer is dictated by a pledge / rule written into the stem ("has publicly pledged to cut its contribution to global warming"; "accept only a project that does not threaten the forest") (MEDIUM, template and strawman). Fix: change one so the "harm" is not repeated, and let the stem give two competing aims so the decision needs a trade-off.
- #9 assertion_reason: R ("All the tribal communities of India live on the Peninsular Plateau") is absurd on its face; A-true/R-false is guessable (EASY-ish).
- #8 statement 1 uses "younger than the Himalayas", which the book does not say (it says only "a very old land formation"); keep "recent" only.
- Easy/recall: #2 (taller/lower, SAME), #3 (stem says "wall along the west coast"), #4, #5 (4 lookups, SAME), #6 (one sentence, SAME), #7 (one sentence, SAME), #10 (two definitions, SAME), #11 (names from a list), #12 (stem quotes the definition), #13 (caption lookup), #14 (True item = book sentence), #16 (relabelled Create: write a clue for each of three features, SAME), #18 (5-mark list restatement, SAME), #19 (5 marks to restate three descriptions in the order the stem gives, SAME).
- Repetition: waterfalls tested in #7, #12(b), #13, #14, #17, #20(a); Ghats heights/sides in #2, #3, #5, #16, #19.
