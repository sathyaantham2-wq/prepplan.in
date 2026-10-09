# Review: DPS Class 7 Social Science, Part I ch 3 "Climates of India" (C7S-3.1 to 3.7)

File: content/authoring/dps/class7s/p1ch03.json. Source: gees103 pages 001-022 (read in full). Scope: content/authoring/class7s/p1ch03.json.
Read: all 140 questions (7 concepts x 20). Every number recomputed in python (ranges, percentages, date arithmetic, 15 Apr + 50 days = 4 June, 12 Apr + 50 days = 1 June, 11,000 mm = 11 m, 1350 - 900 = 450, 12,000 x 0.8 - 3,000 = 6,600 and 45 percent, 800 to 560 = 30 percent). Keys are the first option in the file (the loader shuffles); no answer text names an option letter.

## Headline
- Wrong key: none. Second defensible answer: none found. Arithmetic and fact errors: none. HIGH = 0.
- Facts match this book. No item relies on the DPS notes' extra material (land/sea breeze, torrid zone, retreating monsoon, 80 percent rainfall, lapse rate, Tamil Nadu coast). Nothing violates scope_out except two borderline items (M7).
- The weaknesses are standard-level: a templated frame across concepts, one-sided claim-checks, free marks in case-study parts, lopsided decisions, correct-option-longest in 16 of 38 MCQs, and heavy reuse of the book's own examples.

## MEDIUM findings (fix before load)

M1. Templating across concepts (QUESTION_STANDARD anti-template rules). Slot 14 in every concept is "Name says '...always/only/every/no part/all...'. Do you agree?" (Imran, Zoya, Arjun, Ishaan, Tara, Rahul, Sana). Slots 17/18 repeat "Explain/Compare ..." then "'quoted statement'. Justify using the chapter" (3.1#18, 3.2#18, 3.4#18, 3.5#18, 3.7#18 are the same frame). Slots 19/20 all end "(d) Which ... would you choose/recommend? Justify" after (a) name/recall, (b)-(c) arithmetic. Slots 9-13 are the same "(a) recall, (b) recall" pairs in every concept. Fix: change the frame in at least 3 of the 7 concepts: make one claim-check a plain fact conflict ("A map shows..., which statement is inconsistent"), one 5-marker a data-table interpretation, one case study start from a source paragraph with a "what would change if" part.

M2. Claim-checks are all "No". 3.1#14, 3.2#14, 3.3#14, 3.4#14, 3.5#14, 3.6#14, 3.7#14: every verdict is disagree, and in 5 of 7 the answer says "the word 'every/always/only/no part/all' makes it false". No claim is true, and no statement with an absolute word is true anywhere in the chapter (also true of the multi_statements: 3.3#6 stmt 3 "must", 3.4#7 stmts 2 and 3 "only"/"must", 3.5#6 stmt 2 "only", all false). Students learn the cue. Fix: make two claim-checks right but needing a reason (e.g. 3.4#14 "Winds can heat a place as well as cool it" is fine for the student to support; 3.5#14 "Some parts of India get rain in winter too"), and make one multi_statement have a true absolute statement (definition style: "Strictly speaking, 'monsoon' means seasonal winds").

M3. Correct option is the longest in 16 of 38 MCQs (42 percent; chance is about 25): 3.1#4, 3.2#2, 3.2#6, 3.3#1, 3.3#4, 3.4#3, 3.4#5, 3.4#6, 3.5#1, 3.5#3, 3.5#5, 3.6#2, 3.6#4, 3.6#5, 3.7#2, 3.7#3. Worst: 3.4#6 (87 vs 63/69/66 chars), 3.4#3 (88 vs 62-82), 3.5#1 (90 vs 72-84), 3.7#3 (61 vs 30-42), 3.2#6 (26 vs 15/13). Fix: trim the key or lengthen distractors to within about 10 percent.
Also a cue: in 3.4#6 the only qualified option ("to some extent") is the key while the others carry never/every/much better; 3.7#2 likewise (key is plain, distractors carry entirely/only/first). Give one distractor a hedge.

M4. Case-study parts answerable without the chapter (QUESTION_STANDARD section 11).
- 3.5#20 (b): Saying 2 is printed in the stem with "this year most crows built nests high"; the answer "less rainfall" is read off. (a) is pure date arithmetic from the stem. Only (c) and (d) use the chapter. Fix: hide the saying's rule (ask "using the chapter's reported belief about crows' nests, what does this year predict?") or replace (a)/(b) with something needing the chapter.
- 3.3#20 (b): "hill station near Ooty ... almost the same latitude" gives altitude away; (a) is arithmetic. 3.3#19 (a) is arithmetic; (b) "P is on the coast" gives the sea away.
- 3.4#19 (c) 41 - 37 and (b) "crowded central market with many concrete buildings and little greenery" prints the definition of an urban heat island. Place Y (28 degrees) is never used.
- 3.4#20 (a): stem says "a small area ... whose climate differs from its surroundings", i.e. the definition is printed; (b) is subtraction.
- 3.5#19 (b), (c): arithmetic only; Mawsynram is a distractor that never feeds the decision (d).
- 3.6#19 (a): the stem already says "breaks through its barrier of rocks and ice" in the question; (b) 20 percent is arithmetic.
- 3.7#19 (a): the stem names energy-efficient replacement and solar panels, so the "two mitigation measures" are read off; (b) and (c) are arithmetic. 3.7#20 (a) is a percentage.
- 3.1#19 (a): "five days" versus "six years" tells the student which is weather. 3.2#19 (a) reproduces the book's phrasing of each climate (acceptable, since it still needs the climate names).
General fix: each case study should have at most one pure-arithmetic part, and the term parts must not repeat the book's definition inside the stem.

M5. Decisions that are lopsided or have a strawman option (anti-template rule on strawmen).
- 3.5#19 (d): "sow rain-fed crop with no storage" versus a water tank in a place with interrupted rain; the tank wins plainly. Give the sowing plan a real advantage (cost, the 3,000 mm neighbour, early start before the break) or compare tank sizes.
- 3.3#20 (d): Ooty is cooler, the father cannot take above 30, Ooty max is 25: one-sided; the stated "drawbacks" (10 degree nights, range 15 vs 13) are weak. Add a cost or a night-cold limit so the trade-off is real.
- 3.4#20 (d): Kheda obviously cooler; the "drawback" (hard to reach) is not in the data. The stem also says the forest valley is cooler, which the book does not state (it states only that urban heat islands are warmer). Add data on access or elderly patients' cold sensitivity.
- 3.6#20 (d): "move 450 inland now" versus "stay and share the space" in full buildings: the second is the weak option. The NDRF detail is never used by any part.
- 3.7#20 (d): "order the same wool" versus diversify: one warm winter is weather-like (cf. 3.1); the better answer would note that. The key is OK but the question invites the obvious choice.
- 3.2#19 (d): the trip is in May, so winters of brochure D are irrelevant; the key's argument about "winters only moderately cold" does not follow. Say the trip is in January or ask about May comfort only.
Good decisions (keep): 3.1#20 (five vs six columns), 3.2#20 (water scheme vs processing unit), 3.4#19 (300 vs 900 workers), 3.6#19 (warning system vs road), 3.7#19 (panels vs trees), 3.3#19.

M6. (a)/(b) items that are two recall facts (section 11): 3.1#10, 3.2#9, 3.2#11, 3.2#13 (stem hands the answer: "Water is the first thing we plan for"), 3.3#10, 3.4#9, 3.4#10, 3.5#10, 3.6#9 (a), 3.6#10, 3.6#12, 3.6#13, 3.7#9, 3.7#10, 3.7#13. Several are labelled Apply or Understand while being a one-fact lookup (3.5#10, 3.6#10, 3.6#13, 3.7#10, 3.7#13, 3.4#10), so the stated Bloom mix (Remember 3, Apply 3-4 per concept) overstates demand; real recall count is nearer 8-9 per concept, not 5. Fix: make (b) a consequence or comparison that uses (a) (e.g. 3.6#10 (b) "which one of these is human-made and which natural"), and relabel the rest Remember.

M7. Scope_out adjacency. Scope_out: "Full science of heating and cooling of land and sea - Covered in Science." 3.3#13 asks "Why does the chapter say the sea absorbs and loses heat differently from land?" and 3.3#17 gives 2 marks to "the slow absorbing and losing of heat". The book (p.51) says only that the diagram sums it up and Science explains it. Fix: ask only for the effect (what moderation does to summer and winter) and drop the "why". Also 3.7#4's explanation line "Adaptation is about adjusting to the changes" is not in this book (the book only names "resilience and adaptation" together), and 3.6#18 / 3.7#18 assert that faster glacier melt is linked to a warming climate; the book states the melting in the floods section and never links it to warming. Remove or hedge those claims.

M8. Heavy reuse of the book's own examples and figures, with several near-duplicates inside the chapter (section 1 wants a changed setting).
- Ooty 10-25 / Coimbatore 25-38 appear in 3.3#5, #7, #14, #18, #20 (the last two use the same numbers and the same ranges 15 and 13 as #14).
- Mumbai 32/18 and Nagpur 44/10 appear in 3.3#4, #6, #9, #15, #17, #18, #8. #9 and #15 and #17 ask the same thing three ways.
- Konkan fish / Golden Shower tree / crows: 3.5#4, #8, #12, #15, #18, #20.
- Monsoon failure chain (water, migration, prices) in 3.6#7, #11, #15, #17 (four items on one paragraph).
- "Winds change only temperature" false claim in both 3.4#3 and 3.4#7.
- Book verbatim: 3.2#6 and 3.2#20 stems are the book's climate descriptions word for word; 3.6#16 repeats the Kedarnath box; 3.7#8, #10, #20 repeat the early-2025 1-3 degrees C sentence.
Fix: keep each book example in at most two items; swap in other cities with new plausible numbers (flagged as invented) for the rest.

## LOW findings
L1. 3.2#10 (b) and 3.3#18 and 3.1#12 are close to the DPS notes questions ("Why do people from the plains go to hill stations", "Explain how latitude and altitude influence the climate", "Differentiate between weather and climate"). They use only this book's content, but 3.3#18 is the DPS question with "sea" added. Change the angle (e.g. give two towns and ask which factor dominates).
L2. 3.1#12 key "weather has no fixed yearly cycle" is debatable (weather follows the seasons, p.46-47). Say "weather is what happens on a day; a season is a recurring few-months period".
L3. 3.1#5 and 3.3#4 use Chennai and Riya's family: fine. Name Riya also repeats in 3.7#6; vary names.
L4. 3.4#16 "Create" asks for remedies for urban heat islands; the book gives causes only, and the key's three changes overlap (plant trees; green areas). Accept, but state that credit is for cause-linked reasoning.
L5. 3.7#13 is 2 marks for "name three activities" with two mark steps (industry and transportation 1; agriculture 1). Change to "name two" or make it 3 marks.
L6. 3.7#3 and 3.6#3 NOT-items have an obviously odd key ("Natural processes ... as a human cause"; "heavy rainfall as a human activity"). Easy but acceptable as a recall item; relabel Remember.
L7. 3.7#1 distractors ("gases trapped by the clouds above a cyclone", "rocks melted by volcanoes") are not chapter confusions; use "remains of ancient animals only", "the carbon cycle gases", "minerals" style lookalikes from the chapter's carbon-cycle paragraph. 3.5#4 option D ("has no use") contradicts the book's heritage message and is dismissable; 3.6#5 options B and D are absurd for a landslide stem.
L8. 3.3#5 options B and D are both "latitude" and both contradict the stem, so they act as one distractor; make D "wind" or "topography".
L9. 3.3#8, 3.1#8, 3.5#8, 3.6#8 matches are all labelled Remember/Easy; fine, but the pairings are keyed to the book's glossary only; 3.3#8 item 1 could also read "nearness to sea" for Kanniyakumari (a peninsula tip) by a careful student; qualify with "Equator".
L10. Assertion-reason: A is true in all seven (the "A false, R true" form never appears) and the keys are: not-explain, R-false, explain, not-explain, R-false, not-explain, explain, which is acceptable; 3.6#7 R (industry) is weakly connected to A, which is the intended "true but not explanation" pattern, fine. 3.1#7 R is a trivia restatement (monsoon as a separate season) rather than a real reason; replace with a fact about ritus or crops.
L11. Settings: mostly Indian; rupee amounts written "Rs" (fine); the 3.7#19 school and the 3.7#20 workshop are realistic. Reading level appropriate for Class 7.

## Standard-section checks
- Types present in every concept: mcq (5-6), multi_statement, assertion_reason, match (4 across 7 concepts, meets one per two), short answers with (a)/(b), claim-check or reverse as the 3-mark item, two 5-mark answers, two 4-mark case studies. Loader minimums met.
- Chapter-level Bloom: Remember+Understand 63/140 = 45 percent (limit 60); Analyse+Evaluate+Create 54/140 = 39 percent (min 15). Labels inflated in places (M6).
- Reverse words: every NOT item carries "rev": true (3.2#4, 3.3#3, 3.4#3, 3.5#3, 3.6#3, 3.7#3). Check the claim-checks with "no part" have no reversal-flag need.
- multi_statement keys vary (1 and 3 only; 2 and 3 only; 2 only; 1 only; 3 only; 1 and 2 only; all three) - good, and the false statement position spreads. 3-statement format as the standard asks.

## Per-concept verdicts
- C7S-3.1 Weather, seasons, climate: keys right; two recall-pair items, case study (a) too easy; claim-check Imran is good; 3.1#7 R is weak. Needs M3/M4/M6 edits.
- C7S-3.2 Types of climates: keys right; 3.2#6 and #20 are book-verbatim; 3.2#19 (d) logic issue (May vs winter); 3.2#13 gives away its answer.
- C7S-3.3 Factors: keys and arithmetic right; heaviest reuse of Ooty/Mumbai/Nagpur; scope_out adjacency in #13/#17; case studies (a) free arithmetic.
- C7S-3.4 Winds, topography, microclimates: keys right; 3.4#3 and #7 duplicate a false claim; case studies' definitions printed in the stem; Kheda drawback invented.
- C7S-3.5 Monsoons: keys right (dates verified); four items on Konkan/Golden Shower; 3.5#20 (a)(b) are free; 3.5#19 decision one-sided.
- C7S-3.6 Culture, economy, disasters: keys right (6,000; 20 percent; 450); monsoon-failure chain repeated four times; recall-heavy short answers labelled Apply; 3.6#19 (a) printed in the stem.
- C7S-3.7 Climate change: keys right (6,600 units, 45 percent, 30 percent); mitigation/resilience scenario items are good; 3.7#19 (a) read off the stem; claims about glacier melt and "adaptation" beyond the book.

## Verdict
Keys, facts and scope are sound (0 HIGH). The chapter reads as school-exam standard in the extended items but leans on a repeated frame, one-direction claim-checks and the book's own examples; fix M1-M8 before it counts as meeting section 9 and the anti-template rules.

Count read: 140 of 140 (no sampling).
