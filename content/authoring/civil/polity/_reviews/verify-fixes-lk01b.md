# Verification of fixes - lk01b.json

Scope: the 47 changed ids (CS-POL-ch01-), each cold-answered from ch01.txt (pdf pp.25-38, Tables 1.1/1.2 on pp.35-37) before the key was read. Validator `check-civil-pack.py`: 0 problems. lk01-side duplicates not counted.

## Verdict: pass (HIGH 0, MEDIUM 4, LOW 6)

- Keys: 47 of 47 match my cold answer; each has a single defensible answer.
- Falsifiers: every new falsifier is false per the chapter text. Real history agrees, with one soft spot (1009 s3, below).
- w-notes: all 47 have 3 w-notes, each aligned to the corresponding distractor after the reshape (o[1..3]). Spot-checked the stmt12 items (919, 1118, 1119, 1218, 1219) option by option.
- Page tags: all state their fact. 1106/1115 now include p.35 (Nehru row, Table 1.1) and are fixed. 1305 [38] is correct because the footnote sits on p.38.
- 919 and 1119 (new "I correct, II incorrect" keys) are correct. 919 S-II "retained the office of Viceroy" is false (office abolished, p.34). 1119 S-II "Defence held by Jagjivan Ram" is false (Labour; Defence was Baldev Singh, p.36). The Statement-I/II keys across the pack are now varied (2 both-correct, 4 "I incorrect/II correct" counting 719/819/1019/1219, 7 "I correct/II incorrect"), so the earlier L8 pattern is resolved.

## HIGH
None.

## MEDIUM

**M1 - 1009 s3 falsifier is soft in real history.** "Power was transferred to the Indian National Congress and the Muslim League." The chapter says power went to the two new Dominions (p.35). Many standard histories do say power was handed to Congress and League leaders, so an informed aspirant can defend the statement. The key "1 only" still stands, because s2 is flatly false, but s3 fails the Falsifier rule. Replace s3 with a plain wrong fact, for example "power was transferred to the British Crown's Governor-General alone".

**M2 - Idea cap of 2 per concept is still exceeded on the Independence Act ideas.** Counts are per concept and include statements, key and option text.
- Viceroy abolished / Governor-General for each dominion in LK-1.9 has 3 touches: 901 (option 2), 918 S-II, 919. Change 918 S-II to a different falsifier, such as a wrong transfer date.
- Tribal-area treaty relations in LK-1.9 appear 3 times: 908 s3, 913 s3, 917 s3. 908 and 913 were both in this fix batch. Replace one of the three.
- Monarch's veto / GG assent: LK-1.9 has 4 (906 s2, 913 s1, 917 s4, 920 B). LK-1.10 has 5 (1001 s1, 1005, 1009 s1, 1015 s2, 1020 C). 1005 and 1009 are changed items, so thin them out.
- Attlee announcement of 20 Feb: LK-1.8 has 4 (801, 808 s1, 819, 820 A). 801 and 808 s1 test the identical fact ("followed by agitation of the Muslim League"). LK-1.9 has 4 (911 s3, 914 s2, 915 s1, 917 s2).
- Secretary of State for Commonwealth Affairs used as the swapped body in LK-1.10: 1009 s2, 1013 s2, 1014 s3, 1016 s1 are 4 touches. The recurring decoy is a learnable falsifier.
- Lower severity: paramountcy lapse in LK-1.10 has 3 (1005 option, 1008 s3, 1018 S-II). The 1005 one is only a distractor option.
- Within the cap: GG on advice of the dominion cabinet (810, 902, 1012), HMG no responsibility (817, 903), came into force 15 Aug (808, 819 in 1.8; 916 in 1.9), Radcliff (two per concept), free-to-join (two per concept), the Poona/1935 ideas.

**M3 - Table-1.11 portfolio facts: the three named facts are at 2 each (within cap), but neighbouring facts are over the cap.**
- Liaquat/Finance: 1102, 1120 A = 2 (1110 s4 uses Finance as a Chundrigar falsifier; fine).
- Mathai: 1106 s2, 1116 s1 = 2.
- Prasad/Food and Agriculture: 1105, 1115 s3 = 2 (1117 s2 uses it as a Jagjivan falsifier, a soft third).
- Over the cap in LK-1.11: Baldev Singh/Defence appears in 1109 s2, 1117 s1 and 1119 (both statements). 1119 S-I duplicates 1117 s1 and was created by this batch. Jagjivan Ram/Labour or portfolio appears in 1106 s3, 1108 s1, 1117 s2 and 1119 S-II (4). The "Viceroy remained head; Nehru was only Vice-President" note appears in 1103, 1104 and 1118 (3). Re-angle 1119 (use another member, e.g. Nishtar/Posts and Air) and 1118 S-II.

**M4 - Recycled falsifier pattern persists in the fixed items.** Falsifiers still recur as a family: "approval of / assent of a named body" (809 s1, 912 s2, 1009 s2, 1016 s2, 1012 s4), "advice of Secretary of State for Commonwealth Affairs" (912 s1, 1016 s1), and "Chelmsford/Simon/Radcliff" swaps (1007, 1010). The hedge words from the earlier M3 are gone ("but could not remain independent" etc. no longer appear), so this is reduced, but an aspirant can now learn "approval needed means false". The statement is true if the book is silent only in 1009 s2, 1016 s1 and 809 s1, and each is also false in real history, so the Falsifier rule is met.

## LOW
- L1. 1210 `pg` lists 34, which no statement needs (Independence Act statement 4 is on p.35). 805 lists 38, which is not needed (the plan acceptance is on p.34).
- L2. 805 option 4 ("accepted by both parties only after a referendum in every province") is still a throwaway distractor.
- L3. 912 s2 ("approval of the Boundary Commission") is an implausible falsifier; it gives a free elimination.
- L4. 1103 key is the longest option (about 73 characters vs 60-66). 803 and 701 are ties.
- L5. 918 and 919 are both "I correct, II incorrect" in the same concept, and so are 1118 and 1119 in LK-1.11. Make one of each pair a different key.
- L6. 701, 802, 803 `w` notes are still terse ("The opposite of what was said."). 802 explanation does add "(spelled so in the text)", so earlier L6 is resolved.

## Per-item results (cold answer = key, unless noted)
701 ok. 710 ok. 712 ok (1 only). 714 ok (3 only). 801 ok. 802 ok. 803 ok. 805 ok. 806 ok (2 and 3 only). 809 ok (2 only). 819 ok (I incorrect, II correct; Attlee named 30 June 1948). 908 ok (all three). 912 ok (3 only). 913 ok (1, 2 and 3 only; s4 false). 918 ok. 919 ok. 1005 ok. 1007 ok (3 only). 1008 ok (all). 1009 ok key, s3 soft (M1). 1010 ok (2 and 4 only). 1011 ok (West Bengal falsifier valid, East Bengal in text and history). 1012 ok. 1014 ok. 1016 ok (None). 1017 ok (three; East Punjab is the false one). 1019 ok. 1103 ok. 1106 ok (seven overlap, Mathai differs, Labour both). 1107 ok. 1109 ok. 1111 ok. 1115 ok (14 rows each; Bhabha Commerce only in Table 1.2; two correct). 1117 ok (three). 1118 ok. 1119 ok. 1206 ok (Scientific Research, not Defence). 1207 ok. 1209 ok. 1210 ok. 1212 ok. 1215 ok. 1218 ok (States added only in Table 1.2). 1219 ok. 1303 ok. 1305 ok. 1314 ok (Minto, not Morley).

Near-duplicates of tagged PYQs: none introduced.
