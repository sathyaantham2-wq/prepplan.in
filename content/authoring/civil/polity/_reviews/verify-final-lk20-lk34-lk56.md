# Final verification: lk20, lk34, lk56

Method: for each pack I read the whole chapter text first, then answered all 120 items cold from the chapter (options shown with the key hidden and re-sorted), and only afterwards compared with the key. That covers every changed item, every Statement-I/II item, every match item and every other item, so the "15 others" quota is exceeded. Scripts are in the scratchpad (prefix vfin2_).

Mechanical checks over all 360 items, all clean:
- `check-civil-pack.py` reports 0 problems for each pack.
- The key is in the options and equals o[0] on every item.
- No duplicate options, no duplicate ids, and every item has 3 w-notes.
- Every "Statement n is correct/incorrect" list in an explanation reproduces the key, for both "which" and "howmany" items.
- Every quoted option in a w-note exists.
- I hand-checked the w-note order against o[1:] on all direct/MCQ items in lk34 and on the changed direct items in lk20 and lk56. It lines up.
- The three match items I checked in lk56 (020, 120 and the swapped-pair notes) also line up.
- Format mix passes the checker's 2020-26 bands.
- I did not run a separate near-duplicate search against the tagged PYQ file, so that check is not covered here.

## PACK 1: lk20 (Prime Minister)

Cold-answered: 120 of 120. Key disagreements: 0.

Changed items re-derived from the chapter, all confirmed:
- Statement items 022, 043, 051, 056, 067, 068, 069, 070, 072, 074, 076, 078, 080, 023, 021 all match the key.
- 070 now has four statements. The Vice-President falsifier is false in real law (the VP is elected by the electoral college, not appointed on the PM's advice) and in the chapter (p.310 list).
- 077 (stem "according to the chapter") keys A. The page does tie the dissolution power to "In this capacity" as leader of the Lower House.
- 114 (Desai, the National Front dates, Modi) is correct: Dec 1989 to Nov 1990, so "to November 1991" is the false statement. It keys "three".
- The LK-20.4 rewrite is supported on p.312 (Art 74 reconsideration, Art 78 duties) and p.313-314 (Table 20.1 rows 74, 75, 77, 78, 88; footnote 4).
- Falsifiers checked as false in real law and per the chapter:
  - Art 77 vs Art 78 swaps.
  - Zonal Councils are not chaired by the PM.
  - The NHRC is not chaired by the PM.
  - Salary is not in the Second Schedule.
  - The oath of secrecy is taken by all Union ministers (footnote 2).
  - Deve Gowda resigned in 1997, not 1996.
- Match 019, 039, 059, 079, 099 and 119: each has a unique permutation and the key is correct.
- Statement-I/II items 017, 018, 037, 038, 057, 058, 077, 078, 097, 098, 117, 118 are all defensible as keyed.

Findings:
- HIGH: none.
- MEDIUM: none.
- LOW:
  - 037 (B) and 077 (A) are judgement calls on "explains". Both are argued on the page and the explanations say so. No change needed.
  - Several w-notes are generic ("The chapter lists it (p.310)", "The chapter mentions no such step"). They are accurate but give a weak teaching signal (042, 044, 045, 060, 063, 064).

Verdict: pass.

## PACK 2: lk34 (High Court)

Cold-answered: 120 of 120. Key disagreements: 0.

Changed items re-derived, all confirmed:
- 077 ("curtailed by an ordinary law of Parliament") is false per p.512 ("cannot be curtailed both by the Parliament and the state legislature") and false in real law (an amendment is needed). It keys "only one".
- 092 and 094 are correct. The seven-year threshold is p.514. In 094 st.2 "assistant sessions judge or other judicial magistrates" matches p.515. Pages are 514-515.
- 056: statement 4 ("otherwise deemed a judge") is false per p.511. Key "three".
- 095: statement 4 ("Constitution alone") is false per p.513 (Letters Patent, Acts, CPC and others). Key "three".
- 052 (p.510): Parliament, not the President, determines the compensatory allowance; it is paid in addition to salary. Key "1 only".
- 105: Articles 13 and 226, p.516. Both distractors are real and wrong.
- 074: statement 1 is false (the "President" means the cabinet acting in consultation with the CJI and the HC chief justice).
- 014: statement 2 is false (the Court struck down both the Amendment and the Act).
- 111: IPC is now BNS. The parenthetical is accurate and the chapter fact (s.10 of the Contempt Act) is intact.
- 009: "Chhatrapati Sambhajinagar (formerly Aurangabad)" is unambiguous because the old name is kept in brackets. Rename accuracy is outside the chapter but harmless.
- The rewritten bare explanations in 006, 017, 052, 066, 069, 072, 073 now state the fact. Their keys check out.
- 069 st.2: a retired permanent judge may NOT plead before the HC where he served (the exception is only the SC and other HCs). Confirmed by p.512 and Art 220.
- 073 st.3: the state-legislature falsifier is false per p.512 (Parliament determines; conditions of service cannot be varied to the judge's disadvantage).
- 048 st.3 ("acting judge when the CJ himself is unable") is false per p.511 ("other than the chief justice") and Art 224(2).
- Items 016 (Nainital, Jabalpur seats), 017 (Gauhati excludes Manipur) and 011 (Kerala covers Lakshadweep) match Table 34.1.
- Match 020, 040, 060, 080, 100, 120: unique permutations, keys correct.
- Statement-I/II items 018 (B), 019 (C), 038 (C), 039 (D), 058 (B), 059 (D), 078 (A), 079 (C), 098 (D), 099 (B), 118 (A), 119 (D) are all correct. The "explains" calls in 078 and 118 are textually backed ("This means", "very broad because").

Findings:
- HIGH: none.
- MEDIUM: none.
- LOW:
  - 017 explanation has a doubled page cite, "(p.518) (p.517)". Cosmetic.
  - 009 stem introduces a post-chapter name (Chhatrapati Sambhajinagar). It is safe as written; do not drop the bracket.
  - 004: J&K and Ladakh also share a common HC, but the stem says "separate high court of its own" and the chapter says Delhi alone. Fine.

Verdict: pass.

## PACK 3: lk56 (NITI Aayog)

Cold-answered: 120 of 120. Key disagreements: 0.

Changed items re-derived, all confirmed:
- 002, 005 (the Planning Commission, not the Advisory Planning Board, which only recommended it), 024 (key D is the false statement), 035, 037 (CEO is appointed by the PM, rank Secretary, fixed tenure; key "two"), 042, 051, 069, 070.
- 020: match D "Phrase the Resolution uses to describe the approach it wants for India" pairs only with 'Bharatiya approach' (2). Key A-3, B-4, C-1, D-2 is unique.
- 032: statement 2 (member-secretary heads the NITI secretariat) is false in the chapter (NITI has a CEO; the member-secretary was the Planning Commission's, p.675) and in real law.
- 055: statement 3 ("plans at the national level pushed down to the villages") is the opposite of objective 3 (village level, aggregated upward). Statement 4 is false. Key "two".
- 068: statement 3 ("subjective criteria decided by each State") is false per p.673 ("quantitative objective criteria"). Key "1 and 2 only".
- 075: statement 4 (DSSS expansion) is correct per p.672. Statement 3 is false. Key "three".
- 078: key B. "Working with States on indicator frameworks" does not explain why rankings use objective criteria. The explanation is honest about it. See the MEDIUM-adjacent note below.
- 090, 091 (all four critics' labels are on p.675), 096 (statement 3 false), 097 (statements 3 and 4 false), 114 (statement 2 false).
- 107: the CAG is not an NDC member, per p.676 and in real law. Key "1, 3 and 4".
- 112 and 117: the NDC came from the First Five Year Plan (draft outline), not the Advisory Planning Board. In 117, "established 1950" is also false (August 1952). Key "two".
- 118: key B. 119: key C (Speaker is not a member, per p.676 and in real law).
- 120: match C "body that was to take over the NDC's powers" maps to 1. Key A-3, B-4, C-1, D-2.
- All match items (020, 040, 060, 080, 100, 120) have unique correct permutations. The w-notes name the right swapped pairs.
- Statement-I/II items 018 (A), 019 (D), 038 (B), 039 (C), 058 (A), 059 (D), 078 (B), 079 (D), 098 (B), 099 (D), 118 (B), 119 (C) are all correct.

Findings:
- HIGH: none.
- MEDIUM: none.
- LOW:
  - 013 st.1 and 001 option B both rest on a one-word Institute/Institution swap. It is fair because it tests the official name, and the w-note says so. 013 is a second hit on the same fact as 001.
  - 078 is the only A-versus-B item where a candidate could argue A. The chapter gives no causal link, so B is right.
  - 053 st.1 ("Defence and Security Cell") is a falsifier from an exhaustive 2022-23 vertical list. The verticals may have been reshuffled since, but the pack cites the list explicitly in the stem.
  - 001 stem says the resolution "expanded the short name". The expansion is on p.667 but the page does not attribute it to the resolution. Harmless.

Verdict: pass.

## Summary

| Pack | HIGH | MEDIUM | LOW | Verdict | Items cold-answered |
|---|---|---|---|---|---|
| lk20 | 0 | 0 | 2 | pass | 120 |
| lk34 | 0 | 0 | 3 | pass | 120 |
| lk56 | 0 | 0 | 4 | pass | 120 |

HIGH ids: none in any pack. No key changes recommended.
