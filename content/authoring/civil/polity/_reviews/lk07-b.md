# Review of lk07.json, second half (LK-7.7 to LK-7.12; CS-POL-ch07-701 to 1220) - independent

Verdict: **fail** (1 HIGH). Counts: HIGH 1, MEDIUM 6, LOW 8.
All 120 questions were re-answered cold from ch07.txt (pdf pp.110-126), one concept at a time, before the key was read.
119 of 120 keys agree with my own answer without reservation; CS-POL-ch07-1117 agrees only if one reads "descendants" loosely (H1).
`check-civil-pack.py` reports 0 problems. I also recomputed, for every which/how-many item, the set of statements marked
"correct" in the explanation against the key: all 0 mismatches, and statement counts in the explanations match the stems
(so the builder's shuffle did not desynchronise numbers). Ids unique, 4 distinct options, 3 `w` entries each. Every key is
option 0 in the file (loader shuffles; not a defect). I did not review LK-7.1 to 7.6.

Format mix against the 2020-26 column of the trends doc (120 items): direct 30 = 25% (trend 26), which 54 = 45% (48),
how-many 18 = 15% (12), Statement-I/II 12 = 10% (6), match 6 = 5% (not in the trend table), case study 0 (trend 3%, none
suited to this chapter). Close. Skill: recall 17 = 14%, two-step 92 = 77%, elimination 11 = 9% against 42 / 36 for
the trend: recall is thin (LOW L1). Every concept has the same 5/9/3/2/1 shape.

Tagged PYQs for chapter 7 (UPSC-POL-1999-056 British citizen cannot claim freedom of trade; UPSC-POL-2021-411 one
citizenship, head of state by birth, foreigner cannot be deprived): no item in this half copies or near-duplicates them.
(814 statement 1/2 touches the deprivation idea of the 2021 item but tests a different point.)

## Author notes, checked
- **"Cold re-read of which/how-many only":** the direct, Statement-I/II and match items needed their own check; I did it.
  All agree with the chapter except the points below.
- **LK-7.12 replaced falsifiers:** 1207 st 2 (stay over 180 days is not a permit activity: table row 9 / row 7 list only
  research, missionary/Tabligh/mountaineering/journalism, internship/employment in foreign missions, protected areas),
  1213 st 3 (only foreign-mission employment is listed), 1216 st 1 and 3, 1217 st 1 and 4, 1210 st 1, 1214 st 2 and 4: each is
  contradicted by an explicit table cell, not by silence, and each is false in the 2021 MHA OCI notification as well. Good.
- **Falsifiers resting on silence** are rare here: only 811 st 4 ("holds an Indian passport" is not an exception) and 1114/1107
  type items that rest on explicit text. 811 st 4 is also false in the Act (the exceptions are a closed list); LOW (L3).
- **Real-law checks that held:** Assam Accord provisions (s.6A) stand (Supreme Court upheld s.6A in October 2024, 25 March 1971
  cut-off unchanged); CAA 2019 cut-off 31 December 2014 and s.6B deeming from date of entry; five-year residence for the six
  communities; OCI spouse two-year rule; OCI hearing before cancellation and the "violation of the Act" ground both from
  2019; deprivation does not reach a citizen by birth (814 st 1 correct); termination does not apply during war; renunciation
  withheld during war; footnote 9 exceptions. No wrong key from the Act.

## HIGH
**H1 - CS-POL-ch07-1117 (how many; key "Only two") - statement 1 is overbroad, so "Only one" is also defensible.**
Statement 1: "Descendants of a Bangladesh citizen are ineligible." The chapter and the Act bar a person whose parent, grandparent
or great-grandparent was a citizen of Pakistan/Bangladesh (p.118, p.122). A great-great-grandchild is not barred, so a careful
student can mark st 1 false and get "Only one" (only st 3, six months, is then true).
The key only works if "descendants" is read as "within three generations". Fix: "A person any of whose grandparents was a
citizen of Bangladesh is ineligible." (the idea is already tested by 1002, 1012, 1104, 1112, so this slot can be reused.)

## MEDIUM
**M1 - repeated ideas, well over two per idea per concept (and duplicated across 7.10/7.11).** Counts of items touching an idea:
- 7.7: deemed citizen "from date of entry" 703, 709 st 1, 712 st 2 and 3, 717 st 2, 719 (6); cut-off 31 Dec 2014 in 703, 708,
  713, 716, 720 (5); Assam 10-years/no vote in 702, 707, 712, 715, 717, 720 (6); Sixth Schedule/Inner Line exclusion in 704, 709,
  713, 716 (4); pending proceedings abated in 709, 714, 717, 719 (4); 2016 long-term visa in 710 (twice), 717, 718 (3).
- 7.8: "deprivation is a compulsory termination by the Central Government" in 806, 808, 810, 813, 814, 815, 818, 820 (8);
  war-time withholding/non-application in 801, 812, 815, 816, 819 (5); footnote-9 exceptions in 804, 809, 811, 816 (4);
  child resumes within one year in 802, 807, 817, 820 (4).
- 7.9: Article 9 / not dual citizenship in 903, 909, 913, 917, 918 (5); PIO rescinded 9 January 2015 in 905, 908, 911, 914, 917 (5).
- 7.10: citizen-only offices/voter (President, VP, SC judge, Lok Sabha, Council) in 1003, 1006, 1007, 1013, 1016, 1018, 1020 (7);
  cancellation grounds in 1008, 1009, 1014, 1015, 1017, 1019 (6).
- 7.11: Pakistan/Bangladesh bar in 1104, 1112, 1117 and again 7.10's 1002, 1012; fee Rs 15,000 / US $275 in 1102, 1107, 1116, 1119,
  1120 (5); NRI/PIO/OCI passport definitions in 1101, 1106, 1115, 1118, 1120 (5). 1010/1113 (minor child) and 1001/1109 (spouse)
  are near-duplicates of each other across 7.10 and 7.11.
- 7.12: 180-day police registration in 1202, 1207, 1210, 1214, 1216, 1217 (6); NRI-seat entrance tests in 1205, 1208, 1212, 1217 (4);
  special permit activities in 1202, 1207, 1213, 1219, 1220 (5).
Replace surplus items with untested material: p.113 Commonwealth citizenship repeal and the 2003 Act date, the "enemy alien"
rights (p.110), the Article 5 to 11 table (Table 7.2), the Public Employment (Residence) Act 1957 / Article 35-A, the OCI renunciation
of status by spouse, FRRO location details, teaching-faculty institutions, the complete list of the OCI-ineligible activities.
Note the whole ch07 half cannot be made much less repetitive without using material from 7.1-7.6; coordinate with lk07-a.

**M2 - how-many keys never "all correct", and "None" is over-used (guessable).** Keys across the 18 how-many items: None x5 (717,
816, 916, 1016, 1216), Only one x4, Only two x9, All three/All four x0. A student who never picks the "All" option and avoids
"None" gets about 2/3 right with no facts. Add at least two items whose four or three statements are all true and re-key some
"Only two" items to "Only one".

**M3 - key is the only option of its size in the six "all true" items.** 708, 808, 908, 1008, 1111, 1208: the key "1, 2 and 3" is
the only three-statement option (others are singles and pairs); a student picks it without reading. The checker's four-statement
rule does not see it. Add a second three-statement distractor, or use four statements, or replace some of these (they are the
"all true" trap on a thin concept, 19% of the three-statement items).

**M4 - CS-POL-ch07-713 statement 1 is false only through its conjunction and the chapter wording.** "The 2019 provisions are
inapplicable to the whole of the states of Meghalaya and Mizoram." In real law the whole of Mizoram is under an Inner Line
Permit, so for Mizoram alone the statement would be true; it is false only because of Meghalaya (Shillong is outside the Sixth
Schedule areas). A student who knows Mizoram will hesitate; no option makes the item ambiguous (key stays 3 and 4), but the
falsifier is fragile. Fix: name Assam and Tripura ("the whole of the state of Tripura"), where both the chapter and the Act agree
that only Sixth Schedule areas are carved out; or use "the whole of the state of Assam".

**M5 - CS-POL-ch07-1206 statement 2 (and 1220's B/C split) is false only by label.** The table says OCI has parity with
Non-Resident Indians in inter-country adoption and with Indian nationals in air fares and entry fees. Statement 2 says "parity with
Indian nationals in inter-country adoption". An NRI is an Indian national, so the statement is arguably true in substance; it is
false only because the table wording differs. The item stays unambiguous in practice (no option contains 1, 2 and 3), but the
falsifier is the recurring "book words it differently" defect. Fix: change statement 2 to something false in substance (for example
"parity with Indian nationals in purchase of agricultural land").

**M6 - Statement-I/II relation is arguable in 1118 and indirect in 1218.**
- 1118: Statement-II (a PIO, in the table, holds another country's citizenship) merely restates the definition of the foreign-passport
  person in Statement-I; "II explains I" (key) versus "II does not explain I" is defensible either way. Re-write II as a rule
  (for example "Article 9 denies citizenship to a person who voluntarily acquires foreign citizenship").
- 1218: Statement-I (cannot buy agricultural land) is true in real law (FEMA) but the chapter only says there is parity for
  non-agricultural property and "foreigner rights" elsewhere; it is an inference, not a stated fact. Acceptable but loose; add the
  chapter fact "same rights as a foreigner in all other fields" to Statement-II to make the link textual.

## LOW
- **L1** Recall share is 14% against 42% in the trend column; direct items on a thin chapter are almost all "one table cell" lookups.
- **L2** Currency flags. The chapter's 2019 statements cite the Passport (Entry into India) Act, 1920 and the Foreigners Act, 1946
  (708, 710 stmt 1, 711, 718, 719); both were repealed and replaced by the Immigration and Foreigners Act, 2025, with a Sept 2025
  exemption order that also reaches later entrants. The stems are correct "as per the chapter" but a note in the explanation would help. The CAA rules were notified
  in March 2024; the 31 December 2014 cut-off is unchanged. OCI fees (US $275 / Rs 15,000) and the permit list (1102, 1107, 1116, 1119,
  1120, 1202, 1207) follow the chapter's Table 7.1; verify against the current MHA notice before treating the fee as exam fact.
- **L3** 811 statement 4 ("holds an Indian passport" is an exception) is false by the chapter's closed list, not by a stated sentence;
  true in the Act as well. Fine, but footnote 9 is the only support and it is a footnote.
- **L4** 1011 statement 2 reads "Adult children also cease." with no subject in the stem; it is clear only inside the renunciation
  context. Reword: "Adult children of the cardholder also cease to be cardholders."
- **L5** Explanations in 701-705 style direct items are bare ("p.116.", "p.117.", "pp.115-116."): 705, 802, 902 to 905, 920, 1001,
  1004, 1005, 1020, 1101, 1103, 1104, 1120. Add one clause of the fact so a wrong choice can be diagnosed.
- **L6** The fifth item of every concept pair (719, 819, 919, 1019, 1119) is a "true but unrelated" Statement-I/II pairing whose
  Statement-II is a trivial lookup (fees, report date): the pattern is learnable; vary the relation.
- **L7** Absolutes as falsifiers: 809 st 1 ("in every case without exception"), 1013, 1214 st 2, 1211 st 1 ("without any permission").
  Acceptable, but too many "only/never/every" cues across 7.8 to 7.12 let a test-wise student skip the fact.
- **L8** 818 Statement-I ("Deprivation ... is a voluntary act of the citizen") is too easy to be diagnostic; 1219 Statement-I likewise.

## Verified correct (no action)
All other keys, including: 702 (Ahmed, 1968 entrant, vote withheld, deemed citizen after ten years), 703, 709 to 714 (statement
sets), 801 to 805, 806 to 820, 901 to 920 (dates 19 Aug 2002, 2 Dec 2005, 9 Jan 2015 and the 2003/2005/2015 split are as the chapter
states), 1001 to 1020 (two-year spouse rule; Pakistan/Bangladesh bar to great-grandparents; Council not open to OCI), 1101 to 1120
(row 11: 7 years for PIO route, 5 years OCI plus 12 months), 1201 to 1220. Page citations: each `pg` checked against the cited
fact; all state the fact. Statement ordering was randomised; explanations still match statement numbers.

## Required before approval
1. Fix H1 (1117).
2. Address M2 and M3 (re-key some how-many items to "all correct"; add a second same-size option to the six all-true items).
3. Reduce M1 repetition (cap each idea at 2 per concept) and coordinate with the 7.1-7.6 reviewer on 7.10/7.11 overlap.
4. Fix M4, M5, M6 wording.
