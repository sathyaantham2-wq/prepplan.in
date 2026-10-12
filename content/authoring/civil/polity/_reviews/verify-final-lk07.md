# Final verification: lk07.json (Laxmikanth ch07 Citizenship)

Verdict: **fail** (1 HIGH). Counts: HIGH 1, MEDIUM 2, LOW 8.
All 240 items were answered cold from ch07.txt before the key was read. 239 keys match my own derivation. One does not (308).

## HIGH

### 308 (LK-7.3, which, key "3 only") - wrong key / no correct option
Statement 1: "A domiciled person became a citizen at commencement if both of his or her parents were born in India."
- The book (p.112) lists three alternative conditions: born in India, OR either parent born in India, OR five years' residence.
- If both parents were born in India, then either parent was born in India. So Statement 1 is TRUE as a sufficient condition.
- The explanation calls it incorrect ("it was enough that either parent was born"). That reasons about necessity, but the statement says "if", not "only if".
- Statement 3 is also true and Statement 2 is false (five years, not ten). The correct combination is "1 and 3 only", which is not offered.
- Fix: change Statement 1 to "...became a citizen at commencement only if both of his or her parents were born in India". Or replace it with a plainly false statement, such as "only if he or she was himself or herself born in India".

## MEDIUM

### M1. Repetition cap (2 per idea per concept) exceeded, in several concepts
The same fact is tested in 4 to 6 items within one concept. Each cluster below is one underlying fact; each id is a separate item testing it.
- 7.8, seven years abroad with the student / annual-registration exception: 803, 804, 809, 811, 816, 817.
- 7.9, PIO scheme rescinded 9 Jan 2015 / deemed OCI: 905, 908, 911, 914, 917.
- 7.9, Commonwealth citizenship omitted by the 2003 Act: 909, 912, 916, 920.
- 7.7, 2019 migrants deemed citizens from the date of entry: 703, 709, 712, 717, 719.
- 7.7, Assam 1966-71 entrants have no vote for ten years: 702, 707, 712, 715, 717.
- 7.10, renunciation ends the status of spouse and minor child: 1004, 1011, 1017, 1019, 1020.
- 7.11, OCI fee: 1107, 1116, 1119, 1120. 5-year OCI to citizenship: 1105, 1111, 1118. "Ordinarily resident" = 6 months: 1103, 1112, 1117.
- 7.2, the 1957 residence Act and the Andhra Pradesh, Himachal Pradesh, Manipur and Tripura list: 207, 213, 216, 217, 220.
- 7.4, Commonwealth repeal: 402, 406, 412, 420.
- Action: trim to 2 per cluster, or re-label the surplus items as distinct sub-facts. No factual error comes from this.

### M2. 1210 - PIO statements without Table 7.1 attribution (time-sensitive)
- Stem: "comparing NRI, PIO and OCI". Statements 1 and 2 say a PIO needs a visa and must register with police after 180 days.
- These are true per the table, but the PIO scheme was rescinded on 9 Jan 2015 (p.117). In current law, "a PIO needs a visa" is not an operative rule.
- Add "as given in Table 7.1" to the stem. The same applies to 1214 (stmt 1) and 1217 (stmts 1 and 3), which are LOW because their keys are unaffected.

## LOW
- 216: pg [111] omits 126. Statement 1 (J&K Reorganisation Act, UTs) rests on footnote 3, p.126. The explanation itself cites p.126. Add 126 to pg.
- 1003: pg [118, 123] omits 122. The lifelong visa distractor is on p.122.
- 409: pg [116, 117] omits 113. The Parliament power in statement 2 is on p.113.
- 1014: statement 3 ("state governments have no such power") is true in law but the book does not state it. The key is safe, so rewrite or hedge.
- 1020: item B "Cannot be registered" is ambiguous. It could be read as ineligible for OCI registration. The match is still unique, so add "as a voter" to the label.
- 618: Statement-II (waiver rule) merely restates Statement-I. "Explains" is circular. Consider "does not explain" or a different pair.
- 1119: the two statements are unrelated, one on nationality and one on the fee. That is acceptable as "true but unrelated", but the fee is time-sensitive. It is hedged to Table 7.1, which is OK.
- Format mix: direct 25% (60/240), which-statements 45%, how-many 15%, Statement-I/II 10%, match 5% (12). Against the 2020-26 column (26 / 48 / 12 / 6 / no match) it is close. Statement-I/II is slightly high and match is outside the trend table. Acceptable.

## Re-derived changed items (all fine except 308)
- 114: "1 only". Statements 2 and 3 are false because only citizens are eligible for Governor and Attorney General. OK.
- 116: None. Statements 1 and 2 are reversed. Statement 3 is false because Article 15 is for citizens only. OK.
- 119: I and II both correct, and II is a definition only, so it does not explain I. OK.
- 216: None. OK (see the pg note above).
- 308: HIGH, see above.
- 417: None. Statement 4 is false because the power comes from Article 11, not Article 5. OK.
- 507: "1 and 4 only". OK.
- 513: "1 only". Statement 2 is false: a birth in 2001 falls in the 1987-2004 band, where either parent being a citizen suffices. OK.
- 616: None. OK.
- 809: "4 only". OK.
- 810: "1 only". OK.
- 1013: "2 and 3 only". One year of imprisonment is not a ground; two years is. OK.
- 1107: "1 and 3 only". The fee in India is Rs 15,000, so the Rs 5,000 statement is false. OK.
- 1116: "Only one". OK.
- 1119: OK.
- 1216: None. OK.
- 106: "2 and 3 only". OK.
- 506: "2 and 3 only". OK.

## Other checks passed
- Falsifier rule: every false statement is false both per the book and in real law. This covers the 1955 Act, the 2003, 2005, 2015 and 2019 amendments, the Article 35-A origin, and the OCI exclusions.
- Match uniqueness: all 12 matches have a unique solution.
- Option shape: the key is the longest option in only 17 of 60 direct questions, which is about chance. No giveaway pattern in the combination keys. The key is stored at o[0] and is shuffled by the loader.
- Page tags: all others verified against the page text. The Table 7.1 rows fall on pages 120-125 as tagged.
- Near-duplicates of tagged PYQs: none identified.
