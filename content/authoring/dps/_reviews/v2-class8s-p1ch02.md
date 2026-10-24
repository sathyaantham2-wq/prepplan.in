# Review: Class 8 Social Science (SST8), Part I ch 2, "Reshaping India's Political Map" (hees102)

Pack read: content/authoring/dps/class8s/p1ch02.json, all 187 questions in 9 concepts (C8S-2.1 to 2.9), no sampling.
Pages: content/extracted/hees102/pages/001-040 (printed pp. 21-60), read in full. Scope: content/authoring/class8s/p1ch02.json (scope_in / scope_out).
Method: each key decided before reading it, every date gap and sum recomputed in python, every fact, date and cause checked against the page text. Indices are 0-based within the concept. Fixes are given inside each finding; the "Working notes per concept" section below carries the detail for every item.

## Verdict: NOT load-ready. Pass after fixes.
Keys are clean: 1 HIGH only (a numeric part with several defensible answers). Hard format checks are clean (correct option at o[0] and `a` equals o[0] on all 43 MCQ; no duplicate options; step marks sum to marks on every item that has steps; no option named by position; no item reads a map or figure; scope_out is respected). What fails the standard is **repetition, templating and recall-in-disguise**: the 8/5/3/2/2 profile and the slot order repeat in all nine concepts, 18 case studies share one frame (7 use a "correct this faulty blog/brochure/caption" frame, 6 end in a strawman), and about 42 of 187 items are one-line page lookups carrying a Hard/Analyse label. The chapter needs a fix pass and a second review.

## Counts
Read 187. HIGH 1. MEDIUM 39. LOW 29.

Template check with counts (not impressions)
- Mark profile per concept: 1-mark 8-9, 2-mark 5-6, 3-mark 3-4, 4-mark exactly 2, 5-mark exactly 2, in all 9 concepts. Case studies = 2 per concept, 5-markers = 2 per concept.
- Slot order: the two 5-mark long answers come back to back and are followed by the case study ("L5 L5 CS4") at the same position (index 17-19 of 20, or 18-20 of 21) in 7 of 9 concepts (2.2, 2.3, 2.4, 2.5, 2.7, 2.8, 2.9); 2.6 has L5 L5 at 17-18 then a match and the case study; 2.1 has them at 11 and 19. Every concept holds exactly one assertion_reason, one multi_statement, 0-1 fill_blank (7 of 9), one match (7 of 9) and one true_false (8 of 9).
- Case studies (18): (a)-(c) are recall, (d) is "a student/visitor/designer says X; judge or correct it" in at least 13 of 18. "Correct the faulty text" frame: C8S-2.1 [5], 2.3 [19], 2.4 [20], 2.7 [19] in full; 2.5 [18], 2.6 [7], 2.8 [0] as the last part. Strawman last parts: 2.1 [16], 2.2 [0], 2.2 [19], 2.5 [18], 2.6 [20], 2.8 [0].
- Claim-check verdicts (11): No 5, Yes 3, Partly right 3. Acceptable mix (45/27/27). But 2.3 holds only "Yes" and 2.8 only "Yes" for claims.
- multi_statement keys (9): "2 and 3 only" x2, "1 and 3 only" x2, "1 only", "2 only", "3 only", "1 and 2 only", "1, 2 and 3". Well spread; false statement falls on 1, 2 or 3. No problem.
- assertion_reason (9): R explains A x3, R true but not explaining x3, A true R false x2, A false R true x1. All four outcomes used. The "explains" items (2.2 [5], 2.4 [0], 2.7 [4]) are one book sentence split into A and R: recall.
- true_false (8): True 4, False 4. The four True items are compound true statements with no misconception (see LOW).
- Correct MCQ option is never the longest (0 of 43) and is the shortest in 25 of 43 (average 45 vs 49 characters for the longest wrong option): a reverse length tell (LOW).
- Bloom as labelled: Analyse 96, Evaluate 49, Apply 29, Understand 9, Create 4 (Analyse/Evaluate/Create 80%, Understand 5%); difficulty is Hard or Hardest on every item. The loader will accept it; the labels overstate the thinking (see MEDIUM 3).

Judgements asked for
- Humayun/Himu order on p.37: C8S-2.5 [9] ("a Suri commander's brief rule before Akbar retook Delhi") is supported by the page: Himu "captured Delhi and ruled it briefly" and "Akbar soon reclaimed Delhi for the Mughals". It is not supported that Himu's rule came AFTER Humayun's reconquest: the page says Himu's rule happened "Before this happened" (before Humayun reconquered the lost ground) and the page's own chronology is loose. So [9] is fine; [17] step 4 ("Humayun soon reconquered...; meanwhile Himu...") is the item to soften (MEDIUM 23).
- Open-ended keys: hill-fort pros/cons (C8S-2.3 [15]) is acceptable because the key states its marking points (two advantages, one drawback, each reasoned); the drawback is the author's inference and must not be a fixed answer. "Uniting 75 chieftains": part (b) of C8S-2.3 [6] is acceptable (any reasoned difficulty, with examples), but part (a), the count, is HIGH.

## HIGH (1)
H1. C8S-2.3 [6](a): "How many chieftains, at the least, made up the Musunuri confederacy, counting the Musunuri Nayakas themselves as one?" Key "More than 76". The page (p.29) says the Nayakas "rallied over 75 more chieftains", and its own question speaks of "75 leaders"; "the Musunuri Nayakas" is a plural group, so "count them as one" is arbitrary. 75, 76, 77 and "more than 76" are all defensible and none is machine-markable. Smallest fix: delete (a), or ask "How many chieftains did the Nayakas rally besides themselves?" with key "over 75", and keep (b).

## MEDIUM (39)
Chapter level
1. Templated mark profile and slot order (counts above). Vary marks per concept (for example 7/6/4/2/2 in some, one concept with three case studies, 5-mark items not adjacent) and change the position and type of the special slots.
2. Case-study frame repeated in 18 case studies, 7 "correct the faulty text", 6 strawman endings. Keep at most one correction case study in the chapter; end each case study in a decision where the data supports two answers.
3. About 42 items are one-line page lookups labelled Analyse or Evaluate and "Hard": C8S-2.1 [3], [18]; 2.2 [5], [8], [11], [14], [16], [20]; 2.3 [0], [1](a), [7], [9], [10], [12], [16]; 2.4 [0], [6], [12], [16]; 2.5 [2], [7], [8], [19]; 2.6 [9], [13], [16], [19]; 2.7 [1], [2], [4], [11], [12]; 2.8 [4], [8], [13]; 2.9 [1], [7], [10], [13], [16], [17], [22]. Rewrite each as application (a new situation, a claim to test, a short chain) or cut it; the concepts have the room because of the repetition below.

C8S-2.1
4. [3] and [18]: easy in disguise (literal meaning of "medieval", what nurtured the Renaissance).
5. [5] case study: "correct the blog post"; (d) name any later timeline entry is a one-line free pick.
6. [16] case study: (d) is a strawman (only Saraighat is a battle won against invaders); (a) leaves 1206 arguable until (c).
7. [11]: 5-mark "justify" is a recitation of three book sentences.
8. Repetition: the "medieval" label in [0], [3], [5], [10], [18]; "from beyond the Hindu Kush, Central Asian, Turkic or Afghan" in [5], [7], [10], [11], [13], [15], [17].

C8S-2.2
9. [2]: puts a claim in the student's mouth ("won new provinces") that the page itself supports.
10. [0] case study: (a) answered by the stem, (d) refuted by the stem's own Rs 10 coin.
11. [19] case study: (d) "a memoir is useless as evidence" strawman; (a), (b) recall.
12. Repetition: token currency in [0], [13], [14], [17]; Timur's memoir in [9], [18], [19]; Malik Kafur in [2], [13], [18]; idol/image/iconoclasm in [10], [11], [14].

C8S-2.3
13. [7]: the stem hands over the answer ("sometimes allied, sometimes went to war").
14. [0]: all three statements true, plain recall.
15. [19] case study: four corrections for one step mark; (a)-(c) do not climb.
16. [3] case study: (d) objection answered by the same passage; (a)-(c) recall.
17. [18]: asks what "the chapter presents as the more lasting success"; the chapter never ranks the two, key argues from silence.
18. Repetition: the resistance inventory in [8], [17], [18], [3]; Kumbhalgarh in [3], [9], [15], [19]; Narasimhadeva-Konark in [2], [3], [10], [12], [18].

C8S-2.4
19. [4] case study: (d) tax decision has a one-sided key ("reject"); the page says nothing on taxing traders and 240 of 300 horses sold supports a moderate tax.
20. [20] case study: four spot-the-slip parts, no climb, strawman brochure, no decision.
21. [16]: three phrases lifted from a passage the stem does not quote, 3 marks.
22. Repetition: Domingo Paes in [2], [10], [16], [20]; Talikota in [14], [17], [18], [20]; Harihara and Bukka in [3], [8], [15], [18], [20].

C8S-2.5
23. [17]: step 4 orders Humayun's reconquest before Himu's rule; the page says Himu's rule came "before this happened"; key must not mark the order.
24. [18] case study: (d) "Source B proves he never persecuted anyone" is refuted by the stem's own quote; (a) read off the stem; (b) asks for a reason the stem's quotation cuts off.
25. [19]: names two rulers and two arts; recall labelled Understand.
26. Repetition: Akbar's brutality-then-tolerance in [6], [11], [15], [16], [18]; Chittor in [0], [6], [11], [16], [18].

C8S-2.6
27. Repetition: "Deccan wars drained the treasury, decline after 1707" is the marked answer in [0], [5], [7](c), [12](b), [14], [17]; the 1657-58 succession in [3], [7](d), [9], [17]; political-and-religious motive in [11], [18], [20]; greatest expansion in [4], [5], [10], [17].
28. [16]: 1658+49 = 1707 and 25/49 for 2 marks, with [1] and [2] it is four trivial calculations on three numbers.
29. [9]: three one-line facts about the brothers plus one line.
30. [13]: copies the p.45 "Think about it" note with a strawman classmate.
31. [20] case study: duplicates [18], invented Source Y, strawman (d).

C8S-2.7
32. Repetition: paik in [0], [4], [5]; terrain-plus-guerrilla in [3], [5], [8], [14], [17], [18]; Durgavati in [10], [17], [19]; Mewar never accepted in [13], [16], [17].
33. [1]: needs the book's 30,000 then divides, a one-line fact.
34. [2], [11], [12]: page lookups (Bhil roles; two reasons for Rajput resistance; Ahom migration), [11] labelled Understand.
35. [19] case study: fourth "correct the script" frame; "20 soldiers per elephant" is meaningless; (d) justification only.

C8S-2.8
36. Repetition: Tegh Bahadur / Kashmiri Pandits / Sis Ganj in [3], [6], [12], [15], [19]; Guru Arjan-Jahangir-Hargobind in [1], [4], [8], [17], [18]; Ranjit Singh's qualities in [9], [13].
37. [19] case study: (c) 2026-1979+1 = 48 needs nothing from the chapter; (a), (b) repeat [3], [15]; (d) soft.
38. [0] case study: (d) caption strawman; parts do not climb.
(and [4], [8], [13] are page lookups, counted in MEDIUM 3.)

C8S-2.9
39. Repetition: wealth concentrated / peasants harsh in [2], [20], [21], [22]; one-fifth revenue computed in [1], [4], [6], [20]; iqtadar/mansabdar in [11], [12], [19]; Todar Mal in [6], [10], [19]; temple economy in [7], [17], [20].

## LOW (29)
1. C8S-2.1 [2]: 1206 to 1526 (320) is also the date pair in [8] and [14]/[19]; subtraction of timeline dates is tested three times.
2. C8S-2.1 [9]: "which Big Question does Saraighat answer" is arguable (it also bears on how boundaries were reshaped).
3. C8S-2.2 [3]: "five dynasties replacing each other is itself a sign of upheaval" is the author's inference; mark the two-in-three and nine-year points.
4. C8S-2.2 [1]: distractors 12, 22, 9 are far from 35.
5. C8S-2.2 [12]: three wrong options contradict the stem or book openly.
6. C8S-2.2 [15]: the return journey distance is inferred; say so.
7. C8S-2.2 [6]: "almost two out of three" of 18 allows 11 or 12; say "two out of three".
8. C8S-2.3 [15]: drawback is inference; accept any reasoned strategic point.
9. C8S-2.3 [12](b): "large part of the eastern side" goes slightly beyond the page.
10. C8S-2.4 [19](b): "visitor sees the temples still standing" sits against "most of its temples were destroyed".
11. C8S-2.4 [5]: 1336 to 1565 (229) also in C8S-2.1 [8]; assumes the capital was the same city from 1336.
12. C8S-2.5 [15]: reason 3 is inference; the page poses an open question.
13. C8S-2.5 [12]: "Akbar's side defeats Himu" hedges.
14. C8S-2.5 [14]: 1605-15 is trivial.
15. C8S-2.6 [12]: part (a) is answered by the quotation in the stem.
16. C8S-2.6 [15]: "Akbar's court welcomed the arts" is not on the page.
17. C8S-2.7 [8]: "pitched battle" is not a term in this book.
18. C8S-2.7 [9]: stem gives the answer by using the page's own phrase "remote forested hills".
19. C8S-2.7 [3]: "far larger Mughal armies" is not said for Haldighati.
20. C8S-2.7 [15]: third "who cannot have done X by dates" show-impossible (also 2.2 [13], 2.5 [1]).
21. C8S-2.8 [14]: (b) is an open one-line opinion; define "reasoned".
22. C8S-2.8 [11]: wrong options are other rulers' markers, not qualities.
23. C8S-2.8 [16]: throw-away options; the line is also in [10](b).
24. C8S-2.9 [16](b): "payment flowed into India" is inference.
25. C8S-2.9 [19]: Sultanate "how revenue was assessed" is not on the page.
26. C8S-2.9 [3]: Sadr item 1 could be read as a Diwan matter.
27. C8S-2.9 [0]: armed-escort option is believable; make it visibly riskier.
28. Chapter: true_false items with verdict True (C8S-2.2 [7], 2.5 [6], 2.6 [5], 2.9 [9]) are compound true statements; the standard asks for a real misconception.
29. Chapter: the correct MCQ option is never the longest and is the shortest in 25 of 43; vary lengths.

## Per-concept status
- C8S-2.1 (20): keys right; repetition and 3 recall items; not load-ready until fixes 4-8.
- C8S-2.2 (21): keys right; three weak case/claim stems and heavy repetition (token currency, Timur's memoir).
- C8S-2.3 (20): 1 HIGH ([6](a)); heavy repetition of the resistance inventory; two case studies weak.
- C8S-2.4 (21): keys right; case studies [4] and [20] need rework; Paes and Talikota repeated.
- C8S-2.5 (20): keys right; [17] order and [18] strawman; Akbar's two faces tested five times.
- C8S-2.6 (21): keys right; the Deccan-wars chain is the marked answer six times; [20] duplicates [18].
- C8S-2.7 (21): keys right; terrain-plus-guerrilla tested six times; [19] template frame.
- C8S-2.8 (20): keys right; Tegh Bahadur five times, Jahangir-Arjan-Hargobind five times; [19] part (c) needs no chapter.
- C8S-2.9 (23): keys right; best arithmetic case study ([6]); repetition and seven page lookups.
Verdict: not load-ready. Re-review after the fix pass.

## Working notes per concept (raw findings, with fixes)


### C8S-2.1 (20 questions)
Keys all verified (1206->1526 = 320; 1336->1565 = 229; 1699->1799 = 100; 1576->1671 = 95; 1398->1526 = 128). No wrong key, no second answer found.
- [2] MEDIUM-LOW repeated arithmetic: 1206->1526 (320) is computed in [2], [8] and again as the dates pair in [14](iii)/[19]; combined with [8] and [16](b) the "subtract two timeline dates" idea is tested 3 times.
- [3] MEDIUM easy in disguise: (a) "What does 'medieval' literally mean, which region first" is a one-line book fact; (b) only restates the book's own sentence. Labelled Understand/Hard. Fix: make (a) a short application (e.g. a given sentence using the word for a different region; student says what is wrong) or merge with [0].
- [18] MEDIUM easy in disguise: (a) "What nurtured Europe's Renaissance" is a glossary line; (b) is a soft "why mention" with a book-sentence answer. Fix: replace with an item that uses the label, or drop.
- Idea repeated more than twice (MEDIUM): the 'medieval' label is tested in [0], [3], [5](a)(b), [10] s1, [18]; "invasions from beyond the Hindu Kush by Central Asian/Turkic/Afghan peoples" in [5](c), [7], [10] s2, [11], [13], [15], [17]. Cut [3] and [18] and one of [11]/[15].
- [5] case study (MEDIUM): it is a "correct the blog post" task, so (d) ("name one later timeline entry inside the span") is a one-line recall, not a decision; parts do climb weakly. Also accepts six different answers in (d), a free pick. Fix: make (d) a judgement, e.g. which of two timeline entries would a historian using the book's span count and which not, with the reason.
- [16] case study (MEDIUM): (d) is not a real trade-off: the heading says "beats back an invading force in battle" and only Saraighat is a battle won against Mughal invaders, so the "torn" class is a strawman. Also (a) "which two cards show a ruler from beyond the Subcontinent attacking or conquering Delhi" - 1206 (a Turkic-Afghan dynasty founding the Sultanate at Delhi) is arguably a third, which only part (c) rules out. Fix: say "which two cards name an attack on Delhi itself", and make (d) choose between two defensible cards (e.g. 1565 Talikota vs 1671 Saraighat, which fits "an Indian power beats back an invader"? only 1671; so instead ask the heading as "an empire's capital is sacked").
- [9] LOW: (a) "which Big Question does Saraighat help answer" is arguable: the Ahom victory also bears on how boundaries were (not) reshaped (Q1). Key says Q2 only. Fix: ask "which Big Question does it answer more directly" and mark the reason, or accept either with the reason.
- [11] MEDIUM: "Justify" 5-marker is a recitation of three book sentences (new compared with earlier, origin, three dates). Thinking is light for 5 marks. Fix: add a comparison or a cause-effect link (e.g. why the 1526 date ends one story and begins another).
- [10] multi_statement: key "2 and 3 only"; s1 false (book span closes in the 17th century, not with Europe's Renaissance), s2 and s3 true on p.24. Fine, but s1 is slightly contorted.
- [4] A true, R true, R does not explain A: unarguable. OK.
- [12] true_false verdict False with a real misconception; OK.
- Timeline reading is the whole concept (appropriate), but see repetition above.

### C8S-2.2 (21 questions)
Keys verified: 320/9 = 35.6 -> "About 35"; 18 x 2/3 = 12; 1398 Timur after Tughlaq's capital move (book places Tughlaq "a few decades" after c.1300). No wrong key.
- [2] MEDIUM: the stem puts a claim in the student's mouth ("mattered mainly because they won new provinces") that the book itself supports ("conquering several kingdoms on the way"). The key (plunder financed the army) is right, but the framing makes the student wrong when the book says she is partly right. Fix: "Which point from the chapter shows how these campaigns helped the Sultanate sustain its army?"
- [0] case study (MEDIUM): part (a) is answerable from the stem alone (the Rs 10 coin is described), (d) is a strawman ("token money can never work") refuted by the stem's own coin. Fix: make (d) a real trade-off (e.g. a modern bank proposes a token coin: which two conditions that failed in Tughlaq's time must it meet?).
- [19] case study (MEDIUM): (d) "Aman: a conqueror's memoir is useless as evidence" is a strawman; (a) and (b) are one-line recall. Fix: give two sources and ask which to rely on for motive and which for effect, with the reason.
- Idea repeated more than twice (MEDIUM): token currency in [0], [13], [14], [17]; Timur's memoir / two aims in [9], [18], [19](a)(d); Malik Kafur in [2], [13], [18]; idol/image/iconoclasm in [10], [11], [14]. Cut one of each (suggest drop [14] term, [9], one of [13]/[17]).
- Easy in disguise (MEDIUM): [8] (a) names three sources of wealth, (b) restates "plunder affected trade"; [11] (b) "give one classical word" (copied from the page); [16](i) "begun by whom, completed by whom"; [20](a) one attack, one defence; [5] A and R are two halves of one book sentence (p.29 "territory had shrunk ... in the face of increasing resistance"), so it is recall with a label. [14] match is four glossary terms.
- [7] LOW: the True verdict item is a compound of two book facts; it carries no misconception. Fix: change to a False statement, e.g. "Muhammad bin Tughlaq's dominance over most of the Subcontinent lasted until Timur's attack" (False: the book says it was short-lived).
- [3] LOW: claim-check reasoning "five dynasties replacing one another is itself a sign of upheaval" is the author's inference, not the book's; keep the two-in-three and nine-years evidence as the marked points.
- [1] LOW: distractors 12, 22 and 9 are far from 35 (anyone dividing 320 by 9 sees it); add 28 and 40.
- [12] LOW: three wrong options contradict the stem or the book openly (paid by Muslims; abolished by Tughlaq; only foreign merchants); not real chapter confusions. Fix: e.g. "Akbar abolished it" (true but later) and "it was paid by peasants as land revenue".
- [15] LOW: (a) doubling 1,000 km; the book does not state the return distance, the key's "at least about 2,000 km" is a fair inference but say "assume the return trip was the same road".
- [13] show_impossible is sound (Kafur under Ala-ud-din at the turn of the 14th century, Tughlaq "a few decades later").
- [10] statements: s1 true, s2 false (book: "not just by plunder but also by iconoclasm"), s3 true; key "1 and 3 only" correct.

### C8S-2.3 (20 questions)
Facts checked on pp.29-31 (Eastern Gangas, Musunuri Nayakas "rallied over 75 more chieftains", Hoysalas, regional sultanates, Rana Kumbha, Kumbhalgarh 36 km, 1326 Mewar timeline).
- [6](a) HIGH (second defensible answer, not machine-markable): "How many chieftains, at the least, made up the Musunuri confederacy, counting the Musunuri Nayakas themselves as one?" Key: "More than 76". The book says the Nayakas "rallied over 75 more chieftains" and its own question speaks of "75 leaders"; "the Musunuri Nayakas" is a plural group, so "count them as one" is arbitrary. 75 (the book's number), 76, 77 and "more than 76" are all defensible. Fix: delete (a), or ask "How many chieftains did the Nayakas rally besides themselves, as the chapter puts it?" with key "over 75", then keep (b) as the 2-mark reasoning part with a marked list (rival interests, slow communication, trust).
- [7] MEDIUM easy in disguise: the stem hands over the answer ("sometimes allied and sometimes went to war") and the key option restates it. Fix: stem should give a situation (e.g. Gujarat's sultan marches on a neighbour) and ask what the chapter implies about the sultanates acting as a bloc.
- [0] MEDIUM: all three statements are plain true recall, so no statement is false, "1, 2 and 3". Allowed, but with [8] (claim all true) it makes this concept's verdicts uniformly "true". Fix: make statement 2 false (e.g. "expelled Ala-ud-din Khilji's army") and key "1 and 3 only".
- [19] case study (MEDIUM): part (a) asks four corrections (Telugu not Kannada; over 75 not about 25; Muhammad bin Tughlaq not Ala-ud-din; 1330-1336 not 1400) for one step mark; parts (a)-(c) are all spot-the-slip recall and do not climb. Fix: (a) two corrections (1 mark), or award 2 marks and take one from (d); make (d) weigh Rohan's conclusion against a second source rather than reuse "regional sultanates".
- [3] case study (MEDIUM): (a)-(c) are recall of three sources; (d) is only mildly arguable because the objector's premise ("they lost their kingdom") is answered by the same passage (absorbed by Vijayanagara, not conquered by Delhi). Fix: make (d) a real trade-off, e.g. whether Warangal or Belur better fits "Kingdoms Delhi could not hold".
- [18] MEDIUM: asks "which of the two the chapter presents as the more lasting success" but the chapter never ranks them; the key reasons from silence ("the chapter records no defeat" of Kalinga). Fix: "Which of the two ended as part of another Indian empire, and what does that show about how resistance can end?" or mark any reasoned verdict using the three stated facts.
- Idea repeated more than twice (MEDIUM): the resistance inventory (Eastern Gangas / Musunuri / Hoysalas / sultanates / Kumbha) is reassembled in [8], [17], [18] and partly [3]; Kumbhalgarh defences in [3](b), [9], [15], [19](c); Narasimhadeva-Konark in [2], [3], [10], [12], [18]. Cut [9] and [12] and one of [8]/[17].
- Easy in disguise (MEDIUM): [9] (one-line "forests, slopes, 36-km wall"), [10] (match, four one-line pairings, labelled Understand), [12](a), [16] (Sala and the lion), [1](a) (names copied from the page).
- [15] LOW: open pros/cons; acceptable because the key states marking points (two advantages, one drawback, each reasoned) and the book itself poses the question; add "accept any reasoned strategic point" and note the drawback is the author's inference, so the mark must not depend on one named drawback.
- [12](b) LOW: "a large part of the eastern side of the Subcontinent" goes slightly beyond the book; word it as "Odisha and parts of Bengal and Andhra Pradesh stayed outside Delhi's control".
- [5] AR (A true, R false: R is the Eastern Ganga/Narasimhadeva feat wrongly given to the Hoysalas) is a good, unarguable item. [11] true_false (False, Bahmani is independent) is sound.

### C8S-2.4 (21 questions)
Facts checked on pp.31-36. Arithmetic: 300-240 = 60, 60/300 = 1/5; 1565-1336 = 229. No wrong key, no second answer in the MCQs, AR, MS or true/false.
- [4] case study (MEDIUM): part (d) "should the king accept a heavy tax on horse traders" has a one-sided key ("reject"). The book says nothing about taxing traders; with 240 of 300 horses already sold to the king a moderate tax is defensible, so the "decision" is the author's opinion. Also (c)'s "60 left that could be sold elsewhere" is then used to argue the opposite way. Fix: mark either decision if it uses (b) (why the king courts the traders) and (c) (the 60 unsold), and list those two points as the marking points.
- [20] case study (MEDIUM, bordering HIGH on type): all four parts are spot-the-slip corrections of book facts (founder; Mughals; destroyer and duration; end), they do not climb, and the last part is not a decision. The brochure is also a strawman (Mughals "under whom it became the greatest city" in 1336-1565). The same frame ("correct this blog/brochure/summary") is the case study in C8S-2.1 [5], C8S-2.3 [19] and here: a template. Fix: replace with a data/decision case (e.g. which of two itineraries or two sources to trust) and keep at most one correction case study in the chapter.
- [16] MEDIUM easy in disguise: "give three pieces of evidence from Paes's description" is lifting three phrases from a passage the stem does not quote, 3 marks for retrieval. Fix: quote two lines of Paes in the stem and ask what each does and does not prove (size vs. number of people).
- [12] MEDIUM easy in disguise: two one-line recalls (musical pillars; temple grants). [0] and [6] likewise: [0] A and R are two halves of one book sentence; [6] sorts one cultural option from three military ones.
- [19](b) LOW: "a visitor to Hampi today sees more of the cultural side because temples still stand" goes slightly beyond the page, which says "most of its temples were destroyed" (the captions only show the Virupaksha and Vitthala temples). Fix: ask "which has left more visible traces in the pictures the chapter gives" or accept the reasoned answer "cultural, with the ruins and temples as evidence".
- Idea repeated more than twice (MEDIUM): Domingo Paes in [2], [10](b), [16], [20]; Talikota and the fall in [14], [17], [18], [20](c)(d); Harihara and Bukka in [3], [8], [15], [18], [20](a); "the Hoysalas were absorbed into Vijayanagara" is here ([9]) and again in C8S-2.3 [3], [13], [18]. Cut [17] (same as [14]) and [2] or [16].
- [5] LOW: 1336 to 1565 = 229 is also computed in C8S-2.1 [8]; the stem also assumes the empire's capital was the same city from 1336, which the book supports only loosely ("establish their capital at that very spot"). Fix: say "the empire established in 1336 and its capital city destroyed in 1565".
- [7] true_false sound (Bahmani fragmented into five states; coalition at Talikota). [8] statements: s1 and s2 true, s3 false (died of illness, 1529); key "1 and 2 only" correct. [13](b) good distinction (Musunuri Nayakas vs later Nayakas). [3] good analytical (a)+(b) item.

### C8S-2.5 (20 questions)
Facts checked on pp.36-42, 54. Arithmetic: 1556+12 = 1568; 1556-13 = 1543 (born); 1605-15 = 1590. No wrong key, no second answer in MCQ/AR/MS.
Humayun/Himu (p.37): the page says Himu "captured Delhi and ruled it briefly" and "Akbar soon reclaimed Delhi for the Mughals". So [9] ("a Suri commander's brief rule before Akbar retook Delhi") IS supported by the page and is fine. The page also says Himu's rule came "Before this happened" i.e. before Humayun's reconquest of the lost ground, and that chronology is itself loose (Akbar succeeds only on Humayun's death). That is a problem for [17] below.
- [17] MEDIUM: step 4 says "Humayun soon reconquered the lost ground; meanwhile Himu captured Delhi and ruled briefly", step 5 Akbar at Panipat 1556. The page puts Himu's rule BEFORE Humayun's reconquest, so the key's order (Humayun's reconquest, then Himu, then Akbar) is not what the page says, and a student following the page would be marked down. Also a 5-mark "five linked steps" that is a copy of three paragraphs. Fix: merge steps 4 and 5 in the key into one marked point "Himu held Delhi briefly and Akbar, confronting him at the Second Battle of Panipat in 1556, reclaimed it", state "order of Humayun's reconquest relative to Himu is not marked", and add a why-it-mattered point (e.g. why the Sur interlude did not end Mughal rule).
- [18] case study (MEDIUM): (d) is a strawman ("Source B proves Akbar never persecuted anyone") that Source B, quoted in the stem ("Formerly I persecuted men..."), refutes on its face; (a) is answerable from the stem's own description of Source A; (b) says "what reason does Akbar give there" but the stem's quotation stops before the reason (it is on p.40). Fix: (d) test a real limit (does a change of view in his words show a change in policy? use the abolished jizya and the one-third figure), and quote the whole Source B line in the stem or ask for the reason from the chapter.
- [4] case study (MEDIUM-LOW): (a) and (b) are one-line recall (house of translation, two texts); (c) is the puzzle; (d) (equal share of power? no, one-third) is a good chapter-dependent judgement. Fine overall; cut (b) to "which language" or fold into (a) to raise the climb.
- [19] MEDIUM easy in disguise: names Jahangir and Shah Jahan with one fact each, then two arts from a list; labelled Understand/Hard. Fix: replace with a claim to test (e.g. "Shah Jahan's reign saw the arts decline because of rebellions").
- [7], [8](a), [2] MEDIUM-LOW easy in disguise: [7] is four name-to-description matches (Baburnama, Razmnama, Ain-i-Akbari, Amuktamalyada, the last belonging to C8S-2.4's idea); [8](a) names two praised things; [2] "relied on gunpowder" is one book line.
- Idea repeated more than twice (MEDIUM): Akbar's "brutality then tolerance" is tested in [6], [11], [15], [16], [18] (five items) plus [4](d); Chittor in [0], [6], [11], [16], [18]. Cut [6] (same ground as [11]) and fold [15] into [16].
- [15] LOW: the book poses this as an open "why do you think" question; reason 3 ("tolerance reduced resistance") is an inference, not stated. Key should say "any three reasoned points supported by the page" instead of a fixed three.
- [12] LOW: "Akbar's side defeats Himu" hedges; the page says "when confronted by... Akbar" and the timeline says "Akbar's decisive victory", so "Akbar defeats Himu" would do. Wrong option "Babur defeats Rana Sanga" is a true event (Khanwa) but is not the Second Battle of Panipat, so it works.
- [14] LOW: 1605-15 = 1590 is trivial; make it a two-step (e.g. years between Chittor and the start of the final campaigns, with Chittor c.1568).
- [3] AR (A false: Khanwa vs Panipat; R true) is good and unarguable. [5] statements (s2 and s3 false) correct. [10](b) "short-lived yet lasting" is a good item.

### C8S-2.6 (21 questions)
Facts checked on pp.42-45. Arithmetic: 27/9 = 3; 1707-25 = 1682; 49-27 = 22; 1658+49 = 1707; 25/49 = 51%. No wrong key, no second answer.
- Idea repeated far more than twice (MEDIUM, the main defect of this concept): "the Deccan wars drained the treasury and strained the administration, so Mughal power declined after 1707" is the marked answer in [0], [5], [7](c), [12](b), [14], [17] (six items); "Aurangzeb's route to the throne in 1657-58" in [3], [7](d), [9], [17]; "his motives were political AND personally religious (farman vs temple grants)" in [11], [18], [20]; "greatest expansion" in [4], [5], [10], [17]. Cut [5], [14], [9] and [20], and keep [17]/[18] as the two 5-markers.
- [16] MEDIUM easy in disguise: (a) "1658 + 49 = 1707, does it match the chapter's 1707?" is addition plus a one-line check; (b) 25/49. Together with [2] (1707-25) and [1] (27/9) that is four trivial calculations on three numbers. Fix: drop [16]; make [2] a two-step item.
- [9] MEDIUM easy in disguise: (a) three one-line facts about the brothers, (b) one line. Labelled Understand/Hard.
- [13] MEDIUM easy in disguise: reproduces the p.45 "Think about it" note (no responsibility today; need the facts; victims deserve respect). The classmate's claim is a strawman and the note is a values statement, not an analytical idea. Scope: acceptable (the box is on p.45, inside 42-45; the "Note on History's Darker Periods" on p.20 is scope_out and is not asked). Fix: turn into a "partly right" claim-check, e.g. "We should not study these atrocities at all, since nobody alive did them" (the chapter says we need the facts).
- [12](a) LOW-MEDIUM: "How did he judge his own rule?" is answered by the quotation in the stem; (b) links the letters to the treasury story, which is the author's inference (the page asks only "what do these words tell us about Aurangzeb"). Fix: ask what else in the chapter agrees or disagrees with his claim, and accept either with evidence.
- [19] MEDIUM-LOW easy in disguise: four rulers matched to one-line facts, restating [15] and the Akbar concept; labelled Understand/Hard.
- [20] case study (MEDIUM): duplicates [18] (same two evidence types, same conclusion), Source Y is an invented grant, and (d) ("Y cancels X, so purely political") is a weak strawman the chapter answers outright. Fix: replace by a different case (e.g. reign-length data, [7], already covers that) or drop.
- [15] LOW: the last listed difference "Akbar's court welcomed the arts" is the author's inference (the page says Jahangir and Shah Jahan loved art, and Aurangzeb banned music and dance); the jizya and pilgrimage tax differences are one idea. Key should say "any three of the stated differences" and not list the arts line.
- [7] case study: arithmetic right (22) and (c) (27 to 16 means later reigns shorter) follows from the data; best case study of the chapter so far. Minor: (c) asks two things at once.
- [6] statements: s1 false (Dara was the eldest son and the chosen heir), s2 false (persecuted other Muslim sects), s3 true; "3 only" correct and the false ones are clearly false on pp.42-44. [4] AR: unarguable "R true, not explaining A".

### C8S-2.7 (21 questions)
Facts checked on pp.45-49. Arithmetic: 30,000/10,000 = 3; 1576-1530 = 46; 20,000/1,000 = 20. No wrong key, no second answer in MCQ/AR/MS.
- Idea repeated more than twice (MEDIUM): paik system in [0], [4], [5](a); "terrain plus guerrilla tactics" (Pratap and Ahoms) in [3], [5](d), [8], [14](iii), [17], [18]; Durgavati in [10], [17], [19]; "Mewar never accepted Mughal dominance" in [13], [16], [17]; "forested/remote tribes kept independence" in [9] and [20] (the same p.46 sentence). Cut [4] (paik is already in [0]), [9], [16], and one of [3]/[8].
- [1] MEDIUM easy in disguise: stem gives only 10,000 and the key needs the book's 30,000, then divides by 10,000. It is a one-line fact with a trivial division. Fix: give both numbers in the stem and ask for a consequence (e.g. how many Ahom soldiers per Mughal soldier and what that says about the paik system's reach), or drop.
- [11], [12], [2]: MEDIUM easy in disguise: [11] "two reasons the Rajputs often fought invaders" (two one-line facts, labelled Understand); [12] "from where did the Ahoms migrate, which century" + a list of assimilation points; [2] "two ways the Bhils helped" + the emblem. All three are page-lookup items.
- [19] case study (MEDIUM): the fourth "correct the faulty script/blog/brochure" case study in the chapter (also C8S-2.1 [5], C8S-2.3 [19], C8S-2.4 [20]); part (b)'s "20 soldiers per elephant" is a contrived calculation with no meaning; (d) is a justification, not a decision. The correction frame also makes parts (a)-(c) pure recall. Fix: keep (d) and (c), replace (a)-(b) by a data task (e.g. Durgavati's army against the Mughals sent against her is not given, so compare Mewar's and Garha's means of resisting).
- [5] case study (MEDIUM-LOW): (a) and (b) repeat [0] and the Ahom terrain line; (d) has a single answer straight from the page ("terrain plus guerrilla tactics") so it is not a trade-off. Acceptable, but the parts do not climb past (c).
- [8] LOW-MEDIUM: "pitched battle" is not a term in this book, and the key defines it from outside and files Haldighati under it (the page says "a confrontation"). Fix: use the book's own glossary term (guerrilla warfare) and contrast with "the open confrontation at Haldighati", or cite Haldighati as the page words it.
- [9] LOW-MEDIUM: the stem gives away the answer by labelling one group "remote forested hills" (the page's own words) and option "all three equally" is a throw-away; sorted by one phrase. Fix: describe the groups by terrain without the page's phrase and add a plausible rival (a large tribe with a strong chief on the plains).
- [3] LOW: "against far larger Mughal armies" is stated for the Ahoms only; at Haldighati the page says the Mughals "had the upper hand", not that they were larger. Fix: "against the Mughal army".
- [15] LOW: show-impossible by dates is the same frame as C8S-2.2 [13] and C8S-2.5 [1] (three "cannot have" items in the chapter). Keep one or vary (e.g. a source cannot be eyewitness).
- [7] statements: s1 false (Rana Sanga was defeated by Babur at Khanwa), s2 true, s3 false (Pratap escaped, the page says the Mughals had the upper hand; timeline: "forced to retreat"); "2 only" correct, and both false statements are clearly false.
- [4] AR: A true, R true and R explains A (p.48 states the link directly). It is recall of one sentence in two halves, so do not count it as a separate analytic item.
- [13] claim-check verdict "Yes", [20] "No": see the chapter mix below.

### C8S-2.8 (20 questions)
Facts checked on pp.50-53. Arithmetic: 1699-1675 = 24; 1799-1699 = 100; 2026-1979+1 = 48. No wrong key, no second answer in MCQ/AR/MS.
- Idea repeated more than twice (MEDIUM, heavy): Guru Tegh Bahadur / Kashmiri Pandits / Sis Ganj Sahib is the marked answer in [3], [6], [12], [15], [19](a)(b) (five items); Guru Arjan's death, Jahangir and Hargobind's army in [1], [4], [8], [17], [18]; Ranjit Singh's three qualities in [9] and [13] (and again in [0], [17]); the line "Truth is high but higher still is truthful living" in [10](b) and [16]; Sikh values in [10], [14], [16]. Cut [6], [3] (keep [12] and [15]), [4], [13] and [16].
- [19] case study (MEDIUM): (a) and (b) repeat [3] and [15]; (c) (2026-1979+1 = 48) needs nothing from the chapter (the stem gives both years); (d) is a soft justification ("model of courage and duty") that goes a little beyond the page, which says only "a powerful symbol of faith and sacrifice". Fix: replace (c) with a chapter-dependent step (e.g. how many years from the Guru's death in 1675 to the first salute in 1979 recorded in the chapter) and make (d) a real choice (what the inscription should say) with marking points.
- [0] case study (MEDIUM-LOW): the arithmetic (24, 100) is right and (b) is a good chapter-dependent link (1707, 1754 and the confederacies); but (d) is again a "spot the error in a caption" strawman (Ranjit Singh founded the Khalsa) and the part order does not climb (two date gaps, one link, one correction). Fix: end with a decision, e.g. which one card to remove if the board allows only four, justified by "the rise of the Sikhs".
- [4], [8], [13] MEDIUM-LOW easy in disguise: [4] two one-line facts; [8] four Guru-to-description matches, labelled Understand; [13] (a) names three qualities, (b) one line.
- [14] LOW-MEDIUM: (a) recall of "justice, equality, defence of the faith"; (b) "give one way a value remains relevant today" is an open opinion with a one-line mark ("any reasoned example earns the mark"). Acceptable because the book asks it itself, but the key should say what counts as reasoned (names the value and links it to a concrete present-day situation).
- [11] LOW: the three wrong options are other rulers' markers (iqta, Deccan wars, token coins), obviously not "qualities". Fix: add other qualities named for other rulers (e.g. "his austere life", "his sulh-i-kul").
- [16] LOW: wrong options "only for rulers" and "must be defended by arms" are throw-aways; and the line is used in [10](b) too. Drop one.
- [6] LOW: stem wording "whose freedom he stood up for" is odd (the page says protection from religious persecution). Fix: "for whom did he stand up".
- [2] AR (A true, R false because Guru Gobind Singh was the tenth Guru and Guru Arjan first compiled the text) is good. [5] statements: s2 false (Ranjit Singh, not the Marathas, unified the confederacies), s1 and s3 true; "1 and 3 only" correct. [7] true_false is sound. [9] claim-check "Yes" is supported.

### C8S-2.9 (23 questions)
Facts checked on pp.53-58. Arithmetic: 250/5 = 50; 360 x (1/2 - 1/5) = 108; wheat 40x10x0.5 = 200, cotton 25x6x2 = 300, total 500, one-fifth = 100, flat 150/500 = 30%; 1,500/3 = 500. No wrong key, no second answer in MCQ/AR/MS/match.
- Idea repeated more than twice (MEDIUM): "wealth concentrated at the top; peasants and craftspeople fared harshly" is the marked answer in [2], [20], [21](b)(c), [22](a); the one-fifth/one-half land-revenue share is computed in [1], [4], [6](c) and cited in [20]; iqtadar/mansabdar in [11], [12], [19](b)(c); Todar Mal's method in [6], [10], [19](d); temple economy in [7], [17], [20]; paik/mansabdari is [9] (and the paik system is already tested three times in C8S-2.7). Cut [10], [22], [12] and [1] (keep [4], [6]); keep [17] or [7], not both.
- [1], [10], [13], [7], [17], [22], [16](a) MEDIUM easy in disguise: [1] one-fifth of 250 (a one-line fact and a division); [10] "how would Todar Mal set what each owes" restates the p.55 sentence; [13] "irrigation made multiple crops possible" is one line; [7] the stem lists the temple's activities and the key restates them; [17] "explain how a temple economy worked in three steps" is the p.57 paragraph; [22] two reasons then one hardship; [16](a) two imports and two crafts, copied from the page.
- [16](b) LOW: "more payment flowed into India than out" is the author's economic inference; the page says only "imported much less than it exported". Fix: mark "India sold more than it bought, so trade added to its wealth" and treat it as a reasoned point.
- [19] LOW: part (d) "how revenue was assessed" under the Sultanate: the page gives no assessment method (only taxes at every stage, the burden on the peasantry, cruelty), so the contrast with Todar Mal's survey is partly constructed. Fix: label (d) "who bore the burden of revenue" or drop (d) and mark five points (a), (b), (c), control, and a one-line judgement of which system left more checks on officials.
- [6] case study: arithmetic correct; best case study in the chapter (needs Todar Mal's method and the one-fifth figure from the book, the last part is a numeric decision). Minor: (d) is decided by the numbers alone (150 > 100), so it is a computation not a trade-off; "bigha" and "maund" are not in the book (harmless). Fix: add a second village that the flat charge favours, so (d) weighs both.
- [3] LOW: item 1 ("dispute over a grant to a religious school" for the Sadr) is a stretch from "justice, religious and educational matters"; a student could say Diwan (a grant is a finance matter). Fix: "a quarrel about a religious or educational matter that needs a judge".
- [0] LOW: "carry silver rupayas with an armed escort" is a believable alternative for a rich merchant; it works as a wrong option only because the stem says "frequent plunder" (the page: hundi "less vulnerable to plunder"). Keep, but make the escort option visibly riskier (e.g. "carry the silver alone").
- [2] claim check "partly right", [15] "No", [9] true_false "True" (no misconception in it; see chapter mix). [5] AR (R true, not explanation) unarguable. [8] statements: s1 false (non-Muslims rarely above one-third), s2 and s3 true; "2 and 3 only" correct.
- [21] case study: parts (a)-(c) are one-line recall, (d) is the real judgement and uses (b) and (c); the student "thinks the two cannot both be right" is a mild strawman. Acceptable after the repetition cuts above.
