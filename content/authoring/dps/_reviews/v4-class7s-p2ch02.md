# Review v4: DPS Class 7 Social Science, Part II ch 2 "India and Her Neighbours" (gees202)

File: content/authoring/dps/class7s/p2ch02.json (after the fixer rewrite from v3-class7s-p2ch02.md). Read all 160 questions (8 concepts x 20), no sampling. Each key decided before reading the answer; facts checked against extracted pages 001-032 of gees202; every number recomputed in python or by hand; every multi_statement and assertion_reason key checked statement by statement; step marks summed against `m` for all 160 (all match).

## Headline
- One HIGH: 2.7 Q5 (fill_blank) has a key that does not answer the question.
- All 8 multi_statement keys, all 8 assertion_reason keys, all 3 claim-check verdicts re-derived, and every case-study part (2.1 Q17, 2.4 Q15, 2.5 Q13, 2.6 Q20, 2.7 Q10, 2.2 Q12 and the rest) recompute correctly. The v3 HIGH (2.6 Q10 AR) is fixed: R is now the book's own causal sentence.
- The rewritten case studies are better: 2.4 Q15 (fair vs warehouse: Rs 29 lakh vs Rs 67.2 lakh gap, two aims pull opposite ways), 2.5 Q13 (+Rs 9,000, break-even at 7 open months) and 2.6 Q20 are now real trade-offs.
- Still not clear of "no easy items": about 40 of 160 are a one-line or one-list lookup whatever the Bloom label (down from 62 in v3). Listed below.
- Repetition is worse in places than v3 (Kartarpur now 11 items).

## HIGH
1. C7S-2.7 Q5 (fill_blank). Stem: "Taking 200,000 as the regional total, the number of deaths outside India was at least ___." Key: "7.5". 7.5 is India's share in per cent (15,000 / 200,000), not a count of deaths outside India. The correct count is 200,000 - 15,000 = 185,000 (and "more than 200,000" in the book makes it "more than 185,000"). A student who answers 185,000 is marked wrong. Smallest fix: keep key 7.5 and rewrite the stem to "India's share of the region's deaths was at most ___ per cent" (this is already what 2.7 Q10(b) asks, so better to change Q5 to 185000 with stem "...the number of deaths outside India was at least ___" and key "185000"; then 2.7 Q10(b) stays as the percentage item and the two stop duplicating each other).

## MEDIUM
1. EASY-IN-DISGUISE, about 40 items. The answer is one book sentence or one list. 2.1: Q9 (3-step chain is three consecutive sentences), Q13 (true_false that merely restates the list). 2.2: Q11 (Gajendra moksham pillar, one-line), Q13, Q14, Q18. 2.3: Q1 (match, each pairing read off the page), Q14 (two of three livelihoods), Q16 (add "Buddhist"). 2.4: Q5, Q12, Q16, Q19. 2.5: Q5 (true_false, verdict True, restates two sentences: no misconception), Q8, Q11, Q15 (figure item: the stem already says the river is "drawn as the line between the two", which hands over part (a)), Q20. 2.6: Q2 (1988 falls in 1985-2010), Q6, Q8, Q11, Q12, Q17, Q19(b). 2.7: Q4, Q13 (claim_check where both halves of the claim are true, verdict "Yes", no misconception), Q18, Q20. 2.8: Q3 (A and R are the same book sentence), Q5, Q6, Q7, Q11 (true_false verdict True, restates two sentences), Q20(a) (quote the glossary). Fix: add a second step the book does not hand over (a comparison across two neighbours, a recomputation with a changed figure, a choice between two facts that pull opposite ways), or drop the item for a concept that has fewer lookups.
2. assertion_reason verdict mix: "R explains A" in 5 of 8 (2.1, 2.2, 2.5, 2.6, 2.8), "both true, R not the explanation" in 1 (2.3), "A false, R true" in 2 (2.4, 2.7), "A true, R false" in 0. In 2.1, 2.2, 2.6 and 2.8 the R is the same book sentence as A or its evidence, so option 1 is guessable. 2.2 Q9 is the weakest: R (the monks' journeys) is the content of A, not a reason for it, so "both true, R not the explanation" is defensible. Fix: make 2.2 Q9 "A true, R false" (e.g. R: "Buddhism reached China by sea only") and 2.8 Q3 a "both true, R not the explanation" pair (R: "Chabahar is an Iranian port on the Gulf of Oman side").
3. Case-study (d) frame: all 16 (d) parts end "Either ... is acceptable if defended". Genuinely forced trade-offs: 2.4 Q15, 2.5 Q13, 2.6 Q20, 2.7 Q12, 2.8 Q17. Weak, because any option is free or the stem settles it: 2.1 Q11 (both choices rest on the same table), 2.1 Q17 (P vs Q), 2.2 Q12 (Team A vs B; B is simply better on the numbers, and the rubric only needs a named good), 2.2 Q16 (either panel), 2.3 Q18, 2.4 Q10 (any of three items may be dropped, the weeks never constrain which), 2.5 Q12 (either banner), 2.8 Q13 ("any pair is acceptable"). Fix: add a number or a constraint that makes one option cost something the other does not, as 2.4 Q15 now does.
4. Repetition (items on one idea in a concept; limit about two): 
   - 2.3 Kartarpur in Q1, Q4, Q6, Q8, Q11, Q17, Q18, Q19, Q20 (9 of 20) plus 2.4 Q16 and Q17. Sundarbans Q1, Q2, Q7, Q12, Q15, Q19. 1947/1971 dates: Q4, Q9, Q13, Q18, Q19. Replace Q6 (birth year of Guru Nanak), Q8 (permit count) and Q11 (1990s to 2019 gap) with items on Katas Raj/Hinglaj, the Bengal-border states, or the rivers.
   - 2.2 "eight times" ratio in Q6, Q10, Q12, Q13, Q19; "12 centuries" in Q2, Q16(a), Q20.
   - 2.4 Nepal trade in Q4, Q9, Q14, Q15, Q20 and open border in Q8, Q13, Q16, Q17; common-state lookup in Q1, Q2 (and 2.5 Q14 repeats the same device).
   - 2.5 Tio River photo in Q13, Q15, Q17; Bamiyan in Q6, Q11, Q12, Q18; Myanmar-vs-Afghanistan contrast in Q4, Q9, Q16, Q20 (Q9 similarity and Q20 are the same fact: India built/restored structures).
   - 2.6 SAARC in Q1, Q2, Q3, Q7, Q9, Q12, Q15; 130 km in Q5, Q18, Q19; Maldives sea-level in 2.3 Q15 as well.
   - 2.7 Dvaravati/Ayutthaya in 9 items (Q1, Q2, Q4, Q7, Q9, Q13, Q14, Q15, Q17); Q5 and Q10(b) both compute the 15,000 / 200,000 figure.
   - 2.8 Persian/Mughal/Parasika in Q2, Q6, Q8, Q9, Q10, Q15, Q18 (Q8 and Q10 are near-duplicates); Chabahar in Q1, Q3, Q14, Q15, Q17.
5. C7S-2.4 Q14 (Create, 5 marks). The answer claims festival, treaty, trade are "forced" to Nepal and river energy to Bhutan, so the religious day "must" go to Bhutan. That is an over-claim: the book gives Bhutan "mutual respect, strategic cooperation", which a student can call a political tie. A valid plan with Nepal = festival, trade, religious (Pashupatinatha) and Bhutan = political (strategic cooperation), river energy meets every stated rule (3 and 2 days) but contradicts the rubric lines "Religious day assigned to Bhutan" and "explains the religious day must go to Bhutan". Fix: change "political agreement" to "a named treaty" (only Nepal has one), and drop "forced" from the rubric, or accept any plan that meets the rules.
6. C7S-2.7 Q19 (short_answer). "Name two other links ... and say which one the chapter dates earliest." The rubric requires "early maritime trade over 2,000 years ago identified as the earliest dated", but a student who names Islam and Garuda on the rupiah (both valid, both undated) cannot name it. Fix: "Name the link the chapter dates earliest, and one more link."
7. C7S-2.4 Q18 (two-step chain). Step 1 says the dragon symbolises "the Vajrayana school". The book says the dragon symbolises "the thunderous voice of the Buddha's teachings" and separately that Padmasambhava's influence is central to Bhutan's religious identity; it never ties the dragon to Vajrayana. The chain is an inference stated as the chapter's. Fix: reword as "the dragon stands for the Buddha's teachings; the Buddhist school central to Bhutan came from the Indian master Padmasambhava", or mark it as inference.
8. C7S-2.1 Q7 (mcq) and its answer text. "Only Myanmar is described both ways: a land border ... and a maritime boundary" is false as a statement of the book: Bangladesh is also given a land border and "also share a coastline, and therefore a maritime environment" (and 2.1 Q5 option 4 uses exactly that). The key survives only because the Bangladesh option pairs the land border with "born in 1971", not with the coastline. Fix: stem "shares a maritime boundary in the Bay of Bengal" or delete "Only" from the answer text and build the Bangladesh distractor as "it borders ... and was born in 1971".
9. C7S-2.2 Q8 (claim_check). The claim has one false conjunct (date), so verdict "No" is as defensible as "Partly"; the rubric awards the verdict mark only for "partly right". Also the book gives no date for the Indian monks' journeys, so "all four journeys in the 1st century" is only checkably false for Faxian and Xuanzang. Fix: accept either "no" or "partly" when the reason names both halves (as 2.3 Q10 now does).

## LOW
- 2.1 Q11 and Q17: parts (a)-(c) are shares of invented lot counts or card sorting; fine, but (d) is free (see MEDIUM 3).
- 2.1 Q6, 2.5 Q3, 2.8 Q3: R is a copy of the book sentence behind A; consider paraphrasing R so it does not give the answer by echo.
- 2.2 Q2 (fill_blank "12"): 13th minus 1st; accept 12 only because the stem says "taking the difference between the century numbers". Fine.
- 2.3 Q15 compares Bangladesh with the Maldives, a 2.6 topic. Acceptable as a cross-concept item; consider moving it to 2.6.
- 2.3 Q12: the forest's area (9,900 sq km) is not in the book; the stem supplies it, so fine.
- 2.4 Q3: "20 subtracts 8 from 28" is a nonsense distractor; 2.4 Q5 option 3 and 2.6 Q1 options 2-4 are absurd on their face. A real confusion (e.g. Q1: "SAARC has nine members including Myanmar") would test more.
- 2.4 Q19: the first reason (Bhutan borders Sikkim) does not explain why Sikkim is a pilgrim stop; the second does. Make the first point "Sikkim is named among the Buddhist sites Bhutanese pilgrims visit".
- 2.5 Q18: "explain how the Uttarapatha and the highway are linked in the chapter": the chapter links them only through its closing note about reviving historical links. Say "in the chapter's closing note".
- 2.6 Q13: "two sentences" with 8 required elements is a Create item with no real constraint beyond recall.
- 2.8 Q4: "taking the permission as 1900 to 1924" gives a range (97.5 to 98 per cent); fine as "about 98".
- 2.8 Q13(b): 2024 minus 5,000 gives about 2976 BCE (there is no year 0); "about" covers it.

## Template counts
- Type/slot order: type sequence differs in every concept (no identical slot order). Marks per concept 8x1, 5x2, 3x3, 2x4, 2x5 and Bloom/Hard spread identical in all 8 (set by the standard; not read as a template).
- Case studies: 2 per concept (16); every one ends "(d) choose and defend", 8 of them weakly (MEDIUM 3).
- Quoted-claim frame ("X says '...' do you agree / correct this / show that"): about 28 of 160 (2.1 four, 2.2 five, 2.3 three, 2.4 two, 2.5 four, 2.6 four, 2.7 four, 2.8 four), down from 35.
- claim_check verdicts: No 4 (2.1, 2.4, 2.6, 2.8), Partly 3 (2.2, 2.3, 2.5), Yes 1 (2.7). Acceptable mix, but 2.7 Q13 "Yes" is a claim that is entirely true.
- multi_statement keys: 2.1 "1 and 3", 2.2 "2 and 3", 2.3 "1 and 2", 2.4 "3 only", 2.5 "1 only", 2.6 "1 and 2", 2.7 "2 only", 2.8 "1 and 3". Spread good, no "all three"; 2.4 Q4 has two false statements, others one or two.
- assertion_reason mix: see MEDIUM 2 (5 / 1 / 2 / 0).
- Correct option strictly longest in 6 of 38 plain MCQs (16 per cent); no length cue. Positional wording ("option (b)") found: none.
- true_false items with verdict True and no misconception: 2.5 Q5, 2.8 Q11 (the other 6 are False with a real confusion).
- New types: fill_blank items (2.1 Q8 = 20, 2.2 Q2 = 12, 2.3 Q6 = 1469, 2.4 Q2 = 2, 2.6 Q4 = 39) are application-level with machine-matchable numbers; 2.7 Q5 is the broken one (HIGH). The one figure item (2.5 Q15) is described fully but gives away part (a).
- Scope: nothing found from the scope_out list (blank-map and flag exercises); no fact beyond the book except stem-supplied assumed figures, which are flagged "assumed" where used.

## Per-concept verdicts
- C7S-2.1: pass after fixes (Q7 wording; Q9, Q13 easy; AR echo).
- C7S-2.2: pass after fixes (Q8 verdict, Q9 AR, easy Q11/Q13/Q14/Q18, "eight times" and "12 centuries" repeats).
- C7S-2.3: pass after fixes (Kartarpur 9 items; Q1, Q14, Q16 easy; Q3 AR still an unrelated R).
- C7S-2.4: pass after fixes (Q14 forced-claim, Q18 ungrounded link, Nepal repeats, Q10(d) weak).
- C7S-2.5: pass after fixes (Q5 True with no misconception, Q15 gives away (a), Tio/Bamiyan/Myanmar-Afghanistan repeats).
- C7S-2.6: pass after fixes (several one-line MCQs: Q2, Q6, Q8, Q11; SAARC repeats).
- C7S-2.7: rework one item (Q5 wrong key, HIGH), then pass after fixes (Q19 rubric, Dvaravati/Ayutthaya repeats, Q13 all-true claim).
- C7S-2.8: pass after fixes (Q3 AR echo, Q11 True with no misconception, Persian repeats, Q8/Q10 near-duplicates).

## Counts read
160 read. HIGH 1, MEDIUM 9 (chapter-level groups), LOW 11. Templated: partly (case-study (d) frame, quoted-claim stems, AR "R explains" 5 of 8), not by slot order or key spread. Overall: pass after fixes.
