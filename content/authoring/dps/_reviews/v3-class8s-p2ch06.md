# Review v3: class8s p2ch06 (SST8, Part II ch6, Dynamics of Population, hees206)

File read: content/authoring/dps/class8s/p2ch06.json, all 163 items (21+20+20+20+20+20+20+22), 8 concepts C8S-6.1..6.8. Compared by index with scratchpad/fix-class8s-p2ch06/orig.json (same order; 95 items differ). Pages read in full: content/extracted/hees206/pages/001-024. Indices are 0-based within the concept.

Every number, share, percentage and step total was recomputed in python: all keys and arithmetic are correct (the 163 items hold no wrong number). `a == o[0]` everywhere, step marks sum to marks everywhere, no option named by position, correct option is never equal in meaning to a wrong one.

Counts: HIGH 7, MEDIUM 10, LOW 6. Verdict: NOT load-ready. Pass after fixes (the keys are sound; the HIGHs are six fill_blanks and one false fact in a model answer).

---------------------------------------------------------------------
## v2 status

| v2 item | Status |
|---|---|
| H1 6.3[3] fill | Rewritten, still fails (H1 below) |
| H2 6.4[5] fill | Rewritten, still fails (H2) |
| H3 6.5[11] fill | Rewritten, still fails (H3) |
| H4 6.7[6] fill | Rewritten, still fails (H4) |
| H5 6.8[19] fill | Rewritten, still fails (H5) |
| H6 6.4[4] "name the three" | Fixed in substance: now "two of them", table values in stem, (c) judges "alone" with the word "many" (see M3 for one residue) |
| H7 values not in stem | Fixed: 6.4[2],[4],[7],[8], 6.2[8],[9], 6.8[0], 6.7[18] all carry their values, all match the pages (Fig. 6.11, 6.17, 6.3, 6.5 checked line by line; 6.6 pair only added, as before) |
| M4 loose adjectives | Fixed ("just under a seventh" 13.8 against 14.3; "about two-fifths" 42) |
| M5 wrong page | Fixed ("the note printed beside the diagram") |
| M6 6.5[17] | Fixed (now a False item on "only people who cross a border") |
| M11 6.2[5] | Fixed (stem adds "nobody has moved in or out") |
| M12 6.8[5] | Fixed (premise "a child stays in the under-15 group from birth until her fifteenth birthday" now in the stem; key unique) |
| M13 6.2[15] | Fixed (stem says figures rounded, illustrative; (d) sets China aside) |
| M8 guessable MS swaps | Mostly fixed: 6.4[15], 6.5[7], 6.7[0] false statements now hinge on chapter distinctions |
| M2/M3/M9/M10 (easy in disguise, repetition, strawmen, 5-mark recall) | Reduced, not gone (M5, M6, M7, M10 below) |

---------------------------------------------------------------------
## HIGH

### Six fill_blanks still fail the fill_blank rule (application-level, one natural machine-matchable answer, needs a chapter fact the stem lacks)

H1. C8S-6.3 [3]. "A country's fertility rate has been 1.5 for many years, so its population might ___ over time." Key "shrink".
Problem: the stem copies the chapter sentence ("might shrink over time") and supplies "might" and "over time"; a student who has never seen the chapter still says "decline", "fall", "decrease" or "reduce" (1.5 is under two children per woman). The chapter itself uses both "shrink" and "start falling" (p. 173), so "fall" is a book-faithful second answer. A word key of "shrink" marks "decline" and "fall" wrong; and the 2.1 rule (the only chapter fact) is not what decides the word.
Fix: make it numeric, so the chapter fact is the whole item: "A country's women average 1.9 children each. To reach the replacement level the average would have to rise by ___ children per woman." Key 0.2 (needs 2.1, which the stem omits; one answer).

H2. C8S-6.4 [5]. "...under China's One-Child Policy of 1979, families that broke the rule faced fines or ___." Key "job loss".
Problem: this is a one-line page fact (p. 174) with the answer copied from the page, which the standard forbids for fill_blank. As a machine-matched phrase it has natural variants: "loss of job", "losing their jobs", "job losses", "unemployment", "dismissal"; a student who has not read the chapter can also say "jail" or "imprisonment" with equal plausibility.
Fix: replace with a computed value that needs a chapter figure, for example "China's population is projected at 1.31 billion in 2050 and, by the chapter, 26 per cent will be above 65: about ___ million people." Key 340.6 (accept 341). Or drop the item; the chapter has six fill_blanks and the minimum is four.

H3. C8S-6.5 [11]. "If India's child mortality in 2023 was 28, then out of every 1,000 children born alive, ___ would be expected to survive to their fifth birthday." Key 972.
Problem: the stem hands over the whole definition (per 1,000, born alive, fifth birthday); 972 is 1,000 - 28 and is not on the pages. Anyone reading "28" and "out of every 1,000" gets 972 with no chapter. The chapter fact (child mortality is deaths under five per 1,000 live births) is exactly what the stem gives away.
Fix: take the unit out of the stem and keep the number, for example "India's child mortality in 2023 was 28. In a district with 5,000 live births at that rate, ___ children would die before reaching five." Key 140 (needs "per 1,000" and "under five", from the chapter; 6.5 [15] already uses a related figure but with its own numbers, so change one of them).

H4. C8S-6.7 [6]. "In a population structure diagram the widest part is the middle, so most people are working adults. The chapter calls the population of such a country ___." Key "stable".
Problem: copied from the page sentence (p. 180, "has a stable population"), and the stem states the whole reading but the label. Natural answers a student gives: "balanced", "working", "mature", "productive", "steady", "stable". Key "stable" rejects the rest. The key is also not application-level.
Fix: numeric application of the sex-ratio rule: "At a sex ratio of 1,000, women make up ___ per cent of a population." Key 50 (needs the definition; the stem does not give "females per 1,000 males"). Or drop.

H5. C8S-6.8 [19]. "A country whose median age is 50 has few young taxpayers, so its government will find it hard to pay ___ to retired people." Key "pensions".
Problem: "pay ___ to retired people" is answerable from the stem alone (pensions is the only word for money paid to the retired); "pension", "salaries", "benefits" are natural variants (singular/plural alone breaks a machine match). The chapter fact (p. 185) is not needed.
Fix: replace with a number that needs the chapter: "Of 100 people in a country, 27 are under 15 and 65 are of working age (15 to 59): ___ are 60 and above." Key 8 (note 6.8 [4] already asks this, so drop [4] or this). Or drop the item.

H6. C8S-6.1 [20] (not in v2; same defect class, now one of six). "A town's planners find that the share of elderly people in their population is high. According to the chapter, the town will need more ___ facilities." Key "healthcare".
Problem: the one-line p. 168 fact; common sense gives the answer without the chapter; variants "health", "health care", "medical", "hospital", "care". The v2 version was the date sum; the rewrite swapped it for a pure lookup, which is an easy item in the bank that allows none.
Fix: "A census is generally held every 10 years; a census held in 2031 is followed by the next one in ___." Key 2041 (needs the chapter's 10-year rule; scope forbids dating India's latest census, so use the hypothetical).

### Fact error in a model answer

H7. C8S-6.7 [5](a). Key: "Yes: 30 years lies within the range of 30 to 35 years, and independence came at the start of the 1950s."
Problem: independence was in 1947, not "the start of the 1950s". The book never says when independence came; the key adds a wrong fact (and the stem's "30 years at independence" is the book's, p. 176, with "30-35 years in the 1950s" from p. 181). This error is new in the fix pass (the original [5] was a different item).
Fix: "(a) Yes: 30 lies within the range of 30 to 35, and the 1950s began only a few years after independence, so the two figures describe nearly the same time."

---------------------------------------------------------------------
## MEDIUM

M1. Page cited in the item (the task asked for none). C8S-6.1 [18] key: "Page 168 names three causes..."; C8S-6.3 [10] stem: "Page 173 says a fertility rate below 2.1..."; C8S-6.7 [11] key: "Page 168 says that a higher proportion of the elderly...". Fix: "The chapter says", delete "Page 168/173". (Fig. numbers inside the stems are fine where the stem also states the values.)

M2. claim_check "Partly right" with "only" claims that "No" answers equally well. C8S-6.1 [16] ("governments use demographic information only to plan buildings") and C8S-6.8 [21] ("an ageing population only means that more healthcare is needed"): both are one-clause claims whose word "only" is false, so a strict marker (and the chapter's list of other uses/pressures) also supports "No"; the key demands "Partly right". 6.3 [0] ("definitely grow ... definitely shrink") has the same shape but a two-part rule where the direction is true and the strength is false, which is acceptable. Mix is otherwise right: No 4 (6.1[17], 6.4[6], 6.5[14], 6.6[2]), Yes 3 (6.2[8], 6.4[8], 6.7[12]), Partly right 3 (6.1[16], 6.3[0], 6.8[21]). Fix: restate the two as two-part claims ("Governments plan schools and hospitals from it, and that is all they use it for" is still "only"; better: "A town with many elderly people needs more healthcare facilities, and the same figures tell it nothing about employment" so one half is true and one false), or accept "No" or "Partly right" with the correction in the rubric.

M3. C8S-6.4 [4] (a). "it explains two of them": the page (p. 175) bundles girls' education, formal jobs and later marriage in one sentence and gives urbanisation separately; the scope record lists four causes. A student who answers "women's formal jobs" and "urbanisation" is right but misses the key's step 1 (education). Fix: "Name any two factors the chapter gives and say how each leads to smaller families" and put in the rubric that education, formal jobs/later marriage and urbanisation each count.

M4. Answerable from the stem alone (the chapter adds nothing; arithmetic or a read-off of values in the stem). C8S-6.2 [0], [3], [7], [9], [13], [14]; 6.3 [7]; 6.4 [7]; 6.5 [5](a)(b)(c), [13](a)-(c); 6.7 [2](a)(b), [10](a), [18]; 6.8 [0], [4], [6], [10], [12](a)-(c). About 25 of 163 (15%). Keys are right; as written they test sums, not the chapter. Fix: keep one per concept and trade the others for items where a chapter rule (a unit, a definition, a stage, a band) has to be supplied by the student, as 6.3 [5], [6], [17] and 6.6 [14] do.

M5. Easy in disguise (a fact the book states in one line, whatever the Bloom label): 6.1 [14], [20]; 6.2 [1], [2], [16](a); 6.3 [2], [13]; 6.4 [10], [16](b); 6.5 [2], [17], [19]; 6.6 [0], [3], [10], [11]; 6.7 [3], [16], [19]; 6.8 [1], [7], [20]. About 25 (15%). The Analyse/Evaluate/Create labels are 65.6% (107 of 163), Understand 6.7%, so the label mix is fine; the item content is the issue. Fix: swap the weakest five (6.5 [19] duplicates 6.5 [17] and 6.3 [13]; 6.6 [10] and [11] are the same stage-reading as [0]) for stage/inference scenarios.

M6. Ideas repeated. (i) Migration within a country counts: 6.3 [13], 6.5 [17], 6.5 [19] (two in one concept). (ii) "larger addition, slower percentage growth": 6.2 [14] and 6.6 [16] (same decade figures 846, 1020, 1210). (iii) invest in education, skilling and healthcare: 6.8 [13], [14](d), [16], [20]. (iv) 2.1 above/below rule in 6.3: [0], [3], [9], [10], [12](b), [15] (6 of 20). (v) "average, not each person's age" in 6.5 [3], [14], [18]. Cap each at two.

M7. Case-study decisions that are trivial or one-sided. 6.1 [3](d) and [19](d) (the empty seats decide it); 6.4 [14](d) (the columnist's "only fines" is refuted by Cania in the same table); 6.5 [13](d) (40% against "most"); 6.7 [14](d) (960 is plainly below 1,000); 6.8 [14](d) (Japan raised the age, so "yes"); 6.8 [8](b) is a 125 against 120 sum. The frame "two sources/posters: which agrees, name the error, a factor, a reason" still stands in 6.2 [18] and 6.5 [18]. Fix: give one proposal an advantage and the other a cost, so the closing part is a real trade-off (see the 6.1 [19] fix in v2 M9).

M8. Distractor and option quality, 6.8: [6] State E/F wrong options "State F, by Rs 800 crore, since fewer workers means more tax per head" and "Neither, since both states have equal populations" are filler a student rejects without the chapter (and the item is chapter-free, see M4); [13] the correct option is 131 characters against 80, 70 and 89, a clear tell. Fix: shorten the key to about 90 characters or lengthen the distractors with real confusions (for example "raise the retirement age first" with a reason).

M9. C8S-6.8 [3] true_false (True): "a working-age group grows while the tax per worker stays the same, so the government has more money". No misconception is caught; the sentence is true by arithmetic. The other five are good (6.1 [12] True on size v structure, 6.2 [10] False, 6.3 [1] False, 6.4 [9] True, 6.5 [17] False). Fix: change to a False item on a real slip ("a larger working-age group means the government has less to spend because more people need services").

M10. Recall at 4 to 5 marks: C8S-6.7 [4] (b)(c)(d), 6.8 [16] (b)(c)(d), 6.8 [12]? (no: [12] is arithmetic, see M4). Part (d) of each thinks; the rest is the p. 181 and p. 186 narrative. Fix: keep (d), put data into the other parts as 6.7 [14] does.

---------------------------------------------------------------------
## LOW

L1. C8S-6.1 [0] "NOT among the items the chapter names": the page list ends "and so on", so "hours of sleep" is the best answer, not a proven non-member. Reword "Which of these is NOT one of the examples the chapter gives?".
L2. C8S-6.4 [3](b) "Name the two places in that order where fertility does not fall": the key names two transitions (Jharkhand to UP, Punjab to Delhi). Reword "Name the two steps".
L3. C8S-6.7 [18] says "read from Fig. 6.13" but the printed state labels are interleaved in the extracted text, so the pairing rests on the scope record (values agree with the 2011 census and the printed multiset 16, 9, 9, 8, 6x3, 5x2, 4, 3x5, 2x3, 1x2). Key unique (26 against 23, 20, 18). Reword "Take these shares from Fig. 6.13:" so the list is plainly a premise.
L4. C8S-6.3 [8], [13], [16], [19] refer to "Fig. 6.7" for the four definitions; the stem does not describe it. Say "the chapter's definitions".
L5. C8S-6.5 [4] assertion_reason: R is the definition and A a restatement; passes, but tests only reading. C8S-6.6 [17] multi_statement has all three statements verbatim true ("1, 2 and 3"); fine as the one all-true key, but make one statement reverse a hinge.
L6. C8S-6.2 [15](d): the key sets China aside as the stem asks; the stem's "India's fertility is now below replacement" is the chapter's, and "too high" is a prediction, not a certainty. Add "more likely" in the key (already in the stem).

---------------------------------------------------------------------
## Checks read (counts, not impressions)

- Claim-checks (10): No 4, Yes 3, Partly right 3. Matches the author's report. See M2 for two of the three "partly right".
- true_false (6): True 3, False 3 (50%). One needs a better misconception (M9).
- multi_statement keys (8): "2 and 3 only" x2, "1 and 3 only" x2, "1 and 2 only", "1 only", "3 only", "1, 2 and 3". Well spread. Three-statement format throughout, as the DPS standard asks.
- assertion_reason keys (8): both true R not explaining 2 (6.1 [13], 6.6 [5]); both true R explains 2 (6.3 [18], 6.5 [4]); A true R false 3 (6.2 [19], 6.7 [8]...); A false R true 2 (6.4 [11], 6.8 [9]). Balanced; hinges are real (R false because 1.9 < 2.1, because 943 means 48.5 not 50 per cent, and so on).
- Option length, 39 MCQs: correct option longest 10 (25.6%), shortest 9, middle 20 (13 strict, 7 ties). The author's figures (10 / 9 / 20) are right. No systematic tell; only 6.8 [13] (M8).
- Slot order: differs concept to concept (printed per concept; not templated). Bloom: Analyse 73, Apply 45, Evaluate 29, Understand 11, Create 5 (A/E/C 65.6%, Understand 6.7%, no Remember, no Easy). Hard 131, Hardest 32. Marks 366.
- fill_blank (6): all six fail or are borderline (H1-H6). Types: short_answer 66, mcq 39, long_answer 32, multi_statement 8, assertion_reason 8, fill_blank 6, match 4. `a` identical to `o[0]` for every mcq/AR/MS/match. Step marks sum to marks everywhere.
- Page cites: 3 (M1). Option-by-position: none.
- Scope: no scope_out line is violated; no density, no named theory, no Fig. 6.19 state values, no pyramid bar values, no named Indian scheme. Working-age bands follow the page the item cites (15-64 in 6.1 [9]; 15-59 in 6.7 [4], [14], 6.8 [4], [10]; 60 and above is the remainder in those items, which is an inference the stem states as an assumption in 6.7 [14]).
- Premises: 2.1 is stated where needed; "1 crore = 10 million" and "assume every child under 15 has a seat" are stated; Fig. 6.13 shares are stated in the stems of 6.7 [2], [10], [17], [18].

---------------------------------------------------------------------
## Per-concept verdicts

- C8S-6.1 (21): pass after fixes. Keys correct; H6 ([20]), M1 ([18]), M2 ([16]), M5.
- C8S-6.2 (20): pass after fixes. Keys correct; no HIGH; M4, M5, M6.
- C8S-6.3 (20): pass after fixes. Keys correct; H1 ([3]); M1 ([10] stem), M6, L4.
- C8S-6.4 (20): pass after fixes. Keys correct; H2 ([5]); M3 ([4]), M7 ([14]).
- C8S-6.5 (20): pass after fixes. Keys correct; H3 ([11]); M5, M6 ([17], [19]).
- C8S-6.6 (20): pass after fixes. Keys correct; no HIGH; M5, M6 ([16]).
- C8S-6.7 (20): pass after fixes. Keys correct; H4 ([6]), H7 ([5](a)); M1 ([11]), M10 ([4]).
- C8S-6.8 (22): pass after fixes. Keys correct; H5 ([19]); M2 ([21]), M8 ([6], [13]), M9 ([3]), M10 ([16]).

Overall: load-ready NO. Fix H1-H7 (seven short edits; six fill_blanks and one phrase in a model answer), then the three page cites (M1). The rest can load as is if the owner accepts MEDIUM. Counts: HIGH 7, MEDIUM 10, LOW 6.
