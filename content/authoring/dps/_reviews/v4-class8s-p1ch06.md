# Review v4: SST8 Part I ch6 (hees106), content/authoring/dps/class8s/p1ch06.json

Spot-check after the second fix pass. Diffed by index against scratchpad/fix-class8s-p1ch06/orig-v3.json: 58 items
changed (not about 70). All 58 read in full against pages 001-024. Indices are concept.question, 0-based, concept 0 =
C8S-6.1 ... 8 = C8S-6.9 (so "5.7" = C8S-6.6, question 7). Automated checks over all 186: `a` equals `o[0]` everywhere, no
wrong option equals the key, no duplicate options, step marks sum to `m` everywhere, no option named by position.
Type mix: 74 short_answer, 47 mcq, 37 long_answer, 9 multi_statement, 9 assertion_reason, 5 match, 5 fill_blank.

## v3 status

| v3 finding | Now |
|---|---|
| HIGH 6.5[4] Ayush extract (second answer "Ministry of Ayush") | FIXED. Stem now says the chapter attributes the extract to meetings between the Standing Committee on Health and Family Welfare and the officers of the Ministry of Health and Family Welfare (true: the p.150 Let's Explore text says exactly this). Only the Recommendation and Action Taken text is quoted, and the quotes match p.150. (a) Standing Committee definition (p.147 glossary), (b) "accountable" (p.148), (c) answer from Action Taken (No), (d) federalism (p.143), (e) verdict. Each of (a)-(d) has one answer and needs a chapter definition. (e) is borderline, see MEDIUM 4. |
| Fig. 6.8 dependence | Stated as an assumption in 3.8, 3.12, 3.14, 3.19, 3.20 ("Assume, for this question, that ..."). Answers follow from it with one answer each. 3.14 now accepts any consistent grouping. No other item silently depends on the figure order: I grepped every item for flowchart, step, stage, other House, gazette; 3.0, 3.2(d), 3.3, 3.4, 3.5(c), 3.13, 3.17 use only facts the pages give (note, glossary, "either House", "process repeated in other House"). See MEDIUM 2 for the cost of the assumption. |
| fill_blank 1952 (0.15) | OK. p.141 "since the first one in 1952"; the stem no longer contains it; one natural answer. |
| fill_blank 1956 (5.15) | OK. p.152 "In 1956, Railway Minister Lal Bahadur Shastri resigned"; stem does not name Shastri or give the year; one natural answer. |
| 6.4[16]-ish multi_statement (3.16) and 6.5[18]-ish (4.18) | Keys correct. 3.16: I false (p.147 "MPs may change"), II true (Bill glossary), III true (p.146 "generally brought into force through an act"); key "II and III only" right. 4.18: I false (Parliament approves, p.151), II true (p.148 "may include"), III true (p.151); key "II and III only" right. |
| true/false | The five "True or False?" short_answer items are unchanged: 2 True (4.8, 6.19), 3 False. OK. |
| MEDIUM 6.1[8] Country Y contradiction | Only partly fixed, see MEDIUM 3. |

Recomputed and correct: 30% of 2,40,000 = 72,000 units x Rs 8 = Rs 5,76,000; Design A 5,76,000 x 40 - 12,00,000 =
Rs 2,18,40,000; Design B 2,88,000 x 40 - 5,00,000 = Rs 1,10,20,000; difference Rs 1,08,20,000; 12 + 6 = 18 languages,
18 x 4 = Rs 72 lakh; Plan P 20+12+9 = 41, Plan Q 12+4+2 = 18, difference 23; 12 bills x 3 h x 2 chambers = 72 h,
one chamber 36 h, so 36 saved; 2,000/18,000 = 11.1%; 12,000+18,000+20,000 = 50,000; 15/10/8/7 of 40 = 37.5/25/20/17.5%;
25% of 50 = 12.5 so 13, minus 7 = 6; 4/11 = 36.4%; the 20-minister item (all 20 affected, collective responsibility).
No arithmetic error.

## HIGH (1)

1. **C8S-6.6 [7]** (create, 3 marks): "Write a three-sentence illustrative story of a school-building scheme in which both
   rows operate, in the order the rows imply." Third mark "Orders the two correctly"; key story: Legislature sanctioned,
   "The Executive then prepared the budget as approved by Parliament", implemented. The table gives no order. The row
   says the Executive "prepares and implements the budget approved by Parliament" and the Legislature "sanctions all
   government-related expenses". The real sequence a student can defend is Executive prepares, Legislature sanctions,
   Executive implements; the key's "sanction, then prepare the budget as approved" is incoherent (prepared as already
   approved), and a student with the real-world order loses a mark. This is a second defensible answer on a mark point.
   (The v3 version of the stem supplied the order in its outcome sentence; the rewrite dropped it.) Smallest fix: restore
   the order in the stem ("in which the Executive spends only after the Legislature has sanctioned the money") or change
   the third mark to "Shows the Executive acting on money the Legislature has approved", and fix sample sentence 2 to
   "The Executive then prepared and implemented the scheme within the approved budget".

## MEDIUM

1. **3.14** (5 marks): mark 2 is "Covers all nine steps ... noting the committee step is not for every bill". The question
   never asks for that note, so a student who groups all nine correctly loses the mark. Drop "noting ..." from the mark or
   add "and say which step not every bill reaches" to the question. Mark 3 ("keeps the steps in the assumed order") only
   checks the stem.
2. **3.8, 3.12, 3.19, 3.20** (flowchart items with the assumed order pasted into the stem): the order is given, so each
   is answered by reading the stem; no chapter knowledge beyond it is needed. 3.20 is two reads of the stem (assent,
   gazette). The stated-assumption design is right (the printed figure is not recoverable from the extract), but keep
   at most two such items and make them need the chapter too, for example 3.20 could add the glossary meaning of
   Gazette, 3.12 could add which step the chapter says may be skipped. The same 40-word assumption paragraph is pasted
   five times (LOW repetition). "According to the chapter's flowchart" (3.20) and "going by the flowchart" (3.8)
   present the author's order as the book's; say "on this order".
3. **0.8** Country Y: "all adults vote for a House directly ... but only men over 18 may vote" is still
   self-contradictory (all adults vote / only men vote). Say "men over 18 vote for a House directly" without "all adults".
4. **4.4 (e)**: "Is the reply an example of the Executive being accountable? Give your verdict" keys Yes only. A student can
   defend No (the Ministry did not carry out the recommendation, it passed it to the States). Yes follows only from
   the chapter's meaning of accountable (justify actions and decisions), which (b) established. Add "by the chapter's
   meaning of 'accountable'" to (e).
5. **Still one-line or stem-read, labelled Apply/Analyse (bank allows no easy items):** 0.9 (two plain facts: old/new
   building names), 0.15 (1952), 0.18 (five one-line facts, only (e) is a thought), 3.20, 5.0 (President; Lok Sabha),
   5.15 (1956), 5.19 (President's duties; adviser), 7.14 (5 years, 5 years: a table cell read twice), 8.6 (digital spaces;
   representatives). Smallest fix for each: add a "why" or a condition, or merge into a neighbouring item and cut.
6. **2.8 (d)** (last part of a 4-mark case): "Which two values would then share one law, and does the chapter list them
   as separate values?" The two values are the answers to (b) and (c), and the stem says the chapter has four core
   values; it is not a decision. Replace with a real test (for example a Law E that serves two values at once and
   which one it chiefly serves, with a reason).
7. **0.7** option tell: three of four options end "..., which a land rule does not touch"; the one without that clause
   is the key. Remove the clause from the three distractors (they stay wrong without it, since each states a right the
   land rule does not curb).
8. **Near-strawman final decisions** (the answer is clear from the stem's own numbers or aim): 0.17(d) (A both saves more
   a year and nets more, so there is no trade-off), 1.7(d) (P reaches 41 against 18 for the same cost), 1.4(d) (aim
   stated in the stem is "model faithfully"), 4.15(d) (Education fails both expectations). Acceptable as is for marks,
   but give one of them (suggest 0.17) a real conflict, such as a Design B that saves 60% of A at 20% of the cost.
9. **Repetition:** "Council of Ministers aids and advises the President" in 5.0(a), 5.1, 5.19(b); the Naidu productivity
   quote and "65 per cent is a period figure, not each session" in 8.8 and 8.13(d); 1.4 and 1.7 and 0.17 and 4.15 and 7.7
   are the same shape (arithmetic then a chapter-light decision).

## LOW
- Multi_statement key spread: "II and III only" 3 of 9 (0.0, 3.16, 4.18), each with statement I false. Move the false
  statement in one of them to II or III.
- 0.6 option 3 ("The count of Lok Sabhas should start from the 18th") is a nonsense distractor. The book itself says "17
  Lok Sabhas since the first one in 1952", which the stem's "18 ... since 1952" slightly overlaps; harmless, but
  a student could answer "17 not 18"; no such option exists, so the key stands.
- 1.17, 4.17, 8.5, 8.11: wrong options plainly absurd ("no presiding officer of any kind at all", "Both are performing
  lawmaking"). Evaluate/Analyse labels are generous for these.
- 6.8 is tagged `scenario` but has no scenario. 
- 5.16 (a): "Which details contradict" keys two; the student's third sentence ("every minister must resign") also
  contradicts the chapter's wording (part (d) handles it). Say "factual details".
- 4.3 Zoya: "may include MPs from different parties" (p.148) supports "not only the ruling party" only softly; the key words it
  carefully ("is not what it says"), fine.
- 3.2 is a fact-check of a timeline, not a decision (label Evaluate); acceptable.
- MCQ correct option strictly longest: 5 of 47 (about 11%), not a tell. Open-ended items (5.3 a/b, 1.10 mark 3, 0.19) list
  one sample; rubric lines already say "any".

## Verdict per area
- C8S-6.1: pass after fixes (MEDIUM 3, 5, 7, 8).
- C8S-6.2: pass (MEDIUM 8, 9; LOW).
- C8S-6.3: pass after fix (MEDIUM 6).
- C8S-6.4: pass after fixes (MEDIUM 1, 2). Fig. 6.8 handled correctly as an assumption.
- C8S-6.5: pass after fix (MEDIUM 4). Ayush item facts and quotes verified; v3 HIGH closed.
- C8S-6.6: HIGH 1 must be fixed (item [7]); MEDIUM 5, 9.
- C8S-6.7: pass.
- C8S-6.8: pass (MEDIUM 5 for 7.14).
- C8S-6.9: pass (MEDIUM 5, 9).

## Counts
Changed items read: 58 of 186. HIGH 1, MEDIUM 9 groups, LOW 8. Template: not templated beyond the LOW notes (ms key spread,
repeated assumption paragraph, case-study shape).

## Verdict: NOT load-ready. One HIGH (6.6 item [7], the ordering mark has two defensible answers); fix it plus MEDIUM 1, 3, 4
(one-line edits) and the pack is load-ready without another full pass. The other MEDIUMs are quality items and can ship.
