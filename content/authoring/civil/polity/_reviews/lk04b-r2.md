# Round-2 review of lk04b.json (Laxmikanth ch4, Tables 4.1-4.4, LK-4.7 to LK-4.13) - independent

Verdict: **pass** (zero HIGH). Counts: HIGH 0, MEDIUM 4, LOW 9.
Method: all 140 questions re-answered cold, one concept at a time, from ch04.txt (pdf pp.62-84) with options sorted so the
stored key position was not visible, BEFORE keys were read. My 140 answers match the stored keys (all 14 Statement-I/II keys,
all 7 match keys, all 21 "how many" counts included). check-civil-pack.py: 0 problems. 140 unique ids, 4 distinct options and 3 "w" each.

## Round-1 findings, status
- H1 (28 four-statement items where the key was the lone three-statement option): FIXED. Recomputed on the 40 four-statement
  "which" items: options with 3 statements per item are 1 (6 items), 2 (27 items) or 3 (7 items); the key is the lone
  3-statement option in 0 of 40 items. Key sizes: 2 statements x14, 3 statements x19, all four x7 (1, 2, 3 and 4 is now a key in 7 items).
  The 23 three-statement items have keys: two statements x13, one statement x5, all three x5.
  No single statement decides any "which" item (script: minimum 2 statements needed in every item).
- Empty explanations: FIXED (each "Statement n is correct/incorrect" now carries the fact). Script check: for all 63 "which" items the
  correct/incorrect list equals the key set; for all 21 "how many" items the count of "correct" equals the key. No mismatch.
- M1 713 statement 3: FIXED (now "According to Laxmikanth ...", p.62).
- 719/819 triple-repeated "w": FIXED. 1212 doubled ".;": FIXED. 318/118 soft AR pairs: replaced (1318 is now independent facts, 1118 see L4).

## Changed items checked one by one
For every changed item every false statement and every distractor was asked: also supported by the chapter, or true as a
well-prepared aspirant knows it? Result: none found.
- LK-4.7 (705-720): 705-720 keys correct. 710 stmt 2 (Part IX = 243 to 243-ZG) is false by Table 4.1 (IX ends 243-O; ZG ends IX-A), also true in the real
  Constitution. 711 stmt 1 (Art 51-A in Part IV) false: it is Part IV-A. 712 stmt 3 (both Parts have a chapter "General") false: only Part VI.
  713 stmts 1-3 attributed and true to p.62; stmt 4 (about 395 Articles now) false. 719 (74th added IX-A, not 97th) fair.
  No item asserts what the 73rd Amendment did, except 705 (see M1).
- LK-4.8 (803-818): 803 distractors IX-A/IX-B (74th/97th) and Part VII cannot be 42nd; 805, 806-817 verified against Table 4.1 ranges
  (XIX 361-367, XXI 369-392, XXII 393-395, XV 324-329-A, XVIII 352-360, XII ch III 294-300 with 300-A as ch IV, XVII ch II 345-347 etc.). 818 independent facts.
- LK-4.9/4.10 repeated-item rewrites (913, 914, 1007-1017): 913 stmt 2 (Art 45 = free and compulsory education to 14) is false per Table 4.2 (early
  childhood care below 6) and in the amended Constitution; 914 stmt 2 (38 and 51 both Part IV) true. 1010 stmt 4 (Art 200 counterpart of Art 143) false
  (the counterpart of Art 200 is Art 111, not 143) - unambiguous. 1013 stmt 1 ("only when Lok Sabha dissolved") false.
- LK-4.11 (1114, 1116, 1117, 1118): 1104 key 356 only (365 sits in Part XIX 361-367 by Table 4.1; fair range test). 1105 key 263 (waters is 262). 1114 stmt 4 is the
  reverse of footnote 12 (p.83) - false, correct. 1116 stmt 4 ("every amendment") false per p.64.
- LK-4.12 (1201, 1203, 1207, 1208, 1214, 1215): all verified against Table 4.3 (Odia = 96th/2011; Bodo etc. 92nd/2003; Fifth Sch. = Art 244 only;
  Sixth = 244 and 275; Eleventh 243-G, Twelfth 243-W, Tenth 102 and 191, Fourth 4 and 80).
- LK-4.13 (1301, 1302, 1305, 1308, 1312, 1314, 1318, 1320): all verified against Table 4.4 and pp.63/70/71. 1308 stmts 1-2 (Weimar suspension; 1935 Act emergency) and 1312
  stmts 1-2 are explicitly "as listed in Table 4.4" in the stem or are both true from the table - fair.
- Arithmetic: 22 + 4 - 1 = 25 correct (705). 22 + 5 - 1 = 26, 22 + 4 = 26, 22 + 3 - 2 = 23 in the distractors are correct.
- Pages: every `pg` entry re-read against the page markers; all hold their facts (see L3 for two loose ones).

## HIGH
None.

## MEDIUM
**M1 - 705 asserts the p.62 side of the chapter's own contradiction.** Key: "Four Parts have been added and one Part (Part VII) has been deleted"
(IV-A, IX-A, IX-B, XIV-A). p.69 says the 73rd Amendment added "a new Part IX", which would be a fifth. The stem says "according to the chapter" and p.62 and the p.75
Note both give four, so the key is supported and attributed, and in reality the net arithmetic 22 + 4 - 1 = 25 holds (original Part IX was removed earlier and
re-used). No distractor is defensible. But the caller's rule is that no item may assert a contested fact; this is the one that does. Safer: ask "which of the following Parts
was added by the 97th Amendment" style (already in 704, 709, 719) and keep only "25 Parts at present" (713 stmt 2). Not HIGH because the key is unique and sourced.

**M2 - repetition well above 2 per idea per concept.** Counted by Article/Part mentions in stems and statements:
LK-4.10: Art 169, 143, 155 and 200 each appear in 6 items; Council of Ministers 74/163 in 8 (1002, 1003, 1008, 1010, 1013, 1015, 1016, 1017); pardons 72/161 in 6; ordinance
123/213 in 7. LK-4.9: Art 32 in 5 (902, 912, 914, 915, 918). LK-4.7: Part IX-B in 7, Part V in 8. LK-4.8: Part XIV-A added by the 42nd Amendment in 4 (803, 809, 815, 816), Part XXII in 3.
LK-4.12: Fourth Schedule in 6. The tables are small, so some overlap is natural, but the cap of 2 per idea is not met; untouched rows: Arts 14 vs 15, 19, 25-30,
38-40 (DPSP rows), 239AA, 311, 320, 335, 360 in 4.9/4.11; Second and Third Schedule lists in 4.12.

**M3 - LK-4.7 and LK-4.8 are still mostly Article-range lookup.** About 30 of 40 items turn on "Part X covers Articles a to b" or "chapter c comes after chapter d". Only 701,
703, 704, 705, 709, 718, 719, 720, 801-805 test Part-to-subject or amendment history. Round 1 asked for about a third replaced; the range share has not fallen much.
Range memory has almost no PYQ record (PYQ tags for ch4 are sources, Schedules, count of Parts). Keep as is only if the owner accepts a table-recall concept.

**M4 - residual option-shape regularities in the four-statement items (no longer a HIGH).**
(a) Key with two statements is always the only two-statement option (14 of 14: shapes [1,1,2,3] x6 and [1,2,3,3] x8); the key "1, 2, 3 and 4" is always the only
four-statement option in [3,3,3,4] items (7 of 7), and its three companions are the three-statement subsets. (b) Centroid test (pick the option most similar to the others):
the key is among the top-scoring options in 63 of 63 "which" items and the unique top in 46; expected 53 by random tie-breaking, against chance 25%. (c) Statements that sit in
all four options (so effectively free): two free statements in 710, 713, 1009 (the item then tests only two statements). Real UPSC items share (b), so this is a quality
note: vary a few distractors by two flips rather than one, and use a 2-2 split sometimes.

## LOW
- L1 Weak explanations: 1105 and 1303 give the same "Correctly matched, p.7x" / "Borrowed from the British Constitution, p.82" in all three "w"; say which pair/feature.
- L2 713 "w" has one entry that merges two reasons ("leaves out statement 1 ... ; includes statement 4 ..."). 916 explanation contains a stray ".(".
- L3 Loose pages: 712 cites [72] but statements 1 and 4 use Part VI chapters on p.73; 1216 cites [80,84] but the Ninth Schedule entry (statement 2) is on p.81.
- L4 1118: Statement-I says "A National Emergency converts the federal structure ..."; p.69 says "an emergency" generally (all three types). True of National
  Emergency as well, but II explaining I is the weakest "explains" relation in the pack. 918 is fair.
- L5 AR keys "both correct but II does not explain" (818, 1018, 1218, 1318) are two independent table facts, so the item adds little over a two-statement question.
- L6 Every "how many" item in position x15 has the key "Only two" (7 of 7 concepts); x16 and x17 vary. Vary one concept.
- L7 Book figures: 1204/1208 are "According to Table 4.3" (State List 59, Union List 98); 1219 (66 originally, 59 now) and 1205/1215 are unattributed and other
  official counts exist. Add the attribution to 1219.
- L8 Format mix vs 2020-26 column of the trends doc: direct 35 (25% vs 26%), consider-statements 63 (45% vs 48%), how-many 21 (15% vs 12%), Statement-I/II 14 (10% vs 6%),
  match 7 (5%, none in the doc), no case study (3%). Mix is fine; Statement-I/II is somewhat heavy.
- L9 Near-duplicates of tagged PYQs (polity-tagged.json): 1210 stmts 1-2 and 1220/1202 are one step from UPSC-POL-2008-175 (Fifth Schedule scheduled areas) and UPSC-POL-2026-489
  (Sixth Schedule, Assam, Meghalaya, Tripura, Mizoram); round-1 notes on 2003-106, 2003-116, 2005-141, 2024-466 still apply but no item is a copy.

## Flagged facts that may change after the exam year
Counts quoted from the book (about 470 Articles, 25 Parts, 12 Schedules, 22 languages, Union/State/Concurrent List 98/59/52, Ninth Schedule 282 entries) are the
8e figures; amendments after the edition could alter them. Items quoting them (1204, 1208, 1215, 1219, 713) are attributed to the table or the author, except 1219 (L7).
