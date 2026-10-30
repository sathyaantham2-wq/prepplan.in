# Round 2: class7-topup/p2ch03-gap.json (Class 7 Maths Part II ch 3)

Diffed against `_reviews/v1/p2ch03-gap.json`: 12 items replaced or changed (3.1 x1, 3.2 x1, 3.3 x1, 3.4 x2, 3.5 x1, 3.6 x3, 3.7 x3); the other 33 are byte-identical to v1 (already checked in round 1). Every new item recomputed in python/by hand. Loader `--check`: valid (7 concepts, 45 questions). No answer is named by position. All marking steps sum to marks.

## Earlier findings: resolved?
- 3.4 Q26 (630 vs 12 and 105): replaced by Leela (84, 105, 2940 = 84 x 35 = 105 x 28, LCM 420, ratio 7). Resolved, new idea.
- 3.1 Q6 / 3.3 Q19 (show impossible): Q19 turned into Sunil claim-check (588, 840, HCF 84, verdict right; 8 ruled out, 588/8 = 73.5). Q6 (Meena) kept, as the fix allowed. Resolved.
- 3.4 Q27 and 3.7 Q45 (timetable / lamps): now wheels 24, 40, 45 cm (LCM 360, turns 15, 9, 8, 10 times in 36 m, 720 and 5 after the swap to 48) and the 72 m x 120 m fair ground (HCF 24 -> 15 plots, flags LCM 48, boundary 384 = 8 points, 12 m -> 60 plots). Resolved, all keys correct.
- 3.7 Q41 (carton): replaced by Ravi/Sita strides, mcq, LCM 300, 4 meetings in 12 m (distractors 5, 80, 36 each a real slip). Resolved.
- 3.1 Q5 (jump game 63/105/84): replaced by the tank/bucket item (60 and 84: common factors 1, 2, 3, 4, 6, 12; 12 fills; bucket at most 10 gives 6 -> 24 fills). Correct.
- 3.5 Q31: replaced by Vani (8 and 15, 9 and 16, 9 and 15 HCF 3, LCM 45). Correct, claim true / friend false.
- 3.6 Q38 (10 then 9): replaced by three divisor orders for 252 and 396 (63,99 -> 7,11; 42,66 -> 7,11; HCF 36, LCM 2772). Correct.
- 3.6 Q39: rewritten; (a) 18/108/1944, 1/1680/1680, 20/200/4000; (c) HCF 6; (d) (6,504) (18,168) (24,126) (42,72); (e) 24 and 126, 42 and 72. All correct, no repeated "multiply LCM by" part.
- 3.7 Q42: replaced by the beads true/false (multiples of 12: 12, 24, 36, 48 leave 2, 4, 1, 3 mod 5; True). Correct.
- 3.2 Q8: replaced by Nisha/Arjun error-find mcq (1050 = 2 x 3 x 5 x 5 x 7; Arjun stops at quotient 5). One correct option. Correct.
- 3.6 Q37 LOW (division-table acceptance): added to the step. Resolved.

## New findings
| item | sev | problem | fix |
|---|---|---|---|
| 3.1 tank/bucket (c) | LOW | "largest factor within a limit" twist repeats the existing Jaipur table item (252 guests, 6 to 20 per table). One part of three. | Optional: drop the limit part or change the setting. |
| 3.4 Leela and Farida | LOW | Two claim-checks in one concept both start from 84 = 2 x 2 x 3 x 7. | Optional: change Leela to a pair not using 84. |
| 3.7 beads true/false | LOW | Remainder-with-LCM idea still echoes the existing mangoes/chairs and the book's exercise; the statement is true so there is no misconception to expose beyond "check by trying". | Optional: make the stated number false (e.g. 36) so the learner corrects it. |
| 3.6 divisor orders | LOW | Same family as existing Imran (24 then 3) but compares three orders and asks why; accept. | None. |

## Counts read
45 items; types mcq 10, short_answer 24, long_answer 7, multi_statement 2, match 2. Claim-check verdicts: right (Sunil), wrong (Leela, Pinky, Farida-type), partly right (Kunal, Vani), coach right: varied. multi_statement keys "1 and 3 only", "2 only" (unchanged). Slot order still the same in each concept (LOW, unchanged).

No new item repeats `class7/p2ch03.json` or `p2ch03-la4.json` (checked by keyword: no wheel, stride, flag, plot/fair-ground, 588/840, 252/396 or 1050 item there; Neha 420/630 and Diwali lamps no longer echoed).

HIGH 0 / MEDIUM 0 / LOW 4
VERDICT: PASS
