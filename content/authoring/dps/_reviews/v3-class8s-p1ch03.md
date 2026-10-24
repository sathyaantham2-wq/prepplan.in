# Review v3: class8s p1ch03 (SST8, The Rise of the Marathas, hees103)
Pack: content/authoring/dps/class8s/p1ch03.json (129 questions, every one read against pages 61-81 of content/extracted/hees103/pages/). Indices are 0-based "concept.question" in the NEW order (concept 0 = C8S-3.1 ... concept 5 = C8S-3.6). Pre-edit copy compared (72 stems changed or replaced).

## v2 status
- v2 HIGH (3.2 Mughal "largest" / Bijapur "rich"): FIXED. The clause is gone; 1.3 and 1.7 now use only p.65 (Bijapur "maintained merchant ships but did not possess a full-time naval force"; Mughal use of a navy "very limited"; Adil Shahi). No "rich" and no Mughal "largest" anywhere in the pack. The only "largest" hits are p.80's "largest Indian empire before the British" (5.17, 5.19), which is correct.
- v2 3.6 q3 assertion-reason: FIXED as 5.15. A = Tarabai is the architect of the northward expansion (p.77, true); R = the Modi script was the main script for correspondence (p.78, true). R is about a script, A about military strategy; "R does not explain A" is unarguable.
- Anglo-Maratha wars: FIXED. grep for 1782, mural, surrender, "first/second/third Anglo" finds nothing. The six items that mention the wars (3.1, 3.9 line 4, 3.10(c), 3.14, 3.16, 3.19) use only the span 1775-1818 and the book's two reasons (internal disunity; British organisation and technology), consistent with scope_out.
- Chauth/sardeshmukhi: 4.5 (35 per cent) and 4.21 are word-for-word unchanged. 4.7 (a)-(c) unchanged and recomputed (25% of 8,40,000 = 2,10,000; 35% of 14,00,000 = 4,90,000; P 2,94,000 + Q 1,96,000); only (d) was rewritten (fear that paying costs his state; "partly: some provinces joined, only some" matches p.73). All three still state the premise "sardeshmukhi as a further 10 per cent of the same revenue".
- Slot order is no longer one fixed recipe (mark strings differ per concept). Template counts below are fine.

## Format checks (in code)
129 read; a == o[0] on all 52 option items; no duplicate option within an item; no option named by position; every step list sums to its marks; all 6 multi_statement items are three-statement. Marks per concept 45, 48, 46, 50, 51, 47.

## HIGH (1)
- **3.4 q7 (index 3.7), 5-mark centralised vs decentralised.** Stem asks for "two consequences of the change that the chapter itself states". The key gives (1) "Peshwa-led pan-Indian expansion" and (2) "occasional indiscipline and abuse". Only (2) is a stated consequence (p.70: chiefs gaining power "also resulted in occasional indiscipline and abuse"). On p.69 the order is the reverse: "During this rapid expansion, the Marathas themselves underwent a structural transformation", so the book presents the change as happening during the expansion, not as causing it. The key even says "led the expansion during this change". A student who writes the Peshwa's influence over the Chhatrapati has an equal claim to be the second. This is a cause the book does not give (the same fault v2 flagged as MEDIUM, now written into the stem as "the chapter itself states"). Smallest fix: "name one consequence of the change that the chapter states, one thing that happened during the change, and one consequence people assume but the chapter does not state" (keys: indiscipline and abuse; expansion led by Bajirao I and Nanasaheb; decentralisation caused the defeat). Or drop the word "consequences" and the "two stated" step. Everything else in the item is correct.

## MEDIUM
- 3.4 q10 (3.10) case study (a): "Which two entries show the Marathas as a force in the north?" The table has three such entries (the brief hold on Lahore, Attock, Peshawar; Delhi recaptured 1771; Delhi held for three decades), and the key lists four places. A student who names the 1771 recapture and the three-decade hold is right by the stem. Say "Name one entry that shows..." or "which entry shows control beyond Delhi". Also (a), (b), (d) are answerable from the stem's own table; only (c) needs the chapter.
- 3.4 q11 (3.11) fill_blank 1707 - 1682 = 25: both numbers are in the stem, nothing from the chapter is needed. (v2 flagged this frame; one of the two survives.) Replace with a stem that gives only one date and asks for the other event ("The Mughal-Maratha wars ended in ___, the year ...") or an application word answer.
- 3.5 q13 (4.13) fill_blank "more than ___ times" (100 ships / 4 ships = 25): arithmetic on two numbers stated in the stem. Same fault; either drop or ask something that needs p.75 (for example how many ships the ruler of Muscat prepared versus what he feared).
- 3.1 q9 (0.9) 5-mark ordering: "Maratha chiefs' attempts at sovereignty (by the 17th century)" has no start date in the book, so placing it before or after Shivaji's birth (1630) is not decided by the pages (p.64 says only that they proved unsuccessful until he rose). The key requires "chiefs' attempts then birth". Also (b) "which two came after them" is ambiguous (Yadava rule and the Khilji conquest also began after bhakti and Marathi writing), and (c) "political power came last" contradicts the Yadava/Khilji rulers in the same list. Drop the chiefs' attempts from the list or put them last by instruction; rephrase (b) "which two ran through both the Yadava and the Khilji periods".
- 3.3 q11 (2.11) 5-mark: last step "Result: the 1674 coronation" asks what the episodes "together led to by 1674". The book says only "A few years later, in 1674"; it does not say these episodes led to it. Reword "what came a few years later, in 1674" or ask for the cost-benefit sum only.
- 3.3 q16 (2.16) case study: (a) is subtraction of dates in the stem, (b) and (c) are answered by the quoted phrases in the stem ("then ill-defended"; "against the Mughal invasion"). Only (d) needs thought. Hide the quotation from the stem or replace (b)/(c) with a question about Gingee or Rajaram that needs p.69.
- 3.3 q13 and q14 (2.13, 2.14): fill_blank "count of sackings = 2" and true_false "sacked Surat only once" test the same single fact. Keep the true_false; change q13.
- 3.3 repetition: Surat is the subject or a needed premise in 2.0, 2.1, 2.3, 2.6, 2.7, 2.9, 2.11, 2.12, 2.13, 2.14 (ten of 21); Shaista Khan in 2.2, 2.8, 2.9, 2.11, 2.12, 2.15 (six); Agra 2.1, 2.4, 2.7, 2.11, 2.18. Better than v2's Agra count, but Surat is still over-asked. Cut 2.13 and one of 2.12/2.9.
- 3.6 q6 (5.6): the stem frames Tarabai as "the architect ... and not a commander in a single battle". Fig. 3.18 (p.77) is captioned "Tarabai in battle". The book does not say she never fought; the dichotomy is the author's. Reword (b) "what did she do that earns the word architect".
- 3.6 q18 (5.18) fill_blank "Modi": the name is copied from p.78 with the stem giving the definition; v2 flagged this, and the answer is now also in the R of 5.15 (the same pack, "The Modi script, a cursive form of Devanagari"). Replace with a word or number that needs reasoning (for instance which of two scripts a Maratha letter on p.78 would use, with a clue that is not the definition).
- 3.6 q4 (5.4) claim check: stem says "three kinds of evidence"; the steps give verdict + two kinds (3 marks). Say "two kinds" (the key has four available).
- 3.5 q1 (4.1) case study: (a)-(c) are one-paragraph recall (ports' countries, cargo, roads/ferries/bridges), and the guide's statement "nothing was done for travel on land or rivers" is refuted by the very next line of the book (the strawman v2 named in 3.5 q23). The verdict "partly right" is the key, but "wrong" (the claim that matters is false) is arguable. Make the guide's claim partly true in a way that needs the book (for example "Shivaji's ships went to Muscat, so his own officials never traded by land").
- Recall in disguise (answer is one stated line, stem nearly gives it; the bank allows no easy items): 1.1 (Shahji served sultans), 1.4 (two aims), 1.7 (why the navy was revolutionary, near-copy of p.65), 1.12, 1.17 (cause of hardship), 2.10, 2.12, 2.20, 3.18(a) (whose sons, from the Fig. 3.10 caption), 3.21 (Peshwa is a prime minister), 3.6, 3.8(a), 4.0, 4.8, 4.9, 4.11, 4.23, 5.10 (name the work), 5.12 (free treatment), 5.8, 5.9. For the one-mark items make a distractor a real near-miss; for the two-markers add a "why/what follows" step that needs more than the line.
- Case studies whose parts do not climb ((a)-(c) are recall from one paragraph, (d) restates them): 1.3, 2.0, 4.1, 5.7, and 5.3 where (b) is a quotation read off the stem ("for the welfare of the people") and (d) has an obvious answer.

## LOW
- 3.1 q7 (0.7) fill_blank "17th": century conversion of 1630 with 1630 in the stem; nothing from the chapter. Accept "17th"/"seventeenth"/"17th century" in the key.
- 3.1 q4 (0.4): the definition is in the stem; the item is a restatement.
- 3.1 q8 (0.8) and q19 (0.19) test the same fact (language of the masses); q13/q17 also use "cultural foundation" (four items use it: 0.6, 0.15, 0.16, 0.17).
- 3.1 q14 (0.14) Scene X (follows every step exactly) is again a built-to-lose scene.
- 3.1 q17 (0.17) (d) "predict ... if no leader had risen" is the author's inference, not a decision; key says "probably", fine.
- 3.2 q0 (1.0) fill_blank "before or after": a two-choice guess; ask for the year gap (11) instead.
- 3.2 q7 (1.7) step 3 says "neither neighbour had done" a navy; the book says the Mughals had a limited navy. Say "neither kept a full-time naval force to protect the coast".
- 3.2 q8 (1.8) (d): "announced a day earlier" can be read as applying to both offers; the key reasons as if only the plain fight was announced. Attach it to the plain offer only.
- 3.2 q9 (1.9) (a): "two features" of the meeting place; the book gives the foot of the fort and thick forests, with the mountains as the hiding place of the Marathas. The key lists three; accept any two.
- 3.2 q12 (1.12), q13 (1.13), q14 (1.14, R trivially restates A): easy one-liners.
- 3.2 q18 (1.18): "what it gave him" at step 1 (character and base) is inference.
- 3.3 q3 (2.3): the option "It aimed at punishing every citizen of Surat equally" is the only real distractor; the other two are absurd.
- 3.3 q15 (2.15): definition in the stem; the item is easy.
- 3.3 q17 (2.17): True item, thin misconception (restates p.68).
- 3.3 q19 (2.19): "somewhere to retreat to" (Gingee is not tied to the dakshina-digvijaya by the book; the stem asks for the chapter's line, so acceptable).
- 3.4 q1 (3.1): the key's "Hyder Ali and the Nizam were part of the anti-British alliance" is what the book says; do not let a marker demand that the British fought them.
- 3.4 q2 (3.2): "which development made this true" is the author's causal reading of p.69's order; only one option is defensible.
- 3.4 q4 (3.4): the first reason is in the stem.
- 3.4 q9 (3.9) line 2 uses "1707" as the death year; p.62's timeline gives 1707 only as the end of the Mughal-Maratha wars. Key does not depend on it. Parts (a)-(c) share one "correct this line" frame; Reading X is a strawman.
- 3.4 q18 (3.18): "A painting shows" is an assumption (Fig. 3.10 is a captioned image).
- 3.4 q19 (3.19): retelling in phases; fine for 5 marks. q20 (3.20) fill_blank "decentralised" is nearly given by the stem; accept "decentralized".
- 3.4 q17 (3.17) all three true, no trap.
- 3.5 q0 (4.0) "In the 1780s" and 4.23 "In 1700" and 5.2 "1670s": dates invented for the scenario and not in the book. Harmless; say "in the 18th century".
- 3.5 q15 (4.15) o3 ("equal numbers each year") is an absurd distractor; 4.20 (True: appeal to a chief) thin; 4.17 (match, Sachiv/Mantri/Nyayadhish/Sumant) is name memory (reads consistently with Fig. 3.13).
- 3.5 q16 (4.16): the "direct answer to European sea power" link is the author's reading; stem asks "how does it relate" so acceptable. p.61 (Amatya epigraph) should be added to scope_in.
- 3.6 q2 (5.2) o3 relies on outside knowledge (Persian was the Mughal court language); fine.
- 3.6 q16 (5.16): True item built to be true; q19 (5.19) item (i) rebuilding temples is evidence of revival, not of "without discrimination"; say "revival of local traditions".
- Several MCQs have options tied for longest with the key (0.3, 2.18); all others are even. Correct option is strictly longest only in the three assertion-reason items where the fixed option text forces it. Fine.
- Scope: pp.61, 73 (coin removed), 76-78 are used without scope_in entries for 61 (epigraph); add as the author proposed. No scope_out line is broken.

## Template counts
- Types: short_answer 49, mcq 26, long_answer 27, fill_blank 9, assertion_reason 7, multi_statement 6, match 5. Bloom: Analyse 68, Apply 31, Evaluate 20, Understand 6, Create 4. All Hard (104) or Hardest (25).
- multi_statement keys: "1 and 3 only", "2 and 3 only", "1 only", "1, 2 and 3", "1 and 2 only", "2 only" (six different).
- Assertion-reason outcomes (7): R explains A 2, R does not explain A 3 (0.10, 4.4, 5.15), A true R false 1 (2.4), A false R true 1 (3.5). Good spread.
- claim_check verdicts (9): No 4, Yes 2, Partly right 3. true_false (8): False 5, True 3.
- Slot order differs by concept; no fixed recipe.
- Frames: "text with planted mistakes, correct each" now only 3.9; "illustrative figures" case studies 0.2, 4.7 only; date-subtraction fill_blanks 3.11 and 4.13 only (down from eight).

## Per-concept status
- C8S-3.1: pass after fixes (0.9 ordering ambiguity; recall items)
- C8S-3.2: pass (v2 HIGH fixed; recall items and LOWs only)
- C8S-3.3: pass after fixes (2.11 causal step, 2.16 stem-answerable, Surat repetition)
- C8S-3.4: NOT pass until 3.7 is fixed (HIGH); 3.10 and 3.11 MEDIUM
- C8S-3.5: pass after fixes (4.13 arithmetic, 4.1 strawman, recall)
- C8S-3.6: pass after fixes (5.6 figure contradiction, 5.18 recall/leak)

## Counts
HIGH 1, MEDIUM 15 (3.1: 1, 3.3: 6, 3.4: 2, 3.5: 3 incl. the two aggregates, 3.6: 3 ... aggregates counted once), LOW about 35.
Keys: no wrong key and no second defensible answer in any MCQ, statement set, match or assertion-reason. Facts, dates and arithmetic all agree with the pages (recomputed: 54.9%, 7.5, 11 years, 3 years, 25, 25, 35, 2,10,000, 4,90,000, 2,94,000 + 1,96,000, 1801).

## Verdict
NOT load-ready as it stands: one HIGH (3.4 q7, a stated "consequence" the book does not give). With that item fixed (a one-sentence change to the stem and the key) only MEDIUM and LOW findings remain, none of which is a wrong key or a second answer; the pack can then be loaded, with the MEDIUM list as optional polish.
