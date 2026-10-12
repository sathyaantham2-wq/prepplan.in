# Final verification: lk03, lk03b, lk05 (post-polish)

Method: diff vs saved originals; mechanical checks (key in options and equals o[0]; explanation Statement-n lists and counts reproduce key; w-notes name existing options; no duplicate options or ids); check-civil-pack.py (0 problems on all three); every item cold-answered from chapter text (ch03.txt, ch05.txt) before comparing with key.


## lk03: changed items (75)
101, 103, 105, 106, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 119, 202, 203, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 302, 306, 308, 309, 310, 311, 312, 314, 315, 316, 317, 407, 410, 413, 414, 415, 416, 417, 503, 505, 506, 507, 509, 511, 513, 514, 515, 516, 517, 520, 601, 602, 605, 606, 607, 609, 610, 611, 612, 613, 615, 618, 619


## lk03b: changed items (51)
701, 703, 704, 709, 715, 716, 719, 802, 806, 809, 810, 812, 814, 815, 816, 817, 820, 901, 902, 904, 906, 907, 908, 909, 911, 914, 917, 918, 919, 1001, 1005, 1015, 1020, 1109, 1114, 1115, 1118, 1120, 1201, 1202, 1205, 1208, 1209, 1210, 1211, 1212, 1213, 1214, 1215, 1219, 1220


## lk05: changed items (55)
105, 106, 107, 113, 114, 115, 207, 209, 212, 213, 214, 215, 216, 217, 302, 306, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 403, 404, 405, 406, 408, 409, 410, 411, 412, 413, 414, 416, 503, 506, 507, 508, 513, 515, 517, 601, 602, 603, 604, 605, 609, 610, 611, 613, 618


## Findings

### lk03 - verdict PASS (HIGH 0, MEDIUM 1, LOW 3)
- All 120 items cold-answered (every changed, every Statement-I/II, every match, all others). Zero key disagreements.
- MEDIUM: near-duplicate stems with identical key across packs: lk03-104 / lk03b-702, lk03-203 / lk03b-804 (identical stem), lk03-501 / lk03b-1004, lk03-505 / lk03b-1104 (0.98 similarity).
- LOW: 318 and 418 and 518 (St-II "explains" St-I) are judgment calls; text supplies the reason in 318, the rest follow "Hence". A solver could argue "does not explain" for 418, but the key follows the chapter's causal wording.
- LOW: 410 st.4 (Canada "non-documentary") is false per chapter and essentially false in real law (Canada's Constitution Acts are documents), though Canada also relies on unwritten conventions.
- LOW: 618 (II does not explain I) is fair; 302 distractors clean after Clarity removed; 106 st.1 ("to declare/proclaim") false per p.56; 109 footnote statement gone; 610 re-angled correctly (st.3 falsified by p.60 "not government limited only by...").
- No changed item has a distractor that became also-supported.

### lk03b - verdict PASS (HIGH 0, MEDIUM 1, LOW 2)
- All 120 items cold-answered. Zero key disagreements.
- 1020: UK=Unwritten+unitary, Canada=Written+federal, France=Written+unitary all verified from p.58 lists; List-II item 1 matches none; permuted options all wrong. Clean.
- 1118: II (inelastic) does not explain I: correct. 806 st.4 false (chapter: declare religious identity AND demarcate sacred/secular): correct. 'None'/'All'/'Only' count keys (716, 817, 917, 1015, 1215, 816) all reproduce the explanation lists.
- MEDIUM: cross-pack near-duplicates with lk03 (see above).
- LOW: 812 st.3 ("dividing/sharing power arises in a federal state, not a unitary state") is falsified by the chapter's own p.58 text (regional governments in a unitary system exercise delegated powers) and by real devolution examples (UK, Italy); defensible but not an explicit chapter sentence, so it is a reasoning falsifier. Acceptable.
- LOW: 1219 St-II falsifier ("satisfied when conferred by a constitutional document provided ruler elected") rests on p.59 point 3 (arbitrary power even if constitutionally conferred is a negation); fair.

### lk05 - verdict PASS (HIGH 0, MEDIUM 0, LOW 2)
- All 120 items cold-answered. Zero key disagreements.
- 209: key "1 and 4 only" correct (SC said leaning heavily towards Gandhian; Avadi 1955, not 1947). 318: I incorrect (broader sense, p.87), II correct (25 Nov 1949): correct. 610: key "1 and 3 only"; st.2 false (LIC 1995 held integral part, p.90): correct. 215 (continued Commonwealth membership; UNO) and 217 (only st.1 true; dominion 15 Aug 1947 - 26 Jan 1950; UNO 1945) verified. 411 st.2 ("association") not in the Preamble: false in real text as well.
- LOW: 603 pg lists 85 unnecessarily (Bhargava quote is p.89); 118 AR "explains" is mild (the 1976 addition is the reason the present text has the word).
- LOW: 518 treats the fraternity/single citizenship and Art 51-A duty as "does not explain"; fair, though a solver could call the duty a further instance.

## Mechanical results
- check-civil-pack.py: 0 problems on lk03, lk03b, lk05.
- Key equals o[0] and is in options for all 360 items; no duplicate options or ids; w-note counts match options; every w-note quoting an option names an existing one (apparent misses in my regex for 'Codified', 'Documentary', 'Cumulative' are w-notes quoting option fragments inside longer options/phrases, not wrong references).
- Statement count/list vs explanation lists reproduce the key for all multi_statement items; A-R keys agree with the explanations (regex flags on 318/418/518 etc. were false positives, checked by hand).
- Format mix per pack (identical): 30 mcq, 54 list-multi-statement, 18 how-many, 12 Statement-I/II, 6 match. Versus the 2020-26 column (about 48% consider-the-statements, 12% how-many, 6% St-I/II): St-I/II slightly high (10%), acceptable.
