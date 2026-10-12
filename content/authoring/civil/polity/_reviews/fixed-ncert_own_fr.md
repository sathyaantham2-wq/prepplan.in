# Fixed: ncert_own_fr.json (changes against review-ncert_own_fr.md)

Pack edited by id (prefix CS-POL-ncfr-); validator 0 problems; dup-check at 0.8+ reports 0 hits (the review's run had a maximum of 0.69; my first rebuild produced 12 lines at 0.8+, all re-angled); every `which` key re-derived from the explanation truth flags (0 mismatches).

## HIGH
- 1-10: st1 now "Article 301 ... is placed in Part III" (false); st4 reworded to "Article 32 cannot be invoked ...; high court under Article 226 or an ordinary suit" (true). Key 2, 3 and 4 only.
- 1-13: st1 now the critics' claim (costly remedy, true); st4 replaced by "too permanent, Parliament cannot amend" (false). Key 1, 2 and 3 only.
- 6-10: rebuilt. st1 "In its text, Article 31B ..." (true), st2 "13 acts at creation in 1951" (count 282 dropped), st3 Kesavananda (true), st4 "Ninth Schedule added in 1971 with Article 31C" (false). The land-reform generalisation is gone. Key 1, 2 and 3 only.

## MEDIUM
2-11 (EWS statements prefixed "Under the 2019 order"), 2-18 (II carries "without malice"), 3-20 (match rebuilt: Article 19 clause to freedom), 4-01 (military or national service stem, Emergency distractor), 4-07 (st2 names Article 24; st4 now the Acts of 1938/1952), 5-06 (injunction falsifier, new st2, st4 basic feature), 5-09 (st3 "purely administrative authority"), 5-16 (st3 replaced), 5-18 (rebuilt: certiorari I correct, II wrong writ), 3-19 (II is now the cause), 6-06 (st3 now the Army/Navy/Air Force Acts), 1-13, 5-04 (option 3 reworded), 3-04 (reframed to the advisory board's composition and Parliament's power over its procedure, "(8th edition)").

## Key shape
- Direct items whose key is the unique longest option: the review counted 8 of 30; now 0 (distractors lengthened in 1-02, 1-04, 2-01, 2-03, 2-04, 3-03, 4-01, 4-04, 5-02, 5-05); 
- Statement-I/II keys now: 4 "both correct, II explains" (1-19, 3-19, 4-18, 4-19), 4 "both correct, II does not explain" (1-18, 2-18, 5-19, 6-19), 2 "I correct, II incorrect" (3-18, 5-18), 2 "I incorrect, II correct" (2-19, 6-18). The option set keeps the four standard UPSC wordings (no "both incorrect" option exists in the bank's format).
- how-many keys: 2-16 is now Only one, 5-17 Only two, 3-15 All three.

## Near-copies replaced or re-angled
5-05 (new direct on who may empower other courts), 3-11 (chronology of Table 8.6 cases), 3-12 st2, 3-14 st2, 3-15 st2, 3-06, 3-08 st3, 3-10 st2, 3-13 st3, 3-18 II, 4-08 st2, 4-10 (all four), 4-17 st2, 4-20 (match rebuilt), 5-03 (type of office), 5-06 st2/st4, 5-10 st3, 5-11 st2, 5-12 st1, 5-14 st4, 5-17 st2, 6-04 (1990 Act case), 6-08 st1/st3, 6-12 st1, 6-14 st2, 6-16 (st2-st4), 6-19 II, 6-20 A, 2-07, 2-09 st1, 2-10 st1/st3, 2-11 st4, 2-13 st1-st3, 2-14 st1, 2-16 st1-st2, 2-17 st3, 1-07, 1-09 st1-st2, 1-11 st1-st2, 1-14 st3, 1-20.

## Changed ids (65)
1-02 1-04 1-07 1-09 1-10 1-11 1-13 1-14 1-20 | 2-01 2-03 2-04 2-07 2-09 2-10 2-11 2-13 2-14 2-16 2-17 2-18 | 3-03 3-04 3-06 3-08 3-10 3-11 3-12 3-13 3-14 3-15 3-18 3-19 3-20 | 4-01 4-04 4-07 4-08 4-10 4-17 4-20 | 5-02 5-03 5-04 5-05 5-06 5-09 5-10 5-11 5-12 5-14 5-16 5-17 5-18 5-19 | 6-04 6-06 6-08 6-10 6-12 6-14 6-15 6-16 6-19 6-20

## Not fixed
- 2-20 row C (NCBC) still 0.62 against aks20a-100, and several pack-wide statements still share facts with lk08 at 0.6-0.7 word overlap (the bank mirrors the same chapter sentences); none at 0.8+.
- reshape-options.py was not run (options hand-built; the validator's size-uniqueness checks pass). permute-match.py found no identity keys.
- 5-14 st1 ("mandamus cannot go against a private body", Anadi Mukta) and 6-02 (ADM Jabalpur wording) left as in review LOW; key unaffected.

## Final polish pass (2026-10-12), response to final-ncert_own_fr.md
HIGH fixed: 6-06 (st3 now Police Forces (Restriction of Rights) Act 1966 and BSF Act, no 1950 dates; key unchanged), 1-14 (st4 now Article 16(1) enforceable against a private employer, false in all law; key unchanged).
MEDIUM fixed: 2-16 (rebuilt to 4 statements incl. military/academic exception, stem "as the chapter presents it", options Only two/Only one/All four/None, key now Only two), 4-07 st4 (Factories Act 1948 + Mines Act 1952), 5-14 st1 (public-duty qualification), 2-09 st1 ("it covers"), 6-14 st2/st4 (Bhim Singhji federalism false; Central Coal Fields true), 4-18 II reworded, 3-18 II "According to the chapter", 2-19 and 6-18 distinct wrong reasons, 6-09 st4 re-angled (vs 1-17), 1-20 match rebuilt (Articles 26/29/23/27 vs 1-10), specific wrong reasons in 1-18 1-19 2-18 3-19 4-19 5-18 5-19 6-19.
Explanations rewritten with page and reasoning: 1-16 2-12 2-17 3-06 3-08 3-11 3-12 4-08 4-13 4-14 5-10 5-11 5-16 5-17 6-07 6-10 6-12.
Changed ids: 1-14 1-16 1-18 1-19 1-20 2-09 2-12 2-16 2-17 2-18 2-19 3-06 3-08 3-11 3-12 3-18 3-19 4-07 4-08 4-13 4-14 4-18 4-19 5-10 5-11 5-14 5-16 5-17 5-18 5-19 6-06 6-07 6-09 6-10 6-12 6-14 6-18 6-19.
Checks: check-civil-pack 0 problems; dup-check no hit at 0.8 or above in the pack; reshape-options run last (54 reshaped); permute-match 0 needed.
