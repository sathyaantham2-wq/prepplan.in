# Final verification - lk01b.json and lk03b.json

Method: both packs were answered cold, item by item, from ch01.txt (pdf pp.25-38) and ch03.txt (pdf pp.56-61) before any key was read (260 items: lk01b 7 concepts x 20 = 140, lk03b 6 x 20 = 120). Then keys, pages, explanations and wrong-reasons were compared. Validator `check-civil-pack.py`: 0 problems on both. lk01.json was read only; no lk01-side duplicate is counted against lk01b.

## Verdicts
| Pack | Verdict | HIGH | MEDIUM | LOW |
|---|---|---|---|---|
| lk01b.json | pass | 0 | 4 | 8 |
| lk03b.json | pass | 0 | 5 | 6 |

Wrong keys: 0 of 260. Items with a second defensible answer: 0. Every key equals my cold answer. No fact has changed since the exam years (all are historical or definitional).

Format mix (both packs, every concept 5 direct / 9 which / 3 how-many / 2 Statement-I-II / 1 match = 25/45/15/10/5). The 2020-26 column is 26/48/12/6 plus 3 case study. Acceptable; how-many and Statement-I/II are a little heavy, and the identical counts in every concept look templated (LOW).

---

## lk01b.json

### Re-derived items the owner named
- **1106** (Table 1.1 / 1.2): Table 1.1 members = Nehru, Patel, Prasad, Mathai, Jagjivan Ram, Baldev Singh, Bhabha, Liaquat, Nishtar, Asaf Ali, Rajagopalachari, Chundrigar, Ghaznafar, Mandal. Table 1.2 = Nehru, Patel, Prasad, Azad, Mathai, Chetty, Ambedkar, Jagjivan Ram, Baldev Singh, Amrit Kaur, Bhabha, Kidwai, Mukherjee, Gadgil. Overlap is exactly 7. Statement 1 true; statement 2 false (Mathai: Industries and Supplies, then Railways and Transport); statement 3 true (Labour in both). Key "1 and 3 only" is correct and unique.
- **1115**: each table has 14 rows (counted). S1 true, S2 false (Liaquat is not in Table 1.2; Finance was Chetty), S3 true. "Only two" correct.
- **1216**: S1 false (Chetty), S2 false (14, not 15), S3 false (Mukherjee held Industries and Supplies; Law was Ambedkar). "None" correct.
- **718**: S-I and S-II are both true (p.33). Key says "II explains I". The page reads "Subsequently, the provisions of the Poona Pact were incorporated ... In other words, the composition ... was based on this modified Communal Award." Defensible as an explanation (the incorporation is what makes the composition rest on the modified Award). A strict reader could call II a restatement, but the explanation text quotes "Subsequently" and the stem is fair. Kept as LOW.

### HIGH
None.

### MEDIUM
- **M1 - loose page tags on the Table-count items: 1106 and 1115** (`pg [36, 37]`, and `e` says "pp.36-37"). Table 1.1 starts on p.35 (row 1, Nehru, is on p.35; the table runs pp.35-36). Statement 1 of 1106 needs Nehru (p.35), and statement 1 of 1115 ("fourteen members") needs rows 1-14 of Table 1.1, so p.35 must be cited. Fix: `pg [35, 36, 37]` and "pp.35-37" in `e`.
- **M2 - the same statements recycled across LK-1.8 to LK-1.12.** The Independence Act has about 13 features and the pack reuses verbatim statements: "Act came into force 15 Aug 1947" x4 (808, 819, 908, 1008); "GG appointed on advice of dominion cabinet" x4 (810, 913, 1011, 1206); "HMG no responsibility" x4 (817, 908, 1009, 1209); and x3 each for: secede-with-consent (815, 915, 1007), "three dominions incl. Burma" (816, 912, 1007 plus 1116, 1207), "continued the Viceroy for India" (814, 919, 1009, 1109, 1210), paramountcy continued (807, 914, 1014, 1215), "free to join India or Pakistan but could not remain independent" (809, 912, 1012), Attlee 30 June (915, 1117, 1215), Royal Assent 18 July (818, 911, 1012), SoS functions to GG (816, 1014, 1207), the services statement (814, 907, 1016), the partition statement (815, 910, 1010). The cap of 2 per idea per concept holds, but a fixed false statement that returns in five items is a learnable falsifier, and an aspirant who meets two gets the third free. In LK-1.11 and 1.12 roughly half of all statements are Independence Act filler rather than Table facts. Replace the extras with unused facts: Act items 8-9, 1935 Act items 5 and 9, more Table 1.2 members, Interim Government note.
- **M3 - cue-word tell in false statements.** "but could not remain independent" is false in 809 s1, 912 s2 and 1012 s3 and never appears in a true statement; likewise "forbidden" (1016 s1), "except the Independence Act itself" (1016 s2), "but not for any Provincial PSC" (710 s2), "but not to labour" (714 s2), "but could act against the advice" (912 s1). True statements in the pack rarely carry such hedges. Re-word the falsifiers as plain wrong facts (a wrong date, body or number).
- **M4 - LK-1.11 repeats three Table facts three times each (cap is 2).** Liaquat/Finance: 1102, 1115 s2, 1120 A. Mathai's portfolio: 1106 s2, 1111 s3, 1116 s1. Prasad's portfolio: 1105, 1107 s3, 1115 s3. Replace one of each.

### LOW
- L1. Longest-key tell: 701 (71 vs 68 chars), 803 (79 vs 70), 1005 (94 vs 83). 702/705 are ties of short tokens and not a tell.
- L2. 805 option 4 ("accepted by both parties only after the Independence Act had come into force") is a throwaway distractor.
- L3. Stem/statement mismatch: 710 s4 and 712 s3, s4 (Simon Commission, Communal Award, White Paper) sit under "statements about the Government of India Act of 1935" but are not about the Act. Truth is unaffected.
- L4. Over-wide page lists: 801 (32), 802 (31, 32), 1103 (28, 29), 1301 (37), 1303 (31), 1305 (28, 30, 32), 1306, 1314 (25). Harmless, but the extra pages do not state the fact.
- L5. Duplicated wrong-reasons text inside one item (the three `w` entries are the same sentence): 819, 918, 919, 1019, 1118, 1119, 1218, 1219. Give each rejected option its own reason.
- L6. 802 uses the book's spelling "Radcliff" in the key (the book's wording; fine, but add "(spelled so in the text)" to the explanation).
- L7. 1.7/1.8 overlap: 701-705 and 801-805 share the same "swapped body" style; 704 `tr` "only" is mislabelled (no "only" trap in the stem).
- L8. Six of the 14 Statement-I/II items have a false Statement-I with a true Statement-II (719, 819, 919, 1019, 1119, 1219) - a visible pattern; vary which statement is false.

Near-duplicates of tagged PYQs: none (nearest are UPSC-POL-2015-261 on the 1919 Act, 2017-298 dyarchy, 2024-462 1935 Act; no item restates them).

---

## lk03b.json

### Re-derived items the owner named
- **702**: "mentioned in both Gilchrist's and Gettell's" - distribution of powers among the organs appears in both (p.56). The relation to the people is Gettell only; sanctity of a document is Wade and Phillips only; whole system is Wheare only. Single answer. OK.
- **804**: key is "boundaries of the political community". The stem's gloss ("which territory and which people belong") is an interpretation; the page only says "boundaries of the political community". No other option competes, but see M5.
- **1004**: Australia is in the rigid list (USA, Australia, Switzerland) and the federal list; UK and New Zealand are flexible, Norway unitary. Single answer.
- **1104**: the description is the procedural archetype (p.59). Single answer.
- **812**: S1 and S2 true, S3 ("national organs alone") false against function 6. Key "1 and 2 only" correct. It is the third item built on "confined/alone" (see M2/M3).

### HIGH
None.

### MEDIUM
- **M1 - near-duplicates of lk03.json (the first half of the same chapter).** Direct items that restate an lk03 item: 704 = lk03 101 (same stem, key paraphrased); 903 = lk03 304 (same stem, key "Rigidity"); 1002 = lk03 403 (enacted = conventional); 1204 = lk03 603 (Friedrich quote); 901 = lk03 303 (adaptability, "living document"); 803 = lk03 204 (eight functions); 904 = lk03 305 (stability and obedience); 1202 / lk03 602 (same stem, different false option); 703 / lk03 102 and 802 / lk03 202 (same "NOT among" angle, different false option). Statement-level overlaps: 1118 with lk03 519 and 515; 1210 with lk03 609, 611 and 616 (all four statements); 819 with lk03 215 and 216; 1216 with lk03 619 and 606. If both packs load, a student can meet the same fact twice. Re-angle or drop these.
- **M2 - repetition above the cap of 2 per idea per concept.** LK-3.8: "divide or share power" in 806 s3, 809 s4, 811 s3, 812, 819 and 820 C (6); "commit states to goals" in 805, 807 s3, 810 s3, 811 s1, 814 s1 and 820 D (6); "establish and regulate institutions" in 810 s2, 811 s4, 813, 816 s2 and 818 (5); "boundaries" in 804, 806 s1, 813, 816 s1, 820 A (5). LK-3.9: "discretion of the judges" in 902, 906 s3/s4, 915 s3, 917 s3, 920 B (6); "controversies and litigations" in 907, 917, 918, 920 C (4). LK-3.7: Wade and Phillips "document with special legal sanctity" in 701, 709, 711 s3, 719, 720 D (5+). LK-3.11: "prescriptive assumes a consensus on goals" in 1109, 1112, 1113, 1114, 1117, 1119, 1120 (7); "procedural defines structures and limits power" in 1104, 1108, 1113, 1114, 1120 (5). Some of this is forced by a very short source list (eight functions, four definitions), so the fix is partly to merge thin concepts or to take other facts from the chapter (footnote 5, Henkin list, Latin root, Bryce).
- **M3 - cue-word tell in LK-3.8.** False statements carry hedges that true statements lack: "cannot demarcate" (806 s4), "must perform all" (808 s3), "confined to" (811 s3, 818 S-II), "alone" (812 s3), "leaves their duties to ordinary law" (809 s2). Re-write as plain wrong facts.
- **M4 - 703 key rests on the book's silence about a real-world true option.** "Social contract" is a common real-world description of a constitution, so the key "NOT among the descriptions" is true only because the chapter does not list it. The stem is anchored ("in Laxmikanth's chapter"), which is why this stays MEDIUM, but the Falsifier rule says never to use "false only because the book is silent". Replace the key with something no aspirant would call a description of a constitution (for example "Statute of the legislature").
- **M5 - 804 stem gloss is not on the page.** "specifies which territory and which people belong" reads function 1 as territory plus membership. The page only says "boundaries of the political community"; the explanation's reason for option 2 ("who and what it covers") is likewise interpretive. Either quote the page wording in the stem or accept it as an application item and tag it so.

### LOW
- L1. 1218: II ("power is unlimited in a dictatorship") is the example the page gives, so "II explains I" is reasonable, but a strict reader could call it an illustration only. Add "as in the case of a dictatorship" to `e`.
- L2. 1109 s3 ("sets goals that public authorities must strive to achieve") is slightly looser than the page ("assumes a broad consensus on common societal goals that public authorities must strive to achieve"); the key is unaffected.
- L3. Longest-key tell: 804 (64 vs 60), 805 (67 vs 66). 803 "Eight", 905 "Seven" and 1003/1204 are short-token ties.
- L4. Terse or duplicated `w`: 903 ("Listed (quality 1)." etc.), 1202 ("Listed as element 3." etc.), 1101 (first two entries identical). Give a one-line reason each.
- L5. 1020 has three List-I rows and four List-II entries; List-II item 1 ("Unwritten and federal") matches no row. Fair, but say so in `e`.
- L6. The identical 5/9/3/2/1 counts in every concept (see top).

Page tags: every pg checked against the PDF page headers; all state their fact (e.g., functions 1-7 on p.56 and function 8 on p.57; rigid/flexible and fed/unitary lists on p.58; procedural/prescriptive on p.59; Henkin list on p.60; Bulmer footnote on p.60). No loose pages.

Near-duplicates of tagged PYQs: none (UPSC-POL-2014-255, 2020-381, 2021-415 and 2023-449 test "constitutional government = limited government"; no lk03b item restates them; 1205 and 1215 are the nearest and differ in angle).

---

## Counts to quote
- lk01b: HIGH 0 (none) / MEDIUM 4 (M1 1106, 1115; M2 recycled statements; M3 809, 912, 1012, 1016, 710, 714; M4 1102, 1105, 1106, 1107, 1111, 1115, 1116, 1120) / LOW 8 (L1-L8).
- lk03b: HIGH 0 (none) / MEDIUM 5 (M1 704, 903, 1002, 1204, 901, 803, 904, 1202, 703, 802, 1118, 1210, 819, 1216; M2 LK-3.7/3.8/3.9/3.11; M3 806, 808, 809, 811, 812, 818; M4 703; M5 804) / LOW 6 (L1-L6).
