# v3 review: class6s ch11 (SST6, fees111, Grassroots Democracy Part 2), re-review after one fix pass

Pack read: content/authoring/dps/class6s/ch11.json (126 questions: 21, 20, 21, 22, 21, 21). Diffed against the pre-edit copy: 73 items changed, 53 unchanged. All 73 changed items re-read in full, keys recomputed in python (300 houses, 569, 25%/40%, 227, 3.9%, 5, 7 km vs 10 km, 116, 10 Sarpanchs, 4800/12/48/10, 120 cards/75%, 25 years, 3.3 lakh, 93 crore) and checked against fees111 pages 163-171. Unchanged items skimmed for repetition and conflicts with the new items. Indices are 0-based positions in the concept's `questions` array.

Mechanical checks (all clean): step marks sum to marks on every item; keyed option is o[0] on all 45 option items (mcq, match, AR, multi_statement); no option named by position; no scope_out line violated (no urban government, no 73rd Amendment, no SC/ST quotas, no term, no Collector, no meeting frequency).

## v2 status

- v2 HIGH: none. (New HIGH defects introduced by the fix pass: see below.)
- M1 strawman case studies: partly fixed. 11.1[3], 11.3[18], 11.4[2], 11.4[19], 11.5[1] now have a real trade-off, but two of them now have a second defensible answer (HIGH H1, H2, M1) and in 11.1[18], 11.2[18], 11.3[18], 11.4[16], 11.4[19], 11.6[18] the decisive cue is still handed over in the stem (M8).
- M2 easy-in-disguise: about two thirds fixed (new scenarios, error-finding, arithmetic). About a dozen remain (M3).
- M3 repetition: not fixed in 11.2, 11.3, 11.5, and a new near-duplicate was created in 11.3 (M2).
- M4 Kamble inconsistency: fixed (11.3[19] no longer asks why Kamble fits neither).
- M5 11.4[4] true_false: fixed (real misconception, corrected statement).
- M6 nesting assumption: fixed (11.6[0], [6](c) reworded; [1] fine).
- M7 uniform labels: NOT fixed, arguably worse (M4).
- M8 11.4[16] inference: fixed (the plan is now given in 11.5[16]'s stem; 11.4[16] became a budget item).
- L2-L6: L4, L5 fixed; L1 (scenario tag on thin items) and L6 (11.1[13](a) does not feed (b)) remain.

## HIGH

H1. C6S-11.5 [1](d) "Road funds this year cover only 10 km, for whole requests only. One member wants A and B ... another A and D. Which pair should the block support? ... justify with the purpose of the scheme." Key: A and D (7 km) because both villages have no all-weather road. The book says only that PMGSY "promotes the construction of all-weather roads in rural areas". It never says the scheme gives priority to villages with no road, and the stem does not supply that rule. A and B builds 10 km of all-weather road with every km of the budget used, which also "promotes construction of all-weather roads"; a pupil can defend it from the same sentence. The key (and the 1-mark step "because both lack any all-weather road") depends on an unstated fact. Smallest fix: state the block's rule in the stem ("the block's rule is that villages with no all-weather road come first"), keep the 10 km arithmetic, and put the chapter-dependent reasoning in a different part (for example what the Samiti does with these plans before funds can be allotted), or make (d) accept either pair if justified from the quoted purpose.

H2. C6S-11.1 [3](c) Rampur case: "decide which work Rampur should pay for itself and what it should do about the other." Key: pay for the canal, send the road up because PMGSY exists and "the chapter names such a route for roads but none for a village canal". Second defensible answer: the Samiti collects the plans of all Gram Panchayats for "development projects and ... schemes" in general (page 169), so the canal can go up too; and PMGSY promotes the construction of all-weather roads, while the stem's work is rebuilding a washed-out stretch (repair), so a pupil may argue the road does not fit PMGSY and should be paid locally, the canal sent up. The road also serves all 180 families (the stem itself says so in (b)). The 2-mark step rewards only one of the two decisions. Fix: make (c) ask for a justified choice and award it for a chapter-based reason either way (marks for naming the Samiti route and for linking the choice to the (b) numbers), or give the stem a rule ("the block has funds only for new all-weather roads").

## MEDIUM

M1. C6S-11.4 [2](d) Rampura: "Which campaign should the Bal Panchayat take up itself". Key A (visit parents), B goes to the Gram Panchayat and elders. Campaign B (a proper school kitchen) is also a thing the chapter lets a Bal Panchayat do (children "express their ideas and opinions on matters that concern their wellbeing"; elders find solutions), and B reaches 60 children against 5. The key's own text sends B to elders, so a pupil answering "B, raised with elders" is marked down under step 4. Fix: accept either campaign when each is tied to a stated role in the chapter; mark the justification, not the pick.

M2. Repeated ideas still over the "about twice per concept" limit, and one new near-duplicate.
- C6S-11.3 [18] (Devgarh: 12 of 310 women, Maida for participation, Pawar for water) is the same case as the unchanged [13] (Village A/B: 12 of 300 women, Pawar for water, Maida for participation). Replace one.
- C6S-11.3 Maida versus Pawar contrast: [11], [12], [13], [18], [19], [20].
- C6S-11.2 Patwari: [8], [9], [11](3), [15], [18](c) region; Secretary versus Patwari in [8] and [15](e); Gram Sabha versus Gram Panchayat in [0], [1], [4], [5], [10], [13], [19].
- C6S-11.5 Samiti collects plans and funds follow: [1](a)(c), [8], [15], [16], [20]; reservation or disadvantaged sections: [2], [3], [9], [18].
- C6S-11.6 four layers not three: [2], [15], [17]; the nesting division arithmetic: [0], [1], [6].
Fix: cut each cluster to two and spend the slots on untested chapter facts (Hiware Bazar steps against droughts, PMGSY, Bal Sabha against Bal Panchayat, Gandhi epigraph, Big Questions).

M3. Easy-in-disguise items that remain (the answer is one line the book states; wrong options are absurd or invented):
- 11.2 [3] true_false "Pradhan = Sarpanch" (key True, no misconception).
- 11.3 [2] (two district lookups), [8] (conclusion MCQ, wrong options absurd), [9] (find the Kamble fact), [15] (five lookups in error-spotting form).
- 11.4 [5] ("night schools and parliament-like elections" is a sentence from p.168-169), [12], [15].
- 11.5 [11] (PMGSY = all-weather roads), [15] (two lookups, labelled Analyse), [18] (a, c, d are lookups).
- 11.6 [7] (two true statements are trivia: economy and Chanakya), [8] (museum label, option 3 "230 years old"), [16] true_false (see M5), [3] AR.
- 11.1 [1] (reply to a villager, three options invented).
Rewrite with a real chapter confusion or a computation, or relabel Understand.

M4. Difficulty labels are still uniform and now less honest. Counts: Analyse|Hard 66 of 126 (52%), Apply|Hard 19, Evaluate|Hardest 14, Evaluate|Hard 11, Analyse|Hardest 9, Create 7; no Medium anywhere. Apply|Hard fell from 35 to 19 by relabelling lookups upward to Analyse|Hard, not by making them harder (see M3). Relabel after the M3 rewrites; keep Analyse|Hard for items that need a two-step chain.

M5. true_false items with key True and no misconception: C6S-11.6 [16] ("a text about war can also tell us how villages were governed", the statement is the page's own two sentences) and C6S-11.2 [3] (Pradhan/Sarpanch). The type should test a real misconception; verdict mix is 5 False, 3 True, but two of the three True items are lookups. Replace with a plausible wrong belief (for example "the Arthashastra is only about war and kings, so it says nothing about villages" is better as False).

M6. C6S-11.2 [15](d) (judge call: old map for a water-tank site). The book gives this only as a "Think about it" question ("How ... can these old maps be helpful?"). The stem supplies the pond, and the key's step "where water once collected guides the tank's place" is one speculative reading (a pond that is now houses cannot host a tank; another pupil may use the map to find open or grazing land). It is used as a fact-like step worth 1 of 5 marks. Fix: reword the step to accept any reasonable use of the map that is tied to something the map shows, and mark (d) as open. (b) is fine for the same reason as long as "need not rely only on memory" is not the only accepted wording.

M7. Smaller reading and assumption issues in changed items.
- C6S-11.4 [21](b): leadership against social awareness. "Speaking out against a custom" also needs leadership, so the (ii) key is one reading of two overlapping terms. Say "which of the two does the chapter link to challenging norms".
- C6S-11.4 [19](a): 120 voter ID cards for ages 8 to 14. The page says children aged 8 to 14 "are engaged in governance processes" and the Parliament used voter ID cards; it never states an age limit on voting. State the rule in the stem ("like the Children's Parliament, only children of the age band that took part may vote") or the key is an inference.
- C6S-11.4 [15]: the quote "challenge societal norms" is said of the Children's Parliament (Rajasthan), not of child-friendly initiatives in general; the keyed example is Maharashtra's. Key still best, but the stem misattributes.
- C6S-11.3 [15] line 4: "groundwater rose because the rains improved after 2017". The chapter does not say rains did not improve (it says the measures "contributed to" recharge), and 2017 is Kamble's year, not Pawar's. The key's "not better rains" over-claims. Reword the line as "only because the rains improved".
- C6S-11.3 [20]: "A Sarpanch's leadership can visibly change what a village achieves" is not shown by Kamble's story (the page gives no village change). Ask for the two who changed the village, or reword to "what a Sarpanch can be".

M8. Case-study last parts that are still cue-driven (the stem names the winning reason): 11.1 [18](d) (P's population is wrong by its own part (c), so Q wins), 11.2 [18](d) (stem says "this is Navgaon's Gram Sabha" and covers Pipri), 11.3 [18](d) (stem says the Gram Sabha must choose the project next month, so "bring the women first" follows), 11.4 [16](b) (stem says "busy highway", so wall first), 11.4 [19](d) (stem says the toilets are already in the Panchayat's plan and nobody else offered the class), 11.6 [18](c) (villager 1's "no self-governance" is contradicted by the newsletter itself). They are fair application items but not trade-offs; keep them out of the "Evaluate|Hardest" label or add a cost that cuts the other way.

## LOW

L1. C6S-11.2 [18](a)-(c) and 11.6 [18](a)-(b) are lookups; the climb comes only from the last part.
L2. C6S-11.6 [0]: "in roughly which year" gives false precision. 2,300 years before 2026 CE is 275 BCE (no year 0), 274 BCE if year 0 is counted; the key says "about 274 BCE" with the "some" caveat, which is acceptable as approximate. Judge's call: accepted. Better: ask for the century only (3rd century BCE) or accept 270-280 BCE. Also (a) does not feed (b).
L3. C6S-11.6 [19]: sample rule has no "who shall establish" clause, so its listed difference (1) is not a mismatch of the sample itself. Add "the State shall establish" to the sample.
L4. C6S-11.5 [3] AR: women's reservation could be read as one of the special rules (so R explains A); the page's "also" supports the key (separate provision), but one pupil may dispute. Reword A to "special rules, apart from the reservation of seats".
L5. C6S-11.6 [18](c): "funds are allotted at the district level" goes slightly past the page, which says presenting plans "facilitates the allotment of funds". Say "depends on the higher levels presenting and deciding".
L6. C6S-11.1 [13]: (a) 300 houses does not really feed (b); (b) is answerable from the chapter alone.
L7. C6S-11.2 [11](3): "maps kept by a Patwari can show how a family's land was recorded" is an inference from "maps generations old" (the book asks it as a question); safe but not stated. C6S-11.5 [18](b): "plans are drawn up from what is said in meetings" is not a book statement.
L8. `scenario` tag on thin items: 11.3 [2], 11.4 [5], 11.2 [9] have a one-line setting that adds nothing; tag only real situations.
L9. multi_statement now 8 (was 6): 11.1 and 11.2 each hold two with the same read-the-statements frame, other concepts hold one. Keys: "1 only" x2, "3 only" x2, "1 and 2 only" x2, "1 and 3 only", "2 and 3 only"; no "all three" key. Fine, but swap one of the doubles back to another type.

## Judge's calls requested

- 11.6[0] Arthashastra about 274 BCE from "some 2,300 years": acceptable as approximate (L2), not a defect; trim the "year" ask.
- 11.5[1](d) PMGSY priority to villages with no all-weather road: reasoned, not stated, stem does not supply it. HIGH (H1).
- 11.2[15] old map for the water-tank site: from a Think-about-it box and used as a fixed key step. MEDIUM (M6).

## Template and distribution counts (current)

- Types: short_answer 52, mcq 28, long_answer 24, multi_statement 8, assertion_reason 6, fill_blank 5, match 3. Marks: 1-mark 50, 2-mark 32, 3-mark 20, 4-mark 12, 5-mark 12.
- Claim-checks (13): Not supported or not correct 6, Partly 3, Yes or supported 4. Good mix.
- true_false (8): False 5, True 3 (two are lookups, M5).
- AR (6): all four outcomes still appear.
- Correct option is the longest in 4 of 28 mcq (14%), 15 of all 45 option items (match and multi_statement answers are longest by construction); no systematic bias.
- Slot order differs in every concept; not a template. Settings are Indian and realistic.
- Facts: every date, name, district, age band, fraction and Arthashastra number in the changed items matches pages 163-171.

## Per-concept verdicts

- C6S-11.1: H2 (Rampur second answer), M2, M3 ([1]), M8 ([18](d)). Not load-ready.
- C6S-11.2: keys right; M2 repetition, M3 ([3]), M5, M6 ([15](d)), M8 ([18](d)). Pass after fixes.
- C6S-11.3: keys right; M2 ([18] duplicates [13]), M3, M7 ([15] line 4, [20]), M8. Pass after fixes.
- C6S-11.4: keys right; M1 ([2](d) second answer), M7 ([19](a), [21](b), [15]), M8. Pass after fixes.
- C6S-11.5: H1 ([1](d)), M2, M3. Not load-ready.
- C6S-11.6: keys right; M3, M5 ([16]), L2, L3. Pass after fixes.

## Overall

126 read, 73 changed items rechecked in full. HIGH 2, MEDIUM 8, LOW 9. Not templated. Verdict: NOT load-ready (fix H1 and H2, then M1; the rest is quality, not correctness).
