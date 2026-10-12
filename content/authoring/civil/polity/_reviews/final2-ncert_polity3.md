# Final re-verification (after polish pass): ncert_polity3.json

Reviewer: independent, cold. All 140 items (CS-POL-ncp3-1-01 .. 7-20) re-answered from the SAVED file against the Class 7 chapter
(`content/extracted/gees206`, p.143-168, rebuilt with page markers) and Laxmikanth 8e pdf pages (`content/reference/civil-services/laxmikanth/chapters`).
The fixer's log was not used as evidence. Scratch: `scratchpad/fv3b/` (dump.txt, lk.txt, ncert.txt, pg.py, chk.py, w.py).

Verdict: **pass** (0 HIGH). HIGH 0, MEDIUM 4, LOW 5.

## Machine checks
- `check-civil-pack.py`: 0 problems.
- `dup-check.py --threshold 0.8`: 0 near-duplicate lines against 60 other packs (44 generic hits at 0.6, none item-level copies).
- Key equals o[0] in every item. Every `which` item: the correct set stated in the explanation equals the key set; each `w[]` line names exactly
  the wrongly included and wrongly left-out statements of its option and carries the option's own label (script, 0 mismatches). Every `howmany`
  key equals the count in its explanation (0 mismatches). Direct, stmt12 and match `w[]` lines read in order and each answers o[1], o[2], o[3].
- Four-statement items (29): every one has at least two options of the key's statement count (min 2 options of key size; 3-09 and 6-11 have
  all four options of equal size, 2-09 has two options of 2). No option is the lone one of its size.
- Format mix (140): direct 25% (35), which 45% (63), howmany 15% (21), Statement-I/II 10% (14), match 5% (7). Trends 2020-26: direct 26%, which 48%,
  howmany 12%, Statement-I/II 6%. Close; Statement-I/II and howmany are a little rich (see L-3).
- Key is the longest option in at most 2 direct items per concept (1-03, 1-05, 2-05, 3-04, 4-05, 6-02, 7-01, 7-03). Mean statement length true 115.8
  vs false 116.8 characters, so length no longer tells.

## The specifically requested items
- **3-17 (Art 13, Laxmikanth p.132): all three correct, confirmed.** p.132 states: "Article 13 declares that a constitutional amendment is not a law ...
  Kesavananda Bharati (1973) ... can be challenged ... if it violates a fundamental right forming part of the basic structure ... can be declared void",
  and "This power has been conferred on the Supreme Court (Article 32) and the high courts (Article 226)". Key "All three" is single. It no longer repeats
  UPSC-POL-2026-486 (that item asks about ordinances and custom; dup-check finds no overlap).
- **3-19: confirmed.** Statement-I ("democratic means only political democracy") is incorrect: p.87 "used in the broader sense embracing not only political
  democracy but also social and economic democracy". Statement-II (Ambedkar: political democracy cannot last without social democracy) is correct, p.87.
  Key "S-I incorrect but S-II correct" is the only answer; w[] lines match o[1..3].
- **6-14: confirmed.** s3 says the CJI may call a retired judge "with the consent of the President but not of the retired judge himself". p.417: "only with the
  previous consent of the President and also of the person to be so appointed". False, correctly. s1 (open court), s2 (ad hoc judge: consult the high court's
  chief justice, President's previous consent), s4 (majority, dissent allowed) are all on p.417. Key "1, 2 and 4 only" holds; options have sizes 3,3,3,2.
- **6-15 s1 (Parliament supreme over the Supreme Court): false, confirmed** (p.431 judicial review is a basic feature; p.434 the Indian position is "a synthesis",
  "many limitations on the sovereignty of Parliament"). s2 and s3 are the chapter's own p.166 summary. Count 2 holds.
- **3-15 s2:** the chapter (p.150) says the rule "was based on a majority vote; it ignored the view of a minority". "Adopted after the minority had been
  consulted and had agreed" is false. s1 and s3 are on p.150. Count 2 holds.
- **5-09 s2:** the chapter (p.158) has citizens, armed with RTI information, confronting officials; no Commission is mentioned. s2 is false; s1, s3, s4 are
  on p.158 verbatim. Key "1, 3 and 4 only" holds. (See L-1 on the kind of falsifier.)
- **1-18:** S-I correct (p.95: India transferred 111 enclaves, Bangladesh 51, 100th Amendment 2015). S-II ("Radcliffe Award settled every dispute, no later award
  needed") is incorrect: p.95 Bagge Award 1950 and Nehru-Noon Agreement 1958 followed. Key "S-I correct, S-II incorrect" is single.
- **Four-statement size rule:** satisfied in all 29 items (list above).
- **Length-balancing did not change truth:** every statement in all 140 items was re-derived from the text as saved; none of the lengthened or shortened
  statements flips a truth value, and no key, count or `w[]` moved.

## Recompute of the substantive-change list
1-01, 1-05 (state vs government, chapter p.146); 1-07 (s4 reversed school analogy false, p.146; 1,2,3 only); 1-13 (s2 false, Art 4, p.95); 2-14 (s3 police
decide guilt false, p.147); 3-06 (s1 head-elected is the republic test, p.149); 3-10 (s3 false, p.280; deposit Rs 15,000, one-sixth, 35 years all p.280);
3-12 (p.87 all three); 3-14 (s2 false p.211; s3 p.212 footnote 7; s4 p.211); 4-07 (s3 false p.155); 4-11 (s4 false, Art 77(2), p.316; s2 Art 78; s3 Art 88);
4-15 (all three, p.452); 5-03 (p.159); 5-18 (business groups most powerful, p.849); 6-07 (s4 false, p.160); 6-18 (executive order of a state; S-II
constitutional source, p.431); 7-07 (s1 false against p.163); 7-14 (s4 false: Singhvi Committee 1986, p.552, not G.V.K. Rao). All hold, with a single
defensible answer.

## Findings

### HIGH
None.

### MEDIUM
- **M-1 Fact-level reuse of tagged PYQs (not flagged before).** 3-09 s1 is the same fact and verdict as UPSC-POL-2023-452 s1 (acts done before a void
  declaration stay valid), and s4 (dissolved assembly) is the converse of that PYQ's s2. 7-10 s3 repeats UPSC-POL-2016-296 s2 almost word for word
  ("reconstituted after premature dissolution continues only for the remainder"). 6-14 s2/s3 sit on UPSC-POL-2021-401/410 (ad hoc and retired judges).
  Weaker: 3-03 (formula of 1997-039/2003-112), 4-03 (2000-059), 6-11 s1 (2002-082/2012-228), 4-11 s2 (Art 78 duty, 2013-242 s3). Not wrong, but a student who has
  done the PYQ gets these free. Re-angle 3-09 (replace s1 or s4) and 7-10 s3 (for example the 21-year minimum age or the six-month election rule only).
- **M-2 Loose page in the explanation text, 5-14.** Statement 2 (Narmada Bachao Andolan and Chipko among ideology-based groups) is on p.852, but the
  explanation and the w[] line say p.851 (p.851 ends at tribal organisations). `pg` already lists 852. Fix the text to p.852.
- **M-3 7-07 s1 is false by chapter framing, not clearly by real law.** "Local issues like water supply, roads or schools are to be decided by the state
  legislature, with the local people consulted afterwards." Water supply is a State List subject (Laxmikanth p.222, Twelfth Schedule item 5), so a
  defender can call the first half true. The item says "as listed in the Class 7 chapter" and the key is still single (the other three statements are
  verbatim chapter benefits), so this is not HIGH. Prefer a falsifier such as "local issues should be decided only by the Central Government".
- **M-4 Same fact used twice in one pack.** The Prime Minister inside the Lokpal's purview is s3 of 5-15 and Statement-I of 5-19 (both keyed false). Solving
  one solves the other. Also 3-12 s1 and 3-07/3-18 all touch indirect election; acceptable, but 5-15/5-19 is the clear pair. Swap one.

### LOW
- **L-1 Narrative falsifiers.** 3-15 s2, 5-09 s2 and 1-07 s4 are false only by the chapter's story (no real-law check exists for an anecdote). They are fair
  for a "according to the chapter" stem; the Falsifier rule is met in spirit only.
- **L-2 Pattern tell.** In 28 of the 29 four-statement items exactly one statement is false (key size 3); only 2-09 has two false. A candidate who finds
  one false statement and drops it scores. Vary: make two or three four-statement items 2-false or 3-false.
- **L-3 Statement-I/II "explains" calls are interpretive in 2-18, 4-18, 6-18** (II is the constitutional source or the nominal-head position behind I). A
  careful student could choose "does not explain". The pack's choice is the textbook reading and the explanations say why, so single-answer is acceptable.
  Mix is also 10% Statement-I/II vs 6% in 2020-26; trim one if the owner wants to match the trend.
- **L-4 Time-sensitive facts are all current and worded safely:** 28 states and 8 UTs (p.93, 587); Supreme Court 34 (33 + CJI, 2019, p.414; 6-17 words it
  as "to thirty-three in 2019"); RTI Amendment 2019 (p.709); Lokpal PM purview (p.725); 15% ministers cap (p.315). No stale item found.
- **L-5 2-03 states "only with the consent of the state government"** per Laxmikanth p.716; courts can direct a CBI probe under Articles 32/226. The stem says
  "as explained by Laxmikanth", so it is fair; no change needed.

## Summary
Counts: HIGH 0, MEDIUM 4 (M-1 to M-4), LOW 5 (L-1 to L-5). HIGH ids: none. Pack is sound to load after the owner's go-ahead; M-1 and M-2 are the cheap fixes
worth doing first.
