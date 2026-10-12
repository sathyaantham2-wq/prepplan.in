# Final re-verification 2: ncert_own_fr.json (after polish pass)

Pack: content/authoring/civil/polity/packs/ncert_own_fr.json (CS-POL-ncfr-, 120 items, 6 concepts). Scratch: scratchpad/fvfr2/ (dump.txt, chk.py).
Method: all 120 items re-read; every changed item (38) recomputed cold from Laxmikanth ch08/ch12/ch17 text (grep-confirmed) and real law before reading the key.

## Verdict: PASS (0 HIGH)

Counts: HIGH 0, MEDIUM 2, LOW 8.

## reshape-options damage check (the main risk): none found
Script over all 120: o[0] == a and 4 distinct options in every item; 3 w[] entries each; every `which` w[k] quotes exactly o[k+1],
and its "includes statement n" / "leaves out statement m" sets equal (option minus key) / (key minus option) in all 54 items;
every `howmany` w[] count equals the key count (2-16 has custom w text, checked by hand: o[1] "Only one" -> correct are 1 and 4,
o[2] "All four" -> 2 and 3 wrong, o[3] "None" -> 1 and 4 correct; all right); every `match` w[] quotes o[1..3] and swaps are
single-pair and distinct; match items 1-20, 2-20, 3-20, 4-20, 5-20, 6-20 have List-I A-D, List-II 1-4, unique key. Stmt-I/II
items: w[] order matches o[1..3] in all 12. No truncated reasons (the 5 "short" hits were just missing full stops).

## Changed items recomputed (all keys right)
- 6-06: st1 true; st2 false (Parliament only); st3 Police Forces (Restriction of Rights) Act 1966 and BSF Act true (book p.161 prints exactly this; BSF Act 1968 is real); st4 true (p.162). Key 1,3,4 right; no 1950 dates left. Resolved.
- 1-14: st1 Art 15(2) true, st2 Art 17/PUDR true, st3 true, st4 Art 16(1) against a private employer false in all law (Art 16 is "under the State"; Kaushal Kishor concerns Arts 19/21 only). Key 1,2,3 right; w[] correct. Resolved.
- 2-16 (new 4 statements, key Only two): st1 true as chapter presents (p.141, stem says so); st2 false (18(2) bars any citizen); st3 false (President's consent needed for present/emolument/office too, Art 18(4)); st4 true (18(1)). Two true = "Only two". Right.
- 6-14: st1 Minerva Mills true; st2 Bhim Singhji false (table: welfare state; federalism is Bommai); st3 Sampath Kumar rule of law + judicial review true; st4 Central Coal Fields effective access to justice true (ch12 table lines confirmed). Key 1,3,4 right. Resolved.
- 4-07: Factories Act 1948 and Mines Act 1952 listed on p.154 and still in force; st3 (2006 ban) true; st2 false. Key 1,3,4 right. Resolved.
- 5-14: st1 now "unless entrusted with a public duty" (true, matches UPSC 2022 nuance); st4 false (President/governors). Key 1,2,3 right.
- 4-18: I and II both correct; II (a fee is a payment for service/regulation, not a tax for religion) does give the reason I is not barred by Art 27. Key "explains" defensible and now fairly tight.
- 3-18: I correct (blood specimen outside Art 20(3), p.147); II "according to the chapter ... civil as well as criminal" false per p.147. Key right.
- 1-16, 1-18, 1-19, 1-20, 2-09, 2-12, 2-17, 2-18, 2-19, 3-06, 3-08, 3-11, 3-12, 3-19, 4-08, 4-13, 4-14, 4-19, 5-10, 5-11, 5-16, 5-17, 5-18, 5-19, 6-07, 6-09, 6-10, 6-12, 6-18, 6-19: keys recomputed right; page citations hold (3-11 dates checked against Table 8.6: RLEK/Olga 1985, Katara 1989, Shantistar 1990, Puttaswamy 2017, Common Cause 2018; 86th Amendment and RTE 1 April 2010 on p.151). 5-10 st1 "jurisdictional writ" is the book's own wording (line 1288). 1-20 match: A-3 B-4 C-1 D-2 correct, all List-II articles distinct.
- Unchanged items re-read for second answers: none found.

## MEDIUM
1. 4-03 key wording is self-contradictory. Option 0 says Article 26 "unlike Article 25, is subject to public order, morality and health but not to the other Part III provisions"; but both Articles are subject to public order/morality/health (the pack's own w[1] for option 2 says "Both Articles are subject to public order, morality and health"). The "unlike" contrasts only the second clause. It is still the only defensible option, so no second answer, but the wording invites a literal-reader miss. Fix: "protects denominations collectively; like Article 25 it is subject to public order, morality and health, but unlike Article 25 it is not subject to the other Part III provisions" (and keep options 1-3 as is).
2. Thin or generic explanations remain in unchanged items (teach little): 1-12, 1-15, 2-06, 2-08, 2-13, 2-15, 3-07, 3-09, 3-10, 3-13, 3-14, 3-16, 3-17, 4-06, 4-12, 4-15, 4-16, 4-17, 5-07, 5-08, 5-12, 5-13, 5-15, 6-11, 6-13, 6-15, 6-17 ("Chapter text.", "Listed.", "Chapter 12."). Facts all right; add the fact in a clause.

## LOW
- 2-16 st1 (Maharaja etc. "hereditary titles of nobility") is the book's claim; stem now says "as the chapter presents it", which covers it.
- 2-18 st I (no proceedings for any vote): after Sita Soren (2024) bribery for a vote is not protected, but the statement is about the vote itself; fine, perhaps say "according to the chapter".
- 2-20 row C: NCBC (1993) in present tense; statutory body replaced by constitutional NCBC in 2018. Known, harmless.
- 3-04: Art 22(4) text is "are, or have been, or are qualified to be" high court judges; key uses the book wording; "(8th edition)" tag covers it.
- 3-16: MISA repeal 1978 vs "until 1977" is a one-year date trap; fair but minor.
- 4-01 option 3 ("gives citizens no protection at all") is an absurd distractor.
- 6-17 explanation grammar ("1 of the 3 statements are correct").
- 6-10 st3 attributes the basic-structure test of Ninth Schedule laws to Kesavananda (book p.165 does); Coelho (2007) is the operative ruling, 6-04 covers it.

## Format mix and PYQ duplicates
Mix unchanged by the polish pass (which 54, direct 30, howmany 18, stmt12 12, match 6; 2-16 stays howmany). Within the 2020-26 band as in the previous review; no case item, accepted. No new near-copy of a tagged PYQ introduced (5-14 st1 now echoes the UPSC 2022 mandamus nuance only as a concept).

## Report
HIGH ids: none. Verdict pass.
