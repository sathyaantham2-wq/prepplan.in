# Review: Class 7 Social Science, Part II ch 1, "The Story of Indian Farming" (gees201)

File reviewed: `content/authoring/dps/class7s/p2ch01.json` (8 concepts, 21 questions each).
Read in full: **168 of 168**. Every key was recomputed from the question text against the extracted
pages (`content/extracted/gees201/pages/`), and every number in the case studies was recomputed.
Note: the scope record `content/authoring/class7s/p2ch01.json` lists only 6 concepts. The DPS file
has 8, and its 1.7 (seeds, traditional/contemporary farming) and 1.8 (government, challenges) match
the `scope_in` rows for pp 18-26, so I treated them as in scope.

## Summary
- HIGH (wrong key, second correct answer, fact or arithmetic error): **0**.
- MEDIUM: 9. LOW: 12.
- Keys and arithmetic are sound throughout. All 16 case studies recompute correctly in every part.
- Level mix at chapter level: Remember/Understand 86/168 = 51% (limit 60%). Analyse/Evaluate/Create
  60/168 = 36% (minimum 15%). Match items are in 5 of 8 concepts. Scenario MCQs, assertion-reason,
  multi-statement, claim-check, reverse and show-impossible are all present.
- Main weakness: **templating**. Item content is fine, but every concept is built on the same slot
  frame (see M1).
- Overall: usable, with one real rewrite needed (M1) and a handful of targeted fixes.

## MEDIUM findings (most important first)

**M1. Templated slot pattern across all 8 concepts (all concepts).**
- Position by position the concepts are identical. Slots 0-1 are recall MCQs. Slot 2 or 3 is a
  "which is NOT ..." MCQ. Then come two scenario MCQs, a match, a multi-statement, an assertion-reason,
  five 2-mark items, a 3-mark claim-check, a 3-mark reverse or show-impossible, a 3-mark "explain",
  a 5-mark "describe", a 5-mark "Compare ... Analyse why", and two case studies.
- Every concept has a claim-check in the frame "[Name] says, '...'. Do you agree? Use the chapter."
  (Priya, Arjun, Rohan, Neha, Kabir, Ishita, Anil, Rina).
- Case studies repeat one frame: (a) classify or name, (b) a per cent, (c) a second calculation,
  (d) "Either, with reasons". The key for (d) starts "Either ..." or "Any ..." in 13 of 16 case studies.
  Part (b) asks for a per cent in 1.1, 1.3, 1.4, 1.5 (both), 1.6 (both).
- C7S-1.5 case studies [19] and [20] are the same item twice: identify four soils from descriptions,
  then the per cent that is fertile, then a decision.
- Fix: vary the frame in at least half the concepts.
  - Make some case studies source-based, with a short passage and no arithmetic.
  - Make some (b) parts a cause-and-effect or a comparison.
  - Change one claim-check per concept into a "find the error in this note" or a "two students disagree, who is right".
  - Vary the 5-mark openers.
  - In 1.5 replace one of [19]/[20].

**M2. Case-study parts that are free marks or need no chapter knowledge (§11).**
- C7S-1.7 [20] (a) "Which plot follows the Green Revolution method, and name two of its inputs":
  the stem already says "the chemical plot (high-yielding seed with fertilisers and pesticides)".
  The stem prints the answer. Remove the bracket from the stem.
- C7S-1.6 [20] (a) "Which method means ploughing along the natural curves": the stem names
  "contour ploughing" and "terraces". Ask "what does terracing do" only, or describe the methods by
  effect without naming them.
- C7S-1.3 [20] (a)/(b): the stem says crop 3 is "watered from a borewell", so the water source of
  crop 3 is printed. Say only "watered in February" and let the student say "irrigation (groundwater)".
- C7S-1.8 [20] (a) "What kind of risk does this scheme cover": the scheme name ("Fasal Bima", crop
  insurance) is in the stem. Ask instead why a farmer needs it.
- C7S-1.2 [19] (a) and (b): arranging three dated cards and subtracting 3500 - 2800 needs nothing
  from the chapter. Keep (a), but make (b) depend on the chapter, for example what the Kalibangan
  furrows show about the practice.
- C7S-1.1 [20] (a) and (b): these are straight percentages of figures given in the stem.
  See M3 for the larger problem with this item.

**M3. C7S-1.1 [20] (Sundarpur block) goes beyond what the chapter teaches.**
- It introduces "average output per worker" (productivity) and "help farm workers move to other
  work". Neither idea is in the book. The book only gives the 18% (GDP) and 46% (workers) figures.
- Part (c) needs ₹36 crore / 4,600 and ₹164 crore / 5,400 by hand, which is heavy for Class 7 Social Science.
- The key's numbers are right: 36 crore / 4,600 = about ₹78,261, which rounds to ₹78,000.
  164 crore / 5,400 = about ₹3,03,704, which rounds to ₹3,04,000.
- Fix: replace (c) and (d) with a chapter-grounded comparison. Example: "the block has 46% of
  workers but only 18% of output; explain in one line what that tells us about how many people share
  the farm income."
- The same maths-heavy pattern appears in C7S-1.6 [19] (litres and rupees, a "flood watering"
  method the book never mentions), 1.7 [19], 1.7 [20] and 1.8 [20]. Keep one or two numerical case
  studies per chapter at most, and tie the maths to a chapter idea.

**M4. C7S-1.5 [17] (5 marks, "Describe the six major soil types ... origin and one feature of each").**
- The book gives no origin or feature for desert soil. It only has "Sandy soil" in the Fig 1.9 map,
  and does not say that desert soil equals sandy soil.
- The key hides this by crediting "desert soil named" as part of one mark and quoting the sandy-soil caption.
- Fix: ask for "any five of the six" or drop desert soil from the demand.
- In the same concept, [16] asks about the asterisk note on Fig 1.10. That figure is headed "(You
  need not remember all these details)", and the note is not quoted in the stem. State the note's
  gist in the stem, or reword the item so it does not need the figure.

**M5. C7S-1.2 [9] (b): the key claims more than the book does.**
- "Barley and wheat were Harappan staples, so two of the three crops the Vedas name were already
  staple crops before them." The chapter never says the Harappans came before the Vedic texts, nor
  that the Vedas name the crops as a sequel.
- The 'what does this suggest about their age' part is therefore an inference the book does not make.
- Fix: ask only "which two of these were Harappan staples", or ask for a link the book does state.

**M6. Strawman or lopsided decisions in case-study part (d) (anti-template rule).**
- C7S-1.2 [20] (d): the poster says "Everything in this kitchen was grown in Vedic times", and the
  answer is simply "No". Give the club a real choice, for example two draft posters that are both partly right.
- C7S-1.8 [20] (d): the neighbour's "premium wasted, rely on a loan" is easy to dismiss with the
  numbers (₹1,600 against a ₹80,000 payout).
- C7S-1.8 [19] (d): the tractor costs 10 years of crop income, so "do not buy" is obvious.
- C7S-1.7 [19] (d): Sonu earns ₹21,900 more per hectare. The dependence concern is real, but the
  figures lean heavily one way.
- Fix: adjust the figures so a sensible farmer could choose either way. For example, in 1.8 [20] make
  the payout lower or the premium higher.

**M7. C7S-1.3 [19] (a): two villages with invented rainfall are not cleanly separable.**
- The book says Coromandel gets rain from both monsoons. Village Q also receives 40 mm in October to
  December, so a student can argue that Q fits.
- P is the better fit only because 450 mm is a large share. The book gives no such shares.
- Fix: make Q's October-to-December rainfall 0 mm, or ask "which village looks more like the
  Coromandel plain, and what does the book say about that plain".

**M8. Same fact asked 3-5 times within one concept (wasted grid cells, §Anti-template).**
- C7S-1.4: "excessive rain destroys kharif crops / depends on timely monsoon" appears in [4], [7]
  (statement 3), [10], [14] and [18]. The kedara/haimana/graishmika names appear in [2], [6], [13]
  and [17]/[18].
- C7S-1.7: "85% of tested practices validated" appears in [7] (statement 1), [14] and [15].
- C7S-1.8: dividing land among heirs and the 0.75 ha average appears in [4], [10], [15] and [19].
- Fix: replace one or two of each cluster with an untouched idea. For 1.4 use the Arthashastra
  rainfall passage (only used in the old file), the three-season table months, or the
  growing/sowing/harvesting timing. For 1.7 use kulagar/gokrishi comparison, Green Revolution
  health effects, hydroponics or the FAO heritage systems. For 1.8 use cold storage, digital
  markets, the Ganga basin causes, or the 2,300-farmers-a-day debt statistic.

**M9. C7S-1.4 [17], C7S-1.5 [17], C7S-1.6 [17] (5 marks) are recall lists with an "explain how" label.**
- Examples: "Describe the three cropping seasons: weather, two crops, older name" and "describe four
  conservation methods". These match the standard's "recall in disguise" warning.
- Fix: turn one of each into a justify or compare. For example "A farmer has only wheat and mustard;
  explain which season she can use and what she must still plan for." Keep the current wording for at most one.

## LOW findings

- **L1.** Missing `"rev": true`. The stem "Show that ... cannot be right" appears in C7S-1.2 [15],
  1.3 [15], 1.7 [15] and 1.8 [15], and the stem "a farm family that is NOT only a crop-growing
  family" appears in 1.1 [15]. All are reversal wording and should be tagged. (C7S-1.3 [8] is
  tagged rev but its stem has no reversal word, which is harmless but inconsistent.)
- **L2.** Correct answer is the longest option in too many MCQs: C7S-1.5 [0], [1], [3], [5] (4 of 6
  MCQs), C7S-1.4 [3], [4], [5] and C7S-1.7 [0], [1], [2]. Pad the distractors or shorten the keys.
  (Option 0 is the key in the file and the loader shuffles it, so length is the only tell.)
- **L3.** C7S-1.5 [8] (assertion-reason): A "Red soil is red in colour" is a near-tautology. Use a real
  fact as A, for example "red soil is not very fertile" with a reason that does not explain it.
- **L4.** C7S-1.1 [11]: the stem asks "what is obtained" for each, but the key and marks cover only
  fish rearing versus cocoons/silk thread. Either change the stem or add "fish" and "silk thread" as
  what is obtained.
- **L5.** C7S-1.5 [11] (a)/(b) is two unrelated recall facts (Amarakosha basis; the six soils).
  (b) should use (a), per §11 on 2-mark items.
- **L6.** C7S-1.1 [10] and 1.8 [10] (two-part recall plus a conversion): fine, but 1.8 [10] (b) divides
  7,500 by 4,047 and expects 1.85. Allow "about 2" to be accepted.
- **L7.** C7S-1.7 [7] statement 1 and [14] hinge on the book's sentence "over 85 per cent of these
  practices were validated", read as the tested hundred. The book's wording is ambiguous, and a
  student reading it as all 5000 would be marked wrong. State the intended reading in the note, or
  avoid the contrast.
- **L8.** C7S-1.3 [20] (c): "why can Lakshmi grow rice three times while Mohan cannot" leans on the
  north lacking a second monsoon. The book also says northern farmers irrigate in the dry season
  (so Mohan could grow a crop). Reword (c) to "which water sources does Mohan have in the dry
  months" and make (d) the choice.
- **L9.** C7S-1.4 [6] (match): "kharif" and "kedara" are near-synonyms (monsoon crops versus wet crops).
  Only the phrase "Arabic-origin name" in b separates them. A student who knows kedara = kharif could
  reasonably hesitate. Describe b more clearly, for example "the Arabic name for monsoon crops".
- **L10.** Two items are Easy single-fact recall labelled Hard: C7S-1.1 [3] (pair of figures) and 1.5 [2] (clay).
  Not wrong, only the labels; `d` is internal so no action is required.
- **L11.** Scope-out line: the record says "Map and column-matching exercises: Not answerable without
  the map." The match items here are self-contained and original, not the book's Q2, and §10 requires
  them, so I did not mark them wrong. The owner may want that scope_out line reworded to "the book's
  own Column A/B exercise" to avoid confusion.
- **L12.** C7S-1.3 [20], 1.4 [20] and 1.5 [20] decisions of the form "either, with a reason" are
  accepted by the mark scheme. That is fine for judgement items, but the scheme names no minimum
  quality of reason. Add one phrase, for example "a reason that uses a figure from the stem".

## Per-concept verdicts

- **C7S-1.1** Sound keys. M2/M3 (case study 20), M1 frame, L4. Case study 19 is good.
- **C7S-1.2** Sound keys. M5, M6 (poster strawman), M2 (19). Match item [6] correct.
- **C7S-1.3** Sound keys, good AR pair (one explains, one false-A). M7, L8, M2 (20).
- **C7S-1.4** Sound keys. M8 clusters, M9, L9, one decision (19) is a bare "any step".
- **C7S-1.5** Sound keys. M1 (two near-identical case studies), M4, L2, L3.
- **C7S-1.6** Sound keys; strong claim-check (panchagavya) and assertion-reason. M3 maths weight, M2 (20) (a).
- **C7S-1.7** Sound keys; the best arithmetic case study is [20], though M2's (a) gives it away. M6, M8, L7.
- **C7S-1.8** Sound keys; M6, M8 (heir-division cluster), M2 (20). Case study 19 numbers all check.

## Computation log (all checked, all correct)
1.1: 4,500 x 46 / 100 = 2,070. Case 19: 210+30+12+8+10 = 270; 270/600 = 45%; 216/270 = 80%; 210/270 = 77.8%.
Case 20: 36 crore; 4,600; about 78,261 and 3,03,704.
1.2: 2800 + 1960 = 4,760; 12 x 30 = 360; 3500 - 2800 = 700.
1.3: 450 / 750 = 60%.
1.4: Case 19 areas 90 / 100 / 10 of 200. Case 20 beds 3 / 6 / 3 of 12.
1.5: 6/10 = 60%; 6 + 3.5x2 = 7; 13,000 / 20,000 = 65%.
1.6: 36,000 per day, 60%, 43,20,000 L, ₹28,800; 60 and 40 tonnes; 50%.
1.7: ₹64,500; ₹86,400; ₹65,700; ₹70,000 / 64,000 / 58,000 / 74,000.
1.8: 0.75 and 0.25 ha = 2,500 m2; 7,500 m2 = 1.85 acres; ₹1,08,000; -₹8,000; ₹70,400; 2 ha and 1 ha; 40%.

Count read: 168 of 168 (no sampling).
