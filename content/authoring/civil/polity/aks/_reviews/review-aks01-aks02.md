# Review: aks01 (Historical Background, 100 Qs) and aks02 (Making of the Constitution, 60 Qs)

Reviewer: independent. Packs not edited. Sources used: Laxmikanth ch01.txt / ch02.txt, notes ch01/ch02, inventories, AUTHOR_BRIEF.md, real history.

Verdicts: **aks01 = FAIL (2 HIGH)**. **aks02 = FAIL (1 HIGH)**. Both need a short fix round; the rest of each pack is sound.

Ids below are the last three digits of `CS-POL-aks01-###` / `CS-POL-aks02-###`.

## Mechanical results
- `check-civil-pack.py`: 0 problems on both packs.
- Format mix (per concept 5 direct / 9 which / 3 howmany / 2 stmt12 / 1 match) equals the brief; against the 2020-26 column (direct 26, which 48, howmany 12, stmt-I/II 6) it is acceptable. Stmt-I/II is 10% (aks01) vs 6% trend, a small overshoot.
- I recomputed every `which` key from the "Statement n is correct/incorrect" lines of `e`, and every `howmany` key from the counts. No mismatch in either pack. Statement counts match the stems.
- `aks-coverage.py --chapter 01`: 189 facts, 179 covered, 10 skipped, 0 uncovered. `--chapter 02`: 139 facts, 132 covered, 7 skipped, 0 uncovered. Skip share is under 12% in every concept. See skip remarks below.
- `dup-check.py`: aks01 29 lines >= 0.6 and aks02 24 lines >= 0.6. The maximum is 0.69, so nothing reaches the 0.7 re-angle line. Items that reuse the same fact or the same false variant as an lk pack are listed under LOW.
- `pg` tags: the inventory page of every fid is inside the question's `pg` except aks01 096 and 099 (LOW).

## aks01 findings

Counts: HIGH 2, MEDIUM 9, LOW 10.

### HIGH
- **055** (howmany, membership of the councils under the 1909 reforms). Statement 4, "Members were chosen through indirect elections and not by general public voting", is counted as correct. The stem lists ex-officio and nominated members, and those were never elected, so read literally the statement is false. Statement 3 already carries the indirect-election fact, so 3 and 4 also repeat each other. A careful candidate can reach "Only two", which is an option. Fix: reword statement 4 to cover only the elected members, or replace it with a clearly true or clearly false statement (for example, the Central council kept an official majority).
- **056** (howmany, 1909 Act). Statement 3, "Separate representation was also given to provincial councils", is keyed false. In real history, and in Laxmikanth's own account, the 1909 Act applied Muslim separate electorates in the provincial as well as the Central councils. The inventory note (A01-132) shows only that the notes' wording "provincial councils" is absent from Laxmikanth's list of special constituencies. Under the Falsifier rule this fails: the statement is arguably true, so the count is 3 and not 2. Fix: replace it with an unambiguously false item, for example "Separate electorates were given to Hindus in the provincial councils".

### MEDIUM
- **011** The two decisive statements are notes-only facts that A01-030 says to avoid as key facts. Statement 3 says the dividend was capped at 6 per cent. Statement 4 puts the Directors' term at four years (the false variant says ten). Both are true in real history (the 6% cap applied until the Company's loan was repaid), but Laxmikanth does not state either. The explanation says only "a provision recorded for the Act" and gives no source. Fix: put the real source in `e`, or test Laxmikanth facts (the ban on private trade and presents, the report duty).
- **072** Statement 4, "The Federal Court was established in 1937 as the first all-India judicial body", decides the key (without it the answer would be "1 and 3 only", which is an option). Laxmikanth says only that the Court was set up in 1937. "First all-India judicial body" is a notes-only superlative that is debatable. Fix: use "Federal Court was set up in 1937" (supported) and move the superlative out.
- **075** Statement 4, "The Central Public Service Commission was set up in 1935 under the 1935 Act", is keyed false because the CPSC dates from 1926. The same pack's 074 statement 3 says the 1935 Act provided for a Federal PSC, which an examinee can read as a 1935-Act body. The statement is arguable. Fix: use "The Central Public Service Commission was set up in 1926" as the true statement and test the Federal PSC separately.
- **Key-length tell in direct items.** The brief caps this at about one third. The correct option is the single longest in 021, 024, 025 (concept 1.2: 3 of 5), 042, 043, 044 (concept 1.3: 3 of 5), 062, 064, 065 (concept 1.4: 3 of 5) and 082, 084 (concept 1.5: 2 of 5). Fix: lengthen two distractors per item.
- **Repetition cap (max 2 per idea per concept).**
  - Concept 1.1: subordination of Bombay and Madras to Bengal appears in 009, 014, 015, 017 and 018. The four-member Executive Council appears in 009, 015 and 020.
  - Concept 1.4: central dyarchy never operated appears in 064 and 079. The Federal Court of 1937 appears in 072, 075 and 097.
  - Concept 1.5 re-tests concepts 1.1-1.4 by design, but the 1919-bicameral versus 1935-federation contrast is in 082, 086 and 092, and central dyarchy again in 091 and 099.
  - Fix: rewrite one or two occurrences in each cluster into untested facts.
- **Skip reasons.**
  - A01-122, A01-123, A01-151 and A01-152 are labelled `verify-conflict`, but no source contradicts them; Laxmikanth is merely silent. They are true in real history: provincial council sizes of 1909, the limited women's franchise of 1919, and the Governor's power to restore rejected grants. The brief allows only verify-conflict, time-bound or untestable. Either test them in a real-history-safe form or re-label them.
  - A01-099 (Doctrine of Lapse and the 1858 Act) has a testable corrected form: the Queen's Proclamation, not the Act, renounced it.
  - A01-049: Cornwallis was still Governor-General when the 1793 Act was passed. This is not disputed and is testable.
- **038** Statement-I is only the inference of Statement-II (no fixed term, hence Parliament could end the rule). The brief says II must not restate I. Change I to a different, causally linked fact.
- **069** The stem says "about the Government of India Act, 1919", but statement 1 is the 1917 declaration and statement 3 is the Chamber of Princes (1921, a Royal Proclamation, not an Act provision). `fi` lists only A01-150 for four statements. Fix: reword the stem to "about the 1919 reforms" and list the fids.

### LOW
- Tell-words in false statements while the true ones avoid them: 016 s3 "solely", 019 Statement-II "sole", 051 s4 "only after", 076 s4 "Any ... automatically", 093 s3 "could not repeal any".
- 092: the stem says "pairs" but the question asks about statements.
- 054 s4 joins two separate facts (supplementary questions, and two Indians on the Secretary of State's council in 1907).
- 013 s3 adds "for the first time". Laxmikanth does say "for the first time called". The wording is fine.
- 040: item D ("End of Maratha power and British paramountcy") for Lord Hastings can also be argued for Wellesley. Only the Subsidiary Alliance pairing makes the match unique.
- 065 `w`: the line "reserved to the Governor-General" about the Crown veto is loose.
- 083 and 085 are trivial recall.
- 096 and 099: the `pg` list lacks a fact page.
- 009: the explanation is thin, but it is correct.
- Near-copies of lk packs (>= 0.6; none reaches 0.7). These carry the same false variant: 016 s2 vs lk01b-1316; 037 s4 vs lk01b-1310; 091 s3 vs lk01-607 (dyarchy at the Centre in 1937); 075 s1 vs lk01-609. Other near-copies: 026 s3, 074 s4 (vs lk01-609), 071 s3, 012 s3, 009 s1, 047 s1, 052 s2, 053 s2, 073 s2, 070 s1, 011 s1, 095 s1.

### aks01: statement-by-statement verification
All other statements were re-derived from Laxmikanth ch01 and real history and are correct as keyed. Points checked in particular:
- The 14 per cent figure for the 1935 franchise is in Laxmikanth (087).
- "In trust for the Crown" is placed in the 1833 Act by Laxmikanth and in the 1853 Act; 027 s4 and 028 are correctly keyed (1813 asserted sovereignty only).
- Chelmsford and Montagu are not swapped in the key (066).
- The Canning ordinance power and the 1859 portfolio system are correct (043, 050, 051).
- The 1853 figures, 24 to 18 Directors with 6 Crown nominees, are correct (031, 037).
- The ten facts skipped are individually defensible, except as noted above.

## aks02 findings

Counts: HIGH 1, MEDIUM 6, LOW 6.

### HIGH
- **039** (Statement-I/II). Statement-II is an invented generalisation: "Dividing the work among committees allowed specialised debates while overall control stayed with the full Assembly". No source supports it. It also gives a purpose for having committees, not a reason for there being "eight major" ones. "Both correct, II does not explain I" is as defensible as the keyed "II explains I". Two defensible answers. Fix: use a source-based Statement-II, for example "The Union Powers and Union Constitution committees were both chaired by Nehru" (correct, does not explain), or a false II.

### MEDIUM
- **058** Statement-II ("needed at once to enable the transition") is the author's inference. Laxmikanth says only "temporary and transitional provisions". The key (II explains I) is defensible, but it rests on opinion. Recast as a plain fact pair.
- **016** Statement 4 ("met for 165 days in all") comes only from the notes. Laxmikanth gives 11 sessions, 114 days on the draft and the 2y-11m-18d span, but not 165. 165 is a widely quoted real figure, but sources also say 166. The "All four" key depends on it. Replace it with a Laxmikanth fact, or make the question a three-statement item.
- **046** s3 (284 members signed on 24 January 1950) is true in real history and in Laxmikanth's Table 2.6 note. Laxmikanth's running text, however, puts the 284 signatures on 26 November 1949. The key survives (only option 0 omits the false statement 2), but a careful candidate will see the conflict. Say "according to Table 2.6" or drop the date.
- **007** s4 ("Nehru's 1938 view was endorsed by a Congress resolution in 1946") is keyed false because Laxmikanth dates the resolution 1939. In 1946 the Congress also passed resolutions accepting the Cabinet Mission scheme, so it is not cleanly false. Change it to "...in 1942".
- **032** The explanation for statement 1 is garbled: it is marked correct, then a parenthesis says "J.B. Kripalani headed the Fundamental Rights sub-committee, not the Flag Committee". The `w` lines cite Laxmikanth pages ("p.43"), not notes pages. The fact itself (Prasad chaired the Flag Committee) is right. Rewrite `e` and `w`. A02-133 (the notes' conflicting Kripalani table) is also in this `fi`; drop it from `fi`.
- **Repetition cap.** In concept 2.3 the early-commencing Articles (5-9, 60, 324, 366-367, 392-393) are tested in 041, 047, 048 and 058. In concept 2.1 the 1934/1935 Roy-Congress dates are in 001, 007, 020 and 051. Trim one item from each cluster.

### LOW
- 009 s4: "Most princely states stayed away, leaving their 93 seats vacant" is inconsistent. Laxmikanth says all 93 seats stayed unfilled. Use "The princely states stayed away".
- 021: the item is a chronology question marked `direct`. The format is fine.
- 023: "Advisory Branch under Rau" is notes-only (A02-081), but it is correct in real history.
- Skipped fids carry the bare reason `verify-conflict` with no text. All seven are legitimate: A02-001 and A02-002 (the 1906 Swaraj and 1924 Swaraj Party claims contradict Laxmikanth), A02-008 (who rejected the Cripps proposals), A02-026 (207 versus 211 at the first meeting), A02-047 (the 75 per cent figure), A02-088 (draft article counts) and A02-118 (procedure established by law credited to Britain). Add a one-line reason for each.
- Direct items: the correct option ties for longest in 001 and 003 (concept 2.1) and 021, 023 and 025 (concept 2.2). In 021, 023 and 025 the options are numbers or names of equal length, so there is little tell, but 003 and 045 carry it.
- Near-copies of lk packs: 022 vs lk02-516 and lk02-508 (0.69 and 0.67; the same Bardoloi sub-committee question), 010 s1 (vs lk02-306) and 010 s4 (vs lk02-614), 012 s4 (vs lk02b-1017; the same false claim "same days"), 036 s3, 015 s3, 005, 013 s2. Re-angle 022 and 010 s1.

### aks02: statement-by-statement verification
Every other statement was re-derived from Laxmikanth ch02 and is correct as keyed. In particular:
- The committee chairmen all match Laxmikanth: Order of Business Committee chaired by Munshi, Finance and Staff by Prasad, Credentials by Alladi, Press Gallery by Usha Nath Sen, Supreme Court by Varadachari, Financial Provisions by Sarkar, Linguistic Provinces by Dar.
- The Vice-Presidents are not swapped (010): H.C. Mukherjee was elected first and Krishnamachari second.
- Only Articles 5-9, 60, 324, 366-367, 379-380, 388, 391-393 took effect on 26 November 1949. Article 370 did not, and 394A came in 1987 (047, 048).
- The Abolition of Privy Council Jurisdiction Act, 1949 was continued, not repealed (014, 049).
- Seventh Schedule, not Eighth, for the three lists (053).
- Sources of the Constitution (054, 055, 056, 060) match Laxmikanth.

## Inventory `verify` facts and their corrected forms
Tested in corrected form and checked: aks01 A01-044 (014), A01-056 (022, 028), A01-061 (027, 028), A01-066 (030), A01-082 (033), A01-085 (036), A01-100 (048), A01-105 (043, 050), A01-107 (050), A01-112 (052), A01-132 (056, see HIGH), A01-153 (075, see MEDIUM), A01-169 and A01-179 (064, 079, 091, 099), A01-182 (090, 098). aks02 A02-009 (015), A02-074/075/076/133 (032, 052), A02-104 (047, 048).

## Priority fixes before accepting
1. aks01 056 and 055 (HIGH), then 072, 075 and 011 (MEDIUM).
2. aks02 039 (HIGH), then 058, 016, 007 and 032.
3. Lengthen the distractors in the direct items of aks01 concepts 1.2 to 1.5.
4. Trim the repeated clusters listed above and re-run `check-civil-pack.py`, `aks-coverage.py` and `reshape-options.py`.
