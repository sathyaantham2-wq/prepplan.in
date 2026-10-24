# Review: class6s ch02 "Oceans and Continents" (SST6, fees102), first review

Read: all 124 questions (C6S-2.1: 21, 2.2: 20, 2.3: 21, 2.4: 21, 2.5: 20, 2.6: 21). Indices below are 0-based positions inside each concept's question list. Every key was decided before reading the key; arithmetic recomputed in code; every fact checked against fees102 pages 001-014 (printed pp. 27-40). Scratch files: scratchpad/review-class6s-ch02/ not used (dump script is in the session scratchpad).

Mechanical checks (python): for all 44 option items (mcq 27, match 5, assertion_reason 6, multi_statement 6) the key equals o[0]; no option named by position; every step-mark list sums to the question's marks; no Remember/Easy labels. The loader `--check` could not run here (needs .env), so format is not re-verified by the loader.

## HIGH (wrong key, second answer, fact or arithmetic error)
None. All 124 keys confirmed correct. Numbers recomputed: C6S-2.1 Q3 (1200/4 = 300), Q8 (average 71/29), Q17 (70 vs 75); C6S-2.4 Q1 (5), Q2 traveller (6/7, 3/4, 4/5, 5/6), Q15 (3 joins); C6S-2.5 Q2 (1983-2 = 1981; 1+2 = 3 bases), Q5 (2); C6S-2.6 Q0 (4,800 / 5,600 / 4,950 kg), Q5 (June = sixth); C6S-2.3 Q17 (2026-2004 = 22).

## MEDIUM

M1. C6S-2.1 Q0 (tiles, "About 72 blue and 28 brown"). The distractor "About 78 blue and 22 brown" is exactly as far from 75 as 72 is, so "most closely" rests on a tie broken only by the words "almost" / "a little over". A careful student can defend 78/22. Fix: change the distractor to 80/20 or 82/18 (or make the key 73/27 with 77/23 as distractor only if you accept the same tie risk; 82/18 is safest).

M2. Scope, freshwater items (the question put to me). C6S-2.1 Q11 (coastal town pipeline), Q16 (5-mark "water crisis" justify) and Q20 (freshwater list MCQ); Q17(c) also leans on "seawater unfit" and Q19 on seas. The facts are real and on page 31 (printed 31), inside the page range 31-33 that scope_in item 2 cites, and in the same book, so none is a fact error and none breaks scope_out. But the scope_in line lists only the five oceans, their interconnection and the Indian Ocean; salty seawater / small freshwater share / groundwater is not listed, and the concept (C6S-2.1) is "proportions and hemispheric distribution". Judgement: acceptable for Q11 and Q20 (one line each, tied to "oceans hold most of the water"), but Q16 is a 5-mark item built almost wholly on unlisted material and makes 3 of 21 items (14%) in one concept off the listed scope. Smallest fix: add one scope_in line to class6s/ch02.json ("Seawater is salty and unfit for most land animals; freshwater is a very small share, found in glaciers, rivers, lakes, the atmosphere and groundwater", p.31) so the item has a recorded home, or keep Q11/Q20 and rewrite Q16 on hemispheres/proportions. Q16 also asks "what this means for a town", which the book does not say (it only poses the water-crisis question as a Think About It).

M3. Repetition (rule: one idea at most about twice per concept). Counts of items testing the same idea:
- C6S-2.3: the 26 Dec 2004 event in Q6, Q7, Q9, Q10, Q16, Q17, Q19 (7); tsunami-vs-cyclone identification in Q1, Q4, Q7, Q8, Q14, Q18 (6). Fix: fold Q6 (14 countries, answered by the stem) and Q10 into other items; make Q7 or Q19 a different idea (e.g. warning-system use, or monsoon).
- C6S-2.5: India in Antarctica (programme/1981/1983/3 bases/40 teams) in Q2, Q5, Q8, Q10, Q11(stmt 3), Q13, Q14, Q17, Q18 (9 of 20). The same 1983-1981 subtraction occurs in Q2(a) and Q5. Also island-vs-continent in Q0, Q4, Q12, Q15, Q19. Fix: drop Q5 and Q13; swap Q14 for an island-groups or Greenland-scale item.
- C6S-2.4: Europe/Asia joined or separate in Q0, Q3, Q6, Q7, Q9, Q13, Q17, Q19 (8). Fix: replace Q9 (duplicated by Q17 a-c) and Q6.
- C6S-2.2: ocean size ranking in Q0(d), Q4, Q7, Q9, Q10(b), Q13 stmt 1, Q17 lines 1-2 (7); Indian Ocean limits in Q0, Q5, Q6, Q8, Q14(b) (5); flora/fauna meaning twice (Q12, Q16). Fix: drop Q7 or Q9; merge Q12/Q16.
- C6S-2.6: plastic/overfishing in Q0, Q4, Q8, Q10, Q11, Q12, Q17, Q19 (8); ocean uses in Q2, Q13, Q16, Q18, Q19 (5); "collective responsibility" in Q8, Q10, Q12(c), Q17, Q19(d), Q20.
- C6S-2.1: hemisphere asymmetry in Q1, Q2 stmt 2, Q4, Q7, Q8, Q18 (6); "three-fourths" in Q0, Q3, Q6, Q10, Q16, Q17.

M4. Case studies that fail the "last part is a real decision / earlier parts need the chapter" test:
- C6S-2.1 Q8 (group P/Q maps): (b) is arithmetic from the stem; (d) "which map for 'where most of the land lies'" is the answer of (a) restated, no trade-off. Fix: make (d) a choice with a cost (e.g. which map for a poster on 'where most water lies' needs the opposite reading and the class must also say why the poster's claim is true of hemispheres, not the Earth).
- C6S-2.1 Q17 (Verne extract): (a) and (b) are subtract-from-stem (70 vs 75); (c) is a one-line fact; no decision.
- C6S-2.2 Q0 (figure study): (d) "caption 'largest ocean' right?" has an obvious No. Q15 (Team A solid walls vs Team B dotted lines): Team A is a strawman, the book says outright that the lines are conventions; a real trade-off (clarity of a wall map vs accuracy) would fix it.
- C6S-2.3 Q5 (two alerts): 2 hours against 3 days is not a close call; also (c) is a recall of NDMA. Fix: make the times closer or give a cost to waiting (e.g. cyclone evacuation needs 2 days).
- C6S-2.3 Q17 (memorial stone): (a) 2026-2004 uses only the stem; (b) and (c) are recall.
- C6S-2.5 Q2 (timeline): (a) is subtraction from the stem ("two years after the programme began"), (c) repeats the book's parenthesis, (d) recall; no decision. Q15: (d) "Antarctica is the world's largest island" is a strawman.
- C6S-2.6 Q12 has only parts (a)-(c) for 4 marks (the standard is (a)-(d)) and no decision. Q16 (no-ocean planet): (d) "Is 'A Desert World' apt?" restates the book's own sentence, a recall answer; also (b) "food coastal people used" is odd on a planet with no coast.
Good case studies for reference: C6S-2.6 Q0 (catch table, decision on 30 more boats) and C6S-2.4 Q2 (traveller, four counts); both climb and need the chapter.

M5. Easy-in-disguise (answer is a one-line fact the book states), whatever the Bloom label: C6S-2.1 Q10 (blue/brown/white), Q13 (give three links), Q7 (Northern Hemisphere has more land); C6S-2.2 Q1 (western coast = Arabian Sea; Southern/Arctic are filler distractors), Q7, Q8 (five legs, each one recalled name), Q14, Q16, Q19; C6S-2.3 Q1, Q6 (stem gives "India and another 13", so 14 is arithmetic on the stem), Q7(a), Q10, Q14; C6S-2.4 Q14, Q16 (5 marks reciting the page's table), Q20; C6S-2.5 Q13, Q14, Q16; C6S-2.6 Q5 (World Oceans Day = June 8, then "sixth"; contrived and machine matching "sixth" vs "6th" is fragile), Q7(a), Q13, Q14, Q15, Q20. Fix: add a second step (compare, predict, or a number) or drop. For C6S-2.6 Q5 use a computed month question or change the answer to a number the app can match.

M6. Claims beyond this book.
- C6S-2.5 Q18(d) (2 marks): "studying how climate changed helps understand this, and Antarctica is one of the continents that shapes it." The book only says teams research climate and environment evolution there, and that oceans and continents shape climate; it does not link the two. Fix: ask what the teams study and why (as the book states), or mark (d) as an inference with the book's two sentences quoted in the stem.
- C6S-2.1 Q18(d): "where land and water lie therefore shapes life in each hemisphere" is not stated in the book.
- C6S-2.3 Q12: "the sky may stay clear" and "its cause may be far away and unseen" are inferences (the book says tsunamis come from undersea quakes/eruptions and travel thousands of km). Acceptable as reasoning but the rubric should accept the book's two facts alone.
- C6S-2.6 Q7(b): "monsters stand for the dangers, treasures for the blessings" is the author's mapping; the book only says the tales show "the oceans' dangers but also their blessings".
- C6S-2.1 Q12(b)/Q2 stmt 1: "every continent is a landmass" is inferred from two definitions (the book never states it); fine, but Greenland as the example of a landmass-not-continent would be better replaced by Eurasia (book: Europe and Asia form one landmass yet are two continents).

## LOW

L1. C6S-2.1 Q3: "a little over ___ square centimetres", key 300. 300 is exactly one-fourth, not "over"; accept 300 only, but reword to "about" or ask "a little over one-fourth of 1,200 is about ___" (answer 300).
L2. C6S-2.4 Q14 is tagged `scenario` but is a plain "which is NOT a list" recall item; either add a situation or drop the tag.
L3. C6S-2.3 Q19 and C6S-2.5 Q17, C6S-2.6 Q17 are tagged `reverse` but are "write a short text using given facts", not a reverse of a statement; they test recall assembly. Fine as 3-mark Create items, but the tag overstates the thinking.
L4. C6S-2.1 Q1, Q4 and C6S-2.5 Q1: `true_false` items with True verdicts whose "misconception" is not a real one (Greenland larger than any single state; Southern map shows more blue). Keep the 3/3 True/False balance but make the True ones test a real slip (e.g. "the Southern map has more water, so the Earth is mostly Southern Hemisphere").
L5. C6S-2.3 Q15, Q20 and C6S-2.6 Q11, Q20: some options are throwaway ("Disaster management preventing the earthquake", "A cyclone, then plastic pollution", "Oceans clean themselves"); replace one per item with a real chapter slip (e.g. cyclone vs monsoon mix-up).
L6. C6S-2.6 Q14(a) is answered by the quoted message in Q12's stem in the same concept (cross-item leakage); Q10(b) of C6S-2.5 and Q13 similar. Reword one of the pair.
L7. C6S-2.3 Q10(b) "say what kind of area they are": answer "coasts on the mainland" is vague against the book ("the coasts of Tamil Nadu and Kerala"). Ask "which two states".
L8. Every concept uses the same mark profile (9/8-1 mark, 5 two-mark, 3 three-mark, 2 four-mark, 2 five-mark) and nearly every item is Hard or Hardest (no Medium); loader-driven but visible across concepts.

## Template check (counts)
- Claim-checks (6, one per concept): No 2 (C6S-2.1, 2.4), Partly 2 (2.2, 2.5), Yes 2 (2.3, 2.6). Acceptable mix; slightly fewer "No" than the "about half" guide.
- `multi_statement` keys (6): "1 and 3 only", "2 and 3 only", "1 and 2 only", "1, 2 and 3", "1 only", "3 only". Well spread. The false statement is on 2 (C6S-2.1), 1 (2.2), 3 (2.3), none (2.4, all true), 2 and 3 (2.5), 1 and 2 (2.6). Good.
- Assertion-reason (6): both-true-not-explain (2.1, 2.5), A-true-R-false (2.2), both-true-explains (2.3, 2.6), A-false-R-true (2.4). All four outcomes used. R false in 2.2 is a plain east/west swap.
- True/False verdicts: True 3 (2.1, 2.3, 2.5), False 3 (2.2, 2.4, 2.6). Fine.
- Correct option longest strictly: 3 of 27 mcq (C6S-2.1 Q0, 2.5 Q0, 2.6 Q11). No length tell.
- Slot order across concepts: not identical (positions of case study, match, fill_blank, AR vary); however each concept's tail holds the same shape of 5-mark "Justify/Compare" items and the same mark counts. Stem frames vary (quiz, atlas, ship log, memorial, fishing table). Not templated in wording; the weakness is repeated ideas (M3), not template frames.
- Types (124): short_answer 49, mcq 27, long_answer 25, multi_statement 6, fill_blank 6, assertion_reason 6, match 5. Blooms: Analyse 58, Apply 34, Evaluate 19, Understand 7 (5.6%), Create 6.
- Figure/map gaps: only C6S-2.2 Q0 is a `figure` item, fully described in words; no map-pointing items present.
- scope_out: no violation (no Navy motto, no coral/animal names beyond "seaweeds/fish" in C6S-2.2 Q16, which is general marine flora/fauna; no hemisphere-table, drawing or outline-map activity).

## Verdicts per concept
- C6S-2.1: pass after fixes (M1 tie distractor, M2 freshwater scope, M4 two weak case studies, M5 Q10/Q13, repetition on hemispheres).
- C6S-2.2: pass after fixes (case studies Q0/Q15 weak decisions; five-leg Q8 and several recall items; ranking repeated 7 times).
- C6S-2.3: pass after fixes (2004 event in 7 items; fill_blank Q6 gives 14 away; case studies Q5/Q17 weak).
- C6S-2.4: pass (strongest concept; trim Europe/Asia repetition, L2).
- C6S-2.5: pass after fixes (Antarctica programme in 9 of 20; Q2/Q15 case studies; Q18(d) beyond the book).
- C6S-2.6: pass after fixes (Q5 recall fill, Q12 three-part case study, Q16 title restates the book, plastic/overfishing repeated 8 times).

## Overall
124 read. HIGH 0. MEDIUM 6 findings (several multi-item), LOW 8. Keys are all correct and the bank is not templated in wording. It is not yet at the DPS floor in two ways: repeated ideas inside concepts, and case studies whose last part is not a real decision. Verdict: PASS AFTER FIXES.
