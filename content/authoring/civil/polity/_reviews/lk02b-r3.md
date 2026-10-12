# lk02b review, round 3

Pack: content/authoring/civil/polity/packs/lk02b.json (120 items, LK-2.7 to LK-2.12). Source: ch02.txt (Laxmikanth pp.39-55).
Verdict: **PASS**. HIGH 0, MEDIUM 6, LOW 5.

## Method
All 120 answered cold from ch02.txt, concept by concept, before reading keys. All 120 keys match my independent answer.
Table arithmetic was recomputed: Table 2.2 sums, Table 2.3 sums (296), Table 2.4 constituency counts, Table 2.5 province and state values, Table 2.6 session lengths and years.
A script checked that every "Statement N is correct/incorrect" line in the explanations agrees with the key and with the statement count for all which/howmany items. It found no mismatches and no duplicate options.
`check-civil-pack.py` on the pack: 0 problems.

## Fixer-changed items (each distractor and each false statement re-checked against the chapter)
- 704: the key is p.40 verbatim. Provincial assemblies elected only British Indian members, so "filled by provincial-assembly members" is wrong. Nothing in the chapter supports the Viceroy or Congress-ticket options. The fixer's earlier second-answer problem is gone. OK.
- 709 (Objectives Resolution): 1 and 3 are true; 2 (26 Nov 1949, actually 22 Jan 1947) and 4 (Dominion, actually "Independent Sovereign Republic") are false, all on p.40-41. OK.
- 710 (princely states): key 1, 3 and 4 is right. 1 is p.39. 2 is false (seats unfilled, p.40). 3 is 28 April 1947, six states. 4 is the Mountbatten Plan, p.41. Only one defensible combination. OK.
- 712: 208 against 73+15=88 is true and the ML did not win more than 100. OK.
- 818: Statement-I is false (Gandhi was the exception) and II is true. OK.
- 1017: footnote 6 (p.54) gives 17 Nov 1947 and Mavlankar as speaker; the other two statements are on p.41. Exactly two are correct. OK.
- 1019: I and II are both true and II does not explain I. OK.
- 1110: the American framers took "only four months" (p.46). OK.
- 1112 (Ambedkar): 26 January (should be 26 Nov), Home Minister (should be Law Minister) and 4 Nov 1949 (should be 1948) are all false. "Chief architect" is true. Only "3 only" is correct. OK.
- 1119: p.45 gives the reason ("because of its historical importance. It was on this day in 1930..."), so II explains I. Unambiguous. OK.
- 1217 and 1218: the sitting places and the chairman are correct, and 1218 II is true but not explanatory. OK.
- 1010: statement 1 is false by Table 2.6 (the Eleventh Session ended 26 Nov 1949). Statement 4 is false because the Assembly continued as the provisional parliament. OK.

## Findings
### HIGH
None.

### MEDIUM
1. **CS-POL-ch02-918** (stmt12). The key is "II explains I", which follows the book's "Consequently" on p.41-42. But 389 to 299 is a drop of 90, and the Muslim League withdrawal accounts for only 67 (296 to 229). The other 23 is the princely states' fall from 93 to 70, which the chapter does not attribute to the League. A careful candidate can defend "both correct, II does not explain". Fix: make Statement-I "the strength of the Indian provinces fell from 296 to 229", which II explains cleanly.
2. **Repetition, LK-2.7** (limit is 2 per idea):
   - "Not directly elected / wholly elected" is the false claim in 707(1), 711(1) and 717(4). 718 tests the same idea as "nominated".
   - "Princely-states' 93 seats were unfilled" appears in 704, 710(2) and 719.
   - The Congress 208 / ML 73 split is tested in 708, 712, 716 and 720.
   - Drop one item from each cluster (suggest 711(1), 710(2) as a pure repeat, 716).
3. **Repetition, LK-2.8.** Table 2.4 constituency lookups fill 805, 809, 811, 815, 817 and 820, six items for one table. "Fifteen women" is in 802, 811, 815 and 819. "All important personalities except Gandhi" is in 812 and 818, which is the allowed two. Vary 815 or 817 into a different fact.
4. **Repetition, LK-2.9.**
   - Madras 49 and UP 55 is in 903, 908, 915, 919 and 920.
   - The 389 to 299 change is in 906, 910 and 918.
   - Bombay 21 is in 905, 911, 917 and 920.
5. **Repetition, LK-2.10.**
   - "Eleventh Session / 26 Nov 1949" is in 1007, 1010, 1013, 1016 and 1018.
   - "24 Jan 1950 final meeting" is in 1004, 1010 and 1018.
   - 1018 and 1019 both use the "both true, II does not explain" key, so the key pattern is repeated.
6. **Repetition, LK-2.11 and LK-2.12.**
   - 2.11: the Table 2.8 article/subject pairs fill 102, 104, 108, 116 and 120, five items for a four-row table. The drafting-committee days (114 or 141) are tested in 106, 113 and 117.
   - 2.12: B.N. Rau / Iyengar / S.N. Mukherjee / Raizada roles are in 203, 209, 216 and 220. The Experts Committee sittings are in 206, 213 and 217.

### LOW
1. Loose pages: 807 cites [49], but Indian Christians (6) is on p.48. 810 cites [49], but Scheduled Castes and Indian Christians are on p.48. 817 adds an unneeded p.50.
2. 704 option W says "The Viceroy had no role in filling the states' seats". The chapter never mentions the Viceroy, so this explanation is unsupported, though harmless.
3. Several howmany explanations have typos such as "(statements 1)". The 1112 W for "1 only" says only that it "includes statement 1" and omits that it also leaves out statement 3.
4. 1212 statement 2 ("with the convener, nine members") is correct, since Kripalani was both member and convener, but the wording could be read as the convener being extra. Suggest "counting Krishna Kripalani".
5. Format mix: direct 25%, which 45%, howmany 15%, Statement I/II 10%, match 5%. The 2020-26 column is 26/48/12/6, so this is close. Statement I/II is a little high and there is no case-study item. Heavy table-lookup arithmetic, with few conceptual items such as the criticisms or the Independence Act, leaves recall at the expense of two-step reasoning. No near-duplicate of a tagged PYQ was identified.

## Counts
HIGH 0 / MEDIUM 6 / LOW 5. Verdict: pass. HIGH ids: none.
