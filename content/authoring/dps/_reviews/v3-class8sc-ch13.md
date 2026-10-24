# Review v3: class8sc ch13 (CBSE Class 8 Science, Curiosity Grade 8, ch13, hecu113)

File read: `content/authoring/dps/class8sc/ch13.json`, all 124 questions, none sampled (C1 20, C2 21, C3 20, C4 21, C5 21, C6 21). All indices below are the NEW 0-based positions inside each concept (the concepts were reordered after the fix).
Method: every key decided before reading the answer; numbers recomputed in python; facts checked against book pages 210-225 (`content/extracted/hecu113/pages/`). Three-statement `multi_statement` accepted as the DPS standard.

## Verdict: NOT load-ready (1 HIGH, 13 MEDIUM, 40 LOW). Pass after fixes.

The fix pass cleared every v2 HIGH and nearly every v2 key or fact problem. It introduced one new HIGH (13.4 [14], a premise the book's own definition contradicts). The remaining MEDIUMs are mostly repetition and recall-in-disguise that the pass reduced but did not remove, plus one mechanical format issue (the answer string). Minimum to load: fix the HIGH, M1 (answer strings) and M12 (stem leak). The rest are the author's call but should be cut if time allows.

## v2 status (confirmed)
- **v2 HIGH, tulsi item: FIXED.** Now 13.4 [2]. (a) states "the nutrients are in the soil but are not reaching the leaves", so only nutrient transport is defensible (photosynthesis input is excluded by the premise). (c) no longer excludes rain; it asks which Earth system holds the water that refills the soil through rain, rivers, lakes and groundwater; key hydrosphere. Stem and key agree. Residual LOW only (L20).
- v2 M1 (rice, water as second answer): fixed, 13.1 [1] now asks which supplies the nutrients.
- v2 M2 (air in "same part of the planet"): replaced; 13.1 [19] now allows water, soil, rock, timber. Residual LOW (L2).
- v2 M5 (Mars gravity over-claim): fixed. No item says Mars's thin air is caused by weak gravity or that "Mars is smaller than Earth". 13.3 [13](a) only asks the chapter's note ("100 times thinner", Mercury none); 13.3 [0](d) applies the Earth-smaller-same-density sentence to an invented planet Y.
- v2 M10 (burning leaves vs pit): fixed. 13.4 [9] is now a real trade-off (burning: one hour, no space, smoke over classrooms; pit: space, 3 months, smell, nutrients back), uses 15 sacks (15 x 3 = 45 held at once), and makes no ash claim. Key rests on the smoke premise in the stem and the decomposer role.
- v2 M14 (13.6 assertion-reason): fixed. 13.6 [11] A "even a small increase in global temperature can put many coastal cities at risk", R "a rise can melt ice caps and raise sea levels": R unarguably explains A; one defensible key.
- v2 reverse item premise (air): replaced (see L2). Repetition: reduced but not cleared (M4, M5, M8, M10, M11, M13). Recall items: the worst ones were replaced; others remain (M2, M3, M6, M7, M9, M11, M12).
- Not fixed from v2 LOW and still true: 13.6 [13] (solar versus trees settles 9 to 1 with no cost, L24), 13.6 [14] (global warming defined by the key though the book never defines the term, L25), 13.3 [16](d) (forced decision, L14).

---
## HIGH

**H1. C8SC-13.4 [14]** (short_answer, 2) "Differentiate between the biosphere and the geosphere ... Then say why a fish in a river belongs to the biosphere while the pebbles on the riverbed do not."
- The book (p.219) defines the biosphere as "all living beings, along with the places where they live ... This includes land, water, and air." A riverbed is a place the fish lives, so by the book's definition the pebbles are also part of the biosphere. The key's own first sentence repeats this ("living beings together with the places where they live (land, water and air)") and then asserts the pebbles are not in it. The stem states as fact something the book contradicts, and a student who follows the book is forced to defend a false premise or lose the mark.
- Smallest fix: drop the false premise. Ask "Say why the fish itself is counted as part of the biosphere, and which Earth system the pebbles themselves (as rock) belong to", key "the fish is a living being; the pebbles are solid rock, geosphere". Or ask only for the two definitions plus an example of each.

---
## MEDIUM

**M1. Format, whole chapter.** The `a` text is not identical to o[0] on 37 objective items (26 plain mcq and the assertion_reason, multi_statement and match items); every one is `o[0]` followed by an explanation. For mcq the two are joined with no punctuation, so the stored answer reads "The inner core The path runs crust, upper mantle ..." (13.1 [0], [5], [13], [15], [18]; 13.2 [1], [4], [9], [13], [18]; 13.3 [1], [2], [6], [14], [17]; 13.4 [1], [8], [12], [19]; 13.5 [3], [8], [13]; 13.6 [0], [12], [16], [20]; and the AR, MS and match items listed by the loader's own `A!=o0` count). The key (o[0]) is correct everywhere and the loader accepts it, but `answer` is stored as `a`, so the marked-paper screen would show the mashed string. The other DPS chapters (class7, class9, class8sc ch09/ch11) hold `a == o[0]`. This was already true in the pre-edit copy (0 of 44), so it is not a regression. Fix: set `a` to exactly the o[0] text, or put a full stop and a dash between key and explanation on every item.

**M2. 13.1 [14]** (long_answer, 5) "five-point talk 'Why Earth is special', using only Section 13.1 ... one point, with one supporting fact, for each heading". Five marks of reading Section 13.1 back (planet among billions, thin crust, layers, one Table 13.1 feature, rock/timber/soil). No thinking beyond selection. Fix: give a new situation (a visitor who thinks Earth is "just another planet") and ask for a justified reply using three chosen facts, or use the facts to rank them.

**M3. 13.1 [10]** (giraffe, 2). (a) "Which force, recalled from Chapter 5" is given away; (b) asks the giraffe's heart to "pump blood upward against gravity", which is the Table 13.1 sentence the stem quotes. The v2 recall item was reskinned, not changed. Fix: ask a prediction, for example what happens to the pull on the giraffe's blood when it lowers its head to drink, and why the heart has less to push against.

**M4. 13.1 repetition.** Thin crust / apple skin / life only in the crust or layer order: [0], [2], [4], [7], [12], [13], [14], [16], [19] (9 items, v2 had 10). Table 13.1 features (air held, blood against gravity): [5], [6], [8], [9], [10] (5). "Earth gives air, water, soil, rock, timber": [1], [14](e), [17], [18], [19] (5). Limit is about two per idea. Fix: cut [12] (layer order, also tested by [0] and [16]), [13] (strawman correction, near-given), [9] or [8] (one of the two Table 13.1 gravity items), [17] (reads the provides-sentence), and replace with unused C1 ideas (why the "billions of planets" sentence says "as we know today" is already in [3]; use a prediction on Fig 13.1 scale or an "Earth among planets" comparison with the Table 13.2 rows).

**M5. 13.2 repetition.** Venus hotter than Mercury: [3](b), [6], [10], [15], [19] (5). Planet order: [4], [6], [11], [12], [16], [17], [20] (7). "Greenhouse effect is good for Earth": [2](b), [5], [18], and 13.4 [6] (4 across the chapter). Plant-greenhouse box: [7], [13], [14] (3). Fix: drop [15] (a book sentence as AR) or [19]; keep one of [12] and [20] (both "predict temperature from distance"); drop [13] or [7].

**M6. 13.2 [14]** (long_answer, 5) is the "A step further" box read back: (a) closed space, (b) doors shut, (c) correct the son, (d) "both keep things warm" (one mark for a phrase the book gives). With [7] and [13] it is the third item on the same box. Fix: replace (d) with a prediction (a tightly sealed greenhouse on a cloudy day versus a sunny one) or fold into one item.

**M7. 13.3 [13] and [14]** recall. [13] (5 marks): (a) one mark is "state what the chapter says about Mars and Mercury right after making this point" (a pure read-back, and no reasoning is asked), (b) bones crushed (one line), (c) "any two reasons the atmosphere matters" (read-back). [14] (mcq) is the "bones crushed" sentence, and "bones crushed" is tested again in [16](c): three items on one sentence. Fix: [14] drop (keep [13](b) and [16](c)); [13](a) ask why Earth, not Mercury, could keep gases rather than "state what the chapter says".

**M8. 13.3 repetition.** Mars at the edge / past water: [0](c), [8], [9] (Statement 2), [11], [16](d), [18] (6). Cosmic rays / solar wind / magnetic shield: [4], [5], [10], [15] (item 1), [2] (5). Naming the two streams is asked in [4], [5](a), [10](a). Fix: cut [10] (names only) and [18] (repeats [11]); keep [11] and one of [8]/[9].

**M9. 13.4 recall.** [4] (5 marks) "give five different roles of the atmosphere from Section 13.4" is five one-line read-backs and the key accepts "any five" from the section. [20] (5 marks) is five one-mark read-backs chained (clouds, solvent, nutrient transport, photosynthesis); only (e) synthesises. [8] (mcq) is the "cutting a forest" example as one line, duplicating [7]. Fix: [4] ask which one role is lost first if the atmosphere were removed and how the others follow; [20] give the deer/tree chain with a numeric or a changed condition (a drought stops step (b), what stops next); drop [8].

**M10. 13.4 repetition.** Geosphere definition / soil is part of it: [3], [5] (item 2), [14], [16], [18], [20](b) (6; v2 asked for two or three). Groundwater in the hydrosphere or "rain refills groundwater": [0], [2](c), [5], [13], [15], [20](a) (6). Photosynthesis/oxygen: [4], [11], [20] (3, acceptable). Forest cut down: [7], [8] (2, fixed). Fix: cut [16] (claim_check on the geosphere) or [18] (AR on the geosphere), and [11] or [20](d).

**M11. 13.5 recall and repetition.** [4] (5 marks) is p.219-222 read back (genes, camel hump, antibiotic bacteria, mixing, new features). [2] reproduces the book's banyan example with a peepal (all three parts are book sentences); [0] and [18] read the plant-reproduction paragraph; [20](a) is recall. Repetition: reproduction in animals (external versus internal, birds versus mammals): [11], [12], [14], [15], [19] (5; the claim [19] and true_false [11] ask nearly the same bird/mammal point). Asexual exact copy versus sexual mix as a comparison task: [1], [3], [5], [9], [15] (5), and variation through gametes in [4], [6], [7], [13]. Fix: drop [2] or [18] (keep one dispersal item), drop [11] (true_false duplicates [19]), keep three of the five asexual/sexual comparisons, and make [4] a justified use of the camel or bacteria example in a new case.

**M12. 13.6 [2](a)(b) answered by the stem, and [12] duplicates them.** [2] stem says "grasses feed deer and grasshoppers, and foxes hunt them"; (a) "Which animals will lose their food first" and (b) "how foxes will be affected" are read straight off that sentence. [12] (mcq) is the same chain again (grasses die, deer and grasshoppers, then predators) and is the book's own example in one line. Fix: [2] remove the food-chain sentence from the stem so (a) and (b) need the chapter, or replace (a)/(b) with an unlisted effect; drop [12] or change it to a prediction in a new habitat.

**M13. 13.6 [4] and repetition.** [4] (5 marks): (a) two gases, (b) what they do, (c) the balance are the paragraph read back; only (d) predicts. "Extra carbon released faster than Earth can absorb it": [4](c), [5], [16], [18] (Statement 3) (4; v2 had 3). Fix: drop [16] (a one-line reason with stock distractors); make [4](a)-(c) one two-step reasoning part.

---
## LOW

L1. **13.1 [4]** (a) and (b) are pure arithmetic from the stem and need no chapter; only (c) uses the "thin skin" idea. Decision is steered by "judged mainly on scale". Acceptable; give the felt a second real advantage (it survives handling) for a true trade-off.
L2. **13.1 [19]** (reverse) allows "water to drink"; the sample answer names "the hydrosphere" (a 13.4 term not yet taught in C1) and the claim "all three come from the thin outer part where life is found" is not stated for water in the book (Fig 13.1 text only says "from the tallest mountain to the deepest ocean trench"). Restrict to soil, rock and timber, or accept "the thin life-holding layer" only.
L3. **13.1 [1]** two-mark item is read-back of the provides-sentence plus a timber/stone distinction the book never draws; fine for 2 marks but low on thinking.
L4. **13.1 [8]** the key says gravity "pulls on the blood in our body too"; the book never states that, it only implies it via Table 13.1. Say "gravity pulls on us" or accept "the claim's first half is not stated for blood".
L5. **13.1 [11]** (a) and (b) can be answered from common sense and the stem; the chapter adds only the "as we know today" sentence. Add a part that uses the habitable zone from 13.3, or accept.
L6. **13.1 [12]** true_false on the order of layers is a one-line fact; fine as a slot, but the misconception is thin (the real error would be skipping the lower mantle, which the stem names).
L7. **13.1 [13]** distractors "stone from the outer core, timber from the upper mantle", "inner core, the hottest and largest store" are absurd; make one of them a real confusion (for example, "stone comes from the mantle where rock is formed").
L8. **13.1 [18]** the stem tells the student the rock has "no air, no water, no soil", which is the key's list; make the contrast less given (name only what the rock lacks in one phrase).
L9. **13.1 [0]** the stem relies on "the chapter's figure of Earth" for the five layer names; the figure is not described in the stem. The key names all five, so it is checkable, but state the five layers in the stem or tag as figure.
L10. **13.2 [16]** fill_blank answer "Neptune" is a name taken from the end of the book's planet list, not a computed or reasoned term; make it "the planet third from the Sun that this rule makes warmer than Mars" or compute something.
L11. **13.2 [12]** relies on "Jupiter is the biggest planet", which the book never says (it says "large planets"); the key does not need it, so it is a stem premise only; say "large planet".
L12. **13.2 [11]** statements 1 and 3 are blatant (rocky giants; Mars between Venus and Earth). Make one subtler (for example "Mars is a gas planet that is smaller than Earth").
L13. **13.3 [0]** (d) X versus Y is forced by the chapter's own sentence (smaller, same density, loses gases); make Y's disadvantage partial so both choices need a reason. (c) "Mars" for a planet "near the outer edge": the book says "at the edge" without saying inner or outer.
L14. **13.3 [16]** (d) Planet D matches Earth on every listed feature and each other planet has one stated defect; no trade-off. The second half (conditions are not proof of life) rescues it. Give D a defect (no ozone layer) and another planet a strength to make it a choice.
L15. **13.3 [8]** the key says Mars "does not have such oceans now", which the book does not state (it says Mars may have had water in the past). "Reddish-brown" is an extra premise. Say "no proof of water now".
L16. **13.3 [9]** all three statements are true; no false statement to hinge on a word (a deliberate "all three" key), and each is a book line. Make Statement 3 subtly false ("keeps the amount of sunlight exactly the same at every place and time").
L17. **13.3 [12]** R ("ozone blocks the blue part of sunlight") is absurd; use the real misconception (R: "the ozone layer is the reason Earth is called the Blue Planet" or similar). Also, 7 assertion-reason items in the chapter give keys: explains x3 (C2, C5, C6), not-explains x1 (C1), A true R false x2 (C3, C5), A false R true x1 (C4); "true but not explanation" is thin.
L18. **13.3 [15]** match is four one-line feature-to-effect pairs (compass, UV, atmosphere held, liquid water); acceptable for the match slot.
L19. **13.4 [10]** fill_blank 200 x 70% = 140: the 70 per cent is given in the stem, so no chapter fact is needed; application is one multiplication.
L20. **13.4 [2]** (c) "Which Earth system holds the water that refills the soil ... through rain, rivers, lakes and groundwater?" The word "rain" lets a student say atmosphere (clouds). Delete "rain" from the list. (a) is nearly given by the first stem sentence ("nutrients are in the soil but not reaching the leaves"), a deliberate fix, but it makes (a) easy.
L21. **13.4 [13]** (d) "which project deals with the cause of the problem" steers the answer; a pedant says the cause is less rain, which neither project fixes. Rephrase "which project works with the way the chapter says the well is refilled". The stem supplies the pond mechanism (not in the book).
L22. **13.4 [17], [19], [1], [12]** one-line recall with stock distractors (geodiversity versus biodiversity; rainfall changes plants and animals; roles of water in animals; soil nutrients). Add one wrong option from a neighbouring idea in each.
L23. **13.5 [17]** (d) the data settle the choice 7 to 1 (35 pods versus 5), so no real trade-off; (c) says "wind"; the book also lists "animals" and a fine net would probably also keep out birds, so state that the net only keeps out insects (it does). Add a cost to spraying after flowering.
L24. **13.6 [13]** solar versus 40 trees settles 9 to 1 and no cost is given; add a cost or time factor if a trade-off is wanted. (b) and (c) are arithmetic from the stem.
L25. **13.6 [14]** the key defines "global warming" as "what the chapter calls the result when greenhouse gases trap extra heat"; the book never defines the term (it says "which causes global warming" then defines climate change). Ask only what climate change means, or accept both readings.
L26. **13.6 [2], [5], [17], [20]** (2) Plan B wins on habitat, fertiliser and chapter advice, with Plan A's only advantage being income; (5) the notice contains an absolute ("nobody needs to cut"); (17) the key repeats the stem's own phrase; (20) acceptable (distractors are real confusions: burning plastic, one tree, extra fertiliser).
L27. **13.2 [2]** (a) "How does the chapter describe the air on Venus" is one-line recall, with (b) the reasoning. **13.6 [0]** one line, distractors weak ("ozone matters only to plants").
L28. **13.5 [2]** key accepts only "a bird"; the book says "birds or animals", and wind dispersal is outside the chapter. Mark scheme: accept any fruit-eating animal.
L29. **MCQ key length, chapter-wide.** The correct option is never the longest of the four in all 26 plain mcq (rank 2: 9, rank 3: 7, rank 4 = shortest: 10). Not a cue to guess, but it is the reverse pattern; lengthen a few keys.
L30. **13.4 [5]** (match) item 3 "the carbon dioxide a mango tree takes in": biosphere is a tempting alternative to the key atmosphere (the tree is living); it is resolved by the full pairing only. Say "the carbon dioxide in the air around a mango tree".
L31. **13.5 [20]** (b) "a skin cell from a cow's ear still carries the instructions for bones" goes one inference past the book ("stored inside every cell"); fine as an application, but the key should say so.
L32. **13.4 [0]** (a) "What does water vapour form and bring" is one line; (b) is the real question.
L33. **13.6 [7]** (a) is three obvious one-line matches; (b) is the thinking.
L34. **13.6 [19]** (a), (b), (c) are paragraph read-backs; (d) is the judgement. Fine for a compare slot.
L35. **13.6 [3]** match: Kyoto and Paris both "committed countries to reduce emissions" in the book; item (d) is made unique by the 18-year arithmetic (2005 - 1987 = 18; Paris would be 28). Correct, but the arithmetic is the only separator; fine.
L36. **13.2 [1]** (mcq, order of greenhouse events) is a one-line book mechanism with four sequences; fine, low thinking.
L37. **Template.** Claim-check frames are now varied (poster, quiz team, Kunal, Meena, Asha, Imran, revision notes, a notice) but the three "No" claims in C2, C3, C5/C6 all contain an absolute ("only", "nothing else", "simply"); vary the flaw type.
L38. **13.5 [1]** statements 2 and 3 are both false; fine, but both false statements are on reproduction mode, so the false position is the same type (a mode swap).
L39. **13.4 [9]** "15 x 3 = 45 sacks" ignores shrinkage while leaves decompose; the stem says "emptied every 3 months", so 45 is the intended hold. Fine.
L40. **13.3 [1], [3]** one-line recall with a scenario frame (ozone blocks UV; microbes survive in frozen places). Acceptable.

---
## Per-item checks done on every item
- **Keys:** every key recomputed or read off the page. All 124 have exactly one defensible answer except H1 (the premise contradicts the key) and the residual note L20. Correct MCQ option is o[0] on all 26 mcq, 7 assertion_reason, 7 multi_statement, 5 match, and no wrong option equals the key text or another option (token-overlap check: no pair above 0.7).
- **Step marks:** sum to the item marks on every item with steps (script check, no mismatch). Part marks in the stems match the steps (13.1 [6], 13.3 [5], [13], 13.4 [20], 13.5 [14], 13.6 [4], [19]).
- **No option named by position:** none (script and read).
- **Scope:** all facts are in the chapter (Table 13.2 rows used as facts: only Mercury, Venus, Earth; Venus radius 0.95; Mercury 170; Earth 15). Invented planets, figures and the 40 km crust are labelled illustrative. scope_out respected: no Mars gravity numbers, no formal genetics terms, no rock types, no Kyoto/Paris clauses, no emission numbers. No unsafe task: leaf burning and pesticide spraying are only choices to judge, never procedures.
- **Numbers (python):** 400 km per cm, crust 1 mm, felt 5 mm = 200 km; 4 cm apple gives 0.25 mm; Venus 0.95 x 6400 = 6080 km, difference 320 km, 450 - 15 = 435, 450 / 15 = 30; 450 - 170 = 280; habitable zone X 120 and Y 175 inside 90-180, W 60 too close, Z 250 too far; 200 x 70% = 140; 15 x 3 = 45; rainfall 900 - 500 = 400, well 11 - 6 = 5, Year 4 rain +150, water 2 m closer; 400 -> 800 -> 1600 -> 3200; 80 - 45 = 35 pods; 3 x 2.3 = 6.9 kg; 750 x 0.8 = 600, x 12 = 7200, / 20 = 360, 40 trees = 800, ratio 9; 2005 - 1987 = 18 (2015 - 1987 = 28). All correct.

## Counts and template check
- Types: short_answer 47, long_answer 27, mcq 26, assertion_reason 7, multi_statement 7, fill_blank 5, match 5. Marks: 1 x50, 2 x30, 3 x19, 4 x12, 5 x13. Difficulty Hard 98, Hardest 26, no Easy. Bloom: Analyse 57, Apply 32, Evaluate 24, Create 6, Understand 5 (4%); Analyse/Evaluate/Create = 87 (70%).
- Slot order per concept is no longer identical (compared the type/marks sequences of all six; each is different; case studies sit at positions 2-3, 9, 10, 13, 16, 17 and so on). The v2 "one mould poured six times" finding is cleared.
- `multi_statement` keys: "1 and 3" (C1), "2 only" (C2), "all three" (C3), "2 and 3" and "1 and 3" (C4, two items), "1 only" (C5), "1 and 2" (C6). False statement at 2 (C1), 1 and 3 (C2), none (C3), 1 and 2 (C4), 2 and 3 (C5), 3 (C6). Well spread.
- `assertion_reason`: explains x3, not-explains x1, A true R false x2, A false R true x1 (all four outcomes present; see L17).
- claim_check verdicts (8): No x4 (C2, C3, C5, C6), Yes x2 (C2, C4), Partly x2 (C1, C5). About right.
- true_false verdicts: C1 False, C2 True, C3 False, C4 True, C5 True, C6 False (50 % True).
- Correct option longest: 0 of 26 plain mcq (shortest in 10; L29).
- fill_blank (5): 0.25, Neptune, 140, 3200, 6.9: all word or number answers within four words; Neptune is a copied name (L10), 140 needs nothing from the chapter (L19).
- Repetition above two per concept: C1 three clusters (M4), C2 four (M5), C3 two (M8), C4 two (M10), C5 three (M11), C6 two (M12, M13).
- Recall-in-disguise (the answer is a one-line book fact): about 25 items are listed under M2, M3, M6, M7, M9, M11, M12, M13 and L-notes; roughly 10 are 5-mark items that read a section back.
- Figures needed but missing: none. "As in the book": none.

## Per-concept verdicts
- **C8SC-13.1: fix.** No wrong key. Repetition (M4) and recall (M2, M3) remain; L2 residual premise.
- **C8SC-13.2: fix.** No wrong key. Repetition (M5) and the box read-back (M6).
- **C8SC-13.3: fix.** No wrong key; Mars over-claim gone. Recall (M7), repetition (M8).
- **C8SC-13.4: fix, one HIGH (14).** v2 HIGH cleared; new HIGH H1; M9 recall, M10 repetition.
- **C8SC-13.5: fix.** No wrong key. M11 repetition and recall.
- **C8SC-13.6: fix.** No wrong key; AR fixed. M12 (stem leak), M13.

**Verdict line: not load-ready. Pass after fixes. The single HIGH (13.4 [14]) must be fixed; M1 and M12 are cheap and should be fixed with it; the remaining MEDIUMs are repetition and recall that the owner may accept or cut.**
