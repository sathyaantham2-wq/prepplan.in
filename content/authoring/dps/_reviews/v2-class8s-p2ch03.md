# Review v2: SST8 Part II ch3, A Journey Through Indian Architecture (hees203)

Pack: `content/authoring/dps/class8s/p2ch03.json`. Scope: `content/authoring/class8s/p2ch03.json`. Reviewer: independent first review, every one of 187 questions read; all arithmetic recomputed in python; all facts checked against `content/extracted/hees203/pages/001-040.txt`.
Indexes are 0-based within the concept (C8S-3.n of Part II).

Counts: HIGH 7, MEDIUM 31, LOW 11. Verdict: NOT load-ready (see end).

What was verified clean: all 187 keys are the intended single answer except the HIGH items below; correct option is o[0] and `a` equals o[0] on every MCQ/AR/MS/match; step marks sum to marks on every item that has steps; no option is named by position; three-statement `multi_statement` format as the standard; no scope_out name (Qutb, Konark, Ajanta, Kharavela, Nagara/Dravida, Angkor, Khajuraho, Victoria Memorial history, Borobudur, Grand Anicut) is used; the body text, not the timeline, is used where they differ (Sharada Peetha 6th-12th c.). Arithmetic recomputed and correct: 1010 is in the 11th century; 40/5=8; 3600/4=900; 100000/250=400; 25000-18400=6600; 6600/55=120 exactly; 27000-25000=2000; 6/40=15%; 25000/50=500; 1995-1979=16; 60/15=4 days, 30x1.5=45 t, 90/45=2 loads, last load day 12.

---------------------------------------------------------------------
## HIGH

**H1. C8S-3.1 [10] fill_blank "...called the ___ room." key "sentinel".**
The stem calls it "a guard post... where guards would have screened people", and the pack's own C8S-3.1 [0] says "a large guard room". "guard" is an equally correct blank for a student and a machine will mark it wrong. It is also a pure page-lookup of a coined name. Fix: replace with an application blank with one value (for example a computed or reasoned term), or remove the guard wording and make the stem need the chapter; at minimum accept "guard/sentinel". Prefer rewriting.

**H2. C8S-3.3 [0] "The monsoon is the only reason India needed water structures, and a village pond is too simple to count. Correct the two errors."**
Correction 1 is not supported. The book (p.97) says India's monsoon-driven climate "has led people to develop a great variety of structures" and that the structures are *diverse* owing to differing geology, climate and environment. Diversity is attributed to conditions; the book never denies that the monsoon is the reason they were needed. The key ("so the monsoon is not the only factor") conflates need with variety. Only the pond error is real. Fix: change the student's sentence to something the book contradicts, for example "Water structures were all of one design everywhere, and only sophisticated ones such as the Grand Anicut count"; or drop correction 1 and mark the item to one real error with a second one drawn from p.97.

**H3. C8S-3.6 [18] fill_blank "The red-stone courtyard ... can accommodate up to 25,000 people. If it is filled to this limit by groups of 50, there are ___ groups." key 500.**
The 25,000 is given in the stem, so the answer needs nothing from the chapter; it is bare division. Fix: remove the figure from the stem ("...can accommodate a number of people the chapter gives. If filled by groups of 50, how many groups?" with the number needed from the chapter), or replace with an item that needs the book.

**H4. C8S-3.7 [0] fill_blank "Taking the chapter's figure of 100,000 lights ... as exact, sharing them equally among 250 strings, each string carries ___" key 400.**
Figure is in the stem; no chapter needed; the book says "nearly 100,000", so "as exact" is an artificial patch. Fix: replace (the lights fact is not worth a slot), or require a chapter value the stem does not give.

**H5. C8S-3.8 [11] fill_blank "A charbagh garden is divided into four sections. If a garden of 3,600 sq m is divided into four equal sections, each covers ___" key 900.**
"Four" is given twice in the stem (the definition and the division). The item needs no chapter. Fix: state only "a charbagh garden of 3,600 sq m divided as the chapter says" so the student must supply "four", or replace.

**H6. C8S-3.6 [1] "(a) Name the two features of the Delhi Jama Masjid's scale that the chapter gives with numbers. (b) Which of the two would a planner of crowd arrangements use?"**
The chapter gives at least three numeric facts: about 5,000 workers, minarets 40 m tall, courtyard up to 25,000 (and also "three large domes/entrances"). The key itself adds "(also: two minarets 40 metres tall)", admitting that "the two" is not two. A student who names 5,000 workers and 40 m has a correct (a) and a (b) the key cannot mark. Fix: "Name any two features ... with numbers" and "of the courtyard capacity and the number of workers, which would a crowd planner use?" so (b) has the stated pair.

**H7. C8S-3.1 [12] claim_check, key "Partly right".**
Arjun: "Everything the chapter says about Harappan architecture is about brick; there is no stone at all, and every Harappan city had the same layout." Every conjunct is wrong or unsupported: he says "everything... is about brick" and "no stone at all", which Dholavira contradicts, and "same layout" is unsupported. The key's "right" half is "most Harappan cities were built of bricks", which is not what Arjun claimed (his claim is absolute). A student answering "No" is at least as defensible as "Partly right". Fix: reword the claim so one part is clearly right, for example "Most Harappan cities were built of brick, and no Harappan city used stone."

---------------------------------------------------------------------
## MEDIUM

### Chapter-wide
**M-A. Easy in disguise.** About half the bank (roughly 95 of 187) has a key that is a book sentence or list with no reasoning. Two shapes dominate. (1) The 18 five-mark items (two per concept: 3.1 [1],[19]; 3.2 [8],[9]; 3.3 [5],[17]; 3.4 [0],[6]; 3.5 [5],[16]; 3.6 [7],[21]; 3.7 [8],[9]; 3.8 [3],[10]; 3.9 [7],[10]) are "Justify/Compare" frames whose parts (a)-(d) are each a lookup, with a one-mark "closing link" that restates the opening quote. They do not meet "compare and analyse, a multi-step story with data". (2) About 30 of the 42 MCQs have o[0] equal to a verbatim book sentence, with a stem that restates half of it (for example 3.3 [6], 3.3 [8], 3.4 [11],[13],[14],[17], 3.6 [16],[17], 3.7 [12],[15],[19], 3.9 [8],[12],[16]). Also lookups at 2 marks: 3.1 [11],[15]; 3.2 [0],[5],[17]; 3.3 [7]; 3.4 [16]; 3.5 [12]; 3.6 [14]; 3.7 [4],[20]; 3.9 [4],[13],[18]. Fix: turn each five-marker into a real comparison/justification with a stated situation or data the student must apply, and turn at least half of the lookup MCQs into "which of these four situations fits" with a stem that does not echo the key.

**M-B. MCQ option-length tell.** Across all 42 MCQs the correct option is never the longest and never the shortest: it is exactly rank 2 or 3 of 4 every time (21 rank 2, 21 rank 3; chance of this at random is under one in a trillion). A solver can discard the extremes and guess from two. Fix: rewrite option lengths so the correct one is longest/shortest at about a quarter each.

**M-C. Case studies are not decisions.** 18 case studies (2 per concept, all tagged `case_study`). None has a two-sided final decision. Six are "a leaflet/blog/student's notes says X, correct the errors" with four lookups (3.1 [2], 3.2 [18], 3.4 [5], 3.5 [6], 3.7 [1], 3.9 [19]); the decisions that do exist are fixed by the stem (3.3 [12], 3.8 [7], 3.9 [1], 3.6 [3], 3.7 [6] d) or are lookups (3.4 [1], 3.5 [19], 3.8 [1], 3.6 [0]). Individual notes below. Fix: give each case study a data-bearing final decision with a real trade-off (e.g. repair fund where both monuments have a stated, different strength).

**M-D. fill_blank is templated.** Four of eight fill_blanks are bare division with an "(illustrative)" number (3.5 [13], 3.6 [18], 3.7 [0], 3.8 [11]); three of those are answerable from the stem (H3-H5); the others are one-word names (sentinel, Jain, trapezoid, vimana). None needs a chain of reasoning.

**M-E. Scope file contradicts itself on captions.** scope_out line 48 says plates on pp.121 (Kerala churches) and 122 (Madras High Court) carry "no teachable fact the body text does not already give, so nothing is authored from a caption alone". But the stambha/sloped tiled roof (p.121 captions) and Madras High Court "completed in 1892, red sandstone facade with Islamic arches..." (p.122 caption) are facts found only in captions and are used in 3.9 [0],[3],[7] d,[9],[14]. scope_in (lines 35, 36) does name them, so I judge them in scope, but the scope file should be fixed so the next author is not told two things.

### C8S-3.1
- [0] case study part (c) "Predict the material most Harappan cities in plains like P's would use": the stem already says P has brick walls on a river plain. Part (c) is answered by its own stem. Also (a)/(b) are the only chapter-dependent parts. Fix: ask for the material of a plain city *not described* as brick, or fold (c) into a decision.
- [1] "(b) Give four characteristics the chapter lists": the book (p.90) lists laid-out cities, standardised urban concepts, drainage, water management, civic organisation (five, or three if "emphasis on drainage, water management, and civic organisation" is one group). The key supplies five under "four". Fix: "Give any three".
- [15] "(a) What in the house plan 'hints' at this?" The stem quotes 'hints'; the answer is "the plan of the large house", circular. (c) is a lookup. Three marks for one inference. Fix: replace (a) with a reasoned part.
- [19] 5 marks; (d) "Which one is noted for precise urban planning" is a one-word lookup; whole item is recall (see M-A).
- Repetition: brick/stone material tested at [0],[2],[3],[8],[12],[18],[19] (7 times); drains and used water at [1],[2],[7],[13],[14],[20] (6). Cut to two each.
- [14] (b) "the chapter's three words ... 'standardised urban concepts', 'drainage' or 'civic organisation'": these are not "three words" the book gives for Harappan cities (the book's list has five items and "carefully laid-out cities" is omitted). The key then says drains "also need civic organisation". Fix: use the book's own list and a single mapping.

### C8S-3.2
- [1] case study (b) "Which sentence in Site X's description matches the chapter's statement about how complexes grow?" The sentence is the stem's own; answerable without the chapter. (c) mixes a prediction with a "not certain for Ellora" judgement; Ellora's "cells" are not in the book.
- [6] (c) "Why does the chapter still call rock-cut architecture 'efficient'?" The book gives no reason beyond the phrase "efficient and durable ... by carving directly into the rock"; the key's reason ("without assembling a structure; durable stone is the building itself") is the author's. Fix: ask only what the chapter says it is, or accept any answer built from the p.94 sentence and say so.
- [8] 5 marks, (a) "Which two items inside the cave show the stupa's presence, and what do the monks do" is confusingly worded: the key names the stupa and the statue, but a statue is not a sign of the stupa's presence. Also all recall.
- [10] stem adds an "empty throne", which is not in the book; the stem also hands over "a large wheel", so the item is a restatement. 
- [16] AR "R explains A": R ("reflecting changing religious needs and patronage") is nearly a restatement of A; the book's word is "reflecting", not "because". Arguable as "R is a restatement, not an explanation". Fix: use a pair with an explicit cause, or key it as "both true, R explains" only if a causal word is added in R.
- [18] case study: Line 2 is a strawman ("only scenes of gods and kings"); (d) "Is Line 4 reliable? Give two details" is answered by Line 4 itself.
- [20] "Which mode does the chapter describe as efficient and durable?" with the stem stating "hill is solid rock": a lookup.
- Repetition: Buddha shown symbolically at [0],[4],[10],[14] (4); torana/vedika/circumambulate at [2],[5],[13],[15],[18] (5).

### C8S-3.3
- [2] AR keyed "R explains A": the book only says temple tanks "were used for water harvesting as well as water-based rituals"; it does not give use as the reason temples had them. Defensible as "both true, R not the explanation".
- [5] 5 marks; closing-link mark is padding; all recall.
- [12] case study: the stem hands the committee's own conclusion ("We can stop the dumping... cannot restore the pond's source"), so (b) and (d) are fixed; no trade-off. (c) is a lookup.
- [18] case study: the stem restates the book (channel, flood season, silt, "cannot say how they work"); (a)-(c) answered by the stem plus one lookup; (d) is a "goes beyond the book" judgement, not a decision. Shringaverpur appears here for the sixth time.
- [19] fill_blank "trapezoid": the stem describes the shape ("wider at one end") so "trapezium" (the usual Indian word), "wedge" or "tapered" are defensible and a machine will not match. Fix: accept "trapezium/trapezoidal", or ask for the effect rather than the shape name.
- Repetition: Shringaverpur silt/working at [3],[5],[9],[11],[13],[18] (6); threats to structures at [1],[4],[10],[12],[17] (5); diversity from conditions at [0],[7],[16] (3).

### C8S-3.4
- Vocabulary drill: the south/north names (gopuram/torana, vimana/shikhara) are tested at [0],[1],[5],[10],[11],[16],[19] (7 times); these seven are nearly all page lookups. Also journey outer-to-inner at [0],[1],[3],[7],[13]; patronage at [6],[12],[17]. Cut to two each and replace with items that apply the plan.
- [1] case study: Draft 1 is obviously right; (c) and (d) are lookups; "garbhagriha facing west" is a fault only by the book's "generally".
- [5] case study: four relabel lookups; (d) restates (a) and (c).
- [3] "show impossible": the "garbhagriha is the innermost chamber" is a definition, so the item is a tautology rather than a chapter argument.
- [18] (b) "builder worked by those principles, not by his own whim" borrows the chapter epigraph; mild.

### C8S-3.5
- [6] case study: four lookups (Sharada Peetha state, Golden Temple founder, Guru Arjan Dev 1588, Ghatotkacha temple); no decision.
- [15] MCQ: the stem already states "Lingaraja: built from locally available sandstone and laterite. Dilwara: white marble from the nearby Aravalli hills" and o[0] repeats it; answerable from the stem alone.
- [19] case study: (b) "Describe the making of one panel" is stated in the stem ("carved by hand on a soft panel and then fired"); (a) is fixed by the same sentence.
- Repetition: Brihadishvara facts at [5],[7],[11],[12],[14],[16],[18] (7); terracotta carve-then-fire at [1],[2],[8],[9],[19] (5); skills/mathematics at [0],[5],[10] (3).
- [16] 5 marks: recall of two date/state/material tables.

### C8S-3.6
- [0] case study: (b) is answerable from the stem (a sketch showing full-size minarets), (c) is a strawman ("the sketch is invented"), (a)/(d) lookups.
- [3] case study: arithmetic is right but the decision (27,000 vs "up to 25,000") is trivial and the item is mathematics with a pretext.
- [10] multi_statement with all three true is fine for key variety but gives no false-statement test for this concept.
- Repetition: "suggest" inference at [5],[9],[20],[13]; Jama Masjid naming at [2],[7],[17].
- [7],[21] 5-mark recall; [12] match is definitions of four words.

### C8S-3.7
- [1] case study: (a)-(c) corrections and (d) a lookup; no decision.
- [6] case study (the flagged Dholpur haul). Arithmetic is correct (4 days; 45 t; 2 loads; day 12). But the stem itself supplies "Dholpur, some 60 km away", so (a)-(c) never need the chapter and (d) is answered by the stem plus the absence of a statement. "Does the chapter support him?" is an argument from silence against a clerk who is a strawman ("red stone could be had beside the fort"). The answer "No" is sound (the chapter does not say it), so the key is not wrong, but the item is not an inference the student must make from the chapter. Fix: either give the stem only the haul numbers and leave Dholpur/60 km for the student to bring, and make (d) a real trade-off (carry stone 60 km vs a nearer softer stone with a stated drawback), or demote to a 3-mark calculation without the clerk.
- [7] AR keyed "R explains A": R describes how the fountains were made, not why they cooled (evaporation is not in the book). The book's one sentence links them ("created fountains, which worked as ... air-conditioners"), but "R not the correct explanation" is also arguable. Fix: reword R as the cooling cause the book states, or key it as not-explaining and say why in the reasoning.
- [9] (b) "Say who began or rebuilt each": the book does not say who began Mehrangarh (only "Rajput rulers continued to expand"); the key quietly sidesteps. Fix: ask only "when".
- Repetition: Dholpur sandstone at [3],[4],[6],[9],[15] (5); cenotaph at [1],[13],[17] (3).

### C8S-3.8
- [1] case study: Summary X is the book's own sentence; (c) and (d) are lookups.
- [7] case study: the councillor ("wash it each year and let industries carry on") is a strawman; (c) is the arithmetic 1995-1979=16 under an assumed mid-1990s year, and "the smallest possible gap" wording confuses a plain subtraction.
- Repetition: cremation/no ancient tombs at [0],[3],[8],[16],[19] (5); Taj pollution at [5],[7],[10],[17] (4); tomb vs cenotaph at [15],[19],[8].
- [20] match: four items of Star-of-David/Seal-of-Solomon vocabulary; recall.

### C8S-3.9
- [1] case study: decision (Monument Q with no budget vs P with Rs 40 lakh) is fixed by the stem; (a) is pure arithmetic needing no chapter.
- [19] case study: relabel-the-errors with four lookups; no decision.
- Repetition: Chettinadu houses at [5],[6],[10],[12],[13],[15],[17],[19] (8); courtyard uses (rituals, gatherings, drying papads and chillies) tested at [10] d, [12], [17] (identical fact three times); teakwood/marble sources at [5],[13],[15],[19] (4); conservation duty at [1],[4],[11],[16] (4).
- [17] true_false with verdict True and no misconception (a copy of [12]'s key).
- [18] "Using the chapter's two margin notes": only one margin note (Gothic) is asked; (a) is a glossary lookup.

---------------------------------------------------------------------
## LOW
- 3.1 [5] true_false: "The chapter promises a complete survey" is a mild misconception; reason is the first paragraph.
- 3.1 [0] and [2] tagged `case_study` but [2] is a correction list with no setting data.
- 3.1 [16] distractors o[3] ("granary") are absurd rather than chapter confusions; same for 3.3 [6], 3.4 [14] o[3].
- 3.1 [13] matching 1-d/2-c: "bathing area and drains" could also be read as "carefully laid-out"; the key is the best match and acceptable.
- 3.2 [2] key text says "calligraphy ... geometric" none; no issue. (3.8 [2] below.)
- 3.8 [2] step line says "marble screens Indian; geometric patterns Arabic" while the question and answer ask about "calligraphy from the Qur'an". The p.115 sentence ("Arabic calligraphy from the Qur'an and intricate geometric patterns adorn the walls") is ambiguous about whom the geometric patterns belong to. Taj Mahal culture sorting (flagged by caller): the culture sorting in 3.8 [10], [12], [14] is sound because the keys assign only the calligraphy to Arabic and leave geometric patterns out (and 3.8 [12] has no option that assigns them). The step line in [2] should be changed to "calligraphy Arabic", and a note added to [10] (b) that a student writing "Arabic: calligraphy and geometric patterns" must also be credited.
- 3.5 [13] fill_blank: the pilgrim-sharing story is arbitrary; needs "five temples" from the chapter so it is valid, but the arithmetic is trivial.
- 3.5 [18] true_false: "Lingaraja to Vishnu" is an invented confusion, not a chapter confusion.
- 3.6 [10] 3.8 [4]: multi_statement items where all-true / single-true is fine, but statements are one-line book facts.
- 3.9 [3],[9] rely on the p.122 caption (see M-E).
- Bloom/difficulty labels: nearly every item is labelled Hard/Hardest and many lookup items are labelled Analyse/Evaluate; the labels overstate the thinking.
- 3.3 [14] "square bricks in a straight-sided ring": inference beyond the book (the book says only trapezoid bricks lock), but logically valid and framed as "if it was to match the chapter's description".

---------------------------------------------------------------------
## Template and mix counts
- Per concept: every concept has 4 long answers (2 case studies, 2 five-marks), 8-9 one-mark items, 5 two-mark, 3-4 three-mark. Marks mix is identical in 7 of 9 concepts (8/5/4/2/2 at 1/2/3/4/5), but slot positions differ concept to concept (no shared order). Not an identical-order template, but a fixed-count one.
- claim_check verdicts (9): No 5, Partly 3, Yes 1. Acceptable mix. (But 3.1 [12] is mis-keyed, see H7.)
- true_false (9): True 4 (3.2, 3.6, 3.7, 3.9), False 5. 44 % True, within 25-75 %.
- assertion_reason (9): R explains 4 (3.2, 3.3, 3.7, 3.8), R not explain 3 (3.1, 3.6, 3.9), A true R false 1 (3.4), A false R true 1 (3.5). All four outcomes used. Three "R explains" keys (3.2 [16], 3.3 [2], 3.7 [7]) are arguable, see M above; 3.8 [16] is solid ("as a result" in the book).
- multi_statement (9) keys: "1 and 3" 2 (3.1, 3.3); "2 and 3" 2 (3.2, 3.5); "1 and 2" 1 (3.4); "1, 2 and 3" 1 (3.6); "1 only" 1 (3.7); "3 only" 1 (3.8); "2 only" 1 (3.9). Good spread; every false statement is clearly false by the book.
- Correct-option-is-longest: 0 of 42 (also shortest 0 of 42); every key is rank 2 or 3 (M-B).
- fill_blank 8 (none in 3.9): 4 bare division, 3 of them stem-answerable.
- match 5 of 9 concepts (3.1, 3.2, 3.4, 3.6, 3.8, 3.9 = 6); all with unique key.
- Repeated ideas (more than twice in a concept): 3.1 two ideas; 3.2 two; 3.3 three; 3.4 three; 3.5 three; 3.6 two; 3.7 two; 3.8 three; 3.9 four. See concept lists.

## Per-concept status
- C8S-3.1: needs fixes (H1, H7; M on four/five, repetition, case study).
- C8S-3.2: pass after fixes (no HIGH; M on case study, AR, repetition, recall).
- C8S-3.3: needs fixes (H2; M on fill_blank, AR, case studies, repetition).
- C8S-3.4: pass after fixes (no HIGH; heavy vocabulary repetition and recall).
- C8S-3.5: pass after fixes (no HIGH; stem-answerable MCQ, case studies, repetition).
- C8S-3.6: needs fixes (H3, H6).
- C8S-3.7: needs fixes (H4; the Dholpur case study redesign).
- C8S-3.8: needs fixes (H5; repetition).
- C8S-3.9: pass after fixes (no HIGH; heavy Chettinadu repetition).

## Verdict
**Not load-ready.** Seven HIGH items (three fill_blanks answerable from the stem, one sentinel/guard second answer, one "monsoon" error the book does not make, one "two features" count, one claim-check verdict). All seven are small, local rewrites. After them the pack is still weak on thinking: about half of the 187 items are one-line or enumerated lookups, the correct MCQ option is never longest or shortest in 42 of 42, no case study has a genuine decision, and five concepts repeat one fact more than twice. Recommend a second fix pass (HIGH, then M-A to M-D) and a fresh review before loading.

Answers to the caller's flags:
1. Taj Mahal Arabic calligraphy / geometric patterns: the keys avoid the ambiguity (only the calligraphy is credited to Arabic) so the culture sorting is sound; only the step line in 3.8 [2] says "geometric patterns Arabic" and should be corrected, and 3.8 [10] (b) should state that a student who also credits the geometric patterns to Arabic gets the mark.
2. Case study 3.7 [6] (Dholpur): not wrong, but not an inference the stem leaves to the student: the stem supplies the source and the 60 km, the clerk is a strawman, and "No" rests on the book's silence. See 3.7 notes for the rewrite.
