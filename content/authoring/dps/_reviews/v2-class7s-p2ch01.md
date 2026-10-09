# v2 review: class7s p2ch01 (The Story of Indian Farming), DPS pack with all item types

File: content/authoring/dps/class7s/p2ch01.json. 168 questions read (8 concepts x 21), every one.
Source pages: content/extracted/gees201/pages/001-028. Method: stem and book first, key second; numbers recomputed in python.
Text-identical to the v1 backup (stem match): 108 of 168 (C7S-1.1 14, 1.2 14, 1.3 15, 1.4 14, 1.5 14, 1.6 12, 1.7 12, 1.8 13). The other 60 are NEW.
Notation: concept#position (1-based position in that concept's list). SAME = stem unchanged from backup, NEW = added in the rewrite.

## Per-concept working notes (appended as I go)

### C7S-1.1 (agricultural landscape)
All numbers recomputed and correct: 46% of 8,000 = 3,680; 46% of 4,500 = 2,070; 46% of 10,000 = 4,600; 18% of Rs 200 cr = 36; 75% of 200 = 150, 46% = 92, 18% = 36; 75% of 300 = 225; case study 210+30+12+8+10 = 270, 270/600 = 45%, 216/270 = 80%. No wrong key found. Facts (Latin agri/culture, 18%, 46%, 75% women, apiculture, fibre/silk list, Fig 1.1 caption) match pp.2-3 of the book.
- 1.1#16 case study part (a) "Which of these entries would the government count..." is answered by the stem itself ("the five farm-linked groups"): free mark. MEDIUM.
- 1.1#19 case study part (a) "What does each of the two figures measure?" is printed in the stem ("46 out of every 100 workers ... 18 out of every 100 rupees of the country's output"): free mark. Part (c) is a strawman ("our farmers must be lazy" vs Zoya): standard bars a strawman as the decision; (c) is not the last part, but it is an absurd claim. MEDIUM.
- Repeated ideas: "46% is workers, 18% is output, they are different measures" is tested in 1.1#1, #14, #19(a)(c) and #3 (4 items). "Apply 46% to a working-population total" is tested in #9, #17, #19(b), #5, #16(b) (and 75% in #11, #21a). #9 and #17 are the same item with different numbers. MEDIUM.
- 1.1#15 uses Fig 1.1 (figure content described in words) but tag is None: should carry `figure`. LOW. It is also easy (sorting oxen/hand vs tractor/transplanter is obvious from the stem).
- 1.1#9 fill_blank key "3680": accept also "3,680" in the matcher (LOW).
- 1.1#10 stem puts a paraphrase in quotation marks ("is a blend of the traditional and the modern, with many crops and deep-rooted traditions"); book wording is "vibrant blend of traditional and modern farming practices, with diverse crops and deep-rooted cultural traditions". LOW: drop the quote marks or quote exactly. Answer maps "deep-rooted tradition" to "families farming the same land for generations", which are two different sentences in the book (LOW).
- 1.1#18 statement 2 ("done only by men, since women take no part...") is an absurd statement: false but trivially. LOW.
- Easy in disguise (see EASY LIST): 1.1#2, #3, #4, #6, #7, #10, #12, #15, #17, #20.

### C7S-1.2 (early farming, echoes from the past)
Checked against pp.3-5, 19. Computed: 20 waterings / 2 per day = 10 days; 12 x 15 x 2 = 360; 2800 BCE to 1960 CE = 2800+1960 = 4,760 (book caption says about 4,800, key says so); 3500 - 2800 = 700. Keys all correct; match 1-d,2-a,3-b,4-c correct. multi_statement: 1 false, 2 true, 3 true, key "2 and 3 only" correct. No Vedic-age inference and no "Sanskrit" label found in this concept (the Vedas appear only as the book's own yava/godhuma/vrihi mention).
- 1.2#6 option 4 "The Krishiparashara, a text of Kautilya's time": invented attribution (the book does not date Krishiparashara or tie it to Kautilya) and it is the longest option (46 vs 23-28). MEDIUM. Fix: "Kṛiṣhiparāśhara" only, same length as the others, or drop.
- 1.2#7 case study (d): the "A" draft and the "B" draft are both fully supported by the chapter, which is fine as a real trade-off. No wrong fact. But the vocabulary "Vedic times" in the poster claim is the item's own, not the book's: fine because the answer says the poster must not claim it. No fix needed.
- 1.2#18 case study (a) "Arrange the three cards earliest to latest": all three dates are printed in the stem, so it is a free mark. (c) is bare recall (two of asses, dogs, pigs, fowl). Parts do not climb; (d) has an obviously better answer (grafting is "still in use"). MEDIUM. Also the step line for (d) ends "(the reason must use a figure or fact from the stem)": an author note leaked into the marking scheme (same text in 1.1#16); LOW, delete.
- 1.2#19 part (a) "Which crops were the staples?" is printed in the stem's first sentence: free mark. MEDIUM.
- Repeated ideas: Harappan rice vs staples barley/wheat in #10, #13, #19 (3 items). Chronology/ordering of dates in #2, #18(a), #20, #21(b) (4 items). Watering schedule in #3, #14(opt), #15, #17 (3 items; #3 and #17 are the same arithmetic). Intercropping/Kalibangan in #4, #5, #8, #18(b), #21. MEDIUM.
- Easy in disguise: 1.2#2 (borderline: two dates and a subtraction), #4, #5, #6, #8, #9, #11, #14 (match = four one-line lookups), #16, #19, #21.

### C7S-1.3 (climate, agroclimatic zones, monsoon)
Checked against pp.6-7, 9, 10. Computed: 300+450 = 750, 450/750 = 60%; June-Sept 4 months + Oct-Dec 3 months = 7. Keys all correct. multi_statement: 1 true, 2 true, 3 false ("only ... no irrigation"), key "1 and 2 only" correct. Assertion-reason #5 A true, R true, R explains A (book: "on account of availability of water from the monsoon as well as irrigation"); #10 A false (north India does not depend on the NE monsoon), R true, key "A false, R true" correct. 'NOT' item #20 key correct.
- 1.3#1 case study: the stem prints the monsoon for crops 1 and 2 ("sown in June when the southwest monsoon arrives", "in October, when the northeast monsoon rains begin"), so (a) is two-thirds a free mark; (b) "What name does the chapter give to the water supply that makes the third crop possible?" (answer "Irrigation") repeats the third item of (a). Parts do not climb until (d). The key writes "irrigation (groundwater)": the book does not say Andhra Pradesh's irrigation is groundwater. MEDIUM. Fix: drop (b) or make it "name two sources Lakshmi could use for crop 3 and say which the chapter says is falling"; remove the "(groundwater)" gloss from (a).
- 1.3#6 case study is sound (invented rainfall labelled invented; (d) is a real two-way decision). Only LOW: (a) says Q gets "all of its rain in the southwest monsoon" which is the item's own invented data, fine.
- 1.3#2 true_false: the "misconception" (zones drawn on rainfall alone, always same zone) is an invented absurdity, not a confusion from the chapter. The real confusion is zones = the seven climate types. LOW. Fix: "The 15 agroclimatic zones are the same thing as the seven climate types." (False; zones add soil, terrain, vegetation.)
- Repeated ideas: agroclimatic zones = climate + soil + terrain + vegetation, for planning, in #2, #3, #4, #8, #9, #15(1), #16(b) (7 items). "South gets both monsoons so it can grow crops in between" in #1, #11, #12, #14, #17(b) (5 items). NE monsoon Oct-Dec in #10, #20, #21, #18. Climate-type list lookup in #13 and #19. MEDIUM: cut to about 2 per idea and replace with new ideas (e.g. Arthashastra rainfall-pattern quote on p.10, which no item uses).
- #1, #6, #14: "(the reason must use a figure or fact from the stem)" is an author instruction left inside step text. LOW.
- Easy in disguise: 1.3#3, #4, #5, #8, #9, #11, #13, #14, #16, #17, #18 (4+3 months), #19, #20, #21.

### C7S-1.4 (kharif, rabi, zaid)
Checked against pp.8-10 (Fig 1.5 text: rabi = wheat, barley, peas, mustard, gram; zaid = watermelon, cucumber, muskmelon, pumpkin; kharif = rice, maize, jowar, bajra, sugarcane, groundnut, cotton; the crop-to-season grouping is read from the figure's text order, which is consistent with the captions of Figs 1.6, 1.7). Computed: beds 2+1+1+1+2+1+1+1+1+1 = 12 -> kharif 3, rabi 6, zaid 3; hectares 40+55+25+20+6+4+30+20 = 200 -> kharif 90, rabi 100, zaid 10, 90/200 = 9/20 = 45%, 90/10 = 9 times. All keys correct except the one below. multi_statement key "1 only" correct (2 and 3 false). Match 1-b,2-c,3-a,4-d correct.
- **HIGH** 1.4#13 part (b): "Which cropping season's crops are sown with these rains?" key "Kharif". The book gives only a hint ("Did it have anything to do with the crop cycle?") and no answer. The quoted pattern runs July-August to October-November: the late rain (Kartika, October-November) also coincides with rabi sowing, and most kharif sowing is at the start of the monsoon, not "in the middle" (two-thirds). So a second defensible answer exists and the key is an inference the book does not make. Fix: ask only (a) plus "(b) The book hints this pattern is linked to the crop cycle: say which season's crops you think it served and give one reason" with a marking line for a reasoned link to either season, or drop (b).
- 1.4#7 and #16 are two case studies built on the same move (sort crops into the three seasons, then find the share, then which is at risk): repeated. #7 (b) and (c) just read the count from (a) so the parts do not climb; (d) is a weak decision (no data reason either way). MEDIUM. Fix: make one of them about something else (e.g. a monsoon-delay planting calendar with real choices).
- Repeated idea: sort or recognise a crop's season (the Fig 1.5 list) in #3, #7, #8, #11, #15, #16, #20, #21 (8 items). Older names kedara/haimana/graishmika in #3, #10(b), #14, #17, #18. MEDIUM.
- 1.4#17 option text "They were used in the Vedas, and are of Sanskrit origin": the word "Sanskrit" is back in a wrong option (the book never calls any of these names Sanskrit). It is a distractor, so not an unsupported claim, but the earlier fix removed Sanskrit labels; replace with "They were used in the Vedas, as were kedara, haimana and graishmika" or the like. LOW.
- 1.4#5 is tagged claim_check but is "find the swap in a revision note": the verdict is always "wrong"; it is not a claim to test. LOW.
- 1.4#8 fill_blank: accept "sugar cane" (LOW); one-step classification.
- 1.4#12 answer adds "so that food is not available in only one season" which is the author's wording, not the book's; both "reasons" are the same sentence of the book. LOW.
- 1.4#15 uses the photographs of Figs 1.6/1.7 but is not tagged `figure` (LOW).
- Easy in disguise: 1.4#2, #3, #4, #5, #6, #8, #10, #11, #12, #14, #15, #17, #18, #20, #21.

### C7S-1.5 (soil and soil types)
Checked against pp.10-13. Computed: 5,000+8,000+5,000+2,000 = 20,000; (5,000+8,000)/20,000 = 65%. Keys correct; match 1-b,2-a,3-c,4-d correct; multi_statement all three true, key "1, 2 and 3" correct; AR #8 A true, R true, not explanation (correct). Facts (silt, weathering, humus, red/laterite/black/alpine descriptions, Amarakosha twelve types by fertility) match pp.10-13.
- 1.5#5 case study (c): the book gives two durations. Text p.10: "formed over millions of years"; Fig 1.8 caption: "a process that ranges from a century to several millennia". The key lists both, but the step line accepts only "a century to several millennia". A student who writes "millions of years" (the book's own text) loses the mark: second defensible answer. MEDIUM. Fix: step line "millions of years (text) or a century to several millennia (figure)", or ask only about the figure. Also (d) is one-sided (refuse the sale); give the owner a real figure (his yearly farm income vs the offer) or a reason to sell so the decision is a trade-off. LOW-MEDIUM.
- 1.5#13 case study (a): "Old-rock uplands with reddish soil" could also be laterite (also reddish, rain-weathered rock); only "old rock" points to red. LOW. Fix: say "weathered lava that cooled slowly and old rocks" or add "not hardening in heat".
- 1.5#4 asks to rank five soils by fertility; the book states fertility only for alluvial (rich), black (very fertile), red (not very), laterite (not). Alpine is "thin, rough and rocky" with no fertility statement, and the key places it last. LOW. Fix: rank only the four soils the book grades, or make alpine's place a reasoned inference.
- 1.5#11 stem asks "why each looks the way it does"; the book gives no reason for black soil's colour (key silently skips it). LOW. Delete that clause or restrict to red and laterite.
- Repeated ideas: identify black soil from its description in #2, #3, #9(4), #11, #19; alluvial vs laterite swap/compare in #1, #16 (and #9, #12); soil layers/humus in #5, #15, #17. MEDIUM.
- 1.5#6 true_false has verdict True and states a plain book fact; no misconception behind it. LOW (the chapter's T/F verdict mix is checked in the summary).
- Items 1.5#18 and #19 (SAME as backup) restate the glossary description word for word and ask "which soil is it": see EASY LIST.
- Easy in disguise: 1.5#1, #2, #3, #4 (borderline), #7, #9, #10, #11, #12, #14, #15, #16, #17 (borderline), #18, #19, #20.

### C7S-1.6 (soil and water care, irrigation)
Checked against pp.14-18, 16-17 (Fig 1.11, Fig 1.13). Recomputed in python: 2026-1800 = 226; 11th century (1001-1100 CE) minus 226 = 775 to 874 (key says "775 to 875", ok); 120,000/60,000 = 2 ha; 120,000/25,000 = 4.8, so 3 ha cost 75,000, leaving 45,000; (24-12)/24 = 50%; 5x12 = 60 t; 2.5x4 + 2.5x12 = 40 t; 2.5 ha x 80,000 = 2 lakh. All correct. multi_statement: 1 false ("no problem"), 2 true, 3 false (drip described as sprinkler), key "2 only" correct. NOT item #4 key correct (windbreaker, hold soil, another crop are the caption's three benefits).
- **HIGH** 1.6#5 fill_blank: "delivered slowly and directly to the plant roots through a network of tubes and emitters ... called ___ irrigation", key "drip". The book says "Drip irrigation, also known as trickle irrigation" (p.17), so "trickle" is equally correct and a machine match on "drip" would mark it wrong. Fix: accept both "drip" and "trickle", or reword so one answer fits (e.g. "water drips ... the chapter's first-named modern method"). It is also a name copied from the page (see EASY LIST).
- 1.6#1 (a) key "Multiple cropping": "maize, a pulse and a vegetable in different parts of one field so that something is ready to harvest every few months" can also be read as intercropping (book glossary p.4: growing two or more different crops simultaneously; also on p.5). The stem does not separate the two. MEDIUM. Fix: say the crops are sown in different seasons of the same field, or add "the crops are harvested at different times of the year" and drop "different parts of one field".
- 1.6#18 (a)/(b): "around 226 CE" is false precision: the book says "about 1,800 years ago", and (b) depends on a century range, so the step line "by roughly 800 years" is too narrow (a student using 1050 gets 824; one using 1100 gets 874). MEDIUM. Fix: step line "accepts any answer from about 750 to 900 years, Kallanai older"; delete "around 226 CE" from (a) or write "about 1,800 years before 2026, around the 3rd century CE".
- Repeated ideas: soil-erosion methods (contour ploughing, terracing) in #3, #8, #13, #19; drip vs sprinkler in #2, #5, #9, #10, #12, #17 (6 items); crop rotation vs multiple cropping #1, #8, #16. MEDIUM. The Arthashastra/Surapala irrigation, kull/kund/eri names, hydroponics, groundwater decline are barely used (only #11, #14).
- 1.6#12 and #19 case studies are good (real budget trade-offs, arithmetic recomputed). 1.6#12 (b) is recall; fine.
- 1.6#20 correct option (shrines and temples) is a caption lookup; the three wrong options are all true statements about the photograph, which is a fair confusion.
- Easy in disguise: 1.6#2, #3, #4, #5, #8 (borderline), #10 (borderline), #11, #13, #16, #17, #18 (borderline), #20 (borderline), #21.

### C7S-1.7 (seeds, traditional and contemporary farming)
Checked against pp.18-23. Recomputed: seed drill 5 plots x 3 steps = 15, one operation each = 5, saved 10 (key 10, correct); case study 1.7#3 chemical 5.0x20,000-30,000 = 70,000, organic 3.8x20,000-12,000 = 64,000; year 5: 58,000 and 74,000 (all match); 1.7#9 Mehar 30x2,200-1,500 = 64,500, Sonu 36x2,200-6,000 = 73,200, difference 8,700 x 3 = 26,100 (all match). multi_statement: 1 true, 2 false ("always"), 3 true, key "1 and 3 only" correct. AR #10 A true, R true, R explains (book: the revolution introduced these inputs and "led to a significant increase in food grain production ... self-sufficiency") correct. Match 1-c,2-d,3-a,4-b correct. No wrong key.
- 1.7#20 overreach: "Analyse why the chapter treats them [terrace farming, kulagar, gokrishi] as examples of traditional systems that see the plant and soil as one complete system." The book says traditional agriculture treats plant and soil as one system (p.20) and gives terrace farming as an example of traditional farming and kulagar and gokrishi as examples of systems aligned to natural cycles; it does not say that each of the three treats plant and soil as one system. MEDIUM. Fix: "...examples of traditional systems aligned with natural cycles and relying on the family and domestic animals", and keep the plant-soil-organism link as a separate mark.
- 1.7#16 show_impossible: the stem prints the key evidence ("ICAR documented almost 5000 ... over 85 per cent ... validated by modern science"), so the first step mark ("Cites the ICAR validation") is a free mark and the item needs little from the chapter. MEDIUM. Fix: remove the parenthesis from the stem; the student must recall the ICAR figures.
- 1.7#3 and #9 (and 1.6#12, #19, 1.3#6) are the same shape: (a) a recall, (b) and (c) arithmetic on two options, (d) pick one. The decision is real in each, but the case-study set is templated (see Template section). 1.7#3 and #9 are both "compare net income of two ways of farming". MEDIUM.
- 1.7#15 wrong options are absurd absolutes ("never raise wheat or rice output", "machines cannot be used on any farm"); 1.7#21 wrong options are what the Sikkim ban removed, so the stem answers itself. LOW. Fix: use look-alike options (e.g. organic farming vs crop insurance vs hydroponics) for #21.
- 1.7#8 claim_check: the key is "Only partly" but the claim "so nobody questions that kind of farming" is flatly false in the book (scientists question it), so the verdict is really "No, with gains acknowledged". LOW. It is the only "partly" verdict in the chapter, so keep, but sharpen Dev's claim ("The Green Revolution only brought gains") so "partly" is the clean answer.
- 1.7#6 true_false: verdict True and the statement is the book's sentence verbatim; no misconception.
- Repeated ideas: Green Revolution gains and limits in #8, #10, #13, #14, #15, #19 (6 items); company seed dependence in #4, #9, #12; kulagar/gokrishi/terrace in #5, #11, #18, #20.
- Easy in disguise: 1.7#2, #4, #5, #6, #7, #10, #11, #12, #13, #14, #18, #19 (borderline), #20 (borderline), #21; #1 is a one-fact plus subtraction (borderline).

### C7S-1.8 (government role and challenges)
Checked against pp.24-27. Recomputed: 2 ha x 40,000 = 80,000 cost; 2 x 90,000 = 1,80,000 expected; 60% lost = 1,08,000; remaining 72,000; without insurance 72,000-80,000 = -8,000; with insurance -8,000+40,000-5,000 = 27,000; good year 1,80,000-80,000 = 1,00,000 (matches the neighbour's figure); 25,000 sq m = 2.5 ha; 2,300 x 7 = 16,100; 6/3 = 2 ha, 2/2 = 1 ha, 1-0.75 = 0.25 ha above average, 60,000+25,000+15,000 = 1,00,000 with 40% other; machine 12,000+18,000 = 30,000 a year, payback 4 years; 3/4 = 0.75 ha (equal to the average); 0.75/3 = 0.25 ha = 2,500 sq m. All correct. multi_statement: 1 true, 2 false, 3 true, key "1 and 3 only" correct. AR #7 (explains), #9 (true, not explanation) correct. Facts match pp.24-26 (Pradhan Mantri Fasal Bima Yojana, 3/4 hectare ~ football field, 2,300 a day "according to some estimates", over 500 million).
- 1.8#14 case study: (a) is only division and (c) is only addition and a percentage, using numbers printed in the stem; only (b) (needs the 3/4 ha average) and (d) use the chapter. MEDIUM. Same weakness in 1.7#3 (b)(c), 1.7#9 (b)(c), 1.6#19 (b)(c), 1.1#16 (b). Fix: make at least one of the arithmetic parts need a chapter fact (the 3/4 ha average, 1 ha = 10,000 sq m, 18% / 46%).
- 1.8#3 case study (a) "Why does a farmer like Sarita need such a scheme?" is answered by the stem ("Untimely heavy rain destroys 60 per cent of the crop"). LOW-MEDIUM.
- 1.8#20 statement 2 is an absurd false statement ("no help ... because the government charges full rates"). LOW.
- Repeated ideas: "other income sources are not enough" in #6 and #8; landholding division in #13, #14, #15 (three items, though each has a different question); crop insurance in #2, #3, #19; debt trap in #5, #16. MEDIUM.
- 1.8#21: 4 of 5 marks are the p.26 cause list (EASY LIST, borderline).

## Template and distribution counts (read from the file, not impressions)
- Items: 168 (21 x 8). Types: short_answer 66, mcq 39, long_answer 32, assertion_reason 10, fill_blank 8, multi_statement 8, match 5. Bloom: Apply 60, Analyse 50, Evaluate 29, Understand 24 (14%), Create 5 (no Remember, no Easy label). Analyse+Evaluate+Create = 84 of 168 = 50%. Format minimums met: match 5 (needs 4), fill_blank 8 (needs 4), true_false 8 (needs 4); scenario MCQ per concept 4,5,4,3,5,4,4,5 (needs 3).
- Correct MCQ option strictly longest: 0 of 39 (good). Strictly SHORTEST: 20 of 39 (51%). In 6 MCQs (1.1#2, 1.1#20, 1.2#1, 1.3#11, 1.3#21, 1.5#17) distractors carry a "since / because / so" clause while the correct option does not (e.g. 1.1#2 "Farming and horticulture only, since animals and bees are not counted"). A test-wise student picks the plain short one. MEDIUM. Fix: give the correct option a similar clause or strip clauses from the distractors, and re-balance so the key is shortest in roughly one in four items.
- True/False: 8 items, verdicts False 5 (1.1#13, 1.2#15, 1.3#2, 1.6#6, 1.8#6) and True 3 (1.4#2, 1.5#6, 1.7#6): 37.5% True, within the 25-75% band. But two of the three True items are single book sentences (see EASY LIST) and three of the five False ones rest on an invented absurdity rather than a chapter misconception (1.3#2 "rainfall alone", 1.6#6 "only a store of minerals", 1.1#13 is a real one).
- Claim-check (8 tagged): "No" 4 (1.1#1, 1.2#10, 1.3#12, 1.6#7), "partly" 1 (1.7#8), "pick one of two speakers" 1 (1.8#18), "find the swap" 2 (1.4#5, 1.5#16 - not claims, and they repeat the same move). There is no "Yes / right" verdict anywhere. MEDIUM. Fix: turn 1.4#5 or 1.5#16 into a claim that is correct ("Yes, and here is why") and make 1.8#18 a genuine "partly right".
- Assertion-reason keys (10): "both true, R does not explain A" 6 (1.1#14, 1.2#13, 1.4#1, 1.5#8, 1.6#14, 1.8#9); "both true, R explains" 3 (1.3#5, 1.7#10, 1.8#7); "A false, R true" 1 (1.3#10); "A true, R false" 0. MEDIUM-LOW: 60% one outcome; most of the "not explanation" R's are trivia lifted from the same page (Arabic origin, iron colour, Ganga stress). Fix: add one "A true, R false" and make two R's real facts that do explain or fail to explain.
- multi_statement keys (8): 1 and 3 only x3 (1.1, 1.7, 1.8), 2 and 3 only, 1 and 2 only, 1 only, 2 only, all three x1 each. False statement is statement 2 in 4 of the 6 single-false items (1.1, 1.7, 1.8, plus 1.4/1.6 partly). LOW: re-key one of the 1-and-3 items.
- Slot order: the type/mark mix per concept is the same (mcq 4-5, ar 1-2, 2 case studies, 2 five-markers, 3 three-markers, 5-6 two-markers, 1 fill_blank), as the format requires, but the order differs across concepts, so the file is not slot-order templated.
- Case-study shape: 14 of the 16 case studies run (a) a recall or classification, (b)(c) arithmetic on a table of invented numbers, (d) choose one of two. Not a strawman in most, but the shape is the same, and the arithmetic parts do not need the chapter (see 1.8#14 above). 1.1#19 (c) is the one strawman ("our farmers must be lazy").
- Repeated ideas, summary: 46%-vs-18% (4 items in 1.1), Harappan rice (3), date ordering (4), watering schedule arithmetic (3), agroclimatic zones (7), south-gets-both-monsoons (5), crop-season sorting (8), older names kedara/haimana (5), black-soil identification (5), drip vs sprinkler (6), Green Revolution gains and limits (6). Chapter content barely used: Arthashastra rainfall pattern (p.10) appears only in 1.4#13; ICAR 5000 practices (1.7#16 only); FAO heritage systems (p.23) never; hydroponics (1.7#17, 1.8#1); Mehrgarh and Amarakosha once each.
- Option referred to by position in any answer or step: none found (regex over every answer and step). Option text with an explanation appended: no option carries a trailing gloss except the "since/because" distractors listed above and the "Name, gloss" style options in 1.5#12 ("Alluvial soil, from river silt") which is applied evenly and harmless.
- scope_out line: "Map and column-matching exercises / Not answerable without the map". The five `match` items (1.2#14, 1.4#3, 1.5#9, 1.6#17, 1.7#5) are column-matching items; section 12 of the standard requires them, so this looks like a conflict in the scope file rather than an author error, but note 1.4#3 (kharif / rabi / zaid pairings) and 1.5#9 (alluvial, alpine) cover the same pairs as the book's own end exercise 2. None is a copy. LOW. Fix: reword the scope_out line to "the book's own matching exercise (Q2) and map work" and keep the new matches. No map item is present.
- "Vedic-age inference" and "Sanskrit": the only appearances are 1.2#7 (poster claim "grown in Vedic times", which the answer rejects; the Vedas' own mention of yava, godhuma, vrihi, sesame, black gram and pulses is on p.4) and 1.4#17 (a wrong option, see LOW above). No unsupported Vedic/Sanskrit claim stated as true remains. Also no invented captions found: Fig 1.1, 1.2, 1.3, 1.6, 1.7, 1.11, 1.13 and 1.17 descriptions all match the book. The only invented attribution is 1.2#6 option 4 ("a text of Kautilya's time").

## SEVERITY SUMMARY
HIGH (2)
1. C7S-1.4#13 (b): Arthashastra rainfall pattern; key "Kharif" is the author's inference (the book only hints), the late-season rain also fits rabi sowing; second defensible answer. Fix: reduce to (a) or accept a reasoned link to either season.
2. C7S-1.6#5 fill_blank: "drip" vs "trickle" (book: "also known as trickle irrigation"). Fix: accept both or reword.

MEDIUM (13)
- C7S-1.1#16 (a), 1.1#19 (a) and (c strawman), 1.2#18 (a) and 1.2#19 (a), 1.3#1 (a)(b), 1.7#16 (first step): case-study or multi-part items whose first part is printed in the stem.
- C7S-1.2#6 option 4 invented attribution ("a text of Kautilya's time") and longest option.
- C7S-1.5#5 (c): two book durations (millions of years in text, a century to millennia in the figure), step line accepts one.
- C7S-1.6#1 (a): multiple cropping vs intercropping both fit.
- C7S-1.6#18 false precision ("around 226 CE"; "roughly 800" step narrower than the 775-874 range).
- C7S-1.7#20 overreach ("chapter treats them as examples of systems that see plant and soil as one system").
- C7S-1.8#14 (and 1.7#3, 1.7#9, 1.6#19 (b)(c)): arithmetic-only case-study parts do not need the chapter; case-study shape repeated.
- Test-wise cue: correct MCQ option strictly shortest in 20 of 39; reason clauses only on distractors in 6.
- Claim-check mix (no "Yes"; two are swap hunts).
- Repetition (counts above) in every concept; heaviest 1.3, 1.4, 1.6.
- Easy-in-disguise volume (95 firm + 12 borderline of 168, see EASY LIST), which breaks section 12 of the standard.

LOW (about 20)
- 1.1#9 accept "3,680"; 1.1#10 paraphrase in quote marks; 1.1#15, 1.4#15, 1.5#21, 1.6#20 figure items untagged `figure`; 1.1#18, 1.8#20 absurd false statement; 1.3#2, 1.6#6 invented misconception; 1.4#5 mis-tagged claim_check; 1.4#8 accept "sugar cane"; 1.4#12 author wording beyond the book; 1.4#17 "Sanskrit" in a distractor; 1.5#4 alpine fertility not stated in the book; 1.5#11 asks why black soil looks as it does (book silent); 1.5#13 (a) red vs laterite; 1.5#6 and 1.7#6 True with no misconception; 1.7#8 "partly" claim not clean; 1.7#15, #21 weak distractors; the step line for part (d) of 14 of the 16 case studies (1.1#16, 1.2#18, 1.3#1, 1.3#6, 1.4#7, 1.4#16, 1.5#5, 1.5#13, 1.6#12, 1.6#19, 1.7#3, 1.7#9, 1.8#3, 1.8#14) contains the leaked author note "(the reason must use a figure or fact from the stem)"; scope_out wording vs match items; AR key mix; multi_statement key repeat.

## Per-concept verdict
- C7S-1.1: pass after fixes (keys right; stem-printed case-study parts; 4-way repetition of 46 vs 18; 10 easy).
- C7S-1.2: pass after fixes (keys right; invented distractor attribution; stem-printed parts; chronology repeated; 11 easy).
- C7S-1.3: pass after fixes (keys right; 14 easy; zone idea repeated 7 times).
- C7S-1.4: rework (1 HIGH; 15 of 21 easy; season sorting 8 times).
- C7S-1.5: rework (2 MEDIUM; 14 of 21 are glossary lookups or description matches).
- C7S-1.6: pass after fixes (1 HIGH; 2 MEDIUM; the two case studies are the strongest in the chapter).
- C7S-1.7: pass after fixes (overreach in #20; 12 easy).
- C7S-1.8: pass after fixes (3 case studies fine; 11 easy).
Overall: pass after fixes on correctness; rework on the "no easy questions" rule, because 107 of 168 items (64%) are one-step lookups of a line the book states, 55 of the 95 firm ones inherited unchanged from the v1 backup and 40 added new by the rewrite.

## Counts read
168 questions read, every one. Identical to backup by stem: 108 (64%); new: 60. HIGH 2. MEDIUM about 13 groups. LOW about 20. Easy in disguise: 95 firm + 12 borderline = 107.

## EASY LIST
Format: concept#position: [SAME or NEW vs backup (borderline)] reason -- start of stem.
C7S-1.1#2: [SAME] scenario wrapper; answer is the book's one-line term 'agriculture and allied activities' -- "Meenakshi's family in a Tamil Nadu village grows sugarcane, "
C7S-1.1#3: [SAME] 5 marks for reciting the allied-activities list from p.2 -- "Compare 'farming' in the narrow sense with 'agriculture and "
C7S-1.1#4: [SAME] scenario; answer is the one-line '75 per cent women' figure -- "In a survey of a rural block, a student finds that most of t"
C7S-1.1#6: [SAME] define pisciculture / cocoon rearing: two glossary-level lines -- "Differentiate between pisciculture and rearing cocoons for s"
C7S-1.1#7: [SAME] restates the book's THINK ABOUT IT box; answer is its two sentences -- "The chapter asks, 'When you hear the word farmer, what do yo"
C7S-1.1#10: [SAME] 5-mark assembly of Punjab/Kashmir/Nilgiris examples and three figures straight from pp.2-3 -- "'India's agricultural landscape is a blend of the traditiona"
C7S-1.1#12: [SAME] (a) agri/culture meaning, (b) cattle belong to broad meaning: two one-line facts -- "(a) Name the two parts of the word 'agriculture' and say wha"
C7S-1.1#15: [NEW] sort four obvious pictures into old and new; (b) paraphrase of p.3 -- "Fig. 1.1 of the chapter shows: (i) a field ploughed with a p"
C7S-1.1#17: [SAME] one percentage of a total (same as #9); no chapter reasoning -- "A block has 4,500 working people. If it matched the national"
C7S-1.1#20: [NEW] scenario wrapper; one-line fact that fibre and silk are in the govt list (repeats #2) -- "In a class discussion, four students decide whether a cotton"
C7S-1.2#2: [SAME, borderline] borderline: compare two dates and subtract (700) -- "A student draws a timeline in which the domestication of cat"
C7S-1.2#4: [SAME] scenario wrapper for the glossary word intercropping -- "Raghubir, a farmer in Haryana, sows mustard and wheat in alt"
C7S-1.2#5: [SAME] 5-mark assembly of crops, animals and Kalibangan from pp.3-5 -- "'Indian farming has a long and varied history.' Justify this"
C7S-1.2#6: [SAME] scenario; answer is the one sentence crediting Brihatsamhita with grafting (and see MEDIUM on option 4) -- "A horticulture teacher joins a twig of a sweet mango to a ha"
C7S-1.2#8: [SAME] differentiate two glossary definitions -- "Differentiate between intercropping and grafting, giving one"
C7S-1.2#9: [SAME] name three kinds of information the texts hold: list recall -- "The chapter says the old texts show 'a wealth of information"
C7S-1.2#11: [NEW] scenario; identify the quoted seed treatment as Surapala's: lookup -- "A farmer sprinkles seeds with milk, rubs them with cow dung,"
C7S-1.2#14: [NEW] match: four one-line source lookups -- "Match the practice in Column A with the source the chapter l"
C7S-1.2#16: [SAME] compare two seed-preparation lists from the book -- "Compare what Surapala's Vrikshayurveda and Kautilya's Arthas"
C7S-1.2#19: [NEW] (a) staples printed in the stem; (b) paraphrase of the book sentence -- "The chapter says barley and wheat were the staple crops of t"
C7S-1.2#21: [SAME] (a) site and year lookup; (b) 2800+1960 -- "(a) At which site, and around which year, does the chapter s"
C7S-1.3#3: [SAME] 5-mark recitation of the climate paragraph -- "Explain how India's varied climate and its two monsoons deci"
C7S-1.3#4: [SAME] scenario; answer is the definition of agroclimatic zones -- "An agricultural officer must plan what, when and how to grow"
C7S-1.3#5: [SAME] AR whose R is the book's own 'on account of' sentence -- "Assertion (A): Tamil Nadu, West Bengal and Andhra Pradesh gr"
C7S-1.3#8: [SAME] differentiate climate types vs zones: two definitions -- "Differentiate between the seven climate types and the 15 agr"
C7S-1.3#9: [NEW] (a) answered by the stem's own wording, (b) one-line contrast (repeats #4, #8) -- "An officer of the agriculture department must plan what, whe"
C7S-1.3#11: [SAME] scenario; one-line fact about both monsoons on the coast -- "Joseph farms on the Malabar coast and grows crops in months "
C7S-1.3#13: [SAME] read two entries off the list of seven climates -- "A student says the Thar Desert and the western coastal strip"
C7S-1.3#14: [SAME] 5-mark recitation of the monsoon paragraph -- "Compare the farming year of a farmer on the Coromandel plain"
C7S-1.3#16: [SAME] (a) quote of Xuanzang, (b) cite the seven types: lookups -- "(a) What did Xuanzang observe about the produce of India? (b"
C7S-1.3#17: [SAME] (a) name Malabar and Coromandel, (b) one-line fact -- "(a) Name the two coastal plains that receive rain from both "
C7S-1.3#18: [NEW] fill_blank: count 4+3 months -- "The southwest monsoon rains last from June to September and "
C7S-1.3#19: [NEW] scenario; three lookups from the climate list -- "A traveller journeys from the Thar Desert to the western coa"
C7S-1.3#20: [NEW] NOT-item: list of water sources named on p.7 -- "Between the two monsoons, farmers in north India face a dry "
C7S-1.3#21: [NEW] scenario; NE monsoon is October-December: one line -- "On the Coromandel plain, Selvi sows a crop in the first week"
C7S-1.4#2: [NEW] true_false whose verdict is True and restates two book sentences -- "True or False: The chapter names two separate risks that kha"
C7S-1.4#3: [NEW] match: four season/older-name lookups -- "Match the farmer's action in Column A with the word for it i"
C7S-1.4#4: [SAME] scenario; kharif depends on the monsoon: one line -- "In Maharashtra, Baban plans to sow bajra with the first rain"
C7S-1.4#5: [SAME] swap-the-definitions error hunt: two one-line facts -- "A student's revision note reads: 'Kharif crops are winter cr"
C7S-1.4#6: [SAME] differentiate two seasons with examples from Fig 1.5 -- "Differentiate between rabi and zaid crops on the basis of se"
C7S-1.4#8: [NEW] fill_blank: classify sugarcane with rice (Fig 1.5 list lookup) -- "A farmer lists sugarcane, barley, muskmelon and gram. Of the"
C7S-1.4#10: [SAME] five separate one-line lookups under one story -- "Anita has only wheat and mustard seed in her store. Advise h"
C7S-1.4#11: [NEW] scenario; which line matches Fig 1.5's crop list -- "A cropping chart for a school garden is checked by a teacher"
C7S-1.4#12: [SAME] the book's own sentence, two reasons restated -- "The chapter says the rhythm of kharif, rabi and zaid is one "
C7S-1.4#14: [NEW] scenario; haimana = winter crops: lookup -- "An old farming manual, written before the Arabic terms becam"
C7S-1.4#15: [NEW] correct two labels from the figure captions -- "A student labels the photograph of mustard growing in front "
C7S-1.4#17: [NEW] scenario; Arabic origin since Mughal times: one line -- "A student writes in a project: 'Harappan farmers divided the"
C7S-1.4#18: [SAME] 5-mark recitation of kharif vs rabi -- "Compare kharif and rabi crops with respect to the time of so"
C7S-1.4#20: [SAME] scenario; cucumber zaid, rice kharif: two lookups -- "Nisha grows cucumbers in her field in the hot months and the"
C7S-1.4#21: [SAME] sort six crops: Fig 1.5 list lookup -- "A farmer's list reads: jowar, pumpkin, barley, groundnut, mu"
C7S-1.5#1: [SAME] differentiate two soils from their map captions -- "Differentiate between alluvial soil and laterite soil on the"
C7S-1.5#2: [NEW] fill_blank: name of black soil from its description (a name copied from the page) -- "A Deccan farmer's soil formed from weathered volcanic rock, "
C7S-1.5#3: [SAME] write clues for black soil: restate the description -- "Write three clues, in the style of 'formed from lava or old "
C7S-1.5#4: [SAME, borderline] borderline: rank soils using the stated fertility lines -- "Rank any five of the six major soil types of India from the "
C7S-1.5#7: [SAME] two one-line facts about red soil -- "(a) From what is red soil formed? (b) Why is it red, and how"
C7S-1.5#9: [NEW] match: four soil descriptions to names -- "A student on a field trip records four observations in Colum"
C7S-1.5#10: [SAME] (a) fertility, (b) pick high and low from descriptions -- "(a) On what basis did the Amarakosha describe twelve types o"
C7S-1.5#11: [SAME] 5-mark recitation of three soil descriptions -- "Compare black, red and laterite soil on how each is formed, "
C7S-1.5#12: [NEW] scenario; silt -> alluvial: caption lookup -- "Along a plain, a river carries silt down from the mountains "
C7S-1.5#14: [SAME] all three statements true and straight from glossary/text -- "Read the statements. 1. The Amarakosha describes twelve type"
C7S-1.5#15: [NEW] scenario; layers of Fig 1.8, ordering is plain common sense -- "A school digs a soil pit and reads it from the bottom upward"
C7S-1.5#16: [SAME] swap-the-descriptions error hunt (repeats #1) -- "A student's notebook says: 'Laterite soil: formed by silt de"
C7S-1.5#17: [NEW, borderline] borderline: scenario; humus glossary entry -- "A farmer spreads rotted crop residue and dung on a worn-out "
C7S-1.5#18: [SAME] scenario; description is the book's laterite caption word for word -- "On a hill in Kerala, Meera sees a soil that goes hard in hot"
C7S-1.5#19: [SAME] scenario; description is the book's black soil caption word for word -- "On a field trip to the Deccan, Pooja finds a dark soil forme"
C7S-1.5#20: [NEW] restates the silt glossary entry -- "(a) What makes silt easy for rivers to carry from the mounta"
C7S-1.6#2: [SAME] 5-mark list of four irrigation systems -- "Compare traditional irrigation systems (the phad system and "
C7S-1.6#3: [SAME] scenario; contour ploughing definition -- "On a hill farm, Ravi ploughs along the natural curves of the"
C7S-1.6#4: [NEW] NOT-item: caption of Fig 1.11 -- "Banana trees are planted on the bunds of a farmer's paddy fi"
C7S-1.6#5: [NEW] fill_blank: name 'drip' copied from page (and see HIGH: trickle) -- "A farmer wants water delivered slowly and directly to the pl"
C7S-1.6#8: [SAME, borderline] borderline: match four methods to problems; all from p.14 -- "A farmer's hill field is losing soil to rainwater, and her c"
C7S-1.6#10: [NEW, borderline] borderline: classify a pair as traditional/modern -- "Which pair below contains one traditional and one modern irr"
C7S-1.6#11: [SAME] reason (groundwater falling) and two benefits: one paragraph recalled -- "The chapter calls efficient modern irrigation 'very necessar"
C7S-1.6#13: [SAME] name two erosion measures from the list -- "A farmer's field lies on a hill slope. Name two measures fro"
C7S-1.6#16: [NEW] scenario; definition of crop rotation -- "Sunita grows maize in the kharif season and a pulse crop in "
C7S-1.6#17: [NEW] match: four irrigation descriptions -- "Match the water source or delivery in Column A with the irri"
C7S-1.6#18: [NEW, borderline] borderline: (a) Karikala/Kaveri/1800 yr lookup, (b) subtraction -- "(a) Who built Kallanai, across which river, and about how lo"
C7S-1.6#20: [NEW, borderline] borderline: caption lookup (shrines and temples) -- "A student says the photograph of Munsar Lake at Viramgam sho"
C7S-1.6#21: [SAME] differentiate rain-fed and irrigated, one challenge -- "Differentiate between rain-fed and irrigated agriculture, an"
C7S-1.7#1: [NEW, borderline] borderline: one fact stated in the stem plus 15-5 -- "Before the seed drill, a farmer did soil preparation, seed p"
C7S-1.7#2: [NEW] (a) three operations of the seed drill, (b) one-line correction -- "A farmer says, 'Machines that save labour in sowing came onl"
C7S-1.7#4: [SAME] scenario; dependence on seed companies: one line -- "Harpreet bought high-yielding seeds from a company, but the "
C7S-1.7#5: [NEW] match: four definitions -- "Match the farmer's practice in Column A with its name in Col"
C7S-1.7#6: [NEW] true_false verdict True, the book's sentence verbatim -- "True or False: Coating seeds with beejamrit before planting "
C7S-1.7#7: [SAME] suggest two sustainable options: list recall -- "A farmer wants to cut down on chemical sprays and fertiliser"
C7S-1.7#10: [SAME] AR restating one book paragraph -- "Assertion (A): The Green Revolution made India self-sufficie"
C7S-1.7#11: [SAME] scenario; kulagar definition -- "Gokul's family in a Konkan village of Goa grows food crops, "
C7S-1.7#12: [SAME] one advantage and one drawback of company seed: two lines -- "State one advantage and one drawback of buying seeds from co"
C7S-1.7#13: [SAME] compare traditional and Green Revolution farming: p.23 paragraph -- "Compare traditional farming and Green Revolution farming on "
C7S-1.7#14: [NEW] (a) the stem describes the Green Revolution, (b) list two problems -- "A district's wheat and rice output rises sharply after farme"
C7S-1.7#18: [NEW] (a) kula/agar meaning, (b) trivial fit -- "The word kulagar comes from the Konkani 'kula' and 'agar'. ("
C7S-1.7#19: [SAME, borderline] borderline: 5-mark assembly of the pp.21-23 paragraphs -- "'Sustainable agriculture combines the productivity of modern"
C7S-1.7#20: [SAME, borderline] borderline: 5-mark three definitions (and overreach, see MEDIUM) -- "Compare terrace farming, kulagar and gokrishi. Analyse why t"
C7S-1.7#21: [NEW] scenario; neem pesticide; wrong options absurd given the ban -- "After Sikkim's 2014 ban on chemical fertilisers and pesticid"
C7S-1.8#1: [NEW] scenario; hydroponics definition -- "Ananya lives in a city flat with no garden or soil and wants"
C7S-1.8#2: [NEW] scenario; crop insurance line -- "Untimely heavy rain has destroyed Ramesh's standing crop, an"
C7S-1.8#4: [NEW] fill_blank: 25,000/10,000, conversion printed in stem -- "A farm measures 25,000 square metres. Taking 1 hectare as 10"
C7S-1.8#5: [SAME] (a) 2,300 lookup, (b) debt trap lookup, x7 -- "(a) According to some estimates, how many farmers a day are "
C7S-1.8#6: [NEW] true_false whose correction is a single sentence of the book -- "True or False: According to the chapter, the traditional ext"
C7S-1.8#8: [NEW] (a) quote the book sentence, (b) inadequate: two lookups (repeats #6) -- "A family's paddy is damaged by untimely rain, yet it still e"
C7S-1.8#10: [NEW] two lists recalled from pp.24-25 -- "A farmer says, 'The government helps only at the end, by buy"
C7S-1.8#11: [NEW] scenario; government purchase line -- "A village has a good wheat harvest, but traders offer very l"
C7S-1.8#12: [NEW] (a) and (b) are two book sentences -- "Mohan has 0.75 hectare and is advised to buy a large tractor"
C7S-1.8#16: [SAME] scenario; debt trap line -- "After untimely rain ruined his crop, Prakash borrowed money,"
C7S-1.8#18: [SAME, borderline] borderline: claim check against one sentence -- "Rina says, 'Climate change affects farmers only by bringing "
C7S-1.8#19: [SAME] 5-mark list of government help -- "Explain how the government helps farmers with inputs, with c"
C7S-1.8#21: [SAME, borderline] borderline: 4 of 5 marks are the p.26 cause list -- "Analyse the stress on the Ganga basin: say why the basin mat"
