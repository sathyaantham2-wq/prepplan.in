# v3 re-review: class6s ch08 (SST6, fees108), after one fix pass

Pack read: content/authoring/dps/class6s/ch08.json, 128 questions (8.1: 22, 8.2: 21, 8.3: 22, 8.4: 20, 8.5: 21, 8.6: 22).
Compared with the pre-edit copy by exact item content: 65 items changed, 63 unchanged. Every changed item was re-decided and
recomputed; the unchanged ones were checked against the v2 findings. Source pages fees108 pp.125-137 re-read.
Index notation: concept #position in file (0-based, as in v2's Q numbers for the same file order is NOT preserved; slot order changed).

## Machine checks (code, whole file)
- Step marks sum to marks on every item that has steps: 0 mismatches.
- No answer or step names an option by position: 0 hits.
- Correct option is o[0] on every option item (mcq, match, statements, AR), as the pack stores them.
- Correct option strictly longest: 0 of 33 mcq (v2 had 1).
- Stray `rev: true` on 8.2 #9, 8.3 #4, 8.4 #0, 8.5 #19: the loader maps it to `is_reversal_word`, so it is a real field, not a defect.
- No mention of Sahibdin, 1652 or the Fig. 8.6 caption anywhere (v2 scope finding removed).
- Recomputed: 4,635/325 swap (card: 4,635 languages, 25 scripts; swapping language and script gives 25 languages and 4,635 scripts, as the new key says); 1.4/0.18 = 7.8 -> 8; 325/25 = 13; register migrants F3, F4, F5, F6, F8 = 5 (Marathi/Hindi share Devanagari); 3 cereal days (rice, wheat, barley) and 2 millet days (ragi, jowar), cardamom left out; 9 heaps = 3 + 2 + 4; 3 x 3 = 9; 300 + 2026 - 1 = 2,325; 3+2+4+1+2+5 = 17 students, 17 - 5 = 12; Plan A 2 x 1,15,000 = Rs 2,30,000 fits, Plan B 2 x 1,30,000 = Rs 2,60,000 is Rs 10,000 over, 4 + 2 = 6 languages; 2,200 - 500 = 1,700; 12 + 4 + 1 = 17 Mahabharata items (17 vs 9 is 1.89x); 7,000/25 = 280. All keys agree.

## v2 status (finding by finding)
8.1: Q3 explanation (25 languages, 325 scripts) FIXED (#4 now says 25 languages and 4,635 scripts). Attribution recall duplicates reduced (Smith/Tagore/Aurobindo now once as match #14 and once in #15). Sorting item statement 5 replaced, FIXED (small residue, L1). 325/25 repeat now two uses, FIXED. Case study (b)-(d) strawman FIXED: #10 register case has a real evidence-discipline decision with correct step marks 1+1+2. "Four kinds" wording FIXED (#13). Claim check #7 now has a true first half, FIXED.
8.2: "same ingredients" repetition cut from seven to about four; rice-heap duplicate (Q4/Q16) replaced; case study Y/X headline now a tourism-style headline pair (FIXED, but see M6); Q10 bajra/regional-names claim unchanged but the key text now only says "pearl millet = bajra" pairs, acceptable; fill_blank states "named in the text"; Q6 AR now genuinely R-explains.
8.3: Patna museum case rebuilt with a real choice (P vs Q), FIXED; diary case now partly right, FIXED; time-order 3-mark item gone, FIXED; BCE sums reduced to one (#7), FIXED; claim check says "Indian printed cotton", FIXED. Residual easy items in M7.
8.4: partly fixed. Cross-concept items added (#2, #8, #9, #13, #16, #17), State pairings removed (FIXED), key wording "on or around January 14" FIXED, case (a) "work backwards" now says "cold winter morning ... begin their harvest" (the October reading is excluded), FIXED. Repetition only reduced (M3); fill_blank still a giveaway (M2).
8.5: AR Q8 now uses an unrelated true R (7,000 pages), FIXED; Q16/Q18 near-duplicates merged; BCE duplicate removed; Hyderabad case no longer states the criterion as the chapter (but see M5); Kolkata case (d) strawman title replaced by a three-label logic task. 
8.6: Nehru extract item now asks for evidence NOT in the extract (#10), FIXED; district tally case (#5) is a real over-claim decision, FIXED; tourism slogans Y now plausible (#16), FIXED; Sahibdin/Fig. 8.6 scope item removed, FIXED; "about 7,000" wording FIXED.
Chapter-level: slot order now differs in every concept (checked: sequences of types all different), FIXED. Case-study last part: improved but see M6.

## HIGH
None. No wrong key, no second defensible answer, no arithmetic or fact error in any of the 128.

## MEDIUM
M1 (8.3 #6, fill_blank, answer "printed"). The stem states the whole contrast ("added after the cloth was woven") and the answer is the one word the page uses; one-line fact, Apply label is generous, and a machine matcher would reject "painted/stamped/designed". Smallest fix: ask for a count or a combination (e.g. how many of the chapter's three named fabrics times two design methods), or accept a list of variants in the key.
M2 (8.4 #7, fill_blank, answer "names"). "Pongal, Uttarayan and Magh Bihu fall at about the same time and mark the same occasion; what differs is their ___": the stem gives away everything but the word. This is the v2 finding on the old harvest blank, only half fixed (it is still a one-line fact). Fix: make it computed, e.g. the number of festival names on the map that are not Makar/Makara Sankranti variants, or the days between 13 and 15 January.
M3 (8.4, residual repetition). Items still resting on the single sentence "same occasion, mid-January, many names": #0, #1, #3, #4, #5, #7, #10, #11, #12, #15, #18, #19 (12 of 20; v2 had about 17). Three are pure duplicates: #5 (it marks the beginning of harvest), #12 (every -> many) and #15 (true_false "not the only festival"). Fix: replace #12 and #15 with one more cross-concept item (e.g. which of the chapter's four examples has its 'many' arising from time of year vs from language).
M4 (8.4 #10, case study last part). The editor's rule in the stem ("keep the sentence that shows unity in diversity") makes S1 the answer by construction, and the key's reason for dropping S2 ("the opening line already reports it") is equally true of S1 (the opening already says "one festival under many names"). Fix: drop the editor's rule and ask which sentence loses least, or change the key reason to "S1 carries both halves, S2 only the unity".
M5 (8.5 #14, case (d)). "Should the owner choose Plan B anyway?" is decided by the budget arithmetic in (a) and the stem's pay-in-full rule alone; the chapter plays no part (the key itself says it gives neither plan a stronger claim). Fix: add a constraint that makes the chapter decide, e.g. a library that already holds the epics' translations wants a book that shows "one becoming many" beyond India.
M6 (template, case-study last part). Five of the twelve case studies still end in "which headline/label/sentence/title should X choose?" with a rule written into the stem and one obviously weaker option: 8.2 #3 (Y vs X headline), 8.4 #3 (Title Y vs X), 8.5 #4 (Label Z), 8.5 #14, 8.6 #5 (Sentence X vs Y). Parts (a)-(c) are real (counts and corrections) so this is not a strawman failure as in v2; it is a shape repeat. Better models already in the pack: 8.1 #10, 8.3 #15, 8.6 #16. Fix: change two of the five to a repair or ranking last part.
M7 (easy-in-disguise, about 11 of 128, 9%; v2 had 23). Answer is a fact the book states in one line: 8.3 #6, #9, #13, #18; 8.4 #5, #7; 8.5 #1, #2; 8.6 #7, #17, plus unchanged 8.5 #5. Not a template, but the bank allows no easy items. Cheapest fixes: 8.6 #17 (glossary meaning of epic, three obviously non-poem distractors) and 8.5 #2 (Sanskrit, 2,200: number-swap distractors only) - merge each with a computed or two-fact item.
M8 (8.3 repetition). Chintz popularity/ban is the idea of #5, #8, #11, #13, #16, #20 and #21 (7 items); "one dress, many drapes/fabrics" is #3, #9, #10, #12, #15, #17, #18, #19 (8). Limit each to about three; give the freed slots to the Vaishali/relief evidence (rarely used) or the sari-uses (Fig. 8.4 is out of scope, so use the "travellers marvelled" line).

## LOW
L1 8.1 #16 statement 2 ("because the survey covered all States, its figures describe the whole country"): filed as inference; a careful student could file it as beyond (a survey of communities is not the country). Soften to "its figures are not limited to one region".
L2 8.1 #20(a) ('bewildering') is answerable from the stem; #13(c) answer is loose ("diversity strikes any visitor").
L3 8.1 #8 asks which line to quote; four quotations, one the chapter's own; a quote-selection recall but the wrong options are real chapter lines. Fine.
L4 8.2 #7 (figure item) uses the Fig. 8.1 rice labels (basmati, ponni, kollam, sona masuri) that no scope_in line lists. Judgement: acceptable. The figure sits on pp.127-128 inside scope_in item 2's page range, its caption is quoted in the stem, the four labels are described in full in the stem, no key fact goes beyond what the figure shows, and no scope_out line touches it. Optionally add "the Fig. 8.1 rice varieties" to scope_in.
L5 8.2 #3(c) and 8.2 #16(d): the deciding criterion is in the stem (see M6); 8.2 #14 (reverse, 3+3+4) is open-ended but the rubric accepts equivalent questions.
L6 8.4 #3(a) the count is "all 17" (every name is on the map), a trivial count; #1 claim-check is a strawman ("No"), acceptable as one of three No verdicts.
L7 8.5 #1 true_false is True with no real misconception (an accepted True, 3 of 6 are True); #7(a) is trivial counting.
L8 8.6 #16(a) "according to folklores" is copied out of the stem; the key does not use Slogan Y's weakest point (five places the chapter never gives) - add it.
L9 8.6 #18 key "R explains A" rests on an inference the book does not state causally; defensible and the natural reading (folklore is the legends), left as is.
L10 fill_blank answers "8", "9", "280", "printed", "names" are single tokens; numerals and words are matchable, but list "eight/nine" variants if the matcher is exact.

## Counts read
- Reviewed 128; changed items 65 re-decided in full; HIGH 0; MEDIUM 8; LOW 10.
- Types: short_answer 47, mcq 33, long_answer 27, multi_statement 6, fill_blank 6, assertion_reason 6, match 3.
- multi_statement keys: "1 and 3 only", "2 only", "1, 2 and 3", "2 and 3 only", "1 only", "1 and 2 only" (all distinct). AR: R-not-explaining 2, R-explains 2, A-false 1, A-true-R-false 1.
- claim_check verdicts: No 3, Partly right 2, Yes 2. true_false: True 3, False 3.
- Correct option strictly longest: 0 of 33 mcq. Slot order: different in every concept.
- Bloom as labelled: Analyse 64, Evaluate 35, Apply 20, Create 5, Understand 4.

## Verdict per concept
8.1: load-ready. 8.2: load-ready. 8.3: load-ready (M1, M8 advised). 8.4: load-ready (M2-M4 advised; thin source). 8.5: load-ready (M5 advised). 8.6: load-ready (M7 advised).

Overall verdict: load-ready. No HIGH; fix passes introduced no wrong key or second answer. The eight MEDIUMs are quality polish (two giveaway fill-blanks, 8.4 repetition, case-study shape) and are optional before load, recommended first M2, M1, M4.
