# lk01b review r4 (140 questions, LK-1.7 to LK-1.13)

Verdict: **pass** (HIGH 0, MEDIUM 5, LOW 6).

## Method
- Re-answered all 140 cold from ch01.txt (pp.25-38, Tables 1.1 and 1.2) before opening the keys. All 140 keys match my answers.
- The key is always `o[0]` in the file; options are shuffled at load (reshape-options.py header says "keeps the key first"). Not a defect.
- For every `which` / `howmany` item I recomputed the key from the truth flags in `e`; label and count agree with `a` on all items.
- `python3 scripts/civil-services/check-civil-pack.py` still reports 1 problem (see M1).

## Claimed edits: all present in the saved file
- 1113 st.2 reads "held Commerce in the Interim Government of 1946". It is false: Bhabha held Works, Mines and Power in Table 1.1, and Commerce was Chundrigar's. The key "1, 3 and 4 only" is correct.
- 1116 st.1 reads "held Railways and Transport in the Interim Government of 1946". It is false: Mathai held Industries and Supplies and Asaf Ali held Railways and Transport. St.2 (Ambedkar, Law) and st.3 (three dominions) are also false, so "None" is correct.
- 1316 st.2 "Crown Rule 1858-1957" is false. p.25 gives the Crown Rule as 1858-1947 and says it ran until 15 August 1947. St.3 "power of voting on the budget" is false. p.30 gives "discussing the budget" and the footnote says the Budget system began in 1860. Historically the 1892 Act gave discussion without voting. St.1 "five other judges" is false (three, p.25). Key "None" is correct, and the falsifiers are no longer ambiguous.
- 719 St-I reads "a Joint Commission to serve the Centre and all the provinces together". It is false: p.34 says a Joint Commission for two or more provinces, and a separate Federal Commission. St-II is true. The key is correct.
- 703 options are Orissa and Sind / Orissa and Punjab / Sind and Madras / Orissa and Burma. Only the key is correct (p.34).
- 718 now says "II explains I". 1318 and 1319 say "II explains I". 818 and 1018 say "does not explain". Details of the links are below.

## Replaced statements, checked against the page and against both tables
All of the following are false or true as the key says, and each holds on its page.
- Charter Act 1793, p.27: twenty years is true (1317 st.2); "ten years" is false (1310 st.1).
- Charter Act 1853, p.28: six legislative councillors (1303 key; 1309 st.1 "four" is false). The four is a real figure, but it counts members nominated by the provinces. The page states "six new" clearly, so the falsifier is fair.
- Charter Act 1833, p.28: legislative powers were taken from Bombay and Madras (1314 st.2 "executive" is false). Bentinck was the first Governor-General of India (st.3 true).
- Councils Act 1861, pp.29-30: Canning nominated three Indians in 1862 (1311 st.1 "five" is false). Ordinances last six months (1312 st.3 "one year" is false). The portfolio system is 1859.
- Councils Act 1892, p.30: discussion of the budget (see 1316 above).
- Councils Act 1909, pp.30-31: members raised from 16 to 60 (1309 st.3 true). Minto, not Morley, is the Father of Communal Electorate (1314 st.1 false). Sinha was the first Indian to join the executive council, as Law Member (1317 st.1 true).
- Chamber of Princes, p.32: headed by the Viceroy (1309 st.2 "Secretary of State" is false).
- Pitt's India Act, fn 2 on p.37: Pitt introduced it (1311 st.2 true, 1312 st.2 "Lord North" false).
- Cornwallis demanded both the veto and the Commander-in-Chief post (1307 st.2 "declined" is false, 1308 st.3 true).
- Macaulay Committee: 1854 (1307 st.3 "1861" is false).
- Covenanted service, fn 3: the higher service, created by a law of the Company (1313 st.1 and 1317 st.4).

## Statement-I/II relations
- 718: p.33 reads "Poona Pact incorporated ... In other words, the composition ... was based on this modified Communal Award." II explains I is defensible. See L2.
- 1318: p.29 "In pursuance of this policy of association, three acts ..." follows the sentence about the necessity felt after 1857. II explains I. Textual link confirmed.
- 1319: p.28 "it did not specify any particular period ... This was a clear indication that the Company's rule could be terminated at any time". The inference is the book's own, so II explains I. Confirmed.
- 818 and 1018: independent facts, "does not explain" is right.
- 719, 819, 919, 1019, 1119, 1219: I incorrect, II correct, as keyed.
- 918, 1118, 1218: I correct, II incorrect, as keyed. Table 1.1 gives Patel no States portfolio. The Note on p.36 says the Viceroy continued as head.
- Shape mix across the 14 items is now varied. Not monotone.

## Format mix against the trends doc
Every concept is exactly 5 direct, 9 which, 3 howmany, 2 stmt12, 1 match. That is 25 / 45 / 15 / 10 / 5 per cent.
- The 2020-26 column is direct 26, which 48, howmany 12, Statement-I/II 6.
- The mix is acceptable; stmt12 and howmany are a little heavy.
- The mix is identical in every concept (see L5).

## Near-duplicates of tagged PYQs
None found. Only UPSC-POL-2024-462 (GoI Act 1935: federation) and UPSC-POL-1996-021 (last Governor-General) are nearby, and no pack item restates them.

## Findings

HIGH: none.

MEDIUM
- M1. The checker fails: "LK-1.13: one option set reused 3x (max 2)". The set `1 and 3 only / 1 only / 2 only / 3 only` is shared by 1309, 1312 and 1314. Rebuild the options of one of them (reshape the option pool, or change the truth pattern of one item).
- M2. Off-concept filler in LK-1.11 and LK-1.12. 1106, 1115 and 1216 contain no Table 1.1 or 1.2 fact at all. They are pure Independence Act items under a "Table 1.1 / Table 1.2" concept. 1118 has only one table fact.
- M3. Heavy cross-concept reuse of the same Independence Act statements, across LK-1.8 to LK-1.12. No concept has 3 or more of one idea except the ones in M4. Pack-wide counts:
  - "Mountbatten became first GG ... swore in Nehru/Patel": 5 (814, 908, 1007, 1106, 1206).
  - "CA became/was replaced by Parliament": 8 (815, 817, 912, 913, 1110, 1112, 1212, 1214).
  - "HMG no responsibility": 4.
  - "Pakistan included provinces": 3 (808, 917, 1010 East Bengal) plus 3 (810, 910, 1011 West Bengal).
  - "Act declared independent from 3 June": 3.
  - "Boundary Commission headed by Mountbatten": 3.
  - The Act has only about 13 features, and the pack is padded. An aspirant who sees two of these in a sitting gets the third free.
  - Reduce each to 2 or fewer, substituting unused features: items 8 and 9 of the Act, the 1935 Act items 5 and 9, Table facts, and more Table 1.2 members.
- M4. Within-concept triples. LK-1.7: dyarchy at the Centre (713, 714, 715), Poona Pact (712, 714, 718) and Communal Award (712, 717, 718). LK-1.13: the 1892 budget (1310 true, 1316 false, 1318) and Pitt (1307, 1311, 1312). These are paired true/false versions of the same fact. Acceptable, but each is at the limit. Replace one per set.
- M5. Page tags are loose on 1113 (`pg [36]`) and 1116 (`pg [36]`). 1113 st.3 and st.4 are on pp.34-35, and 1116 st.3 is on p.34. Add 34/35 to 1113 and 34 to 1116, and add 37 to 1113 for the Commerce-in-1947 context. 703 pages [25, 30, 34] are acceptable. 802 pg [32, 38] cites p.32 for the Simon distractor, which is harmless.

LOW
- L1. 802 and 1001 are near-duplicate stems (Boundary Commission headed by Radcliff), in LK-1.8 and LK-1.10. Change one to the referendum or the Sylhet fact. 902 and 1011 st.2 and 913 st.1 also all test GG-on-dominion-cabinet advice.
- L2. 718 relies on "In other words" as a link. A strict reader could call II a restatement of I. Defensible and not wrong. For a more robust key, quote "Subsequently" in `e`.
- L3. 719: all three `w` entries are the identical "Rejected: Statement-I is incorrect" text. Give each distractor its own reason (for example "II is correct, and it does not explain a false I").
- L4. 1116 `w` text reads "exactly 0 are correct (statements none)". Rephrase. 704 option 4 ("the Reserve Bank and the Federal Railway Authority alone") is a throwaway distractor. 1001/802 "Simon" and "Attlee" as Boundary Commission heads are weak distractors.
- L5. Identical 5/9/3/2/1 format counts in every concept look templated. Vary at least two concepts by one item (for example 4 direct / 10 which). Consider fewer stmt12 (10 per cent against 6) and howmany (15 per cent against 12).
- L6. The book's spellings "Radcliff" and "Bentick" are used in options (Radcliff) or avoided (Bentinck). Radcliff is the book's wording, so it is fine. Note that the book's Pitt/North and the Interim Government table agree with standard history.

## Repetition (ideas at 3 or more per concept)
LK-1.7: M4 items only. LK-1.13: the 1892 budget and Pitt only. LK-1.8 to LK-1.12: none within a concept (the pack-wide repeats are in M3). The earlier Diwani x8 and Railways portfolio x5 are resolved. Diwani appears twice in LK-1.13 (1302 and the 1320 key). Railways and Transport is spread over 1114, 1116, 1120, 1208 and 1219, and each use is a different test.

## Explanation numbering
All `which` and `howmany` explanations number every statement. Counts match the statements in the stem on all 140 items.
