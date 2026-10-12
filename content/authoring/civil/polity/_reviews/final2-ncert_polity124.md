# Final2 review: ncert_polity1, ncert_polity2, ncert_polity4 (polish pass fp124, 2026-10-12)

Method: all 25 listed items re-solved cold from the saved packs against Laxmikanth (ch02, 03, 04, 05, 11, 13, 15, 18, 66, 95) and the extracted Class 7 (gees109, gees110) and Class 9 (iest106) text. Keys, option sets, w[] to o[1..3] mapping, page cites and scope_in pages checked.

Tools: check-civil-pack.py = 0 problems on all three packs. dup-check.py at 0.78 = 0 hits on all three. Overlap of each listed item with polity-tagged.json (494 PYQs) peaks at 0.30 Jaccard (ncp2 5-17); no near-duplicate of a tagged PYQ. Format mix (identical in the three packs): direct 25 / which 45 / how-many 15 / Statement-I-II 10 / match 5 percent, against the 2020-26 column of the trends doc (direct 26, statements 48, how-many 12, S-I/II 6): fits.

## Verdicts
| Pack | HIGH | MEDIUM | LOW | Verdict |
|---|---|---|---|---|
| ncert_polity1 | 0 | 0 | 3 | pass |
| ncert_polity2 | 0 | 1 | 3 | pass |
| ncert_polity4 | 0 | 0 | 1 | pass |

HIGH ids: none in any pack.

## Particular facts requested
- ncp1 4-12: Laxmikanth Ch.5 p.87 says the term 'republic' means an elected head called the President, elected indirectly for a fixed five years; monarchy is succession (Britain). Six-year falsifier is false in real law. Key '1 and 3 only' correct, w[] consistent.
- ncp1 6-16: Shane story is in gees109 p.203 (North Korea; rules; compulsory military service until government decides; cannot access global internet; expected to report rule-breakers). Statement 3 false, key 'Only three' correct.
- ncp1 3-20: A responsible government (p.206) = 3; B prime ministerial government (p.206) = 4; C Kitchen Cabinet (p.207, advisory body of non-elected departmental secretaries of the US President) = 2; D shadow cabinet (p.211) = 1. Unique key A-3 B-4 C-2 D-1; w[] map to o[1..3] correctly (swaps A/B, C/D, B/C).
- ncp2 1-13: Table 4.2 pp.76-77: 123 President's ordinances (76); 213 Governor's ordinances (77); 161 Governor's pardon (77); 239AA Delhi (77); 74 council for the President (76); 163 council for the Governor (77). Statements 1 and 4 false, 2 and 3 true, key '2 and 3 only' correct and unique.
- ncp2 5-14: Laxmikanth Ch.2 p.46 (Raizada, italic) and p.47 (Shantiniketan artists incl. Nand Lal Bose and Beohar Rammanohar Sinha; Sinha illuminated the Preamble; Hindi calligraphy by Vasant Krishan Vaidya, decorated by Nand Lal Bose). Statement 4 false, key '1, 2 and 3 only' correct. gees110 p.223 does credit Raizada and Nandalal Bose.
- ncp4 1-12: Ch.2 p.40: Congress 208, League 73, others 15 (total 296); 93 princely seats not filled; Gandhi the exception. Key '1 and 4 only' correct.
- ncp4 6-12: iest106 p.149: 'over 96.8 crore registered voters' in 2024; 69.8 is the swap. p.150 supports statement 3. Key correct.
- ncp4 1-09: Ch.2 p.41: Objectives Resolution adopted unanimously 22 Jan 1947; Independence Act made the Assembly fully sovereign; 42nd Amendment added Socialist, Secular, Integrity (not Democratic/Republic). Key '1 and 3 only' correct.

## Other items (all recomputed; keys correct, single defensible answer, w[] cover o[1..3], no truncated reasons)
ncp1 3-05 (Arts 163-164, Ch.13 p.206), 3-18 (does not explain), 4-05 (Class 7 p.185 epigraph, raksha/palana/yogakshema), 5-12 (2,3,4; stmt 1 contradicts p.208), 6-18 (explains, p.209), 7-19 (explains). ncp2 1-11 (p.58), 1-12 (1,2,4; Part III is Arts 12-35), 3-16 (Only three), 5-02 (Ch.11 pp.193-194, 24th Amendment), 5-17 (All three), 6-08 (1 and 3), 6-14 (1,2,3). ncp4 4-15 (All four, Ch.66 p.722), 4-18 (iest106 p.154, does not explain), 5-19 (Ch.95 p.977: communal citizenship regarded MORE valuable, so II incorrect), 7-16 (Only three, iest106 pp.155-156).
scope_in of ncp1: page ranges 185-207 match the gees109 page headings; Laxmikanth list (Ch.13 pp.206-212, Ch.15 p.226, Ch.18 p.293) confirmed.

## Findings
MEDIUM
- ncp2 CS-POL-ncp2-3-16 (pg [85, 88]): e says statement 3 rests on 'Ch.5 p.85 (footnote 1 ...)'. The footnote text (moved 13 Dec 1946, adopted 22 Jan 1947) is printed on PDF page 91, not 85; only the footnote marker is on p.85. Fact is true, cite is loose. Fix: say p.91 and add 91 to pg.

LOW
- ncp1 CS-POL-ncp1-7-19: key 'II explains I' is supported by the Class 7 definition (p.194), but a candidate could argue II is just one feature and pick 'does not explain'. Acceptable; consider "because" wording if tightened.
- ncp1 CS-POL-ncp1-3-05: w[] cite Ch.15 p.226 and Ch.18 p.293, which are not in pg [206]. Correct and in scope_in, only pg is short.
- ncp1 CS-POL-ncp1-3-20: Kitchen Cabinet description follows Laxmikanth p.207 (non-elected secretaries); real-world Kitchen Cabinet is informal advisers and in India an inner cabinet. Matches the cited text, so left.
- ncp2 CS-POL-ncp2-1-12: statement 1 'Articles 324 to 329-A form Part XV' mirrors Laxmikanth Table 4.1 (p.74); Art. 329A was omitted by the 44th Amendment, so real Part XV is 324-329. Stem says 'as tabulated in Laxmikanth' and no other option turns on it.
- ncp2 CS-POL-ncp2-5-14: w[] cite p.46 for statement 4, which is on p.47.
- ncp2 CS-POL-ncp2-5-17: statement 1 ('no other Constitution has a local tier') is Laxmikanth's overclaim (p.69), attributed in the stem; fine.
- ncp4 CS-POL-ncp4-5-19: pure Laxmikanth trivia (communal vs cantonal citizenship) but fairly framed and cited on p.977.

Nothing here blocks the packs. Packs were not edited; no database or git used.
