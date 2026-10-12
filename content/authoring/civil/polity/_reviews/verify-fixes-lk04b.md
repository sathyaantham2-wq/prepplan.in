# Fix verification: lk04b.json (Laxmikanth ch04, Tables 4.1-4.4)

Source: content/reference/civil-services/laxmikanth/chapters/ch04.txt (PDF page = printed page).
Scope: the 27 rewritten ids + 715 explanation, all 63 "which" items programmatically, 20+ by hand, 1118 causality,
option-shape tells, LK-4.10 repetition, near-duplicates against lk04.json.

**Verdict: pass. HIGH 0, MEDIUM 3, LOW 8.**

## 1. Cold answers (rewritten ids)

Answered from the text before reading the keys. 27 of 27 match the key; 715 explanation is correct.
709 (1 and 2 only), 711 (2 and 3 only), 718 (II explains I), 720 (A-3 B-4 C-2 D-1), 803 (Part XVI), 903 (Art 44),
911 (1,2,4), 913 (3 only), 914 (1 and 3), 915 (two), 920 (A-3 B-1 C-4 D-2), 1001 (123), 1003 (155), 1004 (112),
1005, 1007 (1,2,4), 1008 (1 and 3), 1009 (1,3,4), 1013 (2,3,4), 1015 (three), 1016 (two), 1017 (one),
1118 (II explains I), 1207 (1,2,4), 1313 (1,3,4), 1314 (1 and 2), 1318 (both correct, II does not explain I).
Each has a single defensible answer.
- 715: statement 1 true (Art 72 in Part V, pp.72/76), 2 false (161 in Part VI), 3 false (163 is in Chapter II Executive; 213
  alone is the Governor's legislative-powers chapter), 4 false (123 is its own chapter). Count 1. Pages in `e` right.
- 914 stmt 4 ("Art 25 ... Part whose rights cannot be suspended") is false by p.66 (only Arts 20 and 21 survive). Fair.
- 1009 stmt 4 (Art 110 inside 79-122) is true; stmt 2 (163 in Part V) false. Fair, distinct from 1015.
- 1207 stmt 3 (President's oath) is false by the Table 4.3 list and also in fact (Art 60, not the Third Schedule).
- 1013 stmt 1 (independent judiciary listed as unitary) false: p.64 lists it as federal, integrated judiciary as unitary.

## 2. Programmatic check of all 63 "which" items

Script derived the truth set from each `e` ("Statement N is correct/incorrect"), then checked:
key equals the option implied by the truth set; `o[0]` is the key; four distinct options; exactly three `w` lines, each
quoting a different distractor, once each; the "includes ... incorrect" / "leaves out ... correct" claims equal the real set
differences; every page cited on the `w` line is the page of a statement it names, with no extra pages.
Result: **0 failures.** (The only flags were my formatter treating "1, 2 and 3" all-true keys as needing "only"; not a pack defect.)
I also confirmed independently by hand that the truth flags themselves are right for 706, 708, 710, 712, 807-814, 906-912,
1010-1014, 1106-1114, 1208-1214, 1306-1312, plus all rewritten ones. Spot-checked pages against the text for 708, 1010, 1114, 1211, 1213,
1307, 1314 (Ambedkar "no apologies" is p.70, "details of administration" p.71, "ransacking" p.63; all right).
Not-yet-fixed from the prior report: none of the earlier wrong-page w lines remain.

`pg` arrays vs pages cited in `e`/`w` (LOW, see below): 701, 705, 902, 1203, 1205.

## 3. 1118 causality

Statement-I is now "contains emergency provisions" and Statement-II gives the purpose; p.69 explicitly calls the safeguarding
aim "the rationality behind the incorporation of these provisions". "II explains I" is now the natural reading and the
"does not explain" reading is weak. Resolved (was HIGH). Residual LOW: II merges the function clause (sentence 1) and the
rationale clause (sentence 2); still faithful.

## 4. Option-shape tells

- Centroid (key shares the most statement-agreements with the other options): 32 of 63, but 22 of these are ties and only
  10 are unique (708, 712, 906, 1012, 1106, 1114, 1206, 1208, 1311, 1314). That is roughly chance for four options; the old
  37/63 with 18 unique is gone. No usable tell.
- Lone-size key: 8 items (706, 806, 906, 1006, 1106, 1206, 1212, 1306). All are "every statement true" items, where every
  distractor must be a strict subset, so the key is the longest. Unavoidable once the item is all-true; LOW. Consider flipping
  one statement in two or three of them so fewer items answer to "pick the fullest list".
- Direct items: 1005 key is marginally the longest option (55 vs about 28-51 chars); not a reliable tell.

## 5. LK-4.10 repetition (Articles in stem/options, counting distractor use)

200 in 7 items (1003 distractor, 1007, 1008, 1010, 1016, 1019, 1020); 74 in 6; 169 in 6 (1005, 1008, 1015, 1016, 1019, 1020);
143 in 6; 123 in 5; 213 in 5; 163 in 5; 112 in 5; 155 in 4; 72/161 in 3 each. As tested facts (not distractors):
Art 200 as the Governor's assent power in 1007, 1008, 1016, 1019, 1020; Art 169 in 1005, 1008, 1016, 1019, 1020.
The ordinance pair (123/213) is now 3 tested items (1001, 1010, 1017) and pardon 72/161 only 2 (1010, 1020): big improvement
from 9 and 5. Residual 169/200 at 5 tested items each is high but the table has only about 16 rows for 20 items. **Acceptable;
MEDIUM-low.** If one slot is freed, replace 1019 (a pure "169 vs 200" swap, same as 1008 stmt 2 and 1016 stmt 4) with an unused row
(Art 74/163 position, 226, 249, 263).

## 6. Near-duplicates against lk04.json

- **1313 (MEDIUM).** Three of its four facts repeat lk04: single citizenship from Britain (lk04 -216, -101), Concurrent List
  from Australia (-101, -209 stmt 4), bicameralism (-216). Only the US judge-removal swap is new. Change two statements
  (e.g. Irish Rajya Sabha nomination, Weimar emergency suspension, South African amendment procedure) or drop.
- **1017 and 1001 (MEDIUM).** 1017 stmt 4 (Art 123 for the Governor) is the mirror of lk04 -306 stmt 2 (Art 213 for the
  President), and 1017 stmt 3 / -306 stmt 3 both play on Art 112. 1001 asks what -306 stmt 1 states. Keep one of them or vary.
- **709 / 718 (LOW-MEDIUM).** Part VII deleted by the 7th Amendment is the key of lk04 -104; 709 stmt 3 (Part XIV-A) echoes -108.
  Also repeated inside lk04b (701 option, 709, 718).
- LOW overlaps: 920 with lk04 -401/-410/-310 (Arts 38, 44, 50), 913 with -410 (Art 50), 1002/1007 with -310 (Arts 74/163),
  1118 topically with -211/-516 (different angle). 1207 (Third Schedule) and 1318 (Soviet duties/justice) have no
  counterpart in lk04: clean. 803 is now an ordering item and no longer duplicates -108.

## MEDIUM

1. 1313 near-duplicate (above).
2. 1001/1017 near-duplicate of lk04 -306 (above).
3. LK-4.10 residual repetition of Arts 169/200 across five tested items (above).

## LOW

1. 718: II (deleted by the 7th Amendment) nearly restates I (no longer in force); "explains" is defensible, key stands.
2. 915 `tr` still lists "21 vs 21A" and 913 lists "old Article 45"; neither is in the rewritten statements. Stale trap labels.
3. 914 `pg` now correct; 701, 705, 902, 1203, 1205 `pg` omit a page cited in `e`/`w` (72, 73, 75, 81, 80 respectively).
4. Eight all-true "which" items have a lone-size key (section 4).
5. 1016/1017/903/1004: easy swap items; fine as warm-ups.
6. 1118: II combines two source sentences (see section 3).
7. Skill tags (`sk`) still mostly two_step regardless of content (carried over from the previous report; cosmetic).
8. Options are stored with the key first in all 140 items; fine because the loader shuffles (the "Only one / Only two" counts also lose
   natural order on shuffle, harmless).

## Format mix

which 63 (45%), direct 35 (25%), how-many 21 (15%), Statement-I/II 14 (10%), match 7 (5%); unchanged and within the earlier tolerance.

No fact in this chapter's tables is known to have changed after the exam year.
