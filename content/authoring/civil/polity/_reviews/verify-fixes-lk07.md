# Verification of fixes: lk07.json (Laxmikanth ch07 Citizenship)

Verdict: **pass**. HIGH 0, MEDIUM 1, LOW 4.

## Method
- All 29 changed ids were answered cold from ch07.txt before the key was read. All 29 keys match my derivation.
- 308, 1020, 618, 1011, 712 and 717 were each worked statement by statement. The result is below.
- Scripted checks over all 240 items:
  - `a` equals `o[0]` everywhere.
  - Every quoted option in `w` equals the matching distractor.
  - For all 108 "which" items, each "includes / leaves out" claim in `w` matches the set difference between that option and the key.
  - For all match items, each "Interchanges X and Y" note names exactly the pair that differs from the key.
  - For all how-many items, each "not ..." note names its own distractor.
  - There are zero mismatches, so the reshape did not break the w-notes.

## Specifically requested
- **308** (key "3 only"). Statement 1 is now "only if he or she was himself or herself born in India". It is false because p.112 gives three alternative conditions. Statement 2 is false (five years, not ten). Statement 3 is true. "3 only" is unique, and the "only if" wording removes the old sufficiency reading. The w-notes are aligned. OK.
- **1020** (match). A-2 (Vice-President, Art 66), B-3 (voter registration), C-4 (trading with an enemy in war), D-1 (violation of the Act, added in 2019). Every other pairing fails, so the permutation is unique. The label "Cannot be enrolled on the electoral roll" removes the earlier ambiguity. The three swap notes (B/D, A/D, B/C) match the three distractors. OK.
- **618**. Statement-I is correct (waiver, p.115). Statement-II is correct (language condition). II does not explain I, so the key is correct. "Explains" is no longer circular. w1 and w2 line up with the options. OK.
- **1011**. Key "1, 2 and 4 only". Statement 3 is false because the OCI cardholder is eligible only for the posts the Centre specifies. OK.
- **712**. Key "2 only". Statement 1 gives a wrong date (it should be 1 January 1966). Statement 3 is false because entry on or after 25 March 1971 is not covered. Both are false in real law (s.6A) and per the book. OK.
- **717**. Key "None". All four statements are false: the 2016 step was a long-term visa, the exemption was a 2015 executive act, the Assam provisions came from the 1985 Act, and pending proceedings abate. OK.

## The other changed ids (all keys confirmed)
- 213: "2, 3 and 4 only". Statement 1 (42nd Amendment) is false. The 32nd Amendment, 1973, is correct.
- 216: None. pg now includes 126.
- 217: Only three.
- 406: "1 and 2 only". Statement 3 is false because the power comes from Article 11.
- 409: "1, 2 and 3". pg now includes 113.
- 417: None.
- 709: "1 only".
- 715: Only one.
- 809: "1 and 4 only". The ten-year version of the imprisonment ground is false.
- 816: None.
- 817: Only two.
- 908: "1 and 2 only".
- 909: "2 only".
- 911: "3 and 4 only".
- 917: All four.
- 1003: Registration as a voter. pg now includes 122.
- 1014: "2 and 3 only". Statement 4 now says the Supreme Court cancels, which is false per p.119 and real law. The old unsupported statement is gone.
- 1017: Only three.
- 1119: Both correct, II does not explain I. Hedged to Table 7.1.
- 1120: Match A-3, B-4, C-1, D-2 is unique. The stem cites Table 7.1.
- 1210: "1, 2 and 3 only". The stem now says "as given in Table 7.1".
- 1214: "3 and 4 only". Hedged to Table 7.1.
- 1217: Only two. Hedged to Table 7.1.

No Falsifier-rule problem found. Every false statement is also false in real law: the 1955 Act, the 2003, 2005, 2015 and 2019 amendments, s.6A Assam, the OCI exclusions, and the Article 11 versus Article 5 split.

## Findings

### MEDIUM
- **905 / 914 / 912 (st.3) / 917 (st.4) / 920 (C): PIO rescission and merger is still tested five times in concept 7.9.**
  - 905 (direct) and 914 (which) are near-duplicates. Both test "rescinded on 9 January 2015, existing PIO cardholders deemed OCI".
  - The others add one statement or option each.
  - This is down from the earlier five full items, but it is still above the cap of 2.
  - Fix: re-theme 914 (for example, the nomenclature change and 2015 versus 2005 scope only), or drop the rescission statement from 912 and 917.

### LOW
- **1017**: The stem is only "Consider the following statements:", and statement 1 reads "Dissolution of the marriage of the cardholder can be a ground." Nothing says "ground for cancellation of OCI registration". Statement 2 supplies the context only by implication. The key is safe. Add "Consider the following statements about cancellation of OCI registration:".
- **Footnote-9 exceptions to seven-year deprivation (804, 811, 809 st.1)**: three items touch the same footnote. 804 and 811 are close to duplicates. Keep one.
- **Repeats that were not edited**: the OCI-5-year route to citizenship appears in 1105, 1111 and 1118. The "6 months ordinarily resident" definition appears in 1103, 1112 (st.3) and 1117 (st.3). Each cluster is at 3 against a cap of 2. 1111 has no Table 7.1 attribution, though "had to be" makes the PIO statement acceptable.
- **917 st.4**: "the merger removed the need for two parallel schemes" is an inference from the book's "causing confusion ... formulate one single scheme". It is fair. The key is safe.

## Clusters from the earlier review, re-counted
- Seven years abroad / annual registration: 803, 804, 809 and 811 remain. 816 and 817 were moved to other facts. That is 3 to 4 touches, so see LOW above.
- Commonwealth citizenship, concept 7.9: only 912 now. Concept 7.4 has 402 and 412. OK.
- 2019 deemed from entry date: 703 and 719 only. OK.
- Assam 1966-71 / no vote: 702 and 707 are the main items. 715 and 712 test other points. OK.
- Renunciation ends spouse and minor status: 1004 and 1019 only. OK.
- OCI fee: 1107 and 1116. OK.
- The 1957 Act / list of states: 207 and 213. 216 and 217 now test J&K. 220 is a match. OK.

## Spot-check of 15 untouched items
Ids checked: 105, 120, 211, 305, 412, 507, 603, 614, 706, 803, 906, 1005, 1018, 1105, 1203. All keys are correct against the chapter, the cited pages state the fact, and the w-notes are aligned with the options. No issue.
