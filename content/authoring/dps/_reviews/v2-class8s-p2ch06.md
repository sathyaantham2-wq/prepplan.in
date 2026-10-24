# Review v2: class8s p2ch06 (SST8, Part II ch6, Dynamics of Population, hees206)

File read: content/authoring/dps/class8s/p2ch06.json (8 concepts C8S-6.1..6.8 in Part II, 163 questions, every one read: 21+20+20+20+20+20+20+22).
Scope file: content/authoring/class8s/p2ch06.json. Pages read in full: content/extracted/hees206/pages/001-024 (printed pp. 167-190).
Indices are 0-based within the concept. Every number, percentage, share and case-study part recomputed in python or by hand: all keys and all arithmetic are correct (the only number-adjacent faults are two loose adjectives, M4). a == o[0] for every MCQ/AR/MS/match; step marks sum to marks everywhere; no option is named by position; no scope_out line is violated in substance.

Counts: HIGH 7, MEDIUM 13, LOW 6.
Verdict: NOT load-ready. Pass after fixes. The keys are sound; the HIGHs are five fill_blanks answerable from their own stem, one "name the three" whose count the book does not fix, and a group of items that point at a book table or figure without giving its values.

Counts read: Bloom Analyse 64, Apply 55, Evaluate 21, Understand 18, Create 5, Remember 0 (Analyse/Evaluate/Create 90 = 55.2%, Understand 11.0%). Difficulty Hard 131, Hardest 32, no Easy. Types: short_answer 66, mcq 39, long_answer 32, multi_statement 8, assertion_reason 8, fill_blank 6, match 4 (plus 6 true_false, 10 claim_check tagged inside short_answer). Marks 366.
Option length (39 MCQs): correct option strictly longest 4 (6.7[15], 6.8[1], 6.8[5], 6.8[6]), tied for longest 9, mid-length 25, shortest 1 (6.5[9]). The author's "34 mid" counts the 9 ties as mid; real mid is 25/39 = 64%, so no length tell.
multi_statement keys: "2 and 3 only", "1 and 3 only" x2, "1 and 2 only", "1 only", "3 only", "2 only", "1, 2 and 3": well spread; false statements fall on 1, 2, 3 in turn.
assertion_reason: R-not-explain 2, A true R false 2, R explains 2, A false R true 2: balanced.
claim_check verdicts (10): No 4, Yes 3, Partly right 3. true_false (6): True 3, False 3.
Slot order differs from concept to concept; the chapter is not slot-templated, but two frames repeat (M9).

---------------------------------------------------------------------
## HIGH

H1. C8S-6.3 [3] fill_blank. "A district with 5,00,000 people has a birth rate of 18 per 1,000. The number of live births it records in a year is ___." Key 9000.
Problem: the stem gives the population, the rate and the unit "per 1,000"; the answer is 500 x 18 and needs no chapter fact. Answerable from the stem alone.
Fix: give the births and population and ask for the rate and what it implies; or ask a reasoned term ("a fertility rate of 1.4 means the population is likely to ___") with the 2.1 rule left out of the stem.

H2. C8S-6.4 [5] fill_blank. "Fig. 6.11 gives women's literacy as 55 per cent in Bihar and 83.7 per cent in Delhi. The gap ... is ___." Key 28.7.
Problem: both values are in the stem; pure subtraction.
Fix: do not give the values and ask which state pair breaks the literacy-fertility pattern (word answer), or use a word-answer fill about the relationship the table shows.

H3. C8S-6.5 [11] fill_blank. "A district recorded 40,000 live births. If India's 1950 child mortality of 271 per 1,000 applied ... the number of children who would die before the age of five is ___." Key 10840.
Problem: 40 x 271; the rate and its unit are in the stem. It also repeats 6.5 [0], [12] and [15] (same 271 per 1,000 arithmetic four times in one concept).
Fix: drop it, or make the blank the indicator name for a given "deaths of children under five per 1,000 live births" line, and remove one of the other 271 calculations.

H4. C8S-6.7 [6] fill_blank. "A village has 2,500 males and 2,350 females. Its sex ratio, in females per 1,000 males, is ___." Key 940.
Problem: the definition is handed over in the stem ("females per 1,000 males"); 2350/2500 x 1000. Answerable from the stem alone, and the sex-ratio calculation already appears in [1], [9], [14], [17].
Fix: ask the reverse as a word or number the student must infer ("a ratio of 1,000 means ___ females for every male", or the number of females per 1,000 males when women are 48.5 per cent) or replace.

H5. C8S-6.8 [19] fill_blank. "Fig. 6.17 gives the median age of Japan as 50 years and of India as 28 years. Japan's median age is ___ years higher than India's." Key 22.
Problem: both values are in the stem; a one-step subtraction with no Social Science content. Duplicates [0](a) and [2].
Fix: replace with a reasoned term ("a country with a median age of 50 is likely to need more ___ facilities", key healthcare) or delete.

H6. C8S-6.4 [4] long_answer 5 marks. "(a) Name the three factors the chapter gives and explain in one sentence how each leads to smaller families." Key and rubric: (i) education especially of girls, (ii) formal jobs with later marriage, (iii) urbanisation with a high cost of living.
Problem: p. 175 gives "many factors", then "one important factor" (access to quality education, especially for girls) with the sentence "As women ... get formal education and work in formal jobs, they are more likely to marry later and have fewer children", then "Also ... urbanisation, the cost of living is high". That is two sentences of cause, not a fixed count of three; the scope record itself lists four (girls' education, women in formal jobs, later marriage, urbanisation). A student answering "education, later marriage, urbanisation" is equally correct and loses the step mark, and the book never gives a separate one-sentence mechanism for "formal jobs". The item is also labelled Understand/Hardest and is 4 of 5 marks of page-175 recall.
Fix: ask "Give two factors the chapter names for falling fertility and explain each" (the book supports two clean ones), and make (c) carry more thinking, for example judge the claim "women's literacy alone explains Bihar's 3.0 against Delhi's 1.6" with the table values in the stem.

H7. Figure or table values not in the stem (Question standard: "State what the item needs ... Never 'as in the book'"; the skill allows a figure only when described completely). These cannot be answered on a stand-alone paper, and the first two groups depend on a figure whose extracted text is scrambled:
  - C8S-6.4 [2] (Fig. 6.11, which pair breaks the pattern; no values in stem), [7] ((a) Bihar v Delhi and (b) how many states are below 2.1; no values), [8] (claim test "against the table"; no values), and part (c) of [4].
  - C8S-6.7 [18] (Fig. 6.13: "which group of states has the largest combined share"; no shares in stem). The page text gives the multiset of bar values (16, 9, 9, 8, 6, 6, 6, 5, 5, 4, 3 x5, 2 x3, 1, 1, <1 x15) but the extracted state labels are interleaved by column, so the state-to-value pairing cannot be confirmed from the pages. The author's pairing (UP 16, Maharashtra 9, Bihar 9, West Bengal 8, Kerala 3, and the rest in the scope record) agrees with the real 2011 census rounding for every state, and the key (26 v 23 v 20 v 18) holds on that pairing, but it should be checked once against the printed figure. [2] and [10] of 6.7 also use these five values, but they put them in the stem, so they are safe.
  - C8S-6.8 [0] (Fig. 6.17 median ages of Germany, USA and the others; none in stem).
  - C8S-6.2 [8] (claim test "against Fig. 6.3"; no values in stem) and [9] (uses Fig. 6.5 361, 439, 1020, 1210 without stating them). Fig. 6.3 (144, 140, 33, plus 28, 23, 22, 21, 17, 14, 13 for the others) and Fig. 6.5 (361, 439, 548, 683, 846, 1020, 1210, 1460, strictly rising so the pairing is unambiguous) check out against the pages. Fig. 6.6: Europe 744.3 versus Northern America 387.5 cannot be paired from the extracted text, but 6.2 [0] only adds the two, so the key does not depend on it.
Fix: copy the needed values into each stem (as 6.4 [3], 6.7 [2], [10] already do), or describe the table in words with its numbers.

---------------------------------------------------------------------
## MEDIUM

M1. Thin thinking. Analyse/Evaluate/Create is 55.2% and Understand 11.0% (aim 65%+ A/E/C). There is no Remember, but see M2: the Apply label hides many lookups.

M2. Easy in disguise (one-line page fact, or arithmetic whose data is in the stem, whatever the Bloom label). About 56 of 163 (34%). By concept:
  6.1: [8] (elderly share means healthcare), [11] (which characteristics a business uses, p168 phrase), [15](a) (name the three components), [20] (census every 10 years, stated as 2031 to 2041).
  6.2: [2] (144+140+33), [7] (p170 country list), [11] (tractors is not on the list), [12] (361 to 1460 "about four times", stem has both values), [16](a), [17] (restates the stem), [19] (R obviously false from the numbers).
  6.3: [2] (death rate v child mortality units), [5] (migration), [17] (p173 chain), [19] (which statement mixes two indicators).
  6.4: [0], [4], [10], [13], [19] (all one-line p174/175 matches).
  6.5: [1], [2], [10], [11], [12] (90% from two numbers in stem), [15], [17].
  6.6: [0], [1], [3], [6], [7], [8], [9], [10], [11] (stage descriptions or lists straight from pp. 177-178).
  6.7: [3], [4], [5], [7], [15], [16], [19] (read-off of pyramid shape, reasons, the "pyramid is really a triangle" note).
  6.8: [0], [1], [6], [7] (name the four ashramas), [11], [13], [17], [18], [20].
Fix: keep the strongest of each cluster and replace the rest with scenarios where a premise must be supplied by the student (for example "a country has X and Y; which stage and why are the other two ruled out?").

M3. Ideas repeated more than twice in one concept.
  6.1: "same size, different structure, so size alone cannot decide" in [1], [3], [6], [12], [13], [14], [15], [19] (8 of 21).
  6.3: the 2.1 above/below rule in [0], [4], [9], [10], [11], [13], [15], [18] (8 of 20); [14] and [17] are the same fertility to birth rate to growth chain.
  6.4: China after 2015 still below replacement in [6], [9], [14](b) (3x); India 5.7 to 1.9 fall in [16] and [17].
  6.5: life expectancy is an average, not each person's age, in [3], [4], [7] s3, [9], [14], [17], [18](a)(b) (7x); lower mortality means healthcare and nutrition in [0](d), [10], [15](b), [18](d) (4x).
  6.6: identify the stage from a pair of rates in [0], [7], [9], [10], [11] (5 MCQs) plus natural increase from two rates in [13], [14], [18], [19]; [4](d) and [15] give the same Stage 1 v Stage 2 explanation.
  6.7: reasons for the 1950s narrow triangle in [4](a) and [5]; the shape change in [4](b) and [19]; the three reasons a balanced ratio matters in [8], [9](e), [15]; the 943 = 48.5% check in [1], [13], [17].
  6.8: the 2007/2011/2050 window in [3], [5], [8], [12](c), [15], [18] (6x); "invest in education, skilling and healthcare" in [8](d), [14](c), [16](a), [20] (4x).
Fix: cap each idea at two items and reuse the slots for the missing ones (for example the median-age table in 6.8, Fig. 6.10 fertility trends for Japan/Spain in 6.4 as a described-in-words item, the life-expectancy question of p188 is scope_out so leave out).

M4. Loose wording in a model answer that is arithmetically wrong as a description.
  - C8S-6.2 [0](e): "Europe and Northern America together hold well under a seventh." The computed share is 13.8%, and a seventh is 14.3%, so it is only just under. Fix: "about a seventh" or "under a fifth".
  - C8S-6.7 [10](b): "Four states hold well over two-fifths." 42% is just over 40%. Fix: "about two-fifths".

M5. C8S-6.7 [16] "Using the note on page 182": the DON'T MISS OUT note about the term "population pyramid" is on printed page 181 (beside Fig. 6.15). Fix the page. The question is also a trivia lookup (see M2).

M6. C8S-6.5 [17] true_false: "A life expectancy of 70 years means that on average an Indian can expect to live up to 70, even though some people will live less and some more." This is the book's own sentence turned into a True; there is no misconception to catch, and the reason asked for is a repeat of [3], [14] and [18]. Fix: make it a False item resting on a real slip (for example "a life expectancy of 70 means nobody lives beyond 70") or replace.

M7. Answerable from the stem alone (MCQs). C8S-6.2 [2] (sum 317), [12] (ratio from two stated values); C8S-6.5 [12]. Same fault as H1-H5, but as MCQ distractors they at least test a choice; still no chapter fact is needed. Fix: drop the values and ask the student to read them, or merge with a conceptual option.

M8. multi_statement false statements that are common-sense swaps of two numbers, so they are guessable without the chapter: C8S-6.4 [15] (s2 elderly share "fall from 26 to 14", s3 fertility "rose from 1.9 to 5.7"), C8S-6.5 [7] (s1 child mortality "rose from 28 to 271", s2 life expectancy "fell from 70 to 30"), C8S-6.7 [0] (s1 sex ratio "fell from 943 to 933"), C8S-6.8 [15] (s2 swaps 2007 and 2011; this one is fine because it needs the book). Fix: let the false word hinge on a chapter distinction (for example "above 2.1 the population will certainly grow", "the death rate is the number of under-five deaths per 1,000 live births" as 6.3 [16] does well).

M9. Case studies: repeated frame and strawman decisions. Four items use the same four-part frame "two students/posters/sources/essay: (a) which agrees, (b) name the error, (c) compute a factor or percentage, (d) give reasons": C8S-6.2 [18], 6.4 [14], 6.5 [18], 6.8 [8]. Another six are "two or three towns with illustrative counts: compute shares, compare, decide": 6.1 [3], [6], [19]; 6.3 [7], [15]; 6.7 [9], [14]; 6.8 [14]. In most of these, parts (a)-(c) are arithmetic on figures in the stem and need no chapter fact, and the last part is not a trade-off: 6.1 [19] (the unused beds make the school block the only answer), 6.1 [3](d) (a recall of "healthcare"), 6.7 [14](d) (960 is plainly below 1,000), 6.8 [14](d) (Japan raised the retirement age: "yes"), 6.8 [14](b) (2.6 against 6.2 pensions), 6.8 [8](d) (invest in education).
Fix: vary the frames (an interview, a newspaper table with a trap, a budget with two competing needs), and make the closing part a real choice where each side has support in the data (for example 6.1 [19] with the hospital also nearly full).

M10. Recall in disguise at 4 to 5 marks. C8S-6.7 [4] (Apply/Hardest/5: (a)(b)(c) are the p181-182 narrative), 6.8 [12] ((a)(b)(c) are definition and p184 lists; only (d) thinks), 6.8 [16] ((a)(b)(c) lists from p186; (d) thinks), 6.4 [4] (H6). Fix: keep (d) of each and replace the lookups with data the student must reason on.

M11. C8S-6.2 [5] second defensible reason. "A town's births have stayed the same for twenty years yet its population keeps rising ... suggest one reason". The rubric accepts only improved healthcare / fewer deaths. In-migration (p168, p176) is equally valid and the stem does not rule it out ("using page 169" is the only guide). Fix: add "and nobody has moved in or out" to the stem.

M12. C8S-6.8 [5] (the one inference MCQ the task flagged): acceptable. Key is unique: the stem gives the premise by naming the groups (a child stays in "under 15" for years); option 3 contradicts the stem (births rising after 2007 cannot go with an under-five peak in 2007); options 1 and 2 are false. Only fix: add one clause "a child stays in the under-15 group from birth until her fifteenth birthday" so the premise is stated, since the book does not give the reason. Not a HIGH. Note the key is also strictly the longest option (103 against 97, 90, 86).

M13. C8S-6.2 [15](d) "too high": the answer leans on India's additions slowing, but the student's forecast also holds China's fall at 1.5 crore a year, and the chapter gives China's fertility as 1 (so the fall could speed up, making the forecast of the lead too low). The stem restricts the reasoning to "growth has slowed and India's fertility is below replacement", so the key is defensible, but the rubric should say that China's side is set aside. Also 1.43 bn (a rounded 2022 peak) and 140 crore (2024) are rounded to different precisions, so the 1.5 crore a year is only illustrative; say so in the stem.

---------------------------------------------------------------------
## LOW

L1. C8S-6.1 [0]: "goes beyond the list of information the census collects". The page's list ends "and so on", so "hours of sleep" is a best answer, not a proven non-member. Fix: "Which one is NOT among those the chapter names?"
L2. C8S-6.3 [15](b) asks to rank countries by "strongest likelihood of growth". The book says only above 2.1 grows and below might shrink; a ranking by size of the rate is an inference. Fix: say "rank by how far each is above or below 2.1".
L3. C8S-6.5 [4] assertion_reason: R is the definition and A is a restatement of it; "R explains A" is acceptable but the item tests nothing beyond reading the definition. Fix: make A a claim about a particular number (for example 56 in 1950 against 70 in 2024) that R then explains or fails to explain.
L4. C8S-6.2 [16](b): "called what the United Nations projects and not what has been counted" is garbled; reword "why is 10.3 billion called a projection and not a count?".
L5. fill_blank formats: 6.1 [20] "2041", 6.3 [3] "9000", 6.4 [5] "28.7", 6.5 [11] "10840", 6.7 [6] "940", 6.8 [19] "22". If any survive the rewrite, list accepted forms ("9000", "9,000") or confirm the marker strips commas.
L6. Option-length: C8S-6.8 [1], [5], [6] (3 of the 6 MCQs in that concept have the key strictly longest) and C8S-6.4 [0] (key 124 characters against 86 to 104). Not systematic across the chapter (see counts) but shorten these keys or lengthen distractors.

---------------------------------------------------------------------
## Facts checked against the pages (no finding)

- Fig. 6.3 India 144, China 140, US 33 crore (others 28, 23, 22, 21, 17, 14, 13 present) and Fig. 6.5 India's 8 values are on the pages; the pairing of Fig. 6.5 is forced by monotone growth.
- p174: One-Child Policy 1979, fines or job loss, fertility 7.5 (1963) to 1 (2025), peak 1.43 bn 2022, 1.31 bn 2050, elderly 14% (2023) to 26% (2050), ended 2015 and now up to three children, "Hum do humare do" 1952, India 5.7 (1950) to 1.9 (2025): all correct in the items.
- Fig. 6.11 (Bihar 3.0/55, UP 2.4/66.1, Jharkhand 2.3/61.7, Karnataka 1.7/73.4, Punjab 1.6/79.4, Delhi 1.6/83.7) is a clean table; the "pair that breaks the pattern" in 6.4 [2] (Jharkhand, UP) is unique.
- p176 child mortality 271 to 28, life expectancy 30 to 70; p178 stage descriptions and examples; p180 sex ratio 933, 943, 48.5%; p183 27% under 15, "nearly 65 per cent (15-59)", Fig. 6.17 medians; p184 peaks 2007 and 2011, 2050; p185 pressures; p186 Japan, double burden: all quoted correctly.
- Premises the author states in the stem are all stated: sex ratio 1,000 means equal (6.7 [9], [14]); pensions to 60 and above and paid from taxes of 15 to 59 (6.8 [14]); assume every child under 15 should have a school seat (6.1 [19]); 1 crore = 10 million (6.2 [3]).
- Scope: the working-age band follows the page cited (15-64 in 6.1 [9] from p168; 15-59 in 6.8 [4], [10], [14] from p183). No density, no named theory, no Fig. 6.19 state values, no pyramid bar values, no named Indian scheme, no push/pull classes. 6.5 [19] (migration within the same state) uses only the margin definition.

---------------------------------------------------------------------
## Per-concept verdicts

- C8S-6.1 (21): pass after fixes. Keys correct. Repetition of size-v-structure (M3), 4 lookups (M2), case-study strawmen 6.1 [3], [19] (M9), [20] a one-fact fill disguised as a date sum.
- C8S-6.2 (20): pass after fixes. Keys correct; H7 ([8], [9]), M4 wording in [0](e), M7, M11, M13.
- C8S-6.3 (20): pass after fixes. Keys correct; H1 ([3]); the 2.1 rule used 8 times and [14]/[17] duplicated (M3).
- C8S-6.4 (20): pass after fixes. Keys correct; H2 ([5]), H6 ([4]), H7 ([2], [7], [8]); China-after-2015 three times.
- C8S-6.5 (20): pass after fixes. Keys correct; H3 ([11]); life expectancy 7 times and mortality 4 times (M3); [17] not a real true/false (M6).
- C8S-6.6 (20): pass after fixes. Keys correct; no HIGH. Five stage-reading MCQs plus four natural-increase items, five lookups (M2, M3).
- C8S-6.7 (20): pass after fixes. Keys correct; H4 ([6]), H7 ([18] with the Fig. 6.13 pairing to confirm), M4 ([10](b)), M5 ([16] page), M10 ([4]).
- C8S-6.8 (22): pass after fixes. Keys correct; H5 ([19]), H7 ([0]), M10 ([12], [16]); the under-15/2011 inference [5] is acceptable (M12).

Overall: load-ready NO. Fix the 7 HIGH items first (about 12 items to rewrite or add values to), then trim the repetition and the lookups in M2/M3 and swap in higher-thinking items so that Analyse/Evaluate/Create reaches 65% and the lookups fall below about 15% of the chapter.
