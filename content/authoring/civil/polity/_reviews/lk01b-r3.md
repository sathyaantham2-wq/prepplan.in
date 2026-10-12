# lk01b round 3 review (rebuilt pack, 140 questions, LK-1.7 to LK-1.13)

Verdict: REVISE (2 HIGH). Counts: HIGH 2, MEDIUM 6, LOW 5.
Checker: `python3 scripts/civil-services/check-civil-pack.py` reports 0 problems.

Method: all 140 re-answered cold from ch01.txt (stems and options only) before keys were opened. My answers matched
the key on all 140 under the reading "statement scoped by its own wording", with the two exceptions below, where the
statement is not scoped and is true in the other table. Explanation statement numbers and the key were also checked by
script (statement n correct/incorrect list vs key set, count items vs count): 0 mismatches. Cited pdf pages checked
against the text (page numbers equal the printed numbers in ch01.txt; footnotes 1-3 on 37/38, 5, 7-10 on 38 confirmed).

## HIGH

### 1113 (LK-1.11, which multi_statement) and 1116 (LK-1.11, howmany): unscoped Table 1.2 facts judged false
- 1113 statement 2: "C.H. Bhabha held Commerce." Key treats it as false (Table 1.1: Works, Mines and Power).
  But Bhabha DID hold Commerce, in Table 1.2 (p.37). The stem is "the Interim Government of 1946 and the transition to
  independence", which does not confine the claim to Table 1.1. The explanation itself concedes "Bhabha had it only in
  Table 1.2". If statement 2 is true, the true set is {1,2,3,4} and NO option is correct.
- 1116 statement 1: "Dr John Mathai held Railways and Transport." Key says false (Table 1.1: Industries and Supplies).
  He held exactly that in Table 1.2 (p.37); the explanation again concedes it. If statement 1 is true the answer is
  "Only one", not "None". A well-read aspirant can defend either.
- Fix: scope the claim ("in the Interim Government of 1946") or replace the statement with one false in both tables
  (e.g. Bhabha held Finance; Mathai held Law). Note 1116 statement 2 and 1119 are already scoped, so the author knows the
  device; 1113 s2 and 1116 s1 simply missed it. Everything else unscoped in LK-1.11 (1107, 1109, 1110, 1111, 1112,
  1114, 1117) is false or true in both tables, checked row by row.

## Items you asked me to attack: all hold
- 714 s2 "extended to women but not to labour": book p.33 says "women and labour (workers)"; in history the 1935 Act
  did reserve labour seats. Not defensible as true. PASS (712 s1 is the true twin; two uses of the idea in the concept, fine).
- 1316 s3 "changed the Governor-General's designation to Secretary of State for India": p.29 gives Viceroy; Secretary of
  State is a new office. Not defensible. PASS.
- "three dominions including Burma" (816 s2, 912 s4, 1007 s2, 1116 s3, 1207 s2): Burma was separated in 1937 and became
  independent outside the Commonwealth in January 1948; never a dominion under the Act. PASS (but see repetition).
- "power to the Constituent Assembly alone" (810 s3, 916 s2, 1009 s3): book p.35 says two Dominions. PASS.
- "Viceroy continued for India alone" (814 s2, 919 s1, 1009 s2, 1109 s2, 1210 s3): p.34 says the office of Viceroy was
  abolished and Mountbatten became Governor-General (p.35). The Mountbatten arrangements do not rescue it: the legal
  office was Governor-General from 15 Aug 1947. PASS.
- "until 15 August 1948" (1318 s2): clear. PASS.
- Table 1.1/1.2 one-statement-per-person items checked row by row: 1101, 1102, 1105, 1107, 1109, 1110, 1111, 1112,
  1114, 1117, 1119, 1120, 1201-1205, 1207-1214, 1217-1220 all correct. Only 1113 s2 and 1116 s1 fail (above).

## MEDIUM
1. 1316 statement 2 "the chapter treats the Company Rule as 1600-1858 and the Crown Rule as 1858-1950" is false only
   by the chapter's headings (1773-1858, 1858-1947). It is attributed to the chapter so it is checkable, and the
   key (None) survives because s1 and s3 are plainly false, but "Company rule from 1600" and "Crown/dominion status until
   1950" are both historically arguable. Prefer one clean falsifier ("Crown Rule 1858-1957").
2. 719 Statement-I "a Joint Public Service Commission to serve a single province together with the Centre": false by
   the book's "two or more provinces"; the 1935 Act also let the Federal Commission serve a province on request, so a
   specialist could call the sentence half-true. Replace with an unambiguous swap (e.g. "Joint Commission for the
   federation and the princely states" was the old wording flagged in round 2 - use "a Joint Commission for the Centre
   and all provinces" or drop).
3. Verbatim reuse across concepts: 26 statements appear 3-5 times in the pack (e.g. "Mountbatten first GG ... swore
   in Nehru" x5: 814, 908, 1007, 1106, 1206; "Constituent Assembly of India formed in 1946 became the Parliament" x4 +
   "replaced ... newly elected Parliament" x4; "no responsibility" x4; "West Bengal" trap x3: 810, 910, 1011). Within a
   concept there is no repeated statement (only 808/819 and 1208/1219 repeat once), so the "2 per concept" rule is met
   at statement level but the learner sees the same sentence in 5 concepts.
4. Idea repetition above the "max 2 per concept" rule (counting all item types):
   - LK-1.9: Assemblies' power to frame/repeal x4 (907 s2, 909 s2, 911 s2, 920 A); 1935 Act governs the interim and may
     be modified x4 (907 s1, 909 s3, 911 s3, 917 s2).
   - LK-1.10: NWFP/Sylhet referendum x4 (1004, 1008 s3, 1012 s1, 1020 B); 1935 Act interim x4 (1003, 1008 s2, 1015 s1,
     1020 D).
   - LK-1.12: Railways and Transport portfolio x5 (1204 opt, 1208 s1, 1211 s1, 1212 s4, 1219 s2).
   - LK-1.13: the Diwani x8 (1302, 1303, 1309 s1, 1310 s2, 1311 s1, 1312 s3, 1317 s1, 1320 C); 1917 declaration x4
     (1306, 1309, 1310, 1314); Cornwallis x4; Viceroy designation x4; 1858 Act x4; 1600/1608 x4.
   - LK-1.11 (3 each): Defence portfolio, Mathai, Liaquat Ali, Mandal, "Viceroy's Executive Council".
   - LK-1.7 (3-4 each, mostly via 701 options): Auditor-General, Federal Court, RBI, Burma separation.
   No idea reaches 3+ in LK-1.8 other than the "3 June / Mountbatten Plan" cluster (803, 805, 811, 812, 816, 818, 820), which
   uses different facts each time.
5. Statement-I/II pattern: 13 of 14 have exactly one false statement, and the key alternates mechanically (I true/II
   false, then I false/II true) through the concepts; only 818 is "both correct", and none tests a genuine
   "II explains I" relation. Learners can learn the pattern. Share is 10% vs 6% in the 2020-26 column.
6. 703 wrong-option notes cite p.33 for "Bihar was already a province / Assam already had a legislature"; p.33 only lists
   them among provinces given bicameral houses. Also, Bihar and Orissa were one province until 1936, so "Bihar and Orissa"
   is a mildly arguable distractor. Not two answers (Sind is the clincher) but the note is loose.

## LOW
- Identical wrong-option notes within one item: 903 (two), 1002 (two), 1004 (two), 1302 (two, "Not what the text gives").
- 708 s1 "autonomy ... discontinued in 1939" is the book's wording; in several provinces ministries continued. Fine as a
  true statement but do not use its negation.
- `pg` lists padded with pages that do not carry the fact (706: 29; 1114: 37; 1201: 36; 1303 fine).
- Weak distractors: 803 options 3-4, 704 option 4, 1004 option 4 ("never held") are easy eliminations.
- Format mix is in line with 2020-26: direct 25% (26), which 45% (48), howmany 15% (12), stmt12 10% (6), match 5%.
  Number of statements: 44 three-statement and 19 four-statement `which` items. No near-duplicate of a tagged PYQ found
  (no PYQ in this history set repeats these sentences; not exhaustively matched against the PYQ file).

## Keys, positions, explanations
- Keys: 140/140 agree with my cold answers, subject to the HIGH above (the 1113/1116 keys are only right if the
  statement is read as confined to Table 1.1).
- Key is always `o[0]` in the pack; options are shuffled at load (checker comment confirms). Not a defect.
- Explanation numbering matches statements after the rebuild (script check, 0 mismatches). Count items state exactly the
  right count. Wrong-option notes on `which` items name the right omitted/included statement.
- Changes after the exam year: none (history chapter).
