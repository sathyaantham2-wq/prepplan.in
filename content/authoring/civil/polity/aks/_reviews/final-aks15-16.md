# Final verification: aks15 and aks16 (both complete)

Method: every question answered cold from the notes (ch15/ch16), the inventories and Laxmikanth text before reading the key; scripted checks (key = o[0], truth set implied by `e` matches `a`, 3 `w` lines each opening with the matching option, ids unique, match rows A-D / 1-4, `fi` exist in inventory, no "notes"/page marker in stems or options); dup-check.py; aks-coverage.py.

## aks15 State Legislature (80 questions)

Verdict: **PASS** (0 HIGH, 2 MEDIUM, 4 LOW)

Cold answers: 80 of 80 agree with the keys. Scripted checks: 0 problems (check-civil-pack.py also 0). `fi` all resolve (172 facts). Coverage: 172 facts, 172 covered, 0 skipped, 0 uncovered. Format mix 20 direct / 36 which / 12 howmany / 8 stmt12 / 4 match: heavy on multi-statement, in line with the 2020-26 trend.

Specially verified rewrites
- 072 stmt 3 (courts barred from inquiring): see MEDIUM M2.
- 063 (Appropriation Bill, Art 204, no amendment may vary amount or destination): correct; the other three options are each clearly false. Fine.
- 038 (sine die vs prorogation): Laxmikanth p.488-489 "a prorogation terminates a session"; Statement-II does explain Statement-I. Defensible; key stands.
- 033 (Art 356 dissolution wording): stem now says dissolution "should follow only after Parliament approves". Laxmikanth ch17 (Bommai propositions, line "The state legislative assembly should be dissolved only after the Parliament has approved the presidential proclamation. Until such approval is given, the president can only suspend") supports it. Statements 1 and 2 are false on plain text (Governor summons; six months). Key "3 and 4 only" is sound.
- 057 (language time limits, 15/25/40 years): matches Laxmikanth ch33 exactly (HP, Manipur, Meghalaya, Tripura 25; Arunachal, Goa, Mizoram 40). Key All four correct.
- 076 (Assembly vs Council): only statement 1 true; key Only one correct.

### HIGH
None.

### MEDIUM
- M1 aks15-002 / 007 / 018 (concept AKS-15.1): the single idea "Assembly special-majority resolution, then ordinary law of Parliament, not an Article 368 amendment" is tested in three items (002 whole sequence, 007 stmts 1 and 3, 018 both statements) plus 020 (Art 169 row). Exceeds the cap of 2 per idea per concept. Suggest recasting 018 on another Article 169 fact or dropping stmt 3 from 007.
- M2 aks15-072 stmt 3: stem says "According to Laxmikanth ... though review for illegality or mala fides remains possible". Laxmikanth ch33 only says "The courts are prohibited to inquire into the proceedings of a House or its Committees"; the illegality/mala fides rider comes from the notes only (and is correct in law, Raja Ram Pal, 2007). Misattribution of the second half. Drop "according to Laxmikanth" or drop the rider.

### LOW
- L1 scope_out in the pack still lists "Effect of a proclamation under Article 356 on dissolution of the Assembly ... left untested", but 033 stmt 4 now tests it; update the scope metadata.
- L2 aks15-065/073/079: freedom-of-speech immunity appears in 065 (distractor), 073 stmt 1 and 079; borderline on the cap, acceptable.
- L3 aks15-026 stmt 1 and 036 rely on footnote 5 / list in Laxmikanth; fine, but 026 stmt 1 ("including where the office is that of a Minister") is phrased so that the true half of the sentence is the opening and the false clause is the tail; fair, only noting.
- L4 aks15-018 distractor lines (w) are generic ("separate fact about the later parliamentary step") and repeat across three options; cosmetic.

dup-check.py: only generic hits (match stems, "first meeting", "one-third retire every second year" echoes of lk23); no near-duplicate of a tagged PYQ. 

## aks16 Indian Judicial System (140 questions)

Verdict: **PASS** (0 HIGH, 4 MEDIUM, 5 LOW)

Cold answers: 140 of 140 agree with the keys (answered from the Laxmikanth ch26/ch34/ch28/ch29/ch38 text and law before the key was shown, options in a seeded shuffle). Scripted checks: key = o[0], 4 distinct options, 3 `w` lines each, ids unique, truth set implied by `e` matches the key for every which/howmany item, every match item has List-I A-D and List-II 1-4, match `w` lines describe exactly the swap in the matching wrong option, no "notes"/page marker in any stem or option, every `fi` resolves in ch16a/ch16b (one empty, see M4). check-civil-pack.py: 0 problems. Coverage: 288 facts, 276 covered, 12 skipped, 0 uncovered; all 12 skip reasons are legitimate (A16-091/092/519/520/521/592 verify-conflict against Laxmikanth or law, A16-606/608 time-bound, A16-013/031/581/586 untestable). Format mix 35 direct / 63 which / 21 howmany / 14 stmt12 / 7 match = 25/45/15/10/5 per cent, consistent with the 2020-26 column (direct 26, which 48, how many 12, Statement-I/II 6). Key is the longest option in only 1 of 35 direct items and in the top two in 17 of 35: no length tell. dup-check.py: 35 hits, all generic stem echoes or same-fact echoes of lk26/lk34/lk38 or aks packs; no tagged-PYQ near-duplicate.

Specially verified rewrites
- 110 (First Judges Case): 1, 3, 4 correct, 2 false (consultation is not concurrence). Key d correct.
- 114 (all four true): sound (S.P. Gupta executive dominance, 2015 restoration, 124(2) purpose).
- 610 (PIL): "according to Laxmikanth early 1980s, Iyer and Bhagwati" matches ch29 p.446; USA origin makes 2 false. Key d correct.
- 708, 710, 711: correct and unambiguous.
- 714 (BNS) and 510 (CrPC/BNSS) and 413 (CrPC 1973, since replaced by BNSS): the parentheticals are accurate and the Contempt of Courts Act s.10 proviso is stated correctly (Laxmikanth ch34 p.516). Fine.
- 419 (Art 223 acting Chief Justice vs Art 224(2) acting judge): both statements true and independent; key "does not explain" is sound.
- Art 356 / ch15 items are in the aks15 section above.

### HIGH
None.

### MEDIUM
- M1 Repetition above the cap of 2 per idea in AKS-16.1 (Judges Cases). "Sole opinion of the CJI is not consultation / collegium of CJI plus four" is tested in 103, 112 (stmts 2, 3, 4), 115 (stmt 3), 116 (stmt 4); "S.P. Gupta: consultation is not concurrence, CJI opinion not binding" in 110 (stmt 2), 114 (stmt 2), 116 (stmts 1, 3), 119 (II), 115 (stmt 1). Suggest recasting one of 116/119/115 on a different fact (for example the 1994 or 1977 transfer rulings, or the NJAC vote rule).
- M2 Repetition in AKS-16.2: Article 130 seat/President's approval appears in 202, 213 (stmts 1 and 4) and 220 (row D); the ad hoc judge "attend in priority" rule appears in 203 (explanation), 213 (stmt 3) and 216 (stmt 4); the 100/50-member notice in 205 and 219. Recast 213 stmt 3/4 or 216 stmt 4 on another Article 127 fact.
- M3 aks16-507 stmt 3 ("the Supreme Court cannot refuse a Fundamental Rights petition under Article 32") is the widely repeated textbook line (inventory A16-535 notes "Laxmikanth silent") but in practice the Court does decline Article 32 petitions (for example where an equally efficacious High Court remedy exists). The key still stands because no option reads "1 only", yet the wording is overstated. Soften to "the remedy under Article 32 is itself a Fundamental Right, so the Court is bound to entertain a genuine petition".
- M4 aks16-417 has `fi: []` (no inventory fact linked). The HC pension from the Consolidated Fund of India, the retired-judge practice bar and the legislature-discussion bar are in Laxmikanth ch34 p.512; link the matching A16 facts (or the nearest, A16-506..510 / A16-153).

### LOW
- L1 aks16-320 relies on Laxmikanth Table 34.1 dating the Telangana High Court to 1954 (the footnote explains the Hyderabad court). The separate Telangana High Court took effect on 1 January 2019 after the Andhra Pradesh split; the stem hedges with "Using the table in Laxmikanth", and no option carries 2019, so the key is unique, but a well-informed candidate may hesitate. Acceptable.
- L2 aks16-513 stmt 1 ("cannot be questioned for correctness when produced before any court"): Laxmikanth ch34 p.516 says subordinate courts; the lk26 pack uses the same "any court" wording. Stays true in the evidentiary sense; prefer "before any subordinate court".
- L3 aks16-305 distractors a and d carry identical `w` text ("That is criminal contempt."); cosmetic. aks16-418/618 w lines are generic.
- L4 Cross-pack facts to fix in other packs, not in aks16: lk34 CS-POL-ch34-014 says the Supreme Court "upheld the 99th Amendment but struck down the NJAC Act" (Laxmikanth ch34 p.509 and ch26 p.415 say both were declared void; aks16-206 stmt 3 is right), and lk38 CS-POL-ch38-012 says the Supreme Court Legal Services Committee limit is Rs 3 lakh (Laxmikanth ch38 says Rs 5,00,000; aks16-617 stmt 4 is right).
- L5 Several comparison items in AKS-16.7 re-use earlier facts (retirement ages 65/62 in 702, 706; pension fund 712; Article 131 parties 707, 716) by design for a comparison concept; within that concept each idea is at most 2.

Checked and fine: Judges Cases chronology and collegium numbers (111 two senior-most in 1993, four in 1998), NJAC composition (201, 207), Article 124/217 qualifications (101, 108, 401, 407, 713), strength history 8/10/13/17/25/30/33 (106, 115), removal procedure (205, 209-211, 218, 219), Ramaswami (212), Articles 126/127/128/130 (202, 203, 213, 214, 216, 220), Article 131 exclusions (301, 306), Articles 32/136/139/141-144 (302, 303, 310, 319), review 30 days and curative (311), high-court table items (313-317), transfer, additional and acting judges (404, 405, 411, 412, 415, 416), Article 226/227/228/233-235 (501-520), Lok Adalat and Permanent Lok Adalat (603, 604, 614-617, 619, 717, 719), PIL cases (605, 610-612, 620), Section 66A struck down in 2015 (608), Vishaka codified in the 2013 Act (611).

## Summary
- aks15: PASS (0 HIGH, 2 MEDIUM, 4 LOW).
- aks16: PASS (0 HIGH, 4 MEDIUM, 5 LOW).
