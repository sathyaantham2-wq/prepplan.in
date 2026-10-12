# Final verification: lk04, lk06, lk06b (post-polish)

Method: no pre-polish originals exist (the scratchpad `prereshape/` files are older pre-reshape formats; `prematch/*.polished.json` equals the current lk04 and lk06). For lk06b the polished copy differs from the current file in exactly the 9 final items (705, 707, 711, 715, 902, 1011, 1013, 1112, 1204), confirmed by diff. Because the changed set could not be isolated for lk04/lk06, every one of the 120 items in each was answered cold from chapters/ch04.txt and ch06.txt before comparing with the key. lk06b: the 9 final items cold-answered; the other 111 were covered by mechanical checks only (already verified in verify-fixes-lk06b-polity5.md).

Mechanical checks (all three packs): key equals o[0] and is among the options; no duplicate ids or options; w-notes count equals distractor count and name existing options; every "Statement n is correct/incorrect" list in the explanation reproduces the key (which) or the count (howmany); `check-civil-pack.py` reports 0 problems for each.

## lk04 (120 items cold-answered): verdict PASS, HIGH 0, MEDIUM 0, LOW 4
Author-named items re-derived: 103 (all three: Sindhi 21st/1967; Bodo, Dongri, Maithili, Santhali 92nd/2003; Odia 96th/2011), 513 (97th made three changes, Art 19, Art 43-B, Part IX-B; no Schedule; Rajendra Shah 2021 note accurate and distractors are all real changes), 119 (Fundamental Duties from Soviet Constitution; 1,2,4), 303 (Arts 21/50/143/226 correct), 305, 309, 417, 419, 604, 608, 614, 616-618, 620, 107, 110, 113, 116, 120, 104, 109, 114, 315, 412, 515 all correct; no distractor became also-supported.
- LOW 112: Seventh Schedule counts are edition-specific; stem says "as given in the chapter's table (8th edition)", so acceptable.
- LOW 115: statement 2 ("presently 284 Acts") is false only via footnote 25 (entries numbered to 284, actual 282). The key stays unique (no option offers all four true), so not HIGH.
- LOW: format mix stmt12 10% vs 6% in the 2020-26 column; which 45% (48%), howmany 15% (12%), direct 25% (26%), match 5%. Acceptable.
- LOW: 520 (Attorney-General not an "independent body listed in the chapter") is fair because the stem anchors to the chapter list.
- Statement 1 is true in 22 of 54 "which" keys (41%): no positional tell.

## lk06 (120 items cold-answered): verdict PASS, HIGH 0, MEDIUM 1, LOW 2
Author-named items re-derived: 114 (1 and 2 only; 28 states and 8 UTs, false "29 and 7" is false in real law and chapter), 313 (Bagge Award only sought to resolve Radcliffe disputes; 2,3,4), 618 (Goa statehood 1987, Daman and Diu separate UT "consequently": both correct and II explains I), 108, 312 (1 and 2 correct; 3 false because Art 3 does not cover cession at all), 217, 218, 419, 518 (I false, II true), 303 (4096.7 km; 4,396.7 and 3,906.7 are false distractors) and all LK-6.1 to 6.6 items hold. Page cites check out (Table 6.1 pp.96-97, Table 6.4 pp.104-107, Table 6.5 p.108, footnotes p.108-109).
- MEDIUM: "Statement 1 is true" in 36 of 54 "which" keys (67%). A guesser who assumes statement 1 is true gains an edge; rebalance by moving the false statement to position 1 in about 10 items (candidates: 106, 107, 111, 206, 207, 306, 308, 310, 311, 408).
- LOW 317: statement 2 (the 1974 Agreement "ratified by Parliament in 1975") is false per chapter p.96 ("not ratified") and per real law (India ratified only through the 2015 amendment); fine.
- LOW: stmt12 10% vs 6% target; otherwise mix in line.

## lk06b final 9 (cold-answered): verdict PASS, HIGH 0, MEDIUM 1, LOW 1
- 705 (29 units; 19 = B+C alone; 20 = 1956 total) correct. 707 (1,2,3 only), 711 (1 and 3 only; A=9, B=9, C=10, D=1), 715 (all three) correct against Table 6.1.
- 902 (JVP: Nehru, Patel, Pattabhi Sitaramayya) correct, p.97. 1204 (Master Tara Singh) correct, p.100.
- 1011 (1,2,4 only; Haryana 17th, Act 1979 p.106, Chandigarh UT Table 6.3 p.102; Haryana was Hindi-speaking areas not hill areas) correct. 1013 (1 and 2 only; Mizoram 23rd, Arunachal 24th, Goa 25th; Mizoram a UT elevated, not carved from Assam in 1987) correct. 1112 (1,2,4 only; Jharkhand 28th from Bihar, Telangana 2014) correct.
- MEDIUM: statement 1 true in 38 of 54 "which" keys (70%), same positional tell as lk06.
- LOW 1013: statement 3 "created by separating its territory from Assam in 1987" could tempt a candidate who knows Mizoram was cut out of Assam in 1972; the "in 1987" and the chapter wording make it false, key unique.

## Summary
| Pack | HIGH | MEDIUM | LOW | Verdict | Cold-answered |
|---|---|---|---|---|---|
| lk04 | 0 | 0 | 4 | pass | 120 |
| lk06 | 0 | 1 | 2 | pass | 120 |
| lk06b | 0 | 1 | 1 | pass | 9 changed (plus mechanical on all 120) |

HIGH ids: none.
