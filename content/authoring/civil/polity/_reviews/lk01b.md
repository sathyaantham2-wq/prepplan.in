# Review of lk01b.json (Laxmikanth ch1, second half) - independent

Verdict: **fail** (one HIGH). Counts: HIGH 1, MEDIUM 8, LOW 8.

All 140 questions (LK-1.7 to LK-1.13, 20 each) were re-answered one concept at a time from ch01.txt (pdf pp.25-38) before
the key was read. 139 keys are right. Ids are unique (140), every item has four distinct options and three "w" entries.

## Shuffle check (the author's stated worry)
Done by script and by eye; the shuffle did NOT break anything.
- All 84 "which" and "howmany" items: the per-statement verdicts in "e" ("Statement n is correct/incorrect") reproduce the
  key exactly; 0 mismatches.
- Every "w" entry in "which" items names the option in the same position as o[1..3], and its includes/omits claims match
  the statement verdicts; 0 mismatches. In "howmany" items the "(statements ...)" list matches the true count; 0 mismatches.
- Direct, Statement-I/II and match items: w[i] checked by eye against o[i+1] in all 7 concepts (for match items the
  "X and Y are interchanged" text matches the option); all aligned.
- The key is always o[0] in the file (140 of 140), so the loader must shuffle options; I did not review the loader.

## HIGH
**CS-POL-ch01-818 - causal link not in the book, two defensible readings.** I: the Mountbatten Plan was given immediate
effect through the Independence Act. II: the Plan had been accepted by both Congress and League. Key: "II explains I".
The text (p.34) states two facts in sequence ("The plan was accepted by the Congress and the Muslim League. Immediate effect
was given...") and never says acceptance is why it was enacted at once; the explanation adds "Acceptance by both parties is
what allowed the plan to be implemented at once", an unsupported inference. "Both correct, II does not explain I" is equally
defensible. Fix: make II an independent fact (e.g. the Bill received Royal Assent on 18 July) so the key is
"does not explain", or make I/II a pair where the book itself states the cause.

## MEDIUM
**M1 - 1018 (and weakly 1318): "explains" keys rest on inference.** 1018 (paramountcy lapsed, therefore states were free to
join either dominion or stay independent) is reasonable but the book does not say "therefore". 1318 (Diwani in 1765, so
a territorial power in 1765) is supported by p.25 ("This started its career as a territorial power") but II is nearly the
same event as I, so the item tests nothing beyond reading. Make 1018 explicit in the explanation as the book's own
consequence, or swap II for a fact the book states separately.

**M2 - "unrelated true statements" template is guessable.** 718, 918, 1019, 1218 are all "both true, unrelated, so does not
explain". A student who spots two unrelated facts picks the "does not explain" option without knowing either. 818 and 1019
share the shape. Replace at least two with a true/false pair (as 719, 1118 do) so the key is not predictable.

**M3 - 901 loose word "abolished".** Stem: "NOT abolished by the Act". Option 4 (Monarch's veto) is, per p.35, "deprived ...
But this right was reserved for the Governor-General", so the veto itself survived in the Governor-General's hands. A careful
reader can say two options were "not abolished". Keep key (the Governor-General office was created, not abolished) but
reword the stem to "Which one of the following was NOT done away with / ended by" or change option 4 to the Council of India
(abolished earlier, so not suitable) - safer: replace option 4 with "The title of Emperor of India" (dropped).

**M4 - heavy repetition inside concepts (same fact tested 4-7 times).** Unique statements vs slots: LK-1.9 26 unique of 44;
1.7 31/44; 1.8 29/44; 1.13 32/44. Specific repeats:
- 1.7: Auditor-General (704, 707, 709, 714, 717, 718, 720); 14 per cent (705, 706, 711, 714, 716); Burma/Ceylon swap (706, 715).
- 1.8: Attlee's 30 June 1948 and the 4 July / 18 July dates in 801, 802, 804, 806-817, 819, 820; "3 June ... unwilling parts"
  (803, 809, 812, 817).
- 1.9: Secretary of State to Commonwealth Affairs (903, 907, 910, 914, 917, 918, 920); Governor-General appointed on dominion
  cabinet advice (902, 906, 913, 920 and wrong versions in 910, 917); repeal incl. the Act itself (907, 910, 913, 920).
- 1.10: veto reserved/deprived (1005, 1011, 1012, 1015, 1016, 1020); Government of India Act 1935 as interim law (1003, 1007,
  1011, 1014, 1017); Radcliff (1001, 1007, 1010, 1014, 1020).
- 1.13: 1600 versus 1608 (1301, 1306, 1311, 1316, 1317, 1320); Lee Commission (1304, 1307, 1310, 1314, 1319); Diwani meaning
  (1302, 1306, 1308, 1313, 1317, 1318).
Replace about 3 items per concept with untested facts from the same pages (e.g. 1.7: Federal List 59 items, three lists,
bicameral provinces, women and labour seats, 321 sections; 1.9: Dominions' Constituent Assemblies legislating; 1.10:
civil-service benefits; 1.8: Interim Government/Muslim League agitation).

**M5 - absurd false statements decide items by reading.** Ceylon separated (706, 715); "every adult ... whole population
enfranchised" (712, 717); India independent "from 26 January 1950" under the 1947 Act (909, 915); "three new dominions" (1012);
British Cabinet approval for the Governor-General's assent (1016); "full independence outside the Empire" (1315);
"Viceroy retained for India" (912, 917); "Interim Government wholly outside the Viceroy's Executive Council" and "Viceroy
ceased to be head" (1113, 1116, 1117) which the p.36 note contradicts in plain words. Use close swaps instead (as the pack
does well in 707, 710, 1010 "West Bengal", 1012 stmt 1, 1207).

**M6 - table-size statements test row counting, not knowledge.** 1110 stmt 4 ("lists fourteen members"), 1210 stmt 4 ("as
many members as Table 1.1"), 1212 stmt 3 and 1217 stmt 3 ("more members than Table 1.1"). True (both tables have 14 rows) but
not an exam fact. Replace with a portfolio comparison.

**M7 - concepts 1.11 and 1.12 are the same lookup in twenty shapes.** Jogendra Nath Mandal-Law, Asaf Ali-Railways and
Transport, Nehru-Vice-President/PM each recur 4-6 times. Table recall is legitimate for a Laxmikanth section but UPSC has
never asked a portfolio of a 1946 or 1947 cabinet member in 1995-2025 (tagged chapter 1 set has no such item); weight is
low. Suggest keeping 10 items per table concept and reallocating the rest to the Acts.

**M8 - 1107 page list.** pg [36] but statement 2 (Patel "and States") is false only by comparison with Table 1.2 on p.37;
add 37. Same for 1212 explanation/pg consistency (cites no page). See L6.

## LOW
- L1 - 1001 "Radcliff": spelling follows Laxmikanth; the commission head is usually written Radcliffe. Fine for the book, but
  a student may think it a misprint. 1001 also lists p.32 (Simon) for a distractor, harmless.
- L2 - 811, 813, 817 "four weeks (28 days) after the Royal Assent": arithmetic from 18 July (p.38) and 15 August; correct
  (28 days), but derived, not stated.
- L3 - 711 stmt 3 ("more than eight in ten had no vote") is derived from 14 per cent; correct, explanation says so.
- L4 - 715, 716 wrong-option reasons read "(statements 1)" / "(statements none)"; grammar only.
- L5 - 909, 915 cite p.25 in the explanation but not in pg; 702 cites p.33 not in pg; 1112 cites p.35 (Table 1.1 first row
  is on p.35) correctly but 1106 pg includes it and 1112 pg does not.
- L6 - 1206-1217 explanations cite no page numbers (pg field is fine, pages are right: Table 1.2 rows are on p.37).
- L7 - 1207 stmt 1 "Education and Arts" for Azad is a one-phrase difference from "Education"; literally false, fair, but
  the margin is thin. 1119 stmt II is the rebuttal restated; weak but not wrong.
- L8 - format mix: pack is 5 direct / 9 which / 3 how-many / 2 Statement-I/II / 1 match per concept, identical in all 7
  concepts. Against 2020-26 (direct 26 per cent, which 48, how many 12, Statement-I/II 6): direct 25, which 45, how many 15,
  Statement-I/II 10 - close; Statement-I/II slightly high and fully templated. Match has no 2020-26 column (not seen in
  the recent exams). Within "which": key distribution varies (1 and 3 only 9, 2 and 3 only 8, 1,2,3 7, 1 only 6, ...), the
  false-statement position varies, no single statement fixes the key alone (checked by script), and distractor
  combinations are single-edit near-misses, not random. This part is good.

## Other checks
- Facts, names and dates: Attlee 20 Feb 1947 / 30 June 1948, Mountbatten Plan 3 June, Bill 4 July, Assent 18 July,
  in force 15 August 1947, Federal Court 1937, 14 per cent, Orissa and Sind, Burma separated, Lee Commission, budget 1860,
  Shah Alam/Buxar 1764, charter 1600, arrival 1608, Diwani 1765 all match the cited pages. Both tables' portfolios (all
  28 rows) match the text. Nothing has changed since the exam years (history chapter).
- Tagged PYQs (chapter 1): UPSC-POL-1996-021 (British sovereignty/last Governor-General), 2015-261, 2017-298, 2024-462
  (1935 Act, federation and defence). No question in this pack copies or closely paraphrases any of them; the pack never
  tests the three lists or the federation.
- Footnote facts (1304, 1305, 1308, 1309, 1311) are all on the cited pdf pages (pp.37-38), checked.
