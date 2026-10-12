# Review: ncert_own_fr.json (POL-1.1 to 1.6, 120 items, Fundamental Rights)

Reviewer method: every item's key recomputed cold from Laxmikanth ch08 / ch12 text in
`content/reference/civil-services/laxmikanth/chapters/` (and real law) before reading the key; cited pages
checked against the `=====PDF PAGE=====` markers; `scripts/civil-services/dup-check.py` run at threshold 0.5
(128 hits, output in `scratchpad/rvfr/dup.txt`). Pack not edited.

**Verdict: needs_fixes (3 HIGH).** All 120 keys agree with Laxmikanth's text; the 3 HIGH are items where the
book-true key rests on a statement that is false or contestable in real law, so a second option is defensible.

Counts: HIGH 3, MEDIUM 15, LOW 14.

## Format mix (2020-26 column)

120 items: direct 30 (25%, target 26%), consider-statements "which" 54 (45%, target 48%), how-many 18 (15%,
target 12%), Statement-I/II 12 (10%, target 6%), match 6 (5%, not in table). Mix is on target. Per concept
exactly 9 / 5 / 3 / 2 / 1, which is mechanical but harmless. Key-shape notes under LOW.

## HIGH

**CS-POL-ncfr-1-10** (outside-Part-III rights). Statement 4 says redress "must be sought in the high court and
not directly from the Supreme Court under Article 32". The book (p.168) says the aggrieved person "can move the
High Court by an ordinary suit or under Article 226". A civil suit is a remedy, so "must be sought in the high
court" is false in real law. A solver who marks 4 false lands on "2 and 3 only", which is an option. Fix: reword
st. 4 to "Article 32 cannot be invoked for the infringement of these rights; the aggrieved person may go to the
high court under Article 226 or file an ordinary suit." Key unchanged.

**CS-POL-ncfr-1-13** (criticisms). Statement 4 ("preventive detention is an integral part of the constitutions
of many democratic countries") is labelled false because the book says no democratic country except India has
it. That claim is dated and wrong in real law (Pakistan Art 10, Bangladesh Art 33, Malaysia, Singapore all
carry preventive-detention provisions). A well-read solver treats 4 as true and picks "2, 3 and 4 only", which
is an option, so there are two defensible answers. Fix: drop st. 4 and replace with a statement false in real
law, for example "The chapter records that the Fundamental Rights, being in the Constitution, are unamendable and
therefore 'permanent'" (book p.167: 'No Permanency'), and re-key. Also see MEDIUM on st. 1 (contradicts 5-17).

**CS-POL-ncfr-6-10** (Article 31B / Ninth Schedule). Key is "1, 2, 3 and 4". Statement 1 says Article 31B
"protects any law in the Ninth Schedule from all Fundamental Rights". After Waman Rao and I.R. Coelho this is
false for post-24-April-1973 laws, and the pack itself says so in 6-04 and 6-20 (where "blanket immunity" is
the wrong option). Statement 4 (state-legislature Ninth Schedule acts deal with land reform, Parliament's with
other matters) is a book generalisation contradicted by 2-13 of this same pack (the Tamil Nadu reservation Act
is a state act in the Schedule). A solver who rejects 1 and/or 4 has the options "1, 2 and 3 only" and "2, 3 and
4 only" available. Fix: rewrite st. 1 as "Before the Coelho ruling, Article 31B was read as shielding every
Ninth Schedule law from all Fundamental Rights" or remove; drop st. 4; also see MEDIUM on the 282 count.

## MEDIUM

- **2-11** st. 3 and 4 are in the present tense ("A family is identified as EWS ..."). EWS and creamy-layer
  limits are administrative and revisable. Wording of st. 1 ("according to the chapter ... raised to Rs 8 lakh
  in 2017") is safe. Fix: prefix st. 3 and 4 with "Under the 2019 order described in the chapter". Figures
  match book p.136 (1 lakh in 1993, 2.5 lakh 2004, 8 lakh 2017; 5 acres; clubbing of property).
- **6-10** st. 2: "now contains 282". The book gives 282 with a footnote that the last entry is numbered 284.
  Count is time-sensitive and unrelated to the exam skill. Fix: keep "originally 13" only, drop the present count.
- **2-18** st. II ("a substantially true newspaper report ... cannot give rise to civil or criminal liability").
  Article 361-A carries a proviso (publication made with malice is not protected). The book omits it, but a
  careful solver can call II incomplete. Fix: add "if published without malice" to II.
- **3-20** match. List-II item 3 ("sovereignty and integrity and public order only") and item 4 ("... and
  morality") are also true grounds for speech (16th Amendment added sovereignty and integrity and public order
  to 19(2); decency or morality is in 19(2)). A is only fixed by the contempt/defamation row, so the key is
  still unique, but the stem word "specific to it" is doing all the work. Fix: use "ground peculiar to that
  freedom" with rows such as "protection of the interests of any Scheduled Tribe" (movement), "contempt of court
  and defamation" (speech), "morality, not a ground for assembly" avoided; or drop item 4's "morality" overlap.
- **4-01** invented compulsory service scenario ("without paying them"). Book p.153 says only that compulsory
  service for public purposes such as social service is allowed and the State is not bound to pay. Real law
  (Asiad, Deena) treats unpaid labour narrowly, so option 2 ("only if minimum wage") is not clearly false in
  real law. Fix: make the stem "compulsory military or national service" and drop the flood-control detail.
- **4-07** st. 2 ("It also prohibits the employment of children in harmless or innocent work"). Referent is
  Article 24 (book p.154 says it does not prohibit harmless work), but the stem says "Article 24 and child
  labour" and the 2016 Act bars all work under 14 except family enterprises and audiovisual work, so "It" can be
  read as the statute. Fix: state "Article 24 prohibits ... " explicitly in st. 2 and word st. 4 as the Act.
- **5-06** st. 3 ("Parliament can empower any other court, including the high courts, to issue writs of all kinds
  under Article 32"). False only because the book says "any other court does not include high courts" (the
  Article text is just "any other court"); also omits "within local limits". Same statement is already in
  lk08-166. Fix: swap for a different false statement (for example "Parliament has already empowered district
  courts to issue writs").
- **5-09** st. 3 is "true" (prohibition only against judicial and quasi-judicial authorities, not
  administrative). True in the book (p.161), but modern law extends both certiorari and prohibition to
  administrative authorities acting quasi-judicially, and the pack's own 5-10 st. 3 says certiorari was
  extended. A solver may mark 3 false and pick "2 only". Fix: reword as "against purely administrative or
  legislative acts, prohibition is not available" or delete st. 3.
- **5-16 / 5-12 / 5-18** internal tension. 5-18 st. I ("the Supreme Court may not refuse to exercise its writ
  jurisdiction under Article 32") and 5-12 st. 3 sit with 5-16 st. 4 ("the Supreme Court expects the petitioner
  to approach the high court first"). Book supports both (pp.159-160), real practice leans to 5-16. Fix: in 5-18
  add "as a matter of the Article's guarantee" or replace st. I with "A high court may refuse a petition under
  Article 226 but the Supreme Court is bound to hear a Fundamental Right petition".
- **3-19** Statement-II is almost a restatement of Statement-I, so "II explains I" versus "does not explain" is
  arguable. Fix: make II the cause ("Article 21 speaks of procedure established by law, which Maneka read to
  include natural justice") or key it "does not explain" with an unrelated II.
- **6-06** st. 3 (Article 33 law can exclude courts martial from the writ jurisdiction of the Supreme Court and
  high courts "for the enforcement of Fundamental Rights"). Book p.162 supports; in real law judicial review of
  courts martial survives on limited grounds and the Armed Forces Tribunal now exists. Already in aks05b-057.
  Fix: replace with a non-contested statement or keep the book's qualifier "so far as the enforcement of
  Fundamental Rights is concerned" in the item.
- **1-13** st. 1 ("The remedy for enforcing them is inexpensive, so they chiefly benefit the common man"). The
  same pack's 5-17 st. 1 treats "inexpensive" as true of Article 32 (book p.159). The "false" label rests on the
  critics' view that the judicial process is expensive, so a literal solver sees a contradiction. Fix: phrase as
  the critics' claim: "Critics say the judicial process is so costly that the rights chiefly benefit the rich."
- **5-04** option 3 ("certiorari ... issued only after the final order, but can also stop the proceedings
  meanwhile") is self-contradictory and half true in real law (certiorari can quash interim orders). Fix:
  "certiorari, because it quashes the proceedings as soon as jurisdiction is doubted".
- **Duplicates, see section below.** The pack restates statements already in lk08, aks05a, aks05b, lk09, lk11
  and ncert_polity packs in about 50 places. This is MEDIUM overall (loose bank value) and HIGH only for the
  near-identical question stems listed.
- **Statement-I/II key skew**: 7 of 12 are "Both correct and II explains I" and none is "Both incorrect". Fix:
  make two of them "Statement-I incorrect, Statement-II incorrect" or "correct, does not explain".
- **Answer-position of correct option in direct mcq**: in 8 of 30 items the correct option is the longest
  (1-02, 1-04, 2-01, 3-03, 3-04, 4-01, 4-04, 5-02), and several have a hedged clause ("since ...") only on the
  right answer. Loader shuffles positions, so only length is the tell. Fix: pad distractors in those items.

## LOW

- **1-18** Statement-II is irrelevant to Statement-I (justiciable vs 1978 property); acceptable but weak for a
  "does not explain" item.
- **1-20, 2-20, 3-20, 4-20, 5-20, 6-20** all "wrong option" explanations repeat the whole key paragraph; each
  match wrong option has only one differentiating clause. Cosmetic.
- **2-03, 2-04** the right option is the longest by a margin. See length-tell note above.
- **2-19 vs 2-07** st. 2 and 3: the Dicey-third-element fact is tested twice in one pack.
- **3-04** time-sensitive: "has not yet been brought into force". True as of the 8e text and today, and the
  stem says "according to the chapter". Suggest "as on the 8th edition" for safety. Same fact in aks05a-097.
- **3-16** correct, but "TADA remained in force until 1999" depends on lapsing (1995) vs repeal; book says
  repealed in 1995. Fine.
- **4-04** "recognised by the State and receives no other aid" is confusing (is recognition aid?). Fix: "is
  recognised by the State but receives no aid".
- **4-10** E for st. 1 says "Taxes may be used for all religions", which explains st. 2 not st. 1.
- **5-14** st. 1 ("mandamus cannot be issued against a private individual or body") is book-true but real law
  allows it against private bodies discharging public functions (Anadi Mukta). Key safe because st. 4 is the
  only false statement and appears in every wrong option.
- **6-02** relies on ADM Jabalpur for "martial law does not ipso facto suspend habeas corpus"; the holding on
  Article 21 in that case was overruled (Puttaswamy 2017) but the book line is unchanged. Safe as worded.
- **6-15** E for st. 4 ("laws inconsistent ... cease to have effect") does not explain "Article 19 revives".
- **2-05** option 3 pairs Article 338-B with a Narasimha Rao distractor; harmless.
- **6-19** II "explains" I is plausible but loose.
- **Explanations** throughout 'which' items use "Chapter text" as the reason (for example 5-10, 5-11, 6-10). Not
  wrong; thin for study.

## Recomputed keys and pages

All 120 keys match Laxmikanth. Specific confirmations: 1-07 Table 8.2 (Art 24 open to foreigners); 1-16 Table
8.1 (21A in Right to Freedom); 2-12 / 2-13 Tables 8.3-8.4 and 82nd, 76th, 102nd Amendments; 2-17 Padma limit
120 and Bharat Ratna 3; 3-09 Bombay HC validated AIDS restrictions, reside = temporary, settle = permanent;
3-16 PDA 1969, MISA repealed 1978, TADA 1995, POTA 2004; 4-02 Rs 20,000 per child; 4-09 Ramakrishna Mission and
Ananda Marga denominations, Aurobindo Society not; 6-14 Table 12.1 (Sampath Kumar 1986, Bhim Singhji 1980,
Central Coal Fields 1980). Page citations checked: all fall within the claimed pages (ch08 pdf pages 127-169,
ch12 198-201, ch17 262-264). Sampled mismatch: none found.

## Time-sensitive items

| Item | Fact | Verdict |
| --- | --- | --- |
| 2-11 | creamy layer Rs 8 lakh (2017) | st. 1 safe (history, "according to the chapter"). |
| 2-11 | EWS Rs 8 lakh, 5 acres | add "under the 2019 order". |
| 2-09 | 103rd Amendment, 10% EWS | safe, upheld 2022, no wording change needed. |
| 6-10 | 282 Acts in Ninth Schedule | drop the count (book itself footnotes 282 vs 284). |
| 3-04 | 44th Amendment advisory board still not in force | safe as worded; add "as on the 8th edition". |
| 2-13 | NCBC constitutional status 2018 | safe. |
| 4-07 | 2016 renaming of the child labour Act | safe; 2016 Act bans work under 14 generally, see MEDIUM. |

## Near-duplicates of existing statements (dup-check, both ids)

"Re-angle" = flip polarity, change the fact or drop the statement. Same-fact restatements with the same truth value:

| This pack | Existing | Recommendation |
| --- | --- | --- |
| 5-05 (Ambedkar "soul of the Constitution") | ncert_polity4 ncp4-2-04 | Replace; near-identical question. |
| 3-11 (rights read into Art 21 list) | ncert_polity3 ncp3-2-17; lk08-131/132 | Replace with different cases from Table 8.6 (Hussainara, Bandhua Mukti, Vishaka). |
| 5-06 st. 3 | lk08-166 | Same false statement; replace. |
| 5-06 st. 4 | aks05b-035 | Re-angle. |
| 5-12 st. 1 | lk08-176 | Re-angle (swap "original" for "not exclusive"). |
| 5-17 st. 2 | lk08-167 | Replace. |
| 5-18 | lk08-178 | Replace Statement-I with a different Article 32 vs 226 difference. |
| 5-03 | lk08-173 | Keep only if re-angled (quo warranto conditions). |
| 5-16 st. 3 | lk08-174 | Re-angle. |
| 5-10 st. 3 | lk08-172 | Re-angle. |
| 5-14 st. 4 | lk08-171 | Re-angle. |
| 3-10 st. 2 | lk08-118 | Re-angle. |
| 3-12 st. 2 | lk08-131 | Re-angle. |
| 3-13 st. 3 | lk08-109 | Re-angle. |
| 3-14 st. 2 | aks05a-099 | Same false statement; replace. |
| 3-04 | aks05a-097 | Same fact; drop or reframe (advisory board constitution). |
| 3-15 st. 2 | lk08-139 | Re-angle. |
| 3-18 st. 2 | aks05a-073 | Re-angle. |
| 3-06 st. 1-2 | aks05a-062; lk08-087 | Re-angle. |
| 3-08 st. 3 | lk08-091 | Re-angle. |
| 6-04 | aks05a-030 | Same fact (Coelho) in stem form; re-angle. |
| 6-06 st. 3 | aks05b-057 | Replace. |
| 6-16 st. 2, 3, 4 | lk09-994; lk11-210; lk11-217 | Replace the item. |
| 6-14 st. 2 | ncert_polity1 ncp1-7-10 | Same false statement; replace. |
| 6-20 A | ncert_polity5 ncp5-1-12 | Re-angle (change row A). |
| 6-08 st. 1, 3 | lk08-191, lk08-198 | Re-angle. |
| 6-10 st. 4 | lk08-195 | Delete (see HIGH). |
| 6-12 st. 1 | lk17-077 | Re-angle. |
| 6-15 | aks13-040 | Re-angle. |
| 2-13 st. 1, 2, 3 | lk08-057, lk08-052, aks20a-087 | Replace statements. |
| 2-17 st. 3 | lk08-062 | Replace. |
| 2-16 st. 1, 2 | aks05a-051, lk08-067 | Re-angle. |
| 2-14 st. 1 | lk08-074 | Re-angle. |
| 2-10 st. 1, 3 | lk08-046 | Re-angle. |
| 2-07 | aks05a-014 | Re-angle. |
| 2-11 st. 4 | aks05a-032 | Re-angle. |
| 2-09 st. 1 | lk08-047 | Re-angle. |
| 1-09 st. 1, 2 | aks05a-009 | Replace. |
| 1-10 st. 1 | lk08-010 | Replace (also fixing HIGH). |
| 1-20 (Arts 265, 300A) | aks05b-013; aks11a-113 | Re-angle. |
| 1-05 | lk08-028 (inverted) | Fine; they are opposite statements. |
| 1-07 | lk08-005, -008, -012 | Re-angle. |
| 1-11 | aks05a-007 | Re-angle. |
| 1-14 st. 3 | lk08-070 | Re-angle. |
| 4-07 st. 4 | aks05a-111 | Replace. |
| 4-08 st. 2 | aks05a-112 | Same false statement; replace. |
| 4-10 st. 1, 3, 4 | lk08-149, aks05b-002, aks05b-018 | Replace. |
| 4-17 st. 2 | aks05a-119 | Re-angle. |
| 4-20 D | lk08-141 | Re-angle. |

Overall: the pack is fundamentally a restatement of lk08 / aks05 content in new formats. If the aim is "no
statement twice in the bank", roughly 40 statements need re-angling; if the aim is "new format on high-yield
facts", this is acceptable once the 3 HIGH are fixed and the near-identical stems (5-05, 3-11, 3-14 st.2,
4-08 st.2, 6-14 st.2, 5-06 st.3) are replaced.
