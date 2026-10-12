# Verify fixes 2 - lk04b (Laxmikanth ch04)

Verdict: pass. 0 HIGH, 0 MEDIUM, 1 LOW.

Each changed item was answered cold from ch04.txt, then compared with the key. Page tags were checked against the PDF PAGE markers.

- 1313: key "1, 3 and 4 only" is right. Table 4.4 (p.82) puts freedom of trade under Australia, and puts impeachment, the vice-president and removal of judges under the US. Statement 2 (Ireland) is false. The four options are distinct and only one equals the true set. pg 82 is correct.
- 1001: Article 161 is correct (p.77). Article 72 is on p.76, Article 163 and Article 213 on p.77. Distractor tags are correct.
- 1017: Article 143 is the President and the Supreme Court (p.76). Articles 163, 110 and 155 are true, so "Only three" is correct. The counts in the w lines match.
- 1019: Article 155 is in Chapter II of Part VI (Articles 153-167), so Statement-II is false. Key "I correct, II incorrect" is right. pg 72, 73 and 77 are accurate.
- 709: Part XIV-A is by the 42nd Amendment (Note, p.75). Part IV-A is also by the 42nd, so Statement 2 is false. XIV-A sits between XIV and XV (p.74). Key "1 and 3 only" is right. The pages are fine.
- 718: Part IX-A is by the 74th (1992) and Part IX-B by the 97th (2011), per the Note on p.75. The Parts are on p.73. Both statements are true. See LOW-1 on the "explains" option.
- 915: Articles 38 and 25/30 are right as the item states. Article 32 and Article 13 are in Part III (12-35). Exactly two are correct, so "Only two" is right. pg 72, 75 and 76 are right.
- 913: Article 46 is for SC/ST and weaker sections, Article 50 is the separation of the judiciary, and Article 51 is international peace. Key "3 only" is right. The pages are right, and the mention of Articles 30 and 40 is on p.76.
- 701 (Part VIII, pp.72-73), 705 (Article 1 pp.72/75), 902 (pp.66, 75-77), 1203 (Third Schedule pp.79-81) and 1205 (Twelfth Schedule p.81, with 29 and 22 on p.81 and 98 on p.80): all pg arrays are supported by the text.

## Script over all 140 items
- Ids are unique (140).
- Key equals o[0] everywhere. Every item has 4 distinct options and 3 w lines. Every item has a non-empty pg.
- For all multi_statement items, the explanation covers every numbered statement.
- For the 63 "which" items, the key set equals the set the explanation marks correct, and no distractor equals the truth set. Each w line quotes its option, and its "includes" and "leaves out" lists match that option's actual error. There were 0 failures.
- For the how-many items, the key count matches the explanation, the options are distinct counts, and any "exactly N" in a w line agrees.
- The assertion_reason keys are all present in their options.

## LOW
- LOW-1, id 718: "Statement-II explains Statement-I" is defensible as the key. Some candidates could read II as only supporting I. Keep it, as the explanation is sound.
