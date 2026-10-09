# Review: DPS bank, Class 7 Social Science, Part I ch 5 "The Rise of Empires" (gees105)

File reviewed: `content/authoring/dps/class7s/p1ch05.json` (8 concepts C7S-5.1 to 5.8, 165 questions).
Checked against: textbook pages `content/extracted/gees105/pages/001-034.txt`, scope record `content/authoring/class7s/p1ch05.json`, `docs/QUESTION_STANDARD.md` (sections 4, 7, 9, 10, 11), DPS Class 7 Social references (objective worksheet and subjective worksheet).

Method: all 165 read in full. Every key recomputed before looking at the answer; every number recomputed in Python (all case-study arithmetic correct); every date, name and term checked against the page text. Key = first option (`o[0]`), as the loader shuffles.

## Headline

- Wrong keys / second correct option / arithmetic / fact errors: **0 HIGH**.
- scope_out ("Map exercises on empire boundaries") is not violated; no map or figure item.
- No option letter named in any answer. No DPS item copied (DPS topics Shungas, Satavahanas, Hydaspes, Dhamma principles are not touched).
- Level mix: Remember+Understand 92/165 = 56% (limit 60%); Analyse+Evaluate+Create 57/165 = 34.5% (min 15%). Types present: mcq 48, scenario mcq 16 (inside), MS 8, AR 8, match 5 (5.2, 5.4, 5.7 have none; 5 of 8 concepts = fine for "one per two concepts"), 2-mark 40, 3-mark 24 (claim, impossible, reverse all present), 5-mark 16, case studies 16.
- The weaknesses are of craft, not correctness: free marks inside case studies, a skeleton-templated chapter, repeated facts, all-"No" claim-checks, correct MCQ option often the longest.

## MEDIUM findings (fix before relying on the chapter)

M1. **Case-study parts answered in the stem / not needing the chapter** (QUESTION_STANDARD section 11).
- C7S-5.4 #20 "Alexander died in Babylon in 323 BCE at 32. Messengers carry the news to a satrap named Meher..." Part (b) "What did the generals and satraps do after his death?" is printed in the stem ("The generals and satraps are already dividing the empire..."). Part (a) "In which year was Alexander born" is pure 323+32 from the stem. Fix: delete the sentence about dividing the empire from the stem; make (a) a chapter question (e.g. "what did Alexander's empire span at its height") and keep birth year as a later computation.
- C7S-5.5 #21 "...lost book written by a Greek diplomat... Only passages quoted by later scholars survive." Part (b) "Why can the full book not be read today?" is answered in the stem. Fix: remove "Only passages quoted by later scholars survive" from the stem.
- C7S-5.4 #19 part (b) (ages 21 and 28) and #20 part (a) (birth year) are the same 323+32=355 computation, from stem data only. Keep it once.
- C7S-5.7 #20 part (b) offers both phrases ('completely' or 'to the greatest extent possible') in the question: a coin-flip. Ask "In what words does the chapter describe how far Ashoka followed peace?" Part (a) "What did Ashoka give up" is guessable from the stem ("turned to peace").
- Systemic: in about 14 of 16 case studies part (b) (and often (c)) is arithmetic on numbers the stem supplies (5.1 #20 b, #21 b; 5.2 #19 b,c, #20 b,c; 5.3 #20 b, #21 b; 5.4 #19 b; 5.5 #20 b; 5.6 #20 b, #21 b; 5.7 #19 b; 5.8 #20 b, #21 b,c). A student who skipped the chapter still earns these. The arithmetic is correct and nicely realistic, but section 11 asks each part to need the chapter. Smallest fix: make the number a chapter fact (e.g. 5.7 #19 (b) use the book's 268-232 and the edict's five-year interval as the chapter-sourced inputs, which it half does), or turn one of (b)/(c) per case into a "why does this figure matter, using the chapter" part.

M2. **Case-study template.** All 16 case studies are 4 parts at 1+1+1+1 and follow one frame: (a) recall a chapter term/fact, (b) arithmetic on stem numbers, (c) another recall, (d) "Either choice with reasons" decision. The decision key is "Either, with reasons" in every one, so any reasoned answer earns the mark and the grading is soft. Fix: vary at least four of them (a 1+1+2 split; a source-reading case, e.g. quote the book's Gymnosophist exchange or Kautilya's "happiness of subjects" line and ask what it shows; one case with no arithmetic), and give (d) a keyed expectation of what a good answer must cite.

M3. **Claim-checks all have the verdict "No" and most are negations of a sentence in the book** (5.1 #15 Kabir, 5.2 #14 Anita, 5.3 #15 Rahul, 5.4 #14 Isha, 5.5 #15 Mohan, 5.6 #15 Rohit, 5.7 #14 Priya, 5.8 #15 Dev). Eight of eight disagree, six hinge on "only/all alone/must/every", so a student learns "claim with an absolute = disagree". Standard wants claims either subtly wrong or right for a limited case. Fix: make two correct or qualified, e.g. 5.2: "Guilds made their own rules and the king did not interfere. Is that fully true?" (agree, with the limit that the text says the king 'was not to interfere'); 5.4: "Alexander's Indian campaign had limited political impact but opened Indo-Greek contact" (agree).

M4. **Near-duplicate setups between a scenario MCQ and a case study in the same concept.**
- 5.1 #5 (king defeats three neighbouring kingdoms, rulers keep their lands and send grain and elephants) vs 5.1 #20 (Veerapur: three defeated kings keep their land and send grain and elephants). #20(a) is #5 again, and #5's stem gives away #20(a).
- 5.2 #5 (weaver, spice seller, moneylender form a body, vote a head, appoint two officers, own rules) vs 5.2 #19 (40 weavers, 25 spice traders, 15 moneylenders, elected head and two officers). #19(a) = #5.
Fix: change the setting of one of each pair (e.g. 5.2 #19 can be cartwrights and potters; 5.1 #20 can ask about a different feature than tribute).

M5. **Same fact tested many times within a concept** (wastes grid slots; standard: do not repeat the same question with different wording).
- 5.1: title vocabulary (samraj/adhiraja/rajadhiraja/imperium) in #1, #4, #9, plus #7 S3; tributary defined in #2 and #10(a).
- 5.2: guild defined in #1, #5, #9(a), #14, #19(a); army costs in #6, #11, #17, #20(a).
- 5.3: the iron plough, surplus, crafts chain in #5, #10(b), #13, #16, #17, #18, #20 (7 of 21). Dhana Nanda unpopular in #4, #7, #9, #15, #19, #21(c).
- 5.4: Porus "Like a King" in #2, #10(b), #19(a); Gymnosophists in #4, #13, #18.
- 5.5: Indika in #3, #6, #8, #9, #12, #16, #21 (seven); 325-321=4 years in #14 and #20(b).
- 5.6: embankment/bridges reward in #6, #14, #19, #20; saptanga parts in #2, #3, #5, #9, #11, #16, #18.
- 5.7: Prakrit/Brahmi in #1, #5, #11, #17; 268-232 in #9 and #19.
- 5.8: Sarnath capital in #1, #7, #9, #18.
Fix: replace one or two items per concept with an uncovered scope_in point (examples not tested anywhere: trade routes Uttarapatha/Dakshinapatha, Sanchi stupa as Mauryan architecture beyond the anda, Dhauli elephant edict, the sixteen mahajanapadas link, "Alexander's soldiers' reasons" as a compare-and-decide).

M6. **Correct MCQ option is the longest in 17 of 48 MCQs (35%, chance is 25%), several by a wide margin**; Q11 of the standard says make options the same length. Worst: 5.7 #2 (36 vs 19/11/13 characters), 5.7 #5 (73 vs 58/61/61), 5.5 #2 ("Takshashila (Taxila)" 20 vs 11/7/6), 5.4 #6 (69 vs 61/57/53), 5.6 #3 (52 vs 45/45/29), 5.3 #4 (59 vs 54/48/46), 5.3 #3 (41 vs 34/38/39), 5.8 #3 (40 vs 35/27/31), 5.8 #1 area fine. Also marginal: 5.3 #5, #6; 5.4 #4; 5.6 #4; 5.7 #4, #6. Fix: pad the distractors with the book's own look-alike phrases (e.g. 5.7 #2 'Beloved of the Gods, the first word of his name' is already the right trap; lengthen 'Lord of all' to 'Lord of all, the title samraj').

M7. **Assertion-reason 5.6 #8 is arguable.** A "Kautilya detailed laws against corruption." R "The Arthashastra gave directives on defence, justice, urban planning, agriculture and the people's welfare." Key says R is true but does not explain A. But the book's R list includes justice and administration, which is where corruption laws sit, so a student can defensibly choose "R explains A". Fix: use a clearly unrelated true R, e.g. "The saptanga lists seven parts of a kingdom" or "Kautilya taught at Takshashila".

M8. **Skeleton templating.** Every concept has the identical slot order: MCQ 1-2 plain, 3 or 4 a "NOT" item (all eight concepts), 5-6 scenario, 7 multi_statement, 8 assertion_reason, 9 match, then 2-mark (a)/(b) items, a claim-check at 15, reverse/impossible at 16, two 5-marks, two case studies at the end. Wording inside items varies (this is not a noun-swap chapter), but the claim-check frame ("X says '...'. Do you agree? Give reasons."), the "'quote'. Justify/Evaluate" five-markers and the case-study frame repeat. Fix: reorder, drop the "NOT" item in 2-3 concepts for a different reasoning move, vary the claim-check shape (e.g. "Which of these two pupils is right and why").

M9. **Items that reuse the book's own examples nearly verbatim** (section 1: change the setting, raise the level).
- 5.1 #14 and #21: the Pataliputra story (moat, drawbridge, market; "two months on horseback") retold without change of setting.
- 5.4 #5: book's satrap definition ("significant power and freedom despite being mere officials") almost word for word; also stray words "Before moving on," in the stem.
- 5.6 #6/#14/#20(a): the book's embankments/road-bridges reward lines; 5.6 #17 is the book's end-of-chapter Q5 ("Which of these can you observe even today"); 5.6 #13 asks to quote the book's line.
- 5.7 #6 is the book's THINK ABOUT IT ("Why do you think he admitted this war?"); 5.7 #16 paraphrases the book's printed edict; 5.7 #18 is the book's end-of-chapter Q7 with one extra fact.
- 5.8 #5 is the fire-vessel sentence with a stem that gives it away ("wooden... two storeys").
Fix: change the setting (a different city, a made-up guild, a different bridge) or remove the leading detail from the stem.

M10. **A few statements go beyond what this book says** (section 11).
- 5.1 #18 answer: art and learning "builds loyalty". Book only lists it as a feature. Drop "builds loyalty".
- 5.4 #3 and answer text: Alexander's wound counted as a reason for the retreat. Book narrates the wound but names resistance, tired soldiers and their refusal as why he turned back. Replace distractor "wounded" with something the book clearly does not say, or reword stem to "which of these is NOT mentioned in the account of the campaign".
- 5.4 #12 (b) marks a "reasoned guess"; the book asks the reader to guess, gives no answer. Mark any sensible reason, and say so in the step.
- 5.3 #20: "the local chief gets the extra grain" is invented; state it as a plain assumption ("assume the chief collects the extra").
- 5.4 #19 part (d): the decision is near-forced, because the stem says the soldiers refused to go on and the chapter only records what happened when he turned back. Make it a real trade-off (e.g. add a second option such as "wait for supplies at the Beas" with consequences the learner must weigh) or reframe as "was the retreat the best option? Give two chapter reasons".

M11. **Weak or invented distractors (section 4).**
- 5.3 #4 B/C/D ("no army at all", "land without iron ore or rivers") contradict the chapter outright but are not real student confusions; better: "He was defeated by Alexander", "He lost his iron mines to the Greeks".
- 5.2 #6 D "Stop paying officers and use tribute grain alone" and 5.6 #6 C/D ("closing the town markets") are invented.
- 5.5 #5 B/C and 5.7 #6 B/C/D are throwaway ("forced to give up his throne", "conquer southern kingdoms next").
- 5.8 #6 and 5.4 #6: every wrong option carries an absolute (always, only, never, can never, alone) and the right one does not, so absolute-word = wrong. Make one wrong option qualified ("usually") and one true statement absolute where genuinely true (e.g. the definition "Dharma is duty, law, truth, order and ethics").

## LOW findings

L1. `rev` missing: 5.4 #15 and 5.8 #16 turn on "this cannot be right" (short answer, tag show_impossible) but carry no `"rev": true`. (Other hits from a text scan were false positives inside option text.)
L2. multi_statement keyed options with a single number are a visible odd-one-out: 5.4 #7 (key "1 only", other options "1 and 2 only" etc.) and 5.5 #7 (key "3 only"); 5.7 #7 key "1, 2 and 3" is also the only different-length option. Repeated key: "2 and 3 only" in both 5.1 #7 and 5.8 #7. Three consecutive items (5.4, 5.5, 5.6) have two false statements. Spread the keys: use "1 and 3 only" / "2 only" in a few more and make the 'false' statements less flagrantly invented (5.8 #7 S1 "written in Sanskrit and records Ashoka's war in Kalinga" is absurd on its face; 5.3 #7 S3 "popular because he shared his wealth").
L3. 2-mark (a)/(b) items that are two recalls (5.1 #10, 5.2 #13, 5.3 #11/#12, 5.5 #10, 5.6 #10/#14, 5.7 #13/#14, 5.8 #11/#14): section 11 wants (b) to use (a). Where (b) can be a consequence ("so what did a tributary gain?" is already one; "why did the Ganga and Son help income?" is also fine) keep; elsewhere convert (b) to a reason.
L4. Generic step names that do not say what earns the mark: 5.1 #17 and 5.7 #16 ("First/Second/Third feature/instruction explained"), 5.8 #12 ("First feature"), 5.2 #11 ("First cost named"). Name the expected content ("army: feeding/paying soldiers" etc.).
L5. 5.7 #19 stem grammar: "An Ashokan edict, reigned 268-232 BCE, tells city magistrates..." Should read "Ashoka (reigned 268-232 BCE) issued an edict telling..."; and 5.1 #20 part (d) mentions "the minister" who is not in the stem (only the treasurer is).
L6. 5.3 #20 "about 7 craftsman families": extra grain is 20 x 15 = 300 sacks; at 38 sacks a family that is 7.9. "About 7" is defensible (7 whole families) but say "about 8" or state a per-family need.
L7. Dates used as facts but only implied by the book: "died in 323 BCE" (the book gives a box "324-323 BCE" for Alexander in Persia and says he died at 32; 5.4 #15, #19, #20 rest on 323). Safe for the impossible-claim in #15 (322 is after any value in the range), but #19 and #20 compute birth year from it. Add "(the chapter's timeline box ends 323 BCE)" or avoid exact birth-year arithmetic.
L8. Two-statement/three-statement: all 8 multi_statement items use 3 statements, consistent with section 3 for Social Science; no inconsistency inside the chapter.

## Fact check summary (all against gees105)

Verified correct: imperium/supreme power (p.87); samraj/adhiraja/rajadhiraja meanings; guild as shreni with elected head and executive officers, autonomy, "Cultivators, traders, herdsmen, moneylenders and artisans" quote (p.91-93); Magadha 6th-4th c. BCE, Ajatashatru, Buddha and Mahavira, iron ploughs, Ganga and Son (p.93-95); Mahapadma Nanda 5th c. BCE with coins, Dhana Nanda rich but unpopular, Panini and 3,996 sutras (p.95); Alexander 334-331, 327-325, 324-323 BCE, Porus "Like a King", satrap, died at 32 in Babylon, Gymnosophists and the two quoted answers (p.96-98); Maurya Empire around 321 BCE, Kautilya/Chanakya/Vishnugupta at Takshashila, Megasthenes and Indika lost except excerpts (p.98-101); Arthashastra, seven saptanga terms and meanings, "happiness of his subjects", countryside, embankments, road bridges (p.101-103); Ashoka 268-232 BCE, grandson, Kalinga/Odisha, Prakrit and Brahmi, Devanampiya Piyadasi meanings, medical care, rest houses and wells, fruit and shade trees, tour every five years, no one imprisoned without good reason (p.104-107); Sohagaura plate granary, two crops a year, wooden houses up to two storeys, water vessels for fire, Sarnath capital four lions/four animals/dharmachakra, motto from Mundaka Upanishad, anda and pradakshina, Dhauli elephant, "half a century after Ashoka's death", 185 BCE (p.108-113).
Arithmetic verified in Python: 1800 sacks/90 elephants; 1800 km; 80 members, 30%, two-thirds; 13,50,000 + 3,60,000 = 17,10,000, tax 7,20,000, shortfall 9,90,000; 100 and 400 sacks; 80-179 years; 355 BCE, ages 21 and 28; 4 and 53 years; 40 quintals; 7.5% and 37; 36 years and 7 tours; 36 years, 47 years; 7200, 4800, 2400, 6000; 67,500 and 22,500, 90,000 at 60 days.

## Per-concept verdict

- C7S-5.1 (21 q): sound keys; fix M4 (#5 vs #20), M1 (#20/#21 arithmetic), M5 (title vocabulary x3), M9 (#14, #21), M10 (#18 "builds loyalty").
- C7S-5.2 (20 q): sound keys; fix M4 (#5 vs #19), M6 (#4/#5 marginal), L3; case studies #19/#20 are good trade-offs once part (a) differs.
- C7S-5.3 (21 q): sound keys; heavy repetition of the iron-surplus-crafts chain (M5); M6 (#3, #4 correct longest); M11 (#4 distractors); L6.
- C7S-5.4 (20 q): sound keys; M1 (#20 b printed in stem, #19/#20 duplicate computation), M10 (#3 wound, #19(d) forced), M3, M6 (#6), L1, L7.
- C7S-5.5 (21 q): sound keys; M1 (#21 b printed in stem), M5 (Indika x7), M6 (#2), L2 (#7 odd-one-out key), duplicate 4-year computation (#14, #20).
- C7S-5.6 (21 q): sound keys; M7 (#8 arguable AR), M9 (#6/#17/#13), M6 (#3, #4), M5 (embankment x4).
- C7S-5.7 (20 q): sound keys; M1 (#20 a,b), M6 (#2, #5 clearly longest), M9 (#6, #16, #18 reuse book), M11 (#6 distractors).
- C7S-5.8 (21 q): sound keys; best-balanced concept; fix M11 (#6 absolutes), M6 (#3), L1 (#16), M9 (#5), L2 (same MS key as 5.1).

## Count read

165 of 165 questions read in full (no sampling): 48 mcq, 8 multi_statement, 8 assertion_reason, 5 match, 40 two-mark, 24 three-mark, 16 five-mark and 16 case studies; all case-study parts (a)-(d) recomputed in order.

## Overall verdict

Content is accurate and in scope (0 HIGH). It meets the DPS shape (claim-checks, impossible, reverse, case studies, AR, match are all present, and the level mix passes) but is skeleton-templated and carries free marks inside several case studies, all-"No" claim-checks and a longest-correct MCQ bias. Acceptable to load after M1, M3, M4, M7 and the worst M6 items are fixed; M2, M5, M8-M11 are quality upgrades.
