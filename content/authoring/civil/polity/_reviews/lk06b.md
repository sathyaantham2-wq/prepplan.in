# Review of lk06b.json (Laxmikanth ch6, Union and Its Territory, second half) - independent

Verdict: **pass** (0 HIGH). Counts: HIGH 0, MEDIUM 7, LOW 8.
All 120 questions (LK-6.7 to 6.12, 20 each, ids CS-POL-ch06-701 to 1220) were re-answered one concept at a time from
ch06.txt (pdf pp.93-109) before the key was read. All 120 keys agree with my own answer. Checker
(`check-civil-pack.py`) reports 0 problems; I recomputed its lone-three-statement test myself (see M1). Top-level `source_code`
and `chapter.source_code` are both `lk06` (sibling M6 not repeated). Every key is option 0 (loader shuffles; not a defect).
Ids are unique, every `w` has 3 entries, no duplicate options.

Format mix against the 2020-26 column: direct 25% (30), "which" 45% (54), "how many" 15% (18), Statement-I/II 10% (12),
match 5% (6). Trend is 26 / 48 / 12 / 6 plus case study 3%. Close; Statement-I/II is a little rich but inside the checker band.
Pure recall 22%, two-step 70%, elimination 8% (trend 42 / 36). Every concept has the identical 5/9/3/2/1 shape (L1).

## Author notes, checked
- **Himachal Pradesh 1954 "state" (Table 6.4 item 3) versus UT in 1956 (Table 6.2): no item rests on it.** HP appears as a
  Part C state of 1950 (Table 6.1) and a UT of 1956 (Table 6.2) in 810 (st 3), 913 (st 3), 713 (st 1, with Bilaspur); as the
  1966 UT that absorbed the hill areas in 1011/1209; and as a state "in 1971" in 1215/1217. None asserts it was a state
  in 1954 or 1956. The Table 6.4 wording is not used.
- **Telangana "29th" versus 28 states:** only 1118 (Statement-II, "2014 as the 29th state") uses the ordinal, and p.101 and
  Table 6.4 both say 29th. 1001 key (28 states, 8 UTs) is right; the explanation of the wrong option 29/7 says why. No
  contradiction is tested (see L5).
- **Year pairs:** 1971/1972 - 1104 asks "got statehood in" with the key 1972 (p.100) and no 1971 option; 1119 "1972" ok.
  1962/1963 - 1008, 1219, 1220 use only the body-text years (10th Amendment 1961, 12th 1962, 14th 1962); the only 1963
  mention is a wrong option in 1104 (Nagaland formed 1963, p.100, true as stated). 1970/1971 - 1011 st 3 says HP became a state
  "in 1966 itself" (false either way); 1215 st 2 and the 1217 explanation say 1971 (p.100); no option uses 1970. No distractor
  uses the other defensible year.
- **Old pack's "J&K is also Part B" second correct option:** not reintroduced. J&K appears only as a Part B state in true
  statements (709, 710 st 1), never as a wrong option for a Part C/Part A question (821 offers Cooch-Behar, Saurashtra, Orissa,
  Vindhya Pradesh: exactly one Part C). **"Part D centrally administered":** not reintroduced. Centrally administered is
  attached only to Part C (720, 804, 806, 814); the only Part D distractor, 820 option "converted into centrally administered
  Part D territories", is a wrong outcome for Part C and is false because Part D no longer existed after 1956.
- **Lone three-statement key in four-statement items:** recomputed. 0 of 33 four-statement "which" items have the key as the
  only three-statement option (the script agrees). But a related, larger giveaway exists in three-statement items (M1).
- **Wording that names the author or the chapter:** present (M4).

## HIGH
None.

## MEDIUM
**M1 - key is the odd-sized option in 21 of 23 three-statement "which" items (guessable without knowing a fact).**
In three-statement items the options are always {one single, another single, one pair, all three} or similar, and the key is
the only option of its size: 706 (1 and 3 only), 709 (1,2,3), 710, 806, 808, 810 (1,2,3), 812, 906, 911, 913 (1,2,3), 1006,
1008, 1013 (1,2,3), 1106, 1108, 1110 (1,2,3), 1112, 1207, 1208, 1210, 1212. A student who picks "the pair" or "all three"
by shape scores about 90% on these. The four-statement checker rule does not catch it. Add a second pair (or second
all-three) distractor, and put some keys on a single statement, in at least 10 of them. Also, 711 ("1 only"), 814 ("3 only"),
708, 907, 1109 and 1209 are the unique-size option in four-statement items (lesser concern).

**M2 - repeated ideas, over the 2-per-concept rule.**
- 6.7: Part A = nine governor's provinces / Part B = nine princely states with legislatures in 707, 715, 717, 719, 720 (5);
  Part B number in 711, 715, 717, 719 (4); Hyderabad by police action in 710, 716, 718 (3).
- 6.8: Part C "ten and centrally administered" or chief commissioner's provinces in 802, 804, 806, 814, 815, 819 (6);
  abolition of Part C in 803, 808, 813, 816, 818, 820 (6); Ajmer into Rajasthan in 805, 809, 816.
- 6.9: Fazl Ali rejecting one language-one state in 907, 916, 917, 918, 920 (5); Dhar = administrative convenience in 901,
  915, 919, 920; JVP no chairman in 906, 915, 920.
- 6.10: Jammu and Kashmir 2019 in 1002, 1007, 1016, 1019, 1020 (5); Goa/Daman and Diu in 1003, 1008, 1017, 1018, 1020 (5).
- 6.11: Meghalaya/Tripura/Manipur 1972 in 1104, 1106, 1114, 1117, 1119; Telangana in 1111, 1118, 1120.
- 6.12: Sikkim in 1201, 1202, 1206, 1207, 1218, 1220 (6); Punjab 1966 in 1204, 1209, 1217; Puducherry in 1211, 1216, 1220.
Replace surplus items with untested facts: the Berubari / Bagge / enclave material is in lk06; here, for example, Chandernagore,
the Assam-Bhutan strip, the Acquired Territories Act, the Bihar-West Bengal transfer, Article 2-A as a Table 6.5 entry, Kerala's
Kasargode, Cooch-Behar, Kutch.

**M3 - table-lookup and serial-number trivia.** Membership of Part A/B/C and "was in the 14 states / six UTs" lookups:
708, 709, 801, 807, 810, 913, 1107. Direction-of-transfer and act-name lookups from Table 6.4: 1109, 1113 (st 4: Mysore to
Andhra Pradesh), 1116. Serial-number items that test position in an alphabetical table, which carries no meaning and which
the explanation itself calls irrelevant: 1111 st 3, 1112 (whole item), 1118 st I. Keep at most one of each kind per concept
and replace the rest with Act/amendment/cause questions.

**M4 - wording that names the author or the chapter (reading device).** Stems: 702 ("according to Laxmikanth"), 703 ("as described
in the chapter"), 802 ("According to Laxmikanth"), 814 st 3 ("According to Laxmikanth"), 1001 ("According to Table 6.3 of
Laxmikanth"). Explanations: 804 and 903 w-lines say "The chapter gives ..." (explanations only, lower weight). Drop the phrase
from the stems; the facts stand without it. Many other stems say "in Table 6.1 / 6.3 / 6.4" (708, 709, 710, 801, 913, 1006,
1015, 1019, 1113, 1116, 1214); "Table 6.5" in 1214 is acceptable as a topic, the rest read as page-quiz framing.

**M5 - CS-POL-ch06-1114 st 1: "Mizoram, the 23rd state, preceded Arunachal Pradesh and Goa."** The chapter supports it only
through the ordinals 23rd/24th/25th (p.101). Mizoram and Arunachal Pradesh became states on the same date (20 February 1987,
p.101 footnotes 11 and 12), so an aspirant who knows the dates can call "preceded Arunachal Pradesh" false, which moves the key
to "2 and 4 only" (a listed option). The key follows the chapter, so this is not HIGH, but it is a second defensible reading.
Fix: compare Mizoram with Sikkim or Goa alone, or phrase it as "was numbered before". The same-date point also makes st 3
(Tripura after Meghalaya, same date 21 January 1972) true-to-false only through ordinals; the key is unaffected.

**M6 - CS-POL-ch06-717 st 3: "Part D was a group of several island territories."** Marked false (Part D was one solitary
territory, p.96). But the Andaman and Nicobar Islands are an island group, so a reader can take "several islands" as true,
which would make the key "Only one" instead of "None". Replace with an unambiguous false claim (for example "Part D
comprised two territories").

**M7 - Statement-I/II relation in CS-POL-ch06-818 (Part C ceased to exist / mergers and UTs).** Key: "II explains I". The
chapter (p.98) gives the two as parts of the same sentence, so II is more the content of I than a reason for it; a student
can defend "does not explain". Safer: make II a clean cause (the Fazl Ali Commission recommendation) or an unrelated true fact.
(918 and 1218 are defensible: p.98 "Its view was that unity ..." and p.101 "as it could not fully satisfy" give explicit
links. 1018 is explicit: "Consequently". 718 and 1118 "does not explain" are clear.)

## LOW
- L1 - Every concept has the same 5 direct / 9 which / 3 how-many / 2 Statement / 1 match shape, and 6 match items all use
  "swap two pairs" distractors in key position 0 order; vary the counts across concepts (the trend allows direct 15-30%).
- L2 - Absurd false statements decided by reading, not knowledge: 909 st 3 (Andhra creation weakened the demand), 1113 st 2
  ("no further change was needed"), 1216 st 3 ("police action" for Puducherry is plausible, keep), 808 st 3 (all ten
  Part C states became UTs). Prefer plausible swaps.
- L3 - 710 stem says "how the three states ... were integrated" but st 1 is about Table 6.1 membership; align stem and statements.
- L4 - 1102 pg lists [100, 104, 105] for 1102; the fact is on p.105 only. Also 1102 and 1114 etc. cite two pages where one is
  enough; harmless. 1202 pg [95, 101]: p.95 serves only the Article 4 distractor.
- L5 - 1118 Statement-II "29th state" next to 1001 "28 states": explanation covers it (J&K became a UT); consider a note in
  1118 so students do not think the bank contradicts itself.
- L6 - 903: "56 days" is the chapter's figure; many sources say 58 days. No 58 option, so nothing breaks, but the stem asserts
  the number as fact. Consider "the chapter's" phrasing avoided; or keep and accept.
- L7 - 913 st 1-3 are pure Table 6.2 lookups; the item is easy and adds little (all three true).
- L8 - Near-theme with tagged PYQs (not duplicates): 1114 and 1106-1107 touch the 2004 chronology question (Haryana, Karnataka,
  Meghalaya/Tripura) and 2007 (order of formation of Sikkim, Arunachal, Nagaland, Haryana); 1003/1008/1119 touch the 2000
  Goa/Daman and Diu question. No stem or option set is copied. Currency: nothing changed since the exam years (28 states, 8 UTs;
  Dadra and Nagar Haveli with Daman and Diu merged 2020; Ladakh and J&K UTs 2019) and the chapter matches 2026.

## Checks that passed (facts verified on the cited page)
Independence Act options and 549/552/3 (p.96); 9/9/10/1 = 29 and the Part A/B/C lists (pp.96-97); Dhar (Dec 1948,
administrative convenience), JVP members and April 1949 (p.97); Andhra Oct 1953 and the 56-day fast (p.97); Fazl Ali members,
Sept 1955, four factors, 16 states + 3 territories, 14 + 6 on 1 Nov 1956 (p.98); mergers, Kerala/Andhra Pradesh, the new UT of
Laccadive (p.99); Gujarat 15th, Nagaland 16th, Haryana 17th, HP 18th in 1971, Manipur/Tripura/Meghalaya 19-21 in 1972, 22nd
amendment of 1969, Sikkim steps, 35th and 36th amendments, Article 371-F, 1987 states 23-25, Mizoram Accord (pp.99-101);
Chhattisgarh/Uttaranchal/Jharkhand 26-28 (p.101, Table 6.4 p.107); Telangana 2014 (p.101); J&K 2019 and Order of 1954 (p.101);
28 + 8, name changes 1950/1969/1973/1991-92/2006/2011 (pp.102-103); Table 6.4 rows 3, 4, 6, 7, 10, 11, 14, 15, 16, 19, 33
(pp.104-107); Table 6.5 (p.108). Each of the six match items has exactly one consistent mapping.
For every distractor and every false statement I asked whether the chapter or common aspirant knowledge also supports it;
the only cases are M5, M6 and M7 above.
