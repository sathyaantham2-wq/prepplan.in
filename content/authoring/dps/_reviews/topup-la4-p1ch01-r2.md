# Re-review (r2): class7-topup/p1ch01-la4.json (Class 7 Maths P1 Ch1, gegp101)

Method: diffed against _reviews/topup-la4-v1/p1ch01-la4.json; recomputed every changed number in python; checked
steps (4 steps x 1 mark = 4), pages, tags, Bloom/difficulty values against the loader and DB enum.
Changed items: C7M-1.1, 1.2, 1.4, 1.5. Unchanged (byte-identical): 1.3, 1.6, 1.7, 1.8, 1.10 -> confirmed unchanged.

| Concept | Verdict | Notes |
|---|---|---|
| C7M-1.1 (changed) | OK / LOW | 23,04,060; 23,40,600; difference 36,540; 50,000-36,540 = 13,460; places (4: thousands -> ten-thousands, 6: tens -> hundreds) all correct; both numbers use digits 2,3,4,6,0. The invented reader's claim (and claim_check tag) is gone, replaced by a place-value reason: good. LOW: (a) and (b) are still routine reading/writing; "how far from half a lakh" in (d) is an arbitrary comparison. Page pp. 4-5 right. |
| C7M-1.2 (changed) | OK | 42,070,000 = 4,20,70,000; read as four crore twenty lakh seventy thousand; 4,27,00,000 - 4,20,70,000 = 6,30,000 = 630,000; 42,700,000 = forty two million seven hundred thousand; 1 crore = 10 million used. One defensible answer. Pages 8-9 right (million/crore table is on p. 8). |
| C7M-1.3 | LOW (unchanged) | Key correct (3,00,000; 1,00,002; 1+5+15 = 21). Earlier LOW (state "fewest clicks = digit sum" as given) still open, optional. |
| C7M-1.4 (changed) | OK | Earlier MEDIUM RESOLVED. (d) now asks only for the left-over under each rule and which leaves fewer: exact total 6,41,277; 6,50,000 - 6,41,277 = 8,723; next-thousand 2,94,000 + 3,48,000 = 6,42,000, left over 723; 8,000 fewer. No "better" judgement, one answer. (a)-(c) re-verified (2,90,000 and 3,50,000; short by 3,415 because the thousands digit 3 < 5; 3,00,000 + 3,50,000). Step 4 matches (d). |
| C7M-1.5 (changed: page only) | OK | Earlier LOW RESOLVED: "pp. 11-12" now (estimation of sums is on p. 11, continues p. 12). Key re-verified: lower bounds 9,10,000 > 9,00,000; upper 9,30,000; 6,38,000 + 2,87,000 = 9,25,000 strictly below the true sum; 9,26,323; short by 1,323. |
| C7M-1.6, 1.7, 1.8 | OK (unchanged) | Keys were verified in round 1; text identical. |
| C7M-1.10 | LOW (unchanged) | Close to the book's Try This; acceptable. |

Checks: all 9 have 4 steps of 1 mark (sum 4); no option-position wording; no scope OUT line touched; difficulty values Hard 7 / Hardest 2 (valid); Bloom Apply 1 / Analyse 5 / Evaluate 3 (all fit the la4 slot); tags: claim_check 1, show_impossible 1 (down from 2 claim_check). Not templated.

## Counts
HIGH 0, MEDIUM 0, LOW 4 (1.1, 1.3, 1.10, plus 1.5 part (a) is easy next to (c), cosmetic).
Earlier MEDIUM (1.4) resolved; earlier LOW (1.5 page) resolved.

Verdict: PASS
