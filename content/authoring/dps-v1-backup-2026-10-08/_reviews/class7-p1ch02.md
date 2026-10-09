# Review: DPS bank, Class 7 Maths Part I ch 2 "Arithmetic Expressions" (gegp102)

File: content/authoring/dps/class7/p1ch02.json. Read: all 150 questions (7 concepts, 21-22 each). Every number
recomputed in Python (all case-study parts, all short/long answers, all MCQ keys); statements, assertion-reason and
match items judged part by part. Compared with the textbook pages and the DPS worksheet
class_7_ch2_Arithmetic_expressions_WS and PT-1/PT-2 revision sets.

Result: 0 wrong keys, 0 arithmetic errors, 0 scope_out violations of substance. Level mix chapter-wide: Remember+Understand
42/150 (28%, limit 60%); Analyse/Evaluate/Create 51/150 (34%, minimum 15%). Per-concept item-type minimums met;
4 match items for 7 concepts (OK). Step marks all sum to `m` and name real points. Defects are medium/low.

## HIGH
None.

## MEDIUM

1. C7M-2.3 #22 (case study, quiz scores): stem says "a team scores +15 or +20 for a right answer", but the Eagles'
   rounds include +10 (and the key uses it). The data contradicts its own rule. Fix: "+10, +15 or +20 for a right answer".

2. C7M-2.7 #7 (assertion-reason, snail): A = "reaches the top of a 10 cm post in 10 days"; keyed "A false". The snail
   actually reaches the top on day 8 (checked in code), so "in 10 days" is arguably true as "within 10 days" and a student
   can defend "A true, R true, explains". Fix: "takes exactly 10 days to reach the top" (or "after 10 nights").

3. Templating (Anti-template rule 1). All seven concepts use the same slot skeleton in the same order: 4-6 MCQ, one MS,
   one AR, (match), six 2-mark (a)/(b), then claim_check ("X says ... Is she right?"), show_impossible ("Show that ... cannot
   be equal/the value"), reverse ("Write a story for ..."), two 5-mark, two case studies (positions 20-22). The three
   3-mark items are the same move in each concept (a named child makes a wrong claim; show two values differ; write a shop
   story). Fix: in at least 3 concepts replace one of these with a different shape (e.g. a reverse that asks for TWO
   different stories, a "which of these three methods is quickest and why" comparison, an error-find on a worked line).

4. Repeated misconception inside one concept (rule 5: "same question four times"). C7M-2.3: #2 (9-5 vs -5+9), #7 S3
   (25-9 as 9-25), #8 (7-12 = 12-7), #16 (Tara 8-3 = 3-8) all test "you cannot swap a subtracted term". Also 3 drone items
   (#6, #14, #21). C7M-2.1: eight of 22 items are "compare by looking at how each number changed" (#3, #5, #11, #13,
   #16, #17, #19, #21, #22), and the three case studies (#19, #21, #22) are one story shape. Fix: keep one MCQ, one claim,
   one case study per move and swap the rest for other 2.1 ideas (different expressions sharing a value, modelling).

5. Close to DPS worksheet / book items (originality, §5):
   - C7M-2.1 #15 ascending-order of five expressions with the same operation mix as DPS IV.2 (73-18, 63-20, 35+15, 2x21, 180/6).
   - C7M-2.3 #12 "forgot an entry in a long sum, must she start again" = DPS IV.5 (Reena, 1255); 2.3 #14 drone up/down = DPS IV.6(b).
   - C7M-2.4 #3 uses the identical expression 5 x (3+2) + 7 x 8 + 3 from DPS fill-blank II.1.
   - C7M-2.5 #16 uses 28 + (35 - 10), identical to DPS II.9. C7M-2.2 #7 S1 uses 28 - 7 + 8, identical to DPS II.2.
   - C7M-2.2 #18 is textbook Example 10 (pay Rs 432 with notes) with 376; C7M-2.1 #20 re-uses the book's own (3+3)/3 = 2 and
     3x3+3 = 12 for parts (a).
   Fix: change the expressions/numbers/setting so none matches a DPS item (e.g. 6 x (4+3) + 9 x 5 + 2; 31 + (47 - 12)).

6. Free or trivial case-study parts (rule: every part needs the chapter, last part a real decision). C7M-2.5 #22(c) net cost
   Rs 95 is stated in the stem (refund is "780 - 95"); also the wording "refunds Rs 780 - Rs 95" is clumsy and "three days'
   notice" is unused. C7M-2.6 #21(a) 100 x 120 is a bare multiplication. C7M-2.2 #20(c) 120 - 110 follows the stem. C7M-2.1 #19-#22
   part (c) "find both totals to check" repeats part (b) with no climb. Fix: replace (c) by a question that uses (b)'s
   result (e.g. "by how much would one price have to change for the order to flip?").

7. Strawman claims/decisions (Anti-template rule 4). C7M-2.4 #15 (Kabir: brackets "must" change the value; his own
   example 24+6x3 shows otherwise), C7M-2.1 #16 (Asha: "I have to add both first"), C7M-2.5 #21 (Clerk 2 plainly dropped a
   sign; decision (d) has no trade-off), C7M-2.3 #21(d) (answer is forced by 38 > 30). The best decisions are 2.6 #20, 2.7
   #20/#21 (real trade-offs). Fix: give the claimant a half-correct reason (e.g. true for + but not for -).

8. Assertion-reason R is trivia or restatement (§11). C7M-2.6 #8 R = "6 x 10 is 60 and 6 x 5 is 30" is arithmetic, not a
   fact about the property; C7M-2.4 #8 R just restates the bracket-removal of A. Fix: for 2.6 use R = "multiplying a sum by a
   number multiplies each part of the sum by it"; for 2.4 use R = "a bracket after a minus sign changes the sign of every term
   inside" (true, and relevant).

## LOW

9. C7M-2.5 #20 and C7M-2.2 #19 are 5-mark drills (five/three similar expressions to remove brackets/list terms and evaluate).
   Recall in disguise; DPS 5-mark items chain steps in a story. Make 2.5 #20 parts (a)-(d) the four bracket patterns on a
   story, or cut to 3 marks.
10. C7M-2.4 #21 "supplies for a month" but vegetables are bought "for 6 days" - say "for a week", or 30 days with a different rate.
11. C7M-2.3 #3 `-7 + (10 + (-11))` and #9 item 2 `(5 + (-9)) + 12` have a bracket inside a bracket; scope_out says
    "nested brackets more than one level". The inner (-11) is a sign bracket, as in the book's own associativity notation,
    so this is defensible; if you want it clean write -7 + (10 - 11).
12. C7M-2.1 #20 note "expression for 2 needed a bracket": 3 - 3 / 3 = 2 needs none. The key is only true for the key's
    expressions; the step should say "names which of YOUR expressions have brackets".
13. Correct option is the (strictly) longest in C7M-2.3 #4, 2.5 #4, 2.6 #1, 2.6 #4, 2.7 #3 (by 2-14 characters). Not systematic,
    but lengthen a distractor in each.
14. Reversal markers: statements using "never"/"always" in C7M-2.3 #7 (S1) and 2.7 #6 (S3) are not marked `rev`. If the
    tracker treats absolute words in statements as reading-discipline items, add `"rev": true`.
15. Near-overlap across concepts: C7M-2.6 #14 (49 x 50 = (50-1) x 50) and C7M-2.7 #15 (same product, claim-check); 2.5 #13
    (subtract 98) and 2.7 #13 (add 98). Fine as a pair but use a different product in one.
16. C7M-2.2 #5-#6 and 2.4 #5 are good scenario MCQs; no change.

## Per-concept verdicts
- C7M-2.1 (22): keys correct; too many "compare by changes" items and three same-shape case studies; fix 2, 4, 6, 7.
- C7M-2.2 (21): keys correct, good terms/inverse coverage; 2.2 #18 is the book's Example 10; #19 is a drill; #21 is a good case.
- C7M-2.3 (22): keys correct; stem inconsistency in #22; the "no swapping in subtraction" idea is repeated four times.
- C7M-2.4 (21): keys correct; #3 reuses a DPS expression; #8 R weak; #20/#21 are decent multi-step cases.
- C7M-2.5 (22): keys correct; sound; #20 drill; #21 and #22(c) too easy; #16 reuses a DPS expression.
- C7M-2.6 (21): keys correct; best concept (genuine trade-off in #20); #8 R is trivia.
- C7M-2.7 (21): keys correct; #7 ambiguity in A; #20 and #21 are the best case studies in the chapter.

## Overall
Content is accurate and in scope; the arithmetic is clean throughout. It reaches the DPS standard on the case studies and
2-part items, but not yet on variety: the repeated slot skeleton and the repeated "compare by changes / no swapping" moves
make it partly templated. Fix findings 1-2 before loading; 3-8 are rewrite-quality improvements.
