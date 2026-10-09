# Review v2: dps/class9s/ch05.json (Class 9 SST, State and Society up to 1000 CE, iest105)

Reviewer: independent pass. Chapter file not edited. Checked against pages 001-042 of content/extracted/iest105/pages and the scope in content/authoring/class9s/ch05.json.

## Verdict: PASS (0 HIGH, 4 MEDIUM, 9 LOW)

164 questions across 8 concepts (20/20/20/21/20/22/20/21). Types: mcq 37, short_answer 66, long_answer 32, multi_statement 8, assertion_reason 8, fill_blank 8, match 5.

## Programmatic checks (all clean)
- Every mcq/match/AR/multi_statement item has exactly 4 options, no duplicates, and the key text begins with exactly one option (58/58). The key string carries a trailing explanation, the same convention as dps/class9s ch01-ch04.
- All 58 keys sit at option index 0. That matches ch01-ch04 and implies the loader shuffles; if it does not, key position is fully guessable. Worth confirming once for the whole class9s set.
- No positional references ("all of the above", "both a and b", "option A"). One hit on the word "above" (5.6 MS: "above the visha stood the jana") is content, not positional.
- Recomputed in code: 1028/4=257 (5.1 case); 30-5=25 (5.2); 7-2=5 and the four-of-seven saptanga count with janapada, durga, kosha missing (5.3); 897-275=622, 753-543=210, difference 412; 45-15=30, 15/3=5 (5.4); 12-3=9, 9/3=3 (5.5); 12+63=75, 25x3=75 (5.7); 4800/6=800 and 4000 left; 4000/100x25=1000, half 500, 500/100x1=5; 2000/100x1=20, 1000/100x0.75=7.5, total 27.5 (5.8). All keys correct.
- Match keys re-derived from the book (Veda boxes p99, rulers pp110/107/117, northern/southern units pp111-112, varna roles p119, monuments pp129/132-133): all correct and each has a single valid mapping.
- Multi_statement and AR keys re-derived: all correct. The 3-statement format matches ch01-ch04 of this subject.

## Findings

### HIGH
None.

### MEDIUM
1. Difficulty inflation, easy in disguise (group). All 8 fill_blank items are tagged Apply|Hard but are one-step recall or trivial arithmetic: 5.1 [6] Aranyaka (the stem gives the forest clue), 5.2 [7] 30-5, 5.3 [7] 7-2, 5.4 [7] subtraction of two date ranges (pure arithmetic on facts given in the stem), 5.5 [7] "honest", 5.6 [8] "dharma", 5.7 [7] vanaprastha, 5.8 [8] 4800/6. The 5 match items (Analyse|Hard) are term-to-definition recall. Suggest re-tagging as Easy/Medium or adding a reasoning step.
2. Giveaway wording in false statements. 5.3 [4] makes statements 2 and 3 false with absolutes ("only role was to command the army", "could never take a decision"); 5.7 [5] statement 2 ("no earlier reference in any text"); 5.5 [5] statement 3 ("left out respect within the family"). Students can pick the key from the absolutes without the chapter. Soften to plausible-looking errors (wrong officer, wrong number).
3. Case-study template repetition. All 8 case studies run (a) recall, (b) recall or contrived arithmetic, (c) recall, (d) "choose X or Y, either is fine if reasoned". The (d) options are often a strawman (5.4 [19] private staff-room draw; 5.4 [20] head officer decides alone; 5.2/5.1 [18]-[19] map vs replicas, recitation vs manuscripts) and are not anchored to the chapter, so the 1 mark is effectively unmarkable. The village-council election items (5.4 [19], 5.5 [18]) use the same slips/committees arithmetic.
4. Repeated ideas across concepts. Uttaramerur honest earnings / Kudavolai appears 6 times (5.4 [4], [15], [18], [19]; 5.5 [7], [12], [18]). Vanaprastha as the forest stage appears 5 times (5.6 [4], [21]; 5.7 [4], [7], [8]). Nashik guild deposit appears 5 times (5.8 [0], [5], [7], [9], [15], plus [20]). Rigveda date "debated" appears 3 times in 5.1 ([8], [13], [19]). Thins the coverage of the 20-per-concept bank.

### LOW
1. 5.6 [4] Mr Nair "keeping only a few belongings" leans toward samnyasa; the key (vanaprastha) is right because of "hut in the forest", but the clause invites a second reading. Drop the belongings clause.
2. 5.5 [6] AR is near-tautological: A ("the chapter links dharma with the earth") and R (shared root dhri) restate one fact, so "R explains A" is weak and a student could defend "not the correct explanation". Replace with a causal pair.
3. 5.8 [15] and the 5.8 [19] interest figures turn the inscription's units (pratika/padika) into "kahapanas per 100". Marked "Suppose", so not wrong, but the book's own unit is changed. State it as an assumed rate.
4. 5.8 [19] invents a grain price (25 kahapanas per 100 kg). Hypothetical, fine, but it is unrelated to the chapter and the 5.1/5.5/5.7 arithmetic bolt-ons ((b) parts of the cases: 1028/4 reciters, 12-3 candidates, 75 poets) add calculation without testing history.
5. 5.8 [3] option text "Muziris, a port on the western coast" supplies a location the chapter text does not state (only the Fig 5.12 map labels). Harmless; the key (Pataliputra, an early historical city, not among the four ports named on p131) is right.
6. 5.8 [1] "Mauryan-age market" attributes adulteration controls to Mauryan times; the book gives it under the Arthashastra's account of state and trade, not explicitly Mauryan. Say "in the state described by the Arthashastra".
7. 5.5 [18] (c) asks for a "principle" but the key answer is the general politics-ethics link; make the question ask for the link.
8. 5.2 [4] stem (guide swaps Chola/Pandya emblems) is pure recall of three emblems from a Let's Recall box; tagged Apply|Hard.
9. 5.7 [18] (c) lists "mathematics, medicine" as "practical or artistic subjects"; they are academic subjects in the chapter. Reword to "subjects or arts".

## Scope and source
- No scope violations: no dynasty-by-dynasty battle detail, no medieval content after 1000 CE, no Bhakti saints' teachings (only the Alvar/Nayanmar counts, which are in the chapter), no Buddhist/Jain doctrine. Concept placement follows the scope file's eight concepts.
- Facts beyond this book: none found. Spot-checked every named figure, date, number and inscription (Junagadh three rulers, Damodarpur five members, variyams, Mandsaur 473 CE, Karitalai brahmanas, one-sixth tax, 18 guild types, 12 Alvars/63 Nayanmars, Sembiyan Mahadevi, Prabhavati Gupta, Nahapana/Ushavadata) against pages 95-135.
- Strawman claim-check items (Kabir, Ravi, Harsh, Dev, Imran, Nisha) are fair: each has a real part-right or wrong-part to find in the chapter.
